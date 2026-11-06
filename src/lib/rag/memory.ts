/**
 * Short-term conversation memory for the RAG assistant.
 *
 * The memory is a small, public-only state object (search filters and catalog
 * product IDs) that round-trips between the widget and the API so follow-ups
 * like "cheaper ones?", "what about Nikon?" or "tell me about the second one"
 * resolve against the previous turn. It never holds order or account data.
 */
import { Category, ConditionFilter, QueryIntent, SortOrder, isKnownProductId, isModelToken, normalizeText } from './retrieval';

export interface SearchMemory {
  categories: Category[];
  brand?: string;
  condition?: ConditionFilter;
  minPrice?: number;
  maxPrice?: number;
  sort: SortOrder;
  terms: string[];
}

export interface ConversationMemory {
  turns: number;
  search?: SearchMemory;
  /** Products shown in the most recent answer, in display order */
  shownProductIds: string[];
  /** Every product shown for the current search, used for "show more" */
  seenProductIds: string[];
  /** Product the customer is currently asking about */
  focusProductId?: string;
  lastTopicId?: string;
}

export const EMPTY_MEMORY: ConversationMemory = { turns: 0, shownProductIds: [], seenProductIds: [] };

const MAX_SEEN = 30;
const CATEGORIES: Category[] = ['dslr', 'mirrorless', 'lenses', 'drones', 'gimbals', 'accessories', 'lighting', 'tripods', 'bags', 'audio'];
const SORTS: SortOrder[] = ['relevance', 'price-asc', 'price-desc'];

const asPrice = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 && v < 1e8 ? Math.round(v) : undefined);
const asIds = (v: unknown, max: number) =>
  Array.isArray(v) ? v.filter((id): id is string => typeof id === 'string' && isKnownProductId(id)).slice(0, max) : [];

/** Validate memory arriving from the client — it is untrusted input. */
export function sanitizeMemory(raw: unknown): ConversationMemory {
  if (!raw || typeof raw !== 'object') return { ...EMPTY_MEMORY };
  const m = raw as Record<string, unknown>;
  const s = m.search as Record<string, unknown> | undefined;

  let search: SearchMemory | undefined;
  if (s && typeof s === 'object') {
    search = {
      categories: Array.isArray(s.categories) ? s.categories.filter((c): c is Category => CATEGORIES.includes(c as Category)) : [],
      brand: typeof s.brand === 'string' && s.brand.length <= 40 ? s.brand : undefined,
      condition: s.condition === 'new' || s.condition === 'preowned' ? s.condition : undefined,
      minPrice: asPrice(s.minPrice),
      maxPrice: asPrice(s.maxPrice),
      sort: SORTS.includes(s.sort as SortOrder) ? (s.sort as SortOrder) : 'relevance',
      terms: Array.isArray(s.terms)
        ? s.terms.filter((t): t is string => typeof t === 'string' && /^[a-z0-9.]{1,30}$/.test(t)).slice(0, 12)
        : [],
    };
  }

  const focus = typeof m.focusProductId === 'string' && isKnownProductId(m.focusProductId) ? m.focusProductId : undefined;
  return {
    turns: typeof m.turns === 'number' && m.turns >= 0 ? Math.min(Math.floor(m.turns), 10_000) : 0,
    search,
    shownProductIds: asIds(m.shownProductIds, 10),
    seenProductIds: asIds(m.seenProductIds, MAX_SEEN),
    focusProductId: focus,
    lastTopicId: typeof m.lastTopicId === 'string' && /^[a-z]{1,20}$/.test(m.lastTopicId) ? m.lastTopicId : undefined,
  };
}

const FOLLOW_UP_WORDS = new Set([
  'cheaper', 'expensive', 'pricier', 'better', 'higher', 'lower', 'more', 'others', 'other', 'next', 'else',
  'anything', 'instead', 'one', 'ones', 'first', 'second', 'third', '1st', '2nd', '3rd', 'options', 'option',
  'similar', 'alternatives', 'alternative', 'same', 'too', 'then', 'ok', 'okay', 'details', 'detail', 'specs',
  'specifications', 'tell', 'last',
]);

const ORDINALS: Array<[RegExp, number]> = [
  [/\b(first|1st|top)\b/, 0],
  [/\b(second|2nd)\b/, 1],
  [/\b(third|3rd|last)\b/, 2],
];

export type FollowUpMode = 'new' | 'refine' | 'more' | 'focus';

export interface ResolvedQuery {
  mode: FollowUpMode;
  intent: QueryIntent;
  focusProductId?: string;
}

/**
 * Merge the current query with conversation memory. Decides whether the
 * customer started a new search, refined the previous one, asked for more
 * results, or is asking about a specific product they were shown.
 */
export function resolveWithMemory(
  rawQuery: string,
  intent: QueryIntent,
  memory: ConversationMemory,
  shownPrices: number[]
): ResolvedQuery {
  const q = normalizeText(rawQuery);
  const contentTerms = intent.terms.filter((t) => !FOLLOW_UP_WORDS.has(t));
  const prev = memory.search;

  // 1. Reference to a product that was just shown ("the second one", "is it in stock?")
  if (memory.shownProductIds.length && !contentTerms.length && !intent.categories.length && !intent.brand) {
    for (const [pattern, idx] of ORDINALS) {
      if (pattern.test(q)) {
        const ids = memory.shownProductIds;
        const id = pattern.source.includes('last') && /\blast\b/.test(q) ? ids[ids.length - 1] : ids[idx];
        if (id) return { mode: 'focus', intent, focusProductId: id };
      }
    }
    if (/\b(it|this|that|this one|that one|details|specs|tell me more)\b/.test(q) && !/\b(more|others|cheaper|expensive)\b/.test(q)) {
      const id = memory.focusProductId ?? (memory.shownProductIds.length === 1 ? memory.shownProductIds[0] : undefined);
      if (id) return { mode: 'focus', intent, focusProductId: id };
    }
  }

  if (!prev) return { mode: 'new', intent };

  // A new category or product name/model means a fresh search
  const startsNewSearch = intent.categories.length > 0 || contentTerms.length > 0;
  if (startsNewSearch) return { mode: 'new', intent };

  const merged: QueryIntent = {
    ...intent,
    terms: prev.terms,
    modelTerms: prev.terms.filter(isModelToken),
    categories: prev.categories,
    brand: intent.brand ?? prev.brand,
    condition: intent.condition ?? prev.condition,
    minPrice: intent.minPrice ?? prev.minPrice,
    maxPrice: intent.maxPrice ?? prev.maxPrice,
    sort: intent.sort !== 'relevance' ? intent.sort : prev.sort,
  };

  if (/\b(cheaper|lower|less expensive|lower price|budget)\b/.test(q) && shownPrices.length) {
    merged.maxPrice = Math.min(...shownPrices) - 1;
    merged.minPrice = intent.minPrice;
    merged.sort = 'relevance';
    return { mode: 'refine', intent: merged };
  }
  if (/\b(pricier|more expensive|higher end|better|premium|upgrade)\b/.test(q) && shownPrices.length) {
    merged.minPrice = Math.max(...shownPrices) + 1;
    merged.maxPrice = intent.maxPrice;
    merged.sort = 'price-asc';
    return { mode: 'refine', intent: merged };
  }

  const changedFilter = !!intent.brand || !!intent.condition || intent.minPrice !== undefined
    || intent.maxPrice !== undefined || intent.inStockOnly || intent.sort !== 'relevance';
  if (changedFilter) return { mode: 'refine', intent: merged };

  if (/\b(more|others|other|next|else|another|additional)\b/.test(q)) return { mode: 'more', intent: merged };

  return { mode: 'new', intent };
}

export function rememberSearch(
  memory: ConversationMemory,
  intent: QueryIntent,
  shownIds: string[],
  mode: FollowUpMode
): ConversationMemory {
  const seen = mode === 'more' ? [...memory.seenProductIds, ...shownIds] : shownIds;
  return {
    turns: memory.turns + 1,
    search: {
      categories: intent.categories,
      brand: intent.brand,
      condition: intent.condition,
      minPrice: intent.minPrice,
      maxPrice: intent.maxPrice,
      sort: intent.sort,
      terms: intent.terms.filter((t) => !FOLLOW_UP_WORDS.has(t)).slice(0, 12),
    },
    shownProductIds: shownIds,
    seenProductIds: Array.from(new Set(seen)).slice(-MAX_SEEN),
    focusProductId: shownIds.length === 1 ? shownIds[0] : undefined,
    lastTopicId: undefined,
  };
}
