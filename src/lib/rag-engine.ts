import { INITIAL_PRODUCTS, Product } from '@/data/catalog';
import { formatINR } from '@/lib/utils';

export interface AuthenticatedCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  orders?: Array<{
    id: string;
    orderNumber: string;
    date: string;
    items: Array<{ name: string; price: number; quantity: number }>;
    total: number;
    status: string;
    trackingId?: string;
    courierPartner?: string;
  }>;
}

export interface RAGResponse {
  answer: string;
  sourceContexts: string[];
  suggestedAction?: {
    type: 'link' | 'product' | 'order' | 'whatsapp';
    label: string;
    href: string;
  };
  matchedProducts?: Array<{
    id: string;
    name: string;
    price: number;
    slug: string;
    condition: string;
  }>;
}

const PUBLIC_STORE_SERVICES = [
  {
    topic: 'Store Location & Timings',
    keywords: ['location', 'address', 'visit', 'timing', 'hours', 'open', 'hyderabad', 'where', 'direction'],
    text: "Mi King's DSLR Camera Shop flagship showroom is located at Pillar No. 103, Bank Colony, Near Tadbun, Mir Alam Tank, Bahadurpura, Hyderabad, Telangana 500064.\n\nStore timings: Monday to Sunday from 11:00 AM to 10:00 PM.",
  },
  {
    topic: '1-Year Store Warranty',
    keywords: ['warranty', 'guarantee', 'repair', 'protection'],
    text: "Every certified pre-owned and new camera body, lens, and equipment sold by Mi King's Cameras includes a comprehensive 1-Year Store Warranty. This covers optical sensors, shutter mechanisms, electronic motherboards, and autofocus motors. Liquid damage and accidental physical drops are excluded.",
  },
  {
    topic: '25-Point Inspection Protocol',
    keywords: ['inspection', 'testing', 'quality', 'check', 'certified', 'condition'],
    text: "All pre-owned cameras undergo rigorous 25-point testing including: hot pixel sensor scans, shutter actuation count verification, optical element fungus & haze inspection, image stabilization testing, and clean battery health checks.",
  },
  {
    topic: '30-Day Return & Exchange Policy',
    keywords: ['return', 'exchange', 'replace', 'refund'],
    text: "We offer a 30-Day Store Exchange Policy on all camera gear. If an item develops a technical defect, we provide replacement or in-store exchange within 30 days of purchase.",
  },
  {
    topic: 'Shipping & Delivery Services',
    keywords: ['shipping', 'delivery', 'courier', 'dispatch', 'delhivery', 'bluedart'],
    text: "Free insured shipping is provided on all orders above ₹5,000 across India via Delhivery Surface and BlueDart Air. In Hyderabad, customers can collect gear in person from our Mir Alam Tank showroom or request local same-day express delivery.",
  },
  {
    topic: '18% GST Tax Invoicing',
    keywords: ['gst', 'invoice', 'tax', 'bill', 'business'],
    text: "All purchases include an official 18% GST Tax Invoice (HSN 9006 for Cameras, HSN 9002 for Lenses) with valid GSTIN. Businesses and professionals can claim full GST input tax credits.",
  },
  {
    topic: 'Direct WhatsApp Equipment Consultation',
    keywords: ['contact', 'phone', 'whatsapp', 'call', 'talk', 'specialist', 'idrees'],
    text: "You can consult directly with Founder Mohd Idrees on WhatsApp for personalized gear advice, equipment reservations, or trade-in inquiries at +91 90322 85420 or +91 63058 75376.",
  },
];

/**
 * Clean plain-text formatting helper: removes raw markdown asterisks and cleans up text
 */
function cleanFormatting(str: string): string {
  return str.replace(/\*\*/g, '').trim();
}

/**
 * Core RAG Retrieval & Answer Engine with Strict Privacy Boundaries
 */
export async function queryRAGAssistant(
  userPrompt: string,
  user?: AuthenticatedCustomer | null
): Promise<RAGResponse> {
  const query = userPrompt.toLowerCase().trim();

  // -------------------------------------------------------------
  // PRIVACY BOUNDARY: Check for order / customer private data query
  // -------------------------------------------------------------
  const isOrderQuery =
    query.includes('order') ||
    query.includes('track') ||
    query.includes('consignment') ||
    query.includes('awb') ||
    query.includes('invoice') ||
    /(mik[- ]?\d{4,8}|\b\d{6}\b)/i.test(query);

  if (isOrderQuery) {
    // If user is NOT logged in: strictly refuse and guide to secure login portal
    if (!user || !user.id) {
      return {
        answer:
          "For customer privacy and account security, order tracking details, consignment status, and invoices are strictly protected. To view your orders, please sign in to your verified customer account, or use our secure Track Order portal.",
        sourceContexts: ['Privacy Protection Protocol'],
        suggestedAction: {
          type: 'order',
          label: 'Sign In to View Orders',
          href: '/account',
        },
      };
    }

    // User IS logged in: search ONLY user's own orders
    const userOrders = user.orders || [];
    const orderRegex = /(mik[- ]?\d{4,8}|\b\d{6}\b)/i;
    const match = query.match(orderRegex);

    if (match) {
      const cleanNum = match[1].replace(/[- ]/g, '').toUpperCase();
      const matchedOrder = userOrders.find((o) =>
        o.orderNumber.replace(/[- ]/g, '').toUpperCase().includes(cleanNum)
      );

      if (matchedOrder) {
        const itemsList = matchedOrder.items.map((i) => `${i.name} (Qty: ${i.quantity})`).join(', ');
        return {
          answer: `Here is the status for your order ${matchedOrder.orderNumber}:\n\nStatus: ${matchedOrder.status}\nDate: ${matchedOrder.date}\nEquipment: ${itemsList}\nTotal: ${formatINR(matchedOrder.total)}\nCourier: ${matchedOrder.courierPartner || 'Delhivery Express'}\nTracking ID: ${matchedOrder.trackingId || 'Generated upon dispatch'}`,
          sourceContexts: [`Customer Account Orders (${user.email})`],
          suggestedAction: {
            type: 'order',
            label: `Track ${matchedOrder.orderNumber}`,
            href: `/track?orderId=${matchedOrder.orderNumber}`,
          },
        };
      } else {
        return {
          answer: `We could not find an order matching that reference under your signed-in account (${user.email}). Please verify the order number in your account order history.`,
          sourceContexts: ['Customer Account'],
          suggestedAction: {
            type: 'link',
            label: 'View Order History',
            href: '/account',
          },
        };
      }
    } else if (userOrders.length > 0) {
      const latestOrder = userOrders[0];
      const itemsList = latestOrder.items.map((i) => `${i.name}`).join(', ');
      return {
        answer: `Hello ${user.name}! Your most recent order ${latestOrder.orderNumber} is currently ${latestOrder.status}.\n\nItems: ${itemsList}\nTotal: ${formatINR(latestOrder.total)}\nDate: ${latestOrder.date}`,
        sourceContexts: [`Customer Account: ${user.email}`],
        suggestedAction: {
          type: 'order',
          label: `Track Order ${latestOrder.orderNumber}`,
          href: `/track?orderId=${latestOrder.orderNumber}`,
        },
      };
    } else {
      return {
        answer: `Hello ${user.name}! You do not currently have any active orders under your account (${user.email}). Feel free to explore our camera and lens collection.`,
        sourceContexts: ['Customer Account'],
        suggestedAction: {
          type: 'link',
          label: 'Explore Catalog',
          href: '/catalog',
        },
      };
    }
  }

  // -------------------------------------------------------------
  // PUBLIC INFORMATION 1: Product Catalog & Equipment Inventory
  // -------------------------------------------------------------
  const matchingProducts = INITIAL_PRODUCTS.filter((p) => {
    return (
      query.includes(p.brand.toLowerCase()) ||
      p.name.toLowerCase().split(' ').some((word) => word.length > 2 && query.includes(word)) ||
      (query.includes('dslr') && p.category === 'dslr') ||
      (query.includes('lens') && p.category === 'lenses') ||
      (query.includes('drone') && p.category === 'drones') ||
      (query.includes('mirrorless') && p.category === 'mirrorless')
    );
  }).slice(0, 3);

  if (matchingProducts.length > 0 && !query.includes('warranty') && !query.includes('location')) {
    const productListText = matchingProducts
      .map(
        (p) =>
          `• ${p.name}\n  Price: ${formatINR(p.salePrice)} (${p.condition}) — ${
            p.inStock ? 'In Stock at Hyderabad Showroom' : 'Available on Order'
          }`
      )
      .join('\n\n');

    return {
      answer: `Here are available equipment matches from our Hyderabad catalog:\n\n${productListText}\n\nAll items include our 1-Year Store Warranty and 25-point inspection certificate.`,
      sourceContexts: matchingProducts.map((p) => `Catalog: ${p.name}`),
      matchedProducts: matchingProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.salePrice,
        slug: p.slug,
        condition: p.condition,
      })),
      suggestedAction: {
        type: 'product',
        label: `View ${matchingProducts[0].name}`,
        href: `/product/${matchingProducts[0].slug}`,
      },
    };
  }

  // -------------------------------------------------------------
  // PUBLIC INFORMATION 2: Store Services & Policies
  // -------------------------------------------------------------
  const matchedService = PUBLIC_STORE_SERVICES.find((service) =>
    service.keywords.some((kw) => query.includes(kw))
  );

  if (matchedService) {
    return {
      answer: cleanFormatting(matchedService.text),
      sourceContexts: [matchedService.topic],
      suggestedAction: {
        type: 'whatsapp',
        label: 'Chat with Specialist on WhatsApp',
        href: 'https://wa.me/919032285420',
      },
    };
  }

  // -------------------------------------------------------------
  // DEFAULT CLEAN GREETING (Public info only, no asterisks, no private order IDs)
  // -------------------------------------------------------------
  const greeting = user && user.name ? `Hello ${user.name}!` : "Hello! Welcome to Mi King's Cameras.";
  return {
    answer: `${greeting}\n\nI can assist you with:\n• Products: Browse DSLR cameras, mirrorless bodies, cinema lenses, and drones.\n• Store Services: 1-Year Store Warranty, 25-point inspection, and 30-day exchange.\n• Showroom Visit: Showroom address at Pillar 103, Bank Colony, Mir Alam Tank, Hyderabad and store hours (11:00 AM – 10:00 PM).`,
    sourceContexts: ['Public Store Directory'],
    suggestedAction: {
      type: 'link',
      label: 'Explore Catalog',
      href: '/catalog',
    },
  };
}
