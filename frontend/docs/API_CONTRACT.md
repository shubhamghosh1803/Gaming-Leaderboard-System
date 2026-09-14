# Frontend-Backend API Contract (FastAPI + ODBC + MySQL)
**Project:** Gaming Leaderboard and Player Statistics System (College DBMS Project DA2)  
**Student:** Arshiya (25BCE5189) — Frontend Development  
**Backend & Database:** Teammates (FastAPI Backend + ODBC Connectivity + MySQL Database)

This document establishes the official REST API integration contract between the React Frontend and the FastAPI/ODBC/MySQL Backend. All field names and entities directly correspond to the 15 BCNF normalized relations defined in the DBMS DA1 design.

---

## Base URL Configuration
- **FastAPI Default Base URL:** `http://127.0.0.1:8000/api`
- **Configurable via:** `VITE_API_BASE_URL` in `.env`
- **Standalone Mock Mode:** Toggleable via `VITE_USE_MOCK=true/false` in `.env`

---

## 1. Player Management API

### 1.1 Get All Players
- **Endpoint:** `GET /players`
- **Description:** Retrieve all player records with joined specialization data and account metadata.
- **Response Format:**
```json
[
  {
    "Player_ID": 1,
    "Code": "ARSH_99",
    "DOB": "2004-05-14",
    "Skill_level": "Grandmaster",
    "First": "Arshiya",
    "Middle": "",
    "Last": "Mehta",
    "Acc_ID": 101,
    "FullName": "Arshiya Mehta",
    "Age": 22,
    "Account_Email": "arshiya.gamer@arena.net",
    "Emails": ["arshiya.gamer@arena.net", "arshiya.alt@gaming.org"],
    "PlayerType": "Professional",
    "Specialization": {
      "Team_ID": 10,
      "Team_Name": "Sentinels Gaming",
      "Team_Tag": "SENT",
      "Salary": 95000.00
    }
  }
]
```

### 1.2 Get Player By ID
- **Endpoint:** `GET /players/{id}`
- **Primary Key:** `Player_ID` (integer)

### 1.3 Create Player (Add)
- **Endpoint:** `POST /players`
- **Required Fields:** `Player_ID`, `Code`, `DOB`, `First`, `Last`, `Acc_ID`
- **Payload Example:**
```json
{
  "Player_ID": 9,
  "Code": "VIPER_99",
  "DOB": "2003-10-12",
  "Skill_level": "Diamond",
  "First": "Sanya",
  "Middle": "K",
  "Last": "Malhotra",
  "Acc_ID": 101,
  "PlayerType": "Competitive",
  "Rank": "Diamond I",
  "Email": "sanya.viper@arena.gg"
}
```

### 1.4 Update Player (Edit)
- **Endpoint:** `PUT /players/{id}`
- **Editable Attributes:** `Code`, `DOB`, `Skill_level`, `First`, `Middle`, `Last`, `Acc_ID`, `PlayerType`, specialization fields. Preserves `Player_ID` primary key integrity.

### 1.5 Delete Player
- **Endpoint:** `DELETE /players/{id}`
- **Description:** Deletes the player record and cascade deletes corresponding tuples in `Casual_Player`, `Competitive_Player`, `Professional_Player`, and `Player_Email`.

---

## 2. Match Management API

### 2.1 Get All Matches
- **Endpoint:** `GET /matches`
- **Response Format:**
```json
[
  {
    "Match_ID": 201,
    "Status": "Completed",
    "Score": 13,
    "Duration": 38,
    "Result": "Victory",
    "Total_M": 10
  }
]
```

### 2.2 Create Match
- **Endpoint:** `POST /matches`
- **Payload:** `{"Match_ID": 206, "Status": "Completed", "Score": 15, "Duration": 35, "Result": "Victory", "Total_M": 10}`

### 2.3 Update Match
- **Endpoint:** `PUT /matches/{id}`
- **Payload:** `{"Status": "Completed", "Score": 16, "Duration": 40, "Result": "Victory", "Total_M": 10}`

### 2.4 Delete Match
- **Endpoint:** `DELETE /matches/{id}`

---

## 3. Esports Teams API

### 3.1 Get All Teams
- **Endpoint:** `GET /teams`
- **Response Format:**
```json
[
  {
    "Team_ID": 10,
    "Tag": "SENT",
    "Name": "Sentinels Gaming",
    "State": "California",
    "Country": "USA",
    "City": "Los Angeles",
    "Street": "742 Sunset Blvd"
  }
]
```

### 3.2 Create Team
- **Endpoint:** `POST /teams`
- **Payload:** `{"Team_ID": 50, "Tag": "TL", "Name": "Team Liquid", "Street": "124 Sunset Blvd", "City": "Utrecht", "State": "Utrecht", "Country": "Netherlands"}`

### 3.3 Update Team
- **Endpoint:** `PUT /teams/{id}`

### 3.4 Delete Team
- **Endpoint:** `DELETE /teams/{id}`

---

## 4. Games Catalog API

### 4.1 Get All Games
- **Endpoint:** `GET /games`
- **Response Format:**
```json
[
  {
    "G_ID": 1,
    "Name": "Valorant Protocol",
    "Developer": "Riot Games",
    "RDate": "2020-06-02",
    "Max_Player": 10,
    "Player_ID": 1
  }
]
```

### 4.2 Create Game
- **Endpoint:** `POST /games`
- **Payload:** `{"G_ID": 5, "Name": "Overwatch 2", "Developer": "Blizzard", "RDate": "2022-10-04", "Max_Player": 10, "Player_ID": 1}`

### 4.3 Update Game
- **Endpoint:** `PUT /games/{id}`

### 4.4 Delete Game
- **Endpoint:** `DELETE /games/{id}`

---

## 5. Achievements, Rewards & Platforms APIs

### 5.1 Player Achievements
- **Endpoint:** `GET /achievements`
- **Attributes:** `Ach_ID`, `Category`, `Points`, `Player_ID`, `Reward_ID`

### 5.2 Reward Inventory
- **Endpoint:** `GET /rewards`
- **Attributes:** `Reward_ID`, `R_Type`, `ExpiryDate`, `Acc_ID`

### 5.3 Hardware Platforms
- **Endpoint:** `GET /platforms`
- **Attributes:** `Pla_ID`, `Name`, `Release_y`, `Manufacturer`

---

## 6. Dynamic SQL Query Console API (Teacher's Mandatory Requirement)

- **Endpoint:** `POST /query`
- **Description:** Mandatory DA2 requirement: User enters SQL statements to inspect relational records dynamically.
- **Request Body:**
```json
{
  "query": "SELECT p.Player_ID, p.Code, p.First, p.Last, m.Score FROM Player p JOIN Match_Play_Stats m ON p.Player_ID = m.Player_ID;"
}
```
- **Response Format:**
```json
{
  "columns": ["Player_ID", "Code", "First", "Last", "Score"],
  "rows": [
    {
      "Player_ID": 1,
      "Code": "ARSH_99",
      "First": "Arshiya",
      "Last": "Mehta",
      "Score": 3450
    }
  ],
  "rowCount": 1,
  "executionTimeMs": 14
}
```

---

## 7. Dashboard KPI Summary API

- **Endpoint:** `GET /stats/summary`
- **Response Format:**
```json
{
  "totalPlayers": 8,
  "totalGames": 4,
  "totalMatches": 5,
  "totalTeams": 4,
  "totalLeaderboards": 4,
  "totalKills": 117,
  "totalScore": 18660
}
```

---

## 8. Leaderboard & Match Play Stats API

### 8.1 Get All Leaderboards
- **Endpoint:** `GET /leaderboards`

### 8.2 Get Leaderboard Rankings
- **Endpoint:** `GET /leaderboards/{id}/rankings`
- **Description:** Returns `Match_Play_Stats` records joined with `Player` and `Match` for the specified `L_ID`.
