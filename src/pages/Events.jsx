import { useEffect, useState } from 'react';
import { getEvents } from '../lib/events.js';


const DEMO_EVENTS = [
  {
    title: 'Rajahmundry Entrepreneur Summit 25',
    description: 'Beyond the weekly Sunday table — our flagship summit brings founders, investors and students from across the Godavari region together for a full day of pitches, panels and networking.',
    image: '', ticket_url: 'https://www.instagram.com/entrepreneur_summit_rjy',
    is_free: 1, event_status: 'upcoming', venue: 'TBA', city: 'Rajahmundry'
  }
];

function formatDateRange(ev) {
  if (!ev.start_datetime) return '';
  try {
    const start = new Date(ev.start_datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return start;
  } catch {
    return '';
  }
}

export default function Events() {
  const [events, setEvents] = useState(DEMO_EVENTS);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getEvents({ upcoming: 1 }).then(result => {
      if (cancelled) return;
      if (result.ok) {
        setEvents(result.events);
        setIsLive(true);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <section>
      <div className="max" style={{ maxWidth: 900 }}>
        <div className="flow-head">
          <div className="eyebrow center"><span className="dot"></span>Beyond the Sunday Table</div>
          <h2 className="section-title">Events</h2>
          <p className="section-lede center">
            Special one-off events from Startup Potluck — shared with HelloLocal, so it's always current.
          </p>
        </div>

        {!loading && !isLive && (
          <div className="alert-info" style={{ maxWidth: 640, margin: '0 auto 32px' }}>
            Showing sample events — connect the real Events API in <code>src/lib/events.js</code> to make this page live.
          </div>
        )}

        {events.length === 0 ? (
          <div className="alert-warn" style={{ maxWidth: 480, margin: '0 auto' }}>
            No events scheduled right now — check back soon, or see the weekly Sunday table on the RSVP page.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {events.map((ev, i) => (
              <div key={ev.slug || ev.title || i} className="featured-event-banner">
                <div
                  className="featured-event-media"
                  style={ev.image ? { backgroundImage: `url(${ev.image})` } : {}}
                >
                  {!ev.image && (
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
                    </svg>
                  )}
                </div>
                <div className="featured-event-body">
                  <div className="eyebrow">
                    <span className="dot"></span>
                    {ev.event_status ? ev.event_status.toUpperCase() : 'EVENT'}
                  </div>
                  <h3 style={{ fontSize: 22, marginBottom: 8 }}>{ev.title}</h3>
                  <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, maxWidth: 560 }}>{ev.description}</p>
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginTop: 16 }}>
                    {ev.ticket_url && (
                      <a href={ev.ticket_url} target="_blank" rel="noopener noreferrer" className="btn btn-accent small">
                        {ev.is_free ? 'Learn More' : 'Get Tickets'}
                      </a>
                    )}
                    <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>
                      {formatDateRange(ev)}{ev.venue ? ` · ${ev.venue}` : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
