"use strict";
const perksArray = {
    sorcerer: {
        id: "sorcerer_perks",
        name: "Sorcerer",
        startPos: 550,
        multiClassRequires: {
            int: 25,
        },
        perks: {
            introduction_to_sorcery: {
                id: "introduction_to_sorcery",
                name: "Introduction to Sorcery",
                desc: "",
                commands: {
                    add_ability_piercing_mana_bolt: 1,
                },
                traits: [
                    {
                        id: "frantic_mana_recovery",
                    },
                ],
                tree: "sorcerer",
                pos: {
                    x: 11,
                    y: 1,
                },
                icon: "resources/icons/wisdom.png",
                levelEffects: [
                    {
                        mpMaxV: 5,
                        intV: 1,
                    },
                ],
            },
            intent_studies: {
                id: "intent_studies",
                name: "Intent Studies",
                desc: "",
                tree: "sorcerer",
                relative_to: "introduction_to_sorcery",
                requires: ["introduction_to_sorcery"],
                pos: {
                    x: 0,
                    y: 2,
                },
                icon: "resources/icons/wisdom.png",
                levelEffects: [
                    {
                        mpMaxV: 8,
                        intV: 1,
                        ability_piercing_mana_bolt: {
                            mana_costV: -2,
                        },
                    },
                ],
            },
            might_of_magic: {
                id: "might_of_magic",
                name: "Might of Magic",
                desc: "",
                traits: [
                    {
                        id: "heightened_casting",
                    },
                ],
                tree: "sorcerer",
                relative_to: "intent_studies",
                requires: ["intent_studies"],
                pos: {
                    x: 3,
                    y: 2,
                },
                icon: "resources/icons/damage.png",
                levelEffects: [
                    {
                        magicDamageP: 5,
                        mpMaxP: 3,
                    },
                ],
            },
            makings_of_a_summoner: {
                id: "makings_of_a_summoner",
                name: "Makings of a Summoner",
                desc: "",
                commands: {
                    add_ability_summon_skeleton_warrior: 1,
                },
                tree: "sorcerer",
                relative_to: "might_of_magic",
                requires: ["might_of_magic"],
                pos: {
                    x: 4,
                    y: 1.5,
                },
                icon: "resources/icons/portal.png",
                levelEffects: [
                    {
                        regenMpP: 15,
                    },
                ],
            },
            magical_bonds: {
                id: "magical_bonds",
                name: "Magical Bonds",
                desc: "",
                tree: "sorcerer",
                relative_to: "makings_of_a_summoner",
                requires: ["makings_of_a_summoner"],
                pos: {
                    x: 0,
                    y: 1.5,
                },
                icon: "resources/icons/summonSkelWarrior.png",
                levelEffects: [
                    {
                        hpMaxV: 10,
                        ability_summon_skeleton_warrior: {
                            mana_costV: -5,
                            cooldownV: -7,
                            use_rangeV: 2,
                        },
                    },
                ],
            },
            spells_of_battle: {
                id: "spells_of_battle",
                name: "Spells of Battle",
                desc: "",
                tree: "sorcerer",
                relative_to: "might_of_magic",
                requires: ["might_of_magic"],
                pos: {
                    x: 0,
                    y: 1.5,
                },
                icon: "resources/icons/piercing_mana_bolt.png",
                levelEffects: [
                    {
                        ability_piercing_mana_bolt: {
                            damage_multiplierP: 12,
                            resistance_penetrationV: 10,
                        },
                    },
                ],
            },
            school_of_fire: {
                id: "school_of_fire",
                name: "The School of Fire",
                desc: "",
                commands: {
                    add_ability_fireball: 1,
                },
                tree: "sorcerer",
                relative_to: "intent_studies",
                requires: ["intent_studies"],
                pos: {
                    x: -3,
                    y: 2,
                },
                icon: "resources/icons/fireball_spell.png",
                levelEffects: [
                    {
                        fireDamageP: 10,
                    },
                ],
            },
            molded_by_flame: {
                id: "molded_by_flame",
                name: "Molded by Flame",
                desc: "",
                tree: "sorcerer",
                relative_to: "school_of_fire",
                requires: ["school_of_fire"],
                pos: {
                    x: 0,
                    y: 1.5,
                },
                icon: "resources/icons/flame_icon.png",
                levelEffects: [
                    {
                        ability_fireball: {
                            cooldownV: -1,
                            aoe_sizeV: 2.3,
                            mana_costP: 100,
                        },
                    },
                ],
            },
            elemental_mage: {
                id: "elemental_mage",
                name: "Elemental Mage",
                desc: "",
                commands: {
                    add_ability_icy_javelin: 1,
                },
                tree: "sorcerer",
                relative_to: "school_of_fire",
                requires: ["school_of_fire"],
                pos: {
                    x: -4,
                    y: 1.5,
                },
                icon: "resources/icons/elementalist.png",
                levelEffects: [
                    {
                        iceDamageP: 3,
                        fireDamageP: 3,
                        lightningDamageP: 3,
                    },
                ],
            },
            piercing_javelin: {
                id: "piercing_javelin",
                name: "Armor Piercing Javelin",
                desc: "",
                tree: "sorcerer",
                relative_to: "elemental_mage",
                requires: ["elemental_mage"],
                pos: {
                    x: 0,
                    y: 1.5,
                },
                icon: "resources/icons/ice_javelin.png",
                levelEffects: [
                    {
                        ability_icy_javelin: {
                            resistance_penetrationV: 25,
                            damage_multiplierP: 20,
                            cooldownP: -20,
                            mana_costP: 50,
                        },
                    },
                ],
            },
            shield_of_ages: {
                id: "shield_of_ages",
                name: "Shield of Ages",
                desc: "",
                tree: "sorcerer",
                relative_to: "intent_studies",
                requires: ["intent_studies"],
                pos: {
                    x: 0,
                    y: 2,
                },
                icon: "resources/icons/shield_symbol.png",
                levelEffects: [
                    {
                        magicResistV: 25,
                        mpMaxV: 10,
                    },
                ],
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
                pos: {
                    x: 0,
                    y: 1.5,
                },
                icon: "resources/icons/shield_of_aurous.png",
            },
            burning_passion: {
                id: "burning_passion",
                name: "Burning Passion",
                desc: "",
                tree: "sorcerer",
                relative_to: "molded_by_flame",
                requires: ["molded_by_flame", "shield_of_aurous"],
                pos: {
                    x: 1.5,
                    y: 2,
                },
                icon: "resources/icons/resistance_flame.png",
                levelEffects: [
                    {
                        fireDamageP: 5,
                        fireResistV: 5,
                        intV: 2,
                    },
                ],
            },
            wisdoms_of_the_past: {
                id: "wisdoms_of_the_past",
                name: "Wisdoms of the Past",
                desc: "",
                tree: "sorcerer",
                relative_to: "spells_of_battle",
                requires: ["spells_of_battle", "shield_of_aurous"],
                pos: {
                    x: -1.5,
                    y: 2,
                },
                icon: "resources/icons/mana.png",
                levelEffects: [
                    {
                        mpMaxV: 25,
                        regenMpP: 30,
                    },
                ],
            },
            flame_wizard_fury: {
                id: "flame_wizard_fury",
                name: "The Flame Wizard's Fury",
                desc: "",
                tree: "sorcerer",
                relative_to: "burning_passion",
                requires: ["burning_passion", "wisdoms_of_the_past"],
                pos: {
                    x: 1.5,
                    y: 1.5,
                },
                icon: "resources/icons/rage.png",
                levelEffects: [
                    {
                        fireDamageP: 25,
                    },
                ],
            },
        },
    },
    fighter: {
        id: "fighter_perks",
        name: "Fighter",
        startPos: 50,
        multiClassRequires: {
            vit: 20,
            str: 20,
        },
        perks: {
            battle_sense: {
                id: "battle_sense",
                name: "Battle Sense",
                desc: "",
                commands: {
                    add_ability_focus_strike: 1,
                },
                tree: "fighter",
                pos: {
                    x: 7.5,
                    y: 1,
                },
                icon: "resources/icons/fighter_symbol.png",
                levelEffects: [
                    {
                        strV: 1,
                    },
                ],
            },
            fighters_vitality: {
                id: "fighters_vitality",
                name: "Fighter's Vitality",
                desc: "",
                relative_to: "battle_sense",
                requires: ["battle_sense"],
                tree: "fighter",
                pos: {
                    x: 0,
                    y: 2,
                },
                icon: "resources/icons/health.png",
                levelEffects: [
                    {
                        hpMaxV: 10,
                        regenHpV: 0.5,
                    },
                ],
            },
            patient_blow: {
                id: "patient_blow",
                name: "Patient Blow",
                desc: "",
                relative_to: "fighters_vitality",
                requires: ["fighters_vitality"],
                tree: "fighter",
                pos: {
                    x: -4,
                    y: 2,
                },
                icon: "resources/icons/focus_strike.png",
                levelEffects: [
                    {
                        ability_focus_strike: {
                            resistance_penetrationV: 25,
                            cooldownV: -2,
                        },
                    },
                ],
            },
            resistant_in_melee: {
                id: "resistant_in_melee",
                name: "Resistant in Melee",
                desc: "",
                relative_to: "patient_blow",
                requires: ["patient_blow"],
                tree: "fighter",
                pos: {
                    x: 0,
                    y: 2,
                },
                icon: "resources/icons/resistance_default.png",
                levelEffects: [
                    {
                        resistAllV: 5,
                        evasionV: 2,
                        regenHpV: 0.25,
                    },
                ],
            },
            absorber_of_life_force: {
                id: "absorber_of_life_force",
                name: "Absorber of Life Force",
                desc: "",
                commands: {
                    add_ability_invigorating_finish: 1,
                },
                relative_to: "resistant_in_melee",
                requires: ["resistant_in_melee"],
                tree: "fighter",
                pos: {
                    x: 0,
                    y: 2,
                },
                icon: "resources/icons/invigorating_finish.png",
                levelEffects: [
                    {
                        vitP: 3,
                    },
                ],
            },
            strength_training: {
                id: "strength_training",
                name: "Strength Training",
                desc: "",
                relative_to: "fighters_vitality",
                requires: ["fighters_vitality"],
                tree: "fighter",
                pos: {
                    x: -2,
                    y: 2,
                },
                icon: "resources/icons/strength.png",
                levelEffects: [
                    {
                        strV: 2,
                        vitV: 2,
                        regenHpV: 0.25,
                    },
                ],
            },
            fighting_style: {
                id: "fighting_style",
                name: "Fighting Style",
                desc: "",
                relative_to: "fighters_vitality",
                requires: ["fighters_vitality"],
                tree: "fighter",
                pos: {
                    x: 2,
                    y: 2,
                },
                icon: "resources/icons/damage.png",
                levelEffects: [
                    {
                        ability_attack: {
                            damage_multiplierP: 10,
                        },
                        hitChanceV: 5,
                    },
                ],
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
                pos: {
                    x: 4,
                    y: 2,
                },
                icon: "resources/icons/fighters_rage.png",
            },
            charging_bull: {
                id: "charging_bull",
                name: "Charging Bull",
                desc: "",
                commands: {
                    add_ability_charge: 1,
                },
                relative_to: "furious_assault",
                requires: ["furious_assault"],
                tree: "fighter",
                pos: {
                    x: 0,
                    y: 2,
                },
                icon: "resources/icons/charge_ability.png",
            },
            fighting_with_your_voice: {
                id: "fighting_with_your_voice",
                name: "Fighting with your voice",
                desc: "",
                commands: {
                    add_ability_warrior_shout: 1,
                },
                relative_to: "charging_bull",
                requires: ["charging_bull"],
                tree: "fighter",
                pos: {
                    x: 0,
                    y: 2,
                },
                icon: "resources/icons/warrior_shout.png",
            },
            tactical_genius: {
                id: "tactical_genius",
                name: "Tactical Genius",
                desc: "",
                relative_to: "fighters_vitality",
                requires: ["fighters_vitality", "strength_training", "fighting_style"],
                tree: "fighter",
                pos: {
                    x: 0,
                    y: 3,
                },
                icon: "resources/icons/concentration.png",
                levelEffects: [
                    {
                        ability_focus_strike: {
                            strike_cooldownV: -1,
                        },
                        ability_battle_fury: {
                            cooldownV: -3,
                        },
                        cunV: 5,
                    },
                ],
            },
            concentrated_warrior: {
                id: "concentrated_warrior",
                name: "Concentrated Warrior",
                desc: "",
                traits: [
                    {
                        id: "warrior_instinct",
                    },
                ],
                relative_to: "tactical_genius",
                requires: ["tactical_genius", "resistant_in_melee", "charging_bull"],
                tree: "fighter",
                pos: {
                    x: 0,
                    y: 2,
                },
                icon: "resources/icons/concentrated_warrior.png",
                levelEffects: [
                    {
                        ability_focus_strike: {
                            damage_multiplierP: 15,
                        },
                        ability_charge: {
                            damage_multiplierP: 25,
                            resistance_penetrationV: 10,
                            cooldownV: -3,
                        },
                        hitChanceV: 7,
                    },
                ],
            },
            bulwark: {
                id: "bulwark",
                name: "Bulwark",
                desc: "",
                relative_to: "concentrated_warrior",
                requires: ["concentrated_warrior", "absorber_of_life_force"],
                mutually_exclusive: ["warrior"],
                tree: "fighter",
                pos: {
                    x: -2,
                    y: 2,
                },
                icon: "resources/icons/shield_symbol.png",
                levelEffects: [
                    {
                        physicalDefV: 10,
                        magicalDefV: 5,
                        elementalDefV: 5,
                        regenHpV: 1.5,
                        evasionV: 5,
                    },
                ],
            },
            warrior: {
                id: "warrior",
                name: "Warrior",
                desc: "",
                relative_to: "concentrated_warrior",
                requires: ["concentrated_warrior", "fighting_with_your_voice"],
                mutually_exclusive: ["bulwark"],
                tree: "fighter",
                pos: {
                    x: 2,
                    y: 2,
                },
                icon: "resources/icons/melee_damage.png",
                levelEffects: [
                    {
                        slashDamageP: 5,
                        crushDamageP: 5,
                        pierceDamageP: 5,
                        meleeDamageP: 10,
                        hitChanceV: 5,
                    },
                ],
            },
        },
    },
    barbarian: {
        id: "barbarian_perks",
        name: "Barbarian",
        startPos: 50,
        multiClassRequires: {
            str: 30,
        },
        perks: {
            thrill_of_battle: {
                id: "thrill_of_battle",
                name: "Thrill of Battle",
                desc: "",
                traits: [
                    {
                        id: "blood_rage_1",
                    },
                    {
                        id: "blood_rage_2",
                    },
                ],
                tree: "barbarian",
                pos: {
                    x: 7.5,
                    y: 1,
                },
                icon: "resources/icons/rage.png",
                levelEffects: [
                    {
                        strV: 1,
                    },
                    {
                        strV: 1,
                    },
                ],
            },
            weapon_mastery: {
                id: "weapon_mastery",
                name: "Weapon Mastery",
                desc: "",
                tree: "barbarian",
                pos: {
                    x: 0,
                    y: 2,
                },
                relative_to: "thrill_of_battle",
                requires: ["thrill_of_battle"],
                icon: "resources/icons/barbarian_symbol.png",
                levelEffects: [
                    {
                        hitChanceV: 5,
                        strV: 2,
                    },
                ],
            },
            raging_charge: {
                id: "raging_charge",
                name: "Raging Charge",
                desc: "",
                commands: {
                    add_ability_barbarian_charge: 1,
                },
                tree: "barbarian",
                pos: {
                    x: -4,
                    y: 2,
                },
                relative_to: "weapon_mastery",
                requires: ["weapon_mastery"],
                icon: "resources/icons/barbarian_charge.png",
                levelEffects: [
                    {
                        hpMaxV: 10,
                    },
                ],
            },
            impatient: {
                id: "impatient",
                name: "Impatient",
                desc: "",
                tree: "barbarian",
                pos: {
                    x: 0,
                    y: 2,
                },
                relative_to: "raging_charge",
                requires: ["raging_charge"],
                icon: "resources/icons/cooldown_flame.png",
                levelEffects: [
                    {
                        ability_barbarian_charge: {
                            cooldownV: -3,
                            damage_multiplierP: 30,
                        },
                        evasionV: 1,
                    },
                ],
            },
            perk_finishing_blow: {
                id: "perk_finishing_blow",
                name: "Finishing Blow",
                desc: "",
                commands: {
                    add_ability_finishing_blow: 1,
                },
                tree: "barbarian",
                pos: {
                    x: 2,
                    y: 2,
                },
                relative_to: "impatient",
                requires: ["impatient", "ultimate_warrior"],
                icon: "resources/icons/finishing_blow.png",
            },
            true_finish: {
                id: "true_finish",
                name: "True Finish",
                desc: "",
                tree: "barbarian",
                pos: {
                    x: 0,
                    y: 2,
                },
                relative_to: "perk_finishing_blow",
                requires: ["perk_finishing_blow"],
                icon: "resources/icons/finishing_blow_burning.png",
                levelEffects: [
                    {
                        ability_finishing_blow: {
                            damage_multiplierP: 100,
                            resistance_penetrationV: 25,
                        },
                    },
                ],
            },
            hardened_constitution: {
                id: "hardened_constitution",
                name: "Hardenend  Constitution",
                desc: "",
                tree: "barbarian",
                pos: {
                    x: -2,
                    y: 2,
                },
                relative_to: "weapon_mastery",
                requires: ["weapon_mastery"],
                icon: "resources/icons/vitality.png",
                levelEffects: [
                    {
                        vitV: 3,
                        hpMaxP: 5,
                    },
                ],
            },
            sharp_senses: {
                id: "sharp_senses",
                name: "Sharpened Senses",
                desc: "",
                traits: [
                    {
                        id: "sense_of_danger_1",
                    },
                ],
                tree: "barbarian",
                pos: {
                    x: 2,
                    y: 2,
                },
                relative_to: "weapon_mastery",
                requires: ["weapon_mastery"],
                icon: "resources/icons/glass_cannon.png",
                levelEffects: [
                    {
                        evasionV: 2,
                    },
                ],
            },
            power_of_injuries: {
                id: "power_of_injuries",
                name: "Power of Injuries",
                desc: "",
                traits: [
                    {
                        id: "reckless_1",
                    },
                ],
                tree: "barbarian",
                pos: {
                    x: 0,
                    y: 2,
                },
                relative_to: "weapon_mastery",
                requires: ["weapon_mastery"],
                icon: "resources/icons/barbarian_flame.png",
                levelEffects: [
                    {
                        strV: 1,
                    },
                ],
            },
            ultimate_warrior: {
                id: "ultimate_warrior",
                name: "Ultimate Warrior",
                desc: "",
                traits: [
                    {
                        id: "reckless_2",
                    },
                    {
                        id: "sense_of_danger_2",
                    },
                ],
                tree: "barbarian",
                pos: {
                    x: 0,
                    y: 2,
                },
                relative_to: "power_of_injuries",
                requires: ["hardened_constitution", "power_of_injuries", "sharp_senses"],
                icon: "resources/icons/skull_of_doom.png",
                levelEffects: [
                    {
                        vitV: 1,
                        strV: 1,
                    },
                ],
            },
            perk_barbarian_rage: {
                id: "perk_barbarian_rage",
                name: "Barbarian Rage",
                desc: "",
                commands: {
                    add_ability_barbarian_rage: 1,
                },
                tree: "barbarian",
                pos: {
                    x: 4,
                    y: 2,
                },
                relative_to: "weapon_mastery",
                requires: ["weapon_mastery"],
                icon: "resources/icons/berserk.png",
                levelEffects: [
                    {
                        damageP: 2,
                        resistAllV: -2,
                    },
                ],
            },
            unyielding_rage: {
                id: "unyielding_rage",
                name: "Unyielding Rage",
                desc: "",
                tree: "barbarian",
                pos: {
                    x: 0,
                    y: 2,
                },
                relative_to: "perk_barbarian_rage",
                requires: ["perk_barbarian_rage"],
                icon: "resources/icons/skull_bleeding_eyes_flame.png",
                levelEffects: [
                    {
                        ability_barbarian_rage: {
                            cooldownV: -3,
                            effect_rage: {
                                effects: {
                                    strVV: 5,
                                    resistAllVV: 5,
                                },
                            },
                        },
                        damageP: 4,
                    },
                ],
            },
            perk_berserker: {
                id: "perk_berserker",
                name: "Berserker",
                desc: "",
                commands: {
                    add_ability_berserk: 1,
                },
                tree: "barbarian",
                pos: {
                    x: -2,
                    y: 2,
                },
                relative_to: "unyielding_rage",
                requires: ["unyielding_rage", "ultimate_warrior"],
                icon: "resources/icons/absolute_berserk.png",
                levelEffects: [
                    {
                        meleeDamageP: 3,
                        strV: 1,
                    },
                ],
            },
            perk_calmer_berserk: {
                id: "perk_calmer_berserk",
                name: "Calmer Berserking",
                desc: "",
                tree: "barbarian",
                pos: {
                    x: 0,
                    y: 2,
                },
                relative_to: "perk_berserker",
                requires: ["perk_berserker"],
                icon: "resources/icons/flaming_skull_defending.png",
                levelEffects: [
                    {
                        ability_berserk: {
                            cooldownV: -5,
                            effect_berserk: {
                                effects: {
                                    physicalDefPV: 50,
                                    magicalDefPV: 50,
                                    elementalDefPV: 50,
                                    resistAllPV: 50,
                                    regenHpPV: 50,
                                },
                            },
                        },
                    },
                ],
            },
        },
    },
    paladin: {
        id: "paladin_perks",
        name: "Paladin",
        startPos: 50,
        multiClassRequires: {
            vit: 20,
            int: 18,
        },
        perks: {
            holy_smite: {
                id: "holy_smite",
                name: "Holy Smite",
                desc: "",
                commands: {
                    add_ability_focus_strike: 1,
                },
                tree: "paladin",
                pos: {
                    x: 7.5,
                    y: 1,
                },
                icon: "resources/icons/paladin_symbol.png",
                levelEffects: [
                    {
                        strV: 1,
                    },
                ],
            },
        },
    },
    rogue: {
        id: "rogue_perks",
        name: "Rogue",
        startPos: 50,
        multiClassRequires: {
            dex: 20,
            cun: 15,
        },
        perks: {
            way_of_the_rogue: {
                id: "way_of_the_rogue",
                name: "Way of the Rogue",
                desc: "",
                commands: {
                    add_ability_shadow_step: 1,
                },
                tree: "rogue",
                pos: {
                    x: 7.5,
                    y: 1,
                },
                icon: "resources/icons/skull.png",
                levelEffects: [
                    {
                        cunV: 1,
                    },
                ],
            },
            weakpoint_spotter: {
                id: "weakpoint_spotter",
                name: "Weakpoint Spotter",
                desc: "",
                commands: {
                    add_ability_sneaky_stabbing: 1,
                },
                tree: "rogue",
                relative_to: "way_of_the_rogue",
                requires: ["way_of_the_rogue"],
                pos: {
                    x: 0,
                    y: 2,
                },
                icon: "resources/icons/damage.png",
            },
            shadow_warrior: {
                id: "shadow_warrior",
                name: "Shadow Warrior",
                desc: "",
                tree: "rogue",
                relative_to: "weakpoint_spotter",
                requires: ["weakpoint_spotter"],
                pos: {
                    x: -1.5,
                    y: 2,
                },
                icon: "resources/icons/shadow_step.png",
                levelEffects: [
                    {
                        ability_shadow_step: {
                            use_rangeP: 50,
                            cooldownP: -10,
                        },
                        movementSpeedV: 10,
                        evasionV: 2,
                    },
                ],
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
                pos: {
                    x: 1.5,
                    y: 2,
                },
                icon: "resources/icons/venomous_blow.png",
            },
            glass_cannon: {
                id: "glass_cannon",
                name: "Glass Cannon",
                desc: "",
                tree: "rogue",
                relative_to: "shadow_warrior",
                requires: ["shadow_warrior"],
                pos: {
                    x: -2,
                    y: 1.5,
                },
                icon: "resources/icons/glass_cannon.png",
                levelEffects: [
                    {
                        damageP: 5,
                        critDamageP: 25,
                        hitChanceV: 4,
                        hpMaxP: -10,
                    },
                ],
            },
            tricky_distraction: {
                id: "tricky_distraction",
                name: "Tricky Distraction",
                desc: "",
                commands: {
                    add_ability_distraction: 1,
                },
                tree: "rogue",
                relative_to: "glass_cannon",
                requires: ["glass_cannon"],
                pos: {
                    x: 0,
                    y: 3,
                },
                icon: "resources/icons/dummy_ability.png",
                levelEffects: [
                    {
                        evasionV: 2,
                    },
                ],
            },
            simple_strokes: {
                id: "simple_strokes",
                name: "Simple Strokes",
                desc: "",
                tree: "rogue",
                relative_to: "glass_cannon",
                requires: ["glass_cannon"],
                pos: {
                    x: -1.5,
                    y: 1.5,
                },
                icon: "resources/icons/damage.png",
                levelEffects: [
                    {
                        ability_attack: {
                            damage_multiplierP: 10,
                        },
                        hitChanceV: 2,
                    },
                ],
            },
            ranged_expert: {
                id: "ranged_expert",
                name: "Ranged Expert",
                desc: "",
                traits: [
                    {
                        id: "confident_shot",
                    },
                ],
                tree: "rogue",
                relative_to: "shadow_warrior",
                requires: ["shadow_warrior", "fighting_dirty"],
                pos: {
                    x: 1.5,
                    y: 1.5,
                },
                icon: "resources/icons/weapon_bow.png",
                levelEffects: [
                    {
                        dexV: 5,
                    },
                ],
            },
            poison_specialist: {
                id: "poison_specialist",
                name: "Poison Specialist",
                desc: "",
                tree: "rogue",
                relative_to: "fighting_dirty",
                requires: ["fighting_dirty"],
                pos: {
                    x: 2,
                    y: 1.5,
                },
                icon: "resources/icons/venom.png",
                levelEffects: [
                    {
                        ability_venomous_blow: {
                            cooldownP: -20,
                            effect_venom: {
                                lastV: 2,
                            },
                        },
                    },
                ],
            },
            poison_taster: {
                id: "poison_taster",
                name: "Poison Taster",
                desc: "",
                tree: "rogue",
                relative_to: "poison_specialist",
                requires: ["poison_specialist"],
                pos: {
                    x: 0,
                    y: 3,
                },
                icon: "resources/icons/poison_taster.png",
                levelEffects: [
                    {
                        poisonDefenseV: 50,
                    },
                ],
            },
            quicker_draw: {
                id: "quicker_draw",
                name: "Quicker Draw",
                desc: "",
                tree: "rogue",
                relative_to: "poison_specialist",
                requires: ["poison_specialist"],
                pos: {
                    x: 1.5,
                    y: 1.5,
                },
                icon: "resources/icons/cooldown.png",
                levelEffects: [
                    {
                        ability_venomous_blow: {
                            cooldownV: -1,
                        },
                        ability_poisoned_arrow: {
                            cooldownV: -3,
                        },
                        ability_shadow_step: {
                            cooldownV: -1,
                        },
                    },
                ],
            },
            dance_of_death: {
                id: "dance_of_death",
                name: "Dance of Death",
                desc: "",
                tree: "rogue",
                relative_to: "ranged_expert",
                requires: ["ranged_expert", "glass_cannon"],
                pos: {
                    x: -1.75,
                    y: 1.5,
                },
                icon: "resources/icons/skull_bleeding_eyes.png",
                levelEffects: [
                    {
                        critChanceP: 5,
                        critDamageP: 10,
                        pierceDamageP: 15,
                        evasionV: 5,
                    },
                ],
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
                pos: {
                    x: -1.75,
                    y: 1.5,
                },
                icon: "resources/icons/poison_arrow.png",
            },
            smoke_screen: {
                id: "smoke_screen",
                name: "Smoke Screen",
                desc: "",
                commands: {
                    add_ability_smoke_bomb: 1,
                },
                tree: "rogue",
                relative_to: "ranged_expert",
                requires: ["ranged_expert"],
                pos: {
                    x: 0,
                    y: 3,
                },
                icon: "resources/icons/smoke_bomb.png",
                levelEffects: [
                    {
                        cunP: 3,
                    },
                ],
            },
            sneakier_stabbing: {
                id: "sneakier_stabbing",
                name: "Sneakier Stabbing",
                desc: "",
                tree: "rogue",
                relative_to: "smoke_screen",
                requires: ["smoke_screen"],
                pos: {
                    x: -1.5,
                    y: 1.5,
                },
                icon: "resources/icons/hand_gripping_knife.png",
                levelEffects: [
                    {
                        ability_sneaky_stabbing: {
                            cooldownP: -20,
                            effect_sneaky_stabbing: {
                                lastV: 3,
                                effects: {
                                    critChancePP: 5,
                                },
                            },
                        },
                    },
                ],
            },
            smoke_and_mirrors: {
                id: "smoke_and_mirrors",
                name: "Smoke & Mirrors",
                desc: "",
                tree: "rogue",
                relative_to: "smoke_screen",
                requires: ["smoke_screen"],
                pos: {
                    x: 1.5,
                    y: 1.5,
                },
                icon: "resources/icons/smoke_bomb_effect.png",
                levelEffects: [
                    {
                        ability_smoke_bomb: {
                            cooldownV: -2,
                            damage_multiplierP: 25,
                            effect_smoke_bomb_effect: {
                                lastV: 3,
                            },
                            effect_smoke_evasion: {
                                lastV: 3,
                            },
                        },
                    },
                ],
            },
        },
    },
    ranger: {
        id: "ranger_perks",
        name: "Ranger",
        startPos: 50,
        multiClassRequires: {
            dex: 30,
        },
        perks: {
            target_practice: {
                id: "target_practice",
                name: "Target Practice",
                desc: "",
                commands: {
                    add_ability_true_shot: 1,
                },
                tree: "ranger",
                pos: {
                    x: 8,
                    y: 1,
                },
                icon: "resources/icons/target.png",
                levelEffects: [
                    {
                        dexV: 1,
                    },
                ],
            },
            call_of_the_forest: {
                id: "call_of_the_forest",
                name: "Call of the Forest",
                desc: "",
                tree: "ranger",
                relative_to: "target_practice",
                requires: ["target_practice"],
                pos: {
                    x: 0,
                    y: 2,
                },
                icon: "resources/tiles/tree_1.png",
                levelEffects: [
                    {
                        ability_true_shot: {
                            resistance_penetrationV: 10,
                        },
                        ability_retreat: {
                            cooldownP: -10,
                        },
                        vitV: 2,
                    },
                ],
            },
            powered_arrow: {
                id: "powered_arrow",
                name: "Powered Arrow",
                desc: "",
                commands: {
                    add_ability_sundering_arrow: 1,
                },
                tree: "ranger",
                relative_to: "call_of_the_forest",
                requires: ["call_of_the_forest"],
                pos: {
                    x: -2,
                    y: 2,
                },
                icon: "resources/icons/ranged_damage.png",
                levelEffects: [
                    {
                        rangedDamageP: 2,
                    },
                ],
            },
            rapid_fire: {
                id: "rapid_fire",
                name: "Rapid fire",
                desc: "",
                tree: "ranger",
                relative_to: "powered_arrow",
                requires: ["powered_arrow"],
                pos: {
                    x: -2,
                    y: 1,
                },
                icon: "resources/icons/sundering_arrow.png",
                levelEffects: [
                    {
                        ability_sundering_arrow: {
                            cooldownP: -33,
                            effect_sunder: {
                                effects: {
                                    resistAllVV: -10,
                                },
                            },
                        },
                        dexV: 1,
                    },
                ],
            },
            critical_hit: {
                id: "critical_hit",
                name: "Critical Hit",
                desc: "",
                tree: "ranger",
                relative_to: "powered_arrow",
                requires: ["powered_arrow"],
                pos: {
                    x: -1,
                    y: 2,
                },
                icon: "resources/icons/critical_damage.png",
                levelEffects: [
                    {
                        critDamageP: 15,
                        critChanceP: 5,
                    },
                ],
            },
            rangers_call: {
                id: "rangers_call",
                name: "Rangers' Call",
                desc: "",
                tree: "ranger",
                relative_to: "call_of_the_forest",
                requires: ["call_of_the_forest"],
                pos: {
                    x: 0,
                    y: 2,
                },
                icon: "resources/icons/ornate_ranger_bow.png",
                levelEffects: [
                    {
                        ability_true_shot: {
                            cooldownV: -2,
                            use_rangeV: 2,
                        },
                        pierceDamageP: 6,
                    },
                ],
            },
            awakening: {
                id: "awakening",
                name: "Awakening",
                desc: "",
                commands: {
                    add_ability_awaken: 1,
                },
                tree: "ranger",
                relative_to: "rangers_call",
                requires: ["rangers_call"],
                pos: {
                    x: 0,
                    y: 2,
                },
                icon: "resources/icons/eye_awaken.png",
                levelEffects: [
                    {
                        hpMaxV: 10,
                    },
                ],
            },
            hunter_mark: {
                id: "hunter_mark",
                name: "Hunter Mark",
                desc: "",
                traits: [
                    {
                        id: "mark_of_hunter",
                    },
                ],
                tree: "ranger",
                relative_to: "awakening",
                requires: ["awakening"],
                pos: {
                    x: 0,
                    y: 2,
                },
                icon: "resources/icons/hunter_mark.png",
                levelEffects: [
                    {
                        dexV: 1,
                    },
                ],
            },
            shocking_assault: {
                id: "shocking_assault",
                name: "Shocking Assault",
                desc: "",
                commands: {
                    add_ability_shock_arrow: 1,
                },
                tree: "ranger",
                relative_to: "hunter_mark",
                requires: ["hunter_mark"],
                pos: {
                    x: -1,
                    y: 2,
                },
                icon: "resources/icons/shock_arrow.png",
                levelEffects: [
                    {
                        dexV: 1,
                    },
                ],
            },
            leave_you_paralyzed: {
                id: "leave_you_paralyzed",
                name: "Leave you paralyzed",
                desc: "",
                tree: "ranger",
                relative_to: "hunter_mark",
                requires: ["hunter_mark", "shocking_assault"],
                pos: {
                    x: 1,
                    y: 2,
                },
                icon: "resources/icons/bloom_yellow.png",
                levelEffects: [
                    {
                        ability_shock_arrow: {
                            cooldownV: -3,
                            effect_paralyzed: {
                                lastV: 2,
                                effects: {
                                    resistAllPP: -15,
                                },
                            },
                        },
                        dexV: 1,
                    },
                ],
            },
            wild_call: {
                id: "wild_call",
                name: "Rangers' Call",
                desc: "",
                commands: {
                    add_ability_ranger_wolf: 1,
                },
                tree: "ranger",
                relative_to: "call_of_the_forest",
                requires: ["call_of_the_forest"],
                pos: {
                    x: 2,
                    y: 2,
                },
                icon: "resources/icons/ranger_wolf.png",
                levelEffects: [
                    {
                        damageP: 2,
                    },
                ],
            },
            trusted_companion: {
                id: "trusted_companion",
                name: "Rangers' Call",
                desc: "",
                tree: "ranger",
                relative_to: "wild_call",
                requires: ["wild_call"],
                pos: {
                    x: 1,
                    y: 2,
                },
                icon: "resources/icons/ranger_wolf.png",
                levelEffects: [
                    {
                        ability_ranger_wolf: {
                            summon_levelV: 9,
                            cooldownV: -20,
                        },
                    },
                ],
            },
            fierce_beast: {
                id: "fierce_beast",
                name: "Rangers' Call",
                desc: "",
                tree: "ranger",
                relative_to: "wild_call",
                requires: ["wild_call"],
                pos: {
                    x: 2,
                    y: 1,
                },
                icon: "resources/icons/ranger_wolf.png",
                levelEffects: [
                    {
                        all_summons_damageP: 20,
                        all_summons_regenHpP: 100,
                    },
                ],
            },
        },
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
                tree: "adventurer_shared",
                pos: {
                    x: 3,
                    y: 1,
                },
                icon: "resources/icons/health.png",
                levelEffects: [
                    {
                        hpMaxP: 5,
                    },
                ],
            },
            hearty_adventurer_2: {
                id: "hearty_adventurer_2",
                name: "Hearty Adventurer 2",
                desc: "",
                relative_to: "hearty_adventurer_1",
                requires: ["hearty_adventurer_1"],
                tree: "adventurer_shared",
                pos: {
                    x: 0,
                    y: 1.5,
                },
                icon: "resources/icons/health.png",
                levelEffects: [
                    {
                        hpMaxP: 5,
                    },
                ],
            },
            hearty_adventurer_3: {
                id: "hearty_adventurer_3",
                name: "Hearty Adventurer 3",
                desc: "",
                relative_to: "hearty_adventurer_2",
                requires: ["hearty_adventurer_2"],
                tree: "adventurer_shared",
                pos: {
                    x: 0,
                    y: 1.5,
                },
                icon: "resources/icons/health.png",
                levelEffects: [
                    {
                        hpMaxP: 5,
                    },
                ],
            },
            hearty_adventurer_4: {
                id: "hearty_adventurer_4",
                name: "Hearty Adventurer 4",
                desc: "",
                relative_to: "hearty_adventurer_3",
                requires: ["hearty_adventurer_3"],
                tree: "adventurer_shared",
                pos: {
                    x: 0,
                    y: 1.5,
                },
                icon: "resources/icons/health.png",
                levelEffects: [
                    {
                        hpMaxP: 5,
                    },
                ],
            },
            hearty_adventurer_5: {
                id: "hearty_adventurer_5",
                name: "Hearty Adventurer 5",
                desc: "",
                relative_to: "hearty_adventurer_4",
                requires: ["hearty_adventurer_4"],
                tree: "adventurer_shared",
                pos: {
                    x: 0,
                    y: 1.5,
                },
                icon: "resources/icons/health.png",
                levelEffects: [
                    {
                        hpMaxP: 5,
                    },
                ],
            },
            first_aid_expert: {
                id: "first_aid_expert",
                name: "First Aid Expert",
                desc: "",
                tree: "adventurer_shared",
                pos: {
                    x: 6,
                    y: 1,
                },
                icon: "resources/icons/first_aid.png",
                levelEffects: [
                    {
                        ability_first_aid: {
                            base_healV: 5,
                            cooldownP: -20,
                        },
                        regenHpP: 14,
                    },
                ],
            },
            cleanser: {
                id: "cleanser",
                name: "Cleanser",
                desc: "",
                commands: {
                    add_ability_purification: 1,
                },
                relative_to: "first_aid_expert",
                requires: ["first_aid_expert"],
                tree: "adventurer_shared",
                pos: {
                    x: 0,
                    y: 1.5,
                },
                icon: "resources/icons/purification.png",
                levelEffects: [
                    {
                        regenHpP: 6,
                    },
                ],
            },
            advancing_backwards: {
                id: "advancing_backwards",
                name: "Advancing Backwards",
                desc: "",
                relative_to: "cleanser",
                requires: ["cleanser"],
                tree: "adventurer_shared",
                pos: {
                    x: 0,
                    y: 1.5,
                },
                icon: "resources/icons/retreat.png",
                levelEffects: [
                    {
                        ability_retreat: {
                            cooldownP: -30,
                            use_rangeV: 2,
                        },
                    },
                ],
            },
        },
    },
};
const dummyPerk = {
    id: "ignore",
    name: "ignore",
    desc: "",
    effects: {},
    tree: "adventurer_shared",
    pos: { x: -5000, y: -5000 },
    icon: "",
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