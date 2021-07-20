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
    xp: 5,
    abilities: []
  });

// @ts-expect-error
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
      slash: 60,
      crush: 60,
      pierce: 60,
      dark: 10,
      divine: 10,
      fire: -20,
      lightning: -20,
      ice: -20
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
    alive: true,
    xp: 5,
    sprite: "greySlime",
    img: "resources/tiles/enemies/grey_slime.png",
    aggroRange: 7,
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
    loot: []
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
      hp: 15,
      mp: 0,
      hpMax: 15,
      mpMax: 0
    },
    resistances: {
      slash: 70,
      crush: -10,
      pierce: 55,
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
      slash: 3
    },
    alive: true,
    xp: 5,
    sprite: "skeletonWarrior",
    img: "resources/tiles/enemies/skeleton_warrior.png",
    aggroRange: 10,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy)
    ],
    statModifiers: [
      {
        id: "magical_binding",
        effects: {
          mpMaxP: -100
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
      {type: "weapon", amount: [1, 1], item: "chippedBlade", chance: 100},
      {type: "weapon", amount: [1, 1], item: "stick", chance: 100},
      {type: "weapon", amount: [1, 1], item: "longsword", chance: 100}
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
      hp: 12,
      mp: 0,
      hpMax: 12,
      mpMax: 0
    },
    resistances: {
      slash: 70,
      crush: -15,
      pierce: 60,
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
      pierce: 4
    },
    alive: true,
    xp: 5,
    sprite: "skeletonArcher",
    img: "resources/tiles/enemies/skeleton_archer.png",
    aggroRange: 9,
    attackRange: 8,
    canFly: false,
    shootsProjectile: "arrowProjectile",
    abilities: [
      new Ability(abilities.attack, dummy)
    ],
    statModifiers: [
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
      {type: "weapon", amount: [1, 1], item: "chippedBlade", chance: 100},
      {type: "weapon", amount: [1, 1], item: "stick", chance: 100},
      {type: "weapon", amount: [1, 1], item: "longsword", chance: 100}
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
      slash: 70,
      crush: -15,
      pierce: 60,
      dark: 40,
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
      pierce: 4
    },
    alive: true,
    xp: 10,
    sprite: "skeletonMage",
    img: "resources/tiles/enemies/skeleton_mage.png",
    aggroRange: 9,
    attackRange: 7,
    canFly: false,
    shootsProjectile: "blightProjectile",
    abilities: [
      new Ability(abilities.attack, dummy),
      new Ability(abilities.blight, dummy)
    ],
    statModifiers: [],
    statsPerLevel: {
      dex: 1,
      int: 2,
      vit: 1
    },
    retreatLimit: 0, // when enemy has this % hp left, it runs away from the player once.
    loot: [
      {type: "weapon", amount: [1, 1], item: "chippedBlade", chance: 100},
      {type: "weapon", amount: [1, 1], item: "stick", chance: 100},
      {type: "weapon", amount: [1, 1], item: "longsword", chance: 100}
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
    retreatLimit: 25, // when enemy has this % hp left, it runs away from the player once.
    alive: true,
    xp: 30,
    sprite: "norsemanBerserk",
    img: "resources/tiles/enemies/norseman_berserk.png",
    aggroRange: 10,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy),
      new Ability(abilities.charge, dummy),
    ],
    statModifiers: [],
    statsPerLevel: {
      str: 2,
      vit: 2,
      cun: 1
    },
    loot: [
      {type: "weapon", amount: [1, 1], item: "chippedBlade", chance: 100},
      {type: "weapon", amount: [1, 1], item: "stick", chance: 100},
      {type: "weapon", amount: [1, 1], item: "longsword", chance: 100}
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
    retreatLimit: 25, // when enemy has this % hp left, it runs away from the player once.
    alive: true,
    xp: 30,
    sprite: "norsemanHunter",
    img: "resources/tiles/enemies/norseman_hunter.png",
    aggroRange: 10,
    attackRange: 6,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy),
    ],
    statModifiers: [],
    statsPerLevel: {
      dex: 2,
      vit: 1,
      cun: 2
    },
    shootsProjectile: "hunterJavelinProjectile",
    loot: [
      {type: "weapon", amount: [1, 1], item: "chippedBlade", chance: 100},
      {type: "weapon", amount: [1, 1], item: "stick", chance: 100},
      {type: "weapon", amount: [1, 1], item: "longsword", chance: 100}
    ]
  },
};