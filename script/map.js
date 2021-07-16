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
const zoomLevels = [0.75, 1, 1.25, 1.5];
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
window.addEventListener("resize", modifyCanvas);
(_a = document.querySelector(".main")) === null || _a === void 0 ? void 0 : _a.addEventListener('contextmenu', event => event.preventDefault());
function spriteVariables() {
    const spriteSize = 128 * zoomLevels[currentZoom];
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
            const clutterId = (_d = (_c = map.clutter) === null || _c === void 0 ? void 0 : _c[mapOffsetStartY + y]) === null || _d === void 0 ? void 0 : _d[mapOffsetStartX + x];
            const fog = document.querySelector(".tileNoVision");
            if (img) {
                baseCtx.drawImage(img, x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, spriteSize, spriteSize);
                //baseCtx.strokeRect(x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, spriteSize, spriteSize);
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
            mapDataCtx === null || mapDataCtx === void 0 ? void 0 : mapDataCtx.drawImage(itemImg, (tileX + spriteSize * item.mapCords.xMod), (tileY + spriteSize * item.mapCords.yMod), spriteSize / 3, spriteSize / 3);
        };
    });
    /* Render Player */
    renderPlayerModel(spriteSize, playerCanvas, playerCtx);
}
function renderTileHover(tile) {
    var _a;
    if (!baseCtx)
        throw new Error("2D context from base canvas is missing!");
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    var tileX = (tile.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    var tileY = (tile.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
    playerCanvas.width = playerCanvas.width;
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
        if (abiSelected.type == "movement") {
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
        else if (((abiSelected === null || abiSelected === void 0 ? void 0 : abiSelected.shoots_projectile) && isSelected) || (((_a = player.weapon) === null || _a === void 0 ? void 0 : _a.firesProjectile) && !isSelected)) {
            const path = generateArrowPath({ x: player.cords.x, y: player.cords.y }, tile);
            var highlightImg = document.querySelector(".sprites .tileHIGHLIGHT");
            var highlightRedImg = document.querySelector(".sprites .tileHIGHLIGHT_RED");
            let distance = isSelected ? abiSelected.use_range : player.weapon.range;
            let iteration = 0;
            path.forEach((step) => {
                iteration++;
                if (step.x == player.cords.x && step.y == player.cords.y)
                    return;
                var _tileX = (step.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
                var _tileY = (step.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
                if (step.blocked || iteration > distance) {
                    playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(highlightRedImg, _tileX, _tileY, spriteSize, spriteSize);
                }
                else
                    playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(highlightImg, _tileX, _tileY, spriteSize, spriteSize);
            });
        }
        playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(strokeImg, tileX, tileY, spriteSize, spriteSize);
    }
    catch (_b) { }
}
function mapHover(event) {
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    const lX = Math.floor(((event.offsetX - baseCanvas.width / 2) + spriteSize / 2) / spriteSize);
    const lY = Math.floor(((event.offsetY - baseCanvas.height / 2) + spriteSize / 2) / spriteSize);
    const x = lX + player.cords.x;
    const y = lY + player.cords.y;
    if (x < 0 || x > maps[currentMap].base[0].length - 1 || y < 0 || y > maps[currentMap].base.length - 1)
        return;
    renderTileHover({ x: x, y: y });
}
function clickMap(event) {
    var _a, _b;
    if (state.clicked)
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
        renderTileHover({ x: x, y: y });
        return;
    }
    if (x == player.cords.x && y == player.cords.y)
        console.log("You clicked on yourself!");
    let move = true;
    for (let enemy of maps[currentMap].enemies) {
        if (enemy.cords.x == x && enemy.cords.y == y) {
            if (!enemy.alive)
                break;
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
document.addEventListener("keydown", (keyPress) => {
    let dirs = { w: "up", s: "down", a: "left", d: "right" };
    let shittyFix = JSON.parse(JSON.stringify(player));
    if (keyPress.key == "w" && canMove(player, "up")) {
        player.cords.y--;
    }
    else if (keyPress.key == "s" && canMove(player, "down")) {
        player.cords.y++;
    }
    else if (keyPress.key == "a" && canMove(player, "left")) {
        player.cords.x--;
    }
    else if (keyPress.key == "d" && canMove(player, "right")) {
        player.cords.x++;
    }
    if (keyPress.key == "w" || keyPress.key == "s" || keyPress.key == "a" || keyPress.key == "d") {
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
    }
});
document.addEventListener("keyup", (kbe) => {
    // Believe it or not, this is the space key!
    if (kbe.key == " ") {
        pickLoot();
    }
});
async function movePlayer(goal, ability = false, maxRange = 99, action = null) {
    if (goal.x < 0 || goal.x > maps[currentMap].base[0].length - 1 || goal.y < 0 || goal.y > maps[currentMap].base.length - 1)
        return;
    const path = generatePath(player.cords, goal, false);
    let count = 0;
    isSelected = false;
    moving: for (let step of path) {
        if (canMoveTo(player, step)) {
            await sleep(45);
            player.cords.x = step.x;
            player.cords.y = step.y;
            modifyCanvas();
            if (!ability) {
                player.effects();
                advanceTurn();
                updateUI();
            }
            count++;
            if (state.inCombat && !ability || count > maxRange && ability)
                break moving;
        }
    }
    if (!ability) {
        if (count > 0)
            displayText(`<c>green<c>[MOVEMENT]<c>white<c> Ran for ${count} turn(s).`);
        if (state.inCombat && count == 1) {
            console.log(Math.floor(player.hpRegen() * 0.5) > 0);
            if (Math.floor(player.hpRegen() * 0.5) > 0)
                displayText(`<c>white<c>[PASSIVE] <c>lime<c>Recovered ${Math.floor(player.hpRegen() * 0.5)} HP.`);
        }
        else if (state.inCombat && count > 1) {
            let regen = Math.floor(player.hpRegen() * count - 1) + Math.floor(player.hpRegen() * 0.5);
            displayText(`<c>white<c>[PASSIVE] <c>lime<c>Recovered ${regen} HP.`);
            displayText(`<c>green<c>[MOVEMENT] <c>orange<c>Stopped moving due to encontering an enemy.`);
        }
        else if (count > 0) {
            displayText(`<c>white<c>[PASSIVE] <c>lime<c>Recovered ${Math.floor(player.hpRegen() * count)} HP.`);
        }
    }
    else if (!action) {
        advanceTurn();
        updateUI();
        abiSelected = {};
    }
    else if (action) {
        action();
        advanceTurn();
        updateUI();
        abiSelected = {};
    }
}
function canMove(char, dir) {
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
function renderPlayerOutOfMap(size, canvas, ctx, side = "center") {
    var _a, _b, _c, _d, _e;
    canvas.width = canvas.width; // Clear canvas
    const bodyModel = document.querySelector(".sprites ." + player.race + "Model");
    const earModel = document.querySelector(".sprites ." + player.race + "Ears");
    const hairModel = document.querySelector(".sprites .hair" + player.hair);
    const eyeModel = document.querySelector(".sprites .eyes" + player.eyes);
    const faceModel = document.querySelector(".sprites .face" + player.face);
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
    if ((_a = player.chest) === null || _a === void 0 ? void 0 : _a.sprite) {
        const chestModel = document.querySelector(".sprites ." + player.chest.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(chestModel, x, y, size, size);
    }
    if ((_b = player.helmet) === null || _b === void 0 ? void 0 : _b.sprite) {
        const helmetModel = document.querySelector(".sprites ." + player.helmet.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(helmetModel, x, y, size, size);
    }
    if ((_c = player.gloves) === null || _c === void 0 ? void 0 : _c.sprite) {
        const glovesModel = document.querySelector(".sprites ." + player.gloves.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(glovesModel, x, y, size, size);
    }
    if ((_d = player.boots) === null || _d === void 0 ? void 0 : _d.sprite) {
        const bootsModel = document.querySelector(".sprites ." + player.boots.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(bootsModel, x, y, size, size);
    }
    if ((_e = player.weapon) === null || _e === void 0 ? void 0 : _e.sprite) {
        const weaponModel = document.querySelector(".sprites ." + player.weapon.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(weaponModel, x, y, size, size);
    }
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hairModel, x, y, size, size);
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
    var _a, _b, _c, _d, _e;
    canvas.width = canvas.width; // Clear canvas
    const bodyModel = document.querySelector(".sprites ." + player.race + "Model");
    const earModel = document.querySelector(".sprites ." + player.race + "Ears");
    const hairModel = document.querySelector(".sprites .hair" + player.hair);
    const eyeModel = document.querySelector(".sprites .eyes" + player.eyes);
    const faceModel = document.querySelector(".sprites .face" + player.face);
    const leggings = document.querySelector(".sprites .defaultPants");
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
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(leggings, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    if ((_a = player.chest) === null || _a === void 0 ? void 0 : _a.sprite) {
        const chestModel = document.querySelector(".sprites ." + player.chest.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(chestModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
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
    if ((_e = player.weapon) === null || _e === void 0 ? void 0 : _e.sprite) {
        const weaponModel = document.querySelector(".sprites ." + player.weapon.sprite);
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(weaponModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hairModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
}
function generatePath(start, end, canFly, distanceOnly = false) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
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
    fieldMap[end.y][end.x] = 5;
    if (distanceOnly) {
        let newDistance = distance;
        if (Math.abs(start.x - end.x) == Math.abs(start.y - end.y))
            newDistance = Math.round(newDistance / 2);
        return newDistance;
    }
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
    const data = {
        x: start.x,
        y: start.y
    };
    const cords = [];
    siksakki: for (let i = 0; i < 500; i++) {
        const v = fieldMap[data.y][data.x] - 1;
        if (i % 2 == 0) {
            if (((_e = fieldMap[data.y]) === null || _e === void 0 ? void 0 : _e[data.x - 1]) == v)
                data.x -= 1;
            if (((_f = fieldMap[data.y]) === null || _f === void 0 ? void 0 : _f[data.x + 1]) == v)
                data.x += 1;
        }
        else {
            if (((_g = fieldMap[data.y - 1]) === null || _g === void 0 ? void 0 : _g[data.x]) == v)
                data.y -= 1;
            if (((_h = fieldMap[data.y + 1]) === null || _h === void 0 ? void 0 : _h[data.x]) == v)
                data.y += 1;
        }
        if (fieldMap[data.y][data.x] == v)
            cords.push(Object.assign({}, data));
        if (data.y == end.y && data.x == end.x)
            break siksakki;
    }
    return cords;
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
function advanceTurn() {
    player.updateAbilities();
    state.inCombat = false;
    var map = maps[currentMap];
    hideMapHover();
    map.enemies.forEach(enemy => {
        if (!enemy.alive)
            return;
        // @ts-ignore
        if (enemy.aggro()) {
            state.inCombat = true;
            enemy.updateAbilities();
            enemy.decideAction();
        }
        enemy.effects();
    });
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
    staticHover.textContent = "";
    staticHover.style.display = "block";
    const name = document.createElement("p");
    name.classList.add("enemyName");
    name.textContent = enemy.name;
    var mainStatText = "";
    // @ts-ignore
    mainStatText += `<f>20px<f><i>${icons.health_icon}<i>Health: ${enemy.stats.hp}/${enemy.getStats().hpMax}\n`;
    // @ts-ignore
    mainStatText += `<f>20px<f><i>${icons.mana_icon}<i>Mana: ${enemy.stats.mp}/${enemy.getStats().mpMax}\n`;
    // @ts-expect-error
    const mainStats = textSyntax(mainStatText);
    staticHover.append(name, mainStats);
}
/* Hide map hover */
function hideMapHover() {
    staticHover.textContent = "";
    staticHover.style.display = "none";
}
