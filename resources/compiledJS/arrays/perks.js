"use strict";
const perksArray = {
    sorcerer: {
        id: "sorcerer_perks",
        name: "Sorcerer",
        perks: {
            introduction_to_sorcery: {
                id: "introduction_to_sorcery",
                name: "Introduction to Sorcery",
                desc: "",
                effects: {
                    mpMaxV: 5,
                    intV: 1,
                },
                commands: {
                    add_ability_piercing_mana_bolt: 1
                },
                tree: "sorcerer",
                pos: { x: 6.5, y: 1 },
                icon: "resources/icons/wisdom.png"
            },
            intent_studies: {
                id: "intent_studies",
                name: "Intent Studies",
                desc: "",
                effects: {
                    mpMaxV: 8,
                    intV: 1,
                    piercing_mana_bolt_mana_costV: -2
                },
                tree: "sorcerer",
                relative_to: "introduction_to_sorcery",
                requires: ["introduction_to_sorcery"],
                pos: { x: 0, y: 2 },
                icon: "resources/icons/wisdom.png"
            },
            might_of_magic: {
                id: "might_of_magic",
                name: "Might of Magic",
                desc: "",
                effects: {
                    magicDamageP: 5,
                    mpMaxP: 3
                },
                statModifiers: [
                    {
                        id: "heightened_casting",
                        conditions: {
                            mp_more_than: 70
                        },
                        effects: {
                            magicDamageP: 10
                        }
                    }
                ],
                tree: "sorcerer",
                relative_to: "intent_studies",
                requires: ["intent_studies"],
                pos: { x: 3, y: 2 },
                icon: "resources/icons/damage.png"
            },
            spells_of_battle: {
                id: "spells_of_battle",
                name: "Spells of Battle",
                desc: "",
                effects: {
                    piercing_mana_bolt_damage_multiplierP: 25,
                    piercing_mana_bolt_resistance_penetrationV: 18
                },
                tree: "sorcerer",
                relative_to: "might_of_magic",
                requires: ["might_of_magic"],
                pos: { x: 0, y: 1.5 },
                icon: "resources/icons/piercing_mana_bolt.png"
            },
            school_of_fire: {
                id: "school_of_fire",
                name: "The School of Fire",
                desc: "",
                commands: {
                    add_ability_fireball: 1,
                },
                effects: {
                    fireDamageP: 10
                },
                tree: "sorcerer",
                relative_to: "intent_studies",
                requires: ["intent_studies"],
                pos: { x: -3, y: 2 },
                icon: "resources/icons/fireball_spell.png"
            },
            molded_by_flame: {
                id: "molded_by_flame",
                name: "Molded by Flame",
                desc: "",
                effects: {
                    fireResistV: 15,
                    fireball_aoe_sizeV: 2.3,
                    iceResistV: -10,
                    fireball_mana_costV: 15
                },
                tree: "sorcerer",
                relative_to: "school_of_fire",
                requires: ["school_of_fire"],
                pos: { x: 0, y: 1.5 },
                icon: "resources/icons/flame_icon.png"
            },
            shield_of_ages: {
                id: "shield_of_ages",
                name: "Shield of Ages",
                desc: "",
                effects: {
                    magicResistV: 25,
                    mpMaxV: 10
                },
                tree: "sorcerer",
                relative_to: "intent_studies",
                requires: ["intent_studies"],
                pos: { x: 0, y: 2 },
                icon: "resources/icons/shield_symbol.png"
            },
            shield_of_aurous: {
                id: "shield_of_aurous",
                name: "Shield of Aurous",
                desc: "",
                tree: "sorcerer",
                commands: {
                    add_ability_ward_of_aurous: 1,
                },
                relative_to: "shield_of_ages",
                requires: ["shield_of_ages"],
                pos: { x: 0, y: 1.5 },
                icon: "resources/icons/shield_of_aurous.png"
            },
            burning_passion: {
                id: "burning_passion",
                name: "Burning Passion",
                desc: "",
                tree: "sorcerer",
                effects: {
                    fireDamageP: 5,
                    fireResistV: 5,
                    intV: 2
                },
                relative_to: "molded_by_flame",
                requires: ["molded_by_flame", "shield_of_aurous"],
                pos: { x: 1.5, y: 2 },
                icon: "resources/icons/resistance_flame.png"
            },
            wisdoms_of_the_past: {
                id: "wisdoms_of_the_past",
                name: "Wisdoms of the Past",
                desc: "",
                tree: "sorcerer",
                effects: {
                    mpMaxV: 25
                },
                relative_to: "spells_of_battle",
                requires: ["spells_of_battle", "shield_of_aurous"],
                pos: { x: -1.5, y: 2 },
                icon: "resources/icons/mana.png"
            },
            // Need to add a spell for this
            flame_wizard_fury: {
                id: "flame_wizard_fury",
                name: "The Flame Wizard's Fury",
                desc: "",
                tree: "sorcerer",
                effects: {
                    fireDamageP: 25
                },
                relative_to: "burning_passion",
                requires: ["burning_passion", "wisdoms_of_the_past"],
                pos: { x: 1.5, y: 1.5 },
                icon: "resources/icons/rage.png"
            },
        }
    },
    fighter: {
        id: "fighter_perks",
        name: "Fighter",
        perks: {
            battle_sense: {
                id: "battle_sense",
                name: "Battle Sense",
                desc: "",
                effects: {
                    strV: 1,
                },
                commands: {
                    add_ability_focus_strike: 1
                },
                tree: "fighter",
                pos: { x: 7.5, y: 1 },
                icon: "resources/icons/fighter_symbol.png"
            },
            fighters_vitality: {
                id: "fighters_vitality",
                name: "Fighter's Vitality",
                desc: "",
                effects: {
                    hpMaxV: 25
                },
                relative_to: "battle_sense",
                requires: ["battle_sense"],
                tree: "fighter",
                pos: { x: 0, y: 2 },
                icon: "resources/icons/health.png"
            },
            patient_blow: {
                id: "patient_blow",
                name: "Patient Blow",
                desc: "",
                effects: {
                    focus_strike_resistance_penetrationV: 25,
                    focus_strike_cooldownV: -2
                },
                relative_to: "fighters_vitality",
                requires: ["fighters_vitality"],
                tree: "fighter",
                pos: { x: -4, y: 2 },
                icon: "resources/icons/focus_strike.png"
            },
            resistant_in_melee: {
                id: "resistant_in_melee",
                name: "Resistant in Melee",
                desc: "",
                effects: {
                    resistAllV: 5,
                    evasionV: 2
                },
                relative_to: "patient_blow",
                requires: ["patient_blow"],
                tree: "fighter",
                pos: { x: 0, y: 2 },
                icon: "resources/icons/resistance_default.png"
            },
            strength_training: {
                id: "strength_training",
                name: "Strength Training",
                desc: "",
                effects: {
                    strV: 2,
                    vitV: 2,
                },
                relative_to: "fighters_vitality",
                requires: ["fighters_vitality"],
                tree: "fighter",
                pos: { x: -2, y: 2 },
                icon: "resources/icons/strength.png"
            },
            fighting_style: {
                id: "fighting_style",
                name: "Fighting Style",
                desc: "",
                effects: {
                    attack_damage_multiplierP: 10,
                    hitChanceV: 5
                },
                relative_to: "fighters_vitality",
                requires: ["fighters_vitality"],
                tree: "fighter",
                pos: { x: 2, y: 2 },
                icon: "resources/icons/damage.png"
            },
            furious_assault: {
                id: "furious_assault",
                name: "Furious Assault",
                desc: "",
                commands: {
                    add_ability_battle_fury: 1,
                },
                relative_to: "fighters_vitality",
                requires: ["fighters_vitality"],
                tree: "fighter",
                pos: { x: 4, y: 2 },
                icon: "resources/icons/fighters_rage.png"
            },
            charging_bull: {
                id: "charging_bull",
                name: "Charging Bull",
                desc: "",
                commands: {
                    add_ability_charge: 1
                },
                relative_to: "furious_assault",
                requires: ["furious_assault"],
                tree: "fighter",
                pos: { x: 0, y: 2 },
                icon: "resources/icons/charge_ability.png"
            },
            tactical_genius: {
                id: "tactical_genius",
                name: "Tactical Genius",
                desc: "",
                effects: {
                    focus_strike_cooldownV: -1,
                    battle_fury_cooldownV: -3,
                    cunV: 5
                },
                relative_to: "fighters_vitality",
                requires: ["fighters_vitality", "strength_training", "fighting_style"],
                tree: "fighter",
                pos: { x: 0, y: 3 },
                icon: "resources/icons/concentration.png"
            },
            concentrated_warrior: {
                id: "concentrated_warrior",
                name: "Concentrated Warrior",
                desc: "",
                effects: {
                    focus_strike_damage_multiplierP: 15,
                    battle_fury_status_effect_attack_damage_multiplierPP: 10,
                    charge_damage_multiplierP: 25,
                    charge_resistance_penetrationV: 10,
                    charge_cooldownV: -3,
                    hitChanceV: 7
                },
                statModifiers: [
                    {
                        id: "warrior_instinct",
                        conditions: {
                            hp_less_than: 50
                        },
                        effects: {
                            resistAllV: 4
                        }
                    }
                ],
                relative_to: "tactical_genius",
                requires: ["tactical_genius", "resistant_in_melee", "charging_bull"],
                tree: "fighter",
                pos: { x: 0, y: 2 },
                icon: "resources/icons/concentrated_warrior.png"
            },
        }
    },
    barbarian: {
        id: "barbarian_perks",
        name: "Barbarian",
        perks: {
            thrill_of_battle: {
                id: "thrill_of_battle",
                name: "Thrill of Battle",
                desc: "",
                effects: {
                    strV: 1,
                },
                statModifiers: [
                    {
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
                    {
                        id: "blood_rage_2",
                        conditions: {
                            hp_less_than: 20
                        },
                        effects: {
                            damageP: 15,
                            strV: 5,
                            attack_damage_multiplierP: 10,
                        }
                    }
                ],
                tree: "barbarian",
                pos: { x: 7.5, y: 1 },
                icon: "resources/icons/rage.png"
            },
            weapon_mastery: {
                id: "weapon_mastery",
                name: "Weapon Mastery",
                desc: "",
                effects: {
                    hitChanceV: 5,
                    strV: 2
                },
                tree: "barbarian",
                pos: { x: 0, y: 2 },
                relative_to: "thrill_of_battle",
                requires: ["thrill_of_battle"],
                icon: "resources/icons/barbarian_symbol.png"
            },
            raging_charge: {
                id: "raging_charge",
                name: "Raging Charge",
                desc: "",
                effects: {
                    hpMaxV: 10
                },
                commands: {
                    add_ability_barbarian_charge: 1
                },
                tree: "barbarian",
                pos: { x: -4, y: 2 },
                relative_to: "weapon_mastery",
                requires: ["weapon_mastery"],
                icon: "resources/icons/barbarian_charge.png"
            },
            impatient: {
                id: "impatient",
                name: "Impatient",
                desc: "",
                effects: {
                    evasionV: 1,
                    barbarian_charge_cooldownV: -3,
                    barbarian_charge_damage_multiplierP: 30
                },
                tree: "barbarian",
                pos: { x: 0, y: 2 },
                relative_to: "raging_charge",
                requires: ["raging_charge"],
                icon: "resources/icons/cooldown_flame.png"
            },
            hardened_constitution: {
                id: "hardened_constitution",
                name: "Hardenend  Constitution",
                desc: "",
                effects: {
                    vitV: 3,
                    hpMaxP: 5
                },
                tree: "barbarian",
                pos: { x: -2, y: 2 },
                relative_to: "weapon_mastery",
                requires: ["weapon_mastery"],
                icon: "resources/icons/vitality.png"
            },
            sharp_senses: {
                id: "sharp_senses",
                name: "Sharpened Senses",
                desc: "",
                effects: {
                    evasionV: 2
                },
                statModifiers: [
                    {
                        id: "sense_of_danger_1",
                        conditions: {
                            hp_less_than: 50,
                            hp_more_than: 20
                        },
                        effects: {
                            evasionV: 5,
                            resistAllV: 5
                        }
                    }
                ],
                tree: "barbarian",
                pos: { x: 2, y: 2 },
                relative_to: "weapon_mastery",
                requires: ["weapon_mastery"],
                icon: "resources/icons/glass_cannon.png"
            },
            power_of_injuries: {
                id: "power_of_injuries",
                name: "Power of Injuries",
                desc: "",
                effects: {
                    strV: 1
                },
                statModifiers: [
                    {
                        id: "reckless_1",
                        conditions: {
                            hp_less_than: 50,
                            hp_more_than: 20
                        },
                        effects: {
                            hitChanceV: 5,
                            attack_damage_multiplierP: 10
                        }
                    }
                ],
                tree: "barbarian",
                pos: { x: 0, y: 2 },
                relative_to: "weapon_mastery",
                requires: ["weapon_mastery"],
                icon: "resources/icons/barbarian_flame.png"
            },
            ultimate_warrior: {
                id: "ultimate_warrior",
                name: "Ultimate Warrior",
                desc: "",
                effects: {
                    vitV: 1,
                    strV: 1
                },
                statModifiers: [
                    {
                        id: "reckless_2",
                        conditions: {
                            hp_less_than: 20,
                        },
                        effects: {
                            hitChanceV: 10,
                            attack_damage_multiplierP: 20
                        }
                    },
                    {
                        id: "sense_of_danger_2",
                        conditions: {
                            hp_less_than: 20,
                        },
                        effects: {
                            evasionV: 10,
                            resistAllV: 10
                        }
                    },
                ],
                tree: "barbarian",
                pos: { x: 0, y: 2 },
                relative_to: "power_of_injuries",
                requires: ["hardened_constitution", "power_of_injuries", "sharp_senses"],
                icon: "resources/icons/skull_of_doom.png"
            },
            perk_barbarian_rage: {
                id: "perk_barbarian_rage",
                name: "Barbarian Rage",
                desc: "",
                effects: {
                    damageP: 2,
                    resistAllV: -2
                },
                commands: {
                    add_ability_barbarian_rage: 1
                },
                tree: "barbarian",
                pos: { x: 4, y: 2 },
                relative_to: "weapon_mastery",
                requires: ["weapon_mastery"],
                icon: "resources/icons/berserk.png"
            },
            unyielding_rage: {
                id: "unyielding_rage",
                name: "Unyielding Rage",
                desc: "",
                effects: {
                    damageP: 4,
                    barbarian_rage_cooldownV: -3,
                    barbarian_rage_status_effect_strVV: 5,
                    barbarian_rage_status_effect_resistAllVV: 5,
                },
                tree: "barbarian",
                pos: { x: 0, y: 2 },
                relative_to: "perk_barbarian_rage",
                requires: ["perk_barbarian_rage"],
                icon: "resources/icons/skull_bleeding_eyes_flame.png"
            },
        }
    },
    rogue: {
        id: "rogue_perks",
        name: "Rogue",
        perks: {
            way_of_the_rogue: {
                id: "way_of_the_rogue",
                name: "Way of the Rogue",
                desc: "",
                effects: {
                    cunV: 1,
                },
                commands: {
                    add_ability_shadow_step: 1
                },
                tree: "rogue",
                pos: { x: 7.5, y: 1 },
                icon: "resources/icons/skull.png"
            },
            weakpoint_spotter: {
                id: "weakpoint_spotter",
                name: "Weakpoint Spotter",
                desc: "",
                effects: {
                    critChanceP: 5
                },
                tree: "rogue",
                relative_to: "way_of_the_rogue",
                requires: ["way_of_the_rogue"],
                pos: { x: 0, y: 2 },
                icon: "resources/icons/damage.png"
            },
            shadow_warrior: {
                id: "shadow_warrior",
                name: "Shadow Warrior",
                desc: "",
                effects: {
                    shadow_step_use_rangeP: 50,
                    shadow_step_cooldownP: -22,
                    evasionV: 3
                },
                tree: "rogue",
                relative_to: "weakpoint_spotter",
                requires: ["weakpoint_spotter"],
                pos: { x: -1.5, y: 2 },
                icon: "resources/icons/shadow_step.png"
            },
            fighting_dirty: {
                id: "fighting_dirty",
                name: "Fighting Dirty",
                desc: "",
                commands: {
                    add_ability_venomous_blow: 1,
                },
                tree: "rogue",
                relative_to: "weakpoint_spotter",
                requires: ["weakpoint_spotter"],
                pos: { x: 1.5, y: 2 },
                icon: "resources/icons/venomous_blow.png"
            },
            glass_cannon: {
                id: "glass_cannon",
                name: "Glass Cannon",
                desc: "",
                effects: {
                    damageP: 5,
                    critDamageP: 25,
                    hitChanceV: 4,
                    hpMaxP: -10,
                },
                tree: "rogue",
                relative_to: "shadow_warrior",
                requires: ["shadow_warrior"],
                pos: { x: -2, y: 1.5 },
                icon: "resources/icons/glass_cannon.png"
            },
            simple_strokes: {
                id: "simple_strokes",
                name: "Simple Strokes",
                desc: "",
                effects: {
                    attack_damage_multiplierP: 13,
                    hitChanceV: 3
                },
                tree: "rogue",
                relative_to: "glass_cannon",
                requires: ["glass_cannon"],
                pos: { x: -1.5, y: 1.5 },
                icon: "resources/icons/damage.png"
            },
            ranged_expert: {
                id: "ranged_expert",
                name: "Ranged Expert",
                desc: "",
                effects: {
                    dexV: 5
                },
                statModifiers: [
                    {
                        id: "confident_shot",
                        conditions: {
                            hp_more_than: 80
                        },
                        effects: {
                            pierceDamageP: 12
                        }
                    }
                ],
                tree: "rogue",
                relative_to: "shadow_warrior",
                requires: ["shadow_warrior", "fighting_dirty"],
                pos: { x: 1.5, y: 1.5 },
                icon: "resources/icons/weapon_bow.png"
            },
            poison_specialist: {
                id: "poison_specialist",
                name: "Poison Specialist",
                desc: "",
                effects: {
                    venomous_blow_status_effect_lastV: 2,
                    venomous_blow_cooldownP: -20,
                },
                tree: "rogue",
                relative_to: "fighting_dirty",
                requires: ["fighting_dirty"],
                pos: { x: 2, y: 1.5 },
                icon: "resources/icons/venom.png"
            },
            quicker_draw: {
                id: "quicker_draw",
                name: "Quicker Draw",
                desc: "",
                effects: {
                    venomous_blow_cooldownV: -1,
                    poisoned_arrow_cooldownV: -3,
                    shadow_step_cooldownV: -1
                },
                tree: "rogue",
                relative_to: "poison_specialist",
                requires: ["poison_specialist"],
                pos: { x: 1.5, y: 1.5 },
                icon: "resources/icons/cooldown.png"
            },
            dance_of_death: {
                id: "dance_of_death",
                name: "Dance of Death",
                desc: "",
                effects: {
                    critChanceP: 5,
                    critDamageP: 10,
                    pierceDamageP: 15,
                    evasionV: 5
                },
                tree: "rogue",
                relative_to: "ranged_expert",
                requires: ["ranged_expert", "glass_cannon"],
                pos: { x: -1.75, y: 1.5 },
                icon: "resources/icons/skull_bleeding_eyes.png"
            },
            poison_from_afar: {
                id: "poison_from_afar",
                name: "Poison from Afar",
                desc: "",
                commands: {
                    add_ability_poisoned_arrow: 1,
                },
                tree: "rogue",
                relative_to: "poison_specialist",
                requires: ["poison_specialist", "ranged_expert"],
                pos: { x: -1.75, y: 1.5 },
                icon: "resources/icons/poison_arrow.png"
            },
        }
    },
    necromancer: {
        id: "necromancer_perks",
        name: "Necromancer",
        perks: {
            pursuit_of_undeath: {
                id: "pursuit_of_undeath",
                name: "Pursuit of Undeath",
                desc: "",
                effects: {
                    hpMaxV: 10,
                    strV: 1,
                    intV: 2
                },
                commands: {
                    add_ability_focus_strike: 1
                },
                tree: "necromancer",
                pos: { x: 7.5, y: 1 },
                icon: "resources/icons/berserk.png"
            },
            pursuit_of_undeath_2: {
                id: "pursuit_of_undeath_2",
                name: "Pursuit of Undeath II",
                desc: "",
                effects: {
                    hpMaxV: 10,
                    strV: 1,
                    intV: 2
                },
                tree: "necromancer",
                pos: { x: -2, y: 3 },
                relative_to: "pursuit_of_undeath",
                requires: ["pursuit_of_undeath"],
                icon: "resources/icons/berserk.png"
            },
            pursuit_of_undeath_3: {
                id: "pursuit_of_undeath_3",
                name: "Pursuit of Undeath III",
                desc: "",
                effects: {
                    hpMaxV: 10,
                    strV: 1,
                    intV: 2
                },
                tree: "necromancer",
                pos: { x: 2, y: 3 },
                relative_to: "pursuit_of_undeath",
                requires: ["pursuit_of_undeath"],
                icon: "resources/icons/berserk.png"
            },
            pursuit_of_undeath_4: {
                id: "pursuit_of_undeath_4",
                name: "Pursuit of Undeath IV",
                desc: "",
                effects: {
                    hpMaxV: 10,
                    strV: 1,
                    intV: 2
                },
                tree: "necromancer",
                pos: { x: 2, y: 3 },
                relative_to: "pursuit_of_undeath_2",
                requires: ["pursuit_of_undeath_2", "pursuit_of_undeath_3"],
                icon: "resources/icons/berserk.png"
            },
            pursuit_of_undeath_5: {
                id: "pursuit_of_undeath_5",
                name: "Pursuit of Undeath V",
                desc: "",
                effects: {
                    hpMaxV: 10,
                    strV: 1,
                    intV: 2
                },
                tree: "necromancer",
                pos: { x: 3, y: 1 },
                relative_to: "pursuit_of_undeath_4",
                requires: ["pursuit_of_undeath_4"],
                icon: "resources/icons/berserk.png"
            },
            pursuit_of_undeath_6: {
                id: "pursuit_of_undeath_6",
                name: "Pursuit of Undeath VI",
                desc: "",
                effects: {
                    hpMaxV: 10,
                    strV: 1,
                    intV: 2
                },
                tree: "necromancer",
                pos: { x: 1, y: -2 },
                relative_to: "pursuit_of_undeath_5",
                requires: ["pursuit_of_undeath_5"],
                icon: "resources/icons/berserk.png"
            }
        }
    }
};
var lang = english;
// This is an example of a passive ability
// statModifiers: [
//   {
//     id: "frenzy",
//     conditions: {
//       hp_more_than: 50
//     },
//     effects: {
//       damageP: 12,
//       resistAllV: 2,
//       strV: 50,
//     }
//   }
// ],
//# sourceMappingURL=perks.js.map