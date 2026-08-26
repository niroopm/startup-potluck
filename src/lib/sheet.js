// Same Google Apps Script backend used by the original single-page site.
// Swap this URL if you redeploy the script.
export const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbxY3g4mEV2bH_UmixWxO1UpWJGTemki_Xw8d__GRPiWuyAjE8wv80vFSXcjv216VeZw/exec";

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

// NOTE: the original Apps Script only supports single-member lookup by mobile
// number, not a "list all members" endpoint. The Members page below calls this
// helper first and falls back to demo data if the script doesn't support
// `?action=list`. To make the Members directory fully live, add a `list`
// action to the Apps Script that returns all registered rows as JSON.
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
