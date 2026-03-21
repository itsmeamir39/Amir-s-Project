/**
 * Loans Service
 * Handles loan management and related operations
 * Depends on CirculationRules service for policy enforcement
 */

import type { TypedSupabaseClient } from '@/lib/supabase';
import type { Loan } from '@/types/library';
import {
  getCirculationRulesByRole,
  validateRenewalAllowed,
  calculateNewDueDate,
} from './circulationRules';

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
  // Validate that renewal is allowed per circulation rules
  const isRenewalAllowed = await validateRenewalAllowed(client, userId, loan.renewals_used);
  if (!isRenewalAllowed) {
    throw new Error('Renewal limit reached for your account.');
  }

  // Get user's circulation rules to calculate new due date
  const { data: userRecord, error: userRecordError } = await client
    .from('users')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  if (userRecordError) throw new Error(userRecordError.message);

  const role = userRecord?.role ?? 'Patron';
  const rule = await getCirculationRulesByRole(client, role);

  // Calculate new due date
  const currentDue = new Date(loan.due_date);
  const newDueDate = calculateNewDueDate(currentDue, rule.loan_period_days);

  // Update the loan in database
  const { error: updError } = await client
    .from('loans')
    .update({
      due_date: newDueDate,
      renewals_used: loan.renewals_used + 1,
    })
    .eq('id', loan.id);
  if (updError) throw new Error(updError.message);
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
  const { error } = await client
    .from('loans')
    .update({ status: 'Returned' })
    .eq('id', loanId);
  if (error) throw new Error(error.message);
}

