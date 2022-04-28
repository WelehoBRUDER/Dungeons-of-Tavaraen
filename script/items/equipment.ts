const equipmentSlots = ["chest", "legs", "gloves", "boots", "helmet", "weapon", "offhand", "artifact1", "artifact2", "artifact3"] as Array<string>;

const grade_vals = {
  common: 10,
  uncommon: 20,
  rare: 30,
  mythical: 40,
  legendary: 50
} as any;

const damageCategories: any = {
  slash: "physical",
  crush: "physical",
  pierce: "physical",
  magic: "magical",
  dark: "magical",
  divine: "magical",
  fire: "elemental",
  lightning: "elemental",
  ice: "elemental"
};

const dmgWorths = {
  slash: 0.5,
  crush: 0.5,
  pierce: 0.6,
  magic: 1,
  dark: 1.5,
  divine: 1.5,
  fire: 1.25,
  lightning: 1.25,
  ice: 1.25
} as any;

const statWorths = {
  strV: 10,
  strP: 7.5,
  vitV: 10,
  vitP: 7.5,
  dexV: 10,
  dexP: 7.5,
  intV: 10,
  intP: 7.5,
  cunV: 10,
  cunP: 7.5,
  hpMaxV: 2,
  hpMaxP: 3.5,
  mpMaxV: 5,
  mpMaxP: 4.5,
} as any;


const gradeStatMultis = {
  common: 1,
  uncommon: 1.25,
  rare: 1.5,
  mythical: 1.75,
  legendary: 2
} as any;


// Artifact stat generation has been reintroduced.
const artifactStatRandomization = {
  str: {
    id: "str",
    Value: [1, 2, 3, 4, 5],
    Percent: [2, 3, 6, 8, 10, 13],
    chance: 10
  },
  dex: {
    id: "dex",
    Value: [1, 2, 3, 4, 5],
    Percent: [2, 3, 6, 8, 10, 13],
    chance: 10
  },
  vit: {
    id: "vit",
    Value: [1, 2, 3, 4, 5],
    Percent: [2, 3, 6, 8, 10, 13],
    chance: 10
  },
  int: {
    id: "int",
    Value: [1, 2, 3, 4, 5],
    Percent: [2, 3, 6, 8, 10, 13],
    chance: 10
  },
  cun: {
    id: "cun",
    Value: [1, 2, 3, 4, 5],
    Percent: [2, 3, 6, 8, 10, 13],
    chance: 10
  },
  hpMax: {
    id: "hpMax",
    Value: [4, 7, 10, 14, 17],
    Percent: [2, 3, 6, 8, 10, 13],
    chance: 7
  },
  mpMax: {
    id: "mpMax",
    Value: [3, 5, 6, 9],
    Percent: [2, 3, 6, 8, 10, 13],
    chance: 7
  },
  critChance: {
    id: "critChance",
    Percent: [1, 1.5, 2, 2.5, 3, 3.5, 4.1],
    disableValue: true,
    chance: 5
  },
  critDamage: {
    id: "critDamage",
    Percent: [2, 3.3, 4.7, 5.6, 7.4, 9.3, 10],
    disableValue: true,
    chance: 5
  },
  evasion: {
    id: "evasion",
    disablePercent: true,
    Value: [1, 2, 3, 4, 5, 6],
    chance: 6
  },
  rangedDamage: {
    id: "rangedDamage",
    disableValue: true,
    Percent: [0.5, 1.5, 2.7, 3.8, 4.5, 5],
    chance: 3
  },
  meleeDamage: {
    id: "meleeDamage",
    disableValue: true,
    Percent: [0.5, 1.5, 2.7, 3.8, 4.5, 5],
    chance: 3
  },
  spellDamage: {
    id: "spellDamage",
    disableValue: true,
    Percent: [0.5, 1.5, 2.7, 3.8, 4.5, 5],
    chance: 3
  },
  resistAll: {
    id: "resistAll",
    Value: [1, 2, 3, 4, 5],
    Percent: [1.5, 3, 4.5, 6, 7.5],
    chance: 2
  },
  movementSpeed: {
    id: "movementSpeed",
    disablePercent: true,
    Value: [2, 5, 7, 8, 10, 12, 13, 14, 15, 16],
    chance: 3
  },
  attackSpeed: {
    id: "attackSpeed",
    disablePercent: true,
    Value: [2, 5, 7, 8, 10, 12, 13, 14, 15, 16],
    chance: 3
  },
} as any;

const equipmentStatRandomization = {
  damage: {
    slash: {
      id: "slash",
      Value: [-3, -1, 1, 2, 3, 4, 5],
      chance: 8
    },
    crush: {
      id: "crush",
      Value: [-3, -1, 1, 2, 3, 4, 5],
      chance: 8
    },
    pierce: {
      id: "pierce",
      Value: [-3, -1, 1, 2, 3, 4, 5],
      chance: 8
    },
    magic: {
      id: "magic",
      Value: [-3, -1, 1, 2, 3, 4, 5],
      chance: 8
    },
    dark: {
      id: "dark",
      Value: [-2, -1, 1, 2, 3, 4, 5],
      chance: 8
    },
    divine: {
      id: "divine",
      Value: [-2, -1, 1, 2, 3, 4, 5],
      chance: 8
    },
    fire: {
      id: "fire",
      Value: [-2, -1, 1, 2, 3, 4, 5],
      chance: 8
    },
    lightning: {
      id: "lightning",
      Value: [-2, -1, 1, 2, 3, 4, 5],
      chance: 8
    },
    ice: {
      id: "ice",
      Value: [-2, -1, 1, 2, 3, 4, 5],
      chance: 8
    },
  },
  armor: {
    physical: {
      id: "physical",
      Value: [-4, -2, 2, 4, 6, 8],
      chance: 20
    },
    magical: {
      id: "magical",
      Value: [-4, -2, 2, 4, 6, 8],
      chance: 20
    },
    elemental: {
      id: "elemental",
      Value: [-4, -2, 2, 4, 6, 8],
      chance: 20
    }
  },
  side: {
    str: {
      id: "str",
      Value: [-2, -1, 1, 2, 3, 4, 5],
      Percent: [-4, -2, 2, 3, 6, 8, 10, 13],
      chance: 10
    },
    dex: {
      id: "dex",
      Value: [-2, -1, 1, 2, 3, 4, 5],
      Percent: [-4, -2, 2, 3, 6, 8, 10, 13],
      chance: 10
    },
    vit: {
      id: "vit",
      Value: [-2, -1, 1, 2, 3, 4, 5],
      Percent: [-4, -2, 2, 3, 6, 8, 10, 13],
      chance: 10
    },
    int: {
      id: "int",
      Value: [-2, -1, 1, 2, 3, 4, 5],
      Percent: [-4, -2, 2, 3, 6, 8, 10, 13],
      chance: 10
    },
    cun: {
      id: "cun",
      Value: [-2, -1, 1, 2, 3, 4, 5],
      Percent: [-4, -2, 2, 3, 6, 8, 10, 13],
      chance: 10
    },
    hpMax: {
      id: "hpMax",
      Value: [-5, -2, 4, 7, 10, 14, 17],
      Percent: [-6, -3, 2, 3, 6, 8, 10, 13],
      chance: 7
    },
    mpMax: {
      id: "mpMax",
      Value: [-5, -2, 3, 5, 6, 9],
      Percent: [-6, -3, 2, 3, 6, 8, 10, 13],
      chance: 7
    },
    critChance: {
      id: "critChance",
      Percent: [-1.5, -0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4.1],
      disableValue: true,
      chance: 5
    },
    critDamage: {
      id: "critDamage",
      Percent: [-2, -1, 2, 3.3, 4.7, 5.6, 7.4, 9.3, 10],
      disableValue: true,
      chance: 5
    },
    movementSpeed: {
      id: "movementSpeed",
      disablePercent: true,
      Value: [-5, -2, 2, 5, 7, 8, 10, 12, 13, 14, 15, 16],
      chance: 3
    },
    evasion: {
      id: "evasion",
      disablePercent: true,
      Value: [-2, -1, 1, 2, 3, 4, 5, 6],
      chance: 6
    },
    rangedDamage: {
      id: "rangedDamage",
      disableValue: true,
      Percent: [-1.5, -0.7, 0.5, 1.5, 2.7, 3.8, 4.5, 5],
      chance: 3
    },
    meleeDamage: {
      id: "meleeDamage",
      disableValue: true,
      Percent: [-1.5, -0.7, 0.5, 1.5, 2.7, 3.8, 4.5, 5],
      chance: 3
    },
    spellDamage: {
      id: "spellDamage",
      disableValue: true,
      Percent: [-1.5, -0.7, 0.5, 1.5, 2.7, 3.8, 4.5, 5],
      chance: 3
    },
    resistAll: {
      id: "resistAll",
      Value: [-2, -1, 1, 2, 3, 4, 5],
      Percent: [-3, -1, 1.5, 3, 4.5, 6, 7.5],
      chance: 2
    },
    attackSpeed: {
      id: "attackSpeed",
      disablePercent: true,
      Value: [-5, -2, 2, 5, 7, 8, 10, 12, 13, 14, 15, 16],
      chance: 3
    },
  }
} as any;

const maxStatsForArtifactsToRoll = {
  uncommon: 4
} as any;

// Main: for weapons damage, for armor, well armor.
// Side: any random stat effect.
const maxStatsForEquipmentToRoll = {
  common: { main: 1, side: 1 },
  uncommon: { main: 1, side: 2 },
  rare: { main: 2, side: 3 },
  mythical: { main: 3, side: 3 },
  legendary: { main: 3, side: 4 }
} as any;

const equipSlots = [
  "weapon",
  "offhand",
  "helmet",
  "chest",
  "gloves",
  "boots",
  "legs",
  "artifact1",
  "artifact2",
  "artifact3"
];

const artifactSets = {
  defender: {
    id: "defender",
    twoPieceEffect: {
      hpMaxP: 10
    },
    threePieceEffect: {
      resistAllV: 10
    }
  },
  scholar: {
    id: "scholar",
    twoPieceEffect: {
      mpMaxP: 10
    },
    threePieceEffect: {
      intV: 5,
      spellDamageP: 10
    }
  },
  warrior: {
    id: "warrior",
    twoPieceEffect: {
      meleeDamageP: 10
    },
    threePieceEffect: {
      hitChanceV: 10,
      hpMaxP: 5
    }
  },
  loneShade: {
    id: "loneShade",
    twoPieceEffect: {
      evasionV: 3,
      hitChanceV: 3,
      critDamageP: 2.5
    },
    threePieceEffect: {
      evasionV: 2,
      hitChanceV: 2,
      critChanceP: 5,
      critDamageP: 7.5,
      dexV: 2
    }
  },
  hunter: {
    id: "hunter",
    twoPieceEffect: {
      rangedDamageP: 5,
      sightV: 1
    },
    threePieceEffect: {
      rangedDamageP: 5,
      hpMaxV: 5,
      all_summons_damageP: 10,
      all_summons_regenHpP: 10
    }
  }
} as any;