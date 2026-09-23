# CTV CraftURL

React + TypeScript + Vite deeplink URL builder for UKTV Connected TV apps (**v2.0.1**). Brand: **CTV CraftURL**. Theme: **Transmission**.

Builds always-HTTPS CTV host URLs with optional platform query params and deeplink paths, then copy/open them for testing.

## Features

- **Environments** — PPDev, PreProd, Production (with purpose/use notes in the info panel)
- **Sites** — Standard CTV hosts plus Testing, Simtest, Suitest, DevTools, Chromecast, Freely (site rules vary: e.g. DevTools has no platform query / deeplinks; Chromecast uses a bare host)
- **Platforms** — YouView, Freeview Play, Amazon, Samsung, Virgin Media, Sky, Android TV, LG, Freesat, browser/dev, and production variants
- **Host panel** — Environment → Site → Platform / variant (production platforms locked where required)
- **Content search** — Local brand title suggestions from `brandlist.json` (spotlight on focus, filter while typing); selecting a brand loads series/episodes from the Schedule API
- **Deeplinks** — Path templates filled from brand/episode (`slug`, `houseNumber`, `videoId`, `seriesNumber`); stacked with platform query at the end when both apply
- **Result thumb** — Episode/brand image via UKTV Cloudinary named transform (`t_house_number_tool_card_square`)
- **URL bar** — Segmented live URL; **Legend** expands/centers the full URL and hides Copy/Load for inspection
- **Tuner** — Full-viewport URL-only mode; edit Site / Environment / Platform in place; **Retune** spins each segment like a soft slot reel (Esc / Exit to leave)
- **Transmission theme** — Studio bench UI with ink URL ribbon

## How it works

1. **Host** — Pick environment, site, and (when allowed) platform + variant. Preferences persist in `localStorage`.
2. **Content** — Type a title for local suggestions, or select a brand to load series → episode from Schedule. Episode fields feed deeplink placeholders.
3. **Deeplink** — Choose a template; path is filled and placed **before** `?brand=…` / other platform query params.
4. **URL** — `constructUrl` assembles `https://{host}[/{deeplink}][?platformQuery]`. Copy or Load from the URL bar.
5. **Tuner** — Same host rules, URL-first UI. Retune picks a random valid Site/Env/Platform combo with staggered reel animation.
6. **Legend** — Annotates Protocol / App / Site / Environment / Domain / Deeplink / Platform; full-width centered URL, no action buttons.

Special hosts:

| Site | Notes |
|------|--------|
| DevTools | Host only — no platform query, no deeplinks |
| Chromecast | Bare `chromecast.…` host (no `ctv-` prefix) |
| Production | Platform/variant lists narrowed / locked per site rules |

## Getting started

### Prerequisites

- Node.js **20+** (`package.json` `engines`, matches Netlify)
- npm 9+

### Install & run

```bash
npm install
npm run dev
```

### Scripts

```bash
npm run typecheck
npm run lint
npm run test
npm run build      # → dist/ (gitignored)
npm run preview    # serve dist/ locally
```

Unit tests cover URL construction, deeplink templates, Host/Tuner sync, prod variants, site/deeplink context, brand suggestions, and Cloudinary transforms.

### Deploy (Netlify)

`netlify.toml` sets Node 20, `npm run build`, publish dir `dist`, and SPA fallback to `index.html`.

1. Push this repo to GitHub
2. Netlify → **Import an existing project** → select the repo
3. Build command / publish dir should come from `netlify.toml` automatically

**CORS note:** Schedule search calls UKTV hosts from the browser. Localhost or allowed origins work; a public Netlify origin may be blocked, and content search surfaces an error. Add a Netlify proxy later if live calls must work from the deployed site.

### CI

GitHub Actions (`.github/workflows/ci.yml`) runs `typecheck`, `lint`, `test`, and `build` on pushes and PRs to `main` / `master`.

## Project structure

```
src/
├── components/   # UI (url/ reel+segments, content/ search pieces)
├── config/       # Schedule bases, version mock
├── constants/    # Environments, platforms, deeplinks, theme
├── data/         # brandlist.json (local suggestions)
├── hooks/        # Builder, Tuner, content browse/suggest, URL actions
├── styles/       # Tokens, atmosphere, controls, layout, URL shell
├── types/
└── utils/        # urlBuilder, schedule API, sync, Cloudinary, suggestions
docs/             # ARCHITECTURE.md, URL_BUILDER.md
netlify.toml
.github/workflows/ci.yml
```

## Docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — layers and data flow
- [`docs/URL_BUILDER.md`](docs/URL_BUILDER.md) — URL assembly details
