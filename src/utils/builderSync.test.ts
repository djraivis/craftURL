import { describe, expect, it } from 'vitest';
import {
  CTV_PPDEV_ENVIRONMENTS,
  CTV_PREPROD_ENVIRONMENTS
} from '../constants/environments';
import { ctvProdLinks } from '../constants/prodLinks';
import {
  applyEnvironmentTypeChange,
  applyNameChange,
  getAllowedPlatforms,
  getSiteOptions,
  getTunerPlatformOptions,
  isPlatformSelectionLocked,
  resolvePlatformForContext,
  resolveVariantForContext
} from './builderSync';

describe('isPlatformSelectionLocked', () => {
  it('locks only production', () => {
    expect(isPlatformSelectionLocked('production')).toBe(true);
    expect(isPlatformSelectionLocked('ppdev')).toBe(false);
    expect(isPlatformSelectionLocked('preprod')).toBe(false);
  });
});

describe('getAllowedPlatforms', () => {
  it('returns the prod site allow-list', () => {
    const platforms = getAllowedPlatforms('production', 'amazonfire');
    expect(platforms.map((entry) => entry.id)).toEqual(['amazon']);
  });

  it('returns all platforms for unrestricted ppdev', () => {
    const platforms = getAllowedPlatforms('ppdev', 'dev1');
    expect(platforms.length).toBeGreaterThan(5);
    expect(platforms.some((entry) => entry.id === 'fvp')).toBe(true);
  });
});

describe('resolvePlatformForContext', () => {
  it('keeps a preferred platform when allowed', () => {
    expect(resolvePlatformForContext('production', 'samsung', 'samsung')).toBe('samsung');
  });

  it('falls back to the first allowed platform when preferred is invalid', () => {
    expect(resolvePlatformForContext('production', 'amazonfire', 'fvp')).toBe('amazon');
  });
});

describe('resolveVariantForContext', () => {
  it('uses prod site defaults in production', () => {
    expect(resolveVariantForContext('production', 'amazonfire', 'amazon')).toBe(
      '&model=firetv'
    );
  });

  it('keeps a valid current prod variant', () => {
    expect(
      resolveVariantForContext(
        'production',
        'amazonkepler',
        'amazon',
        '&model=kepler&variant=dash'
      )
    ).toBe('&model=kepler&variant=dash');
  });
});

describe('getSiteOptions', () => {
  it('lists production site ids', () => {
    const options = getSiteOptions('production');
    expect(options.map((entry) => entry.value)).toEqual(
      ctvProdLinks.map((link) => link.url)
    );
  });

  it('lists ppdev domains', () => {
    const options = getSiteOptions('ppdev');
    expect(options.some((entry) => entry.value === 'dev1')).toBe(true);
    expect(options.some((entry) => entry.value === 'primary')).toBe(true);
  });
});

describe('getTunerPlatformOptions', () => {
  it('uses short labels instead of ?brand= query strings', () => {
    const options = getTunerPlatformOptions('ppdev', 'dev1', 'fvp');
    expect(options.length).toBeGreaterThan(0);
    expect(options.every((entry) => !entry.label.includes('?brand='))).toBe(true);
    expect(options.some((entry) => entry.label === 'FVP' || entry.label.startsWith('FVP'))).toBe(
      true
    );
  });

  it('locks production Tuner options to the current platform', () => {
    const options = getTunerPlatformOptions('production', 'amazonfire', 'amazon');
    expect(options.every((entry) => entry.value.startsWith('amazon|||'))).toBe(true);
    expect(options.some((entry) => entry.value === 'amazon|||&model=firetv')).toBe(true);
  });
});

describe('applyEnvironmentTypeChange', () => {
  it('moves onto a valid ppdev site when leaving production', () => {
    const next = applyEnvironmentTypeChange('ppdev', {
      name: 'amazonfire',
      platform: 'amazon',
      variant: '&model=firetv'
    });

    expect(next.environmentType).toBe('ppdev');
    expect(CTV_PPDEV_ENVIRONMENTS.some((env) => env.domain === next.name)).toBe(true);
    expect(next.platform).toBeTruthy();
  });

  it('locks production onto the site allow-list platform', () => {
    const next = applyEnvironmentTypeChange('production', {
      name: 'freeviewplay',
      platform: 'amazon',
      variant: ''
    });

    expect(next).toEqual({
      environmentType: 'production',
      name: 'freeviewplay',
      platform: 'fvp',
      variant: ''
    });
  });

  it('defaults to the first prod site when the current name is not production', () => {
    const next = applyEnvironmentTypeChange('production', {
      name: 'dev1',
      platform: 'fvp',
      variant: ''
    });

    expect(next.environmentType).toBe('production');
    expect(next.name).toBe(ctvProdLinks[0].url);
    expect(next.platform).toBe(ctvProdLinks[0].allowedPlatforms[0]);
  });
});

describe('applyNameChange', () => {
  it('switches production platform when the site changes', () => {
    const next = applyNameChange('production', 'youview', 'amazon');
    expect(next.platform).toBe('youview');
    expect(['', '&model=atv']).toContain(next.variant);
  });

  it('keeps a still-allowed platform on preprod', () => {
    const next = applyNameChange('preprod', CTV_PREPROD_ENVIRONMENTS[0].domain, 'fvp');
    expect(next.name).toBe(CTV_PREPROD_ENVIRONMENTS[0].domain);
    expect(next.platform).toBe('fvp');
  });
});
