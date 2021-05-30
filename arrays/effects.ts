const statusEffects = {
  poison: {
    id: "poison",
    name: "Poison",
    dot: {
      damageType: "poison",
      damageAmount: 5,
      icon: icons.poison
    },
    effects: {
      strV: -5,
      dexV: -5,
      berserk_status_effect_strPV: 20,
      berserk_status_effect_lastV: 3,
      berserk_status_effect_dexPV: 33,
      barbarian_rage_status_effect_strPV: -78
    },
    last: {
      total: 5,
      current: 5
    },
    textIcon: icons.poison,
    icon: "resources/icons/poison.png"
  },
  rage: {
    id: "rage",
    name: "Rage",
    effects: {
      strP: 50,
      fireDamageP: 50,
      crushDamageP: 20,
      slashDamageP: 20,
      pierceDamageP: 20,
      crushResistV: 10,
      slashResistV: 10,
      pierceResistV: 10,
      iceResistV: 5,
      berserk_mana_costV: 8,
      berserk_cooldownP: 75,
      focus_strike_resistance_penetrationV: 20,
      focus_strike_cooldownV: -2,
      icy_javelin_damage_multiplierV: 0.3,
      icy_javelin_use_rangeP: 30,
      first_aid_base_healV: 10,
      berserk_status_effect_strPV: 20
    },
    silence: true,
    last: {
      total: 7,
      current: 7
    },
    textIcon: icons.rage,
    aura: "redMist",
    icon: "resources/icons/rage.png"
  },
  berserk: {
    id: "berserk",
    name: "Berserk",
    effects: {
      strP: 60,
      fireDamageP: 60,
      crushDamageP: 40,
      slashDamageP: 40,
      pierceDamageP: 40,
      crushResistV: -25,
      slashResistV: -25,
      pierceResistV: -25,
    },
    silence: true,
    break_concentration: true,
    last: {
      total: 6,
      current: 6
    },
    textIcon: icons.berserk,
    aura: "redMist",
    icon: "resources/icons/berserk.png"
  }
};