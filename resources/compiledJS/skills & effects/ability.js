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
    "physicalArmorP",
    "magicalArmorP",
    "elementalArmorP",
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
    id;
    name;
    mana_cost;
    health_cost;
    health_cost_percentage;
    cooldown;
    type;
    onCooldown;
    equippedSlot;
    damages;
    resistance_penetration;
    base_heal;
    heal_percentage;
    life_steal;
    life_steal_percentage;
    life_steal_trigger_only_when_killing_enemy;
    mana_steal;
    mana_steal_percentage;
    damage_multiplier;
    shoots_projectile;
    stat_bonus;
    statusesUser;
    statusesEnemy;
    status_power;
    line;
    icon;
    use_range;
    requires_melee_weapon;
    requires_ranged_weapon;
    requires_concentration;
    recharge_only_in_combat;
    summon_unit;
    summon_level;
    summon_last;
    summon_status;
    total_summon_limit;
    permanent;
    instant_aoe;
    aoe_size;
    aoe_effect;
    aoe_ignore_ledge;
    self_target;
    statusModifiers;
    action_desc;
    action_desc_pl;
    ai_chance;
    remove_status;
    get_true_damage;
    updateStats;
    constructor(base, user) {
        this.id = base.id;
        // @ts-ignorep
        const baseAbility = abilities[this.id];
        this.name = baseAbility.name;
        this.mana_cost = baseAbility.mana_cost ?? 0;
        this.health_cost = baseAbility.health_cost ?? 0;
        this.health_cost_percentage = baseAbility.health_cost_percentage ?? 0;
        this.cooldown = baseAbility.cooldown ?? 0;
        this.type = baseAbility.type ?? "none";
        this.onCooldown = base.onCooldown ?? 0;
        this.equippedSlot = base.equippedSlot ?? -1;
        this.damages = baseAbility.damages;
        this.damage_multiplier = baseAbility.damage_multiplier ?? 1;
        this.resistance_penetration = baseAbility.resistance_penetration ?? 0;
        this.base_heal = baseAbility.base_heal ?? 0;
        this.heal_percentage = baseAbility.heal_percentage ?? 0;
        this.life_steal = baseAbility.life_steal ?? 0;
        this.life_steal_percentage = baseAbility.life_steal_percentage ?? 0;
        this.life_steal_trigger_only_when_killing_enemy = baseAbility.life_steal_trigger_only_when_killing_enemy ?? false;
        this.stat_bonus = baseAbility.stat_bonus ?? "";
        this.statusesUser = baseAbility.statusesUser ?? [];
        this.statusesEnemy = baseAbility.statusesEnemy ?? [];
        this.status_power = baseAbility.status_power ?? 0;
        this.shoots_projectile = baseAbility.shoots_projectile ?? "";
        this.icon = baseAbility.icon;
        this.line = baseAbility.line ?? "";
        this.use_range =
            typeof parseInt(baseAbility.use_range) === "number" ? parseInt(baseAbility.use_range).toString() : baseAbility.use_range;
        this.requires_melee_weapon = baseAbility.requires_melee_weapon ?? false;
        this.requires_ranged_weapon = baseAbility.requires_ranged_weapon ?? false;
        this.requires_concentration = baseAbility.requires_concentration ?? false;
        this.recharge_only_in_combat = baseAbility.recharge_only_in_combat ?? false;
        this.summon_unit = baseAbility.summon_unit;
        this.summon_level = baseAbility.summon_level ?? 0;
        this.summon_last = baseAbility.summon_last ?? 0;
        this.summon_status = baseAbility.summon_status;
        this.total_summon_limit = baseAbility.total_summon_limit ?? 0;
        this.instant_aoe = baseAbility.instant_aoe ?? false;
        this.aoe_size = baseAbility.aoe_size ?? 0;
        this.aoe_effect = baseAbility.aoe_effect ?? "";
        this.aoe_ignore_ledge = baseAbility.aoe_ignore_ledge ?? false;
        this.self_target = baseAbility.self_target ?? false;
        this.action_desc = baseAbility.action_desc;
        this.action_desc_pl = baseAbility.action_desc_pl;
        this.ai_chance = baseAbility.ai_chance;
        this.remove_status = baseAbility.remove_status;
        this.permanent = baseAbility.permanent ?? false;
        if (this.cooldown < 0)
            this.cooldown = 0;
        this.get_true_damage = (_user) => {
            let damages = {};
            let takenValues;
            let total = 0;
            if (_user.weapon?.damages)
                takenValues = _user.weapon.damages;
            else if (!_user.weapon?.damages && _user.unarmedDamages)
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
                if (typeof value !== "number" || typeof value === "object")
                    return;
                if (typeof value === "number") {
                    if (key === "onCooldown")
                        return;
                    const bonus = holder.allModifiers[id]?.[key + "V"] ?? 0;
                    const modifier = 1 + (holder.allModifiers[id]?.[key + "P"] / 100 || 0);
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