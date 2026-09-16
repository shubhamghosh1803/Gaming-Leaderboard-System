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
    const summary = await request('/stats/summary');
    return {
      totalPlayers: summary.total_players,
      totalGames: summary.total_games,
      totalMatches: summary.total_matches,
      totalTeams: summary.total_teams,
      totalLeaderboards: summary.total_leaderboards,
      totalKills: summary.total_kills,
      totalScore: summary.total_score
    };
  }
};
