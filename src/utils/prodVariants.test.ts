import { describe, expect, it } from 'vitest';
import {
  defaultVariantForProdSite,
  filterVariantsForContext,
  normalizeProdVariantForSite
} from './prodVariants';

describe('filterVariantsForContext', () => {
  it('returns all platform variants outside production', () => {
    const variants = filterVariantsForContext('amazon', 'ppdev', 'dev1');
    expect(variants.map((entry) => entry.id)).toEqual(
      expect.arrayContaining(['firetv', 'kepler', 'kepler-dash'])
    );
    expect(variants.length).toBeGreaterThanOrEqual(3);
  });

  it('narrows amazonfire production to firetv only', () => {
    const variants = filterVariantsForContext('amazon', 'production', 'amazonfire');
    expect(variants.map((entry) => entry.id)).toEqual(['firetv']);
  });

  it('narrows amazonkepler production to kepler variants', () => {
    const variants = filterVariantsForContext('amazon', 'production', 'amazonkepler');
    expect(variants.map((entry) => entry.id)).toEqual(['kepler', 'kepler-dash']);
  });

  it('leaves platforms without a prod site map unchanged', () => {
    const variants = filterVariantsForContext('freesat', 'production', 'freesat');
    expect(variants).toEqual([]);
  });
});

describe('defaultVariantForProdSite', () => {
  it('returns the first allowed prod variant value', () => {
    expect(defaultVariantForProdSite('amazonfire', 'amazon')).toBe('&model=firetv');
    expect(defaultVariantForProdSite('amazonkepler', 'amazon')).toBe('&model=kepler');
  });
});

describe('normalizeProdVariantForSite', () => {
  it('keeps a variant that is allowed for the site', () => {
    expect(
      normalizeProdVariantForSite('amazonkepler', 'amazon', '&model=kepler&variant=dash')
    ).toBe('&model=kepler&variant=dash');
  });

  it('resets a disallowed variant to the site default', () => {
    expect(normalizeProdVariantForSite('amazonfire', 'amazon', '&model=kepler')).toBe(
      '&model=firetv'
    );
  });
});
