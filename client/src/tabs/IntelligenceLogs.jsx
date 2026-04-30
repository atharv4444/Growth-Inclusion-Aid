import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, ShieldCheck, Clock, Filter, User, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchFraudLogs, toggleFraudFlag } from '../api';

const ROWS_PER_PAGE = 10;

/* ── Helpers ──────────────────────────────────────────────────── */
function isFlagged(flag) {
  if (typeof flag === 'string') return flag.toUpperCase() === 'YES';
  return flag === 1 || flag === true;
}

function RiskBadge({ score }) {
  const n = Number(score) || 0;
  if (n >= 70) return <span className="badge badge--red"><AlertTriangle size={10} /> High ({n})</span>;
  if (n >= 40) return <span className="badge badge--gold"><Shield size={10} /> Medium ({n})</span>;
  return <span className="badge badge--sage"><ShieldCheck size={10} /> Low ({n})</span>;
}

/* ═══════════════════════════════════════════════════════════════
   Pagination Controls
   ═══════════════════════════════════════════════════════════════ */
function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const range = 2;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - range && i <= page + range)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', padding: '1rem 0' }}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        style={{
          padding: '0.375rem', borderRadius: '6px', border: '1px solid var(--border-light)',
          background: 'var(--bg-card)', cursor: page === 1 ? 'not-allowed' : 'pointer',
          opacity: page === 1 ? 0.4 : 1, display: 'flex', alignItems: 'center',
        }}
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e${i}`} style={{ padding: '0 0.25rem', color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              minWidth: '32px', height: '32px', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 600,
              border: '1px solid var(--border-light)', cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              background: p === page ? 'var(--text-primary)' : 'var(--bg-card)',
              color: p === page ? 'var(--bg-card)' : 'var(--text-secondary)',
              transition: 'all var(--transition-fast)',
            }}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        style={{
          padding: '0.375rem', borderRadius: '6px', border: '1px solid var(--border-light)',
          background: 'var(--bg-card)', cursor: page === totalPages ? 'not-allowed' : 'pointer',
          opacity: page === totalPages ? 0.4 : 1, display: 'flex', alignItems: 'center',
        }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Intelligence Logs — Main View
   ═══════════════════════════════════════════════════════════════ */
export default function IntelligenceLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [toggling, setToggling] = useState(null);

  useEffect(() => {
    fetchFraudLogs()
      .then(setLogs)
      .catch((err) => console.error('IntelligenceLogs load error:', err))
      .finally(() => setLoading(false));
  }, []);

  /* Toggle fraud flag inline */
  const handleToggleFlag = async (log) => {
    const newFlag = isFlagged(log.fraud_flag) ? 'NO' : 'YES';
    setToggling(log.fraud_id);
    try {
      await toggleFraudFlag(log.fraud_id, newFlag);
      setLogs((prev) =>
        prev.map((l) => l.fraud_id === log.fraud_id ? { ...l, fraud_flag: newFlag } : l)
      );
    } catch (err) {
      console.error('Toggle flag error:', err);
    } finally {
      setToggling(null);
    }
  };

  const filtered = logs.filter((l) => {
    if (filter === 'flagged') return isFlagged(l.fraud_flag);
    if (filter === 'clean') return !isFlagged(l.fraud_flag);
    return true;
  });

  /* Reset to page 1 when filter changes */
  useEffect(() => { setPage(1); }, [filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);
  const flaggedCount = logs.filter((l) => isFlagged(l.fraud_flag)).length;

  return (
    <section id="intelligence-logs">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: '1.5rem' }}>
        <h1 className="heading-xl">Intelligence &amp; Logs</h1>
        <p className="text-body" style={{ marginTop: '0.375rem' }}>Automated fraud detection and administrative event stream</p>
      </motion.div>

      {/* ── Summary & Filter ─────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="card" style={{ padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="text-caption">Total Logs</span>
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-serif)', fontSize: '1rem' }}>{logs.length}</span>
          </div>
          <div className="card" style={{ padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: flaggedCount > 0 ? 'var(--accent-red-light)' : undefined }}>
            <AlertTriangle size={14} style={{ color: 'var(--accent-red)' }} />
            <span className="text-caption">Flagged</span>
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--accent-red)' }}>{flaggedCount}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={14} style={{ color: 'var(--text-tertiary)' }} />
          {['all', 'flagged', 'clean'].map((f) => (
            <button key={f} id={`filter-${f}`} onClick={() => setFilter(f)}
              style={{
                padding: '0.375rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-light)',
                background: filter === f ? 'var(--text-primary)' : 'var(--bg-card)',
                color: filter === f ? 'var(--bg-card)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all var(--transition-fast)', textTransform: 'capitalize',
              }}
            >{f}</button>
          ))}
        </div>
      </motion.div>

      {/* ── Table ────────────────────────────────────────────── */}
      <motion.div className="card card-elevated" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}><span className="text-body" style={{ color: 'var(--text-tertiary)' }}>Loading logs…</span></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}><span className="text-body" style={{ color: 'var(--text-tertiary)' }}>No logs match this filter.</span></div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Beneficiary</th>
                    <th>Grant</th>
                    <th>Risk Score</th>
                    <th>Status</th>
                    <th>Reason</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((log) => {
                    const flagged = isFlagged(log.fraud_flag);
                    const riskScore = Number(log.risk_score) || 0;
                    return (
                      <tr key={log.fraud_id} id={`log-row-${log.fraud_id}`}
                        style={{ background: flagged && riskScore >= 60 ? 'var(--accent-terracotta-light)' : undefined }}>
                        <td style={{ fontWeight: 500 }}>#{log.fraud_id}</td>
                        <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}><User size={13} style={{ color: 'var(--text-tertiary)' }} />{log.full_name || `App #${log.application_id}`}</span></td>
                        <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}><Award size={13} style={{ color: 'var(--text-tertiary)' }} />{log.grant_name || '—'}</span></td>
                        <td><RiskBadge score={log.risk_score} /></td>
                        <td>{flagged ? <span className="badge badge--red"><AlertTriangle size={10} /> Flagged</span> : <span className="badge badge--sage"><ShieldCheck size={10} /> Clear</span>}</td>
                        <td style={{ maxWidth: '180px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{log.detection_reason || '—'}</td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', whiteSpace: 'nowrap' }}>
                            <Clock size={12} style={{ color: 'var(--text-tertiary)' }} />
                            {log.checked_on ? new Date(log.checked_on).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleToggleFlag(log)}
                            disabled={toggling === log.fraud_id}
                            style={{
                              padding: '0.3rem 0.6rem', borderRadius: '5px', fontSize: '0.6875rem', fontWeight: 600,
                              border: 'none', cursor: toggling === log.fraud_id ? 'wait' : 'pointer',
                              fontFamily: 'var(--font-sans)',
                              background: flagged ? 'var(--accent-sage-light)' : 'var(--accent-red-light)',
                              color: flagged ? 'var(--accent-sage)' : 'var(--accent-red)',
                              transition: 'all var(--transition-fast)', opacity: toggling === log.fraud_id ? 0.5 : 1,
                            }}
                          >
                            {flagged ? 'Unflag' : 'Flag'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ borderTop: '1px solid var(--border-light)', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="text-caption">
                Showing {(page - 1) * ROWS_PER_PAGE + 1}–{Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length}
              </span>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
}
