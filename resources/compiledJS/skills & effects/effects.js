"use strict";
const statusEffects = {
    defend: {
        id: "defend",
        name: "Defend",
        effects: {
            resistAllV: 20,
            evasionV: 10
        },
        last: {
            total: 1,
            current: 1
        },
        textIcon: "resources/icons/defend_skill.png",
        icon: "resources/icons/defend_skill.png"
    },
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
            sightV: -1,
            movementSpeedV: -10,
            attackSpeedV: -10
        },
        last: {
            total: 5,
            current: 5
        },
        type: "poison",
        textIcon: icons.poison,
        icon: "resources/icons/poison.png"
    },
    venom: {
        id: "venom",
        name: "Venom",
        dot: {
            damageType: "poison",
            damageAmount: 8,
            icon: icons.venom
        },
        effects: {
            strV: -3,
            dexV: -3,
            intV: -3,
            damageP: -20,
            movementSpeedV: -20,
            attackSpeedV: -20
        },
        last: {
            total: 4,
            current: 4
        },
        type: "poison",
        textIcon: icons.venom,
        icon: "resources/icons/venom.png"
    },
    burning: {
        id: "burning",
        name: "Burning",
        dot: {
            damageType: "burning",
            damageAmount: 4,
            icon: icons.burning_icon
        },
        effects: {
            fireResistV: 10,
            iceResistV: -10,
            resistAllV: -5
        },
        break_concentration: true,
        last: {
            total: 3,
            current: 3
        },
        type: "burning",
        textIcon: icons.burning_icon,
        icon: "resources/icons/flame_of_passion.png"
    },
    sunder: {
        id: "sunder",
        name: "Sundered",
        effects: {
            physicalDefP: -50,
            magicalDefP: -50,
            elementalDefP: -50,
            resistAllP: -50
        },
        last: {
            total: 4,
            current: 4
        },
        type: "curse",
        textIcon: icons.resistance_penetration,
        icon: "resources/icons/resistance_penetration.png"
    },
    chilled: {
        id: "chilled",
        name: "Chilled",
        effects: {
            damageP: -15,
            hitChanceV: -10,
            evasionV: -10,
            fireResistV: -10,
            movementSpeedV: -30,
            attackSpeedV: -15
        },
        last: {
            total: 4,
            current: 4
        },
        type: "curse",
        textIcon: icons.chilled_icon,
        icon: "resources/icons/chilled.png"
    },
    blighted: {
        id: "blighted",
        name: "Blighted",
        effects: {
            strV: -4,
            dexV: -4,
            cunV: -2,
            sightV: -2
        },
        last: {
            total: 4,
            current: 4
        },
        type: "curse",
        textIcon: icons.blight_icon,
        icon: "resources/icons/blighted.png"
    },
    rage: {
        id: "rage",
        name: "Rage",
        effects: {
            strV: 10,
            crushDamageP: 20,
            slashDamageP: 20,
            pierceDamageP: 20,
            resistAllV: 5
        },
        silence: true,
        last: {
            total: 12,
            current: 12
        },
        textIcon: icons.rage,
        aura: "redMist",
        icon: "resources/icons/rage.png"
    },
    battle_fury: {
        id: "battle_fury",
        name: "Battle Fury",
        effects: {
            attack_damage_multiplierP: 20,
            strV: 10,
            crushDamageP: 9,
            slashDamageP: 9,
            pierceDamageP: 7,
            attackSpeedV: 30
        },
        silence: true,
        last: {
            total: 10,
            current: 10
        },
        textIcon: icons.battle_fury,
        aura: "redMist",
        icon: "resources/icons/fighters_rage.png"
    },
    encouraged_warrior_shout: {
        id: "encouraged_warrior_shout",
        name: "Encouraged",
        effects: {
            damageP: 25,
            evasionV: 10
        },
        last: {
            total: 2,
            current: 2
        },
        textIcon: icons.thumbs_up_white_skin,
        aura: "redMist",
        icon: "resources/icons/thumbs_up_white_skin.png"
    },
    ward_of_aurous: {
        id: "ward_of_aurous",
        name: "WoA",
        effects: {
            crushResistV: 30,
            slashResistV: 30,
            pierceResistV: 30,
            magicResistV: 45,
            fireResistV: 45,
            iceResistV: 45,
            lightningResistV: 45
        },
        last: {
            total: 5,
            current: 5
        },
        textIcon: icons.ward,
        aura: "ward",
        icon: "resources/icons/shield_of_aurous.png"
    },
    berserk: {
        id: "berserk",
        name: "Berserk",
        effects: {
            meleeDamageP: 30,
            strP: 40,
            movementSpeedV: 20,
            attackSpeedV: 20,
            barbarian_charge_cooldownP: -75,
            physicalDefP: -100,
            magicalDefP: -100,
            elementalDefP: -100,
            resistAllP: -100,
            regenHpP: -100,
            regenMpP: -100
        },
        silence: true,
        break_concentration: true,
        last: {
            total: 15,
            current: 15
        },
        textIcon: icons.berserk,
        aura: "redMist",
        icon: "resources/icons/absolute_berserk.png"
    },
    sneaky_stabbing: {
        id: "sneaky_stabbing",
        name: "Sneaky Stabbing",
        effects: {
            critChanceP: 15,
            critDamageP: 30,
            damageP: 8
        },
        last: {
            total: 7,
            current: 7
        },
        textIcon: icons.sneaky_stabbing,
        icon: "resources/icons/hand_gripping_knife.png"
    },
    heightened_senses: {
        id: "heightened_senses",
        name: "Heightened Senses",
        effects: {
            critChanceP: 10,
            damageP: 10,
            sightV: 5
        },
        last: {
            total: 10,
            current: 10
        },
        textIcon: icons.heightened_senses,
        icon: "resources/icons/eye_green.png"
    },
    smoke_bomb_effect: {
        id: "smoke_bomb_effect",
        name: "Smoke Bomb",
        effects: {
            damageP: -10,
            hitChanceV: -20,
            evasionV: -20,
            resistAllV: -5,
            dexP: -25
        },
        last: {
            total: 5,
            current: 5
        },
        type: "stun",
        textIcon: icons.smoke_bomb_effect,
        icon: "resources/icons/smoke_bomb_effect.png"
    },
    smoke_evasion: {
        id: "smoke_evasion",
        name: "Smoke Screen Evasion",
        effects: {
            evasionV: 10,
        },
        last: {
            total: 5,
            current: 5
        },
        textIcon: "resources/icons/portal.png",
        icon: "resources/icons/portal.png"
    },
    dazed: {
        id: "dazed",
        name: "Dazed",
        effects: {
            damageP: -50
        },
        break_concentration: true,
        last: {
            total: 1,
            current: 1
        },
        type: "stun",
        textIcon: icons.dazed,
        icon: "resources/icons/dazed.png"
    },
    paralyzed: {
        id: "paralyzed",
        name: "Paralyzed",
        effects: {
            damageP: -100,
            resistAllP: 20
        },
        break_concentration: true,
        silence: true,
        last: {
            total: 5,
            current: 5
        },
        rooted: true,
        type: "stun",
        textIcon: icons.paralyzed,
        icon: "resources/icons/bloom_yellow.png"
    },
    inanimate: {
        id: "inanimate",
        name: "Inanimate",
        effects: {
            damageP: -100
        },
        break_concentration: true,
        last: {
            total: 100,
            current: 100
        },
        rooted: true,
        type: "stun",
        textIcon: icons.hiddenIcon,
        icon: "resources/icons/hiddenIcon.png"
    },
    rootedConstruct: {
        id: "rootedConstruct",
        name: "Rooted Construct",
        last: {
            total: 100,
            current: 100
        },
        rooted: true,
        type: "stun",
        textIcon: icons.hiddenIcon,
        icon: "resources/icons/hiddenIcon.png"
    },
    disoriented: {
        id: "disoriented",
        name: "Disoriented",
        effects: {
            damageP: -15,
            resistAllV: -10
        },
        break_concentration: true,
        last: {
            total: 3,
            current: 3
        },
        type: "stun",
        textIcon: icons.disoriented,
        icon: "resources/icons/disoriented.png"
    },
    dueled: {
        id: "dueled",
        name: "Dueled",
        effects: {
            damageP: 10,
            hitChanceV: 5,
            evasionV: -5
        },
        last: {
            total: 4,
            current: 4
        },
        rooted: true,
        type: "stun",
        textIcon: icons.dueled,
        icon: "resources/icons/dueled.png"
    },
    disheartened_warrior_shout: {
        id: "disheartened_warrior_shout",
        name: "Disheartened",
        effects: {
            damageP: -10,
            hitChanceV: -3,
            evasionV: -2
        },
        last: {
            total: 5,
            current: 5
        },
        type: "stun",
        textIcon: icons.health_cost_icon,
        icon: "resources/icons/health_cost.png"
    },
    liquid_courage: {
        id: "liquid_courage",
        name: "Liquid Courage",
        effects: {
            expGainP: 25,
            hpMaxP: 5,
            damageP: -10,
            hitChanceV: -5,
            evasionV: -5
        },
        last: {
            total: 50,
            current: 50
        },
        textIcon: icons.liquid_courage_icon,
        icon: "resources/icons/drunk.png"
    },
};
// this allows player to deal more damage to specific enemies.
// extends to races too, but no TT
//  damage_against_type_[TYPE]P: 15,
//# sourceMappingURL=effects.js.map