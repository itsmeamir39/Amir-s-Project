import { NextResponse } from "next/server";
import { z } from "zod";

import { requireRole } from "@/lib/server-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const reserveSchema = z.object({
  biblioId: z.coerce.number().int().positive(),
});

const cancelSchema = z.object({
  holdId: z.coerce.number().int().positive(),
});

export async function POST(request: Request) {
  const auth = await requireRole(["Patron", "Admin"]);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  const parsed = reserveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const userId = auth.user.id;

  const { data: fines, error: finesError } = await auth.supabase
    .from("fines")
    .select("amount")
    .eq("user_id", userId)
    .eq("status", "Unpaid");
  if (finesError) return NextResponse.json({ error: finesError.message }, { status: 400 });

  const unpaidTotal = (fines ?? []).reduce((sum, row) => sum + (row.amount ?? 0), 0);
  const fineThreshold = 10;
  if (unpaidTotal > fineThreshold) {
    return NextResponse.json(
      {
        error: `Your account is locked due to unpaid fines over $${fineThreshold}. Current balance: $${unpaidTotal.toFixed(2)}`,
      },
      { status: 400 }
    );
  }

  const { data: userRecord, error: userError } = await auth.supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  if (userError) return NextResponse.json({ error: userError.message }, { status: 400 });

  const role = userRecord?.role ?? "Patron";

  const { data: rule, error: ruleError } = await auth.supabase
    .from("circulation_rules")
    .select("borrow_limit")
    .eq("role", role)
    .maybeSingle();
  if (ruleError) return NextResponse.json({ error: ruleError.message }, { status: 400 });

  const borrowLimit = rule?.borrow_limit ?? 5;

  const { data: holds, error: holdsError } = await auth.supabase
    .from("holds")
    .select("id", { count: "exact" })
    .eq("user_id", userId)
    .eq("status", "pending");
  if (holdsError) return NextResponse.json({ error: holdsError.message }, { status: 400 });

  const reservationCount = holds?.length ?? 0;
  if (reservationCount >= borrowLimit) {
    return NextResponse.json(
      {
        error: `You have reached your reservation limit (${borrowLimit}). Current reservations: ${reservationCount}`,
      },
      { status: 400 }
    );
  }

  const { error: insertError } = await auth.supabase.from("holds").insert({
    user_id: userId,
    biblio_id: parsed.data.biblioId,
    status: "pending",
  });

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const auth = await requireRole(["Patron", "Admin"]);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  const parsed = cancelSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const { error } = await auth.supabase
    .from("holds")
    .update({ status: "cancelled" })
    .eq("id", parsed.data.holdId)
    .eq("user_id", auth.user.id)
    .eq("status", "pending");

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
