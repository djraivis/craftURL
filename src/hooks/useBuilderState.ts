import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getEnvironmentDomainForType,
  INITIAL_BUILDER_STATE
} from '../constants/builderDefaults';
import { siteAllowsDeeplinks } from '../constants/environments';
import { loadBuilderPreferences } from '../utils/builderPreferencesStorage';
import type { DeeplinkOption } from '../types';
import { useDeeplinkContent } from './useDeeplinkContent';
import { useHostPreferences } from './useHostPreferences';
import { useUrlActions } from './useUrlActions';
import { useTunerMode } from './useTunerMode';

const storedBuilderPreferences = loadBuilderPreferences();

export function useBuilderState() {
  const [app] = useState(INITIAL_BUILDER_STATE.app);

  const {
    environmentType,
    name,
    environment,
    platform,
    variant,
    applyBuilderPreferences,
    environmentOptions,
    siteOptions,
    platformOptions,
    handleEnvironmentTypeSelect,
    handleNameSelect,
    handlePlatformSelect,
    handleVariantSelect
  } = useHostPreferences();

  const {
    path,
    isDeeplinksEnabled,
    selectedDeeplink,
    clearDeeplinkState,
    handleDeeplinkSelect,
    handleContentChange
  } = useDeeplinkContent();

  const handleDeeplinkSelectGuarded = useCallback(
    (deeplink: DeeplinkOption) => {
      if (!siteAllowsDeeplinks(name) && deeplink.id) return;
      handleDeeplinkSelect(deeplink);
    },
    [name, handleDeeplinkSelect]
  );

  useEffect(() => {
    if (!siteAllowsDeeplinks(name) && isDeeplinksEnabled) {
      clearDeeplinkState();
    }
  }, [name, isDeeplinksEnabled, clearDeeplinkState]);

  const {
    isTunerMode,
    isRetuning,
    retuningSegments,
    settlingSegments,
    enterTunerMode,
    exitTunerMode,
    retune,
    handleTunerPlatformSpec,
    handleTunerEnvironmentSelect,
    handleTunerSiteSelect
  } = useTunerMode({
    environmentType,
    name,
    platform,
    variant,
    isDeeplinksEnabled,
    applyBuilderPreferences,
    clearDeeplinkState,
    onEnvironmentTypeSelect: handleEnvironmentTypeSelect,
    onNameSelect: handleNameSelect
  });

  const {
    showUrlLegend,
    copyToClipboard,
    openUrl,
    toggleUrlLegend
  } = useUrlActions({
    app,
    name,
    environment,
    platform,
    variant,
    path,
    isDeeplinksEnabled
  });

  const previousValues = useRef({
    app: INITIAL_BUILDER_STATE.app,
    name: storedBuilderPreferences.name,
    environment: getEnvironmentDomainForType(storedBuilderPreferences.environmentType),
    platform: storedBuilderPreferences.platform,
    variant: storedBuilderPreferences.variant,
    path: INITIAL_BUILDER_STATE.path
  });

  useEffect(() => {
    previousValues.current = {
      app,
      name,
      environment,
      platform,
      variant,
      path
    };
  }, [app, name, environment, platform, variant, path]);

  return {
    app,
    environmentType,
    name,
    environment,
    platform,
    variant,
    path,
    isDeeplinksEnabled,
    selectedDeeplink,
    showUrlLegend,
    isTunerMode,
    isRetuning,
    retuningSegments,
    settlingSegments,
    previousValues,
    environmentOptions,
    siteOptions,
    platformOptions,
    handleEnvironmentTypeSelect,
    handleNameSelect,
    handlePlatformSelect,
    handleVariantSelect,
    handleTunerPlatformSpec,
    handleTunerEnvironmentSelect,
    handleTunerSiteSelect,
    handleDeeplinkSelect: handleDeeplinkSelectGuarded,
    handleContentChange,
    enterTunerMode,
    exitTunerMode,
    retune,
    copyToClipboard,
    openUrl,
    toggleUrlLegend
  };
}
