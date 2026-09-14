import { request, USE_MOCK } from './client';
import { initialGames, initialPlayers } from '../data/mockData';

const STORAGE_KEY = 'gaming_db_games';

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

let mockGames = getLocal(STORAGE_KEY, initialGames);

function enrichGame(g) {
  const featured = initialPlayers.find(p => p.Player_ID === g.Player_ID);
  return {
    ...g,
    featured_player: featured ? featured.Code : `Player #${g.Player_ID}`
  };
}

export const gamesApi = {
  async getAll() {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 80));
      return mockGames.map(enrichGame);
    }
    return request('/games');
  },

  async getById(id) {
    const numId = Number(id);
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 60));
      const g = mockGames.find(item => item.G_ID === numId);
      if (!g) throw new Error(`Game #${id} not found.`);
      return enrichGame(g);
    }
    return request(`/games/${numId}`);
  },

  async create(data) {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 120));
      const newId = Number(data.G_ID) || (Math.max(0, ...mockGames.map(g => g.G_ID)) + 1);
      if (mockGames.some(g => g.G_ID === newId)) {
        throw new Error(`Primary Key Violation: G_ID ${newId} already exists.`);
      }
      const newGame = {
        G_ID: newId,
        Name: String(data.Name || '').trim(),
        Developer: String(data.Developer || '').trim(),
        RDate: data.RDate || '2024-01-01',
        Max_Player: Number(data.Max_Player) || 10,
        Player_ID: Number(data.Player_ID) || 1
      };
      mockGames.push(newGame);
      setLocal(STORAGE_KEY, mockGames);
      return enrichGame(newGame);
    }
    return request('/games', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async update(id, data) {
    const numId = Number(id);
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 120));
      const idx = mockGames.findIndex(g => g.G_ID === numId);
      if (idx === -1) throw new Error(`Game #${id} not found.`);
      mockGames[idx] = {
        ...mockGames[idx],
        Name: data.Name ? String(data.Name).trim() : mockGames[idx].Name,
        Developer: data.Developer ? String(data.Developer).trim() : mockGames[idx].Developer,
        RDate: data.RDate || mockGames[idx].RDate,
        Max_Player: data.Max_Player != null ? Number(data.Max_Player) : mockGames[idx].Max_Player,
        Player_ID: data.Player_ID != null ? Number(data.Player_ID) : mockGames[idx].Player_ID
      };
      setLocal(STORAGE_KEY, mockGames);
      return enrichGame(mockGames[idx]);
    }
    return request(`/games/${numId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async delete(id) {
    const numId = Number(id);
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 100));
      const idx = mockGames.findIndex(g => g.G_ID === numId);
      if (idx === -1) throw new Error(`Game #${id} not found.`);
      mockGames.splice(idx, 1);
      setLocal(STORAGE_KEY, mockGames);
      return { success: true, message: `Game #${id} deleted successfully.` };
    }
    return request(`/games/${numId}`, {
      method: 'DELETE'
    });
  }
};
