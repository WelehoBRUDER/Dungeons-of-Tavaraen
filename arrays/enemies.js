"use strict";
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
            hp: 10,
            mp: 0,
            hpMax: 10,
            mpMax: 0
        },
        resistances: {
            slash: 60,
            crush: 60,
            pierce: 60,
            dark: 10,
            divine: 10,
            fire: -20,
            lightning: -20,
            ice: -20
        },
        damages: {
            crush: 4
        },
        alive: true,
        xp: 5,
        sprite: "greySlime",
        aggroRange: 15,
        attackRange: 1,
        canFly: false,
        abilities: [
            new Ability(abilities.attack)
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
            hp: 15,
            mp: 0,
            hpMax: 15,
            mpMax: 0
        },
        resistances: {
            slash: 70,
            crush: -10,
            pierce: 55,
            dark: 20,
            divine: -50,
            fire: -20,
            lightning: 20,
            ice: 20
        },
        damages: {
            slash: 3
        },
        alive: true,
        xp: 5,
        sprite: "skeletonWarrior",
        aggroRange: 22,
        attackRange: 1,
        canFly: false,
        abilities: [
            new Ability(abilities.attack)
        ]
    }
};
