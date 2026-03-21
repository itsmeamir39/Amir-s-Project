import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/server-auth";

const eventSchema = z.object({
  fineId: z.number(),
  status: z.enum(["succeeded", "failed"]),
  providerRef: z.string().min(1),
});

export async function POST(request: Request) {
  const auth = await requireRole(["Admin", "Patron"]);
  if (!auth.ok) return auth.response;

  const parsed = eventSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid event" }, { status: 400 });
  }

  const { fineId, status, providerRef } = parsed.data;

  let query = auth.supabase
    .from("fines")
    .update({ status: status === "succeeded" ? "Paid" : "Unpaid" })
    .eq("id", fineId);

  if (auth.role === "Patron") {
    query = query.eq("user_id", auth.user.id);
  }

  const { error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await auth.supabase.from("audit_logs").insert({
    actor: "payment-webhook",
    action: "PAYMENT_EVENT",
    details: JSON.stringify({ fineId, status, providerRef }),
  });

  return NextResponse.json({ ok: true });
}
