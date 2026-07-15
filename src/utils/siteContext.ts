import {
  CTV_PPDEV_ENVIRONMENTS,
  CTV_PREPROD_ENVIRONMENTS
} from '../constants/environments';
import { deeplinkOptions } from '../constants/deeplinks';
import { ctvProdLinks } from '../constants/prodLinks';

export type SiteContextFacts = {
  use?: string;
  purpose?: string;
};

/** Purpose/Use facts for the info panel (pure lookup — no UI). */
export function getSiteContextFacts(
  environmentType: string,
  name: string
): SiteContextFacts | null {
  if (!environmentType || !name) return null;

  if (environmentType === 'ppdev') {
    const env = CTV_PPDEV_ENVIRONMENTS.find((entry) => entry.domain === name);
    return env ? { use: env.use, purpose: env.purpose } : null;
  }

  if (environmentType === 'preprod') {
    const env = CTV_PREPROD_ENVIRONMENTS.find((entry) => entry.domain === name);
    return env ? { use: env.use, purpose: env.purpose } : null;
  }

  if (environmentType === 'production') {
    const link = ctvProdLinks.find((entry) => entry.url === name);
    return link ? { use: link.use, purpose: link.purpose } : null;
  }

  return null;
}

export function getDeeplinkContextFacts(deeplinkId: string) {
  return deeplinkOptions.find((option) => option.id === deeplinkId) ?? null;
}
