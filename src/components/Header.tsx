import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BookMarked, Radio } from 'lucide-react';
import { APP_VERSION } from '../constants/version';
import { CopyButton, LoadButton } from './url/UrlActionButtons';

interface HeaderProps {
  urlReady: boolean;
  onCopy: () => void | boolean | Promise<void | boolean>;
  onOpen: () => void;
  showUrlLegend: boolean;
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
  urlReady,
  onCopy,
  onOpen,
  showUrlLegend,
  onToggleUrlLegend,
  onEnterTunerMode
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="space-y-[var(--space-stack)]">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.55,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="header-toolbar"
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

        <div className="header-url-actions">
          <CopyButton placement="header" isComplete={urlReady} onClick={onCopy} />
          <LoadButton placement="header" isComplete={urlReady} onClick={onOpen} />
        </div>

        <div className="header-mode-actions">
          <ModeChip
            active={showUrlLegend}
            onClick={onToggleUrlLegend}
            icon={<BookMarked size={16} />}
            label="Legend"
            title="Label each part of the URL (protocol, site, environment, platform, …)"
          />
          <ModeChip
            active={false}
            onClick={onEnterTunerMode}
            icon={<Radio size={16} />}
            label="Tuner"
            title="Tuner — URL only, scroll Site / Environment / Platform"
            emphasis
          />
        </div>
      </motion.div>
    </div>
  );
};
