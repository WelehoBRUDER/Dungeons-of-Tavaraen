function enemyIndex(cords: tileObject) {
  for (let i = 0; i < maps[currentMap].enemies.length; i++) {
    if (maps[currentMap].enemies[i].cords == cords) return i;
  }
}

function summonIndex(cords: tileObject) {
  for (let i = 0; i < combatSummons.length; i++) {
    if (combatSummons[i].cords == cords) return i;
  }
}
function useAbi(abi: ability) {
  if (dragging) {
    dragging = false;
    updateUI();
    return;
  }
  state.abiSelected = abi;
  state.isSelected = true;
  if (abi.self_target) {
    // @ts-ignore
    buffOrHeal(player, state.abiSelected);
  }
  else if (abi.instant_aoe) {
    aoeCollision(createAOEMap(player.cords, abi.aoe_size, abi.aoe_ignore_ledge), player, abi);
  }
  updateUI();
}

function buffOrHeal(character: characterObject, ability: ability) {
  state.isSelected = false;

  if (ability.base_heal) {
    const { v: val, m: mod } = getModifiers(character, "healPower");
    let healFromHP = 0;
    if (ability.heal_percentage) healFromHP = character.getHpMax() * ability.heal_percentage / 100;
    const heal: number = Math.floor((ability.base_heal + val + healFromHP) * mod);
    character.stats.hp += heal;
    spawnFloatingText(character.cords, heal.toString(), "lime", 36);
    if (character.isFoe) displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${character.name} <c>white<c>${lang[ability.id + "_action_desc"]} ${lang["recovery_foe"]} ${heal} ${lang["health_points"]}.`);
    else displayText(`<c>cyan<c>[ACTION] <c>yellow<c>${lang["you"]} <c>white<c>${lang[ability.id + "_action_desc_pl"]} ${lang["recovery_pl"]} ${heal} ${lang["health_points"]}.`);
  }
  else if (ability.heal_percentage) {
    const { v: val, m: mod } = getModifiers(character, "healPower");
    let healFromHP = character.getHpMax() * ability.heal_percentage / 100;
    const heal: number = Math.floor((healFromHP + val) * mod);
    character.stats.hp += heal;
    spawnFloatingText(character.cords, heal.toString(), "lime", 36);
    if (character.isFoe) displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${character.name} <c>white<c>${lang[ability.id + "_action_desc"]} ${lang["recovery_foe"]} ${heal} ${lang["health_points"]}.`);
    else displayText(`<c>cyan<c>[ACTION] <c>yellow<c>${lang["you"]} <c>white<c>${lang[ability.id + "_action_desc_pl"]} ${lang["recovery_pl"]} ${heal} ${lang["health_points"]}.`);
  }
  if (ability.statusesUser?.length > 0) {
    ability.statusesUser.forEach((status: string) => {
      const _Effect = new statEffect({ ...statusEffects[status] }, ability.statusModifiers);
      if (character.id === "player") _Effect.last.current -= 1;
      character.addEffect(_Effect);
      spawnFloatingText(character.cords, ability.line, "crimson", 36);
      let string: string = "";
      if (character.id == "player") string = lang[ability.id + "_action_desc_pl"];
      else string = lang[ability.id + "_action_desc"];
      if (character.isFoe) displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${lang[character.id + "_name"]} <c>white<c>${string}`);
      else displayText(`<c>cyan<c>[ACTION] <c>white<c>${string}`);
    });
  }
  if (ability.remove_status) {
    ability.remove_status.forEach(status => {
      character.statusEffects.forEach((effect: statusEffect, index: number) => {
        if (effect.id == status) {
          character.statusEffects.splice(index, 1);
        }
      });
    });
    let string: string = "";
    if (character.id == "player") string = lang["cure_pl"];
    else string = lang["cure"];
    string.replace("[ACTOR]", `<c>yellow<c>${lang[character.id + "_name"]}<c>white<c>`);
    displayText(`<c>cyan<c>[ACTION] <c>white<c>${string}`);
  }
  character.stats.mp -= ability.mana_cost;
  ability.onCooldown = ability.cooldown + 1;
  if (character.id == "player") advanceTurn();
  else {
    updateEnemiesTurn();
  }
}

/* This function needs to be updated at some point */
function regularAttack(attacker: characterObject, target: characterObject, ability: ability, targetCords?: any, isAoe: boolean = false) {
  if (targetCords) {
    maps[currentMap].enemies.forEach((en: any) => { if (targetCords.x == en.cords.x && targetCords.y == en.cords.y) target = en; });
  }
  const attackerStats = attacker.getStats();
  const targetResists = target.getResists();
  const targetArmor = target.getArmor();
  const critRolled = attackerStats.critChance >= helper.random(100, 0);
  const hitChance = attacker.getHitchance().chance;
  const evasion = target.getHitchance().evasion;
  const evade: boolean = (evasion + helper.random(evasion * 0.5, evasion * -0.5) + 10) > (hitChance + helper.random(hitChance * 0.3, hitChance * -0.6) + 20);
  let attackTypeDamageModifier = 0; // This is actually a HUGE modifier as it is applied last!;

  if (ability?.health_cost || ability?.health_cost_percentage) {
    if (ability.health_cost) attacker.stats.hp -= ability.health_cost;
    if (ability.health_cost_percentage) attacker.stats.hp -= attacker.getHpMax() * ability.health_cost_percentage / 100;
  }
  if (attacker.id == "player") {
    if (parseInt(player.weapon?.range) > 2) {
      if (player.allModifiers?.rangedDamageP) attackTypeDamageModifier += player.allModifiers?.rangedDamageP;
    }
    else if (ability.mana_cost > 0) {
      if (player.allModifiers?.spellDamageP) attackTypeDamageModifier += player.allModifiers?.spellDamageP;
    }
    else {
      if (player.allModifiers?.meleeDamageP) attackTypeDamageModifier += player.allModifiers?.meleeDamageP;
    }
  }


  if (ability.statusesEnemy?.length > 0) {
    ability.statusesEnemy.forEach((status: string) => {
      const _Effect = new statEffect({ ...statusEffects[status] }, ability.statusModifiers);
      const resist = target.getStatusResists()[_Effect.type];
      const resisted = resist + helper.random(9, -9) > ability.status_power + helper.random(18, -18);
      if (!resisted) {
        target.addEffect(_Effect);
      }
      else {
        spawnFloatingText(target.cords, "RESISTED!", "grey", 36);
      }
    });
  }
  if (ability.statusesUser?.length > 0) {
    ability.statusesUser.forEach((status: string) => {
      const _Effect = new statEffect({ ...statusEffects[status] }, ability.statusModifiers);
      if (attacker.id === "player") _Effect.last.current -= 1;
      if (!attacker.statusEffects.find((eff: statEffect) => eff.id == status)) {
        attacker.addEffect(_Effect);
        spawnFloatingText(attacker.cords, ability.line, "crimson", 36);
        if (!isAoe) {
          let string: string = "";
          if (attacker.id == "player") string = lang[ability.id + "_action_desc_pl"];
          else string = lang[ability.id + "_action_desc"];
          if (attacker.isFoe) displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${lang[attacker.id + "_name"]} <c>white<c>${string}`);
          else displayText(`<c>cyan<c>[ACTION] <c>white<c>${string}`);
        }
      };
    });
  }

  if (target.isFoe) {
    let dmg: number = 0;
    if (!ability.damages) {
      let _damages = attacker.weapon?.damages;
      if (!_damages && attacker.id == "player") _damages = attacker.fistDmg();
      else if (!_damages) _damages = attacker.damages;
      Object.entries(_damages).forEach((value: any) => {
        const key: string = value[0];
        const num: number = value[1];
        let _dmg: number = num; // temp damage
        let { v: val, m: mod } = getModifiers(attacker, key + "Damage");
        val += attacker.allModifiers["damageV"];
        mod *= attacker.allModifiers["damageP"];
        val += getModifiers(attacker, "damage_against_type_" + target.type).v;
        mod *= getModifiers(attacker, "damage_against_type_" + target.type).m;
        val += getModifiers(attacker, "damage_against_race_" + target.race).v;
        mod *= getModifiers(attacker, "damage_against_race_" + target.race).m;
        let bonus: number = 0;
        if (ability.damages?.[key]) bonus = ability.damages[key];
        bonus += num * attackerStats[attacker.weapon?.statBonus ?? attacker.firesProjectile ? "dex" : "str"] / 50;
        let penetration = ability.resistance_penetration / 100;
        let defense = 1 - (targetArmor[damageCategories[key]] * 0.4 > 0 ? targetArmor[damageCategories[key]] * 0.4 * (1 - penetration) : targetArmor[damageCategories[key]]) / 100;
        let resistance = 1 - ((targetResists[key] > 0 ? targetResists[key] * (1 - penetration) : targetResists[key]) / 100);
        if (isNaN(val)) val = 0;
        _dmg = Math.floor((((num + val + bonus) * (mod)) * ability.damage_multiplier * (critRolled ? 1 + (attackerStats.critDamage / 100) : 1)) * defense);
        if (attackTypeDamageModifier > 0) _dmg *= attackTypeDamageModifier;
        _dmg = Math.floor(_dmg * resistance);
        dmg += _dmg;
      });
    } else {
      Object.entries(ability.get_true_damage(attacker)).forEach((value: any) => {
        const key: string = value[0];
        const num: number = value[1];
        let _dmg: number = num; // temp damage
        let { v: val, m: mod } = getModifiers(attacker, key + "Damage");
        val += attacker.allModifiers["damageV"];
        mod *= attacker.allModifiers["damageP"];
        val += getModifiers(attacker, "damage_against_type_" + target.type).v;
        mod *= getModifiers(attacker, "damage_against_type_" + target.type).m;
        val += getModifiers(attacker, "damage_against_race_" + target.race).v;
        mod *= getModifiers(attacker, "damage_against_race_" + target.race).m;
        let bonus: number = 0;
        bonus += num * attackerStats[ability.stat_bonus] / 50;
        let penetration = ability.resistance_penetration / 100;
        let defense = 1 - (targetArmor[damageCategories[key]] * 0.4 > 0 ? targetArmor[damageCategories[key]] * 0.4 * (1 - penetration) : targetArmor[damageCategories[key]]) / 100;
        let resistance = 1 - ((targetResists[key] > 0 ? targetResists[key] * (1 - penetration) : targetResists[key]) / 100);
        _dmg += Math.floor((((num + val + bonus) * (mod)) * ability.damage_multiplier * (critRolled ? 1 + (attackerStats.critDamage / 100) : 1)) * defense);
        if (attackTypeDamageModifier > 0) _dmg *= attackTypeDamageModifier;
        _dmg = Math.floor(_dmg * resistance);
        dmg += _dmg;
      });
    }
    setTimeout((paskaFixi: null) => {
      if (!enemyIndex(target.cords)) return;
      const layer = document.querySelector<HTMLCanvasElement>(`.enemy${enemyIndex(target.cords)}`);
      try {
        layer.style.animation = 'none';
        layer.offsetHeight; /* trigger reflow */
        layer.style.animation = null;
        layer.style.animationName = `charHurt`;
        layer.width = layer.width;
        // @ts-ignore
        renderSingleEnemy(target, layer);
      }
      catch { }
    }, 110);
    if (!target.aggro()) {
      target.tempAggro = 12;
      target.tempAggroLast = 6;
    }
    dmg = Math.floor(dmg * helper.random(1.2, 0.8));
    if (evade) dmg = Math.floor(dmg / 2);
    if (dmg < 1) dmg = 1;
    target.stats.hp -= dmg;
    if (critRolled) spawnFloatingText(target.cords, dmg.toString() + "!", "red", 48);
    else spawnFloatingText(target.cords, dmg.toString(), "red", 36);
    if (evade) spawnFloatingText(target.cords, "EVADE!", "white", 36);
    if (isAoe) {
      let actionText: string = lang[ability.id + "_action_desc_aoe_pl"] ?? ability.action_desc_pl;
      actionText = actionText.replace("[TARGET]", `'<c>yellow<c>${lang[target.id + "_name"]}<c>white<c>'`);
      actionText = actionText.replace("[DMG]", `${dmg}`);
      displayText(`<c>cyan<c>[ACTION] <c>white<c>${actionText}`);
    }
    else {
      let ally = true;
      let desc = "_action_desc";
      if (attacker.id == "player") {
        desc += "_pl";
        ally = false;
      }
      let actionText: string = lang[ability.id + desc] ?? ability.action_desc_pl;
      actionText = actionText.replace("[TARGET]", `'<c>yellow<c>${lang[target.id + "_name"]}<c>white<c>'`);
      actionText = actionText.replace("[DMG]", `${dmg}`);
      displayText(`${ally ? "<c>lime<c>[ALLY]" + "<c>yellow<c> " + lang[attacker.id + "_name"] : "<c>cyan<c>[ACTION]"} <c>white<c>${actionText}`);
      if (ability.cooldown) ability.onCooldown = ability.cooldown + 1;
      if (ability.mana_cost) attacker.stats.mp -= ability.mana_cost;
    }

    if (ability.life_steal_percentage && !ability.life_steal_trigger_only_when_killing_enemy) {
      let lifeSteal = Math.floor(target.getHpMax() * ability.life_steal_percentage / 100);
      attacker.stats.hp += lifeSteal;
      spawnFloatingText(attacker.cords, lifeSteal.toString(), "lime", 36);
    }

    if (target.stats.hp <= 0) {
      target.kill();
      spawnFloatingText(target.cords, lang["gained_xp"].replace("[XP]", Math.floor(target.xp * player.allModifiers.expGainP)), "lime", 32, 1800, 100);
      if (ability.life_steal_percentage && ability.life_steal_trigger_only_when_killing_enemy) {
        let lifeSteal = Math.floor(target.getHpMax() * ability.life_steal_percentage / 100);
        attacker.stats.hp += lifeSteal;
        spawnFloatingText(attacker.cords, lifeSteal.toString(), "lime", 36);
      }
      setTimeout(modifyCanvas, 100);
    }
  } else {
    let dmg: number = 0;
    if (ability.damages) {
      Object.entries(ability.get_true_damage(attacker)).forEach((value: any) => {
        const key: string = value[0];
        const num: number = value[1];
        let _dmg: number = num; // temp damage
        let { v: val, m: mod } = getModifiers(attacker, key + "Damage");
        val += attacker.allModifiers["damageV"];
        mod *= attacker.allModifiers["damageP"];
        let bonus: number = 0;
        bonus += num * attackerStats[ability.stat_bonus] / 50;
        let penetration = ability.resistance_penetration / 100;
        let defense = 1 - (targetArmor[damageCategories[key]] * 0.4 > 0 ? targetArmor[damageCategories[key]] * 0.4 * (1 - penetration) : targetArmor[damageCategories[key]]) / 100;
        let resistance = 1 - ((targetResists[key] > 0 ? targetResists[key] * (1 - penetration) : targetResists[key]) / 100);
        _dmg += Math.floor((((num + val + bonus) * (mod)) * ability.damage_multiplier * (critRolled ? 1 + (attackerStats.critDamage / 100) : 1)) * defense);
        _dmg = Math.floor(_dmg * resistance);
        dmg += _dmg;
      });
    }
    else {
      Object.entries(attacker.damages).forEach((value: any) => {
        const key: string = value[0];
        const num: number = value[1];
        let _dmg: number = num; // temp damage
        let { v: val, m: mod } = getModifiers(attacker, key + "Damage");
        val += attacker.allModifiers["damageV"];
        mod *= attacker.allModifiers["damageP"];
        let bonus: number = 0;
        if (ability.damages?.[key]) bonus = ability.damages[key];
        if (attacker.shootsProjectile) bonus += num * attackerStats.dex / 50;
        else bonus += num * attackerStats.str / 50;
        let penetration = ability.resistance_penetration / 100;
        let defense = 1 - (targetArmor[damageCategories[key]] * 0.4 > 0 ? targetArmor[damageCategories[key]] * 0.4 * (1 - penetration) : targetArmor[damageCategories[key]]) / 100;
        let resistance = 1 - ((targetResists[key] > 0 ? targetResists[key] * (1 - penetration) : targetResists[key]) / 100);
        _dmg += Math.floor((((num + val + bonus) * (mod)) * ability.damage_multiplier * (critRolled ? 1 + (attackerStats.critDamage / 100) : 1)) * defense);
        _dmg = Math.floor(_dmg * resistance);
        dmg += _dmg;
      });
    }
    const layer = <HTMLCanvasElement>document.querySelector(".playerSheet");
    if (target.id == "player") {
      setTimeout((paskaFixi: null) => {
        layer.style.animation = 'none';
        layer.offsetHeight; /* trigger reflow */
        layer.style.animation = null;
        layer.style.animationName = `screenHurt`;
      }, 110);
    }
    dmg = Math.floor(dmg * helper.random(1.2, 0.8));
    if (evade) dmg = Math.floor(dmg / 2);
    if (dmg < 1) dmg = 1;
    target.stats.hp -= dmg;
    if (critRolled) spawnFloatingText(target.cords, dmg.toString() + "!", "red", 48);
    else spawnFloatingText(target.cords, dmg.toString(), "red", 36);
    if (evade) spawnFloatingText(target.cords, "EVADE!", "white", 36);
    let actionText = lang[ability.id + "_action_desc"] ?? "[TEXT NOT FOUND]";
    let targetName = lang[target.id + "_name"];
    if (!targetName) targetName = player.name;
    actionText = actionText.replace("[TARGET]", `'<c>yellow<c>${targetName}<c>white<c>'`);
    actionText = actionText.replace("[DMG]", `${dmg}`);
    displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${lang[attacker.id + "_name"]} <c>white<c>${actionText}`);
    if (ability.cooldown) ability.onCooldown = ability.cooldown + 1;
    if (ability.mana_cost) attacker.stats.mp -= ability.mana_cost;
    if (target.stats.hp <= 0) {
      target.kill();
      setTimeout(modifyCanvas, 300);
    }
    updateUI();
  }
  state.isSelected = false;
}

function tileCordsToScreen(cords: tileObject) {
  // This function returns screen pixel values from cords.
  const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
  const screenX = (cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
  const screenY = (cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
  return { screenX, screenY };
}

function collision(target: tileObject, ability: ability, isPlayer: boolean, attacker: characterObject, theme?: string) {
  if (!attacker.isFoe || isPlayer) {
    let targetEnemy = maps[currentMap].enemies.find((en: any) => en.cords.x == target.x && en.cords.y == target.y);
    if (!targetEnemy) targetEnemy = maps[currentMap].enemies.find((en: any) => en.oldCords.x == target.x && en.oldCords.y == target.y);
    if (ability.aoe_size > 0) {
      aoeCollision(createAOEMap(targetEnemy?.cords, ability.aoe_size, ability.aoe_ignore_ledge), attacker, ability);
    }
    else {
      regularAttack(attacker, targetEnemy, ability);
    }
  }
  else if (player.cords.x == target.x && player.cords.y == target.y && attacker.isFoe) {
    regularAttack(attacker, player, ability);
  }
  else if (attacker.isFoe) {
    let summonTarget = combatSummons.find(summon => summon.cords.x == target.x && summon.cords.y == target.y);
    regularAttack(attacker, summonTarget, ability);
  }
}

function threatDistance(targets: Array<any>, from: characterObject) {
  let chosenTarget: any = null;
  let highestThreat = -50;
  targets.forEach(target => {
    let dist = +generatePath(from.cords, target.cords, from.canFly, true);
    let threat = (target.getThreat() + helper.random(18, -18)) / dist;
    if (threat > highestThreat && dist <= (from.aggroRange + from.tempAggro ?? 28)) {
      highestThreat = threat;
      chosenTarget = target;
    }
  });
  return chosenTarget;
}

function summonUnit(ability: ability, cords: tileObject) {
  state.isSelected = false;
  state.abiSelected = {};
  if (ability.cooldown) ability.onCooldown = ability.cooldown + 1;
  if (ability.mana_cost) player.stats.mp -= ability.mana_cost;
  let firstFound: Summon = null;
  let totalSummonsOfSameType: number = 0;
  combatSummons.forEach((summon: Summon, index) => {
    if (summon.id == ability.summon_unit) {
      if (!firstFound) firstFound = summon;
      totalSummonsOfSameType++;
    }
  });
  if (totalSummonsOfSameType >= ability.total_summon_limit) {
    for (let summon of combatSummons) {
      if (summon.id == firstFound.id) {
        summon.kill();
        break;
      }
    }
  }
  const playerBuffs: any = {};
  player.perks.forEach((prk: any) => {
    Object.entries(prk.effects).forEach((eff: any) => {
      if (eff[0].startsWith("all_summons")) {
        let key = eff[0].replace("all_summons_", "");
        let value = eff[1];
        playerBuffs[key] = value;
      }
    });
  });
  let newSummon = new Summon({ ...{ ...summons[ability.summon_unit], level: ability.summon_level, permanent: ability.permanent, lastsFor: ability.summon_last, cords: { ...cords } } });
  newSummon.updateTraits();
  newSummon.restore(true);
  newSummon.traits.push({ id: "buffs_from_player", effects: { ...playerBuffs } });
  if (ability.summon_status) newSummon.statusEffects.push(new statEffect({ ...statusEffects[ability.summon_status] }, ability.statusModifiers));
  combatSummons.push({ ...newSummon });
  if (ability.statusesUser?.length > 0) {
    ability.statusesUser.forEach((status: string) => {
      player.statusEffects.push(new statEffect({ ...statusEffects[status], last: ability.summon_last - 1 }, ability.statusModifiers));
    });
  }
  let encounter = player.entitiesEverEncountered?.summons?.[newSummon.id];
  if (encounter < 1 || !encounter) {
    player.entitiesEverEncountered.enemies[newSummon.id] = 1;
    displayText("New creature encountered!");
    displayText(newSummon.id + " added to codex.");
    spawnFloatingText(newSummon.cords, "NEW CREATURE ENCOUNTER", "yellow", 22, 2000, 0);
  }
  modifyCanvas();
}

function calcAngleDegrees(x: number, y: number) {
  return Math.atan2(y, x) * 180 / Math.PI;
}