"use strict";
const items = {
    dagger: {
        id: "dagger",
        name: "Dagger",
        damages: { slash: 4 },
        damagesTemplate: [
            { type: "slash", value: [1, 2], chance: 10 },
            { type: "dark", value: [1, 5], chance: 4 },
            { type: "divine", value: [1, 5], chance: 4 },
            { type: "fire", value: [1, 5], chance: 7 },
            { type: "lightning", value: [1, 5], chance: 5 },
            { type: "ice", value: [1, 5], chance: 5 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 4], chance: 1.25 },
            { type: "strP", value: [3, 5, 9], chance: 1 },
            { type: "dexV", value: [1, 2, 3], chance: 1.75 },
            { type: "dexP", value: [3, 5, 7], chance: 1.5 },
            { type: "vitV", value: [1, 2, 3], chance: 1.25 },
        ],
        range: 1,
        img: "",
        sprite: "rustyDagger",
        price: 10,
        weight: 1.2,
        type: "weapon"
    },
    stick: {
        id: "stick",
        name: "Stick",
        damages: { crush: 3 },
        damagesTemplate: [
            { type: "crush", value: [1, 1], chance: 8 },
            { type: "dark", value: [1, 2], chance: 4 },
            { type: "divine", value: [1, 2], chance: 4 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 3], chance: 1.25 },
            { type: "dexV", value: [1, 2, 3], chance: 1.75 },
        ],
        range: 1,
        img: "",
        sprite: "stick",
        price: 10,
        weight: 0.9,
        type: "weapon"
    },
    huntingBow: {
        id: "huntingBow",
        name: "Hunting Bow",
        damages: { pierce: 5 },
        damagesTemplate: [
            { type: "pierce", value: [1, 2], chance: 8 },
            { type: "dark", value: [1, 2], chance: 4 },
            { type: "divine", value: [1, 2], chance: 4 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 3], chance: 1.25 },
            { type: "dexV", value: [1, 2, 3], chance: 1.75 },
        ],
        range: 80,
        img: "",
        sprite: "bow",
        price: 10,
        weight: 0.9,
        type: "weapon",
        firesProjectile: "arrowProjectile"
    },
    raggedShirt: {
        id: "raggedShirt",
        name: "Ragged Shirt",
        resistances: { slash: 1, crush: 5, pierce: 2, fire: -2 },
        resistancesTemplate: [
            { type: "slash", value: [1, 2], chance: 5 },
            { type: "crush", value: [2, 5], chance: 7 },
            { type: "dark", value: [1, 3], chance: 5 },
            { type: "divine", value: [1, 3], chance: 5 },
            { type: "fire", value: [-1, -5], chance: 5 },
            { type: "lightning", value: [-1, -5], chance: 5 },
            { type: "ice", value: [2, 4], chance: 5 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 3], chance: 1.25 },
            { type: "strP", value: [3, 5, 8], chance: 1 },
            { type: "dexV", value: [1, 2, 3], chance: 1.75 },
            { type: "dexP", value: [3, 5, 7], chance: 1.5 },
            { type: "vitV", value: [1, 2, 4], chance: 2 },
            { type: "vitP", value: [3, 6, 9], chance: 1.8 },
            { type: "hpV", value: [4, 8, 12], chance: 3.5 },
        ],
        img: "",
        sprite: "raggedShirt",
        price: 6,
        weight: 0.8,
        type: "armor"
    },
    raggedBoots: {
        id: "raggedBoots",
        name: "Ragged Boots",
        resistances: { slash: 1, crush: 3, pierce: 2, fire: -1 },
        resistancesTemplate: [
            { type: "slash", value: [1, 1], chance: 5 },
            { type: "crush", value: [1, 3], chance: 7 },
            { type: "pierce", value: [1, 2], chance: 5 },
            { type: "dark", value: [1, 2], chance: 5 },
            { type: "divine", value: [1, 2], chance: 5 },
            { type: "fire", value: [-1, -3], chance: 5 },
            { type: "lightning", value: [-1, -3], chance: 5 },
            { type: "ice", value: [2, 3], chance: 5 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 3], chance: 1.25 },
            { type: "strP", value: [2, 4, 6], chance: 1 },
            { type: "dexV", value: [1, 2, 3], chance: 1.75 },
            { type: "dexP", value: [3, 5, 7], chance: 1.5 },
        ],
        img: "",
        sprite: "raggedBoots",
        price: 4,
        weight: 0.2,
        type: "armor"
    },
};
