import { useState } from 'react';
import { sendContactMessage } from '../lib/contact.js';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      let result = await sendContactMessage(form);

      // If the helper returned a raw string, parse it into an object
      if (typeof result === 'string') {
        try {
          result = JSON.parse(result);
        } catch {}
      }

      // Check for boolean true or string "true"
      const isSuccess =
        result === true ||
        result?.success === true ||
        result?.success === 'true' ||
        result?.ok === true ||
        result?.ok === 'true';

      if (isSuccess) {
        setStatus('sent');
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
        setErrorMsg(result?.message || 'Something went wrong while sending your message. Please try again.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setStatus('error');
      setErrorMsg('An unexpected error occurred. Please try again.');
    }
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
              <div className="field">
                <label>Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="field">
                  <label>Phone</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.phone}
                    onChange={e => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className="field">
                <label>Message</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={e => update('message', e.target.value)}
                  placeholder="How can we help?"
                />
              </div>

              {/* Status Banner */}
              {status === 'sent' && (
                <div
                  style={{
                    marginBottom: 14,
                    padding: '10px 12px',
                    borderRadius: 6,
                    backgroundColor: '#e8f5e9',
                    color: '#2e7d32',
                    border: '1px solid #a5d6a7',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  Message sent successfully!
                </div>
              )}

              {status === 'error' && (
                <div
                  style={{
                    marginBottom: 14,
                    padding: '10px 12px',
                    borderRadius: 6,
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    border: '1px solid #ef9a9a',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {errorMsg}
                </div>
              )}

              <button type="submit" className="btn btn-primary full" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
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