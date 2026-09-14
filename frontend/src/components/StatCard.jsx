import React from 'react';

export function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-label">{title}</span>
        {Icon && (
          <div className="stat-icon-wrapper" style={{ color: color || 'var(--accent-primary)', background: color ? `${color}20` : 'rgba(99, 102, 241, 0.15)' }}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    </div>
  );
}
