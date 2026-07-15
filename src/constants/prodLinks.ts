import type { ProdLink } from '../types';

interface ProdSite {
  site: string;
  name: string;
  allowedPlatforms: string[];
  /** Audience / release lane — mirrors Name.use on PPDev/PreProd */
  use: string;
  /** What this live host is for — mirrors Name.purpose */
  purpose: string;
}

/** Production sites — alphabetical by display name */
const PROD_SITES: ProdSite[] = [
  {
    site: 'amazonfire',
    name: 'Amazon Fire',
    allowedPlatforms: ['amazon'],
    use: 'Live',
    purpose: 'Live Amazon Fire TV CTV app host'
  },
  {
    site: 'amazonkepler',
    name: 'Amazon Kepler',
    allowedPlatforms: ['amazon'],
    use: 'Live',
    purpose: 'Live Amazon Kepler (Vega) CTV app host'
  },
  {
    site: 'freesat',
    name: 'Freesat',
    allowedPlatforms: ['freesat'],
    use: 'Live',
    purpose: 'Live Freesat CTV app host'
  },
  {
    site: 'freeviewplay',
    name: 'FVP',
    allowedPlatforms: ['fvp'],
    use: 'Live',
    purpose: 'Live Freeview Play CTV app host'
  },
  {
    site: 'android',
    name: 'Google',
    allowedPlatforms: ['android'],
    use: 'Live',
    purpose: 'Live Android TV / Google CTV app host'
  },
  {
    site: 'lg',
    name: 'LG',
    allowedPlatforms: ['fvp'],
    use: 'Live',
    purpose: 'Live LG Freeview Play CTV app host'
  },
  {
    site: 'lgwebos',
    name: 'LG webOS',
    allowedPlatforms: ['lg'],
    use: 'Live',
    purpose: 'Live LG webOS CTV app host'
  },
  {
    site: 'samsung',
    name: 'Samsung',
    allowedPlatforms: ['samsung'],
    use: 'Live',
    purpose: 'Live Samsung Tizen CTV app host'
  },
  {
    site: 'samsung-alt',
    name: 'Samsung Alt',
    allowedPlatforms: ['samsung'],
    use: 'Live',
    purpose: 'Alternate live Samsung Tizen CTV app host'
  },
  {
    site: 'sky',
    name: 'Sky',
    allowedPlatforms: ['sky'],
    use: 'Live',
    purpose: 'Live Sky CTV app host'
  },
  {
    site: 'virginmedia',
    name: 'VM',
    allowedPlatforms: ['virginmedia'],
    use: 'Live',
    purpose: 'Live Virgin Media CTV app host'
  },
  {
    site: 'youview',
    name: 'YouView',
    allowedPlatforms: ['youview'],
    use: 'Live',
    purpose: 'Live YouView CTV app host'
  }
];

export const ctvProdLinks: ProdLink[] = PROD_SITES.map(
  ({ site, name, allowedPlatforms, use, purpose }) => ({
    id: site,
    name,
    url: site,
    allowedPlatforms,
    use,
    purpose
  })
);
