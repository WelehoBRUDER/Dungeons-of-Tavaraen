"use strict";
const grades = {
    common: {
        color: "#e0e0e0",
        worth: 1
    },
    uncommon: {
        color: "#7ccf63",
        worth: 2
    },
    rare: {
        color: "#4287f5",
        worth: 3.25
    },
    mythical: {
        color: "#5e18a3",
        worth: 5
    },
    legendary: {
        color: "#cfcf32",
        worth: 8
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
            { type: "strV", value: [1, 2, 3], chance: 1.25 },
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
        grade: "common",
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
            { type: "strV", value: [1, 2], chance: 1.25 },
            { type: "dexV", value: [1, 2], chance: 1.75 },
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
    trollClub: {
        id: "trollClub",
        name: "Troll Club",
        damages: { crush: 13 },
        damagesTemplate: [
            { type: "crush", value: [2, 6], chance: 7 },
            { type: "dark", value: [4, 5], chance: 4 },
            { type: "divine", value: [4, 5], chance: 4 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 4, 7], chance: 1.25 },
            { type: "dexV", value: [1, 2, 4, 7], chance: 1.75 },
        ],
        stats: {
            hitChanceV: 5
        },
        requiresStats: {
            str: 18
        },
        range: 1,
        img: "resources/icons/troll_club.png",
        sprite: "trollClub",
        price: 75,
        weight: 5.4,
        type: "weapon",
        twoHanded: true,
        grade: "uncommon",
        slot: "weapon"
    },
    chippedBlade: {
        id: "chippedBlade",
        name: "Chipped Longsword",
        damages: { slash: 5, pierce: 1 },
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
        damages: { slash: 6, pierce: 3 },
        damagesTemplate: [
            { type: "slash", value: [1, 2], chance: 4 },
            { type: "pierce", value: [1, 2], chance: 4 },
            { type: "dark", value: [2, 5], chance: 4 },
            { type: "divine", value: [2, 5], chance: 4 },
            { type: "fire", value: [4, 6], chance: 6 },
            { type: "lightning", value: [4, 6], chance: 6 },
            { type: "ice", value: [2, 4], chance: 5 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 4], chance: 1.75 },
            { type: "strP", value: [3, 5, 9], chance: 1 },
            { type: "dexV", value: [1, 2, 4], chance: 1.75 },
            { type: "dexP", value: [3, 5, 7], chance: 1.5 },
            { type: "vitV", value: [1, 2, 4], chance: 1.25 },
            { type: "vitP", value: [3, 5, 7], chance: 1.25 },
        ],
        requiresStats: {
            str: 8
        },
        range: 1,
        img: "resources/icons/weapon_blade.png",
        sprite: "blade",
        price: 60,
        weight: 2.4,
        type: "weapon",
        grade: "common",
        slot: "weapon"
    },
    chippedAxe: {
        id: "chippedAxe",
        name: "Chipped Axe",
        damages: { crush: 6, pierce: 1 },
        damagesTemplate: [
            { type: "crush", value: [2, 3], chance: 4 },
            { type: "pierce", value: [1, 3], chance: 4 },
            { type: "dark", value: [2, 5], chance: 4 },
            { type: "divine", value: [2, 5], chance: 5 },
            { type: "fire", value: [2, 4], chance: 7 },
            { type: "lightning", value: [2, 5], chance: 7 },
            { type: "ice", value: [2, 4], chance: 5 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 3], chance: 1.75 },
            { type: "strP", value: [3, 5, 9], chance: 1 },
            { type: "dexV", value: [1, 2, 3], chance: 1.75 },
            { type: "dexP", value: [3, 5, 7], chance: 1.5 },
            { type: "vitV", value: [1, 2, 3], chance: 1.25 },
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
        requiresStats: {
            dex: 5
        },
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
    apprenticeWand: {
        id: "apprenticeWand",
        name: "Apprentice Wand",
        damages: { magic: 5 },
        damagesTemplate: [
            { type: "magic", value: [1, 3], chance: 5 },
            { type: "dark", value: [1, 2], chance: 4 },
            { type: "divine", value: [1, 2], chance: 4 },
        ],
        statsTemplate: [
            { type: "intV", value: [1, 2, 3], chance: 1.25 },
            { type: "dexV", value: [1, 2, 3], chance: 1.75 },
        ],
        requiresStats: {
            int: 5
        },
        stats: {
            magicDamageP: 5
        },
        range: 6,
        img: "resources/icons/apprentice_wand.png",
        sprite: "apprenticeWand",
        price: 25,
        weight: 1.2,
        type: "weapon",
        firesProjectile: "magicBlastProjectile",
        grade: "common",
        slot: "weapon"
    },
    woodenShield: {
        id: "woodenShield",
        name: "Wooden Shield",
        resistances: { slash: 5, crush: 5, pierce: 5, fire: -5, magic: 5, dark: 3, divine: 3, lightning: 2, ice: 1 },
        resistancesTemplate: [
            { type: "slash", value: [1, 2], chance: 5 },
            { type: "crush", value: [2, 5], chance: 7 },
            { type: "dark", value: [1, 3], chance: 5 },
            { type: "divine", value: [1, 3], chance: 5 },
            { type: "fire", value: [-1, -3], chance: 5 },
            { type: "lightning", value: [-1, -3], chance: 5 },
            { type: "ice", value: [2, 4], chance: 5 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 3], chance: 1.25 },
            { type: "strP", value: [3, 5, 8], chance: 2.5 },
            { type: "dexV", value: [1, 2, 3], chance: 1.75 },
            { type: "dexP", value: [3, 5, 7], chance: 1.5 },
            { type: "vitV", value: [1, 2, 4], chance: 1.75 },
            { type: "vitP", value: [3, 6, 9], chance: 1.8 },
            { type: "hpMaxV", value: [4, 8, 12], chance: 3.5 },
        ],
        img: "resources/icons/wooden_shield.png",
        sprite: "woodenShield",
        price: 13,
        weight: 1.2,
        type: "armor",
        grade: "common",
        slot: "offhand"
    },
    raggedShirt: {
        id: "raggedShirt",
        name: "Ragged Shirt",
        resistances: { slash: 1, crush: 5, pierce: 2, fire: -2, ice: 2 },
        resistancesTemplate: [
            { type: "slash", value: [1, 2], chance: 5 },
            { type: "crush", value: [2, 5], chance: 7 },
            { type: "dark", value: [1, 3], chance: 5 },
            { type: "divine", value: [1, 3], chance: 5 },
            { type: "fire", value: [-1, -3], chance: 5 },
            { type: "lightning", value: [-1, -3], chance: 5 },
            { type: "ice", value: [2, 4], chance: 5 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 3], chance: 1.25 },
            { type: "strP", value: [3, 5, 8], chance: 2.5 },
            { type: "dexV", value: [1, 2, 3], chance: 1.75 },
            { type: "dexP", value: [3, 5, 7], chance: 1.5 },
            { type: "vitV", value: [1, 2, 4], chance: 1.75 },
            { type: "vitP", value: [3, 6, 9], chance: 1.8 },
            { type: "hpMaxV", value: [4, 8, 12], chance: 3.5 },
        ],
        img: "resources/icons/ragged_shirt.png",
        sprite: "raggedShirt",
        price: 6,
        weight: 0.8,
        type: "armor",
        grade: "common",
        slot: "chest"
    },
    raggedPants: {
        id: "raggedPants",
        name: "Ragged Pants",
        resistances: { slash: 2, crush: 4, pierce: 2, fire: -1, ice: 1 },
        resistancesTemplate: [
            { type: "slash", value: [1, 3], chance: 5 },
            { type: "crush", value: [1, 3], chance: 7 },
            { type: "dark", value: [1, 3], chance: 5 },
            { type: "divine", value: [1, 3], chance: 5 },
            { type: "fire", value: [-1, -2], chance: 5 },
            { type: "lightning", value: [-1, -2], chance: 5 },
            { type: "ice", value: [2, 3], chance: 10 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 3], chance: 1.25 },
            { type: "strP", value: [3, 5, 8], chance: 2.5 },
            { type: "dexV", value: [1, 2, 3], chance: 1.75 },
            { type: "dexP", value: [3, 5, 7], chance: 1.5 },
            { type: "vitV", value: [1, 2, 4], chance: 1.75 },
            { type: "vitP", value: [3, 6, 9], chance: 1.8 },
            { type: "hpMaxV", value: [4, 8, 12], chance: 3.5 },
        ],
        img: "resources/icons/ragged_pants.png",
        sprite: "raggedPants",
        price: 5,
        weight: 0.8,
        type: "armor",
        grade: "common",
        slot: "legs"
    },
    raggedBoots: {
        id: "raggedBoots",
        name: "Ragged Boots",
        resistances: { slash: 1, crush: 3, pierce: 2, fire: -1, ice: 1 },
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
        grade: "common",
        slot: "boots"
    },
    raggedGloves: {
        id: "raggedGloves",
        name: "Ragged Gloves",
        resistances: { slash: 1, crush: 2, pierce: 2, fire: -1, ice: 1 },
        resistancesTemplate: [
            { type: "slash", value: [1, 1], chance: 5 },
            { type: "crush", value: [1, 3], chance: 7 },
            { type: "pierce", value: [1, 2], chance: 5 },
            { type: "dark", value: [1, 2], chance: 5 },
            { type: "divine", value: [1, 2], chance: 5 },
            { type: "fire", value: [-1, -2], chance: 5 },
            { type: "lightning", value: [-1, -2], chance: 5 },
            { type: "ice", value: [2, 3], chance: 5 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 3], chance: 1.25 },
            { type: "strP", value: [2, 4, 6], chance: 1 },
            { type: "dexV", value: [1, 2, 3], chance: 1.75 },
            { type: "dexP", value: [3, 5, 7], chance: 1.5 },
        ],
        img: "resources/icons/gloves.png",
        sprite: "raggedGloves",
        price: 3,
        weight: 0.15,
        type: "armor",
        grade: "common",
        slot: "gloves"
    },
    raggedHood: {
        id: "raggedHood",
        name: "Ragged Hood",
        resistances: { slash: 2, crush: 3, pierce: 3, fire: -2, ice: 1, dark: 1, divine: 1 },
        resistancesTemplate: [
            { type: "slash", value: [1, 1], chance: 5 },
            { type: "crush", value: [1, 3], chance: 7 },
            { type: "pierce", value: [1, 2], chance: 5 },
            { type: "dark", value: [1, 2], chance: 5 },
            { type: "divine", value: [1, 2], chance: 5 },
            { type: "fire", value: [-1, -2], chance: 5 },
            { type: "lightning", value: [-1, -2], chance: 5 },
            { type: "ice", value: [2, 3], chance: 5 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 3], chance: 1.25 },
            { type: "strP", value: [2, 4, 6], chance: 1 },
            { type: "dexV", value: [1, 2, 3], chance: 1.75 },
            { type: "dexP", value: [3, 5, 7], chance: 1.5 },
        ],
        coversHair: true,
        img: "resources/icons/ragged_hood.png",
        sprite: "raggedHood",
        price: 5,
        weight: 0.2,
        type: "armor",
        grade: "common",
        slot: "helmet"
    },
    leatherChest: {
        id: "leatherChest",
        name: "Leather Chest",
        resistances: { slash: 4, crush: 7, pierce: 5, magic: 5, ice: 2, lightning: 3, dark: 1, divine: 1, fire: 2 },
        resistancesTemplate: [
            { type: "slash", value: [1, 4], chance: 7 },
            { type: "crush", value: [1, 4], chance: 7 },
            { type: "pierce", value: [1, 4], chance: 7 },
            { type: "magic", value: [1, 4], chance: 7 },
            { type: "dark", value: [1, 4], chance: 7 },
            { type: "divine", value: [1, 4], chance: 7 },
            { type: "fire", value: [1, 4], chance: 7 },
            { type: "lightning", value: [1, 4], chance: 7 },
            { type: "ice", value: [1, 4], chance: 7 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 3, 4], chance: 1.75 },
            { type: "strP", value: [3, 5, 8, 10], chance: 3.25 },
            { type: "dexV", value: [1, 2, 3, 4], chance: 2.25 },
            { type: "dexP", value: [3, 5, 7, 9], chance: 2 },
            { type: "vitV", value: [1, 2, 4, 5], chance: 2.25 },
            { type: "vitP", value: [3, 6, 9, 12], chance: 2.45 },
            { type: "hpMaxV", value: [4, 8, 12, 16], chance: 4.5 },
        ],
        requiresStats: {
            vit: 5,
            dex: 6
        },
        img: "resources/icons/leather_chest.png",
        sprite: "leatherChest",
        price: 50,
        weight: 1.7,
        type: "armor",
        grade: "common",
        slot: "chest"
    },
    leatherLeggings: {
        id: "leatherLeggings",
        name: "Leather Leggings",
        resistances: { slash: 3, crush: 5, pierce: 4, magic: 4, ice: 2, lightning: 2, dark: 1, divine: 1, fire: 1 },
        resistancesTemplate: [
            { type: "slash", value: [1, 3], chance: 7 },
            { type: "crush", value: [1, 3], chance: 7 },
            { type: "pierce", value: [1, 3], chance: 7 },
            { type: "magic", value: [1, 3], chance: 7 },
            { type: "dark", value: [1, 3], chance: 7 },
            { type: "divine", value: [1, 3], chance: 7 },
            { type: "fire", value: [1, 3], chance: 7 },
            { type: "lightning", value: [1, 3], chance: 7 },
            { type: "ice", value: [1, 3], chance: 7 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 3, 4], chance: 1.75 },
            { type: "strP", value: [3, 5, 8, 10], chance: 3.25 },
            { type: "dexV", value: [1, 2, 3, 4], chance: 2.25 },
            { type: "dexP", value: [3, 5, 7, 9], chance: 2 },
            { type: "vitV", value: [1, 2, 4, 5], chance: 2.25 },
            { type: "vitP", value: [3, 6, 9, 12], chance: 2.45 },
            { type: "hpMaxV", value: [4, 8, 12, 16], chance: 4.5 },
        ],
        requiresStats: {
            vit: 5,
            dex: 6
        },
        img: "resources/icons/leather_leg_bracers.png",
        sprite: "leatherLeggings",
        price: 45,
        weight: 1.5,
        type: "armor",
        grade: "common",
        slot: "legs"
    },
    leatherBracers: {
        id: "leatherBracers",
        name: "Leather Bracers",
        resistances: { slash: 2, crush: 3, pierce: 2, magic: 2, ice: 1, lightning: 1, dark: 1, divine: 1, fire: 1 },
        resistancesTemplate: [
            { type: "slash", value: [1, 2], chance: 7 },
            { type: "crush", value: [1, 2], chance: 7 },
            { type: "pierce", value: [1, 2], chance: 7 },
            { type: "magic", value: [1, 2], chance: 7 },
            { type: "dark", value: [1, 2], chance: 7 },
            { type: "divine", value: [1, 2], chance: 7 },
            { type: "fire", value: [1, 2], chance: 7 },
            { type: "lightning", value: [1, 2], chance: 7 },
            { type: "ice", value: [1, 2], chance: 7 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 3], chance: 1.75 },
            { type: "strP", value: [3, 5, 8], chance: 3.25 },
            { type: "dexV", value: [1, 2, 3], chance: 2.25 },
            { type: "dexP", value: [3, 5, 7], chance: 2 },
            { type: "vitV", value: [1, 2, 4], chance: 2.25 },
            { type: "vitP", value: [3, 6, 9], chance: 2.45 },
            { type: "hpMaxV", value: [4, 8, 12], chance: 4.5 },
        ],
        requiresStats: {
            vit: 3,
            dex: 4
        },
        img: "resources/icons/leather_bracers.png",
        sprite: "leatherBracers",
        price: 25,
        weight: 0.65,
        type: "armor",
        grade: "common",
        slot: "gloves"
    },
    leatherHelmet: {
        id: "leatherHelmet",
        name: "Leather Helmet",
        resistances: { slash: 2, crush: 4, pierce: 2, magic: 2, ice: 2, lightning: 2, dark: 2, divine: 2, fire: 2 },
        resistancesTemplate: [
            { type: "slash", value: [1, 2], chance: 7 },
            { type: "crush", value: [1, 2], chance: 7 },
            { type: "pierce", value: [1, 2], chance: 7 },
            { type: "magic", value: [1, 2], chance: 7 },
            { type: "dark", value: [1, 2], chance: 7 },
            { type: "divine", value: [1, 2], chance: 7 },
            { type: "fire", value: [1, 2], chance: 7 },
            { type: "lightning", value: [1, 2], chance: 7 },
            { type: "ice", value: [1, 2], chance: 7 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 3], chance: 1.75 },
            { type: "strP", value: [3, 5, 8], chance: 3.25 },
            { type: "dexV", value: [1, 2, 3], chance: 2.25 },
            { type: "dexP", value: [3, 5, 7], chance: 2 },
            { type: "vitV", value: [1, 2, 4], chance: 2.25 },
            { type: "vitP", value: [3, 6, 9], chance: 2.45 },
            { type: "hpMaxV", value: [4, 8, 12], chance: 4.5 },
        ],
        requiresStats: {
            vit: 3,
            dex: 4
        },
        coversHair: true,
        img: "resources/icons/leather_helmet.png",
        sprite: "leatherHelmet",
        price: 30,
        weight: 0.5,
        type: "armor",
        grade: "common",
        slot: "helmet"
    },
    leatherBoots: {
        id: "leatherBoots",
        name: "Leather Booots",
        resistances: { slash: 2, crush: 3, pierce: 2, magic: 1, ice: 1, lightning: 1, dark: 1, divine: 1, fire: 1 },
        resistancesTemplate: [
            { type: "slash", value: [1, 2], chance: 7 },
            { type: "crush", value: [1, 2], chance: 7 },
            { type: "pierce", value: [1, 2], chance: 7 },
            { type: "magic", value: [1, 2], chance: 7 },
            { type: "dark", value: [1, 2], chance: 7 },
            { type: "divine", value: [1, 2], chance: 7 },
            { type: "fire", value: [1, 2], chance: 7 },
            { type: "lightning", value: [1, 2], chance: 7 },
            { type: "ice", value: [1, 2], chance: 7 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 3], chance: 1.75 },
            { type: "strP", value: [3, 5, 8], chance: 3.25 },
            { type: "dexV", value: [1, 2, 3], chance: 2.25 },
            { type: "dexP", value: [3, 5, 7], chance: 2 },
            { type: "vitV", value: [1, 2, 4], chance: 2.25 },
            { type: "vitP", value: [3, 6, 9], chance: 2.45 },
            { type: "hpMaxV", value: [4, 8, 12], chance: 4.5 },
        ],
        requiresStats: {
            vit: 3,
            dex: 4
        },
        img: "resources/icons/leather_boots.png",
        sprite: "leatherBoots",
        price: 25,
        weight: 0.75,
        type: "armor",
        grade: "common",
        slot: "boots"
    },
    ironArmor: {
        id: "ironArmor",
        name: "Iron Armour",
        resistances: { slash: 15, crush: 10, pierce: 14, magic: 8, ice: 5, lightning: 3, dark: 6, divine: 6, fire: 7 },
        resistancesTemplate: [
            { type: "slash", value: [3, 8], chance: 7 },
            { type: "crush", value: [3, 8], chance: 7 },
            { type: "pierce", value: [3, 8], chance: 7 },
            { type: "magic", value: [3, 8], chance: 7 },
            { type: "dark", value: [3, 8], chance: 7 },
            { type: "divine", value: [3, 8], chance: 7 },
            { type: "fire", value: [3, 8], chance: 7 },
            { type: "lightning", value: [3, 8], chance: 7 },
            { type: "ice", value: [3, 8], chance: 7 },
        ],
        statsTemplate: [
            { type: "strV", value: [2, 4, 6, 8], chance: 1.75 },
            { type: "strP", value: [5, 8, 12, 15], chance: 3.25 },
            { type: "dexV", value: [2, 4, 6, 8], chance: 2.25 },
            { type: "dexP", value: [5, 8, 11, 14], chance: 2 },
            { type: "vitV", value: [2, 4, 5, 7], chance: 2.25 },
            { type: "vitP", value: [5, 7, 11, 15], chance: 2.45 },
            { type: "hpMaxV", value: [10, 15, 20, 25], chance: 4.5 },
        ],
        requiresStats: {
            vit: 10,
            str: 10
        },
        img: "resources/icons/iron_armor.png",
        sprite: "ironArmor",
        price: 200,
        weight: 10.5,
        type: "armor",
        grade: "uncommon",
        slot: "chest"
    },
    ironLegplates: {
        id: "ironLegplates",
        name: "Iron Legplates",
        resistances: { slash: 11, crush: 8, pierce: 10, magic: 6, ice: 5, lightning: 3, dark: 5, divine: 5, fire: 5 },
        resistancesTemplate: [
            { type: "slash", value: [3, 7], chance: 7 },
            { type: "crush", value: [3, 7], chance: 7 },
            { type: "pierce", value: [3, 7], chance: 7 },
            { type: "magic", value: [3, 7], chance: 7 },
            { type: "dark", value: [3, 7], chance: 7 },
            { type: "divine", value: [3, 7], chance: 7 },
            { type: "fire", value: [3, 7], chance: 7 },
            { type: "lightning", value: [3, 7], chance: 7 },
            { type: "ice", value: [3, 7], chance: 7 },
        ],
        statsTemplate: [
            { type: "strV", value: [2, 4, 6, 8], chance: 1.75 },
            { type: "strP", value: [5, 8, 12, 15], chance: 3.25 },
            { type: "dexV", value: [2, 4, 6, 8], chance: 2.25 },
            { type: "dexP", value: [5, 8, 11, 14], chance: 2 },
            { type: "vitV", value: [2, 4, 5, 7], chance: 2.25 },
            { type: "vitP", value: [5, 7, 11, 15], chance: 2.45 },
            { type: "hpMaxV", value: [10, 15, 20, 25], chance: 4.5 },
        ],
        requiresStats: {
            vit: 10,
            str: 10
        },
        img: "resources/icons/iron_leg_plates.png",
        sprite: "ironLegplates",
        price: 150,
        weight: 5.25,
        type: "armor",
        grade: "uncommon",
        slot: "legs"
    },
    ironHelmet: {
        id: "ironHelmet",
        name: "Iron Helmet",
        resistances: { slash: 6, crush: 4, pierce: 5, magic: 4, ice: 4, lightning: 1, dark: 3, divine: 3, fire: 4 },
        resistancesTemplate: [
            { type: "slash", value: [2, 5], chance: 7 },
            { type: "crush", value: [2, 5], chance: 7 },
            { type: "pierce", value: [2, 5], chance: 7 },
            { type: "magic", value: [2, 5], chance: 7 },
            { type: "dark", value: [2, 5], chance: 7 },
            { type: "divine", value: [2, 5], chance: 7 },
            { type: "fire", value: [2, 5], chance: 7 },
            { type: "lightning", value: [2, 5], chance: 7 },
            { type: "ice", value: [2, 5], chance: 7 },
        ],
        statsTemplate: [
            { type: "strV", value: [2, 4, 6], chance: 1.75 },
            { type: "strP", value: [5, 8, 12], chance: 3.25 },
            { type: "dexV", value: [2, 4, 6], chance: 2.25 },
            { type: "dexP", value: [5, 8, 11], chance: 2 },
            { type: "vitV", value: [2, 4, 5], chance: 2.25 },
            { type: "vitP", value: [5, 7, 11], chance: 2.45 },
            { type: "hpMaxV", value: [10, 15, 20], chance: 4.5 },
        ],
        requiresStats: {
            vit: 8,
            str: 8
        },
        coversHair: true,
        img: "resources/icons/iron_helmet.png",
        sprite: "ironHelmet",
        price: 100,
        weight: 3,
        type: "armor",
        grade: "uncommon",
        slot: "helmet"
    },
    ironGauntlets: {
        id: "ironGauntlets",
        name: "Iron Gauntlets",
        resistances: { slash: 5, crush: 4, pierce: 4, magic: 4, ice: 4, lightning: 1, dark: 3, divine: 3, fire: 4 },
        resistancesTemplate: [
            { type: "slash", value: [2, 5], chance: 7 },
            { type: "crush", value: [2, 5], chance: 7 },
            { type: "pierce", value: [2, 5], chance: 7 },
            { type: "magic", value: [2, 5], chance: 7 },
            { type: "dark", value: [2, 5], chance: 7 },
            { type: "divine", value: [2, 5], chance: 7 },
            { type: "fire", value: [2, 5], chance: 7 },
            { type: "lightning", value: [2, 5], chance: 7 },
            { type: "ice", value: [2, 5], chance: 7 },
        ],
        statsTemplate: [
            { type: "strV", value: [2, 4, 6], chance: 1.75 },
            { type: "strP", value: [5, 8, 12], chance: 3.25 },
            { type: "dexV", value: [2, 4, 6], chance: 2.25 },
            { type: "dexP", value: [5, 8, 11], chance: 2 },
            { type: "vitV", value: [2, 4, 5], chance: 2.25 },
            { type: "vitP", value: [5, 7, 11], chance: 2.45 },
            { type: "hpMaxV", value: [10, 15, 20], chance: 4.5 },
        ],
        requiresStats: {
            vit: 8,
            str: 8
        },
        img: "resources/icons/iron_gauntlets.png",
        sprite: "ironGauntlets",
        price: 95,
        weight: 3.5,
        type: "armor",
        grade: "uncommon",
        slot: "gloves"
    },
    ironBoots: {
        id: "ironBoots",
        name: "Iron Boots",
        resistances: { slash: 5, crush: 4, pierce: 4, magic: 4, ice: 4, lightning: 1, dark: 3, divine: 3, fire: 4 },
        resistancesTemplate: [
            { type: "slash", value: [2, 5], chance: 7 },
            { type: "crush", value: [2, 5], chance: 7 },
            { type: "pierce", value: [2, 5], chance: 7 },
            { type: "magic", value: [2, 5], chance: 7 },
            { type: "dark", value: [2, 5], chance: 7 },
            { type: "divine", value: [2, 5], chance: 7 },
            { type: "fire", value: [2, 5], chance: 7 },
            { type: "lightning", value: [2, 5], chance: 7 },
            { type: "ice", value: [2, 5], chance: 7 },
        ],
        statsTemplate: [
            { type: "strV", value: [2, 4, 6], chance: 1.75 },
            { type: "strP", value: [5, 8, 12], chance: 3.25 },
            { type: "dexV", value: [2, 4, 6], chance: 2.25 },
            { type: "dexP", value: [5, 8, 11], chance: 2 },
            { type: "vitV", value: [2, 4, 5], chance: 2.25 },
            { type: "vitP", value: [5, 7, 11], chance: 2.45 },
            { type: "hpMaxV", value: [10, 15, 20], chance: 4.5 },
        ],
        requiresStats: {
            vit: 8,
            str: 8
        },
        img: "resources/icons/iron_boots.png",
        sprite: "ironBoots",
        price: 95,
        weight: 4.5,
        type: "armor",
        grade: "uncommon",
        slot: "boots"
    },
    crownOfWisdom: {
        id: "crownOfWisdom",
        name: "Crown of Wisdom",
        resistances: { magic: 20, dark: 10, divine: 10 },
        resistancesTemplate: [
            { type: "slash", value: [1, 2], chance: 7 },
            { type: "crush", value: [1, 2], chance: 7 },
            { type: "pierce", value: [1, 2], chance: 7 },
            { type: "magic", value: [1, 2], chance: 7 },
            { type: "dark", value: [1, 2], chance: 7 },
            { type: "divine", value: [1, 2], chance: 7 },
            { type: "fire", value: [1, 2], chance: 7 },
            { type: "lightning", value: [1, 2], chance: 7 },
            { type: "ice", value: [1, 2], chance: 7 },
        ],
        statsTemplate: [
            { type: "strV", value: [1, 2, 3], chance: 1.75 },
            { type: "strP", value: [3, 5, 8], chance: 3.25 },
            { type: "dexV", value: [1, 2, 3], chance: 2.25 },
            { type: "dexP", value: [3, 5, 7], chance: 2 },
            { type: "vitV", value: [1, 2, 4], chance: 2.25 },
            { type: "vitP", value: [3, 6, 9], chance: 2.45 },
            { type: "hpMaxV", value: [4, 8, 12], chance: 4.5 },
        ],
        requiresStats: {
            int: 15
        },
        stats: {
            magicDamageP: 10
        },
        img: "resources/icons/crown_of_wisdom.png",
        sprite: "crownOfWisdom",
        price: 500,
        weight: 0.5,
        type: "armor",
        grade: "rare",
        slot: "helmet"
    },
    lichRobes: {
        id: "lichRobes",
        name: "Lich Robes",
        resistances: { slash: 5, crush: 4, pierce: 4, magic: 15, ice: 8, lightning: 5, dark: 10, divine: 10, fire: 5 },
        resistancesTemplate: [
            { type: "slash", value: [3, 8], chance: 7 },
            { type: "crush", value: [3, 8], chance: 7 },
            { type: "pierce", value: [3, 8], chance: 7 },
            { type: "magic", value: [3, 8], chance: 7 },
            { type: "dark", value: [3, 8], chance: 7 },
            { type: "divine", value: [3, 8], chance: 7 },
            { type: "fire", value: [3, 8], chance: 7 },
            { type: "lightning", value: [3, 8], chance: 7 },
            { type: "ice", value: [3, 8], chance: 7 },
        ],
        statsTemplate: [
            { type: "dexV", value: [2, 4, 6, 8], chance: 2.25 },
            { type: "dexP", value: [5, 8, 11, 14], chance: 2 },
            { type: "vitV", value: [2, 4, 5, 7], chance: 2.25 },
            { type: "vitP", value: [5, 7, 11, 15], chance: 2.45 },
            { type: "intV", value: [2, 4, 5, 7], chance: 2.25 },
            { type: "intP", value: [5, 7, 11, 15], chance: 2.45 },
            { type: "hpMaxV", value: [10, 15, 20, 25], chance: 4.5 },
        ],
        requiresStats: {
            int: 12
        },
        img: "resources/icons/lich_robes.png",
        sprite: "lichRobes",
        price: 305,
        weight: 4.5,
        type: "armor",
        grade: "uncommon",
        slot: "chest"
    },
    healingScrollI: {
        id: "healingScrollI",
        name: "Scroll of Healing I",
        img: "resources/icons/healing_scroll.png",
        sprite: "",
        price: 75,
        weight: 0.1,
        type: "consumable",
        grade: "common",
        slot: "",
        equippedSlot: -1,
        healValue: 20,
        usesTotal: 3,
        usesRemaining: 3
    },
    manaScrollI: {
        id: "manaScrollI",
        name: "Scroll of Mana Recovery I",
        img: "resources/icons/mana_scroll.png",
        sprite: "",
        price: 75,
        weight: 0.1,
        type: "consumable",
        grade: "common",
        slot: "",
        equippedSlot: -1,
        manaValue: 15,
        usesTotal: 3,
        usesRemaining: 3
    },
};
//# sourceMappingURL=items.js.map