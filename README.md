# Startup Potluck — Multi-Page Site

A React + React Router rebuild of the original single-page Startup Potluck site,
split into six pages while keeping the original kraft-paper / violet / ticket-stub
design system.

## Pages

| Route        | Page                                                        |
|--------------|---------------------------------------------------------------|
| `/`          | Home — hero, dynamic Sunday ticket, stats, how-it-works       |
| `/register`  | New member registration (one-time)                            |
| `/login`     | Returning-member login by mobile number                       |
| `/members`   | Community members directory                                    |
| `/events`    | Upcoming Sundays calendar + RSVP flow                          |
| `/contact`   | Contact form + direct contact info                             |

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build      # production build -> dist/
npm run preview    # preview the production build locally
```

## Design system

All shared styles live in `src/styles/global.css`, ported directly from the
original site's CSS variables and components (`.ticket`, `.flow-card`,
`.session-banner`, `.pill-choice`, `.stats-grid`, etc.) so every new page
matches the original look exactly.

## Backend (Google Sheets)

The site talks to the same Google Apps Script endpoint as the original page,
defined in `src/lib/sheet.js`:

- `sheetPost(payload)` — used by Register and Events (RSVP) to write rows.
- `sheetGet(mobile, date)` — used by Login to look up a member by mobile number.
- `sheetListMembers()` — **new**, used by the Members page. The existing Apps
  Script only supports single-mobile lookup, so this currently falls back to
  demo data. To make the Members directory live, add a `list` action to your
  Apps Script that returns:

  ```json
  { "members": [ { "name": "...", "mobile": "...", "company": "...", "role": "...", "need": "..." }, ... ] }
  ```

  and have it respond to `GET ?action=list`.

## Auth / session

`src/context/AuthContext.jsx` holds the currently logged-in member (from
Register or Login) in React state + `localStorage`, so the Events page knows
who is RSVPing without asking for a mobile number twice.

## Deploying

This is a static Vite build — `npm run build` outputs a `dist/` folder that
can be deployed as-is to Netlify, Vercel, GitHub Pages, or any static host.
Because routing is client-side, configure your host to redirect all paths to
`index.html` (a `_redirects` file with `/* /index.html 200` works on Netlify;
Vercel and GitHub Pages have their own equivalents).

## Progressive Web App (installable)

The site is a full PWA via `vite-plugin-pwa`: it ships a manifest, a service
worker (auto-precaches all assets and updates itself), and an "Install App"
button in the header that appears automatically on browsers that support
install prompts (most Android/desktop Chrome/Edge; iOS Safari uses
Share → Add to Home Screen instead, no button needed there).

**Swapping in your real icon:** the icons currently in `public/icons/` are
placeholders generated to match the site's logo mark. Once you have your
real icon artwork, replace these four files (keep the exact filenames and
sizes):

| File                          | Size    | Used for                          |
|--------------------------------|---------|------------------------------------|
| `public/icons/icon-192.png`    | 192×192 | Standard app icon                  |
| `public/icons/icon-512.png`    | 512×512 | Standard app icon (large)          |
| `public/icons/icon-512-maskable.png` | 512×512 | Android adaptive icon — keep your logo within the center ~60% of the canvas, since Android crops this one to a circle/squircle |
| `public/icons/apple-touch-icon.png`  | 180×180 | iOS home screen icon |

Also replace `public/favicon.ico` (browser tab icon) if you want it to match.
No code changes needed — just overwrite the files and rebuild.

Note: PWA install prompts only fire over HTTPS (or `localhost` in dev), so
test installability on your deployed URL, not by opening `dist/index.html`
directly from disk.

