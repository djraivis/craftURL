import { logger } from './logger';
import { CTV_VERSION_MOCK } from '../config/mockData';
import type { VersionInfo } from '../types';
import { isValidUrl, normalizeUrl } from './urlBuilder';

type VersionTxtJson = {
  version?: string;
  hash?: string;
  branch?: string;
};

export function parseVersionTxt(text: string): VersionInfo {
  const trimmed = text.trim();

  try {
    const json = JSON.parse(trimmed) as VersionTxtJson;
    if (json.version) {
      return {
        success: Date.now(),
        version: String(json.version),
        hash: json.hash ? String(json.hash) : undefined,
        branch: json.branch ? String(json.branch) : undefined
      };
    }
  } catch {
    // Fall through to legacy text formats
  }

  const successMatch = trimmed.match(/success:\s*(\d+)/);
  const versionMatch = trimmed.match(/version:\s*([^\s,}"]+)/);
  const hashMatch = trimmed.match(/hash:\s*([a-fA-F0-9]+)/);
  const branchMatch = trimmed.match(/branch:\s*([^\s,"]+)/);

  if (versionMatch) {
    return {
      success: successMatch ? parseInt(successMatch[1], 10) : Date.now(),
      version: versionMatch[1],
      hash: hashMatch?.[1],
      branch: branchMatch?.[1]
    };
  }

  const simpleVersionMatch = trimmed.match(/([\d]+(?:\.[\d]+)*(?:-[A-Za-z0-9.]+)?)/);
  if (simpleVersionMatch) {
    return {
      success: Date.now(),
      version: simpleVersionMatch[1]
    };
  }

  throw new Error('Could not parse version information from response');
}

async function fetchRealVersionNumber(
  baseUrl: string,
  versionFile: string
): Promise<VersionInfo> {
  if (!baseUrl) {
    throw new Error('Base URL is empty');
  }

  let urlToCheck = baseUrl;
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    urlToCheck = `https://${baseUrl}`;
  }

  if (!isValidUrl(urlToCheck)) {
    throw new Error('Invalid base URL format');
  }

  const normalizedBaseUrl = normalizeUrl(urlToCheck);
  if (!normalizedBaseUrl) {
    throw new Error('Failed to normalize base URL');
  }

  let fullUrl: string;
  try {
    fullUrl = new URL(versionFile, normalizedBaseUrl).toString();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to construct URL: ${message}`);
  }

  logger.info('Fetching version from:', fullUrl);

  const response = await fetch(fullUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return parseVersionTxt(await response.text());
}

export async function fetchVersionNumber(
  baseUrl: string,
  versionFile: string
): Promise<VersionInfo | null> {
  if (!baseUrl) {
    logger.error('Base URL is empty');
    return null;
  }

  try {
    return await fetchRealVersionNumber(baseUrl, versionFile);
  } catch (error) {
    logger.error('Version check failed, using placeholder mock:', error);
    return {
      ...CTV_VERSION_MOCK,
      success: Date.now(),
      isMock: true
    };
  }
}
