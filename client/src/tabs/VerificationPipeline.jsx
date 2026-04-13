import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { Clock, CheckCircle, XCircle, ShieldAlert, AlertTriangle, ChevronDown } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { fetchKanban, verifyApplication, fetchFraudLogs } from '../api';

const statusConfig = {
  'Under Review': { icon: Clock, color: '#f4a261', bg: '#f4a26115' },
  'Approved': { icon: CheckCircle, color: '#06d6a0', bg: '#06d6a015' },
  'Rejected': { icon: XCircle, color: '#ef4444', bg: '#ef444415' },
};

function riskColor(score) {
  if (score >= 80) return '#ef4444';
  if (score >= 60) return '#f4a261';
  if (score >= 40) return '#f59e0b';
  return '#06d6a0';
}

function KanbanCard({ app, onVerify }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.15)' }}
      className="glass p-4 rounded-xl cursor-pointer group/kcard"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-text-primary">{app.full_name || `APP-${app.application_id}`}</p>
          <p className="text-xs text-text-muted mt-0.5">{app.grant_name || 'N/A'}</p>
        </div>
        {app.risk_score != null && (
          <div
            className="text-xs font-bold px-2 py-1 rounded-lg"
            style={{
              backgroundColor: `${riskColor(app.risk_score)}15`,
              color: riskColor(app.risk_score),
            }}
          >
            {app.risk_score}%
          </div>
        )}
      </div>

      <p className="text-xs text-text-muted">
        {app.application_date ? new Date(app.application_date).toLocaleDateString('en-IN') : ''}
      </p>

      {app.fraud_flag === 1 && (
        <div className="flex items-center gap-1 mt-2 text-xs text-accent-red">
          <AlertTriangle size={12} />
          <span>Fraud Flagged</span>
        </div>
      )}

      <AnimatePresence>
        {open && app.status === 'Under Review' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="h-px bg-white/8 my-3" />
            <div className="flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onVerify(app.application_id, 'Approved'); }}
                className="flex-1 py-2 rounded-lg text-xs font-medium bg-accent-cyan/15 text-accent-cyan
                           hover:bg-accent-cyan/25 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onVerify(app.application_id, 'Rejected'); }}
                className="flex-1 py-2 rounded-lg text-xs font-medium bg-accent-red/15 text-accent-red
                           hover:bg-accent-red/25 transition-colors"
              >
                Reject
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function VerificationPipeline() {
  const [kanban, setKanban] = useState({ 'Under Review': [], Approved: [], Rejected: [] });
  const [fraudData, setFraudData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    Promise.all([fetchKanban(), fetchFraudLogs()])
      .then(([k, f]) => {
        setKanban(k);
        setFraudData(f.map(d => ({
          ...d,
          x: d.application_id,
          y: d.risk_score,
          z: d.risk_score,
        })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleVerify = async (id, status) => {
    try {
      await verifyApplication(id, { status });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-accent-purple/30 border-t-accent-purple rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
          Verification Pipeline
        </h1>
        <p className="text-text-muted text-sm mt-1 flex items-center gap-2">
          <ShieldAlert size={14} className="text-accent-purple" />
          Kanban board & fraud risk heatmap
        </p>
      </motion.div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-3 gap-6 w-full">
        {Object.entries(statusConfig).map(([status, config], ci) => {
          const Icon = config.icon;
          const items = kanban[status] || [];
          return (
            <GlassCard key={status} delay={ci * 0.1} hover={false}>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: config.bg }}
                  >
                    <Icon size={16} style={{ color: config.color }} />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary">{status}</h3>
                  <span
                    className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: config.bg, color: config.color }}
                  >
                    {items.length}
                  </span>
                </div>

                <div className="space-y-3 kanban-column max-h-[500px] overflow-y-auto pr-1">
                  <AnimatePresence>
                    {items.map((app) => (
                      <KanbanCard
                        key={app.application_id}
                        app={app}
                        onVerify={handleVerify}
                      />
                    ))}
                  </AnimatePresence>
                  {items.length === 0 && (
                    <p className="text-xs text-text-muted text-center py-8 opacity-50">No items</p>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Risk Heatmap */}
      <GlassCard glow="red" delay={0.4}>
        <div className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-1">Risk Heatmap</h3>
          <p className="text-xs text-text-muted mb-4">
            Each point represents a fraud check — size & color indicate risk severity
          </p>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="x" name="Application ID" stroke="#6b7280"
                  fontSize={11} tickLine={false} axisLine={false}
                  label={{ value: 'Application ID', offset: -5, position: 'insideBottom', fill: '#6b7280', fontSize: 11 }}
                />
                <YAxis
                  dataKey="y" name="Risk Score" stroke="#6b7280" domain={[0, 100]}
                  fontSize={11} tickLine={false} axisLine={false}
                  label={{ value: 'Risk Score', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 11 }}
                />
                <ZAxis dataKey="z" range={[40, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)' }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="glass-elevated px-4 py-3 text-sm">
                        <p className="font-semibold text-text-primary mb-1">{d.full_name || `APP-${d.application_id}`}</p>
                        <p className="text-text-secondary">Risk: <span style={{ color: riskColor(d.risk_score) }}>{d.risk_score}%</span></p>
                        {d.detection_reason && <p className="text-xs text-text-muted mt-1">{d.detection_reason}</p>}
                      </div>
                    );
                  }}
                />
                <Scatter data={fraudData}>
                  {fraudData.map((d, i) => (
                    <Cell key={i} fill={riskColor(d.risk_score)} fillOpacity={0.7} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
