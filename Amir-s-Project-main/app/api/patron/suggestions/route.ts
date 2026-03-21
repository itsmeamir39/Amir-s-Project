import { NextResponse } from "next/server";
import { z } from "zod";

import { requireRole } from "@/lib/server-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const suggestionSchema = z.object({
  title: z.string().trim().min(1),
  author: z.string().trim().optional().nullable(),
  reason: z.string().trim().optional().nullable(),
});

export async function GET() {
  const auth = await requireRole(["Patron", "Admin"]);
  if (!auth.ok) return auth.response;

  const { data, error } = await auth.supabase
    .from("suggestions")
    .select("id, title, author, reason, status, created_at")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ suggestions: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await requireRole(["Patron", "Admin"]);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  const parsed = suggestionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const { error } = await auth.supabase.from("suggestions").insert({
    user_id: auth.user.id,
    title: parsed.data.title,
    author: parsed.data.author && parsed.data.author.length > 0 ? parsed.data.author : null,
    reason: parsed.data.reason && parsed.data.reason.length > 0 ? parsed.data.reason : null,
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
