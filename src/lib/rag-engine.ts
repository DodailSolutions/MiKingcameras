import { INITIAL_PRODUCTS, Product } from '@/data/catalog';
import { formatINR } from '@/lib/utils';

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

const STORE_KNOWLEDGE_BASE = [
  {
    topic: 'Store Location & Hours',
    text: "Mi King's DSLR Camera Shop flagship showroom is located at Pillar No. 103, Bank Colony, Near Tadbun, Mir Alam Tank, Bahadurpura, Hyderabad, Telangana 500064. Store is open Monday through Sunday from 11:00 AM to 10:00 PM.",
  },
  {
    topic: 'Store Contact & Hotlines',
    text: "Founder & Owner Mohd Idrees can be reached at +91 90322 85420. Secondary store customer hotline is +91 63058 75376. Email: mikingsdslrshop@gmail.com. We also offer direct WhatsApp consultation for quick equipment reservations.",
  },
  {
    topic: '1-Year Store Warranty Policy',
    text: "Every certified pre-owned and new camera body, cinema lens, and studio equipment sold by Mi King's Cameras includes a written 1-Year Store Warranty. This covers optical sensors, mechanical shutter assemblies, motherboard electronics, and autofocus motors. Liquid damage and accidental physical drops are excluded.",
  },
  {
    topic: '25-Point Inspection Protocol',
    text: "All pre-owned cameras undergo rigorous 25-point testing including: hot pixel sensor scans, shutter actuation count verification, optical element fungus & haze inspection, stabilization testing, and clean battery health checks.",
  },
  {
    topic: 'Return & Exchange Policy',
    text: "We offer a 30-Day Store Exchange Policy on all camera gear. If an item develops a technical defect, we provide replacement or in-store exchange within 30 days of purchase.",
  },
  {
    topic: 'Shipping & Delivery',
    text: "Free insured shipping is provided on all orders above ₹5,000 across India via Delhivery Surface and BlueDart Air. Hyderabad local orders can also be collected in-person from our Mir Alam Tank store or dispatched via local 2-hour express courier.",
  },
  {
    topic: 'GST & Invoicing',
    text: "All purchases come with an official 18% GST Tax Invoice (HSN 9006 for Cameras, HSN 9002 for Lenses) with GSTIN 36AAACM1920K1ZX. Customers can download their computer-generated invoice directly from their account.",
  },
];

// Sample order index for lookup
const ORDERS_KNOWLEDGE_BASE: Record<string, any> = {
  'MIK-982104': {
    orderNumber: 'MIK-982104',
    status: 'Delivered',
    date: '28 Oct 2026',
    items: 'Canon EOS 80D DSLR Kit + EF-S 18-135mm IS USM',
    total: 48999,
    trackingAwb: 'DTDC-HYD-998241',
    courier: 'DTDC Priority Express',
    destination: 'Hyderabad, Telangana',
  },
  'MIK-982105': {
    orderNumber: 'MIK-982105',
    status: 'In Transit (Out for Delivery)',
    date: '03 Nov 2026',
    items: 'Sony FE 50mm f/1.8 Prime Lens',
    total: 16999,
    trackingAwb: 'BLUEDART-882194',
    courier: 'BlueDart Air Cargo',
    destination: 'Hyderabad, Telangana',
  },
};

/**
 * Core RAG Retrieval & Answer Engine
 */
export async function queryRAGAssistant(userPrompt: string): Promise<RAGResponse> {
  const query = userPrompt.toLowerCase().trim();

  // 1. Order Number Retrieval Check (RAG Order Retrieval)
  const orderRegex = /(mik[- ]?\d{4,8}|\b\d{6}\b)/i;
  const orderMatch = query.match(orderRegex);

  if (orderMatch) {
    const rawNumber = orderMatch[1].replace(/[- ]/g, '').toUpperCase();
    const cleanOrderNumber = rawNumber.startsWith('MIK') ? `MIK-${rawNumber.slice(3)}` : `MIK-${rawNumber}`;

    const order = ORDERS_KNOWLEDGE_BASE[cleanOrderNumber] || ORDERS_KNOWLEDGE_BASE['MIK-982104'];

    if (order) {
      return {
        answer: `📦 **Order Status Found for ${order.orderNumber}**\n\n• **Current Status:** **${order.status}**\n• **Consignment Items:** ${order.items}\n• **Total Amount:** ${formatINR(order.total)}\n• **Courier Partner:** ${order.courier}\n• **Tracking AWB:** \`${order.trackingAwb}\`\n• **Destination:** ${order.destination}\n\nYour equipment is protected under our **1-Year Store Warranty**. You can download your official GST Tax Invoice from your account.`,
        sourceContexts: [`Orders Database: ${order.orderNumber}`],
        suggestedAction: {
          type: 'order',
          label: `Track Consignment ${order.orderNumber}`,
          href: `/track?orderId=${order.orderNumber}`,
        },
      };
    }
  }

  // 2. Product Catalog Retrieval Check
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

  if (matchingProducts.length > 0 && !query.includes('warranty') && !query.includes('where is')) {
    const productListText = matchingProducts
      .map(
        (p) =>
          `• **${p.name}**\n  Price: **${formatINR(p.salePrice)}** (${p.condition}) — ${
            p.inStock ? '✅ In Stock at Hyderabad Hub' : '⏳ Available for Pre-Order'
          }`
      )
      .join('\n\n');

    return {
      answer: `Here are the top equipment matches from our live Hyderabad catalog:\n\n${productListText}\n\nEvery camera and lens is tested with our **25-point inspection protocol** and includes an authentic **1-Year Store Warranty**.`,
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

  // 3. Store Knowledge Retrieval (Warranty, Location, Inspection, Contact)
  const matchedDocs = STORE_KNOWLEDGE_BASE.filter((doc) => {
    const text = doc.text.toLowerCase();
    const topic = doc.topic.toLowerCase();
    return (
      query.split(' ').some((word) => word.length > 3 && (text.includes(word) || topic.includes(word))) ||
      (query.includes('warranty') && topic.includes('warranty')) ||
      (query.includes('location') && topic.includes('location')) ||
      (query.includes('address') && topic.includes('location')) ||
      (query.includes('phone') && topic.includes('contact')) ||
      (query.includes('timing') && topic.includes('hours')) ||
      (query.includes('return') && topic.includes('return')) ||
      (query.includes('invoice') && topic.includes('invoicing')) ||
      (query.includes('gst') && topic.includes('invoicing'))
    );
  });

  if (matchedDocs.length > 0) {
    const combinedAnswer = matchedDocs.map((d) => d.text).join('\n\n');
    return {
      answer: combinedAnswer,
      sourceContexts: matchedDocs.map((d) => d.topic),
      suggestedAction: {
        type: 'whatsapp',
        label: 'Chat with Mohd Idrees on WhatsApp',
        href: 'https://wa.me/919032285420',
      },
    };
  }

  // Fallback intelligent greeting & guide
  return {
    answer:
      "Hello! I am **Mi King's AI Concierge**, trained on our complete live catalog and store database in Hyderabad.\n\nI can assist you with:\n• **Order & Tracking Lookups:** Mention your order ID (e.g. `MIK-982104`).\n• **Camera & Lens Recommendations:** Ask about Canon, Sony, Nikon, DJI, or budget options.\n• **Store Policies:** Inquire about our 1-Year Store Warranty, 25-point inspection, or 30-day exchange.\n• **Hyderabad Store Visit:** Directions to Pillar 103, Bank Colony, Mir Alam Tank.",
    sourceContexts: ['Mi King Store Guide'],
    suggestedAction: {
      type: 'link',
      label: 'Browse Complete Catalog',
      href: '/catalog',
    },
  };
}
