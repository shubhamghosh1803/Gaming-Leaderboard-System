import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Gamepad2, 
  Swords, 
  Shield, 
  Trophy, 
  ArrowUpRight, 
  Terminal, 
  Award,
  Flame,
  Star
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { statsApi } from '../api/statsApi';
import { leaderboardApi } from '../api/leaderboardApi';
import { matchesApi } from '../api/matchesApi';
import { achievementsApi } from '../api/achievementsApi';

export function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [topRankings, setTopRankings] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsResult, rankingsResult, matchesResult, achievementsResult] = await Promise.allSettled([
          statsApi.getDashboardSummary(),
          leaderboardApi.getRankings(1001),
          matchesApi.getAll(),
          achievementsApi.getAll()
        ]);
        if (statsResult.status === 'fulfilled') setStats(statsResult.value);
        if (rankingsResult.status === 'fulfilled') setTopRankings(rankingsResult.value.slice(0, 5));
        if (matchesResult.status === 'fulfilled') setRecentMatches(matchesResult.value.slice(0, 4));
        if (achievementsResult.status === 'fulfilled') setRecentAchievements(achievementsResult.value.slice(0, 4));
        if (achievementsResult.status === 'rejected') {
          console.error('Failed to load dashboard achievements:', achievementsResult.reason);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h2>Overview & Analytics</h2>
          <p>Real-time platform metrics, tournament rankings, and player activity</p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button className="btn btn-secondary" onClick={() => onNavigate('sql-console')}>
            <Terminal size={15} />
            SQL Console
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('players')}>
            <Users size={15} />
            Manage Players
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stat-grid">
        <StatCard
          title="Total Players"
          value={stats?.totalPlayers ?? '...'}
          subtitle="Registered accounts"
          icon={Users}
          color="var(--accent-primary)"
        />
        <StatCard
          title="Active Games"
          value={stats?.totalGames ?? '...'}
          subtitle="Titles cataloged"
          icon={Gamepad2}
          color="var(--accent-cyan)"
        />
        <StatCard
          title="Matches Tracked"
          value={stats?.totalMatches ?? '...'}
          subtitle="Tournament & ranked games"
          icon={Swords}
          color="var(--accent-amber)"
        />
        <StatCard
          title="Esports Teams"
          value={stats?.totalTeams ?? '...'}
          subtitle="Active team rosters"
          icon={Shield}
          color="var(--accent-emerald)"
        />
      </div>

      {/* Grid for Leaderboard & Matches */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
        {/* Top Standings */}
        <div className="card-table-wrapper">
          <div className="table-toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.92rem' }}>
              <Trophy size={17} style={{ color: 'var(--accent-amber)' }} />
              <span>Top Leaderboard Standings</span>
            </div>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.76rem' }}
              onClick={() => onNavigate('leaderboards')}
            >
              Full Rankings
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Rank</th>
                  <th>Player</th>
                  <th>Score</th>
                  <th>K/D Ratio</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {topRankings.map((r, idx) => {
                  const rankClass = idx === 0 ? 'rank-gold' : idx === 1 ? 'rank-silver' : idx === 2 ? 'rank-bronze' : 'rank-default';
                  return (
                    <tr key={idx}>
                      <td>
                        <span className={`rank-badge ${rankClass}`}>{idx + 1}</span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{r.Player_Code}</span>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{r.Player_Name}</div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#fff' }}>
                        {Number(r.Score).toLocaleString()}
                      </td>
                      <td>
                        <span className="badge badge-grandmaster">{r.KD_Ratio}</span>
                      </td>
                      <td>
                        <span className={`badge ${r.Match_Result === 'Victory' ? 'badge-victory' : 'badge-silver'}`}>
                          {r.Match_Result}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Matches */}
        <div className="card-table-wrapper">
          <div className="table-toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.92rem' }}>
              <Swords size={17} style={{ color: 'var(--accent-cyan)' }} />
              <span>Recent Match Logs</span>
            </div>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.76rem' }}
              onClick={() => onNavigate('matches')}
            >
              View All
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Match ID</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Duration</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {recentMatches.map((m) => (
                  <tr key={m.Match_ID}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 }}>
                      #{m.Match_ID}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{m.Status}</span>
                    </td>
                    <td style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{m.Score} pts</td>
                    <td style={{ color: 'var(--text-muted)' }}>{m.Duration}m</td>
                    <td>
                      <span className={`badge ${m.Result === 'Victory' ? 'badge-victory' : m.Result === 'Defeat' ? 'badge-defeat' : 'badge-silver'}`}>
                        {m.Result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Achievements Feed */}
      <div className="card-table-wrapper">
        <div className="table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.92rem' }}>
            <Award size={17} style={{ color: 'var(--accent-purple)' }} />
            <span>Latest Unlocked Achievements</span>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.3rem 0.65rem', fontSize: '0.76rem' }}
            onClick={() => onNavigate('achievements')}
          >
            All Achievements
            <ArrowUpRight size={13} />
          </button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Achievement ID</th>
                <th>Category</th>
                <th>Points</th>
                <th>Player</th>
                <th>Associated Reward</th>
              </tr>
            </thead>
            <tbody>
              {recentAchievements.map(ach => (
                <tr key={ach.Ach_ID}>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>#{ach.Ach_ID}</td>
                  <td>
                    <strong style={{ color: '#fff' }}>{ach.Category}</strong>
                  </td>
                  <td>
                    <span style={{ color: 'var(--accent-amber)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      +{ach.Points} pts
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 500 }}>{ach.Player_Code}</span>
                  </td>
                  <td>
                    <span className="badge badge-pro">{ach.Reward_Type}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
