"use strict";
var _a;
const baseCanvas = document.querySelector(".canvasLayers .baseSheet");
const baseCtx = baseCanvas.getContext("2d");
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
const areaMapContainer = document.querySelector(".areaMap");
const areaMapCanvas = areaMapContainer.querySelector(".areaCanvas");
const areaMapCtx = areaMapCanvas.getContext("2d");
const spriteMap_tiles = document.querySelector(".spriteMap_tiles");
const spriteMap_items = document.querySelector(".spriteMap_items");
baseCanvas.addEventListener("mousemove", mapHover);
baseCanvas.addEventListener("mouseup", clickMap);
var currentMap = 2;
var turnOver = true;
var enemiesHadTurn = 0;
let dontMove = false;
const zoomLevels = [0.33, 0.36, 0.4, 0.44, 0.49, 0.55, 0.66, 0.75, 1, 1.25, 1.33, 1.5, 1.65, 1.8, 2, 2.2, 2.35, 2.5];
var currentZoom = 1;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
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
// @ts-expect-error
function changeZoomLevel({ deltaY }) {
    if (deltaY > 0) {
        currentZoom = zoomLevels[zoomLevels.indexOf(currentZoom) - 1] || zoomLevels[0];
    }
    else {
        currentZoom = zoomLevels[zoomLevels.indexOf(currentZoom) + 1] || zoomLevels[zoomLevels.length - 1];
    }
    modifyCanvas(true);
}
// @ts-expect-error
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
function renderMinimap(map) {
    var _a, _b, _c, _d, _e, _f, _g;
    const miniSpriteSize = 8;
    const spriteSize = miniSpriteSize;
    minimapCanvas.width = map.base[0].length * miniSpriteSize;
    minimapCanvas.height = map.base.length * miniSpriteSize;
    if (!settings.toggle_minimap) {
        minimapContainer.style.display = "none";
        return;
    }
    else {
        minimapContainer.style.display = "block";
    }
    for (let y = 0; y < map.base.length; y++) {
        for (let x = 0; x < map.base[y].length; x++) {
            const imgId = (_b = (_a = map.base) === null || _a === void 0 ? void 0 : _a[y]) === null || _b === void 0 ? void 0 : _b[x];
            // @ts-expect-error
            const sprite = (_d = (_c = tiles[imgId]) === null || _c === void 0 ? void 0 : _c.spriteMap) !== null && _d !== void 0 ? _d : { x: 128, y: 0 };
            const clutterId = (_f = (_e = map.clutter) === null || _e === void 0 ? void 0 : _e[y]) === null || _f === void 0 ? void 0 : _f[x];
            // @ts-expect-error
            const clutterSprite = (_g = clutters[clutterId]) === null || _g === void 0 ? void 0 : _g.spriteMap;
            if (sprite) {
                minimapCtx.drawImage(spriteMap_tiles, sprite.x, sprite.y, 128, 128, x * miniSpriteSize, y * miniSpriteSize, miniSpriteSize + 1, miniSpriteSize + 1);
            }
            if (clutterSprite) {
                minimapCtx.drawImage(spriteMap_tiles, clutterSprite.x, clutterSprite.y, 128, 128, x * miniSpriteSize, y * miniSpriteSize, miniSpriteSize + 1, miniSpriteSize + 1);
            }
        }
    }
    map.shrines.forEach((checkpoint) => {
        const shrine = document.querySelector(".sprites .shrineTile");
        var tileX = checkpoint.cords.x * spriteSize;
        var tileY = checkpoint.cords.y * spriteSize;
        minimapCtx === null || minimapCtx === void 0 ? void 0 : minimapCtx.drawImage(shrine, tileX, tileY, spriteSize, spriteSize);
    });
    map.treasureChests.forEach((chest) => {
        const lootedChest = lootedChests.find(trs => trs.cords.x == chest.cords.x && trs.cords.y == chest.cords.y && trs.map == chest.map);
        if (!lootedChest) {
            const chestSprite = document.querySelector(`.sprites .${chest.sprite}`);
            var tileX = chest.cords.x * spriteSize;
            var tileY = chest.cords.y * spriteSize;
            minimapCtx === null || minimapCtx === void 0 ? void 0 : minimapCtx.drawImage(chestSprite, tileX, tileY, spriteSize, spriteSize);
        }
    });
    map.messages.forEach((msg) => {
        const message = document.querySelector(".messageTile");
        var tileX = msg.cords.x * spriteSize;
        var tileY = msg.cords.y * spriteSize;
        minimapCtx === null || minimapCtx === void 0 ? void 0 : minimapCtx.drawImage(message, tileX, tileY, spriteSize, spriteSize);
    });
    /* Render Characters */
    NPCcharacters.forEach((npc) => {
        if (npc.currentMap == currentMap) {
            const charSprite = document.querySelector(`.sprites .${npc.sprite}`);
            var tileX = npc.currentCords.x * spriteSize;
            var tileY = npc.currentCords.y * spriteSize;
            if (charSprite) {
                minimapCtx === null || minimapCtx === void 0 ? void 0 : minimapCtx.drawImage(charSprite, tileX, tileY, spriteSize, spriteSize);
            }
        }
    });
}
// Found this from google, the function returns true / false depending on whether or not the canvas is empty.
function isCanvasBlank(canvas) {
    try {
        return !canvas.getContext('2d')
            .getImageData(0, 0, canvas.width, canvas.height).data
            .some(channel => channel !== 0);
    }
    catch (_a) { }
}
function moveMinimap() {
    if (isCanvasBlank(minimapCanvas))
        renderMinimap(maps[currentMap]);
    if (!settings.toggle_minimap) {
        minimapContainer.style.display = "none";
        return;
    }
    else {
        minimapContainer.style.display = "block";
    }
    minimapCanvas.style.left = `${player.cords.x * -8 + 172 * settings["ui_scale"] / 100}px`;
    minimapCanvas.style.top = `${player.cords.y * -8 + 112 * settings["ui_scale"] / 100}px`;
}
function renderAreaMap(map) {
    var _a, _b, _c, _d, _e, _f, _g;
    const miniSpriteSize = 11.97;
    areaMapCanvas.width = map.base[0].length * miniSpriteSize;
    areaMapCanvas.height = map.base.length * miniSpriteSize;
    for (let y = 0; y < map.base.length; y++) {
        for (let x = 0; x < map.base[y].length; x++) {
            const imgId = (_b = (_a = map.base) === null || _a === void 0 ? void 0 : _a[y]) === null || _b === void 0 ? void 0 : _b[x];
            // @ts-expect-error
            const sprite = (_d = (_c = tiles[imgId]) === null || _c === void 0 ? void 0 : _c.spriteMap) !== null && _d !== void 0 ? _d : { x: 128, y: 0 };
            const clutterId = (_f = (_e = map.clutter) === null || _e === void 0 ? void 0 : _e[y]) === null || _f === void 0 ? void 0 : _f[x];
            // @ts-expect-error
            const clutterSprite = (_g = clutters[clutterId]) === null || _g === void 0 ? void 0 : _g.spriteMap;
            if (sprite) {
                areaMapCtx.drawImage(spriteMap_tiles, sprite.x, sprite.y, 128, 128, x * miniSpriteSize, y * miniSpriteSize, miniSpriteSize + 1, miniSpriteSize + 1);
            }
            if (clutterSprite) {
                areaMapCtx.drawImage(spriteMap_tiles, clutterSprite.x, clutterSprite.y, 128, 128, x * miniSpriteSize, y * miniSpriteSize, miniSpriteSize + 1, miniSpriteSize + 1);
            }
        }
    }
}
function moveAreaMap() {
    //const displayLimit = areaMapCalcDisplay();
    if (isCanvasBlank(areaMapCanvas))
        renderAreaMap(maps[currentMap]);
    if (state.areaMapOpen) {
        areaMapContainer.style.display = "block";
    }
    else {
        areaMapContainer.style.display = "none";
    }
    areaMapCanvas.style.left = `${player.cords.x * -12 + (window.innerWidth * .6 / 2)}px`;
    areaMapCanvas.style.top = `${player.cords.y * -12 + (window.innerHeight * .8 / 2)}px`;
    // if (player.cords.y >= maps[currentMap].base.length - displayLimit.heightLimit) {
    //   areaMapCanvas.style.top = `${player.cords.y * -12 + (window.innerHeight * .8) * settings["ui_scale"] / 100}px`;
    // }
    // if (player.cords.y <= displayLimit.heightLimit) {
    //   areaMapCanvas.style.top = `${player.cords.y * -12 * settings["ui_scale"] / 100}px`;
    // }
    // if (player.cords.x >= maps[currentMap].base[0].length - displayLimit.widthLimit) {
    //   areaMapCanvas.style.left = `${player.cords.x * -12 + (window.innerWidth * .6) * settings["ui_scale"] / 100}px`;
    // }
    // if (player.cords.x <= displayLimit.widthLimit) {
    //   areaMapCanvas.style.left = `${player.cords.x * -12 * settings["ui_scale"] / 100}px`;
    // }
}
function areaMapCalcDisplay() {
    let height = 0;
    let width = 0;
    const spriteSize = 12;
    width = areaMapContainer.getBoundingClientRect().width / 2;
    height = areaMapContainer.getBoundingClientRect().height / 2;
    return { widthLimit: Math.ceil(width / spriteSize), heightLimit: Math.ceil(height / spriteSize) };
}
let sightMap;
function renderMap(map, createNewSightMap = false) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    baseCanvas.width = baseCanvas.width; // Clears the canvas
    if (!baseCtx)
        throw new Error("2D context from base canvas is missing!");
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    if (createNewSightMap)
        sightMap = createSightMap(player.cords, player.sight());
    if (!sightMap)
        return;
    /* Render the base layer */
    for (let y = 0; y < spriteLimitY; y++) {
        for (let x = 0; x < spriteLimitX; x++) {
            if (y + mapOffsetStartY > maps[currentMap].base.length - 1 || y + mapOffsetStartY < 0)
                continue;
            if (x + mapOffsetStartX > maps[currentMap].base[y].length - 1 || x + mapOffsetStartX < 0)
                continue;
            const imgId = (_b = (_a = map.base) === null || _a === void 0 ? void 0 : _a[mapOffsetStartY + y]) === null || _b === void 0 ? void 0 : _b[mapOffsetStartX + x];
            // @ts-expect-error
            const sprite = (_d = (_c = tiles[imgId]) === null || _c === void 0 ? void 0 : _c.spriteMap) !== null && _d !== void 0 ? _d : { x: 128, y: 0 };
            const grave = document.querySelector(`.sprites .deadModel`);
            const clutterId = (_f = (_e = map.clutter) === null || _e === void 0 ? void 0 : _e[mapOffsetStartY + y]) === null || _f === void 0 ? void 0 : _f[mapOffsetStartX + x];
            // @ts-expect-error
            const clutterSprite = (_g = clutters[clutterId]) === null || _g === void 0 ? void 0 : _g.spriteMap;
            const fog = { x: 256, y: 0 };
            if (sprite) {
                baseCtx.drawImage(spriteMap_tiles, sprite.x, sprite.y, 128, 128, Math.floor(x * spriteSize - mapOffsetX), Math.floor(y * spriteSize - mapOffsetY), Math.floor(spriteSize + 2), Math.floor(spriteSize + 2));
            }
            if (player.grave) {
                if (player.grave.cords.x == x + mapOffsetStartX && player.grave.cords.y == y + mapOffsetStartY) {
                    baseCtx.drawImage(grave, Math.floor(x * spriteSize - mapOffsetX), Math.floor(y * spriteSize - mapOffsetY), Math.floor(spriteSize + 2), Math.floor(spriteSize + 2));
                }
            }
            if (clutterSprite) {
                baseCtx.drawImage(spriteMap_tiles, clutterSprite.x, clutterSprite.y, 128, 128, Math.floor(x * spriteSize - mapOffsetX), Math.floor(y * spriteSize - mapOffsetY), Math.floor(spriteSize + 2), Math.floor(spriteSize + 2));
            }
            if (((_h = sightMap[mapOffsetStartY + y]) === null || _h === void 0 ? void 0 : _h[mapOffsetStartX + x]) != "x" && imgId) {
                baseCtx.drawImage(spriteMap_tiles, fog.x, fog.y, 128, 128, Math.floor(x * spriteSize - mapOffsetX), Math.floor(y * spriteSize - mapOffsetY), Math.floor(spriteSize + 2), Math.floor(spriteSize + 2));
            }
        }
    }
    map.shrines.forEach((checkpoint) => {
        var _a, _b, _c;
        if ((((_a = sightMap[checkpoint.cords.y]) === null || _a === void 0 ? void 0 : _a[checkpoint.cords.x]) == "x")) {
            const shrine = document.querySelector(".sprites .shrineTile");
            const shrineLit = document.querySelector(".sprites .shrineLitTile");
            var tileX = (checkpoint.cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
            var tileY = (checkpoint.cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
            if (((_b = player === null || player === void 0 ? void 0 : player.respawnPoint) === null || _b === void 0 ? void 0 : _b.cords.x) == checkpoint.cords.x && ((_c = player === null || player === void 0 ? void 0 : player.respawnPoint) === null || _c === void 0 ? void 0 : _c.cords.y) == checkpoint.cords.y)
                baseCtx === null || baseCtx === void 0 ? void 0 : baseCtx.drawImage(shrineLit, tileX, tileY, spriteSize, spriteSize);
            else
                baseCtx === null || baseCtx === void 0 ? void 0 : baseCtx.drawImage(shrine, tileX, tileY, spriteSize, spriteSize);
        }
    });
    map.treasureChests.forEach((chest) => {
        var _a;
        const lootedChest = lootedChests.find(trs => trs.cords.x == chest.cords.x && trs.cords.y == chest.cords.y && trs.map == chest.map);
        if ((((_a = sightMap[chest.cords.y]) === null || _a === void 0 ? void 0 : _a[chest.cords.x]) == "x")) {
            if (!lootedChest) {
                const chestSprite = document.querySelector(`.sprites .${chest.sprite}`);
                var tileX = (chest.cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
                var tileY = (chest.cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
                baseCtx === null || baseCtx === void 0 ? void 0 : baseCtx.drawImage(chestSprite, tileX, tileY, spriteSize, spriteSize);
            }
        }
    });
    map.messages.forEach((msg) => {
        var _a;
        if ((((_a = sightMap[msg.cords.y]) === null || _a === void 0 ? void 0 : _a[msg.cords.x]) == "x")) {
            const message = document.querySelector(".messageTile");
            var tileX = (msg.cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
            var tileY = (msg.cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
            baseCtx === null || baseCtx === void 0 ? void 0 : baseCtx.drawImage(message, tileX, tileY, spriteSize, spriteSize);
        }
    });
    /* Render Enemies */
    enemyLayers.textContent = ""; // Delete enemy canvases
    map.enemies.forEach((enemy, index) => {
        var _a, _b;
        if (!enemy.alive || ((_a = sightMap[enemy.cords.y]) === null || _a === void 0 ? void 0 : _a[enemy.cords.x]) != "x")
            return;
        var tileX = (enemy.cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
        var tileY = (enemy.cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
        const canvas = document.createElement("canvas");
        // @ts-ignore
        canvas.classList = `enemy${index} layer`;
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
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hpbar, (tileX) - spriteSize * (enemy.scale - 1), (tileY - 12) - spriteSize * (enemy.scale - 1), (Math.floor(enemy.hpRemain()) * spriteSize / 100) * enemy.scale, spriteSize * enemy.scale);
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
        enemyLayers.append(canvas);
    });
    /* Render Characters */
    NPCcharacters.forEach((npc) => {
        var _a;
        if (npc.currentMap == currentMap) {
            if (((_a = sightMap[npc.currentCords.y]) === null || _a === void 0 ? void 0 : _a[npc.currentCords.x]) == "x") {
                const charSprite = document.querySelector(`.sprites .${npc.sprite}`);
                var tileX = (npc.currentCords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
                var tileY = (npc.currentCords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
                if (charSprite) {
                    baseCtx === null || baseCtx === void 0 ? void 0 : baseCtx.drawImage(charSprite, tileX, tileY, spriteSize, spriteSize);
                }
            }
        }
    });
    /* Render Summons */
    summonLayers.textContent = ""; // Delete summon canvases
    combatSummons.forEach((enemy, index) => {
        var _a;
        if (!enemy.alive)
            return;
        var tileX = (enemy.cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
        var tileY = (enemy.cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
        const canvas = document.createElement("canvas");
        // @ts-ignore
        canvas.classList = `summon${index} layer`;
        const ctx = canvas.getContext("2d");
        summonLayers.append(canvas);
        const enemyImg = document.querySelector(`.sprites .${enemy.sprite}`);
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        if (enemyImg && (((_a = sightMap[enemy.cords.y]) === null || _a === void 0 ? void 0 : _a[enemy.cords.x]) == "x")) {
            /* Render hp bar */
            const hpbg = document.querySelector(".hpBg");
            const hpbar = document.querySelector(".hpBarAlly");
            const hpborder = document.querySelector(".hpBorder");
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hpbg, tileX, tileY - 12, spriteSize, spriteSize);
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hpbar, tileX, tileY - 12, enemy.hpRemain() * spriteSize / 100, spriteSize);
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hpborder, tileX, tileY - 12, spriteSize, spriteSize);
            /* Render enemy on top of hp bar */
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(enemyImg, tileX, tileY, spriteSize, spriteSize);
            let statCount = 0;
            enemy.statusEffects.forEach((effect) => {
                if (statCount > 4)
                    return;
                let img = new Image(32, 32);
                img.src = effect.icon;
                img.addEventListener("load", e => {
                    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(img, tileX + spriteSize - 32, tileY + (32 * statCount), 32, 32);
                    img = null;
                    statCount++;
                });
            });
        }
    });
    /* Render Items */
    mapDataCanvas.width = mapDataCanvas.width;
    itemData.forEach((item) => {
        var _a;
        if (item.map != currentMap)
            return;
        if (!item.itm)
            return;
        var tileX = (item.cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
        var tileY = (item.cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
        const itemSprite = item.itm.spriteMap;
        if (((_a = sightMap[item.cords.y]) === null || _a === void 0 ? void 0 : _a[item.cords.x]) == "x") {
            mapDataCtx.shadowColor = "#ffd900";
            mapDataCtx.shadowBlur = 6;
            mapDataCtx.shadowOffsetX = 0;
            mapDataCtx.shadowOffsetY = 0;
            mapDataCtx === null || mapDataCtx === void 0 ? void 0 : mapDataCtx.drawImage(spriteMap_items, itemSprite.x, itemSprite.y, 128, 128, (tileX + spriteSize * item.mapCords.xMod), (tileY + spriteSize * item.mapCords.yMod), spriteSize / 3, spriteSize / 3);
        }
    });
    /* Render Player */
    renderPlayerModel(spriteSize, playerCanvas, playerCtx);
}
function renderTileHover(tile, event = { buttons: -1 }) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!baseCtx)
        throw new Error("2D context from base canvas is missing!");
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    var tileX = (tile.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    var tileY = (tile.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
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
                if (step.x == player.cords.x && step.y == player.cords.y)
                    return;
                var _tileX = (step.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
                var _tileY = (step.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
                if (iteration > distance) {
                    playerCtx.drawImage(spriteMap_tiles, highlight2RedSprite.x, highlight2RedSprite.y, 128, 128, Math.floor(_tileX), Math.floor(_tileY), Math.floor(spriteSize + 1), Math.floor(spriteSize + 1));
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
                var _tileX = (step.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
                var _tileY = (step.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
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
            var _tileX = (tile.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
            var _tileY = (tile.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
            if (generatePath(player.cords, tile, player.canFly, true) <= state.abiSelected.use_range) {
                playerCtx.drawImage(spriteMap_tiles, highlight2Sprite.x, highlight2Sprite.y, 128, 128, Math.round(_tileX), Math.round(_tileY), Math.round(spriteSize + 1), Math.round(spriteSize + 1));
            }
            else
                playerCtx.drawImage(spriteMap_tiles, highlight2RedSprite.x, highlight2RedSprite.y, 128, 128, Math.round(_tileX), Math.round(_tileY), Math.round(spriteSize + 1), Math.round(spriteSize + 1));
        }
        if (event.buttons == 1 && !state.isSelected) {
            const path = generatePath({ x: player.cords.x, y: player.cords.y }, tile, player.canFly);
            path.forEach((step) => {
                if (step.x == player.cords.x && step.y == player.cords.y)
                    return;
                var _tileX = (step.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
                var _tileY = (step.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
                if (step.blocked) {
                    playerCtx.drawImage(spriteMap_tiles, highlightRedSprite.x, highlightRedSprite.y, 128, 128, Math.round(_tileX), Math.round(_tileY), Math.round(spriteSize + 1), Math.round(spriteSize + 1));
                }
                else
                    playerCtx.drawImage(spriteMap_tiles, highlightSprite.x, highlightSprite.y, 128, 128, Math.round(_tileX), Math.round(_tileY), Math.round(spriteSize + 1), Math.round(spriteSize + 1));
            });
        }
    }
    catch (_h) { }
    playerCtx.drawImage(spriteMap_tiles, strokeSprite.x, strokeSprite.y, 128, 128, tileX, tileY, Math.round(spriteSize + 1), Math.round(spriteSize + 1));
}
function renderAOEHoverOnPlayer(aoeSize, ignoreLedge) {
    var _a, _b;
    if (!baseCtx)
        throw new Error("2D context from base canvas is missing!");
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    playerCanvas.width = playerCanvas.width;
    renderPlayerModel(spriteSize, playerCanvas, playerCtx);
    const highlightRedSprite = (_a = staticTiles[4]) === null || _a === void 0 ? void 0 : _a.spriteMap;
    let aoeMap = createAOEMap(player.cords, aoeSize, ignoreLedge);
    for (let y = 0; y < spriteLimitY; y++) {
        for (let x = 0; x < spriteLimitX; x++) {
            if (((_b = aoeMap[mapOffsetStartY + y]) === null || _b === void 0 ? void 0 : _b[mapOffsetStartX + x]) == "x" && !(player.cords.x == x && player.cords.y == y)) {
                playerCtx.drawImage(spriteMap_tiles, highlightRedSprite.x, highlightRedSprite.y, 128, 128, x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, Math.round(spriteSize + 1), Math.round(spriteSize + 1));
            }
        }
    }
}
function mapHover(event) {
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    const lX = Math.floor(((event.offsetX - baseCanvas.width / 2) + spriteSize / 2) / spriteSize);
    const lY = Math.floor(((event.offsetY - baseCanvas.height / 2) + spriteSize / 2) / spriteSize);
    const x = lX + player.cords.x;
    const y = lY + player.cords.y;
    if (x < 0 || x > maps[currentMap].base[0].length - 1 || y < 0 || y > maps[currentMap].base.length - 1)
        return;
    if (DEVMODE) {
        CURSOR_LOCATION.x = x;
        CURSOR_LOCATION.y = y;
        updateDeveloperInformation();
    }
    renderTileHover({ x: x, y: y }, event);
}
function clickMap(event) {
    var _a, _b, _c, _d;
    if (state.clicked || player.isDead)
        return;
    if (state.invOpen || (event.button != 0 && event.button != 2)) {
        closeInventory();
        return;
    }
    closeTextWindow();
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    const lX = Math.floor(((event.offsetX - baseCanvas.width / 2) + spriteSize / 2) / spriteSize);
    const lY = Math.floor(((event.offsetY - baseCanvas.height / 2) + spriteSize / 2) / spriteSize);
    const x = lX + player.cords.x;
    const y = lY + player.cords.y;
    if (event.button == 2) {
        state.isSelected = false;
        state.abiSelected = {};
        updateUI();
        mapSelection.x = null;
        mapSelection.y = null;
        renderTileHover({ x: x, y: y }, event);
        dontMove = true;
        return;
    }
    1;
    if (dontMove) {
        dontMove = false;
        return;
    }
    itemData.some((item) => {
        if (item.cords.x == x && item.cords.y == y) {
            pickLoot();
            return true;
        }
    });
    maps[currentMap].shrines.some((shrine) => {
        if (shrine.cords.x == x && shrine.cords.y == y) {
            activateShrine();
            return true;
        }
    });
    maps[currentMap].messages.some((msg) => {
        if (msg.cords.x == x && msg.cords.y == y && msg.cords.x === player.cords.x && msg.cords.y === player.cords.y) {
            readMessage();
            return true;
        }
    });
    maps[currentMap].treasureChests.some((chest) => {
        if (chest.cords.x === x && chest.cords.y === y) {
            const lootedChest = lootedChests.find(trs => trs.cords.x == chest.cords.x && trs.cords.y == chest.cords.y && trs.map == chest.map);
            if (chest.cords.x == player.cords.x && chest.cords.y == player.cords.y && !lootedChest) {
                chest.lootChest();
                return true;
            }
        }
    });
    if (player.grave) {
        if (player.grave.cords.x === x && player.grave.cords.y === y) {
            restoreGrave();
        }
    }
    if (!state.textWindowOpen && !state.invOpen) {
        NPCcharacters.some((npc) => {
            if (npc.currentCords.x === x && npc.currentCords.y == y) {
                talkToCharacter();
                return true;
            }
        });
    }
    let move = true;
    let targetingEnemy = false;
    for (let enemy of maps[currentMap].enemies) {
        if (enemy.cords.x == x && enemy.cords.y == y) {
            if (!enemy.alive)
                break;
            targetingEnemy = true;
            if (state.isSelected) {
                // @ts-expect-error
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
            else if (weaponReach(player, player.weapon.range, enemy) && !player.weapon.firesProjectile) {
                // @ts-expect-error
                attackTarget(player, enemy, weaponReach(player, player.weapon.range, enemy));
                if (weaponReach(player, player.weapon.range, enemy) && !player.weapon.firesProjectile) {
                    regularAttack(player, enemy, (_a = player.abilities) === null || _a === void 0 ? void 0 : _a.find(e => e.id == "attack"));
                    advanceTurn();
                }
                // @ts-ignore
            }
            else if (player.weapon.range >= generateArrowPath(player.cords, enemy.cords).length && player.weapon.firesProjectile) {
                // @ts-ignore
                fireProjectile(player.cords, enemy.cords, player.weapon.firesProjectile, (_b = player.abilities) === null || _b === void 0 ? void 0 : _b.find(e => e.id == "attack"), true, player);
            }
            move = false;
            break;
        }
    }
    ;
    if (state.isSelected && ((_c = state.abiSelected) === null || _c === void 0 ? void 0 : _c.aoe_size) > 0 && !targetingEnemy) {
        // @ts-expect-error
        if (generateArrowPath(player.cords, { x: x, y: y }).length <= state.abiSelected.use_range) {
            move = false;
            fireProjectile(player.cords, { x: x, y: y }, state.abiSelected.shoots_projectile, state.abiSelected, true, player);
        }
    }
    if (state.isSelected && state.abiSelected.summon_unit) {
        if (generatePath(player.cords, { x: x, y: y }, player.canFly, true) <= state.abiSelected.use_range) {
            move = false;
            summonUnit(state.abiSelected, { x: x, y: y });
            advanceTurn();
        }
    }
    state.clicked = true;
    setTimeout(() => { state.clicked = false; }, 30);
    if (state.abiSelected.type == "movement" && !player.isRooted()) {
        player.stats.mp -= state.abiSelected.mana_cost;
        state.abiSelected.onCooldown = state.abiSelected.cooldown;
        if (((_d = state.abiSelected.statusesUser) === null || _d === void 0 ? void 0 : _d.length) > 0) {
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
        movePlayer({ x: x, y: y }, true, state.abiSelected.use_range);
    }
    else if (move && !player.isRooted()) {
        if (parseInt(player.carryingWeight()) > parseInt(player.maxCarryWeight())) {
            displayText(`<c>white<c>[WORLD] <c>orange<c>${lang["too_much_weight"]}`);
        }
        else {
            movePlayer({ x: x, y: y });
        }
    }
    else if (player.isRooted()) {
        advanceTurn();
        state.abiSelected = {};
    }
}
const emptyMap = (base_tiles) => new Array(base_tiles.length).fill("0").map(e => new Array(base_tiles[0].length).fill("0"));
function createSightMap(start, size) {
    let _sightMap = JSON.parse(JSON.stringify(sightMap_empty));
    let testiIsonnus = size ** 2;
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    for (let y = 0; y < spriteLimitY; y++) {
        for (let x = 0; x < spriteLimitX; x++) {
            if (Math.abs((x - start.x) + mapOffsetStartX) ** 2 + Math.abs((y - start.y) + mapOffsetStartY) ** 2 < testiIsonnus) {
                if (y + mapOffsetStartY > maps[currentMap].base.length - 1 || y + mapOffsetStartY < 0) {
                    continue;
                }
                if (x + mapOffsetStartX > maps[currentMap].base[0].length - 1 || x + mapOffsetStartX < 0) {
                    continue;
                }
                _sightMap[y + mapOffsetStartY][x + mapOffsetStartX] = "x";
            }
        }
    }
    return _sightMap;
}
function createAOEMap(start, size, ignoreLedge = false) {
    let aoeMap = emptyMap(maps[currentMap].base);
    let testiIsonnus = size ** 2;
    return aoeMap.map((rivi, y) => rivi.map((_, x) => {
        let pass = true;
        if (tiles[maps[currentMap].base[y][x]].isLedge && !ignoreLedge)
            pass = false;
        if (pass && !tiles[maps[currentMap].base[y][x]].isWall && !clutters[maps[currentMap].clutter[y][x]].isWall) {
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
    else if (dir == "rightUp") {
        cord.y--;
        cord.x++;
    }
    else if (dir == "rightDown") {
        cord.y++;
        cord.x++;
    }
    else if (dir == "leftUp") {
        cord.y--;
        cord.x--;
    }
    else if (dir == "leftDown") {
        cord.y++;
        cord.x--;
    }
    return cord;
}
document.addEventListener("keyup", (keyPress) => {
    var _a, _b, _c;
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
        else if (canMove(shittyFix, dirs[keyPress.key]) && rooted) {
            advanceTurn();
            state.abiSelected = {};
        }
        else {
            if (target) {
                // @ts-expect-error
                attackTarget(player, target, weaponReach(player, player.weapon.range, target));
                if (weaponReach(player, player.weapon.range, target)) {
                    regularAttack(player, target, (_c = player.abilities) === null || _c === void 0 ? void 0 : _c.find(e => e.id == "attack"));
                    advanceTurn();
                }
            }
            else {
                state.abiSelected = {};
                advanceTurn();
            }
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
        if (!state.textWindowOpen && !state.invOpen) {
            talkToCharacter();
        }
    }
});
function restoreGrave() {
    if (!player.grave)
        return;
    if (player.cords.x == player.grave.cords.x && player.cords.y == player.grave.cords.y) {
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
            await sleep(15);
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
        advanceTurn();
        state.abiSelected = {};
    }
    else if (action) {
        action();
        advanceTurn();
        state.abiSelected = {};
    }
}
async function moveEnemy(goal, enemy, ability = null, maxRange = 99) {
    // @ts-ignore
    const path = generatePath(enemy.cords, goal, false);
    let count = 0;
    moving: for (let step of path) {
        if (canMoveTo(enemy, step)) {
            await sleep(20);
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
            modifyCanvas();
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
const checkDirs = {
    rightUp: { x1: 0, y1: -1, x2: 1, y2: 0 },
    rightDown: { x1: 1, 1: 0, x2: 0, y2: 1 },
    leftUp: { x1: 0, y1: -1, x2: -1, y2: 0 },
    leftDown: { x1: -1, y1: 0, x2: 0, y2: 1 }
};
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
function renderPlayerOutOfMap(size, canvas, ctx, side = "center", playerModel = player, noClothes = false) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    canvas.width = canvas.width; // Clear canvas
    const sex = playerModel.sex === "male" ? "" : capitalizeFirstLetter(playerModel.sex);
    const bodyModel = document.querySelector(".sprites ." + playerModel.race + "Model" + capitalizeFirstLetter(playerModel.sex));
    const earModel = document.querySelector(".sprites ." + playerModel.race + "Ears");
    const hairModel = document.querySelector(".sprites .hair" + playerModel.hair);
    const eyeModel = document.querySelector(".sprites .eyes" + playerModel.eyes);
    const faceModel = document.querySelector(".sprites .face" + playerModel.face);
    const leggings = document.querySelector(`.sprites .defaultPants${capitalizeFirstLetter(player.sex)}`);
    var x = 0;
    var y = 0;
    if (side == "left")
        x = 0 - size / 4;
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(bodyModel, x, y, size, size);
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(earModel, x, y, size, size);
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(eyeModel, x, y, size, size);
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(faceModel, x, y, size, size);
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(leggings, x, y, size, size);
    if (!((_a = playerModel.helmet) === null || _a === void 0 ? void 0 : _a.coversHair) || noClothes)
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hairModel, x, y, size, size);
    if (!noClothes) {
        if ((_b = playerModel.helmet) === null || _b === void 0 ? void 0 : _b.sprite) {
            const helmetModel = document.querySelector(".sprites ." + playerModel.helmet.sprite + sex);
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(helmetModel, x, y, size, size);
        }
        if ((_c = playerModel.gloves) === null || _c === void 0 ? void 0 : _c.sprite) {
            const glovesModel = document.querySelector(".sprites ." + playerModel.gloves.sprite + sex);
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(glovesModel, x, y, size, size);
        }
        if ((_d = playerModel.boots) === null || _d === void 0 ? void 0 : _d.sprite) {
            const bootsModel = document.querySelector(".sprites ." + playerModel.boots.sprite + sex);
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(bootsModel, x, y, size, size);
        }
        if ((_e = playerModel.legs) === null || _e === void 0 ? void 0 : _e.sprite) {
            const leggingsModel = document.querySelector(".sprites ." + playerModel.legs.sprite + sex);
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(leggingsModel, x, y, size, size);
        }
        else if (!((_f = playerModel.legs) === null || _f === void 0 ? void 0 : _f.sprite) || (player.sex === "female" && !((_g = player.chest) === null || _g === void 0 ? void 0 : _g.sprite))) {
            const leggings = document.querySelector(`.sprites .defaultPants${capitalizeFirstLetter(player.sex)}`);
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(leggings, x, y, size, size);
        }
        if ((_h = playerModel.chest) === null || _h === void 0 ? void 0 : _h.sprite) {
            const chestModel = document.querySelector(".sprites ." + playerModel.chest.sprite + sex);
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(chestModel, x, y, size, size);
        }
    }
    if ((_j = playerModel.weapon) === null || _j === void 0 ? void 0 : _j.sprite) {
        const weaponModel = document.querySelector(".sprites ." + playerModel.weapon.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(weaponModel, x, y, size, size);
    }
    if ((_k = playerModel.offhand) === null || _k === void 0 ? void 0 : _k.sprite) {
        const offhandModel = document.querySelector(".sprites ." + playerModel.offhand.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(offhandModel, x, y, size, size);
    }
}
function renderNPCOutOfMap(size, canvas, ctx, npc, side = "center") {
    canvas.width = canvas.width; // Clear canvas
    const sprite = document.querySelector(".sprites ." + npc.sprite);
    var x = 0;
    var y = 0;
    if (side == "left")
        x = 0 - size / 4;
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(sprite, x, y, size, size);
}
function renderPlayerPortrait() {
    const portrait = document.createElement("div");
    const canvas = document.createElement("canvas");
    canvas.width = 512 * (settings["ui_scale"] / 100);
    canvas.height = 512 * (settings["ui_scale"] / 100);
    const ctx = canvas.getContext("2d");
    portrait.classList.add("playerPortrait");
    renderPlayerOutOfMap(512 * (settings["ui_scale"] / 100), canvas, ctx, "left");
    portrait.append(canvas);
    return portrait;
}
function renderPlayerModel(size, canvas, ctx) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    canvas.width = canvas.width; // Clear canvas
    const sex = player.sex === "male" ? "" : capitalizeFirstLetter(player.sex);
    if (player.isDead)
        return;
    const bodyModel = document.querySelector(".sprites ." + player.race + "Model" + capitalizeFirstLetter(player.sex));
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
    if (!((_a = player.helmet) === null || _a === void 0 ? void 0 : _a.coversHair) || settings["hide_helmet"])
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hairModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    if (((_b = player.helmet) === null || _b === void 0 ? void 0 : _b.sprite) && !settings["hide_helmet"]) {
        const helmetModel = document.querySelector(".sprites ." + player.helmet.sprite + sex);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(helmetModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
    if ((_c = player.gloves) === null || _c === void 0 ? void 0 : _c.sprite) {
        const glovesModel = document.querySelector(".sprites ." + player.gloves.sprite + sex);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(glovesModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
    if ((_d = player.boots) === null || _d === void 0 ? void 0 : _d.sprite) {
        const bootsModel = document.querySelector(".sprites ." + player.boots.sprite + sex);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(bootsModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
    if ((_e = player.legs) === null || _e === void 0 ? void 0 : _e.sprite) {
        const leggingsModel = document.querySelector(".sprites ." + player.legs.sprite + sex);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(leggingsModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
    else if (!((_f = player.legs) === null || _f === void 0 ? void 0 : _f.sprite) || (sex === "Female" && !((_g = player.chest) === null || _g === void 0 ? void 0 : _g.sprite))) {
        const leggings = document.querySelector(`.sprites .defaultPants${capitalizeFirstLetter(player.sex)}`);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(leggings, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
    if ((_h = player.chest) === null || _h === void 0 ? void 0 : _h.sprite) {
        const chestModel = document.querySelector(".sprites ." + player.chest.sprite + sex);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(chestModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
    if ((_j = player.weapon) === null || _j === void 0 ? void 0 : _j.sprite) {
        const weaponModel = document.querySelector(".sprites ." + player.weapon.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(weaponModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
    if ((_k = player.offhand) === null || _k === void 0 ? void 0 : _k.sprite) {
        const offhandModel = document.querySelector(".sprites ." + player.offhand.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(offhandModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
}
function calcDistance(startX, startY, endX, endY) {
    let xDist = Math.abs(endX - startX);
    let yDist = Math.abs(endY - startY);
    return xDist + yDist;
}
function generatePath(start, end, canFly, distanceOnly = false, retreatPath = 0) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    var distance = Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
    if (distanceOnly) {
        let newDistance = distance;
        if ((Math.abs(start.x - end.x) == Math.abs(start.y - end.y)) && distance < 3)
            newDistance = Math.round(newDistance / 2);
        return newDistance;
    }
    if (end.x < 0 || end.x > maps[currentMap].base[0].length - 1 || end.y < 0 || end.y > maps[currentMap].base.length - 1)
        return;
    let fieldMap;
    if (canFly)
        fieldMap = JSON.parse(JSON.stringify(staticMap_flying));
    else
        fieldMap = JSON.parse(JSON.stringify(staticMap_normal));
    if (start.x !== player.cords.x && start.y !== player.cords.y) {
        fieldMap[player.cords.y][player.cords.x] = 1;
        combatSummons.forEach(summon => {
            if (summon.cords.x !== start.x && summon.cords.y !== start.y) {
                fieldMap[summon.cords.y][summon.cords.x] = 1;
            }
        });
    }
    maps[currentMap].enemies.forEach((enemy) => { if (!(start.x == enemy.cords.x && start.y == enemy.cords.y)) {
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
    fieldMap[start.y][start.x] = 0;
    fieldMap[end.y][end.x] = 5;
    let calls = 0;
    let maximumCalls = 2000;
    const checkGrid = [{ v: 5, x: end.x, y: end.y }];
    while (fieldMap[start.y][start.x] == 0 && checkGrid.length > 0 && calls < maximumCalls) {
        const { v, x, y } = checkGrid.splice(0, 1)[0];
        if (fieldMap[y][x] == v) {
            // Check diagonal
            // North-west
            if (((_a = fieldMap[y - 1]) === null || _a === void 0 ? void 0 : _a[x - 1]) === 0 && (((_b = fieldMap[y]) === null || _b === void 0 ? void 0 : _b[x - 1]) === 0 || ((_c = fieldMap[y - 1]) === null || _c === void 0 ? void 0 : _c[x]) === 0)) {
                fieldMap[y - 1][x - 1] = v + 1;
                checkGrid.push({ v: v + 1, x: x - 1, y: y - 1, dist: calcDistance(x - 1, y - 1, start.x, start.y) });
            }
            // North-east
            if (((_d = fieldMap[y - 1]) === null || _d === void 0 ? void 0 : _d[x + 1]) === 0 && (((_e = fieldMap[y]) === null || _e === void 0 ? void 0 : _e[x + 1]) === 0 || ((_f = fieldMap[y - 1]) === null || _f === void 0 ? void 0 : _f[x]) === 0)) {
                fieldMap[y - 1][x + 1] = v + 1;
                checkGrid.push({ v: v + 1, x: x + 1, y: y - 1, dist: calcDistance(x + 1, y - 1, start.x, start.y) });
            }
            // South-west
            if (((_g = fieldMap[y + 1]) === null || _g === void 0 ? void 0 : _g[x - 1]) === 0 && (((_h = fieldMap[y]) === null || _h === void 0 ? void 0 : _h[x - 1]) === 0 || ((_j = fieldMap[y + 1]) === null || _j === void 0 ? void 0 : _j[x]) === 0)) {
                fieldMap[y + 1][x - 1] = v + 1;
                checkGrid.push({ v: v + 1, x: x - 1, y: y + 1, dist: calcDistance(x - 1, y + 1, start.x, start.y) });
            }
            // South-east
            if (((_k = fieldMap[y + 1]) === null || _k === void 0 ? void 0 : _k[x + 1]) === 0 && (((_l = fieldMap[y]) === null || _l === void 0 ? void 0 : _l[x + 1]) === 0 || ((_m = fieldMap[y + 1]) === null || _m === void 0 ? void 0 : _m[x]) === 0)) {
                fieldMap[y + 1][x + 1] = v + 1;
                checkGrid.push({ v: v + 1, x: x + 1, y: y + 1, dist: calcDistance(x + 1, y + 1, start.x, start.y) });
            }
            if (((_o = fieldMap[y - 1]) === null || _o === void 0 ? void 0 : _o[x]) === 0) {
                fieldMap[y - 1][x] = v + 1;
                checkGrid.push({ v: v + 1, x: x, y: y - 1, dist: calcDistance(x, y - 1, start.x, start.y) });
            }
            if (((_p = fieldMap[y + 1]) === null || _p === void 0 ? void 0 : _p[x]) === 0) {
                fieldMap[y + 1][x] = v + 1;
                checkGrid.push({ v: v + 1, x: x, y: y + 1, dist: calcDistance(x, y + 1, start.x, start.y) });
            }
            if (((_q = fieldMap[y]) === null || _q === void 0 ? void 0 : _q[x - 1]) === 0) {
                fieldMap[y][x - 1] = v + 1;
                checkGrid.push({ v: v + 1, x: x - 1, y: y, dist: calcDistance(x - 1, y, start.x, start.y) });
            }
            if (((_r = fieldMap[y]) === null || _r === void 0 ? void 0 : _r[x + 1]) === 0) {
                fieldMap[y][x + 1] = v + 1;
                checkGrid.push({ v: v + 1, x: x + 1, y: y, dist: calcDistance(x + 1, y, start.x, start.y) });
            }
        }
        checkGrid.sort((a, b) => {
            return a.dist - b.dist;
        });
        calls++;
    }
    const data = {
        x: start.x,
        y: start.y
    };
    const cords = [];
    siksakki: for (let i = 0; i < 375; i++) {
        const v = fieldMap[data.y][data.x] - 1;
        if (((_s = fieldMap[data.y]) === null || _s === void 0 ? void 0 : _s[data.x - 1]) == v)
            data.x -= 1;
        else if (((_t = fieldMap[data.y]) === null || _t === void 0 ? void 0 : _t[data.x + 1]) == v)
            data.x += 1;
        else if (((_u = fieldMap[data.y - 1]) === null || _u === void 0 ? void 0 : _u[data.x]) == v)
            data.y -= 1;
        else if (((_v = fieldMap[data.y + 1]) === null || _v === void 0 ? void 0 : _v[data.x]) == v)
            data.y += 1;
        else if (((_w = fieldMap[data.y - 1]) === null || _w === void 0 ? void 0 : _w[data.x - 1]) == v) {
            data.y -= 1;
            data.x -= 1;
        }
        else if (((_x = fieldMap[data.y - 1]) === null || _x === void 0 ? void 0 : _x[data.x + 1]) == v) {
            data.y -= 1;
            data.x += 1;
        }
        else if (((_y = fieldMap[data.y + 1]) === null || _y === void 0 ? void 0 : _y[data.x - 1]) == v) {
            data.y += 1;
            data.x -= 1;
        }
        else if (((_z = fieldMap[data.y + 1]) === null || _z === void 0 ? void 0 : _z[data.x + 1]) == v) {
            data.y += 1;
            data.x += 1;
        }
        if (fieldMap[data.y][data.x] == v)
            cords.push(Object.assign({}, data));
        if (data.y == end.y && data.x == end.x)
            break siksakki;
    }
    fieldMap = null;
    return cords;
}
function arrowHitsTarget(start, end, isSummon = false) {
    let path = generateArrowPath(start, end);
    let hits = true;
    path.forEach((step) => {
        if (step.enemy && !isSummon) {
            hits = false;
            return;
        }
        if (step.blocked && !step.player && !isSummon && !step.summon) {
            hits = false;
            return;
        }
        if (step.blocked && !step.enemy && isSummon) {
            hits = false;
            return;
        }
    });
    return hits;
}
function generateArrowPath(start, end, distanceOnly = false) {
    const distX = Math.abs(start.x - end.x) + 1;
    const distY = Math.abs(start.y - end.y) + 1;
    if (distanceOnly)
        return distX + distY;
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
        player: false,
        summon: false
    };
    const finalPath = [Object.assign({}, arrow)];
    var rounderX = negativeX ? Math.ceil : Math.floor;
    var rounderY = negativeY ? Math.ceil : Math.floor;
    for (let i = 0; i < 100; i++) {
        arrow.x += ratioX2;
        arrow.y += ratioY2;
        var tile = { x: rounderX(arrow.x), y: rounderY(arrow.y) };
        if (tile.y > maps[currentMap].base.length || tile.y < 0)
            continue;
        if (tile.x > maps[currentMap].base[0].length || tile.x < 0)
            continue;
        if (tiles[maps[currentMap].base[tile.y][tile.x]].isWall || clutters[maps[currentMap].clutter[tile.y][tile.x]].isWall)
            arrow.blocked = true;
        maps[currentMap].enemies.forEach((enemy) => {
            if (enemy.cords.x == start.x && enemy.cords.y == start.y)
                return;
            if (enemy.cords.x == tile.x && enemy.cords.y == tile.y) {
                arrow.enemy = true;
                arrow.blocked = true;
            }
            ;
        });
        combatSummons.forEach(summon => {
            if (summon.cords.x == start.x && summon.cords.y == start.y)
                return;
            if (summon.cords.x == tile.x && summon.cords.y == tile.y) {
                arrow.summon = true;
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
function modifyCanvas(createNewSightMap = false) {
    const layers = Array.from(document.querySelectorAll("canvas.layer"));
    moveMinimap();
    moveAreaMap();
    for (let canvas of layers) {
        // @ts-ignore
        canvas.width = innerWidth;
        // @ts-ignore
        canvas.height = innerHeight;
    }
    // @ts-ignore
    renderMap(maps[currentMap], createNewSightMap);
}
var highestWaitTime = 0;
/* Move to state file later */
async function advanceTurn() {
    if (player.isDead)
        return;
    if (DEVMODE)
        updateDeveloperInformation();
    if (state.inCombat)
        displayText("<c>white<c>[WORLD]: <c>yellow<c>-----Turn change-----");
    state.inCombat = false;
    state.abiSelected = {};
    state.isSelected = false;
    turnOver = false;
    enemiesHadTurn = 0;
    var map = maps[currentMap];
    hideMapHover();
    const pRegen = player.getRegen();
    player.stats.hp += pRegen["hp"];
    player.stats.mp += pRegen["mp"];
    combatSummons.forEach(summon => {
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
        summon.updateStatModifiers();
        summon.updateAbilities();
        summon.decideAction();
        summon.effects();
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
        ;
        if (closestEnemyDistance < 0)
            closestEnemyDistance = enemy.distToPlayer();
        else if (distToPlayer < closestEnemyDistance)
            closestEnemyDistance = enemy.distToPlayer();
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
    updateUI();
    document.querySelector(".closestEnemyDistance").textContent = lang["closest_enemy"] + closestEnemyDistance;
    showInteractPrompt();
    setTimeout(modifyCanvas, 500);
    updateUI();
    if (map.enemies.length == 0)
        turnOver = true;
    if (player.stats.hp > player.getHpMax()) {
        player.stats.hp = player.getHpMax();
    }
    if (player.stats.mp > player.getMpMax()) {
        player.stats.mp = player.getMpMax();
    }
}
function showInteractPrompt() {
    const interactPrompt = document.querySelector(".interactPrompt");
    let foundPrompt = false;
    let interactKey = settings["hotkey_interact"] == " " ? lang["space_key"] : settings["hotkey_interact"].toUpperCase();
    interactPrompt.textContent = "";
    itemData.some((itm) => {
        if (itm.cords.x == player.cords.x && itm.cords.y == player.cords.y) {
            foundPrompt = true;
            interactPrompt.textContent = `[${interactKey}] ` + lang["pick_item"];
        }
    });
    if (!foundPrompt) {
        maps[currentMap].treasureChests.some((chest) => {
            if (chest.cords.x == player.cords.x && chest.cords.y == player.cords.y && chest.loot.length > 0) {
                foundPrompt = true;
                interactPrompt.textContent = `[${interactKey}] ` + lang["pick_chest"];
            }
        });
    }
    if (!foundPrompt) {
        maps[currentMap].messages.some((msg) => {
            if (msg.cords.x == player.cords.x && msg.cords.y == player.cords.y) {
                foundPrompt = true;
                interactPrompt.textContent = `[${interactKey}] ` + lang["read_msg"];
            }
        });
    }
    if (!foundPrompt) {
        NPCcharacters.some((npc) => {
            let dist = calcDistance(player.cords.x, player.cords.y, npc.currentCords.x, npc.currentCords.y);
            if (dist < 3) {
                foundPrompt = true;
                interactPrompt.textContent = `[${interactKey}] ` + lang["talk_to_npc"] + ` ${lang[npc.id + "_name"]}`;
            }
        });
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
    const enemyStats = enemy.getStats();
    const enemyMiscStats = enemy.getHitchance();
    var mainStatText = "";
    mainStatText += `<f>20px<f><i>${icons.health_icon}<i>${lang["health"]}: ${Math.floor(enemy.stats.hp)}/${enemy.getHpMax()}\n`;
    mainStatText += `<f>20px<f><i>${icons.mana_icon}<i>${lang["mana"]}: ${Math.floor(enemy.stats.mp)}/${enemy.getMpMax()}\n`;
    mainStatText += `<f>20px<f><i>${icons.str_icon}<i>${lang["str"]}: ${enemyStats.str}\n`;
    mainStatText += `<f>20px<f><i>${icons.dex_icon}<i>${lang["dex"]}: ${enemyStats.dex}\n`;
    mainStatText += `<f>20px<f><i>${icons.vit_icon}<i>${lang["vit"]}: ${enemyStats.vit}\n`;
    mainStatText += `<f>20px<f><i>${icons.int_icon}<i>${lang["int"]}: ${enemyStats.int}\n`;
    mainStatText += `<f>20px<f><i>${icons.cun_icon}<i>${lang["cun"]}: ${enemyStats.cun}\n`;
    mainStatText += `<f>20px<f><i>${icons.hitChance}<i>${lang["hitChance"]}: ${enemyMiscStats.chance}\n`;
    mainStatText += `<f>20px<f><i>${icons.evasion}<i>${lang["evasion"]}: ${enemyMiscStats.evasion}\n`;
    let enTotalDmg = enemy.trueDamage();
    mainStatText += `<f>20px<f><i>${icons.damage}<i>${lang["damage"]}: ${enTotalDmg.total}(`;
    Object.entries(enTotalDmg.split).forEach((res) => {
        const key = res[0];
        const val = res[1];
        mainStatText += `<f>20px<f><i>${icons[key + "_icon"]}<i>${val}`;
    });
    mainStatText += "<c>white<c>)\n";
    const mainStats = textSyntax(mainStatText);
    var resists = `<f>20px<f><i>${icons.resistAll_icon}<i>${lang["resistance"]}\n`;
    Object.entries(enemy.getResists()).forEach((res) => {
        const key = res[0];
        const val = res[1];
        resists += `<f>20px<f><i>${icons[key + "Resist" + "_icon"]}<i>${lang[key]} ${val}%\n`;
    });
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
    maps[currentMap].shrines.forEach((shrine) => {
        if (shrine.cords.x == player.cords.x && shrine.cords.y == player.cords.y && !state.inCombat) {
            if (!(player.usedShrines.find((used) => used.cords.x == shrine.cords.x && used.cords.y == shrine.cords.y && used.map == currentMap))) {
                player.stats.hp = player.getHpMax();
                player.stats.mp = player.getMpMax();
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
function resetAllLivingEnemiesInAllMaps() {
    maps.forEach((map) => {
        map.enemies.forEach((enemy) => {
            enemy.restore();
        });
    });
}
function useAbiTargetingWithKeyboard() {
    var _a, _b, _c, _d;
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
            else if (weaponReach(player, player.weapon.range, enemy) && !player.weapon.firesProjectile) {
                // @ts-expect-error
                attackTarget(player, enemy, weaponReach(player, player.weapon.range, enemy));
                if (weaponReach(player, player.weapon.range, enemy) && !player.weapon.firesProjectile) {
                    regularAttack(player, enemy, (_a = player.abilities) === null || _a === void 0 ? void 0 : _a.find(e => e.id == "attack"));
                    advanceTurn();
                }
                // @ts-ignore
            }
            else if (player.weapon.range >= generateArrowPath(player.cords, enemy.cords).length && player.weapon.firesProjectile) {
                // @ts-ignore
                fireProjectile(player.cords, enemy.cords, player.weapon.firesProjectile, (_b = player.abilities) === null || _b === void 0 ? void 0 : _b.find(e => e.id == "attack"), true, player);
            }
            break;
        }
    }
    ;
    if (state.isSelected && ((_c = state.abiSelected) === null || _c === void 0 ? void 0 : _c.aoe_size) > 0 && !targetingEnemy) {
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
        if (((_d = state.abiSelected.statusesUser) === null || _d === void 0 ? void 0 : _d.length) > 0) {
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
// This should be called once when entering a new map.
// It returns nothing, instead updating 2 existing variables.
let staticMap_normal = [];
let staticMap_flying = [];
let sightMap_empty = [];
function createStaticMap() {
    staticMap_normal = maps[currentMap].base.map((yv, y) => yv.map((xv, x) => {
        if (tiles[xv].isWall || tiles[xv].isLedge)
            return 1;
        return 0;
    }));
    maps[currentMap].clutter.forEach((yv, y) => yv.map((xv, x) => {
        if (clutters[xv].isWall)
            staticMap_normal[y][x] = 1;
    }));
    staticMap_flying = maps[currentMap].base.map((yv, y) => yv.map((xv, x) => {
        if (tiles[xv].isWall)
            return 1;
        return 0;
    }));
    maps[currentMap].clutter.forEach((yv, y) => yv.map((xv, x) => {
        if (clutters[xv].isWall)
            staticMap_flying[y][x] = 1;
    }));
    sightMap_empty = emptyMap(maps[currentMap].base);
}
//# sourceMappingURL=map.js.map