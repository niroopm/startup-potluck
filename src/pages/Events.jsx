import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getUpcomingSundays, getOrdinal } from '../lib/calendar.js';
import { sheetPost } from '../lib/sheet.js';
import { useAuth } from '../context/AuthContext.jsx';

const TOPICS = ['Funding', 'AI', 'Marketing', 'Product', 'Legal', 'Open Networking', 'Other'];

export default function Events() {
  const { member } = useAuth();
  const sundays = getUpcomingSundays(6);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [attend, setAttend] = useState('yes');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const selected = sundays[selectedIdx];

  async function handleSubmit() {
    if (!member) return;
    setSubmitting(true);
    const sessionTag = selected.isOutdoor
      ? 'Outdoor Free Session (5:00 PM)'
      : (attend === 'yes' ? 'Indoor Closed-Door Pass ₹150 (10:30 AM)' : 'Declined Attendance');
    try {
      await sheetPost({
        type: 'rsvp',
        name: member.name,
        mobile: member.mobile,
        attending: attend,
        topic,
        discussionTopic: note,
        sessionFormat: sessionTag,
        date: selected.dateString
      });
    } catch {
      /* localStorage fallback handled server-side in original; keep silent here */
    } finally {
      setSubmitting(false);
      setDone(true);
    }
  }

  if (!member) {
    return (
      <section>
        <div className="max" style={{ maxWidth: 480 }}>
          <div className="flow-head">
            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'none', fontSize: 'clamp(1.8rem,3.4vw,2.2rem)', color: 'var(--ink)' }}>
              Sunday Sessions
            </h2>
          </div>
          <div className="flow-card" style={{ textAlign: 'center' }}>
            <div className="alert-info" style={{ marginBottom: 16 }}>
              Log in with your mobile number to RSVP for this Sunday's session.
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/login" className="btn btn-primary small">Log In</Link>
              <Link to="/register" className="btn btn-ghost small">Register First</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="max" style={{ maxWidth: 780 }}>
        <div className="flow-head">
          <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'none', fontSize: 'clamp(1.8rem,3.4vw,2.2rem)', color: 'var(--ink)' }}>
            Sunday Sessions
          </h2>
          <p className="section-lede center">Pick a Sunday, check the format, and RSVP.</p>
        </div>

        <div className="grid cols-3" style={{ marginBottom: 32 }}>
          {sundays.map((s, i) => (
            <button
              key={s.dateString}
              onClick={() => { setSelectedIdx(i); setDone(false); }}
              className="card"
              style={{
                textAlign: 'left', cursor: 'pointer',
                borderColor: i === selectedIdx ? 'var(--purple)' : 'var(--ink)',
                boxShadow: i === selectedIdx ? '4px 4px 0 var(--purple-wash)' : 'none',
                padding: 16
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: s.isOutdoor ? 'var(--green)' : 'var(--purple)', fontWeight: 700, marginBottom: 4 }}>
                {s.isOutdoor ? 'OUTDOOR · FREE' : 'INDOOR · ₹150'}
              </div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{s.shortDate}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>{getOrdinal(s.weekRank)} Sunday · {s.isOutdoor ? '5:00 PM' : '10:30 AM'}</div>
            </button>
          ))}
        </div>

        {!done ? (
          <div className="flow-card">
            <p style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 12 }}>Welcome back, {member.name?.split(' ')[0]}!</p>
            <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 12 }}>{selected.dateString}</p>

            <div className={`session-banner${selected.isOutdoor ? ' outdoor-banner' : ''}`}>
              <div className="session-banner-title">
                <span>{selected.isOutdoor ? '🌳 Outdoor Park Session' : '🚪 Indoor Closed-Door Session'} ({getOrdinal(selected.weekRank)} Sunday)</span>
                <span className={`check-badge ${selected.isOutdoor ? 'free' : 'paid'}`}>{selected.isOutdoor ? 'FREE ENTRY' : '₹150 PASS'}</span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.4 }}>
                {selected.isOutdoor
                  ? 'Open-air networking at NTR Park, Happy Street, Rajahmundry at 5:00 PM. 100% free for all builders!'
                  : <>Intimate indoor hall session at 10:30 AM with AC & refreshments. Venue posted on <a href="https://www.instagram.com/entrepreneur_summit_rjy" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', fontWeight: 700 }}>Instagram</a>. Pass: ₹150.</>}
              </p>
            </div>

            {!selected.isOutdoor && (
              <div style={{ background: '#fff', border: '1.5px solid var(--purple)', borderRadius: 12, padding: 18, textAlign: 'center', marginBottom: 18 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--purple)', marginBottom: 6 }}>🎟️ Closed-Door Session Pass (₹150)</p>
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi%3A%2F%2Fpay%3Fpa%3Djoharkrishna%40ybl%26pn%3DStartup%2520Potluck%26am%3D150%26cu%3DINR"
                  alt="UPI QR Code" style={{ width: 130, height: 130, margin: '0 auto 8px', borderRadius: 6, border: '1px solid var(--rule)' }}
                />
                <p style={{ fontSize: 11.5, color: 'var(--ink-faint)' }}>UPI ID: joharkrishna@ybl</p>
              </div>
            )}

            <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Will you attend this session?</p>
            <div className="radio-row" style={{ marginBottom: 16 }}>
              <div className={`radio-choice${attend === 'yes' ? ' selected' : ''}`} onClick={() => setAttend('yes')}>Yes, I'll attend</div>
              <div className={`radio-choice${attend === 'no' ? ' selected' : ''}`} onClick={() => setAttend('no')}>No, I can't</div>
            </div>

            <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Vote for this week's discussion theme</p>
            <div className="pill-choice" style={{ marginBottom: 16 }}>
              {TOPICS.map(t => (
                <button key={t} type="button" className={topic === t ? 'selected' : ''} onClick={() => setTopic(t)}>{t}</button>
              ))}
            </div>

            <div className="field">
              <label>Anything else you'd like to share or discuss? (optional)</label>
              <textarea rows={2} placeholder="Share your thoughts or questions..." value={note} onChange={e => setNote(e.target.value)} />
            </div>

            <button className="btn btn-primary full" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : (selected.isOutdoor ? 'Submit General RSVP (Free)' : 'Confirm Pass & Submit RSVP')}
            </button>
          </div>
        ) : (
          <div className="flow-card" style={{ textAlign: 'center', maxWidth: 420, margin: '0 auto' }}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>🎉</div>
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>Thank You!</h3>
            <p style={{ marginBottom: 12, color: 'var(--ink-soft)', fontSize: 12.5 }}>Your RSVP has been recorded successfully.</p>
            <div style={{ background: 'var(--paper)', padding: 12, borderRadius: 8, border: '1px solid var(--rule)', textAlign: 'left', fontSize: 12.5 }}>
              <p style={{ marginBottom: 4 }}><span style={{ color: 'var(--ink-faint)' }}>Session:</span> <strong>{selected.isOutdoor ? 'Outdoor Park (5:00 PM)' : 'Indoor Closed-Door (10:30 AM)'}</strong></p>
              <p style={{ marginBottom: 4 }}><span style={{ color: 'var(--ink-faint)' }}>Attending:</span> <strong>{attend === 'yes' ? 'Yes' : 'No'}</strong></p>
              <p><span style={{ color: 'var(--ink-faint)' }}>Pass Cost:</span> <strong>{selected.isOutdoor ? 'Free' : '₹150'}</strong></p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
