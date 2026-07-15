import type { DeeplinkFillData, ScheduleBrand, ScheduleEpisode } from '../types/schedule';

export function fillDeeplinkTemplate(
  templateUrl: string,
  data: DeeplinkFillData
): string {
  return templateUrl
    .replace(/<houseNumber>/g, data.houseNumber ?? '<houseNumber>')
    .replace(/<slug>/g, data.slug ?? '<slug>')
    .replace(/<videoId>/g, data.videoId ?? '<videoId>')
    .replace(/<seriesNumber>/g, data.seriesNumber ?? '<seriesNumber>');
}

export function toDeeplinkFillData(
  brand: ScheduleBrand | null | undefined,
  episode: ScheduleEpisode | null | undefined
): DeeplinkFillData {
  const slug = episode?.brand_slug || brand?.slug;
  const houseNumber = episode?.house_number;
  const videoId =
    episode?.video_id != null && episode.video_id !== ''
      ? String(episode.video_id)
      : undefined;
  const seriesNumber =
    episode?.series_number != null && episode.series_number !== ''
      ? String(episode.series_number)
      : undefined;

  return {
    slug,
    houseNumber,
    videoId,
    seriesNumber
  };
}

export function resolveDeeplinkPath(
  templateUrl: string,
  brand: ScheduleBrand | null | undefined,
  episode: ScheduleEpisode | null | undefined
): string {
  return fillDeeplinkTemplate(templateUrl, toDeeplinkFillData(brand, episode));
}
