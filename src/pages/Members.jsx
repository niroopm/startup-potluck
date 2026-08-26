import { useEffect, useState } from 'react';
import { sheetListMembers } from '../lib/sheet.js';

const DEMO_MEMBERS = [
  { name: 'Rahul Sharma', company: 'AgroLocal', role: 'Tech Founder', need: 'Fundraising / Angel Pitch Prep' },
  { name: 'Priya Menon', company: 'StitchWorks', role: 'Product Designer', need: 'Finding Co-founder / Tech Talent' },
  { name: 'Kiran Babu', company: 'TownCart', role: 'Full-Stack Dev', need: 'Early Customer Feedback / Beta Users' },
  { name: 'Sneha Reddy', company: 'EduNest', role: 'Founder', need: 'Mentorship & Guidance' },
  { name: 'Arjun Varma', company: 'Freelance', role: 'Growth Marketer', need: 'Open Networking & Knowledge Sharing' },
  { name: 'Divya Rao', company: 'LegalEase', role: 'Compliance Consultant', need: 'Legal & Business Compliance' }
];

const COLORS = ['#6C3BFF', '#1E8A4C', '#B23A2E', '#4B21D6', '#8C6D1F', '#2A6C6C'];

function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

export default function Members() {
  const [members, setMembers] = useState(DEMO_MEMBERS);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    sheetListMembers().then(result => {
      if (cancelled) return;
      if (result.ok && result.members.length) {
        setMembers(result.members);
        setIsLive(true);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <section>
      <div className="max">
        <div className="flow-head">
          <div className="eyebrow center"><span className="dot"></span>The Founder Table</div>
          <h2 className="section-title">Community Members</h2>
          <p className="section-lede center">Founders, developers, designers and students building in Rajahmundry.</p>
        </div>

        {!loading && !isLive && (
          <div className="alert-info" style={{ maxWidth: 640, margin: '0 auto 32px' }}>
            Showing sample members — connect a "list" action on your Google Apps Script backend
            (see <code>src/lib/sheet.js</code>) to make this directory live from your registration sheet.
          </div>
        )}

        <div className="grid cols-3">
          {members.map((m, i) => (
            <div key={m.mobile || m.name + i} className="card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div className="badge-avatar" style={{ background: COLORS[i % COLORS.length] }}>
                {initials(m.name)}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14.5 }}>{m.name}</p>
                <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>{m.role}{m.company ? ` · ${m.company}` : ''}</p>
                {m.need && (
                  <div className="tag-list">
                    <span className="tag-item">{m.need}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
