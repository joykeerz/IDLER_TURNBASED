import React, { useState } from 'react'
import { Character } from '../data/characters'
import { BANNERS } from '../hooks/useGameState'

interface GachaScreenProps {
  gameState: any
}

const GachaScreen: React.FC<GachaScreenProps> = ({ gameState }) => {
  const [results, setResults] = useState<Character[] | null>(null)
  const [isSummoning, setIsSummoning] = useState(false)
  const [hasLegendary, setHasLegendary] = useState(false)
  const [activeBannerId, setActiveBannerId] = useState('b2')
  const [showSplash, setShowSplash] = useState<Character | null>(null)

  const activeBanner = BANNERS.find(b => b.id === activeBannerId) || BANNERS[0]

  const handleSummon = (amount: number) => {
    setIsSummoning(true)
    setResults(null)
    setHasLegendary(false)
    setShowSplash(null)
    
    // Simulate summoning delay
    setTimeout(() => {
      const gachaResults = gameState.summon(amount, activeBannerId)
      const foundLegendary = gachaResults.find((c: Character) => c.rarity === 'Legendary')
      const foundEpic = gachaResults.find((c: Character) => c.rarity === 'Epic')
      
      setResults(gachaResults)
      setHasLegendary(!!foundLegendary)
      setIsSummoning(false)

      // If legendary or epic found, show splash art after a brief delay
      if (foundLegendary || foundEpic) {
        setTimeout(() => {
          setShowSplash(foundLegendary || foundEpic)
        }, 500)
      }
    }, 2000)
  }

  return (
    <div className="screen-gacha">
      <div className="banner-tabs">
        {BANNERS.map(b => (
          <button 
            key={b.id} 
            className={`banner-tab ${activeBannerId === b.id ? 'active' : ''}`}
            onClick={() => setActiveBannerId(b.id)}
          >
            {b.name}
          </button>
        ))}
      </div>

      <div className="summon-banners">
        <div className="banner-card">
          <div className="banner-info">
            <span className="banner-type-tag">{activeBanner.type}</span>
            <h3>{activeBanner.name}</h3>
            <p>{activeBanner.description}</p>
          </div>
          <div className="summon-buttons">
            <button className="summon-btn-premium" disabled={isSummoning} onClick={() => handleSummon(1)}>
              Summon x1
              <span className="btn-cost">100 Gems</span>
            </button>
            <button className="summon-btn-premium standout" disabled={isSummoning} onClick={() => handleSummon(10)}>
              Summon x10
              <span className="btn-cost">1000 Gems</span>
            </button>
          </div>
        </div>
      </div>

      {isSummoning && (
        <div className="summon-animation">
          <div className="summon-portal">
            <div className="portal-ring"></div>
            <div className="portal-ring portal-ring-alt"></div>
            <div className="portal-glow"></div>
          </div>
          <p className="summoning-text">COMMUNING WITH THE STARS...</p>
        </div>
      )}

      {results && !showSplash && (
        <div className={`summon-results-overlay ${hasLegendary ? 'legendary-impact' : ''}`}>
          <h2>{hasLegendary ? '✨ LEGENDARY SUMMON! ✨' : 'Summon Results'}</h2>
          <div className="results-grid">
            {results.map((char, i) => (
              <div 
                key={i} 
                className={`result-card-premium premium-${char.rarity.toLowerCase()}`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="char-name">{char.name}</div>
                <div className="rank-stars">{'★'.repeat(char.stars)}</div>
                <div className="rarity-badge">{char.rarity}</div>
              </div>
            ))}
          </div>
          <button className="close-results" onClick={() => setResults(null)}>Continue</button>
        </div>
      )}

      {showSplash && (
        <div className={`splash-reveal-overlay rarity-${showSplash.rarity.toLowerCase()}`}>
          {/* Background Layer (Blurred) */}
          <div className="splash-background" style={{ backgroundImage: `url(${showSplash.splashArt})` }}></div>
          
          {/* Character Art Layer (Sharp, Full Body) */}
          <div className="splash-character-art" style={{ backgroundImage: `url(${showSplash.splashArt})` }}></div>

          <div className="splash-content">
            <div className="splash-rarity-header">{showSplash.rarity} Hero</div>
            <div className="splash-char-name">{showSplash.name}</div>
            <div className="splash-char-element">Element: {showSplash.element}</div>
            <div className="splash-stars">{'★'.repeat(showSplash.stars)}</div>
            <div className="splash-quote">"A new destiny begins..."</div>
            <button className="close-splash-btn" onClick={() => setShowSplash(null)}>Tap to Continue</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GachaScreen
