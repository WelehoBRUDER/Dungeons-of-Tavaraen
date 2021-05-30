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
  }
};