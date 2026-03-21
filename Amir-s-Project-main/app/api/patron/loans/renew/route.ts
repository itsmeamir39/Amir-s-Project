import { NextResponse } from "next/server";
import { z } from "zod";

import { requireRole } from "@/lib/server-auth";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { calculateNewDueDate, getCirculationRulesByRole, validateRenewalAllowed } from "@/services/circulationRules";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const renewSchema = z.object({
  loanId: z.coerce.number().int().positive(),
});

export async function POST(request: Request) {
  const auth = await requireRole(["Patron", "Admin", "Librarian"]);
  if (!auth.ok) return auth.response;
  const admin = createSupabaseAdminClient();

  const body = await request.json().catch(() => null);
  const parsed = renewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const { data: loan, error: loanError } = await admin
    .from("loans")
    .select("id, user_id, due_date, renewals_used, status")
    .eq("id", parsed.data.loanId)
    .maybeSingle();

  if (loanError || !loan) {
    return NextResponse.json({ error: loanError?.message ?? "Loan not found." }, { status: 404 });
  }

  if (auth.role === "Patron" && loan.user_id !== auth.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (loan.status !== "CheckedOut") {
    return NextResponse.json({ error: "Only checked out loans can be renewed." }, { status: 400 });
  }

  const isAllowed = await validateRenewalAllowed(admin as any, loan.user_id, loan.renewals_used ?? 0);
  if (!isAllowed) {
    return NextResponse.json({ error: "Renewal limit reached for this account." }, { status: 400 });
  }

  const { data: userRoleRecord, error: userRoleError } = await admin
    .from("users")
    .select("role")
    .eq("id", loan.user_id)
    .maybeSingle();
  if (userRoleError) return NextResponse.json({ error: userRoleError.message }, { status: 400 });

  const role = userRoleRecord?.role ?? "Patron";
  const rule = await getCirculationRulesByRole(admin as any, role);

  const newDueDate = calculateNewDueDate(new Date(loan.due_date), rule.loan_period_days);

  const { error: updateError } = await admin
    .from("loans")
    .update({
      due_date: newDueDate,
      renewals_used: (loan.renewals_used ?? 0) + 1,
    })
    .eq("id", loan.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, due_date: newDueDate });
}
