# URL builder

Source of truth: `src/utils/urlBuilder.ts`, `src/constants/deeplinks.ts`, `src/constants/environments.ts`.

## Host pieces

| Piece | Meaning |
|-------|---------|
| App | Always `ctv` (omitted for bare Chromecast host) |
| Site / name | Subdomain id (`dev1`, `amazonfire`, `chromecast`, …) |
| Environment domain | e.g. `ppdevuktv`, `ppuktv`, `uktv` |
| Platform | Brand query (`?brand=youview`, `?brand=amazon`, …) |
| Variant | Optional suffix on the platform query (`&model=firetv`, …) |
| Deeplink path | Filled template path (no leading slash stored; added when assembling) |

## Assembly order

1. `https://{app}-{site}.{env}.co.uk`  
   - Exception: Preprod Chromecast → `https://chromecast.ppuktv.co.uk`
2. If deeplink path: append `/{path}`.
3. Else if platform query only: ensure `/` before `?` on the domain root.
4. Append platform query **last** (after deeplink when both exist). After a deeplink path, no extra `/` is required before `?`.

## Example shapes

Host + platform:

```
https://ctv-dev1.ppdevuktv.co.uk/?brand=fvp
```

Deeplink + platform query:

```
https://ctv-dev1.ppdevuktv.co.uk/brand/dave?brand=fvp
```

Production + variant:

```
https://ctv-amazonfire.uktv.co.uk/?brand=amazon&model=firetv
```

## Site rules

| Site / context | Behaviour |
|----------------|-----------|
| Most sites | Platform query allowed; deeplinks allowed when enabled |
| DevTools | Host only — no platform query, no deeplinks |
| Chromecast (preprod) | Bare host name; no `ctv-` prefix |
| Production | Platform/variant lists narrowed per site (`prodVariants` / sync helpers) |

Helpers: `siteAllowsPlatformQuery`, `siteAllowsDeeplinks` in `src/constants/environments.ts`.

## Content → deeplink fill

1. Local brand suggest (`brandlist.json`) or Schedule search by brand id.
2. Series → episode selection supplies `slug`, `houseNumber`, `videoId`, `seriesNumber`.
3. `fillDeeplinkTemplate` substitutes placeholders in the selected template from `src/constants/deeplinks.ts`.
4. Resulting path is passed into `constructUrl` with the current host + platform.

## Result thumbnails

Content search thumbs rewrite Cloudinary URLs with the UKTV named transform `t_house_number_tool_card_square` (`src/utils/cloudinary.ts`).

## UI helpers (not part of the string)

- **Legend** — Labels each URL segment; does not change the copied URL.
- **Tuner Retune** — Random valid Site / Environment / Platform combo via the same sync rules as manual picks.
