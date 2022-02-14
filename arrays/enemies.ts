// @ts-nocheck
const dummy =
  new Character({
    id: "dummy",
    name: "dummy",
    cords: { x: 0, y: 0 },
    stats: {
      str: 1,
      dex: 1,
      int: 1,
      vit: 0,
      hp: 10000,
      mp: 0,
      hpMax: 10000,
      mpMax: 0
    },
    resistances: {
      slash: 0,
      crush: 0,
      pierce: 0,
      dark: 0,
      divine: 0,
      fire: 0,
      lightning: 0,
      ice: 0
    },
    statusResistances: {
      poison: 0,
      burning: 0,
      curse: 0,
      stun: 0,
      bleed: 0
    },
    xp: 10,
    abilities: []
  });

// 350 res == 100% / fully immune
// -100 res == take double damage

const s_def: any = getAbiStatusModifiers(dummy, "", "");

const enemies = {
  greySlime: {
    id: "greySlime",
    name: "Grey Slime",
    cords: { x: 0, y: 0 },
    stats: {
      str: 1,
      dex: 1,
      int: 1,
      vit: 0,
      cun: 0,
      hp: 10,
      mp: 0,
      hpMax: 10,
      mpMax: 0
    },
    resistances: {
      slash: 0,
      crush: 0,
      pierce: 0,
      magic: 0,
      dark: 0,
      divine: 0,
      fire: 0,
      lightning: 0,
      ice: 0
    },
    statusResistances: {
      poison: 0,
      burning: 0,
      curse: 0,
      stun: 0,
      bleed: 0
    },
    damages: {
      crush: 4
    },
    hit: {
      chance: 30,
      evasion: 0
    },
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: -100,
          regenMpP: -100 
        }
      },
    ],
    threat: 10,
    alive: true,
    xp: 10,
    sprite: "greySlime",
    type: "slime",
    race: "elemental",
    img: "resources/tiles/enemies/grey_slime.png",
    aggroRange: 6,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy),
    ],
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    statsPerLevel: {
      str: 1,
      vit: 1
    },
    loot: [
      {type: "gold", amount: [1, 5]}
    ]
  },
  flamingSlime: {
    id: "flamingSlime",
    name: "Flaming Slime",
    cords: { x: 0, y: 0 },
    stats: {
      str: 1,
      dex: 1,
      int: 1,
      vit: 0,
      cun: 0,
      hp: 14,
      mp: 0,
      hpMax: 14,
      mpMax: 0
    },
    resistances: {
      slash: 40,
      crush: 40,
      pierce: 40,
      magic: 20,
      dark: 10,
      divine: 10,
      fire: 340,
      lightning: -30,
      ice: -40
    },
    statusResistances: {
      poison: 0,
      burning: 100,
      curse: 0,
      stun: 0,
      bleed: 0
    },
    damages: {
      fire: 6
    },
    hit: {
      chance: 30,
      evasion: 0
    },
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: -100,
          regenMpP: -100 
        }
      },
    ],
    threat: 10,
    alive: true,
    xp: 10,
    sprite: "fireSlime",
    type: "slime",
    race: "elemental",
    img: "resources/tiles/enemies/flaming_slime.png",
    aggroRange: 6,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy)
    ],
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    statsPerLevel: {
      str: 1,
      vit: 1
    },
    loot: [
      {type: "gold", amount: [4, 11]}
    ]
  },
  electricSlime: {
    id: "electricSlime",
    name: "Electric Slime",
    cords: { x: 0, y: 0 },
    stats: {
      str: 1,
      dex: 1,
      int: 1,
      vit: 0,
      cun: 0,
      hp: 14,
      mp: 0,
      hpMax: 14,
      mpMax: 0
    },
    resistances: {
      slash: 40,
      crush: 40,
      pierce: 40,
      magic: 10,
      dark: 10,
      divine: 10,
      fire: -30,
      lightning: 340,
      ice: -20
    },
    statusResistances: {
      poison: 0,
      burning: 0,
      curse: 0,
      stun: 50,
      bleed: 0
    },
    damages: {
      lightning: 6
    },
    hit: {
      chance: 30,
      evasion: 0
    },
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: -100,
          regenMpP: -100 
        }
      },
    ],
    threat: 10,
    alive: true,
    xp: 10,
    sprite: "shockSlime",
    type: "slime",
    race: "elemental",
    img: "resources/tiles/enemies/electric_slime.png",
    aggroRange: 6,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy)
    ],
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    statsPerLevel: {
      str: 1,
      vit: 1
    },
    loot: [
      {type: "gold", amount: [4, 11]}
    ]
  },
  hiisi: {
    id: "hiisi",
    name: "Hiisi",
    cords: { x: 0, y: 0 },
    stats: {
      str: 4,
      dex: 1,
      int: 1,
      vit: 0,
      cun: 0,
      hp: 20,
      mp: 0,
      hpMax: 20,
      mpMax: 0
    },
    resistances: {
      slash: 0,
      crush: 0,
      pierce: 0,
      magic: 0,
      dark: 0,
      divine: 0,
      fire: -10,
      lightning: -10,
      ice: -10
    },
    statusResistances: {
      poison: 0,
      burning: 0,
      curse: 0,
      stun: 0,
      bleed: 0
    },
    damages: {
      slash: 6
    },
    hit: {
      chance: 55,
      evasion: 35
    },
    scale: 0.9,
    threat: 25,
    alive: true,
    xp: 15,
    sprite: "hiisi",
    type: "hiisi",
    race: "monster",
    img: "resources/tiles/enemies/hiisi.png",
    aggroRange: 9,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy)
    ],
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: -100,
          regenMpP: -100 
        }
      },
      {
        id: "magical_incompetence",
        effects: {
          mpMaxP: -100,
        }
      },
      {
        id: "cornered_animal_frenzy",
        conditions: {
          hp_less_than: 50
        },
        effects: {
          evasionV: 10,
          hitChanceV: 10,
          damageP: 5
        }
      }
    ],
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    statsPerLevel: {
      str: 1,
      dex: 1,
      vit: 2
    },
    loot: [
      {type: "weapon", amount: [1, 1], item: "chippedBlade", chance: 20},
      {type: "gold", amount: [2, 11]}
    ]
  },
  hiisiWarrior: {
    id: "hiisiWarrior",
    name: "Hiisi Warrior",
    cords: { x: 0, y: 0 },
    stats: {
      str: 8,
      dex: 1,
      int: 1,
      vit: 0,
      cun: 4,
      hp: 30,
      mp: 0,
      hpMax: 30,
      mpMax: 0
    },
    resistances: {
      slash: 5,
      crush: 5,
      pierce: 5,
      magic: 5,
      dark: 5,
      divine: 5,
      fire: -10,
      lightning: -10,
      ice: -10
    },
    statusResistances: {
      poison: 0,
      burning: 0,
      curse: 0,
      stun: 0,
      bleed: 0
    },
    damages: {
      pierce: 8
    },
    hit: {
      chance: 60,
      evasion: 40
    },
    scale: 0.9,
    threat: 25,
    alive: true,
    xp: 24,
    sprite: "hiisiWarrior",
    type: "hiisi",
    race: "monster",
    img: "resources/tiles/enemies/hiisi.png",
    aggroRange: 9,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy),
      new Ability(abilities.battle_fury, dummy)
    ],
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: -100,
          regenMpP: -100 
        }
      },
      {
        id: "magical_incompetence",
        effects: {
          mpMaxP: -100,
        }
      },
      {
        id: "cornered_animal_frenzy",
        conditions: {
          hp_less_than: 50
        },
        effects: {
          evasionV: 10,
          hitChanceV: 10,
          damageP: 5
        }
      }
    ],
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    statsPerLevel: {
      str: 2,
      dex: 1,
      vit: 1
    },
    loot: [
      {type: "weapon", amount: [1, 1], item: "chippedBlade", chance: 20},
      {type: "gold", amount: [2, 11]}
    ]
  },
  hiisiHunter: {
    id: "hiisiHunter",
    name: "Hiisi Hunter",
    cords: { x: 0, y: 0 },
    stats: {
      str: 1,
      dex: 8,
      int: 1,
      vit: 0,
      cun: 4,
      hp: 20,
      mp: 0,
      hpMax: 20,
      mpMax: 0
    },
    resistances: {
      slash: -5,
      crush: -5,
      pierce: -5,
      magic: -5,
      dark: -5,
      divine: -5,
      fire: -10,
      lightning: -10,
      ice: -10
    },
    statusResistances: {
      poison: 0,
      burning: 0,
      curse: 0,
      stun: 0,
      bleed: 0
    },
    damages: {
      pierce: 7
    },
    hit: {
      chance: 60,
      evasion: 40
    },
    scale: 0.9,    
    threat: 20,
    alive: true,
    xp: 24,
    sprite: "hiisiHunter",
    type: "hiisi",
    race: "monster",
    img: "resources/tiles/enemies/hiisi_hunter.png",
    shootsProjectile: "arrowProjectile",
    aggroRange: 9,
    attackRange: 6,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy),
      new Ability(abilities.poisoned_arrow, dummy)
    ],
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: -100,
          regenMpP: -100 
        }
      },
      {
        id: "magical_incompetence",
        effects: {
          mpMaxP: -100,
          poisoned_arrow_status_effect_damageAmountV: -2
        }
      },
      {
        id: "cornered_animal_frenzy",
        conditions: {
          hp_less_than: 50
        },
        effects: {
          evasionV: 10,
          hitChanceV: 10,
          damageP: 5
        }
      }
    ],
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    statsPerLevel: {
      str: 1,
      dex: 2,
      vit: 1
    },
    loot: [
      {type: "weapon", amount: [1, 1], item: "hiisiBow", chance: 25},
      {type: "gold", amount: [2, 11]}
    ]
  },
  skeletonWarrior: {
    id: "skeletonWarrior",
    name: "Skeleton Warrior",
    cords: { x: 0, y: 0 },
    stats: {
      str: 5,
      dex: 1,
      int: 1,
      vit: 0,
      cun: 0,
      hp: 25,
      mp: 0,
      hpMax: 25,
      mpMax: 0
    },
    resistances: {
      slash: 45,
      crush: 15,
      pierce: 45,
      magic: 10,
      dark: 25,
      divine: -50,
      fire: 0,
      lightning: 0,
      ice: 0
    },
    statusResistances: {
      poison: 100,
      burning: -20,
      curse: 50,
      stun: 0,
      bleed: 100
    },
    damages: {
      slash: 3
    },
    hit: {
      chance: 45,
      evasion: 25
    },
    threat: 20,
    alive: true,
    xp: 20,
    sprite: "skeletonWarrior",
    type: "skeleton",
    race: "undead",
    img: "resources/tiles/enemies/skeleton_warrior.png",
    aggroRange: 8,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy)
    ],
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: -100,
          regenMpP: -100 
        }
      },
      {
        id: "magical_binding",
        effects: {
          mpMaxP: -100,
        }
      }
    ],
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    statsPerLevel: {
      str: 2,
      dex: 1,
      vit: 1
    },
    loot: [
      {type: "weapon", amount: [1, 1], item: "chippedBlade", chance: 20},
      {type: "gold", amount: [4, 15]}
    ]
  },
  skeletonArcher: {
    id: "skeletonArcher",
    name: "Skeleton Archer",
    cords: { x: 0, y: 0 },
    stats: {
      str: 1,
      dex: 5,
      int: 1,
      vit: 0,
      cun: 0,
      hp: 20,
      mp: 0,
      hpMax: 20,
      mpMax: 0
    },
    resistances: {
      slash: 45,
      crush: 15,
      pierce: 45,
      magic: 10,
      dark: 25,
      divine: -50,
      fire: 0,
      lightning: 0,
      ice: 0
    },
    statusResistances: {
      poison: 100,
      burning: -20,
      curse: 50,
      stun: 0,
      bleed: 100
    },
    damages: {
      pierce: 4
    },
    hit: {
      chance: 45,
      evasion: 25
    },
    threat: 20,
    alive: true,
    xp: 20,
    sprite: "skeletonArcher",
    type: "skeleton",
    race: "undead",
    img: "resources/tiles/enemies/skeleton_archer.png",
    aggroRange: 8,
    attackRange: 7,
    canFly: false,
    shootsProjectile: "arrowProjectile",
    abilities: [
      new Ability(abilities.attack, dummy),
      new Ability(abilities.sundering_arrow, dummy)
    ],
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: -100,
          regenMpP: -100 
        }
      },
      {
        id: "magical_binding",
        effects: {
          mpMaxP: -100
        }
      }
    ],
    statsPerLevel: {
      str: 1,
      dex: 2,
      vit: 1
    },
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    loot: [
      {type: "weapon", amount: [1, 1], item: "huntingBow", chance: 20},
      {type: "gold", amount: [4, 15]}
    ]
  },
  skeletonMage: {
    id: "skeletonMage",
    name: "Skeleton Mage",
    cords: { x: 0, y: 0 },
    stats: {
      str: 1,
      dex: 4,
      int: 4,
      vit: 0,
      cun: 0,
      hp: 14,
      mp: 12,
      hpMax: 14,
      mpMax: 4
    },
    resistances: {
      slash: 45,
      crush: 15,
      pierce: 45,
      magic: 50,
      dark: 50,
      divine: -50,
      fire: 0,
      lightning: 0,
      ice: 5
    },
    statusResistances: {
      poison: 100,
      burning: -20,
      curse: 50,
      stun: 0,
      bleed: 100
    },
    damages: {
      pierce: 2,
      magic: 3
    },
    hit: {
      chance: 45,
      evasion: 25
    },
    alive: true,
    xp: 40,
    sprite: "skeletonMage",
    type: "skeleton",
    race: "undead",
    img: "resources/tiles/enemies/skeleton_mage.png",
    aggroRange: 8,
    attackRange: 6,
    canFly: false,
    shootsProjectile: "piercingManaBoltProjectile",
    abilities: [
      new Ability(abilities.attack, dummy),
      new Ability(abilities.blight, dummy),
    ],
    threat: 20,
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: -100,
          regenMpP: 25 
        }
      },
    ],
    statsPerLevel: {
      dex: 1,
      int: 2,
      vit: 1
    },
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    loot: [
      {type: "gold", amount: [4, 15]}
    ]
  },
  skeletonLich: {
    id: "skeletonLich",
    name: "Skeleton Lich",
    cords: { x: 0, y: 0 },
    stats: {
      str: 3,
      dex: 10,
      int: 10,
      vit: 0,
      cun: 0,
      hp: 30,
      mp: 70,
      hpMax: 30,
      mpMax: 50
    },
    resistances: {
      slash: 50,
      crush: 15,
      pierce: 50,
      magic: 60,
      dark: 75,
      divine: -50,
      fire: 0,
      lightning: 0,
      ice: 10
    },
    statusResistances: {
      poison: 100,
      burning: -25,
      curse: 50,
      stun: 0,
      bleed: 100
    },
    damages: {
      pierce: 2,
      magic: 4,
      dark: 3
    },
    hit: {
      chance: 55,
      evasion: 30
    },
    threat: 30,
    alive: true,
    xp: 90,
    sprite: "skeletonLich",
    type: "skeleton",
    race: "undead",
    img: "resources/tiles/enemies/skeleton_lich.png",
    aggroRange: 10,
    attackRange: 9,
    canFly: false,
    shootsProjectile: "piercingManaBoltProjectile",
    abilities: [
      new Ability(abilities.attack, dummy),
      new Ability(abilities.blight, dummy),
      new Ability(abilities.fireball, dummy)
    ],
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: -100,
          regenMpP: 50 
        }
      },
      {
        id: "dont_spam_abilities",
        effects: {
          blight_cooldownV: 3,
          fireball_cooldownV: 5
        }
      }
    ],
    statsPerLevel: {
      dex: 2,
      int: 2,
      vit: 1
    },
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    loot: [
      {type: "armor", amount: [1, 1], item: "crownOfWisdom", chance: 5},
      {type: "armor", amount: [1, 1], item: "lichRobes", chance: 10},
      {type: "gold", amount: [24, 60]}
    ]
  },
  norsemanBerserk: {
    id: "norsemanBerserk",
    name: "Norseman Berserk",
    cords: { x: 0, y: 0 },
    stats: {
      str: 15,
      dex: 8,
      int: 4,
      vit: 0,
      cun: 0,
      hp: 40,
      mp: 0,
      hpMax: 40,
      mpMax: 0
    },
    resistances: {
      slash: 0,
      crush: 5,
      pierce: 5,
      magic: -15,
      dark: 15,
      divine: 15,
      fire: 0,
      lightning: 0,
      ice: 0
    },
    statusResistances: {
      poison: 25,
      burning: 0,
      curse: 0,
      stun: 0,
      bleed: 0
    },
    damages: {
      slash: 4,
      pierce: 3
    },
    hit: {
      chance: 60,
      evasion: 20
    },
    threat: 25,
    retreatLimit: 25, // when enemy has this % hp left, it runs away from the player once.
    alive: true,
    xp: 37,
    sprite: "norsemanBerserk",
    type: "barbarian",
    race: "human",
    img: "resources/tiles/enemies/norseman_berserk.png",
    aggroRange: 8,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy),
      new Ability(abilities.charge, dummy),
    ],
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: -100,
          regenMpP: -100 
        }
      },
      {
        id: "dont_spam_abilities",
        effects: {
          charge_cooldownV: 2,
          charge_use_rangeV: -1
        }
      }
    ],
    statsPerLevel: {
      str: 2,
      vit: 2,
      cun: 1
    },
    loot: [
      {type: "weapon", amount: [1, 1], item: "chippedAxe", chance: 15},
      {type: "weapon", amount: [1, 1], item: "stick", chance: 20},
      {type: "gold", amount: [6, 18]}
    ]
  },
  norsemanHunter: {
    id: "norsemanHunter",
    name: "Norseman Hunter",
    cords: { x: 0, y: 0 },
    stats: {
      str: 10,
      dex: 13,
      int: 4,
      vit: 0,
      cun: 0,
      hp: 30,
      mp: 0,
      hpMax: 30,
      mpMax: 0
    },
    resistances: {
      slash: 5,
      crush: 5,
      pierce: 5,
      magic: -15,
      dark: 15,
      divine: 15,
      fire: 0,
      lightning: 0,
      ice: 0
    },
    statusResistances: {
      poison: 25,
      burning: 0,
      curse: 0,
      stun: 0,
      bleed: 0
    },
    damages: {
      pierce: 6
    },
    hit: {
      chance: 60,
      evasion: 20
    },
    threat: 25,
    retreatLimit: 25, // when enemy has this % hp left, it runs away from the player once.
    alive: true,
    xp: 37,
    sprite: "norsemanHunter",
    type: "barbarian",
    race: "human",
    img: "resources/tiles/enemies/norseman_hunter.png",
    aggroRange: 8,
    attackRange: 7,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy),
    ],
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: -100,
          regenMpP: -100 
        }
      },
    ],
    statsPerLevel: {
      dex: 2,
      vit: 1,
      cun: 2
    },
    shootsProjectile: "hunterJavelinProjectile",
    loot: [
      {type: "gold", amount: [6, 18]}
    ]
  },
  femaleOrcRaider: {
    id: "femaleOrcRaider",
    name: "Orc Raider",
    cords: { x: 0, y: 0 },
    stats: {
      str: 12,
      dex: 8,
      int: 3,
      vit: 0,
      cun: 0,
      hp: 75,
      mp: 0,
      hpMax: 55,
      mpMax: 0
    },
    resistances: {
      slash: 0,
      crush: 0,
      pierce: 0,
      magic: 30,
      dark: 30,
      divine: 0,
      fire: 0,
      lightning: 0,
      ice: 0
    },
    statusResistances: {
      poison: 50,
      burning: 0,
      curse: 0,
      stun: 30,
      bleed: 0
    },
    damages: {
      crush: 5,
      pierce: 4
    },
    hit: {
      chance: 55,
      evasion: 25
    },
    threat: 30,
    retreatLimit: 25, // when enemy has this % hp left, it runs away from the player once.
    alive: true,
    xp: 75,
    sprite: "femaleOrcRaider",
    type: "barbarian",
    race: "orc",
    img: "resources/tiles/enemies/female_orc_raider.png",
    aggroRange: 11,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy),
      new Ability(abilities.charge, dummy),
      new Ability(abilities.barbarian_rage, dummy),
    ],
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: -60,
          regenMpP: -100 
        }
      },
      {
        id: "dont_spam_abilities",
        effects: {
          charge_cooldownV: 2,
          charge_use_rangeV: -1,
          rage_cooldownV: 5
        }
      },
      {
        id: "orc_frenzy",
        conditions: {
          hp_more_than: 50
        },
        effects: {
          evasionV: -5,
          hitChanceV: 5,
          damageP: 8
        }
      },
      {
        id: "orc_resilience",
        conditions: {
          hp_less_than: 50
        },
        effects: {
          evasionV: 5,
          hitChanceV: -5,
          regenHpP: 75
        }
      }
    ],
    statsPerLevel: {
      str: 2,
      vit: 2,
      cun: 1
    },
    loot: [
      {type: "weapon", amount: [1, 1], item: "orcishAxe", chance: 15},
      {type: "armor", amount: [1, 1], item: "ironShield", chance: 10},
      {type: "gold", amount: [15, 33]}
    ]
  },
  maleOrcRaider: {
    id: "maleOrcRaider",
    name: "Orc Raider",
    cords: { x: 0, y: 0 },
    stats: {
      str: 8,
      dex: 8,
      int: 3,
      vit: 4,
      cun: 0,
      hp: 95,
      mp: 0,
      hpMax: 75,
      mpMax: 0
    },
    resistances: {
      slash: 10,
      crush: 10,
      pierce: 10,
      magic: 30,
      dark: 30,
      divine: 5,
      fire: 5,
      lightning: -5,
      ice: 5
    },
    statusResistances: {
      poison: 50,
      burning: 0,
      curse: 0,
      stun: 30,
      bleed: 0
    },
    damages: {
      slash: 5,
      pierce: 2
    },
    hit: {
      chance: 55,
      evasion: 25
    },
    threat: 30,
    retreatLimit: 25, // when enemy has this % hp left, it runs away from the player once.
    alive: true,
    xp: 75,
    sprite: "maleOrcRaider",
    type: "barbarian",
    race: "orc",
    img: "resources/tiles/enemies/male_orc_raider.png",
    aggroRange: 11,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy),
      new Ability(abilities.challenge, dummy),
      new Ability(abilities.barbarian_rage, dummy),
    ],
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: -60,
          regenMpP: -100 
        }
      },
      {
        id: "dont_spam_abilities",
        effects: {
          charge_cooldownV: 2,
          charge_use_rangeV: -1,
          rage_cooldownV: 5
        }
      },
      {
        id: "orc_frenzy",
        conditions: {
          hp_more_than: 50
        },
        effects: {
          evasionV: -5,
          hitChanceV: 5,
          damageP: 8
        }
      },
      {
        id: "orc_resilience",
        conditions: {
          hp_less_than: 50
        },
        effects: {
          evasionV: 5,
          hitChanceV: -5,
          regenHpP: 75
        }
      }
    ],
    statsPerLevel: {
      str: 2,
      vit: 2,
      cun: 1
    },
    loot: [
      {type: "weapon", amount: [1, 1], item: "chippedBlade", chance: 15},
      {type: "armor", amount: [1, 1], item: "silverShield", chance: 8},
      {type: "gold", amount: [15, 33]}
    ]
  },
  orcChieftess: {
    id: "orcChieftess",
    name: "Orc Chieftess",
    cords: { x: 0, y: 0 },
    stats: {
      str: 13,
      dex: 8,
      int: 3,
      vit: 8,
      cun: 6,
      hp: 150,
      mp: 0,
      hpMax: 50,
      mpMax: 0
    },
    resistances: {
      slash: 5,
      crush: 5,
      pierce: 5,
      magic: 45,
      dark: 45,
      divine: 5,
      fire: 5,
      lightning: 5,
      ice: 5
    },
    statusResistances: {
      poison: 55,
      burning: 20,
      curse: 0,
      stun: 40,
      bleed: 20
    },
    damages: {
      pierce: 10,
      divine: 5
    },
    hit: {
      chance: 55,
      evasion: 25
    },
    threat: 30,
    retreatLimit: 25, // when enemy has this % hp left, it runs away from the player once.
    alive: true,
    xp: 500,
    sprite: "orcChieftess",
    type: "barbarian",
    race: "orc",
    img: "resources/tiles/enemies/orc_chieftess.png",
    aggroRange: 11,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy),
      new Ability(abilities.challenge, dummy),
      new Ability(abilities.charge, dummy),
      new Ability(abilities.barbarian_rage, dummy),
    ],
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: -60,
          regenMpP: -100 
        }
      },
      {
        id: "dont_spam_abilities",
        effects: {
          charge_cooldownV: 5,
          charge_use_rangeV: -2,
          rage_cooldownV: 5
        }
      },
      {
        id: "orc_frenzy",
        conditions: {
          hp_more_than: 50
        },
        effects: {
          evasionV: -5,
          hitChanceV: 5,
          damageP: 8
        }
      },
      {
        id: "orc_resilience",
        conditions: {
          hp_less_than: 50
        },
        effects: {
          evasionV: 5,
          hitChanceV: -5,
          regenHpP: 75
        }
      }
    ],
    statsPerLevel: {
      str: 3,
      vit: 3,
      cun: 1
    },
    loot: [
      {type: "weapon", amount: [1, 1], item: "galadorSpear", chance: 100},
      {type: "gold", amount: [180, 260]}
    ]
  },
  wildTroll: {
    id: "wildTroll",
    name: "Wild Troll",
    cords: { x: 0, y: 0 },
    stats: {
      str: 20,
      dex: 0,
      int: 0,
      vit: 0,
      cun: 0,
      hp: 60,
      mp: 0,
      hpMax: 60,
      mpMax: 0
    },
    resistances: {
      slash: 10,
      crush: 10,
      pierce: 10,
      magic: 15,
      dark: -10,
      divine: -10,
      fire: -20,
      lightning: 0,
      ice: 0
    },
    statusResistances: {
      poison: 50,
      burning: -20,
      curse: 0,
      stun: 0,
      bleed: 50
    },
    damages: {
      crush: 4,
      slash: 4
    },
    hit: {
      chance: 70,
      evasion: 10
    },
    threat: 30,
    alive: true,
    xp: 50,
    sprite: "wildTroll",
    type: "troll",
    race: "monster",
    img: "resources/tiles/enemies/wild_troll.png",
    aggroRange: 10,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy)
    ],
    scale: 1.2,
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: 50,
          regenMpP: -100 
        }
      },
      {
        id: "anti_magic",
        effects: {
          mpMaxP: -100,
        }
      }
    ],
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    statsPerLevel: {
      str: 3,
      dex: 0,
      vit: 3
    },
    loot: [
      {type: "gold", amount: [22, 44]}
    ]
  },
  wildStoneTroll: {
    id: "wildStoneTroll",
    name: "Wild Stone Troll",
    cords: { x: 0, y: 0 },
    stats: {
      str: 23,
      dex: 0,
      int: 0,
      vit: 0,
      cun: 0,
      hp: 80,
      mp: 0,
      hpMax: 80,
      mpMax: 0
    },
    resistances: {
      slash: 30,
      crush: 15,
      pierce: 30,
      magic: 5,
      dark: -10,
      divine: -10,
      fire: 10,
      lightning: 0,
      ice: 0
    },
    statusResistances: {
      poison: 50,
      burning: -10,
      curse: 0,
      stun: 0,
      bleed: 75
    },
    damages: {
      crush: 6,
      slash: 4
    },
    hit: {
      chance: 70,
      evasion: 10
    },
    threat: 35,
    alive: true,
    xp: 80,
    sprite: "wildStoneTroll",
    type: "troll",
    race: "monster",
    img: "resources/tiles/enemies/wild_stone_troll.png",
    aggroRange: 11,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy)
    ],
    scale: 1.2,
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: 50,
          regenMpP: -100 
        }
      },
      {
        id: "anti_magic",
        effects: {
          mpMaxP: -100,
        }
      }
    ],
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    statsPerLevel: {
      str: 3,
      dex: 0,
      vit: 4
    },
    loot: [
      {type: "gold", amount: [22, 44]}
    ]
  },
  troll: {
    id: "troll",
    name: "Troll",
    cords: { x: 0, y: 0 },
    stats: {
      str: 25,
      dex: 0,
      int: 0,
      vit: 0,
      cun: 0,
      hp: 75,
      mp: 0,
      hpMax: 75,
      mpMax: 0
    },
    resistances: {
      slash: 5,
      crush: 5,
      pierce: 5,
      magic: 5,
      dark: -15,
      divine: -15,
      fire: -25,
      lightning: 0,
      ice: 0
    },
    statusResistances: {
      poison: 50,
      burning: -10,
      curse: 0,
      stun: 0,
      bleed: 25
    },
    damages: {
      crush: 11,
    },
    hit: {
      chance: 70,
      evasion: 10
    },
    threat: 35,
    alive: true,
    xp: 65,
    sprite: "troll",
    type: "troll",
    race: "monster",
    img: "resources/tiles/enemies/troll.png",
    aggroRange: 11,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy)
    ],
    scale: 1.2,
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: 50,
          regenMpP: -100 
        }
      },
      {
        id: "anti_magic",
        effects: {
          mpMaxP: -100,
        }
      }
    ],
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    statsPerLevel: {
      str: 4,
      dex: 0,
      vit: 3
    },
    loot: [
      {type: "weapon", amount: [1, 1], item: "trollClub", chance: 15},
      {type: "gold", amount: [26, 51]}
    ]
  },
  stoneTroll: {
    id: "stoneTroll",
    name: "Stone Troll",
    cords: { x: 0, y: 0 },
    stats: {
      str: 28,
      dex: 0,
      int: 0,
      vit: 0,
      cun: 0,
      hp: 90,
      mp: 0,
      hpMax: 90,
      mpMax: 0
    },
    resistances: {
      slash: 25,
      crush: 25,
      pierce: 25,
      magic: 25,
      dark: -5,
      divine: -5,
      fire: -5,
      lightning: 5,
      ice: 5
    },
    statusResistances: {
      poison: 50,
      burning: -10,
      curse: 0,
      stun: 0,
      bleed: 65
    },
    damages: {
      crush: 11,
    },
    hit: {
      chance: 70,
      evasion: 10
    },
    threat: 40,
    type: "troll",
    race: "monster",
    alive: true,
    xp: 100,
    sprite: "stoneTroll",
    img: "resources/tiles/enemies/stone_troll.png",
    aggroRange: 11,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy)
    ],
    scale: 1.2,
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: 50,
          regenMpP: -100 
        }
      },
      {
        id: "anti_magic",
        effects: {
          mpMaxP: -100,
        }
      }
    ],
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    statsPerLevel: {
      str: 4,
      dex: 0,
      vit: 4
    },
    loot: [
      {type: "weapon", amount: [1, 1], item: "trollClub", chance: 15},
      {type: "gold", amount: [53, 129]}
    ]
  },
  enthralledKnight: {
    id: "enthralledKnight",
    name: "Enthralled Knight",
    cords: { x: 0, y: 0 },
    stats: {
      str: 11,
      dex: 1,
      int: 1,
      vit: 0,
      cun: 0,
      hp: 100,
      mp: 0,
      hpMax: 30,
      mpMax: 0
    },
    resistances: {
      slash: 40,
      crush: 25,
      pierce: 40,
      magic: 45,
      dark: 45,
      divine: 45,
      fire: 0,
      lightning: -25,
      ice: 0
    },
    statusResistances: {
      poison: 0,
      burning: -25,
      curse: 0,
      stun: 0,
      bleed: 50
    },
    damages: {
      slash: 9
    },
    hit: {
      chance: 75,
      evasion: 15
    },
    scale: 1.1,
    threat: 50,
    alive: true,
    xp: 200,
    sprite: "knightSwordShield",
    type: "human",
    race: "human",
    img: "resources/tiles/enemies/knight_sword_shield.png",
    aggroRange: 14,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy),
      new Ability(abilities.challenge, dummy),
      new Ability(abilities.chivalrious_blow, dummy)
    ],
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: -100,
          regenMpP: -100 
        }
      },
      {
        id: "magical_binding",
        effects: {
          mpMaxP: -100,
        }
      }
    ],
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    statsPerLevel: {
      str: 2,
      vit: 2
    },
    loot: [
      {type: "weapon", amount: [1, 1], item: "silverSword", chance: 10},
      {type: "offhand", amount: [1, 1], item: "silverShield", chance: 10},
      {type: "armor", amount: [1, 1], item: "greathelm", chance: 10},
      {type: "armor", amount: [1, 1], item: "knightArmor", chance: 10},
      {type: "armor", amount: [1, 1], item: "knightGreaves", chance: 10},
      {type: "armor", amount: [1, 1], item: "knightGauntlets", chance: 10},
      {type: "armor", amount: [1, 1], item: "knightSabatons", chance: 10},
      {type: "gold", amount: [37, 123]}
    ]
  },
  spectralKnight: {
    id: "spectralKnight",
    name: "Spectral Knight",
    cords: { x: 0, y: 0 },
    stats: {
      str: 6,
      dex: 1,
      int: 1,
      vit: 0,
      cun: 5,
      hp: 60,
      mp: 0,
      hpMax: 25,
      mpMax: 0
    },
    resistances: {
      slash: 60,
      crush: 60,
      pierce: 60,
      magic: 15,
      dark: 15,
      divine: 15,
      fire: 30,
      lightning: 30,
      ice: 30
    },
    statusResistances: {
      poison: 100,
      burning: 25,
      curse: 50,
      stun: 40,
      bleed: 100
    },
    damages: {
      slash: 5,
      dark: 5
    },
    hit: {
      chance: 60,
      evasion: 0
    },
    scale: 1.1,
    threat: 50,
    alive: true,
    xp: 220,
    sprite: "spectralKnightSwordShield",
    type: "wraith",
    race: "undead",
    img: "resources/tiles/enemies/spectral_knight_sword_shield.png",
    aggroRange: 15,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy),
      new Ability(abilities.challenge, dummy),
      new Ability(abilities.chivalrious_blow, dummy)
    ],
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: -50,
          regenMpP: -100 
        }
      },
      {
        id: "magical_binding",
        effects: {
          mpMaxP: -100,
        }
      }
    ],
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    statsPerLevel: {
      str: 2,
      vit: 1,
      cun: 1
    },
    loot: [
      {type: "weapon", amount: [1, 1], item: "silverSword", chance: 10},
      {type: "offhand", amount: [1, 1], item: "silverShield", chance: 10},
      {type: "armor", amount: [1, 1], item: "greathelm", chance: 10},
      {type: "armor", amount: [1, 1], item: "knightArmor", chance: 10},
      {type: "armor", amount: [1, 1], item: "knightGreaves", chance: 10},
      {type: "armor", amount: [1, 1], item: "knightGauntlets", chance: 10},
      {type: "armor", amount: [1, 1], item: "knightSabatons", chance: 10},
      {type: "gold", amount: [37, 123]}
    ]
  },
  soulWraith: {
    id: "soulWraith",
    name: "Soul Wraith",
    cords: { x: 0, y: 0 },
    stats: {
      str: 0,
      dex: 10,
      int: 20,
      vit: 0,
      cun: 10,
      hp: 125,
      mp: 60,
      hpMax: 75,
      mpMax: 60
    },
    resistances: {
      slash: 45,
      crush: 45,
      pierce: 45,
      magic: 30,
      dark: 75,
      divine: -50,
      fire: 15,
      lightning: 15,
      ice: 45
    },
    statusResistances: {
      poison: 50,
      burning: -25,
      curse: 100,
      stun: 25,
      bleed: 50
    },
    damages: {
      slash: 7,
      dark: 9,
      magic: 3
    },
    hit: {
      chance: 95,
      evasion: 45
    },
    threat: 90,
    alive: true,
    xp: 800,
    sprite: "soulWraith",
    type: "skeleton",
    race: "undead",
    img: "resources/tiles/enemies/soul_wraith.png",
    aggroRange: 17,
    attackRange: 1,
    canFly: false,
    scale: 1.1,
    abilities: [
      new Ability(abilities.attack, dummy),
      new Ability(abilities.blight, dummy),
      new Ability(abilities.piercing_mana_bolt, dummy),
      new Ability(abilities.reap, dummy),
    ],
    statModifiers: [
      {
        id: "enemy_regen_modifiers",
        effects: {
          regenHpP: -50,
          regenMpP: -50 
        }
      },
      {
        id: "attack_normally_sometimes",
        effects: {
          piercing_mana_bolt_cooldownV: 4
        }
      }
    ],
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    statsPerLevel: {
      str: 3,
      vit: 1
    },
    loot:[
      {type: "gold", amount: [288, 541]}
    ]
  },
} as any;