import { getScheduleApiBase } from '../config/schedule';
import type {
  ScheduleBrand,
  ScheduleEpisode,
  ScheduleSearchMode,
  ScheduleSeries
} from '../types/schedule';
import { logger } from './logger';
import { detectSearchMode } from './scheduleSearch';

async function fetchJson<T>(url: string): Promise<T> {
  logger.info('Schedule API request:', url);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Schedule API error (${response.status})`);
  }

  return response.json() as Promise<T>;
}

async function fetchBrand(
  environmentType: string,
  mode: ScheduleSearchMode,
  value: string
): Promise<ScheduleBrand> {
  const base = getScheduleApiBase(environmentType);
  const params = new URLSearchParams({ [mode]: value });
  const brand = await fetchJson<ScheduleBrand>(`${base}/vod/brand/?${params}`);

  if (brand.error || !brand.id || !brand.slug) {
    throw new Error(brand.error || 'Brand not found');
  }

  return brand;
}

export async function searchBrand(
  environmentType: string,
  rawInput: string
): Promise<{ brand: ScheduleBrand; mode: ScheduleSearchMode; value: string }> {
  const { mode, value } = detectSearchMode(rawInput);
  if (!value) {
    throw new Error('Enter a brand ID, house number, or brand name');
  }

  const brand = await fetchBrand(environmentType, mode, value);
  return { brand, mode, value };
}

export async function fetchSeries(
  environmentType: string,
  seriesId: number | string
): Promise<ScheduleSeries> {
  const base = getScheduleApiBase(environmentType);
  const params = new URLSearchParams({ id: String(seriesId) });
  const series = await fetchJson<ScheduleSeries>(`${base}/vod/series/?${params}`);

  if (series.error || !series.id) {
    throw new Error(series.error || 'Series not found');
  }

  return series;
}

export function episodeLabel(episode: ScheduleEpisode): string {
  const ep = episode.episode_number != null ? `E${episode.episode_number}` : 'Episode';
  const house = episode.house_number ? ` · ${episode.house_number}` : '';
  const name = episode.name ? ` — ${episode.name}` : '';
  return `${ep}${house}${name}`;
}
