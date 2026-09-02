export const EVENTS_API_BASE = 'https://api.hellolocal.me';
const EVENTS_IMAGE_BASE = 'https://api.hellolocal.me/api/v1/resources/events'; // e.g. 'https://api.hellolocal.me/uploads/events/'

const SITE_TAG = 'potluck';

export function getEventImageUrl(filename) {
  if (!filename || !EVENTS_IMAGE_BASE) return '';
  return `${EVENTS_IMAGE_BASE.replace(/\/$/, '')}/${filename}`;
}

// Mirrors the GetEvents controller's request body shape.
export async function getEvents({ visibleOn = SITE_TAG, isActive = 1, upcoming, category, city, search, page = 1, limit = 20 } = {}) {
  try {
    const res = await fetch(`${EVENTS_API_BASE}/api/events/GetEvents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visible_on: visibleOn,
        is_active: isActive,
        upcoming,
        category: category || undefined,
        city: city || undefined,
        search: search || undefined,
        page,
        limit
      })
    });
    const data = await res.json();

    const payload = data?.response ?? data?.data ?? data;
    const events = payload?.events;
    if (Array.isArray(events)) {
      return { ok: true, events, pagination: payload.pagination };
    }
    return { ok: false, reason: 'unexpected-shape', raw: data };
  } catch (err) {
    return { ok: false, reason: 'network-error', error: String(err) };
  }
}
