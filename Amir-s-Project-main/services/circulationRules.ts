/**
 * Circulation Rules Service
 * Handles all circulation policy and validation logic
 * Following clean architecture with single responsibility principle
 */

import type { TypedSupabaseClient } from '@/lib/supabase';

export interface CirculationRule {
  patron_role: string;
  max_borrow_limit: number;
  loan_period_days: number;
  renewal_limit: number;
  fine_per_day: number;
  max_fine_amount: number;
  grace_period_days: number | null;
}

/**
 * Fetch circulation rules for a specific patron role
 * @param client - Typed Supabase client
 * @param patronRole - Role to fetch rules for ('Admin', 'Librarian', 'Patron')
 * @returns Circulation rule or throws error
 */
export async function getCirculationRulesByRole(
  client: TypedSupabaseClient,
  patronRole: string
): Promise<CirculationRule> {
  const { data, error } = await client
    .from('circulation_rules')
    .select(
      'patron_role, max_borrow_limit, loan_period_days, renewal_limit, fine_per_day, max_fine_amount, grace_period_days'
    )
    .eq('patron_role', patronRole)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch circulation rules: ${error.message}`);

  if (!data) {
    throw new Error(`No circulation rules found for role: ${patronRole}`);
  }

  return data;
}

/**
 * Validate if a user can renew a loan based on circulation rules
 * @param client - Typed Supabase client
 * @param userId - User ID
 * @param renewalsUsed - Current renewal count
 * @returns Boolean indicating if renewal is allowed
 * @throws Error if validation fails
 */
export async function validateRenewalAllowed(
  client: TypedSupabaseClient,
  userId: string,
  renewalsUsed: number
): Promise<boolean> {
  const { data: userRecord, error: userRecordError } = await client
    .from('users')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (userRecordError) throw new Error(`Failed to fetch user: ${userRecordError.message}`);

  const role = userRecord?.role ?? 'Patron';
  const rule = await getCirculationRulesByRole(client, role);

  if (renewalsUsed >= rule.renewal_limit) {
    return false;
  }

  return true;
}

/**
 * Calculate new due date based on loan period
 * @param currentDueDate - Current due date
 * @param loanPeriodDays - Loan period in days
 * @returns New due date as ISO string
 */
export function calculateNewDueDate(
  currentDueDate: Date,
  loanPeriodDays: number
): string {
  const newDate = new Date(currentDueDate);
  newDate.setDate(newDate.getDate() + loanPeriodDays);
  return newDate.toISOString();
}

/**
 * Validate if a user can place a reservation
 * @param client - Typed Supabase client
 * @param userId - User ID
 * @returns Boolean indicating if reservation is allowed
 * @throws Error if validation fails
 */
export async function validateReservationAllowed(
  client: TypedSupabaseClient,
  userId: string
): Promise<boolean> {
  // Check for unpaid fines exceeding threshold
  const { data: finesData, error: finesError } = await client
    .from('fines')
    .select('amount')
    .eq('user_id', userId)
    .eq('status', 'Unpaid');

  if (finesError) throw new Error(`Failed to fetch fines: ${finesError.message}`);

  const totalUnpaid = (finesData ?? []).reduce(
    (sum, f) => sum + (f.amount ?? 0),
    0
  );

  const FINE_THRESHOLD = 10;
  if (totalUnpaid > FINE_THRESHOLD) {
    throw new Error(
      `Your account is locked due to unpaid fines over $${FINE_THRESHOLD}. Current balance: $${totalUnpaid.toFixed(2)}`
    );
  }

  // Check reservation limit
  const { data: userRecord, error: userRecordError } = await client
    .from('users')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (userRecordError) throw new Error(`Failed to fetch user: ${userRecordError.message}`);

  const role = userRecord?.role ?? 'Patron';
  const rule = await getCirculationRulesByRole(client, role);

  const { data: engagements, error: engagementsError } = await client
    .from('engagement')
    .select('id')
    .eq('user_id', userId)
    .eq('type', 'Reservation');

  if (engagementsError) throw new Error(`Failed to fetch reservations: ${engagementsError.message}`);

  const currentReservations = engagements?.length ?? 0;

  if (currentReservations >= rule.renewal_limit) {
    throw new Error(
      `You have reached your reservation limit (${rule.renewal_limit}). Current reservations: ${currentReservations}`
    );
  }

  return true;
}

/**
 * Get max borrow limit for a user role
 * @param client - Typed Supabase client
 * @param userId - User ID
 * @returns Maximum borrowing limit
 */
export async function getMaxBorrowLimit(
  client: TypedSupabaseClient,
  userId: string
): Promise<number> {
  const { data: userRecord, error: userRecordError } = await client
    .from('users')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (userRecordError) throw new Error(`Failed to fetch user: ${userRecordError.message}`);

  const role = userRecord?.role ?? 'Patron';
  const rule = await getCirculationRulesByRole(client, role);

  return rule.max_borrow_limit;
}
