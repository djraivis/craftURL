import { memo, useEffect, useRef, useState } from 'react';
import { Check, Copy, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const INCOMPLETE_HINT = 'Choose a site and environment to enable this action';
const COPIED_RESET_MS = 1800;

export const CopyButton = memo<{
  isComplete: boolean;
  onClick?: () => void | boolean | Promise<void | boolean>;
}>(({ isComplete, onClick }) => {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const handleClick = async () => {
    if (!isComplete || !onClick) return;

    const result = await onClick();
    if (result === false) return;

    setCopied(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      setCopied(false);
      resetTimer.current = null;
    }, COPIED_RESET_MS);
  };

  return (
    <motion.button
      whileTap={isComplete ? { scale: 0.95 } : undefined}
      type="button"
      onClick={() => {
        void handleClick();
      }}
      disabled={!isComplete}
      className={`url-hero-action-wide ${isComplete ? '' : 'is-disabled'} ${
        copied ? 'is-copied' : ''
      }`}
      title={
        !isComplete ? INCOMPLETE_HINT : copied ? 'Copied to clipboard' : 'Copy URL to clipboard'
      }
      aria-label={
        !isComplete
          ? `Copy URL unavailable. ${INCOMPLETE_HINT}`
          : copied
            ? 'URL copied to clipboard'
            : 'Copy URL to clipboard'
      }
    >
      {copied ? <Check size={17} aria-hidden /> : <Copy size={17} aria-hidden />}
      <span className="text-xs font-medium">{copied ? 'Copied' : 'Copy'}</span>
      <span className="sr-only" aria-live="polite">
        {copied ? 'URL copied to clipboard' : ''}
      </span>
    </motion.button>
  );
});

CopyButton.displayName = 'CopyButton';

export const LoadButton = memo<{
  isComplete: boolean;
  onClick?: () => void;
}>(({ isComplete, onClick }) => (
  <motion.button
    whileTap={isComplete ? { scale: 0.95 } : undefined}
    type="button"
    onClick={onClick}
    disabled={!isComplete}
    className={`url-hero-action-wide url-hero-load ${isComplete ? '' : 'is-disabled'}`}
    title={isComplete ? 'Open URL in a new tab' : INCOMPLETE_HINT}
    aria-label={isComplete ? 'Open URL in a new tab' : `Load URL unavailable. ${INCOMPLETE_HINT}`}
  >
    <Play size={17} className={isComplete ? 'fill-current' : ''} aria-hidden />
    <span className="text-xs font-semibold">Load</span>
  </motion.button>
));

LoadButton.displayName = 'LoadButton';
