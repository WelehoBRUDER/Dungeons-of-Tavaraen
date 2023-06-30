"use strict";
async function advanceTurn() {
    if (player.isDead)
        return;
    if (DEVTOOLS.ENABLED)
        updateDeveloperInformation();
    if (state.inCombat)
        displayText("<c>white<c>[WORLD]: <c>yellow<c>-----Turn change-----");
    state.inCombat = false;
    state.abiSelected = {};
    state.isSelected = false;
    turnOver = false;
    enemiesHadTurn = 0;
    let map = maps[currentMap];
    hideMapHover();
    const pRegen = player.getRegen();
    player.stats.hp += pRegen["hp"];
    player.stats.mp += pRegen["mp"];
    currentProjectiles.forEach((projectile) => {
        projectile.move();
    });
    combatSummons.forEach((summon) => {
        if (!summon.alive || player.isDead)
            return;
        const sRegen = summon.getRegen();
        if (summon.stats.hp < summon.getHpMax())
            summon.stats.hp += sRegen["hp"];
        if (summon.stats.mp < summon.getMpMax())
            summon.stats.mp += sRegen["mp"];
        if (!summon.permanent) {
            summon.lastsFor--;
            if (summon.lastsFor <= 0) {
                summon.kill();
                return;
            }
        }
        summon.updateTraits();
        summon.updateAbilities();
        summon.decideAction();
        summon.effects();
        summon.updateAllModifiers();
    });
    let closestEnemyDistance = -1;
    map.enemies.forEach((enemy) => {
        let distToPlayer = enemy.distToPlayer();
        if (player.isDead)
            return;
        if (!enemy.alive) {
            updateEnemiesTurn();
            return;
        }
        if (closestEnemyDistance < 0)
            closestEnemyDistance = enemy.distToPlayer();
        else if (distToPlayer < closestEnemyDistance)
            closestEnemyDistance = enemy.distToPlayer();
        enemy.updateAllModifiers();
        const eRegen = enemy.getRegen();
        if (enemy.stats.hp < enemy.getHpMax())
            enemy.stats.hp += eRegen["hp"];
        if (enemy.stats.mp < enemy.getMpMax())
            enemy.stats.mp += eRegen["mp"];
        // @ts-ignore
        if (enemy.aggro()) {
            state.inCombat = true;
            enemy.updateAbilities();
            enemy.decideAction();
        }
        else
            updateEnemiesTurn();
        enemy.effects();
    });
    player.effects();
    player.updateAbilities();
    player.updateAllModifiers();
    updateUI();
    document.querySelector(".closestEnemyDistance").textContent = lang["closest_enemy"] + closestEnemyDistance;
    showInteractPrompt();
    //setTimeout(modifyCanvas, 500);
    updateUI();
    if (fallenEnemies.length > 0) {
        fallenEnemies.some((enemy, index) => {
            if (enemy.spawnMap !== currentMap && !enemy.isUnique) {
                if (!enemy.turnsToRes)
                    enemy.turnsToRes = 200;
                enemy.turnsToRes--;
                if (enemy.turnsToRes <= 0) {
                    maps[enemy.spawnMap].enemies.push(new Enemy({
                        ...enemies[enemy.id],
                        level: enemy.level,
                        spawnCords: enemy.spawnCords,
                        cords: enemy.spawnCords,
                        spawnMap: enemy.spawnMap,
                    }));
                    fallenEnemies.splice(index, 1);
                }
                return true;
            }
        });
    }
    if (map.enemies.length == 0)
        turnOver = true;
    if (player.stats.hp > player.getHpMax()) {
        player.stats.hp = player.getHpMax();
    }
    if (player.stats.mp > player.getMpMax()) {
        player.stats.mp = player.getMpMax();
    }
}
function updateEnemiesTurn() {
    enemiesHadTurn++;
    if (enemiesHadTurn >= maps[currentMap].enemies.length)
        turnOver = true;
}
//# sourceMappingURL=turn.js.map