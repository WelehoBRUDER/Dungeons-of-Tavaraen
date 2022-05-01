"use strict";
var _a;
const baseCanvas = document.querySelector(".canvasLayers .baseSheet");
const baseCtx = baseCanvas.getContext("2d");
const fogCanvas = document.querySelector(".canvasLayers .fog");
const fogCtx = fogCanvas.getContext("2d");
const mapDataCanvas = document.querySelector(".canvasLayers .mapData");
const mapDataCtx = mapDataCanvas.getContext("2d");
const playerCanvas = document.querySelector(".canvasLayers .playerSheet");
const playerCtx = playerCanvas.getContext("2d");
const enemyLayers = document.querySelector(".canvasLayers .enemyLayers");
const summonLayers = document.querySelector(".canvasLayers .summonLayers");
const projectileLayers = document.querySelector(".canvasLayers .projectileLayers");
const staticHover = document.querySelector(".mapHover");
const minimapContainer = document.querySelector(".rightTop .miniMap");
const minimapCanvas = minimapContainer.querySelector(".minimapLayer");
const minimapCtx = minimapCanvas.getContext("2d");
const minimapUpdateCanvas = minimapContainer.querySelector(".minimapUpdateLayer");
const minimapUpdateCtx = minimapUpdateCanvas.getContext("2d");
const areaMapContainer = document.querySelector(".areaMap");
const areaMapCanvas = areaMapContainer.querySelector(".areaCanvas");
const areaMapUpdateCanvas = areaMapContainer.querySelector(".areaUpdateCanvas");
const areaMapUpdateCtx = areaMapUpdateCanvas.getContext("2d");
const areaMapCtx = areaMapCanvas.getContext("2d");
const spriteMap_tiles = document.querySelector(".spriteMap_tiles");
const spriteMap_items = document.querySelector(".spriteMap_items");
baseCanvas.addEventListener("mousemove", mapHover);
baseCanvas.addEventListener("mouseup", clickMap);
var currentMap = 3;
var turnOver = true;
var enemiesHadTurn = 0;
let dontMove = false;
const zoomLevels = [0.2, 0.25, 0.27, 0.33, 0.36, 0.4, 0.44, 0.49, 0.55, 0.66, 0.75, 1, 1.25, 1.33, 1.5, 1.65, 1.8, 2, 2.2, 2.35, 2.5];
var currentZoom = 1;
/* temporarily store highlight variables here */
const highlight = {
    x: 0,
    y: 0
};
const mapSelection = {
    x: null,
    y: null,
    disableHover: false
};
baseCanvas.addEventListener("wheel", changeZoomLevel);
function changeZoomLevel({ deltaY }) {
    if (deltaY > 0) {
        currentZoom = zoomLevels[zoomLevels.indexOf(currentZoom) - 1] || zoomLevels[0];
    }
    else {
        currentZoom = zoomLevels[zoomLevels.indexOf(currentZoom) + 1] || zoomLevels[zoomLevels.length - 1];
    }
    if (currentZoom !== oldZoom)
        modifyCanvas(true);
}
window.addEventListener("resize", resizeCanvas);
(_a = document.querySelector(".main")) === null || _a === void 0 ? void 0 : _a.addEventListener('contextmenu', event => event.preventDefault());
let sightMap;
let oldCords = { x: 0, y: 0 };
let oldZoom = 0;
function renderMap(map, createNewSightMap = false) {
    if (!baseCtx)
        throw new Error("2D context from base canvas is missing!");
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    if (createNewSightMap)
        sightMap = createSightMap(player.cords, player.sight());
    if (!sightMap)
        return;
    let translateX = oldCords.x - player.cords.x;
    let translateY = oldCords.y - player.cords.y;
    //baseCtx.translate(translateX * spriteSize, translateY * spriteSize);
    //oldCords.x == player.cords.x && oldCords.y == player.cords.y &&
    if (oldCords.x === player.cords.x && oldCords.y === player.cords.y && oldZoom === currentZoom)
        return;
    if (oldZoom == currentZoom) {
        oldCords = Object.assign({}, player.cords);
        oldZoom = currentZoom;
        moveCanvas(translateX * spriteSize, translateY * spriteSize);
        renderPlayerModel(spriteSize, playerCanvas, playerCtx);
        renderRow(map, translateX, translateY);
        //renderTiles(map, spriteLimitX, spriteLimitY);
        return;
    }
    else {
        renderEntireMap(map);
    }
}
function renderTileHover(tile, event = { buttons: -1 }) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!baseCtx)
        throw new Error("2D context from base canvas is missing!");
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    var tileX = (tile.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    var tileY = (tile.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
    playerCanvas.width = playerCanvas.width;
    if (dontMove) {
        renderPlayerModel(spriteSize, playerCanvas, playerCtx);
        dontMove = false;
        return;
    }
    const strokeSprite = staticTiles[0].spriteMap;
    try {
        /* Render tile */
        const highlightSprite = (_a = staticTiles[3]) === null || _a === void 0 ? void 0 : _a.spriteMap;
        const highlightRedSprite = (_b = staticTiles[4]) === null || _b === void 0 ? void 0 : _b.spriteMap;
        const highlight2Sprite = (_c = staticTiles[5]) === null || _c === void 0 ? void 0 : _c.spriteMap;
        const highlight2RedSprite = (_d = staticTiles[6]) === null || _d === void 0 ? void 0 : _d.spriteMap;
        renderPlayerModel(spriteSize, playerCanvas, playerCtx);
        var hoveredEnemy = false;
        maps[currentMap].enemies.forEach((enemy) => {
            if (enemy.cords.x == tile.x && enemy.cords.y == tile.y) {
                hoverEnemyShow(enemy);
                hoveredEnemy = true;
            }
        });
        let hoveredSummon = false;
        combatSummons.forEach((summon) => {
            if (summon.cords.x == tile.x && summon.cords.y == tile.y) {
                hoverEnemyShow(summon);
                hoveredSummon = true;
            }
        });
        if (!hoveredEnemy && !hoveredSummon) {
            hideMapHover();
        }
        if (state.abiSelected.type == "movement" || state.abiSelected.type == "charge") {
            const path = generatePath({ x: player.cords.x, y: player.cords.y }, tile, false, false);
            let distance = state.isSelected ? state.abiSelected.use_range : player.weapon.range;
            let iteration = 0;
            path.forEach((step) => {
                iteration++;
                if (step.x == player.cords.x + settings.map_offset_x && step.y == player.cords.y + settings.map_offset_y)
                    return;
                var _tileX = (step.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
                var _tileY = (step.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
                if (iteration > distance) {
                    playerCtx.drawImage(spriteMap_tiles, highlight2RedSprite.x, highlight2RedSprite.y, 128, 128, Math.round(_tileX), Math.round(_tileY), Math.round(spriteSize + 1), Math.round(spriteSize + 1));
                }
                else
                    playerCtx.drawImage(spriteMap_tiles, highlight2Sprite.x, highlight2Sprite.y, 128, 128, Math.round(_tileX), Math.round(_tileY), Math.round(spriteSize + 1), Math.round(spriteSize + 1));
            });
        }
        /* Render highlight test */
        else if ((((((_e = state.abiSelected) === null || _e === void 0 ? void 0 : _e.shoots_projectile) && state.isSelected) || player.weapon.firesProjectile && state.rangedMode) && event.buttons !== 1)) {
            const path = generateArrowPath({ x: player.cords.x, y: player.cords.y }, tile);
            let distance = state.isSelected ? state.abiSelected.use_range : player.weapon.range;
            let iteration = 0;
            let lastStep = 0;
            path.forEach((step) => {
                iteration++;
                if (step.x == player.cords.x && step.y == player.cords.y)
                    return;
                var _tileX = (step.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
                var _tileY = (step.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
                if ((step.blocked && step.x !== tile.x && step.y !== tile.y) || iteration > distance) {
                    if (lastStep == 0)
                        lastStep = iteration;
                    playerCtx.drawImage(spriteMap_tiles, highlightRedSprite.x, highlightRedSprite.y, 128, 128, Math.round(_tileX), Math.round(_tileY), Math.round(spriteSize + 1), Math.round(spriteSize + 1));
                }
                else
                    playerCtx.drawImage(spriteMap_tiles, highlightSprite.x, highlightSprite.y, 128, 128, Math.round(_tileX), Math.round(_tileY), Math.round(spriteSize + 1), Math.round(spriteSize + 1));
            });
            if (((_f = state.abiSelected) === null || _f === void 0 ? void 0 : _f.aoe_size) > 0) {
                let aoeMap = createAOEMap(lastStep > 0 ? path[lastStep - 1] : path[path.length - 1], state.abiSelected.aoe_size);
                for (let y = 0; y < spriteLimitY; y++) {
                    for (let x = 0; x < spriteLimitX; x++) {
                        if (((_g = aoeMap[mapOffsetStartY + y]) === null || _g === void 0 ? void 0 : _g[mapOffsetStartX + x]) == "x") {
                            playerCtx.drawImage(spriteMap_tiles, highlightRedSprite.x, highlightRedSprite.y, 128, 128, Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), Math.round(spriteSize + 1), Math.round(spriteSize + 1));
                        }
                    }
                }
            }
        }
        if (state.isSelected && state.abiSelected.summon_unit) {
            var _tileX = (tile.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
            var _tileY = (tile.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
            if (generatePath(player.cords, tile, player.canFly, true) <= state.abiSelected.use_range) {
                playerCtx.drawImage(spriteMap_tiles, highlight2Sprite.x, highlight2Sprite.y, 128, 128, Math.round(_tileX), Math.round(_tileY), Math.round(spriteSize + 1), Math.round(spriteSize + 1));
            }
            else
                playerCtx.drawImage(spriteMap_tiles, highlight2RedSprite.x, highlight2RedSprite.y, 128, 128, Math.round(_tileX), Math.round(_tileY), Math.round(spriteSize + 1), Math.round(spriteSize + 1));
        }
        if (event.buttons == 1 && !state.isSelected) {
            const path = generatePath({ x: player.cords.x, y: player.cords.y }, tile, player.canFly);
            path.forEach((step) => {
                if (step.x == player.cords.x + settings.map_offset_x && step.y == player.cords.y + settings.map_offset_y)
                    return;
                var _tileX = (step.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
                var _tileY = (step.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
                if (step.blocked) {
                    playerCtx.drawImage(spriteMap_tiles, highlightRedSprite.x, highlightRedSprite.y, 128, 128, Math.round(_tileX), Math.round(_tileY), Math.round(spriteSize + 1), Math.round(spriteSize + 1));
                }
                else
                    playerCtx.drawImage(spriteMap_tiles, highlightSprite.x, highlightSprite.y, 128, 128, Math.round(_tileX), Math.round(_tileY), Math.round(spriteSize + 1), Math.round(spriteSize + 1));
            });
        }
    }
    catch (err) {
        if (DEVMODE)
            displayText(`<c>red<c>${err} at line map:574`);
    }
    playerCtx.drawImage(spriteMap_tiles, strokeSprite.x, strokeSprite.y, 128, 128, tileX, tileY, Math.round(spriteSize + 1), Math.round(spriteSize + 1));
}
function restoreGrave() {
    if (!player.grave)
        return;
    if (player.cords.x + settings.map_offset_x == player.grave.cords.x && player.cords.y + settings.map_offset_y == player.grave.cords.y) {
        player.addGold(player.grave.gold);
        player.level.xp += player.grave.xp;
        player.grave = null;
        spawnFloatingText(player.cords, "GRAVE RESTORED!", "lime", 25, 3000);
        modifyCanvas();
        updateUI();
    }
}
let isMovingCurrently = false;
let breakMoving = false;
async function movePlayer(goal, ability = false, maxRange = 99, action = null) {
    if (goal.x < 0 || goal.x > maps[currentMap].base[0].length - 1 || goal.y < 0 || goal.y > maps[currentMap].base.length - 1)
        return;
    if (!turnOver || player.isDead)
        return;
    const path = generatePath(player.cords, goal, false);
    let count = 0;
    state.isSelected = false;
    if (isMovingCurrently)
        breakMoving = true;
    moving: for (let step of path) {
        if (canMoveTo(player, step)) {
            await helper.sleep(5);
            if (!ability && player.speed.movementFill <= -100) {
                player.speed.movementFill += 100;
                advanceTurn();
                break;
            }
            let extraMove = false;
            if (!ability) {
                if (player.speed.movementFill >= 100) {
                    player.speed.movementFill -= 100;
                    extraMove = true;
                }
                else
                    player.speed.movementFill += (player.getSpeed().movement - 100);
            }
            isMovingCurrently = true;
            player.cords.x = step.x;
            player.cords.y = step.y;
            modifyCanvas(true);
            if (!ability && !extraMove) {
                advanceTurn();
            }
            count++;
            if (state.inCombat && !ability || count > maxRange && ability || breakMoving)
                break moving;
        }
    }
    breakMoving = false;
    isMovingCurrently = false;
    if (!ability) {
        if (count > 1) {
            let i = worldTextHistoryArray.length - 1;
            if (worldTextHistoryArray[i].innerText.includes("[MOVEMENT]")) {
                const totalCount = (+worldTextHistoryArray[i].innerText.split(" ")[3] + count).toString();
                worldTextHistoryArray[i] = textSyntax(`<c>green<c>[MOVEMENT]<c>white<c> Ran for ${totalCount} turn(s).`);
                displayText("");
            }
            else
                displayText(`<c>green<c>[MOVEMENT]<c>white<c> Ran for ${count} turn(s).`);
        }
        if (state.inCombat && count == 1) {
            if (Math.round(player.hpRegen() * 0.5) > 0)
                displayText(`<c>white<c>[PASSIVE] <c>lime<c>Recovered ${Math.round(player.hpRegen() * 0.5)} HP.`);
        }
        else if (state.inCombat && count > 1) {
            let regen = Math.round(player.hpRegen() * count - 1) + Math.round(player.hpRegen() * 0.5);
            if (regen > 0)
                displayText(`<c>white<c>[PASSIVE] <c>lime<c>Recovered ${regen} HP.`);
            displayText(`<c>green<c>[MOVEMENT] <c>orange<c>Stopped moving due to encontering an enemy.`);
        }
        else if (count > 0) {
            if (Math.round(player.hpRegen() * count) > 0)
                displayText(`<c>white<c>[PASSIVE] <c>lime<c>Recovered ${Math.round(player.hpRegen() * count)} HP.`);
        }
    }
    else if (!action) {
        advanceTurn();
        state.abiSelected = {};
    }
    else if (action) {
        action();
        advanceTurn();
        state.abiSelected = {};
    }
}
function renderSingleEnemy(enemy, canvas) {
    var _a, _b;
    if (!enemy.alive || ((_a = sightMap[enemy.cords.y]) === null || _a === void 0 ? void 0 : _a[enemy.cords.x]) != "x")
        return;
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    var tileX = (enemy.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    var tileY = (enemy.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
    const ctx = canvas.getContext("2d");
    const enemyImg = document.querySelector(`.sprites .${enemy.sprite}`);
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    if (enemyImg) {
        /* Render hp bar */
        const hpbg = document.querySelector(".hpBg");
        const hpbar = document.querySelector(".hpBar");
        const hpborder = document.querySelector(".hpBorder");
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hpbg, (tileX) - spriteSize * (enemy.scale - 1), (tileY - 12) - spriteSize * (enemy.scale - 1), spriteSize * enemy.scale, spriteSize * enemy.scale);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hpbar, (tileX) - spriteSize * (enemy.scale - 1), (tileY - 12) - spriteSize * (enemy.scale - 1), (Math.round(enemy.hpRemain()) * spriteSize / 100) * enemy.scale, spriteSize * enemy.scale);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hpborder, (tileX) - spriteSize * (enemy.scale - 1), (tileY - 12) - spriteSize * (enemy.scale - 1), spriteSize * enemy.scale, spriteSize * enemy.scale);
        /* Render enemy on top of hp bar */
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(enemyImg, tileX - spriteSize * (enemy.scale - 1), tileY - spriteSize * (enemy.scale - 1), spriteSize * enemy.scale, spriteSize * enemy.scale);
        if (((_b = enemy.questSpawn) === null || _b === void 0 ? void 0 : _b.quest) > -1) {
            ctx.font = `${spriteSize / 1.9}px Arial`;
            ctx.fillStyle = "goldenrod";
            ctx.fillText(`!`, (tileX - spriteSize * (enemy.scale - 1)) + spriteSize / 2.3, (tileY - spriteSize * (enemy.scale - 1)) - spriteSize / 10);
        }
        let statCount = 0;
        enemy.statusEffects.forEach((effect) => {
            if (statCount > 4)
                return;
            let img = new Image(32, 32);
            img.src = effect.icon;
            img.addEventListener("load", e => {
                ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(img, tileX + spriteSize - 32 * currentZoom, tileY + (32 * statCount * currentZoom), 32 * currentZoom, 32 * currentZoom);
                img = null;
                statCount++;
            });
        });
    }
}
async function moveEnemy(goal, enemy, ability = null, maxRange = 99) {
    // @ts-ignore
    const path = generatePath(enemy.cords, goal, false);
    let count = 0;
    moving: for (let step of path) {
        if (canMoveTo(enemy, step)) {
            await helper.sleep(10);
            if (enemy.speed.movementFill <= -100) {
                enemy.speed.movementFill += 100;
                break moving;
            }
            let increaseMovement = true;
            while (enemy.speed.movementFill >= 100) {
                enemy.speed.movementFill -= 100;
                increaseMovement = false;
                maxRange++;
            }
            if (increaseMovement) {
                enemy.speed.movementFill += (player.getSpeed().movement - 100);
            }
            enemy.cords.x = step.x;
            enemy.cords.y = step.y;
            const enemyCanvas = document.querySelector(`.enemy${enemy.index}`);
            try {
                enemyCanvas.width = enemyCanvas.width;
            }
            catch (_a) { }
            renderSingleEnemy(enemy, enemyCanvas);
            count++;
            if (count > maxRange)
                break moving;
        }
    }
    // @ts-expect-error
    attackTarget(enemy, enemy.chosenTarget, weaponReach(enemy, 1, enemy.chosenTarget));
    regularAttack(enemy, enemy.chosenTarget, ability);
    updateUI();
    updateEnemiesTurn();
}
function modifyCanvas(createNewSightMap = false) {
    moveMinimap();
    moveAreaMap();
    renderMap(maps[currentMap], createNewSightMap);
}
function resizeCanvas() {
    const layers = Array.from(document.querySelectorAll("canvas.layer"));
    layers.map((layer) => {
        layer.width = innerWidth;
        layer.height = innerHeight;
    });
    currentZoom -= 0.000001;
    renderMap(maps[currentMap], true);
}
function moveCanvas(x, y) {
    const newBaseCanvas = document.createElement("canvas");
    newBaseCanvas.width = baseCanvas.width;
    newBaseCanvas.height = baseCanvas.height;
    const newBaseCtx = newBaseCanvas.getContext("2d");
    newBaseCtx === null || newBaseCtx === void 0 ? void 0 : newBaseCtx.drawImage(baseCanvas, 0, 0);
    baseCanvas.width = baseCanvas.width;
    baseCtx.drawImage(newBaseCanvas, x, y);
}
let highestWaitTime = 0;
//# sourceMappingURL=map.js.map