import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { UrlPartProps } from '../../types';
import { URL_EASE, URL_PART_DURATION } from './urlMotion';

export const UrlPart = memo<UrlPartProps>(
  ({
    text,
    partKey,
    isActive,
    isPrimary,
    shouldAnimate,
    isRolling,
    isComplete,
    isPlaceholder
  }) => {
    const reduceMotion = useReducedMotion();
    const animateIn = Boolean(shouldAnimate && !reduceMotion);
    const rolling = Boolean(isRolling && animateIn);

    return (
      <motion.span
        key={partKey ?? text}
        initial={
          rolling
            ? { opacity: 0.25, y: -26 }
            : animateIn
              ? { opacity: 0, y: -12 }
              : false
        }
        animate={{ opacity: 1, y: 0 }}
        transition={
          rolling
            ? { duration: 0.11, ease: 'linear' }
            : {
                duration: reduceMotion ? 0 : URL_PART_DURATION,
                ease: URL_EASE
              }
        }
        className={[
          'url-text',
          isComplete ? 'url-part-complete' : '',
          isPlaceholder ? 'url-part-placeholder' : '',
          !isPlaceholder && (isPrimary || isActive) ? 'url-part-accent' : '',
          !isPlaceholder && !isPrimary && !isActive && !isComplete ? 'url-part-muted' : ''
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {text}
      </motion.span>
    );
  }
);

UrlPart.displayName = 'UrlPart';
