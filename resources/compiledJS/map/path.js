"use strict";
/* PATH FINDING ALGORITHM */
function generatePath(start, end, canFly, distanceOnly = false, retreatPath = 0) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    /* Quick calculation to determine approximate distance for low performance cost */
    let distance = Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
    /* Return only distance if that's all that has been requested */
    if (distanceOnly) {
        let newDistance = distance;
        /* What the fck does this do? */
        if (Math.abs(start.x - end.x) == Math.abs(start.y - end.y) && distance < 3)
            newDistance = Math.round(newDistance / 2);
        return newDistance;
    }
    /* If the goal is out of bounds cancel the pathfinding */
    if (end.x < 0 || end.x > maps[currentMap].base[0].length - 1 || end.y < 0 || end.y > maps[currentMap].base.length - 1)
        return;
    /* Initialize an empty map for testing */
    let fieldMap;
    /* Decide which static map should be used */
    if (canFly)
        fieldMap = JSON.parse(JSON.stringify(staticMap_flying));
    else
        fieldMap = JSON.parse(JSON.stringify(staticMap_normal));
    /* If we're not generating for the player then add summons as obstacles */
    if (start.x !== player.cords.x && start.y !== player.cords.y) {
        fieldMap[player.cords.y][player.cords.x] = 1;
        combatSummons.forEach((summon) => {
            if (summon.cords.x !== start.x && summon.cords.y !== start.y) {
                fieldMap[summon.cords.y][summon.cords.x] = 1;
            }
        });
    }
    /* Add enemies as obstacles */
    maps[currentMap].enemies.forEach((enemy) => {
        if (!(start.x == enemy.cords.x && start.y == enemy.cords.y)) {
            {
                fieldMap[enemy.cords.y][enemy.cords.x] = 1;
            }
        }
    });
    NPCcharacters.forEach((npc) => {
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
    const checkGrid = [{ v: 5, x: end.x, y: end.y }];
    /* Recursion sorcery, each iteration it gets closer to the goal */
    while (fieldMap[start.y][start.x] == 0 && checkGrid.length > 0 && calls < maximumCalls) {
        const { v, x, y } = checkGrid.splice(0, 1)[0];
        if (fieldMap[y][x] == v) {
            // Check diagonal
            // North-west
            if (((_a = fieldMap[y - 1]) === null || _a === void 0 ? void 0 : _a[x - 1]) === 0 && (((_b = fieldMap[y]) === null || _b === void 0 ? void 0 : _b[x - 1]) === 0 || ((_c = fieldMap[y - 1]) === null || _c === void 0 ? void 0 : _c[x]) === 0)) {
                fieldMap[y - 1][x - 1] = v + 1;
                checkGrid.push({ v: v + 1, x: x - 1, y: y - 1, dist: calcDistance(x - 1, y - 1, start.x, start.y) });
            }
            // North-east
            if (((_d = fieldMap[y - 1]) === null || _d === void 0 ? void 0 : _d[x + 1]) === 0 && (((_e = fieldMap[y]) === null || _e === void 0 ? void 0 : _e[x + 1]) === 0 || ((_f = fieldMap[y - 1]) === null || _f === void 0 ? void 0 : _f[x]) === 0)) {
                fieldMap[y - 1][x + 1] = v + 1;
                checkGrid.push({ v: v + 1, x: x + 1, y: y - 1, dist: calcDistance(x + 1, y - 1, start.x, start.y) });
            }
            // South-west
            if (((_g = fieldMap[y + 1]) === null || _g === void 0 ? void 0 : _g[x - 1]) === 0 && (((_h = fieldMap[y]) === null || _h === void 0 ? void 0 : _h[x - 1]) === 0 || ((_j = fieldMap[y + 1]) === null || _j === void 0 ? void 0 : _j[x]) === 0)) {
                fieldMap[y + 1][x - 1] = v + 1;
                checkGrid.push({ v: v + 1, x: x - 1, y: y + 1, dist: calcDistance(x - 1, y + 1, start.x, start.y) });
            }
            // South-east
            if (((_k = fieldMap[y + 1]) === null || _k === void 0 ? void 0 : _k[x + 1]) === 0 && (((_l = fieldMap[y]) === null || _l === void 0 ? void 0 : _l[x + 1]) === 0 || ((_m = fieldMap[y + 1]) === null || _m === void 0 ? void 0 : _m[x]) === 0)) {
                fieldMap[y + 1][x + 1] = v + 1;
                checkGrid.push({ v: v + 1, x: x + 1, y: y + 1, dist: calcDistance(x + 1, y + 1, start.x, start.y) });
            }
            if (((_o = fieldMap[y - 1]) === null || _o === void 0 ? void 0 : _o[x]) === 0) {
                fieldMap[y - 1][x] = v + 1;
                checkGrid.push({ v: v + 1, x: x, y: y - 1, dist: calcDistance(x, y - 1, start.x, start.y) });
            }
            if (((_p = fieldMap[y + 1]) === null || _p === void 0 ? void 0 : _p[x]) === 0) {
                fieldMap[y + 1][x] = v + 1;
                checkGrid.push({ v: v + 1, x: x, y: y + 1, dist: calcDistance(x, y + 1, start.x, start.y) });
            }
            if (((_q = fieldMap[y]) === null || _q === void 0 ? void 0 : _q[x - 1]) === 0) {
                fieldMap[y][x - 1] = v + 1;
                checkGrid.push({ v: v + 1, x: x - 1, y: y, dist: calcDistance(x - 1, y, start.x, start.y) });
            }
            if (((_r = fieldMap[y]) === null || _r === void 0 ? void 0 : _r[x + 1]) === 0) {
                fieldMap[y][x + 1] = v + 1;
                checkGrid.push({ v: v + 1, x: x + 1, y: y, dist: calcDistance(x + 1, y, start.x, start.y) });
            }
        }
        checkGrid.sort((a, b) => {
            return a.dist - b.dist;
        });
        calls++;
    }
    /* This will be used to fill the final array */
    const data = {
        x: start.x,
        y: start.y,
    };
    /* Cors array is filled with the siksakki loop */
    const cords = [];
    siksakki: for (let i = 0; i < 375; i++) {
        const v = fieldMap[data.y][data.x] - 1;
        if (((_s = fieldMap[data.y]) === null || _s === void 0 ? void 0 : _s[data.x - 1]) == v)
            data.x -= 1;
        else if (((_t = fieldMap[data.y]) === null || _t === void 0 ? void 0 : _t[data.x + 1]) == v)
            data.x += 1;
        else if (((_u = fieldMap[data.y - 1]) === null || _u === void 0 ? void 0 : _u[data.x]) == v)
            data.y -= 1;
        else if (((_v = fieldMap[data.y + 1]) === null || _v === void 0 ? void 0 : _v[data.x]) == v)
            data.y += 1;
        else if (((_w = fieldMap[data.y - 1]) === null || _w === void 0 ? void 0 : _w[data.x - 1]) == v) {
            data.y -= 1;
            data.x -= 1;
        }
        else if (((_x = fieldMap[data.y - 1]) === null || _x === void 0 ? void 0 : _x[data.x + 1]) == v) {
            data.y -= 1;
            data.x += 1;
        }
        else if (((_y = fieldMap[data.y + 1]) === null || _y === void 0 ? void 0 : _y[data.x - 1]) == v) {
            data.y += 1;
            data.x -= 1;
        }
        else if (((_z = fieldMap[data.y + 1]) === null || _z === void 0 ? void 0 : _z[data.x + 1]) == v) {
            data.y += 1;
            data.x += 1;
        }
        if (fieldMap[data.y][data.x] == v)
            cords.push({ ...data });
        if (data.y == end.y && data.x == end.x)
            break siksakki;
    }
    /* Empty the map just for lolz and return final path */
    fieldMap = null;
    return cords;
}
function arrowHitsTarget(start, end, isSummon = false, useExistingPath = null) {
    let path;
    if (useExistingPath) {
        path = useExistingPath;
    }
    else {
        path = generateArrowPath(start, end);
    }
    let hits = true;
    path.forEach((step) => {
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
function generateArrowPath(start, end, distanceOnly = false) {
    const distX = Math.abs(start.x - end.x) + 1;
    const distY = Math.abs(start.y - end.y) + 1;
    if (distanceOnly)
        return distX + distY;
    const ratioY = distY / distX;
    const ratioX = distX / distY;
    const negativeY = start.y - end.y > 0;
    const negativeX = start.x - end.x > 0;
    const ratioY2 = ratioY == Math.max(ratioY, ratioX) ? (negativeY ? -1 : 1) : negativeY ? ratioY * -1 : ratioY;
    const ratioX2 = ratioX == Math.max(ratioY, ratioX) ? (negativeX ? -1 : 1) : negativeX ? ratioX * -1 : ratioX;
    const arrow = {
        x: start.x,
        y: start.y,
        blocked: false,
        enemy: false,
        player: false,
        summon: false,
    };
    const finalPath = [{ ...arrow }];
    let rounderX = negativeX ? Math.ceil : Math.floor;
    let rounderY = negativeY ? Math.ceil : Math.floor;
    for (let i = 0; i < 100; i++) {
        arrow.x += ratioX2;
        arrow.y += ratioY2;
        let tile = { x: rounderX(arrow.x), y: rounderY(arrow.y) };
        if (tile.y > maps[currentMap].base.length || tile.y < 0)
            continue;
        if (tile.x > maps[currentMap].base[0].length || tile.x < 0)
            continue;
        if (tiles[maps[currentMap].base[tile.y][tile.x]].isWall || clutters[maps[currentMap].clutter[tile.y][tile.x]].isWall)
            arrow.blocked = true;
        maps[currentMap].enemies.forEach((enemy) => {
            if (enemy.cords.x == start.x && enemy.cords.y == start.y)
                return;
            if (enemy.cords.x == tile.x && enemy.cords.y == tile.y) {
                arrow.enemy = true;
                arrow.blocked = true;
            }
        });
        combatSummons.forEach((summon) => {
            if (summon.cords.x == start.x && summon.cords.y == start.y)
                return;
            if (summon.cords.x == tile.x && summon.cords.y == tile.y) {
                arrow.summon = true;
                arrow.blocked = true;
            }
        });
        if (player.cords.x == tile.x && player.cords.y == tile.y) {
            arrow.player = true;
            arrow.blocked = true;
        }
        finalPath.push({ ...arrow });
        arrow.enemy = false;
        if (rounderX(arrow.x) == end.x && rounderY(arrow.y) == end.y)
            break;
    }
    return finalPath.map((e) => {
        e.x = rounderX(e.x);
        e.y = rounderY(e.y);
        return e;
    });
}
//# sourceMappingURL=path.js.map