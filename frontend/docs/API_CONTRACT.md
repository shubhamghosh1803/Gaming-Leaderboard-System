# Frontend-Backend API Contract
**Project:** Gaming Leaderboard and Player Statistics System (College DBMS Project DA2)  
**Student:** Arshiya (25BCE5189) — Frontend Development  
**Backend & Database:** Teammates (MySQL + ODBC Connectivity)

This document establishes the official REST API integration contract between the React Frontend and the MySQL/ODBC Backend. All field names and entities directly correspond to the 15 BCNF normalized relations defined in the DBMS DA1 design.

---

## Base URL Configuration
- **Default Base URL:** `http://localhost:5000/api`
- **Configurable via:** `VITE_API_BASE_URL` in `.env`

---

## 1. Player Management API

### 1.1 Get All Players
- **Endpoint:** `GET /players`
- **Description:** Retrieve all player records with joined specialization data and account metadata.
- **Request Body:** None
- **Expected Status Code:** `200 OK`
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
- **Endpoint:** `GET /players/:id`
- **Primary Key:** `Player_ID` (integer)
- **Expected Status Code:** `200 OK` / `404 Not Found`

### 1.3 Create Player (Add)
- **Endpoint:** `POST /players`
- **Description:** Insert a new tuple into the `Player` relation, and optionally into `Player_Email`, `Casual_Player`, `Competitive_Player`, or `Professional_Player`.
- **Required Fields:** `Player_ID`, `Code`, `DOB`, `First`, `Last`, `Acc_ID`
- **Request Body:**
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
- **Expected Status Code:** `201 Created`
- **Response Format:** Returns the newly created enriched player record.
- **Error Responses:**
  - `400 Bad Request`: Validation failure (missing required fields).
  - `409 Conflict`: Primary Key Violation (`Player_ID` already exists) or Foreign Key Violation (`Acc_ID` not found in `Account`).

### 1.4 Update Player (Edit)
- **Endpoint:** `PUT /players/:id`
- **Description:** Updates editable attributes of an existing player. Preserves primary key integrity (`Player_ID` cannot be modified).
- **Request Body:**
```json
{
  "Code": "VIPER_MOD",
  "DOB": "2003-10-12",
  "Skill_level": "Master",
  "First": "Sanya",
  "Middle": "K",
  "Last": "Malhotra",
  "Acc_ID": 101,
  "PlayerType": "Competitive",
  "Rank": "Master II"
}
```
- **Expected Status Code:** `200 OK`
- **Error Response:** `404 Not Found` if `Player_ID` doesn't exist.

### 1.5 Delete Player
- **Endpoint:** `DELETE /players/:id`
- **Description:** Deletes the player record and cascade deletes corresponding records in `Casual_Player`, `Competitive_Player`, `Professional_Player`, and `Player_Email`.
- **Expected Status Code:** `200 OK` or `204 No Content`
- **Response Format:**
```json
{
  "success": true,
  "message": "Player #9 deleted successfully."
}
```

---

## 2. Dynamic SQL Query Window API (Teacher Requirement)

- **Endpoint:** `POST /query`
- **Description:** Mandatory DA2 teacher specification: "There can be a query window where SQL query is entered and corresponding record should come."
- **Expected Behavior:** Backend executes the query via MySQL / ODBC and returns column headers and rows dynamically.

### Request Body:
```json
{
  "query": "SELECT p.Player_ID, p.Code, p.First, p.Last, a.Email FROM Player p JOIN Account a ON p.Acc_ID = a.Acc_ID;"
}
```

### Response Body:
```json
{
  "columns": ["Player_ID", "Code", "First", "Last", "Email"],
  "rows": [
    {
      "Player_ID": 1,
      "Code": "ARSH_99",
      "First": "Arshiya",
      "Last": "Mehta",
      "Email": "arshiya.gamer@arena.net"
    }
  ],
  "rowCount": 1,
  "executionTimeMs": 14
}
```

### Error Response (`400 Bad Request` or `500 Internal Server Error`):
```json
{
  "error": "Table 'gaming_db.non_existent_table' doesn't exist in MySQL database."
}
```

---

## 3. Dashboard & Statistics API

### 3.1 Get Dashboard Summary
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

## 4. Leaderboard & Match Play Stats API

### 4.1 Get All Leaderboards
- **Endpoint:** `GET /leaderboards`
- **Response Format:** List of records from relation `Leaderboard (L_ID, L_Type, Last_updated, Ranking, Total_Participants)`

### 4.2 Get Leaderboard Rankings
- **Endpoint:** `GET /leaderboards/:id/rankings`
- **Response Format:** Records from `Match_Play_Stats` joined with `Player` and `Match`.

---

## 5. Standard Error Format
All endpoints return standard JSON error structures:
```json
{
  "error": "Error title or message",
  "details": "Specific constraint failure or validation details",
  "statusCode": 400
}
```
