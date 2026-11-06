/**
 * Public store knowledge base for the RAG assistant.
 * Single source of truth for store facts the assistant may quote — keep in sync
 * with /about, /contact, /warranty, /returns and /shipping.
 */

export interface SuggestedAction {
  type: 'link' | 'product' | 'order' | 'whatsapp';
  label: string;
  href: string;
}

export interface KnowledgeDoc {
  id: string;
  topic: string;
  keywords: string[];
  text: string;
  action?: SuggestedAction;
}

export const STORE_FACTS = {
  name: "Mi King's DSLR Camera Shop",
  address:
    'Pillar No. 103, Bank Colony, Near Tadbun, Mir Alam Tank, Bahadurpura, Hyderabad, Telangana 500064',
  shortAddress: 'Pillar 103, Bank Colony, Mir Alam Tank, Hyderabad',
  hours: 'Monday to Saturday 10:30 AM – 9:00 PM, Sunday 11:00 AM – 8:00 PM',
  whatsappPrimary: '+91 90322 85420',
  whatsappSecondary: '+91 63058 75376',
  whatsappHref: 'https://wa.me/919032285420',
  freeShippingThreshold: 25000,
} as const;

export const WHATSAPP_ACTION: SuggestedAction = {
  type: 'whatsapp',
  label: 'Chat with Specialist on WhatsApp',
  href: STORE_FACTS.whatsappHref,
};

export const KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: 'location',
    topic: 'Store Location & Timings',
    keywords: ['location', 'address', 'visit', 'timing', 'timings', 'hours', 'open', 'close', 'hyderabad', 'where', 'direction', 'directions', 'showroom', 'map'],
    text: `${STORE_FACTS.name} showroom is at ${STORE_FACTS.address}.\n\nStore timings: ${STORE_FACTS.hours}. Walk in to inspect and test any camera before you buy.`,
    action: { type: 'link', label: 'Contact & Directions', href: '/contact' },
  },
  {
    id: 'warranty',
    topic: '1-Year Store Warranty',
    keywords: ['warranty', 'guarantee', 'repair', 'protection', 'service', 'coverage', 'claim'],
    text: 'Every camera body, lens and accessory we sell includes a 1-Year Store Warranty card covering the shutter mechanism, sensor, motherboard electronics and autofocus motors. Liquid damage and accidental drops are not covered. Warranty claims are handled at our Hyderabad showroom.',
    action: { type: 'link', label: 'Read Warranty Policy', href: '/warranty' },
  },
  {
    id: 'inspection',
    topic: '25-Point Inspection Protocol',
    keywords: ['inspection', 'testing', 'tested', 'quality', 'check', 'certified', 'condition', 'shutter', 'count', 'fungus', 'genuine', 'authentic', 'used', 'preowned', 'secondhand'],
    text: 'All pre-owned gear goes through 25-point testing: hot-pixel sensor scans, shutter count verification, lens fungus and haze inspection, image stabilisation checks and battery health tests. No hidden flaws or inflated shutter counts.',
  },
  {
    id: 'returns',
    topic: '30-Day Refund & Exchange Policy',
    keywords: ['return', 'returns', 'exchange', 'replace', 'replacement', 'refund', 'money', 'back', 'cancel'],
    text: 'We offer a 30-Day Money Back Guarantee. If your camera or lens develops a technical defect within 30 days of delivery, bring or send it back with your invoice and we will replace it or issue a full refund.',
    action: { type: 'link', label: 'Read Returns Policy', href: '/returns' },
  },
  {
    id: 'shipping',
    topic: 'Shipping & Delivery',
    keywords: ['shipping', 'delivery', 'deliver', 'courier', 'dispatch', 'delhivery', 'bluedart', 'shiprocket', 'ship', 'pickup', 'collect', 'india'],
    text: `Free insured shipping across India on orders above ₹${STORE_FACTS.freeShippingThreshold.toLocaleString('en-IN')} via Delhivery, BlueDart and Shiprocket. In Hyderabad you can collect from our Mir Alam Tank showroom or ask for same-day local delivery.`,
    action: { type: 'link', label: 'Shipping Details', href: '/shipping' },
  },
  {
    id: 'gst',
    topic: 'GST Tax Invoices',
    keywords: ['gst', 'invoice', 'tax', 'bill', 'business', 'gstin', 'hsn', 'pdf'],
    text: 'Every purchase comes with an itemised 18% GST tax invoice (HSN 9006 for cameras, 9002 for lenses) that you can download as a PDF from checkout or your account. Businesses can claim GST input credit.',
    action: { type: 'link', label: 'My Orders & Invoices', href: '/account' },
  },
  {
    id: 'reviews',
    topic: 'Customer Reviews & Photo Ratings',
    keywords: ['review', 'reviews', 'rating', 'ratings', 'feedback', 'stars', 'photos', 'sample', 'testimonial', 'rate'],
    text: 'Each product page shows customer star ratings with a 1–5★ breakdown. Buyers can upload photos and sample shots with their review, and verified purchases (store walk-in or delivered order) get a Verified Purchaser badge. You can also mark reviews as helpful.',
    action: { type: 'link', label: 'Browse Rated Gear', href: '/catalog' },
  },
  {
    id: 'account',
    topic: 'Customer Account',
    keywords: ['account', 'login', 'signin', 'register', 'signup', 'password', 'forgot', 'profile', 'wishlist'],
    text: 'Create a free account to see your order history, download GST invoices, view your warranty cards and save items to your wishlist. Forgotten passwords can be reset with a 6-digit OTP.',
    action: { type: 'link', label: 'Go to My Account', href: '/account' },
  },
  {
    id: 'payment',
    topic: 'Payments',
    keywords: ['payment', 'pay', 'upi', 'card', 'emi', 'cash', 'cod'],
    text: 'At checkout you can pay online via UPI, Razorpay, cards or net banking (Google Pay, PhonePe and more), or choose Reserve & Pay at our Hyderabad store. For EMI or bulk orders, please check with our team on WhatsApp.',
    action: WHATSAPP_ACTION,
  },
  {
    id: 'tradein',
    topic: 'Trade-ins & Selling Your Camera',
    keywords: ['sell', 'trade', 'tradein', 'upgrade', 'buyback', 'old'],
    text: 'Looking to trade in or sell your camera? Send photos and the shutter count to our team on WhatsApp for a quote, or bring it to the showroom for an in-person evaluation.',
    action: WHATSAPP_ACTION,
  },
  {
    id: 'team',
    topic: "About Mi King's",
    keywords: ['about', 'owner', 'founder', 'team', 'family', 'who', 'idrees', 'waseem', 'allauddin', 'jafar', 'history', 'story'],
    text: "MI KINGS ENTERPRISES is a family-owned camera store in Hyderabad. Mohd Idrees is the family's guiding pillar, Mohd Waseem is the founder, Mohd Allauddin handles product testing and buying advice, and Mohd Jafar heads operations.",
    action: { type: 'link', label: 'Our Story', href: '/about' },
  },
  {
    id: 'contact',
    topic: 'WhatsApp Consultation',
    keywords: ['contact', 'phone', 'number', 'whatsapp', 'call', 'talk', 'specialist', 'human', 'agent', 'help', 'advice', 'reserve', 'reservation'],
    text: `Chat with our camera specialists on WhatsApp for buying advice, reservations or trade-ins: ${STORE_FACTS.whatsappPrimary} or ${STORE_FACTS.whatsappSecondary}.`,
    action: WHATSAPP_ACTION,
  },
];
