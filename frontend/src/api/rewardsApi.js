import { request, USE_MOCK } from './client';
import { initialRewards, initialAccounts } from '../data/mockData';

const STORAGE_KEY = 'gaming_db_rewards';

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

let mockRewards = getLocal(STORAGE_KEY, initialRewards);

function enrichReward(r) {
  const acc = initialAccounts.find(a => a.Acc_ID === r.Acc_ID);
  return {
    ...r,
    account_email: acc ? acc.Email : `Account #${r.Acc_ID}`
  };
}

export const rewardsApi = {
  async getAll() {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 80));
      return mockRewards.map(enrichReward);
    }
    return request('/rewards');
  },

  async getById(id) {
    const numId = Number(id);
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 60));
      const rItem = mockRewards.find(item => item.Reward_ID === numId);
      if (!rItem) throw new Error(`Reward #${id} not found.`);
      return enrichReward(rItem);
    }
    return request(`/rewards/${numId}`);
  }
};
