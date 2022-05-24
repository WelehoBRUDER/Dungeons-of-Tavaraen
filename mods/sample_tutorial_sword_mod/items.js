const items = {};

items.sword = {
  id: "sword", // Unique ID, must match the key in items object
  name: "Sword", // This is the item name in english
  damages: { slash: 5, pierce: 5 }, // This is the damage dealt by the item
  range: 1, // This is the attack range of the item in tiles
  img: "/icons/sword.png", // This is the path to the item icon
  sprite: "/sprites/sword.png", // This is the path to the item sprite
  price: 10, // This is the price of the item
  weight: 1.7, // This is the weight of the item
  type: "weapon", // This is the item type (weapon, armor, consumable, artifact)
  statBonus: "str", // Determine which stat improves the damage of this weapon
  grade: "common", // This is the item grade (common, uncommon, rare, mythical, legendary)
  slot: "weapon", // Which slot the item can be equipped in
};
