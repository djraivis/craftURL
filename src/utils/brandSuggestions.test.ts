import { describe, expect, it } from 'vitest';
import {
  BRAND_SUGGESTIONS,
  filterBrandSuggestions,
  pickSpotlightSuggestions
} from './brandSuggestions';

describe('pickSpotlightSuggestions', () => {
  it('returns up to three brands', () => {
    const picks = pickSpotlightSuggestions(BRAND_SUGGESTIONS, 3);
    expect(picks).toHaveLength(3);
    expect(new Set(picks.map((b) => b.id)).size).toBe(3);
  });

  it('prefers different letter buckets when possible', () => {
    const sample = [
      { id: 1, name: 'Alpha', slug: 'alpha' },
      { id: 2, name: 'Bravo', slug: 'bravo' },
      { id: 3, name: 'Hotel', slug: 'hotel' },
      { id: 4, name: 'India', slug: 'india' },
      { id: 5, name: 'Oscar', slug: 'oscar' },
      { id: 6, name: 'Zulu', slug: 'zulu' }
    ];

    for (let i = 0; i < 12; i += 1) {
      const picks = pickSpotlightSuggestions(sample, 3);
      const buckets = new Set(
        picks.map((b) => {
          const ch = b.name.charAt(0).toUpperCase();
          if (ch <= 'G') return 0;
          if (ch <= 'N') return 1;
          return 2;
        })
      );
      expect(buckets.size).toBe(3);
    }
  });
});

describe('filterBrandSuggestions', () => {
  it('returns empty for blank query', () => {
    expect(filterBrandSuggestions('   ')).toEqual([]);
  });

  it('ranks name prefix matches first', () => {
    const sample = [
      { id: 1, name: 'Dave', slug: 'dave' },
      { id: 2, name: 'Later Dave', slug: 'later-dave' },
      { id: 3, name: 'Ghosts', slug: 'ghosts' }
    ];
    const results = filterBrandSuggestions('dave', sample);
    expect(results[0]?.name).toBe('Dave');
    expect(results.map((b) => b.name)).toContain('Later Dave');
  });

  it('matches brand id prefixes', () => {
    const sample = [{ id: 4368, name: 'Killerpost', slug: 'killerpost' }];
    expect(filterBrandSuggestions('436', sample)).toHaveLength(1);
  });
});
