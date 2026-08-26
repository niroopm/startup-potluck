import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sheetPost } from '../lib/sheet.js';
import { useAuth } from '../context/AuthContext.jsx';

const NEEDS = [
  'Mentorship & Guidance',
  'Finding Co-founder / Tech Talent',
  'Early Customer Feedback / Beta Users',
  'Fundraising / Angel Pitch Prep',
  'Open Networking & Knowledge Sharing',
  'Legal & Business Compliance'
];

const initialForm = {
  name: '', mobile: '', email: '', company: '', role: '',
  need: NEEDS[0], problem: '', city: '', instagram: '', website: ''
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !/^\d{7,15}$/.test(form.mobile.trim())) {
      setError('Please enter your name and a valid mobile number.');
      return;
    }
    setSubmitting(true);
    const record = {
      name: form.name.trim(),
      mobile: form.mobile.trim(),
      email: form.email.trim(),
      company: form.company.trim(),
      role: form.role.trim(),
      needFromCommunity: form.need,
      startupProblemTicket: form.problem.trim(),
      problemStatus: 'Active / Open',
      city: form.city.trim(),
      instagram: form.instagram.trim(),
      website: form.website.trim(),
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    try {
      const result = await sheetPost({ type: 'registration', ...record });
      if (!result.ok) {
        localStorage.setItem('member:' + record.mobile, JSON.stringify(record));
      }
      login(record);
      setDone(true);
    } catch {
      setError('Something went wrong saving your registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <div className="max" style={{ maxWidth: 640 }}>
        <div className="flow-head">
          <span style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>01 —</span>{' '}
          <h2 style={{ display: 'inline' }}>
            New Member Registration{' '}
            <span style={{ color: 'var(--ink-faint)', textTransform: 'none', fontFamily: 'var(--font-body)', fontWeight: 400 }}>
              (one time only)
            </span>
          </h2>
        </div>

        {!done ? (
          <div className="flow-card">
            <p className="fc-label">Join the Founder Table</p>
            <form onSubmit={handleSubmit}>
              <div className="field"><label>Full Name</label><input type="text" required placeholder="Rahul Sharma" value={form.name} onChange={e => update('name', e.target.value)} /></div>
              <div className="field"><label>Mobile Number</label><input type="tel" required placeholder="9876543210" value={form.mobile} onChange={e => update('mobile', e.target.value)} /></div>
              <div className="field"><label>Email</label><input type="email" placeholder="rahul@gmail.com" value={form.email} onChange={e => update('email', e.target.value)} /></div>

              <div className="field-row">
                <div className="field"><label>Startup / Company</label><input type="text" placeholder="e.g. AgroLocal" value={form.company} onChange={e => update('company', e.target.value)} /></div>
                <div className="field"><label>Role / Profession</label><input type="text" placeholder="e.g. Tech Founder / Dev" value={form.role} onChange={e => update('role', e.target.value)} /></div>
              </div>

              <div className="field">
                <label>What are you looking for from this community?</label>
                <select value={form.need} onChange={e => update('need', e.target.value)}>
                  {NEEDS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div className="field">
                <label>Current Startup Hurdle / Where are you stuck? (Problem Ticket)</label>
                <textarea rows={2} placeholder="e.g. Struggling with customer retention / Need funding..." value={form.problem} onChange={e => update('problem', e.target.value)} />
              </div>

              <div className="field-row">
                <div className="field"><label>City</label><input type="text" placeholder="Rajahmundry" value={form.city} onChange={e => update('city', e.target.value)} /></div>
                <div className="field"><label>Instagram</label><input type="text" placeholder="@yourhandle" value={form.instagram} onChange={e => update('instagram', e.target.value)} /></div>
              </div>
              <div className="field"><label>Website / App</label><input type="text" placeholder="yourstartup.com" value={form.website} onChange={e => update('website', e.target.value)} /></div>

              {error && <p style={{ color: 'var(--red)', fontSize: 12.5, marginBottom: 10 }}>{error}</p>}
              <button type="submit" className="btn btn-primary full" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            </form>
          </div>
        ) : (
          <div className="flow-card" style={{ textAlign: 'center', maxWidth: 420, margin: '0 auto' }}>
            <div className="stamp">✓ok</div>
            <h3 style={{ fontSize: 17, marginBottom: 6 }}>Welcome to the Table 🎉</h3>
            <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 14 }}>
              Your profile & startup problem ticket have been registered. You're ready to RSVP weekly!
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/events" className="btn btn-accent small">RSVP This Sunday</Link>
              <button className="btn btn-ghost small" onClick={() => navigate('/')}>Go Home</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
