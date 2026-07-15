import { describe, expect, it } from 'vitest';
import { deeplinkOptions } from '../constants/deeplinks';
import { fillDeeplinkTemplate, resolveDeeplinkPath } from './fillDeeplinkTemplate';

const sample = {
  slug: 'stacey-dooley-sleeps-over-family-and-me',
  houseNumber: 'CTOQ773F',
  videoId: '6331513186112',
  seriesNumber: '1'
};

function template(id: string): string {
  const option = deeplinkOptions.find((entry) => entry.id === id);
  if (!option) throw new Error(`Missing deeplink ${id}`);
  return option.url;
}

describe('deeplink templates vs documented formats', () => {
  it('matches Video Page', () => {
    expect(fillDeeplinkTemplate(template('video-page'), sample)).toBe(
      'deeplink/CTOQ773F/auto-tune'
    );
  });

  it('matches Brand Page (trailing slash like examples)', () => {
    expect(fillDeeplinkTemplate(template('brand-page'), sample)).toBe(
      'shows/stacey-dooley-sleeps-over-family-and-me/watch-online/'
    );
  });

  it('matches Landing Episode autoplay', () => {
    expect(fillDeeplinkTemplate(template('landing-episode'), sample)).toBe(
      'shows/stacey-dooley-sleeps-over-family-and-me/watch-online/auto-tune'
    );
  });

  it('matches Episode Page', () => {
    expect(
      fillDeeplinkTemplate(template('episode-page'), {
        slug: 'outsiders',
        houseNumber: 'CTOQ463K'
      })
    ).toBe('shows/outsiders/watch-online/house-number/CTOQ463K');
  });

  it('matches Episodes with Autoplay including /auto-tune', () => {
    expect(fillDeeplinkTemplate(template('episodes-autoplay'), sample)).toBe(
      'shows/stacey-dooley-sleeps-over-family-and-me/watch-online/6331513186112/auto-tune'
    );
  });

  it('matches Series', () => {
    expect(fillDeeplinkTemplate(template('destination-series'), sample)).toBe(
      'shows/stacey-dooley-sleeps-over-family-and-me/watch-online/series/1'
    );
  });

  it('resolves from brand + episode fields', () => {
    expect(
      resolveDeeplinkPath(
        template('episode-page'),
        { id: 1, name: 'Outsiders', slug: 'outsiders' },
        {
          id: 2,
          house_number: 'CTOQ463K',
          brand_slug: 'outsiders'
        }
      )
    ).toBe('shows/outsiders/watch-online/house-number/CTOQ463K');
  });
});
