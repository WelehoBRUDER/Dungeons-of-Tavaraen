const combatClasses = {
  fighterClass: {
    id: "fighterClass",
    statBonuses: {
      vitV: 3,
      meleeDamageP: 10,
      rangedDamageP: -10
    },
    color: "#5e2813",
    perkTree: "fighter",
    icon: "resources/icons/fighter_symbol.png"
  },
  barbarianClass: {
    id: "barbarianClass",
    statBonuses: {
      strV: 3,
      meleeDamageP: 10,
      rangedDamageP: -10
    },
    color: "#5c2323",
    perkTree: "barbarian",
    icon: "resources/icons/barbarian_symbol.png"
  },
  sorcererClass: {
    id: "sorcererClass",
    statBonuses: {
      intV: 3,
      spellDamageP: 10,
      meleeDamageP: -10,
      hpMaxP: -25
    },
    color: "#183952",
    perkTree: "sorcerer",
    icon: "resources/icons/sorcerer_symbol.png"
  },
  rogueClass: {
    id: "rogueClass",
    statBonuses: {
      cunV: 3,
      rangedDamageP: 5,
      meleeDamageP: 5,
      hpMaxP: -10
    },
    color: "#2b2b2b",
    perkTree: "rogue",
    icon: "resources/icons/rogue_symbol.png"
  },
  rangerClass: {
    id: "rangerClass",
    statBonuses: {
      dexV: 3,
      rangedDamageP: 10,
      meleeDamageP: -5,
      hpMaxP: -20
    },
    color: "#19400a",
    perkTree: "ranger",
    icon: "resources/icons/ornate_ranger_bow.png"
  }
} as any;

class combatClass {
  [id: string]: string | any;
  statBonuses: statModifiers;
  color: string;
  icon: string;
  perkTree: string;
  constructor(base: combatClass) {
    this.id = base.id;
    const baseClass = combatClasses[this.id];
    this.statBonuses = baseClass.statBonuses;
    this.color = baseClass.color;
    this.icon = baseClass.icon;
    this.perkTree = baseClass.perkTree;
  }
}