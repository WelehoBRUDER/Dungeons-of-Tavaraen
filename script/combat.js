"use strict";
function weaponReach(attacker, reach = 1, target) {
    const main = { x: attacker.cords.x, y: attacker.cords.y };
    const goal = { x: target.cords.x, y: target.cords.y };
    if (reach == 1) {
        if (main.x + 1 == goal.x && main.y == goal.y)
            return "East";
        if (main.x + 1 == goal.x && main.y - 1 == goal.y)
            return "NorthEast";
        if (main.x == goal.x && main.y - 1 == goal.y)
            return "North";
        if (main.x - 1 == goal.x && main.y - 1 == goal.y)
            return "NorthWest";
        if (main.x - 1 == goal.x && main.y == goal.y)
            return "West";
        if (main.x - 1 == goal.x && main.y + 1 == goal.y)
            return "SouthWest";
        if (main.x == goal.x && main.y + 1 == goal.y)
            return "South";
        if (main.x + 1 == goal.x && main.y + 1 == goal.y)
            return "SouthEast";
    }
    return false;
}
function enemyIndex(cords) {
    for (let i = 0; i < maps[currentMap].enemies.length; i++) {
        if (maps[currentMap].enemies[i].cords == cords)
            return i;
    }
}
function attackTarget(attacker, target, attackDir) {
    // @ts-ignore
    if (target.isFoe) {
        const layer = document.querySelector(".playerSheet");
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
        const layer = document.querySelector(".enemyLayers").querySelector(`.enemy${enemyIndex(attacker.cords)}`);
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
var abiSelected = {};
var isSelected = false;
function useAbi(abi) {
    abiSelected = abi;
    isSelected = true;
    if (abi.self_target) {
        // @ts-ignore
        buffOrHeal(player, abiSelected);
    }
    updateUI();
}
function buffOrHeal(character, ability) {
    isSelected = false;
    // @ts-expect-error
    player.effects();
    if (ability.base_heal) {
        const { v: val, m: mod } = getModifiers(character, "healPower");
        const heal = Math.floor((ability.base_heal + val) * mod);
        character.stats.hp += heal;
        spawnFloatingText(character.cords, heal.toString(), "lime", 36);
        if (character.isFoe)
            displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${character.name} <c>white<c>${ability.action_desc} on their self, recovering ${heal} health.`);
        else
            displayText(`<c>cyan<c>[ACTION] <c>yellow<c>You <c>white<c>${ability.action_desc_pl} on your self, recovering ${heal} health.`);
    }
    if (ability.status) {
        if (!player.statusEffects.find((eff) => eff.id == ability.status)) {
            // @ts-ignore
            character.statusEffects.push(new statEffect(Object.assign({}, statusEffects[ability.status]), ability.statusModifiers));
        }
        else {
            // @ts-expect-error
            player.statusEffects.find((eff) => eff.id == ability.status).last.current += statusEffects[ability.status].last.total;
        }
        // @ts-ignore
        statusEffects[ability.status].last.current = statusEffects[ability.status].last.total;
        // @ts-expect-error
        spawnFloatingText(character.cords, ability.line, "crimson", 36);
        if (character.isFoe)
            displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${character.name} <c>white<c>${ability.action_desc}`);
        else
            displayText(`<c>cyan<c>[ACTION] <c>yellow<c>You <c>white<c>${ability.action_desc_pl}`);
    }
    character.stats.mp -= ability.mana_cost;
    ability.onCooldown = ability.cooldown;
    advanceTurn();
}
function regularAttack(attacker, target, ability, targetCords) {
    var _a;
    if (targetCords) {
        maps[currentMap].enemies.forEach((en) => { if (targetCords.x == en.cords.x && targetCords.y == en.cords.y)
            target = en; });
    }
    // @ts-ignore
    if (target.isFoe) {
        let dmg = 0;
        if (!ability.damages) {
            // @ts-ignore
            Object.entries((_a = attacker.weapon) === null || _a === void 0 ? void 0 : _a.damages).forEach((value) => {
                var _a;
                const key = value[0];
                const num = value[1];
                const { v: val, m: mod } = getModifiers(attacker, key + "Damage");
                let bonus = 0;
                // @ts-ignore
                if ((_a = ability.damages) === null || _a === void 0 ? void 0 : _a[key])
                    bonus = ability.damages[key];
                // @ts-ignore
                if (attacker.weapon.firesProjectile)
                    bonus += num * attacker.getStats().dex / 20;
                // @ts-ignore
                else
                    bonus += num * attacker.getStats().str / 20;
                // @ts-ignore
                dmg += Math.floor(((((num + val + bonus) * (mod)) * ability.damage_multiplier)) * (1 - (target.getResists()[key] - ability.resistance_penetration) / 100));
            });
        }
        else {
            Object.entries(ability.damages).forEach((value) => {
                const key = value[0];
                const num = value[1];
                const { v: val, m: mod } = getModifiers(attacker, key + "Damage");
                let bonus = 0;
                // @ts-ignore
                bonus += num * attacker.getStats()[ability.stat_bonus] / 20;
                // @ts-ignore
                dmg += Math.floor(((((num + val + bonus) * (mod)) * ability.damage_multiplier)) * (1 - (target.getResists()[key] - ability.resistance_penetration) / 100));
            });
        }
        target.stats.hp -= dmg;
        spawnFloatingText(target.cords, dmg.toString(), "red", 36);
        displayText(`<c>cyan<c>[ACTION] <c>yellow<c>You <c>white<c>${ability.action_desc_pl} ${target.name} for ${dmg} damage.`);
        if (ability.cooldown)
            ability.onCooldown = ability.cooldown;
        if (ability.mana_cost)
            attacker.stats.mp -= ability.mana_cost;
        if (target.stats.hp <= 0) {
            // @ts-ignore
            target.kill();
            spawnFloatingText(target.cords, "Gained " + target.xp + " XP", "lime", 32, 1800, 100);
            setTimeout(modifyCanvas, 100);
        }
    }
    else {
        let dmg = 0;
        // @ts-ignore
        Object.entries(attacker.damages).forEach((value) => {
            var _a;
            const key = value[0];
            const num = value[1];
            const { v: val, m: mod } = getModifiers(attacker, key + "Damage");
            let bonus = 0;
            // @ts-ignore
            if ((_a = ability.damages) === null || _a === void 0 ? void 0 : _a[key])
                bonus = ability.damages[key];
            // @ts-ignore
            if (attacker.firesProjectile)
                bonus += num * attacker.getStats().dex / 20;
            // @ts-ignore
            else
                bonus += num * attacker.getStats().str / 20;
            // @ts-ignore
            dmg += Math.floor(((((num + val + bonus) * mod) * ability.damage_multiplier)) * (1 - (target.getResists()[key] - ability.resistance_penetration) / 100));
        });
        target.stats.hp -= dmg;
        spawnFloatingText(target.cords, dmg.toString(), "red", 36);
        displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${attacker.name} <c>white<c>${ability.action_desc} ${target.name} for ${dmg} damage.`);
        if (ability.cooldown)
            ability.onCooldown = ability.cooldown;
        if (ability.mana_cost)
            attacker.stats.mp -= ability.mana_cost;
    }
    isSelected = false;
    updateUI();
}
function tileCordsToScreen(cords) {
    // This function returns screen pixel values from cords.
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    const screenX = (cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    const screenY = (cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
    return { screenX, screenY };
}
function spawnFloatingText(cords, text, color = "grey", fontSize = 30, ms = 800, delay = 35) {
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
async function fireProjectile(start, end, projectileSprite, ability, isPlayer) {
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    const path = generateArrowPath(start, end);
    const projectile = document.querySelector("." + projectileSprite);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    projectileLayers.append(canvas);
    for (let step of path) {
        await sleep(70);
        const { screenX: x, screenY: y } = tileCordsToScreen(step);
        if (step.enemy) {
            console.log(step);
            collision({ x: step.x, y: step.y }, ability, isPlayer);
            setTimeout(advanceTurn, 70);
            break;
        }
        if (step.blocked) {
            setTimeout(advanceTurn, 70);
            break;
        }
        canvas.width = canvas.width;
        ctx === null || ctx === void 0 ? void 0 : ctx.translate(x + spriteSize / 2, y + spriteSize / 2);
        const rotation = calcAngleDegrees(end.x - start.x, end.y - start.y);
        ctx === null || ctx === void 0 ? void 0 : ctx.rotate(rotation * Math.PI / 180);
        ctx === null || ctx === void 0 ? void 0 : ctx.translate((x + spriteSize / 2) * -1, (y + spriteSize / 2) * -1);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(projectile, x, y, spriteSize, spriteSize);
    }
    projectileLayers.removeChild(canvas);
}
function collision(target, ability, isPlayer, theme) {
    if (isPlayer) {
        let targetEnemy = maps[currentMap].enemies.find((en) => en.cords.x == target.x && en.cords.y == target.y);
        // @ts-ignore
        regularAttack(player, targetEnemy, ability);
    }
}
function calcAngleDegrees(x, y) {
    return Math.atan2(y, x) * 180 / Math.PI;
}
