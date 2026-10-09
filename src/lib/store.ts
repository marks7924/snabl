import { Order, Booking, Hall, GlobalStoreSettings, Product, Ingredient } from '@/types';
import { INITIAL_HALLS, INITIAL_PRODUCTS, INITIAL_INGREDIENTS } from '@/lib/supabase/mock-data';

class GlobalStore {
  private settings: GlobalStoreSettings = {
    auto_approve_bookings: false,
    minimum_order_subtotal: 20.00,
    outside_food_fee_per_person: 15.00,
    min_consumption_per_person: 0.00,
    venue_is_open: true, // Emergency closure master switch: ON by default
    opening_time: '10:00',
    closing_time: '02:00',
    off_days: [], // e.g. ['Friday']
    hero_image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80',
  };

  private halls: Hall[] = [...INITIAL_HALLS];
  private products: Product[] = [...INITIAL_PRODUCTS];
  private ingredients: Ingredient[] = [...INITIAL_INGREDIENTS];

  private orders: Order[] = [
    {
      id: 'o101',
      order_number: 'ORD-1082',
      table_id: 't1',
      table_number: 1,
      order_type: 'indoor',
      status: 'pending',
      subtotal: 160.00,
      discount_amount: 0,
      outside_food_fee: 0,
      total: 160.00,
      payment_status: 'unpaid',
      customer_name: 'طاولة 1',
      created_at: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      items: [
        { id: 'i1', order_id: 'o101', product_name_ar: 'همبرجر بالجبنه', product_name_en: 'Cheeseburger', unit_price: 60, quantity: 2, subtotal: 120 },
        { id: 'i2', order_id: 'o101', product_name_ar: 'كفته سوري', product_name_en: 'Kofta Wrap', unit_price: 40, quantity: 1, subtotal: 40 }
      ]
    },
    {
      id: 'o102',
      order_number: 'ORD-1083',
      table_id: 't3',
      table_number: 3,
      order_type: 'indoor',
      status: 'preparing',
      subtotal: 200.00,
      discount_amount: 0,
      outside_food_fee: 0,
      total: 200.00,
      payment_status: 'unpaid',
      customer_name: 'طاولة 3',
      created_at: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      items: [
        { id: 'i3', order_id: 'o102', product_name_ar: 'فراخ بانيه سوري', product_name_en: 'Chicken Pane Wrap', unit_price: 70, quantity: 2, subtotal: 140 },
        { id: 'i4', order_id: 'o102', product_name_ar: 'سباجتي بالصلصه', product_name_en: 'Spaghetti Tomato', unit_price: 25, quantity: 2, subtotal: 50 },
        { id: 'i5', order_id: 'o102', product_name_ar: 'شاي', product_name_en: 'Tea', unit_price: 15, quantity: 1, subtotal: 15 }
      ]
    }
  ];

  private bookings: Booking[] = [
    {
      id: 'b101',
      booking_number: 'BK-1001',
      hall_id: INITIAL_HALLS[0].id,
      event_type: 'Birthday Party',
      booking_date: '2026-10-15',
      start_time: '17:00',
      end_time: '21:00',
      guest_count: 50,
      contact_name: 'محمد علي',
      contact_phone: '01012345678',
      notes: 'تنسيق ديكور عيد ميلاد مع كيكة خاصة',
      status: 'pending',
      total_price: 3500.00,
      deposit_amount: 500.00,
      deposit_status: 'unpaid',
      created_at: '2026-10-09T20:00:00.000Z',
      hall: INITIAL_HALLS[0]
    },
    {
      id: 'b102',
      booking_number: 'BK-1002',
      hall_id: INITIAL_HALLS[1].id,
      event_type: 'Private Celebration',
      booking_date: '2026-10-18',
      start_time: '18:00',
      end_time: '22:00',
      guest_count: 40,
      contact_name: 'سارة أسامة',
      contact_phone: '01298765432',
      status: 'confirmed',
      total_price: 1800.00,
      deposit_amount: 500.00,
      deposit_status: 'paid',
      created_at: '2026-10-09T20:00:00.000Z',
      hall: INITIAL_HALLS[1]
    }
  ];

  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // Settings API
  getSettings(): GlobalStoreSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<GlobalStoreSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.notify();
  }

  // Halls CRUD API
  getHalls(): Hall[] {
    return [...this.halls];
  }

  addHall(hall: Hall) {
    this.halls = [...this.halls, hall];
    this.notify();
    return hall;
  }

  updateHall(hallId: string, updates: Partial<Hall>) {
    this.halls = this.halls.map(h => h.id === hallId ? { ...h, ...updates } : h);
    this.notify();
  }

  toggleHallActive(hallId: string) {
    this.halls = this.halls.map(h => h.id === hallId ? { ...h, is_active: !h.is_active } : h);
    this.notify();
  }

  deleteHall(hallId: string) {
    this.halls = this.halls.filter(h => h.id !== hallId);
    this.notify();
  }

  // Products CRUD API
  getProducts(): Product[] {
    return [...this.products];
  }

  addProduct(product: Product) {
    this.products = [product, ...this.products];
    this.notify();
    return product;
  }

  updateProduct(productId: string, updates: Partial<Product>) {
    this.products = this.products.map(p => p.id === productId ? { ...p, ...updates } : p);
    this.notify();
  }

  deleteProduct(productId: string) {
    this.products = this.products.filter(p => p.id !== productId);
    this.notify();
  }

  // Ingredients / Inventory CRUD API
  getIngredients(): Ingredient[] {
    return [...this.ingredients];
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients = [ingredient, ...this.ingredients];
    this.notify();
    return ingredient;
  }

  updateIngredient(ingredientId: string, updates: Partial<Ingredient>) {
    this.ingredients = this.ingredients.map(i => i.id === ingredientId ? { ...i, ...updates } : i);
    this.notify();
  }

  deleteIngredient(ingredientId: string) {
    this.ingredients = this.ingredients.filter(i => i.id !== ingredientId);
    this.notify();
  }

  // Orders API
  getOrders(): Order[] {
    return [...this.orders];
  }

  addOrder(order: Order) {
    this.orders = [order, ...this.orders];
    this.notify();
    return order;
  }

  updateOrderStatus(orderId: string, status: Order['status']) {
    this.orders = this.orders.map(o => o.id === orderId ? { ...o, status } : o);
    this.notify();
  }

  // Bookings API
  getBookings(): Booking[] {
    return [...this.bookings];
  }

  addBooking(booking: Booking) {
    this.bookings = [booking, ...this.bookings];
    this.notify();
    return booking;
  }

  updateBookingStatus(bookingId: string, status: Booking['status']) {
    this.bookings = this.bookings.map(b => b.id === bookingId ? { ...b, status } : b);
    this.notify();
  }

  // Helper to check hall available slots
  getConfirmedBookingsForHall(hallId: string, date: string): Booking[] {
    return this.bookings.filter(b => b.hall_id === hallId && b.booking_date === date && (b.status === 'confirmed' || b.status === 'pending'));
  }
}

export const globalStore = new GlobalStore();
