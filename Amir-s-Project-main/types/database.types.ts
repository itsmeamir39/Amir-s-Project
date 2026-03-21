export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          id: number;
          actor: string | null;
          action: string | null;
          details: string | null;
          admin_id: string | null;
          action_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          actor?: string | null;
          action?: string | null;
          details?: string | null;
          admin_id?: string | null;
          action_type?: string | null;
          created_at?: string;
        };
        Update: {
          actor?: string | null;
          action?: string | null;
          details?: string | null;
          admin_id?: string | null;
          action_type?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'audit_logs_admin_id_fkey';
            columns: ['admin_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          author?: string | null;
          isbn?: string | null;
          description?: string | null;
          cover_url?: string | null;
          publisher?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          author?: string | null;
          isbn?: string | null;
          description?: string | null;
          cover_url?: string | null;
          publisher?: string | null;
          created_at?: string;
          updated_at?: string;
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
          created_at: string;
          updated_at: string;
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
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          role?: string;
          loan_period_days?: number | null;
          borrow_limit?: number | null;
          fine_amount_per_day?: number | null;
          renewal_limit?: number | null;
          grace_period_days?: number | null;
          max_fine_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      engagement: {
        Row: {
          id: number;
          user_id: string;
          biblio_id: number;
          type: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          biblio_id: number;
          type: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          biblio_id?: number;
          type?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'engagement_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'engagement_biblio_id_fkey';
            columns: ['biblio_id'];
            isOneToOne: false;
            referencedRelation: 'biblios';
            referencedColumns: ['id'];
          },
        ];
      };
      fines: {
        Row: {
          id: number;
          user_id: string;
          amount: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          amount: number;
          status: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          amount?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fines_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      global_settings: {
        Row: {
          id: number;
          maintenance_mode: boolean;
          allow_self_registration: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          maintenance_mode?: boolean;
          allow_self_registration?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          maintenance_mode?: boolean;
          allow_self_registration?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      holds: {
        Row: {
          id: number;
          user_id: string;
          biblio_id: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          biblio_id: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          biblio_id?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'holds_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'holds_biblio_id_fkey';
            columns: ['biblio_id'];
            isOneToOne: false;
            referencedRelation: 'biblios';
            referencedColumns: ['id'];
          },
        ];
      };
      items: {
        Row: {
          id: number;
          biblio_id: number;
          barcode: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          biblio_id: number;
          barcode?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          biblio_id?: number;
          barcode?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'items_biblio_id_fkey';
            columns: ['biblio_id'];
            isOneToOne: false;
            referencedRelation: 'biblios';
            referencedColumns: ['id'];
          },
        ];
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          biblio_id: number;
          borrowed_at?: string;
          due_date: string;
          renewals_used?: number;
          status: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          biblio_id?: number;
          borrowed_at?: string;
          due_date?: string;
          renewals_used?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'loans_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'loans_biblio_id_fkey';
            columns: ['biblio_id'];
            isOneToOne: false;
            referencedRelation: 'biblios';
            referencedColumns: ['id'];
          },
        ];
      };
      reading_history: {
        Row: {
          id: number;
          user_id: string;
          biblio_id: number;
          borrowed_at: string;
          returned_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          biblio_id: number;
          borrowed_at: string;
          returned_at?: string | null;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          biblio_id?: number;
          borrowed_at?: string;
          returned_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reading_history_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reading_history_biblio_id_fkey';
            columns: ['biblio_id'];
            isOneToOne: false;
            referencedRelation: 'biblios';
            referencedColumns: ['id'];
          },
        ];
      };
      suggestions: {
        Row: {
          id: number;
          user_id: string;
          title: string;
          author: string | null;
          reason: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          title: string;
          author?: string | null;
          reason?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          title?: string;
          author?: string | null;
          reason?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'suggestions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          id: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id: string;
          role: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_biblio_with_item: {
        Args: {
          p_isbn: string;
          p_title: string;
          p_author: string;
          p_publisher: string;
          p_description?: string | null;
          p_cover_url?: string | null;
          p_barcode?: string | null;
        };
        Returns: {
          biblio_id: number;
          barcode: string;
        }[];
      };
      current_user_role: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
