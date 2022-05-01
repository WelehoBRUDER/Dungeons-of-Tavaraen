"use strict";
function renderEntireMap(map) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    oldCords = Object.assign({}, player.cords);
    oldZoom = currentZoom;
    /* Render the base layer */
    fogCanvas.width = fogCanvas.width;
    baseCanvas.width = baseCanvas.width;
    for (let y = 0; y < spriteLimitY; y++) {
        for (let x = 0; x < spriteLimitX; x++) {
            baseCtx.globalCompositeOperation = "destination-over";
            if (y + mapOffsetStartY > maps[currentMap].base.length - 1 || y + mapOffsetStartY < 0)
                continue;
            if (x + mapOffsetStartX > maps[currentMap].base[y].length - 1 || x + mapOffsetStartX < 0)
                continue;
            const imgId = +((_b = (_a = map.base) === null || _a === void 0 ? void 0 : _a[mapOffsetStartY + y]) === null || _b === void 0 ? void 0 : _b[mapOffsetStartX + x]);
            const tile = tiles[imgId];
            const sprite = (_d = (_c = tiles[imgId]) === null || _c === void 0 ? void 0 : _c.spriteMap) !== null && _d !== void 0 ? _d : { x: 128, y: 0 };
            const grave = document.querySelector(`.sprites .deadModel`);
            const clutterId = (_f = (_e = map.clutter) === null || _e === void 0 ? void 0 : _e[mapOffsetStartY + y]) === null || _f === void 0 ? void 0 : _f[mapOffsetStartX + x];
            // @ts-expect-error
            const clutterSprite = (_g = clutters[clutterId]) === null || _g === void 0 ? void 0 : _g.spriteMap;
            const fog = { x: 256, y: 0 };
            if (sprite) {
                baseCtx.drawImage(spriteMap_tiles, sprite.x, sprite.y, 128, 128, Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), spriteSize, spriteSize);
            }
            if (tile.isWall && settings.draw_wall_outlines) {
                const tileNorth = tiles[+((_j = (_h = map.base) === null || _h === void 0 ? void 0 : _h[mapOffsetStartY + y - 1]) === null || _j === void 0 ? void 0 : _j[mapOffsetStartX + x])];
                const tileSouth = tiles[+((_l = (_k = map.base) === null || _k === void 0 ? void 0 : _k[mapOffsetStartY + y + 1]) === null || _l === void 0 ? void 0 : _l[mapOffsetStartX + x])];
                const tileWest = tiles[+((_o = (_m = map.base) === null || _m === void 0 ? void 0 : _m[mapOffsetStartY + y]) === null || _o === void 0 ? void 0 : _o[mapOffsetStartX + x - 1])];
                const tileEast = tiles[+((_q = (_p = map.base) === null || _p === void 0 ? void 0 : _p[mapOffsetStartY + y]) === null || _q === void 0 ? void 0 : _q[mapOffsetStartX + x + 1])];
                const drawOutlines = { n: !(tileNorth === null || tileNorth === void 0 ? void 0 : tileNorth.isWall), s: !(tileSouth === null || tileSouth === void 0 ? void 0 : tileSouth.isWall), e: !(tileEast === null || tileEast === void 0 ? void 0 : tileEast.isWall), w: !(tileWest === null || tileWest === void 0 ? void 0 : tileWest.isWall) };
                Object.entries(drawOutlines).map(([dir, draw]) => {
                    baseCtx.globalCompositeOperation = "source-over";
                    let width = Math.round(spriteSize / 16 + 4);
                    let shortHeight = Math.round(spriteSize);
                    let height = shortHeight;
                    if (dir === "n" && draw) {
                        if (!drawOutlines["w"] && drawOutlines["n"]) {
                            baseCtx.fillRect(Math.round((x * spriteSize - mapOffsetX) - width), Math.round(y * spriteSize - mapOffsetY), height + width, width);
                        }
                        else {
                            baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), height, width);
                        }
                    }
                    else if (dir === "s" && draw) {
                        if (drawOutlines["s"] && !drawOutlines["e"]) {
                            baseCtx.fillRect((Math.round(x * spriteSize - mapOffsetX)), Math.round(y * spriteSize - mapOffsetY) + shortHeight - width, height + width, width);
                        }
                        else {
                            baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY) + shortHeight - width, height, width);
                        }
                    }
                    else if (dir === "e" && draw) {
                        if (drawOutlines["e"] && !drawOutlines["n"]) {
                            baseCtx.fillRect((Math.round(x * spriteSize - mapOffsetX) + shortHeight - width), Math.round((y * spriteSize - mapOffsetY) - width), width, height + width);
                        }
                        else {
                            baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX) + shortHeight - width, Math.round(y * spriteSize - mapOffsetY), width, shortHeight);
                        }
                    }
                    else if (dir === "w" && draw) {
                        if (drawOutlines["w"] && !drawOutlines["s"]) {
                            baseCtx.fillRect((Math.round(x * spriteSize - mapOffsetX)), Math.round(y * spriteSize - mapOffsetY), width, height + width);
                        }
                        else {
                            baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), width, shortHeight);
                        }
                    }
                });
            }
            baseCtx.globalCompositeOperation = "source-over";
            if (player.grave) {
                if (player.grave.cords.x == x + mapOffsetStartX && player.grave.cords.y == y + mapOffsetStartY) {
                    baseCtx.drawImage(grave, Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), spriteSize, spriteSize);
                }
            }
            if (clutterSprite) {
                baseCtx.drawImage(spriteMap_tiles, clutterSprite.x, clutterSprite.y, 128, 128, Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), spriteSize, spriteSize);
            }
            if (((_r = sightMap[mapOffsetStartY + y]) === null || _r === void 0 ? void 0 : _r[mapOffsetStartX + x]) != "x" && imgId) {
                fogCtx.drawImage(spriteMap_tiles, fog.x, fog.y, 128, 128, Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), spriteSize, spriteSize);
            }
        }
    }
    baseCtx.globalCompositeOperation = "source-over";
    map.shrines.forEach((checkpoint) => {
        var _a, _b, _c;
        if ((((_a = sightMap[checkpoint.cords.y]) === null || _a === void 0 ? void 0 : _a[checkpoint.cords.x]) == "x")) {
            const shrine = document.querySelector(".sprites .shrineTile");
            const shrineLit = document.querySelector(".sprites .shrineLitTile");
            var tileX = (checkpoint.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
            var tileY = (checkpoint.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
            if (((_b = player === null || player === void 0 ? void 0 : player.respawnPoint) === null || _b === void 0 ? void 0 : _b.cords.x) == checkpoint.cords.x && ((_c = player === null || player === void 0 ? void 0 : player.respawnPoint) === null || _c === void 0 ? void 0 : _c.cords.y) == checkpoint.cords.y)
                baseCtx === null || baseCtx === void 0 ? void 0 : baseCtx.drawImage(shrineLit, tileX, tileY, spriteSize, spriteSize);
            else
                baseCtx === null || baseCtx === void 0 ? void 0 : baseCtx.drawImage(shrine, tileX, tileY, spriteSize, spriteSize);
        }
    });
    map.treasureChests.forEach((chest) => {
        var _a;
        const lootedChest = lootedChests.find(trs => trs.cords.x == chest.cords.x && trs.cords.y == chest.cords.y && trs.map == currentMap);
        if ((((_a = sightMap[chest.cords.y]) === null || _a === void 0 ? void 0 : _a[chest.cords.x]) == "x")) {
            if (!lootedChest) {
                const chestSprite = document.querySelector(`.sprites .${chest.sprite}`);
                var tileX = (chest.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
                var tileY = (chest.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
                baseCtx === null || baseCtx === void 0 ? void 0 : baseCtx.drawImage(chestSprite, tileX, tileY, spriteSize, spriteSize);
            }
        }
    });
    map.messages.forEach((msg) => {
        var _a;
        if ((((_a = sightMap[msg.cords.y]) === null || _a === void 0 ? void 0 : _a[msg.cords.x]) == "x")) {
            const message = document.querySelector(".messageTile");
            var tileX = (msg.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
            var tileY = (msg.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
            baseCtx === null || baseCtx === void 0 ? void 0 : baseCtx.drawImage(message, tileX, tileY, spriteSize, spriteSize);
        }
    });
    (_s = map === null || map === void 0 ? void 0 : map.entrances) === null || _s === void 0 ? void 0 : _s.forEach((entrance) => {
        var _a;
        if ((((_a = sightMap[entrance.cords.y]) === null || _a === void 0 ? void 0 : _a[entrance.cords.x]) == "x")) {
            const entranceSprite = document.querySelector(`.sprites .${entrance.sprite}`);
            var tileX = (entrance.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
            var tileY = (entrance.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
            baseCtx === null || baseCtx === void 0 ? void 0 : baseCtx.drawImage(entranceSprite, tileX, tileY, spriteSize, spriteSize);
        }
    });
    /* Render Enemies */
    enemyLayers.textContent = ""; // Delete enemy canvases
    map.enemies.forEach((enemy, index) => {
        var _a;
        if (!enemy.alive || ((_a = sightMap[enemy.cords.y]) === null || _a === void 0 ? void 0 : _a[enemy.cords.x]) != "x")
            return;
        renderEnemyModel(enemy, index, spriteSize);
    });
    /* Render Characters */
    NPCcharacters.forEach((npc) => {
        var _a;
        if (npc.currentMap == currentMap) {
            if (((_a = sightMap[npc.currentCords.y]) === null || _a === void 0 ? void 0 : _a[npc.currentCords.x]) == "x") {
                renderCharacterModel(npc, spriteSize);
            }
        }
    });
    /* Render Summons */
    summonLayers.textContent = ""; // Delete summon canvases
    combatSummons.forEach((enemy, index) => {
        if (!enemy.alive)
            return;
        renderSummonModel(enemy, index, spriteSize);
    });
    /* Render Items */
    mapDataCanvas.width = mapDataCanvas.width;
    itemData.forEach((item) => {
        if (item.map != currentMap)
            return;
        if (!item.itm)
            return;
        renderItemOnMap(item, spriteSize, sightMap);
    });
    /* Render Player */
    renderPlayerModel(spriteSize, playerCanvas, playerCtx);
}
function renderEnemyModel(enemy, index, spriteSize) {
    var _a;
    var tileX = (enemy.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    var tileY = (enemy.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
    const canvas = document.createElement("canvas");
    // @ts-ignore
    canvas.classList = `enemy${index} layer`;
    enemy.index = index;
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
        if (((_a = enemy.questSpawn) === null || _a === void 0 ? void 0 : _a.quest) > -1) {
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
}
function renderSummonModel(enemy, index, spriteSize) {
    var _a;
    var tileX = (enemy.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    var tileY = (enemy.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
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
}
function renderCharacterModel(npc, spriteSize) {
    const charSprite = document.querySelector(`.sprites .${npc.sprite}`);
    var tileX = (npc.currentCords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    var tileY = (npc.currentCords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
    if (charSprite) {
        baseCtx === null || baseCtx === void 0 ? void 0 : baseCtx.drawImage(charSprite, tileX, tileY, spriteSize, spriteSize);
    }
}
function renderItemOnMap(item, spriteSize, sightMap) {
    var _a;
    var tileX = (item.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    var tileY = (item.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
    const itemSprite = item.itm.spriteMap;
    if (((_a = sightMap[item.cords.y]) === null || _a === void 0 ? void 0 : _a[item.cords.x]) == "x") {
        mapDataCtx.shadowColor = "#ffd900";
        mapDataCtx.shadowBlur = 6;
        mapDataCtx.shadowOffsetX = 0;
        mapDataCtx.shadowOffsetY = 0;
        mapDataCtx === null || mapDataCtx === void 0 ? void 0 : mapDataCtx.drawImage(spriteMap_items, itemSprite.x, itemSprite.y, 128, 128, (tileX + spriteSize * item.mapCords.xMod), (tileY + spriteSize * item.mapCords.yMod), spriteSize / 3, spriteSize / 3);
    }
}
function renderRow(map, translateX, translateY) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    const xArr = translateX == 0 ? [] : [...Array(spriteLimitY)].map((e, i) => {
        return [translateX < 0 ? spriteLimitX - 1 : 0, i];
    });
    const yArr = translateY == 0 ? [] : [...Array(spriteLimitX)].map((e, i) => {
        return [i, translateY < 0 ? spriteLimitY - 1 : 0];
    });
    const arr = [...xArr, ...yArr];
    for (const [x, y] of arr) {
        baseCtx.globalCompositeOperation = "destination-over";
        if (y + mapOffsetStartY > maps[currentMap].base.length - 1 || y + mapOffsetStartY < 0)
            continue;
        if (x + mapOffsetStartX > maps[currentMap].base[y].length - 1 || x + mapOffsetStartX < 0)
            continue;
        const imgId = +((_b = (_a = map.base) === null || _a === void 0 ? void 0 : _a[mapOffsetStartY + y]) === null || _b === void 0 ? void 0 : _b[mapOffsetStartX + x]);
        const tile = tiles[imgId];
        const sprite = (_d = (_c = tiles[imgId]) === null || _c === void 0 ? void 0 : _c.spriteMap) !== null && _d !== void 0 ? _d : { x: 128, y: 0 };
        const grave = document.querySelector(`.sprites .deadModel`);
        const clutterId = (_f = (_e = map.clutter) === null || _e === void 0 ? void 0 : _e[mapOffsetStartY + y]) === null || _f === void 0 ? void 0 : _f[mapOffsetStartX + x];
        // @ts-expect-error
        const clutterSprite = (_g = clutters[clutterId]) === null || _g === void 0 ? void 0 : _g.spriteMap;
        const fog = { x: 256, y: 0 };
        if (sprite) {
            baseCtx.drawImage(spriteMap_tiles, sprite.x, sprite.y, 128, 128, Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), spriteSize, spriteSize);
        }
        if (tile.isWall && settings.draw_wall_outlines) {
            const tileNorth = tiles[+((_j = (_h = map.base) === null || _h === void 0 ? void 0 : _h[mapOffsetStartY + y - 1]) === null || _j === void 0 ? void 0 : _j[mapOffsetStartX + x])];
            const tileSouth = tiles[+((_l = (_k = map.base) === null || _k === void 0 ? void 0 : _k[mapOffsetStartY + y + 1]) === null || _l === void 0 ? void 0 : _l[mapOffsetStartX + x])];
            const tileWest = tiles[+((_o = (_m = map.base) === null || _m === void 0 ? void 0 : _m[mapOffsetStartY + y]) === null || _o === void 0 ? void 0 : _o[mapOffsetStartX + x - 1])];
            const tileEast = tiles[+((_q = (_p = map.base) === null || _p === void 0 ? void 0 : _p[mapOffsetStartY + y]) === null || _q === void 0 ? void 0 : _q[mapOffsetStartX + x + 1])];
            const drawOutlines = { n: !(tileNorth === null || tileNorth === void 0 ? void 0 : tileNorth.isWall), s: !(tileSouth === null || tileSouth === void 0 ? void 0 : tileSouth.isWall), e: !(tileEast === null || tileEast === void 0 ? void 0 : tileEast.isWall), w: !(tileWest === null || tileWest === void 0 ? void 0 : tileWest.isWall) };
            Object.entries(drawOutlines).map(([dir, draw]) => {
                baseCtx.globalCompositeOperation = "source-over";
                let width = Math.round(spriteSize / 16 + 4);
                let shortHeight = Math.round(spriteSize);
                let height = shortHeight;
                if (dir === "n" && draw) {
                    if (!drawOutlines["w"] && drawOutlines["n"]) {
                        baseCtx.fillRect(Math.round((x * spriteSize - mapOffsetX) - width), Math.round(y * spriteSize - mapOffsetY), height + width, width);
                    }
                    else {
                        baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), height, width);
                    }
                }
                else if (dir === "s" && draw) {
                    if (drawOutlines["s"] && !drawOutlines["e"]) {
                        baseCtx.fillRect((Math.round(x * spriteSize - mapOffsetX)), Math.round(y * spriteSize - mapOffsetY) + shortHeight - width, height + width, width);
                    }
                    else {
                        baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY) + shortHeight - width, height, width);
                    }
                }
                else if (dir === "e" && draw) {
                    if (drawOutlines["e"] && !drawOutlines["n"]) {
                        baseCtx.fillRect((Math.round(x * spriteSize - mapOffsetX) + shortHeight - width), Math.round((y * spriteSize - mapOffsetY) - width), width, height + width);
                    }
                    else {
                        baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX) + shortHeight - width, Math.round(y * spriteSize - mapOffsetY), width, shortHeight);
                    }
                }
                else if (dir === "w" && draw) {
                    if (drawOutlines["w"] && !drawOutlines["s"]) {
                        baseCtx.fillRect((Math.round(x * spriteSize - mapOffsetX)), Math.round(y * spriteSize - mapOffsetY), width, height + width);
                    }
                    else {
                        baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), width, shortHeight);
                    }
                }
            });
        }
        baseCtx.globalCompositeOperation = "source-over";
        if (player.grave) {
            if (player.grave.cords.x == x + mapOffsetStartX && player.grave.cords.y == y + mapOffsetStartY) {
                baseCtx.drawImage(grave, Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), spriteSize, spriteSize);
            }
        }
        if (clutterSprite) {
            baseCtx.globalCompositeOperation = "source-over";
            baseCtx.drawImage(spriteMap_tiles, clutterSprite.x, clutterSprite.y, 128, 128, Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), spriteSize, spriteSize);
        }
        if (((_r = sightMap[mapOffsetStartY + y]) === null || _r === void 0 ? void 0 : _r[mapOffsetStartX + x]) != "x" && imgId) {
            fogCtx.drawImage(spriteMap_tiles, fog.x, fog.y, 128, 128, Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), spriteSize, spriteSize);
        }
    }
    baseCtx.globalCompositeOperation = "source-over";
    map.shrines.forEach((checkpoint) => {
        var _a, _b, _c;
        if ((((_a = sightMap[checkpoint.cords.y]) === null || _a === void 0 ? void 0 : _a[checkpoint.cords.x]) == "x")) {
            const shrine = document.querySelector(".sprites .shrineTile");
            const shrineLit = document.querySelector(".sprites .shrineLitTile");
            var tileX = (checkpoint.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
            var tileY = (checkpoint.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
            if (((_b = player === null || player === void 0 ? void 0 : player.respawnPoint) === null || _b === void 0 ? void 0 : _b.cords.x) == checkpoint.cords.x && ((_c = player === null || player === void 0 ? void 0 : player.respawnPoint) === null || _c === void 0 ? void 0 : _c.cords.y) == checkpoint.cords.y)
                baseCtx === null || baseCtx === void 0 ? void 0 : baseCtx.drawImage(shrineLit, tileX, tileY, spriteSize, spriteSize);
            else
                baseCtx === null || baseCtx === void 0 ? void 0 : baseCtx.drawImage(shrine, tileX, tileY, spriteSize, spriteSize);
        }
    });
    map.treasureChests.forEach((chest) => {
        var _a;
        const lootedChest = lootedChests.find(trs => trs.cords.x == chest.cords.x && trs.cords.y == chest.cords.y && trs.map == currentMap);
        if ((((_a = sightMap[chest.cords.y]) === null || _a === void 0 ? void 0 : _a[chest.cords.x]) == "x")) {
            if (!lootedChest) {
                const chestSprite = document.querySelector(`.sprites .${chest.sprite}`);
                var tileX = (chest.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
                var tileY = (chest.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
                baseCtx === null || baseCtx === void 0 ? void 0 : baseCtx.drawImage(chestSprite, tileX, tileY, spriteSize, spriteSize);
            }
        }
    });
    map.messages.forEach((msg) => {
        var _a;
        if ((((_a = sightMap[msg.cords.y]) === null || _a === void 0 ? void 0 : _a[msg.cords.x]) == "x")) {
            const message = document.querySelector(".messageTile");
            var tileX = (msg.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
            var tileY = (msg.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
            baseCtx === null || baseCtx === void 0 ? void 0 : baseCtx.drawImage(message, tileX, tileY, spriteSize, spriteSize);
        }
    });
    (_s = map === null || map === void 0 ? void 0 : map.entrances) === null || _s === void 0 ? void 0 : _s.forEach((entrance) => {
        var _a;
        if ((((_a = sightMap[entrance.cords.y]) === null || _a === void 0 ? void 0 : _a[entrance.cords.x]) == "x")) {
            const entranceSprite = document.querySelector(`.sprites .${entrance.sprite}`);
            var tileX = (entrance.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
            var tileY = (entrance.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
            baseCtx === null || baseCtx === void 0 ? void 0 : baseCtx.drawImage(entranceSprite, tileX, tileY, spriteSize, spriteSize);
        }
    });
    /* Render Enemies */
    enemyLayers.textContent = ""; // Delete enemy canvases
    map.enemies.forEach((enemy, index) => {
        var _a;
        if (!enemy.alive || ((_a = sightMap[enemy.cords.y]) === null || _a === void 0 ? void 0 : _a[enemy.cords.x]) != "x")
            return;
        renderEnemyModel(enemy, index, spriteSize);
    });
    /* Render Characters */
    NPCcharacters.forEach((npc) => {
        var _a;
        if (npc.currentMap == currentMap) {
            if (((_a = sightMap[npc.currentCords.y]) === null || _a === void 0 ? void 0 : _a[npc.currentCords.x]) == "x") {
                renderCharacterModel(npc, spriteSize);
            }
        }
    });
    /* Render Summons */
    summonLayers.textContent = ""; // Delete summon canvases
    combatSummons.forEach((enemy, index) => {
        if (!enemy.alive)
            return;
        renderSummonModel(enemy, index, spriteSize);
    });
    /* Render Items */
    mapDataCanvas.width = mapDataCanvas.width;
    itemData.forEach((item) => {
        if (item.map != currentMap)
            return;
        if (!item.itm)
            return;
        renderItemOnMap(item, spriteSize, sightMap);
    });
}
//# sourceMappingURL=render_functions.js.map