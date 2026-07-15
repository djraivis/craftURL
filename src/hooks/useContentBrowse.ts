import { useEffect, useState } from 'react';
import type { ScheduleBrand, ScheduleEpisode } from '../types/schedule';
import { fetchSeries, searchBrand } from '../utils/scheduleApi';

interface UseContentBrowseArgs {
  environmentType: string;
  onContentChange: (
    brand: ScheduleBrand | null,
    episode: ScheduleEpisode | null
  ) => void;
}

export function useContentBrowse({
  environmentType,
  onContentChange
}: UseContentBrowseArgs) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brand, setBrand] = useState<ScheduleBrand | null>(null);
  const [selectedSeriesId, setSelectedSeriesId] = useState('');
  const [episodes, setEpisodes] = useState<ScheduleEpisode[]>([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState('');

  useEffect(() => {
    setQuery('');
    setBrand(null);
    setSelectedSeriesId('');
    setEpisodes([]);
    setSelectedEpisodeId('');
    setError(null);
    onContentChange(null, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- clear when Schedule tier changes
  }, [environmentType]);

  const loadSeries = async (
    currentBrand: ScheduleBrand,
    seriesId: number | string,
    preferredEpisode: ScheduleEpisode | null
  ) => {
    setSeriesLoading(true);
    try {
      const series = await fetchSeries(environmentType, seriesId);
      const nextEpisodes = series.episodes ?? [];
      setEpisodes(nextEpisodes);

      const preferredId = preferredEpisode?.id;
      const match =
        (preferredId != null
          ? nextEpisodes.find((ep) => ep.id === preferredId)
          : undefined) ??
        preferredEpisode ??
        nextEpisodes[0] ??
        null;

      if (match) {
        setSelectedEpisodeId(String(match.id));
        onContentChange(currentBrand, match);
      } else {
        setSelectedEpisodeId('');
        onContentChange(currentBrand, null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load series');
      if (preferredEpisode) {
        setEpisodes([preferredEpisode]);
        setSelectedEpisodeId(String(preferredEpisode.id));
        onContentChange(currentBrand, preferredEpisode);
      }
    } finally {
      setSeriesLoading(false);
    }
  };

  const applyBrand = (nextBrand: ScheduleBrand) => {
    setBrand(nextBrand);
    setError(null);

    const landing = nextBrand.landing_episode ?? null;
    const seriesList = nextBrand.series ?? [];

    if (landing?.series_id) {
      setSelectedSeriesId(String(landing.series_id));
      setSelectedEpisodeId(String(landing.id));
      setEpisodes([landing]);
      onContentChange(nextBrand, landing);
      void loadSeries(nextBrand, landing.series_id, landing);
      return;
    }

    if (seriesList.length > 0) {
      const first = seriesList[0];
      setSelectedSeriesId(String(first.id));
      setSelectedEpisodeId('');
      setEpisodes([]);
      onContentChange(nextBrand, null);
      void loadSeries(nextBrand, first.id, null);
      return;
    }

    setSelectedSeriesId('');
    setSelectedEpisodeId('');
    setEpisodes([]);
    onContentChange(nextBrand, null);
  };

  const runSearch = async (rawInput: string) => {
    const trimmed = rawInput.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);

    try {
      const { brand: nextBrand } = await searchBrand(environmentType, trimmed);
      applyBrand(nextBrand);
    } catch (err) {
      setBrand(null);
      setSelectedSeriesId('');
      setEpisodes([]);
      setSelectedEpisodeId('');
      onContentChange(null, null);
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSeriesChange = (seriesId: string) => {
    setSelectedSeriesId(seriesId);
    setSelectedEpisodeId('');
    setEpisodes([]);
    if (!brand || !seriesId) {
      onContentChange(brand, null);
      return;
    }
    onContentChange(brand, null);
    void loadSeries(brand, seriesId, null);
  };

  const handleEpisodeChange = (episodeId: string) => {
    setSelectedEpisodeId(episodeId);
    if (!brand) return;
    const episode =
      episodes.find((ep) => String(ep.id) === episodeId) ?? null;
    onContentChange(brand, episode);
  };

  const selectedEpisode =
    episodes.find((ep) => String(ep.id) === selectedEpisodeId) ?? null;

  return {
    query,
    setQuery,
    loading,
    seriesLoading,
    error,
    brand,
    selectedSeriesId,
    episodes,
    selectedEpisodeId,
    selectedEpisode,
    seriesOptions: brand?.series ?? [],
    runSearch,
    handleSeriesChange,
    handleEpisodeChange
  };
}
