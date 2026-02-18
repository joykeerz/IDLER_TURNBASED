import React, { useState } from 'react'
import { Character } from '../data/characters'

interface GachaScreenProps {
  gameState: any
}

const GachaScreen: React.FC<GachaScreenProps> = ({ gameState }) => {
  const [results, setResults] = useState<Character[] | null>(null)
  const [isSummoning, setIsSummoning] = useState(false)

  const handleSummon = (amount: number) => {
    setIsSummoning(true)
    setResults(null)
    
    // Simulate summoning delay
    setTimeout(() => {
      const gachaResults = gameState.summon(amount)
      setResults(gachaResults)
      setIsSummoning(false)
    }, 1500)
  }

  return (
    <div className="screen-gacha">
      <div className="summon-banners">
        <div className="banner-card">
          <h3>Hero Summon</h3>
          <p>Get Epic and Legendary heroes!</p>
          <div className="summon-buttons">
            <button disabled={isSummoning} onClick={() => handleSummon(1)}>Summon x1 (100 Gems)</button>
            <button disabled={isSummoning} onClick={() => handleSummon(10)}>Summon x10 (1000 Gems)</button>
          </div>
        </div>
      </div>

      {isSummoning && (
        <div className="summon-animation">
          <div className="glow-effect"></div>
          <p>Summoning...</p>
        </div>
      )}

      {results && (
        <div className="summon-results-overlay">
          <h2>Summon Results</h2>
          <div className="results-grid">
            {results.map((char, i) => (
              <div key={i} className={`result-card rarity-${char.rarity.toLowerCase()}`}>
                <div className="char-name">{char.name}</div>
                <div className="rank-stars">{'★'.repeat(char.stars)}</div>
                <div className="rarity-badge">{char.rarity}</div>
              </div>
            ))}
          </div>
          <button className="close-results" onClick={() => setResults(null)}>Continue</button>
        </div>
      )}
    </div>
  )
}

export default GachaScreen
