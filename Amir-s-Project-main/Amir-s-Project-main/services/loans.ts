import type { TypedSupabaseClient } from '@/lib/supabase';
import type { Loan } from '@/types/library';

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

export async function renewLoan(
  client: TypedSupabaseClient,
  userId: string,
  loan: Loan
) {
  // TODO: enforce renewal rules server-side (RLS + RPC/route) to prevent tampering.

  const { data: userRecord, error: userRecordError } = await client
    .from('users')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  if (userRecordError) throw new Error(userRecordError.message);

  const role = userRecord?.role ?? null;

  const { data: rule, error: ruleError } = await client
    .from('circulation_rules')
    .select('renewal_limit, loan_period_days')
    .eq('role', role ?? '')
    .maybeSingle();
  if (ruleError) throw new Error(ruleError.message);

  const renewalLimit = rule?.renewal_limit ?? 0;
  const loanPeriodDays = rule?.loan_period_days ?? 7;

  if (loan.renewals_used >= renewalLimit) {
    throw new Error('Renewal limit reached.');
  }

  const currentDue = new Date(loan.due_date);
  currentDue.setDate(currentDue.getDate() + loanPeriodDays);

  const { error: updError } = await client
    .from('loans')
    .update({
      due_date: currentDue.toISOString(),
      renewals_used: loan.renewals_used + 1,
    })
    .eq('id', loan.id);
  if (updError) throw new Error(updError.message);
}

