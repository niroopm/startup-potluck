import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { sheetUpdateProfile } from '../lib/sheet.js';
import { isProfileIncomplete } from '../lib/profileCompleteness.js';

// Note: Mobile and Elite Member are intentionally excluded — mobile is the
// account identifier, and Elite status is admin-controlled only.
const EDITABLE_FIELDS = [
  { key: 'name', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'company', label: 'Startup / Company' },
  { key: 'role', label: 'Role / Profession' },
  { key: 'city', label: 'City / Place' },
  { key: 'needFromCommunity', label: 'What are you looking for from this community?' },
  { key: 'startupProblemTicket', label: 'Current Startup Hurdle', textarea: true },
  { key: 'instagram', label: 'Instagram' },
  { key: 'website', label: 'Website / App' }
];

// Maps our local field keys to the exact Google Sheet column headers.
const SHEET_COLUMN_MAP = {
  name: 'Name',
  email: 'Email',
  company: 'Company',
  role: 'Role',
  city: 'City',
  needFromCommunity: 'Need From Community',
  startupProblemTicket: 'Startup Problem Ticket',
  instagram: 'Instagram',
  website: 'Website'
};

export default function Profile() {
  const { member, login } = useAuth();
  const [form, setForm] = useState(() => {
    const initial = {};
    EDITABLE_FIELDS.forEach(f => { initial[f.key] = member?.[f.key] || ''; });
    return initial;
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  if (!member) return <Navigate to="/login" replace />;

  function update(key, value) {
    setForm(f => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const fields = {};
    EDITABLE_FIELDS.forEach(f => {
      fields[SHEET_COLUMN_MAP[f.key]] = form[f.key];
    });

    const result = await sheetUpdateProfile({ mobile: member.mobile, fields });
    setSaving(false);

    if (result && result.ok) {
      login({ ...member, ...form }); // refresh session everywhere immediately
      setSaved(true);
    } else {
      setError('Could not save your changes — please try again.');
    }
  }

  return (
    <section>
      <div className="max" style={{ maxWidth: 640 }}>
        <div className="flow-head">
          <div className="eyebrow center"><span className="dot"></span>Your Account</div>
          <h2 className="section-title">My Profile</h2>
          <p className="section-lede center">Keep your details up to date so other founders can find and reach you.</p>
        </div>

        {isProfileIncomplete(member) && (
          <div className="alert-info" style={{ marginBottom: 20 }}>
            A few fields look empty — filling these in helps other members find and connect with you.
          </div>
        )}

        <div className="flow-card">
          <p className="fc-label">Mobile Number (can't be changed here)</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 14, marginBottom: 20, color: 'var(--ink-soft)' }}>
            {member.mobile}
          </p>

          <form onSubmit={handleSubmit}>
            {EDITABLE_FIELDS.map(f => (
              <div className="field" key={f.key}>
                <label>{f.label}</label>
                {f.textarea ? (
                  <textarea rows={2} value={form[f.key]} onChange={e => update(f.key, e.target.value)} />
                ) : (
                  <input type="text" value={form[f.key]} onChange={e => update(f.key, e.target.value)} />
                )}
              </div>
            ))}

            {error && <p style={{ color: 'var(--red)', fontSize: 12.5, marginBottom: 10 }}>{error}</p>}
            {saved && <p style={{ color: 'var(--green)', fontSize: 12.5, marginBottom: 10, fontWeight: 600 }}>✓ Saved</p>}

            <button type="submit" className="btn btn-primary full" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}