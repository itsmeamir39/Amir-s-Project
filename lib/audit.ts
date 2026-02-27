import type { SupabaseClient } from '@supabase/supabase-js';

type AuditActionType = string;

export async function logAdminAction(
  client: SupabaseClient<any>,
  adminId: string,
  actionType: AuditActionType,
  details: unknown
) {
  if (!adminId) {
    throw new Error('Missing adminId when logging admin action.');
  }

  const { error } = await client.from('audit_logs').insert({
    admin_id: adminId,
    action_type: actionType,
    details: JSON.stringify(details),
  });

  if (error) {
    // Surface a clear error for calling code; can be caught and handled.
    throw new Error(error.message);
  }
}
