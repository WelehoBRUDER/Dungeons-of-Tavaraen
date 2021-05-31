const baseCanvas = <HTMLCanvasElement>document.querySelector(".canvasLayers .baseSheet");
const baseCtx = baseCanvas.getContext("2d");
const mapDataCanvas = <HTMLCanvasElement>document.querySelector(".canvasLayers .mapData");
const mapDataCtx = mapDataCanvas.getContext("2d");
const playerCanvas = <HTMLCanvasElement>document.querySelector(".canvasLayers .playerSheet");
const playerCtx = playerCanvas.getContext("2d");
const enemyLayers = <HTMLDivElement>document.querySelector(".canvasLayers .enemyLayers");
const projectileLayers = <HTMLDivElement>document.querySelector(".canvasLayers .projectileLayers");
const staticHover = <HTMLDivElement>document.querySelector(".mapHover");
baseCanvas.addEventListener("mousemove", mapHover);
baseCanvas.addEventListener("click", clickMap);
var currentMap = 0;

const zoomLevels = [0.75, 1, 1.25, 1.5];
var currentZoom = 1;

function sleep(ms: number) {
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

interface mapObject {
  id: string,
  base: Array<number[][]>,
  clutter: Array<number[][]>,
  enemies: Array<[]>;
}
interface tileObject {
  x: number;
  y: number;
}

window.addEventListener("resize", modifyCanvas);
document.querySelector(".main")?.addEventListener('contextmenu', event => event.preventDefault());

function spriteVariables() {
  const spriteSize = 128 * zoomLevels[currentZoom];
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

function renderMap(map: mapObject) {

  baseCanvas.width = baseCanvas.width; // Clears the canvas
  if (!baseCtx) throw new Error("2D context from base canvas is missing!");
  const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();

  /* Render the base layer */
  for (let y = 0; y < spriteLimitY; y++) {
    for (let x = 0; x < spriteLimitX; x++) {
      const imgId = map.base?.[mapOffsetStartY + y]?.[mapOffsetStartX + x];
      const img = <HTMLImageElement>document.querySelector(`.sprites .tile${imgId !== undefined ? imgId : "VOID"}`);
      const clutterId = map.clutter?.[mapOffsetStartY + y]?.[mapOffsetStartX + x];
      if (img) {
        baseCtx.drawImage(img, x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, spriteSize, spriteSize);
        //baseCtx.strokeRect(x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, spriteSize, spriteSize);
      }
      // @ts-expect-error
      if (clutterId > 0) {
        const clutterImg = <HTMLImageElement>document.querySelector(`.sprites .clutter${clutterId}`);
        if (clutterImg) {
          baseCtx.drawImage(clutterImg, x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, spriteSize, spriteSize);
        }
      }
    }
  }

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
    if (enemyImg) {
      /* Render hp bar */
      const hpbg = <HTMLImageElement>document.querySelector(".hpBg");
      const hpbar = <HTMLImageElement>document.querySelector(".hpBar");
      const hpborder = <HTMLImageElement>document.querySelector(".hpBorder");
      ctx?.drawImage(hpbg, tileX, tileY, spriteSize, spriteSize);
      ctx?.drawImage(hpbar, tileX, tileY, enemy.statRemaining("hp") * spriteSize / 100, spriteSize);
      ctx?.drawImage(hpborder, tileX, tileY, spriteSize, spriteSize);
      /* Render enemy on top of hp bar */
      ctx?.drawImage(enemyImg, tileX, tileY, spriteSize, spriteSize);
    }
    enemyLayers.append(canvas);
  });

  /* Render Items */
  mapDataCanvas.width = mapDataCanvas.width;
  itemData.forEach((item: any) => {
    var tileX = (item.cords.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
    var tileY = (item.cords.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
    const itemImg = new Image();
    itemImg.src = item.itm.img;
    itemImg.onload = function(){
      mapDataCtx?.drawImage(itemImg, (tileX + spriteSize*item.mapCords.xMod), (tileY + spriteSize*item.mapCords.yMod), spriteSize/3, spriteSize/3);
    };
  })

  /* Render Player */
  renderPlayerModel(spriteSize, playerCanvas, playerCtx);
}

function renderTileHover(tile: tileObject) {
  if (!baseCtx) throw new Error("2D context from base canvas is missing!");
  const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
  var tileX = (tile.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
  var tileY = (tile.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;

  playerCanvas.width = playerCanvas.width;

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

    /* Render highlight test */
    if ((abiSelected?.shoots_projectile && isSelected) || (player.weapon?.firesProjectile && !isSelected)) {
      const path: any = generateArrowPath({ x: player.cords.x, y: player.cords.y }, tile);
      var highlightImg = <HTMLImageElement>document.querySelector(".sprites .tileHIGHLIGHT");
      var highlightRedImg = <HTMLImageElement>document.querySelector(".sprites .tileHIGHLIGHT_RED");
      let distance: number = isSelected ? abiSelected.use_range : player.weapon.range;
      let iteration: number = 0;
      path.forEach((step: any) => {
        iteration++;
        if (step.x == player.cords.x && step.y == player.cords.y) return;
        var _tileX = (step.x - player.cords.x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
        var _tileY = (step.y - player.cords.y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
        if (iteration > distance) return;
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
  renderTileHover({ x: x, y: y });
}

function clickMap(event: MouseEvent) {
  if (state.clicked) return;
  if (invOpen) {
    closeInventory();
    return;
  }
  const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
  const lX = Math.floor(((event.offsetX - baseCanvas.width / 2) + spriteSize / 2) / spriteSize);
  const lY = Math.floor(((event.offsetY - baseCanvas.height / 2) + spriteSize / 2) / spriteSize);
  const x = lX + player.cords.x;
  const y = lY + player.cords.y;
  if (x == player.cords.x && y == player.cords.y) console.log("You clicked on yourself!");
  let move = true;
  for (let enemy of maps[currentMap].enemies) {
    if (enemy.cords.x == x && enemy.cords.y == y) {
      if (!enemy.alive) break;
      if (isSelected) {
        console.log(abiSelected.ranged);
        // @ts-expect-error
        if (generateArrowPath(player.cords, enemy.cords).length <= abiSelected.use_range || weaponReach(player, abiSelected.use_range, enemy)) {
          if ((abiSelected.requires_melee_weapon && player.weapon.firesProjectile) || (abiSelected.requires_ranged_weapon && !player.weapon.firesProjectile)) break;
          if (abiSelected.type == "attack") {
            if (abiSelected.shoots_projectile) fireProjectile(player.cords, enemy.cords, abiSelected.shoots_projectile, abiSelected, true);
            // @ts-expect-error
            else regularAttack(player, enemy, abiSelected);
            // @ts-expect-error
            if (weaponReach(player, abiSelected.use_range, enemy)) attackTarget(player, enemy, weaponReach(player, abiSelected.use_range, enemy));
            player.effects();
            if (!abiSelected.shoots_projectile) advanceTurn();
          }
        }
      }
      // @ts-expect-error
      else if (weaponReach(player, player.weapon.range, enemy)) {
        // @ts-expect-error
        attackTarget(player, enemy, weaponReach(player, player.weapon.range, enemy));
        // @ts-expect-error
        if (weaponReach(player, player.weapon.range, enemy)) {
          // @ts-expect-error
          regularAttack(player, enemy, player.abilities?.find(e => e.id == "attack"));
          player.effects();
          advanceTurn();
        }
        // @ts-ignore
      } else if (player.weapon.range >= generateArrowPath(player.cords, enemy.cords).length && player.weapon.firesProjectile) {
        // @ts-ignore
        fireProjectile(player.cords, enemy.cords, player.weapon.firesProjectile, player.abilities?.find(e => e.id == "attack"), true);
        player.effects();
      }
      move = false;
      break;
    }
  };
  state.clicked = true;
  setTimeout(() => { state.clicked = false; }, 30);
  if (move) movePlayer({ x: x, y: y });
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

document.addEventListener("keyup", (kbe: KeyboardEvent) => {
  // Believe it or not, this is the space key!
  if(kbe.key == " ") {
    pickLoot();
  }
})

async function movePlayer(goal: tileObject) {
  if (goal.x < 0 || goal.x > maps[currentMap].base[0].length - 1 || goal.y < 0 || goal.y > maps[currentMap].base.length - 1) return;
  const path: any = generatePath(player.cords, goal, false);
  let count: number = 0;
  isSelected = false;
  moving: for (let step of path) {
    if (canMoveTo(player, step)) {
      await sleep(45);
      // @ts-ignore
      player.effects();
      player.cords.x = step.x;
      player.cords.y = step.y;
      modifyCanvas();
      advanceTurn();
      updateUI();
      count++;
      if (state.inCombat) break moving;
    }
  }
  if (count > 0) displayText(`<c>green<c>[MOVEMENT]<c>white<c> Ran for ${count} turn(s).`);
  if (state.inCombat && count == 1) {
    console.log(Math.floor(player.hpRegen() * 0.5) > 0);
    if (Math.floor(player.hpRegen() * 0.5) > 0) displayText(`<c>white<c>[PASSIVE] <c>lime<c>Recovered ${Math.floor(player.hpRegen() * 0.5)} HP.`);
  }
  else if (state.inCombat && count > 1) {
    let regen = Math.floor(player.hpRegen() * count - 1) + Math.floor(player.hpRegen() * 0.5);
    displayText(`<c>white<c>[PASSIVE] <c>lime<c>Recovered ${regen} HP.`);
    displayText(`<c>green<c>[MOVEMENT] <c>orange<c>Stopped moving due to encontering an enemy.`);
  } else if (count > 0) {
    displayText(`<c>white<c>[PASSIVE] <c>lime<c>Recovered ${Math.floor(player.hpRegen() * count)} HP.`);
  }
}

function canMove(char: any, dir: string) {
  var tile = { x: char.cords.x, y: char.cords.y };
  if (dir == "up") tile.y--;
  else if (dir == "down") tile.y++;
  else if (dir == "left") tile.x--;
  else if (dir == "right") tile.x++;
  var movable = true;
  if (tiles[maps[currentMap].base[tile.y][tile.x]].isWall || (tiles[maps[currentMap].base[tile.y][tile.x]].isLedge && !char.canFly)) movable = false;
  for (let enemy of maps[currentMap].enemies) {
    if (enemy.cords.x == tile.x && enemy.cords.y == tile.y) movable = false;
  }
  return movable;
}

function canMoveTo(char: any, tile: tileObject) {
  var movable = true;
  if (tiles[maps[currentMap].base[tile.y][tile.x]].isWall || (tiles[maps[currentMap].base[tile.y][tile.x]].isLedge && !char.canFly)) movable = false;
  if (clutters[maps[currentMap].clutter[tile.y][tile.x]].isWall) movable = false;
  for (let enemy of maps[currentMap].enemies) {
    if (enemy.cords.x == tile.x && enemy.cords.y == tile.y) movable = false;
  }
  return movable;
}

function renderPlayerOutOfMap(size: number, canvas: HTMLCanvasElement, ctx: any) {
  canvas.width = canvas.width; // Clear canvas
  const bodyModel = <HTMLImageElement>document.querySelector(".sprites ." + player.race + "Model");
  const earModel = <HTMLImageElement>document.querySelector(".sprites ." + player.race + "Ears");
  const hairModel = <HTMLImageElement>document.querySelector(".sprites .hair" + player.hair);
  const eyeModel = <HTMLImageElement>document.querySelector(".sprites .eyes" + player.eyes);
  const faceModel = <HTMLImageElement>document.querySelector(".sprites .face" + player.face);
  const leggings = <HTMLImageElement>document.querySelector(".sprites .defaultPants");
  ctx?.drawImage(bodyModel, 0, 0, size, size);
  ctx?.drawImage(earModel, 0, 0, size, size);
  ctx?.drawImage(eyeModel, 0, 0, size, size);
  ctx?.drawImage(faceModel, 0, 0, size, size);
  ctx?.drawImage(leggings, 0, 0, size, size);
  if (player.chest?.sprite) {
    const chestModel = <HTMLImageElement>document.querySelector(".sprites ." + player.chest.sprite);
    ctx?.drawImage(chestModel, 0, 0, size, size);
  }
  if (player.helmet?.sprite) {
    const helmetModel = <HTMLImageElement>document.querySelector(".sprites ." + player.helmet.sprite);
    ctx?.drawImage(helmetModel, 0, 0, size, size);
  }
  if (player.gloves?.sprite) {
    const glovesModel = <HTMLImageElement>document.querySelector(".sprites ." + player.gloves.sprite);
    ctx?.drawImage(glovesModel, 0, 0, size, size);
  }
  if (player.boots?.sprite) {
    const bootsModel = <HTMLImageElement>document.querySelector(".sprites ." + player.boots.sprite);
    ctx?.drawImage(bootsModel, 0, 0, size, size);
  }
  if (player.weapon?.sprite) {
    const weaponModel = <HTMLImageElement>document.querySelector(".sprites ." + player.weapon.sprite);
    ctx?.drawImage(weaponModel, 0, 0, size, size);
  }
  ctx?.drawImage(hairModel, 0, 0, size, size);
}

function renderPlayerModel(size: number, canvas: HTMLCanvasElement, ctx: any) {
  canvas.width = canvas.width; // Clear canvas
  const bodyModel = <HTMLImageElement>document.querySelector(".sprites ." + player.race + "Model");
  const earModel = <HTMLImageElement>document.querySelector(".sprites ." + player.race + "Ears");
  const hairModel = <HTMLImageElement>document.querySelector(".sprites .hair" + player.hair);
  const eyeModel = <HTMLImageElement>document.querySelector(".sprites .eyes" + player.eyes);
  const faceModel = <HTMLImageElement>document.querySelector(".sprites .face" + player.face);
  const leggings = <HTMLImageElement>document.querySelector(".sprites .defaultPants");
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
  ctx?.drawImage(leggings, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  if (player.chest?.sprite) {
    const chestModel = <HTMLImageElement>document.querySelector(".sprites ." + player.chest.sprite);
    ctx?.drawImage(chestModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
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
  if (player.weapon?.sprite) {
    const weaponModel = <HTMLImageElement>document.querySelector(".sprites ." + player.weapon.sprite);
    ctx?.drawImage(weaponModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
  ctx?.drawImage(hairModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
}

function generatePath(start: tileObject, end: tileObject, canFly: boolean, distanceOnly: boolean = false) {
  if (end.x < 0 || end.x > maps[currentMap].base[0].length - 1 || end.y < 0 || end.y > maps[currentMap].base.length - 1) return;
  var distance = Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
  var fieldMap: Array<number[]> = maps[currentMap].base.map((yv, y) => yv.map((xv, x) => {
    if (tiles[xv].isWall || (tiles[xv].isLedge && !canFly)) return 1;
    return 0;
  }));
  maps[currentMap].clutter.forEach((yv, y) => yv.map((xv, x) => {
    if (clutters[xv].isWall) fieldMap[y][x] = 1;
  }));
  if (start.x !== player.cords.x && start.y !== player.cords.y) fieldMap[player.cords.y][player.cords.x] = 1;
  maps[currentMap].enemies.forEach(enemy => { if (!(start.x == enemy.cords.x && start.y == enemy.cords.y)) { { fieldMap[enemy.cords.y][enemy.cords.x] = 1; }; } });
  fieldMap[end.y][end.x] = 5;
  if (distanceOnly) {
    let newDistance = distance;
    if (Math.abs(start.x - end.x) == Math.abs(start.y - end.y)) newDistance = Math.round(newDistance / 2);
    return newDistance;
  }
  main: for (let i = 5; i < 500; i++) {
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
  const data = {
    x: start.x,
    y: start.y
  };
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
  return cords;
}

function generateArrowPath(start: tileObject, end: tileObject, distanceOnly: boolean = false) {
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
  if (distanceOnly) return distX + distY;
  const finalPath: Array<any> = [{ ...arrow }];
  var rounderX = negativeX ? Math.ceil : Math.floor;
  var rounderY = negativeY ? Math.ceil : Math.floor;
  for (let i = 0; i < 500; i++) {
    arrow.x += ratioX2;
    arrow.y += ratioY2;
    var tile = { x: rounderX(arrow.x), y: rounderY(arrow.y) };
    if (tiles[maps[currentMap].base[tile.y][tile.x]].isWall || clutters[maps[currentMap].clutter[tile.y][tile.x]].isWall) arrow.blocked = true;
    maps[currentMap].enemies.forEach(enemy => {
      if (enemy.cords.x == tile.x && enemy.cords.y == tile.y) { arrow.enemy = true; arrow.blocked = true; };
    });
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
}

/* Move to state file later */
function advanceTurn() {
  player.updateAbilities();
  state.inCombat = false;
  var map = maps[currentMap];
  hideMapHover();
  map.enemies.forEach(enemy => {
    if (!enemy.alive) return;
    // @ts-ignore
    enemy.effects();
    if (enemy.aggro()) {
      state.inCombat = true;
      enemy.updateAbilities();
      enemy.decideAction();
    }
  });
  if (state.inCombat) {
    // Combat regen = 50% of regen
    if (Math.floor(player.hpRegen() * 0.5) > 0 && player.stats.hp < player.getStats().hpMax) {
      player.stats.hp += Math.floor(player.hpRegen() * 0.5);
    }
  } else {
    if (player.hpRegen() > 0 && player.stats.hp < player.getStats().hpMax) {
      player.stats.hp += player.hpRegen();
    }
  }
  if (player.stats.hp > player.getStats().hpMax) {
    player.stats.hp = player.getStats().hpMax;
  }
}

/* Show enemy stats when hovering */
function hoverEnemyShow(enemy: enemy) {
  staticHover.textContent = "";
  staticHover.style.display = "block";
  const name = document.createElement("p");
  name.classList.add("enemyName");
  name.textContent = enemy.name;
  var mainStatText: string = "";
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