import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

const eventSchema = z.object({
  eventId: z.string().min(1),
  provider: z.string().min(1),
  fineId: z.number(),
  amount: z.number().nonnegative(),
  status: z.enum(["succeeded", "failed"]),
  providerRef: z.string().min(1),
});

function signPayload(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-payment-signature");
  const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret is not configured." }, { status: 500 });
  }

  if (!signature) {
    return NextResponse.json({ error: "Missing webhook signature." }, { status: 401 });
  }

  const expectedSignature = signPayload(rawBody, webhookSecret);
  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  const parsed = eventSchema.safeParse(JSON.parse(rawBody));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid event" }, { status: 400 });
  }

  const { eventId, provider, fineId, amount, status, providerRef } = parsed.data;
  const supabase = createSupabaseAdminClient();

  const { data: existingEvent, error: existingEventError } = await supabase
    .from("audit_logs")
    .select("id")
    .eq("action", "PAYMENT_WEBHOOK_PROCESSED")
    .eq("action_type", eventId)
    .maybeSingle();

  if (existingEventError) {
    return NextResponse.json({ error: existingEventError.message }, { status: 500 });
  }

  if (existingEvent) {
    return NextResponse.json({ ok: true, idempotent: true });
  }

  const { data: fine, error: fineError } = await supabase
    .from("fines")
    .select("id, user_id, amount, status")
    .eq("id", fineId)
    .maybeSingle();

  if (fineError || !fine) {
    return NextResponse.json({ error: fineError?.message ?? "Fine not found" }, { status: 404 });
  }

  const nextFineStatus = status === "succeeded" ? "Paid" : "Unpaid";
  const updateNeeded = fine.status !== nextFineStatus;

  if (updateNeeded) {
    const { error: updateError } = await supabase
      .from("fines")
      .update({ status: nextFineStatus })
      .eq("id", fineId)
      .eq("user_id", fine.user_id);

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  const eventDetails = {
    eventId,
    provider,
    providerRef,
    fineId,
    amount,
    fineAmount: fine.amount,
    status,
    appliedStatus: nextFineStatus,
  };

  const { error: processedAuditError } = await supabase.from("audit_logs").insert({
    actor: "payment-webhook",
    action: "PAYMENT_WEBHOOK_PROCESSED",
    action_type: eventId,
    details: JSON.stringify(eventDetails),
    admin_id: fine.user_id,
  });

  if (processedAuditError) {
    return NextResponse.json({ error: processedAuditError.message }, { status: 400 });
  }

  const { error: paymentAuditError } = await supabase.from("audit_logs").insert({
    actor: "payment-webhook",
    action: "PAYMENT_EVENT",
    action_type: status,
    details: JSON.stringify(eventDetails),
    admin_id: fine.user_id,
  });

  if (paymentAuditError) {
    return NextResponse.json({ error: paymentAuditError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
