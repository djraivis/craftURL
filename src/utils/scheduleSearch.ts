import type { ScheduleSearchMode } from '../types/schedule';

/** Letters + digits (+ optional trailing letter), e.g. CTCL286R / CTOM847S */
const HOUSE_NUMBER_PATTERN = /^[A-Za-z]{2,6}\d{1,6}[A-Za-z]?$/;

export function toBrandSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function detectSearchMode(input: string): {
  mode: ScheduleSearchMode;
  value: string;
} {
  const trimmed = input.trim();

  if (!trimmed) {
    return { mode: 'slug', value: '' };
  }

  if (/^\d+$/.test(trimmed)) {
    return { mode: 'id', value: trimmed };
  }

  if (HOUSE_NUMBER_PATTERN.test(trimmed)) {
    return { mode: 'house_number', value: trimmed.toUpperCase() };
  }

  return { mode: 'slug', value: toBrandSlug(trimmed) };
}

export function searchModeLabel(mode: ScheduleSearchMode): string {
  switch (mode) {
    case 'id':
      return 'Brand ID';
    case 'house_number':
      return 'House number';
    case 'slug':
      return 'Brand slug';
  }
}
