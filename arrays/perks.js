"use strict";
const perksArray = {
    necromancer: {
        id: "necromancer_perks",
        name: "Necromancer",
        perks: {
            pursuit_of_undeath: {
                id: "pursuit_of_undeath",
                name: "Pursuit of Undeath",
                desc: "",
                effects: {
                    hpV: 10,
                    strV: 1,
                    intV: 2
                },
                pos: { x: 7.5, y: 1 },
                icon: "resources/icons/berserk.png"
            },
            pursuit_of_undeath_2: {
                id: "pursuit_of_undeath_2",
                name: "Pursuit of Undeath II",
                desc: "",
                effects: {
                    hpV: 10,
                    strV: 1,
                    intV: 2
                },
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
                    hpV: 10,
                    strV: 1,
                    intV: 2
                },
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
                    hpV: 10,
                    strV: 1,
                    intV: 2
                },
                pos: { x: 2, y: 3 },
                relative_to: "pursuit_of_undeath_2",
                requires: ["pursuit_of_undeath_2", "pursuit_of_undeath_3"],
                icon: "resources/icons/berserk.png"
            },
            pursuit_of_undeath_5: {
                id: "pursuit_of_undeath_5",
                name: "Pursuit of Undeath IV",
                desc: "",
                effects: {
                    hpV: 10,
                    strV: 1,
                    intV: 2
                },
                pos: { x: -2, y: 3 },
                relative_to: "pursuit_of_undeath_4",
                requires: ["pursuit_of_undeath_4"],
                icon: "resources/icons/berserk.png"
            },
            pursuit_of_undeath_6: {
                id: "pursuit_of_undeath_6",
                name: "Pursuit of Undeath IV",
                desc: "",
                effects: {
                    hpV: 10,
                    strV: 1,
                    intV: 2
                },
                pos: { x: -3, y: -4 },
                relative_to: "pursuit_of_undeath_5",
                requires: ["pursuit_of_undeath_5"],
                icon: "resources/icons/berserk.png"
            }
        }
    }
};
