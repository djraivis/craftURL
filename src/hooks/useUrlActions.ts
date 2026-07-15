import { useCallback, useState } from 'react';
import { siteAllowsPlatformQuery } from '../constants/environments';
import type { VersionInfo } from '../types';
import { constructUrl, isValidUrl } from '../utils/urlBuilder';
import { fetchVersionNumber } from '../utils/versionCheck';

interface UseUrlActionsArgs {
  app: string;
  name: string;
  environment: string;
  platform: string;
  variant: string;
  path: string;
  isDeeplinksEnabled: boolean;
}

export function useUrlActions({
  app,
  name,
  environment,
  platform,
  variant,
  path,
  isDeeplinksEnabled
}: UseUrlActionsArgs) {
  const [previewMode, setPreviewMode] = useState<'version' | null>(null);
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [versionError, setVersionError] = useState<string | null>(null);
  const [showUrlLegend, setShowUrlLegend] = useState(false);

  const buildCurrentUrl = useCallback(() => {
    if (!name || !environment) return '';

    if (previewMode === 'version') {
      return constructUrl(app, name, environment, undefined, undefined, undefined, '/version.txt');
    }

    const includePlatformQuery = siteAllowsPlatformQuery(name);

    return constructUrl(
      app,
      name,
      environment,
      includePlatformQuery ? platform : undefined,
      includePlatformQuery ? variant : undefined,
      isDeeplinksEnabled ? path : undefined
    );
  }, [app, name, environment, platform, variant, path, isDeeplinksEnabled, previewMode]);

  const copyToClipboard = useCallback(async (): Promise<boolean> => {
    const url = buildCurrentUrl();
    if (!url || !isValidUrl(url)) return false;

    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      return false;
    }
  }, [buildCurrentUrl]);

  const openUrl = useCallback(() => {
    const url = buildCurrentUrl();
    if (!url || !isValidUrl(url)) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [buildCurrentUrl]);

  const checkVersion = useCallback(async () => {
    if (!name || !environment) return;

    const enablingVersion = previewMode !== 'version';
    setPreviewMode(enablingVersion ? 'version' : null);

    if (!enablingVersion) {
      setVersionInfo(null);
      setVersionError(null);
      return;
    }

    setVersionError(null);
    const baseUrl = constructUrl(app, name, environment);
    if (!baseUrl || !isValidUrl(baseUrl)) {
      setVersionInfo(null);
      setVersionError('Could not build a version URL for this host.');
      return;
    }

    try {
      const info = await fetchVersionNumber(baseUrl, 'version.txt');
      if (info?.version) {
        setVersionInfo(info);
        setVersionError(
          info.isMock
            ? 'Live /version.txt blocked (CORS) — showing placeholder data.'
            : null
        );
      } else {
        setVersionInfo(null);
        setVersionError('No version found at /version.txt for this host.');
      }
    } catch {
      setVersionInfo(null);
      setVersionError('Version check failed. Try again or verify the host is reachable.');
    }
  }, [app, name, environment, previewMode]);

  const toggleUrlLegend = useCallback(() => {
    setShowUrlLegend((open) => !open);
  }, []);

  return {
    previewMode,
    versionInfo,
    versionNumber: versionInfo?.version ?? null,
    versionError,
    showUrlLegend,
    copyToClipboard,
    openUrl,
    checkVersion,
    toggleUrlLegend
  };
}
