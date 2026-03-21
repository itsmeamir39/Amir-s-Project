// Supabase schema/typing helpers for the root project

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      // define your tables here, e.g.:
      // users: {
      //   Row: { id: string; name: string; created_at: string | null };
      //   Insert: { id?: string; name: string; created_at?: string | null };
      //   Update: { id?: string; name?: string; created_at?: string | null };
      // };
    };
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: Record<string, string[]>;
    CompositeTypes: Record<string, unknown>;
  };
}
