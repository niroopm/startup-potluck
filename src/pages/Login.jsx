import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sheetGet } from '../lib/sheet.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [checking, setChecking] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleCheck(e) {
    e.preventDefault();
    setNotFound(false);
    if (!/^\d{7,15}$/.test(mobile.trim())) { setNotFound(true); return; }
    setChecking(true);
    try {
      let found = null;
      const result = await sheetGet(mobile.trim());
      if (result.found) {
        found = result;
      } else if (result.reason === 'no-endpoint') {
        const saved = localStorage.getItem('member:' + mobile.trim());
        if (saved) found = JSON.parse(saved);
      }
      if (found) {
        login(found);
        navigate('/events');
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setChecking(false);
    }
  }

  return (
    <section>
      <div className="max" style={{ maxWidth: 420 }}>
        <div className="flow-head">
          <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'none', fontSize: 'clamp(1.8rem,3.4vw,2.2rem)', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            Welcome back
          </h2>
        </div>
        <div className="flow-card">
          <p className="fc-label">Log In With Your Mobile Number</p>
          <form onSubmit={handleCheck}>
            <div className="field">
              <label>Mobile Number</label>
              <input type="tel" placeholder="9876543210" value={mobile} onChange={e => setMobile(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary full" disabled={checking}>
              {checking ? 'Checking...' : 'Log In'}
            </button>
          </form>
          <p style={{ fontSize: 11.5, color: 'var(--ink-faint)', marginTop: 12 }}>🔒 Only registered members can log in</p>
          {notFound && (
            <div style={{ marginTop: 14 }}>
              <div className="alert-warn">This mobile number isn't registered yet.</div>
              <Link to="/register" className="btn btn-ghost small full" style={{ marginTop: 10 }}>Register First</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
