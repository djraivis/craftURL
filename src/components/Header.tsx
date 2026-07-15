import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BookMarked, Radio } from 'lucide-react';
import { siteAllowsPlatformQuery } from '../constants/environments';
import { APP_VERSION } from '../constants/version';
import type { VersionInfo } from '../types';
import { getDeeplinkContextFacts, getSiteContextFacts } from '../utils/siteContext';
import { InfoPanel } from './InfoPanel';

interface HeaderProps {
  app: string;
  name: string;
  environmentType: string;
  platform: string;
  variant: string;
  path: string;
  isDeeplinksEnabled: boolean;
  selectedDeeplink: string;
  versionInfo: VersionInfo | null;
  versionError: string | null;
  showUrlLegend: boolean;
  isTunerMode: boolean;
  onToggleUrlLegend: () => void;
  onEnterTunerMode: () => void;
}

interface ModeChipProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  title: string;
  emphasis?: boolean;
}

const ModeChip: React.FC<ModeChipProps> = ({
  active,
  onClick,
  icon,
  label,
  title,
  emphasis
}) => (
  <motion.button
    whileTap={{ scale: 0.97 }}
    type="button"
    onClick={onClick}
    title={title}
    aria-pressed={active}
    aria-label={title}
    className={`mode-chip ${active ? 'active' : ''} ${emphasis ? 'mode-chip-emphasis' : ''}`}
  >
    {icon}
    <span>{label}</span>
  </motion.button>
);

export const Header: React.FC<HeaderProps> = ({
  app,
  name,
  environmentType,
  platform,
  variant,
  path,
  isDeeplinksEnabled,
  selectedDeeplink,
  versionInfo,
  versionError,
  showUrlLegend,
  isTunerMode,
  onToggleUrlLegend,
  onEnterTunerMode
}) => {
  const reduceMotion = useReducedMotion();
  const envInfo = app ? getSiteContextFacts(environmentType, name) : null;
  const deeplinkInfo =
    isDeeplinksEnabled && selectedDeeplink
      ? getDeeplinkContextFacts(selectedDeeplink)
      : null;

  return (
    <div className="space-y-[var(--space-stack)]">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.55,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="brand-lockup shrink-0">
          <span className="brand-cue" aria-hidden />
          <h1 className="brand-mark" aria-label="CTV CraftURL">
            <span className="brand-mark-ctv">CTV</span>
            <span className="brand-mark-craft">Craft</span>
            <span className="brand-mark-url">URL</span>
            <span className="brand-mark-version">v{APP_VERSION}</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-[var(--space-group)] shrink-0">
          <ModeChip
            active={showUrlLegend}
            onClick={onToggleUrlLegend}
            icon={<BookMarked size={16} />}
            label="Legend"
            title="Label each part of the URL (protocol, site, environment, platform, …)"
          />
          <ModeChip
            active={isTunerMode}
            onClick={onEnterTunerMode}
            icon={<Radio size={16} />}
            label="Tuner"
            title="Tuner — URL only, scroll Site / Environment / Platform"
            emphasis
          />
        </div>
      </motion.div>

      <InfoPanel
        version={versionInfo ?? undefined}
        versionError={versionError}
        app={app}
        platform={siteAllowsPlatformQuery(name) ? platform : undefined}
        variant={variant}
        use={envInfo?.use}
        purpose={envInfo?.purpose}
        destination={deeplinkInfo?.destination}
        format={deeplinkInfo?.format}
        isDeeplinksEnabled={isDeeplinksEnabled}
        deeplinkPath={path}
      />
    </div>
  );
};
