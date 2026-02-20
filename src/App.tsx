import { useState, useEffect, useRef } from 'react'
import { useGameState } from './hooks/useGameState'
import GachaScreen from './components/GachaScreen'
import PartyScreen from './components/PartyScreen'
import BattleScreen from './components/BattleScreen'
import WorldMapScreen from './components/WorldMapScreen'
import CharacterDetailScreen from './components/CharacterDetailScreen'
import IdleRewardsModal from './components/IdleRewardsModal'
import AdminPanel from './components/AdminPanel'
import './App.css'
import './index.css'

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'gacha' | 'party' | 'battle' | 'character_detail' | 'world'>('home')
  const [detailCharId, setDetailCharId] = useState<string | null>(null)
  const [selectedStageId, setSelectedStageId] = useState<number>(1)
  const [showIdleRewards, setShowIdleRewards] = useState(false)
  const [idleData, setIdleData] = useState<{gold: number, gems: number, time: string} | null>(null)
  const [showAdmin, setShowAdmin] = useState(false)
  const adminClickCount = useRef(0)
  const gameState = useGameState()

  // Check for idle rewards on mount
  useEffect(() => {
    const rewards = gameState.claimIdleRewards()
    if (rewards.seconds > 60) { // Only show if away for > 1 minute
      const hours = Math.floor(rewards.seconds / 3600)
      const minutes = Math.floor((rewards.seconds % 3600) / 60)
      setIdleData({
        gold: rewards.gold,
        gems: rewards.gems,
        time: `${hours}h ${minutes}m`
      })
      setShowIdleRewards(true)
    }
  }, []) // Empty dependency to run only once on mount

  return (
    <div className="app-container">
      <main className="game-content">
        {activeTab === 'home' && (
          <div className="screen-home">
            <div className="particles-container">
              <div className="particle"></div><div className="particle"></div><div className="particle"></div>
            </div>

            {/* Top Minimal HUD */}
            <div className="hud-top-left">
              <div className="player-level-circle">
                <span className="lvl-label">Lv</span>
                <span className="lvl-value">52</span>
              </div>
              <div className="player-info-text">
                <div className="player-name">TimeKeeper</div>
                <div className="player-id">ID: 1999042</div>
              </div>
            </div>

            <div className="hud-top-right" onClick={() => {
              adminClickCount.current++
              if (adminClickCount.current >= 5) {
                setShowAdmin(true)
                adminClickCount.current = 0
              }
            }}>
               <div className="currency-item">
                 <span>💎</span> {gameState.gems.toLocaleString()}
               </div>
               <div className="currency-item">
                 <span>🪙</span> {gameState.gold.toLocaleString()}
               </div>
               <div className="currency-item">
                 <span>🔋</span> 120/120
               </div>
            </div>

            {/* Left Sidebar Navigation */}
            <div className="sidebar-left">
              <button className="sidebar-btn">
                <span className="icon">📧</span>
                <span className="label">Mail</span>
              </button>
              <button className="sidebar-btn">
                <span className="icon">📋</span>
                <span className="label">Task</span>
              </button>
              <button className="sidebar-btn" onClick={() => setActiveTab('party')}>
                <span className="icon">👥</span>
                <span className="label">Crew</span>
              </button>
              <button className="sidebar-btn">
                <span className="icon">🎒</span>
                <span className="label">Storage</span>
              </button>
            </div>

            {/* Idle Chest Button */}
            <button 
              className="idle-chest-btn"
              onClick={() => {
                 const rewards = gameState.claimIdleRewards()
                 if (rewards.seconds > 0) {
                   const hours = Math.floor(rewards.seconds / 3600)
                   const minutes = Math.floor((rewards.seconds % 3600) / 60)
                   setIdleData({
                    gold: rewards.gold,
                    gems: rewards.gems,
                    time: `${hours}h ${minutes}m`
                   })
                   setShowIdleRewards(true)
                 } else {
                   alert("Chest is empty! Come back later.")
                 }
              }}
            >
              <span className="afk-badge">AFK</span>
            </button>

            {/* Hero Showcase (Center-Left) */}
            {(() => {
               const showcaseId = gameState.showcaseCharacterId
               const showcaseChar = gameState.inventory.find((c: any) => c.id === showcaseId)
                                 || gameState.party[0]
                                 || gameState.inventory[0]
               return showcaseChar ? (
                <div
                  className="hero-showcase"
                  style={{ backgroundImage: `url(${showcaseChar.splashArt})` }}
                  onClick={() => setActiveTab('party')}
                ></div>
               ) : null
            })()}

            {/* Right Action Tickets */}
            <div className="action-tickets-right">
              <div className="ticket-group-primary">
                <button className="ticket-btn adventure-ticket" onClick={() => setActiveTab('world')}>
                  <div className="ticket-content">
                    <span className="ticket-subtitle">CHAPTER {Math.ceil((gameState.currentStage ?? 1) / 3)}</span>
                    <span className="ticket-title">ENTER<br/>THE SHOW</span>
                    <span className="ticket-stamp">Explore</span>
                  </div>
                  <div className="ticket-rip"></div>
                </button>
              </div>

              <div className="ticket-group-secondary">
                <button className="ticket-btn summon-ticket" onClick={() => setActiveTab('gacha')}>
                  <div className="ticket-content-sm">
                    <span className="icon">✨</span>
                    <span>SUMMON</span>
                  </div>
                </button>
                <button className="ticket-btn wilderness-ticket">
                  <div className="ticket-content-sm">
                    <span className="icon">🏰</span>
                    <span>MANOR</span>
                  </div>
                </button>
              </div>
            </div>

            {/* System Reset (Bottom Left, discreet) */}
            <div className="home-footer">
              <button className="text-btn-reset" onClick={() => gameState.resetAccount()}>
                // SYSTEM RESET
              </button>
            </div>
          </div>
        )}

        {activeTab === 'gacha' && <GachaScreen gameState={gameState} onBack={() => setActiveTab('home')} />}

        {activeTab === 'party' && (
          <PartyScreen
            gameState={gameState}
            onOpenDetail={(id) => {
              setDetailCharId(id)
              setActiveTab('character_detail')
            }}
          />
        )}

        {activeTab === 'character_detail' && detailCharId && (
          <CharacterDetailScreen
            charId={detailCharId}
            gameState={gameState}
            onClose={() => setActiveTab('party')}
          />
        )}

        {activeTab === 'world' && (
          <WorldMapScreen
            gameState={gameState}
            onBack={() => setActiveTab('home')}
            onStartBattle={(stageId) => {
              setSelectedStageId(stageId)
              setActiveTab('battle')
            }}
          />
        )}

        {activeTab === 'battle' && (
          <BattleScreen
            gameState={gameState}
            stageId={selectedStageId}
            onHome={() => setActiveTab('home')}
            onVictory={() => setActiveTab('world')}
          />
        )}
      </main>

      {!(activeTab === 'character_detail' || activeTab === 'battle' || activeTab === 'world') && (
        <nav className="game-nav">
          <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>BASE</button>
          <button className={activeTab === 'party' ? 'active' : ''} onClick={() => setActiveTab('party')}>PARTY</button>
          <button className={activeTab === 'gacha' ? 'active' : ''} onClick={() => setActiveTab('gacha')}>GACHA</button>
          <button className="" onClick={() => setActiveTab('world')}>STAGES</button>
        </nav>
      )}
      {showIdleRewards && idleData && (
        <IdleRewardsModal
          timeOffline={idleData.time}
          gold={idleData.gold}
          gems={idleData.gems}
          onClaim={() => setShowIdleRewards(false)}
        />
      )}
      {showAdmin && <AdminPanel gameState={gameState} onClose={() => setShowAdmin(false)} />}
    </div>
  )
}

export default App
