"use strict";
function calculateDamage(attacker, target, ability, onlyRawDamage = false) {
    // Initialize some values needed for the calculation
    console.log(attacker);
    const attackerStats = attacker.getStats();
    const targetResists = target.getResists();
    const targetArmor = target.getArmorReduction();
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
        if (parseInt(player.weapon?.range) > 2) {
            if (player.allModifiers?.rangedDamageP)
                attackTypeDamageModifier += player.allModifiers?.rangedDamageP;
        }
        else if (ability.mana_cost > 0) {
            if (player.allModifiers?.spellDamageP)
                attackTypeDamageModifier += player.allModifiers?.spellDamageP;
        }
        else {
            if (player.allModifiers?.meleeDamageP)
                attackTypeDamageModifier += player.allModifiers?.meleeDamageP;
        }
    }
    // Get base damages that will be used for the calculation
    const baseDamages = ability.damages ? ability.get_true_damage(attacker) : getAttackerDamages(attacker);
    // Start calculating damage
    Object.entries(baseDamages).map(([damageType, damageValue]) => {
        // Get base damage modifiers
        let val = attacker.allModifiers[damageType + "DamageV"] || 0;
        let mod = attacker.allModifiers[damageType + "DamageP"] || 1;
        val += attacker.allModifiers["damageV"] || 0;
        mod *= attacker.allModifiers["damageP"] || 1;
        // If player attacks enemy, apply buff/debuff against enemy type
        if (target.isFoe) {
            val += attacker.allModifiers["damage_against_type_" + target.type + "V"] || 0;
            mod *= attacker.allModifiers["damage_against_type_" + target.type + "P"] || 1;
            val += attacker.allModifiers["damage_against_race_" + target.race + "V"] || 0;
            mod *= attacker.allModifiers["damage_against_race_" + target.race + "P"] || 1;
        }
        // Calculate bonus damage from stats
        let bonus = 0;
        bonus +=
            (damageValue * attackerStats[(attacker.weapon ? attacker.weapon.statBonus : attacker.firesProjectile ? "dex" : "str") ?? "str"]) / 50;
        // Calculate defense penetration
        let penetration = ability.resistance_penetration / 100;
        // Calculate defenses
        let defense = 1;
        const currentArmor = targetArmor[damageCategories[damageType]];
        const penetrationMultiplier = 1 - penetration;
        if (currentArmor > 0) {
            const armorWithLoss = Math.min(currentArmor + penetration, 1);
            defense = defense * (1 - armorWithLoss);
        }
        else if (currentArmor) {
            defense = defense * (1 - currentArmor);
        }
        let resistance = 1 - (targetResists[damageType] > 0 ? targetResists[damageType] * penetrationMultiplier : targetResists[damageType]) / 100;
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
    // Apply a 80-120% variance to damage
    // This is done to prevent damage from being too consistent
    damage = Math.floor(damage * helper.random(1.2, 0.8));
    // If target evaded, halve damage
    if (evade)
        damage = Math.floor(damage / 2);
    // Damage can't be lower than 1
    if (damage < 1)
        damage = 1;
    // Check for NaN to prevent breaking calculation
    if (isNaN(damage)) {
        damage = 1;
        console.warn("Damage is NaN!");
    }
    // Return damage and events
    return { dmg: damage, evade: evade, critRolled: critRolled };
    function getAttackerDamages(attacker) {
        let _damages = attacker.weapon?.damages;
        if (!_damages && attacker.id == "player")
            _damages = attacker.fistDmg();
        else if (!_damages)
            _damages = attacker?.trueDamage().split;
        else if (!_damages)
            _damages = attacker.damages;
        return _damages;
    }
}
function calculateStatusDamage(target, damageValue, damageType) {
    // Initialize some values needed for the calculation
    const targetResists = target.getResists();
    const targetArmor = target.getArmorReduction();
    // Create damage variable
    let damage = 0;
    // Start calculating damage
    // Calculate defenses
    let defense = 1;
    const currentArmor = targetArmor[damageCategories[damageType]];
    if (currentArmor > 0) {
        const armorWithLoss = Math.min(currentArmor, 1);
        defense = defense * (1 - armorWithLoss);
    }
    else if (currentArmor) {
        defense = defense * (1 - currentArmor);
    }
    let resistance = 1 - targetResists[damageType] / 100;
    // Check for NaN to prevent breaking calculation
    if (isNaN(defense))
        defense = 1;
    if (isNaN(resistance))
        resistance = 1;
    // Calculate final damage
    let dmg = Math.floor(damageValue * defense);
    dmg = Math.floor(dmg * resistance);
    damage += dmg;
    return damage;
}
// This function is used to calculate more accurate damage for tooltips
// The damage presented assumes that the target has 0 armor and 0 resistances
// It can't be used for actual damage in combat!
function approximateDamage(attacker, ability) {
    // Initilize some values needed for the calculation
    const attackerStats = attacker.getStats();
    // Create damage variable
    let damage = 0;
    // If attacker is player, apply attack type buff
    let attackTypeDamageModifier = 0; // This is actually a HUGE modifier as it is applied last!;
    if (attacker.id == "player") {
        if (parseInt(player.weapon?.range) > 2) {
            if (player.allModifiers?.rangedDamageP)
                attackTypeDamageModifier += player.allModifiers?.rangedDamageP;
        }
        else if (ability.mana_cost > 0) {
            if (player.allModifiers?.spellDamageP)
                attackTypeDamageModifier += player.allModifiers?.spellDamageP;
        }
        else {
            if (player.allModifiers?.meleeDamageP)
                attackTypeDamageModifier += player.allModifiers?.meleeDamageP;
        }
    }
    // Get base damages that will be used for the calculation
    const baseDamages = ability.damages ? ability.get_true_damage(attacker) : getAttackerDamages(attacker);
    // Start calculating damage
    Object.entries(baseDamages).map(([damageType, damageValue]) => {
        // Get base damage modifiers
        let val = attacker.allModifiers[damageType + "DamageV"] || 0;
        let mod = attacker.allModifiers[damageType + "DamageP"] || 1;
        val += attacker.allModifiers["damageV"] || 0;
        mod *= attacker.allModifiers["damageP"] || 1;
        // Calculate bonus damage from stats
        let bonus = 0;
        bonus +=
            (damageValue * attackerStats[(attacker.weapon ? attacker.weapon.statBonus : attacker.firesProjectile ? "dex" : "str") ?? "str"]) / 50;
        // Check for NaN to prevent breaking calculation
        if (isNaN(bonus))
            bonus = 0;
        if (isNaN(val))
            val = 0;
        // Calculate final damage
        let baseValue = damageValue + val + bonus;
        let dmg = Math.floor(baseValue * mod * ability.damage_multiplier);
        if (attackTypeDamageModifier > 0)
            dmg *= attackTypeDamageModifier;
        damage += dmg;
    });
    // Apply final calculations to damage
    if (damage < 1)
        damage = 1;
    if (isNaN(damage)) {
        damage = 1;
        console.warn("Damage is NaN!");
    }
    // Return damage and events
    return [Math.floor(damage * 0.8), Math.floor(damage * 1.2)];
    function getAttackerDamages(attacker) {
        let _damages = attacker.weapon?.damages;
        if (!_damages && attacker.id == "player")
            _damages = attacker.fistDmg();
        else if (!_damages)
            _damages = attacker?.trueDamage().split;
        else if (!_damages)
            _damages = attacker.damages;
        return _damages;
    }
}
//# sourceMappingURL=damage.js.map