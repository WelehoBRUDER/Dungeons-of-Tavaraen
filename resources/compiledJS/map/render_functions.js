"use strict";
let playerOldSight = player.sight();
function renderEntireMap(map) {
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    oldCords = { ...player.cords };
    oldZoom = currentZoom;
    /* Render the base layer */
    baseCanvas.width = baseCanvas.width;
    fogCanvas.width = fogCanvas.width;
    generateFogMap();
    for (let y = 0; y < spriteLimitY; y++) {
        for (let x = 0; x < spriteLimitX; x++) {
            baseCtx.globalCompositeOperation = "destination-over";
            if (y + mapOffsetStartY > maps[currentMap].base.length - 1 || y + mapOffsetStartY < 0)
                continue;
            if (x + mapOffsetStartX > maps[currentMap].base[y].length - 1 || x + mapOffsetStartX < 0)
                continue;
            const imgId = +map.base?.[mapOffsetStartY + y]?.[mapOffsetStartX + x];
            const tile = tiles[imgId];
            const sprite = tiles[imgId]?.spriteMap ?? { x: 128, y: 0 };
            const grave = document.querySelector(`.sprites .deadModel`);
            const clutterId = map.clutter?.[mapOffsetStartY + y]?.[mapOffsetStartX + x];
            const clutterSprite = clutters[clutterId]?.spriteMap;
            if (sprite) {
                baseCtx.drawImage(textureAtlas, sprite.x, sprite.y, 128, 128, Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), spriteSize, spriteSize);
            }
            if (tile.isWall && settings.draw_wall_outlines) {
                const tileNorth = tiles[+map.base?.[mapOffsetStartY + y - 1]?.[mapOffsetStartX + x]];
                const tileSouth = tiles[+map.base?.[mapOffsetStartY + y + 1]?.[mapOffsetStartX + x]];
                const tileWest = tiles[+map.base?.[mapOffsetStartY + y]?.[mapOffsetStartX + x - 1]];
                const tileEast = tiles[+map.base?.[mapOffsetStartY + y]?.[mapOffsetStartX + x + 1]];
                const drawOutlines = {
                    n: !tileNorth?.isWall,
                    s: !tileSouth?.isWall,
                    e: !tileEast?.isWall,
                    w: !tileWest?.isWall,
                };
                Object.entries(drawOutlines).map(([dir, draw]) => {
                    baseCtx.globalCompositeOperation = "source-over";
                    let width = Math.round(spriteSize / 16 + 4);
                    let shortHeight = Math.round(spriteSize);
                    let height = shortHeight;
                    if (dir === "n" && draw) {
                        if (!drawOutlines["w"] && drawOutlines["n"]) {
                            baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX - width), Math.round(y * spriteSize - mapOffsetY), height + width, width);
                        }
                        else {
                            baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), height, width);
                        }
                    }
                    else if (dir === "s" && draw) {
                        if (drawOutlines["s"] && !drawOutlines["e"]) {
                            baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY) + shortHeight - width, height + width, width);
                        }
                        else {
                            baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY) + shortHeight - width, height, width);
                        }
                    }
                    else if (dir === "e" && draw) {
                        if (drawOutlines["e"] && !drawOutlines["n"]) {
                            baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX) + shortHeight - width, Math.round(y * spriteSize - mapOffsetY - width), width, height + width);
                        }
                        else {
                            baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX) + shortHeight - width, Math.round(y * spriteSize - mapOffsetY), width, shortHeight);
                        }
                    }
                    else if (dir === "w" && draw) {
                        if (drawOutlines["w"] && !drawOutlines["s"]) {
                            baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), width, height + width);
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
                baseCtx.drawImage(textureAtlas, clutterSprite.x, clutterSprite.y, 128, 128, Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), spriteSize, spriteSize);
            }
        }
    }
    baseCtx.globalCompositeOperation = "source-over";
    map.shrines.forEach((checkpoint) => {
        if (sightMap[checkpoint.cords.y]?.[checkpoint.cords.x] == "x") {
            const shrine = document.querySelector(".sprites .shrineTile");
            const shrineLit = document.querySelector(".sprites .shrineLitTile");
            let tileX = (checkpoint.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
            let tileY = (checkpoint.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
            if (player?.respawnPoint?.cords.x == checkpoint.cords.x && player?.respawnPoint?.cords.y == checkpoint.cords.y)
                baseCtx?.drawImage(shrineLit, tileX, tileY, spriteSize, spriteSize);
            else
                baseCtx?.drawImage(shrine, tileX, tileY, spriteSize, spriteSize);
        }
    });
    map.treasureChests.forEach((chest) => {
        const lootedChest = lootedChests.find((trs) => trs.cords.x == chest.cords.x && trs.cords.y == chest.cords.y && trs.map == currentMap);
        if (sightMap[chest.cords.y]?.[chest.cords.x] == "x") {
            if (!lootedChest) {
                const chestSprite = document.querySelector(`.sprites .${chest.sprite}`);
                let tileX = (chest.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
                let tileY = (chest.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
                baseCtx?.drawImage(chestSprite, tileX, tileY, spriteSize, spriteSize);
            }
        }
    });
    map.messages.forEach((msg) => {
        if (sightMap[msg.cords.y]?.[msg.cords.x] == "x") {
            const message = document.querySelector(".messageTile");
            let tileX = (msg.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
            let tileY = (msg.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
            baseCtx?.drawImage(message, tileX, tileY, spriteSize, spriteSize);
        }
    });
    map?.entrances?.forEach((entrance) => {
        if (sightMap[entrance.cords.y]?.[entrance.cords.x] == "x") {
            const entranceSprite = document.querySelector(`.sprites .${entrance.sprite}`);
            let tileX = (entrance.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
            let tileY = (entrance.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
            baseCtx?.drawImage(entranceSprite, tileX, tileY, spriteSize, spriteSize);
        }
    });
    /* Render Enemies */
    enemyLayers.textContent = ""; // Delete enemy canvases
    map.enemies.forEach((enemy, index) => {
        if (!enemy.alive || sightMap[enemy.cords.y]?.[enemy.cords.x] != "x")
            return;
        renderEnemyModel(enemy, index, spriteSize);
    });
    /* Render Characters */
    NPCcharacters.forEach((npc) => {
        if (npc.currentMap == currentMap) {
            if (sightMap[npc.currentCords.y]?.[npc.currentCords.x] == "x") {
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
    /* Render Projectiles */
    renderProjectiles(spriteSize);
    /* Render Player */
    renderPlayerModel(spriteSize, playerCanvas, playerCtx);
}
function renderProjectiles(spriteSize) {
    projectileLayers.textContent = ""; // Delete projectile canvases
    currentProjectiles.forEach((projectile, index) => {
        projectile.index = index;
        const { screenX: x, screenY: y } = tileCordsToScreen(projectile.cords);
        /* Creates a new canvas every time a projectile is rendered */
        /* This can be catastrophically bad for performance, but who cares! */
        const projectileCanvas = document.createElement("canvas");
        const ctx = projectileCanvas.getContext("2d");
        projectileCanvas.width = baseCanvas.width;
        projectileCanvas.height = baseCanvas.height;
        projectileLayers.append(projectileCanvas);
        projectileCanvas.width = projectileCanvas.width;
        projectileLayers.append(projectileCanvas);
        ctx?.translate(x + spriteSize / 2, y + spriteSize / 2);
        const rotation = calcAngleDegrees(projectile.target.x - projectile.cords.x, projectile.target.y - projectile.cords.y);
        ctx?.rotate((rotation * Math.PI) / 180);
        ctx?.translate((x + spriteSize / 2) * -1, (y + spriteSize / 2) * -1);
        const projectileSprite = document.querySelector(`.sprites .${projectile.texture}`);
        if (projectileSprite) {
            ctx?.drawImage(projectileSprite, x, y, spriteSize, spriteSize);
        }
    });
}
function renderEnemyModel(enemy, index, spriteSize) {
    let tileX = (enemy.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    let tileY = (enemy.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
    const canvas = document.createElement("canvas");
    // @ts-ignore
    canvas.classList = `enemy${index} layer`;
    enemy.index = index;
    const ctx = canvas.getContext("2d");
    //const enemyImg = <HTMLImageElement>document.querySelector(`.sprites .${enemy.sprite}`);
    const enemySprite = enemies[enemy.id].spriteMap;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    if (enemySprite) {
        /* Render hp bar */
        const hpbg = document.querySelector(".hpBg");
        const hpbar = document.querySelector(".hpBar");
        const hpborder = document.querySelector(".hpBorder");
        ctx?.drawImage(hpbg, tileX - spriteSize * (enemy.scale - 1), tileY - 12 - spriteSize * (enemy.scale - 1), spriteSize * enemy.scale, spriteSize * enemy.scale);
        ctx?.drawImage(hpbar, tileX - spriteSize * (enemy.scale - 1), tileY - 12 - spriteSize * (enemy.scale - 1), ((Math.round(enemy.hpRemain()) * spriteSize) / 100) * enemy.scale, spriteSize * enemy.scale);
        ctx?.drawImage(hpborder, tileX - spriteSize * (enemy.scale - 1), tileY - 12 - spriteSize * (enemy.scale - 1), spriteSize * enemy.scale, spriteSize * enemy.scale);
        /* Render enemy on top of hp bar */
        ctx?.drawImage(textureAtlas, enemySprite.x, enemySprite.y, 128, 128, tileX - spriteSize * (enemy.scale - 1), tileY - spriteSize * (enemy.scale - 1), spriteSize * enemy.scale, spriteSize * enemy.scale);
        if (enemy.questSpawn?.quest > -1) {
            ctx.font = `${spriteSize / 1.9}px Arial`;
            ctx.fillStyle = "goldenrod";
            ctx.fillText(`!`, tileX - spriteSize * (enemy.scale - 1) + spriteSize / 2.3, tileY - spriteSize * (enemy.scale - 1) - spriteSize / 10);
        }
        let statCount = 0;
        enemy.statusEffects.forEach((effect) => {
            if (statCount > 4)
                return;
            let img = new Image(32, 32);
            img.src = effect.icon;
            img.addEventListener("load", (e) => {
                ctx?.drawImage(img, tileX + spriteSize - 32 * currentZoom, tileY + 32 * statCount * currentZoom, 32 * currentZoom, 32 * currentZoom);
                img = null;
                statCount++;
            });
        });
    }
    enemyLayers.append(canvas);
}
function renderSummonModel(summon, index, spriteSize) {
    let tileX = (summon.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    let tileY = (summon.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
    const canvas = document.createElement("canvas");
    // @ts-ignore
    canvas.classList = `summon${index} layer`;
    const ctx = canvas.getContext("2d");
    summonLayers.append(canvas);
    const summonSprite = summons[summon.id].spriteMap;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    if (summonSprite && sightMap[summon.cords.y]?.[summon.cords.x] == "x") {
        /* Render hp bar */
        const hpbg = document.querySelector(".hpBg");
        const hpbar = document.querySelector(".hpBarAlly");
        const hpborder = document.querySelector(".hpBorder");
        ctx?.drawImage(hpbg, tileX, tileY - 12, spriteSize, spriteSize);
        ctx?.drawImage(hpbar, tileX, tileY - 12, (summon.hpRemain() * spriteSize) / 100, spriteSize);
        ctx?.drawImage(hpborder, tileX, tileY - 12, spriteSize, spriteSize);
        /* Render enemy on top of hp bar */
        ctx?.drawImage(textureAtlas, summonSprite.x, summonSprite.y, 128, 128, tileX, tileY, spriteSize, spriteSize);
        let statCount = 0;
        summon.statusEffects.forEach((effect) => {
            if (statCount > 4)
                return;
            let img = new Image(32, 32);
            img.src = effect.icon;
            img.addEventListener("load", (e) => {
                ctx?.drawImage(img, tileX + spriteSize - 32, tileY + 32 * statCount, 32, 32);
                img = null;
                statCount++;
            });
        });
    }
}
function renderCharacterModel(npc, spriteSize) {
    const charSprite = document.querySelector(`.sprites .${npc.sprite}`);
    let tileX = (npc.currentCords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    let tileY = (npc.currentCords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
    if (charSprite) {
        baseCtx?.drawImage(charSprite, tileX, tileY, spriteSize, spriteSize);
    }
}
function renderItemOnMap(item, spriteSize, sightMap) {
    let tileX = (item.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    let tileY = (item.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
    const itemSprite = items[item.itm.id].spriteMap;
    if (sightMap[item.cords.y]?.[item.cords.x] == "x") {
        mapDataCtx.shadowColor = "#ffd900";
        mapDataCtx.shadowBlur = 6;
        mapDataCtx.shadowOffsetX = 0;
        mapDataCtx.shadowOffsetY = 0;
        mapDataCtx?.drawImage(textureAtlas, itemSprite.x, itemSprite.y, 128, 128, tileX + spriteSize * item.mapCords.xMod, tileY + spriteSize * item.mapCords.yMod, spriteSize / 3, spriteSize / 3);
    }
}
function renderRow(map, translateX, translateY) {
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    if (player.cords.y < playerOldSight ||
        player.cords.y + playerOldSight > maps[currentMap].base.length ||
        player.cords.x < playerOldSight ||
        player.cords.x + playerOldSight > maps[currentMap].base[0].length) {
        fogCanvas.width = fogCanvas.width;
        generateFogMap();
    }
    if (translateX !== 0) {
        for (let i = 0; i <= Math.abs(translateX); i++) {
            for (let y = 0; y < spriteLimitY; y++) {
                if (translateX < 0)
                    renderGrid(spriteLimitX - i - 1, y);
                else
                    renderGrid(i, y);
            }
        }
    }
    if (translateY !== 0) {
        for (let i = 0; i <= Math.abs(translateY); i++) {
            for (let x = 0; x < spriteLimitX; x++) {
                if (translateY < 0)
                    renderGrid(x, spriteLimitY - i - 1);
                else
                    renderGrid(x, i);
            }
        }
    }
    if (player.sight() !== playerOldSight) {
        sightMap = createSightMap(player.cords, player.sight());
    }
    playerOldSight = player.sight();
    function renderGrid(x, y) {
        baseCtx.globalCompositeOperation = "destination-over";
        if (x < 0 || y < 0 || x >= spriteLimitX || y >= spriteLimitY)
            return;
        if (y + mapOffsetStartY > maps[currentMap].base.length - 1 || y + mapOffsetStartY < 0)
            return;
        if (x + mapOffsetStartX > maps[currentMap].base[y].length - 1 || x + mapOffsetStartX < 0)
            return;
        const imgId = +map.base?.[mapOffsetStartY + y]?.[mapOffsetStartX + x];
        const tile = tiles[imgId];
        const sprite = tiles[imgId]?.spriteMap ?? { x: 128, y: 0 };
        const grave = document.querySelector(`.sprites .deadModel`);
        const clutterId = map.clutter?.[mapOffsetStartY + y]?.[mapOffsetStartX + x];
        const clutterSprite = clutters[clutterId]?.spriteMap;
        const fog = { x: 256, y: 0 };
        if (sprite) {
            baseCtx.drawImage(textureAtlas, sprite.x, sprite.y, 128, 128, Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), spriteSize, spriteSize);
        }
        if (tile.isWall && settings.draw_wall_outlines) {
            const tileNorth = tiles[+map.base?.[mapOffsetStartY + y - 1]?.[mapOffsetStartX + x]];
            const tileSouth = tiles[+map.base?.[mapOffsetStartY + y + 1]?.[mapOffsetStartX + x]];
            const tileWest = tiles[+map.base?.[mapOffsetStartY + y]?.[mapOffsetStartX + x - 1]];
            const tileEast = tiles[+map.base?.[mapOffsetStartY + y]?.[mapOffsetStartX + x + 1]];
            const drawOutlines = { n: !tileNorth?.isWall, s: !tileSouth?.isWall, e: !tileEast?.isWall, w: !tileWest?.isWall };
            Object.entries(drawOutlines).map(([dir, draw]) => {
                baseCtx.globalCompositeOperation = "source-over";
                let width = Math.round(spriteSize / 16 + 4);
                let shortHeight = Math.round(spriteSize);
                let height = shortHeight;
                if (dir === "n" && draw) {
                    if (!drawOutlines["w"] && drawOutlines["n"]) {
                        baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX - width), Math.round(y * spriteSize - mapOffsetY), height + width, width);
                    }
                    else {
                        baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), height, width);
                    }
                }
                else if (dir === "s" && draw) {
                    if (drawOutlines["s"] && !drawOutlines["e"]) {
                        baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY) + shortHeight - width, height + width, width);
                    }
                    else {
                        baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY) + shortHeight - width, height, width);
                    }
                }
                else if (dir === "e" && draw) {
                    if (drawOutlines["e"] && !drawOutlines["n"]) {
                        baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX) + shortHeight - width, Math.round(y * spriteSize - mapOffsetY - width), width, height + width);
                    }
                    else {
                        baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX) + shortHeight - width, Math.round(y * spriteSize - mapOffsetY), width, shortHeight);
                    }
                }
                else if (dir === "w" && draw) {
                    if (drawOutlines["w"] && !drawOutlines["s"]) {
                        baseCtx.fillRect(Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), width, height + width);
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
            baseCtx.drawImage(textureAtlas, clutterSprite.x, clutterSprite.y, 128, 128, Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), spriteSize, spriteSize);
        }
    }
    baseCtx.globalCompositeOperation = "source-over";
    map.shrines.forEach((checkpoint) => {
        if (sightMap[checkpoint.cords.y]?.[checkpoint.cords.x] == "x") {
            const shrine = document.querySelector(".sprites .shrineTile");
            const shrineLit = document.querySelector(".sprites .shrineLitTile");
            let tileX = (checkpoint.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
            let tileY = (checkpoint.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
            if (player?.respawnPoint?.cords.x == checkpoint.cords.x && player?.respawnPoint?.cords.y == checkpoint.cords.y)
                baseCtx?.drawImage(shrineLit, tileX, tileY, spriteSize, spriteSize);
            else
                baseCtx?.drawImage(shrine, tileX, tileY, spriteSize, spriteSize);
        }
    });
    map.treasureChests.forEach((chest) => {
        const lootedChest = lootedChests.find((trs) => trs.cords.x == chest.cords.x && trs.cords.y == chest.cords.y && trs.map == currentMap);
        if (sightMap[chest.cords.y]?.[chest.cords.x] == "x") {
            if (!lootedChest) {
                const chestSprite = document.querySelector(`.sprites .${chest.sprite}`);
                let tileX = (chest.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
                let tileY = (chest.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
                baseCtx?.drawImage(chestSprite, tileX, tileY, spriteSize, spriteSize);
            }
        }
    });
    map.messages.forEach((msg) => {
        if (sightMap[msg.cords.y]?.[msg.cords.x] == "x") {
            const message = document.querySelector(".messageTile");
            let tileX = (msg.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
            let tileY = (msg.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
            baseCtx?.drawImage(message, tileX, tileY, spriteSize, spriteSize);
        }
    });
    map?.entrances?.forEach((entrance) => {
        if (sightMap[entrance.cords.y]?.[entrance.cords.x] == "x") {
            const entranceSprite = document.querySelector(`.sprites .${entrance.sprite}`);
            let tileX = (entrance.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
            let tileY = (entrance.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
            baseCtx?.drawImage(entranceSprite, tileX, tileY, spriteSize, spriteSize);
        }
    });
    /* Render Enemies */
    enemyLayers.textContent = ""; // Delete enemy canvases
    map.enemies.forEach((enemy, index) => {
        if (!enemy.alive || sightMap[enemy.cords.y]?.[enemy.cords.x] != "x")
            return;
        renderEnemyModel(enemy, index, spriteSize);
    });
    /* Render Characters */
    NPCcharacters.forEach((npc) => {
        if (npc.currentMap == currentMap) {
            if (sightMap[npc.currentCords.y]?.[npc.currentCords.x] == "x") {
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
    /* Render projectiles */
    renderProjectiles(spriteSize);
}
function generateFogMap() {
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    const fog = { x: 256, y: 0 };
    for (let y = 0; y < spriteLimitY; y++) {
        for (let x = 0; x < spriteLimitX; x++) {
            if (sightMap[mapOffsetStartY + y]?.[mapOffsetStartX + x] != "x") {
                fogCtx.drawImage(spriteMap_tiles, fog.x, fog.y, 128, 128, Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), spriteSize, spriteSize);
            }
        }
    }
}
function updateSingleTile(x, y, tile) {
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    const tileX = (x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    const tileY = (y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
    baseCtx?.drawImage(spriteMap_tiles, tileX, tileY, spriteSize, spriteSize);
}
//# sourceMappingURL=render_functions.js.map