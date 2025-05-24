export interface Product {
  id: number;
  name: string;
  price: number;
  original_price?: number | null;
  image_url?: string | null;
  description?: string | null;
  category: string;
  rating?: number | null;
  reviews?: number | null;
  stock?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}