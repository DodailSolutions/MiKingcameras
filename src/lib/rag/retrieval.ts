/**
 * Query understanding and ranked retrieval over the product catalog and the
 * store knowledge base. Pure functions — no I/O, safe to call on the server.
 */
import { INITIAL_PRODUCTS, BRANDS, Product } from '@/data/catalog';
import { KNOWLEDGE_DOCS, KnowledgeDoc } from './knowledge';

export type Category = Product['category'];
export type ConditionFilter = 'new' | 'preowned';
export type SortOrder = 'relevance' | 'price-asc' | 'price-desc';

export interface QueryIntent {
  terms: string[];
  categories: Category[];
  brand?: string;
  condition?: ConditionFilter;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly: boolean;
  sort: SortOrder;
  /** Model-like tokens such as "200d", "a6000", "50mm" */
  modelTerms: string[];
}

const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'am', 'do', 'does', 'you', 'your', 'i', 'me', 'my', 'we', 'have', 'has',
  'for', 'of', 'in', 'on', 'at', 'to', 'and', 'or', 'with', 'what', 'which', 'any', 'some', 'can', 'please',
  'show', 'find', 'want', 'need', 'looking', 'get', 'buy', 'tell', 'about', 'give', 'list', 'it', 'this',
  'that', 'there', 'available', 'price', 'prices', 'cost', 'rs', 'inr', 'under', 'below', 'above', 'over',
  'less', 'more', 'than', 'between', 'budget', 'within', 'upto', 'up', 'k', 'lakh', 'best', 'good', 'cheap',
  'cheapest', 'stock', 'how', 'much', 'hi', 'hello', 'hey', 'new', 'used', 'pre', 'owned', 'preowned',
  'mm', 'body', 'only', 'brand', 'also', 'like', 'would', 'should', 'get', 'model', 'models',
]);

const CATEGORY_SYNONYMS: Array<{ pattern: RegExp; categories: Category[] }> = [
  { pattern: /\b(mirror ?less)\b/, categories: ['mirrorless'] },
  { pattern: /\b(dslrs?|slr)\b/, categories: ['dslr'] },
  { pattern: /\b(lens|lenses|prime|telephoto|zoom lens|wide ?angle|portrait lens|kit lens)\b/, categories: ['lenses'] },
  { pattern: /\b(drones?|quadcopter|mavic|mini 4|avata)\b/, categories: ['drones'] },
  { pattern: /\b(gimbals?|stabili[sz]ers?)\b/, categories: ['gimbals'] },
  { pattern: /\b(tripods?|monopods?)\b/, categories: ['tripods'] },
  { pattern: /\b(lights?|lighting|led panel|softbox)\b/, categories: ['lighting'] },
  { pattern: /\b(bags?|backpacks?|cases?)\b/, categories: ['bags'] },
  { pattern: /\b(mics?|microphones?|audio)\b/, categories: ['audio'] },
  { pattern: /\b(accessor(y|ies)|batter(y|ies)|chargers?|memory cards?|sd cards?)\b/, categories: ['accessories'] },
  { pattern: /\b(cameras?|camera bodies)\b/, categories: ['dslr', 'mirrorless'] },
];

const KNOWN_BRANDS = Array.from(
  new Set([...BRANDS.map((b) => b.name), ...INITIAL_PRODUCTS.map((p) => p.brand)])
);

/** Normalise text: unicode look-alikes, "mark iv" → "m4", "full frame" → "fullframe". */
export function normalizeText(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[Αα]/g, 'a') // Greek alpha
    .replace(/[Νν]/g, 'n') // Greek nu
    .replace(/[Οο]/g, 'o') // Greek omicron
    .toLowerCase()
    .replace(/\bmark\s*(iv|4)\b|\bmk\s*(iv|4)\b/g, 'm4')
    .replace(/\bmark\s*(iii|3)\b|\bmk\s*(iii|3)\b/g, 'm3')
    .replace(/\bmark\s*(ii|2)\b|\bmk\s*(ii|2)\b/g, 'm2')
    .replace(/\bfull[\s-]?frame\b/g, 'fullframe')
    .replace(/\bmirror\s+less\b/g, 'mirrorless')
    // "18-55mm" also yields a joined "1855mm" token so focal ranges match as model terms
    .replace(/\b(\d{1,3})\s*-\s*(\d{1,3})(?:\s*mm)?\b(?!\s*(?:k|l|lakhs?|lacs?|,?000)\b)/g, '$1-$2mm $1$2mm')
    .replace(/\bsecond[\s-]?hand\b|\bpre[\s-]?owned\b|\brefurbished\b/g, 'preowned');
}

export function tokenize(input: string): string[] {
  return normalizeText(input)
    .split(/[^a-z0-9.]+/)
    .map((t) => t.replace(/^\.+|\.+$/g, ''))
    .filter(Boolean);
}

export const isModelToken = (t: string) => /\d/.test(t) && /[a-z]/.test(t) && t.length >= 2;

/** Parse "50k", "50,000", "₹50000", "1.5 lakh" into rupees. */
function parseAmount(raw: string, unit?: string): number | undefined {
  const value = parseFloat(raw.replace(/,/g, ''));
  if (!Number.isFinite(value)) return undefined;
  const u = (unit || '').toLowerCase();
  if (u === 'k') return Math.round(value * 1000);
  if (u.startsWith('l')) return Math.round(value * 100000);
  return Math.round(value);
}

const AMOUNT = String.raw`(?:₹|rs\.?|inr)?\s*(\d[\d,]*(?:\.\d+)?)\s*(k|lakhs?|lacs?|l)?\b`;

function parsePriceRange(q: string): { min?: number; max?: number } {
  const between = new RegExp(String.raw`between\s+${AMOUNT}\s+(?:and|to|-)\s+${AMOUNT}`).exec(q)
    || new RegExp(String.raw`${AMOUNT}\s*(?:-|to)\s*${AMOUNT}`).exec(q);
  if (between) {
    const lo = parseAmount(between[1], between[2] || between[4]);
    const hi = parseAmount(between[3], between[4]);
    // Ignore focal ranges like "18-55mm" — prices need a unit, a currency marker or 4+ digits
    if (lo && hi && hi >= 1000 && /₹|rs|inr|k\b|lakh|lac|between|budget|\d{4}/.test(between[0]) && !/mm/.test(q.slice(between.index, between.index + between[0].length + 2))) {
      return { min: Math.min(lo, hi), max: Math.max(lo, hi) };
    }
  }
  const under = new RegExp(String.raw`(?:under|below|less than|within|upto|up to|max(?:imum)?|budget(?: of| is)?|not more than)\s+${AMOUNT}`).exec(q);
  const over = new RegExp(String.raw`(?:above|over|more than|min(?:imum)?|starting|from)\s+${AMOUNT}`).exec(q);
  const range: { min?: number; max?: number } = {};
  if (under) range.max = parseAmount(under[1], under[2]);
  if (over) range.min = parseAmount(over[1], over[2]);
  if (range.max !== undefined && range.max < 1000) delete range.max;
  if (range.min !== undefined && range.min < 1000) delete range.min;
  return range;
}

export function parseQueryIntent(rawQuery: string): QueryIntent {
  const q = normalizeText(rawQuery);
  const tokens = tokenize(rawQuery);

  const categories = new Set<Category>();
  for (const { pattern, categories: cats } of CATEGORY_SYNONYMS) {
    if (pattern.test(q)) {
      // "camera lens" should not pull in camera bodies
      if (cats.length > 1 && categories.size > 0) continue;
      cats.forEach((c) => categories.add(c));
    }
  }

  const brand = KNOWN_BRANDS.find((b) => new RegExp(`\\b${b.toLowerCase()}\\b`).test(q));

  let condition: ConditionFilter | undefined;
  if (/\bbrand new\b|\bnew\b|\bsealed\b|\bunused\b/.test(q)) condition = 'new';
  if (/\bpreowned\b|\bused\b/.test(q)) condition = 'preowned';

  const { min, max } = parsePriceRange(q);

  let sort: SortOrder = 'relevance';
  if (/\b(cheap|cheapest|lowest|affordable|budget|low price|entry level|beginner)\b/.test(q)) sort = 'price-asc';
  if (/\b(expensive|premium|top end|high end|professional|pro)\b/.test(q)) sort = 'price-desc';

  const brandToken = brand?.toLowerCase();
  const terms = tokens.filter(
    (t) => !STOPWORDS.has(t) && t !== brandToken && !/^\d[\d,.]*(k|l|lakh|lakhs|lac)?$/.test(t) && t.length > 1
  );

  return {
    terms,
    categories: Array.from(categories),
    brand,
    condition,
    minPrice: min,
    maxPrice: max,
    inStockOnly: /\bin stock\b|\bready\b|\bavailable now\b/.test(q),
    sort,
    modelTerms: terms.filter(isModelToken),
  };
}

// ---------------------------------------------------------------
// Product index (built once per server instance)
// ---------------------------------------------------------------
interface IndexedProduct {
  product: Product;
  fieldTokens: Map<string, number>; // token -> best field weight
}

let productIndex: IndexedProduct[] | null = null;
let documentFrequency: Map<string, number> | null = null;

function addTokens(map: Map<string, number>, text: string, weight: number) {
  const tokens = tokenize(text);
  tokens.forEach((t, i) => {
    map.set(t, Math.max(map.get(t) ?? 0, weight));
    // Joined bigrams let "5dm4", "rx100m3" and "a7iii" style queries match "5D-M4" etc.
    if (i > 0 && weight >= 3) {
      const joined = tokens[i - 1] + t;
      map.set(joined, Math.max(map.get(joined) ?? 0, weight));
    }
  });
}

function getIndex(): { index: IndexedProduct[]; df: Map<string, number> } {
  if (!productIndex || !documentFrequency) {
    const df = new Map<string, number>();
    productIndex = INITIAL_PRODUCTS.map((product) => {
      const fieldTokens = new Map<string, number>();
      addTokens(fieldTokens, product.description.slice(0, 400), 0.5);
      addTokens(fieldTokens, Object.values(product.specs).join(' '), 1);
      addTokens(fieldTokens, `${product.category} ${product.condition}`, 2);
      addTokens(fieldTokens, product.brand, 2);
      addTokens(fieldTokens, product.name, 3);
      fieldTokens.forEach((_, t) => df.set(t, (df.get(t) ?? 0) + 1));
      return { product, fieldTokens };
    });
    documentFrequency = df;
  }
  return { index: productIndex, df: documentFrequency };
}

function matchesFilters(p: Product, intent: QueryIntent): boolean {
  if (intent.categories.length && !intent.categories.includes(p.category)) return false;
  // Third-party lenses are often filed under the mount brand ("Sigma 18-35mm … for Canon EF")
  if (intent.brand && p.brand.toLowerCase() !== intent.brand.toLowerCase()
    && !normalizeText(p.name).includes(intent.brand.toLowerCase())) return false;
  if (intent.condition === 'new' && p.condition !== 'Brand New') return false;
  if (intent.condition === 'preowned' && p.condition === 'Brand New') return false;
  if (intent.minPrice !== undefined && p.salePrice < intent.minPrice) return false;
  if (intent.maxPrice !== undefined && p.salePrice > intent.maxPrice) return false;
  if (intent.inStockOnly && !p.inStock) return false;
  return true;
}

export interface ProductHit {
  product: Product;
  score: number;
  matchedModel: boolean;
}

/**
 * Filter by structured intent, then rank with a field-weighted TF-IDF score.
 * Returns every hit sorted best-first so callers can paginate.
 */
export function searchProducts(intent: QueryIntent, excludeIds: string[] = []): ProductHit[] {
  const { index, df } = getIndex();
  const total = index.length;
  const exclude = new Set(excludeIds);
  const hasStructure = intent.categories.length > 0 || !!intent.brand || intent.minPrice !== undefined
    || intent.maxPrice !== undefined || !!intent.condition;

  const hits: ProductHit[] = [];
  for (const { product, fieldTokens } of index) {
    if (exclude.has(product.id) || !matchesFilters(product, intent)) continue;

    let score = 0;
    let matchedModel = false;
    for (const term of intent.terms) {
      let weight = fieldTokens.get(term) ?? 0;
      if (!weight && term.length >= 4) {
        // Prefix match for partial words ("mirrorl", "telepho")
        for (const [t, w] of fieldTokens) {
          if (t.startsWith(term)) { weight = Math.max(weight, w * 0.6); }
        }
      }
      if (!weight) continue;
      const idf = Math.log(1 + total / (df.get(term) ?? 1));
      const modelBoost = isModelToken(term) ? 3 : 1;
      if (isModelToken(term) && weight >= 3) matchedModel = true;
      score += weight * idf * modelBoost;
    }

    // A model number in the query that this product lacks is a strong mismatch
    if (intent.modelTerms.length && !matchedModel && !hasStructure) continue;
    if (score === 0 && !hasStructure) continue;

    score += product.inStock ? 0.75 : 0;
    score += product.rating * 0.1;
    hits.push({ product, score, matchedModel });
  }

  // "canon 200d" should list the 200D variants, not every Canon item
  if (intent.modelTerms.length) {
    const modelHits = hits.filter((h) => h.matchedModel);
    hits.splice(0, hits.length, ...modelHits);
  }

  hits.sort((a, b) => {
    if (intent.sort === 'price-asc') return a.product.salePrice - b.product.salePrice || b.score - a.score;
    if (intent.sort === 'price-desc') return b.product.salePrice - a.product.salePrice || b.score - a.score;
    if (Math.abs(b.score - a.score) > 0.01) return b.score - a.score;
    // Budget searches with no other signal: best camera closest to the budget first
    return intent.maxPrice !== undefined ? b.product.salePrice - a.product.salePrice : 0;
  });
  return hits;
}

export interface KnowledgeHit {
  doc: KnowledgeDoc;
  score: number;
}

export function searchKnowledge(rawQuery: string): KnowledgeHit[] {
  const tokens = new Set(tokenize(rawQuery));
  const hits: KnowledgeHit[] = [];
  for (const doc of KNOWLEDGE_DOCS) {
    let score = 0;
    for (const kw of doc.keywords) {
      if (tokens.has(kw)) score += 2;
      else if (kw.length >= 5 && [...tokens].some((t) => t.length >= 4 && (kw.startsWith(t) || t.startsWith(kw)))) score += 1;
    }
    if (score > 0) hits.push({ doc, score });
  }
  return hits.sort((a, b) => b.score - a.score);
}

export function getProductsByIds(ids: string[]): Product[] {
  const byId = new Map(INITIAL_PRODUCTS.map((p) => [p.id, p]));
  return ids.map((id) => byId.get(id)).filter((p): p is Product => !!p);
}

export function isKnownProductId(id: string): boolean {
  return INITIAL_PRODUCTS.some((p) => p.id === id);
}
