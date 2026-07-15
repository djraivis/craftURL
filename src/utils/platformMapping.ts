import type { CollectionPlatformGroup } from '../constants/platformGroups';
import { ctv_platforms } from '../constants/platforms';

const GROUP_TO_PLATFORM_ID: Record<CollectionPlatformGroup, string> = {
  uktvdev: 'uktvdev',
  Amazon: 'amazon',
  Freesat: 'freesat',
  FVP: 'fvp',
  Google: 'android',
  LG: 'lg',
  Samsung: 'samsung',
  Sky: 'sky',
  'Virgin Media': 'virginmedia',
  YouView: 'youview'
};

export function platformGroupToId(group: CollectionPlatformGroup): string {
  return GROUP_TO_PLATFORM_ID[group];
}

export function defaultVariantForPlatform(platformId: string): string {
  if (platformId === 'amazon') return '&model=firetv';
  return '';
}

export function isKnownPlatformId(platformId: string): boolean {
  return ctv_platforms.some((platform) => platform.id === platformId);
}
