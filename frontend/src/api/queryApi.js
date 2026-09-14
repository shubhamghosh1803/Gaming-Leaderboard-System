import { request, USE_MOCK } from './client';
import {
  initialAccounts,
  initialRewards,
  initialPlatforms,
  initialPlayers,
  initialPlayerEmails,
  initialCasualPlayers,
  initialCompetitivePlayers,
  initialProfessionalPlayers,
  initialPlayerAchievements,
  initialGames,
  initialTeams,
  initialMatches,
  initialMatchPlayStats,
  initialLeaderboards,
  initialRepresentsIn
} from '../data/mockData';

// Map relation names to mock datasets
const TABLE_MAP = {
  account: initialAccounts,
  reward: initialRewards,
  platform: initialPlatforms,
  player: initialPlayers,
  player_email: initialPlayerEmails,
  casual_player: initialCasualPlayers,
  competitive_player: initialCompetitivePlayers,
  professional_player: initialProfessionalPlayers,
  player_achievement: initialPlayerAchievements,
  game: initialGames,
  team: initialTeams,
  match: initialMatches,
  match_play_stats: initialMatchPlayStats,
  leaderboard: initialLeaderboards,
  represents_in: initialRepresentsIn
};

export const queryApi = {
  async execute(sql) {
    const rawSql = String(sql || '').trim();
    if (!rawSql) {
      throw new Error('Query cannot be empty. Enter a valid SQL statement.');
    }

    if (!USE_MOCK) {
      return request('/query', {
        method: 'POST',
        body: JSON.stringify({ query: rawSql })
      });
    }

    // Mock SQL Execution Engine
    const startTime = performance.now();
    await new Promise(r => setTimeout(r, 160)); // Simulate realistic network/query latency

    const cleaned = rawSql.replace(/;+$/, '').trim();
    const upper = cleaned.toUpperCase();

    // Check basic command
    if (!upper.startsWith('SELECT') && !upper.startsWith('DESC') && !upper.startsWith('SHOW')) {
      // Teacher specified viewing records; if someone tries DML/DDL:
      return {
        columns: ['Status', 'Message', 'Query'],
        rows: [{
          Status: 'SUCCESS',
          Message: `Query executed successfully in simulation mode (1 row affected).`,
          Query: rawSql
        }],
        rowCount: 1,
        executionTimeMs: Math.round(performance.now() - startTime)
      };
    }

    // SHOW TABLES
    if (upper === 'SHOW TABLES' || upper === 'SHOW RELATIONS') {
      const rows = Object.keys(TABLE_MAP).map(t => ({ Table_Name: t }));
      return {
        columns: ['Table_Name'],
        rows,
        rowCount: rows.length,
        executionTimeMs: Math.round(performance.now() - startTime)
      };
    }

    // DESCRIBE / DESC <table>
    const descMatch = cleaned.match(/^(?:DESC|DESCRIBE)\s+([a-zA-Z0-9_]+)/i);
    if (descMatch) {
      const tbl = descMatch[1].toLowerCase();
      if (!TABLE_MAP[tbl]) {
        throw new Error(`Table '${descMatch[1]}' doesn't exist in Gaming Leaderboard schema.`);
      }
      const sample = TABLE_MAP[tbl][0] || {};
      const rows = Object.keys(sample).map(col => ({
        Field: col,
        Type: typeof sample[col] === 'number' ? 'INT / DECIMAL' : 'VARCHAR',
        Null: 'NO',
        Key: col.endsWith('_ID') ? 'PRI / FK' : '',
        Default: 'NULL'
      }));
      return {
        columns: ['Field', 'Type', 'Null', 'Key', 'Default'],
        rows,
        rowCount: rows.length,
        executionTimeMs: Math.round(performance.now() - startTime)
      };
    }

    // Extract table from simple FROM clause
    const fromMatch = cleaned.match(/FROM\s+([a-zA-Z0-9_]+)/i);
    if (!fromMatch) {
      // Check for dual/expression query like SELECT 1+1 or SELECT NOW()
      return {
        columns: ['Result'],
        rows: [{ Result: 'Executed' }],
        rowCount: 1,
        executionTimeMs: Math.round(performance.now() - startTime)
      };
    }

    const tableName = fromMatch[1].toLowerCase();
    const dataset = TABLE_MAP[tableName];

    if (!dataset) {
      const available = Object.keys(TABLE_MAP).join(', ');
      throw new Error(`Table '${fromMatch[1]}' does not exist in schema. Available tables: ${available}`);
    }

    let rows = [...dataset];

    // Simple WHERE filter simulation if contains =
    const whereMatch = cleaned.match(/WHERE\s+([a-zA-Z0-9_]+)\s*=\s*['"]?([^'"]+)['"]?/i);
    if (whereMatch) {
      const col = whereMatch[1];
      const val = whereMatch[2];
      rows = rows.filter(r => {
        const key = Object.keys(r).find(k => k.toLowerCase() === col.toLowerCase());
        return key ? String(r[key]).toLowerCase() === String(val).toLowerCase() : true;
      });
    }

    // Simple ORDER BY
    const orderMatch = cleaned.match(/ORDER BY\s+([a-zA-Z0-9_]+)(?:\s+(ASC|DESC))?/i);
    if (orderMatch) {
      const col = orderMatch[1];
      const isDesc = orderMatch[2] && orderMatch[2].toUpperCase() === 'DESC';
      rows.sort((a, b) => {
        const kA = Object.keys(a).find(k => k.toLowerCase() === col.toLowerCase()) || col;
        const kB = Object.keys(b).find(k => k.toLowerCase() === col.toLowerCase()) || col;
        if (a[kA] < b[kB]) return isDesc ? 1 : -1;
        if (a[kA] > b[kB]) return isDesc ? -1 : 1;
        return 0;
      });
    }

    // Simple LIMIT
    const limitMatch = cleaned.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1], 10);
      rows = rows.slice(0, limit);
    }

    // Determine columns
    const selectMatch = cleaned.match(/^SELECT\s+(.*?)\s+FROM/i);
    let columns = [];
    if (selectMatch && selectMatch[1].trim() !== '*') {
      const reqCols = selectMatch[1].split(',').map(c => c.trim().replace(/^.*\./, ''));
      columns = reqCols;
      rows = rows.map(r => {
        const out = {};
        columns.forEach(col => {
          const matchKey = Object.keys(r).find(k => k.toLowerCase() === col.toLowerCase());
          out[col] = matchKey ? r[matchKey] : null;
        });
        return out;
      });
    } else {
      columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    }

    return {
      columns,
      rows,
      rowCount: rows.length,
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  }
};
