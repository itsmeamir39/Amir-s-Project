export type Database = {
  public: {
    Tables: {
      circulation_rules: {
        Row: { role: string; loan_period_days: number | null; borrow_limit: number | null; fine_amount_per_day: number | null; renewal_limit: number | null; id?: number };
        Insert: { role: string; loan_period_days?: number | null; borrow_limit?: number | null; fine_amount_per_day?: number | null; renewal_limit?: number | null; id?: number };
        Update: { role?: string; loan_period_days?: number | null; borrow_limit?: number | null; fine_amount_per_day?: number | null; renewal_limit?: number | null; id?: number };
      },
      global_settings: {
        Row: { id?: number; maintenance_mode: boolean; allow_self_registration: boolean };
        Insert: { id?: number; maintenance_mode?: boolean; allow_self_registration?: boolean };
        Update: { id?: number; maintenance_mode?: boolean; allow_self_registration?: boolean };
      },
      audit_logs: {
        Row: { id: number; admin_id: string; action_type: string; details: string | null; created_at: string };
        Insert: { id?: number; admin_id: string; action_type: string; details?: string | null; created_at?: string };
        Update: { id?: number; admin_id?: string; action_type?: string; details?: string | null; created_at?: string };
      },
      users: {
        Row: { id: string; role: string };
        Insert: { id: string; role: string };
        Update: { id?: string; role?: string };
      },
      engagement: {
        Row: { id: number; user_id: string; biblio_id: number; type: string; created_at: string };
        Insert: { id?: number; user_id: string; biblio_id: number; type: string; created_at?: string };
        Update: { id?: number; user_id?: string; biblio_id?: number; type?: string; created_at?: string };
      }
    },
    Views: {},
    Functions: {},
    Enums: {},
    CompositeTypes: {}
  }
}
