-- =========================================
-- 1. Display all players
-- =========================================

SELECT *
FROM player;


-- =========================================
-- 2. Display all games
-- =========================================

SELECT *
FROM game;


-- =========================================
-- 3. Display professional players
-- =========================================

SELECT
    p.player_id,
    p.first_name,
    p.last_name,
    p.skill_level,
    pp.salary
FROM player p
JOIN professional_player pp
    ON p.player_id = pp.player_id;


-- =========================================
-- 4. Display players and their accounts
-- =========================================

SELECT
    p.player_id,
    p.first_name,
    p.last_name,
    a.email,
    a.status
FROM player p
JOIN account a
    ON p.acc_id = a.acc_id;


-- =========================================
-- 5. Display professional players and their teams
-- =========================================

SELECT
    p.first_name,
    p.last_name,
    t.team_name,
    t.tag
FROM player p
JOIN professional_player pp
    ON p.player_id = pp.player_id
JOIN team t
    ON pp.team_id = t.team_id;


-- =========================================
-- 6. Display teams with their countries
-- =========================================

SELECT
    t.team_name,
    t.tag,
    c.country_name
FROM team t
JOIN country_info c
    ON t.country_code = c.country_code;


-- =========================================
-- 7. Display all rewards with account details
-- =========================================

SELECT
    r.reward_id,
    r.rtype,
    a.email
FROM reward r
JOIN account a
    ON r.acc_id = a.acc_id;


-- =========================================
-- 8. Count players by skill level
-- =========================================

SELECT
    skill_level,
    COUNT(*) AS total_players
FROM player
GROUP BY skill_level
ORDER BY total_players DESC;


-- =========================================
-- 9. Find players with more than 500 achievement points
-- =========================================

SELECT
    p.first_name,
    p.last_name,
    pa.category,
    pa.points
FROM player p
JOIN player_achievement pa
    ON p.player_id = pa.player_id
WHERE pa.points > 500
ORDER BY pa.points DESC;


-- =========================================
-- 10. Display match statistics
-- =========================================

SELECT
    mps.match_id,
    p.first_name,
    p.last_name,
    mps.wins,
    mps.kills,
    mps.deaths,
    mps.assists,
    mps.kd_ratio
FROM match_player_stats mps
JOIN player p
    ON mps.player_id = p.player_id
ORDER BY mps.kd_ratio DESC;


-- =========================================
-- 11. Find the highest-scoring players
-- =========================================

SELECT
    p.first_name,
    p.last_name,
    SUM(mps.score) AS total_score
FROM player p
JOIN match_player_stats mps
    ON p.player_id = mps.player_id
GROUP BY p.player_id, p.first_name, p.last_name
ORDER BY total_score DESC;


-- =========================================
-- 12. Count players in each team
-- =========================================

SELECT
    t.team_name,
    COUNT(rt.player_id) AS total_players
FROM team t
LEFT JOIN represents_team rt
    ON t.team_id = rt.team_id
GROUP BY t.team_id, t.team_name
ORDER BY total_players DESC;


-- =========================================
-- 13. Display completed matches
-- =========================================

SELECT
    match_id,
    status,
    score,
    duration,
    result
FROM match
WHERE status = 'Completed';


-- =========================================
-- 14. Find the average player score
-- =========================================

SELECT
    AVG(score) AS average_score
FROM match_player_stats;


-- =========================================
-- 15. Display players ranked by total kills
-- =========================================

SELECT
    p.first_name,
    p.last_name,
    SUM(mps.kills) AS total_kills
FROM player p
JOIN match_player_stats mps
    ON p.player_id = mps.player_id
GROUP BY p.player_id, p.first_name, p.last_name
ORDER BY total_kills DESC;