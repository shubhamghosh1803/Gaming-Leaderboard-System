# Gaming Leaderboard and Player Statistics System
**Coursework:** DBMS Digital Assignment 2 (DA2)  
**Student:** Arshiya (Reg No: 25BCE5189)  
**Role:** Frontend Developer  
**Branch:** `frontend-arshiya`

---

## 1. Project Overview
The **Gaming Leaderboard and Player Statistics System** is a full-featured database management dashboard designed to manage competitive gaming ecosystems. It integrates players, accounts, tournaments, games, teams, platforms, and match performance statistics across **15 BCNF normalized relations**.

### Teacher's Mandatory DA2 Requirements Covered:
- [x] **Frontend Design:** Clean, modern, responsive gaming dashboard built with React + Vite.
- [x] **Add Functionality:** Modal form with field validation and primary key integrity checking.
- [x] **Edit Functionality:** Modification of player attributes while preserving primary keys.
- [x] **Delete Functionality:** Destructive removal with user confirmation dialog.
- [x] **Dynamic SQL Query Window:** Dedicated SQL editor where queries can be run and results dynamically rendered in column/row tables.
- [x] **ODBC & Backend Boundary:** Decoupled REST API service layer with isolated mock fallback for seamless integration with teammate's MySQL/ODBC backend.

---

## 2. Technology Stack
- **Library:** React 18
- **Build Tool:** Vite 6
- **Language:** JavaScript (ES6+ / JSX)
- **Icons:** Lucide React
- **Styling:** Custom CSS with CSS variables, responsive grid & flexbox layouts

---

## 3. Quick Start & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

### Installation
```bash
# Clone or navigate to repository
cd gaming-leaderboard

# Install dependencies
npm install
```

### Running in Development Mode
```bash
# Start Vite development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
npm run build
```
Creates an optimized production bundle in `dist/`.

---

## 4. API Configuration & Backend Integration
The frontend includes an isolated mock dataset that allows full functionality without requiring an active MySQL connection.

To connect to your teammate's MySQL/ODBC backend:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set `VITE_USE_MOCK=false`
3. Configure `VITE_API_BASE_URL` to point to the backend server (e.g. `http://localhost:5000/api`).
4. Refer to `docs/API_CONTRACT.md` for exact endpoint definitions.

---

## 5. Git Workflow
- Work is conducted exclusively on branch `frontend-arshiya`.
- The `main` branch is untouched.
- Git commit instructions:
  ```bash
  git status
  git add .
  git commit -m "feat: implement gaming leaderboard frontend dashboard"
  git push origin frontend-arshiya
  ```

---

## 6. Implementation Status
- [x] Phase 1: Repository inspection & Git branch isolation (`frontend-arshiya`)
- [x] Phase 2: Schema verification from handwritten DA1 document
- [x] Phase 3: Exact mapping of all 15 relations
- [x] Phase 4 & 5: Architecture planning & user approval
- [x] Phase 6: Implementation of components, pages, APIs, mock data, and documentation
- [x] Phase 7: Verification and automated build
