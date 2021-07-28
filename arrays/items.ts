interface grades {
  [common: string]: any;
  uncommon: any;
  rare: any;
  mythical: any;
  legendary: any;
}

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
} as grades;

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
    range: 1,
    img: "resources/icons/weapon_blade.png",
    sprite: "blade",
    price: 60,
    weight: 2.4,
    type: "weapon",
    grade: "uncommon",
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
    resistances: { slash: 1, crush: 5, pierce: 2, fire: -2, ice: 2 },
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
      { type: "strP", value: [3, 5, 8], chance: 10 },
      { type: "dexV", value: [1, 2, 3], chance: 1.75 },
      { type: "dexP", value: [3, 5, 7], chance: 1.5 },
      { type: "vitV", value: [1, 2, 4], chance: 20 },
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
}