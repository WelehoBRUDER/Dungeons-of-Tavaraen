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
    console.log(attackDir);
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
    console.log(layer);
    console.log(attackDir);
    layer.style.animation = 'none';
    // @ts-ignore
    layer.offsetHeight; /* trigger reflow */
    // @ts-ignore
    layer.style.animation = null;
    layer.style.animationName = `attack${attackDir}`;
  }
}

function regularAttack(attacker: characterObject, target: characterObject, ability: ability) {
  console.log(tileCordsToScreen(target.cords));
  // @ts-ignore
  if (target.isFoe) {
    let dmg: number = 0;
    // @ts-ignore
    Object.entries(attacker.weapon?.damages).forEach((value: any) => {
      const key: string = value[0];
      const num: number = value[1];
      const { v: val, m: mod } = getModifiers(attacker, key + "Damage");
      let bonus: number = 0;
      // @ts-ignore
      if (ability.damages?.[key]) bonus = ability.damages[key];
      // @ts-ignore
      if (attacker.weapon.firesProjectile) bonus += num * attacker.getStats().dex / 20;
      // @ts-ignore
      else bonus += num * attacker.getStats().str / 20;
      // @ts-ignore
      dmg += Math.floor(((((num + val + bonus) * (mod)) * ability.damage_multiplier)) * (1 - target.getResists()[key] / 100));
    });
    target.stats.hp -= dmg;
    spawnFloatingText(target.cords, dmg.toString(), "red", 36);
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
      const { v: val, m: mod } = getModifiers(attacker, key + "Damage");
      let bonus: number = 0;
      // @ts-ignore
      if (ability.damages?.[key]) bonus = ability.damages[key];
      // @ts-ignore
      if (attacker.firesProjectile) bonus += num * attacker.getStats().dex / 20;
      // @ts-ignore
      else bonus += num * attacker.getStats().str / 20;
      // @ts-ignore
      dmg += Math.floor(((((num + val + bonus) * mod) * ability.damage_multiplier)) * (1 - target.getResists()[key] / 100));
    });
    target.stats.hp -= dmg;
    spawnFloatingText(target.cords, dmg.toString(), "red", 36);
    if (ability.cooldown) ability.onCooldown = ability.cooldown;
    if (ability.mana_cost) attacker.stats.mp -= ability.mana_cost;
  }
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
    floatingText.style.left = `${x + spriteSize / (random(4, 1))}px`;
    floatingText.style.top = `${y + spriteSize / (random(4, 1))}px`;
    floatingText.classList.add("floatingText");
    floatingText.style.animationDuration = `${ms / 1000}s`;
    document.body.append(floatingText);
    setTimeout(() => {
      document.body.removeChild(floatingText);
    }, ms);
  }, delay);

}

async function fireProjectile(start: tileObject, end: tileObject, projectileSprite: string, collisionFunction: Function) {
  const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
  const path: any = generateArrowPath(start, end);
  const projectile = <HTMLImageElement>document.querySelector("." + projectileSprite);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  projectileLayers.append(canvas);
  for (let step of path) {
    await sleep(70);
    const { screenX: x, screenY: y } = tileCordsToScreen(step);
    if(step.enemy) {
      collisionFunction();
      setTimeout(advanceTurn, 70);
      break;
    }
    if(step.blocked) {
      setTimeout(advanceTurn, 70);
      break;
    } 
    canvas.width = canvas.width;
    ctx?.translate(x + spriteSize/2, y + spriteSize/2);
    const rotation = calcAngleDegrees(end.x - start.x, end.y - start.y);
    ctx?.rotate(rotation * Math.PI/180);
    ctx?.translate((x + spriteSize/2) * -1, (y + spriteSize/2) * -1);
    ctx?.drawImage(projectile, x, y, spriteSize, spriteSize);
  }
  projectileLayers.removeChild(canvas);
}

function calcAngleDegrees(x: number, y: number) {
  return Math.atan2(y, x) * 180 / Math.PI;
}