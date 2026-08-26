import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUpcomingSundayDetails, getOrdinal } from '../lib/calendar.js';

function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    let start;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setValue(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

const HOW_STEPS = [
  { n: '01', t: 'Register & Profile', d: 'Log your startup & skills.' },
  { n: '02', t: 'Post Problem Ticket', d: "Share where you're stuck." },
  { n: '03', t: '1st & 3rd Wks Outdoor', d: 'Free open-air @ NTR Park (5:00 PM).' },
  { n: '04', t: '2nd & 4th Wks Indoor', d: 'Closed-door sessions @ 10:30 AM.' },
  { n: '05', t: 'Brainstorm Solutions', d: 'Solve blockers together.' },
  { n: '06', t: 'Track Progress', d: 'Scale with the community.' }
];

export default function Home() {
  const info = getUpcomingSundayDetails();
  const members = useCountUp(125);
  const meetups = useCountUp(20);
  const founders = useCountUp(2);
  const ideas = useCountUp(74);

  return (
    <>
      <section className="hero">
        <div className="max hero-grid">
          <div>
            <div className="eyebrow"><span className="dot"></span>Weekly Founder Ritual · Rajahmundry</div>
            <h1>Connect. Share.<br/>Eat. <span className="accent">Build.</span></h1>
            <p className="lede">
              A weekly startup potluck — <strong>1st & 3rd Sundays outdoors @ 5:00 PM</strong> at NTR Park (Free)
              and <strong>2nd & 4th Sundays indoors @ 10:30 AM</strong> (Closed-Door Sessions) where founders meet to learn and grow.
            </p>
            <div className="hero-ctas">
              <Link to="/register" className="btn btn-primary">Get Your Ticket</Link>
              <Link to="/events" className="btn btn-ghost">RSVP This Sunday</Link>
            </div>
          </div>

          <div className="ticket-wrap">
            <div className={`ticket${info.isOutdoor ? ' outdoor-ticket' : ''}`}>
              <div className="ticket-main">
                <div className="t-eyebrow">{info.isOutdoor ? 'OUTDOOR PARK TICKET' : 'CLOSED-DOOR TICKET'}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                  <h3 style={{ margin: 0 }}>{info.isOutdoor ? <>Park<br/>Potluck</> : <>Closed-Door<br/>Potluck</>}</h3>
                  <div className="ticket-icon-box">
                    {info.isOutdoor ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E8A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19V5"/><path d="M5 12l7-7 7 7"/><path d="M5 19h14"/>
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C3BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 20V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"/><path d="M6 20h12"/><path d="M14 12v.01"/>
                      </svg>
                    )}
                  </div>
                </div>
                <div className="ticket-fields" style={{ marginTop: 14 }}>
                  <div><span>DATE</span><strong>{info.dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong></div>
                  <div><span>TIME</span><strong>{info.isOutdoor ? '5:00 PM' : '10:30 AM'}</strong></div>
                  <div><span>VENUE</span><strong>{info.isOutdoor ? 'NTR Park' : 'Insta Intimation ↗'}</strong></div>
                  <div><span>FORMAT</span><strong>{info.isOutdoor ? 'Free Entry' : '₹150 Pass'}</strong></div>
                </div>
              </div>
              <div className="ticket-divider"></div>
              <div className="ticket-stub">
                <span className="stub-no">№ 001</span>
                <span className="stub-vert">RSVP →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '20px 0 40px' }}>
        <div className="max">
          <div className="stats-grid">
            <div className="stat-card"><span className="stat-badge">Community</span><b>{members}</b><span>Registered Members</span></div>
            <div className="stat-card"><span className="stat-badge">Ritual</span><b>{meetups}</b><span>Weekly Meetups</span></div>
            <div className="stat-card"><span className="stat-badge">Network</span><b>{founders}</b><span>Active Founders</span></div>
            <div className="stat-card"><span className="stat-badge">Impact</span><b>{ideas}</b><span>Ideas Discussed</span></div>
          </div>
        </div>
      </section>

      <section>
        <div className="max">
          <div className="flow-head">
            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'none', fontSize: 'clamp(1.8rem,3.4vw,2.4rem)', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
              How the Sunday works
            </h2>
          </div>
          <div className="grid cols-3">
            {HOW_STEPS.map(s => (
              <div key={s.n} className="pin-card card" style={{ textAlign: 'center', padding: '20px 14px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--purple)', fontSize: 12, marginBottom: 8 }}>{s.n}</div>
                <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{s.t}</p>
                <p style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>{s.d}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 36, border: '1.5px dashed var(--rule)', borderRadius: 14, padding: '26px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 15 }}>Let's build something amazing together.</p>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Good food. Great people. Bigger ideas.</p>
            </div>
            <Link to="/events" className="btn btn-accent">RSVP This Sunday</Link>
          </div>
        </div>
      </section>
    </>
  );
}
