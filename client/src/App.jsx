import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import CommandCenter from './tabs/CommandCenter';
import BeneficiaryDirectory from './tabs/BeneficiaryDirectory';
import VerificationPipeline from './tabs/VerificationPipeline';
import GrantFinanceHub from './tabs/GrantFinanceHub';
import IntelligenceLogs from './tabs/IntelligenceLogs';

const tabComponents = {
  dashboard: CommandCenter,
  beneficiaries: BeneficiaryDirectory,
  verification: VerificationPipeline,
  grants: GrantFinanceHub,
  intelligence: IntelligenceLogs,
};

const pageVariants = {
  initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -16, filter: 'blur(6px)' },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const ActiveComponent = tabComponents[activeTab];

  return (
    <div className="flex min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main content area — offset for collapsed sidebar with breathing room */}
      <main className="flex-1 py-8 pr-8 min-w-0" style={{ marginLeft: '120px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
