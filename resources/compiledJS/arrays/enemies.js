"use strict";
// @ts-nocheck
const dummy = new Character({
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
const s_def = getAbiStatusModifiers(dummy, "", "");
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
            cun: 0,
            hp: 10,
            mp: 0,
            hpMax: 10,
            mpMax: 0
        },
        resistances: {
            slash: 30,
            crush: 30,
            pierce: 30,
            magic: 20,
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
        img: "resources/tiles/enemies/grey_slime.png",
        aggroRange: 6,
        attackRange: 1,
        canFly: false,
        abilities: [
            new Ability(abilities.attack, dummy)
        ],
        retreatLimit: 0,
        statsPerLevel: {
            str: 1,
            vit: 1
        },
        loot: [
            { type: "gold", amount: [1, 5] }
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
            cun: 0,
            hp: 15,
            mp: 0,
            hpMax: 15,
            mpMax: 0
        },
        resistances: {
            slash: 70,
            crush: -10,
            pierce: 55,
            magic: 10,
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
        img: "resources/tiles/enemies/skeleton_warrior.png",
        aggroRange: 8,
        attackRange: 1,
        canFly: false,
        abilities: [
            new Ability(abilities.attack, dummy)
        ],
        statModifiers: [
            {
                id: "magical_binding",
                effects: {
                    mpMaxP: -100,
                }
            }
        ],
        retreatLimit: 0,
        statsPerLevel: {
            str: 2,
            dex: 1,
            vit: 1
        },
        loot: [
            { type: "weapon", amount: [1, 1], item: "chippedBlade", chance: 20 },
            { type: "gold", amount: [4, 15] }
        ]
    },
    skeletonArcher: {
        id: "skeletonArcher",
        name: "Skeleton Archer",
        cords: { x: 0, y: 0 },
        stats: {
            str: 1,
            dex: 5,
            int: 1,
            vit: 0,
            cun: 0,
            hp: 12,
            mp: 0,
            hpMax: 12,
            mpMax: 0
        },
        resistances: {
            slash: 70,
            crush: -15,
            pierce: 60,
            magic: 10,
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
            pierce: 4
        },
        alive: true,
        xp: 5,
        sprite: "skeletonArcher",
        img: "resources/tiles/enemies/skeleton_archer.png",
        aggroRange: 8,
        attackRange: 7,
        canFly: false,
        shootsProjectile: "arrowProjectile",
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
        statsPerLevel: {
            str: 1,
            dex: 2,
            vit: 1
        },
        retreatLimit: 0,
        loot: [
            { type: "weapon", amount: [1, 1], item: "huntingBow", chance: 20 },
            { type: "gold", amount: [4, 15] }
        ]
    },
    skeletonMage: {
        id: "skeletonMage",
        name: "Skeleton Mage",
        cords: { x: 0, y: 0 },
        stats: {
            str: 1,
            dex: 4,
            int: 4,
            vit: 0,
            cun: 0,
            hp: 14,
            mp: 12,
            hpMax: 14,
            mpMax: 4
        },
        resistances: {
            slash: 70,
            crush: -15,
            pierce: 60,
            magic: 40,
            dark: 40,
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
            pierce: 2,
            magic: 3
        },
        alive: true,
        xp: 10,
        sprite: "skeletonMage",
        img: "resources/tiles/enemies/skeleton_mage.png",
        aggroRange: 8,
        attackRange: 6,
        canFly: false,
        shootsProjectile: "piercingManaBoltProjectile",
        abilities: [
            new Ability(abilities.attack, dummy),
            new Ability(abilities.blight, dummy),
        ],
        statModifiers: [],
        statsPerLevel: {
            dex: 1,
            int: 2,
            vit: 1
        },
        retreatLimit: 0,
        loot: [
            { type: "gold", amount: [4, 15] }
        ]
    },
    skeletonLich: {
        id: "skeletonLich",
        name: "Skeleton Lich",
        cords: { x: 0, y: 0 },
        stats: {
            str: 3,
            dex: 10,
            int: 10,
            vit: 0,
            cun: 0,
            hp: 30,
            mp: 70,
            hpMax: 30,
            mpMax: 50
        },
        resistances: {
            slash: 70,
            crush: -15,
            pierce: 60,
            magic: 65,
            dark: 75,
            divine: -40,
            fire: -25,
            lightning: 20,
            ice: 20
        },
        statusResistances: {
            poison: 100,
            burning: -25,
            curse: 50,
            stun: 0,
            bleed: 100
        },
        damages: {
            pierce: 2,
            magic: 4,
            dark: 3
        },
        alive: true,
        xp: 50,
        sprite: "skeletonLich",
        img: "resources/tiles/enemies/skeleton_lich.png",
        aggroRange: 10,
        attackRange: 9,
        canFly: false,
        shootsProjectile: "piercingManaBoltProjectile",
        abilities: [
            new Ability(abilities.attack, dummy),
            new Ability(abilities.blight, dummy),
            new Ability(abilities.fireball, dummy)
        ],
        statModifiers: [
            {
                id: "dont_spam_abilities",
                effects: {
                    blight_cooldownV: 3,
                    fireball_cooldownV: 5
                }
            }
        ],
        statsPerLevel: {
            dex: 2,
            int: 2,
            vit: 1
        },
        retreatLimit: 0,
        loot: [
            { type: "armor", amount: [1, 1], item: "crownOfWisdom", chance: 5 },
            { type: "armor", amount: [1, 1], item: "lichRobes", chance: 10 },
            { type: "gold", amount: [24, 60] }
        ]
    },
    norsemanBerserk: {
        id: "norsemanBerserk",
        name: "Norseman Berserk",
        cords: { x: 0, y: 0 },
        stats: {
            str: 15,
            dex: 8,
            int: 4,
            vit: 0,
            cun: 0,
            hp: 40,
            mp: 0,
            hpMax: 40,
            mpMax: 0
        },
        resistances: {
            slash: 0,
            crush: 5,
            pierce: 5,
            magic: -15,
            dark: 15,
            divine: 15,
            fire: 0,
            lightning: 0,
            ice: 0
        },
        statusResistances: {
            poison: 25,
            burning: 0,
            curse: 0,
            stun: 0,
            bleed: 0
        },
        damages: {
            slash: 4,
            pierce: 3
        },
        retreatLimit: 25,
        alive: true,
        xp: 30,
        sprite: "norsemanBerserk",
        img: "resources/tiles/enemies/norseman_berserk.png",
        aggroRange: 8,
        attackRange: 1,
        canFly: false,
        abilities: [
            new Ability(abilities.attack, dummy),
            new Ability(abilities.charge, dummy),
        ],
        statModifiers: [
            {
                id: "dont_spam_abilities",
                effects: {
                    charge_cooldownV: 2,
                    charge_use_rangeV: -3
                }
            }
        ],
        statsPerLevel: {
            str: 2,
            vit: 2,
            cun: 1
        },
        loot: [
            { type: "weapon", amount: [1, 1], item: "chippedAxe", chance: 15 },
            { type: "weapon", amount: [1, 1], item: "stick", chance: 20 },
            { type: "gold", amount: [6, 18] }
        ]
    },
    norsemanHunter: {
        id: "norsemanHunter",
        name: "Norseman Hunter",
        cords: { x: 0, y: 0 },
        stats: {
            str: 10,
            dex: 13,
            int: 4,
            vit: 0,
            cun: 0,
            hp: 30,
            mp: 0,
            hpMax: 30,
            mpMax: 0
        },
        resistances: {
            slash: 5,
            crush: 5,
            pierce: 5,
            magic: -15,
            dark: 15,
            divine: 15,
            fire: 0,
            lightning: 0,
            ice: 0
        },
        statusResistances: {
            poison: 25,
            burning: 0,
            curse: 0,
            stun: 0,
            bleed: 0
        },
        damages: {
            pierce: 6
        },
        retreatLimit: 25,
        alive: true,
        xp: 30,
        sprite: "norsemanHunter",
        img: "resources/tiles/enemies/norseman_hunter.png",
        aggroRange: 8,
        attackRange: 7,
        canFly: false,
        abilities: [
            new Ability(abilities.attack, dummy),
        ],
        statModifiers: [],
        statsPerLevel: {
            dex: 2,
            vit: 1,
            cun: 2
        },
        shootsProjectile: "hunterJavelinProjectile",
        loot: [
            { type: "gold", amount: [6, 18] }
        ]
    },
    wildTroll: {
        id: "wildTroll",
        name: "Wild Troll",
        cords: { x: 0, y: 0 },
        stats: {
            str: 20,
            dex: 0,
            int: 0,
            vit: 0,
            cun: 0,
            hp: 60,
            mp: 0,
            hpMax: 60,
            mpMax: 0
        },
        resistances: {
            slash: 10,
            crush: 10,
            pierce: 10,
            magic: 15,
            dark: -10,
            divine: -10,
            fire: -20,
            lightning: 0,
            ice: 0
        },
        statusResistances: {
            poison: 50,
            burning: -20,
            curse: 0,
            stun: 0,
            bleed: 50
        },
        damages: {
            crush: 4,
            slash: 4
        },
        alive: true,
        xp: 45,
        sprite: "wildTroll",
        img: "resources/tiles/enemies/wild_troll.png",
        aggroRange: 10,
        attackRange: 1,
        canFly: false,
        abilities: [
            new Ability(abilities.attack, dummy)
        ],
        statModifiers: [
            {
                id: "anti_magic",
                effects: {
                    mpMaxP: -100,
                }
            }
        ],
        retreatLimit: 0,
        statsPerLevel: {
            str: 3,
            dex: 0,
            vit: 3
        },
        loot: [
            { type: "gold", amount: [22, 44] }
        ]
    },
    wildStoneTroll: {
        id: "wildStoneTroll",
        name: "Wild Stone Troll",
        cords: { x: 0, y: 0 },
        stats: {
            str: 23,
            dex: 0,
            int: 0,
            vit: 0,
            cun: 0,
            hp: 80,
            mp: 0,
            hpMax: 80,
            mpMax: 0
        },
        resistances: {
            slash: 40,
            crush: 40,
            pierce: 40,
            magic: 5,
            dark: -10,
            divine: -10,
            fire: -10,
            lightning: 0,
            ice: 0
        },
        statusResistances: {
            poison: 50,
            burning: -10,
            curse: 0,
            stun: 0,
            bleed: 75
        },
        damages: {
            crush: 6,
            slash: 4
        },
        alive: true,
        xp: 75,
        sprite: "wildStoneTroll",
        img: "resources/tiles/enemies/wild_stone_troll.png",
        aggroRange: 11,
        attackRange: 1,
        canFly: false,
        abilities: [
            new Ability(abilities.attack, dummy)
        ],
        statModifiers: [
            {
                id: "anti_magic",
                effects: {
                    mpMaxP: -100,
                }
            }
        ],
        retreatLimit: 0,
        statsPerLevel: {
            str: 3,
            dex: 0,
            vit: 4
        },
        loot: [
            { type: "gold", amount: [22, 44] }
        ]
    },
    troll: {
        id: "troll",
        name: "Troll",
        cords: { x: 0, y: 0 },
        stats: {
            str: 25,
            dex: 0,
            int: 0,
            vit: 0,
            cun: 0,
            hp: 75,
            mp: 0,
            hpMax: 75,
            mpMax: 0
        },
        resistances: {
            slash: 5,
            crush: 5,
            pierce: 5,
            magic: 5,
            dark: -15,
            divine: -15,
            fire: -25,
            lightning: 0,
            ice: 0
        },
        statusResistances: {
            poison: 50,
            burning: -10,
            curse: 0,
            stun: 0,
            bleed: 25
        },
        damages: {
            crush: 11,
        },
        alive: true,
        xp: 60,
        sprite: "troll",
        img: "resources/tiles/enemies/troll.png",
        aggroRange: 11,
        attackRange: 1,
        canFly: false,
        abilities: [
            new Ability(abilities.attack, dummy)
        ],
        statModifiers: [
            {
                id: "anti_magic",
                effects: {
                    mpMaxP: -100,
                }
            }
        ],
        retreatLimit: 0,
        statsPerLevel: {
            str: 4,
            dex: 0,
            vit: 3
        },
        loot: [
            { type: "gold", amount: [26, 51] }
        ]
    },
    stoneTroll: {
        id: "stoneTroll",
        name: "Stone Troll",
        cords: { x: 0, y: 0 },
        stats: {
            str: 28,
            dex: 0,
            int: 0,
            vit: 0,
            cun: 0,
            hp: 90,
            mp: 0,
            hpMax: 90,
            mpMax: 0
        },
        resistances: {
            slash: 25,
            crush: 25,
            pierce: 25,
            magic: 25,
            dark: -5,
            divine: -5,
            fire: -5,
            lightning: 5,
            ice: 5
        },
        statusResistances: {
            poison: 50,
            burning: -10,
            curse: 0,
            stun: 0,
            bleed: 65
        },
        damages: {
            crush: 13,
        },
        alive: true,
        xp: 100,
        sprite: "stoneTroll",
        img: "resources/tiles/enemies/stone_troll.png",
        aggroRange: 11,
        attackRange: 1,
        canFly: false,
        abilities: [
            new Ability(abilities.attack, dummy)
        ],
        statModifiers: [
            {
                id: "anti_magic",
                effects: {
                    mpMaxP: -100,
                }
            }
        ],
        retreatLimit: 0,
        statsPerLevel: {
            str: 4,
            dex: 0,
            vit: 4
        },
        loot: [
            { type: "gold", amount: [53, 129] }
        ]
    },
};
//# sourceMappingURL=enemies.js.map