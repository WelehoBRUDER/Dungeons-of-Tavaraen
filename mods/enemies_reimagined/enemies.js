const enemies = {};

enemies.norsemanBerserk = {
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
    mpMax: 0,
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
    ice: 0,
  },
  statusResistances: {
    poison: 25,
    burning: 0,
    curse: 0,
    stun: 0,
    bleed: 0,
  },
  damages: {
    slash: 4,
    pierce: 3,
  },
  hit: {
    chance: 60,
    evasion: 20,
  },
  threat: 25,
  retreatLimit: 25, // when enemy has this % hp left, it runs away from the player once.
  alive: true,
  xp: 37,
  sprite: "norsemanBerserk",
  type: "barbarian",
  race: "human",
  img: "/enemy_sprites/norseman_berserk.png",
  aggroRange: 8,
  attackRange: 1,
  canFly: false,
  abilities: [
    new Ability(abilities.attack, dummy),
    new Ability(abilities.charge, dummy),
  ],
  traits: [
    { id: "no_natural_regen" },
    { id: "weaker_natural_ability" },
    { id: "magically_impotent" },
  ],
  levelingTemplate: "berserker_melee",
  loot: [
    { type: "weapon", amount: [1, 1], item: "chippedAxe", chance: 15 },
    { type: "weapon", amount: [1, 1], item: "stick", chance: 20 },
    { type: "gold", amount: [6, 18] },
  ],
};