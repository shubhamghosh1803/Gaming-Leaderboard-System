import React, { useState, useEffect } from 'react';
import { Swords, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { MatchForm } from '../components/MatchForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { matchesApi } from '../api/matchesApi';

export function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [selectedMatch, setSelectedMatch] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [notification, setNotification] = useState(null);

  const showNotice = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const loadMatches = async () => {
    setLoading(true);
    try {
      const data = await matchesApi.getAll();
      setMatches(data);
    } catch (err) {
      showNotice('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const handleOpenAdd = () => {
    setSelectedMatch(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (m) => {
    setSelectedMatch(m);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleOpenDelete = (m) => {
    setMatchToDelete(m);
    setIsConfirmOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (formMode === 'add') {
      await matchesApi.create(formData);
      showNotice('success', `Match #${formData.Match_ID} created successfully.`);
    } else {
      await matchesApi.update(formData.Match_ID, formData);
      showNotice('success', `Match #${formData.Match_ID} updated successfully.`);
    }
    await loadMatches();
  };

  const handleConfirmDelete = async () => {
    if (!matchToDelete) return;
    setDeleteLoading(true);
    try {
      await matchesApi.delete(matchToDelete.Match_ID);
      showNotice('success', `Match #${matchToDelete.Match_ID} deleted successfully.`);
      setIsConfirmOpen(false);
      setMatchToDelete(null);
      await loadMatches();
    } catch (err) {
      showNotice('error', err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

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
        <span style={{ 
          color: row.Status === 'Completed' ? 'var(--accent-emerald)' : 'var(--accent-amber)', 
          fontWeight: 500, 
          fontSize: '0.82rem' 
        }}>
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
      header: 'Total Participants (Total_M)',
      accessor: 'Total_M',
      render: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
          {row.Total_M}
        </span>
      )
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
            data-tooltip="Edit Match"
            aria-label={`Edit Match #${row.Match_ID}`}
          >
            <Edit2 size={15} />
          </button>
          <button
            className="btn-icon delete"
            onClick={() => handleOpenDelete(row)}
            data-tooltip="Delete Match"
            aria-label={`Delete Match #${row.Match_ID}`}
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
          <h2>Match History & Outcomes</h2>
          <p>Official match records, scores, duration, and participant counts (Match Relation)</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={15} />
          Add Match
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
        data={matches}
        loading={loading}
        emptyMessage="No match records found."
      />

      <MatchForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedMatch}
        mode={formMode}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Match Record"
        message={`Are you sure you want to delete Match #${matchToDelete?.Match_ID}?`}
        confirmText="Confirm Delete"
        loading={deleteLoading}
      />
    </div>
  );
}
