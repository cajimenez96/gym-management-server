export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      check_in: {
        Row: {
          created_at: string | null
          date_time: string
          id: string
          member_id: string
        }
        Insert: {
          created_at?: string | null
          date_time?: string
          id?: string
          member_id: string
        }
        Update: {
          created_at?: string | null
          date_time?: string
          id?: string
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_in_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member"
            referencedColumns: ["id"]
          },
        ]
      }
      member: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          status: Database["public"]["Enums"]["member_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["member_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["member_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      membership: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          member_id: string
          plan_id: string | null
          start_date: string
          status: Database["public"]["Enums"]["membership_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          member_id: string
          plan_id?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["membership_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          member_id?: string
          plan_id?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["membership_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "membership_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plan"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_plan: {
        Row: {
          created_at: string | null
          duration: number
          id: string
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration: number
          id?: string
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration?: number
          id?: string
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      payment: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          id: string
          member_id: string
          plan_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          stripe_payment_intent_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          date?: string
          id?: string
          member_id: string
          plan_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_payment_intent_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          id?: string
          member_id?: string
          plan_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_payment_intent_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plan"
            referencedColumns: ["id"]
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
      member_status: "Active" | "Inactive" | "Suspended"
      membership_status: "Active" | "Expired" | "Canceled"
      payment_status: "Successful" | "Failed" | "Pending"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
