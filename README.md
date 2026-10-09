# EL VILLA — Complete Café, Restaurant & Event Venue Management System

A full-stack, bilingual (Arabic & English), database-driven web application and operational management platform for **El Villa**, a café, canteen, and event venue featuring independently bookable halls, QR table ordering, POS cashier terminal, Kitchen Display System (KDS), hall reservation workflows, inventory management, policy enforcement, and website CMS.

---

## 🚀 Technology Stack

- **Framework**: Next.js (App Router, Server Components, Route Handlers)
- **Language**: TypeScript (Strict Mode)
- **Styling & System**: Tailwind CSS v4, Custom Warm Café Visual Palette, Cairo Font with dynamic RTL/LTR support
- **Icons & Primitives**: Lucide Icons, accessible custom UI components (Button, Card, Dialog, Badge, Input)
- **Database & Auth**: Supabase PostgreSQL, Row Level Security (RLS), Supabase Auth & Storage
- **Validation**: Zod & React Hook Form
- **Testing**: Vitest unit & integration test runner

---

## 📋 Business Information & Seed Rules

- **Business Name**: El Villa (إل فيلا)
- **Management Contact**: `01228852203` (Direct Click-to-Call)
- **Currency**: EGP (Egyptian Pound)
- **Timezone**: Africa/Cairo
- **Languages**: Arabic (Default), English (Full RTL / LTR switching)

### 3 Key Business Policies
1. **Minimum Order Amount**: Configurable subtotal minimum (Default: 20 EGP).
2. **Minimum Consumption Per Person**: Configurable per-person rule snapshotting guest count at table session start.
3. **Outside Food and Drinks**: Prohibited venue policy. Staff can authorize recording a 15 EGP per person fee violation on top of the bill.

---

## 🍽️ Seeded Actual Menu

- **Sandwiches**:
  - همبرجر ساندوتش — 50 EGP
  - همبرجر بالجبنه — 60 EGP
  - فراخ بانيه فينو — 60 EGP
  - فراخ بانيه سوري — 70 EGP
  - شاورما فراخ سوري — 70 EGP
  - أستربس سوري — 70 EGP
  - كفته سوري — 40 EGP
  - هوت دوج سوري — 30 EGP
  - بطاطس ساندوتش — 20 EGP
  - بطاطس سوري — 25 EGP
- **Pastas**:
  - سباجتي بالصلصه — 25 EGP
  - سباجتي باللحمه المفرومه — 50 EGP
  - سباجتي باللحمه المفرومه بالجبنه — 60 EGP
- **Hot Drinks**:
  - قهوة — 20 EGP, شاي — 15 EGP, ينسون — 15 EGP, نعناع — 15 EGP, كركاديه — 15 EGP, نسكافيه — 20 EGP, نسكافيه بلاك — 20 EGP, هوت شوكلت — 30 EGP, كابتشينو — 25 EGP (Variants: موكا, فانيليا, بندق | Add-on: إضافة لبن — 8 EGP)
- **Cold Drinks**:
  - كانز — 25 EGP (Variants: بيبسي, سفن, تفاح, أناناس, برتقال, بيرل)
  - أيس كوفي — 30 EGP (With milk option note)
  - زجاجة مياه — 10 EGP
  - عصير مانجا — 35 EGP, عصير فروله — 30 EGP, عصير جوافه — 30 EGP, عصير ليمون — 20 EGP, عصير ليمون بالنعناع — 20 EGP, عصير برتقال — 20 EGP
- **Desserts**:
  - وافل — 25 EGP

---

## 🏗️ Architecture & Modules Overview

### 1. Public Website (`src/app/(public)/`)
- **Homepage (`/`)**: Hero section, category previews, featured items, halls preview, birthday section, amenities, and contact info.
- **About (`/about`)**: Venue story and facilities.
- **Menu (`/menu`)**: Interactive search, category filtering, item detail & variant/add-on selector modal.
- **Halls & Events (`/halls`)**: Hall listings, capacity, amenities, base pricing, and interactive booking request modal.
- **Contact (`/contact`)**: Direct click-to-call management phone `01228852203`.

### 2. QR Table Ordering (`src/app/qr/[tableId]/`)
- Exclusive indoor table session ordering with live status tracking (`pending` -> `preparing` -> `ready` -> `served`).
- Minimum order subtotal validation (20 EGP) and outside food policy notice.

### 3. Administrative Platform (`src/app/admin/`)
- **Dashboard (`/admin`)**: Operational metrics (Orders today, recorded revenue, active table sessions, pending bookings, low-stock alerts, cashier shift status).
- **POS Terminal (`/admin/pos`)**: Cashier shifts, table session orders, quick-add menu items, discounts, outside food fee recording, cash payments, and Arabic-friendly printable receipts.
- **Kitchen Display KDS (`/admin/kitchen`)**: Live status updates for pending, preparing, and ready orders.
- **Table & QR Manager (`/admin/tables`)**: Table grid, session opening with guest counts, and printable QR codes.
- **Menu Manager (`/admin/menu`)**: Prices, availability toggles, variants, and add-ons.
- **Hall Bookings (`/admin/bookings`)**: Pending request approvals/rejections with booking overlap detection.
- **Inventory & Waste (`/admin/inventory`)**: Ingredient stock tracking, reorder alerts, and waste log.
- **Reports & Analytics (`/admin/reports`)**: Daily sales reports, category breakdowns, and shift reconciliations.
- **CMS & Policies (`/admin/cms`)**: Editable website text, minimum order amount, min consumption, and outside food fees.
- **Staff & Permissions (`/admin/staff`)**: Granular RBAC permissions matrix inspector and staff roles.

---

## 🛠️ Local Development Instructions

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Run local development server
npm run dev

# 3. Open browser
http://localhost:3000
```

---

## 🧪 Testing

```bash
# Run unit and integration tests via Vitest
npx vitest run
```

---

## 🔒 Supabase Migrations & Owner Provisioning

1. Execute `supabase/migrations/001_core_schema.sql` to apply the database schema, RLS policies, and triggers.
2. Execute `supabase/migrations/002_seed_data.sql` to populate the actual menu, categories, default roles, and business policies.
3. Provision the initial Owner account via Supabase Auth Admin API or console and assign the `Owner` role in `user_roles`.

---

## 📦 Vercel Deployment

1. Import repository to Vercel.
2. Set Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy!
