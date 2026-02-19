import { useState, useEffect } from 'react'
import { Character } from '../data/characters'

interface BattleEntity extends Character {
  currentHp: number
  currentMana: number
  side: 'player' | 'enemy'
  lastAction?: 'attack' | 'skill' | 'damage'
}

interface DamagePopup {
  id: number
  value: number | string
  x: number
  y: number
  type: 'damage' | 'heal'
}

const BattleScreen = ({ gameState, onHome }: { gameState: any, onHome: () => void }) => {
  const [playerParty, setPlayerParty] = useState<BattleEntity[]>([])
  const [enemies, setEnemies] = useState<BattleEntity[]>([])
  const [isBattleOver, setIsBattleOver] = useState(false)
  const [activeUnitIndex, setActiveUnitIndex] = useState(0)
  const [isAuto, setIsAuto] = useState(false)
  const [battleLog, setBattleLog] = useState<string[]>(['Battle started!'])
  const [popups, setPopups] = useState<DamagePopup[]>([])
  const [arenaShake, setArenaShake] = useState(false)

  const addLog = (msg: string) => setBattleLog(prev => [msg, ...prev].slice(0, 5))

  const resetBattle = () => {
    const p = gameState.party.filter((c: any) => c !== null).map((c: any) => ({ 
      ...c, 
      currentHp: c.hp || 100, 
      currentMana: 0, 
      side: 'player' 
    }))
    setPlayerParty(p)
    setIsBattleOver(false)
    setActiveUnitIndex(0)
    setBattleLog(['Battle started!'])

    const stageMultiplier = 1 + (gameState.currentStage - 1) * 0.15
    const e: BattleEntity[] = [
      { 
        id: 'e1', 
        name: 'Shadow Slime', 
        rarity: 'Common', 
        baseStars: 1,
        stars: 1,
        hp: Math.floor(500 * stageMultiplier), 
        currentHp: Math.floor(500 * stageMultiplier), 
        atk: Math.floor(40 * stageMultiplier), 
        def: 20, 
        spd: 40, 
        mana: 0,
        maxMana: 100,
        skill: { name: 'Slime Splash', description: 'Attack', manaCost: 20, type: 'Attack', power: 1.2 },
        ultimate: { name: 'Mega Sludge', description: 'AOE Attack', manaCost: 80, type: 'AOE', power: 2.0 },
        side: 'enemy',
        awakening: 0,
        currentMana: 0,
        level: 1,
        exp: 0,
        element: 'Dark',
        splashArt: '/assets/enemies/slime.png',
        tags: ['Enemy', 'Slime']
      },
      { 
        id: 'e2', 
        name: 'Dark Knight', 
        rarity: 'Rare', 
        baseStars: 3,
        stars: 3,
        hp: Math.floor(1200 * stageMultiplier), 
        currentHp: Math.floor(1200 * stageMultiplier), 
        atk: Math.floor(80 * stageMultiplier), 
        def: 60, 
        spd: 30, 
        mana: 0,
        maxMana: 100,
        skill: { name: 'Dark Slash', description: 'Attack', manaCost: 40, type: 'Attack', power: 1.8 },
        ultimate: { name: 'Void Strike', description: 'Massive Single Hit', manaCost: 90, type: 'Attack', power: 4.0 },
        side: 'enemy',
        awakening: 0,
        currentMana: 0,
        level: 1,
        exp: 0,
        element: 'Dark',
        splashArt: '/assets/enemies/knight.png',
        tags: ['Enemy', 'Knight']
      }
    ]
    setEnemies(e)
  }

  useEffect(() => {
    resetBattle()
  }, [gameState.party, gameState.currentStage])

  const nextTurn = () => {
    const livingEnemies = enemies.filter(e => e.currentHp > 0)
    const livingPlayers = playerParty.filter(p => {
        // Find if this player is the actual one in the party (matching ID)
        return p.currentHp > 0
    })
    
    if (livingEnemies.length === 0 || livingPlayers.length === 0) {
      setIsBattleOver(true)
      return
    }

    setPlayerParty(prev => prev.map((p, idx) => {
      if (idx !== activeUnitIndex || p.currentHp <= 0) return p
      const maxM = p.maxMana || 100
      const currM = p.currentMana ?? 0
      return { ...p, currentMana: Math.min(maxM, currM + 20) }
    }))

    let nextIndex = activeUnitIndex + 1
    while (nextIndex < playerParty.length && playerParty[nextIndex].currentHp <= 0) {
      nextIndex++
    }

    if (nextIndex < playerParty.length) {
      setActiveUnitIndex(nextIndex)
    } else {
      processEnemyTurn()
    }
  }

  const triggerVisualEffect = (entityId: string, action: 'attack' | 'skill' | 'damage') => {
    const update = (list: BattleEntity[]) => list.map(e => e.id === entityId ? { ...e, lastAction: action } : e)
    setPlayerParty(prev => update(prev))
    setEnemies(prev => update(prev))
    
    setTimeout(() => {
      const clear = (list: BattleEntity[]) => list.map(e => e.id === entityId ? { ...e, lastAction: undefined } : e)
      setPlayerParty(prev => clear(prev))
      setEnemies(prev => clear(prev))
    }, 500)
  }

  const addPopup = (value: number | string, isHeal = false) => {
    const id = Date.now() + Math.random()
    const x = 40 + Math.random() * 20
    const y = 40 + Math.random() * 20
    setPopups(prev => [...prev, { id, value, x, y, type: isHeal ? 'heal' : 'damage' }])
    setTimeout(() => setPopups(prev => prev.filter(p => p.id !== id)), 800)
  }

  const shakeArena = (heavy = false) => {
    setArenaShake(true)
    setTimeout(() => setArenaShake(false), heavy ? 400 : 200)
  }

  const handleUltimate = () => {
    const attacker = playerParty[activeUnitIndex]
    const ult = attacker?.ultimate
    if (!attacker || isBattleOver || attacker.currentHp <= 0 || !ult || (attacker.currentMana ?? 0) < (ult.manaCost || 0)) return

    triggerVisualEffect(attacker.id, 'skill') 
    addLog(`${attacker.name} ULTIMATE: ${ult.name}!`)
    shakeArena(true)

    setTimeout(() => {
      if (ult.type === 'AOE') {
        const damage = Math.floor(attacker.atk * (ult.power || 1))
        setEnemies(prev => prev.map(e => {
          if (e.currentHp > 0) {
            addPopup(damage)
            triggerVisualEffect(e.id, 'damage')
            return { ...e, currentHp: Math.max(0, e.currentHp - damage) }
          }
          return e
        }))
      } else if (ult.type === 'Attack') {
        const target = enemies.find(e => e.currentHp > 0) || enemies[0]
        const damage = Math.floor(attacker.atk * (ult.power || 1))
        addPopup(damage)
        triggerVisualEffect(target.id, 'damage')
        setEnemies(prev => prev.map(e => e.id === target.id ? { ...e, currentHp: Math.max(0, e.currentHp - damage) } : e))
      } else if (ult.type === 'Heal') {
        const healAmount = ult.power || 500
        setPlayerParty(prev => prev.map(p => {
          if (p.currentHp > 0) {
            addPopup(`+${Math.floor(healAmount)}`, true)
            return { ...p, currentHp: Math.min(p.hp, p.currentHp + healAmount) }
          }
          return p
        }))
      }

      setPlayerParty(prev => prev.map((p, idx) => 
        idx === activeUnitIndex ? { ...p, currentMana: Math.max(0, (p.currentMana ?? 0) - (ult.manaCost || 0)) } : p
      ))

      nextTurn()
    }, 600)
  }

  const handleAttack = (target: BattleEntity) => {
    const attacker = playerParty[activeUnitIndex]
    if (!attacker || isBattleOver || attacker.currentHp <= 0) return

    triggerVisualEffect(attacker.id, 'attack')
    
    setTimeout(() => {
      const damage = Math.max(10, attacker.atk - target.def)
      addLog(`${attacker.name} attacked ${target.name} for ${damage} damage!`)
      addPopup(damage)
      triggerVisualEffect(target.id, 'damage')
      if (damage > 100) shakeArena()

      setEnemies(prev => prev.map(e => e.id === target.id ? { ...e, currentHp: Math.max(0, e.currentHp - damage) } : e))
      nextTurn()
    }, 300)
  }

  const handleSkill = () => {
    const attacker = playerParty[activeUnitIndex]
    const skill = attacker?.skill
    if (!attacker || isBattleOver || attacker.currentHp <= 0 || !skill || (attacker.currentMana ?? 0) < (skill.manaCost || 0)) return

    triggerVisualEffect(attacker.id, 'skill')
    addLog(`${attacker.name} used ${skill.name}!`)

    setTimeout(() => {
      if (skill.type === 'AOE') {
        const damage = Math.floor(attacker.atk * (skill.power || 1))
        shakeArena(true)
        setEnemies(prev => prev.map(e => {
          if (e.currentHp > 0) {
            addPopup(damage)
            triggerVisualEffect(e.id, 'damage')
            return { ...e, currentHp: Math.max(0, e.currentHp - damage) }
          }
          return e
        }))
      } else if (skill.type === 'Attack') {
        const target = enemies.find(e => e.currentHp > 0) || enemies[0]
        const damage = Math.floor(attacker.atk * (skill.power || 1))
        addPopup(damage)
        triggerVisualEffect(target.id, 'damage')
        shakeArena()
        setEnemies(prev => prev.map(e => e.id === target.id ? { ...e, currentHp: Math.max(0, e.currentHp - damage) } : e))
      } else if (skill.type === 'Heal') {
        const healAmount = skill.power || 100
        setPlayerParty(prev => prev.map(p => {
          if (p.currentHp > 0) {
            addPopup(`+${Math.floor(healAmount)}`, true)
            return { ...p, currentHp: Math.min(p.hp, p.currentHp + healAmount) }
          }
          return p
        }))
      }

      setPlayerParty(prev => prev.map((p, idx) => 
        idx === activeUnitIndex ? { ...p, currentMana: Math.max(0, (p.currentMana ?? 0) - (skill.manaCost || 0)) } : p
      ))

      nextTurn()
    }, 500)
  }

  const processEnemyTurn = () => {
    addLog("Enemy is thinking...")
    setTimeout(() => {
      const livingEnemies = enemies.filter(e => e.currentHp > 0)
      
      if (livingEnemies.length === 0) {
        setIsBattleOver(true)
        return
      }

      livingEnemies.forEach((enemy, idx) => {
        setTimeout(() => {
          setPlayerParty(currentParty => {
            const actualLivingPlayers = currentParty.filter(p => p.currentHp > 0)
            if (actualLivingPlayers.length === 0) return currentParty

            const target = actualLivingPlayers[Math.floor(Math.random() * actualLivingPlayers.length)]
            
            if (enemy.skill && (enemy.currentMana ?? 0) >= (enemy.skill.manaCost || 0)) {
              const skill = enemy.skill
              addLog(`${enemy.name} used ${skill.name}!`)
              triggerVisualEffect(enemy.id, 'skill')
              const damage = Math.floor(enemy.atk * (skill.power || 1))
              
              if (skill.type === 'AOE') {
                shakeArena(true)
                actualLivingPlayers.forEach(p => {
                    addPopup(damage)
                    triggerVisualEffect(p.id, 'damage')
                })
                return currentParty.map(p => p.currentHp > 0 ? { ...p, currentHp: Math.max(0, p.currentHp - damage) } : p)
              } else {
                addPopup(damage)
                triggerVisualEffect(target.id, 'damage')
                return currentParty.map(p => p.id === target.id ? { ...p, currentHp: Math.max(0, p.currentHp - damage) } : p)
              }
            } else {
              const damage = Math.max(10, enemy.atk - target.def)
              addLog(`${enemy.name} attacked ${target.name} for ${damage} damage!`)
              triggerVisualEffect(enemy.id, 'attack')
              setTimeout(() => {
                  addPopup(damage)
                  triggerVisualEffect(target.id, 'damage')
              }, 300)
              return currentParty.map(p => p.id === target.id ? { ...p, currentHp: Math.max(0, p.currentHp - damage) } : p)
            }
          })

          setEnemies(prev => prev.map(e => {
            if (e.id !== enemy.id) return e
            let nm = (e.currentMana ?? 0) + 20
            if (e.skill && (e.currentMana ?? 0) >= (e.skill.manaCost || 0)) nm -= e.skill.manaCost
            return { ...e, currentMana: Math.min(e.maxMana || 100, Math.max(0, nm)) }
          }))
        }, idx * 600)
      })

      setTimeout(() => {
        setPlayerParty(final => {
          if (final.every(p => p.currentHp <= 0)) setIsBattleOver(true)
          else {
            const first = final.findIndex(p => p.currentHp > 0)
            if (first !== -1) setActiveUnitIndex(first)
          }
          return final
        })
      }, livingEnemies.length * 600 + 200)
    }, 1000)
  }

  // Auto Battle Logic
  useEffect(() => {
    if (!isAuto || isBattleOver) return

    const attacker = playerParty[activeUnitIndex]
    if (!attacker || attacker.currentHp <= 0) return

    const timer = setTimeout(() => {
      if (attacker.ultimate && (attacker.currentMana ?? 0) >= (attacker.ultimate.manaCost || 0)) {
        handleUltimate()
      } else if (attacker.skill && (attacker.currentMana ?? 0) >= (attacker.skill.manaCost || 0)) {
        handleSkill()
      } else {
        const target = enemies.find(e => e.currentHp > 0)
        if (target) handleAttack(target)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [isAuto, activeUnitIndex, isBattleOver, playerParty, enemies])

  useEffect(() => {
    if (enemies.length > 0 && enemies.every(e => e.currentHp <= 0)) {
        addLog("Victory! All enemies defeated.")
        setIsBattleOver(true)
    }
    if (playerParty.length > 0 && playerParty.every(p => p.currentHp <= 0)) {
        addLog("Defeat... Your party has fallen.")
        setIsBattleOver(true)
    }
  }, [enemies, playerParty])

  const attacker = playerParty[activeUnitIndex]
  const hand = attacker ? [
    { id: 'atk', name: 'BASIC ATTACK', type: 'Attack', power: 1.0, cost: 0, art: attacker.splashArt },
    { id: 'skill', name: attacker.skill.name.toUpperCase(), type: attacker.skill.type, power: attacker.skill.power, cost: attacker.skill.manaCost, art: attacker.splashArt },
    { id: 'ult', name: attacker.ultimate.name.toUpperCase(), type: attacker.ultimate.type, power: attacker.ultimate.power, cost: attacker.ultimate.manaCost, art: attacker.splashArt }
  ] : []

  if (playerParty.length === 0) {
    return (
      <div className="screen-battle empty-state">
        <div className="warning-box">
          <h2>No Heroes in Party!</h2>
          <p>You need to summon heroes and add them to your party first.</p>
          <button onClick={() => onHome()}>Back to Menu</button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen-battle">
      <div className="battle-header">
        <div className="header-left">
          <button 
            className={`header-btn ${isAuto ? 'active' : ''}`} 
            onClick={() => setIsAuto(!isAuto)}
          >
            AUTO: {isAuto ? 'ON' : 'OFF'}
          </button>
        </div>
        <h3>STAGE {gameState.currentStage}</h3>
        <div className="header-right">
          <button className="header-btn quit-btn" onClick={onHome}>QUIT</button>
        </div>
      </div>

      <div className={`battle-arena-cinematic ${arenaShake ? 'shake-heavy' : ''}`}>
        {popups.map(p => (
          <div 
            key={p.id} 
            className="battle-damage-number" 
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            {p.value}
          </div>
        ))}

        {/* Enemies Side */}
        <div className="enemy-side-visual">
          {enemies.map(e => (
            <div 
              key={e.id} 
              className={`battle-portrait-unit enemy ${e.currentHp <= 0 ? 'dead' : ''} ${e.lastAction === 'damage' ? 'taking-damage' : ''} ${e.lastAction === 'attack' || e.lastAction === 'skill' ? 'lunge-enemy' : ''}`}
            >
              <div 
                className="portrait-art-wrap" 
                style={{ backgroundImage: e.splashArt ? `url(${e.splashArt})` : 'none' }}
              >
                {!e.splashArt && (
                  <div className="enemy-silhouette">
                    <span className="enemy-icon-large">👹</span>
                  </div>
                )}
              </div>
              <div className="portrait-platform"></div>
              <div className="unit-bars-overlay">
                <div className="battle-hp-bar-mini">
                  <div className="battle-hp-fill" style={{ width: `${(e.currentHp / e.hp) * 100}%` }}></div>
                </div>
                <div className="unit-name-tag">{e.name.toUpperCase()}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Players Side */}
        <div className="player-side-visual">
          {playerParty.map((p, i) => (
            <div 
              key={p.id} 
              className={`battle-portrait-unit player ${i === activeUnitIndex ? 'active' : ''} ${p.currentHp <= 0 ? 'dead' : ''} ${p.lastAction === 'damage' ? 'taking-damage' : ''} ${p.lastAction === 'attack' || p.lastAction === 'skill' ? 'lunge-player' : ''}`}
            >
              <div className="portrait-art-wrap" style={{ backgroundImage: `url(${p.splashArt})` }}></div>
              <div className="portrait-platform"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Battle Hand / UI */}
      {!isBattleOver ? (
        <div className="battle-hand-container">
          {attacker && (
            <div className="active-unit-info-panel">
              <div className="active-name">{attacker.name}</div>
              <div className="stat-bars">
                <div className="stat-line">
                  <div className="label-group">
                    <span className="stat-label">HP</span>
                    <span className="stat-value">{attacker.currentHp} / {attacker.hp}</span>
                  </div>
                  <div className="stat-bar-outer hp">
                    <div className="stat-bar-fill" style={{ width: `${(attacker.currentHp / attacker.hp) * 100}%` }}></div>
                  </div>
                </div>
                <div className="stat-line">
                  <div className="label-group">
                    <span className="stat-label">MP</span>
                    <span className="stat-value">{attacker.currentMana} / {attacker.maxMana || 100}</span>
                  </div>
                  <div className="stat-bar-outer mp">
                    <div className="stat-bar-fill" style={{ width: `${(attacker.currentMana / (attacker.maxMana || 100)) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="cards-hand-row">
            {hand.map(card => (
              <div 
                key={card.id} 
                className={`skill-card-battle ${attacker && attacker.currentMana < card.cost ? 'disabled' : ''}`}
                onClick={() => {
                  if (card.id === 'atk') {
                    const target = enemies.find(e => e.currentHp > 0)
                    if (target) handleAttack(target)
                  } else if (card.id === 'skill') {
                    handleSkill()
                  } else if (card.id === 'ult') {
                    handleUltimate()
                  }
                }}
              >
                <div className="skill-card-art" style={{ backgroundImage: `url(${card.art})` }}></div>
                <div className="skill-card-info">
                  <div className="skill-card-name">{card.name}</div>
                  <div className="skill-card-cost">{card.cost > 0 ? `MP ${card.cost}` : 'FREE'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="battle-hand-container results-overlay">
          <div className="battle-results">
            <h3>{enemies.every(e => e.currentHp <= 0) ? 'VICTORY' : 'DEFEAT'}</h3>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              {enemies.every(e => e.currentHp <= 0) ? (
                <button className="retry-btn" onClick={() => gameState.advanceStage()}>NEXT STAGE</button>
              ) : (
                <button className="retry-btn" onClick={() => resetBattle()}>RETRY</button>
              )}
              <button className="retry-btn" onClick={onHome}>RETURN</button>
            </div>
          </div>
        </div>
      )}

      {/* Mini Log Overlay */}
      <div className="battle-log-mini-overlay">
        {battleLog[0]}
      </div>
    </div>
  )
}

export default BattleScreen
