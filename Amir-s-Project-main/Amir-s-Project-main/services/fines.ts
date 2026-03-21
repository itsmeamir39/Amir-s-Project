import type { TypedSupabaseClient } from '@/lib/supabase';
import type { Fine } from '@/types/library';

export async function getUserFines(
  client: TypedSupabaseClient,
  userId: string
): Promise<Fine[]> {
  const { data, error } = await client
    .from('fines')
    .select('id, amount, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Fine[];
}

export async function payFine(client: TypedSupabaseClient, fineId: number) {
  // TODO: integrate with a real payment provider (Stripe/PayPal/etc).
  const { error } = await client
    .from('fines')
    .update({ status: 'Paid' })
    .eq('id', fineId);
  if (error) throw new Error(error.message);
}

