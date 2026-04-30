import { Home, Users, Layers, DollarSign, Activity, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'command-center', label: 'Command Center', icon: Home },
  { id: 'beneficiaries', label: 'Beneficiary Directory', icon: Users },
  { id: 'verification', label: 'Verification Pipeline', icon: Layers },
  { id: 'finance', label: 'Grant & Finance Hub', icon: DollarSign },
  { id: 'intelligence', label: 'Intelligence Logs', icon: Activity },
];

export default function Sidebar({ activeTab, onTabChange }) {
  return (
    <aside className="sidebar" id="sidebar-nav">
      {/* ── Logo ─────────────────────────────────────────────── */}
      <div className="sidebar-logo">
        <h1>GIA HUB</h1>
        <span>Growth &amp; Inclusion Aid</span>
      </div>

      {/* ── Navigation ───────────────────────────────────────── */}
      <nav className="sidebar-nav" aria-label="Main navigation">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`nav-${id}`}
            className={`sidebar-link ${activeTab === id ? 'sidebar-link--active' : ''}`}
            onClick={() => onTabChange(id)}
            aria-current={activeTab === id ? 'page' : undefined}
          >
            <Icon size={18} strokeWidth={1.8} />
            {label}
          </button>
        ))}
      </nav>

      {/* ── Footer / User Profile ────────────────────────────── */}
      <div className="sidebar-footer">
        <div className="sidebar-avatar" aria-hidden="true">
          A
        </div>
        <div>
          <div className="sidebar-user-name">Admin User</div>
          <div className="sidebar-user-role">Administrator</div>
        </div>
      </div>
    </aside>
  );
}
