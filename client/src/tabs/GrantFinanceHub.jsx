import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Calendar, Users, CheckCircle, FileText, Plus, X } from 'lucide-react';
import { fetchGrants, createGrant } from '../api';

/* ── Shared form styles ──────────────────────────────────────── */
const panelBase = {
  position: 'fixed', top: 0, right: 0, width: '420px', height: '100vh',
  background: 'var(--bg-card)', borderLeft: '1px solid var(--border-light)',
  boxShadow: '-4px 0 24px rgba(26,24,22,0.08)', zIndex: 100,
  padding: '2rem', overflowY: 'auto',
};
const inputStyle = {
  width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px',
  border: '1px solid var(--border-light)', fontFamily: 'var(--font-sans)',
  fontSize: '0.875rem', color: 'var(--text-primary)', background: 'var(--bg-card)', outline: 'none',
};
const labelStyle = { display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' };
const fieldGap = { marginBottom: '0.875rem' };
const btnPrimary = {
  width: '100%', padding: '0.625rem', borderRadius: '6px', border: 'none',
  background: 'var(--text-primary)', color: '#fff', fontFamily: 'var(--font-sans)',
  fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
};

/* ═══════════════════════════════════════════════════════════════
   Add Grant Panel
   ═══════════════════════════════════════════════════════════════ */
function AddGrantPanel({ onClose, onCreated }) {
  const [form, setForm] = useState({ grant_name: '', description: '', eligibility_criteria: '', max_amount: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.grant_name || !form.max_amount) { setError('Name and Max Amount are required'); return; }
    setSaving(true); setError('');
    try {
      await createGrant({ ...form, max_amount: Number(form.max_amount) });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create grant');
    } finally { setSaving(false); }
  };

  return (
    <motion.div key="add-grant" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.3 }} style={panelBase}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 className="heading-lg">New Grant Program</h2>
        <button onClick={onClose} style={{ background: 'var(--bg-muted)', border: 'none', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={16} /></button>
      </div>
      {error && <div style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'var(--accent-red-light)', color: 'var(--accent-red)', fontSize: '0.8125rem', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={fieldGap}><label style={labelStyle}>Grant Name *</label><input style={inputStyle} value={form.grant_name} onChange={(e) => set('grant_name', e.target.value)} placeholder="e.g. Rural Housing Aid" /></div>
        <div style={fieldGap}><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Brief description of the program…" /></div>
        <div style={fieldGap}><label style={labelStyle}>Eligibility Criteria</label><textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={form.eligibility_criteria} onChange={(e) => set('eligibility_criteria', e.target.value)} placeholder="e.g. BPL card holder, age 18+" /></div>
        <div style={fieldGap}><label style={labelStyle}>Max Amount per Person (₹) *</label><input type="number" style={inputStyle} value={form.max_amount} onChange={(e) => set('max_amount', e.target.value)} placeholder="50000" /></div>
        <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>{saving ? 'Creating…' : 'Create Grant Program'}</button>
      </form>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Grant Card — uses fields returned by GET /api/grants:
     grant_name, description, eligibility_criteria, max_amount,
     total_applications, approved_count, total_disbursed
   ═══════════════════════════════════════════════════════════════ */
function GrantCard({ grant, delay }) {
  const maxAmt = Number(grant.max_amount || 0);
  const totalApps = Number(grant.total_applications || 0);
  const approved = Number(grant.approved_count || 0);
  const disbursed = Number(grant.total_disbursed || 0);

  /* Budget estimate = max_amount × approved applications */
  const estimatedBudget = maxAmt * (approved || 1);
  const pct = estimatedBudget > 0 ? Math.min((disbursed / estimatedBudget) * 100, 100) : 0;

  const barColor =
    pct >= 90
      ? 'var(--accent-red)'
      : pct >= 60
        ? 'var(--accent-gold)'
        : 'var(--accent-sage)';

  return (
    <motion.div
      className="card card-elevated"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      style={{ padding: '1.5rem' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <h3 className="heading-md">{grant.grant_name}</h3>
          <div className="text-caption" style={{ marginTop: '0.25rem', maxWidth: '260px' }}>
            {grant.description || 'No description'}
          </div>
        </div>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'var(--accent-gold-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold)',
            flexShrink: 0,
          }}
        >
          <Wallet size={18} />
        </div>
      </div>

      {/* Eligibility */}
      <div
        style={{
          fontSize: '0.75rem',
          color: 'var(--text-tertiary)',
          padding: '0.5rem 0.75rem',
          background: 'var(--bg-muted)',
          borderRadius: '4px',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
        }}
      >
        <FileText size={12} />
        {grant.eligibility_criteria || 'N/A'}
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0.75rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ textAlign: 'center', padding: '0.625rem', background: 'var(--bg-muted)', borderRadius: '6px' }}>
          <div className="text-caption" style={{ marginBottom: '0.25rem' }}>Max / Person</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1rem' }}>
            ₹{maxAmt.toLocaleString('en-IN')}
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '0.625rem', background: 'var(--bg-muted)', borderRadius: '6px' }}>
          <div className="text-caption" style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
            <Users size={11} /> Applications
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1rem' }}>
            {totalApps}
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '0.625rem', background: 'var(--accent-sage-light)', borderRadius: '6px' }}>
          <div className="text-caption" style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
            <CheckCircle size={11} /> Approved
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1rem', color: 'var(--accent-sage)' }}>
            {approved}
          </div>
        </div>
      </div>

      {/* Disbursement Progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span className="text-caption">Disbursed vs Allocated Budget</span>
          <span style={{ fontWeight: 600, fontSize: '0.75rem', color: barColor }}>
            {pct.toFixed(1)}%
          </span>
        </div>
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: delay + 0.2 }}
            style={{ background: barColor }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.375rem' }}>
          <span className="text-caption">₹{disbursed.toLocaleString('en-IN')} disbursed</span>
          <span className="text-caption">₹{estimatedBudget.toLocaleString('en-IN')} allocated</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Grant Finance Hub — Main View
   ═══════════════════════════════════════════════════════════════ */
export default function GrantFinanceHub() {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const reload = () => { fetchGrants().then(setGrants).catch(console.error); };
  useEffect(() => {
    fetchGrants()
      .then(setGrants)
      .catch((err) => console.error('GrantFinanceHub load error:', err))
      .finally(() => setLoading(false));
  }, []);

  /* Summary stats */
  const totalDisbursed = grants.reduce((s, g) => s + Number(g.total_disbursed || 0), 0);
  const totalApproved = grants.reduce((s, g) => s + Number(g.approved_count || 0), 0);

  return (
    <section id="grant-finance-hub">
      {/* ── Header ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}
      >
        <div>
          <h1 className="heading-xl">Grant &amp; Finance Hub</h1>
          <p className="text-body" style={{ marginTop: '0.375rem' }}>Track funding capacity and disbursement progress</p>
        </div>
        <button id="add-grant-btn" onClick={() => setShowForm(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: 'var(--text-primary)', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={15} /> Add Grant
        </button>
      </motion.div>

      {/* ── Summary Row ─────────────────────────────────────────── */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}
        >
          <div className="card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Wallet size={16} style={{ color: 'var(--accent-gold)' }} />
            <div>
              <div className="text-caption">Total Disbursed</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.125rem' }}>
                ₹{totalDisbursed.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <CheckCircle size={16} style={{ color: 'var(--accent-sage)' }} />
            <div>
              <div className="text-caption">Total Approved</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.125rem' }}>
                {totalApproved} applications
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <FileText size={16} style={{ color: 'var(--accent-blue)' }} />
            <div>
              <div className="text-caption">Active Programs</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.125rem' }}>
                {grants.length}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>
          <span className="text-body" style={{ color: 'var(--text-tertiary)' }}>Loading grants…</span>
        </div>
      ) : grants.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          No grant programs found.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {grants.map((g, i) => (
            <GrantCard key={g.grant_id || i} grant={g} delay={i * 0.06} />
          ))}
        </div>
      )}

      {/* ── Add Grant Panel ────────────────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <>
            <div onClick={() => setShowForm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(26,24,22,0.18)', zIndex: 90 }} />
            <AddGrantPanel onClose={() => setShowForm(false)} onCreated={reload} />
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
