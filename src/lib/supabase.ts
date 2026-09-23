import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  icon: string | null;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
  available: boolean;
  prep_time_minutes: number;
  sort_order: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  name_snapshot: string;
  price_cents: number;
  quantity: number;
}

export type OrderStatus = 'placed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentMethod = 'card' | 'upi' | 'cash';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface Order {
  id: string;
  order_number: number;
  student_name: string;
  student_room: string | null;
  status: OrderStatus;
  total_cents: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  notes: string | null;
  pickup_time: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export const STATUS_FLOW: OrderStatus[] = ['placed', 'preparing', 'ready', 'completed'];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  placed: 'Order Placed',
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
  completed: 'Completed',
  cancelled: 'Cancelled',
};
