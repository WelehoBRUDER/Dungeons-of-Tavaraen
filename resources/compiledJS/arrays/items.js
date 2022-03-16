"use strict";
const items = {
    A0_error: {
        id: "A0_error",
        name: "Malformed item",
        img: "resources/icons/error.png",
        price: 0,
        weight: 0,
        type: "error",
        grade: "common",
        stats: {},
        commands: {},
        spriteMap: { x: 0, y: 0 }
    },
    dagger: {
        id: "dagger",
        name: "Dagger",
        damages: { slash: 1, pierce: 6 },
        range: 1,
        img: "resources/icons/weapon_dagger.png",
        sprite: "rustyDagger",
        price: 10,
        weight: 1.2,
        type: "weapon",
        statBonus: "dex",
        grade: "common",
        slot: "weapon",
        spriteMap: { x: 128, y: 0 }
    },
    dualDaggers: {
        id: "dualDaggers",
        name: "Dual Daggers",
        damages: { slash: 5, pierce: 8 },
        range: 1,
        img: "resources/icons/dual_daggers.png",
        sprite: "rustyDualDaggers",
        stats: {
            attackSpeedV: 25
        },
        twoHanded: true,
        price: 70,
        weight: 2.3,
        type: "weapon",
        statBonus: "dex",
        grade: "uncommon",
        slot: "weapon",
        spriteMap: { x: 256, y: 0 }
    },
    stick: {
        id: "stick",
        name: "Stick",
        damages: { crush: 9 },
        range: 1,
        img: "resources/icons/weapon_club.png",
        sprite: "stick",
        price: 10,
        weight: 0.9,
        type: "weapon",
        statBonus: "str",
        grade: "common",
        slot: "weapon",
        spriteMap: { x: 384, y: 0 }
    },
    trollClub: {
        id: "trollClub",
        name: "Troll Club",
        damages: { crush: 21 },
        stats: {
            hitChanceV: 5
        },
        requiresStats: { str: 18 },
        range: 1,
        img: "resources/icons/troll_club.png",
        sprite: "trollClub",
        price: 75,
        weight: 5.4,
        type: "weapon",
        statBonus: "str",
        twoHanded: true,
        grade: "uncommon",
        slot: "weapon",
        spriteMap: { x: 512, y: 0 }
    },
    chippedBlade: {
        id: "chippedBlade",
        name: "Chipped Longsword",
        damages: { slash: 9, pierce: 1 },
        range: 1,
        img: "resources/icons/weapon_chipped_blade.png",
        sprite: "chippedBlade",
        price: 18,
        weight: 2.1,
        type: "weapon",
        statBonus: "str",
        grade: "common",
        slot: "weapon",
        spriteMap: { x: 640, y: 0 }
    },
    longsword: {
        id: "longsword",
        name: "Longsword",
        damages: { slash: 10, pierce: 2 },
        requiresStats: { str: 8 },
        range: 1,
        img: "resources/icons/weapon_blade.png",
        sprite: "blade",
        price: 60,
        weight: 2.4,
        type: "weapon",
        statBonus: "str",
        grade: "common",
        slot: "weapon",
        spriteMap: { x: 768, y: 0 }
    },
    silverSword: {
        id: "silverSword",
        name: "Silver Sword",
        damages: { slash: 10, pierce: 5, magic: 5 },
        requiresStats: { str: 10, dex: 4 },
        range: 1,
        img: "resources/icons/silver_sword.png",
        sprite: "silverSword",
        price: 500,
        weight: 2.4,
        type: "weapon",
        statBonus: "str",
        grade: "rare",
        slot: "weapon",
        spriteMap: { x: 896, y: 0 }
    },
    stoneHalberd: {
        id: "stoneHalberd",
        name: "Stone Halberd",
        damages: { slash: 10, pierce: 8 },
        requiresStats: { str: 12, dex: 6 },
        range: 2,
        img: "resources/icons/stone_halberd.png",
        sprite: "stoneHalberd",
        price: 280,
        weight: 4.6,
        type: "weapon",
        statBonus: "str",
        grade: "uncommon",
        slot: "weapon",
        mainTitle: false,
        spriteMap: { x: 1024, y: 0 }
    },
    galadorSpear: {
        id: "galadorSpear",
        name: "Spear of Galador",
        damages: { pierce: 12, divine: 6 },
        requiresStats: { dex: 12, str: 8 },
        stats: {
            evasionV: 5,
            damage_against_race_undeadP: 15
        },
        range: 2,
        img: "resources/icons/spear_of_galador.png",
        sprite: "galadorSpear",
        price: 1500,
        weight: 1.9,
        type: "weapon",
        statBonus: "dex",
        grade: "rare",
        slot: "weapon",
        mainTitle: false,
        spriteMap: { x: 1152, y: 0 }
    },
    pikeMore: {
        id: "pikeMore",
        name: "Pikemore",
        damages: { crush: 16, lightning: 10 },
        requiresStats: { str: 14 },
        stats: {
            hitChanceV: 10
        },
        range: 2,
        img: "resources/icons/pikemore.png",
        sprite: "pikeMore",
        price: 680,
        weight: 4.5,
        type: "weapon",
        statBonus: "str",
        grade: "rare",
        twoHanded: true,
        slot: "weapon",
        spriteMap: { x: 1280, y: 0 }
    },
    chippedAxe: {
        id: "chippedAxe",
        name: "Chipped Axe",
        damages: { crush: 5, pierce: 4 },
        range: 1,
        img: "resources/icons/chipped_axe.png",
        sprite: "chippedAxe",
        price: 35,
        weight: 2.9,
        type: "weapon",
        statBonus: "str",
        grade: "common",
        slot: "weapon",
        spriteMap: { x: 1408, y: 0 }
    },
    orcishAxe: {
        id: "orcishAxe",
        name: "Orcish Axe",
        damages: { crush: 9, pierce: 6 },
        requiresStats: { str: 10 },
        range: 1,
        img: "resources/icons/orcish_axe.png",
        sprite: "orcishAxe",
        price: 170,
        weight: 2.6,
        type: "weapon",
        statBonus: "str",
        grade: "uncommon",
        slot: "weapon",
        spriteMap: { x: 1536, y: 0 }
    },
    huntingBow: {
        id: "huntingBow",
        name: "Hunting Bow",
        damages: { pierce: 12 },
        requiresStats: { dex: 5 },
        range: 8,
        img: "resources/icons/weapon_bow.png",
        sprite: "bow",
        price: 10,
        weight: 0.9,
        type: "weapon",
        firesProjectile: "arrowProjectile",
        statBonus: "dex",
        grade: "common",
        slot: "weapon",
        spriteMap: { x: 1664, y: 0 }
    },
    hiisiBow: {
        id: "hiisiBow",
        name: "Hiisi Bow",
        damages: { pierce: 15 },
        requiresStats: { dex: 10 },
        range: 9,
        img: "resources/icons/hiisi_bow.png",
        sprite: "hiisiBow",
        price: 30,
        weight: 0.8,
        type: "weapon",
        firesProjectile: "arrowProjectile",
        statBonus: "dex",
        grade: "common",
        slot: "weapon",
        spriteMap: { x: 1792, y: 0 }
    },
    longBow: {
        id: "longBow",
        name: "Longbow",
        damages: { pierce: 20 },
        requiresStats: { dex: 15, str: 5 },
        range: 12,
        img: "resources/icons/longBow.png",
        sprite: "longBow",
        price: 290,
        weight: 2,
        type: "weapon",
        firesProjectile: "arrowProjectile",
        statBonus: "dex",
        grade: "uncommon",
        twoHanded: true,
        slot: "weapon",
        spriteMap: { x: 1920, y: 0 }
    },
    goldBow: {
        id: "goldBow",
        name: "Golden Bow",
        damages: { pierce: 10, magic: 8 },
        requiresStats: { dex: 12 },
        range: 12,
        img: "resources/icons/goldBow.png",
        sprite: "goldBow",
        price: 900,
        weight: 2,
        type: "weapon",
        firesProjectile: "arrowProjectile",
        statBonus: "dex",
        grade: "rare",
        slot: "weapon",
        spriteMap: { x: 2048, y: 0 }
    },
    apprenticeWand: {
        id: "apprenticeWand",
        name: "Apprentice Wand",
        damages: { magic: 10 },
        requiresStats: { int: 5 },
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
        statBonus: "int",
        grade: "common",
        slot: "weapon",
        spriteMap: { x: 2176, y: 0 }
    },
    crimsonStaff: {
        id: "crimsonStaff",
        name: "Crimson Staff",
        damages: { fire: 10, magic: 4 },
        requiresStats: { int: 10 },
        stats: {
            spellDamageP: 5,
            fireDamageP: 5
        },
        range: 7,
        img: "resources/icons/crimson_staff.png",
        sprite: "crimsonStaff",
        price: 280,
        weight: 1.7,
        type: "weapon",
        firesProjectile: "fireballProjectile",
        statBonus: "int",
        grade: "uncommon",
        slot: "weapon",
        spriteMap: { x: 2304, y: 0 }
    },
    crystalWand: {
        id: "crystalWand",
        name: "Crystal Wand",
        damages: { magic: 10, ice: 5 },
        requiresStats: { int: 15 },
        stats: {
            spellDamageP: 10,
            iceDamageP: 10
        },
        range: 9,
        img: "resources/icons/crystal_wand.png",
        sprite: "crystalWand",
        price: 800,
        weight: 1.7,
        type: "weapon",
        firesProjectile: "iceSpikedProjectile",
        statBonus: "int",
        grade: "rare",
        slot: "weapon",
        spriteMap: { x: 2432, y: 0 }
    },
    woodenShield: {
        id: "woodenShield",
        name: "Wooden Shield",
        armor: {
            physical: 10,
            magical: 7,
            elemental: 3
        },
        resistances: { fire: -5 },
        img: "resources/icons/wooden_shield.png",
        sprite: "woodenShield",
        price: 13,
        weight: 1.2,
        type: "armor",
        grade: "common",
        slot: "offhand",
        spriteMap: { x: 2560, y: 0 }
    },
    ironShield: {
        id: "ironShield",
        name: "Iron Shield",
        armor: {
            physical: 20,
            magical: 10,
            elemental: 10
        },
        resistances: { slash: 5, pierce: 2, crush: -3 },
        requiresStats: { str: 6, vit: 8 },
        img: "resources/icons/iron_shield.png",
        sprite: "ironShield",
        price: 62,
        weight: 3.1,
        type: "armor",
        grade: "uncommon",
        slot: "offhand",
        spriteMap: { x: 2688, y: 0 }
    },
    silverShield: {
        id: "silverShield",
        name: "Silver Shield",
        armor: {
            physical: 25,
            magical: 15,
            elemental: 15
        },
        resistances: { slash: 5, crush: -4, pierce: 5, lightning: -5 },
        requiresStats: { str: 7, dex: 7, vit: 7 },
        img: "resources/icons/silver_shield.png",
        sprite: "silverShield",
        price: 255,
        weight: 4.5,
        type: "armor",
        grade: "rare",
        slot: "offhand",
        spriteMap: { x: 2816, y: 0 }
    },
    parryingDagger: {
        id: "parryingDagger",
        name: "Parrying Dagger",
        requiresStats: { dex: 3 },
        img: "resources/icons/parrying_dagger.png",
        sprite: "parryingDagger",
        stats: {
            damageP: 10,
            evasionV: 3
        },
        price: 130,
        weight: 1.2,
        type: "armor",
        grade: "uncommon",
        slot: "offhand",
        spriteMap: { x: 2944, y: 0 }
    },
    raggedShirt: {
        id: "raggedShirt",
        name: "Ragged Shirt",
        armor: {
            physical: 5,
            magical: 5,
            elemental: 5
        },
        resistances: { crush: 3, fire: -2, ice: 2 },
        img: "resources/icons/ragged_shirt.png",
        sprite: "raggedShirt",
        price: 6,
        weight: 0.8,
        type: "armor",
        grade: "common",
        slot: "chest",
        spriteMap: { x: 0, y: 128 }
    },
    raggedPants: {
        id: "raggedPants",
        name: "Ragged Pants",
        armor: {
            physical: 3,
            magical: 3,
            elemental: 3
        },
        resistances: { crush: 2, fire: -1, ice: 1 },
        img: "resources/icons/ragged_pants.png",
        sprite: "raggedPants",
        price: 5,
        weight: 0.8,
        type: "armor",
        grade: "common",
        slot: "legs",
        spriteMap: { x: 128, y: 128 }
    },
    raggedBoots: {
        id: "raggedBoots",
        name: "Ragged Boots",
        armor: {
            physical: 2,
            magical: 2,
            elemental: 2
        },
        resistances: { crush: 1, fire: -1, ice: 1 },
        img: "resources/icons/ragged_boots.png",
        sprite: "raggedBoots",
        price: 4,
        weight: 0.2,
        type: "armor",
        grade: "common",
        slot: "boots",
        spriteMap: { x: 256, y: 128 }
    },
    raggedGloves: {
        id: "raggedGloves",
        name: "Ragged Gloves",
        armor: {
            physical: 2,
            magical: 2,
            elemental: 2
        },
        resistances: { crush: 1, fire: -1, ice: 1 },
        img: "resources/icons/gloves.png",
        sprite: "raggedGloves",
        price: 3,
        weight: 0.15,
        type: "armor",
        grade: "common",
        slot: "gloves",
        spriteMap: { x: 384, y: 128 }
    },
    enchantedCap: {
        id: "enchantedCap",
        name: "Enchanted Cap of Untold Skeletal Might",
        armor: {
            physical: 100,
            magical: 100,
            elemental: 100
        },
        resistances: { slash: 70, crush: 70, pierce: 70, magic: 70, fire: 70, ice: 70, dark: 70, divine: 70, lightning: 70 },
        stats: {
            dexP: 200,
            strP: 200,
            vitP: 200,
            intV: 100,
            cunV: -25
        },
        coversHair: true,
        img: "resources/icons/kas_dj.png",
        sprite: "kasDJ",
        price: 25000,
        weight: 0.1,
        type: "armor",
        grade: "legendary",
        slot: "helmet",
        spriteMap: { x: 512, y: 128 }
    },
    raggedHood: {
        id: "raggedHood",
        name: "Ragged Hood",
        armor: {
            physical: 2,
            magical: 2,
            elemental: 2
        },
        resistances: { crush: 1, fire: -2, ice: 1 },
        coversHair: true,
        img: "resources/icons/ragged_hood.png",
        sprite: "raggedHood",
        price: 5,
        weight: 0.2,
        type: "armor",
        grade: "common",
        slot: "helmet",
        spriteMap: { x: 640, y: 128 }
    },
    woolHat: {
        id: "woolHat",
        name: "Wool Hat",
        armor: {
            physical: 3,
            magical: 2,
            elemental: 2
        },
        resistances: { crush: 2, fire: -1, ice: 5 },
        coversHair: false,
        img: "resources/icons/wool_hat.png",
        sprite: "woolHat",
        price: 10,
        weight: 0.15,
        type: "armor",
        grade: "common",
        slot: "helmet",
        spriteMap: { x: 768, y: 128 }
    },
    leatherChest: {
        id: "leatherChest",
        name: "Leather Chest",
        armor: {
            physical: 15,
            magical: 10,
            elemental: 10
        },
        resistances: { crush: 4 },
        img: "resources/icons/leather_chest.png",
        sprite: "leatherChest",
        price: 50,
        weight: 1.7,
        type: "armor",
        grade: "common",
        slot: "chest",
        spriteMap: { x: 896, y: 128 }
    },
    leatherLeggings: {
        id: "leatherLeggings",
        name: "Leather Leggings",
        armor: {
            physical: 10,
            magical: 7,
            elemental: 7
        },
        resistances: { crush: 3 },
        img: "resources/icons/leather_leg_bracers.png",
        sprite: "leatherLeggings",
        price: 45,
        weight: 1.5,
        type: "armor",
        grade: "common",
        slot: "legs",
        spriteMap: { x: 1024, y: 128 }
    },
    leatherBracers: {
        id: "leatherBracers",
        name: "Leather Bracers",
        armor: {
            physical: 5,
            magical: 4,
            elemental: 4
        },
        resistances: { crush: 2 },
        img: "resources/icons/leather_bracers.png",
        sprite: "leatherBracers",
        price: 25,
        weight: 0.65,
        type: "armor",
        grade: "common",
        slot: "gloves",
        spriteMap: { x: 1152, y: 128 }
    },
    leatherHelmet: {
        id: "leatherHelmet",
        name: "Leather Helmet",
        armor: {
            physical: 5,
            magical: 4,
            elemental: 4
        },
        resistances: { crush: 2 },
        coversHair: true,
        img: "resources/icons/leather_helmet.png",
        sprite: "leatherHelmet",
        price: 30,
        weight: 0.5,
        type: "armor",
        grade: "common",
        slot: "helmet",
        spriteMap: { x: 1280, y: 128 }
    },
    leatherBoots: {
        id: "leatherBoots",
        name: "Leather Booots",
        armor: {
            physical: 5,
            magical: 4,
            elemental: 4
        },
        resistances: { crush: 2 },
        img: "resources/icons/leather_boots.png",
        sprite: "leatherBoots",
        price: 25,
        weight: 0.75,
        type: "armor",
        grade: "common",
        slot: "boots",
        spriteMap: { x: 1408, y: 128 }
    },
    initiateRobe: {
        id: "initiateRobe",
        name: "Initiate Robe",
        armor: {
            physical: 10,
            magical: 15,
            elemental: 5
        },
        img: "resources/icons/initiate_robe.png",
        sprite: "initiateRobe",
        price: 60,
        weight: 1,
        type: "armor",
        grade: "common",
        slot: "chest",
        spriteMap: { x: 2560, y: 128 }
    },
    initiatePants: {
        id: "initiatePants",
        name: "Initiate Pants",
        armor: {
            physical: 7,
            magical: 13,
            elemental: 4
        },
        img: "resources/icons/initiate_pants.png",
        sprite: "initiatePants",
        price: 45,
        weight: 0.7,
        type: "armor",
        grade: "common",
        slot: "legs",
        spriteMap: { x: 2688, y: 128 }
    },
    initiateHood: {
        id: "initiateHood",
        name: "Initiate Hood",
        armor: {
            physical: 5,
            magical: 8,
            elemental: 2
        },
        coversHair: true,
        img: "resources/icons/initiate_hood.png",
        sprite: "initiateHood",
        price: 25,
        weight: 0.5,
        type: "armor",
        grade: "common",
        slot: "helmet",
        spriteMap: { x: 2816, y: 128 }
    },
    initiateGloves: {
        id: "initiateGloves",
        name: "Initiate Gloves",
        armor: {
            physical: 4,
            magical: 5,
            elemental: 2
        },
        img: "resources/icons/initiate_gloves.png",
        sprite: "initiateGloves",
        price: 20,
        weight: 0.6,
        type: "armor",
        grade: "common",
        slot: "gloves",
        spriteMap: { x: 2944, y: 128 }
    },
    initiateShoes: {
        id: "initiateShoes",
        name: "Initiate Shoes",
        armor: {
            physical: 4,
            magical: 5,
            elemental: 2
        },
        img: "resources/icons/initiate_shoes.png",
        sprite: "initiateShoes",
        price: 20,
        weight: 1.1,
        type: "armor",
        grade: "common",
        slot: "boots",
        spriteMap: { x: 0, y: 256 }
    },
    apprenticeRobe: {
        id: "apprenticeRobe",
        name: "Apprentice Robe",
        armor: {
            physical: 25,
            magical: 30,
            elemental: 25
        },
        stats: {
            regenMpP: 15,
            spellDamageP: 5
        },
        resistances: { fire: 2, ice: 2, lightning: 2 },
        img: "resources/icons/apprentice_robe.png",
        sprite: "apprenticeRobe",
        price: 500,
        weight: 2.1,
        type: "armor",
        grade: "uncommon",
        slot: "chest",
        spriteMap: { x: 1536, y: 128 }
    },
    apprenticePants: {
        id: "apprenticePants",
        name: "Apprentice Pants",
        armor: {
            physical: 15,
            magical: 20,
            elemental: 15
        },
        stats: {
            mpMaxP: 10,
            spellDamageP: 5
        },
        resistances: { slash: -3, fire: 2, ice: 2, lightning: 2 },
        img: "resources/icons/apprentice_pants.png",
        sprite: "apprenticePants",
        price: 400,
        weight: 1.5,
        type: "armor",
        grade: "uncommon",
        slot: "legs",
        spriteMap: { x: 1664, y: 128 }
    },
    apprenticeBoots: {
        id: "apprenticeBoots",
        name: "Apprentice Boots",
        armor: {
            physical: 10,
            magical: 15,
            elemental: 10
        },
        stats: {
            spellDamageP: 5
        },
        resistances: { slash: -2, fire: 1, ice: 1, lightning: 1 },
        img: "resources/icons/apprentice_boots.png",
        sprite: "apprenticeBoots",
        price: 250,
        weight: 0.2,
        type: "armor",
        grade: "uncommon",
        slot: "boots",
        spriteMap: { x: 1792, y: 128 }
    },
    ironArmor: {
        id: "ironArmor",
        name: "Iron Armour",
        armor: {
            physical: 30,
            magical: 15,
            elemental: 12
        },
        resistances: { slash: 5, crush: -5, lightning: -5 },
        requiresStats: { str: 12 },
        img: "resources/icons/iron_armor.png",
        sprite: "ironArmor",
        price: 200,
        weight: 10.5,
        type: "armor",
        grade: "uncommon",
        slot: "chest",
        spriteMap: { x: 1920, y: 128 }
    },
    ironLegplates: {
        id: "ironLegplates",
        name: "Iron Legplates",
        armor: {
            physical: 24,
            magical: 12,
            elemental: 10
        },
        resistances: { slash: 4, crush: -4, lightning: -4 },
        requiresStats: { str: 12 },
        img: "resources/icons/iron_leg_plates.png",
        sprite: "ironLegplates",
        price: 150,
        weight: 5.25,
        type: "armor",
        grade: "uncommon",
        slot: "legs",
        spriteMap: { x: 2048, y: 128 }
    },
    ironHelmet: {
        id: "ironHelmet",
        name: "Iron Helmet",
        armor: {
            physical: 15,
            magical: 10,
            elemental: 8
        },
        resistances: { slash: 3, crush: -3, lightning: -3 },
        requiresStats: { str: 8 },
        coversHair: true,
        img: "resources/icons/iron_helmet.png",
        sprite: "ironHelmet",
        price: 100,
        weight: 3,
        type: "armor",
        grade: "uncommon",
        slot: "helmet",
        spriteMap: { x: 2176, y: 128 }
    },
    ironGauntlets: {
        id: "ironGauntlets",
        name: "Iron Gauntlets",
        armor: {
            physical: 15,
            magical: 10,
            elemental: 8
        },
        resistances: { slash: 3, crush: -3, lightning: -3 },
        requiresStats: { str: 8 },
        img: "resources/icons/iron_gauntlets.png",
        sprite: "ironGauntlets",
        price: 95,
        weight: 3.5,
        type: "armor",
        grade: "uncommon",
        slot: "gloves",
        spriteMap: { x: 2304, y: 128 }
    },
    ironBoots: {
        id: "ironBoots",
        name: "Iron Boots",
        armor: {
            physical: 15,
            magical: 10,
            elemental: 8
        },
        resistances: { slash: 3, crush: -3, lightning: -3 },
        requiresStats: { str: 8 },
        img: "resources/icons/iron_boots.png",
        sprite: "ironBoots",
        price: 95,
        weight: 4.5,
        type: "armor",
        grade: "uncommon",
        slot: "boots",
        spriteMap: { x: 2432, y: 128 }
    },
    rangerArmor: {
        id: "rangerArmor",
        name: "Ranger Armour",
        armor: {
            physical: 40,
            magical: 15,
            elemental: 15
        },
        resistances: { slash: 5, crush: 5 },
        requiresStats: { vit: 8 },
        img: "resources/icons/ranger_armor.png",
        sprite: "rangerArmor",
        price: 1200,
        weight: 6,
        type: "armor",
        grade: "uncommon",
        slot: "chest",
        spriteMap: { x: 2560, y: 128 }
    },
    rangerPants: {
        id: "rangerPants",
        name: "Ranger Pants",
        armor: {
            physical: 30,
            magical: 10,
            elemental: 10
        },
        resistances: { slash: 2, pierce: 5, crush: 2 },
        requiresStats: { vit: 8 },
        img: "resources/icons/ranger_pants.png",
        sprite: "rangerPants",
        price: 800,
        weight: 3.5,
        type: "armor",
        grade: "uncommon",
        slot: "legs",
        spriteMap: { x: 2688, y: 128 }
    },
    rangerHood: {
        id: "rangerHood",
        name: "Ranger Hood",
        armor: {
            physical: 20,
            magical: 10,
            elemental: 10
        },
        resistances: { slash: 2, crush: 3 },
        requiresStats: { vit: 5 },
        coversHair: true,
        img: "resources/icons/ranger_hood.png",
        sprite: "rangerHood",
        price: 600,
        weight: 1.25,
        type: "armor",
        grade: "uncommon",
        slot: "helmet",
        spriteMap: { x: 2816, y: 128 }
    },
    rangerGloves: {
        id: "rangerGloves",
        name: "Ranger Gloves",
        armor: {
            physical: 18,
            magical: 8,
            elemental: 8
        },
        resistances: { slash: 1, pierce: 3, crush: 1 },
        requiresStats: { vit: 4 },
        img: "resources/icons/ranger_gloves.png",
        sprite: "rangerGloves",
        price: 500,
        weight: 1.5,
        type: "armor",
        grade: "uncommon",
        slot: "gloves",
        spriteMap: { x: 2944, y: 128 }
    },
    rangerBoots: {
        id: "rangerBoots",
        name: "Ranger Boots",
        armor: {
            physical: 18,
            magical: 8,
            elemental: 8
        },
        resistances: { slash: 1, pierce: 3, crush: 1 },
        requiresStats: { vit: 4 },
        img: "resources/icons/ranger_boots.png",
        sprite: "rangerBoots",
        price: 500,
        weight: 2.5,
        type: "armor",
        grade: "uncommon",
        slot: "boots",
        spriteMap: { x: 0, y: 256 }
    },
    crownOfWisdom: {
        id: "crownOfWisdom",
        name: "Crown of Wisdom",
        armor: {
            physical: 0,
            magical: 30,
            elemental: 0
        },
        requiresStats: { int: 6 },
        stats: {
            magicDamageP: 10
        },
        img: "resources/icons/crown_of_wisdom.png",
        sprite: "crownOfWisdom",
        price: 500,
        weight: 0.5,
        type: "armor",
        grade: "rare",
        slot: "helmet",
        spriteMap: { x: 128, y: 256 }
    },
    lichRobes: {
        id: "lichRobes",
        name: "Lich Robes",
        armor: {
            physical: 5,
            magical: 25,
            elemental: 10
        },
        requiresStats: { int: 12 },
        img: "resources/icons/lich_robes.png",
        sprite: "lichRobes",
        price: 305,
        weight: 4.5,
        type: "armor",
        grade: "uncommon",
        slot: "chest",
        spriteMap: { x: 256, y: 256 }
    },
    knightArmor: {
        id: "knightArmor",
        name: "Knight Armour",
        armor: {
            physical: 40,
            magical: 10,
            elemental: 20
        },
        resistances: { slash: 5, crush: -10 },
        requiresStats: { vit: 10, str: 12 },
        img: "resources/icons/knight_armor.png",
        sprite: "knightArmor",
        price: 800,
        weight: 14.5,
        type: "armor",
        grade: "rare",
        slot: "chest",
        spriteMap: { x: 384, y: 256 }
    },
    knightGreaves: {
        id: "knightGreaves",
        name: "Knight Greaves",
        armor: {
            physical: 25,
            magical: 10,
            elemental: 15
        },
        resistances: { slash: 5, crush: -5 },
        requiresStats: { vit: 10, str: 12 },
        img: "resources/icons/knight_greaves.png",
        sprite: "knightGreaves",
        price: 525,
        weight: 7.5,
        type: "armor",
        grade: "rare",
        slot: "legs",
        spriteMap: { x: 512, y: 256 }
    },
    greathelm: {
        id: "greathelm",
        name: "Greathelm",
        armor: {
            physical: 20,
            magical: 5,
            elemental: 10
        },
        requiresStats: { vit: 6, str: 8 },
        coversHair: true,
        img: "resources/icons/great_helm.png",
        sprite: "greatHelm",
        price: 300,
        weight: 4.5,
        type: "armor",
        grade: "rare",
        slot: "helmet",
        spriteMap: { x: 640, y: 256 }
    },
    knightGauntlets: {
        id: "knightGauntlets",
        name: "Knight Gauntlets",
        armor: {
            physical: 20,
            magical: 5,
            elemental: 10
        },
        requiresStats: { vit: 6, str: 8 },
        img: "resources/icons/knight_gloves.png",
        sprite: "knightGauntlets",
        price: 250,
        weight: 3.75,
        type: "armor",
        grade: "rare",
        slot: "gloves",
        spriteMap: { x: 768, y: 256 }
    },
    knightSabatons: {
        id: "knightSabatons",
        name: "Knight Sabatons",
        armor: {
            physical: 20,
            magical: 5,
            elemental: 10
        },
        requiresStats: { vit: 6, str: 8 },
        img: "resources/icons/knight_sabatons.png",
        sprite: "knightSabatons",
        price: 250,
        weight: 5,
        type: "armor",
        grade: "rare",
        slot: "boots",
        spriteMap: { x: 896, y: 256 }
    },
    talismanOfProtection: {
        id: "talismanOfProtection",
        name: "Talisman of Protection",
        stats: {
            hpMaxV: 10,
            resistAllV: 3
        },
        img: "resources/icons/talisman_of_protection.png",
        price: 60,
        weight: 0.25,
        artifactSet: "defender",
        type: "artifact",
        grade: "uncommon",
        slot: "artifact1",
        spriteMap: { x: 1024, y: 256 }
    },
    emblemOfProtection: {
        id: "emblemOfProtection",
        name: "Emblem of Protection",
        stats: {
            hpMaxV: 5,
            evasionV: 3
        },
        img: "resources/icons/emblem_of_protection.png",
        price: 60,
        weight: 0.25,
        artifactSet: "defender",
        type: "artifact",
        grade: "uncommon",
        slot: "artifact2",
        spriteMap: { x: 1152, y: 256 }
    },
    ringOfProtection: {
        id: "ringOfProtection",
        name: "Ring of Protection",
        stats: {
            resistAllV: 5
        },
        img: "resources/icons/ring_of_protection.png",
        price: 60,
        weight: 0.25,
        artifactSet: "defender",
        type: "artifact",
        grade: "uncommon",
        slot: "artifact3",
        spriteMap: { x: 1280, y: 256 }
    },
    scholarsTalisman: {
        id: "scholarsTalisman",
        name: "Scholars Lucky Talisman",
        stats: {
            mpMaxV: 5,
            magicDamageP: 3
        },
        img: "resources/icons/scholars_talisman.png",
        price: 60,
        weight: 0.25,
        artifactSet: "scholar",
        type: "artifact",
        grade: "uncommon",
        slot: "artifact1",
        spriteMap: { x: 1408, y: 256 }
    },
    scholarsEmblem: {
        id: "scholarsEmblem",
        name: "Emblem of the Scholar",
        stats: {
            mpMaxP: 6,
            hpMaxV: 3
        },
        img: "resources/icons/emblem_of_scholar.png",
        price: 60,
        weight: 0.25,
        artifactSet: "scholar",
        type: "artifact",
        grade: "uncommon",
        slot: "artifact2",
        spriteMap: { x: 1536, y: 256 }
    },
    scholarsRing: {
        id: "scholarsRing",
        name: "Scholars Enchanted Ring",
        stats: {
            mpMaxV: 5,
            magicResistV: 8
        },
        img: "resources/icons/scholars_ring.png",
        price: 60,
        weight: 0.25,
        artifactSet: "scholar",
        type: "artifact",
        grade: "uncommon",
        slot: "artifact3",
        spriteMap: { x: 1664, y: 256 }
    },
    warriorsTalisman: {
        id: "warriorsTalisman",
        name: "Talisman of an Exalted Warrior",
        stats: {
            damageP: 3,
            strV: 3
        },
        img: "resources/icons/warrior_talisman.png",
        price: 60,
        weight: 0.25,
        artifactSet: "warrior",
        type: "artifact",
        grade: "uncommon",
        slot: "artifact1",
        spriteMap: { x: 1792, y: 256 }
    },
    warriorsEmblem: {
        id: "warriorsEmblem",
        name: "Exalted Warriors Emblem",
        stats: {
            hpMaxV: 8,
            cunV: 2
        },
        img: "resources/icons/warrior_emblem.png",
        price: 60,
        weight: 0.25,
        artifactSet: "warrior",
        type: "artifact",
        grade: "uncommon",
        slot: "artifact2",
        spriteMap: { x: 1920, y: 256 }
    },
    warriorsRing: {
        id: "warriorsRing",
        name: "Ring of a Warrior",
        stats: {
            attack_damage_multiplierP: 7,
            strV: 1,
            vitV: 1
        },
        img: "resources/icons/warrior_ring.png",
        price: 60,
        weight: 0.25,
        artifactSet: "warrior",
        type: "artifact",
        grade: "uncommon",
        slot: "artifact3",
        spriteMap: { x: 2048, y: 256 }
    },
    loneShadesTalisman: {
        id: "loneShadesTalisman",
        name: "Lone Shades Star Talisman",
        stats: {
            dexV: 3,
            hpMaxV: 2
        },
        img: "resources/icons/lone_shades_star_talisman.png",
        price: 60,
        weight: 0.25,
        artifactSet: "loneShade",
        type: "artifact",
        grade: "uncommon",
        slot: "artifact1",
        spriteMap: { x: 2176, y: 256 }
    },
    loneShadesEmblem: {
        id: "loneShadesEmblem",
        name: "Emblem of the Lone Shade",
        stats: {
            cunV: 3,
            evasionV: 2
        },
        img: "resources/icons/emblem_of_the_lone_shade.png",
        price: 60,
        weight: 0.25,
        artifactSet: "loneShade",
        type: "artifact",
        grade: "uncommon",
        slot: "artifact2",
        spriteMap: { x: 2304, y: 256 }
    },
    loneShadesRing: {
        id: "loneShadesRing",
        name: "Creeping Ring of the Lone Shade",
        stats: {
            damageP: 6,
            vitV: 2
        },
        img: "resources/icons/creeping_ring_of_the_lone_shade.png",
        price: 60,
        weight: 0.25,
        artifactSet: "loneShade",
        type: "artifact",
        grade: "uncommon",
        slot: "artifact3",
        spriteMap: { x: 2432, y: 256 }
    },
    huntersTalisman: {
        id: "huntersTalisman",
        name: "Old Hunters Talisman",
        stats: {
            dexV: 2,
            hpMaxV: 5
        },
        img: "resources/icons/hunter_talisman.png",
        price: 60,
        weight: 0.25,
        artifactSet: "hunter",
        type: "artifact",
        grade: "uncommon",
        slot: "artifact1",
        spriteMap: { x: 2560, y: 256 }
    },
    huntersEmblem: {
        id: "huntersEmblem",
        name: "Emblem of the Old Hunter",
        stats: {
            vitV: 2,
            hitChanceV: 5
        },
        img: "resources/icons/hunter_emblem.png",
        price: 60,
        weight: 0.25,
        artifactSet: "hunter",
        type: "artifact",
        grade: "uncommon",
        slot: "artifact2",
        spriteMap: { x: 2688, y: 256 }
    },
    huntersRing: {
        id: "huntersRing",
        name: "Valued Ring of the Old Hunter",
        stats: {
            dexV: 2,
            strV: 2
        },
        img: "resources/icons/hunter_ring.png",
        price: 60,
        weight: 0.25,
        artifactSet: "hunter",
        type: "artifact",
        grade: "uncommon",
        slot: "artifact3",
        spriteMap: { x: 2816, y: 256 }
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
        usesRemaining: 3,
        spriteMap: { x: 2944, y: 256 }
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
        usesRemaining: 3,
        spriteMap: { x: 0, y: 384 }
    },
    healingPotion_weak: {
        id: "healingPotion_weak",
        name: "Weak Healing Potion",
        img: "resources/icons/healing_potion.png",
        sprite: "",
        price: 120,
        weight: 0.15,
        type: "consumable",
        grade: "common",
        slot: "",
        equippedSlot: -1,
        healValue: 50,
        stacks: true,
        spriteMap: { x: 128, y: 384 }
    },
    manaPotion_weak: {
        id: "manaPotion_weak",
        name: "Weak Mana Potion",
        img: "resources/icons/mana_potion.png",
        sprite: "",
        price: 120,
        weight: 0.15,
        type: "consumable",
        grade: "common",
        slot: "",
        equippedSlot: -1,
        manaValue: 40,
        stacks: true,
        spriteMap: { x: 256, y: 384 }
    }
};
//# sourceMappingURL=items.js.map