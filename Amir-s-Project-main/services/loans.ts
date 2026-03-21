/**
 * Loans Service
 * Handles loan management and related operations
 * Depends on CirculationRules service for policy enforcement
 */

import type { TypedSupabaseClient } from '@/lib/supabase';
import type { Loan } from '@/types/library';

/**
 * Get all current active loans for a user
 * @param client - Typed Supabase client
 * @param userId - User ID
 * @returns Array of active loans
 * @throws Error if query fails
 */
export async function getCurrentLoans(
  client: TypedSupabaseClient,
  userId: string
): Promise<Loan[]> {
  const { data, error } = await client
    .from('loans')
    .select('id, user_id, biblio_id, borrowed_at, due_date, renewals_used, status')
    .eq('user_id', userId)
    .eq('status', 'CheckedOut')
    .order('due_date', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Loan[];
}

/**
 * Renew a loan by extending its due date
 * Enforces circulation rules for the user's role
 * @param client - Typed Supabase client
 * @param userId - User ID
 * @param loan - Loan object to renew
 * @throws Error if renewal not allowed or query fails
 *
 * Note: Server-side RLS and RPC functions should provide additional
 * security to prevent tampering with renewal logic.
 */
export async function renewLoan(
  client: TypedSupabaseClient,
  userId: string,
  loan: Loan
) {
  const response = await fetch('/api/patron/loans/renew', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loanId: loan.id }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((payload as { error?: string }).error ?? 'Failed to renew loan.');
  }
}

/**
 * Mark a loan as returned
 * @param client - Typed Supabase client
 * @param loanId - Loan ID
 * @throws Error if update fails
 */
export async function returnLoan(
  client: TypedSupabaseClient,
  loanId: number
) {
  const response = await fetch('/api/patron/loans/return', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loanId }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((payload as { error?: string }).error ?? 'Failed to return loan.');
  }
}

