import React, { useId } from 'react';
import { Loader2, Search } from 'lucide-react';
import type { BrandSuggestion } from '../../utils/brandSuggestions';

interface BrandSearchInputProps {
  query: string;
  loading: boolean;
  invalid?: boolean;
  describedBy?: string;
  suggestions: BrandSuggestion[];
  showSuggestions: boolean;
  activeIndex: number;
  onQueryChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onActiveIndexChange: (index: number) => void;
  onSelect: (suggestion: BrandSuggestion) => void;
}

export const BrandSearchInput: React.FC<BrandSearchInputProps> = ({
  query,
  loading,
  invalid = false,
  describedBy,
  suggestions,
  showSuggestions,
  activeIndex,
  onQueryChange,
  onFocus,
  onBlur,
  onKeyDown,
  onActiveIndexChange,
  onSelect
}) => {
  const listboxId = useId();

  return (
    <div className="terminal-field terminal-field-search">
      <label className="terminal-group-label" htmlFor="content-search-input">
        Search
      </label>
      <div className="content-search-suggest">
        <div className="relative">
          {loading ? (
            <Loader2
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none animate-spin"
            />
          ) : (
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
            />
          )}
          <input
            id="content-search-input"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            placeholder="Brand name, ID, or house number… (Enter)"
            className="terminal-input has-icon"
            disabled={loading}
            autoComplete="off"
            role="combobox"
            aria-expanded={showSuggestions}
            aria-controls={listboxId}
            aria-activedescendant={
              showSuggestions && activeIndex >= 0
                ? `${listboxId}-option-${activeIndex}`
                : undefined
            }
            aria-autocomplete="list"
            aria-busy={loading}
            aria-invalid={invalid}
            aria-describedby={describedBy}
          />
        </div>

        {showSuggestions && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label={query.trim() ? 'Matching brands' : 'Suggested brands'}
            className="content-search-suggest-list"
          >
            {suggestions.map((suggestion, index) => (
              <li key={suggestion.id} role="presentation">
                <button
                  type="button"
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  className={`content-search-suggest-option${
                    index === activeIndex ? ' is-active' : ''
                  }`}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => onActiveIndexChange(index)}
                  onClick={() => onSelect(suggestion)}
                >
                  {suggestion.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
