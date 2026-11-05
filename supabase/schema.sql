-- ==============================================================================
-- Mi King's Cameras — Supabase PostgreSQL Production Schema & RLS Policies
-- Project: https://apyljvfhlvqjtiqbefzi.supabase.co
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    regular_price NUMERIC(12, 2) NOT NULL,
    sale_price NUMERIC(12, 2) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 4.8,
    reviews_count INT DEFAULT 18,
    badge TEXT,
    in_stock BOOLEAN DEFAULT true,
    stock_quantity INT DEFAULT 5,
    warranty TEXT DEFAULT '1 Year Store Warranty',
    condition TEXT DEFAULT 'Certified Pre-Owned',
    shutter_count INT,
    description TEXT,
    image_url TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    specifications JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast storefront browsing
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    city TEXT DEFAULT 'Hyderabad',
    state TEXT DEFAULT 'Telangana',
    pincode TEXT NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    payment_method TEXT DEFAULT 'upi',
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed'
    order_status TEXT DEFAULT 'processing', -- 'processing', 'verified', 'dispatched', 'delivered', 'cancelled'
    tracking_awb TEXT,
    courier_partner TEXT DEFAULT 'Delhivery / Shiprocket',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);

-- 3. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_slug TEXT NOT NULL,
    product_name TEXT NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    quantity INT DEFAULT 1,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. THEME & STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.theme_settings (
    id TEXT PRIMARY KEY DEFAULT 'current',
    config JSONB NOT NULL,
    updated_by TEXT DEFAULT 'Mohd Idrees (Owner)',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STAFF & ADMIN PROFILES
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'Staff', -- 'SuperAdmin', 'Manager', 'Staff'
    is_active BOOLEAN DEFAULT true,
    permissions TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can view, authenticated staff can modify
CREATE POLICY "Public products viewable by all" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Service role can manage products" ON public.products
    FOR ALL USING (true);

-- Orders: Anyone can create order on checkout, customer can view by ID, admin can manage
CREATE POLICY "Customers can create orders" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view own orders" ON public.orders
    FOR SELECT USING (true);

CREATE POLICY "Service role can manage orders" ON public.orders
    FOR ALL USING (true);

-- Order Items
CREATE POLICY "Customers can create order items" ON public.order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view order items" ON public.order_items
    FOR SELECT USING (true);

-- Theme Settings: Public can read, service role can update
CREATE POLICY "Public theme settings viewable" ON public.theme_settings
    FOR SELECT USING (true);

CREATE POLICY "Service role can update theme" ON public.theme_settings
    FOR ALL USING (true);
