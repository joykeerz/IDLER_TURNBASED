import React, { useState } from 'react'
import { Character } from '../data/characters'

interface PartyScreenProps {
  gameState: any
}

const PartyScreen: React.FC<PartyScreenProps> = ({ gameState }) => {
  const partySlots = gameState.party
  const inventory = gameState.inventory
  const [selectedSlot, setSelectedSlot] = useState<number | null>(partySlots.findIndex((s: any) => s === null) !== -1 ? partySlots.findIndex((s: any) => s === null) : 0)

  const handleHeroClick = (char: Character) => {
    if (selectedSlot !== null) {
      gameState.addToParty(char, selectedSlot)
      // Automatically select next empty slot
      const nextEmpty = partySlots.findIndex((s: any, idx: number) => s === null && idx !== selectedSlot)
      if (nextEmpty !== -1) setSelectedSlot(nextEmpty)
    }
  }

  const isInParty = (charId: string) => partySlots.some((p: any) => p && p.id === charId)

  return (
    <div className="screen-party">
      <section className="current-party">
        <div className="section-header">
          <h3>Current Party</h3>
          <p>Select a slot to assign a hero</p>
        </div>
        <div className="party-slots">
          {partySlots.map((char: Character | null, i: number) => (
            <div 
              key={i} 
              className={`party-slot ${selectedSlot === i ? 'selected' : ''}`}
              onClick={() => setSelectedSlot(i)}
            >
              {char ? (
                <div className={`party-member rarity-${char.rarity.toLowerCase()}`}>
                  <button className="remove-hero-btn" onClick={(e) => { e.stopPropagation(); gameState.removeFromParty(i); }}>×</button>
                  <div className="name">{char.name}</div>
                  <div className="rank-stars">{'★'.repeat(char.stars)}</div>
                  <div className="stats">Lv.{char.level} | ATK: {char.atk} HP: {char.hp}</div>
                  {char.awakening > 0 && <div className="constellation-tag">C{char.awakening}</div>}
                </div>
              ) : (
                <div className="empty-slot">Slot {i + 1}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="inventory">
        <h3>Character Collection</h3>
        <div className="inventory-grid">
          {inventory.map((char: Character, i: number) => (
            <div key={i} className={`inventory-card rarity-${char.rarity.toLowerCase()} ${isInParty(char.id) ? 'in-party' : ''}`} 
                 onClick={() => handleHeroClick(char)}>
              <div className="char-name">{char.name} (Lv.{char.level})</div>
              {isInParty(char.id) && <div className="in-party-overlay">IN PARTY</div>}
              <div className="rank-stars">{'★'.repeat(char.stars)}</div>
              {char.awakening > 0 && <div className="awakening-level">Constellation {char.awakening}</div>}
              <div className="rarity-tag">{char.rarity}</div>
              <button className="level-up-btn" onClick={(e) => { e.stopPropagation(); gameState.levelUp(char.id); }}>
                Level Up (500 Gold)
              </button>
            </div>
          ))}
          {inventory.length === 0 && <p className="empty-note">No characters summoned yet.</p>}
        </div>
      </section>
    </div>
  )
}

export default PartyScreen
