import { createClient } from '@supabase/supabase-js';
import { INITIAL_PRODUCTS, Product } from '@/data/catalog';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-mikings.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

// Public client for client components
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin service client for server components and API routes
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export interface DBProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  regular_price: number;
  sale_price: number;
  rating: number;
  reviews_count: number;
  badge?: string;
  in_stock: boolean;
  stock_quantity: number;
  warranty: string;
  condition: string;
  shutter_count?: number;
  description?: string;
  image_url: string;
  images: string[];
  specifications: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface DBOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  state: string;
  pincode: string;
  total_amount: number;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed';
  order_status: 'processing' | 'verified' | 'dispatched' | 'delivered' | 'cancelled';
  tracking_awb?: string;
  courier_partner?: string;
  notes?: string;
  created_at: string;
  items?: DBOrderItem[];
}

export interface DBOrderItem {
  id: string;
  order_id: string;
  product_slug: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  image_url?: string;
}

/**
 * Fetch all products from Supabase with graceful fallback to INITIAL_PRODUCTS
 */
export async function getProductsFromSupabase(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return INITIAL_PRODUCTS;
    }

    return data.map((d: DBProduct) => ({
      id: d.id,
      slug: d.slug,
      name: d.name,
      brand: d.brand,
      category: d.category as any,
      regularPrice: Number(d.regular_price),
      salePrice: Number(d.sale_price),
      rating: Number(d.rating) || 4.8,
      reviewCount: d.reviews_count || 18,
      badge: d.badge || undefined,
      inStock: d.in_stock,
      warranty: d.warranty,
      condition: (d.condition as any) || 'Certified Pre-Owned',
      description: d.description || '',
      imageUrl: d.image_url,
      images: d.images && d.images.length > 0 ? d.images : [d.image_url],
      specs: d.specifications || {},
    }));
  } catch (err) {
    console.warn('Fallback to catalog.ts products:', err);
    return INITIAL_PRODUCTS;
  }
}

/**
 * Save new order into Supabase
 */
export async function createSupabaseOrder(orderData: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  totalAmount: number;
  paymentMethod: string;
  items: Array<{
    slug: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }>;
}) {
  const orderNumber = `MIK-${Date.now().toString().slice(-6)}`;

  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      customer_phone: orderData.customerPhone,
      shipping_address: orderData.shippingAddress,
      city: orderData.city,
      state: orderData.state,
      pincode: orderData.pincode,
      total_amount: orderData.totalAmount,
      payment_method: orderData.paymentMethod,
      payment_status: 'pending',
      order_status: 'processing',
    })
    .select()
    .single();

  if (orderError) throw orderError;

  if (orderData.items && orderData.items.length > 0) {
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_slug: item.slug,
      product_name: item.name,
      unit_price: item.price,
      quantity: item.quantity,
      image_url: item.imageUrl,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) console.error('Error inserting order items:', itemsError);
  }

  return order;
}
