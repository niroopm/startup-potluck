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
          <a className="flink" href="/events">Events</a>
          <a className="flink" href="/members">Members</a>
          <a className="flink" href="/register">Register</a>
        </div>
        <div>
          <h5>Connect</h5>
          <a href="mailto:info@hellolocal.me" className="flink">info@hellolocal.me</a>
          <a href="https://www.instagram.com/entrepreneur_summit_rjy" target="_blank" rel="noopener noreferrer" className="flink">entrepreneur_summit_rjy</a>
        </div>
        <div>
          <h5>Location & Timings</h5>
          <span className="flink">🌳 NTR Park: 1st & 3rd Sundays @ 5:00 PM</span>
          <span className="flink">🚪 Closed-Door: 2nd & 4th Sundays @ 10:30 AM</span>
        </div>
      </div>
      <div className="max" style={{ marginTop: 36, paddingTop: 20, borderTop: '1px solid rgba(250,246,236,.12)', fontSize: 12, color: 'rgba(250,246,236,.4)' }}>
        © {new Date().getFullYear()} Startup Potluck. Built by founders, for founders.
      </div>
    </footer>
  );
}
