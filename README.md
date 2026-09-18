# Gaming Leaderboard System

This project is a full-stack gaming leaderboard and player statistics application developed for a DBMS coursework assignment. The current implementation includes a PostgreSQL-backed FastAPI backend and a React + Vite frontend dashboard for managing database records and executing SQL queries.

## Team Members 

1. Shubham Ghosh - 25BCE5137  


2. Arshiya - 25BCE5189  
   

3. Mridu Kurup - 25BCE5123  
  

## Project Overview

The application currently includes:
- Player management
- Team management
- Game management
- Match management
- Leaderboard-related views
- Rewards and achievements pages
- Platform listing
- SQL query console
- Dashboard summary cards and recent activity sections

## Current Project Structure

```text
Gaming-Leaderboard-System/
├── README.md
├── requirements.txt
├── backend/
│   ├── database.py
│   ├── main.py
│   └── requirements.txt
├── database/
│   ├── schema.sql
│   ├── data.sql
│   └── queries.sql
├── frontend/
│   ├── README.md
│   ├── package.json
│   ├── vite.config.js
│   ├── docs/
│   │   ├── API_CONTRACT.md
│   │   └── FRONTEND.md
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── api/
│       ├── components/
│       ├── data/
│       ├── pages/
│       │   ├── Achievements.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Games.jsx
│       │   ├── Leaderboards.jsx
│       │   ├── Matches.jsx
│       │   ├── Platforms.jsx
│       │   ├── Players.jsx
│       │   ├── Rewards.jsx
│       │   ├── SqlConsole.jsx
│       │   └── Teams.jsx
│       └── styles/
└── .git/
```

## Verified Features Present in the Project

### Functionality Overview
- Player Management:
    Manage player records, account links, and profile details.
- Team Management:
    Create and track team records with location information.
- Game Management:
    Maintain game catalog information and metadata.
- Match Management:
    Manage match records, results, and match statistics.
- Leaderboard Management:
    View ranking information and leaderboard summaries.
- Rewards and Achievements:
    Track reward types, achievement records, and related data.
- Platform Management:
    Maintain listed gaming platforms and their metadata.
- SQL Console:
    Execute SQL statements directly from the frontend and view results.
- Dashboard:
    View summary metrics and recent activity for the platform.

### Backend
- FastAPI application configured in `backend/main.py`
- Database connection logic in `backend/database.py`
- PostgreSQL-based endpoints for:
  - players
  - games
  - teams
  - platforms
  - rewards
  - achievements
  - leaderboards
  - matches
  - dashboard summary statistics
  - SQL execution endpoint
- Health and database connectivity checks are available

### Frontend
The frontend pages currently implemented in `frontend/src/pages` are:
- Dashboard
- Players
- Leaderboards
- Matches
- Teams
- Games
- Achievements
- Rewards
- Platforms
- SQL Console

The UI includes forms, confirmation dialogs, data tables, and management controls for the main entities.

## Database Design Summary

The project uses a PostgreSQL relational schema defined in `database/schema.sql` and includes tables for:
- account and account_email
- country_info
- game
- platform
- reward_type and reward
- team
- player
- casual_player, competitive_player, and professional_player
- match
- leaderboard
- represents_team, represents_match, and represents_platform
- player_achievement
- match_player_stats

These tables model the core esports domain by separating user accounts, player roles, team associations, game metadata, match results, rankings, rewards, and performance statistics.

## API Documentation

The backend exposes REST endpoints for the main entities and analytics features.

### Core API Groups
- Players: `GET /players`, `GET /players/{player_id}`, `POST /players`, `PATCH /players/{player_id}`, `DELETE /players/{player_id}`
- Games: `GET /games`, `GET /games/{game_id}`, `POST /games`, `PATCH /games/{game_id}`, `DELETE /games/{game_id}`
- Teams: `GET /teams`, `GET /teams/{team_id}`, `POST /teams`, `PATCH /teams/{team_id}`, `DELETE /teams/{team_id}`
- Platforms: `GET /platforms`, `GET /platforms/{platform_id}`
- Rewards: `GET /rewards`, `GET /rewards/{reward_id}`
- Achievements: `GET /achievements`, `GET /achievements/{achievement_id}`
- Leaderboards: `GET /leaderboards`, `POST /leaderboards`, `GET /leaderboards/{leaderboard_id}`, `DELETE /leaderboards/{leaderboard_id}`
- Matches: `GET /matches`, `GET /matches/{match_id}`, `POST /matches`, `PATCH /matches/{match_id}`, `DELETE /matches/{match_id}`
- Stats: `GET /stats/summary`, `GET /players/{player_id}/statistics`
- SQL Query: `POST /query`
- Health: `GET /health`, `GET /db-test`

## Tech Stack

### Frontend
- React
- Vite
- JavaScript / JSX
- CSS
- Lucide React icons

### Backend
- Python
- FastAPI
- PostgreSQL
- Psycopg

## Database Setup

1. Ensure PostgreSQL is installed and running.
2. Create a database named `gaming_leaderboard`.
3. Import the schema file:

```bash
psql -d gaming_leaderboard -f database/schema.sql
```

4. Optionally load sample data:

```bash
psql -d gaming_leaderboard -f database/data.sql
```

5. Update the connection URL in `backend/database.py` if required for your local PostgreSQL setup.

Current project connection string:

```python
DATABASE_URL = (
    "postgresql://postgres:<your_password>@localhost:5432/gaming_leaderboard"
)
```

## Backend Setup

From the project root:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend Setup

From the project root:

```bash
cd frontend
npm install
npm run dev
```

Then open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

For production build:

```bash
npm run build
```

## Application Workflow

1. Start PostgreSQL.
2. Set up the database schema.
3. Run the FastAPI backend.
4. Run the React frontend.
5. Use the dashboard and management pages to interact with the data.
6. Use the SQL Console to execute database queries.

## Notes

- This README reflects only features and structure currently present in the repository.
- The project is a working DBMS demo with backend API integration and frontend data management interfaces.

## Submission Summary

This project is suitable for a DBMS DA2 submission as a functional application containing:
- a database schema,
- backend APIs,
- frontend dashboard and CRUD-style pages,
- SQL query execution support,
- team-based development responsibilities.
