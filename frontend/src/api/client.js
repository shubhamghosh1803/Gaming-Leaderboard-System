// API Client configuration
// Connects to FastAPI Backend via REST endpoints.
// When backend is not reachable, gracefully uses isolated mock data.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

function normalizeRecord(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return record;

  const normalized = { ...record };
  const aliases = {
    player_id: 'Player_ID',
    code: 'Code',
    dob: 'DOB',
    first_name: 'First',
    middle_name: 'Middle',
    last_name: 'Last',
    skill_level: 'Skill_level',
    acc_id: 'Acc_ID',
    team_id: 'Team_ID',
    tag: 'Tag',
    team_name: 'Name',
    country_name: 'Country',
    game_id: 'G_ID',
    featured_player_id: 'Player_ID',
    release_date: 'RDate',
    max_players: 'Max_Player',
    match_id: 'Match_ID',
    status: 'Status',
    score: 'Score',
    duration: 'Duration',
    result: 'Result',
    total_matches: 'Total_M',
    ach_id: 'Ach_ID',
    category: 'Category',
    points: 'Points',
    reward_id: 'Reward_ID',
    player_tag: 'Player_Code',
    player_name: 'Player_Name',
    reward_name: 'Reward_Type',
    lb_id: 'LB_ID',
    ltype: 'LType',
    last_updated: 'Last_Updated',
    ranking: 'Ranking',
    total_participant: 'Total_Participant',
    kills: 'Kills',
    deaths: 'Deaths',
    assists: 'Assists',
    wins: 'Wins',
    kd_ratio: 'KD_Ratio',
    match_result: 'Match_Result'
  };

  Object.entries(aliases).forEach(([source, target]) => {
    if (normalized[target] === undefined && normalized[source] !== undefined) {
      normalized[target] = normalized[source];
    }
  });

  if (normalized.FullName === undefined && (normalized.First || normalized.Last)) {
    normalized.FullName = [normalized.First, normalized.Middle, normalized.Last]
      .filter(Boolean)
      .join(' ');
  }

  return normalized;
}

function normalizeResponse(data) {
  return Array.isArray(data) ? data.map(normalizeRecord) : normalizeRecord(data);
}

export async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const detail = Array.isArray(errorData.detail)
        ? errorData.detail.map(item => item.msg || JSON.stringify(item)).join('; ')
        : errorData.detail || errorData.message;
      throw new Error(detail || `HTTP ${res.status}: ${res.statusText}`);
    }
    return normalizeResponse(await res.json());
  } catch (err) {
    console.warn(`Backend request to ${url} failed:`, err.message);
    throw err;
  }
}
