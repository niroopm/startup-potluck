export const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbxhvepu1uceOPU7jkMpAHaaafL6-aeQwgT99PtcGvQfbJMBI0wVunOoCXwhuYolrngo/exec";

export async function sheetPost(payload) {
  if (!SHEET_ENDPOINT) return { ok: false, reason: 'no-endpoint' };
  try {
    const res = await fetch(SHEET_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    return { ok: false, reason: 'network-error', error: String(err) };
  }
}

export async function sheetGet(mobile, date) {
  if (!SHEET_ENDPOINT) return { found: false, reason: 'no-endpoint' };
  try {
    let url = SHEET_ENDPOINT + '?mobile=' + encodeURIComponent(mobile);
    if (date) url += '&date=' + encodeURIComponent(date);
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    return { found: false, reason: 'network-error', error: String(err) };
  }
}

export async function sheetListMembers() {
  if (!SHEET_ENDPOINT) return { ok: false, reason: 'no-endpoint' };
  try {
    const res = await fetch(SHEET_ENDPOINT + '?action=list');
    const data = await res.json();
    if (data && Array.isArray(data.members)) return { ok: true, members: data.members };
    return { ok: false, reason: 'unsupported' };
  } catch (err) {
    return { ok: false, reason: 'network-error', error: String(err) };
  }
}

export async function sheetListEvents(audience) {
  if (!SHEET_ENDPOINT) return { ok: false, reason: 'no-endpoint' };
  try {
    let url = SHEET_ENDPOINT + '?action=events';
    if (audience) url += '&audience=' + encodeURIComponent(audience);
    const res = await fetch(url);
    const data = await res.json();
    if (data && Array.isArray(data.events)) return { ok: true, events: data.events };
    return { ok: false, reason: 'unsupported' };
  } catch (err) {
    return { ok: false, reason: 'network-error', error: String(err) };
  }
}

export async function sheetAdminList(type, adminKey) {
  if (!SHEET_ENDPOINT) return { ok: false, reason: 'no-endpoint' };
  try {
    const url = `${SHEET_ENDPOINT}?admin=1&key=${encodeURIComponent(adminKey)}&type=${encodeURIComponent(type)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.error) return { ok: false, reason: 'unauthorized' };
    if (data && data.ok && Array.isArray(data.rows)) return { ok: true, rows: data.rows };
    return { ok: false, reason: 'unexpected-shape' };
  } catch (err) {
    return { ok: false, reason: 'network-error', error: String(err) };
  }
}

export async function sheetUpdateMember({ adminKey, mobile, fields }) {
  return sheetPost({ type: 'updateMember', adminKey, mobile, fields });
}

export async function sheetUpdateElite({ adminKey, mobile, elite }) {
  return sheetUpdateMember({ adminKey, mobile, fields: { 'Elite Member': elite ? 'Yes' : 'No' } });
}

export async function sheetUpdateProfile({ mobile, fields }) {
  return sheetPost({ type: 'updateProfile', mobile, fields });
}
