import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, Flame, Award, Shield } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { leaderboardApi } from '../api/leaderboardApi';

export function Leaderboards() {
  const [leaderboards, setLeaderboards] = useState([]);
  const [selectedLId, setSelectedLId] = useState(1001);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRankings = async (lId) => {
    setLoading(true);
    try {
      const ranks = await leaderboardApi.getRankings(lId);
      setRankings(ranks);
    } catch (err) {
      console.error('Failed to load rankings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const boards = await leaderboardApi.getAll();
        setLeaderboards(boards);
        if (boards.length > 0) {
          await fetchRankings(selectedLId);
        }
      } catch (err) {
        console.error('Leaderboard load error:', err);
      }
    }
    init();
  }, [selectedLId]);

  const activeBoard = leaderboards.find(b => b.L_ID === selectedLId);

  const columns = [
    {
      header: 'Rank',
      width: '75px',
      render: (_, idx) => {
        const rankClass = idx === 0 ? 'rank-gold' : idx === 1 ? 'rank-silver' : idx === 2 ? 'rank-bronze' : 'rank-default';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className={`rank-badge ${rankClass}`}>
              {idx + 1}
            </span>
          </div>
        );
      }
    },
    {
      header: 'Player',
      accessor: 'Player_Code',
      render: (row) => (
        <div>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{row.Player_Code}</span>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{row.Player_Name}</div>
        </div>
      )
    },
    {
      header: 'Match Ref',
      accessor: 'Match_ID',
      render: (row) => <span style={{ fontFamily: 'var(--font-mono)' }}>Match #{row.Match_ID}</span>
    },
    {
      header: 'Score',
      accessor: 'Score',
      render: (row) => <strong style={{ color: '#fff', fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>{Number(row.Score).toLocaleString()}</strong>
    },
    {
      header: 'K / D / A',
      render: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
          {row.Kills} / {row.Death} / {row.Assists}
        </span>
      )
    },
    {
      header: 'Headshots',
      accessor: 'Headshots',
      render: (row) => <span style={{ fontFamily: 'var(--font-mono)' }}>{row.Headshots}</span>
    },
    {
      header: 'K/D Ratio',
      accessor: 'KD_Ratio',
      render: (row) => (
        <span className="badge badge-grandmaster">
          {row.KD_Ratio}
        </span>
      )
    },
    {
      header: 'Outcome',
      accessor: 'Match_Result',
      render: (row) => (
        <span className={`badge ${row.Match_Result === 'Victory' ? 'badge-victory' : 'badge-defeat'}`}>
          {row.Match_Result}
        </span>
      )
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h2>Leaderboard Standings</h2>
          <p>Global rankings, seasonal tiers, and aggregated match performance statistics</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select 
            className="filter-select"
            value={selectedLId}
            onChange={(e) => setSelectedLId(Number(e.target.value))}
            style={{ fontSize: '0.86rem', padding: '0.5rem 0.9rem' }}
          >
            {leaderboards.map(b => (
              <option key={b.L_ID} value={b.L_ID}>
                {b.L_Type} • {Number(b.Total_Participants).toLocaleString()} players
              </option>
            ))}
          </select>

          <button 
            className="btn btn-secondary" 
            onClick={() => fetchRankings(selectedLId)} 
            disabled={loading}
            style={{ padding: '0.5rem 0.75rem' }}
            data-tooltip="Refresh Standings"
            aria-label="Refresh Standings"
          >
            <RefreshCw size={15} className={loading ? 'spinner' : ''} />
          </button>
        </div>
      </div>

      {activeBoard && (
        <div style={{
          display: 'flex',
          gap: '2rem',
          padding: '0.9rem 1.25rem',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          marginBottom: '1.25rem',
          fontSize: '0.84rem',
          flexWrap: 'wrap'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>LEADERBOARD TIER</span>
            <strong style={{ color: '#fff' }}>{activeBoard.L_Type}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>TOTAL ENTRANTS</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 600 }}>{Number(activeBoard.Total_Participants).toLocaleString()}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>LAST UPDATED</span>
            <span style={{ color: 'var(--text-secondary)' }}>{activeBoard.Last_updated}</span>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={rankings}
        loading={loading}
        emptyMessage="No player match records recorded for this leaderboard tier."
      />
    </div>
  );
}
