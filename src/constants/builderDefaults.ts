import { CTV_ENVIRONMENTS, CTV_PPDEV_ENVIRONMENTS } from './environments';

export interface BuilderPreferences {
  environmentType: string;
  name: string;
  platform: string;
  variant: string;
}

export const DEFAULT_BUILDER_PREFERENCES: BuilderPreferences = {
  environmentType: 'ppdev',
  name: CTV_PPDEV_ENVIRONMENTS[0].domain,
  platform: 'virginmedia',
  variant: ''
};

export const BUILDER_PREFERENCES_STORAGE_KEY = 'crafturlBuilderPrefs';

export function getEnvironmentDomainForType(environmentType: string): string {
  return (
    CTV_ENVIRONMENTS.find((env) => env.id === environmentType)?.domain ??
    CTV_ENVIRONMENTS[0].domain
  );
}

export const INITIAL_BUILDER_STATE = {
  app: 'ctv',
  ...DEFAULT_BUILDER_PREFERENCES,
  environment: getEnvironmentDomainForType(DEFAULT_BUILDER_PREFERENCES.environmentType),
  path: '',
  isDeeplinksEnabled: false,
  selectedDeeplink: ''
};
