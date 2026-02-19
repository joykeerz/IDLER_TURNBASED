import React from 'react'

interface CharacterDetailScreenProps {
  charId: string
  gameState: any
  onClose: () => void
}

const CharacterDetailScreen: React.FC<CharacterDetailScreenProps> = ({ charId, gameState, onClose }) => {
  const inventory = gameState.inventory
  const party = gameState.party
  const char = inventory.find((c: any) => c.id === charId) || party.find((p: any) => p && p.id === charId)

  if (!char) return null

  // Element Icons Map
  const ELEMENT_ICONS: Record<string, string> = {
    'Fire': '🔥', 'Water': '💧', 'Wind': '🍃', 'Earth': '🌿', 'Light': '☀', 'Dark': '🌑', 'Ice': '❄'
  }

  return (
    <div className="character-detail-page">
      {/* Background Decor */}
      <div className="detail-bg-texture"></div>
      
      {/* Header / Navigation */}
      <header className="detail-header">
        <button className="back-btn" onClick={onClose}>
          <span className="back-icon">◁</span>
          <span className="back-text">DOCUMENT</span>
        </button>
        <div className="header-decoration">
          <span>◇</span>
          <span>□</span>
          <span>△</span>
          <span>▽</span>
        </div>
      </header>

      <div className="detail-content">
        {/* Left Column: Stats & Identity */}
        <div className="detail-col-left">
          <div className="char-identity">
            <div className="rarity-stars">{'★'.repeat(char.stars)}</div>
            <div className="element-badge">
              {ELEMENT_ICONS[char.element]} {char.element}
            </div>
            <h1 className="detail-char-name">{char.name}</h1>
            <div className="char-bond">
              <span className="label">Bond</span>
              <div className="bond-bar"><div className="fill" style={{width: '65%'}}></div></div>
              <span className="percent">65%</span>
            </div>
          </div>

          <div className="detail-personal-stats">
            <h4 className="section-title">Personal Stats ▷</h4>
            <div className="stats-grid-premium">
              <div className="stat-row">
                <span className="stat-label">🗡 ATK</span>
                <span className="stat-value">{char.atk}</span>
                <span className="stat-label">🛡 HP</span>
                <span className="stat-value">{char.hp}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">🛡 DEF</span>
                <span className="stat-value">{char.def}</span>
                <span className="stat-label">⚡ SPD</span>
                <span className="stat-value">{char.spd}</span>
              </div>
            </div>
          </div>
          
          <div className="char-tags">
            {char.tags.map((tag: string, i: number) => (
              <span key={i}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Center Column: Portrait */}
        <div className="detail-col-center">
          <div 
            className="detail-main-art"
            style={{ backgroundImage: `url(${char.splashArt})` }}
          ></div>
        </div>

        {/* Right Column: Progression & Skills */}
        <div className="detail-col-right">
          <div className="progression-box">
            <div className="level-control">
              <div className="lvl-info">
                <span className="label">Level</span>
                <span className="value">{char.level} / 60</span>
              </div>
              <button 
                className="lvl-plus-btn"
                onClick={() => gameState.levelUp(char.id)}
                disabled={gameState.gold < 500}
              >
                +
              </button>
            </div>
            <div className="insight-box awakening-box">
              <div className="lvl-info">
                <span className="label">Awakening</span>
                <span className="value">C{char.awakening}</span>
              </div>
              <div className="awakening-stages">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`stage-dot ${i < char.awakening ? 'active' : ''}`}></div>
                ))}
              </div>
            </div>
            <div className="gold-balance">💰 {gameState.gold} Gold</div>
          </div>

          <div className="skills-section">
            <h4 className="section-title">Abilities ▷</h4>
            <div className="skill-cards-container">
              <div className="skill-card-vertical">
                <div className="skill-art art-1"></div>
                <div className="skill-type">{char.skill.type}</div>
              </div>
              <div className="skill-card-vertical">
                <div className="skill-art art-2"></div>
                <div className="skill-type">ULTIMATE</div>
              </div>
              <div className="skill-card-vertical locked">
                <div className="skill-art"></div>
                <div className="skill-type">LOCKED</div>
              </div>
            </div>
            <div className="skill-descriptions-premium">
               <div className="skill-item-active">
                  <span className="name">{char.skill.name}</span>
                  <p>{char.skill.description}</p>
               </div>
            </div>
          </div>

          <div className="detail-footer-actions">
            <button className="resonance-btn">
              <span className="label">Resonance</span>
              <span className="value">Lv.10</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CharacterDetailScreen
