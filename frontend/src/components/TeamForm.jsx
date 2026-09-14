import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';

export function TeamForm({ isOpen, onClose, onSubmit, initialData = null, mode = 'add' }) {
  const [formData, setFormData] = useState({
    Team_ID: '',
    Tag: '',
    Name: '',
    Street: '',
    City: '',
    State: '',
    Country: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        Team_ID: initialData.Team_ID ?? '',
        Tag: initialData.Tag ?? '',
        Name: initialData.Name ?? '',
        Street: initialData.Street ?? '',
        City: initialData.City ?? '',
        State: initialData.State ?? '',
        Country: initialData.Country ?? ''
      });
    } else {
      setFormData({
        Team_ID: '',
        Tag: '',
        Name: '',
        Street: '',
        City: '',
        State: '',
        Country: ''
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
      if (!formData.Team_ID) {
        newErrors.Team_ID = 'Team ID (Primary Key) is required.';
      } else if (isNaN(Number(formData.Team_ID)) || Number(formData.Team_ID) <= 0) {
        newErrors.Team_ID = 'Team ID must be a positive integer.';
      }
    }
    if (!formData.Tag?.trim()) newErrors.Tag = 'Team tag is required (e.g. FNC).';
    if (!formData.Name?.trim()) newErrors.Name = 'Team name is required.';
    if (!formData.City?.trim()) newErrors.City = 'City is required.';
    if (!formData.Country?.trim()) newErrors.Country = 'Country is required.';

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
      title={mode === 'add' ? 'Register Esports Team' : `Edit Team • #${formData.Team_ID}`}
      maxWidth="620px"
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
              <label>Team ID (PK) *</label>
              <input
                type="number"
                name="Team_ID"
                className="form-input"
                value={formData.Team_ID}
                onChange={handleChange}
                disabled={mode === 'edit'}
                placeholder="e.g. 50"
              />
              {errors.Team_ID && <span className="field-error">{errors.Team_ID}</span>}
            </div>

            <div className="form-group">
              <label>Team Tag *</label>
              <input
                type="text"
                name="Tag"
                className="form-input"
                value={formData.Tag}
                onChange={handleChange}
                placeholder="e.g. T1 or SEN"
              />
              {errors.Tag && <span className="field-error">{errors.Tag}</span>}
            </div>

            <div className="form-group full-width">
              <label>Team Name *</label>
              <input
                type="text"
                name="Name"
                className="form-input"
                value={formData.Name}
                onChange={handleChange}
                placeholder="e.g. Team Liquid"
              />
              {errors.Name && <span className="field-error">{errors.Name}</span>}
            </div>

            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                name="Street"
                className="form-input"
                value={formData.Street}
                onChange={handleChange}
                placeholder="e.g. 124 Sunset Blvd"
              />
            </div>

            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="City"
                className="form-input"
                value={formData.City}
                onChange={handleChange}
                placeholder="e.g. Los Angeles"
              />
              {errors.City && <span className="field-error">{errors.City}</span>}
            </div>

            <div className="form-group">
              <label>State / Region</label>
              <input
                type="text"
                name="State"
                className="form-input"
                value={formData.State}
                onChange={handleChange}
                placeholder="e.g. California"
              />
            </div>

            <div className="form-group">
              <label>Country *</label>
              <input
                type="text"
                name="Country"
                className="form-input"
                value={formData.Country}
                onChange={handleChange}
                placeholder="e.g. USA"
              />
              {errors.Country && <span className="field-error">{errors.Country}</span>}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : mode === 'add' ? 'Register Team' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
