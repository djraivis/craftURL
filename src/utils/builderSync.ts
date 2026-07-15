import {
  CTV_PPDEV_DEVELOPMENT_ENVIRONMENTS,
  CTV_PPDEV_ENVIRONMENTS,
  CTV_PPDEV_TESTING_ENVIRONMENTS,
  CTV_PREPROD_ENVIRONMENTS
} from '../constants/environments';
import type { PreprodCategory } from '../constants/platformGroups';
import { getPlatformGroupsForPreprodCategory } from '../constants/platformGroups';
import { ctvProdLinks } from '../constants/prodLinks';
import { ctv_platforms } from '../constants/platforms';
import type { BuilderPreferences } from '../constants/builderDefaults';
import type { ModelVariant, PlatformParams, TunerOption } from '../types';
import {
  defaultVariantForProdSite,
  filterVariantsForContext,
  normalizeProdVariantForSite
} from './prodVariants';
import {
  defaultVariantForPlatform,
  platformGroupToId
} from './platformMapping';

/** Short label for Tuner platform scroller (URL bar still shows real ?brand= params). */
function tunerPlatformOptionLabel(entry: PlatformParams, model?: ModelVariant): string {
  if (!model || !model.value || model.name === 'Default') {
    return entry.name;
  }
  return `${entry.name} · ${model.name}`;
}

export function resolveVariantForContext(
  environmentType: string,
  name: string,
  platform: string,
  currentVariant = ''
): string {
  if (environmentType === 'production') {
    return normalizeProdVariantForSite(
      name,
      platform,
      currentVariant || defaultVariantForProdSite(name, platform)
    );
  }

  return defaultVariantForPlatform(platform);
}

function getPreprodCategoryFromName(name: string): PreprodCategory | 'all' {
  const env = CTV_PREPROD_ENVIRONMENTS.find((entry) => entry.domain === name);
  if (!env) return 'all';

  const categoryMap: Record<string, PreprodCategory> = {
    preprod: 'regression',
    partners: 'partners',
    sky: 'sky',
    fvp: 'fvp',
    suitest: 'suitest'
  };

  return categoryMap[env.id] ?? 'all';
}

/** Platform ids allowed for the current environment + site (Host and Tuner share this). */
function getAllowedPlatformIds(environmentType: string, name: string): string[] {
  if (environmentType === 'production') {
    const prodLink = ctvProdLinks.find((link) => link.url === name);
    return prodLink?.allowedPlatforms ?? ctv_platforms.map((platform) => platform.id);
  }

  if (environmentType === 'preprod') {
    const category = getPreprodCategoryFromName(name);
    if (category === 'all') {
      return ctv_platforms.map((platform) => platform.id);
    }

    const groups = getPlatformGroupsForPreprodCategory(category);
    return groups.map((group) => platformGroupToId(group));
  }

  return ctv_platforms.map((platform) => platform.id);
}

export function getAllowedPlatforms(
  environmentType: string,
  name: string
): PlatformParams[] {
  const allowed = getAllowedPlatformIds(environmentType, name);
  return ctv_platforms.filter((platform) => allowed.includes(platform.id));
}

/** Host locks platform chips in production; Tuner must follow the same rule. */
export function isPlatformSelectionLocked(environmentType: string): boolean {
  return environmentType === 'production';
}

/** Site picker values for the URL segment / Tuner list (raw hostname ids). */
export function getSiteOptions(environmentType: string): TunerOption[] {
  if (environmentType === 'production') {
    return ctvProdLinks.map((link) => ({
      id: link.url,
      label: link.url,
      value: link.url
    }));
  }

  if (environmentType === 'ppdev') {
    return [
      ...CTV_PPDEV_TESTING_ENVIRONMENTS,
      ...CTV_PPDEV_DEVELOPMENT_ENVIRONMENTS
    ].map((env) => ({
      id: env.domain,
      label: env.domain,
      value: env.domain
    }));
  }

  return CTV_PREPROD_ENVIRONMENTS.map((env) => ({
    id: env.domain,
    label: env.domain,
    value: env.domain
  }));
}

/**
 * Tuner platform list: platform (+ variant) specs for the current context.
 * In production, platform switching is locked — only the current platform’s variants.
 */
export function getTunerPlatformOptions(
  environmentType: string,
  name: string,
  currentPlatform: string
): TunerOption[] {
  let allowed = getAllowedPlatforms(environmentType, name);

  if (isPlatformSelectionLocked(environmentType)) {
    const locked = allowed.filter((entry) => entry.id === currentPlatform);
    allowed = locked.length > 0 ? locked : allowed.slice(0, 1);
  }

  const options: TunerOption[] = [];

  for (const entry of allowed) {
    const variants = filterVariantsForContext(entry.id, environmentType, name);

    if (variants.length === 0) {
      options.push({
        id: `${entry.id}|||`,
        label: tunerPlatformOptionLabel(entry),
        value: `${entry.id}|||`
      });
      continue;
    }

    for (const model of variants) {
      options.push({
        id: `${entry.id}|||${model.value}`,
        label: tunerPlatformOptionLabel(entry, model),
        value: `${entry.id}|||${model.value}`
      });
    }
  }

  return options;
}

export function resolvePlatformForContext(
  environmentType: string,
  name: string,
  preferredPlatform: string
): string {
  const allowed = getAllowedPlatformIds(environmentType, name);
  if (allowed.includes(preferredPlatform)) return preferredPlatform;
  return allowed[0] ?? preferredPlatform;
}

export function applyEnvironmentTypeChange(
  environmentType: string,
  current: Pick<BuilderPreferences, 'name' | 'platform' | 'variant'>
): BuilderPreferences {
  let name = current.name;
  let platform = current.platform;

  if (environmentType === 'ppdev') {
    const isPpdevName = CTV_PPDEV_ENVIRONMENTS.some((env) => env.domain === name);
    if (!isPpdevName) name = CTV_PPDEV_ENVIRONMENTS[0].domain;
  } else if (environmentType === 'preprod') {
    const isPreprodName = CTV_PREPROD_ENVIRONMENTS.some((env) => env.domain === name);
    if (!isPreprodName) name = CTV_PREPROD_ENVIRONMENTS[0].domain;
  } else if (environmentType === 'production') {
    const prodLink = ctvProdLinks.find((link) => link.url === name);
    if (!prodLink) {
      const firstLink = ctvProdLinks[0];
      name = firstLink.url;
      platform = firstLink.allowedPlatforms[0];
      return {
        environmentType,
        name,
        platform,
        variant: resolveVariantForContext(environmentType, name, platform)
      };
    }
    platform = prodLink.allowedPlatforms[0];
    return {
      environmentType,
      name,
      platform,
      variant: resolveVariantForContext(environmentType, name, platform)
    };
  }

  platform = resolvePlatformForContext(environmentType, name, platform);

  return {
    environmentType,
    name,
    platform,
    variant: resolveVariantForContext(environmentType, name, platform)
  };
}

export function applyNameChange(
  environmentType: string,
  name: string,
  currentPlatform: string
): BuilderPreferences {
  let platform = currentPlatform;

  if (environmentType === 'production') {
    const prodLink = ctvProdLinks.find((link) => link.url === name);
    if (prodLink) {
      platform = prodLink.allowedPlatforms[0];
    }
  } else {
    platform = resolvePlatformForContext(environmentType, name, platform);
  }

  return {
    environmentType,
    name,
    platform,
    variant: resolveVariantForContext(environmentType, name, platform)
  };
}
