import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { usePwaInstall } from '../hooks/usePwaInstall.js';

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
              <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Hi, {member.name?.split(' ')[0]}</span>
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
          <button className="btn btn-ghost small full" onClick={() => { logout(); setOpen(false); }}>Log out</button>
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
