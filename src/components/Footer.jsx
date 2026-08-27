export default function Footer() {
  return (
    <footer>
      <div className="max foot-grid">
        <div>
          <div className="logo" style={{ color: 'var(--paper)', marginBottom: 10 }}>Startup Potluck</div>
          <p style={{ fontSize: 13, color: 'rgba(250,246,236,.6)', maxWidth: 260 }}>
            Let's Build Something Amazing Together at Rajahmundry
          </p>
          <div className="hl-card">
            <p style={{ fontSize: 12, color: 'rgba(250,246,236,.6)', marginBottom: 6 }}>
              Founded by Dr. M Johar Krishna, in association with
            </p>
            <a href="https://hellolocal.me" target="_blank" rel="noopener noreferrer">🎟 HelloLocal — Rajahmundry ↗</a>
          </div>
        </div>
        
        <div>
          <h5>Quick Links</h5>
          <a className="flink" href="/">Home</a>
          <a className="flink" href="/events">RSVP</a>
          <a className="flink" href="/members">Members</a>
          <a className="flink" href="/register">Register</a>
        </div>
        
        <div>
          <h5>Connect</h5>
          <a 
            href="mailto:potluck@hellolocal.me" 
            className="flink" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6C3BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span>potluck@hellolocal.me</span>
          </a>
          
          <a 
            href="https://www.instagram.com/entrepreneur_summit_rjy" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flink" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6C3BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>entrepreneur_summit_rjy</span>
          </a>
        </div>
        
        <div>
          <h5>Location & Timings</h5>
          <span className="flink">🌳 NTR Park: 1st & 3rd Sundays @ 5:00 PM</span>
          <span className="flink">🚪 Closed-Door: 2nd & 4th Sundays @ 10:30 AM</span>
        </div>
      </div>
      
      <div 
        className="max" 
        style={{ 
          marginTop: 36, 
          paddingTop: 20, 
          borderTop: '1px solid rgba(250,246,236,.12)', 
          fontSize: 12, 
          color: 'rgba(250,246,236,.5)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <span>© {new Date().getFullYear()} Startup Potluck. Built by founders, for founders.</span>
        <span>
          Developed & maintained by{' '}
          <a 
            href="https://hellolocal.me" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: 'var(--purple)', fontWeight: 600, textDecoration: 'none' }}
          >
            HelloLocal
          </a>{' '}
          with ❤️ for startups
        </span>
      </div>
    </footer>
  );
}