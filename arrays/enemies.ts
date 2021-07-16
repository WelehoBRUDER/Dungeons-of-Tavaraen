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
    aggroRange: 9,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy)
    ],
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
    aggroRange: 11,
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
    aggroRange: 13,
    attackRange: 11,
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
      slash: 7,
      pierce: 2
    },
    alive: true,
    xp: 30,
    sprite: "norsemanBerserk",
    aggroRange: 13,
    attackRange: 1,
    canFly: false,
    abilities: [
      new Ability(abilities.attack, dummy)
    ],
    statModifiers: [
      {
        id: "simple_fights",
        effects: {
          attack_damage_multiplier: 25,
          damageP: -25
        }
      }
    ],
    loot: [
      {type: "weapon", amount: [1, 1], item: "chippedBlade", chance: 100},
      {type: "weapon", amount: [1, 1], item: "stick", chance: 100},
      {type: "weapon", amount: [1, 1], item: "longsword", chance: 100}
    ]
  },
};