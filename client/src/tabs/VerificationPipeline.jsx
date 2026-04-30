import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Calendar, Award, ShieldAlert, ShieldCheck, Loader } from 'lucide-react';
import { fetchKanban, verifyApplication, updateApplicationStatus, toggleFraudFlag } from '../api';

/* ── Helpers ─────────────────────────────────────────────────── */
function isFraud(flag) {
  if (typeof flag === 'string') return flag.toUpperCase() === 'YES';
  return flag === 1 || flag === true;
}

/* ── Column Config ───────────────────────────────────────────── */
const COLUMNS = [
  { key: 'Under Review', label: 'Under Review', icon: Calendar, accent: 'gold', badgeCls: 'badge--gold', borderColor: 'var(--accent-gold)' },
  { key: 'Approved', label: 'Approved', icon: CheckCircle, accent: 'sage', badgeCls: 'badge--sage', borderColor: 'var(--accent-sage)' },
  { key: 'Rejected', label: 'Rejected', icon: XCircle, accent: 'red', badgeCls: 'badge--red', borderColor: 'var(--accent-red)' },
];

/* ═══════════════════════════════════════════════════════════════
   Application Card with Action Buttons
   ═══════════════════════════════════════════════════════════════ */
function AppCard({ app, onAction, busy }) {
  const hasFraud = isFraud(app.fraud_flag);
  const status = app.status;
  const isBusy = busy === app.application_id;

  return (
    <motion.div
      layout
      className="card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: '1rem 1.125rem',
        borderLeft: hasFraud ? '3px solid var(--accent-terracotta)' : '3px solid transparent',
        background: hasFraud ? 'var(--accent-terracotta-light)' : 'var(--bg-card)',
        opacity: isBusy ? 0.6 : 1,
        pointerEvents: isBusy ? 'none' : 'auto',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
          {app.full_name || `Beneficiary #${app.beneficiary_id}`}
        </div>
        {hasFraud && <AlertTriangle size={15} style={{ color: 'var(--accent-terracotta)', flexShrink: 0 }} />}
      </div>

      {/* Meta */}
      <div className="text-caption" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
        <Award size={12} /> {app.grant_name || `Grant #${app.grant_id}`}
      </div>
      <div className="text-caption" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
        <Calendar size={12} />
        {app.application_date ? new Date(app.application_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
      </div>
      {app.risk_score != null && (
        <div className="text-caption" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
          <ShieldAlert size={12} /> Risk: {app.risk_score}
        </div>
      )}
      {app.remarks && (
        <div className="text-caption" style={{ fontStyle: 'italic', marginBottom: '0.5rem', color: 'var(--text-tertiary)' }}>
          "{app.remarks}"
        </div>
      )}

      {/* Fraud badge */}
      {hasFraud && (
        <div className="badge badge--terracotta" style={{ fontSize: '0.625rem', marginBottom: '0.5rem' }}>
          <AlertTriangle size={10} /> Fraud Risk
        </div>
      )}

      {/* ── Action Buttons ────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginTop: '0.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.625rem' }}>
        {isBusy && <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />}

        {status === 'Under Review' && (
          <>
            <button onClick={() => onAction(app.application_id, 'approve')}
              style={actionBtnStyle('var(--accent-sage-light)', 'var(--accent-sage)')}>
              <CheckCircle size={12} /> Approve
            </button>
            <button onClick={() => onAction(app.application_id, 'reject')}
              style={actionBtnStyle('var(--accent-red-light)', 'var(--accent-red)')}>
              <XCircle size={12} /> Reject
            </button>
          </>
        )}

        {status === 'Approved' && (
          <button onClick={() => onAction(app.application_id, 'revert')}
            style={actionBtnStyle('var(--accent-gold-light)', 'var(--accent-gold)')}>
            <Calendar size={12} /> Revert to Review
          </button>
        )}

        {status === 'Rejected' && (
          <button onClick={() => onAction(app.application_id, 'revert')}
            style={actionBtnStyle('var(--accent-gold-light)', 'var(--accent-gold)')}>
            <Calendar size={12} /> Revert to Review
          </button>
        )}

        {/* Flag / Unflag (only if a fraud_id exists) */}
        {app.fraud_id && (
          <button onClick={() => onAction(app.application_id, hasFraud ? 'unflag' : 'flag', app.fraud_id)}
            style={actionBtnStyle(
              hasFraud ? 'var(--accent-sage-light)' : 'var(--accent-terracotta-light)',
              hasFraud ? 'var(--accent-sage)' : 'var(--accent-terracotta)'
            )}>
            {hasFraud ? <><ShieldCheck size={12} /> Unflag</> : <><ShieldAlert size={12} /> Flag</>}
          </button>
        )}
      </div>
    </motion.div>
  );
}

function actionBtnStyle(bg, color) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
    padding: '0.3rem 0.6rem', borderRadius: '5px', fontSize: '0.6875rem', fontWeight: 600,
    border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
    background: bg, color, transition: 'all var(--transition-fast)',
  };
}

/* ═══════════════════════════════════════════════════════════════
   Verification Pipeline — Main View
   ═══════════════════════════════════════════════════════════════ */
export default function VerificationPipeline() {
  const [kanban, setKanban] = useState({ 'Under Review': [], Approved: [], Rejected: [] });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  const loadKanban = useCallback(() => {
    fetchKanban()
      .then((data) => {
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          setKanban({
            'Under Review': data['Under Review'] || [],
            Approved: data['Approved'] || [],
            Rejected: data['Rejected'] || [],
          });
        } else if (Array.isArray(data)) {
          const grouped = { 'Under Review': [], Approved: [], Rejected: [] };
          data.forEach((app) => { const s = app.status || 'Under Review'; if (grouped[s]) grouped[s].push(app); });
          setKanban(grouped);
        }
      })
      .catch((err) => console.error('VerificationPipeline load error:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadKanban(); }, [loadKanban]);

  /* ── Handle all card actions ────────────────────────────────── */
  const handleAction = async (appId, action, fraudId) => {
    setBusy(appId);
    try {
      if (action === 'approve') {
        await updateApplicationStatus(appId, 'Approved', 'Approved via dashboard');
      } else if (action === 'reject') {
        await updateApplicationStatus(appId, 'Rejected', 'Rejected via dashboard');
      } else if (action === 'revert') {
        await updateApplicationStatus(appId, 'Under Review', 'Reverted to review');
      } else if (action === 'flag' && fraudId) {
        await toggleFraudFlag(fraudId, 'YES');
      } else if (action === 'unflag' && fraudId) {
        await toggleFraudFlag(fraudId, 'NO');
      }
      /* Reload kanban from backend to reflect new state */
      await loadKanban();
    } catch (err) {
      console.error('Action error:', err);
    } finally {
      setBusy(null);
    }
  };

  /* ── Stats ────────────────────────────────────────────────── */
  const totals = {
    review: kanban['Under Review']?.length || 0,
    approved: kanban['Approved']?.length || 0,
    rejected: kanban['Rejected']?.length || 0,
  };

  return (
    <section id="verification-pipeline">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: '1.5rem' }}>
        <h1 className="heading-xl">Verification Pipeline</h1>
        <p className="text-body" style={{ marginTop: '0.375rem' }}>Manage, verify, and flag application submissions</p>
      </motion.div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>
          <span className="text-body" style={{ color: 'var(--text-tertiary)' }}>Loading pipeline…</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', alignItems: 'flex-start' }}>
          {COLUMNS.map((col) => (
            <motion.div key={col.key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
              {/* Column Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: `2px solid ${col.borderColor}` }}>
                <col.icon size={16} style={{ color: col.borderColor }} />
                <span className="heading-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>{col.label}</span>
                <span className={`badge ${col.badgeCls}`} style={{ marginLeft: 'auto', fontSize: '0.625rem' }}>
                  {kanban[col.key]?.length ?? 0}
                </span>
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '70vh', overflowY: 'auto' }}>
                <AnimatePresence mode="popLayout">
                  {(kanban[col.key] || []).length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.8125rem', background: 'var(--bg-muted)', borderRadius: '8px', border: '1px dashed var(--border-light)' }}>
                      No applications
                    </div>
                  ) : (
                    kanban[col.key].map((app) => (
                      <AppCard key={app.application_id} app={app} onAction={handleAction} busy={busy} />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Spin keyframes */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
