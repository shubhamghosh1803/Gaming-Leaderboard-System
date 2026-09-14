import { request, USE_MOCK } from './client';
import { initialLeaderboards, initialMatchPlayStats, initialPlayers, initialMatches } from '../data/mockData';

export const leaderboardApi = {
  async getAll() {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 100));
      return initialLeaderboards;
    }
    return request('/leaderboards');
  },

  async getRankings(leaderboardId) {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 120));
      const lId = Number(leaderboardId) || 1001;
      // Filter Match_Play_Stats associated with this leaderboard
      const stats = initialMatchPlayStats.filter(s => s.L_ID === lId);
      return stats.map(s => {
        const player = initialPlayers.find(p => p.Player_ID === s.Player_ID);
        const match = initialMatches.find(m => m.Match_ID === s.Match_ID);
        const kd = s.Death > 0 ? (s.Kills / s.Death).toFixed(2) : s.Kills.toFixed(2);
        return {
          ...s,
          Player_Code: player ? player.Code : `Player #${s.Player_ID}`,
          Player_Name: player ? `${player.First} ${player.Last}` : 'Unknown',
          Skill_level: player ? player.Skill_level : 'N/A',
          Match_Result: match ? match.Result : 'N/A',
          KD_Ratio: kd
        };
      }).sort((a, b) => b.Score - a.Score);
    }
    return request(`/leaderboards/${leaderboardId}/rankings`);
  }
};
