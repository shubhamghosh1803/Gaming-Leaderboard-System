import { request, USE_MOCK } from './client';
import { initialMatches, initialRepresentsIn, initialPlayers, initialTeams } from '../data/mockData';

const STORAGE_KEY = 'gaming_db_matches';

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

let mockMatches = getLocal(STORAGE_KEY, initialMatches);

function enrichMatch(m) {
  const reps = initialRepresentsIn.filter(r => r.Match_ID === m.Match_ID);
  const participants = reps.map(r => {
    const p = initialPlayers.find(pl => pl.Player_ID === r.Player_ID);
    const t = initialTeams.find(tm => tm.Team_ID === r.Team_ID);
    return {
      Player_ID: r.Player_ID,
      tag: p ? p.Code : `P#${r.Player_ID}`,
      team: t ? t.Tag : 'N/A'
    };
  });

  return {
    ...m,
    participants
  };
}

export const matchesApi = {
  async getAll() {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 80));
      return mockMatches.map(enrichMatch);
    }
    const matches = await request('/matches');
    return matches.map(match => ({
      ...match,
      Match_ID: match.match_id,
      Status: match.status,
      Score: match.score,
      Duration: match.duration,
      Result: match.result,
      Total_M: match.total_matches
    }));
  },

  async getById(id) {
    const numId = Number(id);
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 60));
      const m = mockMatches.find(item => item.Match_ID === numId);
      if (!m) throw new Error(`Match #${id} not found.`);
      return enrichMatch(m);
    }
    return request(`/matches/${numId}`);
  },

  async create(data) {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 120));
      const newId = Number(data.Match_ID) || (Math.max(0, ...mockMatches.map(m => m.Match_ID)) + 1);
      if (mockMatches.some(m => m.Match_ID === newId)) {
        throw new Error(`Primary Key Violation: Match_ID ${newId} already exists.`);
      }
      const newMatch = {
        Match_ID: newId,
        Status: data.Status || 'Completed',
        Score: Number(data.Score) || 0,
        Duration: Number(data.Duration) || 30,
        Result: data.Result || 'Victory',
        Total_M: Number(data.Total_M) || 10
      };
      mockMatches.push(newMatch);
      setLocal(STORAGE_KEY, mockMatches);
      return enrichMatch(newMatch);
    }
    return request('/matches', {
      method: 'POST',
      body: JSON.stringify({
        match_id: data.Match_ID != null ? Number(data.Match_ID) : null,
        status: data.Status,
        score: data.Score != null ? String(data.Score) : null,
        duration: data.Duration != null ? Number(data.Duration) : null,
        result: data.Result || null,
        total_matches: data.Total_M != null ? Number(data.Total_M) : null
      })
    });
  },

  async update(id, data) {
    const numId = Number(id);
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 120));
      const idx = mockMatches.findIndex(m => m.Match_ID === numId);
      if (idx === -1) throw new Error(`Match #${id} not found.`);
      mockMatches[idx] = {
        ...mockMatches[idx],
        Status: data.Status || mockMatches[idx].Status,
        Score: data.Score != null ? Number(data.Score) : mockMatches[idx].Score,
        Duration: data.Duration != null ? Number(data.Duration) : mockMatches[idx].Duration,
        Result: data.Result || mockMatches[idx].Result,
        Total_M: data.Total_M != null ? Number(data.Total_M) : mockMatches[idx].Total_M
      };
      setLocal(STORAGE_KEY, mockMatches);
      return enrichMatch(mockMatches[idx]);
    }
    return request(`/matches/${numId}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...(data.Status != null && { status: data.Status }),
        ...(data.Score != null && { score: String(data.Score) }),
        ...(data.Duration != null && { duration: Number(data.Duration) }),
        ...(data.Result != null && { result: data.Result }),
        ...(data.Total_M != null && { total_matches: Number(data.Total_M) })
      })
    });
  },

  async delete(id) {
    const numId = Number(id);
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 100));
      const idx = mockMatches.findIndex(m => m.Match_ID === numId);
      if (idx === -1) throw new Error(`Match #${id} not found.`);
      mockMatches.splice(idx, 1);
      setLocal(STORAGE_KEY, mockMatches);
      return { success: true, message: `Match #${id} deleted successfully.` };
    }
    return request(`/matches/${numId}`, {
      method: 'DELETE'
    });
  }
};
