// This talks to the REAL Events API already running on hellolocal.me
// (Node.js + MySQL, usp_GetEvents / usp_EventsAction), not the Google Sheet
// used for members/RSVPs. Startup Potluck and HelloLocal share this one
// events table; each event is tagged with a `visible_on` column so both
// sites can ask for only what's relevant to them.
//
// TODO: set this to the real base URL of the GetEvents endpoint once known,
// e.g. 'https://api.hellolocal.me' or 'https://hellolocal.me/api'.
export const EVENTS_API_BASE = 'https://hellolocal.me/api';

const SITE_TAG = 'potluck';

function isConfigured() {
  return Boolean(EVENTS_API_BASE) && !EVENTS_API_BASE.includes('REPLACE');
}

// Mirrors the GetEvents controller's request body shape.
export async function getEvents({ upcoming = 1, category, city, search, page = 1, limit = 20 } = {}) {
  if (!isConfigured()) return { ok: false, reason: 'no-endpoint' };
  try {
    const res = await fetch(`${EVENTS_API_BASE}/events/GetEvents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visible_on: SITE_TAG, // NEW column — see backend notes
        upcoming,
        category: category || undefined,
        city: city || undefined,
        search: search || undefined,
        page,
        limit
      })
    });
    const data = await res.json();

    // The controller wraps results as utill.responseSuccessJSON(200,'success',{events, pagination}).
    // Adjust this line if your actual response envelope differs.
    const payload = data?.data ?? data;
    const events = payload?.events;
    if (Array.isArray(events)) {
      return { ok: true, events, pagination: payload.pagination };
    }
    return { ok: false, reason: 'unexpected-shape' };
  } catch (err) {
    return { ok: false, reason: 'network-error', error: String(err) };
  }
}


