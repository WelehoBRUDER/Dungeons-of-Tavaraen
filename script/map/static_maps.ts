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


// This should be called once when entering a new map.
// It returns nothing, instead updating 3 existing variables.
let staticMap_normal: Array<number[]> = [];
let staticMap_flying: Array<number[]> = [];
let sightMap_empty: Array<number[]> = [];
async function createStaticMap() {
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