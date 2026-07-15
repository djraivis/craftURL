export type ScheduleSearchMode = 'id' | 'house_number' | 'slug';

export type ScheduleSeriesRef = {
  id: number;
  number: string | number;
};

export type ScheduleEpisode = {
  item_type?: string;
  id: number;
  house_number?: string;
  name?: string;
  episode_number?: number | string;
  series_number?: number | string;
  series_id?: number;
  video_id?: number | string;
  brand_id?: number;
  brand_slug?: string;
  brand_name?: string;
  image?: string;
  channel?: string | null;
};

export type ScheduleBrand = {
  item_type?: string;
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string | null;
  series?: ScheduleSeriesRef[];
  landing_episode?: ScheduleEpisode | null;
  available_episodes?: number;
  error?: string;
};

export type ScheduleSeries = {
  item_type?: string;
  id: number;
  number?: number | string;
  total_episodes?: number;
  episodes?: ScheduleEpisode[];
  brand?: { id?: number; slug?: string; name?: string };
  error?: string;
};

export type DeeplinkFillData = {
  houseNumber?: string;
  slug?: string;
  videoId?: string;
  seriesNumber?: string;
};
