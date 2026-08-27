import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${form.name || 'Startup Potluck site'}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:potluck@hellolocal.me?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <section>
      <div className="max" style={{ maxWidth: 900 }}>
        <div className="flow-head">
          <div className="eyebrow center"><span className="dot"></span>Get in Touch</div>
          <h2 className="section-title">Contact</h2>
          <p className="section-lede center">Questions about a Sunday, partnerships, or press — reach out.</p>
        </div>

        <div className="grid cols-2">
          <div className="flow-card">
            <p className="fc-label">Send a Message</p>
            <form onSubmit={handleSubmit}>
              <div className="field"><label>Name</label><input type="text" required value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name" /></div>
              <div className="field"><label>Email</label><input type="email" required value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" /></div>
              <div className="field"><label>Message</label><textarea rows={4} required value={form.message} onChange={e => update('message', e.target.value)} placeholder="How can we help?" /></div>
              <button type="submit" className="btn btn-primary full">Send via Email</button>
              {sent && <p style={{ fontSize: 12, color: 'var(--green)', marginTop: 10 }}>Opening your email app to send the message...</p>}
            </form>
          </div>

          <div className="flow-card" style={{ background: 'var(--kraft)' }}>
            <p className="fc-label">Reach Us Directly</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-faint)', textTransform: 'uppercase' }}>Email</p>
                <a href="mailto:potluck@hellolocal.me" style={{ fontSize: 14, fontWeight: 600 }}>potluck@hellolocal.me</a>
              </div>
              <div>
                <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-faint)', textTransform: 'uppercase' }}>Instagram</p>
                <a href="https://www.instagram.com/entrepreneur_summit_rjy" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 600 }}>@entrepreneur_summit_rjy</a>
              </div>
              <div>
                <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-faint)', textTransform: 'uppercase' }}>Outdoor Sessions</p>
                <p style={{ fontSize: 14, fontWeight: 600 }}>NTR Park · 1st & 3rd Sundays · 5:00 PM</p>
              </div>
              <div>
                <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-faint)', textTransform: 'uppercase' }}>Indoor Sessions</p>
                <p style={{ fontSize: 14, fontWeight: 600 }}>Closed-Door · 2nd & 4th Sundays · 10:30 AM</p>
              </div>
              <div>
                <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-faint)', textTransform: 'uppercase' }}>Founder</p>
                <p style={{ fontSize: 14, fontWeight: 600 }}>Dr. M Johar Krishna</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
