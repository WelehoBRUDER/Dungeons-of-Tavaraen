"use strict";
//@ts-nocheck
function weaponReach(attacker, reach = 1, target) {
    const rotation = calcAngleDegrees(target.cords.x - attacker.cords.x, target.cords.y - attacker.cords.y);
    const distance = generateArrowPath(attacker.cords, target.cords).length - 1;
    if (distance > reach)
        return false;
    if (rotation < -90)
        return "NorthWest";
    else if (rotation >= -90 && rotation < -45)
        return "North";
    else if (rotation >= -45 && rotation < 0)
        return "NorthEast";
    else if (rotation >= 0 && rotation < 45)
        return "East";
    else if (rotation >= 45 && rotation < 90)
        return "SouthEast";
    else if (rotation >= 90 && rotation < 135)
        return "South";
    else if (rotation >= 135 && rotation < 180)
        return "SouthWest";
    else if (rotation >= 180)
        return "West";
    return false;
}
function attackTarget(attacker, target, attackDir) {
    if (target.isFoe) {
        let layer = null;
        if (attacker.id == "player")
            layer = document.querySelector(".playerSheet");
        else
            layer = document.querySelector(".summonLayers").querySelector(`.summon${summonIndex(attacker.cords)}`);
        layer.style.animation = "none";
        layer.offsetHeight; /* trigger reflow */
        layer.style.animation = null;
        layer.style.animationName = `attack${attackDir}`;
    }
    else if (attacker.isFoe) {
        try {
            const layer = document.querySelector(".enemyLayers").querySelector(`.enemy${enemyIndex(attacker.cords)}`);
            layer.offsetHeight; /* trigger reflow */
            layer.style.animation = null;
            layer.style.animationName = `attack${attackDir}`;
        }
        catch (_a) {
            console.warn("Enemy layer not found");
        }
    }
}
async function fireProjectile(start, end, projectileSprite, ability, isPlayer, attacker) {
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    const path = generateArrowPath(start, end);
    const projectile = document.querySelector("." + projectileSprite);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    let onDestroy = undefined;
    if (ability.aoe_size > 0) {
        onDestroy = () => aoeCollision(createAOEMap(path[path.length - 1], ability.aoe_size, ability.aoe_ignore_ledge), attacker, ability);
    }
    console.log(onDestroy);
    createNewProjectile(attacker, projectiles[projectileSprite], end, ability, regularAttack, onDestroy);
    animateProjectile(currentProjectiles[-1]);
    projectileLayers.append(canvas);
    if (isPlayer) {
        const layer = document.querySelector(".playerSheet");
        layer.style.animation = "none";
        // @ts-ignore
        layer.offsetHeight; /* trigger reflow */
        // @ts-ignore
        layer.style.animation = null;
        layer.style.animationName = `shakeObject`;
    }
    else if (attacker.isFoe) {
        try {
            const layer = document.querySelector(`.enemy${maps[currentMap].enemies.findIndex((e) => e.cords.x == attacker.cords.x && e.cords.y == attacker.cords.y)}`);
            layer.style.animation = "none";
            // @ts-ignore
            layer.offsetHeight; /* trigger reflow */
            // @ts-ignore
            layer.style.animation = null;
            layer.style.animationName = `shakeObject`;
        }
        catch (_a) {
            console.warn("Enemy layer not found");
        }
    }
    else {
        const layer = document.querySelector(`.summon${combatSummons.findIndex((e) => e.cords.x == attacker.cords.x && e.cords.y == attacker.cords.y)}`);
        layer.style.animation = "none";
        // @ts-ignore
        layer.offsetHeight; /* trigger reflow */
        // @ts-ignore
        layer.style.animation = null;
        layer.style.animationName = `shakeObject`;
    }
    // if (path.length * 50 > highestWaitTime) highestWaitTime = path.length * 50;
    // try {
    //   let collided = false;
    //   for (let step of path) {
    //     await helper.sleep(15);
    //     const { screenX: x, screenY: y } = tileCordsToScreen(step);
    //     if (step.enemy) {
    //       collided = true;
    //       collision({ x: step.x, y: step.y }, ability, isPlayer, attacker);
    //       if (isPlayer) setTimeout(advanceTurn, 20);
    //       else if (attacker.isFoe) updateEnemiesTurn();
    //       break;
    //     }
    //     if (step.player && attacker.isFoe) {
    //       collided = true;
    //       updateEnemiesTurn();
    //       collision({ x: step.x, y: step.y }, ability, isPlayer, attacker);
    //       break;
    //     }
    //     if (step.summon && attacker.isFoe) {
    //       collided = true;
    //       collision({ x: step.x, y: step.y }, ability, isPlayer, attacker);
    //       updateEnemiesTurn();
    //       break;
    //     }
    //     if (step.blocked) {
    //       collided = true;
    //       if (isPlayer) setTimeout(advanceTurn, 20);
    //       else if (attacker.isFoe) updateEnemiesTurn();
    //       break;
    //     }
    //     canvas.width = canvas.width;
    //     ctx?.translate(x + spriteSize / 2, y + spriteSize / 2);
    //     const rotation = calcAngleDegrees(end.x - start.x, end.y - start.y);
    //     ctx?.rotate((rotation * Math.PI) / 180);
    //     ctx?.translate((x + spriteSize / 2) * -1, (y + spriteSize / 2) * -1);
    //     ctx?.drawImage(projectile, x, y, spriteSize, spriteSize);
    //   }
    //   if (!collided && ability.aoe_size > 0) {
    //     if (isPlayer) setTimeout(advanceTurn, 20);
    //     aoeCollision(
    //       createAOEMap(
    //         path[path.length - 1],
    //         ability.aoe_size,
    //         ability.aoe_ignore_ledge
    //       ),
    //       attacker,
    //       ability
    //     );
    //   }
    //   projectileLayers.removeChild(canvas);
    // } catch {
    //   projectileLayers.removeChild(canvas);
    // }
}
async function animateProjectile(projectile) {
    console.log(projectile);
}
//# sourceMappingURL=animation.js.map