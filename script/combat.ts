function weaponReach(attacker: characterObject, reach: number = 1, target: characterObject) {
  const main = { x: attacker.cords.x, y: attacker.cords.y };
  const goal = { x: target.cords.x, y: target.cords.y };
  if (reach == 1) {
    if (main.x + 1 == goal.x && main.y == goal.y) return "East";
    if (main.x + 1 == goal.x && main.y - 1 == goal.y) return "NorthEast";
    if (main.x == goal.x && main.y - 1 == goal.y) return "North";
    if (main.x - 1 == goal.x && main.y - 1 == goal.y) return "NorthWest";
    if (main.x - 1 == goal.x && main.y == goal.y) return "West";
    if (main.x - 1 == goal.x && main.y + 1 == goal.y) return "SouthWest";
    if (main.x == goal.x && main.y + 1 == goal.y) return "South";
    if (main.x + 1 == goal.x && main.y + 1 == goal.y) return "SouthEast";
  }
  return false;
}

function enemyIndex(cords: tileObject) {
  for (let i = 0; i < maps[currentMap].enemies.length; i++) {
    if (maps[currentMap].enemies[i].cords == cords) return i;
  }
}

function attackTarget(attacker: characterObject, target: characterObject, attackDir: string) {
  // @ts-ignore
  if (target.isFoe) {
    const layer = <HTMLCanvasElement>document.querySelector(".playerSheet");
    layer.style.animation = 'none';
    // @ts-ignore
    layer.offsetHeight; /* trigger reflow */
    // @ts-ignore
    layer.style.animation = null;
    layer.style.animationName = `attack${attackDir}`;
  }
  else {
    // @ts-ignore
    const layer = <HTMLCanvasElement>document.querySelector(".enemyLayers").querySelector(`.enemy${enemyIndex(attacker.cords)}`);
    layer.style.animation = 'none';
    // @ts-ignore
    layer.offsetHeight; /* trigger reflow */
    // @ts-ignore
    layer.style.animation = null;
    layer.style.animationName = `attack${attackDir}`;
  }
}

var abiSelected: any = {};
var isSelected: boolean = false;

function useAbi(abi: ability) {
  abiSelected = abi;
  isSelected = true;
  if (abi.self_target) {
    // @ts-ignore
    buffOrHeal(player, abiSelected);
  }
  updateUI();
}

function buffOrHeal(character: characterObject, ability: ability) {
  isSelected = false;
  player.effects();
  if (ability.base_heal) {
    const { v: val, m: mod } = getModifiers(character, "healPower");
    const heal: number = Math.floor((ability.base_heal + val) * mod);
    character.stats.hp += heal;
    spawnFloatingText(character.cords, heal.toString(), "lime", 36);
    if (character.isFoe) displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${character.name} <c>white<c>${lang[ability.id + "_action_desc"]} ${lang["recovery_foe"]} ${heal} ${lang["health_points"]}.`);
    else displayText(`<c>cyan<c>[ACTION] <c>yellow<c>${lang["you"]} <c>white<c>${lang[ability.id + "_action_desc_pl"]} ${lang["recovery_pl"]} ${heal} ${lang["health_points"]}.`);
  }
  if (ability.status) {
    if(!character.statusEffects.find((eff: statEffect)=>eff.id == ability.status)) {
      // @ts-ignore
      character.statusEffects.push(new statEffect({...statusEffects[ability.status]}, ability.statusModifiers));
      if(character.id == player.id) character.statusEffects.find((eff: statEffect)=>eff.id == ability.status).last.current -= 1;
    } else {
      character.statusEffects.find((eff: statEffect)=>eff.id == ability.status).last.current += statusEffects[ability.status].last.total;
    }
    // @ts-ignore
    statusEffects[ability.status].last.current = statusEffects[ability.status].last.total;
    spawnFloatingText(character.cords, ability.line, "crimson", 36);
    if (character.isFoe) displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${character.name} <c>white<c>${ability.action_desc}`);
    else displayText(`<c>cyan<c>[ACTION] <c>yellow<c>You <c>white<c>${ability.action_desc_pl}`);
  }
  character.stats.mp -= ability.mana_cost;
  ability.onCooldown = ability.cooldown;
  advanceTurn();
}

function regularAttack(attacker: characterObject, target: characterObject, ability: ability, targetCords?: any) {
  if (targetCords) {
    maps[currentMap].enemies.forEach((en: any) => { if (targetCords.x == en.cords.x && targetCords.y == en.cords.y) target = en; });
  }
  const critRolled = attacker.getStats().critChance >= random(100, 0);
  // @ts-ignore
  if (target.isFoe) {
    let dmg: number = 0;
    if (!ability.damages) {
      // @ts-ignore
      Object.entries(attacker.weapon?.damages).forEach((value: any) => {
        const key: string = value[0];
        const num: number = value[1];
        let { v: val, m: mod } = getModifiers(attacker, key + "Damage");
        val += getModifiers(attacker, "damage").v;
        mod *= getModifiers(attacker, "damage").m;
        let bonus: number = 0;
        if (ability.damages?.[key]) bonus = ability.damages[key];
        // @ts-ignore
        if (attacker.weapon.firesProjectile) bonus += num * attacker.getStats().dex / 20;
        else bonus += num * attacker.getStats().str / 20;
        dmg += Math.floor(((((num + val + bonus) * (mod)) * ability.damage_multiplier * ( critRolled ? 1+(attacker.getStats().critDamage/100) : 1))) * (1 - (target.getResists()[key] - ability.resistance_penetration) / 100));
      });
    } else {
      Object.entries(ability.damages).forEach((value: any) => {
        const key: string = value[0];
        const num: number = value[1];
        let { v: val, m: mod } = getModifiers(attacker, key + "Damage");
        val += getModifiers(attacker, "damage").v;
        mod *= getModifiers(attacker, "damage").m;
        let bonus: number = 0;
        // @ts-ignore
        bonus += num * attacker.getStats()[ability.stat_bonus] / 20;
        // @ts-ignore
        dmg += Math.floor(((((num + val + bonus) * (mod)) * ability.damage_multiplier * ( critRolled ? 1+(attacker.getStats().critDamage/100) : 1))) * (1 - (target.getResists()[key] - ability.resistance_penetration) / 100));
      });
    }
    if(ability.status) {
      target.statusEffects.push(new statEffect({...statusEffects[ability.status]}, s_def));
    }
    dmg = Math.floor(dmg * random(1.2, 0.8));
    target.stats.hp -= dmg;
    spawnFloatingText(target.cords, dmg.toString(), "red", 36);
    let actionText: string = lang[ability.id + "_action_desc_pl"] ?? ability.action_desc_pl;
    actionText = actionText.replace("[TARGET]", `'<c>yellow<c>${lang[target.id + "_name"]}<c>white<c>'`);
    actionText = actionText.replace("[DMG]", `${dmg}`);
    displayText(`<c>cyan<c>[ACTION] <c>white<c>${actionText}`);
    if (ability.cooldown) ability.onCooldown = ability.cooldown;
    if (ability.mana_cost) attacker.stats.mp -= ability.mana_cost;
    if (target.stats.hp <= 0) {
      // @ts-ignore
      target.kill();
      spawnFloatingText(target.cords, "Gained " + target.xp + " XP", "lime", 32, 1800, 100);
      setTimeout(modifyCanvas, 100);
    }
  } else {
    let dmg: number = 0;
    // @ts-ignore
    Object.entries(attacker.damages).forEach((value: any) => {
      const key: string = value[0];
      const num: number = value[1];
      let { v: val, m: mod } = getModifiers(attacker, key + "Damage");
      val += getModifiers(attacker, "damage").v;
      mod *= getModifiers(attacker, "damage").m;
      let bonus: number = 0;
      // @ts-ignore
      if (ability.damages?.[key]) bonus = ability.damages[key];
      // @ts-ignore
      if (attacker.shootsProjectile) bonus += num * attacker.getStats().dex / 20;
      // @ts-ignore
      else bonus += num * attacker.getStats().str / 20;
      // @ts-ignore
      dmg += Math.floor(((((num + val + bonus) * mod) * ability.damage_multiplier * ( critRolled ? 1+(attacker.getStats().critDamage/100) : 1))) * (1 - (target.getResists()[key] - ability.resistance_penetration) / 100));
    });
    dmg = Math.floor(dmg * random(1.2, 0.8));
    target.stats.hp -= dmg;
    spawnFloatingText(target.cords, dmg.toString(), "red", 36);
    displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${lang[attacker.id + "_name"]} <c>white<c>${lang[ability.id + "_action_desc"]} '<c>yellow<c>${target.name}<c>white<c>' ${lang["for"]} ${dmg} ${lang["damage"].toLowerCase()}.`);
    if (ability.cooldown) ability.onCooldown = ability.cooldown;
    if (ability.mana_cost) attacker.stats.mp -= ability.mana_cost;
  }
  isSelected = false;
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
    floatingText.style.left = `${x - spriteSize/2.5 + spriteSize / (random(2.5, 0.5))}px`;
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
  console.log(path);
  for (let step of path) {
    await sleep(70);
    const { screenX: x, screenY: y } = tileCordsToScreen(step);
    if (step.enemy) {
      collision({ x: step.x, y: step.y }, ability, isPlayer, player);
      if(isPlayer) setTimeout(advanceTurn, 70);
      break;
    }
    if (step.player) {
      collision({ x: step.x, y: step.y }, ability, isPlayer, attacker);
      break;
    }
    if (step.blocked) {
      if(isPlayer) setTimeout(advanceTurn, 70);
      break;
    }
    canvas.width = canvas.width;
    ctx?.translate(x + spriteSize / 2, y + spriteSize / 2);
    const rotation = calcAngleDegrees(end.x - start.x, end.y - start.y);
    ctx?.rotate(rotation * Math.PI / 180);
    ctx?.translate((x + spriteSize / 2) * -1, (y + spriteSize / 2) * -1);
    ctx?.drawImage(projectile, x, y, spriteSize, spriteSize);
  }
  projectileLayers.removeChild(canvas);
}

function collision(target: tileObject, ability: ability, isPlayer: boolean, attacker: characterObject, theme?: string) {
  if (isPlayer) {
    let targetEnemy = maps[currentMap].enemies.find((en: any) => en.cords.x == target.x && en.cords.y == target.y);
    // @ts-ignore
    regularAttack(player, targetEnemy, ability);
  }
  else if(player.cords.x == target.x && player.cords.y == target.y) {
    regularAttack(attacker, player, ability);
  }
}

function calcAngleDegrees(x: number, y: number) {
  return Math.atan2(y, x) * 180 / Math.PI;
}