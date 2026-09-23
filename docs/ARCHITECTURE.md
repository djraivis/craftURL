# CTV CraftURL architecture

## Overview

CTV CraftURL is a React + TypeScript Vite app for building UKTV CTV deeplink URLs. Builder state lives in `useBuilderState` (composed hooks); there is no global React context. Theme is fixed **Transmission** via `data-theme`.

External calls (browser → UKTV hosts):

- Schedule API (brand / series / episode lookup)

## Layers

| Layer | Path | Role |
|-------|------|------|
| Components | `src/components` | Header, Host/Content/Deeplink panels, Info panel, URL display |
| URL UI | `src/components/url/*` | Segments, parts, action buttons, Retune reel strip |
| Content UI | `src/components/content/*` | Brand suggest input, series/episode selects |
| Hooks | `src/hooks` | `useBuilderState` composes host prefs, Tuner, deeplink/content, URL actions |
| Styles | `src/styles/*` | Tokens, atmosphere, controls, layout, URL shell |
| Constants | `src/constants` | Environments, platforms, deeplink templates, builder defaults |
| Data | `src/data/brandlist.json` | Local brand titles for search suggestions |
| Config | `src/config` | Schedule base URLs, version mock |
| Utils | `src/utils` | URL build, schedule API/search, builder sync, Cloudinary thumbs, brand suggestions, version check |
| Deploy | `netlify.toml` | Node 20, `npm run build` → `dist`, SPA fallback |
| CI | `.github/workflows/ci.yml` | typecheck, lint, test, build |

## Data flow

1. **Host** — Environment / site / platform / variant (`useHostPreferences` + `builderSync`). Persisted in `localStorage`.
2. **Content** — Local title suggest (`useBrandSuggest` + `brandlist.json`); selection loads series/episodes via Schedule (`useContentBrowse`).
3. **Deeplink** — Template fill (`fillDeeplinkTemplate`) from brand/episode fields; path stored in builder state.
4. **URL** — `constructUrl` → HTTPS host + optional deeplink path + platform query at the end. Copy / open / version check via `useUrlActions`.
5. **Tuner** — Same host rules; in-URL segment pickers; **Retune** spins Site / Environment / Platform as independent reels (`useTunerMode`).
6. **Legend** — Segment labels on the URL bar; full-width centered inspect mode (hides Copy/Load).

## UI modes

- **Builder** — Sticky URL bar + Host / Content / Deeplink / Info panels
- **Tuner** — Full-viewport URL stage; Esc or Exit returns to builder (shared state kept)
- **Legend** — Inspect annotations on the URL (works in builder; Tuner uses bare URL text)

## Scope

This client builds CTV **host + platform query + deeplink path** only. It does not run the CTV app itself.
