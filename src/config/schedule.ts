/** Schedule / CFS API bases keyed by craftURL environmentType. */
export const SCHEDULE_API_BASES: Record<string, string> = {
  production: 'https://cfschedules.uktv.co.uk',
  preprod: 'https://cfschedules.ppuktv.co.uk',
  ppdev: 'https://cfschedules.ppdevuktv.co.uk'
};

export function getScheduleApiBase(environmentType: string): string {
  return SCHEDULE_API_BASES[environmentType] ?? SCHEDULE_API_BASES.production;
}

/** Host panel meta — schedule host without protocol. */
export function getContentSearchMeta(environmentType: string): string {
  return getScheduleApiBase(environmentType).replace(/^https?:\/\//, '');
}
