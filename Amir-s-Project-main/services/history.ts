import type { TypedSupabaseClient } from '@/lib/supabase';
import type { ReadingHistory } from '@/types/library';

export async function getReadingHistory(
  client: TypedSupabaseClient,
  userId: string,
  limit = 50
): Promise<ReadingHistory[]> {
  const { data, error } = await client
    .from('reading_history')
    .select('id, user_id, biblio_id, borrowed_at, returned_at')
    .eq('user_id', userId)
    .order('borrowed_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as ReadingHistory[];
}

