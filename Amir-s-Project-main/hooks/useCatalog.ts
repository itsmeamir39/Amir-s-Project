/**
 * Catalog Query Hooks
 * React Query hooks for catalog operations
 * Provides centralized data fetching with caching and automatic updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { TypedSupabaseClient } from '@/lib/supabase';
import { searchCatalog, placeHold, reserveIfAllowed, getUserHolds } from '@/services/catalog';

const CATALOG_QUERY_KEY = 'catalog';

/**
 * Hook to search the book catalog
 * @param client - Typed Supabase client
 * @param searchTerm - Search query
 * @param enabled - Whether the query should run (default: true)
 * @returns Query result with search results
 */
export function useCatalogSearch(
  client: TypedSupabaseClient | null,
  searchTerm: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: [CATALOG_QUERY_KEY, 'search', searchTerm],
    queryFn: () => {
      if (!client) throw new Error('Supabase client is not ready.');
      return searchCatalog(client, searchTerm);
    },
    enabled: enabled && !!client && !!searchTerm.trim(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to get holds for the authenticated user
 * @param client - Typed Supabase client
 * @param userId - User ID
 * @param enabled - Whether the query should run (default: true)
 * @returns Query result with holds data
 */
export function useUserHolds(
  client: TypedSupabaseClient | null,
  userId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: [CATALOG_QUERY_KEY, 'holds', userId],
    queryFn: () => {
      if (!client) throw new Error('Supabase client is not ready.');
      return getUserHolds(client, userId);
    },
    enabled: enabled && !!client && !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to place a hold on a book
 * @param client - Typed Supabase client
 * @param userId - User ID
 * @returns Mutation object with placeHold function and state
 */
export function usePlaceHoldMutation(
  client: TypedSupabaseClient | null,
  userId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ biblioId }: { biblioId: number }) => {
      if (!client) throw new Error('Supabase client is not ready.');
      return placeHold(client, userId, biblioId);
    },
    onSuccess: () => {
      // Invalidate and refetch holds after successful placement
      queryClient.invalidateQueries({ queryKey: [CATALOG_QUERY_KEY, 'holds', userId] });
    },
  });
}

/**
 * Hook to reserve a book with validation
 * @param client - Typed Supabase client
 * @param userId - User ID
 * @returns Mutation object with reserve function and state
 */
export function useReserveBookMutation(
  client: TypedSupabaseClient | null,
  userId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ biblioId }: { biblioId: number }) => {
      if (!client) throw new Error('Supabase client is not ready.');
      return reserveIfAllowed(client, userId, biblioId);
    },
    onSuccess: () => {
      // Invalidate and refetch holds after successful reservation
      queryClient.invalidateQueries({ queryKey: [CATALOG_QUERY_KEY, 'holds', userId] });
    },
  });
}
