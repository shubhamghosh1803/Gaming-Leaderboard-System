import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, Plus, Edit2, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { leaderboardApi } from '../api/leaderboardApi';
import { LeaderboardForm } from '../components/LeaderboardForm';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function Leaderboards() {
  const [leaderboards, setLeaderboards] = useState([]);
  const [selectedLId, setSelectedLId] = useState(1001);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [boardToDelete, setBoardToDelete] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotice = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const loadBoards = async () => {
    const boards = await leaderboardApi.getAll();
    setLeaderboards(boards);
    if (boards.length > 0 && !boards.some(board => board.L_ID === selectedLId)) {
      setSelectedLId(boards[0].L_ID);
    }
  };

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
    let cancelled = false;
    async function init() {
      setLoading(true);
      try {
        const boards = await leaderboardApi.getAll();
        if (cancelled) return;
        setLeaderboards(boards);
        const validId = boards.some(board => board.L_ID === selectedLId)
          ? selectedLId
          : boards[0]?.L_ID;
        if (validId !== selectedLId && validId != null) {
          setSelectedLId(validId);
          return;
        }
        if (validId != null) {
          const ranks = await leaderboardApi.getRankings(validId);
          if (!cancelled) setRankings(ranks);
        } else {
          setRankings([]);
        }
      } catch (err) {
        if (!cancelled) {
          setRankings([]);
          console.error('Leaderboard load error:', err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    init();
    return () => { cancelled = true; };
  }, [selectedLId]);

  const handleFormSubmit = async (formData) => {
    if (formMode === 'add') {
      await leaderboardApi.create(formData);
      showNotice('success', 'Leaderboard tier created successfully.');
    } else {
      await leaderboardApi.update(formData.L_ID, formData);
      showNotice('success', 'Leaderboard tier updated successfully.');
    }
    await loadBoards();
  };

  const handleDelete = async () => {
    await leaderboardApi.delete(boardToDelete.L_ID);
    setIsConfirmOpen(false);
    setBoardToDelete(null);
    showNotice('success', 'Leaderboard tier deleted successfully.');
    await loadBoards();
  };

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
          {row.Kills} / {row.Deaths} / {row.Assists}
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
          <button className="btn btn-primary" onClick={() => { setSelectedBoard(null); setFormMode('add'); setIsFormOpen(true); }}>
            <Plus size={15} /> Add Tier
          </button>
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

      {notification && (
        <div className={`alert-banner ${notification.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {notification.type === 'success' ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
          <span>{notification.message}</span>
        </div>
      )}

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
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.3rem' }}>
            <button className="btn-icon" onClick={() => { setSelectedBoard(activeBoard); setFormMode('edit'); setIsFormOpen(true); }} data-tooltip="Edit Tier" aria-label="Edit leaderboard tier"><Edit2 size={15} /></button>
            <button className="btn-icon delete" onClick={() => { setBoardToDelete(activeBoard); setIsConfirmOpen(true); }} data-tooltip="Delete Tier" aria-label="Delete leaderboard tier"><Trash2 size={15} /></button>
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

      <LeaderboardForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedBoard}
        mode={formMode}
      />
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Leaderboard Tier"
        message={`Are you sure you want to delete ${boardToDelete?.L_Type || 'this leaderboard'}?`}
        confirmText="Delete Tier"
      />
    </div>
  );
}
