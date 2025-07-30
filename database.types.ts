export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address: string
          address_id: number
          address_name: string
          created_at: string
          is_default: boolean | null
          profile_id: string | null
          recipient_name: string
          recipient_phone: string
          zipcode: string
        }
        Insert: {
          address: string
          address_id?: number
          address_name: string
          created_at?: string
          is_default?: boolean | null
          profile_id?: string | null
          recipient_name: string
          recipient_phone: string
          zipcode: string
        }
        Update: {
          address?: string
          address_id?: number
          address_name?: string
          created_at?: string
          is_default?: boolean | null
          profile_id?: string | null
          recipient_name?: string
          recipient_phone?: string
          zipcode?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      cart_items: {
        Row: {
          cart_item_id: number
          product_id: number
          profile_id: string | null
          quantity: number
        }
        Insert: {
          cart_item_id?: never
          product_id: number
          profile_id?: string | null
          quantity: number
        }
        Update: {
          cart_item_id?: never
          product_id?: number
          profile_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_products_product_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "cart_items_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      categories: {
        Row: {
          category_id: number
          created_at: string
          name: string
          updated_at: string
        }
        Insert: {
          category_id?: never
          created_at?: string
          name: string
          updated_at?: string
        }
        Update: {
          category_id?: never
          created_at?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_cancellations: {
        Row: {
          approved: boolean | null
          cancel_id: number
          order_id: number | null
          reason: string | null
          requested_at: string | null
        }
        Insert: {
          approved?: boolean | null
          cancel_id?: number
          order_id?: number | null
          reason?: string | null
          requested_at?: string | null
        }
        Update: {
          approved?: boolean | null
          cancel_id?: number
          order_id?: number | null
          reason?: string | null
          requested_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_cancellations_order_id_orders_order_id_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
        ]
      }
      order_items: {
        Row: {
          order_id: number | null
          order_item_id: number
          price: number | null
          product_id: number
          quantity: number
        }
        Insert: {
          order_id?: number | null
          order_item_id?: never
          price?: number | null
          product_id: number
          quantity: number
        }
        Update: {
          order_id?: number | null
          order_item_id?: never
          price?: number | null
          product_id?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_orders_order_id_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_items_product_id_products_product_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      order_refunds: {
        Row: {
          amount: number | null
          order_id: number | null
          payment_id: number | null
          reason: string | null
          refund_id: number
          refunded_at: string | null
        }
        Insert: {
          amount?: number | null
          order_id?: number | null
          payment_id?: number | null
          reason?: string | null
          refund_id?: never
          refunded_at?: string | null
        }
        Update: {
          amount?: number | null
          order_id?: number | null
          payment_id?: number | null
          reason?: string | null
          refund_id?: never
          refunded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_refunds_order_id_orders_order_id_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_refunds_payment_id_payments_payment_id_fk"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["payment_id"]
          },
        ]
      }
      orders: {
        Row: {
          address_id: number | null
          created_at: string
          order_date: string
          order_id: number
          order_status: Database["public"]["Enums"]["order_status"]
          profile_id: string | null
          total_price: number
          updated_at: string
        }
        Insert: {
          address_id?: number | null
          created_at?: string
          order_date?: string
          order_id?: never
          order_status?: Database["public"]["Enums"]["order_status"]
          profile_id?: string | null
          total_price: number
          updated_at?: string
        }
        Update: {
          address_id?: number | null
          created_at?: string
          order_date?: string
          order_id?: never
          order_status?: Database["public"]["Enums"]["order_status"]
          profile_id?: string | null
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_addresses_address_id_fk"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["address_id"]
          },
          {
            foreignKeyName: "orders_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          card_company: string | null
          card_number: string | null
          customer_email: string | null
          customer_name: string | null
          method: Database["public"]["Enums"]["payment_method"] | null
          order_id: number | null
          order_name: string
          paid_at: string | null
          payment_id: number
          payment_key: string
          receipt_url: string | null
          requested_at: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
        }
        Insert: {
          amount: number
          card_company?: string | null
          card_number?: string | null
          customer_email?: string | null
          customer_name?: string | null
          method?: Database["public"]["Enums"]["payment_method"] | null
          order_id?: number | null
          order_name: string
          paid_at?: string | null
          payment_id?: never
          payment_key: string
          receipt_url?: string | null
          requested_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Update: {
          amount?: number
          card_company?: string | null
          card_number?: string | null
          customer_email?: string | null
          customer_name?: string | null
          method?: Database["public"]["Enums"]["payment_method"] | null
          order_id?: number | null
          order_name?: string
          paid_at?: string | null
          payment_id?: never
          payment_key?: string
          receipt_url?: string | null
          requested_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_orders_order_id_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: number | null
          caution: string | null
          created_at: string
          description: string | null
          detail: string | null
          detail_page_image_1: string
          detail_page_image_2: string | null
          detail_page_image_3: string | null
          detail_page_image_4: string | null
          detail_page_image_5: string | null
          exchange_refund_policy: string | null
          name: string
          price: number
          product_id: number
          product_image_1: string
          product_image_2: string | null
          product_image_3: string | null
          product_image_4: string | null
          product_image_5: string | null
          purchase_link: string | null
          shipping_policy: string | null
          stock: number
          unique_name: string
          updated_at: string
        }
        Insert: {
          category_id?: number | null
          caution?: string | null
          created_at?: string
          description?: string | null
          detail?: string | null
          detail_page_image_1: string
          detail_page_image_2?: string | null
          detail_page_image_3?: string | null
          detail_page_image_4?: string | null
          detail_page_image_5?: string | null
          exchange_refund_policy?: string | null
          name: string
          price: number
          product_id?: never
          product_image_1: string
          product_image_2?: string | null
          product_image_3?: string | null
          product_image_4?: string | null
          product_image_5?: string | null
          purchase_link?: string | null
          shipping_policy?: string | null
          stock?: number
          unique_name: string
          updated_at?: string
        }
        Update: {
          category_id?: number | null
          caution?: string | null
          created_at?: string
          description?: string | null
          detail?: string | null
          detail_page_image_1?: string
          detail_page_image_2?: string | null
          detail_page_image_3?: string | null
          detail_page_image_4?: string | null
          detail_page_image_5?: string | null
          exchange_refund_policy?: string | null
          name?: string
          price?: number
          product_id?: never
          product_image_1?: string
          product_image_2?: string | null
          product_image_3?: string | null
          product_image_4?: string | null
          product_image_5?: string | null
          purchase_link?: string | null
          shipping_policy?: string | null
          stock?: number
          unique_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_categories_category_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          profile_id: string
          role: Database["public"]["Enums"]["role"]
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          profile_id: string
          role?: Database["public"]["Enums"]["role"]
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["role"]
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          product_id: number | null
          profile_id: string | null
          rating: number
          review_id: number
          updated_at: string
        }
        Insert: {
          comment: string
          created_at?: string
          product_id?: number | null
          profile_id?: string | null
          rating: number
          review_id?: never
          updated_at?: string
        }
        Update: {
          comment?: string
          created_at?: string
          product_id?: number | null
          profile_id?: string | null
          rating?: number
          review_id?: never
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_products_product_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "reviews_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      shipping: {
        Row: {
          delivered_at: string | null
          order_id: number | null
          shipped_at: string | null
          shipping_id: number
        }
        Insert: {
          delivered_at?: string | null
          order_id?: number | null
          shipped_at?: string | null
          shipping_id?: never
        }
        Update: {
          delivered_at?: string | null
          order_id?: number | null
          shipped_at?: string | null
          shipping_id?: never
        }
        Relationships: [
          {
            foreignKeyName: "shipping_order_id_orders_order_id_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
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
      order_status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
      payment_method: "card" | "bank" | "kakao" | "naver"
      payment_status: "paid" | "failed" | "refunded"
      role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_status: ["pending", "paid", "shipped", "delivered", "cancelled"],
      payment_method: ["card", "bank", "kakao", "naver"],
      payment_status: ["paid", "failed", "refunded"],
      role: ["admin", "user"],
    },
  },
} as const
