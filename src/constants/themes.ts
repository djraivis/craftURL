export type AppTheme = 'transmission';

/** App is locked to Transmission — studio bench + ink URL ribbon. */
export const DEFAULT_THEME: AppTheme = 'transmission';

export function applyTheme(theme: AppTheme = DEFAULT_THEME) {
  document.documentElement.setAttribute('data-theme', theme);
}
