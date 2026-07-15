import brandlist from '../data/brandlist.json';

export type BrandSuggestion = {
  id: number;
  name: string;
  slug: string;
};

export const BRAND_SUGGESTIONS = brandlist as BrandSuggestion[];

const SPOTLIGHT_COUNT = 3;
const FILTER_LIMIT = 3;

/** First-letter buckets so empty-focus picks span the alphabet. */
function letterBucket(name: string): 0 | 1 | 2 {
  const ch = name.trim().charAt(0).toLocaleUpperCase();
  if (ch >= 'A' && ch <= 'G') return 0;
  if (ch >= 'H' && ch <= 'N') return 1;
  return 2;
}

function shuffleInPlace<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/** Three random titles, preferably from different A–G / H–N / O–Z ranges. */
export function pickSpotlightSuggestions(
  brands: BrandSuggestion[] = BRAND_SUGGESTIONS,
  count = SPOTLIGHT_COUNT
): BrandSuggestion[] {
  if (brands.length === 0) return [];

  const buckets: BrandSuggestion[][] = [[], [], []];
  for (const brand of brands) {
    buckets[letterBucket(brand.name)].push(brand);
  }

  const picked: BrandSuggestion[] = [];
  const used = new Set<number>();

  for (const bucket of buckets) {
    if (picked.length >= count) break;
    const pool = shuffleInPlace([...bucket]).filter((b) => !used.has(b.id));
    const next = pool[0];
    if (next) {
      picked.push(next);
      used.add(next.id);
    }
  }

  if (picked.length < count) {
    const rest = shuffleInPlace(brands.filter((b) => !used.has(b.id)));
    for (const brand of rest) {
      if (picked.length >= count) break;
      picked.push(brand);
    }
  }

  return shuffleInPlace(picked);
}

export function filterBrandSuggestions(
  query: string,
  brands: BrandSuggestion[] = BRAND_SUGGESTIONS,
  limit = FILTER_LIMIT
): BrandSuggestion[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const starts: BrandSuggestion[] = [];
  const includes: BrandSuggestion[] = [];
  const slugOrId: BrandSuggestion[] = [];

  for (const brand of brands) {
    const name = brand.name.toLowerCase();
    const slug = brand.slug.toLowerCase();
    const id = String(brand.id);

    if (name.startsWith(trimmed)) {
      starts.push(brand);
    } else if (name.includes(trimmed)) {
      includes.push(brand);
    } else if (slug.includes(trimmed) || id.startsWith(trimmed)) {
      slugOrId.push(brand);
    }

    if (starts.length >= limit) break;
  }

  return [...starts, ...includes, ...slugOrId].slice(0, limit);
}
