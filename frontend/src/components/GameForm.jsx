import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { initialPlayers } from '../data/mockData';

export function GameForm({ isOpen, onClose, onSubmit, initialData = null, mode = 'add' }) {
  const [formData, setFormData] = useState({
    G_ID: '',
    Name: '',
    Developer: '',
    RDate: '',
    Max_Player: 10,
    Player_ID: 1
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        G_ID: initialData.G_ID ?? '',
        Name: initialData.Name ?? '',
        Developer: initialData.Developer ?? '',
        RDate: initialData.RDate ?? '',
        Max_Player: initialData.Max_Player ?? 10,
        Player_ID: initialData.Player_ID ?? 1
      });
    } else {
      setFormData({
        G_ID: '',
        Name: '',
        Developer: '',
        RDate: '2024-01-01',
        Max_Player: 10,
        Player_ID: initialPlayers[0]?.Player_ID ?? 1
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (mode === 'add') {
      if (!formData.G_ID) {
        newErrors.G_ID = 'Game ID (Primary Key) is required.';
      } else if (isNaN(Number(formData.G_ID)) || Number(formData.G_ID) <= 0) {
        newErrors.G_ID = 'Game ID must be a positive integer.';
      }
    }
    if (!formData.Name?.trim()) newErrors.Name = 'Game title is required.';
    if (!formData.Developer?.trim()) newErrors.Developer = 'Developer name is required.';
    if (!formData.RDate) newErrors.RDate = 'Release date is required.';
    if (!formData.Max_Player || isNaN(Number(formData.Max_Player)) || Number(formData.Max_Player) <= 0) {
      newErrors.Max_Player = 'Max player capacity must be positive.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setErrors(prev => ({ ...prev, form: err.message }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'add' ? 'Add New Game Title' : `Edit Game • #${formData.G_ID}`}
      maxWidth="600px"
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          {errors.form && (
            <div className="alert-banner alert-error" style={{ marginBottom: '1rem' }}>
              <span>{errors.form}</span>
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label>Game ID (G_ID PK) *</label>
              <input
                type="number"
                name="G_ID"
                className="form-input"
                value={formData.G_ID}
                onChange={handleChange}
                disabled={mode === 'edit'}
                placeholder="e.g. 5"
              />
              {errors.G_ID && <span className="field-error">{errors.G_ID}</span>}
            </div>

            <div className="form-group">
              <label>Game Title *</label>
              <input
                type="text"
                name="Name"
                className="form-input"
                value={formData.Name}
                onChange={handleChange}
                placeholder="e.g. Overwatch Protocol"
              />
              {errors.Name && <span className="field-error">{errors.Name}</span>}
            </div>

            <div className="form-group">
              <label>Developer / Publisher *</label>
              <input
                type="text"
                name="Developer"
                className="form-input"
                value={formData.Developer}
                onChange={handleChange}
                placeholder="e.g. Blizzard / Valve"
              />
              {errors.Developer && <span className="field-error">{errors.Developer}</span>}
            </div>

            <div className="form-group">
              <label>Release Date (RDate) *</label>
              <input
                type="date"
                name="RDate"
                className="form-input"
                value={formData.RDate}
                onChange={handleChange}
              />
              {errors.RDate && <span className="field-error">{errors.RDate}</span>}
            </div>

            <div className="form-group">
              <label>Max Player Capacity (Max_Player) *</label>
              <input
                type="number"
                name="Max_Player"
                className="form-input"
                value={formData.Max_Player}
                onChange={handleChange}
                placeholder="e.g. 10"
              />
              {errors.Max_Player && <span className="field-error">{errors.Max_Player}</span>}
            </div>

            <div className="form-group">
              <label>Featured Player (Player_ID FK) *</label>
              <select
                name="Player_ID"
                className="form-select"
                value={formData.Player_ID}
                onChange={handleChange}
              >
                {initialPlayers.map(p => (
                  <option key={p.Player_ID} value={p.Player_ID}>
                    #{p.Player_ID} - {p.Code} ({p.First} {p.Last})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : mode === 'add' ? 'Register Game' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
