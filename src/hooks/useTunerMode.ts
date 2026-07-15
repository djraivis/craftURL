import { useCallback, useEffect, useRef, useState } from 'react';
import { CTV_ENVIRONMENTS, siteAllowsPlatformQuery } from '../constants/environments';
import type { BuilderPreferences } from '../constants/builderDefaults';
import type { RetuneSegment } from '../types';
import {
  getSiteOptions,
  getTunerPlatformOptions,
  resolvePlatformForContext,
  resolveVariantForContext
} from '../utils/builderSync';

interface UseTunerModeArgs {
  environmentType: string;
  name: string;
  platform: string;
  variant: string;
  isDeeplinksEnabled: boolean;
  applyBuilderPreferences: (prefs: BuilderPreferences) => void;
  clearDeeplinkState: () => void;
  onEnvironmentTypeSelect: (env: { id: string; domain: string }) => void;
  onNameSelect: (selectedName: { url?: string; domain?: string }) => void;
}

type SpinState = {
  environmentType: string;
  site: string;
  platformSpec?: string;
};

function pickRandom<T>(items: readonly T[]): T | undefined {
  if (!items.length) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function parsePlatformSpec(spec: string): { platform: string; variant: string } {
  const separator = spec.indexOf('|||');
  if (separator === -1) {
    return { platform: spec, variant: '' };
  }
  return {
    platform: spec.slice(0, separator),
    variant: spec.slice(separator + 3)
  };
}

function buildPrefs(
  environmentType: string,
  site: string,
  platformSpec: string | undefined,
  fallbackPlatform: string,
  fallbackVariant: string
): BuilderPreferences {
  if (platformSpec && siteAllowsPlatformQuery(site)) {
    const parsed = parsePlatformSpec(platformSpec);
    return {
      environmentType,
      name: site,
      platform: parsed.platform,
      variant: parsed.variant
    };
  }

  const platform = resolvePlatformForContext(
    environmentType,
    site,
    fallbackPlatform || 'uktvdev'
  );
  return {
    environmentType,
    name: site,
    platform,
    variant: resolveVariantForContext(
      environmentType,
      site,
      platform,
      fallbackVariant
    )
  };
}

function pickRandomTriplet(fallbackPlatform: string): SpinState | null {
  const env = pickRandom(CTV_ENVIRONMENTS);
  if (!env) return null;

  const site = pickRandom(getSiteOptions(env.id));
  if (!site) return null;

  if (!siteAllowsPlatformQuery(site.value)) {
    return { environmentType: env.id, site: site.value };
  }

  const platformSpec = pickRandom(
    getTunerPlatformOptions(env.id, site.value, fallbackPlatform)
  )?.value;

  return {
    environmentType: env.id,
    site: site.value,
    platformSpec
  };
}

/** Slot-machine reel: site snaps first, environment later, platform last. */
const REEL_TIMING: Record<
  RetuneSegment,
  { durationMs: number; baseTickMs: number }
> = {
  site: { durationMs: 1500, baseTickMs: 110 },
  environment: { durationMs: 2200, baseTickMs: 140 },
  platform: { durationMs: 3000, baseTickMs: 170 }
};

export function useTunerMode({
  environmentType,
  name,
  platform,
  variant,
  isDeeplinksEnabled,
  applyBuilderPreferences,
  clearDeeplinkState,
  onEnvironmentTypeSelect,
  onNameSelect
}: UseTunerModeArgs) {
  const [isTunerMode, setIsTunerMode] = useState(false);
  const [isRetuning, setIsRetuning] = useState(false);
  const [retuningSegments, setRetuningSegments] = useState<RetuneSegment[]>([]);
  const [settlingSegments, setSettlingSegments] = useState<RetuneSegment[]>([]);
  const retuneGeneration = useRef(0);

  const handleTunerPlatformSpec = useCallback(
    (spec: string) => {
      const parsed = parsePlatformSpec(spec);
      applyBuilderPreferences({
        environmentType,
        name,
        platform: parsed.platform,
        variant: parsed.variant
      });
    },
    [environmentType, name, applyBuilderPreferences]
  );

  const handleTunerEnvironmentSelect = useCallback(
    (id: string) => {
      const env = CTV_ENVIRONMENTS.find((entry) => entry.id === id);
      if (env) onEnvironmentTypeSelect(env);
    },
    [onEnvironmentTypeSelect]
  );

  const handleTunerSiteSelect = useCallback(
    (value: string) => {
      onNameSelect({ url: value, domain: value });
    },
    [onNameSelect]
  );

  const enterTunerMode = useCallback(() => {
    if (isDeeplinksEnabled || !platform) {
      const nextPlatform = resolvePlatformForContext(
        environmentType,
        name,
        platform || 'uktvdev'
      );
      applyBuilderPreferences({
        environmentType,
        name,
        platform: nextPlatform,
        variant: resolveVariantForContext(environmentType, name, nextPlatform, variant)
      });
      clearDeeplinkState();
    }

    setIsTunerMode(true);
  }, [
    platform,
    isDeeplinksEnabled,
    environmentType,
    name,
    variant,
    applyBuilderPreferences,
    clearDeeplinkState
  ]);

  const exitTunerMode = useCallback(() => {
    retuneGeneration.current += 1;
    setIsRetuning(false);
    setRetuningSegments([]);
    setSettlingSegments([]);
    setIsTunerMode(false);
  }, []);

  const retune = useCallback(async () => {
    if (!isTunerMode || isRetuning) return;

    const final = pickRandomTriplet(platform);
    if (!final) return;

    const generation = retuneGeneration.current + 1;
    retuneGeneration.current = generation;
    setIsRetuning(true);

    const stillActive = () => retuneGeneration.current === generation;

    const applySpin = (state: SpinState) => {
      applyBuilderPreferences(
        buildPrefs(
          state.environmentType,
          state.site,
          state.platformSpec,
          platform,
          variant
        )
      );
    };

    if (prefersReducedMotion()) {
      applySpin(final);
      if (stillActive()) {
        setRetuningSegments([]);
        setSettlingSegments([]);
        setIsRetuning(false);
      }
      return;
    }

    const envPool = CTV_ENVIRONMENTS.map((env) => env.id);
    const sitePool = getSiteOptions(final.environmentType).map((site) => site.value);
    const platformPool = final.platformSpec
      ? getTunerPlatformOptions(final.environmentType, final.site, platform).map(
          (entry) => entry.value
        )
      : [];

    const spinState: SpinState = {
      environmentType,
      site: name,
      platformSpec: siteAllowsPlatformQuery(name)
        ? `${platform}|||${variant}`
        : undefined
    };

    const activeReels: RetuneSegment[] = ['site', 'environment'];
    if (platformPool.length > 0) activeReels.push('platform');

    setRetuningSegments(activeReels);
    setSettlingSegments([]);
    applySpin(spinState);

    const markSettling = (segment: RetuneSegment) => {
      setSettlingSegments((prev) =>
        prev.includes(segment) ? prev : [...prev, segment]
      );
      window.setTimeout(() => {
        if (!stillActive()) return;
        setSettlingSegments((prev) => prev.filter((entry) => entry !== segment));
      }, 320);
    };

    const runReel = async (segment: RetuneSegment) => {
      const { durationMs, baseTickMs } = REEL_TIMING[segment];
      const started = performance.now();
      const pool =
        segment === 'site'
          ? sitePool
          : segment === 'environment'
            ? envPool
            : platformPool;

      let cursor = Math.max(
        0,
        pool.findIndex((entry) => {
          if (segment === 'site') return entry === spinState.site;
          if (segment === 'environment') return entry === spinState.environmentType;
          return entry === spinState.platformSpec;
        })
      );
      if (cursor < 0) cursor = 0;

      while (performance.now() - started < durationMs) {
        if (!stillActive()) return;
        if (!pool.length) break;

        // Step one-by-one through the list (dropdown / reel feel)
        cursor = (cursor + 1) % pool.length;
        const next = pool[cursor];
        if (segment === 'site') spinState.site = next;
        else if (segment === 'environment') spinState.environmentType = next;
        else spinState.platformSpec = next;

        applySpin(spinState);

        const progress = (performance.now() - started) / durationMs;
        // Ease-out: quicker at first, then slower into the click
        await sleep(baseTickMs * (0.7 + progress * progress * 2.1));
      }

      if (!stillActive()) return;

      if (segment === 'site') spinState.site = final.site;
      else if (segment === 'environment') {
        spinState.environmentType = final.environmentType;
      } else {
        spinState.platformSpec = final.platformSpec;
      }

      applySpin(spinState);
      setRetuningSegments((prev) => prev.filter((entry) => entry !== segment));
      markSettling(segment);
      await sleep(90);
    };

    await Promise.all(activeReels.map((segment) => runReel(segment)));

    if (!stillActive()) return;

    applySpin(final);
    await sleep(120);

    if (!stillActive()) return;
    setRetuningSegments([]);
    setIsRetuning(false);
  }, [
    isTunerMode,
    isRetuning,
    platform,
    variant,
    environmentType,
    name,
    applyBuilderPreferences
  ]);

  useEffect(() => {
    if (!isTunerMode) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') exitTunerMode();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isTunerMode, exitTunerMode]);

  return {
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
  };
}
