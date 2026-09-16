import { request, USE_MOCK } from './client';
import { initialPlatforms } from '../data/mockData';

export const platformsApi = {
  async getAll() {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 80));
      return initialPlatforms;
    }
    const platforms = await request('/platforms');
    return platforms.map(platform => ({
      ...platform,
      Pla_ID: platform.Pla_ID ?? platform.plat_id,
      Name: platform.Name ?? platform.platform_name,
      Release_y: platform.Release_y ?? platform.released,
      Manufacturer: platform.Manufacturer ?? platform.manufacturer
    }));
  },

  async getById(id) {
    const numId = Number(id);
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 60));
      const p = initialPlatforms.find(item => item.Pla_ID === numId);
      if (!p) throw new Error(`Platform #${id} not found.`);
      return p;
    }
    const platform = await request(`/platforms/${numId}`);
    return {
      ...platform,
      Pla_ID: platform.Pla_ID ?? platform.plat_id,
      Name: platform.Name ?? platform.platform_name,
      Release_y: platform.Release_y ?? platform.released,
      Manufacturer: platform.Manufacturer ?? platform.manufacturer
    };
  }
};
