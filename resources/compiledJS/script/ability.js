"use strict";
const straight_modifiers = [
    "mana_cost",
    "cooldown",
    "resistance_penetration",
    "base_heal",
    "damage_multiplier",
    "use_range",
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
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
        this.shoots_projectile = (_l = baseAbility.shoots_projectile) !== null && _l !== void 0 ? _l : "";
        this.icon = baseAbility.icon;
        this.line = (_m = baseAbility.line) !== null && _m !== void 0 ? _m : "";
        this.use_range = typeof parseInt(baseAbility.use_range) === 'number' ? Math.floor(((parseInt(baseAbility.use_range) + values.use_range.value) * values.use_range.modif)).toString() : baseAbility.use_range;
        this.requires_melee_weapon = (_o = baseAbility.requires_melee_weapon) !== null && _o !== void 0 ? _o : false;
        this.requires_ranged_weapon = (_p = baseAbility.requires_ranged_weapon) !== null && _p !== void 0 ? _p : false;
        this.requires_concentration = (_q = baseAbility.requires_concentration) !== null && _q !== void 0 ? _q : false;
        this.recharge_only_in_combat = (_r = baseAbility.recharge_only_in_combat) !== null && _r !== void 0 ? _r : false;
        this.aoe_size = (_s = (baseAbility.aoe_size + values.aoe_size.value) * values.aoe_size.modif) !== null && _s !== void 0 ? _s : 0;
        this.aoe_effect = (_t = baseAbility.aoe_effect) !== null && _t !== void 0 ? _t : "";
        this.self_target = (_u = baseAbility.self_target) !== null && _u !== void 0 ? _u : false;
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
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
    if ((_c = char.weapon) === null || _c === void 0 ? void 0 : _c.stats) {
        Object.entries(char.weapon.stats).forEach((eff) => {
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
    if ((_d = char.offhand) === null || _d === void 0 ? void 0 : _d.stats) {
        Object.entries(char.offhand.stats).forEach((eff) => {
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
    if ((_e = char.helmet) === null || _e === void 0 ? void 0 : _e.stats) {
        Object.entries(char.helmet.stats).forEach((eff) => {
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
    if ((_f = char.chest) === null || _f === void 0 ? void 0 : _f.stats) {
        Object.entries(char.chest.stats).forEach((eff) => {
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
    if ((_g = char.boots) === null || _g === void 0 ? void 0 : _g.stats) {
        Object.entries(char.boots.stats).forEach((eff) => {
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
    if ((_h = char.legs) === null || _h === void 0 ? void 0 : _h.stats) {
        Object.entries(char.legs.stats).forEach((eff) => {
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
    if ((_j = char.artifact1) === null || _j === void 0 ? void 0 : _j.stats) {
        Object.entries(char.artifact1.stats).forEach((eff) => {
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
    if ((_k = char.artifact2) === null || _k === void 0 ? void 0 : _k.stats) {
        Object.entries(char.artifact2.stats).forEach((eff) => {
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
    if ((_l = char.artifact3) === null || _l === void 0 ? void 0 : _l.stats) {
        Object.entries(char.artifact3.stats).forEach((eff) => {
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
    return total;
}
function getAbiStatusModifiers(char, abilityId, effectId) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
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
    });
    if ((_c = char.weapon) === null || _c === void 0 ? void 0 : _c.stats) {
        Object.entries(char.weapon.stats).forEach((eff) => {
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
    if ((_d = char.offhand) === null || _d === void 0 ? void 0 : _d.stats) {
        Object.entries(char.offhand.stats).forEach((eff) => {
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
    if ((_e = char.helmet) === null || _e === void 0 ? void 0 : _e.stats) {
        Object.entries(char.helmet.stats).forEach((eff) => {
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
    if ((_f = char.chest) === null || _f === void 0 ? void 0 : _f.stats) {
        Object.entries(char.chest.stats).forEach((eff) => {
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
    if ((_g = char.boots) === null || _g === void 0 ? void 0 : _g.stats) {
        Object.entries(char.boots.stats).forEach((eff) => {
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
    if ((_h = char.legs) === null || _h === void 0 ? void 0 : _h.stats) {
        Object.entries(char.legs.stats).forEach((eff) => {
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
    if ((_j = char.artifact1) === null || _j === void 0 ? void 0 : _j.stats) {
        Object.entries(char.artifact1.stats).forEach((eff) => {
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
    if ((_k = char.artifact2) === null || _k === void 0 ? void 0 : _k.stats) {
        Object.entries(char.artifact2.stats).forEach((eff) => {
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
    if ((_l = char.artifact3) === null || _l === void 0 ? void 0 : _l.stats) {
        Object.entries(char.artifact3.stats).forEach((eff) => {
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
    return total;
}
//# sourceMappingURL=ability.js.map