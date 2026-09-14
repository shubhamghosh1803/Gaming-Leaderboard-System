import React from 'react';
import { Award, Gift, Star } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { initialPlayerAchievements, initialPlayers, initialRewards } from '../data/mockData';

export function Achievements() {
  const enrichedAchievements = initialPlayerAchievements.map(a => {
    const p = initialPlayers.find(pl => pl.Player_ID === a.Player_ID);
    const r = initialRewards.find(rw => rw.Reward_ID === a.Reward_ID);
    return {
      ...a,
      player_tag: p ? p.Code : `Player #${a.Player_ID}`,
      player_name: p ? p.FullName : 'N/A',
      reward_name: r ? r.R_Type : 'N/A',
      reward_expiry: r ? r.ExpiryDate : 'N/A'
    };
  });

  const columns = [
    {
      header: 'ID',
      accessor: 'Ach_ID',
      width: '75px',
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
      header: 'Unlocked By',
      accessor: 'player_tag',
      render: (row) => (
        <div>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 500 }}>{row.player_tag}</span>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{row.player_name}</div>
        </div>
      )
    },
    {
      header: 'Reward Item',
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
          <p>Unlocked achievement milestones, leaderboard points, and associated item rewards</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={enrichedAchievements}
        loading={false}
        emptyMessage="No player achievements recorded."
      />
    </div>
  );
}
