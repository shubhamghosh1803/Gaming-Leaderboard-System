import React, { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { playerApi } from '../api/playerApi';
import { leaderboardApi } from '../api/leaderboardApi';

export function MatchPerformanceForm({ isOpen, onClose, onSubmit, matches = [], initialMatchId = '' }) {
  const [players, setPlayers] = useState([]);
  const [leaderboards, setLeaderboards] = useState([]);
  const [formData, setFormData] = useState({
    Match_ID: initialMatchId,
    Player_ID: '',
    LB_ID: '',
    Wins: 0,
    Score: 0,
    Deaths: 0,
    Headshots: 0,
    Kills: 0,
    Assists: 0,
    KD_Ratio: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    Promise.all([playerApi.getAll(), leaderboardApi.getAll()])
      .then(([playerData, boardData]) => {
        setPlayers(playerData);
        setLeaderboards(boardData);
        setFormData(previous => ({
          ...previous,
          Match_ID: initialMatchId || matches[0]?.Match_ID || '',
          Player_ID: previous.Player_ID || playerData[0]?.Player_ID || '',
          LB_ID: previous.LB_ID || boardData[0]?.L_ID || ''
        }));
      })
      .catch(err => setError(err.message));
  }, [isOpen, initialMatchId, matches]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(previous => ({ ...previous, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.Match_ID || !formData.Player_ID || !formData.LB_ID) {
      setError('Match, player, and leaderboard are required.');
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
    <Modal isOpen={isOpen} onClose={onClose} title="Add Player Performance" maxWidth="680px">
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          {error && <div className="alert-banner alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}
          <div className="form-grid">
            <div className="form-group">
              <label>Match *</label>
              <select name="Match_ID" className="form-select" value={formData.Match_ID} onChange={handleChange}>
                <option value="">Select match</option>
                {matches.map(match => <option key={match.Match_ID} value={match.Match_ID}>#{match.Match_ID} - {match.Result}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Player *</label>
              <select name="Player_ID" className="form-select" value={formData.Player_ID} onChange={handleChange}>
                <option value="">Select player</option>
                {players.map(player => <option key={player.Player_ID} value={player.Player_ID}>#{player.Player_ID} - {player.Code}</option>)}
              </select>
            </div>
            <div className="form-group full-width">
              <label>Leaderboard *</label>
              <select name="LB_ID" className="form-select" value={formData.LB_ID} onChange={handleChange}>
                <option value="">Select leaderboard</option>
                {leaderboards.map(board => <option key={board.L_ID} value={board.L_ID}>{board.L_Type}</option>)}
              </select>
            </div>
            {['Wins', 'Score', 'Kills', 'Deaths', 'Assists', 'Headshots'].map(field => (
              <div className="form-group" key={field}>
                <label>{field}</label>
                <input type="number" min="0" name={field} className="form-input" value={formData[field]} onChange={handleChange} />
              </div>
            ))}
            <div className="form-group">
              <label>K/D Ratio</label>
              <input type="number" min="0" step="0.01" name="KD_Ratio" className="form-input" value={formData.KD_Ratio} onChange={handleChange} placeholder="Auto-calculate" />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Performance'}</button>
        </div>
      </form>
    </Modal>
  );
}
