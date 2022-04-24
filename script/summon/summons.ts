const summons = {
  skeletonWarriorSummon: {
    id: "skeletonWarriorSummon",
    name: "Summoned Skeleton Warrior",
    cords: { x: 0, y: 0 },
    stats: {
      str: 5,
      dex: 1,
      int: 1,
      vit: 0,
      cun: 0,
      hp: 20,
      mp: 0,
      hpMax: 20,
      mpMax: 0,

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
      slash: 4
    },
    hit: {
      chance: 45,
      evasion: 25
    },
    threat: 30,
    alive: true,
    sprite: "skeletonWarrior",
    type: "skeleton",
    race: "undead",
    img: "resources/tiles/enemies/skeleton_warrior.png",
    aggroRange: 9,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy)
    ],
    traits: [
      {
        id: "magically_impotent",
      }
    ],
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    statsPerLevel: {
      str: 2,
      dex: 1,
      vit: 1
    },
  },
  skeletonLichSummon: {
    id: "skeletonLichSummon",
    name: "Skeleton Lich Summon",
    cords: { x: 0, y: 0 },
    stats: {
      str: 3,
      dex: 10,
      int: 10,
      vit: 0,
      cun: 0,
      hp: 40,
      mp: 75,
      hpMax: 40,
      mpMax: 75
    },
    resistances: {
      slash: 45,
      crush: 15,
      pierce: 45,
      magic: 30,
      dark: 25,
      divine: -50,
      fire: 0,
      lightning: 0,
      ice: 0
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
    threat: 30,
    alive: true,
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
    traits: [
      {
        id: "weaker_natural_ability",
      }
    ],
    statsPerLevel: {
      dex: 2,
      int: 2,
      vit: 1
    },
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
  },
  stoneTrollSummon: {
    id: "stoneTrollSummon",
    name: "Stone Troll Summon",
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
      crush: 13,
    },
    threat: 40,
    type: "troll",
    race: "monster",
    alive: true,
    sprite: "stoneTroll",
    img: "resources/tiles/enemies/stone_troll.png",
    aggroRange: 11,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy)
    ],
    traits: [
      {
        id: "magically_impotent",
      }
    ],
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    statsPerLevel: {
      str: 4,
      dex: 0,
      vit: 4
    },
  },
  dummyTarget: {
    id: "dummyTarget",
    name: "Target Dummy",
    cords: { x: 0, y: 0 },
    stats: {
      str: 0,
      dex: 0,
      int: 0,
      vit: 0,
      cun: 0,
      hp: 10,
      mp: 0,
      hpMax: 10,
      mpMax: 0
    },
    resistances: {
      slash: 340,
      crush: 340,
      pierce: 340,
      magic: 340,
      dark: 340,
      divine: 340,
      fire: 340,
      lightning: 340,
      ice: 340
    },
    statusResistances: {
      poison: 100,
      burning: 100,
      curse: 100,
      stun: 100,
      bleed: 100
    },
    damages: {
      crush: 0
    },
    hit: {
      chance: 0,
      evasion: 0
    },
    threat: 75,
    alive: true,
    sprite: "dummyModel",
    type: "dummy",
    race: "construct",
    img: "resources/tiles/dummy.png",
    aggroRange: 0,
    attackRange: 1,
    canFly: false,
    abilities: [] as any,
    traits: [
      {
        id: "magically_impotent",
      }
    ],
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    statsPerLevel: {
      str: 0,
      dex: 0,
      vit: 0
    },
  },
  arrowTotem: {
    id: "arrowTotem",
    name: "Arrow Totem",
    cords: { x: 0, y: 0 },
    stats: {
      str: 0,
      dex: 0,
      int: 0,
      vit: 0,
      cun: 0,
      hp: 25,
      mp: 0,
      hpMax: 25,
      mpMax: 0
    },
    resistances: {
      slash: 50,
      crush: 50,
      pierce: 50,
      magic: 50,
      dark: 50,
      divine: 50,
      fire: -100,
      lightning: 50,
      ice: 50
    },
    statusResistances: {
      poison: 100,
      burning: -100,
      curse: 100,
      stun: 100,
      bleed: 100
    },
    damages: {
      pierce: 5
    },
    hit: {
      chance: 50,
      evasion: 0
    },
    threat: 12,
    alive: true,
    sprite: "arrowTotem",
    type: "totem",
    race: "construct",
    img: "resources/tiles/totem_sample.png",
    aggroRange: 12,
    attackRange: 12,
    shootsProjectile: "arrowProjectile",
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy),
    ],
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    statsPerLevel: {
      dex: 3,
      vit: 2
    },
  },
  rangerWolf: {
    id: "rangerWolf",
    name: "Ranger's Wolf Companion",
    cords: { x: 0, y: 0 },
    stats: {
      str: 8,
      dex: 6,
      int: 3,
      vit: 2,
      cun: 5,
      hp: 30,
      mp: 0,
      hpMax: 30,
      mpMax: 0,

    },
    resistances: {
      slash: 15,
      crush: 20,
      pierce: 15,
      magic: 0,
      dark: 0,
      divine: 0,
      fire: -20,
      lightning: 0,
      ice: 30
    },
    statusResistances: {
      poison: 0,
      burning: -20,
      curse: 0,
      stun: 0,
      bleed: 0
    },
    damages: {
      pierce: 4,
      crush: 2
    },
    hit: {
      chance: 60,
      evasion: 30
    },
    threat: 20,
    alive: true,
    sprite: "wolfGrey",
    type: "canine",
    race: "animal",
    img: "resources/tiles/enemies/wolf.png",
    aggroRange: 11,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy)
    ],
    traits: [
      {
        id: "magically_impotent",
      }
    ],
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    statsPerLevel: {
      str: 2,
      dex: 1,
      vit: 1,
      cun: 1
    },
  },
} as any;