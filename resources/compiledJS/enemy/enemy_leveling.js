"use strict";
/* Values don't have to add up to 100, but it's desirable. */
const enemyLevelingTemplates = {
    slime_default: [
        { stat: "str", chance: 40 },
        { stat: "vit", chance: 40 },
        { stat: "cun", chance: 20 },
    ],
    skeleton_melee: [
        { stat: "str", chance: 50 },
        { stat: "vit", chance: 30 },
        { stat: "cun", chance: 20 },
    ],
    skeleton_ranged: [
        { stat: "dex", chance: 50 },
        { stat: "vit", chance: 25 },
        { stat: "cun", chance: 25 },
    ],
    skeleton_mage: [
        { stat: "int", chance: 60 },
        { stat: "vit", chance: 20 },
        { stat: "cun", chance: 20 },
    ],
    beast_melee: [
        { stat: "str", chance: 40 },
        { stat: "vit", chance: 50 },
        { stat: "cun", chance: 10 },
    ],
    beast_ranged: [
        { stat: "dex", chance: 40 },
        { stat: "vit", chance: 50 },
        { stat: "cun", chance: 10 },
    ],
    balanced: [
        { stat: "str", chance: 20 },
        { stat: "dex", chance: 20 },
        { stat: "vit", chance: 20 },
        { stat: "int", chance: 20 },
        { stat: "cun", chance: 20 },
    ],
    berserker_melee: [
        { stat: "str", chance: 70 },
        { stat: "vit", chance: 30 },
    ],
    berserker_ranged: [
        { stat: "dex", chance: 70 },
        { stat: "vit", chance: 30 },
    ],
    bulwark: [
        { stat: "str", chance: 30 },
        { stat: "vit", chance: 70 },
    ],
    magical_melee: [
        { stat: "str", chance: 25 },
        { stat: "vit", chance: 25 },
        { stat: "int", chance: 25 },
        { stat: "cun", chance: 25 },
    ]
};
//# sourceMappingURL=enemy_leveling.js.map