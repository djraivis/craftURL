import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { TunerOption } from '../../types';

function cycleOptionId(
  options: TunerOption[],
  selectedId: string | undefined,
  direction: 1 | -1
): string | null {
  if (!options.length) return null;
  const index = Math.max(0, options.findIndex((option) => option.id === selectedId));
  const next = Math.min(options.length - 1, Math.max(0, index + direction));
  return options[next]?.id ?? null;
}

function optionDomId(listboxId: string, optionId: string): string {
  return `${listboxId}-option-${optionId.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

export const UrlSegment: React.FC<{
  legend: boolean;
  /** When false, no Protocol/Site/… label (Tuner uses plain URL text only) */
  showLabel?: boolean;
  label?: string;
  inactive?: boolean;
  interactive?: boolean;
  focused?: boolean;
  open?: boolean;
  options?: TunerOption[];
  selectedId?: string;
  onToggle?: () => void;
  onSelect?: (value: string) => void;
  onFocusSegment?: () => void;
  className?: string;
  children: React.ReactNode;
}> = ({
  legend,
  showLabel = true,
  label,
  inactive,
  interactive,
  focused,
  open,
  options = [],
  selectedId,
  onToggle,
  onSelect,
  onFocusSegment,
  className,
  children
}) => {
  const listboxId = useId();
  const wheelAcc = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const hitRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const [padPx, setPadPx] = useState(0);
  const [listWidthPx, setListWidthPx] = useState(0);
  const [pendingId, setPendingId] = useState<string | undefined>(undefined);
  const isListOpen = Boolean(interactive && open && options.length > 0);

  useEffect(() => {
    if (!isListOpen) {
      setPendingId(undefined);
      return;
    }
    setPendingId(selectedId);
  }, [isListOpen, selectedId]);

  useLayoutEffect(() => {
    if (!isListOpen || !measureRef.current) {
      setListWidthPx(0);
      return;
    }

    const widths = Array.from(
      measureRef.current.querySelectorAll<HTMLElement>('[data-measure]')
    ).map((node) => node.offsetWidth);

    const widest = widths.length ? Math.max(...widths) : 0;
    setListWidthPx(Math.round(widest + 28));
  }, [isListOpen, options]);

  useEffect(() => {
    if (!isListOpen || !listRef.current) {
      setPadPx(0);
      return;
    }

    const menu = listRef.current;
    const syncPad = () => {
      setPadPx(Math.max(0, Math.round(menu.clientHeight / 2)));
    };

    syncPad();
    const observer = new ResizeObserver(syncPad);
    observer.observe(menu);
    return () => observer.disconnect();
  }, [isListOpen]);

  useEffect(() => {
    if (!isListOpen || !listRef.current || !pendingId || !padPx) return;

    const frame = requestAnimationFrame(() => {
      const menu = listRef.current;
      if (!menu) return;
      const active = Array.from(
        menu.querySelectorAll<HTMLElement>('[data-option-id]')
      ).find((el) => el.getAttribute('data-option-id') === pendingId);
      if (!active) return;

      const offset =
        active.offsetTop - menu.clientHeight / 2 + active.offsetHeight / 2;
      menu.scrollTop = Math.max(0, offset);
      if (document.activeElement?.closest('.url-segment-menu') === menu) {
        active.focus({ preventScroll: true });
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [isListOpen, pendingId, padPx, options.length]);

  // Move focus into the open list, then restore to the segment hit on close
  useEffect(() => {
    if (isListOpen) {
      wasOpenRef.current = true;
      const frame = requestAnimationFrame(() => {
        const active = listRef.current?.querySelector<HTMLElement>(
          '[aria-selected="true"]'
        );
        active?.focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(frame);
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      hitRef.current?.focus({ preventScroll: true });
    }
  }, [isListOpen]);

  useEffect(() => {
    if (!isListOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        event.stopImmediatePropagation();
        setPendingId(
          (current) =>
            cycleOptionId(options, current, event.key === 'ArrowDown' ? 1 : -1) ?? current
        );
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopImmediatePropagation();
        const option = options.find((entry) => entry.id === pendingId);
        if (option) onSelect?.(option.value);
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [isListOpen, options, pendingId, onSelect]);

  if (!legend || !label) {
    return <>{children}</>;
  }

  const handleWheel = (event: React.WheelEvent) => {
    if (!interactive || !isListOpen) return;
    event.preventDefault();
    event.stopPropagation();
    wheelAcc.current += event.deltaY;
    if (Math.abs(wheelAcc.current) < 36) return;
    const direction: 1 | -1 = wheelAcc.current > 0 ? 1 : -1;
    wheelAcc.current = 0;
    setPendingId((current) => cycleOptionId(options, current, direction) ?? current);
  };

  const slotStyle =
    isListOpen && listWidthPx > 0
      ? ({
          width: listWidthPx,
          minWidth: listWidthPx,
          maxWidth: listWidthPx
        } as const)
      : undefined;

  const activeOptionDomId = pendingId ? optionDomId(listboxId, pendingId) : undefined;

  return (
    <span
      className={[
        'url-segment',
        !showLabel ? 'url-segment-bare' : '',
        inactive ? 'url-segment-inactive' : '',
        interactive ? 'url-segment-interactive' : '',
        focused ? 'url-segment-focused' : '',
        open ? 'url-segment-open' : '',
        isListOpen ? 'url-segment-expanded' : '',
        className ?? ''
      ]
        .filter(Boolean)
        .join(' ')}
      style={slotStyle}
      onWheel={interactive && isListOpen ? handleWheel : undefined}
      onMouseEnter={interactive ? onFocusSegment : undefined}
    >
      {interactive && options.length > 0 && (
        <span className="url-segment-measure" ref={measureRef} aria-hidden>
          {options.map((option) => (
            <span key={option.id} data-measure>
              {option.label}
            </span>
          ))}
        </span>
      )}

      {showLabel &&
        (interactive ? (
          <button
            type="button"
            className="url-segment-label"
            onClick={onToggle}
            title={isListOpen ? `Close ${label}` : `Open ${label}`}
            style={isListOpen ? { visibility: 'hidden' } : undefined}
            tabIndex={isListOpen ? -1 : 0}
            aria-expanded={isListOpen}
            aria-controls={listboxId}
          >
            {label}
          </button>
        ) : (
          <span className="url-segment-label">{label}</span>
        ))}

      <button
        ref={hitRef}
        type="button"
        className="url-segment-hit"
        onClick={interactive ? onToggle : undefined}
        disabled={!interactive}
        title={interactive ? `Choose ${label.toLowerCase()}` : undefined}
        aria-label={interactive ? `Choose ${label.toLowerCase()}` : undefined}
        aria-expanded={interactive ? isListOpen : undefined}
        aria-controls={interactive ? listboxId : undefined}
        aria-haspopup={interactive ? 'listbox' : undefined}
        style={isListOpen ? { visibility: 'hidden' } : undefined}
        tabIndex={isListOpen ? -1 : 0}
      >
        <span className="url-segment-value">{children}</span>
      </button>

      {isListOpen && (
        <div
          id={listboxId}
          className="url-segment-menu"
          ref={listRef}
          role="listbox"
          aria-label={label}
          aria-activedescendant={activeOptionDomId}
        >
          <div className="url-segment-menu-spacer" style={{ height: padPx }} aria-hidden />
          {options.map((option) => (
            <button
              key={option.id}
              id={optionDomId(listboxId, option.id)}
              type="button"
              data-option-id={option.id}
              role="option"
              aria-selected={option.id === pendingId}
              title={option.label}
              tabIndex={option.id === pendingId ? 0 : -1}
              className={`url-segment-menu-option url-text ${
                option.id === pendingId ? 'active url-part-accent' : 'url-part-muted'
              }`}
              onClick={(event) => {
                event.stopPropagation();
                onSelect?.(option.value);
              }}
            >
              {option.label}
            </button>
          ))}
          <div className="url-segment-menu-spacer" style={{ height: padPx }} aria-hidden />
        </div>
      )}
    </span>
  );
};

UrlSegment.displayName = 'UrlSegment';
