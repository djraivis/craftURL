import { ctv_platforms } from '../constants/platforms';
import { logger } from './logger';

/**
 * Platform query for display / URL assembly, including the leading `?`.
 * Example: `?brand=amazon&model=firetv`
 */
export function getPlatformQueryString(platform?: string, variant?: string): string {
  if (!platform) return '';
  const platformObj = ctv_platforms.find((entry) => entry.id === platform);
  if (!platformObj) return '';
  return platformObj.queryParams + (variant || '');
}

/** Adds `/` before the first query string when the URL has no path beyond the domain root. */
const appendSearchParams = (url: string, paramString: string): string => {
  let base = url;

  if (!base.includes('?')) {
    try {
      const parsed = new URL(base);
      const hasPathBeyondRoot = parsed.pathname.length > 1;
      if (!hasPathBeyondRoot && !base.endsWith('/')) {
        base = `${base}/`;
      }
    } catch {
      if (!base.endsWith('/')) {
        base = `${base}/`;
      }
    }
  }

  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}${paramString.replace(/^\?/, '')}`;
};

/**
 * Build a CTV URL.
 * `appendPath` (e.g. `/version.txt`) is attached directly after the domain —
 * platform query and deeplink paths are omitted in that case.
 */
export const constructUrl = (
  app: string,
  name: string,
  environment: string,
  platform?: string,
  variant?: string,
  path?: string,
  appendPath?: string
): string => {
  if (!app || !name || !environment) return '';

  const domain = '.co.uk';
  // Preprod Chromecast host is bare `chromecast.ppuktv.co.uk` (no ctv- prefix).
  const host =
    name === 'chromecast' && environment === 'ppuktv'
      ? `chromecast.${environment}${domain}`
      : `${app}-${name}.${environment}${domain}`;
  let url = `https://${host}`;

  // version.txt (and similar) must sit on the domain root — not after query params
  if (appendPath) {
    return `${url}${appendPath}`;
  }

  if (path) {
    url += `/${path}`;
  }

  const query = getPlatformQueryString(platform, variant);
  if (query) {
    url = appendSearchParams(url, query.slice(1));
  }

  logger.info('Generated URL:', url);
  return url;
};

export const isValidUrl = (url: string): boolean => {
  try {
    if (!url) return false;

    let urlWithProtocol = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      urlWithProtocol = `https://${url}`;
    }

    new URL(urlWithProtocol);
    return true;
  } catch {
    logger.error('Invalid URL format:', url);
    return false;
  }
};

export const normalizeUrl = (url: string): string => {
  if (!url) return '';

  try {
    let normalizedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      normalizedUrl = `https://${url}`;
    }

    new URL(normalizedUrl);

    if (!normalizedUrl.endsWith('/')) {
      normalizedUrl += '/';
    }

    return normalizedUrl;
  } catch {
    logger.error('Failed to normalize URL:', url);
    return '';
  }
};
