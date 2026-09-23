import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { UrlDisplayProps } from '../types';
import { getPlatformQueryString } from '../utils/urlBuilder';
import { CopyButton, LoadButton } from './url/UrlActionButtons';
import { UrlPart } from './url/UrlPart';
import { UrlReelStrip } from './url/UrlReelStrip';
import { UrlSegment } from './url/UrlSegment';
import { URL_EASE, URL_SHELL_DURATION } from './url/urlMotion';

type SegmentKey = 'site' | 'environment' | 'platform';

const ZEN_NAV_ORDER: SegmentKey[] = ['site', 'environment', 'platform'];

export const UrlDisplay = memo<UrlDisplayProps>(
  ({
    app,
    name,
    environment,
    platform,
    variant,
    path,
    isDeeplinksEnabled,
    showLegend = false,
    isTunerMode = false,
    retuningSegments = [],
    settlingSegments = [],
    environmentOptions = [],
    siteOptions = [],
    platformOptions = [],
    selectedEnvironmentId,
    selectedPlatformSpec,
    previousValues,
    onOpen,
    onCopy,
    onTunerEnvironmentSelect,
    onTunerSiteSelect,
    onTunerPlatformSelect
  }) => {
    const [openSegment, setOpenSegment] = useState<SegmentKey | null>(null);
    const [focusedSegment, setFocusedSegment] = useState<SegmentKey>('site');
    const shellRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const trackInnerRef = useRef<HTMLDivElement>(null);

    const getPlaceholder = (part: string) => `<${part}>`;
    const complete = Boolean(name && environment);
    const legend = showLegend || isTunerMode;
    const showSegmentLabels = legend && !isTunerMode;
    const tunerInteractive = isTunerMode;
    const suppressPartMotion = Boolean(openSegment);
    const siteRolling = retuningSegments.includes('site');
    const environmentRolling = retuningSegments.includes('environment');
    const platformRolling = retuningSegments.includes('platform');
    const siteSettling = settlingSegments.includes('site');
    const environmentSettling = settlingSegments.includes('environment');
    const platformSettling = settlingSegments.includes('platform');
    const reelClass = (rolling: boolean, settling: boolean) =>
      [rolling ? 'url-segment-rolling' : '', settling ? 'url-segment-settle' : '']
        .filter(Boolean)
        .join(' ');

    useEffect(() => {
      if (!isTunerMode) {
        setOpenSegment(null);
        setFocusedSegment('site');
      }
    }, [isTunerMode]);

    useLayoutEffect(() => {
      if (isTunerMode) return;
      const track = trackRef.current;
      const inner = trackInnerRef.current;
      if (!track || !inner) return;

      let fittedWidth = -1;

      const fit = () => {
        const available = track.clientWidth;
        if (!available || available === fittedWidth) return;
        fittedWidth = available;

        inner.style.fontSize = '';
        const maxPx = parseFloat(getComputedStyle(inner).fontSize);
        if (!maxPx) return;

        if (inner.scrollWidth <= available) return;

        const minPx = 8;
        let low = minPx;
        let high = maxPx;
        for (let i = 0; i < 10; i += 1) {
          const mid = (low + high) / 2;
          inner.style.fontSize = `${mid}px`;
          if (inner.scrollWidth <= available) low = mid;
          else high = mid;
        }
        inner.style.fontSize = `${low}px`;
        if (inner.scrollWidth > available) {
          const ratio = available / inner.scrollWidth;
          inner.style.fontSize = `${Math.max(6, low * ratio)}px`;
        }
      };

      fit();
      const observer = new ResizeObserver(fit);
      observer.observe(track);
      return () => {
        observer.disconnect();
        inner.style.fontSize = '';
      };
    }, [
      isTunerMode,
      app,
      name,
      environment,
      platform,
      variant,
      path,
      isDeeplinksEnabled,
      showSegmentLabels
    ]);

    useEffect(() => {
      if (retuningSegments.length > 0) {
        setOpenSegment(null);
      }
    }, [retuningSegments.length]);

    useEffect(() => {
      if (!openSegment) return;

      const onPointerDown = (event: MouseEvent) => {
        if (!shellRef.current?.contains(event.target as Node)) {
          setOpenSegment(null);
        }
      };

      document.addEventListener('mousedown', onPointerDown);
      return () => document.removeEventListener('mousedown', onPointerDown);
    }, [openSegment]);

    const queryParams = getPlatformQueryString(platform, variant);
    // Platform query sits after the deeplink path (when any). DevTools omits it.
    const showPlatformSegment =
      Boolean(queryParams) || (tunerInteractive && Boolean(platform));
    const platformInteractive =
      tunerInteractive && showPlatformSegment && platformOptions.length > 1;
    const navOrder = useMemo(
      () =>
        platformInteractive
          ? ZEN_NAV_ORDER
          : ZEN_NAV_ORDER.filter((key) => key !== 'platform'),
      [platformInteractive]
    );

    useEffect(() => {
      if (!platformInteractive && focusedSegment === 'platform') {
        setFocusedSegment('environment');
        if (openSegment === 'platform') setOpenSegment(null);
      }
    }, [platformInteractive, focusedSegment, openSegment]);

    useEffect(() => {
      if (!tunerInteractive) return;

      const moveFocus = (direction: 1 | -1) => {
        const current = openSegment ?? focusedSegment;
        const index = Math.max(0, navOrder.indexOf(current));
        const next = navOrder[(index + direction + navOrder.length) % navOrder.length];
        setFocusedSegment(next);
        if (openSegment) {
          setOpenSegment(null);
        }
      };

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && openSegment) {
          event.preventDefault();
          event.stopImmediatePropagation();
          setOpenSegment(null);
          return;
        }

        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          moveFocus(event.key === 'ArrowRight' ? 1 : -1);
          return;
        }

        if (openSegment) return;

        if (event.key === 'Enter' || event.key === ' ') {
          if (!navOrder.includes(focusedSegment)) return;
          event.preventDefault();
          setOpenSegment(focusedSegment);
        }
      };

      document.addEventListener('keydown', onKeyDown, true);
      return () => document.removeEventListener('keydown', onKeyDown, true);
    }, [tunerInteractive, openSegment, focusedSegment, navOrder]);

    const toggleSegment = (key: SegmentKey) => {
      if (key === 'platform' && !platformInteractive) return;
      setFocusedSegment(key);
      setOpenSegment((current) => (current === key ? null : key));
    };

    const isAppSelected = app === 'ctv';
    const bareChromecastHost = name === 'chromecast' && environment === 'ppuktv';
    const appText = app ? (isAppSelected ? app : getPlaceholder('app')) : getPlaceholder('app');
    const nameText = name || getPlaceholder('name');
    const hasDeeplinkPath = Boolean(path && isDeeplinksEnabled);
    const showDeeplinkPlaceholder = Boolean(isDeeplinksEnabled && !path);
    const reduceMotion = useReducedMotion();

    return (
      <motion.div
        ref={shellRef}
        layout={!isTunerMode && !reduceMotion}
        transition={{
          duration: reduceMotion ? 0 : URL_SHELL_DURATION,
          ease: URL_EASE
        }}
        className={`url-hero-shell ${complete ? 'url-hero-complete' : ''} ${showSegmentLabels ? 'url-legend-on' : ''} ${isTunerMode ? 'url-tuner-shell' : ''}`}
      >
        <div className={`url-hero-row ${isTunerMode ? 'url-tuner-row' : ''}`}>
          <div className="url-hero-track" ref={trackRef}>
            <div className="url-hero-track-inner" ref={trackInnerRef}>
              <UrlSegment legend={legend} showLabel={showSegmentLabels} label="Protocol">
                <UrlPart text="https://" partKey="https" isPrimary isActive isComplete={complete} />
              </UrlSegment>

              {!bareChromecastHost && (
                <UrlSegment legend={legend} showLabel={showSegmentLabels} label="App">
                  <UrlPart
                    text={appText}
                    isActive={isAppSelected}
                    isPrimary={isAppSelected}
                    shouldAnimate={!suppressPartMotion && app !== previousValues.app}
                    isComplete={complete}
                    isPlaceholder={!isAppSelected}
                  />
                  <UrlPart text="-" isPrimary isActive isComplete={complete} />
                </UrlSegment>
              )}

              <UrlSegment
                legend={legend}
                showLabel={showSegmentLabels}
                label="Site"
                interactive={tunerInteractive && !siteRolling}
                focused={tunerInteractive && focusedSegment === 'site' && !openSegment}
                open={openSegment === 'site'}
                options={siteOptions}
                selectedId={name}
                className={reelClass(siteRolling, siteSettling)}
                onFocusSegment={() => setFocusedSegment('site')}
                onToggle={() => toggleSegment('site')}
                onSelect={(value) => {
                  onTunerSiteSelect?.(value);
                  setOpenSegment(null);
                }}
              >
                {siteRolling ? (
                  <UrlReelStrip value={nameText} active />
                ) : (
                  <UrlPart
                    text={nameText}
                    isActive={Boolean(name)}
                    shouldAnimate={!suppressPartMotion && name !== previousValues.name}
                    isComplete={complete}
                    isPlaceholder={!name}
                  />
                )}
              </UrlSegment>

              <UrlSegment
                legend={legend}
                showLabel={showSegmentLabels}
                label="Environment"
                interactive={tunerInteractive && !environmentRolling}
                focused={tunerInteractive && focusedSegment === 'environment' && !openSegment}
                open={openSegment === 'environment'}
                options={environmentOptions}
                selectedId={selectedEnvironmentId}
                className={reelClass(environmentRolling, environmentSettling)}
                onFocusSegment={() => setFocusedSegment('environment')}
                onToggle={() => toggleSegment('environment')}
                onSelect={(value) => {
                  onTunerEnvironmentSelect?.(value);
                  setOpenSegment(null);
                }}
              >
                <UrlPart text="." isPrimary isActive isComplete={complete} />
                {environmentRolling ? (
                  <UrlReelStrip
                    value={environment || getPlaceholder('environment')}
                    active
                  />
                ) : (
                  <UrlPart
                    text={environment || getPlaceholder('environment')}
                    isActive={Boolean(environment)}
                    shouldAnimate={
                      !suppressPartMotion && environment !== previousValues.environment
                    }
                    isComplete={complete}
                    isPlaceholder={!environment}
                  />
                )}
              </UrlSegment>

              <UrlSegment legend={legend} showLabel={showSegmentLabels} label="Domain">
                <UrlPart text=".co.uk" isPrimary isActive isComplete={complete} />
              </UrlSegment>

              {hasDeeplinkPath && !tunerInteractive ? (
                    <UrlSegment legend={legend} showLabel={showSegmentLabels} label="Deeplink">
                      <UrlPart text="/" isPrimary isActive isComplete={complete} />
                      <UrlPart
                        text={path!}
                        isActive
                        shouldAnimate={path !== previousValues.path}
                        isComplete={complete}
                      />
                    </UrlSegment>
                  ) : null}

                  {showDeeplinkPlaceholder && !tunerInteractive ? (
                    <UrlSegment
                      legend={legend}
                      showLabel={showSegmentLabels}
                      label="Deeplink"
                      inactive
                    >
                      <UrlPart text="/" isPrimary isActive isComplete={false} />
                      <UrlPart
                        text={getPlaceholder('deeplink')}
                        isActive={false}
                        shouldAnimate
                        isComplete={false}
                        isPlaceholder
                      />
                    </UrlSegment>
                  ) : null}

                  {showPlatformSegment ? (
                    <UrlSegment
                      legend={legend}
                      showLabel={showSegmentLabels}
                      label="Platform"
                      interactive={platformInteractive && !platformRolling}
                      focused={
                        platformInteractive && focusedSegment === 'platform' && !openSegment
                      }
                      open={openSegment === 'platform'}
                      options={platformOptions}
                      selectedId={selectedPlatformSpec ?? `${platform}|||${variant ?? ''}`}
                      className={reelClass(platformRolling, platformSettling)}
                      onFocusSegment={() => setFocusedSegment('platform')}
                      onToggle={() => toggleSegment('platform')}
                      onSelect={(value) => {
                        onTunerPlatformSelect?.(value);
                        setOpenSegment(null);
                      }}
                    >
                      {/* Root needs `/` before `?`; after a deeplink path, query alone is enough */}
                      {!hasDeeplinkPath && !showDeeplinkPlaceholder ? (
                        <UrlPart text="/" isPrimary isActive isComplete={complete} />
                      ) : null}
                      {platformRolling ? (
                        <UrlReelStrip
                          value={queryParams || getPlaceholder('platformParams')}
                          active
                        />
                      ) : (
                        <UrlPart
                          text={queryParams || getPlaceholder('platformParams')}
                          partKey={`${platform}${variant}`}
                          isActive={Boolean(queryParams)}
                          shouldAnimate={
                            !suppressPartMotion &&
                            (platform !== previousValues.platform ||
                              variant !== previousValues.variant)
                          }
                          isComplete={complete && Boolean(queryParams)}
                          isPlaceholder={!queryParams}
                        />
                      )}
                    </UrlSegment>
                  ) : null}
            </div>
          </div>

        </div>

        {isTunerMode && (
          <div className="url-tuner-load">
            <CopyButton isComplete={complete} onClick={onCopy} />
            <LoadButton isComplete={complete} onClick={onOpen} />
          </div>
        )}
      </motion.div>
    );
  }
);

UrlDisplay.displayName = 'UrlDisplay';
