import React from 'react';
import { Shield, MapPin, Users } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { initialTeams, initialProfessionalPlayers, initialPlayers } from '../data/mockData';

export function Teams() {
  const enrichedTeams = initialTeams.map(t => {
    const proSignings = initialProfessionalPlayers.filter(pr => pr.Team_ID === t.Team_ID);
    const roster = proSignings.map(pr => {
      const p = initialPlayers.find(pl => pl.Player_ID === pr.Player_ID);
      return {
        name: p ? p.FullName : `Player #${pr.Player_ID}`,
        code: p ? p.Code : `P#${pr.Player_ID}`,
        salary: pr.Salary
      };
    });
    return {
      ...t,
      roster
    };
  });

  const columns = [
    {
      header: 'Team ID',
      accessor: 'Team_ID',
      width: '80px',
      render: (row) => <strong style={{ fontFamily: 'var(--font-mono)' }}>#{row.Team_ID}</strong>
    },
    {
      header: 'Tag',
      accessor: 'Tag',
      render: (row) => <span className="badge badge-diamond">[{row.Tag}]</span>
    },
    {
      header: 'Team Name',
      accessor: 'Name',
      render: (row) => <strong style={{ color: '#fff' }}>{row.Name}</strong>
    },
    {
      header: 'Headquarters / Location',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
          <MapPin size={13} style={{ color: 'var(--accent-cyan)' }} />
          <span>{row.City}, {row.State} ({row.Country})</span>
        </div>
      )
    },
    {
      header: 'Active Roster (Pro Players)',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {row.roster.length > 0 ? (
            row.roster.map((p, idx) => (
              <span key={idx} className="badge badge-pro" title={`Salary: $${p.salary}`}>
                {p.code}
              </span>
            ))
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>No signed players</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h2>Esports Teams & Rosters</h2>
          <p>Registered competitive organizations, regional headquarters, and active player rosters</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={enrichedTeams}
        loading={false}
        emptyMessage="No teams found."
      />
    </div>
  );
}
