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
    account_email: acc ? acc.Email : (r.Acc_ID != null ? `Account #${r.Acc_ID} (deleted)` : 'Unassigned')
  };
}

export const rewardsApi = {
  async getAll() {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 80));
      return mockRewards.map(enrichReward);
    }
    const rewards = await request('/rewards');
    return rewards.map(reward => ({
      ...reward,
      Reward_ID: reward.Reward_ID ?? reward.reward_id,
      R_Type: reward.R_Type ?? reward.rtype,
      ExpiryDate: reward.ExpiryDate ?? reward.expiry_date,
      Acc_ID: reward.Acc_ID ?? reward.acc_id,
      account_email: reward.account_email ?? reward.Account_Email ?? (reward.Acc_ID ?? reward.acc_id != null ? `Account #${reward.Acc_ID ?? reward.acc_id} (deleted)` : 'Unassigned')
    }));
  },

  async getById(id) {
    const numId = Number(id);
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 60));
      const rItem = mockRewards.find(item => item.Reward_ID === numId);
      if (!rItem) throw new Error(`Reward #${id} not found.`);
      return enrichReward(rItem);
    }
    const reward = await request(`/rewards/${numId}`);
    return {
      ...reward,
      Reward_ID: reward.Reward_ID ?? reward.reward_id,
      R_Type: reward.R_Type ?? reward.rtype,
      ExpiryDate: reward.ExpiryDate ?? reward.expiry_date,
      Acc_ID: reward.Acc_ID ?? reward.acc_id,
      account_email: reward.account_email ?? reward.Account_Email ?? (reward.Acc_ID ?? reward.acc_id != null ? `Account #${reward.Acc_ID ?? reward.acc_id} (deleted)` : 'Unassigned')
    };
  }
};
