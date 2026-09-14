import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Players } from './pages/Players';
import { Leaderboards } from './pages/Leaderboards';
import { Matches } from './pages/Matches';
import { Teams } from './pages/Teams';
import { Games } from './pages/Games';
import { Achievements } from './pages/Achievements';
import { Rewards } from './pages/Rewards';
import { Platforms } from './pages/Platforms';
import { SqlConsole } from './pages/SqlConsole';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'players': return 'Players';
      case 'leaderboards': return 'Leaderboard';
      case 'matches': return 'Matches';
      case 'teams': return 'Teams';
      case 'games': return 'Games';
      case 'achievements': return 'Achievements';
      case 'rewards': return 'Rewards';
      case 'platforms': return 'Platforms';
      case 'sql-console': return 'SQL Console';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="app-layout">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <main className="main-area">
        <Navbar 
          activeTitle={getPageTitle()}
          onToggleMobileSidebar={() => setIsMobileOpen(prev => !prev)}
        />

        {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
        {activeTab === 'players' && <Players />}
        {activeTab === 'leaderboards' && <Leaderboards />}
        {activeTab === 'matches' && <Matches />}
        {activeTab === 'teams' && <Teams />}
        {activeTab === 'games' && <Games />}
        {activeTab === 'achievements' && <Achievements />}
        {activeTab === 'rewards' && <Rewards />}
        {activeTab === 'platforms' && <Platforms />}
        {activeTab === 'sql-console' && <SqlConsole />}
      </main>
    </div>
  );
}

export default App;
