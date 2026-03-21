import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      {
        ready: false,
        checks: {
          authenticated: false,
          hasUserRoleRow: false,
          isAdmin: false,
          hasGlobalSettingsRow: false,
          circulationRulesCount: 0,
        },
        errors: {
          auth: authError?.message ?? "Unauthorized",
        },
      },
      { status: 401 }
    );
  }

  const [roleResp, settingsResp, rulesResp] = await Promise.all([
    supabase.from("users").select("role").eq("id", user.id).maybeSingle(),
    supabase.from("global_settings").select("id").eq("id", 1).maybeSingle(),
    supabase.from("circulation_rules").select("id", { head: true, count: "exact" }),
  ]);

  const role = roleResp.data?.role ?? null;
  const hasUserRoleRow = !!role;
  const isAdmin = role === "Admin";
  const hasGlobalSettingsRow = !!settingsResp.data;
  const circulationRulesCount = rulesResp.count ?? 0;

  const errors: Record<string, string> = {};
  if (roleResp.error) errors.role = roleResp.error.message;
  if (settingsResp.error) errors.globalSettings = settingsResp.error.message;
  if (rulesResp.error) errors.circulationRules = rulesResp.error.message;

  const ready =
    hasUserRoleRow && isAdmin && hasGlobalSettingsRow && circulationRulesCount >= 1;

  return NextResponse.json({
    ready,
    checks: {
      authenticated: true,
      hasUserRoleRow,
      isAdmin,
      hasGlobalSettingsRow,
      circulationRulesCount,
      userId: user.id,
      role,
    },
    errors,
  });
}
