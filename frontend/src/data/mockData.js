// Isolated Mock Database conforming 100% to the 15 Relations
// from the handwritten DBMS DA1 relational mapping.

export const initialAccounts = [
  { Acc_ID: 101, Email: 'arshiya.gamer@arena.net', Status: 'Active', DOB: '2004-05-14', Hash: '$2b$10$e8Z/71LqK/Y8H.129bXaae' },
  { Acc_ID: 102, Email: 'vortex.shadow@gaming.org', Status: 'Active', DOB: '2002-11-20', Hash: '$2b$10$g7K/82MpL/Z9J.230cYbbf' },
  { Acc_ID: 103, Email: 'cyber.valk@esports.com', Status: 'Active', DOB: '2003-08-09', Hash: '$2b$10$h9L/93NqM/A0K.341dZccg' },
  { Acc_ID: 104, Email: 'titan.blaze@proleague.io', Status: 'Active', DOB: '2001-03-30', Hash: '$2b$10$i0M/04OrN/B1L.452eAddh' },
  { Acc_ID: 105, Email: 'neon.sniper@fragzone.gg', Status: 'Suspended', DOB: '2005-01-18', Hash: '$2b$10$j1N/15PsO/C2M.563fBeei' },
  { Acc_ID: 106, Email: 'phantom.strike@meta.dev', Status: 'Active', DOB: '2000-07-22', Hash: '$2b$10$k2O/26QtP/D3N.674gCffj' },
  { Acc_ID: 107, Email: 'apex.predator@glory.com', Status: 'Active', DOB: '2003-12-05', Hash: '$2b$10$l3P/37RuQ/E4O.785hDggk' },
  { Acc_ID: 108, Email: 'quantum.rush@rush.tv', Status: 'Inactive', DOB: '2004-09-15', Hash: '$2b$10$m4Q/48SvR/F5P.896iEhhL' }
];

export const initialRewards = [
  { Reward_ID: 501, R_Type: 'Mythic Skin Pack', ExpiryDate: '2026-12-31', Acc_ID: 101 },
  { Reward_ID: 502, R_Type: 'Championship Trophy Badge', ExpiryDate: '2027-01-01', Acc_ID: 102 },
  { Reward_ID: 503, R_Type: '5000 Season Credits', ExpiryDate: '2026-11-15', Acc_ID: 103 },
  { Reward_ID: 504, R_Type: 'Golden Weapon Shard', ExpiryDate: '2026-10-30', Acc_ID: 104 },
  { Reward_ID: 505, R_Type: 'VIP Tournament Pass', ExpiryDate: '2027-06-30', Acc_ID: 106 },
  { Reward_ID: 506, R_Type: 'Diamond Avatar Frame', ExpiryDate: '2026-08-20', Acc_ID: 107 }
];

export const initialPlatforms = [
  { Pla_ID: 1, Name: 'PC Windows', Release_y: 2020, Manufacturer: 'Microsoft' },
  { Pla_ID: 2, Name: 'PlayStation 5', Release_y: 2020, Manufacturer: 'Sony Interactive' },
  { Pla_ID: 3, Name: 'Xbox Series X', Release_y: 2020, Manufacturer: 'Microsoft' },
  { Pla_ID: 4, Name: 'Nintendo Switch OLED', Release_y: 2021, Manufacturer: 'Nintendo' },
  { Pla_ID: 5, Name: 'Steam Deck OLED', Release_y: 2023, Manufacturer: 'Valve' }
];

export const initialPlayers = [
  { Player_ID: 1, Code: 'ARSH_99', DOB: '2004-05-14', Skill_level: 'Grandmaster', First: 'Arshiya', Middle: '', Last: 'Mehta', Acc_ID: 101 },
  { Player_ID: 2, Code: 'SHADOW_X', DOB: '2002-11-20', Skill_level: 'Diamond', First: 'Kavya', Middle: 'N', Last: 'Sharma', Acc_ID: 102 },
  { Player_ID: 3, Code: 'VALKYRIE', DOB: '2003-08-09', Skill_level: 'Master', First: 'Rohan', Middle: 'K', Last: 'Verma', Acc_ID: 103 },
  { Player_ID: 4, Code: 'BLAZE_T', DOB: '2001-03-30', Skill_level: 'Grandmaster', First: 'Aditya', Middle: '', Last: 'Singhania', Acc_ID: 104 },
  { Player_ID: 5, Code: 'NEON_SN', DOB: '2005-01-18', Skill_level: 'Gold', First: 'Pooja', Middle: 'R', Last: 'Iyer', Acc_ID: 105 },
  { Player_ID: 6, Code: 'PHANTOM', DOB: '2000-07-22', Skill_level: 'Platinum', First: 'Vikram', Middle: 'S', Last: 'Patel', Acc_ID: 106 },
  { Player_ID: 7, Code: 'PREDATOR', DOB: '2003-12-05', Skill_level: 'Master', First: 'Tanvi', Middle: '', Last: 'Deshmukh', Acc_ID: 107 },
  { Player_ID: 8, Code: 'QRUSH_8', DOB: '2004-09-15', Skill_level: 'Silver', First: 'Siddharth', Middle: 'M', Last: 'Nair', Acc_ID: 108 }
];

export const initialPlayerEmails = [
  { Player_ID: 1, Email: 'arshiya.gamer@arena.net' },
  { Player_ID: 1, Email: 'arshiya.alt@gaming.org' },
  { Player_ID: 2, Email: 'vortex.shadow@gaming.org' },
  { Player_ID: 3, Email: 'cyber.valk@esports.com' },
  { Player_ID: 4, Email: 'titan.blaze@proleague.io' },
  { Player_ID: 5, Email: 'neon.sniper@fragzone.gg' },
  { Player_ID: 6, Email: 'phantom.strike@meta.dev' },
  { Player_ID: 7, Email: 'apex.predator@glory.com' },
  { Player_ID: 8, Email: 'quantum.rush@rush.tv' }
];

export const initialCasualPlayers = [
  { Player_ID: 5, Pref_score: 4200 },
  { Player_ID: 8, Pref_score: 3100 }
];

export const initialCompetitivePlayers = [
  { Player_ID: 2, Rank: 'Diamond II' },
  { Player_ID: 6, Rank: 'Platinum I' },
  { Player_ID: 7, Rank: 'Master IV' }
];

export const initialProfessionalPlayers = [
  { Player_ID: 1, Team_ID: 10, Salary: 95000.00 },
  { Player_ID: 3, Team_ID: 10, Salary: 82000.00 },
  { Player_ID: 4, Team_ID: 20, Salary: 110000.00 }
];

export const initialTeams = [
  { Team_ID: 10, Tag: 'SENT', Name: 'Sentinels Gaming', State: 'California', Country: 'USA', City: 'Los Angeles', Street: '742 Sunset Blvd' },
  { Team_ID: 20, Tag: 'FNC', Name: 'Fnatic Esports', State: 'Greater London', Country: 'UK', City: 'London', Street: '10 Bermondsey St' },
  { Team_ID: 30, Tag: 'T1', Name: 'T1 Entertainment', State: 'Seoul Capital', Country: 'South Korea', City: 'Seoul', Street: '14 Gangnam-daero' },
  { Team_ID: 40, Tag: 'GODL', Name: 'GodLike Esports', State: 'Maharashtra', Country: 'India', City: 'Mumbai', Street: '45 Bandra Link Rd' }
];

export const initialGames = [
  { G_ID: 1, Name: 'Valorant Protocol', Developer: 'Riot Games', RDate: '2020-06-02', Max_Player: 10, Player_ID: 1 },
  { G_ID: 2, Name: 'Apex Arena Champions', Developer: 'Respawn', RDate: '2019-02-04', Max_Player: 60, Player_ID: 4 },
  { G_ID: 3, Name: 'Counter-Strike 2 Tactical', Developer: 'Valve Corp', RDate: '2023-09-27', Max_Player: 10, Player_ID: 3 },
  { G_ID: 4, Name: 'Rocket Turbo League', Developer: 'Psyonix', RDate: '2015-07-07', Max_Player: 6, Player_ID: 6 }
];

export const initialLeaderboards = [
  { L_ID: 1001, L_Type: 'Global Radiant MMR', Last_updated: '2026-09-14 13:00:00', Ranking: 1, Total_Participants: 24500 },
  { L_ID: 1002, L_Type: 'Seasonal Apex Predator', Last_updated: '2026-09-14 12:45:00', Ranking: 1, Total_Participants: 18200 },
  { L_ID: 1003, L_Type: 'CS2 Premier Regional', Last_updated: '2026-09-14 11:30:00', Ranking: 1, Total_Participants: 32000 },
  { L_ID: 1004, L_Type: 'Turbo League 3v3 All-Star', Last_updated: '2026-09-14 10:15:00', Ranking: 1, Total_Participants: 14000 }
];

export const initialMatches = [
  { Match_ID: 201, Status: 'Completed', Score: 13, Duration: 38, Result: 'Victory', Total_M: 10 },
  { Match_ID: 202, Status: 'Completed', Score: 9, Duration: 42, Result: 'Defeat', Total_M: 10 },
  { Match_ID: 203, Status: 'Completed', Score: 24, Duration: 22, Result: 'Victory', Total_M: 60 },
  { Match_ID: 204, Status: 'In-Progress', Score: 8, Duration: 18, Result: 'Pending', Total_M: 10 },
  { Match_ID: 205, Status: 'Completed', Score: 16, Duration: 45, Result: 'Victory', Total_M: 10 }
];

export const initialMatchPlayStats = [
  { Match_ID: 201, Player_ID: 1, Wins: 1, Score: 3450, Death: 8, Headshots: 19, Assists: 7, Kills: 26, L_ID: 1001 },
  { Match_ID: 201, Player_ID: 3, Wins: 1, Score: 2980, Death: 10, Headshots: 14, Assists: 12, Kills: 21, L_ID: 1001 },
  { Match_ID: 202, Player_ID: 2, Wins: 0, Score: 2120, Death: 14, Headshots: 11, Assists: 4, Kills: 15, L_ID: 1001 },
  { Match_ID: 203, Player_ID: 4, Wins: 1, Score: 4100, Death: 2, Headshots: 28, Assists: 9, Kills: 18, L_ID: 1002 },
  { Match_ID: 205, Player_ID: 6, Wins: 1, Score: 2890, Death: 12, Headshots: 15, Assists: 6, Kills: 19, L_ID: 1003 },
  { Match_ID: 205, Player_ID: 7, Wins: 1, Score: 3120, Death: 9, Headshots: 17, Assists: 10, Kills: 22, L_ID: 1003 }
];

export const initialPlayerAchievements = [
  { Ach_ID: 801, Category: 'Combat Mastery', Points: 500, Player_ID: 1, Reward_ID: 501 },
  { Ach_ID: 802, Category: 'Sharpshooter Headshots', Points: 750, Player_ID: 1, Reward_ID: 502 },
  { Ach_ID: 803, Category: 'Flawless Victory', Points: 400, Player_ID: 3, Reward_ID: 503 },
  { Ach_ID: 804, Category: 'Apex Legend Survivor', Points: 1000, Player_ID: 4, Reward_ID: 504 },
  { Ach_ID: 805, Category: 'Clutch King', Points: 350, Player_ID: 6, Reward_ID: 505 },
  { Ach_ID: 806, Category: 'First Blood Streak', Points: 600, Player_ID: 7, Reward_ID: 506 }
];

export const initialRepresentsIn = [
  { Player_ID: 1, Team_ID: 10, Pla_ID: 1, Match_ID: 201 },
  { Player_ID: 3, Team_ID: 10, Pla_ID: 1, Match_ID: 201 },
  { Player_ID: 2, Team_ID: 40, Pla_ID: 2, Match_ID: 202 },
  { Player_ID: 4, Team_ID: 20, Pla_ID: 1, Match_ID: 203 },
  { Player_ID: 6, Team_ID: 30, Pla_ID: 3, Match_ID: 205 },
  { Player_ID: 7, Team_ID: 10, Pla_ID: 1, Match_ID: 205 }
];
