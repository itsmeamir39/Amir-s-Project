import type { TypedSupabaseClient } from '@/lib/supabase';

export async function getBibliosByIds(
  client: TypedSupabaseClient,
  ids: number[]
): Promise<Record<number, { title: string; author: string | null }>> {
  const unique = Array.from(new Set(ids)).filter((id) => Number.isFinite(id));
  if (unique.length === 0) return {};

  const { data, error } = await client
    .from('biblios')
    .select('id, title, author')
    .in('id', unique);

  if (error) throw new Error(error.message);

  const map: Record<number, { title: string; author: string | null }> = {};
  (data ?? []).forEach((b) => {
    map[b.id] = { title: b.title, author: b.author };
  });
  return map;
}

