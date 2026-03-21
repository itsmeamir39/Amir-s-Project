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

function normalizeSupabaseErrorMessage(message: string) {
  if (message.includes("biblios_isbn_unique") || message.toLowerCase().includes("isbn")) {
    return "A book with this ISBN already exists.";
  }
  if (message.includes("items_barcode_unique") || message.toLowerCase().includes("barcode")) {
    return "Barcode already exists. Please try again.";
  }
  return message;
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

  const { data, error } = await (auth.supabase as any).rpc("create_biblio_with_item", {
    p_isbn: values.isbn,
    p_title: values.title,
    p_author: values.author,
    p_publisher: values.publisher,
    p_description: values.description ?? null,
    p_cover_url: values.cover ?? null,
    p_barcode: barcode,
  });

  if (error) {
    return NextResponse.json({ error: normalizeSupabaseErrorMessage(error.message) }, { status: 400 });
  }

  const row = Array.isArray(data) ? data[0] : data;

  return NextResponse.json({ ok: true, barcode: row?.barcode ?? barcode, biblioId: row?.biblio_id ?? null });
}
