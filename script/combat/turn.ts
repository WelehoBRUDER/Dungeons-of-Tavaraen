async function advanceTurn() {
  if (player.isDead) return;
  if (DEVMODE) updateDeveloperInformation();
  if (state.inCombat) displayText("<c>white<c>[WORLD]: <c>yellow<c>-----Turn change-----");
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
  combatSummons.forEach(summon => {
    if (!summon.alive || player.isDead) return;
    const sRegen = summon.getRegen();
    if (summon.stats.hp < summon.getHpMax()) summon.stats.hp += sRegen["hp"];
    if (summon.stats.mp < summon.getMpMax()) summon.stats.mp += sRegen["mp"];
    if (!summon.permanent) {
      summon.lastsFor--;
      if (summon.lastsFor <= 0) {
        summon.kill();
        return;
      }
    }
    summon.updateStatModifiers();
    summon.updateAbilities();
    summon.decideAction();
    summon.effects();
  });
  let closestEnemyDistance = -1;
  map.enemies.forEach((enemy: any) => {
    let distToPlayer = enemy.distToPlayer();
    if (player.isDead) return;
    if (!enemy.alive) { updateEnemiesTurn(); return; };
    if (closestEnemyDistance < 0) closestEnemyDistance = enemy.distToPlayer();
    else if (distToPlayer < closestEnemyDistance) closestEnemyDistance = enemy.distToPlayer();
    const eRegen = enemy.getRegen();
    if (enemy.stats.hp < enemy.getHpMax()) enemy.stats.hp += eRegen["hp"];
    if (enemy.stats.mp < enemy.getMpMax()) enemy.stats.mp += eRegen["mp"];
    // @ts-ignore
    if (enemy.aggro()) {
      state.inCombat = true;
      enemy.updateAbilities();
      enemy.decideAction();
    }
    else updateEnemiesTurn();
    enemy.effects();
  });
  player.effects();
  player.updateAbilities();
  updateUI();
  document.querySelector(".closestEnemyDistance").textContent = lang["closest_enemy"] + closestEnemyDistance;
  showInteractPrompt();
  setTimeout(modifyCanvas, 500);
  updateUI();
  if (map.enemies.length == 0) turnOver = true;
  if (player.stats.hp > player.getHpMax()) {
    player.stats.hp = player.getHpMax();
  }
  if (player.stats.mp > player.getMpMax()) {
    player.stats.mp = player.getMpMax();
  }
}


function updateEnemiesTurn() {
  enemiesHadTurn++;
  if (enemiesHadTurn >= maps[currentMap].enemies.length) turnOver = true;
}
