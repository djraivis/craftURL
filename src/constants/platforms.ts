import { PlatformParams, ModelVariant } from '../types';

export const ctv_platforms: PlatformParams[] = [
  { 
    id: 'uktvdev',
    name: 'uktvdev',
    queryParams: '?brand=uktvdev&model=browser',
    queryParamsUse: 'Launch the app in developer mode'
  },
  { 
    id: 'amazon',
    name: 'Amazon',
    queryParams: '?brand=amazon',
    queryParamsUse: 'Launch app on Amazon devices'
  },
  { 
    id: 'freesat',
    name: 'Freesat',
    queryParams: '?brand=freesat',
    queryParamsUse: 'Launch app on Freesat devices'
  },
  { 
    id: 'fvp',
    name: 'FVP',
    queryParams: '?brand=fvp',
    queryParamsUse: 'Launch app on Freeview Play devices'
  },
  { 
    id: 'android',
    name: 'Google',
    queryParams: '?brand=google&model=androidtv',
    queryParamsUse: 'Launch app on Google/Android TV devices'
  },
  { 
    id: 'lg',
    name: 'LG webOS',
    queryParams: '?brand=lg&model=webos',
    queryParamsUse: 'Launch app on LG webOS devices'
  },
  { 
    id: 'samsung',
    name: 'Samsung',
    queryParams: '?brand=samsung&model=tizen',
    queryParamsUse: 'Launch app on Samsung Tizen TVs'
  },
  { 
    id: 'sky',
    name: 'Sky',
    queryParams: '?brand=sky',
    queryParamsUse: 'Launch app on Sky set-top boxes'
  },
  { 
    id: 'virginmedia',
    name: 'VM',
    queryParams: '?brand=virginmedia',
    queryParamsUse: 'Launch app on Virgin Media set-top boxes'
  },
  { 
    id: 'youview',
    name: 'YV',
    queryParams: '?brand=youview',
    queryParamsUse: 'Launch app on YouView devices'
  }
];

export const ctv_variants: ModelVariant[] = [
  { 
    id: 'default',
    name: 'Default',
    value: '',
    platforms: ['youview'],
    description: 'Launch app on any Youview Device that supports DASH playback'
  },
  { 
    id: 'atv',
    name: 'ATV',
    value: '&model=atv',
    platforms: ['youview'],
    description: 'Launch app specifically for YouView ATV devices'
  },
  {
    id: 'firetv',
    name: 'firetv/default',
    value: '&model=firetv',
    platforms: ['amazon'],
    description: 'Amazon Fire TV'
  },
  {
    id: 'kepler',
    name: 'kepler/default',
    value: '&model=kepler',
    platforms: ['amazon'],
    description: 'Amazon Kepler'
  },
  {
    id: 'kepler-dash',
    name: 'kepler/dash',
    value: '&model=kepler&variant=dash',
    platforms: ['amazon'],
    description: 'Amazon Kepler with DASH variant'
  },
  {
    id: 'fvp-default',
    name: 'default/default',
    value: '',
    platforms: ['fvp'],
    description: 'Default Freeview Play'
  },
  {
    id: 'fvp-default-vewd',
    name: 'default/vewd',
    value: '&model=default&variant=vewd',
    platforms: ['fvp'],
    description: 'FVP with default model and Vewd variant'
  },
  {
    id: 'fvp-firetv-vewd',
    name: 'firetv/vewd',
    value: '&model=firetv&variant=vewd',
    platforms: ['fvp'],
    description: 'Fire TV devices running Vewd browser'
  },
  {
    id: 'fvp-lg-default',
    name: 'lg/default',
    value: '&model=lg',
    platforms: ['fvp'],
    description: 'LG TV with Magic Remote support'
  },
  {
    id: 'sky-default',
    name: 'default/default',
    value: '',
    platforms: ['sky'],
    description: 'Default Sky set-top box'
  },
  {
    id: 'sky-q',
    name: 'q/default',
    value: '&model=q',
    platforms: ['sky'],
    description: 'Sky Q devices'
  }
];
