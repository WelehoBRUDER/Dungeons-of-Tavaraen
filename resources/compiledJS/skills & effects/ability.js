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
    health_cost_percentage: true,
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
        this.id = base.id;
        // @ts-ignorep
        const baseAbility = abilities[this.id];
        this.name = baseAbility.name;
        this.mana_cost = (_a = baseAbility.mana_cost) !== null && _a !== void 0 ? _a : 0;
        this.health_cost = (_b = baseAbility.health_cost) !== null && _b !== void 0 ? _b : 0;
        this.health_cost_percentage = (_c = baseAbility.health_cost_percentage) !== null && _c !== void 0 ? _c : 0;
        this.cooldown = (_d = baseAbility.cooldown) !== null && _d !== void 0 ? _d : 0;
        this.type = (_e = baseAbility.type) !== null && _e !== void 0 ? _e : "none";
        this.onCooldown = (_f = base.onCooldown) !== null && _f !== void 0 ? _f : 0;
        this.equippedSlot = (_g = base.equippedSlot) !== null && _g !== void 0 ? _g : -1;
        this.damages = baseAbility.damages;
        this.damage_multiplier = (_h = baseAbility.damage_multiplier) !== null && _h !== void 0 ? _h : 1;
        this.resistance_penetration = (_j = baseAbility.resistance_penetration) !== null && _j !== void 0 ? _j : 0;
        this.base_heal = (_k = baseAbility.base_heal) !== null && _k !== void 0 ? _k : 0;
        this.heal_percentage = (_l = baseAbility.heal_percentage) !== null && _l !== void 0 ? _l : 0;
        this.life_steal = (_m = baseAbility.life_steal) !== null && _m !== void 0 ? _m : 0;
        this.life_steal_percentage = (_o = baseAbility.life_steal_percentage) !== null && _o !== void 0 ? _o : 0;
        this.life_steal_trigger_only_when_killing_enemy = (_p = baseAbility.life_steal_trigger_only_when_killing_enemy) !== null && _p !== void 0 ? _p : false;
        this.stat_bonus = (_q = baseAbility.stat_bonus) !== null && _q !== void 0 ? _q : "";
        this.statusesUser = (_r = baseAbility.statusesUser) !== null && _r !== void 0 ? _r : [];
        this.statusesEnemy = (_s = baseAbility.statusesEnemy) !== null && _s !== void 0 ? _s : [];
        this.status_power = (_t = baseAbility.status_power) !== null && _t !== void 0 ? _t : 0;
        this.shoots_projectile = (_u = baseAbility.shoots_projectile) !== null && _u !== void 0 ? _u : "";
        this.icon = baseAbility.icon;
        this.line = (_v = baseAbility.line) !== null && _v !== void 0 ? _v : "";
        this.use_range =
            typeof parseInt(baseAbility.use_range) === "number" ? parseInt(baseAbility.use_range).toString() : baseAbility.use_range;
        this.requires_melee_weapon = (_w = baseAbility.requires_melee_weapon) !== null && _w !== void 0 ? _w : false;
        this.requires_ranged_weapon = (_x = baseAbility.requires_ranged_weapon) !== null && _x !== void 0 ? _x : false;
        this.requires_concentration = (_y = baseAbility.requires_concentration) !== null && _y !== void 0 ? _y : false;
        this.recharge_only_in_combat = (_z = baseAbility.recharge_only_in_combat) !== null && _z !== void 0 ? _z : false;
        this.summon_unit = baseAbility.summon_unit;
        this.summon_level = (_0 = baseAbility.summon_level) !== null && _0 !== void 0 ? _0 : 0;
        this.summon_last = (_1 = baseAbility.summon_last) !== null && _1 !== void 0 ? _1 : 0;
        this.summon_status = baseAbility.summon_status;
        this.total_summon_limit = (_2 = baseAbility.total_summon_limit) !== null && _2 !== void 0 ? _2 : 0;
        this.instant_aoe = (_3 = baseAbility.instant_aoe) !== null && _3 !== void 0 ? _3 : false;
        this.aoe_size = (_4 = baseAbility.aoe_size) !== null && _4 !== void 0 ? _4 : 0;
        this.aoe_effect = (_5 = baseAbility.aoe_effect) !== null && _5 !== void 0 ? _5 : "";
        this.aoe_ignore_ledge = (_6 = baseAbility.aoe_ignore_ledge) !== null && _6 !== void 0 ? _6 : false;
        this.self_target = (_7 = baseAbility.self_target) !== null && _7 !== void 0 ? _7 : false;
        this.action_desc = baseAbility.action_desc;
        this.action_desc_pl = baseAbility.action_desc_pl;
        this.ai_chance = baseAbility.ai_chance;
        this.remove_status = baseAbility.remove_status;
        this.permanent = (_8 = baseAbility.permanent) !== null && _8 !== void 0 ? _8 : false;
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
        this.updateStats = (holder) => {
            let id = this.id;
            const baseStats = { ...abilities[id] };
            id = "ability_" + id;
            if (!holder)
                return;
            Object.entries(this).forEach(([key, value]) => {
                var _a, _b, _c;
                if (typeof value !== "number" || typeof value === "object")
                    return;
                if (typeof value === "number") {
                    if (key === "onCooldown")
                        return;
                    const bonus = (_b = (_a = holder.allModifiers[id]) === null || _a === void 0 ? void 0 : _a[key + "V"]) !== null && _b !== void 0 ? _b : 0;
                    const modifier = 1 + (((_c = holder.allModifiers[id]) === null || _c === void 0 ? void 0 : _c[key + "P"]) / 100 || 0);
                    const base = baseStats[key] !== undefined ? baseStats[key] : value;
                    this[key] = +(((base || 0) + bonus) * modifier).toFixed(2);
                }
                else if (typeof value === "object" && !Array.isArray(value)) {
                    this[key] = { ...updateObject(key, value, holder.allModifiers[id]) };
                }
            });
        };
        this.updateStats(user);
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
// {
//   const arr = [1, 2, 3];
//   console.log(JSON.stringify(arr, (key: any, value: any) => {
//     console.log(key);
//     return value;
//   }, "\t"));
// }
//# sourceMappingURL=ability.js.map