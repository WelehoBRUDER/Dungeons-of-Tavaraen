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
    damage_multiplier: 1.7,
    resistance_penetration: 30,
    type: "attack",
    requires_melee_weapon: true,
    action_desc: "focuse strikes",
    action_desc_pl: "focus strike",
    requires_concentration: true,
    icon: "resources/icons/focus_strike.png",
    use_range: "1"
  },
  true_shot: {
    id: "true_shot",
    name: "True Shot",
    mana_cost: 5,
    cooldown: 3,
    damage_multiplier: 1.9,
    resistance_penetration: 25,
    type: "attack",
    requires_ranged_weapon: true,
    action_desc: "casts True shot on",
    action_desc_pl: "cast True Shot on",
    requires_concentration: true,
    icon: "resources/icons/true_shot.png",
    shoots_projectile: "arrowChargedProjectile",
    use_range: "10"
  },
  first_aid: {
    id: "first_aid",
    name: "First Aid",
    mana_cost: 0,
    cooldown: 14,
    base_heal: 20,
    damage_multiplier: 0,
    type: "heal",
    action_desc: "performs first aid",
    action_desc_pl: "perform first aid",
    requires_concentration: true,
    icon: "resources/icons/first_aid.png",
    use_range: "0",
    self_target: true
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
    self_target: true
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
    self_target: true
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
    use_range: "9"
  }
}