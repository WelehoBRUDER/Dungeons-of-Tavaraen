"use strict";
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
            sightV: -1
        },
        last: {
            total: 5,
            current: 5
        },
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
            damageP: -20
        },
        last: {
            total: 4,
            current: 4
        },
        textIcon: icons.venom,
        icon: "resources/icons/venom.png"
    },
    burning: {
        id: "burning",
        name: "Burning",
        dot: {
            damageType: "burning",
            damageAmount: 3,
            icon: icons.burning_icon
        },
        effects: {
            iceResistV: 25,
            resistAllV: -5
        },
        break_concentration: true,
        last: {
            total: 3,
            current: 3
        },
        textIcon: icons.burning_icon,
        icon: "resources/icons/flame_of_passion.png"
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
        textIcon: icons.blight_icon,
        icon: "resources/icons/blighted.png"
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
            crushResistV: -10,
            slashResistV: -10,
            pierceResistV: -10,
            iceResistV: 5,
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
    battle_fury: {
        id: "battle_fury",
        name: "Battle Fury",
        effects: {
            attack_damage_multiplierP: 20,
            strV: 10,
            crushDamageP: 9,
            slashDamageP: 9,
            pierceDamageP: 7,
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
            strP: 60,
            fireDamageP: 60,
            crushDamageP: 40,
            slashDamageP: 40,
            pierceDamageP: 40,
            crushResistV: -25,
            slashResistV: -25,
            pierceResistV: -25,
            barbarian_rage_status_effect_strPV: 33,
            attack_damage_multiplierP: 50
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
        textIcon: icons.dazed,
        icon: "resources/icons/dazed.png"
    }
};
// this allows player to deal more damage to specific enemies.
// extends to races too, but no TT
//  damage_against_type_[TYPE]P: 15,
//# sourceMappingURL=effects.js.map