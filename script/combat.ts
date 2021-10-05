function weaponReach(attacker: characterObject, reach: number = 1, target: characterObject) {
  const rotation = calcAngleDegrees(target.cords.x - attacker.cords.x, target.cords.y - attacker.cords.y);
  // @ts-expect-error
  const distance = generateArrowPath(attacker.cords, target.cords).length - 1;
  if(distance > reach) return false;
  if(rotation < -90) return "NorthWest";
  else if(rotation >= -90 && rotation < -45) return "North";
  else if(rotation >= -45 && rotation < 0) return "NorthEast";
  else if(rotation >= 0 && rotation < 45) return "East";
  else if(rotation >= 45 && rotation < 90) return "SouthEast";
  else if(rotation >= 90 && rotation < 135) return "South"; 
  else if(rotation >= 135 && rotation < 180) return "SouthWest"; 
  else if(rotation >= 180) return "West";
  return false;
}

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

function updateEnemiesTurn() {
  enemiesHadTurn++;
  if (enemiesHadTurn == maps[currentMap].enemies.length) turnOver = true;
}

function attackTarget(attacker: characterObject, target: characterObject, attackDir: string) {
  // @ts-ignore
  if (target.isFoe) {
    let layer = <HTMLCanvasElement>null;
    if (attacker.id == "player") layer = <HTMLCanvasElement>document.querySelector(".playerSheet");
    else layer = <HTMLCanvasElement>document.querySelector(".summonLayers").querySelector(`.summon${summonIndex(attacker.cords)}`);
    layer.style.animation = 'none';
    // @ts-ignore
    layer.offsetHeight; /* trigger reflow */
    // @ts-ignore
    layer.style.animation = null;
    layer.style.animationName = `attack${attackDir}`;
  }
  else if (attacker.isFoe) {
    try {
      // @ts-ignore
      const layer = <HTMLCanvasElement>document.querySelector(".enemyLayers").querySelector(`.enemy${enemyIndex(attacker.cords)}`);
      layer.style.animation = 'none';
      // @ts-ignore
      layer.offsetHeight; /* trigger reflow */
      // @ts-ignore
      layer.style.animation = null;
      layer.style.animationName = `attack${attackDir}`;
    }
    catch { console.warn("Enemy layer not found"); };
  }
}

function useAbi(abi: ability) {
  state.abiSelected = abi;
  state.isSelected = true;
  if (abi.self_target) {
    // @ts-ignore
    buffOrHeal(player, state.abiSelected);
  }
  updateUI();
}

function buffOrHeal(character: characterObject, ability: ability) {
  state.isSelected = false;

  if (ability.base_heal) {
    const { v: val, m: mod } = getModifiers(character, "healPower");
    const heal: number = Math.floor((ability.base_heal + val) * mod);
    character.stats.hp += heal;
    spawnFloatingText(character.cords, heal.toString(), "lime", 36);
    if (character.isFoe) displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${character.name} <c>white<c>${lang[ability.id + "_action_desc"]} ${lang["recovery_foe"]} ${heal} ${lang["health_points"]}.`);
    else displayText(`<c>cyan<c>[ACTION] <c>yellow<c>${lang["you"]} <c>white<c>${lang[ability.id + "_action_desc_pl"]} ${lang["recovery_pl"]} ${heal} ${lang["health_points"]}.`);
  }
  if (ability.status) {
    if (!character.statusEffects.find((eff: statEffect) => eff.id == ability.status)) {
      // @ts-ignore
      character.statusEffects.push(new statEffect({ ...statusEffects[ability.status] }, ability.statusModifiers));
      if (character.id == player.id) character.statusEffects.find((eff: statEffect) => eff.id == ability.status).last.current -= 1;
    } else {
      character.statusEffects.find((eff: statEffect) => eff.id == ability.status).last.current += statusEffects[ability.status].last.total;
    }
    // @ts-ignore
    statusEffects[ability.status].last.current = statusEffects[ability.status].last.total;
    spawnFloatingText(character.cords, ability.line, "crimson", 36);
    let string: string = "";
    if (character.id == "player") string = lang[ability.id + "_action_desc_pl"];
    else string = lang[ability.id + "_action_desc"];
    if (character.isFoe) displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${lang[character.id + "_name"]} <c>white<c>${string}`);
    else displayText(`<c>cyan<c>[ACTION] <c>white<c>${string}`);
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
  ability.onCooldown = ability.cooldown;
  if (character.id == "player") advanceTurn();
  else updateEnemiesTurn();
}

function regularAttack(attacker: characterObject, target: characterObject, ability: ability, targetCords?: any, isAoe: boolean = false) {
  if (targetCords) {
    maps[currentMap].enemies.forEach((en: any) => { if (targetCords.x == en.cords.x && targetCords.y == en.cords.y) target = en; });
  }
  const attackerStats = attacker.getStats();
  const targetResists = target.getResists();
  const critRolled = attackerStats.critChance >= random(100, 0);
  const hitChance = attacker.getHitchance().chance;
  const evasion = target.getHitchance().evasion;
  const evade: boolean = (evasion + random(evasion * 0.5, evasion * -0.5) + 10) > (hitChance + random(hitChance * 0.3, hitChance * -0.6) + 20);

  if (ability.status) {
    const _Effect = new statEffect({ ...statusEffects[ability.status] }, ability.statusModifiers);
    const resist = target.getStatusResists()[_Effect.type];
    const resisted = resist + random(9, -9) > ability.status_power + random(18, -18);
    if (!resisted) {
      let missing = true;
      target.statusEffects.forEach((effect: statEffect) => {
        if (effect.id == ability.status) {
          effect.last.current += _Effect.last.total;
          missing = false;
          return;
        }
      });
      if (missing) {
        target.statusEffects.push({ ..._Effect });
      }
    }
    else {
      spawnFloatingText(target.cords, "RESISTED!", "grey", 36);
    }
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
        dmg += Math.floor(((((num + val + bonus) * (mod)) * ability.damage_multiplier * (critRolled ? 1 + (attackerStats.critDamage / 100) : 1))) * (1 - (targetResists[key] - ability.resistance_penetration) / 100));
      });
    } else {
      Object.entries(ability.get_true_damage(attacker)).forEach((value: any) => {
        const key: string = value[0];
        const num: number = value[1];
        let { v: val, m: mod } = getModifiers(attacker, key + "Damage");
        val += attacker.allModifiers["damageV"];
        mod *= attacker.allModifiers["damageP"];
        val += getModifiers(attacker, "damage_against_type_" + target.type).v;
        mod *= getModifiers(attacker, "damage_against_type_" + target.type).m;
        val += getModifiers(attacker, "damage_against_race_" + target.race).v;
        mod *= getModifiers(attacker, "damage_against_race_" + target.race).m;
        let bonus: number = 0;
        bonus += num * attackerStats[ability.stat_bonus] / 50;
        dmg += Math.floor(((((num + val + bonus) * (mod)) * ability.damage_multiplier * (critRolled ? 1 + (attackerStats.critDamage / 100) : 1))) * (1 - (targetResists[key] - ability.resistance_penetration) / 100));
      });
    }
    setTimeout((paskaFixi: null) => {
      if (!enemyIndex(target.cords)) return;
      const layer = document.querySelector<HTMLCanvasElement>(`.enemy${enemyIndex(target.cords)}`);
      layer.style.animation = 'none';
      layer.offsetHeight; /* trigger reflow */
      layer.style.animation = null;
      layer.style.animationName = `charHurt`;
    }, 110);
    dmg = Math.floor(dmg * random(1.2, 0.8));
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
      if (ability.cooldown) ability.onCooldown = ability.cooldown;
      if (ability.mana_cost) attacker.stats.mp -= ability.mana_cost;
    }

    if (target.stats.hp <= 0) {
      target.kill();
      spawnFloatingText(target.cords, lang["gained_xp"].replace("[XP]", Math.floor(target.xp * player.allModifiers.expGainP)), "lime", 32, 1800, 100);
      setTimeout(modifyCanvas, 100);
    }
  } else {
    let dmg: number = 0;
    if (ability.damages) {
      Object.entries(ability.get_true_damage(attacker)).forEach((value: any) => {
        const key: string = value[0];
        const num: number = value[1];
        let { v: val, m: mod } = getModifiers(attacker, key + "Damage");
        val += attacker.allModifiers["damageV"];
        mod *= attacker.allModifiers["damageP"];
        let bonus: number = 0;
        bonus += num * attackerStats[ability.stat_bonus] / 50;
        dmg += Math.floor(((((num + val + bonus) * (mod)) * ability.damage_multiplier * (critRolled ? 1 + (attackerStats.critDamage / 100) : 1))) * (1 - (targetResists[key] - ability.resistance_penetration) / 100));
      });
    }
    else {
      Object.entries(attacker.damages).forEach((value: any) => {
        const key: string = value[0];
        const num: number = value[1];
        let { v: val, m: mod } = getModifiers(attacker, key + "Damage");
        val += attacker.allModifiers["damageV"];
        mod *= attacker.allModifiers["damageP"];
        let bonus: number = 0;
        if (ability.damages?.[key]) bonus = ability.damages[key];
        if (attacker.shootsProjectile) bonus += num * attackerStats.dex / 50;
        else bonus += num * attackerStats.str / 50;
        dmg += Math.floor(((((num + val + bonus) * mod) * ability.damage_multiplier * (critRolled ? 1 + (attackerStats.critDamage / 100) : 1))) * (1 - (targetResists[key] - ability.resistance_penetration) / 100));
      });
    }
    const layer = <HTMLCanvasElement>document.querySelector(".playerSheet");
    setTimeout((paskaFixi: null) => {
      layer.style.animation = 'none';
      layer.offsetHeight; /* trigger reflow */
      layer.style.animation = null;
      layer.style.animationName = `screenHurt`;
    }, 110);
    dmg = Math.floor(dmg * random(1.2, 0.8));
    if (evade) dmg = Math.floor(dmg / 2);
    if (dmg < 1) dmg = 1;
    target.stats.hp -= dmg;
    if (critRolled) spawnFloatingText(target.cords, dmg.toString() + "!", "red", 48);
    else spawnFloatingText(target.cords, dmg.toString(), "red", 36);
    if (evade) spawnFloatingText(target.cords, "EVADE!", "white", 36);
    let actionText = lang[ability.id + "_action_desc"] ?? "[TEXT NOT FOUND]";
    actionText = actionText.replace("[TARGET]", `'<c>yellow<c>${player.name}<c>white<c>'`);
    actionText = actionText.replace("[DMG]", `${dmg}`);
    displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${lang[attacker.id + "_name"]} <c>white<c>${actionText}`);
    if (ability.cooldown) ability.onCooldown = ability.cooldown;
    if (ability.mana_cost) attacker.stats.mp -= ability.mana_cost;
    if (target.stats.hp <= 0) {
      target.kill();
      setTimeout(modifyCanvas, 300);
    }
  }
  state.isSelected = false;
  updateUI();
}

function tileCordsToScreen(cords: tileObject) {
  // This function returns screen pixel values from cords.
  const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
  const screenX = (cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
  const screenY = (cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
  return { screenX, screenY };
}

function spawnFloatingText(cords: tileObject, text: string, color: string = "grey", fontSize: number = 30, ms: number = 800, delay: number = 35) {
  const { screenX: x, screenY: y } = tileCordsToScreen(cords);
  const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
  setTimeout(() => {
    const floatingText = document.createElement("p");
    floatingText.textContent = text;
    floatingText.style.fontSize = `${fontSize}px`;
    floatingText.style.color = color;
    floatingText.style.left = `${x - spriteSize / 2.5 + spriteSize / (random(2.5, 0.5))}px`;
    floatingText.style.top = `${y + spriteSize / (random(4, 1))}px`;
    floatingText.classList.add("floatingText");
    floatingText.style.animationDuration = `${ms / 1000}s`;
    document.body.append(floatingText);
    setTimeout(() => {
      document.body.removeChild(floatingText);
    }, ms);
  }, delay);

}

async function fireProjectile(start: tileObject, end: tileObject, projectileSprite: string, ability: ability, isPlayer: boolean, attacker: characterObject) {
  const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
  const path: any = generateArrowPath(start, end);
  const projectile = <HTMLImageElement>document.querySelector("." + projectileSprite);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  projectileLayers.append(canvas);
  if (isPlayer) {
    const layer = <HTMLCanvasElement>document.querySelector(".playerSheet");
    layer.style.animation = 'none';
    // @ts-ignore
    layer.offsetHeight; /* trigger reflow */
    // @ts-ignore
    layer.style.animation = null;
    layer.style.animationName = `shakeObject`;
  } else if (attacker.isFoe) {
    try {
      const layer = document.querySelector<HTMLCanvasElement>(`.enemy${maps[currentMap].enemies.findIndex(e => e.cords.x == attacker.cords.x && e.cords.y == attacker.cords.y)}`);
      layer.style.animation = 'none';
      // @ts-ignore
      layer.offsetHeight; /* trigger reflow */
      // @ts-ignore
      layer.style.animation = null;
      layer.style.animationName = `shakeObject`;
    }
    catch { console.warn("Enemy layer not found"); };
  }
  else {
    const layer = document.querySelector<HTMLCanvasElement>(`.summon${combatSummons.findIndex(e => e.cords.x == attacker.cords.x && e.cords.y == attacker.cords.y)}`);
    layer.style.animation = 'none';
    // @ts-ignore
    layer.offsetHeight; /* trigger reflow */
    // @ts-ignore
    layer.style.animation = null;
    layer.style.animationName = `shakeObject`;
  }
  if (path.length * 50 > highestWaitTime) highestWaitTime = path.length * 50;
  try {
    let collided = false;
    for (let step of path) {
      await sleep(50);
      const { screenX: x, screenY: y } = tileCordsToScreen(step);
      if (step.enemy) {
        collided = true;
        collision({ x: step.x, y: step.y }, ability, isPlayer, attacker);
        if (isPlayer) setTimeout(advanceTurn, 50);
        else if (attacker.isFoe) updateEnemiesTurn();
        break;
      }
      if (step.player && attacker.isFoe) {
        collided = true;
        updateEnemiesTurn();
        collision({ x: step.x, y: step.y }, ability, isPlayer, attacker);
        break;
      }
      if (step.summon && attacker.isFoe) {
        collided = true;
        collision({ x: step.x, y: step.y }, ability, isPlayer, attacker);
        updateEnemiesTurn();
        break;
      }
      if (step.blocked) {
        collided = true;
        if (isPlayer) setTimeout(advanceTurn, 50);
        else if (attacker.isFoe) updateEnemiesTurn();
        break;
      }
      canvas.width = canvas.width;
      ctx?.translate(x + spriteSize / 2, y + spriteSize / 2);
      const rotation = calcAngleDegrees(end.x - start.x, end.y - start.y);
      ctx?.rotate(rotation * Math.PI / 180);
      ctx?.translate((x + spriteSize / 2) * -1, (y + spriteSize / 2) * -1);
      ctx?.drawImage(projectile, x, y, spriteSize, spriteSize);
    }
    if (!collided && ability.aoe_size > 0) {
      if (isPlayer) setTimeout(advanceTurn, 50);
      aoeCollision(createAOEMap(path[path.length - 1], ability.aoe_size), attacker, ability);
    }
    projectileLayers.removeChild(canvas);
  }
  catch {
    projectileLayers.removeChild(canvas);
  }
}

function collision(target: tileObject, ability: ability, isPlayer: boolean, attacker: characterObject, theme?: string) {
  if (!attacker.isFoe || isPlayer) {
    let targetEnemy = maps[currentMap].enemies.find((en: any) => en.cords.x == target.x && en.cords.y == target.y);
    if (!targetEnemy) targetEnemy = maps[currentMap].enemies.find((en: any) => en.oldCords.x == target.x && en.oldCords.y == target.y);
    if (ability.aoe_size > 0) {
      aoeCollision(createAOEMap(targetEnemy?.cords, ability.aoe_size), attacker, ability);
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

function aoeCollision(area: Array<any>, attacker: characterObject, ability: ability) {
  const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
  const effect = document.querySelector<HTMLImageElement>(`.${ability.aoe_effect}`);
  for (let y = 0; y < spriteLimitY; y++) {
    for (let x = 0; x < spriteLimitX; x++) {
      if (area[mapOffsetStartY + y]?.[mapOffsetStartX + x] == "x") {
        baseCtx.drawImage(effect, x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, spriteSize, spriteSize);
      }
    }
  }
  let actionText: string = lang[ability.id + "_action_desc_pl"] ?? ability.action_desc_pl;
  displayText(`<c>cyan<c>[ACTION] <c>white<c>${actionText}`);
  maps[currentMap].enemies.forEach(en => {
    if (area[en.cords.y][en.cords.x] == "x") {
      regularAttack(attacker, en, ability, null, true);
    }
  });
  setTimeout(modifyCanvas, 150);
  state.isSelected = false;
  state.abiSelected = {};
  if (ability.cooldown) ability.onCooldown = ability.cooldown;
  if (ability.mana_cost) attacker.stats.mp -= ability.mana_cost;
  updateUI();
}

function threatDistance(targets: Array<any>, from: characterObject) {
  let chosenTarget: any = null;
  let highestThreat = -50;
  targets.forEach(target => {
    let dist = +generatePath(from.cords, target.cords, from.canFly, true);
    let threat = (target.getThreat() / dist) + random(18, -18);
    if (threat > highestThreat && dist <= (from.aggroRange ?? 14)) {
      highestThreat = threat;
      chosenTarget = target;
    }
  });
  return chosenTarget;
}

function summonUnit(ability: ability, cords: tileObject) {
  state.isSelected = false;
  state.abiSelected = {};
  if (ability.cooldown) ability.onCooldown = ability.cooldown;
  if (ability.mana_cost) player.stats.mp -= ability.mana_cost;
  // @ts-ignore
  combatSummons.push(new Summon({ ...summons[ability.summon_unit], level: ability.summon_level, lastsFor: ability.summon_last, cords: { ...cords } }));
  if (ability.status) player.statusEffects.push(new statEffect({ ...statusEffects[ability.status], last: ability.summon_last - 1 }, ability.statusModifiers));
  if (ability.summon_status) combatSummons[0].statusEffects.push(new statEffect({ ...statusEffects[ability.summon_status]}, ability.statusModifiers));
  updateUI();
  modifyCanvas();
}

function calcAngleDegrees(x: number, y: number) {
  return Math.atan2(y, x) * 180 / Math.PI;
}