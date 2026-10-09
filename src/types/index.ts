export type RoleName = 
  | 'Owner' 
  | 'General Manager' 
  | 'Administrator' 
  | 'Booking Manager' 
  | 'Cashier' 
  | 'Kitchen Staff' 
  | 'Inventory Manager' 
  | 'Accountant' 
  | 'Customer';

export type PermissionCode = 
  | 'dashboard.view'
  | 'settings.manage'
  | 'staff.view'
  | 'staff.manage'
  | 'roles.manage'
  | 'products.view'
  | 'products.manage'
  | 'orders.view'
  | 'orders.manage'
  | 'pos.access'
  | 'payments.view'
  | 'payments.record'
  | 'payments.refund'
  | 'bookings.view'
  | 'bookings.manage'
  | 'bookings.approve'
  | 'bookings.cancel'
  | 'inventory.view'
  | 'inventory.manage'
  | 'inventory.receive'
  | 'inventory.waste'
  | 'inventory.adjust'
  | 'finance.view'
  | 'finance.manage'
  | 'reports.view'
  | 'cms.manage'
  | 'audit.view';

export interface Profile {
  id: string;
  full_name: string;
  phone?: string | null;
  email?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  roles?: RoleName[];
  permissions?: PermissionCode[];
}

export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name_ar: string;
  name_en: string;
  price_delta: number;
  is_available: boolean;
}

export interface ProductAddon {
  id: string;
  category_id?: string | null;
  product_id?: string | null;
  name_ar: string;
  name_en: string;
  price: number;
  is_available: boolean;
}

export interface Product {
  id: string;
  category_id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string | null;
  description_en?: string | null;
  ingredients_ar?: string | null;
  ingredients_en?: string | null;
  price: number;
  is_available: boolean;
  is_featured: boolean;
  image_url?: string | null;
  unresolved_notes?: string | null;
  variants?: ProductVariant[];
  addons?: ProductAddon[];
  category?: Category;
}

export interface DiningTable {
  id: string;
  table_number: number;
  name: string;
  capacity: number;
  is_active: boolean;
  created_at?: string;
}

export interface TableSession {
  id: string;
  table_id: string;
  session_token_hash: string;
  guest_count: number;
  status: 'active' | 'closed' | 'revoked';
  min_consumption_per_person: number;
  started_at: string;
  closed_at?: string | null;
  opened_by?: string | null;
  table?: DiningTable;
}

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid' | 'refunded';
export type OrderType = 'indoor' | 'takeaway' | 'qr_table' | 'pos_table' | 'delivery';

export interface OrderItemAddon {
  id: string;
  order_item_id: string;
  addon_id?: string | null;
  addon_name_ar: string;
  addon_name_en: string;
  unit_price: number;
  quantity: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string | null;
  product_name_ar: string;
  product_name_en: string;
  variant_name_ar?: string | null;
  variant_name_en?: string | null;
  unit_price: number;
  quantity: number;
  subtotal: number;
  notes?: string | null;
  addons?: OrderItemAddon[];
}

export interface Order {
  id: string;
  order_number: string;
  session_id?: string | null;
  table_id?: string | null;
  table_number?: number | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_address?: string | null;
  order_type: OrderType;
  status: OrderStatus;
  subtotal: number;
  discount_amount: number;
  outside_food_fee: number;
  outside_food_guests?: number | null;
  total: number;
  payment_status: PaymentStatus;
  customer_notes?: string | null;
  staff_notes?: string | null;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
  table?: DiningTable;
}

export type BookingStatus = 'pending' | 'under_review' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';

export interface Hall {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string;
  description_en: string;
  capacity: number;
  base_price: number;
  price_per_hour?: number;
  full_day_price?: number;
  amenities: string[];
  images: string[];
  is_active: boolean;
}

export interface Booking {
  id: string;
  booking_number: string;
  user_id?: string | null;
  hall_id: string;
  event_type: string;
  booking_type?: 'hourly' | 'full_day';
  duration_hours?: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  guest_count: number;
  contact_name: string;
  contact_phone: string;
  notes?: string | null;
  status: BookingStatus;
  total_price: number;
  deposit_amount: number;
  deposit_status: 'unpaid' | 'paid' | 'refunded';
  created_at: string;
  hall?: Hall;
}

export interface Ingredient {
  id: string;
  name_ar: string;
  name_en: string;
  unit: 'kg' | 'g' | 'l' | 'ml' | 'pcs' | 'pack';
  current_stock: number;
  reorder_threshold: number;
  cost_per_unit: number;
  is_active: boolean;
}

export interface ProductRecipe {
  id: string;
  product_id: string;
  yield_quantity: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
}

export interface CashShift {
  id: string;
  cashier_id: string;
  opening_cash: number;
  closing_cash_expected?: number | null;
  closing_cash_actual?: number | null;
  status: 'open' | 'closed';
  opened_at: string;
  closed_at?: string | null;
}

export interface Payment {
  id: string;
  receipt_number: string;
  order_id?: string | null;
  booking_id?: string | null;
  shift_id?: string | null;
  amount: number;
  payment_method: 'cash' | 'manual_other';
  status: 'completed' | 'refunded';
  recorded_by: string;
  created_at: string;
}

export interface VenuePolicy {
  id: string;
  policy_type: 'outside_food' | 'minimum_order' | 'min_consumption';
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  fee_per_person: number;
  min_subtotal_amount: number;
  is_enabled: boolean;
}

export interface CMSSection {
  id: string;
  section_key: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  metadata?: Record<string, any>;
}

export interface GlobalStoreSettings {
  auto_approve_bookings: boolean;
  minimum_order_subtotal: number;
  outside_food_fee_per_person: number;
  min_consumption_per_person: number;
  venue_is_open: boolean;
  opening_time: string;
  closing_time: string;
  off_days: string[];
  hero_image_url: string;
}
