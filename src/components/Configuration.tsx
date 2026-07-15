import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid as Layout, Clapperboard, Lock, Tag } from 'lucide-react';
import {
  CTV_ENVIRONMENTS,
  CTV_PPDEV_DEVELOPMENT_ENVIRONMENTS,
  CTV_PPDEV_TESTING_ENVIRONMENTS,
  CTV_PREPROD_ENVIRONMENTS,
  siteAllowsDeeplinks,
  siteAllowsPlatformQuery
} from '../constants/environments';
import { ctvProdLinks } from '../constants/prodLinks';
import {
  getAllowedPlatforms,
  isPlatformSelectionLocked
} from '../utils/builderSync';
import { filterVariantsForContext } from '../utils/prodVariants';
import { getContentSearchMeta } from '../config/schedule';
import { ContentSearchPanel } from './ContentSearchPanel';
import { DeeplinkPanel } from './DeeplinkPanel';
import { BuildSection } from './BuildSection';
import { StatusMessage } from './StatusMessage';
import type { DeeplinkOption, Name, ProdLink } from '../types';
import type { ScheduleBrand, ScheduleEpisode } from '../types/schedule';

interface ConfigurationProps {
  environmentType: string;
  name: string;
  platform: string;
  variant: string;
  selectedDeeplink: string;
  isVersionMode: boolean;
  onEnvironmentTypeSelect: (env: { id: string; domain: string }) => void;
  onNameSelect: (name: { url?: string; domain?: string }) => void;
  onPlatformSelect: (platform: string) => void;
  onVariantSelect: (variant: string) => void;
  onVersionCheck: () => void;
  onContentChange: (
    brand: ScheduleBrand | null,
    episode: ScheduleEpisode | null
  ) => void;
  onDeeplinkSelect: (deeplink: DeeplinkOption) => void;
}

const FilterRow: React.FC<{
  label: string;
  muted?: boolean;
  reserveHeight?: boolean;
  children: React.ReactNode;
}> = ({ label, muted, reserveHeight, children }) => (
  <div
    className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 py-2 border-b border-[var(--border-subtle)] last:border-0 last:pb-0 first:pt-0 ${
      muted ? 'opacity-50 pointer-events-none' : ''
    } ${reserveHeight ? 'filter-row-variants' : ''}`}
  >
    <span className="filter-row-label">{label}</span>
    <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0 w-full sm:w-auto">
      {children}
    </div>
  </div>
);

const Chip: React.FC<{
  active: boolean;
  disabled?: boolean;
  title?: string;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, disabled, title, onClick, children }) => (
  <motion.button
    type="button"
    whileTap={disabled ? undefined : { scale: 0.97 }}
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-pressed={active}
    className={`terminal-button !min-h-0 !h-7 px-2 text-[11px] inline-flex items-center gap-1 ${
      active ? 'active' : ''
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </motion.button>
);

export const Configuration: React.FC<ConfigurationProps> = ({
  environmentType,
  name,
  platform,
  variant,
  selectedDeeplink,
  isVersionMode,
  onEnvironmentTypeSelect,
  onNameSelect,
  onPlatformSelect,
  onVariantSelect,
  onVersionCheck,
  onContentChange,
  onDeeplinkSelect
}) => {
  const isProd = isPlatformSelectionLocked(environmentType);
  const allowPlatformQuery = siteAllowsPlatformQuery(name);
  const allowDeeplinks = siteAllowsDeeplinks(name);
  const platformControlsPaused = !allowPlatformQuery;

  const platforms = useMemo(
    () => getAllowedPlatforms(environmentType, name),
    [environmentType, name]
  );

  const variants = useMemo(
    () => filterVariantsForContext(platform, environmentType, name),
    [platform, environmentType, name]
  );

  const selectSite = (site: Name | ProdLink) => {
    onNameSelect(site);
  };

  return (
    <div className="space-y-[var(--space-stack)]">
      <BuildSection
        step={1}
        title="Host"
        icon={<Layout size={16} />}
        tone="a"
        meta="Environment → Site → Platform"
        compact
      >
        <div className="-my-0.5">
          <FilterRow label="Env">
            {CTV_ENVIRONMENTS.map((env) => (
              <Chip
                key={env.id}
                active={environmentType === env.id}
                onClick={() => onEnvironmentTypeSelect(env)}
              >
                {env.name}
              </Chip>
            ))}
          </FilterRow>

          <FilterRow label="Site">
            {environmentType === 'production' ? (
              ctvProdLinks.map((link) => (
                <Chip
                  key={link.id}
                  active={name === link.url}
                  title={`ctv-${link.url}.uktv.co.uk`}
                  onClick={() => selectSite(link)}
                >
                  {link.name}
                </Chip>
              ))
            ) : environmentType === 'ppdev' ? (
              [
                ...CTV_PPDEV_TESTING_ENVIRONMENTS,
                ...CTV_PPDEV_DEVELOPMENT_ENVIRONMENTS
              ].map((env) => (
                <Chip
                  key={env.id}
                  active={name === env.domain}
                  title={env.description}
                  onClick={() => selectSite(env)}
                >
                  {env.name}
                </Chip>
              ))
            ) : (
              CTV_PREPROD_ENVIRONMENTS.map((env) => (
                <Chip
                  key={env.id}
                  active={name === env.domain}
                  title={env.description}
                  onClick={() => selectSite(env)}
                >
                  {env.name}
                </Chip>
              ))
            )}
          </FilterRow>

          <FilterRow label="Platform">
            <div
              className={`flex flex-wrap items-center gap-1.5 min-w-0 ${
                platformControlsPaused ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {isProd && (
                <span
                  className="inline-flex items-center gap-1 text-[10px] text-[var(--warning)] mr-1"
                  title="Production hosts lock the platform to the site allow-list"
                >
                  <Lock size={10} aria-hidden />
                  locked
                </span>
              )}
              {platforms.map((plt) => (
                <Chip
                  key={plt.id}
                  active={platform === plt.id}
                  disabled={isProd || platformControlsPaused}
                  title={
                    isProd
                      ? `Production lock — ${plt.name} is fixed for this site`
                      : plt.queryParamsUse
                  }
                  onClick={() => onPlatformSelect(plt.id)}
                >
                  {plt.name}
                  {isProd && platform === plt.id ? (
                    <Lock size={10} className="opacity-60" aria-hidden />
                  ) : null}
                </Chip>
              ))}
            </div>
            <div className="platform-tools">
              <Chip
                active={isVersionMode}
                disabled={!name}
                title="Fetch /version.txt from the domain root (no platform query)"
                onClick={onVersionCheck}
              >
                <Tag size={11} />
                Version
              </Chip>
            </div>
          </FilterRow>

          <FilterRow
            label="Variant"
            reserveHeight
            muted={platformControlsPaused || variants.length === 0}
          >
            {variants.length > 0 ? (
              variants.map((item) => (
                <Chip
                  key={item.id}
                  active={variant === item.value}
                  disabled={platformControlsPaused}
                  title={item.description || item.name}
                  onClick={() => onVariantSelect(item.value)}
                >
                  {item.name}
                </Chip>
              ))
            ) : (
              <StatusMessage className="italic">None for this platform</StatusMessage>
            )}
          </FilterRow>

          {isProd && !platformControlsPaused && (
            <StatusMessage tone="warning" className="pt-1.5">
              Production platform is locked to this site. Change Site to switch platforms.
            </StatusMessage>
          )}

          {!allowPlatformQuery && (
            <StatusMessage className="pt-1.5">
              DevTools host — no platform query params or deeplink paths.
            </StatusMessage>
          )}
        </div>
      </BuildSection>

      <BuildSection
        step={2}
        title="Content & Deeplinks"
        icon={<Clapperboard size={16} />}
        tone="b"
        compact
        meta={
          selectedDeeplink
            ? `${getContentSearchMeta(environmentType)} · path ready`
            : getContentSearchMeta(environmentType)
        }
      >
        <div className="content-deeplink-split">
          <div className="content-deeplink-pane content-deeplink-pane-content">
            <div className="terminal-group-label mb-1.5">Content</div>
            <ContentSearchPanel
              environmentType={environmentType}
              onContentChange={onContentChange}
            />
          </div>
          <div className="content-deeplink-pane content-deeplink-pane-deeplink">
            <div className="terminal-group-label mb-1.5">Deeplink</div>
            <p className="text-[length:var(--font-size-meta)] text-[var(--text-muted)] mb-2 leading-snug">
              {allowDeeplinks
                ? 'Optional · tap again to clear'
                : 'Not available on the DevTools host'}
            </p>
            <DeeplinkPanel
              selectedDeeplink={selectedDeeplink}
              disabled={!allowDeeplinks}
              onDeeplinkSelect={onDeeplinkSelect}
            />
          </div>
        </div>
      </BuildSection>
    </div>
  );
};
