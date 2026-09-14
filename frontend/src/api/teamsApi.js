import { request, USE_MOCK } from './client';
import { initialTeams, initialProfessionalPlayers, initialPlayers } from '../data/mockData';

const STORAGE_KEY = 'gaming_db_teams';

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

let mockTeams = getLocal(STORAGE_KEY, initialTeams);

function enrichTeam(t) {
  const proSignings = initialProfessionalPlayers.filter(pr => pr.Team_ID === t.Team_ID);
  const roster = proSignings.map(pr => {
    const p = initialPlayers.find(pl => pl.Player_ID === pr.Player_ID);
    return {
      Player_ID: pr.Player_ID,
      name: p ? p.FullName : `Player #${pr.Player_ID}`,
      code: p ? p.Code : `P#${pr.Player_ID}`,
      salary: pr.Salary
    };
  });

  return {
    ...t,
    roster,
    FullAddress: [t.Street, t.City, t.State, t.Country].filter(Boolean).join(', ')
  };
}

export const teamsApi = {
  async getAll() {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 80));
      return mockTeams.map(enrichTeam);
    }
    return request('/teams');
  },

  async getById(id) {
    const numId = Number(id);
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 60));
      const t = mockTeams.find(item => item.Team_ID === numId);
      if (!t) throw new Error(`Team #${id} not found.`);
      return enrichTeam(t);
    }
    return request(`/teams/${numId}`);
  },

  async create(data) {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 120));
      const newId = Number(data.Team_ID) || (Math.max(0, ...mockTeams.map(t => t.Team_ID)) + 10);
      if (mockTeams.some(t => t.Team_ID === newId)) {
        throw new Error(`Primary Key Violation: Team_ID ${newId} already exists.`);
      }
      const newTeam = {
        Team_ID: newId,
        Tag: String(data.Tag || '').trim().toUpperCase(),
        Name: String(data.Name || '').trim(),
        Street: String(data.Street || '').trim(),
        City: String(data.City || '').trim(),
        State: String(data.State || '').trim(),
        Country: String(data.Country || '').trim()
      };
      mockTeams.push(newTeam);
      setLocal(STORAGE_KEY, mockTeams);
      return enrichTeam(newTeam);
    }
    return request('/teams', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async update(id, data) {
    const numId = Number(id);
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 120));
      const idx = mockTeams.findIndex(t => t.Team_ID === numId);
      if (idx === -1) throw new Error(`Team #${id} not found.`);
      mockTeams[idx] = {
        ...mockTeams[idx],
        Tag: data.Tag ? String(data.Tag).trim().toUpperCase() : mockTeams[idx].Tag,
        Name: data.Name ? String(data.Name).trim() : mockTeams[idx].Name,
        Street: data.Street != null ? String(data.Street).trim() : mockTeams[idx].Street,
        City: data.City != null ? String(data.City).trim() : mockTeams[idx].City,
        State: data.State != null ? String(data.State).trim() : mockTeams[idx].State,
        Country: data.Country != null ? String(data.Country).trim() : mockTeams[idx].Country
      };
      setLocal(STORAGE_KEY, mockTeams);
      return enrichTeam(mockTeams[idx]);
    }
    return request(`/teams/${numId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async delete(id) {
    const numId = Number(id);
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 100));
      const idx = mockTeams.findIndex(t => t.Team_ID === numId);
      if (idx === -1) throw new Error(`Team #${id} not found.`);
      mockTeams.splice(idx, 1);
      setLocal(STORAGE_KEY, mockTeams);
      return { success: true, message: `Team #${id} deleted successfully.` };
    }
    return request(`/teams/${numId}`, {
      method: 'DELETE'
    });
  }
};
