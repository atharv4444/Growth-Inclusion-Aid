import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { Landmark, Wallet, ArrowUpRight, TrendingUp, CreditCard, FileText } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { fetchGrants, fetchPayments, fetchProjectedVsActual } from '../api';

function ProgressBar({ value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-elevated px-4 py-3 text-sm">
      <p className="text-text-primary font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-text-secondary">
          <span style={{ color: p.fill || p.color }}>●</span> {p.name}: ₹{Number(p.value).toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  );
}

export default function GrantFinanceHub() {
  const [grants, setGrants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchGrants(), fetchPayments(), fetchProjectedVsActual()])
      .then(([g, p, pva]) => {
        setGrants(g);
        setPayments(p);
        setBarData(pva);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalProjected = barData.reduce((s, d) => s + Number(d.projected || 0), 0);
  const totalActual = barData.reduce((s, d) => s + Number(d.actual || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-accent-amber/30 border-t-accent-amber rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
          Grant & Finance Hub
        </h1>
        <p className="text-text-muted text-sm mt-1 flex items-center gap-2">
          <Landmark size={14} className="text-accent-amber" />
          Program funding & payment tracking
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard glow="amber" delay={0}>
          <div className="p-8 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-accent-amber/15 flex items-center justify-center">
              <FileText size={20} className="text-accent-amber" />
            </div>
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider">Grant Programs</p>
              <p className="text-2xl font-bold text-accent-amber">{grants.length}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard glow="cyan" delay={0.08}>
          <div className="p-8 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-accent-cyan/15 flex items-center justify-center">
              <Wallet size={20} className="text-accent-cyan" />
            </div>
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider">Projected Aid</p>
              <p className="text-2xl font-bold text-accent-cyan">₹{totalProjected.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard glow="blue" delay={0.16}>
          <div className="p-8 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-accent-blue/15 flex items-center justify-center">
              <CreditCard size={20} className="text-accent-blue" />
            </div>
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider">Actual Disbursed</p>
              <p className="text-2xl font-bold text-accent-blue">₹{totalActual.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Bar Chart */}
      <GlassCard glow="amber" delay={0.2}>
        <div className="p-8">
          <h3 className="text-sm font-semibold text-text-primary mb-1">Projected Aid vs Actual Paid</h3>
          <p className="text-xs text-text-muted mb-4">Comparison across all grant programs</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barGap={4} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} angle={-15} textAnchor="end" height={50} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle" iconSize={8}
                  formatter={(v) => <span className="text-text-secondary text-xs ml-1">{v}</span>}
                />
                <Bar dataKey="projected" name="Projected" fill="#7b68ee" radius={[6, 6, 0, 0]} fillOpacity={0.7} />
                <Bar dataKey="actual" name="Actual Paid" fill="#06d6a0" radius={[6, 6, 0, 0]} fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>

      {/* Grant Program Cards */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Grant Programs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {grants.map((g, i) => (
            <GlassCard key={g.grant_id} glow="purple" delay={0.3 + i * 0.06} className="group/grant">
              <div className="p-8">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">{g.grant_name}</h4>
                    <p className="text-xs text-text-muted mt-1 line-clamp-2">{g.description || 'No description'}</p>
                  </div>
                  <div className="text-xs text-accent-amber font-bold whitespace-nowrap">
                    ₹{Number(g.max_amount || 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-text-muted mb-3">
                  <span>{g.total_applications || 0} applications</span>
                  <span>{g.approved_count || 0} approved</span>
                </div>

                {/* Disbursement progress - visible on hover */}
                <div className="max-h-0 overflow-hidden opacity-0 group-hover/grant:max-h-[80px] group-hover/grant:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-3" />
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-text-muted">Disbursed</span>
                    <span className="text-accent-cyan font-medium">
                      ₹{Number(g.total_disbursed || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <ProgressBar
                    value={Number(g.total_disbursed || 0)}
                    max={Number(g.max_amount || 1) * (g.approved_count || 1)}
                    color="#06d6a0"
                  />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Recent Payments */}
      <GlassCard delay={0.5} hover={false}>
        <div className="p-8">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Recent Payments</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-muted text-xs border-b border-white/6">
                  <th className="text-left py-2 font-medium">Beneficiary</th>
                  <th className="text-left py-2 font-medium">Grant</th>
                  <th className="text-right py-2 font-medium">Amount</th>
                  <th className="text-right py-2 font-medium">Date</th>
                  <th className="text-right py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 10).map((p) => (
                  <motion.tr
                    key={p.payment_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-white/4 hover:bg-white/3 transition-colors"
                  >
                    <td className="py-3 text-text-primary">{p.full_name || 'N/A'}</td>
                    <td className="py-3 text-text-secondary">{p.grant_name || 'N/A'}</td>
                    <td className="py-3 text-right text-accent-cyan font-medium">₹{Number(p.amount || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 text-right text-text-muted">
                      {p.payment_date ? new Date(p.payment_date).toLocaleDateString('en-IN') : 'N/A'}
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: p.payment_status === 'Completed' ? '#06d6a015' : '#f4a26115',
                          color: p.payment_status === 'Completed' ? '#06d6a0' : '#f4a261',
                        }}
                      >
                        {p.payment_status || 'Pending'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {payments.length === 0 && (
              <p className="text-text-muted text-center py-8">No payment records</p>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
