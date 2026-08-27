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

const MEETING_RULES = [
  'First 30 Min Networking',
  'No Handouts During Meet',
  'Phones on Silent Mode',
  'No Food/Water During Active Session',
  'Zero Disturbance Policy',
  'Post-Meet Networking',
  'Financial Transactions Disclaimer',
  'Civic Sense & Clean Walkways',
  'Zero Negativity Tolerance'
];

const WHATSAPP_RULES = [
  'Group Eligibility (3 Meets)',
  'Active Attendance Criteria',
  'Consistent Participation',
  'No Financial Liabilities',
  'Prior Absence Intimation',
  'Quality Guest Invites'
];

const CORE_OBJECTIVES = [
  { t: '1. Ecosystem Building', d: 'Foster peer networking & scale high-growth startups directly from Rajahmundry.' },
  { t: '2. Student Incubation', d: 'Partner with colleges to turn student ideas into viable businesses through bootcamps.' },
  { t: '3. Access to Capital', d: 'Connect homegrown founders with angel investors, mentors, and pitch clinics.' },
  { t: '4. Collaborative Solving', d: 'Host regular Sunday potlucks to review problem tickets and share real-world learnings.' }
];

const PARTNERS = [
  {
    ribbon: 'TECH PARTNER', ribbonColor: 'var(--purple-deep)',
    avatarBg: 'linear-gradient(135deg,#1C1A16,#4B21D6)', initials: 'HL',
    name: 'HelloLocal', role: 'Technology Partner',
    blurb: 'Powering the digital infrastructure and community platform for Rajahmundry builders.',
    website: 'https://hellolocal.me',
    instagram: 'https://www.instagram.com/hellolocal.me?igsh=MWIyYmw3OWtvb2JlZQ=='
  },
  {
    ribbon: 'DIGITAL PARTNER', ribbonColor: 'var(--green)',
    avatarBg: 'linear-gradient(135deg,#1E8A4C,#6C3BFF)', initials: 'AD',
    name: 'ARANEA DEN', role: 'Digital Media Partner',
    blurb: 'Managing media, content creation, and weekly digital coverage for the potluck meetups.',
    website: 'https://hellolocal.me',
    instagram: 'https://www.instagram.com/entrepreneur_summit_rjy'
  }
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

      {/* ============================= RULES & ETIQUETTE ============================= */}
      <section id="rules">
        <div className="max">
          <div className="flow-head">
            <div className="eyebrow center"><span className="dot"></span>Community Guidelines</div>
            <h2 className="section-title">House Rules & Etiquette</h2>
            <p className="section-lede center" style={{ marginTop: 8 }}>
              To keep the table productive, honest, and valuable for everyone.
            </p>
          </div>

          <div style={{ marginBottom: 48 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--purple)', marginBottom: 16, fontWeight: 600 }}>
              📍 Meeting Room Etiquette
            </p>
            <div className="card kraft" style={{ padding: 16 }}>
              <div className="grid cols-3" style={{ gap: 12 }}>
                {MEETING_RULES.map((r, i) => (
                  <div key={r} className="card" style={{ padding: 14, borderColor: 'var(--rule)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--purple)', fontWeight: 700, fontSize: 12 }}>{String(i + 1).padStart(2, '0')}</span>
                    <h4 style={{ fontSize: 13.5, fontWeight: 600 }}>{r}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--purple)', marginBottom: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1E8A4C">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              WhatsApp Group Etiquette
            </p>
            <div className="card kraft" style={{ padding: 16 }}>
              <div className="grid cols-3" style={{ gap: 12 }}>
                {WHATSAPP_RULES.map((r, i) => (
                  <div key={r} className="card" style={{ padding: 14, borderColor: 'var(--rule)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--purple)', fontWeight: 700, fontSize: 12 }}>{String(i + 1).padStart(2, '0')}</span>
                    <h4 style={{ fontSize: 13.5, fontWeight: 600 }}>{r}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>

          
          <div className="card" style={{ padding: 28, marginTop: 50, background: '#fff', border: '1.5px solid var(--ink)' }}>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--purple)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Strategic Roadmap</p>
              <h3 style={{ fontSize: 20, color: 'var(--ink)' }}>🎯 5 Core Objectives</h3>
            </div>

            <div className="grid cols-2" style={{ gap: 12 }}>
              {CORE_OBJECTIVES.map(o => (
                <div key={o.t} style={{ background: 'var(--paper)', padding: 14, borderRadius: 10, border: '1px solid var(--rule)' }}>
                  <h4 style={{ fontSize: 13.5, color: 'var(--ink)', marginBottom: 4 }}>{o.t}</h4>
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.4 }}>{o.d}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--paper)', padding: 14, borderRadius: 10, border: '1px solid var(--rule)', marginTop: 12 }}>
              <h4 style={{ fontSize: 13.5, color: 'var(--ink)', marginBottom: 4 }}>5. Regional Economic Impact</h4>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.4 }}>Solve Godavari-regional challenges (agritech, tourism, retail) and create local jobs.</p>
            </div>
          </div>
          
        </div>
      </section>

    {/* ============================= ABOUT FOUNDER ============================= */}
      <section id="about" className="compact-section" style={{ background: 'var(--paper-deep)' }}>
        <div className="max" style={{ maxWidth: 860 }}>
          <div className="flow-head" style={{ textAlign: 'left', marginBottom: 20 }}>
            <div className="eyebrow"><span className="dot"></span>About the Founder</div>
            <h2 className="section-title">Driven by Community, Built for Rajahmundry</h2>
          </div>

          <div className="card" style={{ padding: 32, background: '#fff', border: '1.5px solid var(--ink)', marginBottom: 24 }}>
            {/* alignItems changed to 'center' */}
            <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flexShrink: 0, textAlign: 'center', width: '100%', maxWidth: 200, margin: '0 auto' }}>
                <div style={{ width: 96, height: 96, borderRadius: '50%', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, background: 'linear-gradient(135deg,#6C3BFF,#9B6BFF)', color: '#fff', boxShadow: '4px 4px 0 var(--purple-wash)' }}>MJ</div>
                <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>Dr. M Johar Krishna</p>
                <p style={{ fontSize: 11, color: 'var(--purple)', fontFamily: 'var(--font-mono)', fontWeight: 600, textTransform: 'uppercase', marginTop: 2, marginBottom: 10 }}>Founder & Community Lead</p>

                <div className="tag-list" style={{ justifyContent: 'center' }}>
                  <span className="tag-item">Tourism & Hospitality Faculty</span>
                  <span className="tag-item">PhD in Tourism & Hospitality</span>
                  <span className="tag-item">Organizer of Moditha</span>
                  <span className="tag-item">Godavari Glamour Gala</span>
                  <span className="tag-item">Rajahmundry Entrepreneur Summit 25</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 12 }}>
                  <a href="https://www.instagram.com/dr.joharkrishna?utm_source=qr&igsh=dHM1bXM1d2VuOWZt" target="_blank" rel="noopener noreferrer" title="Instagram">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6C3BFF" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.3" cy="6.7" r="1.1" fill="#6C3BFF" stroke="none"/>
                    </svg>
                  </a>
                  <a href="https://hellolocal.me" target="_blank" rel="noopener noreferrer" title="Website">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6C3BFF" strokeWidth="2">
                      <circle cx="12" cy="12" r="9"/>
                      <path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Text column centered vertically */}
              <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: 22, marginBottom: 12, color: 'var(--ink)' }}>Connecting Local Builders Over a Shared Table</h3>
                <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', marginBottom: 16, lineHeight: 1.6 }}>
                  Dr. M Johar Krishna founded <strong>Startup Potluck</strong> to give Rajahmundry's entrepreneurs, developers, designers, and students a dedicated space to gather, collaborate, and grow.
                </p>
                <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', margin: 0, lineHeight: 1.6 }}>
                  By replacing formal pitch decks with shared food and open conversations, Dr. Johar Krishna has cultivated a weekly ritual focused on genuine mentorship, civic responsibility, and mutual support—helping turn individual ideas into sustainable local ventures.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================= PARTNERS ============================= */}
      <section id="partners" className="compact-section" style={{ background: 'var(--paper-deep)', textAlign: 'center', paddingTop: 0 }}>
        <div className="max">
          <div className="flow-head" style={{ marginBottom: 24 }}>
            <div className="eyebrow center"><span className="dot"></span>Backed by</div>
            <h2 className="section-title">Our Partners</h2>
            <p className="section-lede center" style={{ marginTop: 6 }}>The teams powering the digital side of Startup Potluck.</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
            {PARTNERS.map(p => (
              <div key={p.name} className="badge" style={{ maxWidth: 320, width: '100%' }}>
                <span className="ribbon" style={{ background: p.ribbonColor }}>{p.ribbon}</span>
                <div className="avatar" style={{ background: p.avatarBg }}>{p.initials}</div>
                <p style={{ fontWeight: 600 }}>{p.name}</p>
                <p style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{p.role}</p>
                <p style={{ fontSize: 11.5, color: 'var(--ink-faint)', fontStyle: 'italic', marginTop: 10, paddingTop: 10, borderTop: '1px dotted var(--rule)', textAlign: 'center' }}>
                  {p.blurb}
                </p>
                <div className="socials">
                  <a href={p.website} target="_blank" rel="noopener noreferrer" title="Website">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6C3BFF" strokeWidth="2">
                      <circle cx="12" cy="12" r="9"/>
                      <path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9z"/>
                    </svg>
                  </a>
                  <a href={p.instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6C3BFF" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.3" cy="6.7" r="1.1" fill="#6C3BFF" stroke="none"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </>
  );
}
