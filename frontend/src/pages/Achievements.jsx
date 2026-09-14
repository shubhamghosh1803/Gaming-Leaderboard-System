import React, { useState, useEffect } from 'react';
import { Award, Gift } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { achievementsApi } from '../api/achievementsApi';

export function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await achievementsApi.getAll();
        setAchievements(data);
      } catch (err) {
        console.error('Failed to load achievements:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const columns = [
    {
      header: 'ID (Ach_ID)',
      accessor: 'Ach_ID',
      width: '85px',
      render: (row) => <strong style={{ fontFamily: 'var(--font-mono)' }}>#{row.Ach_ID}</strong>
    },
    {
      header: 'Milestone Category',
      accessor: 'Category',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Award size={15} style={{ color: 'var(--accent-purple)' }} />
          <strong style={{ color: '#fff' }}>{row.Category}</strong>
        </div>
      )
    },
    {
      header: 'Points Awarded',
      accessor: 'Points',
      render: (row) => (
        <span style={{ color: 'var(--accent-amber)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
          +{row.Points} pts
        </span>
      )
    },
    {
      header: 'Unlocked By (Player_ID)',
      accessor: 'player_tag',
      render: (row) => (
        <div>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 500 }}>{row.player_tag}</span>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{row.player_name}</div>
        </div>
      )
    },
    {
      header: 'Reward Item (Reward_ID)',
      accessor: 'reward_name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Gift size={13} style={{ color: 'var(--accent-emerald)' }} />
          <span className="badge badge-pro">{row.reward_name}</span>
        </div>
      )
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h2>Player Achievements</h2>
          <p>Unlocked achievement milestones, leaderboard points, and associated item rewards (Player_Achievement Relation)</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={achievements}
        loading={loading}
        emptyMessage="No player achievements recorded."
      />
    </div>
  );
}
