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

function getStoredPlayers() {
  return getLocal('gaming_db_players', initialPlayers);
}

let mockGames = getLocal(STORAGE_KEY, initialGames);

function enrichGame(g) {
  const featured = getStoredPlayers().find(p => p.Player_ID === g.Player_ID);
  return {
    ...g,
    G_ID: g.G_ID ?? g.game_id,
    Name: g.Name ?? g.name ?? '',
    Developer: g.Developer ?? g.developer ?? '',
    RDate: g.RDate ?? g.release_date ?? '',
    Max_Player: g.Max_Player ?? g.max_players ?? '',
    Player_ID: g.Player_ID ?? g.featured_player_id,
    featured_player: featured ? featured.Code : `Player #${g.Player_ID ?? g.featured_player_id ?? ''}`
  };
}

function normalizeBackendGame(game, players) {
  const normalized = {
    ...game,
    G_ID: game.G_ID ?? game.game_id,
    Name: game.Name ?? game.name ?? '',
    Developer: game.Developer ?? game.developer ?? '',
    RDate: game.RDate ?? game.release_date ?? '',
    Max_Player: game.Max_Player ?? game.max_players ?? ''
    ,Player_ID: game.Player_ID ?? game.featured_player_id
  };
  const featured = players.find(player => player.Player_ID === normalized.Player_ID);
  return {
    ...normalized,
  featured_player: featured ? featured.Code : `Player #${normalized.Player_ID ?? ''}`
  };
}

export const gamesApi = {
  async getAll() {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 80));
      return mockGames.map(enrichGame);
    }
    const games = await request('/games');
    const players = await request('/players');
    return games.map(game => normalizeBackendGame(game, players));
  },

  async getById(id) {
    const numId = Number(id);
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 60));
      const g = mockGames.find(item => item.G_ID === numId);
      if (!g) throw new Error(`Game #${id} not found.`);
      return enrichGame(g);
    }
    const game = await request(`/games/${numId}`);
    const players = await request('/players');
    return normalizeBackendGame(game, players);
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
      body: JSON.stringify({
        game_id: data.G_ID != null ? Number(data.G_ID) : null,
        name: data.Name,
        developer: data.Developer,
        release_date: data.RDate || null,
        max_players: Number(data.Max_Player),
        genre: data.Genre || 'General'
        ,featured_player_id: data.Player_ID != null ? Number(data.Player_ID) : null
      })
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
      body: JSON.stringify({
        ...(data.Name != null && { name: data.Name }),
        ...(data.Developer != null && { developer: data.Developer }),
        ...(data.RDate != null && { release_date: data.RDate }),
        ...(data.Max_Player != null && { max_players: Number(data.Max_Player) }),
        ...(data.Genre != null && { genre: data.Genre })
        ,...(data.Player_ID != null && { featured_player_id: Number(data.Player_ID) })
      })
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
