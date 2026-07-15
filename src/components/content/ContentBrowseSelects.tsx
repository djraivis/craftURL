import React from 'react';
import type { ScheduleEpisode, ScheduleSeriesRef } from '../../types/schedule';
import { episodeLabel } from '../../utils/scheduleApi';

interface ContentBrowseSelectsProps {
  seriesOptions: ScheduleSeriesRef[];
  episodes: ScheduleEpisode[];
  selectedSeriesId: string;
  selectedEpisodeId: string;
  seriesLoading: boolean;
  hasBrand: boolean;
  onSeriesChange: (seriesId: string) => void;
  onEpisodeChange: (episodeId: string) => void;
}

export const ContentBrowseSelects: React.FC<ContentBrowseSelectsProps> = ({
  seriesOptions,
  episodes,
  selectedSeriesId,
  selectedEpisodeId,
  seriesLoading,
  hasBrand,
  onSeriesChange,
  onEpisodeChange
}) => (
  <>
    <label className="terminal-field terminal-field-series">
      <span className="terminal-group-label">Series</span>
      <select
        value={selectedSeriesId}
        onChange={(e) => onSeriesChange(e.target.value)}
        disabled={!hasBrand || seriesOptions.length === 0 || seriesLoading}
        className="terminal-select"
      >
        {!hasBrand || seriesOptions.length === 0 ? (
          <option value="">—</option>
        ) : (
          seriesOptions.map((series) => (
            <option key={series.id} value={String(series.id)}>
              {series.number}
            </option>
          ))
        )}
      </select>
    </label>

    <label className="terminal-field terminal-field-episode">
      <span className="terminal-group-label">Episode</span>
      <select
        value={selectedEpisodeId}
        onChange={(e) => onEpisodeChange(e.target.value)}
        disabled={!hasBrand || episodes.length === 0 || seriesLoading}
        className="terminal-select"
      >
        {seriesLoading ? (
          <option value="">Loading…</option>
        ) : !hasBrand || episodes.length === 0 ? (
          <option value="">Select episode</option>
        ) : (
          episodes.map((episode) => (
            <option key={episode.id} value={String(episode.id)}>
              {episodeLabel(episode)}
            </option>
          ))
        )}
      </select>
    </label>
  </>
);
