import type { ModelVariant } from '../types';
import { ctv_variants } from '../constants/platforms';
import { defaultVariantForPlatform } from './platformMapping';

/** Allowed ModelVariant ids per production site hostname id. */
const PROD_SITE_VARIANT_IDS: Record<string, string[]> = {
  amazonfire: ['firetv'],
  amazonkepler: ['kepler', 'kepler-dash'],
  freeviewplay: ['fvp-default'],
  lg: ['fvp-lg-default'],
  sky: ['sky-default', 'sky-q'],
  youview: ['default', 'atv']
};

function getProdSiteVariantIds(prodSite: string): string[] | null {
  return PROD_SITE_VARIANT_IDS[prodSite] ?? null;
}

export function filterVariantsForContext(
  platform: string,
  environmentType: string,
  name: string
): ModelVariant[] {
  const variants = ctv_variants.filter((variant) => variant.platforms.includes(platform));

  if (environmentType !== 'production') {
    return variants;
  }

  const allowedIds = getProdSiteVariantIds(name);
  if (!allowedIds) {
    return variants;
  }

  return variants.filter((variant) => allowedIds.includes(variant.id));
}

export function defaultVariantForProdSite(prodSite: string, platform: string): string {
  const allowedIds = getProdSiteVariantIds(prodSite);
  if (!allowedIds?.length) {
    return defaultVariantForPlatform(platform);
  }

  const match = ctv_variants.find((variant) => variant.id === allowedIds[0]);
  return match?.value ?? defaultVariantForPlatform(platform);
}

export function normalizeProdVariantForSite(
  prodSite: string,
  platform: string,
  variant: string
): string {
  const allowedIds = getProdSiteVariantIds(prodSite);
  if (!allowedIds) {
    return variant || defaultVariantForPlatform(platform);
  }

  const allowed = filterVariantsForContext(platform, 'production', prodSite);
  if (allowed.some((entry) => entry.value === variant)) {
    return variant;
  }

  return defaultVariantForProdSite(prodSite, platform);
}
