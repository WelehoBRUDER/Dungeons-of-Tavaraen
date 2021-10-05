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
      mpMax: 0
    },
    resistances: {
      slash: 70,
      crush: -10,
      pierce: 55,
      magic: 10,
      dark: 20,
      divine: -50,
      fire: -20,
      lightning: 20,
      ice: 20
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
    statModifiers: [
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
      slash: 70,
      crush: -15,
      pierce: 60,
      magic: 65,
      dark: 75,
      divine: -40,
      fire: -25,
      lightning: 20,
      ice: 20
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
    statModifiers: [
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
    statModifiers: [
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
      divine: -340,
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
    statModifiers: [
      {
        id: "inanimate_object",
        effects: {
          mpMaxP: -100,
        }
      }
    ],
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    statsPerLevel: {
      str: 0,
      dex: 0,
      vit: 0
    },
  },
}