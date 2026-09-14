import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';

export function MatchForm({ isOpen, onClose, onSubmit, initialData = null, mode = 'add' }) {
  const [formData, setFormData] = useState({
    Match_ID: '',
    Status: 'Completed',
    Score: '',
    Duration: '',
    Result: 'Victory',
    Total_M: 10
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        Match_ID: initialData.Match_ID ?? '',
        Status: initialData.Status ?? 'Completed',
        Score: initialData.Score ?? '',
        Duration: initialData.Duration ?? '',
        Result: initialData.Result ?? 'Victory',
        Total_M: initialData.Total_M ?? 10
      });
    } else {
      setFormData({
        Match_ID: '',
        Status: 'Completed',
        Score: '13',
        Duration: '30',
        Result: 'Victory',
        Total_M: 10
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
      if (!formData.Match_ID) {
        newErrors.Match_ID = 'Match ID (Primary Key) is required.';
      } else if (isNaN(Number(formData.Match_ID)) || Number(formData.Match_ID) <= 0) {
        newErrors.Match_ID = 'Match ID must be a positive integer.';
      }
    }
    if (formData.Score === '' || isNaN(Number(formData.Score))) {
      newErrors.Score = 'Score must be a valid number.';
    }
    if (formData.Duration === '' || isNaN(Number(formData.Duration)) || Number(formData.Duration) <= 0) {
      newErrors.Duration = 'Duration must be greater than 0.';
    }
    if (formData.Total_M === '' || isNaN(Number(formData.Total_M)) || Number(formData.Total_M) <= 0) {
      newErrors.Total_M = 'Total participants must be greater than 0.';
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
      title={mode === 'add' ? 'Log New Match' : `Edit Match • #${formData.Match_ID}`}
      maxWidth="580px"
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
              <label>Match ID (PK) *</label>
              <input
                type="number"
                name="Match_ID"
                className="form-input"
                value={formData.Match_ID}
                onChange={handleChange}
                disabled={mode === 'edit'}
                placeholder="e.g. 206"
              />
              {errors.Match_ID && <span className="field-error">{errors.Match_ID}</span>}
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select name="Status" className="form-select" value={formData.Status} onChange={handleChange}>
                <option value="Completed">Completed</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>

            <div className="form-group">
              <label>Score *</label>
              <input
                type="number"
                name="Score"
                className="form-input"
                value={formData.Score}
                onChange={handleChange}
                placeholder="e.g. 13"
              />
              {errors.Score && <span className="field-error">{errors.Score}</span>}
            </div>

            <div className="form-group">
              <label>Duration (minutes) *</label>
              <input
                type="number"
                name="Duration"
                className="form-input"
                value={formData.Duration}
                onChange={handleChange}
                placeholder="e.g. 35"
              />
              {errors.Duration && <span className="field-error">{errors.Duration}</span>}
            </div>

            <div className="form-group">
              <label>Result *</label>
              <select name="Result" className="form-select" value={formData.Result} onChange={handleChange}>
                <option value="Victory">Victory</option>
                <option value="Defeat">Defeat</option>
                <option value="Draw">Draw</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div className="form-group">
              <label>Total Participants (Total_M) *</label>
              <input
                type="number"
                name="Total_M"
                className="form-input"
                value={formData.Total_M}
                onChange={handleChange}
                placeholder="e.g. 10"
              />
              {errors.Total_M && <span className="field-error">{errors.Total_M}</span>}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : mode === 'add' ? 'Add Match' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
