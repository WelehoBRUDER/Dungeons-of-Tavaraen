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
const minimapUpdateCanvas = <HTMLCanvasElement>minimapContainer.querySelector(".minimapUpdateLayer");
const minimapUpdateCtx = minimapUpdateCanvas.getContext("2d");
const areaMapContainer = <HTMLDivElement>document.querySelector(".areaMap");
const areaMapCanvas = <HTMLCanvasElement>areaMapContainer.querySelector(".areaCanvas");
const areaMapUpdateCanvas = <HTMLCanvasElement>areaMapContainer.querySelector(".areaUpdateCanvas");
const areaMapUpdateCtx = areaMapUpdateCanvas.getContext("2d");
const areaMapCtx = areaMapCanvas.getContext("2d");
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

const mapSelection = {
  x: null,
  y: null,
  disableHover: false
} as any;

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
      const shrine = document.querySelector<HTMLImageElement>(".sprites .shrineTile");
      const shrineLit = document.querySelector<HTMLImageElement>(".sprites .shrineLitTile");
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
        const chestSprite = document.querySelector<HTMLImageElement>(`.sprites .${chest.sprite}`);
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
        const charSprite = document.querySelector<HTMLImageElement>(`.sprites .${npc.sprite}`);
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

function renderTileHover(tile: tileObject, event: any = { buttons: -1 }) {
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
  const strokeSprite = staticTiles[0].spriteMap;
  try {

    /* Render tile */
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
  }
  catch (err) { if (DEVMODE) displayText(`<c>red<c>${err} at line map:574`); }
  playerCtx.drawImage(spriteMap_tiles, strokeSprite.x, strokeSprite.y, 128, 128, tileX, tileY, Math.round(spriteSize + 1), Math.round(spriteSize + 1));
}

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
      await sleep(15);
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
        else player.speed.movementFill += (player.getSpeed().movement - 100);
      }
      isMovingCurrently = true;
      player.cords.x = step.x;
      player.cords.y = step.y;
      modifyCanvas(true);
      if (!ability && !extraMove) {
        advanceTurn();
      }
      count++;
      if (state.inCombat && !ability || count > maxRange && ability || breakMoving) break moving;
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
      else displayText(`<c>green<c>[MOVEMENT]<c>white<c> Ran for ${count} turn(s).`);
    }
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
      await sleep(20);
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

function modifyCanvas(createNewSightMap: boolean = false) {
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

let highestWaitTime = 0;