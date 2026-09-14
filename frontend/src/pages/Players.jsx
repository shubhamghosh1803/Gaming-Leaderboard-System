import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  Mail,
  Filter
} from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { PlayerForm } from '../components/PlayerForm';
import { PlayerDetailModal } from '../components/PlayerDetailModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { playerApi } from '../api/playerApi';

export function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [viewingPlayer, setViewingPlayer] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [notification, setNotification] = useState(null);

  const loadPlayers = async () => {
    setLoading(true);
    try {
      const data = await playerApi.getAll();
      setPlayers(data);
    } catch (err) {
      showNotice('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const showNotice = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleOpenAdd = () => {
    setSelectedPlayer(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (player) => {
    setSelectedPlayer(player);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleOpenView = (player) => {
    setViewingPlayer(player);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (player) => {
    setPlayerToDelete(player);
    setIsConfirmOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (formMode === 'add') {
      await playerApi.create(formData);
      showNotice('success', `Player #${formData.Player_ID} (${formData.Code}) added successfully.`);
    } else {
      await playerApi.update(formData.Player_ID, formData);
      showNotice('success', `Player #${formData.Player_ID} updated successfully.`);
    }
    await loadPlayers();
  };

  const handleConfirmDelete = async () => {
    if (!playerToDelete) return;
    setDeleteLoading(true);
    try {
      await playerApi.delete(playerToDelete.Player_ID);
      showNotice('success', `Player #${playerToDelete.Player_ID} deleted successfully.`);
      setIsConfirmOpen(false);
      setPlayerToDelete(null);
      await loadPlayers();
    } catch (err) {
      showNotice('error', err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredPlayers = players.filter(p => {
    const term = search.toLowerCase();
    const matchesSearch = 
      p.Code?.toLowerCase().includes(term) ||
      p.FullName?.toLowerCase().includes(term) ||
      String(p.Player_ID).includes(term) ||
      p.Account_Email?.toLowerCase().includes(term);

    const matchesSkill = skillFilter === 'ALL' || p.Skill_level === skillFilter;
    const matchesType = typeFilter === 'ALL' || p.PlayerType === typeFilter;

    return matchesSearch && matchesSkill && matchesType;
  });

  const getSkillBadgeClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'grandmaster': return 'badge-grandmaster';
      case 'master': return 'badge-master';
      case 'diamond': return 'badge-diamond';
      case 'platinum': return 'badge-platinum';
      case 'gold': return 'badge-gold';
      default: return 'badge-silver';
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'Player_ID',
      width: '70px',
      render: (row) => <strong style={{ fontFamily: 'var(--font-mono)' }}>#{row.Player_ID}</strong>
    },
    {
      header: 'Gamer Tag (Code)',
      accessor: 'Code',
      render: (row) => (
        <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
          {row.Code}
        </span>
      )
    },
    {
      header: 'Full Name',
      accessor: 'FullName',
      render: (row) => (
        <div>
          <div style={{ color: '#fff', fontWeight: 500 }}>{row.FullName}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Born: {row.DOB}</div>
        </div>
      )
    },
    {
      header: 'Skill Level',
      accessor: 'Skill_level',
      render: (row) => (
        <span className={`badge ${getSkillBadgeClass(row.Skill_level)}`}>
          {row.Skill_level}
        </span>
      )
    },
    {
      header: 'Linked Account',
      accessor: 'Acc_ID',
      render: (row) => (
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
            #{row.Acc_ID} • {row.Account_Email}
          </div>
          {row.Emails?.length > 0 && (
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
              <Mail size={11} /> {row.Emails[0]} {row.Emails.length > 1 ? `(+${row.Emails.length - 1})` : ''}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'PlayerType',
      render: (row) => {
        if (row.PlayerType === 'Professional') {
          return (
            <div>
              <span className="badge badge-pro">Pro • {row.Specialization?.Team_Tag || 'Team'}</span>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                ${Number(row.Specialization?.Salary || 0).toLocaleString()}/yr
              </div>
            </div>
          );
        }
        if (row.PlayerType === 'Competitive') {
          return (
            <div>
              <span className="badge badge-diamond">{row.Specialization?.Rank}</span>
            </div>
          );
        }
        if (row.PlayerType === 'Casual') {
          return (
            <div>
              <span className="badge badge-silver">{row.Specialization?.Pref_score} pts</span>
            </div>
          );
        }
        return <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Standard</span>;
      }
    },
    {
      header: 'Actions',
      width: '120px',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
          <button 
            className="btn-icon" 
            onClick={() => handleOpenView(row)} 
            data-tooltip="View Details"
            aria-label={`View ${row.Code} details`}
          >
            <Eye size={15} />
          </button>
          <button 
            className="btn-icon" 
            onClick={() => handleOpenEdit(row)} 
            data-tooltip="Edit Player"
            aria-label={`Edit ${row.Code}`}
          >
            <Edit2 size={15} />
          </button>
          <button 
            className="btn-icon delete" 
            onClick={() => handleOpenDelete(row)} 
            data-tooltip="Delete Player"
            aria-label={`Delete ${row.Code}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h2>Player Directory</h2>
          <p>Manage player profiles, rosters, ranking tiers, and account links</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <UserPlus size={15} />
          Add Player
        </button>
      </div>

      {notification && (
        <div className={`alert-banner ${notification.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {notification.type === 'success' ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="table-toolbar" style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
        <div className="search-input-wrapper">
          <Search size={15} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by ID, tag, or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select 
            className="filter-select"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
          >
            <option value="ALL">All Skills</option>
            <option value="Grandmaster">Grandmaster</option>
            <option value="Master">Master</option>
            <option value="Diamond">Diamond</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Novice">Novice</option>
          </select>

          <select 
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="Casual">Casual</option>
            <option value="Competitive">Competitive</option>
            <option value="Professional">Professional</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredPlayers}
        loading={loading}
        emptyMessage={search ? 'No players match your search filter.' : 'No players recorded in database.'}
      />

      {/* View Details Modal */}
      <PlayerDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        player={viewingPlayer}
      />

      {/* Add / Edit Form Modal */}
      <PlayerForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedPlayer}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Player Record"
        message={`Are you sure you want to permanently delete Player #${playerToDelete?.Player_ID} (${playerToDelete?.Code} - ${playerToDelete?.FullName})?`}
        confirmText="Confirm Delete"
        loading={deleteLoading}
      />
    </div>
  );
}
