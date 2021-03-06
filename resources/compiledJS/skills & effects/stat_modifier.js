"use strict";
/* Permanent stat modifiers, everything stored in one file */
const traits = {
    no_natural_regen: {
        id: "no_natural_regen",
        effects: {
            regenHpP: -100,
            regenMpP: -100
        }
    },
    low_natural_regen: {
        id: "low_natural_regen",
        effects: {
            regenHpP: -50,
            regenMpP: -100
        }
    },
    medium_natural_regen: {
        id: "medium_natural_regen",
        effects: {
            regenHpP: -50,
            regenMpP: -50
        }
    },
    magical_regen: {
        id: "magical_regen",
        effects: {
            regenHpP: -100,
            regenMpP: 50,
        }
    },
    troll_regeneration: {
        id: "troll_regeneration",
        effects: {
            regenHpP: 50,
            regenMpP: -100
        }
    },
    magically_impotent: {
        id: "magically_impotent",
        effects: {
            mpMaxP: -100
        }
    },
    cornered_animal: {
        id: "cornered_animal",
        conditions: {
            hp_less_than: 50
        },
        effects: {
            evasionV: 10,
            hitChanceV: 10,
            damageP: 5
        }
    },
    orc_frenzy: {
        id: "orc_frenzy",
        conditions: {
            hp_more_than: 50
        },
        effects: {
            evasionV: -5,
            hitChanceV: 5,
            damageP: 8
        }
    },
    orc_resilience: {
        id: "orc_resilience",
        conditions: {
            hp_less_than: 50
        },
        effects: {
            evasionV: 5,
            hitChanceV: -5,
            regenHpP: 75
        }
    },
    weaker_natural_ability: {
        id: "weaker_natural_ability",
        effects: {
            blight_cooldownV: 3,
            fireball_cooldownV: 5,
            charge_cooldownV: 2,
            charge_use_rangeV: -1,
            battle_fury_cooldownV: 5,
            piercing_mana_bolt_cooldownV: 4
        }
    },
    slow: {
        id: "slow",
        effects: {
            movementSpeedV: -25,
            attackSpeedV: -25
        }
    },
    fast: {
        id: "fast",
        effects: {
            movementSpeedV: 15
        }
    },
    resilience_of_the_lone_wanderer: {
        id: "resilience_of_the_lone_wanderer",
        desc: "lone_wanderer_desc",
        effects: {
            hpMaxV: 55,
            mpMaxV: 10,
            regenHpP: 10,
        }
    },
    // PERK STAT MODIFIERS
    frantic_mana_recovery: {
        id: "frantic_mana_recovery",
        conditions: {
            mp_less_than: 50
        },
        effects: {
            regenMpP: 300
        }
    },
    heightened_casting: {
        id: "heightened_casting",
        conditions: {
            mp_more_than: 75
        },
        effects: {
            magicDamageP: 10,
            hitChanceV: 25
        }
    },
    warrior_instrict: {
        id: "warrior_instinct",
        conditions: {
            hp_less_than: 50
        },
        effects: {
            resistAllV: 4
        }
    },
    blood_rage_1: {
        id: "blood_rage_1",
        conditions: {
            hp_less_than: 50,
            hp_more_than: 20
        },
        effects: {
            damageP: 10,
            strV: 2,
        }
    },
    blood_rage_2: {
        id: "blood_rage_2",
        conditions: {
            hp_less_than: 20
        },
        effects: {
            damageP: 15,
            strV: 5,
            attack_damage_multiplierP: 10,
        }
    },
    blood_rage_3: {
        id: "blood_rage_3",
        effects: {}
    },
    sense_of_danger_1: {
        id: "sense_of_danger_1",
        conditions: {
            hp_less_than: 50,
            hp_more_than: 20
        },
        effects: {
            evasionV: 5,
            resistAllV: 5
        }
    },
    sense_of_danger_2: {
        id: "sense_of_danger_2",
        conditions: {
            hp_less_than: 20,
        },
        effects: {
            evasionV: 10,
            resistAllV: 10
        }
    },
    reckless_1: {
        id: "reckless_1",
        conditions: {
            hp_less_than: 50,
            hp_more_than: 20
        },
        effects: {
            hitChanceV: 5,
            attack_damage_multiplierP: 10
        }
    },
    reckless_2: {
        id: "reckless_2",
        conditions: {
            hp_less_than: 20,
        },
        effects: {
            hitChanceV: 10,
            attack_damage_multiplierP: 20
        }
    },
    confident_shot: {
        id: "confident_shot",
        conditions: {
            hp_more_than: 80
        },
        effects: {
            rangedDamageP: 10
        }
    },
    mark_of_hunter: {
        id: "mark_of_hunter",
        conditions: {
            hp_more_than: 95
        },
        effects: {
            rangedDamageP: 10
        }
    },
    // RACIAL ABILITIES
    racial_ability_orc_1: {
        id: "racial_ability_orc_1",
        effects: {
            strP: 20
        }
    },
    racial_ability_human_1: {
        id: "racial_ability_human_1",
        effects: {
            vitP: 20
        }
    },
    racial_ability_elf_1: {
        id: "racial_ability_elf_1",
        effects: {
            intP: 20
        }
    },
    racial_ability_ashen_1: {
        id: "racial_ability_ashen_1",
        effects: {
            dexP: 20
        }
    },
    /* Starter trait choices */
    enduring: {
        id: "enduring",
        effects: {
            vitP: 10
        }
    },
    strong: {
        id: "strong",
        effects: {
            strP: 10
        }
    },
    quick: {
        id: "quick",
        effects: {
            dexP: 10
        }
    },
    intelligent: {
        id: "intelligent",
        effects: {
            intP: 10
        }
    },
    stealthy: {
        id: "stealthy",
        effects: {
            cunP: 10
        }
    },
    lucky: {
        id: "lucky",
        effects: {
            expGainP: 10
        }
    },
    healthy: {
        id: "healthy",
        effects: {
            hpMaxP: 10
        }
    },
    wise: {
        id: "wise",
        effects: {
            mpMaxP: 10
        }
    },
    regenerating: {
        id: "regenerating",
        effects: {
            regenHpP: 10
        }
    },
    magical: {
        id: "magical",
        effects: {
            regenMpP: 10
        }
    },
    adrenaline: {
        id: "adrenaline",
        conditions: {
            hp_less_than: 30,
        },
        effects: {
            movementSpeedV: 15,
            attackSpeedV: 15,
            regenHpP: 15,
            regenMpP: 15
        }
    },
    confident: {
        id: "confident",
        conditions: {
            hp_more_than: 80,
            mp_more_than: 80
        },
        effects: {
            hitChanceV: 10,
            evasionV: 10,
            damageP: 5
        }
    }
    /* End of starter trait choices */
};
class PermanentStatModifier {
    constructor(base) {
        var _a, _b, _c;
        this.id = base.id;
        const baseModifier = { ...traits[this.id] };
        if (!baseModifier)
            throw new Error("Invalid modifier id!");
        this.conditions = (_a = baseModifier.conditions) !== null && _a !== void 0 ? _a : null;
        this.effects = (_b = baseModifier.effects) !== null && _b !== void 0 ? _b : {};
        this.desc = (_c = baseModifier.desc) !== null && _c !== void 0 ? _c : null;
    }
}
//# sourceMappingURL=stat_modifier.js.map