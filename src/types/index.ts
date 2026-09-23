export type Environment = {
  id: string;
  name: string;
  domain: string;
};

export type Name = {
  id: string;
  name: string;
  domain: string;
  category?: 'development' | 'testing';
  description?: string;
  purpose?: string;
  use?: string;
  destination?: string;
  format?: string;
};

export type PlatformParams = {
  id: string;
  name: string;
  queryParams: string;
  queryParamsUse?: string;
  description?: string;
};

export type ModelVariant = {
  id: string;
  name: string;
  value: string;
  platforms: string[];
  description?: string;
};

export type ProdLink = {
  id: string;
  name: string;
  url: string;
  allowedPlatforms: string[];
  use?: string;
  purpose?: string;
};

export type DeeplinkOption = {
  id: string;
  name: string;
  url: string;
  description?: string;
  destination?: string;
  format?: string;
};

export type RetuneSegment = 'site' | 'environment' | 'platform';

export interface UrlPartProps {
  text: string;
  partKey?: string;
  isActive: boolean;
  isPrimary?: boolean;
  shouldAnimate?: boolean;
  /** Stronger top→bottom reel tick (Tuner Retune). */
  isRolling?: boolean;
  isComplete?: boolean;
  isPlaceholder?: boolean;
}

export type TunerOption = {
  id: string;
  label: string;
  value: string;
};

export interface UrlDisplayProps {
  app: string;
  name: string;
  environment: string;
  platform?: string;
  variant?: string;
  path?: string;
  isDeeplinksEnabled?: boolean;
  /** When true, annotate each URL segment with its role */
  showLegend?: boolean;
  isTunerMode?: boolean;
  retuningSegments?: RetuneSegment[];
  settlingSegments?: RetuneSegment[];
  environmentOptions?: TunerOption[];
  siteOptions?: TunerOption[];
  platformOptions?: TunerOption[];
  selectedEnvironmentId?: string;
  /** Tuner platform menu selection key: `platformId|||variantValue` */
  selectedPlatformSpec?: string;
  previousValues: {
    app: string;
    name: string;
    environment: string;
    platform: string;
    variant: string;
    path: string;
  };
  onOpen?: () => void;
  /** Returns true when the URL was written to the clipboard. */
  onCopy?: () => void | boolean | Promise<void | boolean>;
  onTunerEnvironmentSelect?: (environmentTypeId: string) => void;
  onTunerSiteSelect?: (siteValue: string) => void;
  /** Tuner platform picker value: `platformId|||variantValue` */
  onTunerPlatformSelect?: (platformSpec: string) => void;
}