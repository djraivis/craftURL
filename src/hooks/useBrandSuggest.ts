import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  type BrandSuggestion,
  filterBrandSuggestions,
  pickSpotlightSuggestions
} from '../utils/brandSuggestions';

interface UseBrandSuggestArgs {
  query: string;
  disabled?: boolean;
  /** When this changes (e.g. schedule tier), close the list. */
  resetKey?: string;
}

export function useBrandSuggest({
  query,
  disabled = false,
  resetKey
}: UseBrandSuggestArgs) {
  const blurTimer = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [spotlight, setSpotlight] = useState<BrandSuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const suggestions = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return spotlight;
    return filterBrandSuggestions(trimmed);
  }, [query, spotlight]);

  const showSuggestions = open && suggestions.length > 0 && !disabled;

  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  useEffect(() => {
    setOpen(false);
    setActiveIndex(-1);
    setSpotlight([]);
  }, [resetKey]);

  useEffect(() => {
    return () => {
      if (blurTimer.current != null) window.clearTimeout(blurTimer.current);
    };
  }, []);

  const close = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleFocus = () => {
    if (blurTimer.current != null) {
      window.clearTimeout(blurTimer.current);
      blurTimer.current = null;
    }
    if (!query.trim()) {
      setSpotlight(pickSpotlightSuggestions());
    }
    setOpen(true);
  };

  const handleBlur = () => {
    blurTimer.current = window.setTimeout(() => {
      close();
    }, 120);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) =>
        index < suggestions.length - 1 ? index + 1 : 0
      );
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) =>
        index <= 0 ? suggestions.length - 1 : index - 1
      );
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  };

  const clearBlurTimer = () => {
    if (blurTimer.current != null) {
      window.clearTimeout(blurTimer.current);
      blurTimer.current = null;
    }
  };

  const activeSuggestion =
    activeIndex >= 0 && showSuggestions ? suggestions[activeIndex] ?? null : null;

  return {
    suggestions,
    showSuggestions,
    activeIndex,
    activeSuggestion,
    setActiveIndex,
    setOpen,
    close,
    clearBlurTimer,
    handleFocus,
    handleBlur,
    handleKeyDown
  };
}
