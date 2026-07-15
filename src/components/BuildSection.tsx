import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface BuildSectionProps {
  step: number;
  title: string;
  icon: React.ReactNode;
  tone?: 'a' | 'b';
  meta?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  /** When set, header toggles expand/collapse */
  expanded?: boolean;
  onToggle?: () => void;
  summary?: React.ReactNode;
  compact?: boolean;
}

export const BuildSection: React.FC<BuildSectionProps> = ({
  step,
  title,
  icon,
  tone = 'a',
  meta,
  children,
  className = '',
  expanded = true,
  onToggle,
  summary,
  compact = false
}) => {
  const reduceMotion = useReducedMotion();
  const collapsible = Boolean(onToggle);
  const showBody = !collapsible || expanded;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.3,
        delay: reduceMotion ? 0 : step * 0.04
      }}
      className={`terminal-section section-tone-${tone} ${className}`}
    >
      <div
        className={`terminal-section-header ${
          collapsible
            ? 'cursor-pointer select-none hover:brightness-[0.98] transition-[filter]'
            : ''
        }`}
        onClick={collapsible ? onToggle : undefined}
        onKeyDown={
          collapsible
            ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onToggle?.();
                }
              }
            : undefined
        }
        role={collapsible ? 'button' : undefined}
        tabIndex={collapsible ? 0 : undefined}
        aria-expanded={collapsible ? expanded : undefined}
      >
        <div className="terminal-section-title min-w-0">
          {step > 0 && (
            <span className="section-step-index">
              {step}
            </span>
          )}
          {icon}
          <span>{title}</span>
          {!expanded && summary ? (
            <span className="text-[length:var(--font-size-meta)] font-normal text-[var(--text-muted)] font-mono truncate ml-1">
              · {summary}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2 min-w-0 shrink-0">
          {expanded && meta ? (
            <div className="text-[length:var(--font-size-meta)] text-[var(--text-muted)] font-mono truncate max-w-[14rem] sm:max-w-[20rem]">
              {meta}
            </div>
          ) : null}
          {collapsible && (
            <ChevronDown
              size={16}
              className={`text-[var(--text-muted)] transition-transform duration-200 ${
                expanded ? 'rotate-180' : ''
              }`}
            />
          )}
        </div>
      </div>
      {showBody && children != null ? (
        <div
          className={`terminal-section-content ${
            compact ? '!py-2.5 !px-3' : ''
          }`}
        >
          {children}
        </div>
      ) : null}
    </motion.div>
  );
};
