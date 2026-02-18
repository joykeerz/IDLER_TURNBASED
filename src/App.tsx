import { useState } from 'react'
import { useGameState } from './hooks/useGameState'
import GachaScreen from './components/GachaScreen'
import PartyScreen from './components/PartyScreen'
import BattleScreen from './components/BattleScreen'
import './App.css'
import './index.css'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const gameState = useGameState()

  return (
    <div className="app-container">
      <header className="game-header">
        <h1>GACHA RPG</h1>
        <div className="player-stats">
          <div className="stat-pill">Gems: {gameState.gems}</div>
          <div className="stat-pill">Gold: {gameState.gold}</div>
        </div>
      </header>

      <main className="game-content">
        {activeTab === 'home' && (
          <div className="screen-home">
            <div className="hero-banner">
              <h2>Welcome, Adventurer</h2>
              <p>Forge your destiny and summon powerful allies.</p>
            </div>
            <div className="quick-actions">
              <button className="action-card" onClick={() => setActiveTab('battle')}>
                <h3>Battle</h3>
                <p>Fight monsters and earn rewards</p>
              </button>
              <button className="action-card" onClick={() => setActiveTab('gacha')}>
                <h3>Summon</h3>
                <p>Acquire new legendary heroes</p>
              </button>
            </div>
          </div>
        )}
        {activeTab === 'gacha' && <GachaScreen gameState={gameState} />}
        {activeTab === 'party' && <PartyScreen gameState={gameState} />}
        {activeTab === 'battle' && <BattleScreen gameState={gameState} onHome={() => setActiveTab('home')} />}
      </main>

      <nav className="game-nav">
        <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>HOME</button>
        <button className={activeTab === 'party' ? 'active' : ''} onClick={() => setActiveTab('party')}>PARTY</button>
        <button className={activeTab === 'gacha' ? 'active' : ''} onClick={() => setActiveTab('gacha')}>GACHA</button>
        <button className={activeTab === 'battle' ? 'active' : ''} onClick={() => setActiveTab('battle')}>BATTLE</button>
      </nav>
    </div>
  )
}

export default App
