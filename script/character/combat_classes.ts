const combatClasses = {
  fighterClass: {
    id: "fighterClass",
    statBonuses: {
      vitV: 3,
      meleeDamageP: 10,
      rangedDamageP: -10,
      hpMaxPerLevelV: 5,
    },
    levelBonuses: {
      // These increase per level invested in the class
      vitV: 1,
      meleeDamageP: 2,
    },
    color: "#5e2813",
    perkTree: "fighter",
    icon: "resources/icons/fighter_symbol.png",
  },
  barbarianClass: {
    id: "barbarianClass",
    statBonuses: {
      strV: 3,
      meleeDamageP: 10,
      rangedDamageP: -10,
      hpMaxPerLevelV: 3,
    },
    levelBonuses: {
      // These increase per level invested in the class
      strV: 1,
      hpMaxV: 2,
    },
    color: "#5c2323",
    perkTree: "barbarian",
    icon: "resources/icons/barbarian_symbol.png",
  },
  paladinClass: {
    id: "paladinClass",
    statBonuses: {
      meleeDamageP: 5,
      spellDamageP: 5,
      vitV: 2,
      hpMaxP: 10,
      healPowerP: 5,
      hpMaxPerLevelV: 6,
    },
    levelBonuses: {
      vitV: 1,
      hpMaxP: 2,
    },
    color: "#fcba03",
    perkTree: "paladin",
    icon: "resources/icons/paladin_symbol.png",
  },
  sorcererClass: {
    id: "sorcererClass",
    statBonuses: {
      intV: 3,
      spellDamageP: 10,
      meleeDamageP: -10,
      hpMaxPerLevelV: -3,
    },
    levelBonuses: {
      intV: 1,
      spellDamageP: 2,
    },
    color: "#183952",
    perkTree: "sorcerer",
    icon: "resources/icons/sorcerer_symbol.png",
  },
  rogueClass: {
    id: "rogueClass",
    statBonuses: {
      cunV: 3,
      rangedDamageP: 5,
      meleeDamageP: 5,
      hpMaxPerLevelV: 1,
    },
    levelBonuses: {
      cunV: 1,
      rangedDamageP: 1,
      meleeDamageP: 1,
    },
    color: "#2b2b2b",
    perkTree: "rogue",
    icon: "resources/icons/rogue_symbol.png",
  },
  rangerClass: {
    id: "rangerClass",
    statBonuses: {
      dexV: 3,
      rangedDamageP: 10,
      meleeDamageP: -5,
      hpMaxPerLevelV: -2,
    },
    levelBonuses: {
      dexV: 1,
      rangedDamageP: 2,
    },
    color: "#19400a",
    perkTree: "ranger",
    icon: "resources/icons/ornate_ranger_bow.png",
  },
} as any;

class combatClass {
  [id: string]: string | any;
  statBonuses: traits;
  levelBonuses: traits;
  level: number;
  color: string;
  icon: string;
  perkTree: string;
  constructor(base: combatClass) {
    this.id = base.id;
    const baseClass = combatClasses[this.id];
    this.statBonuses = baseClass.statBonuses;
    this.levelBonuses = baseClass.levelBonuses;
    this.level = baseClass.level ?? 1;
    this.color = baseClass.color;
    this.icon = baseClass.icon;
    this.perkTree = baseClass.perkTree;
  }

  getLevelBonuses(options?: { addToLevel: number }) {
    const bonuses: traits = {};
    console.log(this);
    console.log("level bonuses", this.levelBonuses, this.level, options);
    Object.entries(this.levelBonuses).forEach(([key, value]) => {
      bonuses[key] = value * (this.level + (options?.addToLevel ?? 0));
    });
    return bonuses;
  }
}

function convertOldClasses(classes: any) {
  const _classes = [];
  _classes.push(new combatClass(classes.main));
  if (classes.sub) {
    _classes.push(new combatClass(classes.sub));
  }
  return _classes;
}
