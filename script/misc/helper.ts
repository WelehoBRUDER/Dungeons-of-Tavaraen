interface helper {
  [weightedRandom: string]: Function;
  trimPlayerObjectForSaveFile: Function;
  purgeDeadEnemies: Function;
  reviveAllDeadEnemies: Function;
  killAllQuestEnemies: Function;
  resetAllLivingEnemiesInAllMaps: Function;
  roundFloat: Function;
  random: Function;
  sleep: Function;
}

/* Helper object contains multiple misc functions used throughout the code */
/* Helper should be expanded whenever the same function must be repeated in multiple files */

let helper = {
  weightedRandom: function (Array: Array<any>) {
    let table: Array<any> = [...Array];
    let max = 0;
    for (let i = 0; i < table.length; i++) {
      if (table[i]?.type == "gold") continue;
      table[i].dynamicChance = 0;
      if (table[i - 1]) table[i].dynamicChance = table[i - 1].dynamicChance;
      else table[i].dynamicChance = 0;
      table[i].dynamicChance += table[i].chance;
      max = table[i].dynamicChance;
    }
    let value: number = Math.floor(helper.random(max, 0));
    let result: any;
    for (let item of table) {
      if (item.dynamicChance >= value) { result = item; break; }
    }
    return result;
  },
  random: function (max: number, min: number = -100) {
    return (Math.random() * (max - min) + min);
  },
  roundFloat: function (value: number, decimals: number = 2) {
    let rounded = Math.pow(10, decimals);
    return +(Math.round(value * rounded) / rounded).toFixed(decimals);
  },
  sleep: function (ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  trimPlayerObjectForSaveFile: function (playerObject: PlayerCharacter) {
    const trimmed: PlayerCharacter = { ...playerObject };
    trimmed.inventory.forEach((itm: any, index: number) => {
      if (itm.stackable || itm.type === "consumable") trimmed.inventory[index] = { id: itm.id, type: itm.type, amount: itm.amount, usesRemaining: itm.usesRemaining, equippedSlot: itm.equippedSlot };
      else if (itm.level) trimmed.inventory[index] = { id: itm.id, type: itm.type, level: itm.level, rolledStats: itm.rolledStats ?? [] };
      else trimmed.inventory[index] = { id: itm.id, type: itm.type, rolledStats: itm.rolledStats ?? [] };
    });
    trimmed.abilities.forEach((abi: any, index: number) => {
      // @ts-ignore
      trimmed.abilities[index] = { id: abi.id, equippedSlot: abi.equippedSlot };
    });
    trimmed.allModifiers = {};
    equipSlots.forEach((slot: string) => {
      if (trimmed[slot]?.id) {
        trimmed[slot] = { id: trimmed[slot].id, type: trimmed[slot].type, level: trimmed[slot].level ?? 0, rolledStats: trimmed[slot].rolledStats ?? [] };
      }
    });
    trimmed.perks.forEach((perk: any, index: number) => {
      trimmed.perks[index] = { id: perk.id, tree: perk.tree, commandsExecuted: perk.commandsExecuted };
    });
    return { ...trimmed };
  },
  purgeDeadEnemies: function () {
    fallenEnemies.forEach(deadFoe => {
      maps.forEach((mp: any, index: number) => {
        if (deadFoe.spawnMap == index) {
          let purgeList: Array<number> = [];
          mp.enemies.forEach((en: any, _index: number) => {
            if (en.spawnCords.x == deadFoe.spawnCords.x && en.spawnCords.y == deadFoe.spawnCords.y) {
              purgeList.push(_index);
            }
          });
          for (let __index of purgeList) {
            maps[index].enemies.splice(__index, 1);
          }
        }
      });
    });
  },
  reviveAllDeadEnemies: function () {
    fallenEnemies.forEach(deadFoe => {
      maps.forEach((mp: any, index: number) => {
        if (deadFoe.spawnMap == index) {
          let foe = new Enemy({ ...enemies[deadFoe.id], cords: deadFoe.spawnCords, spawnCords: deadFoe.spawnCords, level: deadFoe.level });
          foe.restore();
          maps[index].enemies.push(new Enemy({ ...foe }));
        }
      });
    });
  },
  killAllQuestEnemies: function () {
    maps.forEach((mp: any, index: number) => {
      for (let i = mp.enemies.length - 1; i >= 0; i--) {
        if (mp.enemies[i].questSpawn?.quest > -1) mp.enemies.splice(i, 1);
      }
    });
  },
  resetAllLivingEnemiesInAllMaps: function () {
    maps.forEach((map: any) => {
      map.enemies.forEach((enemy: Enemy) => {
        enemy.restore();
      }
      );
    });
  }
} as helper;