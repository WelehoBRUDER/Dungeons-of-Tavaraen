"use strict";
const perksArray = {
    sorcerer: {
        id: "sorcerer_perks",
        name: "Sorcerer",
        startPos: 550,
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
                traits: [
                    {
                        id: "frantic_mana_recovery",
                    }
                ],
                tree: "sorcerer",
                pos: { x: 11, y: 1 },
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
                traits: [
                    {
                        id: "heightened_casting",
                    }
                ],
                tree: "sorcerer",
                relative_to: "intent_studies",
                requires: ["intent_studies"],
                pos: { x: 3, y: 2 },
                icon: "resources/icons/damage.png"
            },
            makings_of_a_summoner: {
                id: "makings_of_a_summoner",
                name: "Makings of a Summoner",
                desc: "",
                effects: {
                    regenMpP: 15
                },
                commands: {
                    add_ability_summon_skeleton_warrior: 1
                },
                tree: "sorcerer",
                relative_to: "might_of_magic",
                requires: ["might_of_magic"],
                pos: { x: 4, y: 1.5 },
                icon: "resources/icons/portal.png"
            },
            magical_bonds: {
                id: "magical_bonds",
                name: "Magical Bonds",
                desc: "",
                effects: {
                    hpMaxV: 10,
                    summon_skeleton_warrior_mana_costV: -5,
                    summon_skeleton_warrior_cooldownV: -7,
                    summon_skeleton_warrior_use_rangeV: 2
                },
                tree: "sorcerer",
                relative_to: "makings_of_a_summoner",
                requires: ["makings_of_a_summoner"],
                pos: { x: 0, y: 1.5 },
                icon: "resources/icons/summonSkelWarrior.png"
            },
            spells_of_battle: {
                id: "spells_of_battle",
                name: "Spells of Battle",
                desc: "",
                effects: {
                    piercing_mana_bolt_damage_multiplierP: 12,
                    piercing_mana_bolt_resistance_penetrationV: 10
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
                    fireball_cooldownV: -1,
                    fireball_aoe_sizeV: 2.3,
                    fireball_mana_costP: 100
                },
                tree: "sorcerer",
                relative_to: "school_of_fire",
                requires: ["school_of_fire"],
                pos: { x: 0, y: 1.5 },
                icon: "resources/icons/flame_icon.png"
            },
            elemental_mage: {
                id: "elemental_mage",
                name: "Elemental Mage",
                desc: "",
                commands: {
                    add_ability_icy_javelin: 1,
                },
                effects: {
                    iceDamageP: 3,
                    fireDamageP: 3,
                    lightningDamageP: 3
                },
                tree: "sorcerer",
                relative_to: "school_of_fire",
                requires: ["school_of_fire"],
                pos: { x: -4, y: 1.5 },
                icon: "resources/icons/elementalist.png"
            },
            piercing_javelin: {
                id: "piercing_javelin",
                name: "Armor Piercing Javelin",
                desc: "",
                effects: {
                    icy_javelin_resistance_penetrationV: 25,
                    icy_javelin_damage_multiplierP: 20,
                    icy_javelin_cooldownP: -20,
                    icy_javelin_mana_costP: 50
                },
                tree: "sorcerer",
                relative_to: "elemental_mage",
                requires: ["elemental_mage"],
                pos: { x: 0, y: 1.5 },
                icon: "resources/icons/ice_javelin.png"
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
                    mpMaxV: 25,
                    regenMpP: 30
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
        startPos: 50,
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
            absorber_of_life_force: {
                id: "absorber_of_life_force",
                name: "Absorber of Life Force",
                desc: "",
                effects: {
                    vitP: 3
                },
                commands: {
                    add_ability_invigorating_finish: 1
                },
                relative_to: "resistant_in_melee",
                requires: ["resistant_in_melee"],
                tree: "fighter",
                pos: { x: 0, y: 2 },
                icon: "resources/icons/invigorating_finish.png"
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
            fighting_with_your_voice: {
                id: "fighting_with_your_voice",
                name: "Fighting with your voice",
                desc: "",
                commands: {
                    add_ability_warrior_shout: 1
                },
                relative_to: "charging_bull",
                requires: ["charging_bull"],
                tree: "fighter",
                pos: { x: 0, y: 2 },
                icon: "resources/icons/warrior_shout.png"
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
                    charge_damage_multiplierP: 25,
                    charge_resistance_penetrationV: 10,
                    charge_cooldownV: -3,
                    hitChanceV: 7
                },
                traits: [
                    {
                        id: "warrior_instinct",
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
        startPos: 50,
        perks: {
            thrill_of_battle: {
                id: "thrill_of_battle",
                name: "Thrill of Battle",
                desc: "",
                effects: {
                    strV: 1,
                },
                traits: [
                    {
                        id: "blood_rage_1",
                    },
                    {
                        id: "blood_rage_2",
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
            perk_finishing_blow: {
                id: "perk_finishing_blow",
                name: "Finishing Blow",
                desc: "",
                commands: {
                    add_ability_finishing_blow: 1
                },
                tree: "barbarian",
                pos: { x: 2, y: 2 },
                relative_to: "impatient",
                requires: ["impatient", "ultimate_warrior"],
                icon: "resources/icons/finishing_blow.png"
            },
            true_finish: {
                id: "true_finish",
                name: "True Finish",
                desc: "",
                effects: {
                    finishing_blow_damage_multiplierP: 100,
                    finishing_blow_resistance_penetrationV: 25
                },
                tree: "barbarian",
                pos: { x: 0, y: 2 },
                relative_to: "perk_finishing_blow",
                requires: ["perk_finishing_blow"],
                icon: "resources/icons/finishing_blow_burning.png"
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
                traits: [
                    {
                        id: "sense_of_danger_1",
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
                traits: [
                    {
                        id: "reckless_1",
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
                traits: [
                    {
                        id: "reckless_2",
                    },
                    {
                        id: "sense_of_danger_2",
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
                    barbarian_rage_status_effect_rage_strVV: 5,
                    barbarian_rage_status_effect_rage_resistAllVV: 5,
                },
                tree: "barbarian",
                pos: { x: 0, y: 2 },
                relative_to: "perk_barbarian_rage",
                requires: ["perk_barbarian_rage"],
                icon: "resources/icons/skull_bleeding_eyes_flame.png"
            },
            perk_berserker: {
                id: "perk_berserker",
                name: "Berserker",
                desc: "",
                effects: {
                    meleeDamageP: 3,
                    strV: 1
                },
                commands: {
                    add_ability_berserk: 1
                },
                tree: "barbarian",
                pos: { x: -2, y: 2 },
                relative_to: "unyielding_rage",
                requires: ["unyielding_rage", "ultimate_warrior"],
                icon: "resources/icons/absolute_berserk.png"
            },
            perk_calmer_berserk: {
                id: "perk_calmer_berserk",
                name: "Calmer Berserking",
                desc: "",
                effects: {
                    berserk_cooldownV: -5,
                    berserk_status_effect_berserk_physicalDefPV: 50,
                    berserk_status_effect_berserk_magicalDefPV: 50,
                    berserk_status_effect_berserk_elementalDefPV: 50,
                    berserk_status_effect_berserk_resistAllPV: 50,
                    berserk_status_effect_berserk_regenHpPV: 50
                },
                tree: "barbarian",
                pos: { x: 0, y: 2 },
                relative_to: "perk_berserker",
                requires: ["perk_berserker"],
                icon: "resources/icons/flaming_skull_defending.png"
            },
        }
    },
    rogue: {
        id: "rogue_perks",
        name: "Rogue",
        startPos: 50,
        perks: {
            way_of_the_rogue: {
                id: "way_of_the_rogue",
                name: "Way of the Rogue",
                desc: "",
                effects: {
                    cunV: 1,
                },
                commands: {
                    add_ability_shadow_step: 1,
                },
                tree: "rogue",
                pos: { x: 7.5, y: 1 },
                icon: "resources/icons/skull.png"
            },
            weakpoint_spotter: {
                id: "weakpoint_spotter",
                name: "Weakpoint Spotter",
                desc: "",
                commands: {
                    add_ability_sneaky_stabbing: 1
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
                    movementSpeedV: 10,
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
            tricky_distraction: {
                id: "tricky_distraction",
                name: "Tricky Distraction",
                desc: "",
                effects: {
                    evasionV: 2
                },
                commands: {
                    add_ability_distraction: 1
                },
                tree: "rogue",
                relative_to: "glass_cannon",
                requires: ["glass_cannon"],
                pos: { x: 0, y: 3 },
                icon: "resources/icons/dummy_ability.png"
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
                traits: [
                    {
                        id: "confident_shot",
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
                    venomous_blow_status_effect_venom_lastV: 2,
                    venomous_blow_cooldownP: -20,
                },
                tree: "rogue",
                relative_to: "fighting_dirty",
                requires: ["fighting_dirty"],
                pos: { x: 2, y: 1.5 },
                icon: "resources/icons/venom.png"
            },
            poison_taster: {
                id: "poison_taster",
                name: "Poison Taster",
                desc: "",
                effects: {
                    poisonDefenseV: 50
                },
                tree: "rogue",
                relative_to: "poison_specialist",
                requires: ["poison_specialist"],
                pos: { x: 0, y: 3 },
                icon: "resources/icons/poison_taster.png"
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
            smoke_screen: {
                id: "smoke_screen",
                name: "Smoke Screen",
                desc: "",
                effects: {
                    cunP: 3
                },
                commands: {
                    add_ability_smoke_bomb: 1
                },
                tree: "rogue",
                relative_to: "ranged_expert",
                requires: ["ranged_expert"],
                pos: { x: 0, y: 3 },
                icon: "resources/icons/smoke_bomb.png"
            },
            sneakier_stabbing: {
                id: "sneakier_stabbing",
                name: "Sneakier Stabbing",
                desc: "",
                effects: {
                    sneaky_stabbing_cooldownP: -20,
                    sneaky_stabbing_status_effect_sneaky_stabbing_lastV: 3,
                    sneaky_stabbing_status_effect_sneaky_stabbing_critChancePP: 5
                },
                tree: "rogue",
                relative_to: "smoke_screen",
                requires: ["smoke_screen"],
                pos: { x: -1.5, y: 1.5 },
                icon: "resources/icons/hand_gripping_knife.png"
            },
            smoke_and_mirrors: {
                id: "smoke_and_mirrors",
                name: "Smoke & Mirrors",
                desc: "",
                effects: {
                    smoke_bomb_cooldownV: -2,
                    smoke_bomb_status_effect_smoke_bomb_effect_lastV: 3,
                    smoke_bomb_status_effect_smoke_evasion_lastV: 3,
                    smoke_bomb_damage_multiplierP: 25
                },
                tree: "rogue",
                relative_to: "smoke_screen",
                requires: ["smoke_screen"],
                pos: { x: 1.5, y: 1.5 },
                icon: "resources/icons/smoke_bomb_effect.png"
            },
        }
    },
    ranger: {
        id: "ranger_perks",
        name: "Ranger",
        startPos: 50,
        perks: {
            target_practice: {
                id: "target_practice",
                name: "Target Practice",
                desc: "",
                effects: {
                    dexV: 1
                },
                commands: {
                    add_ability_true_shot: 1
                },
                tree: "ranger",
                pos: { x: 8, y: 1 },
                icon: "resources/icons/target.png"
            },
            call_of_the_forest: {
                id: "call_of_the_forest",
                name: "Call of the Forest",
                desc: "",
                effects: {
                    true_shot_resistance_penetrationV: 10,
                    retreat_cooldownP: -11,
                    vitV: 2
                },
                tree: "ranger",
                relative_to: "target_practice",
                requires: ["target_practice"],
                pos: { x: 0, y: 2 },
                icon: "resources/tiles/tree_1.png"
            },
            powered_arrow: {
                id: "powered_arrow",
                name: "Powered Arrow",
                desc: "",
                effects: {
                    rangedDamageP: 2
                },
                commands: {
                    add_ability_sundering_arrow: 1
                },
                tree: "ranger",
                relative_to: "call_of_the_forest",
                requires: ["call_of_the_forest"],
                pos: { x: -2, y: 2 },
                icon: "resources/icons/ranged_damage.png"
            },
            rapid_fire: {
                id: "rapid_fire",
                name: "Rapid fire",
                desc: "",
                effects: {
                    sundering_arrow_cooldownP: -33,
                    sundering_arrow_status_effect_sunder_resistAllVV: -10,
                    dexV: 1
                },
                tree: "ranger",
                relative_to: "powered_arrow",
                requires: ["powered_arrow"],
                pos: { x: -2, y: 1 },
                icon: "resources/icons/sundering_arrow.png"
            },
            critical_hit: {
                id: "critical_hit",
                name: "Critical Hit",
                desc: "",
                effects: {
                    critDamageP: 15,
                    critChanceP: 5
                },
                tree: "ranger",
                relative_to: "powered_arrow",
                requires: ["powered_arrow"],
                pos: { x: -1, y: 2 },
                icon: "resources/icons/critical_damage.png"
            },
            rangers_call: {
                id: "rangers_call",
                name: "Rangers' Call",
                desc: "",
                effects: {
                    pierceDamageP: 6,
                    true_shot_cooldownV: -2,
                    true_shot_use_rangeV: 2
                },
                tree: "ranger",
                relative_to: "call_of_the_forest",
                requires: ["call_of_the_forest"],
                pos: { x: 0, y: 2 },
                icon: "resources/icons/ornate_ranger_bow.png"
            },
            awakening: {
                id: "awakening",
                name: "Awakening",
                desc: "",
                effects: {
                    hpMaxV: 10
                },
                commands: {
                    add_ability_awaken: 1
                },
                tree: "ranger",
                relative_to: "rangers_call",
                requires: ["rangers_call"],
                pos: { x: 0, y: 2 },
                icon: "resources/icons/eye_awaken.png"
            },
            hunter_mark: {
                id: "hunter_mark",
                name: "Hunter Mark",
                desc: "",
                effects: {
                    dexV: 1
                },
                traits: [
                    {
                        id: "mark_of_hunter",
                    }
                ],
                tree: "ranger",
                relative_to: "awakening",
                requires: ["awakening"],
                pos: { x: 0, y: 2 },
                icon: "resources/icons/hunter_mark.png"
            },
            shocking_assault: {
                id: "shocking_assault",
                name: "Shocking Assault",
                desc: "",
                effects: {
                    dexV: 1
                },
                commands: {
                    add_ability_shock_arrow: 1
                },
                tree: "ranger",
                relative_to: "hunter_mark",
                requires: ["hunter_mark"],
                pos: { x: -1, y: 2 },
                icon: "resources/icons/shock_arrow.png"
            },
            leave_you_paralyzed: {
                id: "leave_you_paralyzed",
                name: "Leave you paralyzed",
                desc: "",
                effects: {
                    shock_arrow_cooldownV: -3,
                    shock_arrow_status_effect_paralyzed_lastV: 2,
                    shock_arrow_status_effect_paralyzed_resistAllPP: -15,
                    dexV: 1
                },
                tree: "ranger",
                relative_to: "hunter_mark",
                requires: ["hunter_mark", "shocking_assault"],
                pos: { x: 1, y: 2 },
                icon: "resources/icons/bloom_yellow.png"
            },
            wild_call: {
                id: "wild_call",
                name: "Rangers' Call",
                desc: "",
                effects: {
                    damageP: 2
                },
                commands: {
                    add_ability_ranger_wolf: 1
                },
                tree: "ranger",
                relative_to: "call_of_the_forest",
                requires: ["call_of_the_forest"],
                pos: { x: 2, y: 2 },
                icon: "resources/icons/ranger_wolf.png"
            },
            trusted_companion: {
                id: "trusted_companion",
                name: "Rangers' Call",
                desc: "",
                effects: {
                    ranger_wolf_summon_levelV: 9,
                    ranger_wolf_cooldownV: -20
                },
                tree: "ranger",
                relative_to: "wild_call",
                requires: ["wild_call"],
                pos: { x: 1, y: 2 },
                icon: "resources/icons/ranger_wolf.png"
            },
            fierce_beast: {
                id: "fierce_beast",
                name: "Rangers' Call",
                desc: "",
                effects: {
                    all_summons_damageP: 20,
                    all_summons_regenHpP: 100
                },
                tree: "ranger",
                relative_to: "wild_call",
                requires: ["wild_call"],
                pos: { x: 2, y: 1 },
                icon: "resources/icons/ranger_wolf.png"
            },
        }
    },
    adventurer_shared: {
        id: "adventurer_shared",
        name: "Adventurer",
        startPos: 50,
        perks: {
            hearty_adventurer_1: {
                id: "hearty_adventurer_1",
                name: "Hearty Adventurer 1",
                desc: "",
                effects: {
                    hpMaxV: 10
                },
                tree: "adventurer_shared",
                pos: { x: 3, y: 1 },
                icon: "resources/icons/health.png"
            },
            hearty_adventurer_2: {
                id: "hearty_adventurer_2",
                name: "Hearty Adventurer 2",
                desc: "",
                effects: {
                    hpMaxV: 15
                },
                relative_to: "hearty_adventurer_1",
                requires: ["hearty_adventurer_1"],
                tree: "adventurer_shared",
                pos: { x: 0, y: 1.5 },
                icon: "resources/icons/health.png"
            },
            hearty_adventurer_3: {
                id: "hearty_adventurer_3",
                name: "Hearty Adventurer 3",
                desc: "",
                effects: {
                    hpMaxV: 20
                },
                relative_to: "hearty_adventurer_2",
                requires: ["hearty_adventurer_2"],
                tree: "adventurer_shared",
                pos: { x: 0, y: 1.5 },
                icon: "resources/icons/health.png"
            },
            hearty_adventurer_4: {
                id: "hearty_adventurer_4",
                name: "Hearty Adventurer 4",
                desc: "",
                effects: {
                    hpMaxP: 10
                },
                relative_to: "hearty_adventurer_3",
                requires: ["hearty_adventurer_3"],
                tree: "adventurer_shared",
                pos: { x: 0, y: 1.5 },
                icon: "resources/icons/health.png"
            },
            hearty_adventurer_5: {
                id: "hearty_adventurer_5",
                name: "Hearty Adventurer 5",
                desc: "",
                effects: {
                    hpMaxP: 15
                },
                relative_to: "hearty_adventurer_4",
                requires: ["hearty_adventurer_4"],
                tree: "adventurer_shared",
                pos: { x: 0, y: 1.5 },
                icon: "resources/icons/health.png"
            },
            first_aid_expert: {
                id: "first_aid_expert",
                name: "First Aid Expert",
                desc: "",
                effects: {
                    regenHpP: 14,
                    first_aid_base_healV: 5,
                    first_aid_cooldownP: -20
                },
                tree: "adventurer_shared",
                pos: { x: 6, y: 1 },
                icon: "resources/icons/first_aid.png"
            },
            cleanser: {
                id: "cleanser",
                name: "Cleanser",
                desc: "",
                effects: {
                    regenHpP: 6,
                },
                commands: {
                    add_ability_purification: 1
                },
                relative_to: "first_aid_expert",
                requires: ["first_aid_expert"],
                tree: "adventurer_shared",
                pos: { x: 0, y: 1.5 },
                icon: "resources/icons/purification.png"
            },
            advancing_backwards: {
                id: "advancing_backwards",
                name: "Advancing Backwards",
                desc: "",
                effects: {
                    retreat_cooldownP: -30,
                    retreat_use_rangeV: 2
                },
                relative_to: "cleanser",
                requires: ["cleanser"],
                tree: "adventurer_shared",
                pos: { x: 0, y: 1.5 },
                icon: "resources/icons/retreat.png"
            },
        }
    }
};
const dummyPerk = {
    id: "ignore",
    name: "ignore",
    desc: "",
    effects: {},
    tree: "adventurer_shared",
    pos: { x: -5000, y: -5000 },
    icon: ""
};
/* OUTDATED */
// This is an example of a passive ability
// traits: [
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
/* NEW */
// traits: [
// { id: "frenzy" }
//],
// DEFINED IN statModifier.ts
//# sourceMappingURL=perks.js.map