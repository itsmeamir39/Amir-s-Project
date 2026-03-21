/**
 * Fines Service
 * Handles fine management and payment processing
 * Follows clean architecture with payment processing abstraction
 */

import type { TypedSupabaseClient } from '@/lib/supabase';
import type { Fine } from '@/types/library';

export type FineStatus = 'Unpaid' | 'Paid' | 'Waived';

export interface PaymentPayload {
  fineId: number;
  amount: number;
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'manual';
  transactionId?: string;
}

/**
 * Get all fines for a user
 * @param client - Typed Supabase client
 * @param userId - User ID
 * @returns Array of fines sorted by creation date (newest first)
 * @throws Error if query fails
 */
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

/**
 * Calculate total unpaid fines for a user
 * @param client - Typed Supabase client
 * @param userId - User ID
 * @returns Total unpaid amount
 * @throws Error if query fails
 */
export async function getTotalUnpaidFines(
  client: TypedSupabaseClient,
  userId: string
): Promise<number> {
  const { data, error } = await client
    .from('fines')
    .select('amount')
    .eq('user_id', userId)
    .eq('status', 'Unpaid');

  if (error) throw new Error(error.message);

  return (data ?? []).reduce((sum, f) => sum + (f.amount ?? 0), 0);
}

/**
 * Mark a fine as paid
 * In production, this should be called after successful payment processing
 * @param client - Typed Supabase client
 * @param fineId - Fine ID to mark as paid
 * @throws Error if update fails
 *
 * TODO: Integrate with real payment provider (Stripe/PayPal/Square)
 * TODO: Add audit logging for payment transactions
 * TODO: Implement webhook handling for payment confirmations
 */
export async function payFine(
  client: TypedSupabaseClient,
  fineId: number
): Promise<void> {
  const { error } = await client
    .from('fines')
    .update({ status: 'Paid' as FineStatus })
    .eq('id', fineId);
  if (error) throw new Error(error.message);
}

/**
 * Waive a fine (admin only)
 * @param client - Typed Supabase client
 * @param fineId - Fine ID to waive
 * @throws Error if update fails
 */
export async function waiveFine(
  client: TypedSupabaseClient,
  fineId: number
): Promise<void> {
  const { error } = await client
    .from('fines')
    .update({ status: 'Waived' as FineStatus })
    .eq('id', fineId);
  if (error) throw new Error(error.message);
}

/**
 * Create a new fine for a user
 * @param client - Typed Supabase client
 * @param userId - User ID
 * @param amount - Fine amount in dollars
 * @param status - Initial fine status
 * @throws Error if insert fails
 */
export async function createFine(
  client: TypedSupabaseClient,
  userId: string,
  amount: number,
  status: FineStatus = 'Unpaid'
): Promise<Fine> {
  const { data, error } = await client
    .from('fines')
    .insert({
      user_id: userId,
      amount,
      status,
    })
    .select('id, amount, status, created_at')
    .single();

  if (error) throw new Error(error.message);
  return data as Fine;
}

