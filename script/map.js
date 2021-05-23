"use strict";
const baseCanvas = document.querySelector(".canvasLayers .baseSheet");
const baseCtx = baseCanvas.getContext("2d");
const playerCanvas = document.querySelector(".canvasLayers .playerSheet");
const playerCtx = playerCanvas.getContext("2d");
const enemyLayers = document.querySelector(".canvasLayers .enemyLayers");
const projectileLayers = document.querySelector(".canvasLayers .projectileLayers");
const staticHover = document.querySelector(".mapHover");
baseCanvas.addEventListener("mousemove", mapHover);
baseCanvas.addEventListener("click", clickMap);
var currentMap = 0;
const zoomLevels = [0.75, 1, 1.25, 1.5];
var currentZoom = 1;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/* Move this to a state file later */
const state = {
    inCombat: false,
};
/* temporarily store highlight variables here */
const highlight = {
    x: 0,
    y: 0
};
window.addEventListener("resize", modifyCanvas);
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
    var _a, _b, _c, _d;
    baseCanvas.width = baseCanvas.width; // Clears the canvas
    if (!baseCtx)
        throw new Error("2D context from base canvas is missing!");
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    /* Render the base layer */
    for (let y = 0; y < spriteLimitY; y++) {
        for (let x = 0; x < spriteLimitX; x++) {
            const imgId = (_b = (_a = map.base) === null || _a === void 0 ? void 0 : _a[mapOffsetStartY + y]) === null || _b === void 0 ? void 0 : _b[mapOffsetStartX + x];
            const img = document.querySelector(`.sprites .tile${imgId !== undefined ? imgId : "VOID"}`);
            const clutterId = (_d = (_c = map.clutter) === null || _c === void 0 ? void 0 : _c[mapOffsetStartY + y]) === null || _d === void 0 ? void 0 : _d[mapOffsetStartX + x];
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
        }
    }
    /* Render Enemies */
    enemyLayers.textContent = ""; // Delete enemy canvases
    map.enemies.forEach((enemy, index) => {
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
        if (enemyImg) {
            /* Render hp bar */
            const hpbg = document.querySelector(".hpBg");
            const hpbar = document.querySelector(".hpBar");
            const hpborder = document.querySelector(".hpBorder");
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hpbg, tileX, tileY, spriteSize, spriteSize);
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hpbar, tileX, tileY, enemy.statRemaining("hp") * spriteSize / 100, spriteSize);
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hpborder, tileX, tileY, spriteSize, spriteSize);
            /* Render enemy on top of hp bar */
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(enemyImg, tileX, tileY, spriteSize, spriteSize);
        }
        enemyLayers.append(canvas);
    });
    /* Render Player */
    renderPlayerModel(spriteSize);
}
function renderTileHover(tile) {
    if (!baseCtx)
        throw new Error("2D context from base canvas is missing!");
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    var tileX = (tile.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    var tileY = (tile.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
    playerCanvas.width = playerCanvas.width;
    try {
        /* Render tile */
        var strokeImg = document.querySelector(".sprites .hoverTile");
        renderPlayerModel(spriteSize);
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
        /* Render highlight test */
        const path = generateArrowPath({ x: player.cords.x, y: player.cords.y }, tile);
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
        playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(strokeImg, tileX, tileY, spriteSize, spriteSize);
    }
    catch (_a) { }
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
    var _a;
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    const lX = Math.floor(((event.offsetX - baseCanvas.width / 2) + spriteSize / 2) / spriteSize);
    const lY = Math.floor(((event.offsetY - baseCanvas.height / 2) + spriteSize / 2) / spriteSize);
    const x = lX + player.cords.x;
    const y = lY + player.cords.y;
    if (x == player.cords.x && y == player.cords.y)
        console.log("You clicked on yourself!");
    let move = true;
    for (let enemy of maps[currentMap].enemies) {
        if (enemy.cords.x == x && enemy.cords.y == y) {
            if (!enemy.alive)
                break;
            // @ts-expect-error
            if (weaponReach(player, player.weapon.range, enemy)) {
                // @ts-expect-error
                attackTarget(player, enemy, weaponReach(player, player.weapon.range, enemy));
                // @ts-expect-error
                if (weaponReach(player, player.weapon.range, enemy)) {
                    // @ts-expect-error
                    regularAttack(player, enemy, (_a = player.abilities) === null || _a === void 0 ? void 0 : _a.find(e => e.id == "attack"));
                    advanceTurn();
                }
                // @ts-ignore
            }
            else if (player.weapon.range >= generateArrowPath(player.cords, enemy.cords, true) && player.weapon.firesProjectile) {
                // @ts-ignore
                fireProjectile(player.cords, enemy.cords, player.weapon.firesProjectile, a => { var _a; return regularAttack(player, enemy, (_a = player.abilities) === null || _a === void 0 ? void 0 : _a.find(e => e.id == "attack")); });
                // const time: number = generatePath(player.cords, enemy.cords, true, true);
                // setTimeout(() => {
                //   // @ts-expect-error
                //   regularAttack(player, enemy, player.abilities?.find(e => e.id == "attack"));
                //   advanceTurn();
                // }, time * 70);
            }
            move = false;
            break;
        }
    }
    ;
    if (move)
        movePlayer({ x: x, y: y });
}
// document.addEventListener("keydown", (keyPress) => {
//   if (keyPress.key == "w" && canMove(player, "up")) player.cords.y--;
//   else if (keyPress.key == "s" && canMove(player, "down")) player.cords.y++;
//   else if (keyPress.key == "a" && canMove(player, "left")) player.cords.x--;
//   else if (keyPress.key == "d" && canMove(player, "right")) player.cords.x++;
//   if(keyPress.key == "w" || keyPress.key == "s" || keyPress.key == "a" || keyPress.key == "d") {
//      // @ts-ignore
//     renderMap(maps[currentMap]);
//     advanceTurn();
//   }
// });
async function movePlayer(goal) {
    if (goal.x < 0 || goal.x > maps[currentMap].base[0].length - 1 || goal.y < 0 || goal.y > maps[currentMap].base.length - 1)
        return;
    const path = generatePath(player.cords, goal, false);
    moving: for (let step of path) {
        if (canMoveTo(player, step)) {
            await sleep(45);
            player.cords.x = step.x;
            player.cords.y = step.y;
            modifyCanvas();
            advanceTurn();
            updateUI();
            if (state.inCombat)
                break moving;
        }
    }
}
function canMove(char, dir) {
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
    for (let enemy of maps[currentMap].enemies) {
        if (enemy.cords.x == tile.x && enemy.cords.y == tile.y)
            movable = false;
    }
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
    return movable;
}
function renderPlayerModel(size) {
    var _a, _b, _c, _d, _e;
    playerCanvas.width = playerCanvas.width; // Clear canvas
    const bodyModel = document.querySelector(".sprites ." + player.race + "Model");
    const earModel = document.querySelector(".sprites ." + player.race + "Ears");
    const hairModel = document.querySelector(".sprites .hair" + player.hair);
    const eyeModel = document.querySelector(".sprites .eyes" + player.eyes);
    const faceModel = document.querySelector(".sprites .face" + player.face);
    const leggings = document.querySelector(".sprites .defaultPants");
    playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(bodyModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(earModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(eyeModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(faceModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(leggings, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    // @ts-expect-error
    if ((_a = player.chest) === null || _a === void 0 ? void 0 : _a.sprite) {
        // @ts-expect-error
        const chestModel = document.querySelector(".sprites ." + player.chest.sprite);
        playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(chestModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
    // @ts-expect-error
    if ((_b = player.helmet) === null || _b === void 0 ? void 0 : _b.sprite) {
        // @ts-expect-error
        const helmetModel = document.querySelector(".sprites ." + player.helmet.sprite);
        playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(helmetModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
    // @ts-expect-error
    if ((_c = player.gloves) === null || _c === void 0 ? void 0 : _c.sprite) {
        // @ts-expect-error
        const glovesModel = document.querySelector(".sprites ." + player.gloves.sprite);
        playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(glovesModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
    // @ts-expect-error
    if ((_d = player.boots) === null || _d === void 0 ? void 0 : _d.sprite) {
        // @ts-expect-error
        const bootsModel = document.querySelector(".sprites ." + player.boots.sprite);
        playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(bootsModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
    // @ts-expect-error
    if ((_e = player.weapon) === null || _e === void 0 ? void 0 : _e.sprite) {
        // @ts-expect-error
        const weaponModel = document.querySelector(".sprites ." + player.weapon.sprite);
        playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(weaponModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
    playerCtx === null || playerCtx === void 0 ? void 0 : playerCtx.drawImage(hairModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
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
        enemy: false
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
            if (enemy.cords.x == tile.x && enemy.cords.y == tile.y) {
                arrow.enemy = true;
                arrow.blocked = true;
            }
            ;
        });
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
    state.inCombat = false;
    var map = maps[currentMap];
    map.enemies.forEach(enemy => {
        if (!enemy.alive)
            return;
        if (enemy.aggro()) {
            state.inCombat = true;
            enemy.decideAction();
        }
    });
}
/* Show enemy stats when hovering */
function hoverEnemyShow(enemy) {
    staticHover.textContent = "";
    staticHover.style.display = "block";
    const name = document.createElement("p");
    name.classList.add("enemyName");
    name.textContent = enemy.name;
    const hp = document.createElement("p");
    hp.classList.add("enemyHealth");
    // @ts-ignore
    hp.textContent = `HP: ${enemy.stats.hp}/${enemy.getStats().hpMax}`;
    const mp = document.createElement("p");
    mp.classList.add("enemyMana");
    // @ts-ignore
    mp.textContent = `MP: ${enemy.stats.mp}/${enemy.getStats().mpMax}`;
    staticHover.append(name, hp, mp);
}
/* Hide map hover */
function hideMapHover() {
    staticHover.textContent = "";
    staticHover.style.display = "none";
}
