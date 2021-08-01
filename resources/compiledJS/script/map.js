"use strict";
var _a;
const baseCanvas = document.querySelector(".canvasLayers .baseSheet");
const baseCtx = baseCanvas.getContext("2d");
const mapDataCanvas = document.querySelector(".canvasLayers .mapData");
const mapDataCtx = mapDataCanvas.getContext("2d");
const playerCanvas = document.querySelector(".canvasLayers .playerSheet");
const playerCtx = playerCanvas.getContext("2d");
const enemyLayers = document.querySelector(".canvasLayers .enemyLayers");
const projectileLayers = document.querySelector(".canvasLayers .projectileLayers");
const staticHover = document.querySelector(".mapHover");
baseCanvas.addEventListener("mousemove", mapHover);
baseCanvas.addEventListener("mouseup", clickMap);
var currentMap = 0;
var turnOver = true;
var enemiesHadTurn = 0;
let dontMove = false;
const zoomLevels = [0.55, 0.66, 0.75, 1, 1.25, 1.5, 1.65, 1.8];
var currentZoom = 1;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/* Move this to a state file later */
const state = {
    inCombat: false,
    clicked: false
};
/* temporarily store highlight variables here */
const highlight = {
    x: 0,
    y: 0
};
baseCanvas.addEventListener("wheel", changeZoomLevel);
// @ts-expect-error
function changeZoomLevel({ deltaY }) {
    if (deltaY > 0) {
        currentZoom = zoomLevels[zoomLevels.indexOf(currentZoom) - 1] || zoomLevels[0];
    }
    else {
        currentZoom = zoomLevels[zoomLevels.indexOf(currentZoom) + 1] || zoomLevels[zoomLevels.length - 1];
    }
    modifyCanvas();
}
window.addEventListener("resize", modifyCanvas);
(_a = document.querySelector(".main")) === null || _a === void 0 ? void 0 : _a.addEventListener('contextmenu', event => event.preventDefault());
function spriteVariables() {
    const spriteSize = 128 * currentZoom;
    var spriteLimitX = Math.ceil(baseCanvas.width / spriteSize);
    var spriteLimitY = Math.ceil(baseCanvas.height / spriteSize);
    if (spriteLimitX % 2 == 0)
        spriteLimitX++;
    if (spriteLimitY % 2 == 0)
        spriteLimitY++;
    const mapOffsetX = (spriteLimitX * spriteSize - baseCanvas.width) / 2;
    const mapOffsetY = (spriteLimitY * spriteSize - baseCanvas.height) / 2;
    const mapOffsetStartX = player.cords.x - Math.floor(spriteLimitX / 2);
    const mapOffsetStartY = player.cords.y - Math.floor(spriteLimitY / 2);
    return { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY };
}
function renderMap(map) {
    var _a, _b, _c, _d, _e;
    baseCanvas.width = baseCanvas.width; // Clears the canvas
    if (!baseCtx)
        throw new Error("2D context from base canvas is missing!");
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    let sightMap = createSightMap(player.cords, player.sight());
    /* Render the base layer */
    for (let y = 0; y < spriteLimitY; y++) {
        for (let x = 0; x < spriteLimitX; x++) {
            const imgId = (_b = (_a = map.base) === null || _a === void 0 ? void 0 : _a[mapOffsetStartY + y]) === null || _b === void 0 ? void 0 : _b[mapOffsetStartX + x];
            const img = document.querySelector(`.sprites .tile${imgId !== undefined ? imgId : "VOID"}`);
            const grave = document.querySelector(`.sprites .deadModel`);
            const clutterId = (_d = (_c = map.clutter) === null || _c === void 0 ? void 0 : _c[mapOffsetStartY + y]) === null || _d === void 0 ? void 0 : _d[mapOffsetStartX + x];
            const fog = document.querySelector(".tileNoVision");
            if (img) {
                baseCtx.drawImage(img, x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, spriteSize, spriteSize);
                //baseCtx.strokeRect(x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, spriteSize, spriteSize);
            }
            if (player.grave) {
                if (player.grave.cords.x == x + mapOffsetStartX && player.grave.cords.y == y + mapOffsetStartY) {
                    baseCtx.drawImage(grave, x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, spriteSize, spriteSize);
                }
            }
            // @ts-expect-error
            if (clutterId > 0) {
                const clutterImg = document.querySelector(`.sprites .clutter${clutterId}`);
                if (clutterImg) {
                    baseCtx.drawImage(clutterImg, x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, spriteSize, spriteSize);
                }
            }
            if (((_e = sightMap[mapOffsetStartY + y]) === null || _e === void 0 ? void 0 : _e[mapOffsetStartX + x]) != "x" && imgId) {
                baseCtx.drawImage(fog, x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, spriteSize, spriteSize);
            }
        }
    }
    map.shrines.forEach((checkpoint) => {
        var _a, _b, _c;
        if ((((_a = sightMap[checkpoint.cords.y]) === null || _a === void 0 ? void 0 : _a[checkpoint.cords.x]) == "x")) {
            const shrine = document.querySelector(".shrineTile");
            const shrineLit = document.querySelector(".shrineLitTile");
            var tileX = (checkpoint.cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
            var tileY = (checkpoint.cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
            if (((_b = player === null || player === void 0 ? void 0 : player.respawnPoint) === null || _b === void 0 ? void 0 : _b.cords.x) == checkpoint.cords.x && ((_c = player === null || player === void 0 ? void 0 : player.respawnPoint) === null || _c === void 0 ? void 0 : _c.cords.y) == checkpoint.cords.y)
                baseCtx === null || baseCtx === void 0 ? void 0 : baseCtx.drawImage(shrineLit, tileX, tileY, spriteSize, spriteSize);
            else
                baseCtx === null || baseCtx === void 0 ? void 0 : baseCtx.drawImage(shrine, tileX, tileY, spriteSize, spriteSize);
        }
    });
    /* Render Enemies */
    enemyLayers.textContent = ""; // Delete enemy canvases
    map.enemies.forEach((enemy, index) => {
        var _a;
        if (!enemy.alive)
            return;
        var tileX = (enemy.cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
        var tileY = (enemy.cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
        const canvas = document.createElement("canvas");
        // @ts-ignore
        canvas.classList = `enemy${index} layer`;
        const ctx = canvas.getContext("2d");
        const enemyImg = document.querySelector(`.${enemy.sprite}`);
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        if (enemyImg && (((_a = sightMap[enemy.cords.y]) === null || _a === void 0 ? void 0 : _a[enemy.cords.x]) == "x")) {
            /* Render hp bar */
            const hpbg = document.querySelector(".hpBg");
            const hpbar = document.querySelector(".hpBar");
            const hpborder = document.querySelector(".hpBorder");
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hpbg, tileX, tileY - 12, spriteSize, spriteSize);
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hpbar, tileX, tileY - 12, enemy.statRemaining("hp") * spriteSize / 100, spriteSize);
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hpborder, tileX, tileY - 12, spriteSize, spriteSize);
            /* Render enemy on top of hp bar */
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(enemyImg, tileX, tileY, spriteSize, spriteSize);
            let statCount = 0;
            enemy.statusEffects.forEach((effect) => {
                if (statCount > 4)
                    return;
                const img = new Image(32, 32);
                img.src = effect.icon;
                img.addEventListener("load", e => {
                    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(img, tileX + spriteSize - 32, tileY + (32 * statCount), 32, 32);
                    statCount++;
                });
            });
        }
        enemyLayers.append(canvas);
    });
    /* Render Items */
    mapDataCanvas.width = mapDataCanvas.width;
    itemData.forEach((item) => {
        if (item.map != currentMap)
            return;
        var tileX = (item.cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
        var tileY = (item.cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
        const itemImg = new Image();
        itemImg.src = item.itm.img;
        itemImg.onload = function () {
            var _a;
            if (((_a = sightMap[item.cords.y]) === null || _a === void 0 ? void 0 : _a[item.cords.x]) == "x") {
                mapDataCtx === null || mapDataCtx === void 0 ? void 0 : mapDataCtx.drawImage(itemImg, (tileX + spriteSize * item.mapCords.xMod), (tileY + spriteSize * item.mapCords.yMod), spriteSize / 3, spriteSize / 3);
            }
        };
    });
    /* Render Player */
    renderPlayerModel(spriteSize, playerCanvas, playerCtx);
}
function renderTileHover(tile, event) {
    var _a, _b;
    if (!baseCtx)
        throw new Error("2D context from base canvas is missing!");
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    var tileX = (tile.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    var tileY = (tile.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
    playerCanvas.width = playerCanvas.width;
    if (dontMove) {
        renderPlayerModel(spriteSize, playerCanvas, playerCtx);
        return;
    }
    try {
        /* Render tile */
        var strokeImg = document.querySelector(".sprites .hoverTile");
        renderPlayerModel(spriteSize, playerCanvas, playerCtx);
        var hoveredEnemy = false;
        maps[currentMap].enemies.forEach((enemy) => {
            if (enemy.cords.x == tile.x && enemy.cords.y == tile.y) {
                hoverEnemyShow(enemy);
                hoveredEnemy = true;
            }
        });
        if (!hoveredEnemy) {
            hideMapHover();
        }
        if (abiSelected.type == "movement" || abiSelected.type == "charge") {
            const path = generatePath({ x: player.cords.x, y: player.cords.y }, tile, false, false);
            var highlight2Img = document.querySelector(".sprites .tileHIGHLIGHT2");
            var highlight2RedImg = document.querySelector(".sprites .tileHIGHLIGHT2_RED");
            let distance = isSelected ? abiSelected.use_range : player.weapon.range;
            let iteration = 0;
            path.forEach((step) => {
                iteration++;
                if (step.x == player.cords.x && step.y == player.cords.y)
                    return;
                var _tileX = (step.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
                var _tileY = (step.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
                if (iteration > distance) {
                    playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(highlight2RedImg, _tileX, _tileY, spriteSize, spriteSize);
                }
                else
                    playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(highlight2Img, _tileX, _tileY, spriteSize, spriteSize);
            });
        }
        /* Render highlight test */
        else if ((((abiSelected === null || abiSelected === void 0 ? void 0 : abiSelected.shoots_projectile) && isSelected) || (((_a = player.weapon) === null || _a === void 0 ? void 0 : _a.firesProjectile) && !isSelected)) && event.buttons !== 1) {
            const path = generateArrowPath({ x: player.cords.x, y: player.cords.y }, tile);
            var highlightImg = document.querySelector(".sprites .tileHIGHLIGHT");
            var highlightRedImg = document.querySelector(".sprites .tileHIGHLIGHT_RED");
            let distance = isSelected ? abiSelected.use_range : player.weapon.range;
            let iteration = 0;
            let lastStep = 0;
            path.forEach((step) => {
                iteration++;
                if (step.x == player.cords.x && step.y == player.cords.y)
                    return;
                var _tileX = (step.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
                var _tileY = (step.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
                if (step.blocked || iteration > distance) {
                    if (lastStep == 0)
                        lastStep = iteration;
                    playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(highlightRedImg, _tileX, _tileY, spriteSize, spriteSize);
                }
                else
                    playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(highlightImg, _tileX, _tileY, spriteSize, spriteSize);
            });
            if ((abiSelected === null || abiSelected === void 0 ? void 0 : abiSelected.aoe_size) > 0) {
                let aoeMap = createAOEMap(lastStep > 0 ? path[lastStep - 1] : path[path.length - 1], abiSelected.aoe_size);
                for (let y = 0; y < spriteLimitY; y++) {
                    for (let x = 0; x < spriteLimitX; x++) {
                        if (((_b = aoeMap[mapOffsetStartY + y]) === null || _b === void 0 ? void 0 : _b[mapOffsetStartX + x]) == "x") {
                            playerCtx.drawImage(highlightRedImg, x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, spriteSize, spriteSize);
                        }
                    }
                }
            }
        }
        if (event.buttons == 1 && !isSelected) {
            const path = generatePath({ x: player.cords.x, y: player.cords.y }, tile, player.canFly);
            var highlightImg = document.querySelector(".sprites .tileHIGHLIGHT");
            var highlightRedImg = document.querySelector(".sprites .tileHIGHLIGHT_RED");
            path.forEach((step) => {
                if (step.x == player.cords.x && step.y == player.cords.y)
                    return;
                var _tileX = (step.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
                var _tileY = (step.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
                if (step.blocked) {
                    playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(highlightRedImg, _tileX, _tileY, spriteSize, spriteSize);
                }
                else
                    playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(highlightImg, _tileX, _tileY, spriteSize, spriteSize);
            });
        }
        playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(strokeImg, tileX, tileY, spriteSize, spriteSize);
    }
    catch (_c) { }
}
function mapHover(event) {
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    const lX = Math.floor(((event.offsetX - baseCanvas.width / 2) + spriteSize / 2) / spriteSize);
    const lY = Math.floor(((event.offsetY - baseCanvas.height / 2) + spriteSize / 2) / spriteSize);
    const x = lX + player.cords.x;
    const y = lY + player.cords.y;
    if (x < 0 || x > maps[currentMap].base[0].length - 1 || y < 0 || y > maps[currentMap].base.length - 1)
        return;
    renderTileHover({ x: x, y: y }, event);
}
function clickMap(event) {
    var _a, _b;
    if (state.clicked || player.isDead)
        return;
    if (invOpen || (event.button != 0 && event.button != 2)) {
        closeInventory();
        return;
    }
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    const lX = Math.floor(((event.offsetX - baseCanvas.width / 2) + spriteSize / 2) / spriteSize);
    const lY = Math.floor(((event.offsetY - baseCanvas.height / 2) + spriteSize / 2) / spriteSize);
    const x = lX + player.cords.x;
    const y = lY + player.cords.y;
    if (event.button == 2) {
        isSelected = false;
        abiSelected = {};
        updateUI();
        renderTileHover({ x: x, y: y }, event);
        dontMove = true;
        return;
    }
    if (dontMove) {
        dontMove = false;
        return;
    }
    let move = true;
    let targetingEnemy = false;
    for (let enemy of maps[currentMap].enemies) {
        if (enemy.cords.x == x && enemy.cords.y == y) {
            if (!enemy.alive)
                break;
            targetingEnemy = true;
            if (isSelected) {
                // @ts-expect-error
                if (generateArrowPath(player.cords, enemy.cords).length <= abiSelected.use_range || weaponReach(player, abiSelected.use_range, enemy)) {
                    if ((abiSelected.requires_melee_weapon && player.weapon.firesProjectile) || (abiSelected.requires_ranged_weapon && !player.weapon.firesProjectile))
                        break;
                    if (abiSelected.type == "attack") {
                        if (abiSelected.shoots_projectile)
                            fireProjectile(player.cords, enemy.cords, abiSelected.shoots_projectile, abiSelected, true, player);
                        else
                            regularAttack(player, enemy, abiSelected);
                        // @ts-expect-error
                        if (weaponReach(player, abiSelected.use_range, enemy))
                            attackTarget(player, enemy, weaponReach(player, abiSelected.use_range, enemy));
                        player.effects();
                        if (!abiSelected.shoots_projectile)
                            advanceTurn();
                    }
                }
                if (abiSelected.type == "charge" && generatePath(player.cords, enemy.cords, false, true) <= abiSelected.use_range) {
                    player.stats.mp -= abiSelected.mana_cost;
                    abiSelected.onCooldown = abiSelected.cooldown;
                    movePlayer(enemy.cords, true, 99, () => regularAttack(player, enemy, abiSelected));
                }
            }
            else if (weaponReach(player, player.weapon.range, enemy)) {
                // @ts-expect-error
                attackTarget(player, enemy, weaponReach(player, player.weapon.range, enemy));
                if (weaponReach(player, player.weapon.range, enemy)) {
                    regularAttack(player, enemy, (_a = player.abilities) === null || _a === void 0 ? void 0 : _a.find(e => e.id == "attack"));
                    player.effects();
                    advanceTurn();
                }
                // @ts-ignore
            }
            else if (player.weapon.range >= generateArrowPath(player.cords, enemy.cords).length && player.weapon.firesProjectile) {
                // @ts-ignore
                fireProjectile(player.cords, enemy.cords, player.weapon.firesProjectile, (_b = player.abilities) === null || _b === void 0 ? void 0 : _b.find(e => e.id == "attack"), true);
                player.effects();
            }
            move = false;
            break;
        }
    }
    ;
    if (isSelected && (abiSelected === null || abiSelected === void 0 ? void 0 : abiSelected.aoe_size) > 0 && !targetingEnemy) {
        // @ts-expect-error
        if (generateArrowPath(player.cords, { x: x, y: y }).length <= abiSelected.use_range) {
            move = false;
            fireProjectile(player.cords, { x: x, y: y }, abiSelected.shoots_projectile, abiSelected, true, player);
        }
    }
    state.clicked = true;
    setTimeout(() => { state.clicked = false; }, 30);
    if (abiSelected.type == "movement") {
        player.stats.mp -= abiSelected.mana_cost;
        abiSelected.onCooldown = abiSelected.cooldown;
        movePlayer({ x: x, y: y }, true, abiSelected.use_range);
    }
    else if (move)
        movePlayer({ x: x, y: y });
}
const emptyMap = (base_tiles) => new Array(base_tiles.length).fill("0").map(e => new Array(base_tiles[0].length).fill("0"));
function createSightMap(start, size) {
    let sightMap = emptyMap(maps[currentMap].base);
    let testiIsonnus = size ** 2;
    return sightMap.map((rivi, y) => rivi.map((_, x) => {
        if (Math.abs(x - start.x) ** 2 + Math.abs(y - start.y) ** 2 < testiIsonnus)
            return "x";
        return "0";
    }));
}
function createAOEMap(start, size) {
    let aoeMap = emptyMap(maps[currentMap].base);
    let testiIsonnus = size ** 2;
    return aoeMap.map((rivi, y) => rivi.map((_, x) => {
        if (!tiles[maps[currentMap].base[y][x]].isLedge && !tiles[maps[currentMap].base[y][x]].isWall && !clutters[maps[currentMap].clutter[y][x]].isWall) {
            if (Math.abs(x - start.x) ** 2 + Math.abs(y - start.y) ** 2 < testiIsonnus)
                return "x";
        }
        return "0";
    }));
}
function cordsFromDir(cords, dir) {
    let cord = Object.assign({}, cords);
    if (dir == "up")
        cord.y--;
    else if (dir == "down")
        cord.y++;
    else if (dir == "left")
        cord.x--;
    else if (dir == "right")
        cord.x++;
    return cord;
}
document.addEventListener("keyup", (keyPress) => {
    var _a;
    if (!turnOver || player.isDead || menuOpen || invOpen || windowOpen || saveGamesOpen)
        return;
    let dirs = { [settings.hotkey_move_up]: "up", [settings.hotkey_move_down]: "down", [settings.hotkey_move_left]: "left", [settings.hotkey_move_right]: "right" };
    let shittyFix = JSON.parse(JSON.stringify(player));
    if (keyPress.key == settings.hotkey_move_up && canMove(player, "up")) {
        player.cords.y--;
    }
    else if (keyPress.key == settings.hotkey_move_down && canMove(player, "down")) {
        player.cords.y++;
    }
    else if (keyPress.key == settings.hotkey_move_left && canMove(player, "left")) {
        player.cords.x--;
    }
    else if (keyPress.key == settings.hotkey_move_right && canMove(player, "right")) {
        player.cords.x++;
    }
    if (keyPress.key == settings.hotkey_move_up || keyPress.key == settings.hotkey_move_down || keyPress.key == settings.hotkey_move_left || keyPress.key == settings.hotkey_move_right) {
        if (canMove(shittyFix, dirs[keyPress.key])) {
            // @ts-ignore
            renderMap(maps[currentMap]);
            player.effects();
            advanceTurn();
            updateUI();
            if (Math.floor(player.hpRegen() * 0.5) > 0)
                player.stats.hp += Math.floor(player.hpRegen() * 0.5);
            if (Math.floor(player.hpRegen() * 0.5) > 0)
                displayText(`<c>white<c>[PASSIVE] <c>lime<c>Recovered ${Math.floor(player.hpRegen() * 0.5)} HP.`);
        }
        else {
            let target = maps[currentMap].enemies.find(e => e.cords.x == cordsFromDir(player.cords, dirs[keyPress.key]).x && e.cords.y == cordsFromDir(player.cords, dirs[keyPress.key]).y);
            if (target) {
                // @ts-expect-error
                attackTarget(player, target, weaponReach(player, player.weapon.range, target));
                if (weaponReach(player, player.weapon.range, target)) {
                    regularAttack(player, target, (_a = player.abilities) === null || _a === void 0 ? void 0 : _a.find(e => e.id == "attack"));
                    player.effects();
                    advanceTurn();
                }
            }
        }
    }
});
document.addEventListener("keyup", (kbe) => {
    if (kbe.key == settings.hotkey_interact) {
        activateShrine();
        pickLoot();
    }
});
let isMovingCurrently = false;
let breakMoving = false;
async function movePlayer(goal, ability = false, maxRange = 99, action = null) {
    if (goal.x < 0 || goal.x > maps[currentMap].base[0].length - 1 || goal.y < 0 || goal.y > maps[currentMap].base.length - 1)
        return;
    if (!turnOver || player.isDead)
        return;
    const path = generatePath(player.cords, goal, false);
    let count = 0;
    isSelected = false;
    if (isMovingCurrently)
        breakMoving = true;
    moving: for (let step of path) {
        if (canMoveTo(player, step)) {
            await sleep(30);
            isMovingCurrently = true;
            player.cords.x = step.x;
            player.cords.y = step.y;
            modifyCanvas();
            if (!ability) {
                player.effects();
                advanceTurn();
                updateUI();
            }
            count++;
            if (state.inCombat && !ability || count > maxRange && ability || breakMoving)
                break moving;
        }
    }
    breakMoving = false;
    isMovingCurrently = false;
    if (!ability) {
        if (count > 0)
            displayText(`<c>green<c>[MOVEMENT]<c>white<c> Ran for ${count} turn(s).`);
        if (state.inCombat && count == 1) {
            if (Math.floor(player.hpRegen() * 0.5) > 0)
                displayText(`<c>white<c>[PASSIVE] <c>lime<c>Recovered ${Math.floor(player.hpRegen() * 0.5)} HP.`);
        }
        else if (state.inCombat && count > 1) {
            let regen = Math.floor(player.hpRegen() * count - 1) + Math.floor(player.hpRegen() * 0.5);
            if (regen > 0)
                displayText(`<c>white<c>[PASSIVE] <c>lime<c>Recovered ${regen} HP.`);
            displayText(`<c>green<c>[MOVEMENT] <c>orange<c>Stopped moving due to encontering an enemy.`);
        }
        else if (count > 0) {
            if (Math.floor(player.hpRegen() * count) > 0)
                displayText(`<c>white<c>[PASSIVE] <c>lime<c>Recovered ${Math.floor(player.hpRegen() * count)} HP.`);
        }
    }
    else if (!action) {
        player.effects();
        advanceTurn();
        updateUI();
        abiSelected = {};
    }
    else if (action) {
        player.effects();
        action();
        advanceTurn();
        updateUI();
        abiSelected = {};
    }
}
async function moveEnemy(goal, enemy, ability = null, maxRange = 99) {
    // @ts-ignore
    const path = generatePath(enemy.cords, goal, false);
    let count = 0;
    moving: for (let step of path) {
        if (canMoveTo(enemy, step)) {
            await sleep(55);
            enemy.cords.x = step.x;
            enemy.cords.y = step.y;
            modifyCanvas();
            count++;
            if (count > maxRange)
                break moving;
        }
    }
    // @ts-expect-error
    attackTarget(enemy, player, weaponReach(enemy, 1, player));
    regularAttack(enemy, player, ability);
    updateEnemiesTurn();
}
function canMove(char, dir) {
    if (char.id == "player") {
        if (player.carryingWeight() > player.maxCarryWeight()) {
            displayText(`<c>white<c>[WORLD] <c>orange<c>${lang["too_much_weight"]}`);
            return false;
        }
    }
    try {
        var tile = { x: char.cords.x, y: char.cords.y };
        if (dir == "up")
            tile.y--;
        else if (dir == "down")
            tile.y++;
        else if (dir == "left")
            tile.x--;
        else if (dir == "right")
            tile.x++;
        var movable = true;
        if (tiles[maps[currentMap].base[tile.y][tile.x]].isWall || (tiles[maps[currentMap].base[tile.y][tile.x]].isLedge && !char.canFly))
            movable = false;
        if (clutters[maps[currentMap].clutter[tile.y][tile.x]].isWall)
            movable = false;
        for (let enemy of maps[currentMap].enemies) {
            if (enemy.cords.x == tile.x && enemy.cords.y == tile.y)
                movable = false;
        }
        return movable;
    }
    catch (_a) { }
}
function canMoveTo(char, tile) {
    var movable = true;
    if (char.id == "player") {
        if (char.carryingWeight() > char.maxCarryWeight()) {
            displayText(`<c>white<c>[WORLD] <c>orange<c>${lang["too_much_weight"]}`);
            return false;
        }
    }
    if (tiles[maps[currentMap].base[tile.y][tile.x]].isWall || (tiles[maps[currentMap].base[tile.y][tile.x]].isLedge && !char.canFly))
        movable = false;
    if (clutters[maps[currentMap].clutter[tile.y][tile.x]].isWall)
        movable = false;
    for (let enemy of maps[currentMap].enemies) {
        if (enemy.cords.x == tile.x && enemy.cords.y == tile.y)
            movable = false;
    }
    if (player.cords.x == tile.x && player.cords.y == tile.y)
        movable = false;
    return movable;
}
function renderPlayerOutOfMap(size, canvas, ctx, side = "center", playerModel = player) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    canvas.width = canvas.width; // Clear canvas
    const bodyModel = document.querySelector(".sprites ." + playerModel.race + "Model");
    const earModel = document.querySelector(".sprites ." + playerModel.race + "Ears");
    const hairModel = document.querySelector(".sprites .hair" + playerModel.hair);
    const eyeModel = document.querySelector(".sprites .eyes" + playerModel.eyes);
    const faceModel = document.querySelector(".sprites .face" + playerModel.face);
    const leggings = document.querySelector(".sprites .defaultPants");
    var x = 0;
    var y = 0;
    if (side == "left")
        x = 0 - size / 4;
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(bodyModel, x, y, size, size);
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(earModel, x, y, size, size);
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(eyeModel, x, y, size, size);
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(faceModel, x, y, size, size);
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(leggings, x, y, size, size);
    if (!((_a = playerModel.helmet) === null || _a === void 0 ? void 0 : _a.coversHair))
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hairModel, x, y, size, size);
    if ((_b = playerModel.helmet) === null || _b === void 0 ? void 0 : _b.sprite) {
        const helmetModel = document.querySelector(".sprites ." + playerModel.helmet.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(helmetModel, x, y, size, size);
    }
    if ((_c = playerModel.gloves) === null || _c === void 0 ? void 0 : _c.sprite) {
        const glovesModel = document.querySelector(".sprites ." + playerModel.gloves.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(glovesModel, x, y, size, size);
    }
    if ((_d = playerModel.boots) === null || _d === void 0 ? void 0 : _d.sprite) {
        const bootsModel = document.querySelector(".sprites ." + playerModel.boots.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(bootsModel, x, y, size, size);
    }
    if ((_e = playerModel.legs) === null || _e === void 0 ? void 0 : _e.sprite) {
        const leggingsModel = document.querySelector(".sprites ." + playerModel.legs.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(leggingsModel, x, y, size, size);
    }
    else if (!((_f = playerModel.legs) === null || _f === void 0 ? void 0 : _f.sprite)) {
        const leggings = document.querySelector(".sprites .defaultPants");
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(leggings, x, y, size, size);
    }
    if ((_g = playerModel.chest) === null || _g === void 0 ? void 0 : _g.sprite) {
        const chestModel = document.querySelector(".sprites ." + playerModel.chest.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(chestModel, x, y, size, size);
    }
    if ((_h = playerModel.weapon) === null || _h === void 0 ? void 0 : _h.sprite) {
        const weaponModel = document.querySelector(".sprites ." + playerModel.weapon.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(weaponModel, x, y, size, size);
    }
}
function renderPlayerPortrait() {
    const portrait = document.createElement("div");
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    portrait.classList.add("playerPortrait");
    renderPlayerOutOfMap(512, canvas, ctx, "left");
    portrait.append(canvas);
    return portrait;
}
function renderPlayerModel(size, canvas, ctx) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    canvas.width = canvas.width; // Clear canvas
    if (player.isDead)
        return;
    const bodyModel = document.querySelector(".sprites ." + player.race + "Model");
    const earModel = document.querySelector(".sprites ." + player.race + "Ears");
    const hairModel = document.querySelector(".sprites .hair" + player.hair);
    const eyeModel = document.querySelector(".sprites .eyes" + player.eyes);
    const faceModel = document.querySelector(".sprites .face" + player.face);
    player.statusEffects.forEach((eff) => {
        if (eff.aura) {
            const aura = document.querySelector(".sprites ." + eff.aura);
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(aura, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
        }
    });
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(bodyModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(earModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(eyeModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(faceModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    if (!((_a = player.helmet) === null || _a === void 0 ? void 0 : _a.coversHair))
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hairModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    if ((_b = player.helmet) === null || _b === void 0 ? void 0 : _b.sprite) {
        const helmetModel = document.querySelector(".sprites ." + player.helmet.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(helmetModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
    if ((_c = player.gloves) === null || _c === void 0 ? void 0 : _c.sprite) {
        const glovesModel = document.querySelector(".sprites ." + player.gloves.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(glovesModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
    if ((_d = player.boots) === null || _d === void 0 ? void 0 : _d.sprite) {
        const bootsModel = document.querySelector(".sprites ." + player.boots.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(bootsModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
    if ((_e = player.legs) === null || _e === void 0 ? void 0 : _e.sprite) {
        const leggingsModel = document.querySelector(".sprites ." + player.legs.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(leggingsModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
    else if (!((_f = player.legs) === null || _f === void 0 ? void 0 : _f.sprite)) {
        const leggings = document.querySelector(".sprites .defaultPants");
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(leggings, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
    if ((_g = player.chest) === null || _g === void 0 ? void 0 : _g.sprite) {
        const chestModel = document.querySelector(".sprites ." + player.chest.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(chestModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
    if ((_h = player.weapon) === null || _h === void 0 ? void 0 : _h.sprite) {
        const weaponModel = document.querySelector(".sprites ." + player.weapon.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(weaponModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
}
function generatePath(start, end, canFly, distanceOnly = false, retreatPath = 0) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    if (end.x < 0 || end.x > maps[currentMap].base[0].length - 1 || end.y < 0 || end.y > maps[currentMap].base.length - 1)
        return;
    var distance = Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
    var fieldMap = maps[currentMap].base.map((yv, y) => yv.map((xv, x) => {
        if (tiles[xv].isWall || (tiles[xv].isLedge && !canFly))
            return 1;
        return 0;
    }));
    maps[currentMap].clutter.forEach((yv, y) => yv.map((xv, x) => {
        if (clutters[xv].isWall)
            fieldMap[y][x] = 1;
    }));
    if (start.x !== player.cords.x && start.y !== player.cords.y)
        fieldMap[player.cords.y][player.cords.x] = 1;
    maps[currentMap].enemies.forEach(enemy => { if (!(start.x == enemy.cords.x && start.y == enemy.cords.y)) {
        {
            fieldMap[enemy.cords.y][enemy.cords.x] = 1;
        }
        ;
    } });
    if (distanceOnly) {
        let newDistance = distance;
        if ((Math.abs(start.x - end.x) == Math.abs(start.y - end.y)) && distance < 3)
            newDistance = Math.round(newDistance / 2);
        return newDistance;
    }
    fieldMap[end.y][end.x] = 5;
    main: for (let i = 5; i < 500; i++) {
        for (let y = 0; y < maps[currentMap].base.length; y++) {
            for (let x = 0; x < maps[currentMap].base[y].length; x++) {
                if (fieldMap[y][x] !== 0)
                    continue;
                if (((_a = fieldMap[y]) === null || _a === void 0 ? void 0 : _a[x + 1]) == i)
                    fieldMap[y][x] = i + 1;
                else if (((_b = fieldMap[y]) === null || _b === void 0 ? void 0 : _b[x - 1]) == i)
                    fieldMap[y][x] = i + 1;
                else if (((_c = fieldMap[y + 1]) === null || _c === void 0 ? void 0 : _c[x]) == i)
                    fieldMap[y][x] = i + 1;
                else if (((_d = fieldMap[y - 1]) === null || _d === void 0 ? void 0 : _d[x]) == i)
                    fieldMap[y][x] = i + 1;
                if (fieldMap[start.y][start.x] > 3)
                    break main;
            }
        }
    }
    const maxValueCords = { x: null, y: null, v: 0 };
    const maxNum = fieldMap[start.y][start.x];
    if (retreatPath > 0)
        fieldMap[start.y][start.x] = 0;
    if (retreatPath > 0) {
        const arr = [...new Array(retreatPath)].map(_ => []);
        arr[0].push({ x: start.x, y: start.y });
        for (let i = 0; i < arr.length; i++) {
            for (let i2 = maxNum - 1; i2 < maxNum + retreatPath; i2++) {
                for (const value of arr[i]) {
                    if (fieldMap[value.y][value.x] !== 0)
                        continue;
                    const left = (_f = (_e = fieldMap[value.y]) === null || _e === void 0 ? void 0 : _e[value.x - 1]) !== null && _f !== void 0 ? _f : null;
                    const right = (_h = (_g = fieldMap[value.y]) === null || _g === void 0 ? void 0 : _g[value.x + 1]) !== null && _h !== void 0 ? _h : null;
                    const top = (_k = (_j = fieldMap[value.y - 1]) === null || _j === void 0 ? void 0 : _j[value.x]) !== null && _k !== void 0 ? _k : null;
                    const bottom = (_m = (_l = fieldMap[value.y + 1]) === null || _l === void 0 ? void 0 : _l[value.x]) !== null && _m !== void 0 ? _m : null;
                    // if(i != 0) map[value.y][value.x] = min + 1;
                    if ([left, right, top, bottom].find(e => e == i2)) {
                        fieldMap[value.y][value.x] = i2 + 1;
                        if (left == 0)
                            (_o = arr[i + 1]) === null || _o === void 0 ? void 0 : _o.push({ y: value.y, x: value.x - 1 });
                        if (right == 0)
                            (_p = arr[i + 1]) === null || _p === void 0 ? void 0 : _p.push({ y: value.y, x: value.x + 1 });
                        if (top == 0)
                            (_q = arr[i + 1]) === null || _q === void 0 ? void 0 : _q.push({ y: value.y - 1, x: value.x });
                        if (bottom == 0)
                            (_r = arr[i + 1]) === null || _r === void 0 ? void 0 : _r.push({ y: value.y + 1, x: value.x });
                    }
                    if (i2 >= maxValueCords.v - 1) {
                        Object.assign(maxValueCords, { y: value.y, x: value.x, v: i2 + 1 });
                    }
                }
            }
        }
    }
    const data = {
        x: start.x,
        y: start.y
    };
    if (retreatPath > 0)
        Object.assign(data, Object.assign({}, maxValueCords));
    const cords = [];
    siksakki: for (let i = 0; i < 500; i++) {
        const v = fieldMap[data.y][data.x] - 1;
        if (i % 2 == 0) {
            if (((_s = fieldMap[data.y]) === null || _s === void 0 ? void 0 : _s[data.x - 1]) == v)
                data.x -= 1;
            if (((_t = fieldMap[data.y]) === null || _t === void 0 ? void 0 : _t[data.x + 1]) == v)
                data.x += 1;
        }
        else {
            if (((_u = fieldMap[data.y - 1]) === null || _u === void 0 ? void 0 : _u[data.x]) == v)
                data.y -= 1;
            if (((_v = fieldMap[data.y + 1]) === null || _v === void 0 ? void 0 : _v[data.x]) == v)
                data.y += 1;
        }
        if (fieldMap[data.y][data.x] == v)
            cords.push(Object.assign({}, data));
        if (data.y == end.y && data.x == end.x)
            break siksakki;
    }
    return cords;
}
function arrowHitsTarget(start, end) {
    let path = generateArrowPath(start, end);
    let hits = true;
    path.forEach((step) => {
        if (step.enemy) {
            hits = false;
            return;
        }
        if (step.blocked && !step.player) {
            hits = false;
            return;
        }
    });
    return hits;
}
function generateArrowPath(start, end, distanceOnly = false) {
    const distX = Math.abs(start.x - end.x) + 1;
    const distY = Math.abs(start.y - end.y) + 1;
    const ratioY = distY / distX;
    const ratioX = distX / distY;
    const negativeY = start.y - end.y > 0;
    const negativeX = start.x - end.x > 0;
    const ratioY2 = ratioY == Math.max(ratioY, ratioX) ? negativeY ? -1 : 1 : negativeY ? ratioY * -1 : ratioY;
    const ratioX2 = ratioX == Math.max(ratioY, ratioX) ? negativeX ? -1 : 1 : negativeX ? ratioX * -1 : ratioX;
    const arrow = {
        x: start.x,
        y: start.y,
        blocked: false,
        enemy: false,
        player: false
    };
    if (distanceOnly)
        return distX + distY;
    const finalPath = [Object.assign({}, arrow)];
    var rounderX = negativeX ? Math.ceil : Math.floor;
    var rounderY = negativeY ? Math.ceil : Math.floor;
    for (let i = 0; i < 500; i++) {
        arrow.x += ratioX2;
        arrow.y += ratioY2;
        var tile = { x: rounderX(arrow.x), y: rounderY(arrow.y) };
        if (tiles[maps[currentMap].base[tile.y][tile.x]].isWall || clutters[maps[currentMap].clutter[tile.y][tile.x]].isWall)
            arrow.blocked = true;
        maps[currentMap].enemies.forEach(enemy => {
            if (enemy.cords.x == start.x && enemy.cords.y == start.y)
                return;
            if (enemy.cords.x == tile.x && enemy.cords.y == tile.y) {
                arrow.enemy = true;
                arrow.blocked = true;
            }
            ;
        });
        if (player.cords.x == tile.x && player.cords.y == tile.y) {
            arrow.player = true;
            arrow.blocked = true;
        }
        finalPath.push(Object.assign({}, arrow));
        arrow.enemy = false;
        if (rounderX(arrow.x) == end.x && rounderY(arrow.y) == end.y)
            break;
    }
    return finalPath.map(e => {
        e.x = rounderX(e.x);
        e.y = rounderY(e.y);
        return e;
    });
}
function modifyCanvas() {
    const layers = Array.from(document.querySelectorAll("canvas.layer"));
    for (let canvas of layers) {
        // @ts-ignore
        canvas.width = innerWidth;
        // @ts-ignore
        canvas.height = innerHeight;
    }
    // @ts-ignore
    renderMap(maps[currentMap]);
}
/* Move to state file later */
async function advanceTurn() {
    if (player.isDead)
        return;
    player.updateAbilities();
    state.inCombat = false;
    turnOver = false;
    enemiesHadTurn = 0;
    var map = maps[currentMap];
    hideMapHover();
    map.enemies.forEach(enemy => {
        if (player.isDead)
            return;
        if (!enemy.alive) {
            updateEnemiesTurn();
            return;
        }
        ;
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
    if (map.enemies.length == 0)
        turnOver = true;
    if (state.inCombat) {
        // Combat regen = 50% of regen
        if (Math.floor(player.hpRegen() * 0.5) > 0 && player.stats.hp < player.getStats().hpMax) {
            player.stats.hp += Math.floor(player.hpRegen() * 0.5);
        }
    }
    else {
        if (player.hpRegen() > 0 && player.stats.hp < player.getStats().hpMax) {
            player.stats.hp += player.hpRegen();
        }
    }
    if (player.stats.hp > player.getStats().hpMax) {
        player.stats.hp = player.getStats().hpMax;
    }
}
/* Show enemy stats when hovering */
function hoverEnemyShow(enemy) {
    var _a;
    staticHover.textContent = "";
    staticHover.style.display = "block";
    const name = document.createElement("p");
    name.classList.add("enemyName");
    name.textContent = `Lvl ${enemy.level} ${(_a = lang[enemy.id + "_name"]) !== null && _a !== void 0 ? _a : enemy.id}`;
    var mainStatText = "";
    mainStatText += `<f>20px<f><i>${icons.health_icon}<i>${lang["health"]}: ${enemy.stats.hp}/${enemy.getStats().hpMax}\n`;
    mainStatText += `<f>20px<f><i>${icons.mana_icon}<i>${lang["mana"]}: ${enemy.stats.mp}/${enemy.getStats().mpMax}\n`;
    mainStatText += `<f>20px<f><i>${icons.str_icon}<i>${lang["str"]}: ${enemy.getStats().str}\n`;
    mainStatText += `<f>20px<f><i>${icons.dex_icon}<i>${lang["dex"]}: ${enemy.getStats().dex}\n`;
    mainStatText += `<f>20px<f><i>${icons.vit_icon}<i>${lang["vit"]}: ${enemy.getStats().vit}\n`;
    mainStatText += `<f>20px<f><i>${icons.int_icon}<i>${lang["int"]}: ${enemy.getStats().int}\n`;
    mainStatText += `<f>20px<f><i>${icons.cun_icon}<i>${lang["cun"]}: ${enemy.getStats().cun}\n`;
    // @ts-expect-error
    const mainStats = textSyntax(mainStatText);
    var resists = `<f>20px<f><i>${icons.resistAll_icon}<i>${lang["resistance"]}\n`;
    Object.entries(enemy.getResists()).forEach((res) => {
        const key = res[0];
        const val = res[1];
        resists += `<f>20px<f><i>${icons[key + "Resist" + "_icon"]}<i>${lang[key]} ${val}%\n`;
    });
    // @ts-expect-error
    const resistFrame = textSyntax(resists);
    resistFrame.classList.add("enResists");
    staticHover.append(name, mainStats, resistFrame);
}
/* Hide map hover */
function hideMapHover() {
    staticHover.textContent = "";
    staticHover.style.display = "none";
}
function activateShrine() {
    maps[currentMap].shrines.forEach(shrine => {
        if (shrine.cords.x == player.cords.x && shrine.cords.y == player.cords.y && !state.inCombat) {
            if (!(player.usedShrines.find((used) => used.cords.x == shrine.cords.x && used.cords.y == shrine.cords.y && used.map == currentMap))) {
                player.stats.hp = player.getStats().hpMax;
                player.stats.mp = player.getStats().mpMax;
                player.respawnPoint.cords = shrine.cords;
                player.usedShrines.push({ cords: shrine.cords, map: currentMap });
                spawnFloatingText(player.cords, lang["shrine_activated"], "lime", 30, 500, 75);
                updateUI();
                modifyCanvas();
            }
            else {
                spawnFloatingText(player.cords, lang["shrine_used"], "cyan", 30, 500, 75);
            }
        }
    });
}
//# sourceMappingURL=map.js.map