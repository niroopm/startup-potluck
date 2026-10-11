import { useEffect, useRef, useState } from 'react';
import { getActiveMilestone, } from '../lib/milestone.js';
import { getOrdinal } from '../lib/calendar.js';

const COLORS = ['#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899', '#facc15'];
const DISMISS_KEY = 'potluck:celebrationDismissed';

function ordinal(n) {
  if (n <= 5) return getOrdinal(n);
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function readDismissed() {
  try { return sessionStorage.getItem(DISMISS_KEY); } catch { return null; }
}

function ConfettiCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, raf, last = performance.now(), nextBurst = 0;
    const parts = [];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Popper: a cone of confetti shot up and inward from a bottom corner.
    function burst(fromLeft) {
      const x = fromLeft ? 0 : w;
      const base = fromLeft ? -Math.PI / 3 : (-2 * Math.PI) / 3;
      for (let i = 0; i < 70; i++) {
        const a = base + (Math.random() - 0.5) * 0.9;
        const speed = 9 + Math.random() * 11;
        parts.push({
          x, y: h, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed,
          size: 6 + Math.random() * 6, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
          color: COLORS[(Math.random() * COLORS.length) | 0], life: 0, round: Math.random() < 0.25
        });
      }
    }

    function frame(now) {
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;
      if (now > nextBurst) {
        burst(true); burst(false);
        nextBurst = now + 3500 + Math.random() * 2500;
      }
      ctx.clearRect(0, 0, w, h);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.vy += 0.28 * dt; p.vx *= 0.992; p.vy *= 0.992;
        p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.life += dt;
        if (p.y > h + 20 || p.life > 400) { parts.splice(i, 1); continue; }
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
        else ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}
    />
  );
}

export default function Celebration() {
  const preview = new URLSearchParams(window.location.search).get('confetti');
  const milestone = getActiveMilestone(new Date(), preview);
  const [dismissed, setDismissed] = useState(() => readDismissed() === String(milestone?.meet));

  if (!milestone || dismissed) return null;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function close() {
    try { sessionStorage.setItem(DISMISS_KEY, String(milestone.meet)); } catch { /* ignore */ }
    setDismissed(true);
  }

  return (
    <>
      {!reduceMotion && <ConfettiCanvas />}
      <div
        style={{
          position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 10000,
          background: 'var(--ink)', color: 'var(--paper)', borderRadius: 999, padding: '8px 10px 8px 18px',
          display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600,
          boxShadow: '0 4px 14px rgba(0,0,0,.25)', maxWidth: 'calc(100vw - 24px)'
        }}
      >
        <span>🎉 Celebrating our {ordinal(milestone.meet)} meet!</span>
        <button
          type="button" onClick={close} aria-label="Stop celebration"
          style={{ background: 'rgba(255,255,255,.18)', color: 'inherit', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', lineHeight: 1 }}
        >×</button>
      </div>
    </>
  );
}
