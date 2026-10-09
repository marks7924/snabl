import { Category, Product, Hall, DiningTable, VenuePolicy, Order, Booking, Ingredient, CashShift, CMSSection } from '@/types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '11111111-1111-1111-1111-111111111111', name_ar: 'ساندوتشات', name_en: 'Sandwiches', slug: 'sandwiches', display_order: 1, is_active: true },
  { id: '22222222-2222-2222-2222-222222222222', name_ar: 'باستا', name_en: 'Pastas', slug: 'pastas', display_order: 2, is_active: true },
  { id: '33333333-3333-3333-3333-333333333333', name_ar: 'مشروبات ساخنة', name_en: 'Hot Drinks', slug: 'hot-drinks', display_order: 3, is_active: true },
  { id: '44444444-4444-4444-4444-444444444444', name_ar: 'مشروبات باردة', name_en: 'Cold Drinks', slug: 'cold-drinks', display_order: 4, is_active: true },
  { id: '55555555-5555-5555-5555-555555555555', name_ar: 'حلويات', name_en: 'Desserts', slug: 'desserts', display_order: 5, is_active: true },
];

export const INITIAL_PRODUCTS: Product[] = [
  // Sandwiches
  {
    id: 'c1010000-0000-0000-0000-000000000001',
    category_id: '11111111-1111-1111-1111-111111111111',
    name_ar: 'همبرجر ساندوتش',
    name_en: 'Hamburger Sandwich',
    price: 50.00,
    ingredients_ar: 'مايونيز، كاتشب، خس، طماطم، بصل',
    ingredients_en: 'Mayonnaise, Ketchup, Lettuce, Tomato, Onion',
    is_available: true,
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80',
  },
  {
    id: 'c1010000-0000-0000-0000-000000000002',
    category_id: '11111111-1111-1111-1111-111111111111',
    name_ar: 'همبرجر بالجبنه',
    name_en: 'Cheeseburger Sandwich',
    price: 60.00,
    ingredients_ar: 'مايونيز، خس، طماطم، بصل، كاتشب، جبنه',
    ingredients_en: 'Mayonnaise, Lettuce, Tomato, Onion, Ketchup, Cheese',
    is_available: true,
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80',
  },
  {
    id: 'c1010000-0000-0000-0000-000000000003',
    category_id: '11111111-1111-1111-1111-111111111111',
    name_ar: 'فراخ بانيه فينو',
    name_en: 'Chicken Pane (Fino)',
    price: 60.00,
    ingredients_ar: 'خس، مايونيز، كاتشب',
    ingredients_en: 'Lettuce, Mayonnaise, Ketchup',
    is_available: false,
    is_featured: false,
    image_url: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&q=80',
  },
  {
    id: 'c1010000-0000-0000-0000-000000000004',
    category_id: '11111111-1111-1111-1111-111111111111',
    name_ar: 'فراخ بانيه سوري',
    name_en: 'Chicken Pane (Syrian Wrap)',
    price: 70.00,
    ingredients_ar: 'خس، مايونيز، كاتشب',
    ingredients_en: 'Lettuce, Mayonnaise, Ketchup',
    is_available: true,
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80',
  },
  {
    id: 'c1010000-0000-0000-0000-000000000005',
    category_id: '11111111-1111-1111-1111-111111111111',
    name_ar: 'شاورما فراخ سوري',
    name_en: 'Chicken Shawarma (Syrian Wrap)',
    price: 70.00,
    ingredients_ar: undefined,
    ingredients_en: undefined,
    is_available: true,
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&q=80',
  },
  {
    id: 'c1010000-0000-0000-0000-000000000006',
    category_id: '11111111-1111-1111-1111-111111111111',
    name_ar: 'أستربس سوري',
    name_en: 'Chicken Strips (Syrian Wrap)',
    price: 70.00,
    ingredients_ar: 'خس، مايونيز، كاتشب',
    ingredients_en: 'Lettuce, Mayonnaise, Ketchup',
    is_available: true,
    is_featured: false,
    image_url: 'https://images.unsplash.com/photo-1603064752734-4c48eff53d05?auto=format&fit=crop&q=80',
  },
  {
    id: 'c1010000-0000-0000-0000-000000000007',
    category_id: '11111111-1111-1111-1111-111111111111',
    name_ar: 'كفته سوري',
    name_en: 'Kofta (Syrian Wrap)',
    price: 40.00,
    ingredients_ar: 'مايونيز، كاتشب',
    ingredients_en: 'Mayonnaise, Ketchup',
    is_available: true,
    is_featured: false,
  },
  {
    id: 'c1010000-0000-0000-0000-000000000008',
    category_id: '11111111-1111-1111-1111-111111111111',
    name_ar: 'هوت دوج سوري',
    name_en: 'Hot Dog (Syrian Wrap)',
    price: 30.00,
    ingredients_ar: 'مايونيز، كاتشب',
    ingredients_en: 'Mayonnaise, Ketchup',
    is_available: true,
    is_featured: false,
  },
  {
    id: 'c1010000-0000-0000-0000-000000000009',
    category_id: '11111111-1111-1111-1111-111111111111',
    name_ar: 'بطاطس ساندوتش',
    name_en: 'Fries Sandwich (Fino)',
    price: 20.00,
    description_ar: 'فينو، مايونيز، كاتشب',
    description_en: 'Fino Bread, Mayonnaise, Ketchup',
    ingredients_ar: 'فينو، مايونيز، كاتشب',
    ingredients_en: 'Fino Bread, Mayonnaise, Ketchup',
    is_available: true,
    is_featured: false,
  },
  {
    id: 'c1010000-0000-0000-0000-000000000010',
    category_id: '11111111-1111-1111-1111-111111111111',
    name_ar: 'بطاطس سوري',
    name_en: 'Fries (Syrian Wrap)',
    price: 25.00,
    description_ar: 'عيش سوري، ثوميه، كاتشب',
    description_en: 'Syrian Bread, Garlic Dip, Ketchup',
    ingredients_ar: 'عيش سوري، ثوميه، كاتشب',
    ingredients_en: 'Syrian Bread, Garlic Dip, Ketchup',
    is_available: true,
    is_featured: false,
  },

  // Pastas
  {
    id: 'c1020000-0000-0000-0000-000000000001',
    category_id: '22222222-2222-2222-2222-222222222222',
    name_ar: 'سباجتي بالصلصه',
    name_en: 'Spaghetti Tomato Sauce',
    price: 25.00,
    is_available: true,
    is_featured: false,
    image_url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&q=80',
  },
  {
    id: 'c1020000-0000-0000-0000-000000000002',
    category_id: '22222222-2222-2222-2222-222222222222',
    name_ar: 'سباجتي باللحمه المفرومه',
    name_en: 'Spaghetti Bolognese',
    price: 50.00,
    is_available: true,
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80',
  },
  {
    id: 'c1020000-0000-0000-0000-000000000003',
    category_id: '22222222-2222-2222-2222-222222222222',
    name_ar: 'سباجتي باللحمه المفرومه بالجبنه',
    name_en: 'Spaghetti Bolognese with Cheese',
    price: 60.00,
    is_available: true,
    is_featured: true,
  },

  // Hot Drinks
  { id: 'c1030000-0000-0000-0000-000000000001', category_id: '33333333-3333-3333-3333-333333333333', name_ar: 'قهوة', name_en: 'Turkish Coffee', price: 20.00, is_available: true, is_featured: true, image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80' },
  { id: 'c1030000-0000-0000-0000-000000000002', category_id: '33333333-3333-3333-3333-333333333333', name_ar: 'شاي', name_en: 'Tea', price: 15.00, is_available: true, is_featured: false },
  { id: 'c1030000-0000-0000-0000-000000000003', category_id: '33333333-3333-3333-3333-333333333333', name_ar: 'ينسون', name_en: 'Anise Tea', price: 15.00, is_available: true, is_featured: false },
  { id: 'c1030000-0000-0000-0000-000000000004', category_id: '33333333-3333-3333-3333-333333333333', name_ar: 'نعناع', name_en: 'Mint Tea', price: 15.00, is_available: true, is_featured: false },
  { id: 'c1030000-0000-0000-0000-000000000005', category_id: '33333333-3333-3333-3333-333333333333', name_ar: 'كركاديه', name_en: 'Hibiscus Tea', price: 15.00, is_available: true, is_featured: false },
  { id: 'c1030000-0000-0000-0000-000000000006', category_id: '33333333-3333-3333-3333-333333333333', name_ar: 'نسكافيه', name_en: 'Nescafe', price: 20.00, is_available: true, is_featured: false },
  { id: 'c1030000-0000-0000-0000-000000000007', category_id: '33333333-3333-3333-3333-333333333333', name_ar: 'نسكافيه بلاك', name_en: 'Nescafe Black', price: 20.00, is_available: true, is_featured: false },
  { id: 'c1030000-0000-0000-0000-000000000008', category_id: '33333333-3333-3333-3333-333333333333', name_ar: 'هوت شوكلت', name_en: 'Hot Chocolate', price: 30.00, is_available: true, is_featured: true, image_url: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&q=80' },
  {
    id: 'c1030000-0000-0000-0000-000000000009',
    category_id: '33333333-3333-3333-3333-333333333333',
    name_ar: 'كابتشينو',
    name_en: 'Cappuccino',
    price: 25.00,
    is_available: true,
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1572442388796-11668602093f?auto=format&fit=crop&q=80',
    variants: [
      { id: 'v1', product_id: 'c1030000-0000-0000-0000-000000000009', name_ar: 'موكا', name_en: 'Mocha', price_delta: 0, is_available: true },
      { id: 'v2', product_id: 'c1030000-0000-0000-0000-000000000009', name_ar: 'فانيليا', name_en: 'Vanilla', price_delta: 0, is_available: true },
      { id: 'v3', product_id: 'c1030000-0000-0000-0000-000000000009', name_ar: 'بندق', name_en: 'Hazelnut', price_delta: 0, is_available: true },
    ],
    addons: [
      { id: 'a1', category_id: '33333333-3333-3333-3333-333333333333', name_ar: 'إضافة لبن', name_en: 'Extra Milk', price: 8.00, is_available: true }
    ]
  },

  // Cold Drinks
  {
    id: 'c1040000-0000-0000-0000-000000000001',
    category_id: '44444444-4444-4444-4444-444444444444',
    name_ar: 'كانز',
    name_en: 'Soda Can',
    price: 25.00,
    is_available: true,
    is_featured: false,
    variants: [
      { id: 'can-1', product_id: 'c1040000-0000-0000-0000-000000000001', name_ar: 'بيبسي', name_en: 'Pepsi', price_delta: 0, is_available: true },
      { id: 'can-2', product_id: 'c1040000-0000-0000-0000-000000000001', name_ar: 'سفن', name_en: '7Up', price_delta: 0, is_available: true },
      { id: 'can-3', product_id: 'c1040000-0000-0000-0000-000000000001', name_ar: 'تفاح', name_en: 'Mirinda Apple', price_delta: 0, is_available: true },
      { id: 'can-4', product_id: 'c1040000-0000-0000-0000-000000000001', name_ar: 'أناناس', name_en: 'Pineapple', price_delta: 0, is_available: true },
      { id: 'can-5', product_id: 'c1040000-0000-0000-0000-000000000001', name_ar: 'برتقال', name_en: 'Mirinda Orange', price_delta: 0, is_available: true },
      { id: 'can-6', product_id: 'c1040000-0000-0000-0000-000000000001', name_ar: 'بيرل', name_en: 'Birell', price_delta: 0, is_available: true },
    ]
  },
  {
    id: 'c1040000-0000-0000-0000-000000000002',
    category_id: '44444444-4444-4444-4444-444444444444',
    name_ar: 'أيس كوفي',
    name_en: 'Iced Coffee',
    price: 30.00,
    is_available: true,
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80',
    unresolved_notes: 'Menu includes phrase "إضافة لبن" after item. Pricing interpretation requires management confirmation.',
    addons: [
      { id: 'a2', category_id: '44444444-4444-4444-4444-444444444444', name_ar: 'إضافة لبن (اختياري)', name_en: 'Extra Milk (Optional)', price: 8.00, is_available: true }
    ]
  },
  { id: 'c1040000-0000-0000-0000-000000000003', category_id: '44444444-4444-4444-4444-444444444444', name_ar: 'زجاجة مياه', name_en: 'Water Bottle', price: 10.00, is_available: true, is_featured: false },
  { id: 'c1040000-0000-0000-0000-000000000004', category_id: '44444444-4444-4444-4444-444444444444', name_ar: 'عصير مانجا', name_en: 'Mango Juice', price: 35.00, is_available: true, is_featured: true, image_url: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80' },
  { id: 'c1040000-0000-0000-0000-000000000005', category_id: '44444444-4444-4444-4444-444444444444', name_ar: 'عصير فروله', name_en: 'Strawberry Juice', price: 30.00, is_available: true, is_featured: false },
  { id: 'c1040000-0000-0000-0000-000000000006', category_id: '44444444-4444-4444-4444-444444444444', name_ar: 'عصير جوافه', name_en: 'Guava Juice', price: 30.00, is_available: true, is_featured: false },
  { id: 'c1040000-0000-0000-0000-000000000007', category_id: '44444444-4444-4444-4444-444444444444', name_ar: 'عصير ليمون', name_en: 'Lemon Juice', price: 20.00, is_available: true, is_featured: false },
  {
    id: 'c1040000-0000-0000-0000-000000000008',
    category_id: '44444444-4444-4444-4444-444444444444',
    name_ar: 'عصير ليمون بالنعناع',
    name_en: 'Lemon Mint Juice',
    price: 20.00,
    is_available: true,
    is_featured: true,
    unresolved_notes: 'Menu includes "إضافة لبن" note preserved for management confirmation.'
  },
  { id: 'c1040000-0000-0000-0000-000000000009', category_id: '44444444-4444-4444-4444-444444444444', name_ar: 'عصير برتقال', name_en: 'Orange Juice', price: 20.00, is_available: true, is_featured: false },

  // Desserts
  { id: 'c1050000-0000-0000-0000-000000000001', category_id: '55555555-5555-5555-5555-555555555555', name_ar: 'وافل', name_en: 'Waffle', price: 25.00, is_available: true, is_featured: true, image_url: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&q=80' }
];

export const INITIAL_HALLS: Hall[] = [
  {
    id: 'h1000000-0000-0000-0000-000000000001',
    name_ar: 'قاعة الفخامة (Grand Royal Hall)',
    name_en: 'Grand Royal Hall',
    slug: 'grand-royal-hall',
    description_ar: 'قاعة مناسبات فاخرة تتسع للأعداد الكبيرة ومجهزة بأحدث الأنظمة الصوتية والإضاءة الاحترافية.',
    description_en: 'Luxurious event venue with sound system and professional lighting for large celebrations.',
    capacity: 150,
    base_price: 3500.00,
    price_per_hour: 700.00,
    full_day_price: 3500.00,
    amenities: ['نظام صوتي متطور', 'مسرح عرض', 'جناح كبار الزوار', 'تكييف مركزي', 'شاشة بروجكتور'],
    images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80'],
    is_active: true
  },
  {
    id: 'h1000000-0000-0000-0000-000000000002',
    name_ar: 'قاعة الاحتفالات الخاصة (Private Garden Room)',
    name_en: 'Private Garden Room',
    slug: 'private-garden-room',
    description_ar: 'قاعة أنيقة مثالية لأعياد الميلاد والاجتماعات العائلية الخاصة مع ديكورات مميزة.',
    description_en: 'Elegant hall perfect for birthday parties and private family gatherings.',
    capacity: 60,
    base_price: 1800.00,
    price_per_hour: 400.00,
    full_day_price: 1800.00,
    amenities: ['تراس خاص', 'نظام دي جيه وصوت', 'تجهيزات أعياد الميلاد', 'تكييف'],
    images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80'],
    is_active: true
  }
];

export const INITIAL_TABLES: DiningTable[] = [
  { id: 't1', table_number: 1, name: 'طاولة 1', capacity: 4, is_active: true },
  { id: 't2', table_number: 2, name: 'طاولة 2', capacity: 4, is_active: true },
  { id: 't3', table_number: 3, name: 'طاولة 3', capacity: 6, is_active: true },
  { id: 't4', table_number: 4, name: 'طاولة 4', capacity: 2, is_active: true },
  { id: 't5', table_number: 5, name: 'طاولة 5', capacity: 8, is_active: true },
];

export const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: 'i1', name_ar: 'بن قهوة تركي', name_en: 'Turkish Coffee Beans', unit: 'kg', current_stock: 5.5, reorder_threshold: 2.0, cost_per_unit: 450.00, is_active: true },
  { id: 'i2', name_ar: 'حليب كامل الدسم', name_en: 'Whole Milk', unit: 'l', current_stock: 18.0, reorder_threshold: 10.0, cost_per_unit: 40.00, is_active: true },
  { id: 'i3', name_ar: 'لحم مفروم طازج', name_en: 'Fresh Minced Meat', unit: 'kg', current_stock: 8.0, reorder_threshold: 3.0, cost_per_unit: 380.00, is_active: true },
  { id: 'i4', name_ar: 'عيش سوري', name_en: 'Syrian Bread', unit: 'pcs', current_stock: 40, reorder_threshold: 20, cost_per_unit: 3.00, is_active: true },
  { id: 'i5', name_ar: 'خبز فينو', name_en: 'Fino Bread', unit: 'pcs', current_stock: 60, reorder_threshold: 30, cost_per_unit: 2.00, is_active: true },
  { id: 'i6', name_ar: 'بطاطس جاهزة للقلي', name_en: 'French Fries', unit: 'kg', current_stock: 25.0, reorder_threshold: 10.0, cost_per_unit: 65.00, is_active: true }
];
