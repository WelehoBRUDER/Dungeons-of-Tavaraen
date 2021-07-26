"use strict";
const perksArray = {
    sorcerer: {
        id: "sorcerer_perks",
        name: "Sorcerer",
        perks: {
            introduction_to_sorcery: {
                id: "introduction_to_sorcery",
                name: "Introduction to Sorcery",
                desc: "",
                effects: {
                    mpMaxV: 5,
                    intV: 1
                },
                commands: {
                    add_ability_piercing_mana_bolt: 1
                },
                tree: "sorcerer",
                pos: { x: 6.5, y: 1 },
                icon: "resources/icons/wisdom.png"
            },
            intent_studies: {
                id: "intent_studies",
                name: "Intent Studies",
                desc: "",
                effects: {
                    mpMaxV: 8,
                    intV: 1,
                    piercing_mana_bolt_mana_costV: -2
                },
                tree: "sorcerer",
                relative_to: "introduction_to_sorcery",
                requires: ["introduction_to_sorcery"],
                pos: { x: 0, y: 2 },
                icon: "resources/icons/wisdom.png"
            },
        }
    },
    necromancer: {
        id: "necromancer_perks",
        name: "Necromancer",
        perks: {
            pursuit_of_undeath: {
                id: "pursuit_of_undeath",
                name: "Pursuit of Undeath",
                desc: "",
                effects: {
                    hpMaxV: 10,
                    strV: 1,
                    intV: 2
                },
                commands: {
                    add_ability_focus_strike: 1
                },
                tree: "necromancer",
                pos: { x: 7.5, y: 1 },
                icon: "resources/icons/berserk.png"
            },
            pursuit_of_undeath_2: {
                id: "pursuit_of_undeath_2",
                name: "Pursuit of Undeath II",
                desc: "",
                effects: {
                    hpMaxV: 10,
                    strV: 1,
                    intV: 2
                },
                tree: "necromancer",
                pos: { x: -2, y: 3 },
                relative_to: "pursuit_of_undeath",
                requires: ["pursuit_of_undeath"],
                icon: "resources/icons/berserk.png"
            },
            pursuit_of_undeath_3: {
                id: "pursuit_of_undeath_3",
                name: "Pursuit of Undeath III",
                desc: "",
                effects: {
                    hpMaxV: 10,
                    strV: 1,
                    intV: 2
                },
                tree: "necromancer",
                pos: { x: 2, y: 3 },
                relative_to: "pursuit_of_undeath",
                requires: ["pursuit_of_undeath"],
                icon: "resources/icons/berserk.png"
            },
            pursuit_of_undeath_4: {
                id: "pursuit_of_undeath_4",
                name: "Pursuit of Undeath IV",
                desc: "",
                effects: {
                    hpMaxV: 10,
                    strV: 1,
                    intV: 2
                },
                tree: "necromancer",
                pos: { x: 2, y: 3 },
                relative_to: "pursuit_of_undeath_2",
                requires: ["pursuit_of_undeath_2", "pursuit_of_undeath_3"],
                icon: "resources/icons/berserk.png"
            },
            pursuit_of_undeath_5: {
                id: "pursuit_of_undeath_5",
                name: "Pursuit of Undeath V",
                desc: "",
                effects: {
                    hpMaxV: 10,
                    strV: 1,
                    intV: 2
                },
                tree: "necromancer",
                pos: { x: 3, y: 1 },
                relative_to: "pursuit_of_undeath_4",
                requires: ["pursuit_of_undeath_4"],
                icon: "resources/icons/berserk.png"
            },
            pursuit_of_undeath_6: {
                id: "pursuit_of_undeath_6",
                name: "Pursuit of Undeath VI",
                desc: "",
                effects: {
                    hpMaxV: 10,
                    strV: 1,
                    intV: 2
                },
                tree: "necromancer",
                pos: { x: 1, y: -2 },
                relative_to: "pursuit_of_undeath_5",
                requires: ["pursuit_of_undeath_5"],
                icon: "resources/icons/berserk.png"
            }
        }
    }
};
var lang = finnish;
//# sourceMappingURL=perks.js.map