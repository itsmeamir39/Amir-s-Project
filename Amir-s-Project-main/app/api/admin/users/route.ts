import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole, isValidRole } from "@/lib/server-auth";

const createUserSchema = z.object({
  id: z.string().uuid(),
  role: z.string().refine(isValidRole, "Invalid role"),
});

const updateUserSchema = z.object({
  id: z.string().uuid(),
  role: z.string().refine(isValidRole, "Invalid role"),
});

export async function GET() {
  const auth = await requireRole(["Admin"]);
  if (!auth.ok) return auth.response;

  const { data, error } = await auth.supabase
    .from("users")
    .select("id, role")
    .order("role", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await requireRole(["Admin"]);
  if (!auth.ok) return auth.response;

  const parsed = createUserSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const { error } = await auth.supabase.from("users").insert(parsed.data);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const auth = await requireRole(["Admin"]);
  if (!auth.ok) return auth.response;

  const parsed = updateUserSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const { id, role } = parsed.data;
  const { error } = await auth.supabase.from("users").update({ role }).eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
