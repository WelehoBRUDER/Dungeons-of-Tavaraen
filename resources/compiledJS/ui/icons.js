"use strict";
const icons = {
    attack_damage_multiplier: "resources/icons/atk.png",
    fighter_symbol: "resources/icons/fighter_symbol.png",
    melee: "resources/icons/melee_icon.png",
    ranged: "resources/icons/ranged_icon.png",
    meleeDamage: "resources/icons/melee_damage.png",
    rangedDamage: "resources/icons/ranged_damage.png",
    spellDamage: "resources/icons/spell_damage.png",
    resistance: "resources/icons/resistance.png",
    physical_armor: "resources/icons/physical_armor.png",
    magical_armor: "resources/icons/magical_armor.png",
    elemental_armor: "resources/icons/elemental_armor.png",
    physical: "resources/icons/physical_armor.png",
    magical: "resources/icons/magical_armor.png",
    elemental: "resources/icons/elemental_armor.png",
    physicalDef: "resources/icons/physical_armor.png",
    magicalDef: "resources/icons/magical_armor.png",
    elementalDef: "resources/icons/elemental_armor.png",
    rp: "resources/icons/resistance_penetration.png",
    fireResist: "resources/icons/resistance_flame.png",
    resistance_penetration: "resources/icons/resistance_penetration.png",
    gold: "resources/icons/gold.png",
    crush: "resources/icons/crush.png",
    crushDamage: "resources/icons/crush.png",
    crushResist: "resources/icons/crush_resist.png",
    slash: "resources/icons/slash.png",
    slashDamage: "resources/icons/slash.png",
    slashResist: "resources/icons/slash_resist.png",
    pierce: "resources/icons/pierce.png",
    pierceDamage: "resources/icons/pierce.png",
    pierceResist: "resources/icons/pierce_resist.png",
    dark: "resources/icons/dark.png",
    darkDamage: "resources/icons/dark.png",
    darkResist: "resources/icons/resistance_dark.png",
    divine: "resources/icons/divine.png",
    divineDamage: "resources/icons/divine.png",
    divineResist: "resources/icons/resistance_divine.png",
    magic: "resources/icons/mana.png",
    magicDamage: "resources/icons/mana.png",
    magicResist: "resources/icons/resistance_magic.png",
    ice: "resources/icons/ice.png",
    iceResist: "resources/icons/ice_resist.png",
    iceDamage: "resources/icons/ice.png",
    resistAll: "resources/icons/resistance.png",
    fire: "resources/icons/fire.png",
    fireDamage: "resources/icons/fire.png",
    lightning: "resources/icons/lightning.png",
    lightningDamage: "resources/icons/lightning.png",
    lightningResist: "resources/icons/resistance_shock.png",
    stun: "resources/icons/dazed.png",
    curse: "resources/icons/curse.png",
    bleed: "resources/icons/bleed.png",
    poison: "resources/icons/poison.png",
    venom: "resources/icons/venom.png",
    rage: "resources/icons/rage.png",
    berserk: "resources/icons/absolute_berserk.png",
    thumbs_up_white_skin: "resources/icons/thumbs_up_white_skin.png",
    sneaky_stabbing: "resources/icons/hand_gripping_knife.png",
    heightened_senses: "resources/icons/eye_green.png",
    smoke_bomb_effect: "resources/icons/smoke_bomb_effect.png",
    battle_fury: "resources/icons/fighters_fury.png",
    dazed: "resources/icons/dazed.png",
    paralyzed: "resources/icons/bloom_yellow.png",
    hiddenIcon: "resources/icons/hiddenIcon.png",
    disoriented: "resources/icons/disoriented.png",
    dueled: "resources/icons/dueled.png",
    ward: "resources/icons/ward.png",
    range: "resources/icons/use_range.png",
    use_range: "resources/icons/use_range.png",
    aoe_size: "resources/icons/splash_area.png",
    damage: "resources/icons/damage.png",
    damage_multiplier: "resources/icons/damage.png",
    heal: "resources/icons/healing.png",
    base_heal: "resources/icons/healing.png",
    cooldown: "resources/icons/cooldown.png",
    last: "resources/icons/cooldown.png",
    health: "resources/icons/health.png",
    hpMax: "resources/icons/health.png",
    mana: "resources/icons/mana.png",
    mana_cost: "resources/icons/mana.png",
    health_cost: "resources/icons/health_cost.png",
    health_cost_percentage: "resources/icons/health_cost.png",
    mpMax: "resources/icons/mana.png",
    silence: "resources/icons/silence.png",
    dex: "resources/icons/dexterity.png",
    str: "resources/icons/strength.png",
    int: "resources/icons/intelligence.png",
    vit: "resources/icons/vitality.png",
    cun: "resources/icons/cunning.png",
    hitChance: "resources/icons/hit_chance.png",
    evasion: "resources/icons/evasion.png",
    resistAllon: "resources/icons/concentration.png",
    concentration: "resources/icons/concentration.png",
    break_concentration: "resources/icons/break_concentration.png",
    critChance: "resources/icons/critical_damage.png",
    critDamage: "resources/icons/critical_damage.png",
    sight: "resources/icons/eye_open.png",
    blight: "resources/icons/blighted.png",
    burning: "resources/icons/flame_of_passion.png",
    chilled: "resources/icons/chilled.png",
    slime_type: "resources/icons/slime_type.png",
    skeleton_type: "resources/icons/skull.png",
    barbarian_type: "resources/icons/barbarian_type.png",
    troll_type: "resources/icons/troll_type.png",
    wraith_type: "resources/icons/wraith_type.png",
    hiisi_type: "resources/icons/hiisi_type.png",
    undead_race: "resources/icons/skull.png",
    human_race: "resources/icons/human_race.png",
    orc_race: "resources/icons/orc_race.png",
    monster_race: "resources/icons/monster_race.png",
    elemental_race: "resources/icons/elemental_race.png",
    regenHp: "resources/icons/regen.png",
    regenMp: "resources/icons/mana_regen.png",
    poisonDefense: "resources/icons/poison.png",
    burningDefense: "resources/icons/flame_of_passion.png",
    stunDefense: "resources/icons/dazed.png",
    curseDefense: "resources/icons/curse.png",
    bleedDefense: "resources/icons/bleed.png",
    exp: "resources/icons/EXP.png",
    expGain: "resources/icons/EXP.png",
    summon_level: "resources/icons/portal.png",
    summon_last: "resources/icons/portal.png",
    total_summon_limit: "resources/icons/portal.png",
    all_summons_damage: "resources/icons/summon_damage.png",
    all_summons_regenHp: "resources/icons/summon_regen.png",
    warning: "resources/icons/warn.png",
    movementSpeed: "resources/icons/speed.png",
    attackSpeed: "resources/icons/speed.png",
    liquid_courage: "resources/icons/drunk.png",
};
//# sourceMappingURL=icons.js.map