"use strict";
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
    defend: {
        id: "defend",
        name: "Defend",
        mana_cost: 0,
        cooldown: 0,
        resistance_penetration: 0,
        type: "buff",
        icon: "resources/icons/defend_skill.png",
        action_desc: "defends",
        action_desc_pl: "defend",
        statusesUser: ["defend"],
        use_range: "0",
        self_target: true,
        ai_chance: 2
    },
    focus_strike: {
        id: "focus_strike",
        name: "Focused Strike",
        mana_cost: 0,
        cooldown: 7,
        damage_multiplier: 1.5,
        resistance_penetration: 10,
        type: "attack",
        requires_melee_weapon: true,
        action_desc: "focuse strikes",
        action_desc_pl: "focus strike",
        requires_concentration: true,
        icon: "resources/icons/focus_strike.png",
        use_range: "1",
        ai_chance: 3
    },
    invigorating_finish: {
        id: "invigorating_finish",
        name: "Invigorating Finish",
        mana_cost: 0,
        health_cost_percentage: 15,
        cooldown: 5,
        damage_multiplier: 1.75,
        life_steal_percentage: 50,
        life_steal_trigger_only_when_killing_enemy: true,
        resistance_penetration: 0,
        type: "attack",
        requires_melee_weapon: true,
        action_desc: "attempts to land a finishing blow",
        action_desc_pl: "attempt to land a finishing blow",
        icon: "resources/icons/invigorating_finish.png",
        use_range: "2",
        ai_chance: 3
    },
    finishing_blow: {
        id: "finishing_blow",
        name: "Finishing Blow",
        mana_cost: 0,
        health_cost_percentage: 40,
        cooldown: 1,
        damage_multiplier: 2,
        resistance_penetration: 50,
        type: "attack",
        requires_melee_weapon: true,
        action_desc: "attempts to land a finishing blow",
        action_desc_pl: "attempt to land a finishing blow",
        icon: "resources/icons/finishing_blow.png",
        use_range: "2",
        ai_chance: 3
    },
    chivalrious_blow: {
        id: "chivalrious_blow",
        name: "Chivalrious Blow",
        mana_cost: 0,
        cooldown: 14,
        damage_multiplier: 0.9,
        resistance_penetration: 0,
        type: "attack",
        statusesEnemy: ["dueled"],
        status_power: 55,
        requires_melee_weapon: true,
        action_desc: "gracefully strikes",
        action_desc_pl: "gracefully strike",
        requires_concentration: true,
        icon: "resources/icons/focus_strike.png",
        use_range: "1",
        ai_chance: 15
    },
    true_shot: {
        id: "true_shot",
        name: "True Shot",
        mana_cost: 0,
        cooldown: 7,
        damage_multiplier: 1.4,
        resistance_penetration: 10,
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
        statusesEnemy: ["venom"],
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
        statusesEnemy: ["poison"],
        status_power: 40,
        action_desc: "shoots a poisoned arrow at",
        action_desc_pl: "shoot a poisoned arrow at",
        requires_concentration: true,
        icon: "resources/icons/poison_arrow.png",
        shoots_projectile: "arrowPoisonedProjectile",
        use_range: "11",
        ai_chance: 3
    },
    sundering_arrow: {
        id: "sundering_arrow",
        name: "Sundering Arrow",
        mana_cost: 0,
        cooldown: 18,
        damage_multiplier: 1.2,
        resistance_penetration: 0,
        type: "attack",
        requires_ranged_weapon: true,
        statusesEnemy: ["sunder"],
        status_power: 60,
        action_desc: "shoots a sundering arrow at",
        action_desc_pl: "shoot a sundering arrow at",
        requires_concentration: true,
        icon: "resources/icons/sundering_arrow.png",
        shoots_projectile: "arrowChargedProjectile",
        use_range: "11",
        ai_chance: 3
    },
    shock_arrow: {
        id: "shock_arrow",
        name: "Shock Arrow",
        mana_cost: 0,
        cooldown: 20,
        damage_multiplier: 0.4,
        damages: {
            lightning: 100,
        },
        stat_bonus: "dex",
        resistance_penetration: 0,
        type: "attack",
        requires_ranged_weapon: true,
        statusesEnemy: ["paralyzed"],
        status_power: 60,
        action_desc: "shoots a shock arrow at",
        action_desc_pl: "shoot a shock arrow at",
        requires_concentration: true,
        icon: "resources/icons/shock_arrow.png",
        shoots_projectile: "arrowChargedProjectile",
        use_range: "14",
        ai_chance: 3
    },
    first_aid: {
        id: "first_aid",
        name: "First Aid",
        mana_cost: 0,
        cooldown: 10,
        base_heal: 20,
        heal_percentage: 8,
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
        statusesUser: ["battle_fury"],
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
        statusesUser: ["rage"],
        use_range: "0",
        self_target: true,
        ai_chance: 2
    },
    warrior_shout: {
        id: "warrior_shout",
        name: "Warrior Shout",
        mana_cost: 15,
        cooldown: 10,
        damages: {
            magic: 100,
        },
        stat_bonus: "str",
        damage_multiplier: 0.9,
        resistance_penetration: 0,
        type: "attack",
        action_desc: "shouts with a booming voice!",
        action_desc_pl: "shout with a terrifying intensity!",
        icon: "resources/icons/warrior_shout.png",
        line: "WAAAAAAAHH!!!!",
        statusesUser: ["encouraged_warrior_shout"],
        statusesEnemy: ["disheartened_warrior_shout"],
        status_power: 55,
        use_range: "0",
        instant_aoe: true,
        aoe_size: 3.2,
        aoe_effect: "shoutAOE",
        aoe_ignore_ledge: true,
        ai_chance: 3
    },
    berserk: {
        id: "berserk",
        name: "Berserk",
        mana_cost: 0,
        cooldown: 30,
        damage_multiplier: 0,
        type: "buff",
        action_desc: "throws all caution to the wind, going fully berserk!",
        action_desc_pl: "throw away all thoughts of defense, and go berserk!",
        icon: "resources/icons/absolute_berserk.png",
        line: "RAAAAAAHHHHH!!!!!",
        requires_concentration: true,
        statusesUser: ["berserk"],
        use_range: "0",
        self_target: true,
        ai_chance: 2
    },
    sneaky_stabbing: {
        id: "sneaky_stabbing",
        name: "Sneaky Stabbing",
        mana_cost: 0,
        cooldown: 18,
        damage_multiplier: 0,
        type: "buff",
        action_desc: "focuses on critical points.",
        action_desc_pl: "focus on critical points!",
        icon: "resources/icons/hand_gripping_knife.png",
        line: "...",
        statusesUser: ["sneaky_stabbing"],
        use_range: "0",
        self_target: true,
        ai_chance: 2
    },
    awaken: {
        id: "awaken",
        name: "Awaken",
        mana_cost: 10,
        cooldown: 20,
        damage_multiplier: 0,
        type: "buff",
        action_desc: "awakens senses.",
        action_desc_pl: "awaken your senses!",
        icon: "resources/icons/eye_awaken.png",
        line: "A W A K E N",
        statusesUser: ["heightened_senses"],
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
        statusesUser: ["ward_of_aurous"],
        use_range: "0",
        self_target: true,
        ai_chance: 3
    },
    icy_javelin: {
        id: "icy_javelin",
        name: "Icy Javelin",
        mana_cost: 16,
        cooldown: 7,
        damages: {
            magic: 33,
            ice: 67
        },
        stat_bonus: "int",
        damage_multiplier: 1.2,
        resistance_penetration: 0,
        statusesEnemy: ["chilled"],
        status_power: 55,
        type: "attack",
        action_desc: "shoots a javelin made of ice at",
        action_desc_pl: "shoot a javelin made of ice at",
        icon: "resources/icons/ice_javelin.png",
        shoots_projectile: "iceSpikedProjectile",
        use_range: "10",
        ai_chance: 2
    },
    piercing_mana_bolt: {
        id: "piercing_mana_bolt",
        name: "Piercing Mana Bolt",
        mana_cost: 10,
        cooldown: 0,
        damages: {
            pierce: 25,
            magic: 75
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
            crush: 15,
            fire: 85
        },
        statusesEnemy: ["burning"],
        status_power: 50,
        stat_bonus: "int",
        damage_multiplier: 1.1,
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
    smoke_bomb: {
        id: "smoke_bomb",
        name: "Smoke Bomb",
        mana_cost: 0,
        cooldown: 17,
        damages: {
            crush: 60,
            fire: 40
        },
        statusesEnemy: ["smoke_bomb_effect"],
        statusesUser: ["smoke_evasion"],
        status_power: 80,
        stat_bonus: "dex",
        damage_multiplier: 0.5,
        resistance_penetration: 0,
        type: "attack",
        action_desc: "throws a smoke bomb at",
        action_desc_pl: "throw a smoke bomb at",
        icon: "resources/icons/smoke_bomb.png",
        shoots_projectile: "smokeBombProjectile",
        aoe_size: 1.7,
        aoe_effect: "smokeAOE",
        use_range: "7",
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
        statusesUser: ["dazed"],
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
        statusesEnemy: ["dazed"],
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
        statusesEnemy: ["disoriented"],
        status_power: 55,
        action_desc: "charges at foe.",
        action_desc_pl: "you charge at foe",
        icon: "resources/icons/barbarian_charge.png",
        recharge_only_in_combat: true,
        use_range: "10",
        ai_chance: 5
    },
    reap: {
        id: "reap",
        name: "Reap",
        mana_cost: 0,
        cooldown: 13,
        type: "charge",
        damage_multiplier: 1.5,
        resistance_penetration: 12,
        statusesEnemy: ["burning"],
        status_power: 62,
        action_desc: "reaps foe.",
        action_desc_pl: "you reap foe",
        icon: "resources/icons/charge_ability.png",
        use_range: "14",
        ai_chance: 10
    },
    challenge: {
        id: "challenge",
        name: "Challenge",
        mana_cost: 0,
        cooldown: 12,
        type: "charge",
        damage_multiplier: 1.15,
        resistance_penetration: 0,
        action_desc: "challenges",
        action_desc_pl: "you challenge",
        icon: "resources/icons/charge_ability.png",
        use_range: "16",
        ai_chance: 15
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
        statusesUser: ["summoned"],
        summon_unit: "skeletonWarriorSummon",
        summon_level: 5,
        summon_last: 26,
        total_summon_limit: 1,
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
            dark: 100
        },
        statusesEnemy: ["blighted"],
        status_power: 50,
        stat_bonus: "int",
        damage_multiplier: 0.75,
        resistance_penetration: 0,
        type: "attack",
        action_desc: "blights",
        action_desc_pl: "blight",
        icon: "resources/icons/blighted.png",
        shoots_projectile: "blightProjectile",
        use_range: "6",
        ai_chance: 2
    },
    distraction: {
        id: "distraction",
        name: "Distraction",
        mana_cost: 0,
        cooldown: 25,
        type: "summon",
        statusesUser: ["summoned"],
        summon_unit: "dummyTarget",
        summon_level: 1,
        summon_last: 10,
        total_summon_limit: 1,
        summon_status: "inanimate",
        action_desc: "purifies theirself",
        action_desc_pl: "you purify yourself",
        icon: "resources/icons/dummy_ability.png",
        use_range: "3",
        ai_chance: 1
    },
    totem_of_arrows: {
        id: "totem_of_arrows",
        name: "Totem of Arrows",
        mana_cost: 0,
        cooldown: 15,
        type: "summon",
        summon_unit: "arrowTotem",
        summon_level: 1,
        summon_last: 51,
        total_summon_limit: 1,
        summon_status: "rootedConstruct",
        action_desc: "purifies theirself",
        action_desc_pl: "you purify yourself",
        icon: "resources/icons/totem_of_arrows.png",
        use_range: "5",
        ai_chance: 1
    },
    ranger_wolf: {
        id: "ranger_wolf",
        name: "Ranger's Wolf",
        mana_cost: 0,
        cooldown: 60,
        type: "summon",
        summon_unit: "rangerWolf",
        summon_level: 1,
        summon_last: 501,
        total_summon_limit: 1,
        action_desc: "purifies theirself",
        action_desc_pl: "you purify yourself",
        icon: "resources/icons/ranger_wolf.png",
        use_range: "4",
        ai_chance: 1
    },
};
//# sourceMappingURL=abilities.js.map