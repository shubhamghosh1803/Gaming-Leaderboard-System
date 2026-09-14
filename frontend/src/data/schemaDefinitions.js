// Schema definitions for the 15 normalized relations from DA1
// Source of truth: Handwritten DA1 (ARSHIYA - 25BCE5189)
// Gaming Leaderboard and Player Statistics System

export const SCHEMA_RELATIONS = [
  {
    id: 'Account',
    name: 'Account',
    primaryKey: ['Acc_ID'],
    foreignKeys: [],
    normalization: 'BCNF',
    description: 'User login account linked 1-to-1 with Player and 1-to-N with Rewards',
    attributes: [
      { name: 'Acc_ID', type: 'INT', isPK: true, isRequired: true, label: 'Account ID' },
      { name: 'Email', type: 'VARCHAR(100)', isRequired: true, label: 'Email' },
      { name: 'Status', type: 'VARCHAR(20)', isRequired: true, label: 'Status' },
      { name: 'DOB', type: 'DATE', isRequired: true, label: 'Date of Birth' },
      { name: 'Hash', type: 'VARCHAR(255)', isRequired: true, label: 'Password Hash' }
    ]
  },
  {
    id: 'Reward',
    name: 'Reward',
    primaryKey: ['Reward_ID'],
    foreignKeys: [{ attribute: 'Acc_ID', references: 'Account(Acc_ID)' }],
    normalization: 'BCNF',
    description: 'Rewards earned and received by Accounts',
    attributes: [
      { name: 'Reward_ID', type: 'INT', isPK: true, isRequired: true, label: 'Reward ID' },
      { name: 'R_Type', type: 'VARCHAR(50)', isRequired: true, label: 'Reward Type' },
      { name: 'ExpiryDate', type: 'DATE', isRequired: true, label: 'Expiry Date' },
      { name: 'Acc_ID', type: 'INT', isFK: true, references: 'Account', isRequired: true, label: 'Account ID' }
    ]
  },
  {
    id: 'Platform',
    name: 'Platform',
    primaryKey: ['Pla_ID'],
    foreignKeys: [],
    normalization: 'BCNF',
    description: 'Gaming hardware or platform (PC, PlayStation, Xbox, Switch)',
    attributes: [
      { name: 'Pla_ID', type: 'INT', isPK: true, isRequired: true, label: 'Platform ID' },
      { name: 'Name', type: 'VARCHAR(50)', isRequired: true, label: 'Platform Name' },
      { name: 'Release_y', type: 'INT', isRequired: true, label: 'Release Year' },
      { name: 'Manufacturer', type: 'VARCHAR(50)', isRequired: true, label: 'Manufacturer' }
    ]
  },
  {
    id: 'Player',
    name: 'Player',
    primaryKey: ['Player_ID'],
    foreignKeys: [{ attribute: 'Acc_ID', references: 'Account(Acc_ID)' }],
    normalization: 'BCNF',
    description: 'Core player entity. Decomposed composite Name into First, Middle, Last.',
    attributes: [
      { name: 'Player_ID', type: 'INT', isPK: true, isRequired: true, label: 'Player ID' },
      { name: 'Code', type: 'VARCHAR(20)', isRequired: true, label: 'Player Tag/Code' },
      { name: 'DOB', type: 'DATE', isRequired: true, label: 'Date of Birth' },
      { name: 'Skill_level', type: 'VARCHAR(20)', isRequired: true, label: 'Skill Level' },
      { name: 'First', type: 'VARCHAR(50)', isRequired: true, label: 'First Name' },
      { name: 'Middle', type: 'VARCHAR(50)', isRequired: false, label: 'Middle Name' },
      { name: 'Last', type: 'VARCHAR(50)', isRequired: true, label: 'Last Name' },
      { name: 'Acc_ID', type: 'INT', isFK: true, references: 'Account', isRequired: true, label: 'Account ID' }
    ]
  },
  {
    id: 'Player_Email',
    name: 'Player_Email',
    primaryKey: ['Player_ID', 'Email'],
    foreignKeys: [{ attribute: 'Player_ID', references: 'Player(Player_ID)' }],
    normalization: 'BCNF',
    description: 'Multivalued attribute relation for player email addresses',
    attributes: [
      { name: 'Player_ID', type: 'INT', isPK: true, isFK: true, references: 'Player', isRequired: true, label: 'Player ID' },
      { name: 'Email', type: 'VARCHAR(100)', isPK: true, isRequired: true, label: 'Email' }
    ]
  },
  {
    id: 'Casual_Player',
    name: 'Casual_Player',
    primaryKey: ['Player_ID'],
    foreignKeys: [{ attribute: 'Player_ID', references: 'Player(Player_ID)' }],
    normalization: 'BCNF',
    description: 'Specialization subclass of Player for casual gamers',
    attributes: [
      { name: 'Player_ID', type: 'INT', isPK: true, isFK: true, references: 'Player', isRequired: true, label: 'Player ID' },
      { name: 'Pref_score', type: 'INT', isRequired: true, label: 'Preferred Score' }
    ]
  },
  {
    id: 'Competitive_Player',
    name: 'Competitive_Player',
    primaryKey: ['Player_ID'],
    foreignKeys: [{ attribute: 'Player_ID', references: 'Player(Player_ID)' }],
    normalization: 'BCNF',
    description: 'Specialization subclass of Player for ranked competitive players',
    attributes: [
      { name: 'Player_ID', type: 'INT', isPK: true, isFK: true, references: 'Player', isRequired: true, label: 'Player ID' },
      { name: 'Rank', type: 'VARCHAR(30)', isRequired: true, label: 'Competitive Rank' }
    ]
  },
  {
    id: 'Professional_Player',
    name: 'Professional_Player',
    primaryKey: ['Player_ID'],
    foreignKeys: [
      { attribute: 'Player_ID', references: 'Player(Player_ID)' },
      { attribute: 'Team_ID', references: 'Team(Team_ID)' }
    ],
    normalization: 'BCNF',
    description: 'Specialization subclass of Player for salaried esports players signed to a Team',
    attributes: [
      { name: 'Player_ID', type: 'INT', isPK: true, isFK: true, references: 'Player', isRequired: true, label: 'Player ID' },
      { name: 'Team_ID', type: 'INT', isFK: true, references: 'Team', isRequired: true, label: 'Team ID' },
      { name: 'Salary', type: 'DECIMAL(10,2)', isRequired: true, label: 'Salary ($)' }
    ]
  },
  {
    id: 'Player_Achievement',
    name: 'Player_Achievement',
    primaryKey: ['Ach_ID'],
    foreignKeys: [
      { attribute: 'Player_ID', references: 'Player(Player_ID)' },
      { attribute: 'Reward_ID', references: 'Reward(Reward_ID)' }
    ],
    normalization: 'BCNF',
    description: 'Player achievements unlocked with associated points and rewards',
    attributes: [
      { name: 'Ach_ID', type: 'INT', isPK: true, isRequired: true, label: 'Achievement ID' },
      { name: 'Category', type: 'VARCHAR(50)', isRequired: true, label: 'Category' },
      { name: 'Points', type: 'INT', isRequired: true, label: 'Points' },
      { name: 'Player_ID', type: 'INT', isFK: true, references: 'Player', isRequired: true, label: 'Player ID' },
      { name: 'Reward_ID', type: 'INT', isFK: true, references: 'Reward', isRequired: false, label: 'Reward ID' }
    ]
  },
  {
    id: 'Game',
    name: 'Game',
    primaryKey: ['G_ID'],
    foreignKeys: [{ attribute: 'Player_ID', references: 'Player(Player_ID)' }],
    normalization: 'BCNF',
    description: 'Games played within the platform with creator/featured player reference',
    attributes: [
      { name: 'G_ID', type: 'INT', isPK: true, isRequired: true, label: 'Game ID' },
      { name: 'Name', type: 'VARCHAR(100)', isRequired: true, label: 'Game Name' },
      { name: 'Developer', type: 'VARCHAR(100)', isRequired: true, label: 'Developer' },
      { name: 'RDate', type: 'DATE', isRequired: true, label: 'Release Date' },
      { name: 'Max_Player', type: 'INT', isRequired: true, label: 'Max Players' },
      { name: 'Player_ID', type: 'INT', isFK: true, references: 'Player', isRequired: true, label: 'Player ID' }
    ]
  },
  {
    id: 'Team',
    name: 'Team',
    primaryKey: ['Team_ID'],
    foreignKeys: [],
    normalization: 'BCNF',
    description: 'Gaming organizations/teams. Address decomposed into State, Country, City, Street.',
    attributes: [
      { name: 'Team_ID', type: 'INT', isPK: true, isRequired: true, label: 'Team ID' },
      { name: 'Tag', type: 'VARCHAR(10)', isRequired: true, label: 'Team Tag' },
      { name: 'Name', type: 'VARCHAR(100)', isRequired: true, label: 'Team Name' },
      { name: 'State', type: 'VARCHAR(50)', isRequired: true, label: 'State' },
      { name: 'Country', type: 'VARCHAR(50)', isRequired: true, label: 'Country' },
      { name: 'City', type: 'VARCHAR(50)', isRequired: true, label: 'City' },
      { name: 'Street', type: 'VARCHAR(100)', isRequired: true, label: 'Street' }
    ]
  },
  {
    id: 'Match',
    name: 'Match',
    primaryKey: ['Match_ID'],
    foreignKeys: [],
    normalization: 'BCNF',
    description: 'Competitive and casual matches played',
    attributes: [
      { name: 'Match_ID', type: 'INT', isPK: true, isRequired: true, label: 'Match ID' },
      { name: 'Status', type: 'VARCHAR(20)', isRequired: true, label: 'Status' },
      { name: 'Score', type: 'INT', isRequired: true, label: 'Score' },
      { name: 'Duration', type: 'INT', isRequired: true, label: 'Duration (mins)' },
      { name: 'Result', type: 'VARCHAR(30)', isRequired: true, label: 'Result' },
      { name: 'Total_M', type: 'INT', isRequired: true, label: 'Total Matches/Participants' }
    ]
  },
  {
    id: 'Match_Play_Stats',
    name: 'Match_Play_Stats',
    primaryKey: ['Match_ID', 'Player_ID'],
    foreignKeys: [
      { attribute: 'Match_ID', references: 'Match(Match_ID)' },
      { attribute: 'Player_ID', references: 'Player(Player_ID)' },
      { attribute: 'L_ID', references: 'Leaderboard(L_ID)' }
    ],
    normalization: 'BCNF',
    description: 'Aggregated statistics per player per match, contributing directly to Leaderboard',
    attributes: [
      { name: 'Match_ID', type: 'INT', isPK: true, isFK: true, references: 'Match', isRequired: true, label: 'Match ID' },
      { name: 'Player_ID', type: 'INT', isPK: true, isFK: true, references: 'Player', isRequired: true, label: 'Player ID' },
      { name: 'Wins', type: 'INT', isRequired: true, label: 'Wins' },
      { name: 'Score', type: 'INT', isRequired: true, label: 'Score' },
      { name: 'Death', type: 'INT', isRequired: true, label: 'Deaths' },
      { name: 'Headshots', type: 'INT', isRequired: true, label: 'Headshots' },
      { name: 'Assists', type: 'INT', isRequired: true, label: 'Assists' },
      { name: 'Kills', type: 'INT', isRequired: true, label: 'Kills' },
      { name: 'L_ID', type: 'INT', isFK: true, references: 'Leaderboard', isRequired: true, label: 'Leaderboard ID' }
    ]
  },
  {
    id: 'Leaderboard',
    name: 'Leaderboard',
    primaryKey: ['L_ID'],
    foreignKeys: [],
    normalization: 'BCNF',
    description: 'System leaderboards categorized by type and ranking',
    attributes: [
      { name: 'L_ID', type: 'INT', isPK: true, isRequired: true, label: 'Leaderboard ID' },
      { name: 'L_Type', type: 'VARCHAR(50)', isRequired: true, label: 'Leaderboard Type' },
      { name: 'Last_updated', type: 'TIMESTAMP', isRequired: true, label: 'Last Updated' },
      { name: 'Ranking', type: 'INT', isRequired: true, label: 'Current Tier Ranking' },
      { name: 'Total_Participants', type: 'INT', isRequired: true, label: 'Total Participants' }
    ]
  },
  {
    id: 'Represents_in',
    name: 'Represents_in',
    primaryKey: ['Player_ID', 'Team_ID', 'Pla_ID', 'Match_ID'],
    foreignKeys: [
      { attribute: 'Player_ID', references: 'Player(Player_ID)' },
      { attribute: 'Team_ID', references: 'Team(Team_ID)' },
      { attribute: 'Pla_ID', references: 'Platform(Pla_ID)' },
      { attribute: 'Match_ID', references: 'Match(Match_ID)' }
    ],
    normalization: 'BCNF',
    description: 'Multi-way relation connecting player representation with team, platform, and match',
    attributes: [
      { name: 'Player_ID', type: 'INT', isPK: true, isFK: true, references: 'Player', isRequired: true, label: 'Player ID' },
      { name: 'Team_ID', type: 'INT', isPK: true, isFK: true, references: 'Team', isRequired: true, label: 'Team ID' },
      { name: 'Pla_ID', type: 'INT', isPK: true, isFK: true, references: 'Platform', isRequired: true, label: 'Platform ID' },
      { name: 'Match_ID', type: 'INT', isPK: true, isFK: true, references: 'Match', isRequired: true, label: 'Match ID' }
    ]
  }
];

export const PRESET_QUERIES = [
  {
    title: 'All Players with Account Details',
    sql: 'SELECT p.Player_ID, p.Code, p.First, p.Last, p.Skill_level, a.Email, a.Status FROM Player p JOIN Account a ON p.Acc_ID = a.Acc_ID;'
  },
  {
    title: 'Top Performers in Match Play Stats',
    sql: 'SELECT Player_ID, Match_ID, Kills, Death, Assists, ROUND(Kills / GREATEST(Death, 1), 2) AS KD_Ratio, Score FROM Match_Play_Stats ORDER BY Score DESC LIMIT 10;'
  },
  {
    title: 'Professional Players and Team Rosters',
    sql: 'SELECT pp.Player_ID, p.First, p.Last, t.Name AS Team_Name, t.Tag, pp.Salary FROM Professional_Player pp JOIN Player p ON pp.Player_ID = p.Player_ID JOIN Team t ON pp.Team_ID = t.Team_ID ORDER BY pp.Salary DESC;'
  },
  {
    title: 'Active Leaderboards & Participants',
    sql: 'SELECT L_ID, L_Type, Ranking, Total_Participants, Last_updated FROM Leaderboard ORDER BY Total_Participants DESC;'
  },
  {
    title: 'Player Achievements with Rewards',
    sql: 'SELECT pa.Ach_ID, pa.Player_ID, pa.Category, pa.Points, r.R_Type, r.ExpiryDate FROM Player_Achievement pa LEFT JOIN Reward r ON pa.Reward_ID = r.Reward_ID;'
  },
  {
    title: 'Multi-Way Representation in Matches',
    sql: 'SELECT r.Player_ID, p.Code, t.Name AS Team, pl.Name AS Platform, m.Match_ID, m.Result FROM Represents_in r JOIN Player p ON r.Player_ID = p.Player_ID JOIN Team t ON r.Team_ID = t.Team_ID JOIN Platform pl ON r.Pla_ID = pl.Pla_ID JOIN Match m ON r.Match_ID = m.Match_ID;'
  }
];
