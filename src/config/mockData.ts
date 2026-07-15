import type { VersionInfo } from '../types';

/**
 * Placeholder /version.txt payload used when the live file cannot be fetched
 * (typical browser CORS block). Swap/remove once hosts allow this origin.
 */
export const CTV_VERSION_MOCK: VersionInfo = {
  success: Date.now(),
  version: '3.4.3-dev',
  hash: '5210fa12',
  branch: 'CTV-1165-Update-mux-player-name-to-be-platform-specific',
  isMock: true
};
