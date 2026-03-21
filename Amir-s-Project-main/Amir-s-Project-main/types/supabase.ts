export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Minimal Supabase Database typing for the tables currently used by the app.
// Expand incrementally as you add columns/relations.
export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          id: number;
          actor: string | null;
          action: string | null;
          details: string | null;
          created_at: string;
          admin_id: string | null;
          action_type: string | null;
        };
        Insert: {
          id?: number;
          actor?: string | null;
          action?: string | null;
          details?: string | null;
          created_at?: string;
          admin_id?: string | null;
          action_type?: string | null;
        };
        Update: {
          actor?: string | null;
          action?: string | null;
          details?: string | null;
          admin_id?: string | null;
          action_type?: string | null;
        };
        Relationships: [];
      };
      biblios: {
        Row: {
          id: number;
          title: string;
          author: string | null;
          isbn: string | null;
          description: string | null;
          cover_url: string | null;
          publisher: string | null;
        };
        Insert: {
          id?: number;
          title: string;
          author?: string | null;
          isbn?: string | null;
          description?: string | null;
          cover_url?: string | null;
          publisher?: string | null;
        };
        Update: {
          title?: string;
          author?: string | null;
          isbn?: string | null;
          description?: string | null;
          cover_url?: string | null;
          publisher?: string | null;
        };
        Relationships: [];
      };
      circulation_rules: {
        Row: {
          id: number;
          role: string;
          loan_period_days: number | null;
          borrow_limit: number | null;
          fine_amount_per_day: number | null;
          renewal_limit: number | null;
          grace_period_days: number | null;
          max_fine_amount: number | null;
        };
        Insert: {
          id?: number;
          role: string;
          loan_period_days?: number | null;
          borrow_limit?: number | null;
          fine_amount_per_day?: number | null;
          renewal_limit?: number | null;
          grace_period_days?: number | null;
          max_fine_amount?: number | null;
        };
        Update: {
          role?: string;
          loan_period_days?: number | null;
          borrow_limit?: number | null;
          fine_amount_per_day?: number | null;
          renewal_limit?: number | null;
          grace_period_days?: number | null;
          max_fine_amount?: number | null;
        };
        Relationships: [];
      };
      engagement: {
        Row: {
          id: number;
          user_id: string;
          biblio_id: number;
          type: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          biblio_id: number;
          type?: string | null;
          created_at?: string | null;
        };
        Update: {
          user_id?: string;
          biblio_id?: number;
          type?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      fines: {
        Row: {
          id: number;
          user_id: string | null;
          amount: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id?: string | null;
          amount: number;
          status: string;
          created_at?: string;
        };
        Update: {
          user_id?: string | null;
          amount?: number;
          status?: string;
        };
        Relationships: [];
      };
      global_settings: {
        Row: {
          id: number;
          maintenance_mode: boolean;
          allow_self_registration: boolean;
        };
        Insert: {
          id?: number;
          maintenance_mode: boolean;
          allow_self_registration: boolean;
        };
        Update: {
          maintenance_mode?: boolean;
          allow_self_registration?: boolean;
        };
        Relationships: [];
      };
      holds: {
        Row: {
          id: number;
          user_id: string;
          biblio_id: number;
          status: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          biblio_id: number;
          status?: string | null;
          created_at?: string | null;
        };
        Update: {
          status?: string | null;
        };
        Relationships: [];
      };
      items: {
        Row: {
          id: number;
          biblio_id: number;
          barcode: string | null;
          status: string | null;
        };
        Insert: {
          id?: number;
          biblio_id: number;
          barcode?: string | null;
          status?: string | null;
        };
        Update: {
          barcode?: string | null;
          status?: string | null;
        };
        Relationships: [];
      };
      loans: {
        Row: {
          id: number;
          user_id: string;
          biblio_id: number;
          borrowed_at: string;
          due_date: string;
          renewals_used: number;
          status: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          biblio_id: number;
          borrowed_at: string;
          due_date: string;
          renewals_used?: number;
          status: string;
        };
        Update: {
          due_date?: string;
          renewals_used?: number;
          status?: string;
        };
        Relationships: [];
      };
      reading_history: {
        Row: {
          id: number;
          user_id: string;
          biblio_id: number;
          borrowed_at: string;
          returned_at: string | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          biblio_id: number;
          borrowed_at: string;
          returned_at?: string | null;
        };
        Update: {
          returned_at?: string | null;
        };
        Relationships: [];
      };
      suggestions: {
        Row: {
          id: number;
          user_id: string;
          title: string;
          author: string | null;
          reason: string | null;
          status: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          title: string;
          author?: string | null;
          reason?: string | null;
          status?: string | null;
          created_at?: string | null;
        };
        Update: {
          title?: string;
          author?: string | null;
          reason?: string | null;
          status?: string | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          role: string;
        };
        Insert: {
          id: string;
          role: string;
        };
        Update: {
          role?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

