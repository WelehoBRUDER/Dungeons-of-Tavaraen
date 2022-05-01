let playerOldSight = player.sight();
function renderEntireMap(map: mapObject) {
  const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
  oldCords = { ...player.cords };
  oldZoom = currentZoom;
  /* Render the base layer */
  fogCanvas.width = fogCanvas.width;
  baseCanvas.width = baseCanvas.width;
  generateFogMap();
  for (let y = 0; y < spriteLimitY; y++) {
    for (let x = 0; x < spriteLimitX; x++) {
      baseCtx.globalCompositeOperation = "destination-over";
      if (y + mapOffsetStartY > maps[currentMap].base.length - 1 || y + mapOffsetStartY < 0) continue;
      if (x + mapOffsetStartX > maps[currentMap].base[y].length - 1 || x + mapOffsetStartX < 0) continue;
      const imgId: number = +map.base?.[mapOffsetStartY + y]?.[mapOffsetStartX + x];
      const tile = tiles[imgId];
      const sprite = tiles[imgId]?.spriteMap ?? { x: 128, y: 0 };
      const grave = <HTMLImageElement>document.querySelector(`.sprites .deadModel`);
      const clutterId = map.clutter?.[mapOffsetStartY + y]?.[mapOffsetStartX + x];
      // @ts-expect-error
      const clutterSprite = clutters[clutterId]?.spriteMap;
      if (sprite) {
        baseCtx.drawImage(spriteMap_tiles, sprite.x, sprite.y, 128, 128, Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), spriteSize, spriteSize);
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
    }
  }


  baseCtx.globalCompositeOperation = "source-over";
  map.shrines.forEach((checkpoint: any) => {
    if ((sightMap[checkpoint.cords.y]?.[checkpoint.cords.x] == "x")) {
      const shrine = document.querySelector<HTMLImageElement>(".sprites .shrineTile");
      const shrineLit = document.querySelector<HTMLImageElement>(".sprites .shrineLitTile");
      var tileX = (checkpoint.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
      var tileY = (checkpoint.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
      if (player?.respawnPoint?.cords.x == checkpoint.cords.x && player?.respawnPoint?.cords.y == checkpoint.cords.y) baseCtx?.drawImage(shrineLit, tileX, tileY, spriteSize, spriteSize);
      else baseCtx?.drawImage(shrine, tileX, tileY, spriteSize, spriteSize);
    }
  });

  map.treasureChests.forEach((chest: treasureChest) => {
    const lootedChest = lootedChests.find(trs => trs.cords.x == chest.cords.x && trs.cords.y == chest.cords.y && trs.map == currentMap);
    if ((sightMap[chest.cords.y]?.[chest.cords.x] == "x")) {
      if (!lootedChest) {
        const chestSprite = document.querySelector<HTMLImageElement>(`.sprites .${chest.sprite}`);
        var tileX = (chest.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
        var tileY = (chest.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
        baseCtx?.drawImage(chestSprite, tileX, tileY, spriteSize, spriteSize);
      }
    }
  });

  map.messages.forEach((msg: any) => {
    if ((sightMap[msg.cords.y]?.[msg.cords.x] == "x")) {
      const message = document.querySelector<HTMLImageElement>(".messageTile");
      var tileX = (msg.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
      var tileY = (msg.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
      baseCtx?.drawImage(message, tileX, tileY, spriteSize, spriteSize);
    }
  });

  map?.entrances?.forEach((entrance: any) => {
    if ((sightMap[entrance.cords.y]?.[entrance.cords.x] == "x")) {
      const entranceSprite = document.querySelector<HTMLImageElement>(`.sprites .${entrance.sprite}`);
      var tileX = (entrance.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
      var tileY = (entrance.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
      baseCtx?.drawImage(entranceSprite, tileX, tileY, spriteSize, spriteSize);
    }
  });

  /* Render Enemies */
  enemyLayers.textContent = ""; // Delete enemy canvases
  map.enemies.forEach((enemy: any, index) => {
    if (!enemy.alive || sightMap[enemy.cords.y]?.[enemy.cords.x] != "x") return;
    renderEnemyModel(enemy, index, spriteSize);
  });

  /* Render Characters */
  NPCcharacters.forEach((npc: Npc) => {
    if (npc.currentMap == currentMap) {
      if (sightMap[npc.currentCords.y]?.[npc.currentCords.x] == "x") {
        renderCharacterModel(npc, spriteSize);
      }
    }
  });

  /* Render Summons */
  summonLayers.textContent = ""; // Delete summon canvases
  combatSummons.forEach((enemy: any, index) => {
    if (!enemy.alive) return;
    renderSummonModel(enemy, index, spriteSize);
  });

  /* Render Items */
  mapDataCanvas.width = mapDataCanvas.width;
  itemData.forEach((item: any) => {
    if (item.map != currentMap) return;
    if (!item.itm) return;
    renderItemOnMap(item, spriteSize, sightMap);
  });
  /* Render Player */
  renderPlayerModel(spriteSize, playerCanvas, playerCtx);
}

function renderEnemyModel(enemy: Enemy, index: number, spriteSize: number) {
  var tileX = (enemy.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
  var tileY = (enemy.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
  const canvas = document.createElement("canvas");
  // @ts-ignore
  canvas.classList = `enemy${index} layer`;
  enemy.index = index;
  const ctx = canvas.getContext("2d");
  const enemyImg = <HTMLImageElement>document.querySelector(`.sprites .${enemy.sprite}`);
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  if (enemyImg) {
    /* Render hp bar */
    const hpbg = <HTMLImageElement>document.querySelector(".hpBg");
    const hpbar = <HTMLImageElement>document.querySelector(".hpBar");
    const hpborder = <HTMLImageElement>document.querySelector(".hpBorder");
    ctx?.drawImage(hpbg, (tileX) - spriteSize * (enemy.scale - 1), (tileY - 12) - spriteSize * (enemy.scale - 1), spriteSize * enemy.scale, spriteSize * enemy.scale);
    ctx?.drawImage(hpbar, (tileX) - spriteSize * (enemy.scale - 1), (tileY - 12) - spriteSize * (enemy.scale - 1), (Math.round(enemy.hpRemain()) * spriteSize / 100) * enemy.scale, spriteSize * enemy.scale);
    ctx?.drawImage(hpborder, (tileX) - spriteSize * (enemy.scale - 1), (tileY - 12) - spriteSize * (enemy.scale - 1), spriteSize * enemy.scale, spriteSize * enemy.scale);
    /* Render enemy on top of hp bar */
    ctx?.drawImage(enemyImg, tileX - spriteSize * (enemy.scale - 1), tileY - spriteSize * (enemy.scale - 1), spriteSize * enemy.scale, spriteSize * enemy.scale);
    if (enemy.questSpawn?.quest > -1) {
      ctx.font = `${spriteSize / 1.9}px Arial`;
      ctx.fillStyle = "goldenrod";
      ctx.fillText(`!`, (tileX - spriteSize * (enemy.scale - 1)) + spriteSize / 2.3, (tileY - spriteSize * (enemy.scale - 1)) - spriteSize / 10);
    }
    let statCount = 0;
    enemy.statusEffects.forEach((effect: statEffect) => {
      if (statCount > 4) return;
      let img = new Image(32, 32);
      img.src = effect.icon;
      img.addEventListener("load", e => {
        ctx?.drawImage(img, tileX + spriteSize - 32 * currentZoom, tileY + (32 * statCount * currentZoom), 32 * currentZoom, 32 * currentZoom);
        img = null;
        statCount++;
      });
    });
  }
  enemyLayers.append(canvas);
}

function renderSummonModel(enemy: Summon, index: number, spriteSize: number) {
  var tileX = (enemy.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
  var tileY = (enemy.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
  const canvas = document.createElement("canvas");
  // @ts-ignore
  canvas.classList = `summon${index} layer`;
  const ctx = canvas.getContext("2d");
  summonLayers.append(canvas);
  const enemyImg = <HTMLImageElement>document.querySelector(`.sprites .${enemy.sprite}`);
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  if (enemyImg && (sightMap[enemy.cords.y]?.[enemy.cords.x] == "x")) {
    /* Render hp bar */
    const hpbg = <HTMLImageElement>document.querySelector(".hpBg");
    const hpbar = <HTMLImageElement>document.querySelector(".hpBarAlly");
    const hpborder = <HTMLImageElement>document.querySelector(".hpBorder");
    ctx?.drawImage(hpbg, tileX, tileY - 12, spriteSize, spriteSize);
    ctx?.drawImage(hpbar, tileX, tileY - 12, enemy.hpRemain() * spriteSize / 100, spriteSize);
    ctx?.drawImage(hpborder, tileX, tileY - 12, spriteSize, spriteSize);
    /* Render enemy on top of hp bar */
    ctx?.drawImage(enemyImg, tileX, tileY, spriteSize, spriteSize);
    let statCount = 0;
    enemy.statusEffects.forEach((effect: statEffect) => {
      if (statCount > 4) return;
      let img = new Image(32, 32);
      img.src = effect.icon;
      img.addEventListener("load", e => {
        ctx?.drawImage(img, tileX + spriteSize - 32, tileY + (32 * statCount), 32, 32);
        img = null;
        statCount++;
      });
    });
  }
}

function renderCharacterModel(npc: Npc, spriteSize: number) {
  const charSprite = document.querySelector<HTMLImageElement>(`.sprites .${npc.sprite}`);
  var tileX = (npc.currentCords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
  var tileY = (npc.currentCords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
  if (charSprite) {
    baseCtx?.drawImage(charSprite, tileX, tileY, spriteSize, spriteSize);
  }
}

function renderItemOnMap(item: any, spriteSize: number, sightMap: any) {
  var tileX = (item.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
  var tileY = (item.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
  const itemSprite = item.itm.spriteMap;
  if (sightMap[item.cords.y]?.[item.cords.x] == "x") {
    mapDataCtx.shadowColor = "#ffd900";
    mapDataCtx.shadowBlur = 6;
    mapDataCtx.shadowOffsetX = 0;
    mapDataCtx.shadowOffsetY = 0;
    mapDataCtx?.drawImage(spriteMap_items, itemSprite.x, itemSprite.y, 128, 128, (tileX + spriteSize * item.mapCords.xMod), (tileY + spriteSize * item.mapCords.yMod), spriteSize / 3, spriteSize / 3);
  }
}

function renderRow(map: mapObject, translateX: number, translateY: number) {
  const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();

  if (translateX !== 0) {
    for (let i = 0; i <= Math.abs(translateX); i++) {
      for (let y = 0; y < spriteLimitY; y++) {
        if (translateX < 0) renderGrid(spriteLimitX - i - 1, y);
        else renderGrid(i, y);
      }
    }
  }
  if (translateY !== 0) {
    for (let i = 0; i <= Math.abs(translateY); i++) {
      for (let x = 0; x < spriteLimitX; x++) {
        if (translateY < 0) renderGrid(x, spriteLimitY - i - 1);
        else renderGrid(x, i);
      }
    }
  }

  if (player.sight() !== playerOldSight) {
    sightMap = createSightMap(player.cords, player.sight());
  }
  playerOldSight = player.sight();

  function renderGrid(x: number, y: number) {
    baseCtx.globalCompositeOperation = "destination-over";
    if (y + mapOffsetStartY > maps[currentMap].base.length - 1 || y + mapOffsetStartY < 0) return;
    if (x + mapOffsetStartX > maps[currentMap].base[y].length - 1 || x + mapOffsetStartX < 0) return;
    const imgId: number = +map.base?.[mapOffsetStartY + y]?.[mapOffsetStartX + x];
    const tile = tiles[imgId];
    const sprite = tiles[imgId]?.spriteMap ?? { x: 128, y: 0 };
    const grave = <HTMLImageElement>document.querySelector(`.sprites .deadModel`);
    const clutterId = map.clutter?.[mapOffsetStartY + y]?.[mapOffsetStartX + x];
    // @ts-expect-error
    const clutterSprite = clutters[clutterId]?.spriteMap;
    const fog = { x: 256, y: 0 };
    if (sprite) {
      baseCtx.drawImage(spriteMap_tiles, sprite.x, sprite.y, 128, 128, Math.round(x * spriteSize - mapOffsetX), Math.round(y * spriteSize - mapOffsetY), spriteSize, spriteSize);
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


  }

  baseCtx.globalCompositeOperation = "source-over";
  map.shrines.forEach((checkpoint: any) => {
    if ((sightMap[checkpoint.cords.y]?.[checkpoint.cords.x] == "x")) {
      const shrine = document.querySelector<HTMLImageElement>(".sprites .shrineTile");
      const shrineLit = document.querySelector<HTMLImageElement>(".sprites .shrineLitTile");
      var tileX = (checkpoint.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
      var tileY = (checkpoint.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
      if (player?.respawnPoint?.cords.x == checkpoint.cords.x && player?.respawnPoint?.cords.y == checkpoint.cords.y) baseCtx?.drawImage(shrineLit, tileX, tileY, spriteSize, spriteSize);
      else baseCtx?.drawImage(shrine, tileX, tileY, spriteSize, spriteSize);
    }
  });

  map.treasureChests.forEach((chest: treasureChest) => {
    const lootedChest = lootedChests.find(trs => trs.cords.x == chest.cords.x && trs.cords.y == chest.cords.y && trs.map == currentMap);
    if ((sightMap[chest.cords.y]?.[chest.cords.x] == "x")) {
      if (!lootedChest) {
        const chestSprite = document.querySelector<HTMLImageElement>(`.sprites .${chest.sprite}`);
        var tileX = (chest.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
        var tileY = (chest.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
        baseCtx?.drawImage(chestSprite, tileX, tileY, spriteSize, spriteSize);
      }
    }
  });

  map.messages.forEach((msg: any) => {
    if ((sightMap[msg.cords.y]?.[msg.cords.x] == "x")) {
      const message = document.querySelector<HTMLImageElement>(".messageTile");
      var tileX = (msg.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
      var tileY = (msg.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
      baseCtx?.drawImage(message, tileX, tileY, spriteSize, spriteSize);
    }
  });

  map?.entrances?.forEach((entrance: any) => {
    if ((sightMap[entrance.cords.y]?.[entrance.cords.x] == "x")) {
      const entranceSprite = document.querySelector<HTMLImageElement>(`.sprites .${entrance.sprite}`);
      var tileX = (entrance.cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
      var tileY = (entrance.cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
      baseCtx?.drawImage(entranceSprite, tileX, tileY, spriteSize, spriteSize);
    }
  });

  /* Render Enemies */
  enemyLayers.textContent = ""; // Delete enemy canvases
  map.enemies.forEach((enemy: any, index) => {
    if (!enemy.alive || sightMap[enemy.cords.y]?.[enemy.cords.x] != "x") return;
    renderEnemyModel(enemy, index, spriteSize);
  });

  /* Render Characters */
  NPCcharacters.forEach((npc: Npc) => {
    if (npc.currentMap == currentMap) {
      if (sightMap[npc.currentCords.y]?.[npc.currentCords.x] == "x") {
        renderCharacterModel(npc, spriteSize);
      }
    }
  });

  /* Render Summons */
  summonLayers.textContent = ""; // Delete summon canvases
  combatSummons.forEach((enemy: any, index) => {
    if (!enemy.alive) return;
    renderSummonModel(enemy, index, spriteSize);
  });

  /* Render Items */
  mapDataCanvas.width = mapDataCanvas.width;
  itemData.forEach((item: any) => {
    if (item.map != currentMap) return;
    if (!item.itm) return;
    renderItemOnMap(item, spriteSize, sightMap);
  });
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