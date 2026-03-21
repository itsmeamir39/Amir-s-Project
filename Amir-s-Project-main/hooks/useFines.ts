/**
 * Fines Query Hooks
 * React Query hooks for fine data fetching and mutations
 * Provides centralized data fetching with caching and automatic updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { TypedSupabaseClient } from '@/lib/supabase';
import { getUserFines, getTotalUnpaidFines, requestFinePayment, waiveFine } from '@/services/fines';

const FINES_QUERY_KEY = 'fines';

/**
 * Hook to fetch all fines for the authenticated user
 * @param client - Typed Supabase client
 * @param userId - User ID to fetch fines for
 * @param enabled - Whether the query should run (default: true)
 * @returns Query result with fines data
 */
export function useUserFines(
  client: TypedSupabaseClient | null,
  userId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: [FINES_QUERY_KEY, 'user', userId],
    queryFn: () => {
      if (!client) throw new Error('Supabase client is not ready.');
      return getUserFines(client, userId);
    },
    enabled: enabled && !!client && !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to fetch total unpaid fines for a user
 * @param client - Typed Supabase client
 * @param userId - User ID
 * @param enabled - Whether the query should run (default: true)
 * @returns Query result with total unpaid amount
 */
export function useUnpaidFinesTotal(
  client: TypedSupabaseClient | null,
  userId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: [FINES_QUERY_KEY, 'unpaid-total', userId],
    queryFn: () => {
      if (!client) throw new Error('Supabase client is not ready.');
      return getTotalUnpaidFines(client, userId);
    },
    enabled: enabled && !!client && !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to mark a fine as paid
 * @param client - Typed Supabase client
 * @param userId - User ID
 * @returns Mutation object with payFine function and state
 */
export function usePayFineMutation(
  client: TypedSupabaseClient | null,
  userId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fineId: number) => requestFinePayment(fineId),
    onSuccess: () => {
      // Invalidate and refetch fines after successful payment
      queryClient.invalidateQueries({ queryKey: [FINES_QUERY_KEY, 'user', userId] });
      queryClient.invalidateQueries({ queryKey: [FINES_QUERY_KEY, 'unpaid-total', userId] });
    },
  });
}

/**
 * Hook to waive a fine (admin only)
 * @param client - Typed Supabase client
 * @param userId - User ID
 * @returns Mutation object with waiveFine function and state
 */
export function useWaiveFineMutation(
  client: TypedSupabaseClient | null,
  userId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fineId: number) => {
      if (!client) throw new Error('Supabase client is not ready.');
      return waiveFine(client, fineId);
    },
    onSuccess: () => {
      // Invalidate and refetch fines after waiving
      queryClient.invalidateQueries({ queryKey: [FINES_QUERY_KEY, 'user', userId] });
      queryClient.invalidateQueries({ queryKey: [FINES_QUERY_KEY, 'unpaid-total', userId] });
    },
  });
}

// Backward-compatible alias for older imports.
export const useWaveFineMutation = useWaiveFineMutation;
