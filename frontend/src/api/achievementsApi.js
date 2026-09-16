import { request, USE_MOCK } from './client';
import { initialPlayerAchievements, initialPlayers, initialRewards } from '../data/mockData';

const STORAGE_KEY = 'gaming_db_achievements';

function getLocal(key, defaultVal) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocal(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

let mockAchievements = getLocal(STORAGE_KEY, initialPlayerAchievements);

function enrichAchievement(a) {
  const p = initialPlayers.find(pl => pl.Player_ID === a.Player_ID);
  const r = initialRewards.find(rw => rw.Reward_ID === a.Reward_ID);
  return {
    ...a,
    player_tag: p ? p.Code : `Player #${a.Player_ID}`,
    player_name: p ? p.FullName : 'N/A',
    reward_name: r ? r.R_Type : 'N/A',
    reward_expiry: r ? r.ExpiryDate : 'N/A'
  };
}

export const achievementsApi = {
  async getAll() {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 80));
      return mockAchievements.map(enrichAchievement);
    }
    const achievements = await request('/achievements');
    return achievements.map(achievement => ({
      ...achievement,
      Ach_ID: achievement.ach_id,
      Category: achievement.category,
      Points: achievement.points,
      Player_ID: achievement.player_id,
      Reward_ID: achievement.reward_id,
      Player_Code: achievement.player_tag,
      Reward_Type: achievement.reward_name
    }));
  },

  async getById(id) {
    const numId = Number(id);
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 60));
      const a = mockAchievements.find(item => item.Ach_ID === numId);
      if (!a) throw new Error(`Achievement #${id} not found.`);
      return enrichAchievement(a);
    }
    return request(`/achievements/${numId}`);
  }
};
