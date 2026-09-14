# Frontend Architecture & Documentation
**Project:** Gaming Leaderboard and Player Statistics System (DBMS DA2)  
**Student:** Arshiya (25BCE5189)  
**Stack:** React 18, Vite 6, JavaScript (ES6+), Modular CSS  
**Git Branch:** `frontend-arshiya`

---

## 1. Architectural Overview
This frontend is built specifically for a college Database Management Systems (DBMS) project. The UI is designed to demonstrate:
1. **Source of Truth Alignment:** Direct reflection of the 15 BCNF normalized relations defined in handwritten DA1 without simplification.
2. **Interactive CRUD:** Add, Edit, and Delete operations on the core `Player` entity with relational integrity preservation.
3. **Teacher's Mandatory SQL Query Window:** Dynamic SQL console where any SQL statement can be executed, rendering dynamic column headers and rows without hardcoded layouts.
4. **Decoupled API Service Layer:** A clean abstraction layer (`src/api/*`) enabling independent frontend testing via isolated mock datasets, ready for immediate switchover to the teammate's live MySQL/ODBC REST API.

---

## 2. Directory Structure

```
gaming-leaderboard/
├── docs/
│   ├── API_CONTRACT.md          # REST API specifications for backend teammate
│   └── FRONTEND.md              # Frontend architecture & viva reference
├── public/
│   └── favicon.svg              # Gaming emblem favicon
├── src/
│   ├── api/
│   │   ├── client.js            # Unified fetch wrapper with baseURL & mock toggle
│   │   ├── playerApi.js         # Player CRUD operations (GET, POST, PUT, DELETE)
│   │   ├── queryApi.js          # SQL Query execution engine (POST /api/query)
│   │   ├── leaderboardApi.js    # Leaderboard & Match_Play_Stats API
│   │   └── statsApi.js          # Summary KPIs aggregator
│   ├── components/
│   │   ├── Navbar.jsx           # Top header bar, mode badge & toggle
│   │   ├── Sidebar.jsx          # Multi-tab navigation
│   │   ├── StatCard.jsx         # Summary KPI cards
│   │   ├── DataTable.jsx        # Generic responsive data table
│   │   ├── Modal.jsx            # Reusable dialog modal
│   │   ├── PlayerForm.jsx       # Add/Edit form with exact schema attributes
│   │   ├── ConfirmDialog.jsx    # Destructive action confirmation dialog
│   │   ├── QueryEditor.jsx      # SQL textarea editor with preset queries
│   │   └── QueryResultTable.jsx # Dynamic column & row result renderer
│   ├── data/
│   │   ├── schemaDefinitions.js # Metadata for all 15 tables (attributes, keys, BCNF)
│   │   └── mockData.js          # Isolated mock records adhering to the 15 relations
│   ├── pages/
│   │   ├── Dashboard.jsx        # High-level KPIs, top players, recent matches
│   │   ├── Players.jsx          # Player management: Add, Edit, Delete, Filter, Details
│   │   ├── Leaderboards.jsx     # Leaderboard rankings & Match_Play_Stats view
│   │   ├── EntitiesView.jsx     # Explorer for all relations (Game, Team, Match, etc.)
│   │   ├── SqlConsole.jsx       # Mandatory dynamic SQL query execution window
│   │   └── SchemaViewer.jsx     # Visual documentation of 15 relations & BCNF justifications
│   ├── styles/
│   │   └── index.css            # Dark mode gaming dashboard theme
│   ├── App.jsx                  # Main application router and state shell
│   └── main.jsx                 # Vite application entry point
├── .env.example                 # Environment variable template
├── .gitignore                   # Exclusions for node_modules, build, logs, .env
├── package.json
└── vite.config.js
```

---

## 3. The 15 Normalized Relations Handled
The schema strictly mirrors `Dbms Da1(25BCE5189) Arshiya.pdf`:
1. `Account (Acc_ID, Email, Status, DOB, Hash)`
2. `Reward (Reward_ID, R_Type, ExpiryDate, Acc_ID)`
3. `Platform (Pla_ID, Name, Release_y, Manufacturer)`
4. `Player (Player_ID, Code, DOB, Skill_level, First, Last, Middle, Acc_ID)`
5. `Player_Email (Player_ID, Email)`
6. `Casual_Player (Player_ID, Pref_score)`
7. `Competitive_Player (Player_ID, Rank)`
8. `Professional_Player (Player_ID, Team_ID, Salary)`
9. `Player_Achievement (Ach_ID, Category, Points, Player_ID, Reward_ID)`
10. `Game (G_ID, Name, Developer, RDate, Max_Player, Player_ID)`
11. `Team (Team_ID, Tag, Name, State, Country, City, Street)`
12. `Match (Match_ID, Status, Score, Duration, Result, Total_M)`
13. `Match_Play_Stats (Match_ID, Player_ID, Wins, Score, Death, Headshots, Assists, Kills, L_ID)`
14. `Leaderboard (L_ID, L_Type, Last_updated, Ranking, Total_Participants)`
15. `Represents_in (Player_ID, Team_ID, Pla_ID, Match_ID)`

---

## 4. Key Viva Questions & Answers
- **Q: Why is Name decomposed into First, Middle, Last in the Player relation?**  
  *A:* To satisfy 1NF. 1NF mandates that all attribute values must be atomic. Composite attributes like Name must be decomposed into indivisible components.
- **Q: Why is Email in a separate `Player_Email` table?**  
  *A:* A player may possess multiple email addresses. Multivalued attributes violate 1NF if stored in a single tuple; creating `Player_Email(Player_ID, Email)` satisfies 1NF and BCNF.
- **Q: How are subclasses handled (Casual, Competitive, Professional)?**  
  *A:* They represent a disjoint specialization hierarchy. The superclass `Player` holds common attributes (`Player_ID`, `Code`, `DOB`, `Skill_level`, `Name`, `Acc_ID`), and the sub-relations store only subclass-specific attributes with `Player_ID` serving as both Primary Key and Foreign Key.
- **Q: How does the SQL query window work?**  
  *A:* The frontend sends the raw SQL query to `POST /api/query`. The response contains dynamic column headers (`columns: string[]`) and rows (`rows: object[]`), which `QueryResultTable` maps dynamically without hardcoding table structures.
