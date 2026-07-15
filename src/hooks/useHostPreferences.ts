import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getEnvironmentDomainForType,
  type BuilderPreferences
} from '../constants/builderDefaults';
import { CTV_ENVIRONMENTS } from '../constants/environments';
import { loadBuilderPreferences, saveBuilderPreferences } from '../utils/builderPreferencesStorage';
import {
  applyEnvironmentTypeChange,
  applyNameChange,
  getSiteOptions,
  getTunerPlatformOptions,
  resolveVariantForContext
} from '../utils/builderSync';
import { normalizeProdVariantForSite } from '../utils/prodVariants';
import type { TunerOption } from '../types';

const stored = loadBuilderPreferences();

export function useHostPreferences() {
  const [environmentType, setEnvironmentType] = useState(stored.environmentType);
  const [name, setName] = useState(stored.name);
  const [environment, setEnvironment] = useState(
    getEnvironmentDomainForType(stored.environmentType)
  );
  const [platform, setPlatform] = useState(stored.platform);
  const [variant, setVariant] = useState(stored.variant);

  const applyBuilderPreferences = useCallback((prefs: BuilderPreferences) => {
    setEnvironmentType(prefs.environmentType);
    setName(prefs.name);
    setPlatform(prefs.platform);
    setVariant(prefs.variant);
    setEnvironment(getEnvironmentDomainForType(prefs.environmentType));
  }, []);

  useEffect(() => {
    saveBuilderPreferences({ environmentType, name, platform, variant });
  }, [environmentType, name, platform, variant]);

  useEffect(() => {
    if (environmentType !== 'production') return;

    const normalized = normalizeProdVariantForSite(name, platform, variant);
    if (normalized !== variant) {
      setVariant(normalized);
    }
  }, [environmentType, name, platform, variant]);

  const handleEnvironmentTypeSelect = useCallback(
    (env: { id: string; domain: string }) => {
      applyBuilderPreferences(
        applyEnvironmentTypeChange(env.id, { name, platform, variant })
      );
    },
    [name, platform, variant, applyBuilderPreferences]
  );

  const handleNameSelect = useCallback(
    (selectedName: { url?: string; domain?: string }) => {
      const nameValue = selectedName.url ?? selectedName.domain ?? '';
      applyBuilderPreferences(applyNameChange(environmentType, nameValue, platform));
    },
    [environmentType, platform, applyBuilderPreferences]
  );

  const handlePlatformSelect = useCallback(
    (selectedPlatform: string) => {
      applyBuilderPreferences({
        environmentType,
        name,
        platform: selectedPlatform,
        variant: resolveVariantForContext(environmentType, name, selectedPlatform, variant)
      });
    },
    [environmentType, name, variant, applyBuilderPreferences]
  );

  const handleVariantSelect = useCallback((selectedVariant: string) => {
    setVariant(selectedVariant);
  }, []);

  const environmentOptions = useMemo<TunerOption[]>(
    () =>
      CTV_ENVIRONMENTS.map((env) => ({
        id: env.id,
        label: env.domain,
        value: env.id
      })),
    []
  );

  const siteOptions = useMemo<TunerOption[]>(
    () => getSiteOptions(environmentType),
    [environmentType]
  );

  const platformOptions = useMemo<TunerOption[]>(
    () => getTunerPlatformOptions(environmentType, name, platform),
    [environmentType, name, platform]
  );

  return {
    environmentType,
    name,
    environment,
    platform,
    variant,
    setPlatform,
    setVariant,
    applyBuilderPreferences,
    environmentOptions,
    siteOptions,
    platformOptions,
    handleEnvironmentTypeSelect,
    handleNameSelect,
    handlePlatformSelect,
    handleVariantSelect
  };
}
