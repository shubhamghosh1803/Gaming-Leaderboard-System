import { request, USE_MOCK } from './client';
import {
  initialPlayers,
  initialGames,
  initialMatches,
  initialTeams,
  initialLeaderboards,
  initialMatchPlayStats
} from '../data/mockData';

export const statsApi = {
  async getDashboardSummary() {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 80));
      const totalKills = initialMatchPlayStats.reduce((acc, curr) => acc + (curr.Kills || 0), 0);
      const totalScore = initialMatchPlayStats.reduce((acc, curr) => acc + (curr.Score || 0), 0);
      
      return {
        totalPlayers: initialPlayers.length,
        totalGames: initialGames.length,
        totalMatches: initialMatches.length,
        totalTeams: initialTeams.length,
        totalLeaderboards: initialLeaderboards.length,
        totalKills,
        totalScore
      };
    }
    return request('/stats/summary');
  }
};
