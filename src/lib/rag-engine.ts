import { Product } from '@/data/catalog';
import { formatINR } from '@/lib/utils';
import { STORE_FACTS, SuggestedAction, WHATSAPP_ACTION } from '@/lib/rag/knowledge';
import {
  QueryIntent,
  getProductsByIds,
  parseQueryIntent,
  searchKnowledge,
  searchProducts,
} from '@/lib/rag/retrieval';
import {
  ConversationMemory,
  EMPTY_MEMORY,
  FollowUpMode,
  rememberSearch,
  resolveWithMemory,
} from '@/lib/rag/memory';

export type { ConversationMemory } from '@/lib/rag/memory';
export { sanitizeMemory } from '@/lib/rag/memory';

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
  suggestedAction?: SuggestedAction;
  matchedProducts?: Array<{
    id: string;
    name: string;
    price: number;
    slug: string;
    condition: string;
  }>;
  /** Short follow-up prompts the widget can offer as chips */
  followUps?: string[];
  /** Updated conversation memory to send back with the next question */
  memory?: ConversationMemory;
}

const PAGE_SIZE = 3;

const CATEGORY_LABELS: Record<string, string> = {
  dslr: 'DSLR cameras',
  mirrorless: 'mirrorless cameras',
  lenses: 'lenses',
  drones: 'drones',
  gimbals: 'gimbals',
  accessories: 'accessories',
  lighting: 'lighting',
  tripods: 'tripods',
  bags: 'bags',
  audio: 'audio gear',
};

const ORDER_ID_PATTERN = /\bmik[- ]?\d{4,8}\b/i;

function isOrderQuery(query: string): boolean {
  return (
    ORDER_ID_PATTERN.test(query) ||
    /\b(my|our)\s+(order|orders|invoice|invoices|purchase|delivery|parcel|shipment)\b/.test(query) ||
    /\b(track|tracking|consignment|awb|order status|order number|order id|where is my)\b/.test(query)
  );
}

function toCard(p: Product) {
  return { id: p.id, name: p.name, price: p.salePrice, slug: p.slug, condition: p.condition };
}

function describeSearch(intent: QueryIntent, rawQuery?: string): string {
  if (intent.modelTerms.length && rawQuery) {
    return `results for "${rawQuery.trim().slice(0, 60)}"`;
  }
  const cats = intent.categories.length === 2 && intent.categories.includes('dslr') && intent.categories.includes('mirrorless')
    ? 'cameras'
    : intent.categories.map((c) => CATEGORY_LABELS[c] ?? c).join(' & ');
  const parts = [
    intent.condition === 'new' ? 'brand-new' : intent.condition === 'preowned' ? 'pre-owned' : '',
    intent.brand ?? '',
    cats || 'gear',
  ].filter(Boolean);
  let text = parts.join(' ');
  if (intent.minPrice !== undefined && intent.maxPrice !== undefined) {
    text += ` between ${formatINR(intent.minPrice)} and ${formatINR(intent.maxPrice)}`;
  } else if (intent.maxPrice !== undefined) {
    text += ` under ${formatINR(intent.maxPrice + (intent.maxPrice % 1000 === 999 ? 1 : 0))}`;
  } else if (intent.minPrice !== undefined) {
    text += ` above ${formatINR(intent.minPrice)}`;
  }
  return text;
}

function productLine(p: Product): string {
  const saving = p.regularPrice > p.salePrice ? Math.round((1 - p.salePrice / p.regularPrice) * 100) : 0;
  const savingText = saving >= 5 ? ` · ${saving}% off MRP` : '';
  const stock = p.inStock ? 'In stock at Hyderabad showroom' : 'Available on order';
  return `• ${p.name}\n  ${formatINR(p.salePrice)} (${p.condition})${savingText} — ${stock}`;
}

function catalogLink(intent: QueryIntent): SuggestedAction {
  const q = intent.brand ?? (intent.categories.length === 1 ? intent.categories[0] : intent.terms[0]);
  return {
    type: 'link',
    label: 'See All in Catalog',
    href: q ? `/catalog?q=${encodeURIComponent(q)}` : '/catalog',
  };
}

function productDetails(p: Product): string {
  const specs = Object.entries(p.specs)
    .filter(([k]) => !['Brand', 'Store Location'].includes(k))
    .slice(0, 4)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  const saving = p.regularPrice > p.salePrice ? `\nMRP ${formatINR(p.regularPrice)} — you save ${formatINR(p.regularPrice - p.salePrice)}` : '';
  return [
    `${p.name}`,
    `Price: ${formatINR(p.salePrice)} (${p.condition})${saving}`,
    `Availability: ${p.inStock ? 'In stock at our Hyderabad showroom' : 'Available on order — confirm on WhatsApp'}`,
    `Warranty: ${p.warranty}`,
    `Rating: ${p.rating.toFixed(1)}★ from ${p.reviewCount} reviews`,
    specs,
  ].filter(Boolean).join('\n');
}

// -------------------------------------------------------------
// Private: order lookups for the signed-in customer only
// -------------------------------------------------------------
function answerOrderQuery(query: string, user?: AuthenticatedCustomer | null): RAGResponse {
  if (!user || !user.id) {
    return {
      answer:
        'For your privacy, order tracking, consignment status and invoices are only shown after you sign in. Please sign in to your customer account, or use our secure Track Order page.',
      sourceContexts: ['Privacy Protection Protocol'],
      suggestedAction: { type: 'order', label: 'Sign In to View Orders', href: '/account' },
    };
  }

  const userOrders = user.orders || [];
  const match = query.match(ORDER_ID_PATTERN);

  if (match) {
    const cleanNum = match[0].replace(/[- ]/g, '').toUpperCase();
    const order = userOrders.find((o) => o.orderNumber.replace(/[- ]/g, '').toUpperCase().includes(cleanNum));
    if (!order) {
      return {
        answer: `I couldn't find an order matching that reference on your account (${user.email}). Please check the order number in your order history.`,
        sourceContexts: ['Customer Account'],
        suggestedAction: { type: 'link', label: 'View Order History', href: '/account' },
      };
    }
    const itemsList = order.items.map((i) => `${i.name} (Qty: ${i.quantity})`).join(', ');
    return {
      answer: `Here is the status for your order ${order.orderNumber}:\n\nStatus: ${order.status}\nDate: ${order.date}\nEquipment: ${itemsList}\nTotal: ${formatINR(order.total)}\nCourier: ${order.courierPartner || 'Delhivery Express'}\nTracking ID: ${order.trackingId || 'Generated upon dispatch'}`,
      sourceContexts: [`Customer Account Orders (${user.email})`],
      suggestedAction: { type: 'order', label: `Track ${order.orderNumber}`, href: `/track?orderId=${order.orderNumber}` },
    };
  }

  if (userOrders.length > 0) {
    const latest = userOrders[0];
    const older = userOrders.length > 1 ? `\n\nYou have ${userOrders.length - 1} earlier order${userOrders.length > 2 ? 's' : ''} in your account history.` : '';
    return {
      answer: `Hello ${user.name}! Your most recent order ${latest.orderNumber} is currently ${latest.status}.\n\nItems: ${latest.items.map((i) => i.name).join(', ')}\nTotal: ${formatINR(latest.total)}\nDate: ${latest.date}${older}`,
      sourceContexts: [`Customer Account: ${user.email}`],
      suggestedAction: { type: 'order', label: `Track Order ${latest.orderNumber}`, href: `/track?orderId=${latest.orderNumber}` },
    };
  }

  return {
    answer: `Hello ${user.name}! You don't have any orders on your account (${user.email}) yet. Feel free to explore our camera and lens collection.`,
    sourceContexts: ['Customer Account'],
    suggestedAction: { type: 'link', label: 'Explore Catalog', href: '/catalog' },
  };
}

// -------------------------------------------------------------
// Public: catalog answers
// -------------------------------------------------------------
function answerProductSearch(
  intent: QueryIntent,
  mode: FollowUpMode,
  memory: ConversationMemory,
  rawQuery: string
): RAGResponse | null {
  const exclude = mode === 'more' ? memory.seenProductIds : [];
  const hits = searchProducts(intent, exclude);
  const label = describeSearch(intent, mode === 'new' ? rawQuery : intent.terms.join(' '));

  if (hits.length === 0) {
    if (mode === 'more') {
      return {
        answer: `That's everything we currently list for ${label.replace(/^results for /, '')}. Our team can source other models on request.`,
        sourceContexts: ['Product Catalog'],
        suggestedAction: WHATSAPP_ACTION,
        followUps: ['Show cheaper options', 'Showroom address & hours'],
        memory: { ...memory, turns: memory.turns + 1 },
      };
    }
    // Relax the budget to offer the closest alternatives
    if (intent.maxPrice !== undefined || intent.minPrice !== undefined) {
      const relaxed = { ...intent, maxPrice: undefined, minPrice: undefined, sort: 'price-asc' as const };
      const near = searchProducts(relaxed)
        .sort((a, b) => Math.abs(a.product.salePrice - (intent.maxPrice ?? intent.minPrice ?? 0))
          - Math.abs(b.product.salePrice - (intent.maxPrice ?? intent.minPrice ?? 0)))
        .slice(0, PAGE_SIZE)
        .map((h) => h.product);
      if (near.length) {
        return {
          answer: `We don't have ${label.replace(/^results for /, '')} right now. Here are the closest options:\n\n${near.map(productLine).join('\n\n')}`,
          sourceContexts: near.map((p) => `Catalog: ${p.name}`),
          matchedProducts: near.map(toCard),
          suggestedAction: WHATSAPP_ACTION,
          followUps: ['Tell me about the first one', 'Show more'],
          memory: rememberSearch(memory, relaxed, near.map((p) => p.id), 'new'),
        };
      }
    }
    const hasFilters = intent.categories.length > 0 || !!intent.brand || !!intent.condition || intent.modelTerms.length > 0;
    if (!hasFilters) return null;
    return {
      answer: `We don't currently list ${label.replace(/^results for /, '')} in our online catalog. New stock arrives every week — our team can check availability or source it for you on WhatsApp.`,
      sourceContexts: ['Product Catalog'],
      suggestedAction: WHATSAPP_ACTION,
      followUps: ['Cameras under ₹50,000', 'Showroom address & hours'],
      memory: { ...memory, turns: memory.turns + 1 },
    };
  }

  const page = hits.slice(0, PAGE_SIZE).map((h) => h.product);
  const remaining = hits.length - page.length;
  const intro = mode === 'more'
    ? `Here are more ${label}:`
    : page.length === 1
      ? `Here's what we have for ${label.replace(/^results for /, '')} in our Hyderabad catalog:`
      : `Here are ${hits.length > PAGE_SIZE ? `the top ${page.length} of ${hits.length}` : page.length} ${label} from our Hyderabad catalog:`;
  const outro = remaining > 0
    ? `\n\n${remaining} more match${remaining === 1 ? '' : 'es'} available. Every item includes our 1-Year Store Warranty and 25-point inspection.`
    : '\n\nEvery item includes our 1-Year Store Warranty and 25-point inspection.';

  const followUps: string[] = [];
  if (page.length > 1) followUps.push('Tell me about the first one');
  if (remaining > 0) followUps.push('Show more');
  if (Math.min(...page.map((p) => p.salePrice)) > 10000) followUps.push('Cheaper options');
  const brandable = intent.categories.some((c) => ['dslr', 'mirrorless', 'lenses'].includes(c));
  if (!intent.brand && brandable) followUps.push(intent.categories.includes('lenses') ? 'Only Canon' : 'What about Sony?');

  return {
    answer: `${intro}\n\n${page.map(productLine).join('\n\n')}${outro}`,
    sourceContexts: page.map((p) => `Catalog: ${p.name}`),
    matchedProducts: page.map(toCard),
    suggestedAction: page.length === 1 || remaining === 0
      ? { type: 'product', label: `View ${page[0].name}`, href: `/product/${page[0].slug}` }
      : catalogLink(intent),
    followUps: followUps.slice(0, 3),
    memory: rememberSearch(memory, intent, page.map((p) => p.id), mode),
  };
}

function answerFocusedProduct(productId: string, rawQuery: string, memory: ConversationMemory): RAGResponse | null {
  const [product] = getProductsByIds([productId]);
  if (!product) return null;
  const topic = searchKnowledge(rawQuery)[0]?.doc;
  const policy = topic && topic.id !== 'contact' ? `\n\n${topic.topic}: ${topic.text}` : '';
  return {
    answer: `${productDetails(product)}${policy}`,
    sourceContexts: [`Catalog: ${product.name}`, ...(topic ? [topic.topic] : [])],
    matchedProducts: [toCard(product)],
    suggestedAction: { type: 'product', label: 'View Product & Reviews', href: `/product/${product.slug}` },
    followUps: ['Is it in stock?', 'Cheaper options', 'Reserve on WhatsApp'],
    memory: { ...memory, turns: memory.turns + 1, focusProductId: product.id },
  };
}

/**
 * Core RAG retrieval & answer engine with strict privacy boundaries.
 * `memory` is the public conversation state returned by the previous answer.
 */
export async function queryRAGAssistant(
  userPrompt: string,
  user?: AuthenticatedCustomer | null,
  memory: ConversationMemory = EMPTY_MEMORY
): Promise<RAGResponse> {
  const query = userPrompt.toLowerCase().trim();

  // PRIVACY BOUNDARY: order data only for the signed-in customer, never stored in memory
  if (isOrderQuery(query)) {
    return { ...answerOrderQuery(query, user), memory };
  }

  if (/^(hi|hii+|hello|hey|namaste|salaam|good (morning|afternoon|evening))\b[\s!.]*$/.test(query)) {
    const greeting = user?.name ? `Hello ${user.name}!` : "Hello! Welcome to Mi King's Cameras.";
    return {
      answer: `${greeting} What are you shooting? Tell me a budget or a camera model and I'll find matching gear from our Hyderabad catalog.`,
      sourceContexts: ['Store Assistant'],
      followUps: ['Cameras under ₹50,000', 'Best lens for portraits', 'Showroom address & hours'],
      memory,
    };
  }
  if (/^(thanks|thank you|thx|ok thanks|great|awesome|cool)\b/.test(query)) {
    return {
      answer: `You're welcome! If you'd like to see any camera in person, visit us at ${STORE_FACTS.shortAddress}, or chat with our team on WhatsApp.`,
      sourceContexts: ['Store Assistant'],
      suggestedAction: WHATSAPP_ACTION,
      memory: { ...memory, turns: memory.turns + 1 },
    };
  }

  const baseIntent = parseQueryIntent(userPrompt);
  const shownPrices = getProductsByIds(memory.shownProductIds).map((p) => p.salePrice);
  const resolved = resolveWithMemory(userPrompt, baseIntent, memory, shownPrices);

  if (resolved.mode === 'focus' && resolved.focusProductId) {
    const focused = answerFocusedProduct(resolved.focusProductId, userPrompt, memory);
    if (focused) return focused;
  }

  const knowledge = searchKnowledge(userPrompt);
  const intent = resolved.intent;
  const hasProductSignal = intent.categories.length > 0 || !!intent.brand || intent.minPrice !== undefined
    || intent.maxPrice !== undefined || intent.modelTerms.length > 0 || resolved.mode !== 'new';

  // Policy questions win unless the customer is clearly shopping ("warranty on canon 200d" → both)
  const topDoc = knowledge[0]?.doc;
  if (topDoc && (!hasProductSignal || knowledge[0].score >= 4)) {
    const related = hasProductSignal ? searchProducts(intent).slice(0, PAGE_SIZE).map((h) => h.product) : [];
    return {
      answer: topDoc.text,
      sourceContexts: [topDoc.topic, ...related.map((p) => `Catalog: ${p.name}`)],
      matchedProducts: related.length ? related.map(toCard) : undefined,
      suggestedAction: topDoc.action ?? WHATSAPP_ACTION,
      followUps: knowledge.slice(1, 3).map((k) => k.doc.topic),
      memory: related.length
        ? { ...rememberSearch(memory, intent, related.map((p) => p.id), 'new'), lastTopicId: topDoc.id }
        : { ...memory, turns: memory.turns + 1, lastTopicId: topDoc.id },
    };
  }

  let productAnswer = answerProductSearch(intent, resolved.mode, memory, userPrompt);
  // A refinement that empties the results ("sigma" after a Nikon search) is retried as a fresh search
  if (resolved.mode === 'refine' && productAnswer && !productAnswer.matchedProducts) {
    productAnswer = answerProductSearch(baseIntent, 'new', memory, userPrompt) ?? productAnswer;
  }
  if (productAnswer) return productAnswer;

  if (topDoc) {
    return {
      answer: topDoc.text,
      sourceContexts: [topDoc.topic],
      suggestedAction: topDoc.action ?? WHATSAPP_ACTION,
      memory: { ...memory, turns: memory.turns + 1, lastTopicId: topDoc.id },
    };
  }

  const greeting = user?.name ? `Hello ${user.name}!` : "Hello! Welcome to Mi King's Cameras.";
  const notFound = baseIntent.terms.length
    ? `I couldn't find "${userPrompt.trim().slice(0, 60)}" in our catalog. Our team can check incoming stock for you on WhatsApp.\n\n`
    : '';
  return {
    answer: `${notFound}${greeting}\n\nI can help you with:\n• Products: cameras, lenses and drones by brand, model or budget (e.g. "Canon under ₹40,000")\n• Store services: 1-Year Store Warranty, 25-point inspection, 30-day refunds, GST invoices\n• Showroom visit: ${STORE_FACTS.shortAddress} (${STORE_FACTS.hours})`,
    sourceContexts: ['Public Store Directory'],
    suggestedAction: notFound ? WHATSAPP_ACTION : { type: 'link', label: 'Explore Catalog', href: '/catalog' },
    followUps: ['Cameras under ₹50,000', 'Canon & Sony lenses', '1-Year warranty coverage'],
    memory: { ...memory, turns: memory.turns + 1 },
  };
}
