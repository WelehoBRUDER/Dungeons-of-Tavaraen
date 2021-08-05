"use strict";
const straight_modifiers = [
    "mana_cost",
    "cooldown",
    "resistance_penetration",
    "base_heal",
    "damage_multiplier",
    "use_range",
    "summon_level",
    "summon_last",
    "aoe_size",
];
const less_is_better = {
    mana_cost: true,
    cooldown: true,
    resistance_penetration: false,
    base_heal: false,
    damage_multiplier: false,
    use_range: false
};
const possible_stat_modifiers = [
    "strV",
    "strP",
    "vitV",
    "vitP",
    "dexV",
    "dexP",
    "intV",
    "intP",
    "hpV",
    "hpP",
    "mpV",
    "mpP",
];
const possible_modifiers = [
    "last",
    "attack_damage_multiplierV",
    "attack_damage_multiplierP",
    "attack_resistance_penetrationV",
    "attack_resistance_penetrationP"
];
class Ability {
    constructor(base, user) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        this.id = base.id;
        const values = getAbiModifiers(user, base.id);
        // @ts-ignore
        const baseAbility = abilities[this.id];
        const statusModifiers = getAbiStatusModifiers(user, base.id, baseAbility.status);
        this.name = baseAbility.name;
        this.mana_cost = (_a = Math.floor((baseAbility.mana_cost + values.mana_cost.value) * values.mana_cost.modif)) !== null && _a !== void 0 ? _a : 0;
        this.cooldown = (_b = Math.floor((baseAbility.cooldown + values.cooldown.value) * values.cooldown.modif)) !== null && _b !== void 0 ? _b : 0;
        this.type = (_c = baseAbility.type) !== null && _c !== void 0 ? _c : "none";
        this.onCooldown = (_d = base.onCooldown) !== null && _d !== void 0 ? _d : 0;
        this.equippedSlot = (_e = base.equippedSlot) !== null && _e !== void 0 ? _e : -1;
        this.damages = baseAbility.damages;
        this.damage_multiplier = (_f = (baseAbility.damage_multiplier + values.damage_multiplier.value + (values.damage_multiplier.modif - 1))) !== null && _f !== void 0 ? _f : 1;
        this.resistance_penetration = (_g = Math.floor((baseAbility.resistance_penetration + values.resistance_penetration.value + (values.resistance_penetration.modif - 1)))) !== null && _g !== void 0 ? _g : 0;
        this.base_heal = (_h = Math.floor((baseAbility.base_heal + values.base_heal.value) * values.base_heal.modif)) !== null && _h !== void 0 ? _h : 0;
        this.stat_bonus = (_j = baseAbility.stat_bonus) !== null && _j !== void 0 ? _j : "";
        this.status = (_k = baseAbility.status) !== null && _k !== void 0 ? _k : "";
        this.status_power = (_l = baseAbility.status_power) !== null && _l !== void 0 ? _l : 0;
        this.shoots_projectile = (_m = baseAbility.shoots_projectile) !== null && _m !== void 0 ? _m : "";
        this.icon = baseAbility.icon;
        this.line = (_o = baseAbility.line) !== null && _o !== void 0 ? _o : "";
        this.use_range = typeof parseInt(baseAbility.use_range) === 'number' ? Math.floor(((parseInt(baseAbility.use_range) + values.use_range.value) * values.use_range.modif)).toString() : baseAbility.use_range;
        this.requires_melee_weapon = (_p = baseAbility.requires_melee_weapon) !== null && _p !== void 0 ? _p : false;
        this.requires_ranged_weapon = (_q = baseAbility.requires_ranged_weapon) !== null && _q !== void 0 ? _q : false;
        this.requires_concentration = (_r = baseAbility.requires_concentration) !== null && _r !== void 0 ? _r : false;
        this.recharge_only_in_combat = (_s = baseAbility.recharge_only_in_combat) !== null && _s !== void 0 ? _s : false;
        this.summon_unit = baseAbility.summon_unit;
        this.summon_level = (_t = Math.floor((baseAbility.summon_level + values.summon_level.value) * values.summon_level.modif)) !== null && _t !== void 0 ? _t : 0;
        ;
        this.summon_last = (_u = Math.floor((baseAbility.summon_last + values.summon_last.value) * values.summon_last.modif)) !== null && _u !== void 0 ? _u : 0;
        ;
        this.aoe_size = (_v = (baseAbility.aoe_size + values.aoe_size.value) * values.aoe_size.modif) !== null && _v !== void 0 ? _v : 0;
        this.aoe_effect = (_w = baseAbility.aoe_effect) !== null && _w !== void 0 ? _w : "";
        this.self_target = (_x = baseAbility.self_target) !== null && _x !== void 0 ? _x : false;
        this.statusModifiers = statusModifiers;
        this.action_desc = baseAbility.action_desc;
        this.action_desc_pl = baseAbility.action_desc_pl;
        this.ai_chance = baseAbility.ai_chance;
        this.remove_status = baseAbility.remove_status;
        if (this.cooldown < 0)
            this.cooldown = 0;
    }
}
function getAbiModifiers(char, id) {
    var _a, _b;
    const total = {};
    straight_modifiers.forEach((mod) => {
        total[mod] = { value: 0, modif: 1 };
    });
    (_a = char.perks) === null || _a === void 0 ? void 0 : _a.forEach((prk) => {
        Object.entries(prk.effects).forEach((eff) => {
            let key = eff[0];
            let value = eff[1];
            if (key.includes(id) && !key.includes("status")) {
                key = key.replace(id + "_", "");
                const _key = key.substring(0, key.length - 1);
                if (key.endsWith("V"))
                    total[_key].value += value;
                else if (key.endsWith("P") && value < 0)
                    total[_key].modif *= (1 + value / 100);
                else if (key.endsWith("P"))
                    total[_key].modif += (value / 100);
            }
        });
        if (prk.statModifiers) {
            prk.statModifiers.forEach((mod) => {
                let apply = true;
                if (mod.conditions) {
                    apply = statConditions(mod.conditions, char);
                }
                if (apply) {
                    Object.entries(mod.effects).forEach((eff) => {
                        let key = eff[0];
                        let value = eff[1];
                        if (key.includes(id) && !key.includes("status")) {
                            key = key.replace(id + "_", "");
                            const _key = key.substring(0, key.length - 1);
                            if (key.endsWith("V"))
                                total[_key].value += value;
                            else if (key.endsWith("P") && value < 0)
                                total[_key].modif *= (1 + value / 100);
                            else if (key.endsWith("P"))
                                total[_key].modif += (value / 100);
                        }
                    });
                }
            });
        }
    });
    char.statusEffects.forEach((stat) => {
        Object.entries(stat.effects).forEach((eff) => {
            let key = eff[0];
            let value = eff[1];
            if (key.includes(id) && !key.includes("status")) {
                key = key.replace(id + "_", "");
                const _key = key.substring(0, key.length - 1);
                if (key.endsWith("V"))
                    total[_key].value += value;
                else if (key.endsWith("P") && value < 0)
                    total[_key].modif *= (1 + value / 100);
                else if (key.endsWith("P"))
                    total[_key].modif += (value / 100);
            }
        });
    });
    (_b = char.statModifiers) === null || _b === void 0 ? void 0 : _b.forEach((stat) => {
        let apply = true;
        if (stat.conditions) {
            apply = statConditions(stat.conditions, char);
        }
        if (apply) {
            Object.entries(stat.effects).forEach((eff) => {
                let key = eff[0];
                let value = eff[1];
                if (key.includes(id) && !key.includes("status")) {
                    key = key.replace(id + "_", "");
                    const _key = key.substring(0, key.length - 1);
                    if (key.endsWith("V"))
                        total[_key].value += value;
                    else if (key.endsWith("P") && value < 0)
                        total[_key].modif *= (1 + value / 100);
                    else if (key.endsWith("P"))
                        total[_key].modif += (value / 100);
                }
            });
        }
    });
    equipmentSlots.forEach((slot) => {
        var _a;
        if ((_a = char[slot]) === null || _a === void 0 ? void 0 : _a.stats) {
            Object.entries(char[slot].stats).forEach((eff) => {
                let key = eff[0];
                let value = eff[1];
                if (key.includes(id) && !key.includes("status")) {
                    key = key.replace(id + "_", "");
                    const _key = key.substring(0, key.length - 1);
                    if (key.endsWith("V"))
                        total[_key].value += value;
                    else if (key.endsWith("P") && value < 0)
                        total[_key].modif *= (1 + value / 100);
                    else if (key.endsWith("P"))
                        total[_key].modif += (value / 100);
                }
            });
        }
    });
    return total;
}
function getAbiStatusModifiers(char, abilityId, effectId) {
    var _a, _b;
    const total = { effects: {} };
    possible_stat_modifiers.forEach((mod) => {
        total["effects"][mod] = { value: 0, modif: 1 };
    });
    possible_modifiers.forEach((mod) => {
        total[mod] = { value: 0, modif: 1 };
    });
    char.statusEffects.forEach((stat) => {
        // Go through stat modifiers
        Object.entries(stat.effects).forEach((eff) => {
            let key = eff[0];
            let value = eff[1];
            if (key.includes(abilityId) && key.includes("status")) {
                key = key.replace(abilityId + "_", "");
                if (key.includes("status_effect")) {
                    const _key = key.replace("status_effect_", "");
                    const __key = _key.substring(0, _key.length - 1);
                    if (possible_stat_modifiers.find((m) => m == __key.toString())) {
                        if (key.endsWith("V"))
                            total["effects"][__key].value += value;
                        else if (key.endsWith("P") && value < 0)
                            total["effects"][__key].modif *= (1 + value / 100);
                        else if (key.endsWith("P"))
                            total["effects"][__key].modif += (1 + value / 100);
                    }
                    else {
                        if (key.endsWith("V"))
                            total[__key].value += value;
                        else if (key.endsWith("P") && value < 0)
                            total[__key].modif *= (1 + value / 100);
                        else if (key.endsWith("P"))
                            total[__key].modif += (1 + value / 100);
                    }
                }
            }
        });
    });
    (_a = char.statModifiers) === null || _a === void 0 ? void 0 : _a.forEach((stat) => {
        let apply = true;
        if (stat.conditions) {
            apply = statConditions(stat.conditions, char);
        }
        if (apply) {
            // Go through stat modifiers
            Object.entries(stat.effects).forEach((eff) => {
                let key = eff[0];
                let value = eff[1];
                if (key.includes(abilityId) && key.includes("status")) {
                    key = key.replace(abilityId + "_", "");
                    if (key.includes("status_effect")) {
                        const _key = key.replace("status_effect_", "");
                        const __key = _key.substring(0, _key.length - 1);
                        if (possible_stat_modifiers.find((m) => m == __key.toString())) {
                            if (key.endsWith("V"))
                                total["effects"][__key].value += value;
                            else if (key.endsWith("P") && value < 0)
                                total["effects"][__key].modif *= (1 + value / 100);
                            else if (key.endsWith("P"))
                                total["effects"][__key].modif += (1 + value / 100);
                        }
                        else {
                            if (key.endsWith("V"))
                                total[__key].value += value;
                            else if (key.endsWith("P") && value < 0)
                                total[__key].modif *= (1 + value / 100);
                            else if (key.endsWith("P"))
                                total[__key].modif += (1 + value / 100);
                        }
                    }
                }
            });
        }
    });
    (_b = char.perks) === null || _b === void 0 ? void 0 : _b.forEach((prk) => {
        // Go through stat modifiers
        Object.entries(prk.effects).forEach((eff) => {
            let key = eff[0];
            let value = eff[1];
            if (key.includes(abilityId) && key.includes("status")) {
                key = key.replace(abilityId + "_", "");
                if (key.includes("status_effect")) {
                    const _key = key.replace("status_effect_", "");
                    const __key = _key.substring(0, _key.length - 1);
                    if (possible_stat_modifiers.find((m) => m == __key.toString())) {
                        if (key.endsWith("V"))
                            total["effects"][__key].value += value;
                        else if (key.endsWith("P") && value < 0)
                            total["effects"][__key].modif *= (1 + value / 100);
                        else if (key.endsWith("P"))
                            total["effects"][__key].modif += (1 + value / 100);
                    }
                    else {
                        if (key.endsWith("V"))
                            total[__key].value += value;
                        else if (key.endsWith("P") && value < 0)
                            total[__key].modif *= (1 + value / 100);
                        else if (key.endsWith("P"))
                            total[__key].modif += (1 + value / 100);
                    }
                }
            }
        });
        if (prk.statModifiers) {
            prk.statModifiers.forEach((mod) => {
                let apply = true;
                if (mod.conditions) {
                    apply = statConditions(mod.conditions, char);
                }
                if (apply) {
                    Object.entries(mod.effects).forEach((eff) => {
                        let key = eff[0];
                        let value = eff[1];
                        if (key.includes(abilityId) && key.includes("status")) {
                            key = key.replace(abilityId + "_", "");
                            if (key.includes("status_effect")) {
                                const _key = key.replace("status_effect_", "");
                                const __key = _key.substring(0, _key.length - 1);
                                if (possible_stat_modifiers.find((m) => m == __key.toString())) {
                                    if (key.endsWith("V"))
                                        total["effects"][__key].value += value;
                                    else if (key.endsWith("P") && value < 0)
                                        total["effects"][__key].modif *= (1 + value / 100);
                                    else if (key.endsWith("P"))
                                        total["effects"][__key].modif += (1 + value / 100);
                                }
                                else {
                                    if (key.endsWith("V"))
                                        total[__key].value += value;
                                    else if (key.endsWith("P") && value < 0)
                                        total[__key].modif *= (1 + value / 100);
                                    else if (key.endsWith("P"))
                                        total[__key].modif += (1 + value / 100);
                                }
                            }
                        }
                    });
                }
            });
        }
    });
    equipmentSlots.forEach((slot) => {
        var _a;
        if ((_a = char[slot]) === null || _a === void 0 ? void 0 : _a.stats) {
            Object.entries(char[slot].stats).forEach((eff) => {
                let key = eff[0];
                let value = eff[1];
                if (key.includes(abilityId) && key.includes("status")) {
                    key = key.replace(abilityId + "_", "");
                    if (key.includes("status_effect")) {
                        const _key = key.replace("status_effect_", "");
                        const __key = _key.substring(0, _key.length - 1);
                        if (possible_stat_modifiers.find((m) => m == __key.toString())) {
                            if (key.endsWith("V"))
                                total["effects"][__key].value += value;
                            else if (key.endsWith("P") && value < 0)
                                total["effects"][__key].modif *= (1 + value / 100);
                            else if (key.endsWith("P"))
                                total["effects"][__key].modif += (1 + value / 100);
                        }
                        else {
                            if (key.endsWith("V"))
                                total[__key].value += value;
                            else if (key.endsWith("P") && value < 0)
                                total[__key].modif *= (1 + value / 100);
                            else if (key.endsWith("P"))
                                total[__key].modif += (1 + value / 100);
                        }
                    }
                }
            });
        }
    });
    return total;
}
//# sourceMappingURL=ability.js.map