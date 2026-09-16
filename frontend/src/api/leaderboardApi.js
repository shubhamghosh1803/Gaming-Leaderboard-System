import { request, USE_MOCK } from './client';
import { initialLeaderboards, initialMatchPlayStats, initialPlayers, initialMatches } from '../data/mockData';

function normalizeLeaderboard(board) {
  return {
    ...board,
    L_ID: board.L_ID ?? board.lb_id,
    L_Type: board.L_Type ?? board.ltype,
    Last_updated: board.Last_updated ?? board.last_updated,
    Ranking: board.Ranking ?? board.ranking,
    Total_Participants: board.Total_Participants ?? board.total_participant
  };
}

export const leaderboardApi = {
  async getAll() {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 100));
      return initialLeaderboards;
    }
    const boards = await request('/leaderboards');
    return boards.map(normalizeLeaderboard);
  },

  async create(data) {
    return normalizeLeaderboard(await request('/leaderboards', {
      method: 'POST',
      body: JSON.stringify({
        lb_id: Number(data.L_ID),
        ltype: data.L_Type,
        ranking: Number(data.Ranking),
        total_participant: Number(data.Total_Participants)
      })
    }));
  },

  async update(id, data) {
    return normalizeLeaderboard(await request(`/leaderboards/${Number(id)}`, {
      method: 'PUT',
      body: JSON.stringify({
        ltype: data.L_Type,
        ranking: Number(data.Ranking),
        total_participant: Number(data.Total_Participants)
      })
    }));
  },

  async delete(id) {
    return request(`/leaderboards/${Number(id)}`, { method: 'DELETE' });
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
    const rankings = await request(`/leaderboards/${leaderboardId}/rankings`);
    return rankings.map(ranking => ({
      ...ranking,
      Player_ID: ranking.player_id,
      Player_Code: ranking.player_code,
      Player_Name: ranking.player_name,
      Skill_level: ranking.skill_level,
      Score: ranking.score,
      KD_Ratio: ranking.kd_ratio,
      Match_Result: ranking.match_result
    }));
  }
};
