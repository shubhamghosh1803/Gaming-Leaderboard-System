-- =========================================
-- 1. ACCOUNT
-- =========================================

INSERT INTO account
    (email, doc, password_hash, status)
VALUES
    ('faker.demo@league.com', 'Demo account', 'demo_hash_001', 'Active'),
    ('s1mple.demo@cs.com', 'Demo account', 'demo_hash_002', 'Active'),
    ('tenz.demo@valorant.com', 'Demo account', 'demo_hash_003', 'Active'),
    ('shroud.demo@gaming.com', 'Demo account', 'demo_hash_004', 'Active'),
    ('ninja.demo@gaming.com', 'Demo account', 'demo_hash_005', 'Active'),
    ('milan.demo@gaming.com', 'Demo account', 'demo_hash_006', 'Active');


-- =========================================
-- 2. COUNTRY_INFO
-- =========================================

INSERT INTO country_info
    (country_code, country_name)
VALUES
    ('KR', 'South Korea'),
    ('UA', 'Ukraine'),
    ('CA', 'Canada'),
    ('US', 'United States'),
    ('IN', 'India');


-- =========================================
-- 3. GAME
-- =========================================

INSERT INTO game
    (name, developer, release_date, max_players, genre)
VALUES
    ('League of Legends', 'Riot Games', '2009-10-27', 10, 'MOBA'),
    ('Counter-Strike 2', 'Valve', '2023-09-27', 10, 'First-Person Shooter'),
    ('VALORANT', 'Riot Games', '2020-06-02', 10, 'Tactical Shooter'),
    ('Dota 2', 'Valve', '2013-07-09', 10, 'MOBA'),
    ('Minecraft', 'Mojang Studios', '2011-11-18', 8, 'Sandbox');


-- =========================================
-- 4. PLATFORM
-- =========================================

INSERT INTO platform
    (platform_name, released, manufacturer)
VALUES
    ('PC', '1981-08-12', 'IBM'),
    ('PlayStation 5', '2020-11-12', 'Sony'),
    ('Xbox Series X', '2020-11-10', 'Microsoft'),
    ('Nintendo Switch', '2017-03-03', 'Nintendo');


-- =========================================
-- 5. REWARD_TYPE
-- =========================================

INSERT INTO reward_type
    (rtype, expirydate)
VALUES
    ('MVP', '2027-12-31'),
    ('CHAMPION', '2028-12-31'),
    ('ACHIEVEMENT', '2029-12-31'),
    ('SEASONAL', '2027-06-30');


-- =========================================
-- 6. TEAM
-- =========================================

INSERT INTO team
    (tag, team_name, state, city, street, country_code)
VALUES
    ('T1', 'T1 Esports', 'Seoul', 'Seoul', 'Gangnam-daero', 'KR'),
    ('NAVI', 'Natus Vincere', 'Kyiv Oblast', 'Kyiv', 'Khreshchatyk Street', 'UA'),
    ('SEN', 'Sentinels', 'California', 'Los Angeles', 'Sunset Boulevard', 'US'),
    ('C9', 'Cloud9', 'California', 'Los Angeles', 'Olympic Boulevard', 'US'),
    ('VIT', 'Velocity India', 'Tamil Nadu', 'Chennai', 'Anna Salai', 'IN');


-- =========================================
-- 7. PLAYER
-- =========================================

INSERT INTO player
    (code, dob, first_name, middle_name, last_name, skill_level, acc_id)
VALUES
    ('PLR001', '1996-05-07', 'Faker', NULL, 'Lee', 'Professional', 1),
    ('PLR002', '1997-10-02', 'Oleksandr', NULL, 'Kostyliev', 'Professional', 2),
    ('PLR003', '2001-05-05', 'Tyson', NULL, 'Ngo', 'Professional', 3),
    ('PLR004', '1994-06-02', 'Michael', NULL, 'Grzesiek', 'Advanced', 4),
    ('PLR005', '1991-12-05', 'Richard', NULL, 'Blevins', 'Advanced', 5),
    ('PLR006', '2005-02-15', 'Milan', NULL, 'Ghosh', 'Intermediate', 6);


-- =========================================
-- 8. REWARD
-- =========================================

INSERT INTO reward
    (rtype, acc_id)
VALUES
    ('MVP', 1),
    ('CHAMPION', 2),
    ('ACHIEVEMENT', 3),
    ('SEASONAL', 4),
    ('MVP', 5);


-- =========================================
-- 9. CASUAL_PLAYER
-- =========================================

INSERT INTO casual_player
    (player_id, professional_score)
VALUES
    (5, 780.50),
    (6, 645.00);


-- =========================================
-- 10. COMPETITIVE_PLAYER
-- =========================================

INSERT INTO competitive_player
    (player_id, player_rank)
VALUES
    (2, 1),
    (3, 2),
    (4, 15);


-- =========================================
-- 11. PROFESSIONAL_PLAYER
-- =========================================

INSERT INTO professional_player
    (player_id, team_id, salary)
VALUES
    (1, 1, 2500000.00),
    (2, 2, 1800000.00),
    (3, 3, 1200000.00);


-- =========================================
-- 12. MATCH
-- =========================================

INSERT INTO match
    (status, score, duration, result, total_matches)
VALUES
    ('Completed', '3-1', 145, 'T1 Victory', 4),
    ('Completed', '2-0', 98, 'NAVI Victory', 2),
    ('Ongoing', '1-1', 76, 'Match in progress', 3),
    ('Scheduled', NULL, NULL, NULL, 0),
    ('Cancelled', NULL, NULL, 'Technical issue', 0);


-- =========================================
-- 13. LEADERBOARD
-- =========================================

INSERT INTO leaderboard
    (ltype, ranking, total_participant)
VALUES
    ('Global Ranking', 1, 1000),
    ('Regional Ranking', 2, 250),
    ('Seasonal Ranking', 3, 500),
    ('Game-specific Ranking', 4, 300);


-- =========================================
-- 14. REPRESENTS_TEAM
-- =========================================

INSERT INTO represents_team
    (player_id, team_id)
VALUES
    (1, 1),
    (2, 2),
    (3, 3);


-- =========================================
-- 15. REPRESENTS_MATCH
-- =========================================

INSERT INTO represents_match
    (player_id, match_id)
VALUES
    (1, 1),
    (2, 1),
    (3, 2),
    (4, 3),
    (5, 4);


-- =========================================
-- 16. REPRESENTS_PLATFORM
-- =========================================

INSERT INTO represents_platform
    (player_id, plat_id)
VALUES
    (1, 1),
    (2, 1),
    (3, 1),
    (4, 1),
    (5, 2),
    (6, 1);


-- =========================================
-- 17. PLAYER_ACHIEVEMENT
-- =========================================

INSERT INTO player_achievement
    (category, points, player_id, reward_id)
VALUES
    ('World Championship Winner', 1000, 1, 1),
    ('Tournament MVP', 850, 2, 2),
    ('Match Winner', 500, 3, 3),
    ('Top 100 Player', 300, 4, 4),
    ('Community Champion', 200, 5, 5);


-- =========================================
-- 18. MATCH_PLAYER_STATS
-- =========================================

INSERT INTO match_player_stats
    (match_id, player_id, lb_id, wins, score, deaths,
     headshots, kills, assists, kd_ratio)
VALUES
    (1, 1, 1, 3, 950, 12, 25, 40, 18, 3.33),
    (1, 2, 1, 1, 720, 20, 18, 28, 12, 1.40),
    (2, 3, 2, 2, 880, 10, 30, 35, 20, 3.50),
    (3, 4, 3, 1, 650, 18, 15, 24, 14, 1.33),
    (4, 5, 4, 1, 500, 15, 10, 20, 16, 1.33);


-- =========================================
-- 19. ACCOUNT_EMAIL
-- =========================================

INSERT INTO account_email
    (player_id, email)
VALUES
    (1, 'faker.player@leaderboard.com'),
    (2, 's1mple.player@leaderboard.com'),
    (3, 'tenz.player@leaderboard.com'),
    (4, 'shroud.player@leaderboard.com'),
    (5, 'ninja.player@leaderboard.com'),
    (6, 'milan.player@leaderboard.com');

