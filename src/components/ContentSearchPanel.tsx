import React, { useMemo } from 'react';
import type { ScheduleBrand, ScheduleEpisode } from '../types/schedule';
import type { BrandSuggestion } from '../utils/brandSuggestions';
import { toCloudinaryThumbUrl } from '../utils/cloudinary';
import { detectSearchMode, searchModeLabel } from '../utils/scheduleSearch';
import { useBrandSuggest } from '../hooks/useBrandSuggest';
import { useContentBrowse } from '../hooks/useContentBrowse';
import { BrandSearchInput } from './content/BrandSearchInput';
import { ContentBrowseSelects } from './content/ContentBrowseSelects';
import { StatusMessage } from './StatusMessage';

interface ContentSearchPanelProps {
  environmentType: string;
  onContentChange: (
    brand: ScheduleBrand | null,
    episode: ScheduleEpisode | null
  ) => void;
}

export const ContentSearchPanel: React.FC<ContentSearchPanelProps> = ({
  environmentType,
  onContentChange
}) => {
  const browse = useContentBrowse({ environmentType, onContentChange });
  const suggest = useBrandSuggest({
    query: browse.query,
    disabled: browse.loading,
    resetKey: environmentType
  });

  const previewMode = useMemo(
    () => detectSearchMode(browse.query),
    [browse.query]
  );

  const resultThumb = toCloudinaryThumbUrl(
    browse.selectedEpisode?.image || browse.brand?.image || null
  );

  const selectSuggestion = (suggestion: BrandSuggestion) => {
    suggest.clearBlurTimer();
    browse.setQuery(suggestion.name);
    suggest.close();
    void browse.runSearch(String(suggestion.id));
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();
    if (suggest.activeSuggestion) {
      selectSuggestion(suggest.activeSuggestion);
      return;
    }
    suggest.close();
    await browse.runSearch(browse.query);
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="content-search-form">
        <BrandSearchInput
          query={browse.query}
          loading={browse.loading}
          invalid={Boolean(browse.error)}
          describedBy="content-search-status"
          suggestions={suggest.suggestions}
          showSuggestions={suggest.showSuggestions}
          activeIndex={suggest.activeIndex}
          onQueryChange={(value) => {
            browse.setQuery(value);
            suggest.setOpen(true);
          }}
          onFocus={suggest.handleFocus}
          onBlur={suggest.handleBlur}
          onKeyDown={suggest.handleKeyDown}
          onActiveIndexChange={suggest.setActiveIndex}
          onSelect={selectSuggestion}
        />

        <ContentBrowseSelects
          seriesOptions={browse.seriesOptions}
          episodes={browse.episodes}
          selectedSeriesId={browse.selectedSeriesId}
          selectedEpisodeId={browse.selectedEpisodeId}
          seriesLoading={browse.seriesLoading}
          hasBrand={Boolean(browse.brand)}
          onSeriesChange={browse.handleSeriesChange}
          onEpisodeChange={browse.handleEpisodeChange}
        />
      </form>

      <div id="content-search-status" className="space-y-1.5 pt-0.5">
        {!browse.query.trim() && !browse.brand && !browse.error && (
          <StatusMessage>
            Focus search for local title ideas, then Enter looks up the live
            schedule for series and episodes.
          </StatusMessage>
        )}

        {browse.error && (
          <StatusMessage tone="error">{browse.error}</StatusMessage>
        )}

        {browse.query.trim() && !browse.brand && !browse.error && (
          <StatusMessage>
            Lookup as{' '}
            <span className="text-[var(--text-secondary)]">
              {searchModeLabel(previewMode.mode)}
            </span>
            {previewMode.value ? (
              <>
                {' '}
                ·{' '}
                <span className="font-mono text-[var(--accent)]">
                  {previewMode.value}
                </span>
              </>
            ) : null}
            . Press Enter to search the schedule.
          </StatusMessage>
        )}

        {browse.brand && (
          <div className="content-search-result">
            {resultThumb ? (
              <img
                className="content-search-thumb"
                src={resultThumb}
                alt=""
                width={104}
                height={104}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="content-search-thumb is-empty" aria-hidden />
            )}
            <div className="content-search-meta">
              <div className="content-search-meta-row">
                <span className="content-search-meta-label">Slug</span>
                <span className="content-search-meta-value is-slug">
                  {browse.brand.slug}
                </span>
              </div>
              <div className="content-search-meta-row">
                <span className="content-search-meta-label">ID</span>
                <span className="content-search-meta-value is-id">
                  {browse.brand.id}
                </span>
              </div>
              {browse.selectedEpisode?.house_number ? (
                <div className="content-search-meta-row">
                  <span className="content-search-meta-label">House</span>
                  <span className="content-search-meta-value is-house">
                    {browse.selectedEpisode.house_number}
                  </span>
                </div>
              ) : null}
              {browse.selectedEpisode?.video_id != null ? (
                <div className="content-search-meta-row">
                  <span className="content-search-meta-label">Video</span>
                  <span className="content-search-meta-value is-video">
                    {browse.selectedEpisode.video_id}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {browse.brand &&
          !browse.selectedEpisode &&
          !browse.seriesLoading &&
          !browse.error && (
            <StatusMessage tone="warning">
              Series loaded — choose an episode to fill house number / video id
              placeholders.
            </StatusMessage>
          )}
      </div>
    </div>
  );
};
