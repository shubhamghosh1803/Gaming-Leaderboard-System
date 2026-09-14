import React from 'react';
import { Gamepad2, Calendar, Users } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { initialGames, initialPlayers } from '../data/mockData';

export function Games() {
  const enrichedGames = initialGames.map(g => {
    const featured = initialPlayers.find(p => p.Player_ID === g.Player_ID);
    return {
      ...g,
      featured_player: featured ? featured.Code : `Player #${g.Player_ID}`
    };
  });

  const columns = [
    {
      header: 'Game ID',
      accessor: 'G_ID',
      width: '80px',
      render: (row) => <strong style={{ fontFamily: 'var(--font-mono)' }}>#{row.G_ID}</strong>
    },
    {
      header: 'Game Title',
      accessor: 'Name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Gamepad2 size={16} style={{ color: 'var(--accent-cyan)' }} />
          <strong style={{ color: '#fff' }}>{row.Name}</strong>
        </div>
      )
    },
    {
      header: 'Developer / Publisher',
      accessor: 'Developer',
      render: (row) => <span style={{ color: 'var(--text-secondary)' }}>{row.Developer}</span>
    },
    {
      header: 'Release Date',
      accessor: 'RDate',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
          <Calendar size={13} />
          <span>{row.RDate}</span>
        </div>
      )
    },
    {
      header: 'Max Capacity',
      accessor: 'Max_Player',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-primary)' }}>
          <Users size={13} />
          <span>{row.Max_Player} Players</span>
        </div>
      )
    },
    {
      header: 'Featured Player',
      accessor: 'featured_player',
      render: (row) => <span className="badge badge-diamond">{row.featured_player}</span>
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h2>Game Catalog</h2>
          <p>Supported competitive titles, developers, server capacity, and featured players</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={enrichedGames}
        loading={false}
        emptyMessage="No games registered."
      />
    </div>
  );
}
