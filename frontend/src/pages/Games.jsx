import React, { useState, useEffect } from 'react';
import { Gamepad2, Plus, Edit2, Trash2, Calendar, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { GameForm } from '../components/GameForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { gamesApi } from '../api/gamesApi';

export function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [selectedGame, setSelectedGame] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [notification, setNotification] = useState(null);

  const showNotice = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const loadGames = async () => {
    setLoading(true);
    try {
      const data = await gamesApi.getAll();
      setGames(data);
    } catch (err) {
      showNotice('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const handleOpenAdd = () => {
    setSelectedGame(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (g) => {
    setSelectedGame(g);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleOpenDelete = (g) => {
    setGameToDelete(g);
    setIsConfirmOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (formMode === 'add') {
      await gamesApi.create(formData);
      showNotice('success', `Game "${formData.Name}" added successfully.`);
    } else {
      await gamesApi.update(formData.G_ID, formData);
      showNotice('success', `Game #${formData.G_ID} updated successfully.`);
    }
    await loadGames();
  };

  const handleConfirmDelete = async () => {
    if (!gameToDelete) return;
    setDeleteLoading(true);
    try {
      await gamesApi.delete(gameToDelete.G_ID);
      showNotice('success', `Game #${gameToDelete.G_ID} deleted successfully.`);
      setIsConfirmOpen(false);
      setGameToDelete(null);
      await loadGames();
    } catch (err) {
      showNotice('error', err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      header: 'G_ID',
      accessor: 'G_ID',
      width: '75px',
      render: (row) => <strong style={{ fontFamily: 'var(--font-mono)' }}>#{row.G_ID}</strong>
    },
    {
      header: 'Game Title (Name)',
      accessor: 'Name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Gamepad2 size={16} style={{ color: 'var(--accent-cyan)' }} />
          <strong style={{ color: '#fff' }}>{row.Name}</strong>
        </div>
      )
    },
    {
      header: 'Developer',
      accessor: 'Developer',
      render: (row) => <span style={{ color: 'var(--text-secondary)' }}>{row.Developer}</span>
    },
    {
      header: 'Release Date (RDate)',
      accessor: 'RDate',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
          <Calendar size={13} />
          <span>{row.RDate}</span>
        </div>
      )
    },
    {
      header: 'Max Capacity (Max_Player)',
      accessor: 'Max_Player',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-primary)' }}>
          <Users size={13} />
          <span>{row.Max_Player} Players</span>
        </div>
      )
    },
    {
      header: 'Featured Player (Player_ID)',
      accessor: 'featured_player',
      render: (row) => <span className="badge badge-diamond">{row.featured_player}</span>
    },
    {
      header: 'Actions',
      width: '90px',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
          <button
            className="btn-icon"
            onClick={() => handleOpenEdit(row)}
            data-tooltip="Edit Game"
            aria-label={`Edit ${row.Name}`}
          >
            <Edit2 size={15} />
          </button>
          <button
            className="btn-icon delete"
            onClick={() => handleOpenDelete(row)}
            data-tooltip="Delete Game"
            aria-label={`Delete ${row.Name}`}
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
          <h2>Game Catalog</h2>
          <p>Supported competitive titles, developers, server capacity, and featured players (Game Relation)</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={15} />
          Add Game
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

      <DataTable
        columns={columns}
        data={games}
        loading={loading}
        emptyMessage="No games registered."
      />

      <GameForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedGame}
        mode={formMode}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Game Title"
        message={`Are you sure you want to delete Game #${gameToDelete?.G_ID} ("${gameToDelete?.Name}")?`}
        confirmText="Confirm Delete"
        loading={deleteLoading}
      />
    </div>
  );
}
