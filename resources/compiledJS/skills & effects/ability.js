"use strict";
const straight_modifiers = [
    "mana_cost",
    "health_cost",
    "health_cost_percentage",
    "cooldown",
    "resistance_penetration",
    "base_heal",
    "heal_percentage",
    "life_steal",
    "life_steal_percentage",
    "damage_multiplier",
    "use_range",
    "summon_level",
    "summon_last",
    "total_summon_limit",
    "aoe_size",
];
const less_is_better = {
    mana_cost: true,
    cooldown: true,
    resistance_penetration: false,
    base_heal: false,
    damage_multiplier: false,
    use_range: false,
    health_cost: true,
    health_cost_percentage: true
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
    "resistAllV",
    "resistAllP",
    "physicalDefP",
    "magicalDefP",
    "elementalDefP",
    "hitChanceV",
    "hitChanceP",
    "evasionV",
    "evasionP",
    "critChanceV",
    "critDamageV",
    "critChanceP",
    "critDamageP",
    "damageV",
    "damageP",
    "regenHpP",
    "regenMpP",
];
const possible_modifiers = [
    "last",
    "attack_damage_multiplierV",
    "attack_damage_multiplierP",
    "attack_resistance_penetrationV",
    "attack_resistance_penetrationP",
    "damageAmount",
];
class Ability {
    constructor(base, user) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9;
        this.id = base.id;
        const values = getAbiModifiers(user, base.id);
        // @ts-ignorep
        const baseAbility = abilities[this.id];
        let statusModifiers = {};
        (_a = baseAbility.statusesUser) === null || _a === void 0 ? void 0 : _a.forEach((str) => statusModifiers = { ...statusModifiers, ...getAbiStatusModifiers(user, base.id, str) });
        (_b = baseAbility.statusesEnemy) === null || _b === void 0 ? void 0 : _b.forEach((str) => statusModifiers = { ...statusModifiers, ...getAbiStatusModifiers(user, base.id, str) });
        if (baseAbility.summon_status)
            statusModifiers = { ...statusModifiers, ...getAbiStatusModifiers(user, base.id, baseAbility.summon_status) };
        this.name = baseAbility.name;
        this.mana_cost = (_c = Math.floor((baseAbility.mana_cost + values.mana_cost.value) * values.mana_cost.modif)) !== null && _c !== void 0 ? _c : 0;
        this.health_cost = (_d = Math.floor((baseAbility.health_cost + values.health_cost.value) * values.health_cost.modif)) !== null && _d !== void 0 ? _d : 0;
        this.health_cost_percentage = (_e = Math.floor((baseAbility.health_cost_percentage + values.health_cost_percentage.value) * values.health_cost_percentage.modif)) !== null && _e !== void 0 ? _e : 0;
        this.cooldown = (_f = Math.floor((baseAbility.cooldown + values.cooldown.value) * values.cooldown.modif)) !== null && _f !== void 0 ? _f : 0;
        this.type = (_g = baseAbility.type) !== null && _g !== void 0 ? _g : "none";
        this.onCooldown = (_h = base.onCooldown) !== null && _h !== void 0 ? _h : 0;
        this.equippedSlot = (_j = base.equippedSlot) !== null && _j !== void 0 ? _j : -1;
        this.damages = baseAbility.damages;
        this.damage_multiplier = (_k = (baseAbility.damage_multiplier + values.damage_multiplier.value + (values.damage_multiplier.modif - 1))) !== null && _k !== void 0 ? _k : 1;
        this.resistance_penetration = (_l = Math.floor((baseAbility.resistance_penetration + values.resistance_penetration.value + (values.resistance_penetration.modif - 1)))) !== null && _l !== void 0 ? _l : 0;
        this.base_heal = (_m = Math.floor((baseAbility.base_heal + values.base_heal.value) * values.base_heal.modif)) !== null && _m !== void 0 ? _m : 0;
        this.heal_percentage = (_o = Math.floor((baseAbility.heal_percentage + values.heal_percentage.value) * values.heal_percentage.modif)) !== null && _o !== void 0 ? _o : 0;
        this.life_steal = (_p = Math.floor((baseAbility.life_steal + values.life_steal.value) * values.life_steal.modif)) !== null && _p !== void 0 ? _p : 0;
        this.life_steal_percentage = (_q = Math.floor((baseAbility.life_steal_percentage + values.life_steal_percentage.value) * values.life_steal_percentage.modif)) !== null && _q !== void 0 ? _q : 0;
        this.life_steal_trigger_only_when_killing_enemy = (_r = baseAbility.life_steal_trigger_only_when_killing_enemy) !== null && _r !== void 0 ? _r : false;
        this.stat_bonus = (_s = baseAbility.stat_bonus) !== null && _s !== void 0 ? _s : "";
        this.statusesUser = (_t = baseAbility.statusesUser) !== null && _t !== void 0 ? _t : [];
        this.statusesEnemy = (_u = baseAbility.statusesEnemy) !== null && _u !== void 0 ? _u : [];
        this.status_power = (_v = baseAbility.status_power) !== null && _v !== void 0 ? _v : 0;
        this.shoots_projectile = (_w = baseAbility.shoots_projectile) !== null && _w !== void 0 ? _w : "";
        this.icon = baseAbility.icon;
        this.line = (_x = baseAbility.line) !== null && _x !== void 0 ? _x : "";
        this.use_range = typeof parseInt(baseAbility.use_range) === 'number' ? Math.floor(((parseInt(baseAbility.use_range) + values.use_range.value) * values.use_range.modif)).toString() : baseAbility.use_range;
        this.requires_melee_weapon = (_y = baseAbility.requires_melee_weapon) !== null && _y !== void 0 ? _y : false;
        this.requires_ranged_weapon = (_z = baseAbility.requires_ranged_weapon) !== null && _z !== void 0 ? _z : false;
        this.requires_concentration = (_0 = baseAbility.requires_concentration) !== null && _0 !== void 0 ? _0 : false;
        this.recharge_only_in_combat = (_1 = baseAbility.recharge_only_in_combat) !== null && _1 !== void 0 ? _1 : false;
        this.summon_unit = baseAbility.summon_unit;
        this.summon_level = (_2 = Math.floor((baseAbility.summon_level + values.summon_level.value) * values.summon_level.modif)) !== null && _2 !== void 0 ? _2 : 0;
        ;
        this.summon_last = (_3 = Math.floor((baseAbility.summon_last + values.summon_last.value) * values.summon_last.modif)) !== null && _3 !== void 0 ? _3 : 0;
        ;
        this.summon_status = baseAbility.summon_status;
        this.total_summon_limit = baseAbility.total_summon_limit + values.total_summon_limit.value;
        this.instant_aoe = (_4 = baseAbility.instant_aoe) !== null && _4 !== void 0 ? _4 : false;
        this.aoe_size = (_5 = (baseAbility.aoe_size + values.aoe_size.value) * values.aoe_size.modif) !== null && _5 !== void 0 ? _5 : 0;
        this.aoe_effect = (_6 = baseAbility.aoe_effect) !== null && _6 !== void 0 ? _6 : "";
        this.aoe_ignore_ledge = (_7 = baseAbility.aoe_ignore_ledge) !== null && _7 !== void 0 ? _7 : false;
        this.self_target = (_8 = baseAbility.self_target) !== null && _8 !== void 0 ? _8 : false;
        this.statusModifiers = statusModifiers;
        this.action_desc = baseAbility.action_desc;
        this.action_desc_pl = baseAbility.action_desc_pl;
        this.ai_chance = baseAbility.ai_chance;
        this.remove_status = baseAbility.remove_status;
        this.permanent = (_9 = baseAbility.permanent) !== null && _9 !== void 0 ? _9 : false;
        if (this.cooldown < 0)
            this.cooldown = 0;
        this.get_true_damage = (_user) => {
            var _a, _b;
            let damages = {};
            let takenValues;
            let total = 0;
            if ((_a = _user.weapon) === null || _a === void 0 ? void 0 : _a.damages)
                takenValues = _user.weapon.damages;
            else if (!((_b = _user.weapon) === null || _b === void 0 ? void 0 : _b.damages) && _user.unarmedDamages)
                takenValues = _user.unarmedDamages;
            else
                takenValues = _user.damages;
            Object.entries(takenValues).forEach((dmg) => {
                total += dmg[1];
            });
            Object.entries(this.damages).forEach((dmg) => {
                const str = dmg[0];
                const num = dmg[1] / 100;
                damages[str] = Math.floor(total * num * this.damage_multiplier);
            });
            return damages;
        };
    }
}
function getAbiKey(key) {
    if (key.includes("status"))
        return key;
    let newKey = key.substring(0, key.length - 1);
    straight_modifiers.forEach((modifs) => {
        if (newKey.includes(modifs)) {
            newKey = newKey.replace(modifs, "");
            newKey = newKey.substring(0, newKey.length - 1);
        }
    });
    return newKey;
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
            const comparisonKey = getAbiKey(key);
            if (id == comparisonKey && !key.includes("status")) {
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
    char.statusEffects.forEach((stat) => {
        Object.entries(stat.effects).forEach((eff) => {
            let key = eff[0];
            let value = eff[1];
            const comparisonKey = getAbiKey(key);
            if (id == comparisonKey && !key.includes("status")) {
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
    (_b = char.traits) === null || _b === void 0 ? void 0 : _b.forEach((stat) => {
        if (!stat.effects)
            return;
        let apply = true;
        if (stat.conditions) {
            apply = statConditions(stat.conditions, char);
        }
        if (apply) {
            Object.entries(stat.effects).forEach((eff) => {
                let key = eff[0];
                let value = eff[1];
                const comparisonKey = getAbiKey(key);
                if (id == comparisonKey && !key.includes("status")) {
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
                const comparisonKey = getAbiKey(key);
                if (id == comparisonKey && !key.includes("status")) {
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
                        total["effects"][__key].status = effectId;
                    }
                    else {
                        if (!total[__key])
                            total[__key] = { value: 0, modif: 1 };
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
    (_a = char.traits) === null || _a === void 0 ? void 0 : _a.forEach((stat) => {
        if (!stat.effects)
            return;
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
                        const trueKey = _key.replace(effectId + "_", "");
                        const __key = trueKey.substring(0, trueKey.length - 1);
                        if (possible_stat_modifiers.find((m) => m == __key.toString())) {
                            if (key.endsWith("V"))
                                total["effects"][__key].value += value;
                            else if (key.endsWith("P") && value < 0)
                                total["effects"][__key].modif *= (1 + value / 100);
                            else if (key.endsWith("P"))
                                total["effects"][__key].modif += (1 + value / 100);
                            total["effects"][__key].status = effectId;
                        }
                        else {
                            if (!total[__key])
                                total[__key] = { value: 0, modif: 1 };
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
                    const trueKey = _key.replace(effectId + "_", "");
                    const __key = trueKey.substring(0, trueKey.length - 1);
                    if (possible_stat_modifiers.find((m) => m == __key.toString())) {
                        if (key.endsWith("V"))
                            total["effects"][__key].value += value;
                        else if (key.endsWith("P") && value < 0)
                            total["effects"][__key].modif *= (1 + value / 100);
                        else if (key.endsWith("P"))
                            total["effects"][__key].modif += (1 + value / 100);
                        total["effects"][__key].status = effectId;
                    }
                    else {
                        if (!total[__key])
                            total[__key] = { value: 0, modif: 1 };
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
                            if (!total[__key])
                                total[__key] = { value: 0, modif: 1 };
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
// {
//   const arr = [1, 2, 3];
//   console.log(JSON.stringify(arr, (key: any, value: any) => {
//     console.log(key);
//     return value;
//   }, "\t"));
// }
//# sourceMappingURL=ability.js.map