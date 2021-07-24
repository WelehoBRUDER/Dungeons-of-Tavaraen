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
        use_range: "1",
        ai_chance: 3
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
        use_range: "10",
        ai_chance: 3
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
        self_target: true,
        ai_chance: 1
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
    fireball: {
        id: "fireball",
        name: "Fireball",
        mana_cost: 30,
        cooldown: 5,
        damages: {
            crush: 3,
            fire: 17
        },
        stat_bonus: "int",
        damage_multiplier: 1,
        resistance_penetration: 0,
        type: "attack",
        action_desc: "shoots a ball made of fire at",
        action_desc_pl: "shoot a ball made of fire at",
        icon: "resources/icons/fireball_spell.png",
        shoots_projectile: "fireballProjectile",
        aoe_size: 2.1,
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
        use_range: "5",
        ai_chance: 0
    },
    charge: {
        id: "charge",
        name: "Charge",
        mana_cost: 0,
        cooldown: 11,
        type: "charge",
        damage_multiplier: 1.25,
        resistance_penetration: 10,
        status: "dazed",
        action_desc: "charges at foe.",
        action_desc_pl: "you charge at foe",
        icon: "resources/icons/charge_ability.png",
        use_range: "8",
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
    blight: {
        id: "blight",
        name: "Blight",
        mana_cost: 4,
        cooldown: 5,
        damages: {
            dark: 3
        },
        status: "blighted",
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
};
//# sourceMappingURL=abilities.js.map