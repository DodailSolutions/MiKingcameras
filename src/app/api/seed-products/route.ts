import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-service';
import { INITIAL_PRODUCTS } from '@/data/catalog';

export const dynamic = 'force-dynamic';

/**
 * Admin Product Seeder Endpoint
 * Protected against unauthorized cyber attacks and abuse with bearer token authentication
 */
export async function POST(req: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      return NextResponse.json(
        { success: false, error: 'Database environment variables not configured on this host.' },
        { status: 503 }
      );
    }
    // Security check: Validate admin secret authorization token
    const authHeader = req.headers.get('authorization');
    const secretKey = process.env.ADMIN_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    // In production or when key is set, require Bearer token
    if (secretKey && (!authHeader || !authHeader.endsWith(secretKey))) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid or missing administrator credentials.' },
        { status: 401 }
      );
    }

    const formatted = INITIAL_PRODUCTS.map((p) => ({
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      category: p.category,
      regular_price: p.regularPrice,
      sale_price: p.salePrice,
      rating: p.rating,
      reviews_count: p.reviewCount,
      badge: p.badge || null,
      in_stock: p.inStock,
      stock_quantity: 5,
      warranty: p.warranty,
      condition: p.condition,
      description: p.description,
      image_url: p.imageUrl,
      images: p.images || [p.imageUrl],
      specifications: p.specs || {},
    }));

    const { data, error } = await supabaseAdmin
      .from('products')
      .upsert(formatted, { onConflict: 'slug' })
      .select('id, slug, name');

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${data.length} products to Supabase!`,
      count: data.length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
