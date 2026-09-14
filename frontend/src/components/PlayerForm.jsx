import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { initialAccounts, initialTeams } from '../data/mockData';

export function PlayerForm({ isOpen, onClose, onSubmit, initialData = null, mode = 'add' }) {
  const [formData, setFormData] = useState({
    Player_ID: '',
    Code: '',
    DOB: '',
    Skill_level: 'Novice',
    First: '',
    Middle: '',
    Last: '',
    Acc_ID: 101,
    PlayerType: 'Standard',
    Pref_score: '',
    Rank: '',
    Team_ID: 10,
    Salary: '',
    Email: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        Player_ID: initialData.Player_ID ?? '',
        Code: initialData.Code ?? '',
        DOB: initialData.DOB ?? '',
        Skill_level: initialData.Skill_level ?? 'Novice',
        First: initialData.First ?? '',
        Middle: initialData.Middle ?? '',
        Last: initialData.Last ?? '',
        Acc_ID: initialData.Acc_ID ?? 101,
        PlayerType: initialData.PlayerType ?? 'Standard',
        Pref_score: initialData.Specialization?.Pref_score ?? '',
        Rank: initialData.Specialization?.Rank ?? '',
        Team_ID: initialData.Specialization?.Team_ID ?? 10,
        Salary: initialData.Specialization?.Salary ?? '',
        Email: initialData.Emails?.[0] ?? ''
      });
    } else {
      setFormData({
        Player_ID: '',
        Code: '',
        DOB: '2004-01-01',
        Skill_level: 'Novice',
        First: '',
        Middle: '',
        Last: '',
        Acc_ID: 101,
        PlayerType: 'Standard',
        Pref_score: '',
        Rank: '',
        Team_ID: 10,
        Salary: '',
        Email: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (mode === 'add') {
      if (!formData.Player_ID) {
        newErrors.Player_ID = 'Player ID is required.';
      } else if (isNaN(Number(formData.Player_ID)) || Number(formData.Player_ID) <= 0) {
        newErrors.Player_ID = 'Player ID must be a positive number.';
      }
    }

    if (!formData.Code?.trim()) newErrors.Code = 'Gamer Tag/Code is required.';
    if (!formData.First?.trim()) newErrors.First = 'First name is required.';
    if (!formData.Last?.trim()) newErrors.Last = 'Last name is required.';
    if (!formData.DOB) newErrors.DOB = 'Date of birth is required.';

    if (formData.PlayerType === 'Casual') {
      if (formData.Pref_score === '' || isNaN(Number(formData.Pref_score))) {
        newErrors.Pref_score = 'Preferred score is required.';
      }
    } else if (formData.PlayerType === 'Competitive') {
      if (!formData.Rank?.trim()) {
        newErrors.Rank = 'Competitive rank is required.';
      }
    } else if (formData.PlayerType === 'Professional') {
      if (formData.Salary === '' || isNaN(Number(formData.Salary)) || Number(formData.Salary) < 0) {
        newErrors.Salary = 'Valid positive salary is required.';
      }
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

  const skillOptions = [
    'Novice',
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Master',
    'Grandmaster'
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={mode === 'add' ? 'Add Player' : `Edit Player • #${formData.Player_ID}`}
      maxWidth="640px"
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
              <label>Player ID *</label>
              <input
                type="number"
                name="Player_ID"
                className="form-input"
                value={formData.Player_ID}
                onChange={handleChange}
                disabled={mode === 'edit'}
                placeholder="e.g. 9"
              />
              {errors.Player_ID && <span className="field-error">{errors.Player_ID}</span>}
            </div>

            <div className="form-group">
              <label>Gamer Tag (Code) *</label>
              <input
                type="text"
                name="Code"
                className="form-input"
                value={formData.Code}
                onChange={handleChange}
                placeholder="e.g. VIPER_99"
              />
              {errors.Code && <span className="field-error">{errors.Code}</span>}
            </div>

            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="First"
                className="form-input"
                value={formData.First}
                onChange={handleChange}
                placeholder="First name"
              />
              {errors.First && <span className="field-error">{errors.First}</span>}
            </div>

            <div className="form-group">
              <label>Middle Name</label>
              <input
                type="text"
                name="Middle"
                className="form-input"
                value={formData.Middle}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="Last"
                className="form-input"
                value={formData.Last}
                onChange={handleChange}
                placeholder="Last name"
              />
              {errors.Last && <span className="field-error">{errors.Last}</span>}
            </div>

            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                name="DOB"
                className="form-input"
                value={formData.DOB}
                onChange={handleChange}
              />
              {errors.DOB && <span className="field-error">{errors.DOB}</span>}
            </div>

            <div className="form-group">
              <label>Skill Level</label>
              <select 
                name="Skill_level" 
                className="form-select" 
                value={formData.Skill_level} 
                onChange={handleChange}
              >
                {skillOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Linked Account *</label>
              <select 
                name="Acc_ID" 
                className="form-select" 
                value={formData.Acc_ID} 
                onChange={handleChange}
              >
                {initialAccounts.map(acc => (
                  <option key={acc.Acc_ID} value={acc.Acc_ID}>
                    Account #{acc.Acc_ID} ({acc.Email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group full-width" style={{ marginTop: '0.25rem' }}>
              <label style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>
                Player Category
              </label>
              <select 
                name="PlayerType" 
                className="form-select" 
                value={formData.PlayerType} 
                onChange={handleChange}
              >
                <option value="Standard">Standard Player</option>
                <option value="Casual">Casual Player</option>
                <option value="Competitive">Competitive Player</option>
                <option value="Professional">Professional Player</option>
              </select>
            </div>

            {formData.PlayerType === 'Casual' && (
              <div className="form-group full-width">
                <label>Preferred Casual Score *</label>
                <input
                  type="number"
                  name="Pref_score"
                  className="form-input"
                  value={formData.Pref_score}
                  onChange={handleChange}
                  placeholder="e.g. 4500"
                />
                {errors.Pref_score && <span className="field-error">{errors.Pref_score}</span>}
              </div>
            )}

            {formData.PlayerType === 'Competitive' && (
              <div className="form-group full-width">
                <label>Competitive Rank *</label>
                <input
                  type="text"
                  name="Rank"
                  className="form-input"
                  value={formData.Rank}
                  onChange={handleChange}
                  placeholder="e.g. Diamond II"
                />
                {errors.Rank && <span className="field-error">{errors.Rank}</span>}
              </div>
            )}

            {formData.PlayerType === 'Professional' && (
              <>
                <div className="form-group">
                  <label>Team Roster *</label>
                  <select 
                    name="Team_ID" 
                    className="form-select" 
                    value={formData.Team_ID} 
                    onChange={handleChange}
                  >
                    {initialTeams.map(t => (
                      <option key={t.Team_ID} value={t.Team_ID}>
                        [{t.Tag}] {t.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Salary ($) *</label>
                  <input
                    type="number"
                    name="Salary"
                    className="form-input"
                    value={formData.Salary}
                    onChange={handleChange}
                    placeholder="e.g. 85000"
                    step="500"
                  />
                  {errors.Salary && <span className="field-error">{errors.Salary}</span>}
                </div>
              </>
            )}

            <div className="form-group full-width">
              <label>Contact Email</label>
              <input
                type="email"
                name="Email"
                className="form-input"
                value={formData.Email}
                onChange={handleChange}
                placeholder="player@gaming.gg"
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : mode === 'add' ? 'Add Player' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
