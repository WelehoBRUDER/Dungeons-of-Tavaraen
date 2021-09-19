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
baseCanvas.addEventListener("mousemove", mapHover);
baseCanvas.addEventListener("mouseup", clickMap);
var currentMap = 0;
var turnOver = true;
var enemiesHadTurn = 0;
let dontMove = false;

const zoomLevels = [0.55, 0.66, 0.75, 1, 1.25, 1.5, 1.65, 1.8];
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
  base: Array<number[][]>,
  clutter: Array<number[][]>,
  enemies: Array<[]>;
  playerGrave: any;
  shrines: Array<any>;
  treasureChests: Array<any>;
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

  modifyCanvas();
}

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
  minimapCanvas.width = minimapCanvas.width;
  if (!settings.toggle_minimap) {
    minimapContainer.style.display = "none";
    return;
  }
  else {
    minimapContainer.style.display = "block";
  }
  const miniSpriteSize = 10;
  // for (let y = 0; y < map.base.length; y++) {
  //   for (let x = 0; x < map.base[y].length; x++) {
  //     const imgId = map.base?.[y]?.[x];
  //     const img = <HTMLImageElement>document.querySelector(`.sprites .tile${imgId !== undefined ? imgId : "VOID"}`);
  //     const clutterId = map.clutter?.[y]?.[x];
  //     if (img) {
  //       minimapCtx.drawImage(img, x * miniSpriteSize, y * miniSpriteSize, miniSpriteSize, miniSpriteSize);
  //       //baseCtx.strokeRect(x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, spriteSize, spriteSize);
  //     }
  //     // @ts-expect-error
  //     if (clutterId > 0) {
  //       const clutterImg = <HTMLImageElement>document.querySelector(`.sprites .clutter${clutterId}`);
  //       if (clutterImg) {
  //         minimapCtx.drawImage(clutterImg, x * miniSpriteSize, y * miniSpriteSize, miniSpriteSize, miniSpriteSize);
  //       }
  //     }
  //   }
  // }
  let spriteLimitX = Math.ceil(minimapCanvas.width / miniSpriteSize);
  let spriteLimitY = Math.ceil(minimapCanvas.height / miniSpriteSize);
  if (spriteLimitX % 2 == 0) spriteLimitX++;
  if (spriteLimitY % 2 == 0) spriteLimitY++;
  const mapOffsetX = (spriteLimitX * miniSpriteSize - minimapCanvas.width) / 2;
  const mapOffsetY = (spriteLimitY * miniSpriteSize - minimapCanvas.height) / 2;
  const mapOffsetStartX = player.cords.x - Math.floor(spriteLimitX / 2);
  const mapOffsetStartY = player.cords.y - Math.floor(spriteLimitY / 2);

  /* Render the base layer */
  for (let y = 0; y < spriteLimitY; y++) {
    for (let x = 0; x < spriteLimitX; x++) {
      const imgId = map.base?.[mapOffsetStartY + y]?.[mapOffsetStartX + x];
      const img = <HTMLImageElement>document.querySelector(`.sprites .tile${imgId !== undefined ? imgId : "VOID"}`);
      const pImg = <HTMLImageElement>document.querySelector(".sprites .pMinimap");
      const clutterId = map.clutter?.[mapOffsetStartY + y]?.[mapOffsetStartX + x];
      if (img) {
        minimapCtx.drawImage(img, x * miniSpriteSize - mapOffsetX, y * miniSpriteSize - mapOffsetY, miniSpriteSize, miniSpriteSize);
        //baseCtx.strokeRect(x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, spriteSize, spriteSize);
      }
      // @ts-expect-error
      if (clutterId > 0) {
        const clutterImg = <HTMLImageElement>document.querySelector(`.sprites .clutter${clutterId}`);
        if (clutterImg) {
          minimapCtx.drawImage(clutterImg, x * miniSpriteSize - mapOffsetX, y * miniSpriteSize - mapOffsetY, miniSpriteSize, miniSpriteSize);
        }
      }
      if (player.cords.x == x + mapOffsetStartX && player.cords.y == y + mapOffsetStartY) {
        minimapCtx.drawImage(pImg, x * miniSpriteSize - mapOffsetX, y * miniSpriteSize - mapOffsetY, miniSpriteSize, miniSpriteSize);
      }
    }
  }
}

function renderMap(map: mapObject) {

  baseCanvas.width = baseCanvas.width; // Clears the canvas
  if (!baseCtx) throw new Error("2D context from base canvas is missing!");
  const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();

  let sightMap = createSightMap(player.cords, player.sight());

  /* Render the base layer */
  for (let y = 0; y < spriteLimitY; y++) {
    for (let x = 0; x < spriteLimitX; x++) {
      const imgId = map.base?.[mapOffsetStartY + y]?.[mapOffsetStartX + x];
      const img = <HTMLImageElement>document.querySelector(`.sprites .tile${imgId !== undefined ? imgId : "VOID"}`);
      const grave = <HTMLImageElement>document.querySelector(`.sprites .deadModel`);
      const clutterId = map.clutter?.[mapOffsetStartY + y]?.[mapOffsetStartX + x];
      const fog = document.querySelector<HTMLImageElement>(".tileNoVision");
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
        const clutterImg = <HTMLImageElement>document.querySelector(`.sprites .clutter${clutterId}`);
        if (clutterImg) {
          baseCtx.drawImage(clutterImg, x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, spriteSize, spriteSize);
        }
      }
      if (sightMap[mapOffsetStartY + y]?.[mapOffsetStartX + x] != "x" && imgId) {
        baseCtx.drawImage(fog, x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, spriteSize, spriteSize);
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
    const lootedChest = lootedChests.find(trs=>trs.cords.x == chest.cords.x && trs.cords.y == chest.cords.y && trs.map == chest.map);
    if ((sightMap[chest.cords.y]?.[chest.cords.x] == "x")) {
      if (!lootedChest) {
        const chestSprite = document.querySelector<HTMLImageElement>(`.${chest.sprite}`);
        var tileX = (chest.cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
        var tileY = (chest.cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
        baseCtx?.drawImage(chestSprite, tileX, tileY, spriteSize, spriteSize);
      }
    }
  });

  /* Render Enemies */
  enemyLayers.textContent = ""; // Delete enemy canvases
  map.enemies.forEach((enemy: any, index) => {
    if (!enemy.alive) return;
    var tileX = (enemy.cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    var tileY = (enemy.cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
    const canvas = document.createElement("canvas");
    // @ts-ignore
    canvas.classList = `enemy${index} layer`;
    const ctx = canvas.getContext("2d");
    const enemyImg = <HTMLImageElement>document.querySelector(`.${enemy.sprite}`);
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    if (enemyImg && (sightMap[enemy.cords.y]?.[enemy.cords.x] == "x")) {
      /* Render hp bar */
      const hpbg = <HTMLImageElement>document.querySelector(".hpBg");
      const hpbar = <HTMLImageElement>document.querySelector(".hpBar");
      const hpborder = <HTMLImageElement>document.querySelector(".hpBorder");
      ctx?.drawImage(hpbg, (tileX) - spriteSize * (enemy.scale - 1), (tileY - 12) - spriteSize * (enemy.scale - 1), spriteSize * enemy.scale, spriteSize * enemy.scale);
      ctx?.drawImage(hpbar, (tileX) - spriteSize * (enemy.scale - 1), (tileY - 12) - spriteSize * (enemy.scale - 1), (Math.floor(enemy.hpRemain()) * spriteSize / 100) * enemy.scale, spriteSize * enemy.scale);
      ctx?.drawImage(hpborder, (tileX) - spriteSize * (enemy.scale - 1), (tileY - 12) - spriteSize * (enemy.scale - 1), spriteSize * enemy.scale, spriteSize * enemy.scale);
      /* Render enemy on top of hp bar */
      ctx?.drawImage(enemyImg, tileX - spriteSize * (enemy.scale - 1), tileY - spriteSize * (enemy.scale - 1), spriteSize * enemy.scale, spriteSize * enemy.scale);
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
    enemyLayers.append(canvas);
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
    summonLayers.append(canvas);
  });

  /* Render Items */
  mapDataCanvas.width = mapDataCanvas.width;
  itemData.forEach((item: any) => {
    if (item.map != currentMap) return;
    var tileX = (item.cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    var tileY = (item.cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
    const itemImg = new Image();
    if(!item.itm) return;
    itemImg.src = item.itm.img;
    itemImg.onload = function () {
      if (sightMap[item.cords.y]?.[item.cords.x] == "x") {
        mapDataCtx?.drawImage(itemImg, (tileX + spriteSize * item.mapCords.xMod), (tileY + spriteSize * item.mapCords.yMod), spriteSize / 3, spriteSize / 3);
      }
    };
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
    var strokeImg = <HTMLImageElement>document.querySelector(".sprites .hoverTile");
    renderPlayerModel(spriteSize, playerCanvas, playerCtx);
    var hoveredEnemy = false;
    maps[currentMap].enemies.forEach((enemy: any) => {
      if (enemy.cords.x == tile.x && enemy.cords.y == tile.y) {
        hoverEnemyShow(enemy);
        hoveredEnemy = true;
      }
    });
    if (!hoveredEnemy) {
      hideMapHover();
    }

    if (state.abiSelected.type == "movement" || state.abiSelected.type == "charge") {
      const path: any = generatePath({ x: player.cords.x, y: player.cords.y }, tile, false, false);
      var highlight2Img = <HTMLImageElement>document.querySelector(".sprites .tileHIGHLIGHT2");
      var highlight2RedImg = <HTMLImageElement>document.querySelector(".sprites .tileHIGHLIGHT2_RED");
      let distance: number = state.isSelected ? state.abiSelected.use_range : player.weapon.range;
      let iteration: number = 0;
      path.forEach((step: any) => {
        iteration++;
        if (step.x == player.cords.x && step.y == player.cords.y) return;
        var _tileX = (step.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
        var _tileY = (step.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
        if (iteration > distance) {
          playerCtx?.drawImage(highlight2RedImg, _tileX, _tileY, spriteSize, spriteSize);
        }
        else playerCtx?.drawImage(highlight2Img, _tileX, _tileY, spriteSize, spriteSize);
      });
    }
    /* Render highlight test */
    else if (((state.abiSelected?.shoots_projectile && state.isSelected) && event.buttons !== 1)) {
      const path: any = generateArrowPath({ x: player.cords.x, y: player.cords.y }, tile);
      var highlightImg = <HTMLImageElement>document.querySelector(".sprites .tileHIGHLIGHT");
      var highlightRedImg = <HTMLImageElement>document.querySelector(".sprites .tileHIGHLIGHT_RED");
      let distance: number = state.isSelected ? state.abiSelected.use_range : player.weapon.range;
      let iteration: number = 0;
      let lastStep: number = 0;
      path.forEach((step: any) => {
        iteration++;
        if (step.x == player.cords.x && step.y == player.cords.y) return;
        var _tileX = (step.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
        var _tileY = (step.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
        if (step.blocked || iteration > distance) {
          if (lastStep == 0) lastStep = iteration;
          playerCtx?.drawImage(highlightRedImg, _tileX, _tileY, spriteSize, spriteSize);
        }
        else playerCtx?.drawImage(highlightImg, _tileX, _tileY, spriteSize, spriteSize);
      });
      if (state.abiSelected?.aoe_size > 0) {
        let aoeMap = createAOEMap(lastStep > 0 ? path[lastStep - 1] : path[path.length - 1], state.abiSelected.aoe_size);
        for (let y = 0; y < spriteLimitY; y++) {
          for (let x = 0; x < spriteLimitX; x++) {
            if (aoeMap[mapOffsetStartY + y]?.[mapOffsetStartX + x] == "x") {
              playerCtx.drawImage(highlightRedImg, x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, spriteSize, spriteSize);
            }
          }
        }
      }
    }
    if (event.buttons == 1 && !state.isSelected) {
      const path: any = generatePath({ x: player.cords.x, y: player.cords.y }, tile, player.canFly);
      var highlightImg = <HTMLImageElement>document.querySelector(".sprites .tileHIGHLIGHT");
      var highlightRedImg = <HTMLImageElement>document.querySelector(".sprites .tileHIGHLIGHT_RED");
      path.forEach((step: any) => {
        if (step.x == player.cords.x && step.y == player.cords.y) return;
        var _tileX = (step.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
        var _tileY = (step.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
        if (step.blocked) {
          playerCtx?.drawImage(highlightRedImg, _tileX, _tileY, spriteSize, spriteSize);
        }
        else playerCtx?.drawImage(highlightImg, _tileX, _tileY, spriteSize, spriteSize);
      });
    }


    playerCtx?.drawImage(strokeImg, tileX, tileY, spriteSize, spriteSize);
  }
  catch { }
}

function mapHover(event: MouseEvent) {
  const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
  const lX = Math.floor(((event.offsetX - baseCanvas.width / 2) + spriteSize / 2) / spriteSize);
  const lY = Math.floor(((event.offsetY - baseCanvas.height / 2) + spriteSize / 2) / spriteSize);
  const x = lX + player.cords.x;
  const y = lY + player.cords.y;
  if (x < 0 || x > maps[currentMap].base[0].length - 1 || y < 0 || y > maps[currentMap].base.length - 1) return;
  renderTileHover({ x: x, y: y }, event);
}

function clickMap(event: MouseEvent) {
  if (state.clicked || player.isDead) return;
  if (state.invOpen || (event.button != 0 && event.button != 2)) {
    closeInventory();
    return;
  }
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
        if (state.abiSelected.type == "charge" && generatePath(player.cords, enemy.cords, false, true) <= state.abiSelected.use_range && !player.isRooted()) {
          player.stats.mp -= state.abiSelected.mana_cost;
          state.abiSelected.onCooldown = state.abiSelected.cooldown;
          movePlayer(enemy.cords, true, 99, () => regularAttack(player, enemy, state.abiSelected));
        }
      }
      else if (weaponReach(player, player.weapon.range, enemy)) {
        // @ts-expect-error
        attackTarget(player, enemy, weaponReach(player, player.weapon.range, enemy));
        if (weaponReach(player, player.weapon.range, enemy)) {
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
    if (state.abiSelected.status) {
      const _Effect = new statEffect({ ...statusEffects[state.abiSelected.status] }, state.abiSelected.statusModifiers);
      let missing = true;
      player.statusEffects.forEach((effect: statEffect) => {
        if (effect.id == state.abiSelected.status) {
          effect.last.current += _Effect.last.total;
          missing = false;
          return;
        }
      });
      if (missing) {
        player.statusEffects.push({ ..._Effect });
      }
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
    updateUI();
    state.abiSelected = {};
  }
}

const emptyMap = (base_tiles: Array<number[]>) => new Array(base_tiles.length).fill("0").map(e => new Array(base_tiles[0].length).fill("0"));

function createSightMap(start: tileObject, size: number) {
  let sightMap = emptyMap(maps[currentMap].base);
  let testiIsonnus = size ** 2;
  return sightMap.map((rivi, y) => rivi.map((_, x) => {
    if (Math.abs(x - start.x) ** 2 + Math.abs(y - start.y) ** 2 < testiIsonnus) return "x";
    return "0";
  }));
}

function createAOEMap(start: tileObject, size: number) {
  let aoeMap = emptyMap(maps[currentMap].base);
  let testiIsonnus = size ** 2;
  return aoeMap.map((rivi, y) => rivi.map((_, x) => {
    if (!tiles[maps[currentMap].base[y][x]].isLedge && !tiles[maps[currentMap].base[y][x]].isWall && !clutters[maps[currentMap].clutter[y][x]].isWall) {
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
  let dirs = { [settings.hotkey_move_up]: "up", [settings.hotkey_move_down]: "down", [settings.hotkey_move_left]: "left", [settings.hotkey_move_right]: "right" } as any;
  if (player.isRooted() && !player.isDead && dirs[keyPress.key]) {
    
    advanceTurn();
    updateUI();
    state.abiSelected = {};
  }
  if (!turnOver || player.isDead || state.menuOpen || state.invOpen || state.savesOpen || state.optionsOpen || state.charOpen || state.perkOpen || state.titleScreen) return;
  let shittyFix = JSON.parse(JSON.stringify(player));
  if (parseInt(player.carryingWeight()) > parseInt(player.maxCarryWeight()) && dirs[keyPress.key]) {
    displayText(`<c>white<c>[WORLD] <c>orange<c>${lang["too_much_weight"]}`);
    return;
  }
  if (keyPress.key == settings.hotkey_move_up && canMove(player, "up") && !player.isRooted()) { player.cords.y--; }
  else if (keyPress.key == settings.hotkey_move_down && canMove(player, "down") && !player.isRooted()) { player.cords.y++; }
  else if (keyPress.key == settings.hotkey_move_left && canMove(player, "left") && !player.isRooted()) { player.cords.x--; }
  else if (keyPress.key == settings.hotkey_move_right && canMove(player, "right") && !player.isRooted()) { player.cords.x++; }
  if (dirs[keyPress.key]) {

    if (canMove(shittyFix, dirs[keyPress.key]) && !player.isRooted()) {
      // @ts-ignore
      renderMap(maps[currentMap]);
      
      advanceTurn();
      updateUI();
    }
    else if(canMove(shittyFix, dirs[keyPress.key]) && player.isRooted()) {
      
      advanceTurn();
      updateUI();
      state.abiSelected = {};
    }
    else {
      let target = maps[currentMap].enemies.find(e => e.cords.x == cordsFromDir(player.cords, dirs[keyPress.key]).x && e.cords.y == cordsFromDir(player.cords, dirs[keyPress.key]).y);
      if (target) {
        // @ts-expect-error
        attackTarget(player, target, weaponReach(player, player.weapon.range, target));
        if (weaponReach(player, player.weapon.range, target)) {
          regularAttack(player, target, player.abilities?.find(e => e.id == "attack"));
          
          advanceTurn();
        }
      }
    }
  }
  else if (keyPress.key == settings.hotkey_interact) {
    activateShrine();
    pickLoot();
    maps[currentMap].treasureChests.forEach((chest: treasureChest) => {
      const lootedChest = lootedChests.find(trs=>trs.cords.x == chest.cords.x && trs.cords.y == chest.cords.y && trs.map == chest.map);
      if (chest.cords.x == player.cords.x && chest.cords.y == player.cords.y && !lootedChest) chest.lootChest();
    });
  }
});

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
      modifyCanvas();
      if (!ability) {
        
        advanceTurn();
        updateUI();
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
  else if (!action) {  advanceTurn(); updateUI(); state.abiSelected = {}; }
  else if (action) {
    
    action();
    advanceTurn();
    updateUI();
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
  if (player.cords.x == tile.x && player.cords.y == tile.y) movable = false;
  return movable;
}

function renderPlayerOutOfMap(size: number, canvas: HTMLCanvasElement, ctx: any, side: string = "center", playerModel: any = player) {
  canvas.width = canvas.width; // Clear canvas
  const bodyModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.race + "Model");
  const earModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.race + "Ears");
  const hairModel = <HTMLImageElement>document.querySelector(".sprites .hair" + playerModel.hair);
  const eyeModel = <HTMLImageElement>document.querySelector(".sprites .eyes" + playerModel.eyes);
  const faceModel = <HTMLImageElement>document.querySelector(".sprites .face" + playerModel.face);
  const leggings = <HTMLImageElement>document.querySelector(".sprites .defaultPants");
  var x = 0;
  var y = 0;
  if (side == "left") x = 0 - size / 4;
  ctx?.drawImage(bodyModel, x, y, size, size);
  ctx?.drawImage(earModel, x, y, size, size);
  ctx?.drawImage(eyeModel, x, y, size, size);
  ctx?.drawImage(faceModel, x, y, size, size);
  ctx?.drawImage(leggings, x, y, size, size);
  if (!playerModel.helmet?.coversHair) ctx?.drawImage(hairModel, x, y, size, size);
  if (playerModel.helmet?.sprite) {
    const helmetModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.helmet.sprite);
    ctx?.drawImage(helmetModel, x, y, size, size);
  }
  if (playerModel.gloves?.sprite) {
    const glovesModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.gloves.sprite);
    ctx?.drawImage(glovesModel, x, y, size, size);
  }
  if (playerModel.boots?.sprite) {
    const bootsModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.boots.sprite);
    ctx?.drawImage(bootsModel, x, y, size, size);
  }
  if (playerModel.legs?.sprite) {
    const leggingsModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.legs.sprite);
    ctx?.drawImage(leggingsModel, x, y, size, size);
  }
  else if (!playerModel.legs?.sprite) {
    const leggings = <HTMLImageElement>document.querySelector(".sprites .defaultPants");
    ctx?.drawImage(leggings, x, y, size, size);
  }
  if (playerModel.chest?.sprite) {
    const chestModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.chest.sprite);
    ctx?.drawImage(chestModel, x, y, size, size);
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

function renderPlayerModel(size: number, canvas: HTMLCanvasElement, ctx: any) {
  canvas.width = canvas.width; // Clear canvas
  if (player.isDead) return;
  const bodyModel = <HTMLImageElement>document.querySelector(".sprites ." + player.race + "Model");
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
    const helmetModel = <HTMLImageElement>document.querySelector(".sprites ." + player.helmet.sprite);
    ctx?.drawImage(helmetModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
  if (player.gloves?.sprite) {
    const glovesModel = <HTMLImageElement>document.querySelector(".sprites ." + player.gloves.sprite);
    ctx?.drawImage(glovesModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
  if (player.boots?.sprite) {
    const bootsModel = <HTMLImageElement>document.querySelector(".sprites ." + player.boots.sprite);
    ctx?.drawImage(bootsModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
  if (player.legs?.sprite) {
    const leggingsModel = <HTMLImageElement>document.querySelector(".sprites ." + player.legs.sprite);
    ctx?.drawImage(leggingsModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
  else if (!player.legs?.sprite) {
    const leggings = <HTMLImageElement>document.querySelector(".sprites .defaultPants");
    ctx?.drawImage(leggings, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
  if (player.chest?.sprite) {
    const chestModel = <HTMLImageElement>document.querySelector(".sprites ." + player.chest.sprite);
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

function generatePath(start: tileObject, end: tileObject, canFly: boolean, distanceOnly: boolean = false, retreatPath: number = 0) {
  var distance = Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
  if (distanceOnly) {
    let newDistance = distance;
    if ((Math.abs(start.x - end.x) == Math.abs(start.y - end.y)) && distance < 3) newDistance = Math.round(newDistance / 2);
    return newDistance;
  }
  if (end.x < 0 || end.x > maps[currentMap].base[0].length - 1 || end.y < 0 || end.y > maps[currentMap].base.length - 1) return;
  var fieldMap: Array<number[]> = maps[currentMap].base.map((yv, y) => yv.map((xv, x) => {
    if (tiles[xv].isWall || (tiles[xv].isLedge && !canFly)) return 1;
    return 0;
  }));
  maps[currentMap].clutter.forEach((yv, y) => yv.map((xv, x) => {
    if (clutters[xv].isWall) fieldMap[y][x] = 1;
  }));
  if (start.x !== player.cords.x && start.y !== player.cords.y) {
    fieldMap[player.cords.y][player.cords.x] = 1;
    combatSummons.forEach(summon => {
      if (summon.cords.x !== start.x && summon.cords.y !== start.y) fieldMap[summon.cords.y][summon.cords.x] = 1;
    });
  }
  maps[currentMap].enemies.forEach(enemy => { if (!(start.x == enemy.cords.x && start.y == enemy.cords.y)) { { fieldMap[enemy.cords.y][enemy.cords.x] = 1; }; } });
  fieldMap[end.y][end.x] = 5;
  main: for (let i = 5; i < 100; i++) {
    for (let y = 0; y < maps[currentMap].base.length; y++) {
      for (let x = 0; x < maps[currentMap].base[y].length; x++) {
        if (fieldMap[y][x] !== 0) continue;
        if (fieldMap[y]?.[x + 1] == i) fieldMap[y][x] = i + 1;
        else if (fieldMap[y]?.[x - 1] == i) fieldMap[y][x] = i + 1;
        else if (fieldMap[y + 1]?.[x] == i) fieldMap[y][x] = i + 1;
        else if (fieldMap[y - 1]?.[x] == i) fieldMap[y][x] = i + 1;
        if (fieldMap[start.y][start.x] > 3) break main;
      }
    }
  }
  const maxValueCords = { x: null as any, y: null as any, v: 0 as any };
  const maxNum = fieldMap[start.y][start.x];
  if (retreatPath > 0) fieldMap[start.y][start.x] = 0;
  if (retreatPath > 0) {
    const arr = [...new Array(retreatPath)].map(_ => []);

    arr[0].push({ x: start.x, y: start.y });
    for (let i = 0; i < arr.length; i++) {
      for (let i2 = maxNum - 1; i2 < maxNum + retreatPath; i2++) {
        for (const value of arr[i]) {
          if (fieldMap[value.y][value.x] !== 0) continue;

          const left = fieldMap[value.y]?.[value.x - 1] ?? null;
          const right = fieldMap[value.y]?.[value.x + 1] ?? null;
          const top = fieldMap[value.y - 1]?.[value.x] ?? null;
          const bottom = fieldMap[value.y + 1]?.[value.x] ?? null;

          // if(i != 0) map[value.y][value.x] = min + 1;
          if ([left, right, top, bottom].find(e => e == i2)) {
            fieldMap[value.y][value.x] = i2 + 1;

            if (left == 0) arr[i + 1]?.push({ y: value.y, x: value.x - 1 });
            if (right == 0) arr[i + 1]?.push({ y: value.y, x: value.x + 1 });
            if (top == 0) arr[i + 1]?.push({ y: value.y - 1, x: value.x });
            if (bottom == 0) arr[i + 1]?.push({ y: value.y + 1, x: value.x });
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
  if (retreatPath > 0) Object.assign(data, { ...maxValueCords });
  const cords = [];
  siksakki: for (let i = 0; i < 500; i++) {
    const v = fieldMap[data.y][data.x] - 1;

    if (i % 2 == 0) {
      if (fieldMap[data.y]?.[data.x - 1] == v) data.x -= 1;
      if (fieldMap[data.y]?.[data.x + 1] == v) data.x += 1;
    } else {
      if (fieldMap[data.y - 1]?.[data.x] == v) data.y -= 1;
      if (fieldMap[data.y + 1]?.[data.x] == v) data.y += 1;
    }

    if (fieldMap[data.y][data.x] == v) cords.push({ ...data });
    if (data.y == end.y && data.x == end.x) break siksakki;
  }
  fieldMap = null;
  return cords;
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
    if (tiles[maps[currentMap].base[tile.y][tile.x]].isWall || clutters[maps[currentMap].clutter[tile.y][tile.x]].isWall) arrow.blocked = true;
    maps[currentMap].enemies.forEach(enemy => {
      if (enemy.cords.x == start.x && enemy.cords.y == start.y) return;
      if (enemy.cords.x == tile.x && enemy.cords.y == tile.y) { arrow.enemy = true; arrow.blocked = true; };
    });
    combatSummons.forEach(summon => {
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
  // @ts-ignore
  renderMinimap(maps[currentMap]);
}

var highestWaitTime = 0;

/* Move to state file later */
async function advanceTurn() {
  if (player.isDead) return;
  player.effects();
  player.updateAbilities();
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
    if(summon.stats.hp < summon.getHpMax()) summon.stats.hp += sRegen["hp"];
    if(summon.stats.mp < summon.getMpMax()) summon.stats.mp += sRegen["mp"];
    summon.lastsFor--;
    if (summon.lastsFor <= 0) {
      summon.kill();
      return;
    }
    summon.updateAbilities();
    summon.decideAction();
    summon.effects();
  });
  let closestEnemyDistance = -1;
  map.enemies.forEach(enemy => {
    if (player.isDead) return;
    if (!enemy.alive) { updateEnemiesTurn(); return; };
    if(closestEnemyDistance < 0) closestEnemyDistance = enemy.distToPlayer();
    else if(enemy.distToPlayer() < closestEnemyDistance) closestEnemyDistance = enemy.distToPlayer();
    const eRegen = enemy.getRegen();
    if(enemy.stats.hp < enemy.getHpMax()) enemy.stats.hp += eRegen["hp"];
    if(enemy.stats.mp < enemy.getMpMax()) enemy.stats.mp += eRegen["mp"];
    // @ts-ignore
    if (enemy.aggro()) {
      state.inCombat = true;
      enemy.updateAbilities();
      enemy.decideAction();
    }
    else updateEnemiesTurn();
    enemy.effects();
  });
  document.querySelector(".closestEnemyDistance").textContent = lang["closest_enemy"] + closestEnemyDistance;
  setTimeout(modifyCanvas, 500);
  if (map.enemies.length == 0) turnOver = true;
  if (player.stats.hp > player.getHpMax()) {
    player.stats.hp = player.getHpMax();
  }
  if (player.stats.mp > player.getMpMax()) {
    player.stats.mp = player.getMpMax();
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
  // @ts-expect-error
  const mainStats = textSyntax(mainStatText);
  var resists: string = `<f>20px<f><i>${icons.resistAll_icon}<i>${lang["resistance"]}\n`;
  Object.entries(enemy.getResists()).forEach((res: any) => {
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