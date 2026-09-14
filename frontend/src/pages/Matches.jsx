import React from 'react';
import { Swords, CheckCircle2, Clock } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { initialMatches, initialRepresentsIn, initialPlayers, initialTeams } from '../data/mockData';

export function Matches() {
  const enrichedMatches = initialMatches.map(m => {
    const reps = initialRepresentsIn.filter(r => r.Match_ID === m.Match_ID);
    const participants = reps.map(r => {
      const p = initialPlayers.find(pl => pl.Player_ID === r.Player_ID);
      const t = initialTeams.find(tm => tm.Team_ID === r.Team_ID);
      return {
        tag: p ? p.Code : `P#${r.Player_ID}`,
        team: t ? t.Tag : 'N/A'
      };
    });
    return {
      ...m,
      participants
    };
  });

  const columns = [
    {
      header: 'Match ID',
      accessor: 'Match_ID',
      width: '90px',
      render: (row) => <strong style={{ fontFamily: 'var(--font-mono)' }}>#{row.Match_ID}</strong>
    },
    {
      header: 'Status',
      accessor: 'Status',
      render: (row) => (
        <span style={{ color: row.Status === 'Completed' ? 'var(--accent-emerald)' : 'var(--accent-amber)', fontWeight: 500, fontSize: '0.82rem' }}>
          ● {row.Status}
        </span>
      )
    },
    {
      header: 'Match Score',
      accessor: 'Score',
      render: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
          {row.Score} pts
        </span>
      )
    },
    {
      header: 'Duration',
      accessor: 'Duration',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
          <Clock size={13} />
          <span>{row.Duration} mins</span>
        </div>
      )
    },
    {
      header: 'Result',
      accessor: 'Result',
      render: (row) => (
        <span className={`badge ${row.Result === 'Victory' ? 'badge-victory' : row.Result === 'Defeat' ? 'badge-defeat' : 'badge-silver'}`}>
          {row.Result}
        </span>
      )
    },
    {
      header: 'Participants / Representation',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {row.participants.length > 0 ? (
            row.participants.map((p, idx) => (
              <span key={idx} className="badge badge-pro">
                [{p.team}] {p.tag}
              </span>
            ))
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Open Lobby</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h2>Match History & Outcomes</h2>
          <p>Official match records, scores, duration, and participant representation</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={enrichedMatches}
        loading={false}
        emptyMessage="No match records found."
      />
    </div>
  );
}
