interface _abb {
  [string: string]: any;
}

const abilities = {
  attack: {
    id: "attack",
    name: "Attack",
    mana_cost: 0,
    cooldown: 0,
    damage_multiplier: 1,
    resistance_penetration: 0,
    type: "attack",
    icon: "resources/icons/atk.png",
    action_desc: "attacks",
    action_desc_pl: "attack",
    use_range: "weapon_range",
  },
  focus_strike: {
    id: "focus_strike",
    name: "Focused Strike",
    mana_cost: 0,
    cooldown: 7,
    damage_multiplier: 1.5,
    resistance_penetration: 0,
    type: "attack",
    requires_melee_weapon: true,
    action_desc: "focuse strikes",
    action_desc_pl: "focus strike",
    requires_concentration: true,
    icon: "resources/icons/focus_strike.png",
    use_range: "1",
    ai_chance: 3
  },
  true_shot: {
    id: "true_shot",
    name: "True Shot",
    mana_cost: 0,
    cooldown: 7,
    damage_multiplier: 1.6,
    resistance_penetration: 0,
    type: "attack",
    requires_ranged_weapon: true,
    action_desc: "casts True shot on",
    action_desc_pl: "cast True Shot on",
    requires_concentration: true,
    icon: "resources/icons/true_shot.png",
    shoots_projectile: "arrowChargedProjectile",
    use_range: "10",
    ai_chance: 3
  },
  venomous_blow: {
    id: "venomous_blow",
    name: "Venomous Blow",
    mana_cost: 0,
    cooldown: 12,
    damage_multiplier: 0.8,
    resistance_penetration: 0,
    type: "attack",
    status: "venom",
    status_power: 60,
    requires_melee_weapon: true,
    action_desc: "blows venom",
    action_desc_pl: "blow venom",
    requires_concentration: true,
    icon: "resources/icons/venomous_blow.png",
    use_range: "1",
    ai_chance: 5
  },
  poisoned_arrow: {
    id: "poisoned_arrow",
    name: "Poisoned Arrow",
    mana_cost: 0,
    cooldown: 15,
    damage_multiplier: 1.1,
    resistance_penetration: 0,
    type: "attack",
    requires_ranged_weapon: true,
    status: "poison",
    status_power: 40,
    action_desc: "shoots a poisoned arrow at",
    action_desc_pl: "shoot a poisoned arrow at",
    requires_concentration: true,
    icon: "resources/icons/poison_arrow.png",
    shoots_projectile: "arrowPoisonedProjectile",
    use_range: "11",
    ai_chance: 3
  },
  first_aid: {
    id: "first_aid",
    name: "First Aid",
    mana_cost: 0,
    cooldown: 10,
    base_heal: 25,
    damage_multiplier: 0,
    type: "heal",
    action_desc: "performs first aid",
    action_desc_pl: "perform first aid",
    requires_concentration: true,
    icon: "resources/icons/first_aid.png",
    recharge_only_in_combat: true,
    use_range: "0",
    self_target: true,
    ai_chance: 1
  },
  battle_fury: {
    id: "battle_fury",
    name: "Battle Fury",
    mana_cost: 0,
    cooldown: 18,
    damage_multiplier: 0,
    type: "buff",
    action_desc: "becomes furious",
    action_desc_pl: "concentrate on your growing fury, improving your abilities!",
    icon: "resources/icons/fighters_rage.png",
    line: "Haaaaa!!",
    status: "battle_fury",
    use_range: "0",
    self_target: true,
    ai_chance: 2
  },
  barbarian_rage: {
    id: "barbarian_rage",
    name: "Barbarian Rage",
    mana_cost: 0,
    cooldown: 25,
    damage_multiplier: 0,
    type: "buff",
    action_desc: "flies into a barbaric rage!",
    action_desc_pl: "fill your mind with nothing but rage at the bastard enemies you face!",
    icon: "resources/icons/rage.png",
    line: "RAAAGHH!!!",
    status: "rage",
    use_range: "0",
    self_target: true,
    ai_chance: 2
  },
  berserk: {
    id: "berserk",
    name: "Berserk",
    mana_cost: 0,
    cooldown: 21,
    damage_multiplier: 0,
    type: "buff",
    action_desc: "throws all caution to the wind, going fully berserk!",
    action_desc_pl: "throw away all thoughts of defense, and go berserk!",
    icon: "resources/icons/berserk.png",
    line: "RAAAAAAHHHHH!!!!!",
    status: "berserk",
    use_range: "0",
    self_target: true,
    ai_chance: 2
  },
  ward_of_aurous: {
    id: "ward_of_aurous",
    name: "Ward of Aurous",
    mana_cost: 20,
    cooldown: 12,
    damage_multiplier: 0,
    type: "buff",
    remove_status: ["burning"],
    action_desc: "wards themself",
    action_desc_pl: "ward yourself",
    icon: "resources/icons/shield_of_aurous.png",
    line: "[SHIELDED]",
    status: "ward_of_aurous",
    use_range: "0",
    self_target: true,
    ai_chance: 3
  },
  icy_javelin: {
    id: "icy_javelin",
    name: "Icy Javelin",
    mana_cost: 15,
    cooldown: 1,
    damages: {
      pierce: 5,
      ice: 10
    },
    stat_bonus: "int",
    damage_multiplier: 0.9,
    resistance_penetration: 10,
    type: "attack",
    action_desc: "shoots a javelin made of ice at",
    action_desc_pl: "shoot a javelin made of ice at",
    icon: "resources/icons/ice_javelin.png",
    shoots_projectile: "iceSpikedProjectile",
    use_range: "9",
    ai_chance: 2
  },
  piercing_mana_bolt: {
    id: "piercing_mana_bolt",
    name: "Piercing Mana Bolt",
    mana_cost: 10,
    cooldown: 0,
    damages: {
      pierce: 3,
      magic: 10
    },
    stat_bonus: "int",
    damage_multiplier: 1,
    resistance_penetration: 0,
    type: "attack",
    action_desc: "shoots a bolt made of magic at",
    action_desc_pl: "shoot a bolt made of magic at",
    icon: "resources/icons/piercing_mana_bolt.png",
    shoots_projectile: "piercingManaBoltProjectile",
    use_range: "10",
    ai_chance: 2
  },
  fireball: {
    id: "fireball",
    name: "Fireball",
    mana_cost: 15,
    cooldown: 5,
    damages: {
      crush: 3,
      fire: 17
    },
    status: "burning",
    status_power: 50,
    stat_bonus: "int",
    damage_multiplier: 1,
    resistance_penetration: 0,
    type: "attack",
    action_desc: "shoots a ball made of fire at",
    action_desc_pl: "shoot a ball made of fire at",
    icon: "resources/icons/fireball_spell.png",
    shoots_projectile: "fireballProjectile",
    aoe_size: 0,
    aoe_effect: "fireAOE",
    use_range: "9",
    ai_chance: 2
  },
  shadow_step: {
    id: "shadow_step",
    name: "Shadow Step",
    mana_cost: 0,
    cooldown: 9,
    type: "movement",
    action_desc: "step into a shadow, moving rapidly.",
    action_desc_pl: "steps into a shadow, moving rapidly.",
    icon: "resources/icons/shadow_step.png",
    use_range: "4",
    ai_chance: 0
  },
  retreat: {
    id: "retreat",
    name: "Retreat",
    mana_cost: 0,
    cooldown: 23,
    type: "movement",
    status: "dazed",
    recharge_only_in_combat: true,
    action_desc: "step into a shadow, moving rapidly.",
    action_desc_pl: "steps into a shadow, moving rapidly.",
    icon: "resources/icons/retreat.png",
    use_range: "7",
    ai_chance: 0
  },
  charge: {
    id: "charge",
    name: "Charge",
    mana_cost: 0,
    cooldown: 11,
    type: "charge",
    damage_multiplier: 1,
    resistance_penetration: 0,
    status: "dazed",
    status_power: 50,
    action_desc: "charges at foe.",
    action_desc_pl: "you charge at foe",
    icon: "resources/icons/charge_ability.png",
    use_range: "8",
    ai_chance: 5
  },
  barbarian_charge: {
    id: "barbarian_charge",
    name: "Raging Charge",
    mana_cost: 0,
    cooldown: 13,
    type: "charge",
    damage_multiplier: 1.1,
    resistance_penetration: 0,
    status: "disoriented",
    status_power: 55,
    action_desc: "charges at foe.",
    action_desc_pl: "you charge at foe",
    icon: "resources/icons/barbarian_charge.png",
    recharge_only_in_combat: true,
    use_range: "10",
    ai_chance: 5
  },
  purification: {
    id: "purification",
    name: "Purification",
    mana_cost: 0,
    cooldown: 22,
    type: "heal",
    remove_status: ["poison", "venom", "blighted"],
    action_desc: "purifies theirself",
    action_desc_pl: "you purify yourself",
    icon: "resources/icons/purification.png",
    use_range: "0",
    self_target: true,
    ai_chance: 1
  },
  summon_skeleton_warrior: {
    id: "summon_skeleton_warrior",
    name: "Summon Skeleton Warrior",
    mana_cost: 20,
    cooldown: 37,
    type: "summon",
    status: "summoned",
    summon_unit: "skeletonWarriorSummon",
    summon_level: 5,
    summon_last: 26,
    action_desc: "purifies theirself",
    action_desc_pl: "you purify yourself",
    icon: "resources/icons/summonSkelWarrior.png",
    use_range: "8",
    ai_chance: 1
  },
  blight: {
    id: "blight",
    name: "Blight",
    mana_cost: 4,
    cooldown: 5,
    damages: {
      dark: 3
    },
    status: "blighted",
    status_power: 50,
    stat_bonus: "int",
    damage_multiplier: 1,
    resistance_penetration: 0,
    type: "attack",
    action_desc: "blights",
    action_desc_pl: "blight",
    icon: "resources/icons/blighted.png",
    shoots_projectile: "blightProjectile",
    use_range: "6",
    ai_chance: 2
  },
} as _abb;