-- ==========================================
-- EL VILLA CAFE & VENUE MANAGEMENT SEED DATA
-- Migration: 002_seed_data.sql
-- ==========================================

-- 1. SEED ROLES
INSERT INTO public.roles (name, description, is_system) VALUES
('Owner', 'Full business-level access and permission administration', true),
('General Manager', 'Operational management across all café and venue features', true),
('Administrator', 'System and administrative workflow management', true),
('Booking Manager', 'Handles event hall availability and booking requests', true),
('Cashier', 'Handles POS terminal, cashier shifts, and payments', true),
('Kitchen Staff', 'Manages Kitchen Display System (KDS) and order preparation', true),
('Inventory Manager', 'Manages ingredients, recipes, purchases, and waste', true),
('Accountant', 'Access to financial reports and shift reconciliations', true),
('Customer', 'Registered hall booking customer', true)
ON CONFLICT (name) DO NOTHING;

-- 2. SEED PERMISSIONS
INSERT INTO public.permissions (code, module, description) VALUES
('dashboard.view', 'dashboard', 'View administrative dashboard metrics'),
('settings.manage', 'settings', 'Manage business settings and policies'),
('staff.view', 'staff', 'View staff accounts and activity'),
('staff.manage', 'staff', 'Create, update, and manage staff accounts'),
('roles.manage', 'roles', 'Assign and update user roles and permissions'),
('products.view', 'menu', 'View menu categories and products'),
('products.manage', 'menu', 'Create, edit, and archive menu products'),
('orders.view', 'orders', 'View active and historical table orders'),
('orders.manage', 'orders', 'Update order statuses and details'),
('pos.access', 'pos', 'Access point-of-sale cashier interface'),
('payments.view', 'payments', 'View payment transactions'),
('payments.record', 'payments', 'Record customer cash payments'),
('payments.refund', 'payments', 'Process payment refund requests'),
('bookings.view', 'bookings', 'View hall bookings calendar and requests'),
('bookings.manage', 'bookings', 'Manage hall bookings'),
('bookings.approve', 'bookings', 'Approve or reject hall booking requests'),
('bookings.cancel', 'bookings', 'Cancel hall bookings'),
('inventory.view', 'inventory', 'View ingredient stock levels'),
('inventory.manage', 'inventory', 'Manage ingredients and recipes'),
('inventory.receive', 'inventory', 'Receive supplier purchase orders'),
('inventory.waste', 'inventory', 'Record inventory waste and spoilage'),
('inventory.adjust', 'inventory', 'Perform stock counts and adjustments'),
('finance.view', 'finance', 'View financial and sales reports'),
('finance.manage', 'finance', 'Manage financial expenses and shifts'),
('reports.view', 'reports', 'View operational reports'),
('cms.manage', 'cms', 'Manage public website content and gallery'),
('audit.view', 'audit', 'View security audit logs')
ON CONFLICT (code) DO NOTHING;

-- Grant all permissions to Owner role
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'Owner'
ON CONFLICT DO NOTHING;

-- 3. SEED BUSINESS CONFIGURATION & VENUE POLICIES
INSERT INTO public.business_settings (setting_key, setting_value, description) VALUES
('business_info', '{"name_ar": "إل فيلا", "name_en": "El Villa", "phone": "01228852203", "currency": "EGP", "timezone": "Africa/Cairo", "default_language": "ar"}'::jsonb, 'Core business info'),
('minimum_order_subtotal', '{"amount": 20.00, "enabled": true, "applies_to": "qr_table"}'::jsonb, 'Configurable minimum order subtotal')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO public.venue_policies (policy_type, title_ar, title_en, description_ar, description_en, fee_per_person, min_subtotal_amount, is_enabled) VALUES
('outside_food', 'المأكولات والمشروبات الخارجية', 'Outside Food & Drinks', 'ممنوع إدخال المأكولات والمشروبات الخارجية. في حالة إدخالها، قد يتم فرض رسوم إضافية بقيمة 15 جنيهاً عن كل شخص فوق الحساب.', 'Outside food and drinks are prohibited. If brought in, an additional fee of 15 EGP per person may be imposed.', 15.00, 0.00, true),
('minimum_order', 'الحد الأدنى للطلب', 'Minimum Order Subtotal', 'الحد الأدنى للطلب هو 20 جنيهاً.', 'Minimum order amount is 20 EGP.', 0.00, 20.00, true),
('min_consumption', 'الحد الأدنى للاستهلاك الفردي', 'Minimum Consumption Per Person', 'سياسة الحد الأدنى للاستهلاك الفردي داخل المكان تتطلب تأكيد الإدارة للحد الأدنى المحدد.', 'Per-person minimum consumption policy inside the venue requires management confirmation for the exact amount.', 0.00, 0.00, true)
ON CONFLICT (policy_type) DO NOTHING;

-- 4. SEED MENU CATEGORIES
INSERT INTO public.categories (id, name_ar, name_en, slug, display_order) VALUES
('11111111-1111-1111-1111-111111111111', 'ساندوتشات', 'Sandwiches', 'sandwiches', 1),
('22222222-2222-2222-2222-222222222222', 'باستا', 'Pastas', 'pastas', 2),
('33333333-3333-3333-3333-333333333333', 'مشروبات ساخنة', 'Hot Drinks', 'hot-drinks', 3),
('44444444-4444-4444-4444-444444444444', 'مشروبات باردة', 'Cold Drinks', 'cold-drinks', 4),
('55555555-5555-5555-5555-555555555555', 'حلويات', 'Desserts', 'desserts', 5)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED PRODUCTS
-- Sandwiches
INSERT INTO public.products (id, category_id, name_ar, name_en, price, ingredients_ar, ingredients_en) VALUES
('c1010000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'همبرجر ساندوتش', 'Hamburger Sandwich', 50.00, 'مايونيز، كاتشب، خس، طماطم، بصل', 'Mayonnaise, Ketchup, Lettuce, Tomato, Onion'),
('c1010000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'همبرجر بالجبنه', 'Cheeseburger Sandwich', 60.00, 'مايونيز، خس، طماطم، بصل، كاتشب، جبنه', 'Mayonnaise, Lettuce, Tomato, Onion, Ketchup, Cheese'),
('c1010000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'فراخ بانيه فينو', 'Chicken Pane (Fino)', 60.00, 'خس، مايونيز، كاتشب', 'Lettuce, Mayonnaise, Ketchup'),
('c1010000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'فراخ بانيه سوري', 'Chicken Pane (Syrian Wrap)', 70.00, 'خس، مايونيز، كاتشب', 'Lettuce, Mayonnaise, Ketchup'),
('c1010000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'شاورما فراخ سوري', 'Chicken Shawarma (Syrian Wrap)', 70.00, NULL, NULL),
('c1010000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'أستربس سوري', 'Chicken Strips (Syrian Wrap)', 70.00, 'خس، مايونيز، كاتشب', 'Lettuce, Mayonnaise, Ketchup'),
('c1010000-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'كفته سوري', 'Kofta (Syrian Wrap)', 40.00, 'مايونيز، كاتشب', 'Mayonnaise, Ketchup'),
('c1010000-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'هوت دوج سوري', 'Hot Dog (Syrian Wrap)', 30.00, 'مايونيز، كاتشب', 'Mayonnaise, Ketchup'),
('c1010000-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', 'بطاطس ساندوتش', 'Fries Sandwich (Fino)', 20.00, 'فينو، مايونيز، كاتشب', 'Fino Bread, Mayonnaise, Ketchup'),
('c1010000-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', 'بطاطس سوري', 'Fries (Syrian Wrap)', 25.00, 'عيش سوري، ثوميه، كاتشب', 'Syrian Bread, Garlic Dip, Ketchup')
ON CONFLICT (id) DO NOTHING;

-- Pastas
INSERT INTO public.products (id, category_id, name_ar, name_en, price) VALUES
('c1020000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'سباجتي بالصلصه', 'Spaghetti Tomato Sauce', 25.00),
('c1020000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'سباجتي باللحمه المفرومه', 'Spaghetti Bolognese', 50.00),
('c1020000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'سباجتي باللحمه المفرومه بالجبنه', 'Spaghetti Bolognese with Cheese', 60.00)
ON CONFLICT (id) DO NOTHING;

-- Hot Drinks
INSERT INTO public.products (id, category_id, name_ar, name_en, price) VALUES
('c1030000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'قهوة', 'Turkish Coffee', 20.00),
('c1030000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'شاي', 'Tea', 15.00),
('c1030000-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'ينسون', 'Anise Tea', 15.00),
('c1030000-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 'نعناع', 'Mint Tea', 15.00),
('c1030000-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', 'كركاديه', 'Hibiscus Tea', 15.00),
('c1030000-0000-0000-0000-000000000006', '33333333-3333-3333-3333-333333333333', 'نسكافيه', 'Nescafe', 20.00),
('c1030000-0000-0000-0000-000000000007', '33333333-3333-3333-3333-333333333333', 'نسكافيه بلاك', 'Nescafe Black', 20.00),
('c1030000-0000-0000-0000-000000000008', '33333333-3333-3333-3333-333333333333', 'هوت شوكلت', 'Hot Chocolate', 30.00),
('c1030000-0000-0000-0000-000000000009', '33333333-3333-3333-3333-333333333333', 'كابتشينو', 'Cappuccino', 25.00)
ON CONFLICT (id) DO NOTHING;

-- Cappuccino Variants
INSERT INTO public.product_variants (product_id, name_ar, name_en, price_delta) VALUES
('c1030000-0000-0000-0000-000000000009', 'موكا', 'Mocha', 0.00),
('c1030000-0000-0000-0000-000000000009', 'فانيليا', 'Vanilla', 0.00),
('c1030000-0000-0000-0000-000000000009', 'بندق', 'Hazelnut', 0.00)
ON CONFLICT DO NOTHING;

-- Milk Add-on for Hot Drinks Category
INSERT INTO public.product_addons (category_id, name_ar, name_en, price) VALUES
('33333333-3333-3333-3333-333333333333', 'إضافة لبن', 'Extra Milk', 8.00)
ON CONFLICT DO NOTHING;

-- Cold Drinks
INSERT INTO public.products (id, category_id, name_ar, name_en, price, unresolved_notes) VALUES
('c1040000-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'كانز', 'Soda Can', 25.00, NULL),
('c1040000-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'أيس كوفي', 'Iced Coffee', 30.00, 'Note: Menu contains "إضافة لبن" after item. Milk option configured; pricing interpretation requires management confirmation.'),
('c1040000-0000-0000-0000-000000000003', '44444444-4444-4444-4444-444444444444', 'زجاجة مياه', 'Water Bottle', 10.00, NULL),
('c1040000-0000-0000-0000-000000000004', '44444444-4444-4444-4444-444444444444', 'عصير مانجا', 'Mango Juice', 35.00, NULL),
('c1040000-0000-0000-0000-000000000005', '44444444-4444-4444-4444-444444444444', 'عصير فروله', 'Strawberry Juice', 30.00, NULL),
('c1040000-0000-0000-0000-000000000006', '44444444-4444-4444-4444-444444444444', 'عصير جوافه', 'Guava Juice', 30.00, NULL),
('c1040000-0000-0000-0000-000000000007', '44444444-4444-4444-4444-444444444444', 'عصير ليمون', 'Lemon Juice', 20.00, NULL),
('c1040000-0000-0000-0000-000000000008', '44444444-4444-4444-4444-444444444444', 'عصير ليمون بالنعناع', 'Lemon Mint Juice', 20.00, 'Note: Menu contains "إضافة لبن" after item. Preserved as unresolved note for management confirmation.'),
('c1040000-0000-0000-0000-000000000009', '44444444-4444-4444-4444-444444444444', 'عصير برتقال', 'Orange Juice', 20.00, NULL)
ON CONFLICT (id) DO NOTHING;

-- Soda Can Variants
INSERT INTO public.product_variants (product_id, name_ar, name_en, price_delta) VALUES
('c1040000-0000-0000-0000-000000000001', 'بيبسي', 'Pepsi', 0.00),
('c1040000-0000-0000-0000-000000000001', 'سفن', '7Up', 0.00),
('c1040000-0000-0000-0000-000000000001', 'تفاح', 'Mirinda Apple', 0.00),
('c1040000-0000-0000-0000-000000000001', 'أناناس', 'Pineapple', 0.00),
('c1040000-0000-0000-0000-000000000001', 'برتقال', 'Mirinda Orange', 0.00),
('c1040000-0000-0000-0000-000000000001', 'بيرل', 'Birell', 0.00)
ON CONFLICT DO NOTHING;

-- Desserts
INSERT INTO public.products (id, category_id, name_ar, name_en, price) VALUES
('c1050000-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555', 'وافل', 'Waffle', 25.00)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED EVENT HALLS
INSERT INTO public.halls (id, name_ar, name_en, slug, description_ar, description_en, capacity, base_price, amenities, images) VALUES
('h1000000-0000-0000-0000-000000000001', 'قاعة الفخامة (Grand Royal Hall)', 'Grand Royal Hall', 'grand-royal-hall', 'قاعة مناسبات فاخرة تتسع للأعداد الكبيرة ومجهزة بأحدث الأنظمة الصوتية والإضاءة الاحترافية.', 'Luxurious event venue with sound system and professional lighting for large celebrations.', 150, 3500.00, '["Sound System", "Stage", "VIP Lounge", "Air Conditioning", "Projector"]'::jsonb, '["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80"]'::jsonb),
('h1000000-0000-0000-0000-000000000002', 'قاعة الاحتفالات الخاصة (Private Garden Room)', 'Private Garden Room', 'private-garden-room', 'قاعة أنيقة مثالية لأعياد الميلاد والاجتماعات العائلية الخاصة مع ديكورات مميزة.', 'Elegant hall perfect for birthday parties and private family gatherings.', 60, 1800.00, '["Private Terrace", "Sound System", "Birthday Decoration Setup", "Air Conditioning"]'::jsonb, '["https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 7. SEED DINING TABLES
INSERT INTO public.dining_tables (table_number, name, capacity) VALUES
(1, 'طاولة 1 (Table 1)', 4),
(2, 'طاولة 2 (Table 2)', 4),
(3, 'طاولة 3 (Table 3)', 6),
(4, 'طاولة 4 (Table 4)', 2),
(5, 'طاولة 5 (Table 5)', 8)
ON CONFLICT (table_number) DO NOTHING;

-- 8. SEED CMS SECTIONS
INSERT INTO public.cms_sections (section_key, title_ar, title_en, content_ar, content_en) VALUES
('hero', 'أهلاً بكم في إل فيلا', 'Welcome to El Villa', 'المكان الأمثل لتناول أشهى الوجبات والمشروبات واستضافة أجمل المناسبات والفعاليات.', 'The perfect place for delicious food, drinks, and memorable private events.'),
('about', 'عن إل فيلا', 'About El Villa', 'إل فيلا هو كافيه ومطعم وقاعة مناسبات متكاملة يوفر أجواءً راقية وخدمات متميزة لضيوفه.', 'El Villa is an integrated cafe, canteen, and venue offering warm hospitality and premium service.'),
('contact_info', 'تواصل معنا', 'Contact Us', 'للحجز والاستفسارات، يرجى التواصل عبر الرقم الموحد للإدارة: 01228852203', 'For inquiries and reservations, contact management at 01228852203')
ON CONFLICT (section_key) DO NOTHING;
