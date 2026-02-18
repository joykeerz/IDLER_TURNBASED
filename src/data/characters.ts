export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary'

export interface Skill {
  name: string
  description: string
  manaCost: number
  type: 'Attack' | 'AOE' | 'Heal' | 'Buff'
  power: number
}

export interface Character {
  id: string
  name: string
  rarity: Rarity
  baseStars: number
  hp: number
  atk: number
  def: number
  spd: number
  level: number
  exp: number
  awakening: number
  mana: number
  maxMana: number
  skill: Skill
  ultimate: Skill
}

export const CHARACTERS: Character[] = [
  {
    id: 'c1',
    name: 'Aria',
    rarity: 'Legendary',
    baseStars: 5,
    hp: 500,
    atk: 200,
    def: 50,
    spd: 100,
    level: 1,
    exp: 0,
    awakening: 0,
    mana: 0,
    maxMana: 100,
    skill: { name: 'Heavenly Burst', description: 'Attack all enemies', manaCost: 60, type: 'AOE', power: 1.2 },
    ultimate: { name: 'Goddess Wrath', description: 'Massive AOE damage', manaCost: 100, type: 'AOE', power: 3.5 }
  },
  {
    id: 'c2',
    name: 'Kaelen',
    rarity: 'Epic',
    baseStars: 3,
    hp: 450,
    atk: 150,
    def: 45,
    spd: 120,
    level: 1,
    exp: 0,
    awakening: 0,
    mana: 0,
    maxMana: 100,
    skill: { name: 'Phantom Strike', description: 'Powerful strike', manaCost: 40, type: 'Attack', power: 2.5 },
    ultimate: { name: 'Shadow Assassination', description: 'Lethal single-target hit', manaCost: 90, type: 'Attack', power: 6.0 }
  },
  {
    id: 'c3',
    name: 'Borg',
    rarity: 'Rare',
    baseStars: 2,
    hp: 600,
    atk: 80,
    def: 80,
    spd: 50,
    level: 1,
    exp: 0,
    awakening: 0,
    mana: 0,
    maxMana: 100,
    skill: { name: 'Iron Fortitude', description: 'Heal party', manaCost: 50, type: 'Heal', power: 300 },
    ultimate: { name: 'Sanctuary of Life', description: 'Massive party heal', manaCost: 100, type: 'Heal', power: 1000 }
  },
  {
    id: 'c4',
    name: 'Town Guard',
    rarity: 'Common',
    baseStars: 1,
    hp: 400,
    atk: 90,
    def: 60,
    spd: 80,
    level: 1,
    exp: 0,
    awakening: 0,
    mana: 0,
    maxMana: 80,
    skill: { name: 'Shield Bash', description: 'Stun attack', manaCost: 30, type: 'Attack', power: 1.5 },
    ultimate: { name: 'Phalanx Charge', description: 'Strong multi-hit', manaCost: 80, type: 'Attack', power: 3.0 }
  }
]
