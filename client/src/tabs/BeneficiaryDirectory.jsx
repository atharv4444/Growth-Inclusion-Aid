import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Phone, Mail, MapPin, IndianRupee, Search, UserPlus } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { fetchBeneficiaries } from '../api';

export default function BeneficiaryDirectory() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBeneficiaries()
      .then(setBeneficiaries)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = beneficiaries.filter(b =>
    b.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.email?.toLowerCase().includes(search.toLowerCase()) ||
    b.address?.toLowerCase().includes(search.toLowerCase())
  );

  const genderColor = (g) => {
    if (g === 'Male') return '#4cc9f0';
    if (g === 'Female') return '#f72585';
    return '#7b68ee';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-accent-blue/30 border-t-accent-blue rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
            Beneficiary Directory
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {filtered.length} registered beneficiaries
          </p>
        </div>
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, email, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder-text-muted
                       bg-white/3 border border-white/8 rounded-xl outline-none
                       focus:border-accent-cyan/40 focus:ring-1 focus:ring-accent-cyan/20
                       transition-all duration-300 w-full sm:w-[320px]"
          />
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((b, i) => (
            <GlassCard key={b.beneficiary_id} glow="blue" delay={i * 0.04} className="group/card">
              <div className="p-5">
                {/* Avatar + Name */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                    style={{
                      backgroundColor: `${genderColor(b.gender)}15`,
                      color: genderColor(b.gender),
                    }}
                  >
                    {b.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-text-primary truncate">{b.full_name}</h3>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1"
                      style={{
                        backgroundColor: `${genderColor(b.gender)}15`,
                        color: genderColor(b.gender),
                      }}
                    >
                      {b.gender || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* DOB */}
                <p className="text-xs text-text-muted mb-3">
                  DOB: {b.dob ? new Date(b.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                </p>

                {/* Hidden info revealed on hover */}
                <div className="space-y-2 max-h-0 overflow-hidden opacity-0 group-hover/card:max-h-[200px] group-hover/card:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />

                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Phone size={13} className="text-accent-cyan shrink-0" />
                    <span className="truncate">{b.phone || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Mail size={13} className="text-accent-blue shrink-0" />
                    <span className="truncate">{b.email || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <MapPin size={13} className="text-accent-purple shrink-0" />
                    <span className="truncate">{b.address || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <IndianRupee size={13} className="text-accent-amber shrink-0" />
                    <span>Income: ₹{b.income_level?.toLocaleString('en-IN') || 'N/A'}</span>
                  </div>
                </div>

                {/* Hover hint */}
                <p className="text-[10px] text-text-muted mt-3 opacity-60 group-hover/card:opacity-0 transition-opacity duration-300 italic">
                  Hover to reveal details
                </p>
              </div>
            </GlassCard>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Users size={48} className="mx-auto text-text-muted/30 mb-4" />
          <p className="text-text-muted">No beneficiaries found</p>
        </motion.div>
      )}
    </div>
  );
}
