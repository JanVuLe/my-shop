import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types cho database
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: number
          name: string
          price: number
          original_price: number | null
          image_url: string | null
          description: string | null
          category: string
          rating: number | null
          reviews: number | null
          stock: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          price: number
          original_price?: number | null
          image_url?: string | null
          description?: string | null
          category: string
          rating?: number | null
          reviews?: number | null
          stock?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          price?: number
          original_price?: number | null
          image_url?: string | null
          description?: string | null
          category?: string
          rating?: number | null
          reviews?: number | null
          stock?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}