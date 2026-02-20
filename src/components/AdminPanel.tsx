import React, { useState } from 'react'
import { CHARACTERS } from '../data/characters'
import { STAGES } from '../data/stages'

interface AdminPanelProps {
  gameState: any
  onClose: () => void
}

const AdminPanel: React.FC<AdminPanelProps> = ({ gameState, onClose }) => {
  const [activeTab, setActiveTab] = useState<'player' | 'crew' | 'world'>('player')
  const [tempGold, setTempGold] = useState(gameState.gold)
  const [tempGems, setTempGems] = useState(gameState.gems)

  const handleApplyResources = () => {
    gameState.adminSetResources(tempGold, tempGems)
  }

  return (
    <div className="admin-overlay">
      <div className="admin-vessel">
        <header className="admin-header">
          <h2>DEV_CONSOLE-v1.0</h2>
          <button className="admin-close-btn" onClick={onClose}>EXIT_DEBUG</button>
        </header>

        <nav className="admin-nav">
          <button className={activeTab === 'player' ? 'active' : ''} onClick={() => setActiveTab('player')}>PLAYER</button>
          <button className={activeTab === 'crew' ? 'active' : ''} onClick={() => setActiveTab('crew')}>CREW_MGMT</button>
          <button className={activeTab === 'world' ? 'active' : ''} onClick={() => setActiveTab('world')}>WORLD_MAP</button>
        </nav>

        <div className="admin-content">
          {activeTab === 'player' && (
            <div className="admin-section">
              <div className="admin-form-group">
                <label>GOLD_VALUE</label>
                <input 
                  type="number" 
                  value={tempGold} 
                  onChange={(e) => setTempGold(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="admin-form-group">
                <label>GEM_VALUE</label>
                <input 
                  type="number" 
                  value={tempGems} 
                  onChange={(e) => setTempGems(parseInt(e.target.value) || 0)}
                />
              </div>
              <button className="admin-action-alt" onClick={handleApplyResources}>APPEND_CURRENCY</button>
              
              <div className="admin-divider"></div>
              
              <div className="admin-form-group">
                <label>CLEAR_ACCOUNT_STATE</label>
                <button className="admin-action-danger" onClick={gameState.resetAccount}>PURGE_DATA</button>
              </div>
            </div>
          )}

          {activeTab === 'crew' && (
            <div className="admin-section">
              <div className="admin-crew-list">
                {CHARACTERS.map(c => {
                  const owned = gameState.inventory.find((inv: any) => inv.id === c.id)
                  return (
                    <div key={c.id} className="admin-crew-item">
                      <div className="admin-crew-info">
                        <span className="admin-crew-name">{c.name}</span>
                        <span className={`admin-crew-rarity ${c.rarity.toLowerCase()}`}>{c.rarity}</span>
                      </div>
                      <button 
                        className="admin-action-small" 
                        disabled={!!owned}
                        onClick={() => gameState.adminAddCharacter(c.id)}
                      >
                        {owned ? 'OWNED' : 'ACQUIRE'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'world' && (
            <div className="admin-section">
              <div className="admin-stage-grid">
                {STAGES.map(s => {
                  const isCurrent = gameState.currentStage === s.id
                  return (
                    <div key={s.id} className={`admin-stage-item ${isCurrent ? 'current' : ''}`}>
                      <span className="admin-stage-label">{s.id}</span>
                      <button 
                        className="admin-action-small"
                        onClick={() => gameState.adminSetStage(s.id)}
                      >
                        TELEPORT
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
