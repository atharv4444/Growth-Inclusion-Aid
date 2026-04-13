import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Landmark,
  BrainCircuit,
  Hexagon,
} from 'lucide-react';

const tabs = [
  { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, color: '#06d6a0' },
  { id: 'beneficiaries', label: 'Beneficiary Directory', icon: Users, color: '#4cc9f0' },
  { id: 'verification', label: 'Verification Pipeline', icon: ShieldCheck, color: '#7b68ee' },
  { id: 'grants', label: 'Grant & Finance', icon: Landmark, color: '#f4a261' },
  { id: 'intelligence', label: 'Intelligence & Logs', icon: BrainCircuit, color: '#f72585' },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass-sidebar fixed left-0 top-0 bottom-0 w-[72px] hover:w-[260px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-50 flex flex-col items-center py-6 group overflow-hidden"
    >
      {/* Logo */}
      <motion.div
        className="flex items-center gap-3 mb-10 px-4 w-full"
        whileHover={{ scale: 1.05 }}
      >
        <div className="min-w-[40px] h-10 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center border border-white/10">
          <Hexagon size={22} className="text-accent-cyan" />
        </div>
        <span className="text-lg font-bold text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 tracking-tight">
          GIA HUB
        </span>
      </motion.div>

      {/* Nav Items */}
      <nav className="flex flex-col space-y-4 w-full px-3 flex-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 w-full text-left ${
                isActive
                  ? 'bg-white/8 border border-white/10'
                  : 'hover:bg-white/4 border border-transparent'
              }`}
              style={isActive ? {
                boxShadow: `0 0 20px ${tab.color}15, 0 0 60px ${tab.color}08`,
              } : {}}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full"
                  style={{ backgroundColor: tab.color }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                className="min-w-[20px] transition-colors duration-300"
                style={{ color: isActive ? tab.color : '#6b7280' }}
              />
              <span
                className={`whitespace-nowrap text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 ${
                  isActive ? 'text-text-primary' : 'text-text-secondary'
                }`}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom accent */}
      <div className="px-4 w-full">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />
        <div className="flex items-center gap-3 px-3">
          <div className="min-w-[8px] h-2 w-2 rounded-full bg-accent-cyan pulse-live" />
          <span className="text-xs text-text-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            System Online
          </span>
        </div>
      </div>
    </motion.aside>
  );
}
