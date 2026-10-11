import { useState } from 'react';
import { sheetPost } from '../lib/sheet.js';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = { name: '', mobile: '', email: '', city: '', guests: '1', note: '' };

export default function BommalaPelliForm() {
  const { member } = useAuth();
  const [form, setForm] = useState(() => ({
    ...initialForm,
    name: member?.name || '',
    mobile: member?.mobile || '',
    email: member?.email || '',
    city: member?.city || ''
  }));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function update(field, value) {
    if (field === 'mobile') value = value.replace(/\D/g, '').slice(0, 10);
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Please enter your name.');
    if (!/^\d{10}$/.test(form.mobile)) return setError('Please enter a valid 10-digit mobile number.');
    if (!form.city.trim()) return setError('Please enter your city / place.');

    setSubmitting(true);
    const result = await sheetPost({
      type: 'bommalaPelli',
      name: form.name.trim(),
      mobile: form.mobile,
      email: form.email.trim(),
      city: form.city.trim(),
      guests: form.guests,
      note: form.note.trim()
    });
    setSubmitting(false);
    if (result && result.ok) setDone(true);
    else setError('Could not save your registration. Please try again.');
  }

  if (done) {
    return (
      <div className="flow-card" style={{ textAlign: 'center', maxWidth: 420, margin: '0 auto' }}>
        <div className="stamp">✓ok</div>
        <h3 style={{ fontSize: 17, marginBottom: 6 }}>You're registered 🎉</h3>
        <p style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
          Thanks for registering for Bommala Pelli. We'll reach out on your mobile number with details.
        </p>
      </div>
    );
  }

  return (
    <div className="flow-card">
      <p className="fc-label">Bommala Pelli — Registration</p>
      <form onSubmit={handleSubmit}>
        <div className="field"><label>Full Name</label><input type="text" required value={form.name} onChange={e => update('name', e.target.value)} /></div>
        <div className="field-row">
          <div className="field">
            <label>Mobile Number</label>
            <input type="tel" required inputMode="numeric" pattern="\d{10}" maxLength={10} placeholder="9876543210" value={form.mobile} onChange={e => update('mobile', e.target.value)} />
          </div>
          <div className="field"><label>Email</label><input type="email" value={form.email} onChange={e => update('email', e.target.value)} /></div>
        </div>
        <div className="field-row">
          <div className="field"><label>City / Place</label><input type="text" required placeholder="Rajahmundry" value={form.city} onChange={e => update('city', e.target.value)} /></div>
          <div className="field">
            <label>Number of Attendees</label>
            <select value={form.guests} onChange={e => update('guests', e.target.value)}>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <div className="field">
          <label>Anything else we should know? (optional)</label>
          <textarea rows={2} value={form.note} onChange={e => update('note', e.target.value)} />
        </div>
        {error && <p style={{ color: 'var(--red)', fontSize: 12.5, marginBottom: 10 }}>{error}</p>}
        <button type="submit" className="btn btn-primary full" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Register for Bommala Pelli'}
        </button>
      </form>
    </div>
  );
}
