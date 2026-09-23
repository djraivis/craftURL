import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid as Layout, Clapperboard } from 'lucide-react';
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
  onEnvironmentTypeSelect: (env: { id: string; domain: string }) => void;
  onNameSelect: (name: { url?: string; domain?: string }) => void;
  onPlatformSelect: (platform: string) => void;
  onVariantSelect: (variant: string) => void;
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
    className={`terminal-button inline-flex items-center gap-1 ${
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
  onEnvironmentTypeSelect,
  onNameSelect,
  onPlatformSelect,
  onVariantSelect,
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
              {isProd
                ? platforms.map((plt) => (
                    <span
                      key={plt.id}
                      className="terminal-button is-fixed active"
                      title={plt.queryParamsUse}
                    >
                      {plt.name}
                    </span>
                  ))
                : platforms.map((plt) => (
                    <Chip
                      key={plt.id}
                      active={platform === plt.id}
                      disabled={platformControlsPaused}
                      title={plt.queryParamsUse}
                      onClick={() => onPlatformSelect(plt.id)}
                    >
                      {plt.name}
                    </Chip>
                  ))}
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
            <ContentSearchPanel
              environmentType={environmentType}
              onContentChange={onContentChange}
            />
          </div>
          <div className="content-deeplink-pane content-deeplink-pane-deeplink">
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
