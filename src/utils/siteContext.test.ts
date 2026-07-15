import { describe, expect, it } from 'vitest';
import { getDeeplinkContextFacts, getSiteContextFacts } from './siteContext';

describe('getSiteContextFacts', () => {
  it('resolves ppdev site purpose/use', () => {
    expect(getSiteContextFacts('ppdev', 'dev1')).toEqual({
      use: 'Internal',
      purpose: 'Junior’s use for Dev/QA'
    });
    expect(getSiteContextFacts('ppdev', 'dev2')?.purpose).toBe(
      'Adrian’s use for Dev/QA'
    );
    expect(getSiteContextFacts('ppdev', 'primary')).toEqual({
      use: 'Internal · Allow — IPSet / Playwright',
      purpose: 'QA Integrated Env'
    });
  });

  it('resolves preprod site purpose/use', () => {
    expect(getSiteContextFacts('preprod', 'uktv')).toEqual({
      use: 'Internal · Allow — IPSet / Playwright',
      purpose: 'Regression testing'
    });
    expect(getSiteContextFacts('preprod', 'partners')?.use).toBe(
      'External · Allow — Geo / NL'
    );
    expect(getSiteContextFacts('preprod', 'chromecast')?.purpose).toMatch(
      /Chromecast/
    );
  });

  it('resolves production site purpose/use', () => {
    const facts = getSiteContextFacts('production', 'freeviewplay');
    expect(facts).toEqual({
      use: 'Live',
      purpose: 'Live Freeview Play CTV app host'
    });
  });

  it('returns null for unknown names', () => {
    expect(getSiteContextFacts('production', 'not-a-site')).toBeNull();
    expect(getSiteContextFacts('', 'dev1')).toBeNull();
  });
});

describe('getDeeplinkContextFacts', () => {
  it('finds a known deeplink template', () => {
    const facts = getDeeplinkContextFacts('brand-page');
    expect(facts?.id).toBe('brand-page');
    expect(facts?.destination || facts?.format).toBeTruthy();
  });

  it('returns null for unknown ids', () => {
    expect(getDeeplinkContextFacts('missing-deeplink')).toBeNull();
  });
});
