import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';

export function createSupabaseBrowserClient() {
  return createClientComponentClient();
}

export type TypedSupabaseClient = ReturnType<typeof createSupabaseBrowserClient>;
export type UntypedSupabaseClient = SupabaseClient;

