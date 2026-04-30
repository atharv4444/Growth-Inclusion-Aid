import { useState } from 'react';
import Sidebar from './components/Sidebar';
import CommandCenter from './tabs/CommandCenter';
import BeneficiaryDirectory from './tabs/BeneficiaryDirectory';
import VerificationPipeline from './tabs/VerificationPipeline';
import GrantFinanceHub from './tabs/GrantFinanceHub';
import IntelligenceLogs from './tabs/IntelligenceLogs';

const VIEWS = {
  'command-center': CommandCenter,
  beneficiaries: BeneficiaryDirectory,
  verification: VerificationPipeline,
  finance: GrantFinanceHub,
  intelligence: IntelligenceLogs,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('command-center');
  const ActiveView = VIEWS[activeTab] || CommandCenter;

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content" id="main-content">
        <ActiveView />
      </main>
    </div>
  );
}
