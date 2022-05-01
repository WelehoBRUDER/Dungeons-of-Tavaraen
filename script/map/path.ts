/* PATH FINDING ALGORITHM */

function generatePath(start: tileObject, end: tileObject, canFly: boolean, distanceOnly: boolean = false, retreatPath: number = 0) {
  /* Quick calculation to determine approximate distance for low performance cost */
  let distance = Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
  /* Return only distance if that's all that has been requested */
  if (distanceOnly) {
    let newDistance = distance;
    /* What the fck does this do? */
    if ((Math.abs(start.x - end.x) == Math.abs(start.y - end.y)) && distance < 3) newDistance = Math.round(newDistance / 2);
    return newDistance;
  }
  /* If the goal is out of bounds cancel the pathfinding */
  if (end.x < 0 || end.x > maps[currentMap].base[0].length - 1 || end.y < 0 || end.y > maps[currentMap].base.length - 1) return;
  /* Initialize an empty map for testing */
  var fieldMap: Array<number[]>;
  /* Decide which static map should be used */
  if (canFly) fieldMap = JSON.parse(JSON.stringify(staticMap_flying));
  else fieldMap = JSON.parse(JSON.stringify(staticMap_normal));
  /* If we're not generating for the player then add summons as obstacles */
  if (start.x !== player.cords.x && start.y !== player.cords.y) {
    fieldMap[player.cords.y][player.cords.x] = 1;
    combatSummons.forEach(summon => {
      if (summon.cords.x !== start.x && summon.cords.y !== start.y) {
        fieldMap[summon.cords.y][summon.cords.x] = 1;
      }
    });
  }
  /* Add enemies as obstacles */
  maps[currentMap].enemies.forEach((enemy: any) => { if (!(start.x == enemy.cords.x && start.y == enemy.cords.y)) { { fieldMap[enemy.cords.y][enemy.cords.x] = 1; }; } });
  NPCcharacters.forEach((npc: Npc) => {
    if (npc.currentMap == currentMap) {
      fieldMap[npc.currentCords.y][npc.currentCords.x] = 1;
    }
  });
  /* Determine the start and end as values we wish to reach */
  fieldMap[start.y][start.x] = 0;
  fieldMap[end.y][end.x] = 5;
  /* Failsafe to prevent an infinite loop, breaks after 2000 iterations */
  let calls = 0;
  let maximumCalls = 2000;
  /* This array will store potential steps */
  const checkGrid: Array<any> = [{ v: 5, x: end.x, y: end.y }];
  /* Recursion sorcery, each iteration it gets closer to the goal */
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
  /* This will be used to fill the final array */
  const data = {
    x: start.x,
    y: start.y
  };
  /* Cors array is filled with the siksakki loop */
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
  /* Empty the map just for lolz and return final path */
  fieldMap = null;
  return cords as any;
}

function arrowHitsTarget(start: tileObject, end: tileObject, isSummon: boolean = false, useExistingPath: any = null) {
  let path: any;
  if (useExistingPath) {
    path = useExistingPath;
  }
  else {
    path = generateArrowPath(start, end);
  }
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