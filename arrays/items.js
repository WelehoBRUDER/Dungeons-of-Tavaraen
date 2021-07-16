"use strict";
const grades = {
    common: {
        color: "#e0e0e0"
    },
    uncommon: {
        color: "#7ccf63"
    },
    rare: {
        color: "#4287f5"
    },
    mythical: {
        color: "#5e18a3"
    },
    legendary: {
        color: "#cfcf32"
    }
};
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
        img: "resources/icons/weapon_dagger.png",
        sprite: "rustyDagger",
        price: 10,
        weight: 1.2,
        type: "weapon",
        grade: "uncommon",
        slot: "weapon"
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
        img: "resources/icons/weapon_club.png",
        sprite: "stick",
        price: 10,
        weight: 0.9,
        type: "weapon",
        grade: "common",
        slot: "weapon"
    },
    chippedBlade: {
        id: "chippedBlade",
        name: "Chipped Longsword",
        damages: { slash: 6, pierce: 2 },
        damagesTemplate: [
            { type: "slash", value: [2, 4], chance: 10 },
            { type: "pierce", value: [1, 2], chance: 10 },
            { type: "dark", value: [2, 5], chance: 4 },
            { type: "divine", value: [2, 5], chance: 4 },
            { type: "fire", value: [2, 5], chance: 7 },
            { type: "lightning", value: [2, 5], chance: 5 },
            { type: "ice", value: [2, 5], chance: 5 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 4], chance: 1.25 },
            { type: "strP", value: [3, 5, 9], chance: 1 },
            { type: "dexV", value: [1, 2, 3], chance: 1.75 },
            { type: "dexP", value: [3, 5, 7], chance: 1.5 },
            { type: "vitV", value: [1, 2, 3], chance: 1.25 },
            { type: "vitP", value: [3, 5, 7], chance: 1.25 },
        ],
        range: 1,
        img: "resources/icons/weapon_chipped_blade.png",
        sprite: "chippedBlade",
        price: 18,
        weight: 2.1,
        type: "weapon",
        grade: "common",
        slot: "weapon"
    },
    longsword: {
        id: "longsword",
        name: "Longsword",
        damages: { slash: 8, pierce: 5 },
        damagesTemplate: [
            { type: "slash", value: [2, 4], chance: 4 },
            { type: "pierce", value: [1, 3], chance: 4 },
            { type: "dark", value: [2, 7], chance: 4 },
            { type: "divine", value: [2, 7], chance: 4 },
            { type: "fire", value: [6, 11], chance: 21 },
            { type: "lightning", value: [5, 8], chance: 15 },
            { type: "ice", value: [2, 4], chance: 5 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 5], chance: 1.75 },
            { type: "strP", value: [3, 5, 9], chance: 1 },
            { type: "dexV", value: [1, 2, 5], chance: 1.75 },
            { type: "dexP", value: [3, 5, 7], chance: 1.5 },
            { type: "vitV", value: [1, 2, 5], chance: 1.25 },
            { type: "vitP", value: [3, 5, 7], chance: 1.25 },
        ],
        commands: {
            add_ability_focus_strike: 1
        },
        range: 1,
        img: "resources/icons/weapon_blade.png",
        sprite: "blade",
        price: 60,
        weight: 2.4,
        type: "weapon",
        grade: "rare",
        slot: "weapon"
    },
    chippedAxe: {
        id: "chippedAxe",
        name: "Chipped Axe",
        damages: { crush: 6, pierce: 4 },
        damagesTemplate: [
            { type: "crush", value: [2, 3], chance: 4 },
            { type: "pierce", value: [1, 3], chance: 4 },
            { type: "dark", value: [2, 6], chance: 4 },
            { type: "divine", value: [2, 6], chance: 4 },
            { type: "fire", value: [4, 8], chance: 13 },
            { type: "lightning", value: [3, 7], chance: 15 },
            { type: "ice", value: [3, 7], chance: 5 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 5], chance: 1.75 },
            { type: "strP", value: [3, 5, 9], chance: 1 },
            { type: "dexV", value: [1, 2, 5], chance: 1.75 },
            { type: "dexP", value: [3, 5, 7], chance: 1.5 },
            { type: "vitV", value: [1, 2, 5], chance: 1.25 },
            { type: "vitP", value: [3, 5, 7], chance: 1.25 },
        ],
        range: 1,
        img: "resources/icons/chipped_axe.png",
        sprite: "chippedAxe",
        price: 35,
        weight: 2.9,
        type: "weapon",
        grade: "common",
        slot: "weapon"
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
        range: 7,
        img: "resources/icons/weapon_bow.png",
        sprite: "bow",
        price: 10,
        weight: 0.9,
        type: "weapon",
        firesProjectile: "arrowProjectile",
        grade: "common",
        slot: "weapon"
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
            { type: "hpMaxV", value: [4, 8, 12], chance: 3.5 },
        ],
        img: "resources/icons/ragged_shirt.png",
        sprite: "raggedShirt",
        price: 6,
        weight: 0.8,
        type: "armor",
        grade: "mythical",
        slot: "chest"
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
        img: "resources/icons/ragged_boots.png",
        sprite: "raggedBoots",
        price: 4,
        weight: 0.2,
        type: "armor",
        grade: "legendary",
        slot: "boots"
    },
};
