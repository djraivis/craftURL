export type PreprodCategory = 'regression' | 'partners' | 'sky' | 'fvp' | 'suitest';

/** Display order for platform filter chips (matches URL builder platform order). */
export const PLATFORM_GROUP_ORDER = [
  'uktvdev',
  'Amazon',
  'Freesat',
  'FVP',
  'Google',
  'LG',
  'Samsung',
  'Sky',
  'Virgin Media',
  'YouView'
] as const;

export type CollectionPlatformGroup = (typeof PLATFORM_GROUP_ORDER)[number];

interface EnvPlatformLink {
  group: CollectionPlatformGroup;
}

const ENV_PLATFORM_LINKS: EnvPlatformLink[] = [
  { group: 'uktvdev' },
  { group: 'Amazon' },
  { group: 'Freesat' },
  { group: 'FVP' },
  { group: 'Google' },
  { group: 'LG' },
  { group: 'Samsung' },
  { group: 'Sky' },
  { group: 'Virgin Media' },
  { group: 'YouView' }
];

function isPlatformAllowedForPreprodCategory(
  platform: EnvPlatformLink,
  category: PreprodCategory
): boolean {
  if (category === 'sky') {
    return platform.group === 'Sky' || platform.group === 'uktvdev';
  }
  if (category === 'fvp') {
    return platform.group === 'FVP' || platform.group === 'uktvdev';
  }
  return true;
}

export function getPlatformGroupsForPreprodCategory(
  category: PreprodCategory
): CollectionPlatformGroup[] {
  return PLATFORM_GROUP_ORDER.filter((group) =>
    ENV_PLATFORM_LINKS.some(
      (platform) =>
        platform.group === group && isPlatformAllowedForPreprodCategory(platform, category)
    )
  );
}
