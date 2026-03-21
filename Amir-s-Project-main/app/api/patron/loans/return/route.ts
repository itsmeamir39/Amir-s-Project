import { NextResponse } from "next/server";
import { z } from "zod";

import { requireRole } from "@/lib/server-auth";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const returnSchema = z.object({
  loanId: z.coerce.number().int().positive(),
});

export async function POST(request: Request) {
  const auth = await requireRole(["Patron", "Admin", "Librarian"]);
  if (!auth.ok) return auth.response;
  const admin = createSupabaseAdminClient();

  const body = await request.json().catch(() => null);
  const parsed = returnSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const { data: loan, error: loanError } = await admin
    .from("loans")
    .select("id, user_id")
    .eq("id", parsed.data.loanId)
    .maybeSingle();

  if (loanError || !loan) {
    return NextResponse.json({ error: loanError?.message ?? "Loan not found." }, { status: 404 });
  }

  if (auth.role === "Patron" && loan.user_id !== auth.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error: updateError } = await admin
    .from("loans")
    .update({ status: "Returned" })
    .eq("id", loan.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
