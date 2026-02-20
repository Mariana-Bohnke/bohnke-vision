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
          gender: string | null // <-- Adicionado aqui (Leitura)
        }
        Insert: {
          id?: string
          created_at?: string
          reference_code: string
          image_url: string
          category: string
          subcategory?: string | null
          quantity?: number
          gender?: string | null // <-- Adicionado aqui (Criação)
        }
        Update: {
          id?: string
          created_at?: string
          reference_code?: string
          image_url?: string
          category?: string
          subcategory?: string | null
          quantity?: number
          gender?: string | null // <-- Adicionado aqui (Edição)
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
}export interface Frame {
  id: string;
  created_at: string;
  reference_code: string;
  image_url: string;
  category: string;
  subcategory: string | null;
  quantity: number;
  gender?: string | null; 
}