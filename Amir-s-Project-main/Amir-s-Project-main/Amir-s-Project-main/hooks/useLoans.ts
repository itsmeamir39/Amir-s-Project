/**
 * Loans Query Hooks
 * React Query hooks for loan data fetching and mutations
 * Provides centralized data fetching with caching and automatic updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { TypedSupabaseClient } from '@/lib/supabase';
import type { Loan } from '@/types/library';
import { getCurrentLoans, renewLoan, returnLoan } from '@/services/loans';

const LOANS_QUERY_KEY = 'loans';

/**
 * Hook to fetch current loans for the authenticated user
 * @param client - Typed Supabase client
 * @param userId - User ID to fetch loans for
 * @param enabled - Whether the query should run (default: true)
 * @returns Query result with loans data
 */
export function useCurrentLoans(
  client: TypedSupabaseClient,
  userId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: [LOANS_QUERY_KEY, 'current', userId],
    queryFn: () => getCurrentLoans(client, userId),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to renew a loan
 * @param client - Typed Supabase client
 * @param userId - User ID
 * @returns Mutation object with renew function and state
 */
export function useRenewLoanMutation(
  client: TypedSupabaseClient,
  userId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (loan: Loan) => renewLoan(client, userId, loan),
    onSuccess: () => {
      // Invalidate and refetch loans after successful renewal
      queryClient.invalidateQueries({ queryKey: [LOANS_QUERY_KEY, 'current', userId] });
    },
  });
}

/**
 * Hook to return a loan
 * @param client - Typed Supabase client
 * @param userId - User ID
 * @returns Mutation object with return function and state
 */
export function useReturnLoanMutation(
  client: TypedSupabaseClient,
  userId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (loanId: number) => returnLoan(client, loanId),
    onSuccess: () => {
      // Invalidate and refetch loans after successful return
      queryClient.invalidateQueries({ queryKey: [LOANS_QUERY_KEY, 'current', userId] });
    },
  });
}
