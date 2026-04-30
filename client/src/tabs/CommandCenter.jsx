import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  DollarSign,
  Clock,
  ShieldAlert,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  fetchSummary,
  fetchFundAllocation,
  fetchApplicationFlow,
} from '../api';

/* ═══════════════════════════════════════════════════════════════
   KPI Card
   ═══════════════════════════════════════════════════════════════ */
function KpiCard({ icon: Icon, label, value, accent, delay }) {
  return (
    <motion.div
      className={`card kpi-card kpi-card--${accent}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className={`kpi-icon-wrapper kpi-icon-wrapper--${accent}`}>
          <Icon size={20} strokeWidth={1.8} />
        </div>
      </div>
      <div>
        <div className="kpi-number">{value}</div>
        <div className="heading-sm" style={{ marginTop: '0.25rem' }}>
          {label}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Custom Recharts Tooltip
   ═══════════════════════════════════════════════════════════════ */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-light)',
        borderRadius: '6px',
        padding: '0.75rem 1rem',
        boxShadow: 'var(--shadow-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.8125rem',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: '0.375rem', color: 'var(--text-primary)' }}>
        {label}
      </div>
      {payload.map((entry, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.125rem',
            color: 'var(--text-secondary)',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: entry.color,
              display: 'inline-block',
            }}
          />
          <span>{entry.name}:&nbsp;</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {typeof entry.value === 'number'
              ? entry.value.toLocaleString()
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Command Center — Main View
   ═══════════════════════════════════════════════════════════════ */
export default function CommandCenter() {
  const [summary, setSummary] = useState(null);
  const [fundData, setFundData] = useState([]);
  const [flowData, setFlowData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, f, a] = await Promise.all([
          fetchSummary(),
          fetchFundAllocation(),
          fetchApplicationFlow(),
        ]);
        setSummary(s);
        setFundData(f);
        setFlowData(
          a.map((d) => ({
            ...d,
            date: new Date(d.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
          }))
        );
      } catch (err) {
        console.error('CommandCenter load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ── Currency formatter ───────────────────────────────────── */
  const fmt = (n) =>
    n != null
      ? `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
      : '—';

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div className="text-body" style={{ color: 'var(--text-tertiary)' }}>
          Loading dashboard…
        </div>
      </div>
    );
  }

  return (
    <section id="command-center">
      {/* ── Page Header ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '2rem' }}
      >
        <h1 className="heading-xl">Command Center</h1>
        <p className="text-body" style={{ marginTop: '0.375rem' }}>
          Real-time overview of all GIA operations
        </p>
      </motion.div>

      {/* ── KPI Row ────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <KpiCard
          icon={Users}
          label="Total Beneficiaries"
          value={summary?.totalBeneficiaries?.toLocaleString() ?? '—'}
          accent="sage"
          delay={0}
        />
        <KpiCard
          icon={DollarSign}
          label="Total Disbursed"
          value={fmt(summary?.totalDisbursed)}
          accent="gold"
          delay={0.08}
        />
        <KpiCard
          icon={Clock}
          label="Pending Reviews"
          value={summary?.pendingReview?.toLocaleString() ?? '—'}
          accent="purple"
          delay={0.16}
        />
        <KpiCard
          icon={ShieldAlert}
          label="Fraud Flagged"
          value={summary?.flaggedFraud?.toLocaleString() ?? '—'}
          accent="red"
          delay={0.24}
        />
      </div>

      {/* ── Charts Grid ────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* ─ Fund Allocation Bar Chart ────────────────────────── */}
        <motion.div
          className="card card-elevated"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ padding: '1.5rem' }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 className="heading-md">Fund Allocation by Grant</h2>
            <p className="text-caption" style={{ marginTop: '0.25rem' }}>
              Completed disbursements across programs
            </p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={fundData}
                margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
                barCategoryGap="30%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-light)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: 'var(--text-tertiary)', fontFamily: 'var(--font-sans)' }}
                  axisLine={{ stroke: 'var(--border-light)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: 'var(--text-tertiary)', fontFamily: 'var(--font-sans)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  name="Disbursed"
                  fill="var(--accent-sage)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ─ Application Flow Area Chart ──────────────────────── */}
        <motion.div
          className="card card-elevated"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ padding: '1.5rem' }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 className="heading-md">Application Flow</h2>
            <p className="text-caption" style={{ marginTop: '0.25rem' }}>
              Application activity over the last 30 days
            </p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={flowData}
                margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
              >
                <defs>
                  <linearGradient id="gradApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-sage)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--accent-sage)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradRejected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-terracotta)" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="var(--accent-terracotta)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-light)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: 'var(--text-tertiary)', fontFamily: 'var(--font-sans)' }}
                  axisLine={{ stroke: 'var(--border-light)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: 'var(--text-tertiary)', fontFamily: 'var(--font-sans)' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)' }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke="var(--accent-blue)"
                  strokeWidth={2}
                  fill="url(#gradTotal)"
                />
                <Area
                  type="monotone"
                  dataKey="approved"
                  name="Approved"
                  stroke="var(--accent-sage)"
                  strokeWidth={2}
                  fill="url(#gradApproved)"
                />
                <Area
                  type="monotone"
                  dataKey="rejected"
                  name="Rejected"
                  stroke="var(--accent-terracotta)"
                  strokeWidth={1.5}
                  fill="url(#gradRejected)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
