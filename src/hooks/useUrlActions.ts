import { useCallback, useState } from 'react';
import { siteAllowsPlatformQuery } from '../constants/environments';
import { constructUrl, isValidUrl } from '../utils/urlBuilder';

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
  const [showUrlLegend, setShowUrlLegend] = useState(false);

  const buildCurrentUrl = useCallback(() => {
    if (!name || !environment) return '';

    const includePlatformQuery = siteAllowsPlatformQuery(name);

    return constructUrl(
      app,
      name,
      environment,
      includePlatformQuery ? platform : undefined,
      includePlatformQuery ? variant : undefined,
      isDeeplinksEnabled ? path : undefined
    );
  }, [app, name, environment, platform, variant, path, isDeeplinksEnabled]);

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

  const toggleUrlLegend = useCallback(() => {
    setShowUrlLegend((open) => !open);
  }, []);

  return {
    showUrlLegend,
    copyToClipboard,
    openUrl,
    toggleUrlLegend
  };
}
