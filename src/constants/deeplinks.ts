import { DeeplinkOption } from '../types';

/**
 * CTV deeplink path templates.
 * Placeholders (<slug>, <houseNumber>, …) are filled from schedule content.
 * Leading slash is added by the URL bar / info panel; `url` is path-only.
 */
export const deeplinkOptions: DeeplinkOption[] = [
  {
    id: 'video-page',
    name: 'Video Page',
    url: 'deeplink/<houseNumber>/auto-tune',
    destination: 'Video Page',
    format: '/deeplink/:houseNumber/auto-tune'
  },
  {
    id: 'brand-page',
    name: 'Brand Page',
    url: 'shows/<slug>/watch-online/',
    destination: 'Brand Page',
    format: '/shows/:brandSlug/watch-online'
  },
  {
    id: 'landing-episode',
    name: 'Landing Episode',
    url: 'shows/<slug>/watch-online/auto-tune',
    destination: 'Landing Episode (Brand with Autoplay)',
    format: '/shows/:brandSlug/watch-online/auto-tune'
  },
  {
    id: 'episode-page',
    name: 'Episode Page',
    url: 'shows/<slug>/watch-online/house-number/<houseNumber>',
    destination: 'Episode Page',
    format: '/shows/:brandSlug/watch-online/house-number/:houseNumber'
  },
  {
    id: 'episodes-autoplay',
    name: 'Episodes (Autoplay)',
    // Format requires trailing /auto-tune (doc example URL omitted it — treat Format as source of truth)
    url: 'shows/<slug>/watch-online/<videoId>/auto-tune',
    destination: 'Episodes (with Autoplay)',
    format: '/shows/:brandSlug/watch-online/:videoId/auto-tune'
  },
  {
    id: 'destination-series',
    name: 'Series',
    url: 'shows/<slug>/watch-online/series/<seriesNumber>',
    destination: 'Series',
    format: '/shows/:brandSlug/watch-online/series/:seriesNumber'
  }
];
