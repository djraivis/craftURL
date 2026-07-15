import { describe, expect, it } from 'vitest';
import { parseVersionTxt } from './versionCheck';

describe('parseVersionTxt', () => {
  it('parses the CTV JSON version.txt shape', () => {
    const info = parseVersionTxt(`{
  "version": "3.4.3-dev",
  "hash": "5210fa12",
  "branch": "CTV-1165-Update-mux-player-name-to-be-platform-specific"
}`);
    expect(info).toMatchObject({
      version: '3.4.3-dev',
      hash: '5210fa12',
      branch: 'CTV-1165-Update-mux-player-name-to-be-platform-specific'
    });
  });

  it('parses a simple version string', () => {
    expect(parseVersionTxt('3.4.3').version).toBe('3.4.3');
  });
});
