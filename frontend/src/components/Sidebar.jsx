import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  Swords,
  Shield,
  Gamepad2,
  Award,
  Gift,
  Monitor,
  Terminal
} from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, isOpen, onCloseMobile }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'players', label: 'Players', icon: Users },
    { id: 'leaderboards', label: 'Leaderboard', icon: Trophy },
    { id: 'matches', label: 'Matches', icon: Swords },
    { id: 'teams', label: 'Teams', icon: Shield },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'platforms', label: 'Platforms', icon: Monitor },
    { id: 'sql-console', label: 'SQL Console', icon: Terminal }
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {isOpen && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 35 }} 
          onClick={onCloseMobile} 
          aria-hidden="true" 
        />
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-badge">
            <Trophy size={20} />
          </div>
          <div className="app-title-group">
            <h1>Gaming DB</h1>
            <span>Leaderboard & Player Stats</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Gaming Analytics Engine</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>v1.2.0</span>
        </div>
      </aside>
    </>
  );
}
