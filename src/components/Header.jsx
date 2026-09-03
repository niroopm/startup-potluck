import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { usePwaInstall } from '../hooks/usePwaInstall.js';
import { isProfileIncomplete } from '../lib/profileCompleteness.js';

function GearIcon({ showDot }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
      {showDot && (
        <span style={{
          position: 'absolute', top: -3, right: -3, width: 7, height: 7,
          borderRadius: '50%', background: '#B23A2E', border: '1.5px solid #fff'
        }} />
      )}
    </span>
  );
}

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/rsvp', label: 'RSVP' },
  { to: '/events', label: 'Events' },
  { to: '/members', label: 'Members' },
  { to: '/register', label: 'Register' },
  { to: '/contact', label: 'Contact' }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { member, logout } = useAuth();
  const { canInstall, promptInstall } = usePwaInstall();

  return (
    <header>
      <div className="nav-inner">
        <NavLink to="/" className="logo" onClick={() => setOpen(false)}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <circle cx="13" cy="13" r="12" stroke="#6C3BFF" strokeWidth="1.4" opacity="0.35"/>
            <circle cx="13" cy="13" r="8" stroke="#6C3BFF" strokeWidth="1.4" opacity="0.6"/>
            <path d="M13 9v8" stroke="#6C3BFF" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <div className="logo-text-wrap">
            <span>Startup Potluck</span>
            <span className="mobile-sub">by Dr. M Johar Krishna</span>
          </div>
        </NavLink>

        <nav className="links">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-cta" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {canInstall && (
            <button className="btn btn-ghost small" onClick={promptInstall}>Install App</button>
          )}
          {member ? (
            <>
              <NavLink
                to="/profile"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  fontSize: 13, color: 'var(--ink)', fontWeight: 600,
                  padding: '7px 12px', borderRadius: 999,
                  border: '1.5px solid var(--rule)', background: '#fff'
                }}
              >
                <GearIcon showDot={isProfileIncomplete(member)} />
                Hi, {member.name?.split(' ')[0]}
              </NavLink>
              <button className="btn btn-ghost small" onClick={logout}>Log out</button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-accent small">Login</NavLink>
          )}
        </div>

        <button className="menu-toggle" aria-label="Toggle menu" onClick={() => setOpen(o => !o)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      <div className={`mobile-menu${open ? ' open' : ''}`}>
        {LINKS.map(l => (
          <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}>{l.label}</NavLink>
        ))}
        {member ? (
          <>
            <NavLink to="/profile" onClick={() => setOpen(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <GearIcon showDot={isProfileIncomplete(member)} />
              My Profile
            </NavLink>
            <button className="btn btn-ghost small full" onClick={() => { logout(); setOpen(false); }}>Log out</button>
          </>
        ) : (
          <NavLink to="/login" className="btn btn-accent small full" onClick={() => setOpen(false)}>Login</NavLink>
        )}
        {canInstall && (
          <button className="btn btn-ghost small full" onClick={() => { promptInstall(); setOpen(false); }}>Install App</button>
        )}
      </div>
    </header>
  );
}