import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { sheetListMembers } from '../lib/sheet.js';
import { useAuth } from '../context/AuthContext.jsx';

const DEMO_MEMBERS = [
  {
    name: 'Jowhar', company: 'AgroLocal', role: 'Tech Founder', city: 'Rajahmundry', mobile: '9876543210',
    need: 'Fundraising / Angel Pitch Prep',
    intro: 'Building a farm-to-door delivery app connecting 500+ farmers directly to households across the Godavari belt, cutting out three layers of middlemen.',
    website: 'https://agrolocal.example.com', elite: 'Yes'
  }
  // Non-elite members are intentionally not shown here — this page is a
  // curated portfolio showcase. The full member directory (elite and not)
  // lives in the Admin page at /admin.
];

const COLORS = ['#6C3BFF', '#1E8A4C', '#B23A2E', '#4B21D6', '#8C6D1F', '#2A6C6C'];

function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

function colorFor(str) {
  if (!str) return COLORS[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function isElite(m) {
  return ['yes', 'true', '1'].includes(String(m.elite || '').trim().toLowerCase());
}

export default function Members() {
  const { member: loggedInMember } = useAuth();
  const [allMembers, setAllMembers] = useState(DEMO_MEMBERS);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    sheetListMembers().then(result => {
      if (cancelled) return;
      if (result.ok && result.members.length) {
        setAllMembers(result.members);
        setIsLive(true);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const eliteMembers = useMemo(() => allMembers.filter(isElite), [allMembers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return eliteMembers;
    return eliteMembers.filter(m => {
      const haystack = [m.name, m.company, m.role, m.city, m.mobile, m.need, m.intro]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [eliteMembers, query]);

  return (
    <section>
      <div className="max">
        <div className="flow-head">
          <div className="eyebrow center"><span className="dot"></span>⭐ Elite Portfolios</div>
          <h2 className="section-title">Community Members</h2>
          <p className="section-lede center">
            A curated showcase of standout founders in the Startup Potluck community — what they're building, and where they're stuck.
          </p>
        </div>

        {/* {!loading && !isLive && (
          <div className="alert-info" style={{ maxWidth: 640, margin: '0 auto 32px' }}>
            Showing sample members — connect a "list" action on your Google Apps Script backend
            (see <code>src/lib/sheet.js</code>) to make this directory live from your registration sheet.
          </div>
        )} */}

        {!loggedInMember && (
          <div className="alert-info" style={{ maxWidth: 640, margin: '0 auto 24px', textAlign: 'center' }}>
            🔒 <Link to="/login" style={{ fontWeight: 700, textDecoration: 'underline' }}>Log in</Link> to see members' contact numbers.
          </div>
        )}

        <div style={{ maxWidth: 480, margin: '0 auto 28px' }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Search Elite Members</label>
            <input
              type="text"
              placeholder="Search by name, company, location, contact, role, or what they're building..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <p style={{ fontSize: 11.5, color: 'var(--ink-faint)', marginTop: 8, textAlign: 'center' }}>
            {filtered.length} elite member{filtered.length === 1 ? '' : 's'} shown
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="alert-warn" style={{ maxWidth: 480, margin: '0 auto' }}>
            {query ? `No elite members match "${query}".` : 'No elite members yet — mark members as Elite from the Admin page.'}
          </div>
        ) : (
          <div className="grid cols-2">
            {filtered.map((m, i) => (
              <div key={m.mobile || m.name + i} className="member-card member-card-elite">
                <span className="member-elite-ribbon">⭐ ELITE MEMBER</span>

                <div className="member-card-top">
                  <div className="member-avatar" style={{ background: COLORS[i % COLORS.length] }}>
                    {initials(m.name)}
                  </div>
                  <div>
                    <p className="member-name">{m.name}</p>
                    <p className="member-role">{m.role}</p>
                  </div>
                </div>

                <div className="member-meta">
                  {m.company && (
                    <span className="member-chip member-company" style={{ background: colorFor(m.company) }}>
                      {m.company}
                    </span>
                  )}
                  {m.city && <span className="member-chip">📍 {m.city}</span>}
                  {m.need && <span className="member-chip">🎯 {m.need}</span>}
                </div>

                {m.intro && <p className="member-intro">{m.intro}</p>}

                {m.website && (
                  <a href={m.website.startsWith('http') ? m.website : `https://${m.website}`} target="_blank" rel="noopener noreferrer" className="member-website-link">
                    🔗 View Portfolio / Website
                  </a>
                )}

                <div className="member-contact">
                  {loggedInMember ? (
                    m.mobile ? (
                      <a href={`tel:${m.mobile}`} className="member-contact-link">📞 {m.mobile}</a>
                    ) : (
                      <span className="member-contact-locked">No contact on file</span>
                    )
                  ) : (
                    <span className="member-contact-locked">🔒 Log in to view contact</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
