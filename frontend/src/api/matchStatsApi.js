import { request } from './client';

export const matchStatsApi = {
  async create(data) {
    return request('/match-stats', {
      method: 'POST',
      body: JSON.stringify({
        match_id: Number(data.Match_ID),
        player_id: Number(data.Player_ID),
        lb_id: Number(data.LB_ID),
        wins: Number(data.Wins) || 0,
        score: Number(data.Score) || 0,
        deaths: Number(data.Deaths) || 0,
        headshots: Number(data.Headshots) || 0,
        kills: Number(data.Kills) || 0,
        assists: Number(data.Assists) || 0,
        kd_ratio: data.KD_Ratio === '' ? null : Number(data.KD_Ratio)
      })
    });
  },

  async getByMatch(matchId) {
    return request(`/match-stats/${Number(matchId)}`);
  }
};
