export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      frames: {
        Row: {
          id: string
          created_at: string
          reference_code: string
          image_url: string
          category: string
          subcategory: string | null
          quantity: number
        }
        Insert: {
          id?: string
          created_at?: string
          reference_code: string
          image_url: string
          category: string
          subcategory?: string | null
          quantity?: number
        }
        Update: {
          id?: string
          created_at?: string
          reference_code?: string
          image_url?: string
          category?: string
          subcategory?: string | null
          quantity?: number
        }
        Relationships: []
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