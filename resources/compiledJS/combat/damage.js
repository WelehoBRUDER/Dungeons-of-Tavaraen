"use strict";
function calculateDamage(attacker, target, ability, onlyRawDamage = false) {
    var _a, _b, _c, _d, _e, _f, _g;
    // Initilize some values needed for the calculation
    const attackerStats = attacker.getStats();
    const targetResists = target.getResists();
    const targetArmor = target.getArmor();
    // Roll for crit
    const critRolled = attackerStats.critChance >= helper.random(100, 0);
    // Roll for evasion
    const hitChance = attacker.getHitchance().chance;
    const evasion = target.getHitchance().evasion;
    const evade = evasion + helper.random(evasion * 0.5, evasion * -0.5) + 10 > hitChance + helper.random(hitChance * 0.3, hitChance * -0.6) + 20;
    // Create damage variable
    let damage = 0;
    // If attacker is player, apply attack type buff
    let attackTypeDamageModifier = 0; // This is actually a HUGE modifier as it is applied last!;
    if (attacker.id == "player") {
        if (parseInt((_a = player.weapon) === null || _a === void 0 ? void 0 : _a.range) > 2) {
            if ((_b = player.allModifiers) === null || _b === void 0 ? void 0 : _b.rangedDamageP)
                attackTypeDamageModifier += (_c = player.allModifiers) === null || _c === void 0 ? void 0 : _c.rangedDamageP;
        }
        else if (ability.mana_cost > 0) {
            if ((_d = player.allModifiers) === null || _d === void 0 ? void 0 : _d.spellDamageP)
                attackTypeDamageModifier += (_e = player.allModifiers) === null || _e === void 0 ? void 0 : _e.spellDamageP;
        }
        else {
            if ((_f = player.allModifiers) === null || _f === void 0 ? void 0 : _f.meleeDamageP)
                attackTypeDamageModifier += (_g = player.allModifiers) === null || _g === void 0 ? void 0 : _g.meleeDamageP;
        }
    }
    // Get base damages that will be used for the calculation
    const baseDamages = ability.damages ? ability.get_true_damage(attacker) : getAttackerDamages(attacker);
    // Start calculating damage
    Object.entries(baseDamages).map(([damageType, damageValue]) => {
        var _a;
        // Get base damage modifiers
        let { v: val, m: mod } = getModifiers(attacker, damageType + "Damage");
        val += attacker.allModifiers["damageV"];
        mod *= attacker.allModifiers["damageP"];
        // If player attacks enemy, apply buff/debuff against enemy type
        if (target.isFoe) {
            val += getModifiers(attacker, "damage_against_type_" + target.type).v;
            mod *= getModifiers(attacker, "damage_against_type_" + target.type).m;
            val += getModifiers(attacker, "damage_against_race_" + target.race).v;
            mod *= getModifiers(attacker, "damage_against_race_" + target.race).m;
        }
        // Calculate bonus damage from stats
        let bonus = 0;
        bonus += (damageValue * attackerStats[(_a = (attacker.weapon ? attacker.weapon.statBonus : attacker.firesProjectile ? "dex" : "str")) !== null && _a !== void 0 ? _a : "str"]) / 50;
        // Calculate defense penetration
        let penetration = ability.resistance_penetration / 100;
        // Calculate defenses
        let defense = 1 -
            (targetArmor[damageCategories[damageType]] * 0.25 > 0 ? targetArmor[damageCategories[damageType]] * 0.25 * (1 - penetration) : targetArmor[damageCategories[damageType]]) /
                100;
        let resistance = 1 - (targetResists[damageType] > 0 ? targetResists[damageType] * (1 - penetration) : targetResists[damageType]) / 100;
        // Check for NaN to prevent breaking calculation
        if (isNaN(bonus))
            bonus = 0;
        if (isNaN(val))
            val = 0;
        if (isNaN(defense))
            defense = 1;
        if (isNaN(resistance))
            resistance = 1;
        // Calculate final damage
        let baseValue = damageValue + val + bonus;
        let dmg = Math.floor(baseValue * mod * ability.damage_multiplier * (critRolled && !onlyRawDamage ? 1 + attackerStats.critDamage / 100 : 1) * defense);
        if (attackTypeDamageModifier > 0)
            dmg *= attackTypeDamageModifier;
        dmg = Math.floor(dmg * resistance);
        damage += dmg;
    });
    // Apply final calculations to damage
    if (onlyRawDamage)
        return { dmg: damage, critRolled: false, evade: false };
    damage = Math.floor(damage * helper.random(1.2, 0.8));
    if (evade)
        damage = Math.floor(damage / 2);
    if (damage < 1)
        damage = 1;
    if (isNaN(damage)) {
        damage = 1;
        console.warn("Damage is NaN!");
    }
    // Return damage and events
    return { dmg: damage, evade: evade, critRolled: critRolled };
    function getAttackerDamages(attacker) {
        var _a;
        let _damages = (_a = attacker.weapon) === null || _a === void 0 ? void 0 : _a.damages;
        if (!_damages && attacker.id == "player")
            _damages = attacker.fistDmg();
        else if (!_damages)
            _damages = attacker === null || attacker === void 0 ? void 0 : attacker.trueDamage().split;
        else if (!_damages)
            _damages = attacker.damages;
        return _damages;
    }
}
//# sourceMappingURL=damage.js.map