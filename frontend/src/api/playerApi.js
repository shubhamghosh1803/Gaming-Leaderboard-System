import { request, USE_MOCK } from './client';
import {
  initialPlayers,
  initialCasualPlayers,
  initialCompetitivePlayers,
  initialProfessionalPlayers,
  initialPlayerEmails,
  initialAccounts,
  initialTeams
} from '../data/mockData';

const STORAGE_KEY_PLAYERS = 'gaming_db_players';
const STORAGE_KEY_CASUAL = 'gaming_db_casual';
const STORAGE_KEY_COMPETITIVE = 'gaming_db_competitive';
const STORAGE_KEY_PRO = 'gaming_db_pro';
const STORAGE_KEY_EMAILS = 'gaming_db_emails';

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

let mockPlayers = getLocal(STORAGE_KEY_PLAYERS, initialPlayers);
let mockCasual = getLocal(STORAGE_KEY_CASUAL, initialCasualPlayers);
let mockCompetitive = getLocal(STORAGE_KEY_COMPETITIVE, initialCompetitivePlayers);
let mockPro = getLocal(STORAGE_KEY_PRO, initialProfessionalPlayers);
let mockEmails = getLocal(STORAGE_KEY_EMAILS, initialPlayerEmails);

// Derived attribute: Age calculated dynamically from DOB (DA1 ER dashed oval)
export function calculateAge(dobString) {
  if (!dobString) return null;
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
}

function enrichPlayer(p) {
  const account = initialAccounts.find(a => a.Acc_ID === p.Acc_ID);
  const emails = mockEmails.filter(e => e.Player_ID === p.Player_ID).map(e => e.Email);
  const casual = mockCasual.find(c => c.Player_ID === p.Player_ID);
  const comp = mockCompetitive.find(c => c.Player_ID === p.Player_ID);
  const pro = mockPro.find(pr => pr.Player_ID === p.Player_ID);
  
  let playerType = 'Standard';
  let specializationDetails = {};
  if (casual) {
    playerType = 'Casual';
    specializationDetails = { Pref_score: casual.Pref_score };
  } else if (comp) {
    playerType = 'Competitive';
    specializationDetails = { Rank: comp.Rank };
  } else if (pro) {
    playerType = 'Professional';
    const team = initialTeams.find(t => t.Team_ID === pro.Team_ID);
    specializationDetails = {
      Team_ID: pro.Team_ID,
      Team_Name: team ? team.Name : `Team #${pro.Team_ID}`,
      Team_Tag: team ? team.Tag : 'N/A',
      Salary: pro.Salary
    };
  }

  return {
    ...p,
    FullName: [p.First, p.Middle, p.Last].filter(Boolean).join(' '),
    Age: calculateAge(p.DOB),
    Account_Email: account ? account.Email : 'N/A',
    Emails: emails,
    PlayerType: playerType,
    Specialization: specializationDetails
  };
}

export const playerApi = {
  async getAll() {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 80));
      return mockPlayers.map(enrichPlayer);
    }
    return request('/players');
  },

  async getById(id) {
    const numId = Number(id);
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 60));
      const p = mockPlayers.find(pl => pl.Player_ID === numId);
      if (!p) throw new Error(`Player with ID ${id} not found.`);
      return enrichPlayer(p);
    }
    return request(`/players/${numId}`);
  },

  async create(data) {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 120));
      const newId = Number(data.Player_ID) || (Math.max(0, ...mockPlayers.map(p => p.Player_ID)) + 1);
      
      if (mockPlayers.some(p => p.Player_ID === newId)) {
        throw new Error(`Primary Key Violation: Player_ID ${newId} already exists in database.`);
      }

      const newPlayer = {
        Player_ID: newId,
        Code: String(data.Code).trim(),
        DOB: data.DOB,
        Skill_level: data.Skill_level || 'Novice',
        First: String(data.First).trim(),
        Middle: data.Middle ? String(data.Middle).trim() : '',
        Last: String(data.Last).trim(),
        Acc_ID: Number(data.Acc_ID) || 101
      };

      mockPlayers.push(newPlayer);
      setLocal(STORAGE_KEY_PLAYERS, mockPlayers);

      if (data.PlayerType === 'Casual' && data.Pref_score != null) {
        mockCasual.push({ Player_ID: newId, Pref_score: Number(data.Pref_score) });
        setLocal(STORAGE_KEY_CASUAL, mockCasual);
      } else if (data.PlayerType === 'Competitive' && data.Rank) {
        mockCompetitive.push({ Player_ID: newId, Rank: String(data.Rank).trim() });
        setLocal(STORAGE_KEY_COMPETITIVE, mockCompetitive);
      } else if (data.PlayerType === 'Professional') {
        mockPro.push({
          Player_ID: newId,
          Team_ID: Number(data.Team_ID) || 10,
          Salary: Number(data.Salary) || 50000.00
        });
        setLocal(STORAGE_KEY_PRO, mockPro);
      }

      if (data.Email) {
        mockEmails.push({ Player_ID: newId, Email: String(data.Email).trim() });
        setLocal(STORAGE_KEY_EMAILS, mockEmails);
      }

      return enrichPlayer(newPlayer);
    }

    return request('/players', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async update(id, data) {
    const numId = Number(id);
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 120));
      const idx = mockPlayers.findIndex(p => p.Player_ID === numId);
      if (idx === -1) {
        throw new Error(`Player #${id} not found.`);
      }

      mockPlayers[idx] = {
        ...mockPlayers[idx],
        Code: data.Code != null ? String(data.Code).trim() : mockPlayers[idx].Code,
        DOB: data.DOB || mockPlayers[idx].DOB,
        Skill_level: data.Skill_level || mockPlayers[idx].Skill_level,
        First: data.First != null ? String(data.First).trim() : mockPlayers[idx].First,
        Middle: data.Middle != null ? String(data.Middle).trim() : mockPlayers[idx].Middle,
        Last: data.Last != null ? String(data.Last).trim() : mockPlayers[idx].Last,
        Acc_ID: data.Acc_ID != null ? Number(data.Acc_ID) : mockPlayers[idx].Acc_ID
      };
      setLocal(STORAGE_KEY_PLAYERS, mockPlayers);

      if (data.PlayerType === 'Casual') {
        mockCasual = mockCasual.filter(c => c.Player_ID !== numId);
        mockCompetitive = mockCompetitive.filter(c => c.Player_ID !== numId);
        mockPro = mockPro.filter(c => c.Player_ID !== numId);
        if (data.Pref_score != null) mockCasual.push({ Player_ID: numId, Pref_score: Number(data.Pref_score) });
      } else if (data.PlayerType === 'Competitive') {
        mockCasual = mockCasual.filter(c => c.Player_ID !== numId);
        mockCompetitive = mockCompetitive.filter(c => c.Player_ID !== numId);
        mockPro = mockPro.filter(c => c.Player_ID !== numId);
        if (data.Rank) mockCompetitive.push({ Player_ID: numId, Rank: String(data.Rank).trim() });
      } else if (data.PlayerType === 'Professional') {
        mockCasual = mockCasual.filter(c => c.Player_ID !== numId);
        mockCompetitive = mockCompetitive.filter(c => c.Player_ID !== numId);
        mockPro = mockPro.filter(c => c.Player_ID !== numId);
        mockPro.push({
          Player_ID: numId,
          Team_ID: Number(data.Team_ID) || 10,
          Salary: Number(data.Salary) || 50000.00
        });
      }

      setLocal(STORAGE_KEY_CASUAL, mockCasual);
      setLocal(STORAGE_KEY_COMPETITIVE, mockCompetitive);
      setLocal(STORAGE_KEY_PRO, mockPro);

      return enrichPlayer(mockPlayers[idx]);
    }

    return request(`/players/${numId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async delete(id) {
    const numId = Number(id);
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 100));
      const idx = mockPlayers.findIndex(p => p.Player_ID === numId);
      if (idx === -1) {
        throw new Error(`Cannot delete: Player #${id} not found.`);
      }

      mockPlayers.splice(idx, 1);
      mockCasual = mockCasual.filter(c => c.Player_ID !== numId);
      mockCompetitive = mockCompetitive.filter(c => c.Player_ID !== numId);
      mockPro = mockPro.filter(c => c.Player_ID !== numId);
      mockEmails = mockEmails.filter(e => e.Player_ID !== numId);

      setLocal(STORAGE_KEY_PLAYERS, mockPlayers);
      setLocal(STORAGE_KEY_CASUAL, mockCasual);
      setLocal(STORAGE_KEY_COMPETITIVE, mockCompetitive);
      setLocal(STORAGE_KEY_PRO, mockPro);
      setLocal(STORAGE_KEY_EMAILS, mockEmails);

      return { success: true, message: `Player #${id} deleted successfully.` };
    }

    return request(`/players/${numId}`, {
      method: 'DELETE'
    });
  }
};
