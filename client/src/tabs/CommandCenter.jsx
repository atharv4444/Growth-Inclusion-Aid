import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Users, DollarSign, FileCheck, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { fetchSummary, fetchFundAllocation, fetchApplicationFlow } from '../api';

const CHART_COLORS = ['#06d6a0', '#4cc9f0', '#7b68ee', '#f4a261', '#f72585', '#a78bfa'];

const statCards = [
  { key: 'totalBeneficiaries', label: 'Total Beneficiaries', icon: Users, glow: 'cyan', color: '#06d6a0' },
  { key: 'totalDisbursed', label: 'Total Disbursed', icon: DollarSign, glow: 'blue', color: '#4cc9f0', prefix: '₹' },
  { key: 'pendingReview', label: 'Pending Reviews', icon: FileCheck, glow: 'purple', color: '#7b68ee' },
  { key: 'flaggedFraud', label: 'Fraud Flagged', icon: AlertTriangle, glow: 'red', color: '#ef4444' },
];

function AnimatedNumber({ value, prefix = '' }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  const formatted = typeof display === 'number' && display > 999
    ? display.toLocaleString('en-IN')
    : display;
  return <span>{prefix}{formatted}</span>;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-elevated px-4 py-3 text-sm">
      <p className="text-text-primary font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-text-secondary">
          <span style={{ color: p.color }}>●</span> {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function CommandCenter() {
  const [summary, setSummary] = useState({});
  const [fundData, setFundData] = useState([]);
  const [flowData, setFlowData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchSummary(), fetchFundAllocation(), fetchApplicationFlow()])
      .then(([s, f, a]) => {
        setSummary(s);
        setFundData(f);
        setFlowData(a.map(r => ({ ...r, date: new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
          Command Center
        </h1>
        <p className="text-text-muted mt-1 text-sm flex items-center gap-2">
          <Activity size={14} className="text-accent-cyan" />
          Real-time overview of all GIA operations
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const value = summary[card.key] || 0;
          return (
            <GlassCard key={card.key} glow={card.glow} delay={i * 0.08}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-text-muted text-xs font-medium uppercase tracking-wider">
                    {card.label}
                  </span>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${card.color}15` }}
                  >
                    <Icon size={18} style={{ color: card.color }} />
                  </div>
                </div>
                <div className="text-3xl font-bold tracking-tight" style={{ color: card.color }}>
                  <AnimatedNumber value={value} prefix={card.prefix || ''} />
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-accent-cyan">
                  <TrendingUp size={12} />
                  <span>Live</span>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
        {/* Donut Chart */}
        <GlassCard className="lg:col-span-2" glow="purple" delay={0.3}>
          <div className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-1">Fund Allocation by Grant</h3>
            <p className="text-xs text-text-muted mb-4">Distribution of completed payments</p>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fundData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {fundData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => <span className="text-text-secondary text-xs ml-1">{v}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassCard>

        {/* Area Chart */}
        <GlassCard className="lg:col-span-3" glow="cyan" delay={0.4}>
          <div className="p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-1">Application Flow</h3>
            <p className="text-xs text-text-muted mb-4">Last 30 days application activity</p>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={flowData}>
                  <defs>
                    <linearGradient id="gradApproved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06d6a0" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#06d6a0" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4cc9f0" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#4cc9f0" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradRejected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="total" stroke="#4cc9f0" strokeWidth={2} fill="url(#gradTotal)" name="Total" />
                  <Area type="monotone" dataKey="approved" stroke="#06d6a0" strokeWidth={2} fill="url(#gradApproved)" name="Approved" />
                  <Area type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} fill="url(#gradRejected)" name="Rejected" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
