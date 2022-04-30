"use strict";
//@ts-nocheck
/* Prevent actions from being fired too rapidly when holding key down */
let movementCooldown = false;
let actionCooldown = false;
/* For clarity movement and hotkeys are separated to two different functions */
document.addEventListener("keydown", key => {
    movementCheck(key);
    hotkeyCheck(key);
});
function hotkeyCheck(e) {
    if (actionCooldown)
        return;
    actionCooldown = true;
    setTimeout(() => actionCooldown = false, 20);
    if (e.key == "r" && !state.savesOpen) {
        if (player.isDead) {
            respawnPlayer();
            return;
        }
    }
    else if (e.key == "Escape") {
        handleEscape();
        return;
    }
    if (e.key == settings["hotkey_open_world_messages"]) {
        if (state.displayingTextHistory)
            state.displayingTextHistory = false;
        else
            state.displayingTextHistory = true;
        displayAllTextHistory();
        return;
    }
    if (e.key == settings["hotkey_ranged"]) {
        state.rangedMode = !state.rangedMode;
    }
    if (e.key == settings["hotkey_area_map"]) {
        state.areaMapOpen = !state.areaMapOpen;
        moveAreaMap();
    }
    if (player.isDead || state.savesOpen)
        return;
    const number = parseInt(e.keyCode) - 48;
    if (e.key == settings.hotkey_inv && !state.menuOpen) {
        if (!state.invOpen)
            renderInventory();
        else
            closeInventory();
    }
    else if (e.key == settings.hotkey_char && !state.menuOpen) {
        if (!state.charOpen)
            renderCharacter();
        else
            closeCharacter();
    }
    else if (e.key == settings.hotkey_perk && !state.menuOpen) {
        if (!state.perkOpen)
            openLevelingScreen();
        else
            closeLeveling();
    }
    else if (e.key == settings.hotkey_journal && !state.menuOpen) {
        if (!state.journalOpen)
            renderPlayerQuests();
        else
            closePlayerQuests();
    }
    else if (e.key == settings.hotkey_codex && !state.menuOpen) {
        if (!state.codexOpen)
            openIngameCodex();
        else
            closeCodex();
    }
    else if (state.invOpen || state.menuOpen)
        return;
    else if (number > -1 && e.shiftKey) {
        let abi = player.abilities.find(a => a.equippedSlot == number + 9);
        if (number == 0)
            abi = player.abilities.find(a => a.equippedSlot == 19);
        if (!abi) {
            let itm = player.inventory.find(a => a.equippedSlot == number + 9);
            if (number == 0)
                itm = player.inventory.find(a => a.equippedSlot == 19);
            if (itm)
                useConsumable(itm);
            return;
        }
        else if ((abi.onCooldown == 0 && player.stats.mp >= abi.mana_cost && (abi.health_cost_percentage > 0 ? player.hpRemain() >= abi.health_cost_percentage : true) && ((abi.requires_melee_weapon ? abi.requires_melee_weapon && !player.weapon.firesProjectile : true) && (abi.requires_ranged_weapon ? abi.requires_ranged_weapon && player.weapon.firesProjectile : true)) && !(abi.mana_cost > 0 ? player.silenced() : false) && (abi.requires_concentration ? player.concentration() : true)))
            useAbi(abi);
    }
    else if (number > -1 && !e.shiftKey) {
        let abi = player.abilities.find(a => a.equippedSlot == number - 1);
        if (number == 0)
            abi = player.abilities.find(a => a.equippedSlot == 9);
        if (!abi) {
            let itm = player.inventory.find(a => a.equippedSlot == number - 1);
            if (number == 0)
                itm = player.inventory.find(a => a.equippedSlot == 9);
            if (itm)
                useConsumable(itm);
            return;
        }
        if ((abi.onCooldown == 0 && player.stats.mp >= abi.mana_cost && (abi.health_cost_percentage > 0 ? player.hpRemain() >= abi.health_cost_percentage : true) && ((abi.requires_melee_weapon ? abi.requires_melee_weapon && !player.weapon.firesProjectile : true) && (abi.requires_ranged_weapon ? abi.requires_ranged_weapon && player.weapon.firesProjectile : true)) && !(abi.mana_cost > 0 ? player.silenced() : false) && (abi.requires_concentration ? player.concentration() : true)))
            useAbi(abi);
    }
}
function movementCheck(keyPress) {
    var _a, _b, _c;
    if (movementCooldown)
        return;
    movementCooldown = true;
    setTimeout(() => movementCooldown = false, 20);
    const rooted = player.isRooted();
    if (!turnOver || state.dialogWindow || state.storeOpen)
        return;
    let dirs = { [settings.hotkey_move_up]: "up", [settings.hotkey_move_down]: "down", [settings.hotkey_move_left]: "left", [settings.hotkey_move_right]: "right", [settings.hotkey_move_right_up]: "rightUp", [settings.hotkey_move_right_down]: "rightDown", [settings.hotkey_move_left_up]: "leftUp", [settings.hotkey_move_left_down]: "leftDown" };
    let target = maps[currentMap].enemies.find((e) => e.cords.x == cordsFromDir(player.cords, dirs[keyPress.key]).x && e.cords.y == cordsFromDir(player.cords, dirs[keyPress.key]).y);
    if (rooted && !player.isDead && dirs[keyPress.key] && !target) {
        advanceTurn();
        state.abiSelected = {};
        return;
    }
    if ((((_a = state.abiSelected) === null || _a === void 0 ? void 0 : _a.id) || (+player.weapon.range > 2 && state.rangedMode)) && keyPress.key === settings.hotkey_interact) {
        useAbiTargetingWithKeyboard();
    }
    if (dirs[keyPress.key] && (((_b = state.abiSelected) === null || _b === void 0 ? void 0 : _b.id) || (+player.weapon.range > 2 && state.rangedMode))) {
        if (mapSelection.x !== null && mapSelection.y !== null) {
            const cords = cordsFromDir({ x: mapSelection.x, y: mapSelection.y }, dirs[keyPress.key]);
            mapSelection.x = cords.x;
            mapSelection.y = cords.y;
            renderTileHover({ x: mapSelection.x, y: mapSelection.y });
        }
        else {
            const cords = cordsFromDir(player.cords, dirs[keyPress.key]);
            mapSelection.x = cords.x;
            mapSelection.y = cords.y;
            renderTileHover({ x: mapSelection.x, y: mapSelection.y });
        }
        return;
    }
    if (!turnOver || player.isDead || state.menuOpen || state.invOpen || state.savesOpen || state.optionsOpen || state.charOpen || state.perkOpen || state.titleScreen)
        return;
    let shittyFix = JSON.parse(JSON.stringify(player));
    if (parseInt(player.carryingWeight()) > parseInt(player.maxCarryWeight()) && dirs[keyPress.key]) {
        displayText(`<c>white<c>[WORLD] <c>orange<c>${lang["too_much_weight"]}`);
        return;
    }
    if (dirs[keyPress.key]) {
        if (canMove(shittyFix, dirs[keyPress.key]) && !rooted) {
            if (player.speed.movementFill <= -100) {
                player.speed.movementFill += 100;
                advanceTurn();
                return;
            }
            player.cords = cordsFromDir(player.cords, dirs[keyPress.key]);
            moveMinimap();
            moveAreaMap();
            // @ts-ignore
            renderMap(maps[currentMap], true);
            let extraMove = false;
            if (player.speed.movementFill >= 100) {
                player.speed.movementFill -= 100;
                extraMove = true;
            }
            else
                player.speed.movementFill += (player.getSpeed().movement - 100);
            if (!extraMove)
                advanceTurn();
        }
        else if (target) {
            if (weaponReach(player, player.weapon.range, target)) {
                player.doNormalAttack(target);
            }
        }
        else {
            advanceTurn();
            state.abiSelected = {};
        }
    }
    else if (keyPress.key == settings.hotkey_interact) {
        activateShrine();
        pickLoot();
        readMessage();
        restoreGrave();
        maps[currentMap].treasureChests.forEach((chest) => {
            const lootedChest = lootedChests.find(trs => trs.cords.x == chest.cords.x && trs.cords.y == chest.cords.y && trs.map == chest.map);
            if (chest.cords.x == player.cords.x && chest.cords.y == player.cords.y && !lootedChest)
                chest.lootChest();
        });
        (_c = maps[currentMap].entrances) === null || _c === void 0 ? void 0 : _c.some((entrance) => {
            if (entrance.cords.x == player.cords.x && entrance.cords.y == player.cords.y) {
                loadingScreen.style.display = "flex";
                loadingText.textContent = "Loading map...";
                setTimeout(() => changeMap(entrance), 0);
                return;
            }
        });
        if (!state.textWindowOpen && !state.invOpen) {
            talkToCharacter();
        }
    }
}
function useAbiTargetingWithKeyboard() {
    var _a, _b;
    let targetingEnemy = false;
    for (let enemy of maps[currentMap].enemies) {
        if (enemy.cords.x == mapSelection.x && enemy.cords.y == mapSelection.y) {
            if (!enemy.alive)
                break;
            targetingEnemy = true;
            if (state.isSelected) {
                // @ts-ignore
                if (generateArrowPath(player.cords, enemy.cords).length <= state.abiSelected.use_range || weaponReach(player, state.abiSelected.use_range, enemy)) {
                    if ((state.abiSelected.requires_melee_weapon && player.weapon.firesProjectile) || (state.abiSelected.requires_ranged_weapon && !player.weapon.firesProjectile))
                        break;
                    if (state.abiSelected.type == "attack") {
                        if (state.abiSelected.shoots_projectile)
                            fireProjectile(player.cords, enemy.cords, state.abiSelected.shoots_projectile, state.abiSelected, true, player);
                        else
                            regularAttack(player, enemy, state.abiSelected);
                        // @ts-expect-error
                        if (weaponReach(player, state.abiSelected.use_range, enemy))
                            attackTarget(player, enemy, weaponReach(player, state.abiSelected.use_range, enemy));
                        if (!state.abiSelected.shoots_projectile)
                            advanceTurn();
                    }
                }
                if (state.abiSelected.type == "charge" && generatePath(player.cords, enemy.cords, false).length <= state.abiSelected.use_range && !player.isRooted()) {
                    player.stats.mp -= state.abiSelected.mana_cost;
                    state.abiSelected.onCooldown = state.abiSelected.cooldown;
                    movePlayer(enemy.cords, true, 99, () => regularAttack(player, enemy, state.abiSelected));
                }
            }
            else if (weaponReach(player, player.weapon.range, enemy)) {
                if (weaponReach(player, player.weapon.range, enemy)) {
                    player.doNormalAttack(enemy);
                }
            }
            break;
        }
    }
    ;
    if (state.isSelected && ((_a = state.abiSelected) === null || _a === void 0 ? void 0 : _a.aoe_size) > 0 && !targetingEnemy) {
        // @ts-expect-error
        if (generateArrowPath(player.cords, { x: mapSelection.x, y: mapSelection.y }).length <= state.abiSelected.use_range) {
            fireProjectile(player.cords, { x: mapSelection.x, y: mapSelection.y }, state.abiSelected.shoots_projectile, state.abiSelected, true, player);
        }
    }
    if (state.isSelected && state.abiSelected.summon_unit) {
        if (generatePath(player.cords, { x: mapSelection.x, y: mapSelection.y }, player.canFly, true) <= state.abiSelected.use_range) {
            summonUnit(state.abiSelected, { x: mapSelection.x, y: mapSelection.y });
            advanceTurn();
        }
    }
    state.clicked = true;
    setTimeout(() => { state.clicked = false; }, 30);
    if (state.abiSelected.type == "movement" && !player.isRooted()) {
        player.stats.mp -= state.abiSelected.mana_cost;
        state.abiSelected.onCooldown = state.abiSelected.cooldown;
        if (((_b = state.abiSelected.statusesUser) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            state.abiSelected.statusesUser.forEach((status) => {
                if (!player.statusEffects.find((eff) => eff.id == status)) {
                    // @ts-ignore
                    player.statusEffects.push(new statEffect(Object.assign({}, statusEffects[status]), state.abiSelected.statusModifiers));
                }
                else {
                    player.statusEffects.find((eff) => eff.id == status).last.current += statusEffects[status].last.total;
                }
                // @ts-ignore
                statusEffects[status].last.current = statusEffects[status].last.total;
                spawnFloatingText(player.cords, state.abiSelected.line, "crimson", 36);
                let string = "";
                string = lang[state.abiSelected.id + "_action_desc_pl"];
                displayText(`<c>cyan<c>[ACTION] <c>white<c>${string}`);
            });
        }
        movePlayer({ x: mapSelection.x, y: mapSelection.y }, true, state.abiSelected.use_range);
    }
    state.abiSelected = {};
}
function canMove(char, dir) {
    var _a, _b, _c;
    var tile = cordsFromDir(char.cords, dir);
    var check = char.cords;
    var movable = true;
    const map = maps[currentMap];
    let fieldMap;
    if (char.canFly)
        fieldMap = JSON.parse(JSON.stringify(staticMap_flying));
    else
        fieldMap = JSON.parse(JSON.stringify(staticMap_normal));
    map.enemies.forEach((enemy) => { if (!(char.cords.x == enemy.cords.x && char.cords.y == enemy.cords.y)) {
        {
            fieldMap[enemy.cords.y][enemy.cords.x] = 1;
        }
        ;
    } });
    NPCcharacters.forEach((npc) => {
        if (npc.currentMap == currentMap) {
            fieldMap[npc.currentCords.y][npc.currentCords.x] = 1;
        }
    });
    if (((_a = fieldMap === null || fieldMap === void 0 ? void 0 : fieldMap[tile.y]) === null || _a === void 0 ? void 0 : _a[tile.x]) === 1)
        movable = false;
    if (checkDirs[dir]) {
        if (((_b = fieldMap === null || fieldMap === void 0 ? void 0 : fieldMap[check.y + checkDirs[dir].y1]) === null || _b === void 0 ? void 0 : _b[check.x + checkDirs[dir].x1]) === 1 && ((_c = fieldMap === null || fieldMap === void 0 ? void 0 : fieldMap[check.y + checkDirs[dir].y2]) === null || _c === void 0 ? void 0 : _c[check.x + checkDirs[dir].x2]) === 1)
            movable = false;
    }
    if (tile.y < 0 || tile.y >= map.base.length || tile.x < 0 || tile.x >= map.base[0].length)
        movable = false;
    return movable;
}
function canMoveTo(char, tile) {
    var movable = true;
    if (tiles[maps[currentMap].base[tile.y][tile.x]].isWall || (tiles[maps[currentMap].base[tile.y][tile.x]].isLedge && !char.canFly))
        movable = false;
    if (clutters[maps[currentMap].clutter[tile.y][tile.x]].isWall)
        movable = false;
    for (let enemy of maps[currentMap].enemies) {
        if (enemy.cords.x == tile.x && enemy.cords.y == tile.y)
            movable = false;
    }
    if (char.id !== "player") {
        for (let summon of combatSummons) {
            if (summon.cords.x == tile.x && summon.cords.y == tile.y)
                movable = false;
        }
    }
    for (let npc of NPCcharacters) {
        if (npc.currentMap == currentMap) {
            if (npc.currentCords.x == tile.x && npc.currentCords.y == tile.y)
                movable = false;
        }
    }
    if (player.cords.x == tile.x && player.cords.y == tile.y)
        movable = false;
    return movable;
}
//# sourceMappingURL=controls.js.map