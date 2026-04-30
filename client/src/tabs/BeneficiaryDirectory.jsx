import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Phone, Calendar, ChevronRight, X,
  FileText, Award, Mail, UserPlus, Send,
} from 'lucide-react';
import { fetchBeneficiaries, createBeneficiary, fetchGrants, createApplication } from '../api';

/* ── Shared modal overlay style ──────────────────────────────── */
const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(26,24,22,0.18)', zIndex: 90 };
const panelBase = {
  position: 'fixed', top: 0, right: 0, width: '420px', height: '100vh',
  background: 'var(--bg-card)', borderLeft: '1px solid var(--border-light)',
  boxShadow: '-4px 0 24px rgba(26,24,22,0.08)', zIndex: 100,
  padding: '2rem', overflowY: 'auto',
};
const inputStyle = {
  width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px',
  border: '1px solid var(--border-light)', fontFamily: 'var(--font-sans)',
  fontSize: '0.875rem', color: 'var(--text-primary)', background: 'var(--bg-card)',
  outline: 'none', transition: 'border var(--transition-fast)',
};
const labelStyle = { display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' };
const fieldGap = { marginBottom: '0.875rem' };
const btnPrimary = {
  width: '100%', padding: '0.625rem', borderRadius: '6px', border: 'none',
  background: 'var(--text-primary)', color: '#fff', fontFamily: 'var(--font-sans)',
  fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'opacity var(--transition-fast)',
};

/* ═══════════════════════════════════════════════════════════════
   Detail Panel
   ═══════════════════════════════════════════════════════════════ */
function DetailPanel({ beneficiary: b, onClose, onApply }) {
  if (!b) return null;
  const name = b.full_name || b.name || 'Unknown';
  const rows = [
    { icon: Phone, label: 'Phone', value: b.phone || '—' },
    { icon: Mail, label: 'Email', value: b.email || '—' },
    { icon: MapPin, label: 'Address', value: b.address || '—' },
    { icon: Calendar, label: 'DOB', value: b.dob ? new Date(b.dob).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
    { icon: Calendar, label: 'Registered', value: (b.created_at) ? new Date(b.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
    { icon: Award, label: 'Income', value: b.income_level ? `₹${Number(b.income_level).toLocaleString('en-IN')}` : '—' },
    { icon: FileText, label: 'Gender', value: b.gender || '—' },
  ];
  return (
    <motion.div key="detail" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.3 }} style={panelBase}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 className="heading-lg">Details</h2>
        <button onClick={onClose} style={{ background: 'var(--bg-muted)', border: 'none', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={16} /></button>
      </div>
      <div style={{ background: 'var(--bg-muted)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-sage-light)', color: 'var(--accent-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.25rem', margin: '0 auto 0.75rem' }}>{name[0]}</div>
        <div className="heading-md">{name}</div>
        <div className="text-caption" style={{ marginTop: '0.25rem' }}>ID: {b.beneficiary_id}</div>
      </div>
      {rows.map(({ icon: Ic, label, value }, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', flexShrink: 0 }}><Ic size={15} /></div>
          <div style={{ flex: 1 }}><div className="text-caption">{label}</div><div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{value}</div></div>
        </div>
      ))}
      <button onClick={() => onApply(b)} style={{ ...btnPrimary, marginTop: '1.25rem', background: 'var(--accent-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <Send size={14} /> Apply for Grant
      </button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Add Beneficiary Panel
   ═══════════════════════════════════════════════════════════════ */
function AddBeneficiaryPanel({ onClose, onCreated }) {
  const [form, setForm] = useState({ full_name: '', dob: '', gender: 'Male', phone: '', email: '', address: '', income_level: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.dob || !form.phone || !form.email) { setError('Please fill all required fields'); return; }
    setSaving(true); setError('');
    try {
      await createBeneficiary({ ...form, income_level: Number(form.income_level) || 0 });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create beneficiary');
    } finally { setSaving(false); }
  };

  return (
    <motion.div key="add-ben" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.3 }} style={panelBase}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 className="heading-lg">Add Beneficiary</h2>
        <button onClick={onClose} style={{ background: 'var(--bg-muted)', border: 'none', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={16} /></button>
      </div>
      {error && <div style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'var(--accent-red-light)', color: 'var(--accent-red)', fontSize: '0.8125rem', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={fieldGap}><label style={labelStyle}>Full Name *</label><input style={inputStyle} value={form.full_name} onChange={(e) => set('full_name', e.target.value)} placeholder="e.g. Priya Nair" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', ...fieldGap }}>
          <div><label style={labelStyle}>Date of Birth *</label><input type="date" style={inputStyle} value={form.dob} onChange={(e) => set('dob', e.target.value)} /></div>
          <div><label style={labelStyle}>Gender</label><select style={inputStyle} value={form.gender} onChange={(e) => set('gender', e.target.value)}><option>Male</option><option>Female</option><option>Other</option></select></div>
        </div>
        <div style={fieldGap}><label style={labelStyle}>Phone *</label><input style={inputStyle} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="9876543210" /></div>
        <div style={fieldGap}><label style={labelStyle}>Email *</label><input type="email" style={inputStyle} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="name@example.com" /></div>
        <div style={fieldGap}><label style={labelStyle}>Address</label><input style={inputStyle} value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="City, State" /></div>
        <div style={fieldGap}><label style={labelStyle}>Annual Income (₹)</label><input type="number" style={inputStyle} value={form.income_level} onChange={(e) => set('income_level', e.target.value)} placeholder="50000" /></div>
        <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>{saving ? 'Saving…' : 'Create Beneficiary'}</button>
      </form>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Apply for Grant Panel
   ═══════════════════════════════════════════════════════════════ */
function ApplyGrantPanel({ beneficiary, onClose, onCreated }) {
  const [grants, setGrants] = useState([]);
  const [grantId, setGrantId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchGrants().then(setGrants).catch(() => {}); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!grantId) { setError('Please select a grant'); return; }
    setSaving(true); setError('');
    try {
      await createApplication({
        beneficiary_id: beneficiary.beneficiary_id,
        grant_id: Number(grantId),
        application_date: new Date().toISOString().split('T')[0],
        status: 'Under Review',
        remarks: remarks || 'Applied via dashboard',
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit application');
    } finally { setSaving(false); }
  };

  const name = beneficiary.full_name || beneficiary.name || 'Unknown';

  return (
    <motion.div key="apply-grant" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.3 }} style={panelBase}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 className="heading-lg">Apply for Grant</h2>
        <button onClick={onClose} style={{ background: 'var(--bg-muted)', border: 'none', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={16} /></button>
      </div>
      <div style={{ background: 'var(--bg-muted)', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-sage-light)', color: 'var(--accent-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1rem' }}>{name[0]}</div>
        <div><div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{name}</div><div className="text-caption">ID: {beneficiary.beneficiary_id}</div></div>
      </div>
      {error && <div style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'var(--accent-red-light)', color: 'var(--accent-red)', fontSize: '0.8125rem', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={fieldGap}>
          <label style={labelStyle}>Select Grant Program *</label>
          <select style={inputStyle} value={grantId} onChange={(e) => setGrantId(e.target.value)}>
            <option value="">— Choose a grant —</option>
            {grants.map((g) => (
              <option key={g.grant_id} value={g.grant_id}>
                {g.grant_name} (Max ₹{Number(g.max_amount).toLocaleString('en-IN')})
              </option>
            ))}
          </select>
        </div>
        <div style={fieldGap}><label style={labelStyle}>Remarks</label><textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Optional notes…" /></div>
        <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1, background: 'var(--accent-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Send size={14} /> {saving ? 'Submitting…' : 'Submit Application'}
        </button>
      </form>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Beneficiary Directory — Main View
   ═══════════════════════════════════════════════════════════════ */
export default function BeneficiaryDirectory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [panel, setPanel] = useState(null); // null | {type, data?}

  const reload = () => { fetchBeneficiaries().then(setData).catch(console.error); };
  useEffect(() => { reload(); setLoading(false); }, []);

  const filtered = data.filter((b) => {
    const q = search.toLowerCase();
    const name = (b.full_name || '').toLowerCase();
    const addr = (b.address || '').toLowerCase();
    return name.includes(q) || addr.includes(q) || String(b.beneficiary_id).includes(q);
  });

  const closePanel = () => setPanel(null);

  return (
    <section id="beneficiary-directory">
      {/* ── Header ─────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 className="heading-xl">Beneficiary Directory</h1>
          <p className="text-body" style={{ marginTop: '0.375rem' }}>Comprehensive registry of all aid recipients</p>
        </div>
        <button id="add-beneficiary-btn" onClick={() => setPanel({ type: 'add' })}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: 'var(--text-primary)', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
          <UserPlus size={15} /> Add Beneficiary
        </button>
      </motion.div>

      {/* ── Search ──────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '0.625rem 1rem', maxWidth: '400px', boxShadow: 'var(--shadow-sm)' }}>
        <Search size={16} style={{ color: 'var(--text-tertiary)' }} />
        <input id="beneficiary-search" type="text" placeholder="Search by name, address, or ID…" value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--text-primary)', width: '100%' }} />
      </motion.div>

      {/* ── Table ───────────────────────────────────────────────── */}
      <motion.div className="card card-elevated" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}><span className="text-body" style={{ color: 'var(--text-tertiary)' }}>Loading…</span></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}><span className="text-body" style={{ color: 'var(--text-tertiary)' }}>No beneficiaries found.</span></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead><tr><th>ID</th><th>Name</th><th>Contact</th><th>Address</th><th>Registered</th><th></th></tr></thead>
              <tbody>
                {filtered.map((b) => {
                  const name = b.full_name || 'Unknown';
                  return (
                    <tr key={b.beneficiary_id} style={{ cursor: 'pointer' }} onClick={() => setPanel({ type: 'detail', data: b })}>
                      <td style={{ fontWeight: 500 }}>#{b.beneficiary_id}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--accent-sage-light)', color: 'var(--accent-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>{name[0]}</div>
                          <span style={{ fontWeight: 500 }}>{name}</span>
                        </div>
                      </td>
                      <td>{b.phone || '—'}</td>
                      <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={13} style={{ color: 'var(--text-tertiary)' }} />{b.address || '—'}</span></td>
                      <td>{b.created_at ? new Date(b.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}</td>
                      <td><ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ── Panels (slide-in) ──────────────────────────────────── */}
      <AnimatePresence>
        {panel && (
          <>
            <div onClick={closePanel} style={overlayStyle} />
            {panel.type === 'detail' && (
              <DetailPanel beneficiary={panel.data} onClose={closePanel}
                onApply={(b) => setPanel({ type: 'apply', data: b })} />
            )}
            {panel.type === 'add' && (
              <AddBeneficiaryPanel onClose={closePanel} onCreated={reload} />
            )}
            {panel.type === 'apply' && (
              <ApplyGrantPanel beneficiary={panel.data} onClose={closePanel} onCreated={reload} />
            )}
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
