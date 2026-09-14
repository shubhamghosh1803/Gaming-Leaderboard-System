import React from 'react';
import { Modal } from './Modal';
import { User, Shield, Trophy, Mail, Calendar, DollarSign, Award } from 'lucide-react';

export function PlayerDetailModal({ isOpen, onClose, player }) {
  if (!player) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Player Profile • ${player.Code}`} maxWidth="580px">
      <div className="modal-body">
        {/* Profile Card Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          marginBottom: '1.25rem'
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.2rem'
          }}>
            {player.Code.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 700 }}>
              {player.FullName}
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span className="badge badge-diamond">{player.Code}</span>
              <span className="badge badge-grandmaster">{player.Skill_level}</span>
              {player.PlayerType !== 'Standard' && (
                <span className="badge badge-pro">{player.PlayerType}</span>
              )}
            </div>
          </div>
        </div>

        {/* Attribute Details Grid */}
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Player ID</span>
            <div className="detail-val" style={{ fontFamily: 'var(--font-mono)' }}>#{player.Player_ID}</div>
          </div>

          <div className="detail-item">
            <span className="detail-label">Date of Birth</span>
            <div className="detail-val">{player.DOB}</div>
          </div>

          <div className="detail-item">
            <span className="detail-label">Linked Account ID</span>
            <div className="detail-val">Account #{player.Acc_ID}</div>
          </div>

          <div className="detail-item">
            <span className="detail-label">Account Email</span>
            <div className="detail-val" style={{ fontSize: '0.82rem' }}>{player.Account_Email}</div>
          </div>

          {player.PlayerType === 'Casual' && (
            <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
              <span className="detail-label">Preferred Casual Score</span>
              <div className="detail-val" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                {player.Specialization?.Pref_score} pts
              </div>
            </div>
          )}

          {player.PlayerType === 'Competitive' && (
            <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
              <span className="detail-label">Competitive Rank</span>
              <div className="detail-val" style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>
                {player.Specialization?.Rank}
              </div>
            </div>
          )}

          {player.PlayerType === 'Professional' && (
            <>
              <div className="detail-item">
                <span className="detail-label">Contracted Team</span>
                <div className="detail-val">
                  [{player.Specialization?.Team_Tag}] {player.Specialization?.Team_Name}
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-label">Annual Salary</span>
                <div className="detail-val" style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>
                  ${Number(player.Specialization?.Salary || 0).toLocaleString()}
                </div>
              </div>
            </>
          )}

          {player.Emails && player.Emails.length > 0 && (
            <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
              <span className="detail-label">Registered Contact Emails</span>
              <div className="detail-val" style={{ fontSize: '0.82rem', marginTop: '0.35rem' }}>
                {player.Emails.map((email, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <Mail size={12} /> {email}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}
