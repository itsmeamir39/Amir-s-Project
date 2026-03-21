/**
 * Catalog Service
 * Handles catalog operations including search, holds, and reservations
 * Depends on CirculationRules service for policy enforcement
 */

import type { TypedSupabaseClient } from '@/lib/supabase';
import type { Biblio } from '@/types/library';
import { validateReservationAllowed } from './circulationRules';

export type BiblioWithItems = Biblio & { items: { status: string | null }[] };

/**
 * Search the book catalog by title, author, or ISBN
 * @param client - Typed Supabase client
 * @param term - Search term
 * @param limit - Maximum results to return (default 40)
 * @returns Array of books with available item information
 * @throws Error if search fails
 */
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

/**
 * Place a hold on a book
 * @param client - Typed Supabase client
 * @param userId - User ID
 * @param biblioId - Book ID
 * @throws Error if hold placement fails
 */
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

/**
 * Reserve a book with circulation policy validation
 * Checks:
 * - User's unpaid fines don't exceed threshold
 * - User hasn't exceeded their reservation limit
 * @param client - Typed Supabase client
 * @param userId - User ID
 * @param biblioId - Book ID to reserve
 * @throws Error if reservation not allowed or query fails
 *
 * Note: Policy checks should also be enforced server-side via RLS
 * to prevent tampering with validation logic.
 */
export async function reserveIfAllowed(
  client: TypedSupabaseClient,
  userId: string,
  biblioId: number
) {
  // Validate that reservation is allowed per circulation rules
  await validateReservationAllowed(client, userId);

  // Create the reservation engagement record
  const { error: insertError } = await client.from('engagement').insert({
    user_id: userId,
    biblio_id: biblioId,
    type: 'Reservation',
  });
  if (insertError) throw new Error(insertError.message);
}

/**
 * Get all holds placed by a user
 * @param client - Typed Supabase client
 * @param userId - User ID
 * @returns Array of holds
 * @throws Error if query fails
 */
export async function getUserHolds(
  client: TypedSupabaseClient,
  userId: string
) {
  const { data, error } = await client
    .from('holds')
    .select('id, biblio_id, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

