export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      badges: {
        Row: {
          badges_id: number
          condition_type: string | null
          condition_value: number | null
          description: string | null
          image_url: string | null
        }
        Insert: {
          badges_id?: number
          condition_type?: string | null
          condition_value?: number | null
          description?: string | null
          image_url?: string | null
        }
        Update: {
          badges_id?: number
          condition_type?: string | null
          condition_value?: number | null
          description?: string | null
          image_url?: string | null
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          ai_suggestion: Json | null
          chat_log: Json | null
          confidence_score: number | null
          created_at: string | null
          entry_date: string | null
          journal_entry_id: number
          sentiment_label: string | null
          sentiment_score: number | null
          status: string | null
          text: string | null
          updated_at: string | null
          user_id: string | null
          user_prompt_id: number | null
          word_count: number | null
        }
        Insert: {
          ai_suggestion?: Json | null
          chat_log?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          entry_date?: string | null
          journal_entry_id?: number
          sentiment_label?: string | null
          sentiment_score?: number | null
          status?: string | null
          text?: string | null
          updated_at?: string | null
          user_id?: string | null
          user_prompt_id?: number | null
          word_count?: number | null
        }
        Update: {
          ai_suggestion?: Json | null
          chat_log?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          entry_date?: string | null
          journal_entry_id?: number
          sentiment_label?: string | null
          sentiment_score?: number | null
          status?: string | null
          text?: string | null
          updated_at?: string | null
          user_id?: string | null
          user_prompt_id?: number | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_journal_entries_user_prompts"
            columns: ["user_prompt_id"]
            isOneToOne: false
            referencedRelation: "user_prompts"
            referencedColumns: ["user_prompt_id"]
          },
          {
            foreignKeyName: "journal_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          background_info: Json | null
          created_at: string | null
          email: string | null
          last_login: string | null
          name: string | null
          password_hash: string | null
          preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          background_info?: Json | null
          created_at?: string | null
          email?: string | null
          last_login?: string | null
          name?: string | null
          password_hash?: string | null
          preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          background_info?: Json | null
          created_at?: string | null
          email?: string | null
          last_login?: string | null
          name?: string | null
          password_hash?: string | null
          preferences?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty_score: number | null
          prompt_id: number
          title: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty_score?: number | null
          prompt_id?: number
          title?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty_score?: number | null
          prompt_id?: number
          title?: string | null
        }
        Relationships: []
      }
      sentiment_analysis: {
        Row: {
          analyzed_at: string | null
          confidence_score: number
          created_at: string | null
          emotions: Json | null
          id: string
          journal_entry_id: number | null
          keywords: string[] | null
          sentiment_label: string
          user_id: string | null
        }
        Insert: {
          analyzed_at?: string | null
          confidence_score: number
          created_at?: string | null
          emotions?: Json | null
          id?: string
          journal_entry_id?: number | null
          keywords?: string[] | null
          sentiment_label: string
          user_id?: string | null
        }
        Update: {
          analyzed_at?: string | null
          confidence_score?: number
          created_at?: string | null
          emotions?: Json | null
          id?: string
          journal_entry_id?: number | null
          keywords?: string[] | null
          sentiment_label?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sentiment_analysis_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["journal_entry_id"]
          },
        ]
      }
      streaks: {
        Row: {
          current_streak: number | null
          last_entry_date: string | null
          longest_streak: number | null
          streak_id: number
          user_id: string | null
        }
        Insert: {
          current_streak?: number | null
          last_entry_date?: string | null
          longest_streak?: number | null
          streak_id?: number
          user_id?: string | null
        }
        Update: {
          current_streak?: number | null
          last_entry_date?: string | null
          longest_streak?: number | null
          streak_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badges_id: number | null
          earned_at: string | null
          user_badges_id: number
          user_id: string | null
        }
        Insert: {
          badges_id?: number | null
          earned_at?: string | null
          user_badges_id?: number
          user_id?: string | null
        }
        Update: {
          badges_id?: number | null
          earned_at?: string | null
          user_badges_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badges_id_fkey"
            columns: ["badges_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["badges_id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_prompts: {
        Row: {
          completed_at: string | null
          prompt_id: number | null
          user_id: string | null
          user_prompt_id: number
        }
        Insert: {
          completed_at?: string | null
          prompt_id?: number | null
          user_id?: string | null
          user_prompt_id?: number
        }
        Update: {
          completed_at?: string | null
          prompt_id?: number | null
          user_id?: string | null
          user_prompt_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_prompts_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["prompt_id"]
          },
          {
            foreignKeyName: "user_prompts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
