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
        color: "#5e2813",
        perkTree: "fighter",
        icon: "resources/icons/fighter_symbol.png"
    },
    barbarianClass: {
        id: "barbarianClass",
        statBonuses: {
            vitV: 1,
            strV: 4,
            hpMaxV: 10,
            attack_damage_multiplier: 8,
        },
        color: "#5c2323",
        perkTree: "barbarian",
        icon: "resources/icons/barbarian_symbol.png"
    },
    sorcererClass: {
        id: "sorcererClass",
        statBonuses: {
            intV: 3,
            dexV: 2,
            mpMaxV: 5,
            mpMaxP: 5
        },
        color: "#183952",
        perkTree: "sorcerer",
        icon: "resources/icons/sorcerer_symbol.png"
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
        color: "#2b2b2b",
        perkTree: "rogue",
        icon: "resources/icons/rogue_symbol.png"
    }
};
class combatClass {
    constructor(base) {
        this.id = base.id;
        const baseClass = combatClasses[this.id];
        this.statBonuses = baseClass.statBonuses;
        this.color = baseClass.color;
        this.icon = baseClass.icon;
        this.perkTree = baseClass.perkTree;
    }
}
//# sourceMappingURL=combatClasses.js.map