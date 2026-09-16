import React, { useEffect, useState } from 'react';
import { Modal } from './Modal';

export function LeaderboardForm({ isOpen, onClose, onSubmit, initialData = null, mode = 'add' }) {
  const [formData, setFormData] = useState({
    L_ID: '',
    L_Type: '',
    Ranking: 1,
    Total_Participants: 0
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData(initialData ? {
      L_ID: initialData.L_ID ?? '',
      L_Type: initialData.L_Type ?? '',
      Ranking: initialData.Ranking ?? 1,
      Total_Participants: initialData.Total_Participants ?? 0
    } : {
      L_ID: '',
      L_Type: '',
      Ranking: 1,
      Total_Participants: 0
    });
    setError('');
  }, [initialData, isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(previous => ({ ...previous, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.L_Type.trim()) {
      setError('Leaderboard name is required.');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'add' ? 'Add Leaderboard Tier' : `Edit Leaderboard • #${formData.L_ID}`}>
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          {error && <div className="alert-banner alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}
          <div className="form-grid">
            <div className="form-group">
              <label>Leaderboard ID *</label>
              <input type="number" name="L_ID" className="form-input" value={formData.L_ID} onChange={handleChange} disabled={mode === 'edit'} required />
            </div>
            <div className="form-group full-width">
              <label>Leaderboard Name *</label>
              <input type="text" name="L_Type" className="form-input" value={formData.L_Type} onChange={handleChange} placeholder="e.g. Season 4 Global MMR" required />
            </div>
            <div className="form-group">
              <label>Ranking Position</label>
              <input type="number" name="Ranking" className="form-input" value={formData.Ranking} onChange={handleChange} min="1" />
            </div>
            <div className="form-group">
              <label>Total Participants</label>
              <input type="number" name="Total_Participants" className="form-input" value={formData.Total_Participants} onChange={handleChange} min="0" />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Leaderboard'}</button>
        </div>
      </form>
    </Modal>
  );
}
