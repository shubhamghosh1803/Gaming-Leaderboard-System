import { request, USE_MOCK } from './client';
import { initialPlatforms } from '../data/mockData';

export const platformsApi = {
  async getAll() {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 80));
      return initialPlatforms;
    }
    return request('/platforms');
  },

  async getById(id) {
    const numId = Number(id);
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 60));
      const p = initialPlatforms.find(item => item.Pla_ID === numId);
      if (!p) throw new Error(`Platform #${id} not found.`);
      return p;
    }
    return request(`/platforms/${numId}`);
  }
};
