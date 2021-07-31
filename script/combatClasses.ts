const combatClasses = {
  fighterClass: {
    id: "fighterClass",
    statBonuses: {
      vitV: 3,
      strV: 2,
      hpMaxV: 10,
      attack_damage_multiplier: 5
    },
    perkTree: "fighter"
  },
  sorcererClass: {
    id: "sorcererClass",
    statBonuses: {
      intV: 3,
      dexV: 2,
      mpMaxV: 5,
      mpMaxP: 5
    },
    perkTree: "sorcerer"
  },
  rogueClass: {
    id: "rogueClass",
    statBonuses: {
      cunV: 3,
      dexV: 2,
      hpMaxV: 5,
      mpMaxV: 2,
      critChanceP: 2.5
    },
    perkTree: "rogue"
  }
} as any;

class combatClass {
  [id: string]: string | any;
  statBonuses: statModifiers;
  perkTree: string;
  constructor(base: combatClass) {
    this.id = base.id;
    const baseClass = combatClasses[this.id];
    this.statBonuses = baseClass.statBonuses;
    this.perkTree = baseClass.perkTree;
  }
}