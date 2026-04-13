import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, MessageCircle, AlertTriangle, Shield, Clock, User, Zap } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { fetchChatbotQueries, fetchFraudLogs, fetchHighRisk } from '../api';

function TimeAgo({ date }) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return <span>just now</span>;
  if (mins < 60) return <span>{mins}m ago</span>;
  if (hours < 24) return <span>{hours}h ago</span>;
  return <span>{days}d ago</span>;
}

function riskColor(score) {
  if (score >= 80) return '#ef4444';
  if (score >= 60) return '#f4a261';
  if (score >= 40) return '#f59e0b';
  return '#06d6a0';
}

export default function IntelligenceLogs() {
  const [queries, setQueries] = useState([]);
  const [fraudLogs, setFraudLogs] = useState([]);
  const [highRisk, setHighRisk] = useState([]);
  const [activeStream, setActiveStream] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchChatbotQueries(), fetchFraudLogs(), fetchHighRisk()])
      .then(([q, f, h]) => {
        setQueries(q);
        setFraudLogs(f);
        setHighRisk(h);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filters = [
    { id: 'all', label: 'All Logs' },
    { id: 'queries', label: 'Chatbot Queries' },
    { id: 'fraud', label: 'Fraud Alerts' },
    { id: 'critical', label: 'Critical Only' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-accent-pink/30 border-t-accent-pink rounded-full"
        />
      </div>
    );
  }

  // Build combined timeline
  let timeline = [];
  if (activeStream === 'all' || activeStream === 'queries') {
    timeline.push(...queries.map(q => ({
      type: 'query',
      id: `q-${q.query_id}`,
      timestamp: q.timestamp,
      name: q.full_name || `Beneficiary #${q.beneficiary_id}`,
      content: q.question,
    })));
  }
  if (activeStream === 'all' || activeStream === 'fraud') {
    timeline.push(...fraudLogs.map(f => ({
      type: 'fraud',
      id: `f-${f.fraud_id}`,
      timestamp: f.checked_on,
      name: f.full_name || `APP-${f.application_id}`,
      content: f.detection_reason || 'Automated check',
      riskScore: f.risk_score,
      flagged: f.fraud_flag,
      grantName: f.grant_name,
    })));
  }
  if (activeStream === 'critical') {
    timeline = highRisk.map(f => ({
      type: 'fraud',
      id: `h-${f.fraud_id}`,
      timestamp: f.checked_on,
      name: f.full_name || `APP-${f.application_id}`,
      content: f.detection_reason || 'High risk detected',
      riskScore: f.risk_score,
      flagged: f.fraud_flag,
      grantName: f.grant_name,
    }));
  }

  timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
          Intelligence & Logs
        </h1>
        <p className="text-text-muted text-sm mt-1 flex items-center gap-2">
          <BrainCircuit size={14} className="text-accent-pink" />
          Real-time event stream & threat intelligence
        </p>
      </motion.div>

      {/* High Risk Summary */}
      {highRisk.length > 0 && (
        <GlassCard glow="red" delay={0.1}>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent-red/15 flex items-center justify-center">
                <Shield size={20} className="text-accent-red" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-accent-red">⚠ Active Threat Summary</h3>
                <p className="text-xs text-text-muted">{highRisk.length} high-risk items require attention</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {highRisk.slice(0, 6).map((item, i) => (
                <motion.div
                  key={item.fraud_id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="glass rounded-xl p-3 border-l-2"
                  style={{
                    borderLeftColor: riskColor(item.risk_score),
                    boxShadow: `0 0 15px ${riskColor(item.risk_score)}15`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-text-primary">{item.full_name || `APP-${item.application_id}`}</span>
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: `${riskColor(item.risk_score)}20`, color: riskColor(item.risk_score) }}
                    >
                      {item.risk_score}%
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted truncate">{item.detection_reason || 'Risk threshold exceeded'}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Stream Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <motion.button
            key={f.id}
            onClick={() => setActiveStream(f.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 border ${
              activeStream === f.id
                ? 'bg-white/8 border-white/15 text-text-primary'
                : 'bg-white/2 border-white/6 text-text-muted hover:bg-white/5'
            }`}
          >
            {f.label}
            {f.id === 'critical' && highRisk.length > 0 && (
              <span className="ml-1.5 w-2 h-2 rounded-full bg-accent-red inline-block pulse-live" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Event Stream */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {timeline.slice(0, 50).map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, delay: i * 0.02 }}
              className={`glass rounded-xl p-4 flex items-start gap-4 ${
                item.type === 'fraud' && item.riskScore >= 70
                  ? 'border-l-2 border-l-accent-red glow-red'
                  : item.type === 'fraud'
                  ? 'border-l-2 border-l-accent-amber'
                  : ''
              }`}
            >
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  backgroundColor: item.type === 'fraud'
                    ? `${riskColor(item.riskScore)}15`
                    : '#4cc9f015',
                }}
              >
                {item.type === 'fraud' ? (
                  <AlertTriangle size={16} style={{ color: riskColor(item.riskScore) }} />
                ) : (
                  <MessageCircle size={16} className="text-accent-blue" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-text-primary">{item.name}</span>
                  {item.type === 'fraud' && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${riskColor(item.riskScore)}20`,
                        color: riskColor(item.riskScore),
                      }}
                    >
                      RISK {item.riskScore}%
                    </span>
                  )}
                  {item.type === 'fraud' && item.flagged === 1 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent-red/20 text-accent-red">
                      FLAGGED
                    </span>
                  )}
                  {item.type === 'query' && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-accent-blue/15 text-accent-blue">
                      QUERY
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">{item.content}</p>
                {item.grantName && (
                  <p className="text-[11px] text-text-muted mt-1">Grant: {item.grantName}</p>
                )}
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-1 text-xs text-text-muted shrink-0">
                <Clock size={11} />
                <TimeAgo date={item.timestamp} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {timeline.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Zap size={48} className="mx-auto text-text-muted/30 mb-4" />
            <p className="text-text-muted">No events in this stream</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
