import { Environment, Name } from '../types';

// CTV Environments
export const CTV_ENVIRONMENTS: Environment[] = [
  { id: 'ppdev', name: 'PPdev', domain: 'ppdevuktv' },
  { id: 'preprod', name: 'Preprod', domain: 'ppuktv' },
  { id: 'production', name: 'Prod', domain: 'uktv' }
];

export const CTV_PPDEV_DEVELOPMENT_ENVIRONMENTS: Name[] = [
  {
    id: 'ppdev-dev1',
    name: 'Dev 1',
    domain: 'dev1',
    category: 'development',
    use: 'Internal',
    purpose: 'Junior’s use for Dev/QA',
    description: 'ctv-dev1.ppdevuktv.co.uk'
  },
  {
    id: 'ppdev-dev2',
    name: 'Dev 2',
    domain: 'dev2',
    category: 'development',
    use: 'Internal',
    purpose: 'Adrian’s use for Dev/QA',
    description: 'ctv-dev2.ppdevuktv.co.uk'
  },
  {
    id: 'ppdev-dev3',
    name: 'Dev 3',
    domain: 'dev3',
    category: 'development',
    use: 'Internal',
    purpose: 'Marek’s use for Dev/QA',
    description: 'ctv-dev3.ppdevuktv.co.uk'
  },
  {
    id: 'ppdev-dev4',
    name: 'Dev 4',
    domain: 'dev4',
    category: 'development',
    use: 'Internal',
    purpose: 'John’s use for Dev/QA',
    description: 'ctv-dev4.ppdevuktv.co.uk'
  },
  {
    id: 'ppdev-dev5',
    name: 'Dev 5',
    domain: 'dev5',
    category: 'development',
    use: 'Internal',
    purpose: 'Jack’s use for Dev/QA',
    description: 'ctv-dev5.ppdevuktv.co.uk'
  },
  {
    id: 'ppdev-dev6',
    name: 'Dev 6',
    domain: 'dev6',
    category: 'development',
    use: 'Internal',
    purpose: 'OJ’s use for Dev/QA',
    description: 'ctv-dev6.ppdevuktv.co.uk'
  }
];

export const CTV_PPDEV_TESTING_ENVIRONMENTS: Name[] = [
  {
    id: 'ppdev-primary',
    name: 'Primary',
    domain: 'primary',
    category: 'testing',
    use: 'Internal · Allow — IPSet / Playwright',
    purpose: 'QA Integrated Env',
    description: 'ctv-primary.ppdevuktv.co.uk'
  },
  {
    id: 'ppdev-secondary',
    name: 'Secondary',
    domain: 'secondary',
    category: 'testing',
    use: 'Internal',
    purpose: 'QA Feature Env',
    description: 'ctv-secondary.ppdevuktv.co.uk'
  },
  {
    id: 'ppdev-tertiary',
    name: 'Tertiary',
    domain: 'tertiary',
    category: 'testing',
    use: 'Internal',
    purpose: 'QA Feature Env',
    description: 'ctv-tertiary.ppdevuktv.co.uk'
  },
  {
    id: 'ppdev-quaternary',
    name: 'Quaternary',
    domain: 'quaternary',
    category: 'testing',
    use: 'Internal',
    purpose: 'QA Feature Env',
    description: 'ctv-quaternary.ppdevuktv.co.uk'
  },
  {
    id: 'ppdev-quinary',
    name: 'Quinary',
    domain: 'quinary',
    category: 'testing',
    use: 'Internal',
    purpose: 'QA Feature Env',
    description: 'ctv-quinary.ppdevuktv.co.uk'
  },
  {
    id: 'ppdev-senary',
    name: 'Senary',
    domain: 'senary',
    category: 'testing',
    use: 'Internal',
    purpose: 'QA Feature Env',
    description: 'ctv-senary.ppdevuktv.co.uk'
  },
  {
    id: 'ppdev-testing',
    name: 'Testing',
    domain: 'testing',
    category: 'testing',
    use: 'Internal',
    purpose: 'Backend testing env',
    description: 'ctv-testing.ppdevuktv.co.uk'
  },
  {
    id: 'ppdev-simtest',
    name: 'Simtest',
    domain: 'simtest',
    category: 'testing',
    use: 'Internal',
    purpose: 'Simulcast sample player',
    description: 'ctv-simtest.ppdevuktv.co.uk'
  },
  {
    id: 'ppdev-suitest',
    name: 'Suitest',
    domain: 'suitest',
    category: 'testing',
    use: 'Internal',
    purpose: 'Suitest env for QA automation',
    description: 'ctv-suitest.ppdevuktv.co.uk'
  },
  {
    id: 'ppdev-devtools',
    name: 'DevTools',
    domain: 'ppdev-devtools',
    category: 'testing',
    use: 'Internal',
    purpose: 'Instance to use dev tools',
    description: 'ctv-ppdev-devtools.ppdevuktv.co.uk'
  }
];

export function isDevToolsSite(siteName: string): boolean {
  return siteName === 'ppdev-devtools';
}

/** Hosts that never take ?brand= / model query params. */
export function siteAllowsPlatformQuery(siteName: string): boolean {
  return !isDevToolsSite(siteName);
}

/** DevTools is host-only — deeplink paths are not supported. */
export function siteAllowsDeeplinks(siteName: string): boolean {
  return !isDevToolsSite(siteName);
}

export const CTV_PPDEV_ENVIRONMENTS: Name[] = [
  ...CTV_PPDEV_TESTING_ENVIRONMENTS,
  ...CTV_PPDEV_DEVELOPMENT_ENVIRONMENTS
];

export const CTV_PREPROD_ENVIRONMENTS: Name[] = [
  {
    id: 'preprod',
    name: 'UKTV',
    domain: 'uktv',
    use: 'Internal · Allow — IPSet / Playwright',
    purpose: 'Regression testing',
    description: 'ctv-uktv.ppuktv.co.uk'
  },
  {
    id: 'partners',
    name: 'Partners',
    domain: 'partners',
    use: 'External · Allow — Geo / NL',
    purpose:
      'Reserved for sharing with external partners for their testing (e.g. Everyone TV, YouView etc.)',
    description: 'ctv-partners.ppuktv.co.uk'
  },
  {
    id: 'sky',
    name: 'Sky',
    domain: 'sky',
    use: 'External',
    purpose: 'Temporary bucket dedicated to Sky app testing',
    description: 'ctv-sky.ppuktv.co.uk'
  },
  {
    id: 'fvp',
    name: 'FVP',
    domain: 'fvp',
    use: 'External · Allow — IPSet / lg-ctv',
    purpose: 'Temporary bucket dedicated to FVP app testing',
    description: 'ctv-fvp.ppuktv.co.uk'
  },
  {
    id: 'suitest',
    name: 'Suitest',
    domain: 'suitest',
    use: 'Internal · Allow — IPSet / suitest',
    purpose: 'Reserved for CTV automation',
    description: 'ctv-suitest.ppuktv.co.uk'
  },
  {
    id: 'chromecast',
    name: 'Chromecast',
    domain: 'chromecast',
    use: 'Internal',
    purpose:
      'For hosting Chromecast app, not technically CTV but so similar it might as well be!',
    description: 'chromecast.ppuktv.co.uk'
  },
  {
    id: 'freely',
    name: 'Freely',
    domain: 'freely',
    description: 'ctv-freely.ppuktv.co.uk'
  }
];
