import { useState, useCallback, useEffect } from 'react'
import { CHARACTERS, Character, Rarity } from '../data/characters'

export interface GameState {
  gems: number
  gold: number
  inventory: Character[]
  party: (Character | null)[]
  currentStage: number
  showcaseCharacterId: string | null
}

const RARITY_CHANCES: Record<Rarity, number> = {
  'Common': 0.70,
  'Rare': 0.20,
  'Epic': 0.08,
  'Legendary': 0.02
}

export interface Banner {
  id: string
  name: string
  description: string
  rateUpIds: string[]
  type: 'Standard' | 'Limited'
}

export const BANNERS: Banner[] = [
  {
    id: 'b1',
    name: 'Standard Summon',
    description: 'Summon all heroes with standard rates.',
    rateUpIds: [],
    type: 'Standard'
  },
  {
    id: 'b2',
    name: 'Celestial Light',
    description: 'Aria Rate Up! Higher chance to get legendary Aria.',
    rateUpIds: ['c1'], // Aria
    type: 'Limited'
  }
]

export const useGameState = () => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('idler_rpg_state')
    if (saved) {
      const parsed = JSON.parse(saved)
      
      // Migrate characters to ensure they have all new properties
      const migrateCharacter = (c: any) => {
        const base = CHARACTERS.find(bc => bc.id === c.id)
        if (!base) return c
        // Keep dynamic stats from save (level, stars, exp, etc)
        // But force update static definitions (art, skills, names)
        const migrated = { 
            ...c, 
            splashArt: base.splashArt, 
            skill: base.skill,
            ultimate: base.ultimate,
            name: base.name,
            element: base.element,
            rarity: base.rarity,
            tags: base.tags
        }
        return migrated
      }

      parsed.inventory = (parsed.inventory || []).map(migrateCharacter)
      parsed.party = (parsed.party || []).map((p: any) => p ? migrateCharacter(p) : null)
      
      // NEW: showcaseCharacterId migration
      if (parsed.showcaseCharacterId === undefined) {
          parsed.showcaseCharacterId = parsed.party[0] ? parsed.party[0].id : (parsed.inventory[0]?.id || null)
      }

      return parsed
    }
    return {
      gems: 5000,
      gold: 10000,
      inventory: [CHARACTERS[0], CHARACTERS[1]],
      party: [CHARACTERS[0], CHARACTERS[1], null, null],
      currentStage: 1
    }
  })

  useEffect(() => {
    localStorage.setItem('idler_rpg_state', JSON.stringify(state))
  }, [state])

  const summon = useCallback((amount: number, bannerId: string = 'b1') => {
    const cost = amount * 100
    if (state.gems < cost) return null

    const banner = BANNERS.find(b => b.id === bannerId) || BANNERS[0]
    const results: Character[] = []

    for (let i = 0; i < amount; i++) {
      const rand = Math.random()
      let accumulated = 0
      let selectedRarity: Rarity = 'Common'

      for (const [rarity, chance] of Object.entries(RARITY_CHANCES)) {
        accumulated += chance
        if (rand < accumulated) {
          selectedRarity = rarity as Rarity
          break
        }
      }

      let pool = CHARACTERS.filter(c => c.rarity === selectedRarity)
      
      // Rate up logic: 50% chance to get rate-up character if rarity matches
      const rateUpInPool = pool.filter(c => banner.rateUpIds.includes(c.id))
      let character: Character

      if (rateUpInPool.length > 0 && Math.random() < 0.5) {
        character = rateUpInPool[Math.floor(Math.random() * rateUpInPool.length)]
      } else {
        character = pool[Math.floor(Math.random() * pool.length)] || CHARACTERS[0]
      }
      
      results.push(character)
    }

    setState(prev => {
      const newInventory = [...prev.inventory]
      
      results.forEach(summonedChar => {
        const existingIndex = newInventory.findIndex(c => c.id === summonedChar.id)
        if (existingIndex !== -1) {
          // Increase Awakening (Constellation)
          const existing = newInventory[existingIndex]
          const newAwakening = Math.min(6, existing.awakening + 1)
          
          const baseChar = CHARACTERS.find(bc => bc.id === existing.id) || summonedChar
          
          newInventory[existingIndex] = {
            ...baseChar, // Ensure new properties like mana/skill/splash are here
            ...existing,
            awakening: newAwakening,
            hp: Math.floor(summonedChar.hp * (1 + newAwakening * 0.1) * (1 + (existing.level - 1) * 0.05)),
            atk: Math.floor(summonedChar.atk * (1 + newAwakening * 0.1) * (1 + (existing.level - 1) * 0.05)),
          }
        } else {
          newInventory.push({ ...summonedChar })
        }
      })

      // Synchronize Party
      const newParty = prev.party.map(p => {
        if (!p) return null
        const updated = newInventory.find(inv => inv.id === p.id)
        return updated ? { ...updated } : p
      })

      return {
        ...prev,
        gems: prev.gems - cost,
        inventory: newInventory,
        party: newParty
      }
    })

    return results
  }, [state.gems, state.inventory, state.party])

  const addToParty = useCallback((character: Character, slotIndex: number) => {
    setState(prev => {
      // Uniqueness check: Remove character from any other slot first
      const newParty = prev.party.map(p => (p && p.id === character.id ? null : p))
      newParty[slotIndex] = character
      return { ...prev, party: newParty }
    })
  }, [])

  const removeFromParty = useCallback((slotIndex: number) => {
    setState(prev => {
      const newParty = [...prev.party]
      newParty[slotIndex] = null
      return { ...prev, party: newParty }
    })
  }, [])

  const advanceStage = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStage: prev.currentStage + 1,
      gold: prev.gold + (prev.currentStage * 100) // Reward gold
    }))
  }, [])

  const levelUp = useCallback((charId: string) => {
    setState(prev => {
      const cost = 500
      if (prev.gold < cost) return prev

      const newInventory = prev.inventory.map(c => {
        if (c.id === charId) {
          const nextLevel = c.level + 1
          const baseChar = CHARACTERS.find(bc => bc.id === c.id)!
          
          return {
            ...baseChar, // Force inclusion of base mana/skill/etc.
            ...c,
            level: nextLevel,
            hp: Math.floor(baseChar.hp * (1 + c.awakening * 0.1) * (1 + (nextLevel - 1) * 0.05)),
            atk: Math.floor(baseChar.atk * (1 + c.awakening * 0.1) * (1 + (nextLevel - 1) * 0.05)),
          }
        }
        return c
      })

      const newParty = prev.party.map(p => {
        if (!p) return null
        const updated = newInventory.find(inv => inv.id === p.id)
        return updated ? { ...updated } : p
      })

      return {
        ...prev,
        gold: prev.gold - cost,
        inventory: newInventory,
        party: newParty
      }
    })
  }, [])

  const setShowcaseCharacter = useCallback((id: string) => {
    setState(prev => ({ ...prev, showcaseCharacterId: id }))
  }, [])

  const resetAccount = useCallback(() => {
    if (window.confirm("ARE YOU SURE? This will PERMANENTLY delete all your progress, heroes, and resources!")) {
      localStorage.removeItem('idler_rpg_state')
      window.location.reload()
    }
  }, [])

  return {
    ...state,
    summon,
    addToParty,
    removeFromParty,
    advanceStage,
    levelUp,
    resetAccount,
    setShowcaseCharacter
  }
}
