interface icons {
  [melee: string]: string;
}

const icons = {
  melee: "resources/icons/melee_icon.png",
  ranged: "resources/icons/ranged_icon.png",
  resistance: "resources/icons/resistance_icon.png",
  rp: "resources/icons/resistance_penetration.png",
  fireResist_icon: "resources/icons/fire_resistance_icon.png",
  iceResist_icon: "resources/icons/ice_resist_icon.png",
  rp_icon: "resources/icons/resistance_penetration_icon.png",
  resistance_penetration_icon: "resources/icons/resistance_penetration_icon.png",
  gold_icon: "resources/icons/gold_icon.png",
  fire: "resources/icons/fire_icon.png",
  fire_icon: "resources/icons/fire_icon.png",
  fireDamage_icon: "resources/icons/fire_icon.png",
  dark_icon: "resources/icons/dark_icon.png",
  divine_icon: "resources/icons/divine_icon.png",
  lightning_icon: "resources/icons/lightning_icon.png",
  poison: "resources/icons/poison_icon.png",
  rage: "resources/icons/rage_icon.png",
  berserk: "resources/icons/berserk_icon.png",
  dazed: "resources/icons/dazed_icon.png",
  range: "resources/icons/use_range.png",
  range_icon: "resources/icons/use_range_icon.png",
  use_range_icon: "resources/icons/use_range_icon.png",
  damage: "resources/icons/damage.png",
  damage_icon: "resources/icons/damage_icon.png",
  damage_multiplier_icon: "resources/icons/damage_icon.png",
  heal: "resources/icons/healing.png",
  heal_icon: "resources/icons/healing_icon.png",
  base_heal_icon: "resources/icons/healing_icon.png",
  cooldown: "resources/icons/cooldown.png",
  cooldown_icon: "resources/icons/cooldown_icon.png",
  last_icon: "resources/icons/cooldown_icon.png",
  health: "resources/icons/health.png",
  health_icon: "resources/icons/health_icon.png",
  hpMax_icon: "resources/icons/health_icon.png",
  mana: "resources/icons/mana.png",
  mana_icon: "resources/icons/mana_icon.png",
  mana_cost_icon: "resources/icons/mana_icon.png",
  mpMax_icon: "resources/icons/mana_icon.png",
  silence: "resources/icons/silence.png",
  silence_icon: "resources/icons/silence_icon.png",
  dex: "resources/icons/dexterity.png",
  dex_icon: "resources/icons/dexterity_icon.png",
  str: "resources/icons/strength.png",
  str_icon: "resources/icons/strength_icon.png",
  int: "resources/icons/intelligence.png",
  int_icon: "resources/icons/intelligence_icon.png",
  vit: "resources/icons/vitality.png",
  vit_icon: "resources/icons/vitality_icon.png",
  cun: "resources/icons/cunning.png",
  cun_icon: "resources/icons/cunning_icon.png",
  crush: "resources/icons/crush.png",
  crush_icon: "resources/icons/crush_icon.png",
  crushResist_icon: "resources/icons/crush_resist_icon.png",
  slash: "resources/icons/slash.png",
  slash_icon: "resources/icons/slash_icon.png",
  slashResist_icon: "resources/icons/slash_resist_icon.png",
  pierce: "resources/icons/pierce.png",
  pierce_icon: "resources/icons/pierce_icon.png",
  pierceResist_icon: "resources/icons/pierce_resist_icon.png",
  ice: "resources/icons/ice.png",
  ice_icon: "resources/icons/ice_icon.png",
  concentration: "resources/icons/concentration.png",
  concentration_icon: "resources/icons/concentration_icon.png",
  break_concentration: "resources/icons/break_concentration.png",
  break_concentration_icon: "resources/icons/break_concentration_icon.png",
  sight: "resources/icons/eye_open.png",
  sight_icon: "resources/icons/sight_icon.png",
  blight: "resources/icons/blighted.png",
  blight_icon: "resoures/icons/blighted_icon.png",
} as icons;

const tiles = [
  {
    name: "Water",
    img: "resources/tiles/water.png",
    sprite: ".tile0",
    isLedge: true,
    isWall: false
  },
  {
    name: "Grass",
    img: "resources/tiles/grass.png",
    sprite: ".tile1",
    isLedge: false,
    isWall: false
  },
  {
    name: "Dirt",
    img: "resources/tiles/dirt.png",
    sprite: ".tile2",
    isLedge: false,
    isWall: false
  },
  {
    name: "Pond",
    img: "resources/tiles/pond_water.png",
    sprite: ".tile3",
    isLedge: false,
    isWall: false
  },
  {
    name: "Gravel",
    img: "resources/tiles/gravel.png",
    sprite: ".tile4",
    isLedge: false,
    isWall: false
  },
  {
    name: "Cobble",
    img: "resources/tiles/cobble_flooring.png",
    sprite: ".tile5",
    isLedge: false,
    isWall: false
  },
  {
    name: "Dungeon Wall",
    img: "resources/tiles/dungeon_wall.png",
    sprite: ".tile6",
    isLedge: false,
    isWall: true
  },
];

const clutters = [
  {
    name: "Nothing",
    img: "resources/tiles/void.png",
    sprite: ".tileVOID",
    isWall: false
  },
  {
    name: "Tree 1",
    img: "resources/tiles/tree_1.png",
    sprite: ".clutter1",
    isWall: true,
  },
  {
    name: "Tree 2",
    img: "resources/tiles/tree_2.png",
    sprite: ".clutter2",
    isWall: true
  }
];