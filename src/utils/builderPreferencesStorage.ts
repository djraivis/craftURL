import {
  BUILDER_PREFERENCES_STORAGE_KEY,
  DEFAULT_BUILDER_PREFERENCES,
  type BuilderPreferences
} from '../constants/builderDefaults';
import { isKnownPlatformId } from './platformMapping';

function isValidPreferences(value: unknown): value is BuilderPreferences {
  if (!value || typeof value !== 'object') return false;

  const prefs = value as Partial<BuilderPreferences>;
  return (
    typeof prefs.environmentType === 'string' &&
    typeof prefs.name === 'string' &&
    typeof prefs.platform === 'string' &&
    typeof prefs.variant === 'string' &&
    isKnownPlatformId(prefs.platform)
  );
}

export function loadBuilderPreferences(): BuilderPreferences {
  try {
    const stored = localStorage.getItem(BUILDER_PREFERENCES_STORAGE_KEY);
    if (!stored) return DEFAULT_BUILDER_PREFERENCES;

    const parsed: unknown = JSON.parse(stored);
    if (!isValidPreferences(parsed)) return DEFAULT_BUILDER_PREFERENCES;

    return parsed;
  } catch {
    return DEFAULT_BUILDER_PREFERENCES;
  }
}

export function saveBuilderPreferences(preferences: BuilderPreferences): void {
  try {
    localStorage.setItem(BUILDER_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // Ignore quota / private mode errors
  }
}
