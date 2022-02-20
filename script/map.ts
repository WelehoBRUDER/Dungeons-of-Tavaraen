const baseCanvas = <HTMLCanvasElement>document.querySelector(".canvasLayers .baseSheet");
const baseCtx = baseCanvas.getContext("2d");
const mapDataCanvas = <HTMLCanvasElement>document.querySelector(".canvasLayers .mapData");
const mapDataCtx = mapDataCanvas.getContext("2d");
const playerCanvas = <HTMLCanvasElement>document.querySelector(".canvasLayers .playerSheet");
const playerCtx = playerCanvas.getContext("2d");
const enemyLayers = <HTMLDivElement>document.querySelector(".canvasLayers .enemyLayers");
const summonLayers = <HTMLDivElement>document.querySelector(".canvasLayers .summonLayers");
const projectileLayers = <HTMLDivElement>document.querySelector(".canvasLayers .projectileLayers");
const staticHover = <HTMLDivElement>document.querySelector(".mapHover");
const minimapContainer = <HTMLDivElement>document.querySelector(".rightTop .miniMap");
const minimapCanvas = <HTMLCanvasElement>minimapContainer.querySelector(".minimapLayer");
const minimapCtx = minimapCanvas.getContext("2d");
const spriteMap_tiles = <HTMLImageElement>document.querySelector(".spriteMap_tiles");
const spriteMap_items = <HTMLImageElement>document.querySelector(".spriteMap_items");
baseCanvas.addEventListener("mousemove", mapHover);
baseCanvas.addEventListener("mouseup", clickMap);
var currentMap = 2;
var turnOver = true;
var enemiesHadTurn = 0;
let dontMove = false;

const zoomLevels = [0.33, 0.36, 0.4, 0.44, 0.49, 0.55, 0.66, 0.75, 1, 1.25, 1.33, 1.5, 1.65, 1.8, 2, 2.2, 2.35, 2.5];
var currentZoom = 1;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* temporarily store highlight variables here */
const highlight = {
  x: 0,
  y: 0
};

interface mapObject {
  id: string,
  voidTexture?: string;
  base: Array<number[][]>,
  clutter: Array<number[][]>,
  enemies: Array<[]>;
  playerGrave?: any;
  area?: string;
  shrines: Array<any>;
  treasureChests: Array<any>;
  messages: Array<any>;
}
interface tileObject {
  x: number;
  y: number;
}

baseCanvas.addEventListener("wheel", changeZoomLevel);
// @ts-expect-error
function changeZoomLevel({ deltaY }) {
  if (deltaY > 0) {
    currentZoom = zoomLevels[zoomLevels.indexOf(currentZoom) - 1] || zoomLevels[0];
  } else {
    currentZoom = zoomLevels[zoomLevels.indexOf(currentZoom) + 1] || zoomLevels[zoomLevels.length - 1];
  }
  modifyCanvas(true);
}

// @ts-expect-error
window.addEventListener("resize", modifyCanvas);
document.querySelector(".main")?.addEventListener('contextmenu', event => event.preventDefault());

function spriteVariables() {
  const spriteSize = 128 * currentZoom;
  var spriteLimitX = Math.ceil(baseCanvas.width / spriteSize);
  var spriteLimitY = Math.ceil(baseCanvas.height / spriteSize);
  if (spriteLimitX % 2 == 0) spriteLimitX++;
  if (spriteLimitY % 2 == 0) spriteLimitY++;
  const mapOffsetX = (spriteLimitX * spriteSize - baseCanvas.width) / 2;
  const mapOffsetY = (spriteLimitY * spriteSize - baseCanvas.height) / 2;
  const mapOffsetStartX = player.cords.x - Math.floor(spriteLimitX / 2);
  const mapOffsetStartY = player.cords.y - Math.floor(spriteLimitY / 2);

  return { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY };
}

function renderMinimap(map: mapObject) {
  const miniSpriteSize = 8;
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
      const imgId = map.base?.[y]?.[x];
      // @ts-expect-error
      const sprite = tiles[imgId]?.spriteMap ?? { x: 128, y: 0 };
      const clutterId = map.clutter?.[y]?.[x];
      // @ts-expect-error
      const clutterSprite = clutters[clutterId]?.spriteMap;
      if (sprite) {
        minimapCtx.drawImage(spriteMap_tiles, sprite.x, sprite.y, 128, 128, x * miniSpriteSize, y * miniSpriteSize, miniSpriteSize + 1, miniSpriteSize + 1);
      }
      if (clutterSprite) {
        minimapCtx.drawImage(spriteMap_tiles, clutterSprite.x, clutterSprite.y, 128, 128, x * miniSpriteSize, y * miniSpriteSize, miniSpriteSize + 1, miniSpriteSize + 1);
      }
    }
  }
}

function moveMinimap() {
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
let sightMap: any;
function renderMap(map: mapObject, createNewSightMap: boolean = false) {

  baseCanvas.width = baseCanvas.width; // Clears the canvas
  if (!baseCtx) throw new Error("2D context from base canvas is missing!");
  const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();


  if (createNewSightMap) sightMap = createSightMap(player.cords, player.sight());
  if (!sightMap) return;

  /* Render the base layer */
  for (let y = 0; y < spriteLimitY; y++) {
    for (let x = 0; x < spriteLimitX; x++) {
      if (y + mapOffsetStartY > maps[currentMap].base.length - 1 || y + mapOffsetStartY < 0) continue;
      if (x + mapOffsetStartX > maps[currentMap].base[y].length - 1 || x + mapOffsetStartX < 0) continue;
      const imgId = map.base?.[mapOffsetStartY + y]?.[mapOffsetStartX + x];
      // @ts-expect-error
      const sprite = tiles[imgId]?.spriteMap ?? { x: 128, y: 0 };
      const grave = <HTMLImageElement>document.querySelector(`.sprites .deadModel`);
      const clutterId = map.clutter?.[mapOffsetStartY + y]?.[mapOffsetStartX + x];
      // @ts-expect-error
      const clutterSprite = clutters[clutterId]?.spriteMap;
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
      if (sightMap[mapOffsetStartY + y]?.[mapOffsetStartX + x] != "x" && imgId) {
        baseCtx.drawImage(spriteMap_tiles, fog.x, fog.y, 128, 128, Math.floor(x * spriteSize - mapOffsetX), Math.floor(y * spriteSize - mapOffsetY), Math.floor(spriteSize + 2), Math.floor(spriteSize + 2));
      }
    }
  }

  map.shrines.forEach((checkpoint: any) => {
    if ((sightMap[checkpoint.cords.y]?.[checkpoint.cords.x] == "x")) {
      const shrine = document.querySelector<HTMLImageElement>(".shrineTile");
      const shrineLit = document.querySelector<HTMLImageElement>(".shrineLitTile");
      var tileX = (checkpoint.cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
      var tileY = (checkpoint.cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
      if (player?.respawnPoint?.cords.x == checkpoint.cords.x && player?.respawnPoint?.cords.y == checkpoint.cords.y) baseCtx?.drawImage(shrineLit, tileX, tileY, spriteSize, spriteSize);
      else baseCtx?.drawImage(shrine, tileX, tileY, spriteSize, spriteSize);
    }
  });

  map.treasureChests.forEach((chest: treasureChest) => {
    const lootedChest = lootedChests.find(trs => trs.cords.x == chest.cords.x && trs.cords.y == chest.cords.y && trs.map == chest.map);
    if ((sightMap[chest.cords.y]?.[chest.cords.x] == "x")) {
      if (!lootedChest) {
        const chestSprite = document.querySelector<HTMLImageElement>(`.${chest.sprite}`);
        var tileX = (chest.cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
        var tileY = (chest.cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
        baseCtx?.drawImage(chestSprite, tileX, tileY, spriteSize, spriteSize);
      }
    }
  });

  map.messages.forEach((msg: any) => {
    if ((sightMap[msg.cords.y]?.[msg.cords.x] == "x")) {
      const message = document.querySelector<HTMLImageElement>(".messageTile");
      var tileX = (msg.cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
      var tileY = (msg.cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
      baseCtx?.drawImage(message, tileX, tileY, spriteSize, spriteSize);
    }
  });

  /* Render Enemies */
  enemyLayers.textContent = ""; // Delete enemy canvases
  map.enemies.forEach((enemy: any, index) => {
    if (!enemy.alive || sightMap[enemy.cords.y]?.[enemy.cords.x] != "x") return;
    var tileX = (enemy.cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    var tileY = (enemy.cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
    const canvas = document.createElement("canvas");
    // @ts-ignore
    canvas.classList = `enemy${index} layer`;
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
      ctx?.drawImage(hpbar, (tileX) - spriteSize * (enemy.scale - 1), (tileY - 12) - spriteSize * (enemy.scale - 1), (Math.floor(enemy.hpRemain()) * spriteSize / 100) * enemy.scale, spriteSize * enemy.scale);
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
  });

  /* Render Characters */
  NPCcharacters.forEach((npc: Npc) => {
    if (npc.currentMap == currentMap) {
      if (sightMap[npc.currentCords.y]?.[npc.currentCords.x] == "x") {
        const charSprite = document.querySelector<HTMLImageElement>("." + npc.sprite);
        var tileX = (npc.currentCords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
        var tileY = (npc.currentCords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
        if (charSprite) {
          baseCtx?.drawImage(charSprite, tileX, tileY, spriteSize, spriteSize);
        }
      }
    }
  });

  /* Render Summons */
  summonLayers.textContent = ""; // Delete summon canvases
  combatSummons.forEach((enemy: any, index) => {
    if (!enemy.alive) return;
    var tileX = (enemy.cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    var tileY = (enemy.cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
    const canvas = document.createElement("canvas");
    // @ts-ignore
    canvas.classList = `summon${index} layer`;
    const ctx = canvas.getContext("2d");
    summonLayers.append(canvas);
    const enemyImg = <HTMLImageElement>document.querySelector(`.${enemy.sprite}`);
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
  });

  /* Render Items */
  mapDataCanvas.width = mapDataCanvas.width;
  itemData.forEach((item: any) => {
    if (item.map != currentMap) return;
    if (!item.itm) return;
    var tileX = (item.cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    var tileY = (item.cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
    const itemSprite = item.itm.spriteMap;
    if (sightMap[item.cords.y]?.[item.cords.x] == "x") {
      mapDataCtx.shadowColor = "#ffd900";
      mapDataCtx.shadowBlur = 6;
      mapDataCtx.shadowOffsetX = 0;
      mapDataCtx.shadowOffsetY = 0;
      mapDataCtx?.drawImage(spriteMap_items, itemSprite.x, itemSprite.y, 128, 128, (tileX + spriteSize * item.mapCords.xMod), (tileY + spriteSize * item.mapCords.yMod), spriteSize / 3, spriteSize / 3);
    }
  });
  /* Render Player */
  renderPlayerModel(spriteSize, playerCanvas, playerCtx);
}

function renderTileHover(tile: tileObject, event: MouseEvent) {
  if (!baseCtx) throw new Error("2D context from base canvas is missing!");
  const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
  var tileX = (tile.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
  var tileY = (tile.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;

  playerCanvas.width = playerCanvas.width;
  if (dontMove) {
    renderPlayerModel(spriteSize, playerCanvas, playerCtx);
    dontMove = false;
    return;
  }
  try {

    /* Render tile */
    const strokeSprite = staticTiles[0].spriteMap;
    const highlightSprite = staticTiles[3]?.spriteMap;
    const highlightRedSprite = staticTiles[4]?.spriteMap;
    const highlight2Sprite = staticTiles[5]?.spriteMap;
    const highlight2RedSprite = staticTiles[6]?.spriteMap;
    renderPlayerModel(spriteSize, playerCanvas, playerCtx);
    var hoveredEnemy = false;
    maps[currentMap].enemies.forEach((enemy: any) => {
      if (enemy.cords.x == tile.x && enemy.cords.y == tile.y) {
        hoverEnemyShow(enemy);
        hoveredEnemy = true;
      }
    });
    let hoveredSummon = false;
    combatSummons.forEach((summon: any) => {
      if (summon.cords.x == tile.x && summon.cords.y == tile.y) {
        hoverEnemyShow(summon);
        hoveredSummon = true;
      }
    });
    if (!hoveredEnemy && !hoveredSummon) {
      hideMapHover();
    }

    if (state.abiSelected.type == "movement" || state.abiSelected.type == "charge") {
      const path: any = generatePath({ x: player.cords.x, y: player.cords.y }, tile, false, false);
      let distance: number = state.isSelected ? state.abiSelected.use_range : player.weapon.range;
      let iteration: number = 0;
      path.forEach((step: any) => {
        iteration++;
        if (step.x == player.cords.x && step.y == player.cords.y) return;
        var _tileX = (step.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
        var _tileY = (step.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
        if (iteration > distance) {
          playerCtx.drawImage(spriteMap_tiles, highlight2RedSprite.x, highlight2RedSprite.y, 128, 128, Math.floor(_tileX), Math.floor(_tileY), Math.floor(spriteSize + 1), Math.floor(spriteSize + 1));
        }
        else playerCtx.drawImage(spriteMap_tiles, highlight2Sprite.x, highlight2Sprite.y, 128, 128, Math.round(_tileX), Math.round(_tileY), Math.round(spriteSize + 1), Math.round(spriteSize + 1));
      });
    }
    /* Render highlight test */
    else if ((((state.abiSelected?.shoots_projectile && state.isSelected) || player.weapon.firesProjectile && state.rangedMode) && event.buttons !== 1)) {
      const path: any = generateArrowPath({ x: player.cords.x, y: player.cords.y }, tile);
      let distance: number = state.isSelected ? state.abiSelected.use_range : player.weapon.range;
      let iteration: number = 0;
      let lastStep: number = 0;
      path.forEach((step: any) => {
        iteration++;
        if (step.x == player.cords.x && step.y == player.cords.y) return;
        var _tileX = (step.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
        var _tileY = (step.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
        if ((step.blocked && step.x !== tile.x && step.y !== tile.y) || iteration > distance) {
          if (lastStep == 0) lastStep = iteration;
          playerCtx.drawImage(spriteMap_tiles, highlightRedSprite.x, highlightRedSprite.y, 128, 128, Math.round(_tileX), Math.round(_tileY), Math.round(spriteSize + 1), Math.round(spriteSize + 1));
        }
        else playerCtx.drawImage(spriteMap_tiles, highlightSprite.x, highlightSprite.y, 128, 128, Math.round(_tileX), Math.round(_tileY), Math.round(spriteSize + 1), Math.round(spriteSize + 1));
      });
      if (state.abiSelected?.aoe_size > 0) {
        let aoeMap = createAOEMap(lastStep > 0 ? path[lastStep - 1] : path[path.length - 1], state.abiSelected.aoe_size);
        for (let y = 0; y < spriteLimitY; y++) {
          for (let x = 0; x < spriteLimitX; x++) {
            if (aoeMap[mapOffsetStartY + y]?.[mapOffsetStartX + x] == "x") {
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
      } else playerCtx.drawImage(spriteMap_tiles, highlight2RedSprite.x, highlight2RedSprite.y, 128, 128, Math.round(_tileX), Math.round(_tileY), Math.round(spriteSize + 1), Math.round(spriteSize + 1));
    }
    if (event.buttons == 1 && !state.isSelected) {
      const path: any = generatePath({ x: player.cords.x, y: player.cords.y }, tile, player.canFly);
      path.forEach((step: any) => {
        if (step.x == player.cords.x && step.y == player.cords.y) return;
        var _tileX = (step.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
        var _tileY = (step.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
        if (step.blocked) {
          playerCtx.drawImage(spriteMap_tiles, highlightRedSprite.x, highlightRedSprite.y, 128, 128, Math.round(_tileX), Math.round(_tileY), Math.round(spriteSize + 1), Math.round(spriteSize + 1));
        }
        else playerCtx.drawImage(spriteMap_tiles, highlightSprite.x, highlightSprite.y, 128, 128, Math.round(_tileX), Math.round(_tileY), Math.round(spriteSize + 1), Math.round(spriteSize + 1));
      });
    }
    playerCtx.drawImage(spriteMap_tiles, strokeSprite.x, strokeSprite.y, 128, 128, tileX, tileY, Math.round(spriteSize + 1), Math.round(spriteSize + 1));
  }
  catch { }
}

function renderAOEHoverOnPlayer(aoeSize: number, ignoreLedge: boolean) {
  if (!baseCtx) throw new Error("2D context from base canvas is missing!");
  const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
  playerCanvas.width = playerCanvas.width;
  renderPlayerModel(spriteSize, playerCanvas, playerCtx);
  const highlightRedSprite = staticTiles[4]?.spriteMap;
  let aoeMap = createAOEMap(player.cords, aoeSize, ignoreLedge);
  for (let y = 0; y < spriteLimitY; y++) {
    for (let x = 0; x < spriteLimitX; x++) {
      if (aoeMap[mapOffsetStartY + y]?.[mapOffsetStartX + x] == "x" && !(player.cords.x == x && player.cords.y == y)) {
        playerCtx.drawImage(spriteMap_tiles, highlightRedSprite.x, highlightRedSprite.y, 128, 128, x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, Math.round(spriteSize + 1), Math.round(spriteSize + 1));
      }
    }
  }
}

function mapHover(event: MouseEvent) {
  const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
  const lX = Math.floor(((event.offsetX - baseCanvas.width / 2) + spriteSize / 2) / spriteSize);
  const lY = Math.floor(((event.offsetY - baseCanvas.height / 2) + spriteSize / 2) / spriteSize);
  const x = lX + player.cords.x;
  const y = lY + player.cords.y;
  if (x < 0 || x > maps[currentMap].base[0].length - 1 || y < 0 || y > maps[currentMap].base.length - 1) return;
  if (DEVMODE) {
    CURSOR_LOCATION.x = x;
    CURSOR_LOCATION.y = y;
    updateDeveloperInformation();
  }
  renderTileHover({ x: x, y: y }, event);
}

function clickMap(event: MouseEvent) {
  if (state.clicked || player.isDead) return;
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
    renderTileHover({ x: x, y: y }, event);
    dontMove = true;
    return;
  }
  if (dontMove) {
    dontMove = false;
    return;
  }
  itemData.some((item: any) => {
    if (item.cords.x == x && item.cords.y == y) {
      pickLoot();
      return true;
    }
  });
  maps[currentMap].shrines.some((shrine: any) => {
    if (shrine.cords.x == x && shrine.cords.y == y) {
      activateShrine();
      return true;
    }
  });
  maps[currentMap].messages.some((msg: any) => {
    if (msg.cords.x == x && msg.cords.y == y && msg.cords.x === player.cords.x && msg.cords.y === player.cords.y) {
      readMessage();
      return true;
    }
  });
  maps[currentMap].treasureChests.some((chest: treasureChest) => {
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
    NPCcharacters.some((npc: Npc) => {
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
      if (!enemy.alive) break;
      targetingEnemy = true;
      if (state.isSelected) {
        // @ts-expect-error
        if (generateArrowPath(player.cords, enemy.cords).length <= state.abiSelected.use_range || weaponReach(player, state.abiSelected.use_range, enemy)) {
          if ((state.abiSelected.requires_melee_weapon && player.weapon.firesProjectile) || (state.abiSelected.requires_ranged_weapon && !player.weapon.firesProjectile)) break;
          if (state.abiSelected.type == "attack") {
            if (state.abiSelected.shoots_projectile) fireProjectile(player.cords, enemy.cords, state.abiSelected.shoots_projectile, state.abiSelected, true, player);
            else regularAttack(player, enemy, state.abiSelected);
            // @ts-expect-error
            if (weaponReach(player, state.abiSelected.use_range, enemy)) attackTarget(player, enemy, weaponReach(player, state.abiSelected.use_range, enemy));
            if (!state.abiSelected.shoots_projectile) advanceTurn();
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
          regularAttack(player, enemy, player.abilities?.find(e => e.id == "attack"));
          advanceTurn();
        }
        // @ts-ignore
      } else if (player.weapon.range >= generateArrowPath(player.cords, enemy.cords).length && player.weapon.firesProjectile) {
        // @ts-ignore
        fireProjectile(player.cords, enemy.cords, player.weapon.firesProjectile, player.abilities?.find(e => e.id == "attack"), true, player);
      }
      move = false;
      break;
    }
  };
  if (state.isSelected && state.abiSelected?.aoe_size > 0 && !targetingEnemy) {
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
    if (state.abiSelected.statusesUser?.length > 0) {
      state.abiSelected.statusesUser.forEach((status: string) => {
        if (!player.statusEffects.find((eff: statEffect) => eff.id == status)) {
          // @ts-ignore
          player.statusEffects.push(new statEffect({ ...statusEffects[status] }, state.abiSelected.statusModifiers));
        } else {
          player.statusEffects.find((eff: statEffect) => eff.id == status).last.current += statusEffects[status].last.total;
        }
        // @ts-ignore
        statusEffects[status].last.current = statusEffects[status].last.total;
        spawnFloatingText(player.cords, state.abiSelected.line, "crimson", 36);
        let string: string = "";
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

const emptyMap = (base_tiles: Array<number[]>) => new Array(base_tiles.length).fill("0").map(e => new Array(base_tiles[0].length).fill("0"));

function createSightMap(start: tileObject, size: number) {
  let _sightMap: Array<any[]> = JSON.parse(JSON.stringify(sightMap_empty));
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

function createAOEMap(start: tileObject, size: number, ignoreLedge: boolean = false) {
  let aoeMap = emptyMap(maps[currentMap].base);
  let testiIsonnus = size ** 2;
  return aoeMap.map((rivi, y) => rivi.map((_, x) => {
    let pass = true;
    if (tiles[maps[currentMap].base[y][x]].isLedge && !ignoreLedge) pass = false;
    if (pass && !tiles[maps[currentMap].base[y][x]].isWall && !clutters[maps[currentMap].clutter[y][x]].isWall) {
      if (Math.abs(x - start.x) ** 2 + Math.abs(y - start.y) ** 2 < testiIsonnus) return "x";
    }
    return "0";
  }));
}

function cordsFromDir(cords: tileObject, dir: string) {
  let cord = { ...cords };
  if (dir == "up") cord.y--;
  else if (dir == "down") cord.y++;
  else if (dir == "left") cord.x--;
  else if (dir == "right") cord.x++;
  return cord;
}
document.addEventListener("keyup", (keyPress) => {
  const rooted = player.isRooted();
  if (!turnOver || state.dialogWindow || state.storeOpen) return;
  let dirs = { [settings.hotkey_move_up]: "up", [settings.hotkey_move_down]: "down", [settings.hotkey_move_left]: "left", [settings.hotkey_move_right]: "right" } as any;
  let target = maps[currentMap].enemies.find((e: any) => e.cords.x == cordsFromDir(player.cords, dirs[keyPress.key]).x && e.cords.y == cordsFromDir(player.cords, dirs[keyPress.key]).y);
  if (rooted && !player.isDead && dirs[keyPress.key] && !target) {
    advanceTurn();
    state.abiSelected = {};
    return;
  }
  if (!turnOver || player.isDead || state.menuOpen || state.invOpen || state.savesOpen || state.optionsOpen || state.charOpen || state.perkOpen || state.titleScreen) return;
  let shittyFix = JSON.parse(JSON.stringify(player));
  if (parseInt(player.carryingWeight()) > parseInt(player.maxCarryWeight()) && dirs[keyPress.key]) {
    displayText(`<c>white<c>[WORLD] <c>orange<c>${lang["too_much_weight"]}`);
    return;
  }
  if (keyPress.key == settings.hotkey_move_up && canMove(player, "up") && !rooted) { player.cords.y--; }
  else if (keyPress.key == settings.hotkey_move_down && canMove(player, "down") && !rooted) { player.cords.y++; }
  else if (keyPress.key == settings.hotkey_move_left && canMove(player, "left") && !rooted) { player.cords.x--; }
  else if (keyPress.key == settings.hotkey_move_right && canMove(player, "right") && !rooted) { player.cords.x++; }
  if (dirs[keyPress.key]) {
    if (canMove(shittyFix, dirs[keyPress.key]) && !rooted) {
      moveMinimap();
      // @ts-ignore
      renderMap(maps[currentMap], true);
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
          regularAttack(player, target, player.abilities?.find(e => e.id == "attack"));
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
    maps[currentMap].treasureChests.forEach((chest: treasureChest) => {
      const lootedChest = lootedChests.find(trs => trs.cords.x == chest.cords.x && trs.cords.y == chest.cords.y && trs.map == chest.map);
      if (chest.cords.x == player.cords.x && chest.cords.y == player.cords.y && !lootedChest) chest.lootChest();
    });
    if (!state.textWindowOpen && !state.invOpen) {
      talkToCharacter();
    }
  }
});

function restoreGrave() {
  if (!player.grave) return;
  if (player.cords.x == player.grave.cords.x && player.cords.y == player.grave.cords.y) {
    player.addGold(player.grave.gold);
    player.level.xp += player.grave.xp;
    player.grave = null;
    spawnFloatingText(player.cords, "GRAVE RESTORED!", "lime", 25, 3000);
    modifyCanvas();
    updateUI();
  }
}

let isMovingCurrently: boolean = false;
let breakMoving: boolean = false;

async function movePlayer(goal: tileObject, ability: boolean = false, maxRange: number = 99, action: Function = null) {
  if (goal.x < 0 || goal.x > maps[currentMap].base[0].length - 1 || goal.y < 0 || goal.y > maps[currentMap].base.length - 1) return;
  if (!turnOver || player.isDead) return;
  const path: any = generatePath(player.cords, goal, false);
  let count: number = 0;
  state.isSelected = false;
  if (isMovingCurrently) breakMoving = true;
  moving: for (let step of path) {
    if (canMoveTo(player, step)) {
      await sleep(30);
      isMovingCurrently = true;
      player.cords.x = step.x;
      player.cords.y = step.y;
      modifyCanvas(true);
      if (!ability) {
        advanceTurn();
      }
      count++;
      if (state.inCombat && !ability || count > maxRange && ability || breakMoving) break moving;
    }
  }
  breakMoving = false;
  isMovingCurrently = false;
  if (!ability) {
    if (count > 0) displayText(`<c>green<c>[MOVEMENT]<c>white<c> Ran for ${count} turn(s).`);
    if (state.inCombat && count == 1) {
      if (Math.floor(player.hpRegen() * 0.5) > 0) displayText(`<c>white<c>[PASSIVE] <c>lime<c>Recovered ${Math.floor(player.hpRegen() * 0.5)} HP.`);
    }
    else if (state.inCombat && count > 1) {
      let regen = Math.floor(player.hpRegen() * count - 1) + Math.floor(player.hpRegen() * 0.5);
      if (regen > 0) displayText(`<c>white<c>[PASSIVE] <c>lime<c>Recovered ${regen} HP.`);
      displayText(`<c>green<c>[MOVEMENT] <c>orange<c>Stopped moving due to encontering an enemy.`);
    } else if (count > 0) {
      if (Math.floor(player.hpRegen() * count) > 0) displayText(`<c>white<c>[PASSIVE] <c>lime<c>Recovered ${Math.floor(player.hpRegen() * count)} HP.`);
    }
  }
  else if (!action) { advanceTurn(); state.abiSelected = {}; }
  else if (action) {
    action();
    advanceTurn();
    state.abiSelected = {};
  }
}

async function moveEnemy(goal: tileObject, enemy: Enemy | characterObject, ability: Ability = null, maxRange: number = 99) {
  // @ts-ignore
  const path: any = generatePath(enemy.cords, goal, false);
  let count: number = 0;
  moving: for (let step of path) {
    if (canMoveTo(enemy, step)) {
      await sleep(55);
      enemy.cords.x = step.x;
      enemy.cords.y = step.y;
      modifyCanvas();

      count++;
      if (count > maxRange) break moving;
    }
  }
  // @ts-expect-error
  attackTarget(enemy, enemy.chosenTarget, weaponReach(enemy, 1, enemy.chosenTarget));
  regularAttack(enemy, enemy.chosenTarget, ability);
  updateUI();
  updateEnemiesTurn();
}



function canMove(char: any, dir: string) {
  try {
    var tile = { x: char.cords.x, y: char.cords.y };
    if (dir == "up") tile.y--;
    else if (dir == "down") tile.y++;
    else if (dir == "left") tile.x--;
    else if (dir == "right") tile.x++;
    var movable = true;
    if (tiles[maps[currentMap].base[tile.y][tile.x]].isWall || (tiles[maps[currentMap].base[tile.y][tile.x]].isLedge && !char.canFly)) movable = false;
    if (clutters[maps[currentMap].clutter[tile.y][tile.x]].isWall) movable = false;
    for (let enemy of maps[currentMap].enemies) {
      if (enemy.cords.x == tile.x && enemy.cords.y == tile.y) movable = false;
    }
    for (let npc of NPCcharacters) {
      if (npc.currentMap == currentMap) {
        if (npc.currentCords.x == tile.x && npc.currentCords.y == tile.y) movable = false;
      }
    }
    return movable;
  }
  catch { }
}

function canMoveTo(char: any, tile: tileObject) {
  var movable = true;
  if (tiles[maps[currentMap].base[tile.y][tile.x]].isWall || (tiles[maps[currentMap].base[tile.y][tile.x]].isLedge && !char.canFly)) movable = false;
  if (clutters[maps[currentMap].clutter[tile.y][tile.x]].isWall) movable = false;
  for (let enemy of maps[currentMap].enemies) {
    if (enemy.cords.x == tile.x && enemy.cords.y == tile.y) movable = false;
  }
  if (char.id !== "player") {
    for (let summon of combatSummons) {
      if (summon.cords.x == tile.x && summon.cords.y == tile.y) movable = false;
    }
  }
  for (let npc of NPCcharacters) {
    if (npc.currentMap == currentMap) {
      if (npc.currentCords.x == tile.x && npc.currentCords.y == tile.y) movable = false;
    }
  }
  if (player.cords.x == tile.x && player.cords.y == tile.y) movable = false;
  return movable;
}

function renderPlayerOutOfMap(size: number, canvas: HTMLCanvasElement, ctx: any, side: string = "center", playerModel: any = player, noClothes: boolean = false) {
  canvas.width = canvas.width; // Clear canvas
  const sex = playerModel.sex === "male" ? "" : capitalizeFirstLetter(playerModel.sex);
  const bodyModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.race + "Model" + capitalizeFirstLetter(playerModel.sex));
  const earModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.race + "Ears");
  const hairModel = <HTMLImageElement>document.querySelector(".sprites .hair" + playerModel.hair);
  const eyeModel = <HTMLImageElement>document.querySelector(".sprites .eyes" + playerModel.eyes);
  const faceModel = <HTMLImageElement>document.querySelector(".sprites .face" + playerModel.face);
  const leggings = <HTMLImageElement>document.querySelector(`.sprites .defaultPants${capitalizeFirstLetter(player.sex)}`);
  var x = 0;
  var y = 0;
  if (side == "left") x = 0 - size / 4;
  ctx?.drawImage(bodyModel, x, y, size, size);
  ctx?.drawImage(earModel, x, y, size, size);
  ctx?.drawImage(eyeModel, x, y, size, size);
  ctx?.drawImage(faceModel, x, y, size, size);
  ctx?.drawImage(leggings, x, y, size, size);
  if (!playerModel.helmet?.coversHair || noClothes) ctx?.drawImage(hairModel, x, y, size, size);
  if (!noClothes) {
    if (playerModel.helmet?.sprite) {
      const helmetModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.helmet.sprite + sex);
      ctx?.drawImage(helmetModel, x, y, size, size);
    }
    if (playerModel.gloves?.sprite) {
      const glovesModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.gloves.sprite + sex);
      ctx?.drawImage(glovesModel, x, y, size, size);
    }
    if (playerModel.boots?.sprite) {
      const bootsModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.boots.sprite + sex);
      ctx?.drawImage(bootsModel, x, y, size, size);
    }
    if (playerModel.legs?.sprite) {
      const leggingsModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.legs.sprite + sex);
      ctx?.drawImage(leggingsModel, x, y, size, size);
    }
    else if (!playerModel.legs?.sprite) {
      const leggings = <HTMLImageElement>document.querySelector(`.sprites .defaultPants${capitalizeFirstLetter(player.sex)}`);
      ctx?.drawImage(leggings, x, y, size, size);
    }
    if (playerModel.chest?.sprite) {
      const chestModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.chest.sprite + sex);
      ctx?.drawImage(chestModel, x, y, size, size);
    }
  }
  if (playerModel.weapon?.sprite) {
    const weaponModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.weapon.sprite);
    ctx?.drawImage(weaponModel, x, y, size, size);
  }
  if (playerModel.offhand?.sprite) {
    const offhandModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.offhand.sprite);
    ctx?.drawImage(offhandModel, x, y, size, size);
  }
}

function renderNPCOutOfMap(size: number, canvas: HTMLCanvasElement, ctx: any, npc: Npc, side: string = "center") {
  canvas.width = canvas.width; // Clear canvas
  const sprite = <HTMLImageElement>document.querySelector(".sprites ." + npc.sprite);
  var x = 0;
  var y = 0;
  if (side == "left") x = 0 - size / 4;
  ctx?.drawImage(sprite, x, y, size, size);
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

function renderPlayerModel(size: number, canvas: HTMLCanvasElement, ctx: any) {
  canvas.width = canvas.width; // Clear canvas
  const sex = player.sex === "male" ? "" : capitalizeFirstLetter(player.sex);
  if (player.isDead) return;
  const bodyModel = <HTMLImageElement>document.querySelector(".sprites ." + player.race + "Model" + capitalizeFirstLetter(player.sex));
  const earModel = <HTMLImageElement>document.querySelector(".sprites ." + player.race + "Ears");
  const hairModel = <HTMLImageElement>document.querySelector(".sprites .hair" + player.hair);
  const eyeModel = <HTMLImageElement>document.querySelector(".sprites .eyes" + player.eyes);
  const faceModel = <HTMLImageElement>document.querySelector(".sprites .face" + player.face);

  player.statusEffects.forEach((eff: statEffect) => {
    if (eff.aura) {
      const aura = <HTMLImageElement>document.querySelector(".sprites ." + eff.aura);
      ctx?.drawImage(aura, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
  });
  ctx?.drawImage(bodyModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  ctx?.drawImage(earModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  ctx?.drawImage(eyeModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  ctx?.drawImage(faceModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  if (!player.helmet?.coversHair) ctx?.drawImage(hairModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  if (player.helmet?.sprite) {
    const helmetModel = <HTMLImageElement>document.querySelector(".sprites ." + player.helmet.sprite + sex);
    ctx?.drawImage(helmetModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
  if (player.gloves?.sprite) {
    const glovesModel = <HTMLImageElement>document.querySelector(".sprites ." + player.gloves.sprite + sex);
    ctx?.drawImage(glovesModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
  if (player.boots?.sprite) {
    const bootsModel = <HTMLImageElement>document.querySelector(".sprites ." + player.boots.sprite + sex);
    ctx?.drawImage(bootsModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
  if (player.legs?.sprite) {
    const leggingsModel = <HTMLImageElement>document.querySelector(".sprites ." + player.legs.sprite + sex);
    ctx?.drawImage(leggingsModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
  else if (!player.legs?.sprite) {
    const leggings = <HTMLImageElement>document.querySelector(`.sprites .defaultPants${capitalizeFirstLetter(player.sex)}`);
    ctx?.drawImage(leggings, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
  if (player.chest?.sprite) {
    const chestModel = <HTMLImageElement>document.querySelector(".sprites ." + player.chest.sprite + sex);
    ctx?.drawImage(chestModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
  if (player.weapon?.sprite) {
    const weaponModel = <HTMLImageElement>document.querySelector(".sprites ." + player.weapon.sprite);
    ctx?.drawImage(weaponModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
  if (player.offhand?.sprite) {
    const offhandModel = <HTMLImageElement>document.querySelector(".sprites ." + player.offhand.sprite);
    ctx?.drawImage(offhandModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
}

function calcDistance(startX: number, startY: number, endX: number, endY: number) {
  let xDist = Math.abs(endX - startX);
  let yDist = Math.abs(endY - startY);
  return xDist + yDist;
}


function generatePath(start: tileObject, end: tileObject, canFly: boolean, distanceOnly: boolean = false, retreatPath: number = 0) {
  var distance = Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
  if (distanceOnly) {
    let newDistance = distance;
    if ((Math.abs(start.x - end.x) == Math.abs(start.y - end.y)) && distance < 3) newDistance = Math.round(newDistance / 2);
    return newDistance;
  }
  if (end.x < 0 || end.x > maps[currentMap].base[0].length - 1 || end.y < 0 || end.y > maps[currentMap].base.length - 1) return;
  let fieldMap: Array<number[]>;
  if (canFly) fieldMap = JSON.parse(JSON.stringify(staticMap_flying));
  else fieldMap = JSON.parse(JSON.stringify(staticMap_normal));
  if (start.x !== player.cords.x && start.y !== player.cords.y) {
    fieldMap[player.cords.y][player.cords.x] = 1;
    combatSummons.forEach(summon => {
      if (summon.cords.x !== start.x && summon.cords.y !== start.y) {
        fieldMap[summon.cords.y][summon.cords.x] = 1;
      }
    });
  }
  maps[currentMap].enemies.forEach((enemy: any) => { if (!(start.x == enemy.cords.x && start.y == enemy.cords.y)) { { fieldMap[enemy.cords.y][enemy.cords.x] = 1; }; } });
  NPCcharacters.forEach((npc: Npc) => {
    if (npc.currentMap == currentMap) {
      fieldMap[npc.currentCords.y][npc.currentCords.x] = 1;
    }
  });
  fieldMap[start.y][start.x] = 0;
  fieldMap[end.y][end.x] = 5;
  let calls = 0;
  let maximumCalls = 2000;
  const checkGrid: Array<any> = [{ v: 5, x: end.x, y: end.y }];
  while (fieldMap[start.y][start.x] == 0 && checkGrid.length > 0 && calls < maximumCalls) {
    const { v, x, y } = checkGrid.splice(0, 1)[0];
    if (fieldMap[y][x] == v) {
      // Check diagonal
      // North-west
      if (fieldMap[y - 1]?.[x - 1] === 0 && (fieldMap[y]?.[x - 1] === 0 || fieldMap[y - 1]?.[x] === 0)) {
        fieldMap[y - 1][x - 1] = v + 1;
        checkGrid.push({ v: v + 1, x: x - 1, y: y - 1, dist: calcDistance(x - 1, y - 1, start.x, start.y) });
      }
      // North-east
      if (fieldMap[y - 1]?.[x + 1] === 0 && (fieldMap[y]?.[x + 1] === 0 || fieldMap[y - 1]?.[x] === 0)) {
        fieldMap[y - 1][x + 1] = v + 1;
        checkGrid.push({ v: v + 1, x: x + 1, y: y - 1, dist: calcDistance(x + 1, y - 1, start.x, start.y) });
      }
      // South-west
      if (fieldMap[y + 1]?.[x - 1] === 0 && (fieldMap[y]?.[x - 1] === 0 || fieldMap[y + 1]?.[x] === 0)) {
        fieldMap[y + 1][x - 1] = v + 1;
        checkGrid.push({ v: v + 1, x: x - 1, y: y + 1, dist: calcDistance(x - 1, y + 1, start.x, start.y) });
      }
      // South-east
      if (fieldMap[y + 1]?.[x + 1] === 0 && (fieldMap[y]?.[x + 1] === 0 || fieldMap[y + 1]?.[x] === 0)) {
        fieldMap[y + 1][x + 1] = v + 1;
        checkGrid.push({ v: v + 1, x: x + 1, y: y + 1, dist: calcDistance(x + 1, y + 1, start.x, start.y) });
      }

      if (fieldMap[y - 1]?.[x] === 0) {
        fieldMap[y - 1][x] = v + 1;
        checkGrid.push({ v: v + 1, x: x, y: y - 1, dist: calcDistance(x, y - 1, start.x, start.y) });
      }
      if (fieldMap[y + 1]?.[x] === 0) {
        fieldMap[y + 1][x] = v + 1;
        checkGrid.push({ v: v + 1, x: x, y: y + 1, dist: calcDistance(x, y + 1, start.x, start.y) });
      }
      if (fieldMap[y]?.[x - 1] === 0) {
        fieldMap[y][x - 1] = v + 1;
        checkGrid.push({ v: v + 1, x: x - 1, y: y, dist: calcDistance(x - 1, y, start.x, start.y) });
      }
      if (fieldMap[y]?.[x + 1] === 0) {
        fieldMap[y][x + 1] = v + 1;
        checkGrid.push({ v: v + 1, x: x + 1, y: y, dist: calcDistance(x + 1, y, start.x, start.y) });
      }
    }
    checkGrid.sort((a: any, b: any) => {
      return a.dist - b.dist;
    });
    calls++;
  }
  const data = {
    x: start.x,
    y: start.y
  };
  const cords: Array<any> = [];
  siksakki: for (let i = 0; i < 375; i++) {
    const v = fieldMap[data.y][data.x] - 1;
    if (fieldMap[data.y]?.[data.x - 1] == v) data.x -= 1;
    else if (fieldMap[data.y]?.[data.x + 1] == v) data.x += 1;
    else if (fieldMap[data.y - 1]?.[data.x] == v) data.y -= 1;
    else if (fieldMap[data.y + 1]?.[data.x] == v) data.y += 1;
    else if (fieldMap[data.y - 1]?.[data.x - 1] == v) {
      data.y -= 1;
      data.x -= 1;
    }
    else if (fieldMap[data.y - 1]?.[data.x + 1] == v) {
      data.y -= 1;
      data.x += 1;
    }
    else if (fieldMap[data.y + 1]?.[data.x - 1] == v) {
      data.y += 1;
      data.x -= 1;
    }
    else if (fieldMap[data.y + 1]?.[data.x + 1] == v) {
      data.y += 1;
      data.x += 1;
    }
    if (fieldMap[data.y][data.x] == v) cords.push({ ...data });
    if (data.y == end.y && data.x == end.x) break siksakki;
  }
  fieldMap = null;
  return cords as any;
}

function arrowHitsTarget(start: tileObject, end: tileObject, isSummon: boolean = false) {
  let path: any = generateArrowPath(start, end);
  let hits = true;
  path.forEach((step: any) => {
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

function generateArrowPath(start: tileObject, end: tileObject, distanceOnly: boolean = false) {
  const distX = Math.abs(start.x - end.x) + 1;
  const distY = Math.abs(start.y - end.y) + 1;
  if (distanceOnly) return distX + distY;
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
  const finalPath: Array<any> = [{ ...arrow }];
  var rounderX = negativeX ? Math.ceil : Math.floor;
  var rounderY = negativeY ? Math.ceil : Math.floor;
  for (let i = 0; i < 100; i++) {
    arrow.x += ratioX2;
    arrow.y += ratioY2;
    var tile = { x: rounderX(arrow.x), y: rounderY(arrow.y) };
    if (tile.y > maps[currentMap].base.length || tile.y < 0) continue;
    if (tile.x > maps[currentMap].base[0].length || tile.x < 0) continue;
    if (tiles[maps[currentMap].base[tile.y][tile.x]].isWall || clutters[maps[currentMap].clutter[tile.y][tile.x]].isWall) arrow.blocked = true;
    maps[currentMap].enemies.forEach((enemy: any) => {
      if (enemy.cords.x == start.x && enemy.cords.y == start.y) return;
      if (enemy.cords.x == tile.x && enemy.cords.y == tile.y) { arrow.enemy = true; arrow.blocked = true; };
    });
    combatSummons.forEach(summon => {
      if (summon.cords.x == start.x && summon.cords.y == start.y) return;
      if (summon.cords.x == tile.x && summon.cords.y == tile.y) { arrow.summon = true; arrow.blocked = true; };
    });
    if (player.cords.x == tile.x && player.cords.y == tile.y) { arrow.player = true; arrow.blocked = true; }
    finalPath.push({ ...arrow });
    arrow.enemy = false;
    if (rounderX(arrow.x) == end.x && rounderY(arrow.y) == end.y) break;
  }
  return finalPath.map(e => {
    e.x = rounderX(e.x);
    e.y = rounderY(e.y);
    return e;
  });
}

function modifyCanvas(createNewSightMap: boolean = false) {
  const layers = Array.from(document.querySelectorAll("canvas.layer"));
  moveMinimap();
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
  if (player.isDead) return;
  if (DEVMODE) updateDeveloperInformation();
  state.inCombat = false;
  turnOver = false;
  enemiesHadTurn = 0;
  var map = maps[currentMap];
  hideMapHover();
  const pRegen = player.getRegen();
  player.stats.hp += pRegen["hp"];
  player.stats.mp += pRegen["mp"];
  combatSummons.forEach(summon => {
    if (!summon.alive || player.isDead) return;
    const sRegen = summon.getRegen();
    if (summon.stats.hp < summon.getHpMax()) summon.stats.hp += sRegen["hp"];
    if (summon.stats.mp < summon.getMpMax()) summon.stats.mp += sRegen["mp"];
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
  map.enemies.forEach((enemy: any) => {
    let distToPlayer = enemy.distToPlayer();
    if (player.isDead) return;
    if (!enemy.alive) { updateEnemiesTurn(); return; };
    if (closestEnemyDistance < 0) closestEnemyDistance = enemy.distToPlayer();
    else if (distToPlayer < closestEnemyDistance) closestEnemyDistance = enemy.distToPlayer();
    const eRegen = enemy.getRegen();
    if (enemy.stats.hp < enemy.getHpMax()) enemy.stats.hp += eRegen["hp"];
    if (enemy.stats.mp < enemy.getMpMax()) enemy.stats.mp += eRegen["mp"];
    // @ts-ignore
    if (enemy.aggro()) {
      state.inCombat = true;
      enemy.updateAbilities();
      enemy.decideAction();
    }
    else updateEnemiesTurn();
    enemy.effects();
  });
  player.effects();
  player.updateAbilities();
  updateUI();
  document.querySelector(".closestEnemyDistance").textContent = lang["closest_enemy"] + closestEnemyDistance;
  showInteractPrompt();
  setTimeout(modifyCanvas, 500);
  updateUI();
  if (map.enemies.length == 0) turnOver = true;
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
  itemData.some((itm: any) => {
    if (itm.cords.x == player.cords.x && itm.cords.y == player.cords.y) {
      foundPrompt = true;
      interactPrompt.textContent = `[${interactKey}] ` + lang["pick_item"];
    }
  });
  if (!foundPrompt) {
    maps[currentMap].treasureChests.some((chest: any) => {
      if (chest.cords.x == player.cords.x && chest.cords.y == player.cords.y && chest.loot.length > 0) {
        foundPrompt = true;
        interactPrompt.textContent = `[${interactKey}] ` + lang["pick_chest"];
      }
    });
  }
  if (!foundPrompt) {
    maps[currentMap].messages.some((msg: any) => {
      if (msg.cords.x == player.cords.x && msg.cords.y == player.cords.y) {
        foundPrompt = true;
        interactPrompt.textContent = `[${interactKey}] ` + lang["read_msg"];
      }
    });
  }
  if (!foundPrompt) {
    NPCcharacters.some((npc: Npc) => {
      let dist = calcDistance(player.cords.x, player.cords.y, npc.currentCords.x, npc.currentCords.y);
      if (dist < 3) {
        foundPrompt = true;
        interactPrompt.textContent = `[${interactKey}] ` + lang["talk_to_npc"] + ` ${lang[npc.id + "_name"]}`;
      }
    });
  }
}

/* Show enemy stats when hovering */
function hoverEnemyShow(enemy: enemy) {
  staticHover.textContent = "";
  staticHover.style.display = "block";
  const name = document.createElement("p");
  name.classList.add("enemyName");
  name.textContent = `Lvl ${enemy.level} ${lang[enemy.id + "_name"] ?? enemy.id}`;
  const enemyStats = enemy.getStats();
  const enemyMiscStats = enemy.getHitchance();
  var mainStatText: string = "";
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
  Object.entries(enTotalDmg.split).forEach((res: any) => {
    const key = res[0];
    const val = res[1];
    mainStatText += `<f>20px<f><i>${icons[key + "_icon"]}<i>${val}`;
  });
  mainStatText += "<c>white<c>)\n";
  const mainStats = textSyntax(mainStatText);
  var resists: string = `<f>20px<f><i>${icons.resistAll_icon}<i>${lang["resistance"]}\n`;
  Object.entries(enemy.getResists()).forEach((res: any) => {
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
  maps[currentMap].shrines.forEach((shrine: any) => {
    if (shrine.cords.x == player.cords.x && shrine.cords.y == player.cords.y && !state.inCombat) {
      if (!(player.usedShrines.find((used: any) => used.cords.x == shrine.cords.x && used.cords.y == shrine.cords.y && used.map == currentMap))) {
        player.stats.hp = player.getHpMax();
        player.stats.mp = player.getMpMax();
        player.respawnPoint.cords = shrine.cords;
        player.usedShrines.push({ cords: shrine.cords, map: currentMap });
        spawnFloatingText(player.cords, lang["shrine_activated"], "lime", 30, 500, 75);
        updateUI();
        modifyCanvas();
      } else {
        spawnFloatingText(player.cords, lang["shrine_used"], "cyan", 30, 500, 75);
      }
    }
  });
}

function resetAllLivingEnemiesInAllMaps() {
  maps.forEach((map: any) => {
    map.enemies.forEach((enemy: Enemy) => {
      enemy.restore();
    }
    );
  });
}

// This should be called once when entering a new map.
// It returns nothing, instead updating 2 existing variables.
let staticMap_normal: Array<number[]> = [];
let staticMap_flying: Array<number[]> = [];
let sightMap_empty: Array<number[]> = [];
function createStaticMap() {
  staticMap_normal = maps[currentMap].base.map((yv: any, y: number) => yv.map((xv: any, x: number) => {
    if (tiles[xv].isWall || tiles[xv].isLedge) return 1;
    return 0;
  }));
  maps[currentMap].clutter.forEach((yv: any, y: number) => yv.map((xv: any, x: number) => {
    if (clutters[xv].isWall) staticMap_normal[y][x] = 1;
  }));
  staticMap_flying = maps[currentMap].base.map((yv: any, y: number) => yv.map((xv: any, x: number) => {
    if (tiles[xv].isWall) return 1;
    return 0;
  }));
  maps[currentMap].clutter.forEach((yv: any, y: number) => yv.map((xv: any, x: number) => {
    if (clutters[xv].isWall) staticMap_flying[y][x] = 1;
  }));
  sightMap_empty = emptyMap(maps[currentMap].base);
}