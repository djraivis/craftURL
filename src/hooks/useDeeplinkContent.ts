import { useCallback, useState } from 'react';
import { INITIAL_BUILDER_STATE } from '../constants/builderDefaults';
import { deeplinkOptions } from '../constants/deeplinks';
import { resolveDeeplinkPath } from '../utils/fillDeeplinkTemplate';
import type { ScheduleBrand, ScheduleEpisode } from '../types/schedule';

export function useDeeplinkContent() {
  const [path, setPath] = useState(INITIAL_BUILDER_STATE.path);
  const [isDeeplinksEnabled, setIsDeeplinksEnabled] = useState(
    INITIAL_BUILDER_STATE.isDeeplinksEnabled
  );
  const [selectedDeeplink, setSelectedDeeplink] = useState(
    INITIAL_BUILDER_STATE.selectedDeeplink
  );
  const [contentBrand, setContentBrand] = useState<ScheduleBrand | null>(null);
  const [contentEpisode, setContentEpisode] = useState<ScheduleEpisode | null>(null);

  const clearDeeplinkState = useCallback(() => {
    setPath('');
    setSelectedDeeplink('');
    setIsDeeplinksEnabled(false);
    setContentBrand(null);
    setContentEpisode(null);
  }, []);

  const handleDeeplinkSelect = useCallback(
    (deeplink: { id: string; url: string }) => {
      if (!deeplink.id) {
        setPath('');
        setSelectedDeeplink('');
        setIsDeeplinksEnabled(false);
        return;
      }

      const template =
        deeplinkOptions.find((option) => option.id === deeplink.id)?.url ?? deeplink.url;

      // Keep Host platform/variant selected; URL omits query while deeplink is active.
      setIsDeeplinksEnabled(true);
      setPath(resolveDeeplinkPath(template, contentBrand, contentEpisode));
      setSelectedDeeplink(deeplink.id);
    },
    [contentBrand, contentEpisode]
  );

  const handleContentChange = useCallback(
    (brand: ScheduleBrand | null, episode: ScheduleEpisode | null) => {
      setContentBrand(brand);
      setContentEpisode(episode);

      if (!selectedDeeplink) return;

      const template = deeplinkOptions.find((option) => option.id === selectedDeeplink);
      if (!template) return;

      setPath(resolveDeeplinkPath(template.url, brand, episode));
    },
    [selectedDeeplink]
  );

  return {
    path,
    isDeeplinksEnabled,
    selectedDeeplink,
    clearDeeplinkState,
    handleDeeplinkSelect,
    handleContentChange
  };
}
