import { describe, expect, it } from 'vitest';
import {
  constructUrl,
  getPlatformQueryString,
  isValidUrl,
  normalizeUrl
} from './urlBuilder';

describe('getPlatformQueryString', () => {
  it('returns brand query with optional variant', () => {
    expect(getPlatformQueryString('fvp')).toBe('?brand=fvp');
    expect(getPlatformQueryString('amazon', '&model=firetv')).toBe(
      '?brand=amazon&model=firetv'
    );
  });

  it('returns empty for missing or unknown platform', () => {
    expect(getPlatformQueryString()).toBe('');
    expect(getPlatformQueryString('not-a-platform')).toBe('');
  });
});

describe('constructUrl', () => {
  it('returns empty when required host parts are missing', () => {
    expect(constructUrl('', 'dev1', 'ppdevuktv')).toBe('');
    expect(constructUrl('ctv', '', 'ppdevuktv')).toBe('');
    expect(constructUrl('ctv', 'dev1', '')).toBe('');
  });

  it('builds an HTTPS host without platform or path', () => {
    expect(constructUrl('ctv', 'dev1', 'ppdevuktv')).toBe(
      'https://ctv-dev1.ppdevuktv.co.uk'
    );
  });

  it('uses the bare chromecast host on preprod', () => {
    expect(constructUrl('ctv', 'chromecast', 'ppuktv')).toBe(
      'https://chromecast.ppuktv.co.uk'
    );
  });

  it('builds the DevTools host', () => {
    expect(constructUrl('ctv', 'ppdev-devtools', 'ppdevuktv')).toBe(
      'https://ctv-ppdev-devtools.ppdevuktv.co.uk'
    );
  });

  it('adds platform query with a leading slash before ?', () => {
    expect(constructUrl('ctv', 'dev1', 'ppdevuktv', 'fvp')).toBe(
      'https://ctv-dev1.ppdevuktv.co.uk/?brand=fvp'
    );
  });

  it('appends variant onto platform query params', () => {
    expect(
      constructUrl('ctv', 'amazonfire', 'uktv', 'amazon', '&model=firetv')
    ).toBe('https://ctv-amazonfire.uktv.co.uk/?brand=amazon&model=firetv');
  });

  it('places deeplink path before platform query', () => {
    expect(
      constructUrl('ctv', 'dev1', 'ppdevuktv', 'fvp', undefined, 'brand/dave')
    ).toBe('https://ctv-dev1.ppdevuktv.co.uk/brand/dave?brand=fvp');
  });

  it('attaches appendPath on the domain root and skips platform/deeplink', () => {
    expect(
      constructUrl(
        'ctv',
        'dev1',
        'ppdevuktv',
        'fvp',
        '&model=atv',
        'brand/dave',
        '/version.txt'
      )
    ).toBe('https://ctv-dev1.ppdevuktv.co.uk/version.txt');
  });
});

describe('isValidUrl', () => {
  it('accepts absolute https URLs', () => {
    expect(isValidUrl('https://ctv-dev1.ppdevuktv.co.uk/?brand=fvp')).toBe(true);
  });

  it('rejects empty values', () => {
    expect(isValidUrl('')).toBe(false);
  });
});

describe('normalizeUrl', () => {
  it('ensures a trailing slash', () => {
    expect(normalizeUrl('https://ctv-dev1.ppdevuktv.co.uk')).toBe(
      'https://ctv-dev1.ppdevuktv.co.uk/'
    );
  });
});
