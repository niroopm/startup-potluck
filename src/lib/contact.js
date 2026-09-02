export const CONTACT_API_BASE = 'https://api.hellolocal.me';

export async function sendContactMessage({ name, email, phone, message }) {
  try {
    const res = await fetch(`${CONTACT_API_BASE}/api/hl/potluckMail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, message, site: 'potluck' })
    });
    const data = await res.json();
    return data; 
    // if (data && (data.status === 200 || data.ok === true)) {
    //   return { ok: true };
    // }
    // return { ok: false, reason: data?.message || 'send-failed' };
  } catch (err) {
    return { ok: false, reason: 'network-error', error: String(err) };
  }
}

