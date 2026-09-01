import { useEffect, useMemo, useState } from 'react';
import { sheetAdminList, sheetUpdateElite, sheetUpdateMember } from '../lib/sheet.js';

const SESSION_KEY = 'potluck:adminKey';

// Editable fields, in the order they appear in the edit form.
// Mobile is intentionally excluded — it's the lookup key used to find the
// row on the backend, so editing it here is unsafe (it would also silently
// break the link between this member, their RSVP history, and their login).
const EDITABLE_FIELDS = [
  'Name', 'Email', 'Company', 'Role', 'City',
  'Need From Community', 'Startup Problem Ticket', 'Problem Status',
  'Instagram', 'Website'
];

function isElite(row) {
  return ['yes', 'true', '1'].includes(String(row['Elite Member'] || '').trim().toLowerCase());
}

export default function Admin() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(SESSION_KEY) || '');
  const [keyInput, setKeyInput] = useState('');
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [authError, setAuthError] = useState('');

  const [tab, setTab] = useState('members'); // 'members' | 'rsvps'
  const [members, setMembers] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [savingMobile, setSavingMobile] = useState(null);

  const [editingMobile, setEditingMobile] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [duplicateMobiles, setDuplicateMobiles] = useState([]);

  async function attemptLogin(key) {
    setChecking(true);
    setAuthError('');
    const result = await sheetAdminList('registrations', key);
    setChecking(false);
    if (result.ok) {
      setAuthed(true);
      setAdminKey(key);
      sessionStorage.setItem(SESSION_KEY, key);
      setMembers(result.rows);
    } else {
      setAuthError(result.reason === 'unauthorized' ? 'Incorrect admin key.' : 'Could not verify key — check your connection.');
    }
  }

  useEffect(() => {
    if (adminKey) attemptLogin(adminKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    setLoadingData(true);
    const type = tab === 'members' ? 'registrations' : 'rsvps';
    sheetAdminList(type, adminKey).then(result => {
      if (cancelled) return;
      if (result.ok) {
        if (tab === 'members') setMembers(result.rows);
        else setRsvps(result.rows);
      }
      setLoadingData(false);
    });
    return () => { cancelled = true; };
  }, [tab, authed, adminKey]);

  // Flag any duplicate mobile numbers so admin can see & clean them up —
  // duplicates are the root cause of unpredictable Elite/Edit behavior,
  // since the backend always updates the FIRST matching row.
  useEffect(() => {
    const seen = new Map();
    for (const m of members) {
      const mob = m['Mobile'];
      seen.set(mob, (seen.get(mob) || 0) + 1);
    }
    setDuplicateMobiles([...seen.entries()].filter(([, count]) => count > 1).map(([mob]) => mob));
  }, [members]);

  async function toggleElite(row) {
    const mobile = row['Mobile'];
    const newValue = !isElite(row);
    setSavingMobile(mobile);
    setMembers(prev => prev.map(m => m['Mobile'] === mobile ? { ...m, 'Elite Member': newValue ? 'Yes' : 'No' } : m));
    const result = await sheetUpdateElite({ adminKey, mobile, elite: newValue });
    if (!result || !result.ok) {
      setMembers(prev => prev.map(m => m['Mobile'] === mobile ? { ...m, 'Elite Member': newValue ? 'No' : 'Yes' } : m));
    }
    setSavingMobile(null);
  }

  function startEdit(row) {
    setEditingMobile(row['Mobile']);
    const form = {};
    EDITABLE_FIELDS.forEach(f => { form[f] = row[f] || ''; });
    setEditForm(form);
  }

  function cancelEdit() {
    setEditingMobile(null);
    setEditForm({});
  }

  async function saveEdit(mobile) {
    setSavingMobile(mobile);
    const result = await sheetUpdateMember({ adminKey, mobile, fields: editForm });
    if (result && result.ok) {
      setMembers(prev => prev.map(m => m['Mobile'] === mobile ? { ...m, ...editForm } : m));
      cancelEdit();
    }
    setSavingMobile(null);
  }

  const rsvpsByDate = useMemo(() => {
    const groups = {};
    for (const r of rsvps) {
      const date = r['Meetup Date'] || 'Unknown date';
      if (!groups[date]) groups[date] = [];
      groups[date].push(r);
    }
    return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  }, [rsvps]);

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setAdminKey('');
    setKeyInput('');
  }

  if (!authed) {
    return (
      <section>
        <div className="max" style={{ maxWidth: 380 }}>
          <div className="flow-head">
            <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'none', fontSize: 'clamp(1.6rem,3vw,2rem)', color: 'var(--ink)' }}>
              Admin Access
            </h2>
          </div>
          <div className="flow-card">
            <form onSubmit={e => { e.preventDefault(); attemptLogin(keyInput); }}>
              <div className="field">
                <label>Admin Key</label>
                <input type="password" value={keyInput} onChange={e => setKeyInput(e.target.value)} placeholder="Enter admin key" />
              </div>
              {authError && <p style={{ color: 'var(--red)', fontSize: 12.5, marginBottom: 10 }}>{authError}</p>}
              <button type="submit" className="btn btn-primary full" disabled={checking}>
                {checking ? 'Checking...' : 'Unlock'}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="max">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <h2 className="section-title" style={{ fontSize: 'clamp(1.6rem,3vw,2rem)' }}>Admin</h2>
          <button className="btn btn-ghost small" onClick={logout}>Log out</button>
        </div>

        {duplicateMobiles.length > 0 && (
          <div className="alert-warn" style={{ marginBottom: 20 }}>
            ⚠️ Duplicate mobile number{duplicateMobiles.length > 1 ? 's' : ''} found in your sheet: {duplicateMobiles.join(', ')}.
            Editing or toggling Elite for these will always affect the <em>first</em> matching row — worth cleaning up the duplicate rows directly in your Registrations sheet.
          </div>
        )}

        <div className="pill-choice" style={{ marginBottom: 24 }}>
          <button type="button" className={tab === 'members' ? 'selected' : ''} onClick={() => setTab('members')}>
            Members ({members.length})
          </button>
          <button type="button" className={tab === 'rsvps' ? 'selected' : ''} onClick={() => setTab('rsvps')}>
            RSVPs by Sunday
          </button>
        </div>

        {loadingData && <p style={{ fontSize: 13, color: 'var(--ink-faint)' }}>Loading...</p>}

        {tab === 'members' && !loadingData && (
          <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--paper-deep)', textAlign: 'left' }}>
                  {['Name', 'Mobile', 'Company', 'Role', 'City', 'Elite', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', fontSize: 11, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map((m, i) => {
                  const rowKey = `${m['Mobile']}-${i}`;
                  const isEditing = editingMobile === m['Mobile'];
                  return (
                    <>
                      <tr key={rowKey} style={{ borderTop: '1px solid var(--rule)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>{m['Name']}</td>
                        <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{m['Mobile']}</td>
                        <td style={{ padding: '10px 14px' }}>{m['Company']}</td>
                        <td style={{ padding: '10px 14px' }}>{m['Role']}</td>
                        <td style={{ padding: '10px 14px' }}>{m['City']}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <button
                            type="button"
                            onClick={() => toggleElite(m)}
                            disabled={savingMobile === m['Mobile']}
                            className="btn small"
                            style={{
                              padding: '4px 12px', fontSize: 11,
                              background: isElite(m) ? 'var(--purple)' : 'transparent',
                              color: isElite(m) ? '#fff' : 'var(--ink-soft)',
                              border: `1.5px solid ${isElite(m) ? 'var(--purple)' : 'var(--rule)'}`
                            }}
                          >
                            {savingMobile === m['Mobile'] ? '...' : (isElite(m) ? '⭐ Elite' : 'Standard')}
                          </button>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <button
                            type="button"
                            className="btn btn-ghost small"
                            style={{ padding: '4px 12px', fontSize: 11 }}
                            onClick={() => isEditing ? cancelEdit() : startEdit(m)}
                          >
                            {isEditing ? 'Cancel' : 'Edit'}
                          </button>
                        </td>
                      </tr>
                      {isEditing && (
                        <tr key={rowKey + '-edit'} style={{ background: 'var(--paper-deep)' }}>
                          <td colSpan={7} style={{ padding: 18 }}>
                            <div className="grid cols-2" style={{ gap: 12, marginBottom: 14 }}>
                              {EDITABLE_FIELDS.map(field => (
                                <div className="field" key={field} style={{ marginBottom: 0 }}>
                                  <label>{field}</label>
                                  {field === 'Startup Problem Ticket' ? (
                                    <textarea
                                      rows={2}
                                      value={editForm[field] || ''}
                                      onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))}
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      value={editForm[field] || ''}
                                      onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button
                                type="button"
                                className="btn btn-primary small"
                                onClick={() => saveEdit(m['Mobile'])}
                                disabled={savingMobile === m['Mobile']}
                              >
                                {savingMobile === m['Mobile'] ? 'Saving...' : 'Save Changes'}
                              </button>
                              <button type="button" className="btn btn-ghost small" onClick={cancelEdit}>Cancel</button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
            {members.length === 0 && <p style={{ padding: 20, fontSize: 13, color: 'var(--ink-faint)' }}>No members yet.</p>}
          </div>
        )}

        {tab === 'rsvps' && !loadingData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {rsvpsByDate.length === 0 && (
              <p style={{ fontSize: 13, color: 'var(--ink-faint)' }}>No RSVPs recorded yet.</p>
            )}
            {rsvpsByDate.map(([date, rows]) => {
              const attending = rows.filter(r => String(r['Attending']).toLowerCase() === 'yes').length;
              return (
                <div key={date} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                    <h4 style={{ fontSize: 15 }}>{date}</h4>
                    <span className="check-badge free">{attending} attending / {rows.length} responses</span>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                    <thead>
                      <tr style={{ textAlign: 'left', color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', fontSize: 10.5, textTransform: 'uppercase' }}>
                        <th style={{ padding: '4px 8px 8px 0' }}>Name</th>
                        <th style={{ padding: '4px 8px' }}>Mobile</th>
                        <th style={{ padding: '4px 8px' }}>Attending</th>
                        <th style={{ padding: '4px 8px' }}>Format</th>
                        <th style={{ padding: '4px 8px' }}>Topic</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={r['Mobile'] + '-' + i} style={{ borderTop: '1px dotted var(--rule)' }}>
                          <td style={{ padding: '6px 8px 6px 0', fontWeight: 600 }}>{r['Name']}</td>
                          <td style={{ padding: '6px 8px', fontFamily: 'var(--font-mono)' }}>{r['Mobile']}</td>
                          <td style={{ padding: '6px 8px' }}>{r['Attending']}</td>
                          <td style={{ padding: '6px 8px' }}>{r['Session Format']}</td>
                          <td style={{ padding: '6px 8px' }}>{r['Topic']}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
