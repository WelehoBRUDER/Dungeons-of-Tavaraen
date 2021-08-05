"use strict";
const combatClasses = {
    fighterClass: {
        id: "fighterClass",
        statBonuses: {
            vitV: 3,
            strV: 2,
            resistAllV: 2,
            attack_damage_multiplier: 5
        },
        perkTree: "fighter"
    },
    barbarianClass: {
        id: "barbarianClass",
        statBonuses: {
            vitV: 1,
            strV: 4,
            hpMaxV: 10,
            attack_damage_multiplier: 8,
        },
        perkTree: "barbarian"
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
            critChanceP: 5,
            critDamageP: 12
        },
        perkTree: "rogue"
    }
};
class combatClass {
    constructor(base) {
        this.id = base.id;
        const baseClass = combatClasses[this.id];
        this.statBonuses = baseClass.statBonuses;
        this.perkTree = baseClass.perkTree;
    }
}
//# sourceMappingURL=combatClasses.js.map