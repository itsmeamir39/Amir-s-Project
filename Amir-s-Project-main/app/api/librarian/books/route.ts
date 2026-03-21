import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/server-auth";

const bookSchema = z.object({
  isbn: z.string().min(10).max(32),
  title: z.string().min(1),
  author: z.string().min(1),
  publisher: z.string().min(1),
  description: z.string().optional(),
  cover: z.string().url().optional(),
});

function generateBarcode() {
  const randomId = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `LIB-${randomId}`;
}

export async function POST(request: Request) {
  const auth = await requireRole(["Admin", "Librarian"]);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  const parsed = bookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const barcode = generateBarcode();
  const values = parsed.data;

  const { data: biblio, error: biblioError } = await auth.supabase
    .from("biblios")
    .insert({
      isbn: values.isbn,
      title: values.title,
      author: values.author,
      publisher: values.publisher,
      description: values.description,
      cover_url: values.cover,
    })
    .select("id")
    .single();

  if (biblioError || !biblio?.id) {
    return NextResponse.json({ error: biblioError?.message ?? "Failed to create book" }, { status: 400 });
  }

  const { error: itemError } = await auth.supabase.from("items").insert({
    biblio_id: biblio.id,
    barcode,
  });

  if (itemError) {
    return NextResponse.json({ error: itemError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, barcode });
}
