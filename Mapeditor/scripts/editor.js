var editingMap = {
  name: "sample",
  id: "sample_map",
  map: [
    [0, 0, 0, 0, 0, 4, 4, 3, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 2, 3, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  clutterMap: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  nbt: [],
  vihut: [],
  vihuMap: [],
  teleports: []
}
const copy = e => JSON.parse(JSON.stringify(e));

let ctrlZArray = [];
let ctrlZIndex = -1;

const canvas = document.querySelector("#mainMap");
const ctx = canvas.getContext("2d");
const selectCanvas = document.querySelector("#selecting");
const selectCtx = selectCanvas.getContext("2d");
const enemyCanvas = document.querySelector("#enemyLayer");
const enemyCtx = enemyCanvas.getContext("2d");
let zoomLevel = 1;
let baseSize = 64;
let cam = {
  x: 6,
  y: 7
}

let brush = {
  tile: null,
  clutter: null
}

let select = {
  x: null,
  y: null,
  x2: null,
  y2: null
}

let hover = {
  x: null,
  y: null
}

let enemySelect = null;

function createMap() {
  const newSize = baseSize * zoomLevel;
  const karttaSpriteMaaraY = Math.ceil(canvas.height / newSize) + (1 - Math.ceil(canvas.height / newSize) % 2);
  const karttaSpriteMaaraX = Math.ceil(canvas.width / newSize) + (1 - Math.ceil(canvas.width / newSize) % 2);
  const karttaOffsetX = (karttaSpriteMaaraX * newSize - canvas.width) / 2;
  const karttaOffsetY = (karttaSpriteMaaraY * newSize - canvas.height) / 2;
  const offsetMapAloitusY = cam.y - Math.floor(karttaSpriteMaaraY / 2);
  const offsetMapAloitusX = cam.x - Math.floor(karttaSpriteMaaraX / 2);

  mapProps();

  canvas.width = canvas.width; // Reset canvas
  for (let y = 0; y < karttaSpriteMaaraY; y++) {
    for (let x = 0; x < karttaSpriteMaaraX; x++) {
      
      // const imgId = editingMap.map[offsetMapAloitusY + y]?.[offsetMapAloitusX + x];
      // const img = document.querySelector(`.tile${imgId}`);
      // const clutterId = editingMap.clutterMap[offsetMapAloitusY + y]?.[offsetMapAloitusX + x];
      // const clutterImg = clutterId !== 0 ? document.querySelector(`.clutter${clutterId}`) : null;
      // const enemyId = editingMap.vihuMap?.[offsetMapAloitusY + y]?.[offsetMapAloitusX + x]?.id;
      // const enemyImg = enemyId != null ? document.querySelector("#" + enemies[enemyId].tileSprite) : null;

      const imgId = editingMap.map[offsetMapAloitusY + y]?.[offsetMapAloitusX + x];
      const img = document.querySelector(`.tile${imgId}`);
      const clutterId = editingMap.clutterMap[offsetMapAloitusY + y]?.[offsetMapAloitusX + x];
      const clutterImg = clutterId !== 0 ? document.querySelector(`.clutter${clutterId}`) : null;
      const enemyId = editingMap.vihuMap[offsetMapAloitusY + y]?.[offsetMapAloitusX + x]?.id;
      const enemyImg = enemyId != null ? document.querySelector("." + enemies[enemyId].sprite) : null;


      if(img) {
        ctx.drawImage(img, x * newSize - karttaOffsetX, y * newSize - karttaOffsetY, newSize, newSize);
      } if(clutterImg) {
        ctx.drawImage(clutterImg, x * newSize - karttaOffsetX, y * newSize - karttaOffsetY, newSize, newSize);
      } if(enemyImg) {
        ctx.drawImage(enemyImg, x * newSize - karttaOffsetX, y * newSize - karttaOffsetY, newSize, newSize);
      }
    }
  }

  piirraSelect({x: select.x, y: select.y});
  
  canvas.onclick = painaCanvasta;
  canvas.onmousemove = painaCanvasta;
  function painaCanvasta({offsetX, offsetY, buttons, type}) {
    const { width, height } = canvas.getBoundingClientRect(),
        venytysX = width / canvas.width * newSize,
        venytysY = height / canvas.height * newSize,
        venytysOffsetX = width / canvas.width * karttaOffsetX,
        venytysOffsetY = height / canvas.height * karttaOffsetY;

    const valittuX = Math.floor((offsetX + venytysOffsetX) / venytysX) + offsetMapAloitusX,
          valittuY = Math.floor((offsetY + venytysOffsetY) / venytysY) + offsetMapAloitusY;
    
    if(buttons == 1 && type !== "click" || type == "click") {
      if(editingMap.map?.[valittuY]?.[valittuX] === undefined) return;
      const nykyTieto = paintCtrlZArray({x: valittuX, y: valittuY});
      if(nykyTieto && !onkoEdellinenCtrlZSama(nykyTieto)) lisaaCtrlZ(nykyTieto);

      select = {x: valittuX, y: valittuY};

      if(brush.tile !== null) editingMap.map[valittuY][valittuX] = tiles.findIndex(tile=>tile.name == brush.tile.name);
      if(brush.clutter !== null) editingMap.clutterMap[valittuY][valittuX] = clutters.findIndex(clutter=>clutter.name == brush.clutter.name);
      if(enemySelect !== null) {
        if(!editingMap.vihuMap[valittuY]) editingMap.vihuMap[valittuY] = [];
        editingMap.vihuMap[valittuY][valittuX] = enemySelect;
      }
      
      const uusiTieto = paintCtrlZArray({x: valittuX, y: valittuY});
      if(uusiTieto && !onkoEdellinenCtrlZSama(uusiTieto)) lisaaCtrlZ(uusiTieto);

      drawOnMapsGrid({x: valittuX, y: valittuY});
      mapProps();
    } else if(buttons == 2 && editingMap.map[valittuY]?.[valittuX] != null) {
      select.x2 = valittuX; select.y2 = valittuY;
    }

    piirraSelect({x: valittuX, y: valittuY});

    if(buttons == 4 && type == "mousemove") {
      brush.tile = tiles[editingMap?.map?.[valittuY]?.[valittuX]] || null;
      brush.clutter = clutter[editingMap?.clutterMap?.[valittuY]?.[valittuX]] || null;
      mapProps();
    }
  }
}
canvas.addEventListener("contextmenu", e => {
  e.preventDefault();
  return false;
});
canvas.addEventListener("mousedown", mouseDownCanvas);
function mouseDownCanvas({offsetX, offsetY, buttons}) {
  if(buttons !== 4 && buttons !== 2) return;
  const newSize = baseSize * zoomLevel;
  const karttaSpriteMaaraY = Math.ceil(canvas.height / newSize) + (1 - Math.ceil(canvas.height / newSize) % 2),
        karttaSpriteMaaraX = Math.ceil(canvas.width / newSize) + (1 - Math.ceil(canvas.width / newSize) % 2);
  const karttaOffsetX = (karttaSpriteMaaraX * newSize - canvas.width) / 2,
        karttaOffsetY = (karttaSpriteMaaraY * newSize - canvas.height) / 2;
  const offsetMapAloitusY = cam.y - Math.floor(karttaSpriteMaaraY / 2),
        offsetMapAloitusX = cam.x - Math.floor(karttaSpriteMaaraX / 2);
  const { width, height } = canvas.getBoundingClientRect(),
        venytysX = width / canvas.width * newSize,
        venytysY = height / canvas.height * newSize,
        venytysOffsetX = width / canvas.width * karttaOffsetX,
        venytysOffsetY = height / canvas.height * karttaOffsetY;
  const valittuX = Math.floor((offsetX + venytysOffsetX) / venytysX) + offsetMapAloitusX,
        valittuY = Math.floor((offsetY + venytysOffsetY) / venytysY) + offsetMapAloitusY;

  if(buttons == 2 && editingMap.map[valittuY]?.[valittuX] != null) select = {x: valittuX, y: valittuY};
  else {
    brush.tile = tiles[editingMap?.map?.[valittuY]?.[valittuX]] || null;
    brush.clutter = clutters[editingMap?.clutterMap?.[valittuY]?.[valittuX]] || null;
    mapProps();
  }
}

function piirraSelect({x, y}) {
  const newSize = baseSize * zoomLevel;
  const karttaSpriteMaaraY = Math.ceil(canvas.height / newSize) + (1 - Math.ceil(canvas.height / newSize) % 2);
  const karttaSpriteMaaraX = Math.ceil(canvas.width / newSize) + (1 - Math.ceil(canvas.width / newSize) % 2);
  const karttaOffsetX = (karttaSpriteMaaraX * newSize - canvas.width) / 2;
  const karttaOffsetY = (karttaSpriteMaaraY * newSize - canvas.height) / 2;
  const offsetMapAloitusY = cam.y - Math.floor(karttaSpriteMaaraY / 2);
  const offsetMapAloitusX = cam.x - Math.floor(karttaSpriteMaaraX / 2);

  selectCanvas.width = selectCanvas.width; // Nollaa canvaksen

  if(x !== select.x || y !== select.y) {
    selectCtx.strokeStyle = "white";
    selectCtx.lineWidth = 4;
    selectCtx.strokeRect((x - offsetMapAloitusX) * newSize - karttaOffsetX, (y - offsetMapAloitusY) * newSize - karttaOffsetY, newSize, newSize);
  }

  if(select.x !== null || select.y !== null) {
    selectCtx.strokeStyle = "red";
    selectCtx.lineWidth = 4;
    if(select.x2 == null || select.y2 == null) {
      selectCtx.strokeRect((select.x - offsetMapAloitusX) * newSize - karttaOffsetX, (select.y - offsetMapAloitusY) * newSize - karttaOffsetY, newSize, newSize);
    } else {
      const xSize = (Math.abs(select.x - select.x2) + 1) * newSize,
            ySize = (Math.abs(select.y - select.y2) + 1) * newSize;
      const pieniX = Math.min(select.x, select.x2),
            pieniY = Math.min(select.y, select.y2);
      selectCtx.strokeRect((pieniX - offsetMapAloitusX) * newSize - karttaOffsetX, (pieniY - offsetMapAloitusY) * newSize - karttaOffsetY, xSize, ySize);
    }
  }
}

function drawOnMapsGrid({x, y, x2 = x, y2 = y}) {
  const newSize = baseSize * zoomLevel;
  const karttaSpriteMaaraY = Math.ceil(canvas.height / newSize) + (1 - Math.ceil(canvas.height / newSize) % 2);
  const karttaSpriteMaaraX = Math.ceil(canvas.width / newSize) + (1 - Math.ceil(canvas.width / newSize) % 2);
  const karttaOffsetX = (karttaSpriteMaaraX * newSize - canvas.width) / 2;
  const karttaOffsetY = (karttaSpriteMaaraY * newSize - canvas.height) / 2;
  const offsetMapAloitusY = cam.y - Math.floor(karttaSpriteMaaraY / 2);
  const offsetMapAloitusX = cam.x - Math.floor(karttaSpriteMaaraX / 2);
  const yEro = (Math.abs(y - y2) + y + 1) - offsetMapAloitusY;
  const xEro = (Math.abs(x - x2) + x + 1) - offsetMapAloitusX;

  let test = 5 % 2;

  for(let aloitusY = y - offsetMapAloitusY; aloitusY < karttaSpriteMaaraY && aloitusY <  yEro; aloitusY++) {
    for(let aloitusX = x - offsetMapAloitusX; aloitusX < karttaSpriteMaaraX && aloitusX < xEro; aloitusX++) {
      const imgId = editingMap.map[offsetMapAloitusY + aloitusY]?.[offsetMapAloitusX + aloitusX];
      const img = document.querySelector(`.tile${imgId}`);
      const clutterId = editingMap.clutterMap[offsetMapAloitusY + aloitusY]?.[offsetMapAloitusX + aloitusX];
      const clutterImg = clutterId !== 0 ? document.querySelector(`.clutter${clutterId}`) : null;
      const enemyId = editingMap.vihuMap[offsetMapAloitusY + aloitusY]?.[offsetMapAloitusX + aloitusX]?.id;
      const enemyImg = enemyId != null ? document.querySelector("." + enemies[enemyId].sprite) : null;

      if(img) {
        ctx.drawImage(img, aloitusX * newSize - karttaOffsetX, aloitusY * newSize - karttaOffsetY, newSize, newSize);
      } if(clutterImg) {
        ctx.drawImage(clutterImg, aloitusX * newSize - karttaOffsetX, aloitusY * newSize - karttaOffsetY, newSize, newSize);
      } if(enemyImg) {
        ctx.drawImage(enemyImg, aloitusX * newSize - karttaOffsetX, aloitusY * newSize - karttaOffsetY, newSize, newSize);
      }
    }
  }
}



window.addEventListener("keydown", hotkey);
function hotkey(e) {
  if(e.target.tagName == "INPUT") return;
  let kerroin = 1;
  if(e.shiftKey) kerroin = 10;
  if(e.altKey) kerroin = 25;
  if(e.ctrlKey) kerroin = 50;

  if (e.code == "KeyD") cam.x += 1 * kerroin;
  else if (e.code == "KeyA") cam.x -= 1 * kerroin;
  else if (e.code == "KeyW") cam.y -= 1 * kerroin;
  else if (e.code == "KeyS") cam.y += 1 * kerroin;

  const wasd = [65, 83, 87, 68];
  if(wasd.indexOf(e.keyCode) !== -1) {
    e.preventDefault();
    createMap();
  }

  // if(e.code == "Space" && enemySelect != null) {
  //   editEnemyStats();
  // }
}

function showTileInfo() {
  let tile = tiles[editingMap.map[select.y][select.x]];
  document.querySelector("#tileProperties").textContent = "";
  for (let property in tile) {
    let text = document.createElement("p");
    text.textContent = property + ": " + tile[property];
    document.querySelector("#tileProperties").appendChild(text);
  }
}

function printMap() {
  let mapArray = `[\n`;
  editingMap.map.forEach(rivi => {
    mapArray += "\t\t" + JSON.stringify(rivi) + ", \n";
  }); mapArray += "\t]"

  let clutterArray = `[\n`;
  editingMap.clutterMap.forEach(rivi => {
    clutterArray += "\t\t" + JSON.stringify(rivi) + ", \n";
  }); clutterArray += "\t]";

  let nbtArray = `[\n`;
  editingMap.nbt?.forEach(rivi => {
    nbtArray += "\t\t" + JSON.stringify(rivi) + ", \n";
  }); nbtArray += "\t]";

  let vihutArray = `[\n`;
  editingMap.vihuMap?.forEach((rivi, y) => {
    rivi.forEach((vihu, x) => {
      let text = `cords: { x: ${x}, y: ${y} }, spawnCords: { x: ${x}, y: ${y} }, level: 1 `;
      for(const nimi in vihu) {
        if(nimi !== "id") text += ", " + nimi + ": " + JSON.stringify(vihu[nimi]);
      } vihutArray += "\t\t" + `new Enemy({...enemies["${vihu.id}"], ${text}})` + ", \n";
    });
  }); vihutArray += "\t]";

  let teleportsArray = `[\n`;
  editingMap.teleports?.forEach(rivi => {
    teleportsArray += "\t\t" + JSON.stringify(rivi) + ", \n";
  }); teleportsArray += "\t]";

console.log(`{
\tname: "${editingMap.name}",
\tvoidTexture: ${editingMap.voidTexture || '""'},
\tmap: ${mapArray},
\tclutterMap: ${clutterArray},
\tnbt: ${nbtArray},
\tenemies: ${vihutArray},
\tteleports: ${teleportsArray}
}`);
}

function importMap() {
  let answer = prompt("Index of map");
  if(!maps[answer]) return;
  editingMap = {...maps[answer]};
  editingMap.vihuMap = [];
  editingMap.enemies.forEach(({...vihu}) => {
    let y = vihu.cords.y;
    let x = vihu.cords.x;
    if(!editingMap.vihuMap[y]) editingMap.vihuMap[y] = [];
    console.log(x);
    editingMap.vihuMap[y][x] = vihu;
  });
  cam.x = Math.ceil(editingMap.map[0].length  / 2);
  cam.y = Math.ceil(editingMap.map.length / 2);
  createMap();
  ctrlZArray = [];
  ctrlZIndex = -1;
}

function createNewMap() {
  let mapName = prompt("Name of the new map");
  if(!mapName) return;
  let mapId = prompt("ID of the map (eg. marn_cave");
  if(!mapId) return;
  let baseTile = +prompt("Base tile for new map (ID 0 is water):");
  let width = +prompt("Width of map (x length):");
  if(width === 0) return;
  let height = +prompt("Height of map (y length):");
  if(height === 0) return;
  editingMap.name = mapName;
  editingMap.id = mapId;
  editingMap.map = new Array(height).fill("0").map(e => new Array(width).fill(baseTile))
  editingMap.clutterMap = new Array(height).fill("0").map(e => new Array(width).fill(0))
  editingMap.voidTexture = 0;
  editingMap.nbt = [];
  editingMap.vihut = [];
  editingMap.teleports = [];
  
  cam.x = Math.ceil(width / 2);
  cam.y = Math.ceil(height / 2);

  console.log(editingMap)
  createMap();
  ctrlZArray = [];
  ctrlZIndex = -1;
}

canvas.addEventListener("wheel", changeZoomLevel);
function changeZoomLevel({ deltaY }) {
  const zoomLevels = [.1, .2, .4, .75, 1, 1.3, 1.75, 2]
  if (deltaY > 0) {
    zoomLevel = zoomLevels[zoomLevels.indexOf(zoomLevel) - 1] || zoomLevels[0];
  } else {
    zoomLevel = zoomLevels[zoomLevels.indexOf(zoomLevel) + 1] || zoomLevels[zoomLevels.length - 1];
  }

  createMap();
}

function mapProps() {
  document.querySelector("#tileProperties").textContent = "";
  let pos = editingMap.map[select.y]?.[select.x];
  let clu = editingMap.clutterMap[select.y]?.[select.x];
  let text = document.createElement("pre");
  text.textContent = `
CamX: ${cam.x}
CamY: ${cam.y}

MapWidth: ${editingMap.map[0].length}
MapHeight: ${editingMap.map.length}
MapArea: ${editingMap.map.length * editingMap.map[0].length + " tiles"}
MapId: ${editingMap.id}

SelectedX: ${select.x}
SelectedY: ${select.y}
TileName: ${tiles[pos]?.name ? tiles[pos].name : "Void"}
TileId: ${tiles[pos]?.id != null ? tiles[pos].id : "-1"} 
isWall: ${tiles[pos]?.isWall ? tiles[pos].isWall : "false"}
isLedge: ${tiles[pos]?.isLedge ? tiles[pos].isLedge : "false"}

${clutters[clu]?.name && clu != 0 ? "Clutter: " + clutters[clu].name : ""}
${clutters[clu]?.isWall != null && clu != 0 ? "isWall: " + clutters[clu].isWall : ""}

BrushTile: ${brush.tile !== null ? brush?.tile.name : "not selected"}
BrushClutter: ${brush.clutter !== null ? brush?.clutter.name : "not selected"}
EnemySelect: ${enemySelect !== null ? enemySelect : "not selected"}
`;
  document.querySelector("#tileProperties").appendChild(text);
}

function tpTo() {
  let tpX = +prompt("Teleport X");
  let tpY = +prompt("Teleport Y");
  cam.x = tpX;
  cam.y = tpY;
  createMap();
}

function updateTilesMenu() {
  function luoTaulu() {
    let taulu = [
      [
        {nimi: "Tile name", tyyli: "string"}, {nimi: "isWall"}, {nimi: "isLedge"}, {nimi: "img"}
      ]
    ]
    tiles.forEach(({name, isLedge, isWall, img, sprite}) => {
      let rivi = {data: [name, isWall, isLedge, {text: " ", img: img}]}
      taulu.push(rivi);
    });

    return taulu;
  }

  document.querySelector("#tilesContainer").style.display = "block";
  lisaaSpreadSheet(document.querySelector("#tilesContainer"), luoTaulu(), false, "tile");
}

function updateClutterMenu() {
  function luoTaulu() {
    let taulu = [
      [
        {nimi: "Clutter", tyyli: "string"}, {nimi: "isWall"}, {nimi: "img"}
      ]
    ]
    clutters.forEach(({name, isWall, img}) => {
      let rivi = {data: [name, isWall, {text: " ", img: img}]}
      taulu.push(rivi);
    })

    return taulu;
  }

  document.querySelector("#tilesContainer").style.display = "block";
  lisaaSpreadSheet(document.querySelector("#tilesContainer"), luoTaulu(), false, "clutter");
}

function updateEnemiesMenu() {
  function luoTaulu() {
    let taulu = [
      [
        {nimi: "id", tyyli: "string"}, {nimi: "STR"}, {nimi: "DEX"}, {nimi: "VIT"}, {nimi: "INT"}, {nimi: "CUN"}, {nimi: "HP"}, {nimi: "MP"}, {nimi: "img"}
      ]
    ]
    for(let enemy in enemies) {
      const foe = new Enemy(enemies[enemy]);
      const str = foe.stats.str;
      const dex = foe.stats.dex;
      const vit = foe.stats.vit;
      const int = foe.stats.int;
      const cun = foe.stats.cun;
      const hp = foe.stats.hp;
      const mp = foe.stats.mp;
      let rivi = {data: [foe.id, str, dex, vit, int, cun, hp, mp, {text: " ", img: foe.img}]}
      taulu.push(rivi);
    }

    return taulu;
  }

  document.querySelector("#tilesContainer").style.display = "block";
  lisaaSpreadSheet(document.querySelector("#tilesContainer"), luoTaulu(), false, "enemy");
}

function selectEnemy(id) {
  enemySelect = {id};
  brush.tile = null;
  brush.clutter = null;
  // editEnemyStats(new Enemy(enemies[id]));
  mapProps();
}

function selectTile(id) {
  console.log(id);
  lisaaCtrlZ({event: "brush", run: copy(brush)});
  brush.tile = copy(tiles.find(tile=>tile.name == id));
  let index = tiles.findIndex(tile=>tile.name == id);
  console.log(index);
  lisaaCtrlZ({event: "brush", run: copy(brush)});
  if(select.x2 != null && select.y2 != null) {
    lisaaCtrlZ({event: "tileMap", run: {map: copy(editingMap.map)}});
    const minY = Math.min(select.y, select.y2),
          minX = Math.min(select.x, select.x2);
    const maxY = Math.max(select.y, select.y2),
          maxX = Math.max(select.x, select.x2);
    for(let y = minY; y <= maxY; y++) {
      for(let x = minX; x <= maxX; x++) {
        editingMap.map[y][x] = index;
      }
    } drawOnMapsGrid({x: minX, y: minY, x2: maxX, y2: maxY});
    lisaaCtrlZ({event: "tileMap", run: {map: copy(editingMap.map)}});
  } mapProps();
}

function selectClutter(id) {
  lisaaCtrlZ({event: "brush", run: copy(brush)});
  brush.clutter = copy(clutters.find(c=>c.name == id));
  lisaaCtrlZ({event: "brush", run: copy(brush)});
  
  if(select.x2 != null && select.y2 != null) {
    lisaaCtrlZ({event: "clutterMap", run: {map: copy(editingMap.clutterMap)}});
    const minY = Math.min(select.y, select.y2),
          minX = Math.min(select.x, select.x2);
    const maxY = Math.max(select.y, select.y2),
          maxX = Math.max(select.x, select.x2);
    for(let y = minY; y <= maxY; y++) {
      for(let x = minX; x <= maxX; x++) {
        editingMap.clutterMap[y][x] = id;
      }
    } drawOnMapsGrid({x: minX, y: minY, x2: maxX, y2: maxY});
    lisaaCtrlZ({event: "clutterMap", run: {map: copy(editingMap.clutterMap)}});
  } mapProps();
}

function clearTileSelect() {
  document.querySelector("#tilesContainer").style.display = null;
  lisaaCtrlZ({event: "brush", run: copy(brush)});
  brush.tile = null;
  lisaaCtrlZ({event: "brush", run: copy(brush)});
  mapProps();
}

function clearClutterSelect() {
  document.querySelector("#tilesContainer").style.display = null;
  lisaaCtrlZ({event: "brush", run: copy(brush)});
  brush.clutter = null;
  lisaaCtrlZ({event: "brush", run: copy(brush)});
  mapProps();
}

window.addEventListener("keydown", ctrlZHotkey);
function ctrlZHotkey({ctrlKey, shiftKey, code}) {
  if((code !== "KeyZ" && code !== "KeyY") || !ctrlKey) return;
  if(ctrlZArray.length == 0) return;

  for(let i = 0; i < 10; i++) {
    if(code == "KeyZ" && ctrlZIndex > -1) ctrlZIndex--;
    if(code == "KeyY" && ctrlZArray.length - 1 > ctrlZIndex) ctrlZIndex++;
      
    if(ctrlZIndex == -1) return;
    const valittu = ctrlZArray[ctrlZIndex];
  
    if(valittu.event == "paint") {
      editingMap.map[valittu.run.y][valittu.run.x] = valittu.run.tile
      editingMap.clutterMap[valittu.run.y][valittu.run.x] = valittu.run.clutter
      drawOnMapsGrid({x: valittu.run.x, y: valittu.run.y});
    } else if(valittu.event == "brush") {
      brush = valittu.run;
      mapProps();
    } else if(valittu.event == "tileMap") {
      editingMap.map = copy(valittu.run.map);
      createMap();
    } else if(valittu.event == "clutterMap") {
      editingMap.clutterMap = copy(valittu.run.map);
      createMap();
    }

    if(!shiftKey) return;
  }
}

function onkoEdellinenCtrlZSama({event, run}) {
  const nyky = ctrlZArray[ctrlZIndex] || {};
  const {x, y, tile, clutter} = nyky.run || {};
  if(event == nyky.event && x == run.x && y == run.y && tile == run.tile && clutter == run.clutter) return true;
  return false;
}

function paintCtrlZArray({x, y}) {
  const tileMap = editingMap.map,
        clutterMap = editingMap.clutterMap;

  if(tileMap?.[y]?.[x] === undefined) return false;
  return {event: "paint", run: {x, y, tile: tileMap[y][x], clutter: clutterMap[y][x]}};
}

function lisaaCtrlZ(arr) {
  ctrlZArray[ctrlZIndex + 1] = arr;
  ctrlZArray.length = ctrlZIndex + 2;
  ctrlZIndex++;
}

// painaa vihuu menusta
// editEnemyStats(new Enemy(enemies["mugger"]));

// Painaa space
// editEnemyStats(new Enemy(enemyMap[y][x]))

function editEnemyStats(vihollinen) {
  const dVihu = enemies[vihollinen.id];
  const pohja = document.querySelector(".enemyInfoBox .valintaPohja");

  pohja.innerHTML = "";

  if(vihollinen.name) {
    const soluBox = document.createElement("div");
    soluBox.classList.add("solu");
    const nameInput = document.createElement("input");
    nameInput.value = vihollinen.name;
    const nameText = document.createElement("p");
    nameText.textContent = "Nimi";
    soluBox.appendChild(nameText);
    soluBox.appendChild(nameInput);
    pohja.appendChild(soluBox);
  } if(vihollinen.stats) {
    const {str, dex, vit, int, wil, hpMax, mpMax, fistDamage} = dVihu.stats;

    if(str?.length) newBlock({values: str, value: vihollinen.stats.str, text: "Strength"});
    if(dex?.length) newBlock({values: dex, value: vihollinen.stats.dex, text: "Dexterity"});
    if(vit?.length) newBlock({values: vit, value: vihollinen.stats.vit, text: "Vitality"});
    if(int?.length) newBlock({values: int, value: vihollinen.stats.int, text: "Intelligence"});
    if(wil?.length) newBlock({values: wil, value: vihollinen.stats.wil, text: "Willpower"});
    if(hpMax?.length) newBlock({values: hpMax, value: vihollinen.stats.hpMax, text: "Maximum HP"});
    if(mpMax?.length) newBlock({values: mpMax, value: vihollinen.stats.mpMax, text: "Maximum MP"});
    if(fistDamage?.length) newBlock({values: fistDamage, value: vihollinen.stats.fistDamage, text: "Fist Damage"});
  } if(dVihu.xp?.length) newBlock({values: dVihu.xp, value: vihollinen.xp, text: "XP"});
  if(dVihu.aggroRange?.length) newBlock({values: dVihu.aggroRange, value: vihollinen.aggroRange, text: "Aggro Range"});
  

  function newBlock({values, value, text, score = value}) {
    const soluBox = document.createElement("div");
    soluBox.classList.add("solu");
    const titleText = document.createElement("p");
    titleText.textContent = text;
    const scoreText = document.createElement("p");
    scoreText.textContent = score;

    const input = document.createElement("input");
    input.addEventListener("input", ({target}) => scoreText.textContent = target.value);
    input.value = value;
    input.type = "range";
    input.min = Math.min(values[0], values[1]);
    input.max = Math.max(values[0], values[1]);
    soluBox.appendChild(titleText);
    soluBox.appendChild(scoreText);
    soluBox.appendChild(input);
    pohja.appendChild(soluBox);
  }
}

function testaaKopio() {
  let vihu1 = new Enemy({...enemies["mugger"], x:29, y:32});
  let vihu2 = new Enemy({...enemies["mugger"], x:3, y:2, stats: {armor: 4}});

  console.log(vihu1)
  console.log(vihu2)
}