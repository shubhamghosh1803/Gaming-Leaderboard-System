import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit2, Trash2, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { TeamForm } from '../components/TeamForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { teamsApi } from '../api/teamsApi';

export function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [notification, setNotification] = useState(null);

  const showNotice = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const loadTeams = async () => {
    setLoading(true);
    try {
      const data = await teamsApi.getAll();
      setTeams(data);
    } catch (err) {
      showNotice('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleOpenAdd = () => {
    setSelectedTeam(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (t) => {
    setSelectedTeam(t);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleOpenDelete = (t) => {
    setTeamToDelete(t);
    setIsConfirmOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (formMode === 'add') {
      await teamsApi.create(formData);
      showNotice('success', `Team [${formData.Tag}] ${formData.Name} created successfully.`);
    } else {
      await teamsApi.update(formData.Team_ID, formData);
      showNotice('success', `Team #${formData.Team_ID} updated successfully.`);
    }
    await loadTeams();
  };

  const handleConfirmDelete = async () => {
    if (!teamToDelete) return;
    setDeleteLoading(true);
    try {
      await teamsApi.delete(teamToDelete.Team_ID);
      showNotice('success', `Team #${teamToDelete.Team_ID} deleted successfully.`);
      setIsConfirmOpen(false);
      setTeamToDelete(null);
      await loadTeams();
    } catch (err) {
      showNotice('error', err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

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
      header: 'Address (Decomposed 1NF)',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
          <MapPin size={13} style={{ color: 'var(--accent-cyan)' }} />
          <span>{row.Street ? `${row.Street}, ` : ''}{row.City}, {row.State} ({row.Country})</span>
        </div>
      )
    },
    {
      header: 'Active Roster',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {row.roster && row.roster.length > 0 ? (
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
            data-tooltip="Edit Team"
            aria-label={`Edit ${row.Name}`}
          >
            <Edit2 size={15} />
          </button>
          <button
            className="btn-icon delete"
            onClick={() => handleOpenDelete(row)}
            data-tooltip="Delete Team"
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
          <h2>Esports Teams & Rosters</h2>
          <p>Registered competitive organizations, headquarters, and active player rosters (Team Relation)</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={15} />
          Add Team
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
        data={teams}
        loading={loading}
        emptyMessage="No teams found."
      />

      <TeamForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedTeam}
        mode={formMode}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Team Record"
        message={`Are you sure you want to delete Team [${teamToDelete?.Tag}] ${teamToDelete?.Name}?`}
        confirmText="Confirm Delete"
        loading={deleteLoading}
      />
    </div>
  );
}
