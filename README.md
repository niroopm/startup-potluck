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
