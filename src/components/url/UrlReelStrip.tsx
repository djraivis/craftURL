import { memo, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Trail = [string, string, string];

/**
 * Soft slot-reel window: ~2.5 overlapping rows with fade at the edges.
 * Newest value enters from the top; older values drift down and fade out.
 */
export const UrlReelStrip = memo<{ value: string; active: boolean }>(
  ({ value, active }) => {
    const reduceMotion = useReducedMotion();
    const [trail, setTrail] = useState<Trail>([value, value, value]);
    const [tick, setTick] = useState(0);
    const prevActive = useRef(active);

    useEffect(() => {
      if (!active) {
        setTrail([value, value, value]);
        prevActive.current = false;
        return;
      }

      if (!prevActive.current) {
        setTrail([value, value, value]);
        prevActive.current = true;
        return;
      }

      setTrail((prev) => [value, prev[0], prev[1]]);
      setTick((n) => n + 1);
    }, [value, active]);

    if (!active || reduceMotion) {
      return <span className="url-text url-part-accent url-part-complete">{value}</span>;
    }

    // top → bottom: newest, previous, older
    const rows = trail;

    return (
      <span className="url-reel" aria-hidden>
        <motion.span
          key={tick}
          className="url-reel-strip"
          initial={{ y: '-38%' }}
          animate={{ y: '0%' }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {rows.map((label, index) => (
            <span
              key={`${tick}-${index}-${label}`}
              className={`url-reel-row url-text ${
                index === 0 ? 'url-reel-row-center url-part-accent' : 'url-reel-row-ghost'
              }`}
            >
              {label}
            </span>
          ))}
        </motion.span>
      </span>
    );
  }
);

UrlReelStrip.displayName = 'UrlReelStrip';
