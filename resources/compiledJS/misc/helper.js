"use strict";
/* Helper object contains multiple misc functions used throughout the code */
/* Helper should be expanded whenever the same function must be repeated in multiple files */
let helper = {
    weightedRandom: function (Array) {
        var _a;
        let table = [...Array];
        let max = 0;
        for (let i = 0; i < table.length; i++) {
            if (((_a = table[i]) === null || _a === void 0 ? void 0 : _a.type) == "gold")
                continue;
            table[i].dynamicChance = 0;
            if (table[i - 1])
                table[i].dynamicChance = table[i - 1].dynamicChance;
            else
                table[i].dynamicChance = 0;
            table[i].dynamicChance += table[i].chance;
            max = table[i].dynamicChance;
        }
        let value = Math.floor(helper.random(max, 0));
        let result;
        for (let item of table) {
            if (item.dynamicChance >= value) {
                result = item;
                break;
            }
        }
        return result;
    },
    random: function (max, min = -100) {
        return (Math.random() * (max - min) + min);
    },
    roundFloat: function (value, decimals = 2) {
        let rounded = Math.pow(10, decimals);
        return +(Math.round(value * rounded) / rounded).toFixed(decimals);
    },
    sleep: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    trimPlayerObjectForSaveFile: function (playerObject) {
        const trimmed = Object.assign({}, playerObject);
        trimmed.inventory.forEach((itm, index) => {
            if (itm.stackable || itm.type === "consumable")
                trimmed.inventory[index] = { id: itm.id, type: itm.type, amount: itm.amount, usesRemaining: itm.usesRemaining, equippedSlot: itm.equippedSlot };
            else if (itm.level)
                trimmed.inventory[index] = { id: itm.id, type: itm.type, level: itm.level, rolledStats: itm.rolledStats };
            else
                trimmed.inventory[index] = { id: itm.id, type: itm.type, rolledStats: itm.rolledStats };
        });
        trimmed.abilities.forEach((abi, index) => {
            // @ts-ignore
            trimmed.abilities[index] = { id: abi.id, equippedSlot: abi.equippedSlot, onCooldown: abi.onCooldown };
        });
        trimmed.allModifiers = {};
        equipSlots.forEach((slot) => {
            var _a;
            if ((_a = trimmed[slot]) === null || _a === void 0 ? void 0 : _a.id) {
                trimmed[slot] = { id: trimmed[slot].id, type: trimmed[slot].type, level: trimmed[slot].level, rolledStats: trimmed[slot].rolledStats };
            }
        });
        trimmed.perks.forEach((perk, index) => {
            trimmed.perks[index] = { id: perk.id, tree: perk.tree, commandsExecuted: perk.commandsExecuted };
        });
        return Object.assign({}, trimmed);
    },
    purgeDeadEnemies: function () {
        fallenEnemies.forEach(deadFoe => {
            const map = maps[deadFoe.spawnMap];
            let purgeList = [];
            map.enemies.forEach((en, index) => {
                if (en.spawnCords.x == deadFoe.spawnCords.x && en.spawnCords.y == deadFoe.spawnCords.y) {
                    purgeList.push(index);
                }
            });
            for (let index of purgeList) {
                map.enemies.splice(index, 1);
            }
        });
    },
    reviveAllDeadEnemies: function () {
        fallenEnemies.forEach(deadFoe => {
            const map = maps[deadFoe.spawnMap];
            const foe = new Enemy(Object.assign(Object.assign({}, enemies[deadFoe.id]), { cords: deadFoe.spawnCords, spawnCords: deadFoe.spawnCords, level: deadFoe.level }));
            foe.restore();
            map.enemies.push(foe);
        });
    },
    killAllQuestEnemies: function () {
        maps.forEach((mp, index) => {
            var _a;
            for (let i = mp.enemies.length - 1; i >= 0; i--) {
                if (((_a = mp.enemies[i].questSpawn) === null || _a === void 0 ? void 0 : _a.quest) > -1)
                    mp.enemies.splice(i, 1);
            }
        });
    },
    resetAllLivingEnemiesInAllMaps: function () {
        maps.forEach((map) => {
            map.enemies.forEach((enemy) => {
                enemy.restore();
            });
        });
    }
};
//# sourceMappingURL=helper.js.map