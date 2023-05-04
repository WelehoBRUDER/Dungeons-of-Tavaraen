"use strict";
function calculateDamage(attacker, target, ability, onlyRawDamage = false) {
    // Initilize some values needed for the calculation
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
        bonus +=
            (damageValue * attackerStats[(attacker.weapon ? attacker.weapon.statBonus : attacker.firesProjectile ? "dex" : "str") ?? "str"]) / 50;
        // Calculate defense penetration
        let penetration = ability.resistance_penetration / 100;
        // Calculate defenses
        let defense = 1;
        const currentArmor = targetArmor[damageCategories[damageType]];
        const penetrationMultiplier = 1 - penetration;
        if (currentArmor > 0) {
            const armorWithLoss = Math.min(currentArmor + penetrationMultiplier, 1);
            defense = defense * armorWithLoss;
        }
        else if (currentArmor) {
            defense = defense * currentArmor;
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