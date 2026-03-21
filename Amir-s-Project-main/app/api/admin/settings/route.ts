import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/server-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const roleSchema = z.enum(["Admin", "Librarian", "Patron"]);

const settingsSchema = z.object({
  maintenance_mode: z.boolean(),
  allow_self_registration: z.boolean(),
});

const ruleSchema = z.object({
  id: z.number().optional(),
  role: roleSchema,
  loan_period_days: z.number().nullable(),
  borrow_limit: z.number().nullable(),
  fine_amount_per_day: z.number().nullable(),
  renewal_limit: z.number().nullable(),
  grace_period_days: z.number().nullable(),
  max_fine_amount: z.number().nullable(),
});

const payloadSchema = z.object({
  rules: z.array(ruleSchema),
  settings: settingsSchema,
});

export async function GET() {
  const auth = await requireRole(["Admin"]);
  if (!auth.ok) return auth.response;

  const [rulesResp, settingsResp, logsResp, finesResp] = await Promise.all([
    auth.supabase
      .from("circulation_rules")
      .select(
        "id, role, loan_period_days, borrow_limit, fine_amount_per_day, renewal_limit, grace_period_days, max_fine_amount"
      ),
    auth.supabase
      .from("global_settings")
      .select("id, maintenance_mode, allow_self_registration")
      .maybeSingle(),
    auth.supabase
      .from("audit_logs")
      .select("id, actor, action, details, created_at")
      .order("created_at", { ascending: false })
      .limit(20),
    auth.supabase.from("fines").select("amount, status"),
  ]);

  if (rulesResp.error || settingsResp.error || logsResp.error || finesResp.error) {
    return NextResponse.json(
      {
        error:
          rulesResp.error?.message ??
          settingsResp.error?.message ??
          logsResp.error?.message ??
          finesResp.error?.message ??
          "Failed to load settings",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    rules: rulesResp.data ?? [],
    settings: settingsResp.data ?? { maintenance_mode: false, allow_self_registration: true },
    logs: logsResp.data ?? [],
    fines: finesResp.data ?? [],
  });
}

export async function PUT(request: Request) {
  const auth = await requireRole(["Admin"]);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const { rules, settings } = parsed.data;

  const [rulesResp, settingsResp] = await Promise.all([
    auth.supabase.from("circulation_rules").upsert(rules, { onConflict: "role" }),
    auth.supabase.from("global_settings").upsert(settings, { onConflict: "id" }),
  ]);

  if (rulesResp.error || settingsResp.error) {
    return NextResponse.json(
      { error: rulesResp.error?.message ?? settingsResp.error?.message ?? "Failed to save settings" },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
