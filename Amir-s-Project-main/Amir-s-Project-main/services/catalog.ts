import type { TypedSupabaseClient } from '@/lib/supabase';
import type { Biblio } from '@/types/library';

export type BiblioWithItems = Biblio & { items: { status: string | null }[] };

export async function searchCatalog(
  client: TypedSupabaseClient,
  term: string,
  limit = 40
): Promise<BiblioWithItems[]> {
  const t = term.trim();
  if (!t) return [];

  const query = `%${t}%`;
  const { data, error } = await client
    .from('biblios')
    .select('id, title, author, isbn, description, cover_url, items(status)')
    .or(`title.ilike.${query},author.ilike.${query},isbn.ilike.${query}`)
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as BiblioWithItems[];
}

export async function placeHold(
  client: TypedSupabaseClient,
  userId: string,
  biblioId: number
) {
  const { error } = await client.from('holds').insert({
    user_id: userId,
    biblio_id: biblioId,
    status: 'pending',
  });
  if (error) throw new Error(error.message);
}

export async function reserveIfAllowed(
  client: TypedSupabaseClient,
  userId: string,
  biblioId: number
) {
  // TODO: move these policy checks to a server-side function/route to avoid trusting the client.

  const { data: finesData, error: finesError } = await client
    .from('fines')
    .select('amount, status')
    .eq('user_id', userId)
    .eq('status', 'Unpaid');
  if (finesError) throw new Error(finesError.message);

  const totalUnpaid = (finesData ?? []).reduce(
    (sum, f) => sum + (f.amount ?? 0),
    0
  );
  if (totalUnpaid > 10) {
    throw new Error('Your account is locked due to unpaid fines over $10.');
  }

  const { data: userRecord, error: userRecordError } = await client
    .from('users')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  if (userRecordError) throw new Error(userRecordError.message);

  const role = userRecord?.role ?? null;

  const { data: engagements, error: engagementsError } = await client
    .from('engagement')
    .select('id')
    .eq('user_id', userId)
    .eq('type', 'Reservation');
  if (engagementsError) throw new Error(engagementsError.message);

  const currentReservations = engagements?.length ?? 0;

  const { data: rule, error: ruleError } = await client
    .from('circulation_rules')
    .select('renewal_limit')
    .eq('role', role ?? '')
    .maybeSingle();
  if (ruleError) throw new Error(ruleError.message);

  const reserveLimit = rule?.renewal_limit ?? 3;
  if (currentReservations >= reserveLimit) {
    throw new Error('You have reached your reservation limit.');
  }

  const { error: insertError } = await client.from('engagement').insert({
    user_id: userId,
    biblio_id: biblioId,
    type: 'Reservation',
  });
  if (insertError) throw new Error(insertError.message);
}

export async function getUserHolds(
  client: TypedSupabaseClient,
  userId: string
) {
  const { data, error } = await client
    .from('holds')
    .select('*')
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return data ?? [];
}

