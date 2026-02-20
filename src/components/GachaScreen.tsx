import React, { useState } from 'react'
import { Character } from '../data/characters'
import { BANNERS } from '../hooks/useGameState'

interface GachaScreenProps {
  gameState: any
  onBack: () => void
}

const GachaScreen: React.FC<GachaScreenProps> = ({ gameState, onBack }) => {
  const [results, setResults] = useState<Character[] | null>(null)
  const [isSummoning, setIsSummoning] = useState(false)
  const [activeBannerId, setActiveBannerId] = useState('b2')
  const [showSplash, setShowSplash] = useState<Character | null>(null)

  
  const handleSummon = (amount: number) => {
    setIsSummoning(true)
    setResults(null)
    setShowSplash(null)
    
    // Simulate summoning delay for cinematic effect
    setTimeout(() => {
      const gachaResults = gameState.summon(amount, activeBannerId)
      const foundLegendary = gachaResults.find((c: Character) => c.rarity === 'Legendary')
      const foundEpic = gachaResults.find((c: Character) => c.rarity === 'Epic')
      
      setResults(gachaResults)
      setIsSummoning(false)

      // If legendary or epic found, show splash art after a brief delay
      if (foundLegendary || foundEpic) {
        setTimeout(() => {
          setShowSplash(foundLegendary || foundEpic)
        }, 500)
      }
    }, 2500)
  }

  return (
    <div className="screen-gacha">
      {/* Top Bar */}
      <div className="gacha-top-bar">
        <button className="gacha-back-btn" onClick={onBack}>
          <span className="icon">◁</span>
          <span className="text">EXIT</span>
        </button>
        <div className="gacha-currency-container">
          <div className="gacha-currency-item">
            <span className="icon">💎</span>
            <span>{gameState.gems.toLocaleString()}</span>
          </div>
          <div className="gacha-currency-item">
            <span className="icon">🟡</span>
            <span>{gameState.gold.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="gacha-body">
        {/* Left Sidebar */}
        <div className="gacha-sidebar">
          {BANNERS.map(b => (
            <div 
              key={b.id} 
              className={`banner-thumb ${activeBannerId === b.id ? 'active' : ''}`}
              onClick={() => setActiveBannerId(b.id)}
            >
              <div className="banner-thumb-img" style={{ 
                background: b.id === 'b2' 
                  ? 'linear-gradient(135deg, #3e2723, #5d4037)' 
                  : 'linear-gradient(135deg, #263238, #37474f)'
              }}></div>
              <div className="banner-thumb-overlay">
                <span className="banner-thumb-name">{b.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main View */}
        <div className="gacha-main-view">
          {/* Featured Character Visual */}
          <img 
            src={activeBannerId === 'b2' ? '/assets/characters/aria.png' : '/assets/characters/kaelen.png'} 
            alt="Featured" 
            className="gacha-char-art"
          />
          
          <div className="gacha-char-info">
            <div className="gacha-char-name-tag">
              <span className="gacha-char-name-text">
                {activeBannerId === 'b2' ? 'ARIA' : 'KAELEN'}
              </span>
            </div>
            <div className="gacha-rarity-stars">
              {Array.from({ length: activeBannerId === 'b2' ? 5 : 4 }).map((_, i) => (
                <span key={i} className="gacha-star-icon">★</span>
              ))}
            </div>
          </div>

          {/* Summon Controls */}
          <div className="gacha-controls">
            <button 
              className="gacha-summon-btn" 
              disabled={isSummoning} 
              onClick={() => handleSummon(1)}
            >
              <div className="summon-btn-top">Summon x1</div>
              <div className="summon-btn-footer">
                <div className="summon-ticket-icon"></div>
                <span>100 GEMS</span>
              </div>
            </button>

            <button 
              className="gacha-summon-btn" 
              disabled={isSummoning} 
              onClick={() => handleSummon(10)}
            >
              <div className="summon-btn-top golden">Summon x10</div>
              <div className="summon-btn-footer">
                <div className="summon-ticket-icon"></div>
                <span>1000 GEMS</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {isSummoning && (
        <div className="summon-animation-layer">
          <div className="portal-container">
            <div className="portal-outer-ring"></div>
            <div className="portal-inner-glow"></div>
            <div className="portal-shards"></div>
          </div>
          <p className="summon-status-text">COMMUNING WITH THE STARS...</p>
        </div>
      )}

      {results && !showSplash && (
        <div className={`summon-results-overlay ${results.some(c => c.rarity === 'Legendary') ? 'legendary-impact' : ''}`}>
          <h2>{results.some(c => c.rarity === 'Legendary') ? '✨ LEGENDARY SUMMON! ✨' : 'Summon Results'}</h2>
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
          <div className="splash-background" style={{ backgroundImage: `url(${showSplash.splashArt})` }}></div>
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
