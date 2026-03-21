import type { UserRole } from '@/types/library';
import type { TypedSupabaseClient } from '@/lib/supabase';

export async function signInWithPassword(
  client: TypedSupabaseClient,
  email: string,
  password: string
) {
  return client.auth.signInWithPassword({ email, password });
}

export async function getCurrentUser(client: TypedSupabaseClient) {
  const { data, error } = await client.auth.getUser();
  if (error) throw new Error(error.message);
  return data.user;
}

export async function getUserRole(
  client: TypedSupabaseClient,
  userId: string
): Promise<UserRole> {
  const { data, error } = await client
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);
  const role = data?.role as UserRole | undefined;
  if (!role) throw new Error('Your account is missing a role. Please contact support.');
  return role;
}

