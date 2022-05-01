function spriteVariables() {
  const spriteSize = Math.round(128 * currentZoom);
  var spriteLimitX = Math.ceil(baseCanvas.width / spriteSize);
  var spriteLimitY = Math.ceil(baseCanvas.height / spriteSize);
  if (spriteLimitX % 2 == 0) spriteLimitX++;
  if (spriteLimitY % 2 == 0) spriteLimitY++;
  const mapOffsetX = (spriteLimitX * spriteSize - baseCanvas.width) / 2;
  const mapOffsetY = (spriteLimitY * spriteSize - baseCanvas.height) / 2;
  const mapOffsetStartX = player.cords.x - settings.map_offset_x - Math.floor(spriteLimitX / 2);
  const mapOffsetStartY = player.cords.y - settings.map_offset_y - Math.floor(spriteLimitY / 2);

  return { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY };
}


const checkDirs = {
  rightUp: { x1: 0, y1: -1, x2: 1, y2: 0 },
  rightDown: { x1: 1, 1: 0, x2: 0, y2: 1 },
  leftUp: { x1: 0, y1: -1, x2: -1, y2: 0 },
  leftDown: { x1: -1, y1: 0, x2: 0, y2: 1 }
} as any;

function calcDistance(startX: number, startY: number, endX: number, endY: number) {
  let xDist = Math.abs(endX - startX);
  let yDist = Math.abs(endY - startY);
  return xDist + yDist;
}

function cordsFromDir(cords: tileObject, dir: string) {
  let cord = { ...cords };
  if (dir == "up") cord.y--;
  else if (dir == "down") cord.y++;
  else if (dir == "left") cord.x--;
  else if (dir == "right") cord.x++;
  else if (dir == "rightUp") { cord.y--; cord.x++; }
  else if (dir == "rightDown") { cord.y++; cord.x++; }
  else if (dir == "leftUp") { cord.y--; cord.x--; }
  else if (dir == "leftDown") { cord.y++; cord.x--; }
  return cord;
}