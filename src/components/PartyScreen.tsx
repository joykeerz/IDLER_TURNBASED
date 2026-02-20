import React, { useState } from 'react'
import { Character } from '../data/characters'

interface PartyScreenProps {
  gameState: any
  onOpenDetail: (charId: string) => void
}

const PartyScreen: React.FC<PartyScreenProps> = ({ gameState, onOpenDetail }) => {
  const partySlots = gameState.party
  const inventory = gameState.inventory
  // Default to selecting the first empty slot or the first slot if all full
  const [selectedSlot, setSelectedSlot] = useState<number | null>(
    partySlots.findIndex((s: any) => s === null) !== -1 
      ? partySlots.findIndex((s: any) => s === null) 
      : 0
  )

  const handleHeroClick = (char: Character) => {
    if (selectedSlot !== null) {
      gameState.addToParty(char, selectedSlot)
      // Automatically select next empty slot
      const nextEmpty = partySlots.findIndex((s: any, idx: number) => s === null && idx !== selectedSlot)
      if (nextEmpty !== -1) setSelectedSlot(nextEmpty)
    }
  }

  const isInParty = (charId: string) => partySlots.some((p: any) => p && p.id === charId)

  const handleCardClick = (char: Character) => {
    if (selectedSlot !== null && !isInParty(char.id)) {
      handleHeroClick(char)
    } else {
      onOpenDetail(char.id)
    }
  }

  // Element Icons Map
  const ELEMENT_ICONS: Record<string, string> = {
    'Fire': '🔥', 'Water': '💧', 'Wind': '🍃', 'Earth': '🌿', 'Light': '☀', 'Dark': '🌑', 'Ice': '❄'
  }

  return (
    <div className="screen-party">
      {/* Current Party Section (Top - Formation) */}
      <section className="current-party">
        <div className="section-header">
          <h3>SQUAD FORMATION</h3>
          <p>SELECT A SLOT TO ASSIGN A HERO</p>
        </div>
        
        <div className="party-slots">
          {partySlots.map((char: Character | null, i: number) => (
            <div 
              key={i} 
              className={`party-slot ${selectedSlot === i ? 'selected' : ''}`}
              onClick={() => setSelectedSlot(i)}
            >
              {char ? (
                <div 
                  className="character-card"
                  style={{ 
                    backgroundImage: `url(${char.splashArt})` 
                  }}
                >
                  <div className="card-element">{ELEMENT_ICONS[char.element] || '❓'}</div>
                  <button className="remove-btn-overlay" onClick={(e) => { e.stopPropagation(); gameState.removeFromParty(i); }}>×</button>
                  <div className="card-info">
                    <div className="card-name">{char.name}</div>
                    <div className="card-sub">
                      <span>LV.{char.level}</span>
                      <span style={{color: '#ffdd57'}}>{'★'.repeat(char.stars)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-slot">SLOT {i + 1}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Hero Collection Grid (Bottom - Inventory) */}
      <section className="inventory-section">
        <div className="section-header">
          <h3>HERO ROSTER</h3>
          <p>TOTAL COLLECTION: {inventory.length}</p>
        </div>
        
        <div className="crew-grid">
          {inventory.map((char: Character) => {
            const isAssigned = isInParty(char.id);
            const isAssistant = gameState.showcaseCharacterId === char.id;
            
            return (
              <div 
                key={char.id} 
                className={`crew-card-wrapper ${isAssigned ? 'assigned' : ''}`}
                onClick={() => handleCardClick(char)}
              >
                <div 
                  className="character-card"
                  style={{ 
                    backgroundImage: `url(${char.splashArt})`
                  }}
                >
                  <div className="card-element">{ELEMENT_ICONS[char.element] || '❓'}</div>
                  
                  {/* Assistant Toggle inside Card */}
                  <button 
                    className={`card-assistant-btn ${isAssistant ? 'active' : ''}`}
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      gameState.setShowcaseCharacter(char.id); 
                    }}
                    title="Set as Assistant"
                  >
                    {isAssistant ? '❤️' : '♡'}
                  </button>

                  <div className="card-info">
                    <div className="card-name">{char.name}</div>
                    <div className="card-sub">
                      <span>LV.{char.level} {char.awakening > 0 && <small className="awake-tag">C{char.awakening}</small>}</span>
                      <span style={{color: '#ffdd57'}}>{'★'.repeat(char.stars)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          {inventory.length === 0 && <p className="empty-note">No characters summoned yet.</p>}
        </div>
      </section>
    </div>
  )
}

export default PartyScreen
