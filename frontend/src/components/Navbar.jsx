import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

export function Navbar({ activeTitle, onToggleMobileSidebar }) {
  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <button 
          className="mobile-menu-btn" 
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="breadcrumb-title">
          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>System</span>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: '#fff' }}>{activeTitle}</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="system-status-indicator" title="Database Connection Status">
          <div className="pulse-dot"></div>
          <span>System Online</span>
        </div>

        <div className="user-profile-pill">
          <div className="avatar-circle">
            <User size={13} />
          </div>
          <span>Administrator</span>
        </div>
      </div>
    </header>
  );
}
