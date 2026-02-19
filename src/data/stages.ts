export interface StageEnemy {
  id: string
  name: string
  hp: number
  atk: number
  def: number
  spd: number
  mana: number
  maxMana: number
  splashArt: string
  skill: { name: string; description: string; manaCost: number; type: 'Attack' | 'AOE' | 'Heal'; power: number }
  ultimate: { name: string; description: string; manaCost: number; type: 'Attack' | 'AOE' | 'Heal'; power: number }
}

export interface StageReward {
  gold: number
  gems: number
}

export interface Stage {
  id: number
  name: string
  chapterId: number
  chapterName: string
  lore: string
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert'
  recommendedPower: number
  enemies: StageEnemy[]
  rewards: StageReward
  backgroundTheme: 'dungeon' | 'forest' | 'ruins' | 'castle' | 'void'
}

export const STAGES: Stage[] = [
  // ── CHAPTER 1: Sunken Ruins ──────────────────────────────────────────────
  {
    id: 1,
    name: 'Mossy Entrance',
    chapterId: 1,
    chapterName: 'Sunken Ruins',
    lore: 'Ancient ruins swallowed by time. Slimes have claimed the entrance.',
    difficulty: 'Easy',
    recommendedPower: 200,
    backgroundTheme: 'ruins',
    rewards: { gold: 500, gems: 10 },
    enemies: [
      {
        id: 'e_slime_1', name: 'Cave Slime',
        hp: 300, atk: 30, def: 10, spd: 30, mana: 0, maxMana: 100,
        splashArt: '/assets/enemies/slime.png',
        skill: { name: 'Slime Splash', description: 'Basic attack', manaCost: 20, type: 'Attack', power: 1.1 },
        ultimate: { name: 'Acid Pool', description: 'AOE acid', manaCost: 70, type: 'AOE', power: 1.5 }
      }
    ]
  },
  {
    id: 2,
    name: 'Flooded Hall',
    chapterId: 1,
    chapterName: 'Sunken Ruins',
    lore: 'Knee-deep water hides lurking predators.',
    difficulty: 'Easy',
    recommendedPower: 350,
    backgroundTheme: 'ruins',
    rewards: { gold: 700, gems: 15 },
    enemies: [
      {
        id: 'e_slime_2', name: 'Shadow Slime',
        hp: 500, atk: 40, def: 20, spd: 40, mana: 0, maxMana: 100,
        splashArt: '/assets/enemies/slime.png',
        skill: { name: 'Slime Splash', description: 'Basic attack', manaCost: 20, type: 'Attack', power: 1.2 },
        ultimate: { name: 'Mega Sludge', description: 'AOE sludge', manaCost: 80, type: 'AOE', power: 2.0 }
      },
      {
        id: 'e_slime_3', name: 'Slime Pup',
        hp: 200, atk: 20, def: 5, spd: 60, mana: 0, maxMana: 80,
        splashArt: '/assets/enemies/slime.png',
        skill: { name: 'Quick Bite', description: 'Fast attack', manaCost: 15, type: 'Attack', power: 0.9 },
        ultimate: { name: 'Swarm', description: 'Rapid strikes', manaCost: 60, type: 'Attack', power: 1.8 }
      }
    ]
  },
  {
    id: 3,
    name: 'Guardian Chamber',
    chapterId: 1,
    chapterName: 'Sunken Ruins',
    lore: 'A forgotten guardian still stands watch over the inner sanctum.',
    difficulty: 'Normal',
    recommendedPower: 600,
    backgroundTheme: 'ruins',
    rewards: { gold: 1200, gems: 30 },
    enemies: [
      {
        id: 'e_knight_1', name: 'Dark Knight',
        hp: 1200, atk: 80, def: 60, spd: 30, mana: 0, maxMana: 100,
        splashArt: '/assets/enemies/knight.png',
        skill: { name: 'Dark Slash', description: 'Heavy swing', manaCost: 40, type: 'Attack', power: 1.8 },
        ultimate: { name: 'Void Strike', description: 'Massive single hit', manaCost: 90, type: 'Attack', power: 4.0 }
      }
    ]
  },

  // ── CHAPTER 2: Ember Forest ──────────────────────────────────────────────
  {
    id: 4,
    name: 'Scorched Path',
    chapterId: 2,
    chapterName: 'Ember Forest',
    lore: 'The trees still smolder. Something powerful passed through here.',
    difficulty: 'Normal',
    recommendedPower: 900,
    backgroundTheme: 'forest',
    rewards: { gold: 1500, gems: 40 },
    enemies: [
      {
        id: 'e_wolf_1', name: 'Ember Wolf',
        hp: 800, atk: 100, def: 40, spd: 90, mana: 0, maxMana: 100,
        splashArt: '/assets/enemies/knight.png',
        skill: { name: 'Fire Fang', description: 'Burning bite', manaCost: 30, type: 'Attack', power: 1.6 },
        ultimate: { name: 'Inferno Rush', description: 'Blazing charge', manaCost: 80, type: 'AOE', power: 2.5 }
      }
    ]
  },
  {
    id: 5,
    name: 'Ash Glade',
    chapterId: 2,
    chapterName: 'Ember Forest',
    lore: 'A clearing of ash and bone. Two hunters circle their prey.',
    difficulty: 'Normal',
    recommendedPower: 1200,
    backgroundTheme: 'forest',
    rewards: { gold: 1800, gems: 50 },
    enemies: [
      {
        id: 'e_wolf_2', name: 'Ember Wolf',
        hp: 900, atk: 110, def: 45, spd: 95, mana: 0, maxMana: 100,
        splashArt: '/assets/enemies/knight.png',
        skill: { name: 'Fire Fang', description: 'Burning bite', manaCost: 30, type: 'Attack', power: 1.6 },
        ultimate: { name: 'Inferno Rush', description: 'Blazing charge', manaCost: 80, type: 'AOE', power: 2.5 }
      },
      {
        id: 'e_wolf_3', name: 'Alpha Wolf',
        hp: 1100, atk: 130, def: 55, spd: 80, mana: 0, maxMana: 100,
        splashArt: '/assets/enemies/knight.png',
        skill: { name: 'Pack Howl', description: 'Rally strike', manaCost: 40, type: 'Attack', power: 2.0 },
        ultimate: { name: 'Wild Hunt', description: 'AOE devastation', manaCost: 90, type: 'AOE', power: 3.5 }
      }
    ]
  },
  {
    id: 6,
    name: 'Ancient Pyre',
    chapterId: 2,
    chapterName: 'Ember Forest',
    lore: 'The Flame Warden awakens. None who face it have returned.',
    difficulty: 'Hard',
    recommendedPower: 1800,
    backgroundTheme: 'forest',
    rewards: { gold: 3000, gems: 80 },
    enemies: [
      {
        id: 'e_warden_1', name: 'Flame Warden',
        hp: 3000, atk: 160, def: 80, spd: 50, mana: 0, maxMana: 100,
        splashArt: '/assets/enemies/knight.png',
        skill: { name: 'Searing Wave', description: 'AOE fire wave', manaCost: 50, type: 'AOE', power: 2.2 },
        ultimate: { name: 'Pyre Explosion', description: 'Massive AOE', manaCost: 100, type: 'AOE', power: 5.0 }
      }
    ]
  },

  // ── CHAPTER 3: Void Citadel ──────────────────────────────────────────────
  {
    id: 7,
    name: 'Gate of Silence',
    chapterId: 3,
    chapterName: 'Void Citadel',
    lore: 'Beyond this gate, reality frays. The Citadel consumes all light.',
    difficulty: 'Hard',
    recommendedPower: 2500,
    backgroundTheme: 'castle',
    rewards: { gold: 4000, gems: 100 },
    enemies: [
      {
        id: 'e_phantom_1', name: 'Void Phantom',
        hp: 2000, atk: 180, def: 100, spd: 70, mana: 0, maxMana: 100,
        splashArt: '/assets/enemies/knight.png',
        skill: { name: 'Phase Slash', description: 'Phased strike', manaCost: 40, type: 'Attack', power: 2.0 },
        ultimate: { name: 'Void Tear', description: 'Reality rending', manaCost: 90, type: 'Attack', power: 5.5 }
      }
    ]
  },
  {
    id: 8,
    name: 'Obsidian Corridor',
    chapterId: 3,
    chapterName: 'Void Citadel',
    lore: 'Shadows press from every direction. Two sentinels guard the throne.',
    difficulty: 'Hard',
    recommendedPower: 3200,
    backgroundTheme: 'castle',
    rewards: { gold: 5000, gems: 120 },
    enemies: [
      {
        id: 'e_sentinel_1', name: 'Void Sentinel',
        hp: 2500, atk: 200, def: 110, spd: 55, mana: 0, maxMana: 100,
        splashArt: '/assets/enemies/knight.png',
        skill: { name: 'Dark Spear', description: 'Piercing lunge', manaCost: 40, type: 'Attack', power: 2.0 },
        ultimate: { name: 'Null Zone', description: 'AOE void pulse', manaCost: 90, type: 'AOE', power: 4.5 }
      },
      {
        id: 'e_sentinel_2', name: 'Void Sentinel II',
        hp: 2200, atk: 190, def: 100, spd: 65, mana: 0, maxMana: 100,
        splashArt: '/assets/enemies/knight.png',
        skill: { name: 'Shadow Thrust', description: 'Quick dark strike', manaCost: 35, type: 'Attack', power: 1.8 },
        ultimate: { name: 'Abyssal Wave', description: 'Wide AOE', manaCost: 85, type: 'AOE', power: 4.0 }
      }
    ]
  },
  {
    id: 9,
    name: 'Throne Antechamber',
    chapterId: 3,
    chapterName: 'Void Citadel',
    lore: 'The throne room looms ahead. One final guardian bars the passage.',
    difficulty: 'Expert',
    recommendedPower: 4500,
    backgroundTheme: 'void',
    rewards: { gold: 7000, gems: 200 },
    enemies: [
      {
        id: 'e_lord_1', name: 'Void Lord',
        hp: 6000, atk: 250, def: 140, spd: 60, mana: 0, maxMana: 100,
        splashArt: '/assets/enemies/knight.png',
        skill: { name: 'Oblivion Slash', description: 'Devastating strike', manaCost: 50, type: 'Attack', power: 3.0 },
        ultimate: { name: 'Entropy', description: 'Total obliteration', manaCost: 100, type: 'AOE', power: 8.0 }
      }
    ]
  },
  {
    id: 10,
    name: 'The Broken Throne',
    chapterId: 3,
    chapterName: 'Void Citadel',
    lore: 'The Eternal King sits upon a throne of shattered stars. This is the end.',
    difficulty: 'Expert',
    recommendedPower: 6000,
    backgroundTheme: 'void',
    rewards: { gold: 15000, gems: 500 },
    enemies: [
      {
        id: 'e_king_1', name: 'Eternal King',
        hp: 10000, atk: 320, def: 180, spd: 70, mana: 0, maxMana: 100,
        splashArt: '/assets/enemies/knight.png',
        skill: { name: 'Cosmic Blade', description: 'Stellar strike', manaCost: 50, type: 'Attack', power: 3.5 },
        ultimate: { name: 'Big Bang', description: 'Universe-ending AOE', manaCost: 100, type: 'AOE', power: 10.0 }
      },
      {
        id: 'e_king_guard', name: 'Royal Phantom',
        hp: 4000, atk: 220, def: 120, spd: 90, mana: 0, maxMana: 100,
        splashArt: '/assets/enemies/knight.png',
        skill: { name: 'Loyal Guard', description: 'Protective strike', manaCost: 35, type: 'Attack', power: 2.0 },
        ultimate: { name: 'Last Rite', description: 'Heavy AOE', manaCost: 80, type: 'AOE', power: 5.0 }
      }
    ]
  }
]
