import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireRole } from "@/lib/server-auth";

const checkoutSchema = z.object({
  fineId: z.number().int().positive(),
});

function signPayload(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export async function POST(request: Request) {
  const auth = await requireRole(["Admin", "Patron"]);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const fineId = parsed.data.fineId;
  const fineQuery = auth.supabase
    .from("fines")
    .select("id, user_id, amount, status")
    .eq("id", fineId)
    .maybeSingle();

  const { data: fine, error: fineError } = await fineQuery;
  if (fineError || !fine) {
    return NextResponse.json({ error: fineError?.message ?? "Fine not found." }, { status: 404 });
  }

  if (auth.role === "Patron" && fine.user_id !== auth.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if ((fine.status ?? "").toLowerCase() === "paid") {
    return NextResponse.json({ error: "Fine is already paid." }, { status: 400 });
  }

  const providerRef = `mockpay_${fine.id}_${Date.now()}`;
  const eventId = `evt_${crypto.randomUUID()}`;

  const initiatedDetails = {
    eventId,
    provider: "mockpay",
    providerRef,
    fineId: fine.id,
    amount: fine.amount,
    status: "initiated",
  };

  const { error: initAuditError } = await auth.supabase.from("audit_logs").insert({
    actor: "payment-checkout",
    action: "PAYMENT_INITIATED",
    action_type: eventId,
    details: JSON.stringify(initiatedDetails),
    admin_id: auth.user.id,
  });

  if (initAuditError) {
    return NextResponse.json({ error: initAuditError.message }, { status: 400 });
  }

  // Simulated provider callback in this environment: send signed webhook event.
  const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      {
        ok: true,
        providerRef,
        eventId,
        status: "pending",
        message: "Payment initiated. Configure PAYMENT_WEBHOOK_SECRET to enable callback simulation.",
      },
      { status: 202 }
    );
  }

  const webhookPayload = JSON.stringify({
    eventId,
    provider: "mockpay",
    providerRef,
    fineId: fine.id,
    amount: fine.amount,
    status: "succeeded",
  });

  const signature = signPayload(webhookPayload, webhookSecret);
  const webhookUrl = new URL("/api/payments/webhook", request.url);

  const webhookResp = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-payment-signature": signature,
    },
    body: webhookPayload,
  });

  const webhookResult = await webhookResp.json().catch(() => ({}));
  if (!webhookResp.ok) {
    return NextResponse.json(
      {
        error: webhookResult.error ?? "Provider callback failed.",
        providerRef,
        eventId,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    providerRef,
    eventId,
    status: "succeeded",
  });
}
