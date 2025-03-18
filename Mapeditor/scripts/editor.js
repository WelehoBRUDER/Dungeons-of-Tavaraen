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
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	],
	nbt: [],
	vihut: [],
	vihuMap: [],
	teleports: [],
};
const copy = (e) => JSON.parse(JSON.stringify(e));

let ctrlZArray = [];
let ctrlZIndex = -1;

const canvas = document.querySelector("#mainMap");
const ctx = canvas.getContext("2d");
const selectCanvas = document.querySelector("#selecting");
const selectCtx = selectCanvas.getContext("2d");
const enemyCanvas = document.querySelector("#enemyLayer");
const enemyCtx = enemyCanvas.getContext("2d");
const effectCanvas = document.querySelector("#effectLayer");
const effectCtx = effectCanvas.getContext("2d");
const textCanvas = document.querySelector("#textLayer");
const textCtx = textCanvas.getContext("2d");
let zoomLevel = 1;
let baseSize = 64;
let cam = {
	x: 6,
	y: 7,
};

let brush = {
	tile: null,
	clutter: null,
};

let misc_brush = null;

let select = {
	x: null,
	y: null,
	x2: null,
	y2: null,
};

let hover = {
	x: null,
	y: null,
};

let enemySpawnLevel = 1;
let selectedEnemyCords = null;
let enemySelect = null;
let chestSelect = null;
document.querySelector("#enemySpawnLevel").addEventListener("change", (e) => (enemySpawnLevel = +e.target.value));
const _spriteMap_tiles = document.querySelector(".tileAtlas");
function createMap() {
	const newSize = baseSize * zoomLevel;
	const karttaSpriteMaaraY = Math.ceil(canvas.height / newSize) + (1 - (Math.ceil(canvas.height / newSize) % 2));
	const karttaSpriteMaaraX = Math.ceil(canvas.width / newSize) + (1 - (Math.ceil(canvas.width / newSize) % 2));
	const karttaOffsetX = (karttaSpriteMaaraX * newSize - canvas.width) / 2;
	const karttaOffsetY = (karttaSpriteMaaraY * newSize - canvas.height) / 2;
	const offsetMapAloitusY = cam.y - Math.floor(karttaSpriteMaaraY / 2);
	const offsetMapAloitusX = cam.x - Math.floor(karttaSpriteMaaraX / 2);

	mapProps();

	canvas.width = canvas.width; // Reset canvas
	textCanvas.width = textCanvas.width; // Reset canvas
	textCtx.textAlign = "center";
	textCtx.font = `${20 * zoomLevel}px Arial`;
	textCtx.shadowBlur = "5";
	textCtx.shadowColor = "black";
	for (let y = 0; y < karttaSpriteMaaraY; y++) {
		for (let x = 0; x < karttaSpriteMaaraX; x++) {
			const imgId = editingMap.base[offsetMapAloitusY + y]?.[offsetMapAloitusX + x];
			const sprite = tiles[imgId]?.spriteMap ?? { x: 128, y: 0 };
			const clutterId = editingMap.clutter[offsetMapAloitusY + y]?.[offsetMapAloitusX + x];
			const clutterSprite = clutters[clutterId]?.spriteMap;
			const enemyId = editingMap.vihuMap[offsetMapAloitusY + y]?.[offsetMapAloitusX + x]?.id;
			const chestSpriteId = editingMap.chestMap[offsetMapAloitusY + y]?.[offsetMapAloitusX + x]?.sprite;
			const enemyImg = enemyId != null ? document.querySelector("." + enemies[enemyId].sprite) : null;
			const chestImg = chestSpriteId != null ? document.querySelector("." + chestSpriteId) : null;
			const entranceId = editingMap?.entranceMap?.[offsetMapAloitusY + y]?.[offsetMapAloitusX + x]?.sprite;
			const entranceImg = entranceId != null ? document.querySelector("." + entranceId) : null;

			if (sprite) {
				ctx.drawImage(
					_spriteMap_tiles,
					sprite.x,
					sprite.y,
					128,
					128,
					x * newSize - karttaOffsetX,
					y * newSize - karttaOffsetY,
					newSize + 1,
					newSize + 1
				);
				//ctx.drawImage(img, x * newSize - karttaOffsetX, y * newSize - karttaOffsetY, newSize, newSize);
			}
			if (clutterSprite) {
				ctx.drawImage(
					_spriteMap_tiles,
					clutterSprite.x,
					clutterSprite.y,
					128,
					128,
					x * newSize - karttaOffsetX,
					y * newSize - karttaOffsetY,
					newSize + 1,
					newSize + 1
				);
				//ctx.drawImage(clutterImg, x * newSize - karttaOffsetX, y * newSize - karttaOffsetY, newSize, newSize);
			}
			if (enemyImg) {
				const txt = `Level ${editingMap.vihuMap[offsetMapAloitusY + y]?.[offsetMapAloitusX + x]?.level}`;
				textCtx.fillStyle = "white";
				if (editingMap.vihuMap[offsetMapAloitusY + y]?.[offsetMapAloitusX + x]?.isUnique) textCtx.fillStyle = "red";
				textCtx.fillText(txt, x * newSize - karttaOffsetX + newSize / 2, y * newSize - karttaOffsetY);
				ctx.drawImage(enemyImg, x * newSize - karttaOffsetX, y * newSize - karttaOffsetY, newSize, newSize);
			}
			if (chestImg) {
				const txt = editingMap.chestMap[offsetMapAloitusY + y][offsetMapAloitusX + x].id;
				textCtx.fillStyle = "white";
				textCtx.fillText(txt, x * newSize - karttaOffsetX + newSize / 2, y * newSize - karttaOffsetY);
				ctx.drawImage(chestImg, x * newSize - karttaOffsetX, y * newSize - karttaOffsetY, newSize, newSize);
			}
			if (editingMap.shrineMap[offsetMapAloitusY + y]?.[offsetMapAloitusX + x]) {
				const shrineSprite = staticTiles[7].spriteMap;
				ctx.drawImage(
					_spriteMap_tiles,
					shrineSprite.x,
					shrineSprite.y,
					128,
					128,
					x * newSize - karttaOffsetX,
					y * newSize - karttaOffsetY,
					newSize + 1,
					newSize + 1
				);
			}
			if (editingMap.messageMap[offsetMapAloitusY + y]?.[offsetMapAloitusX + x]) {
				const txt = editingMap.messageMap[offsetMapAloitusY + y][offsetMapAloitusX + x].id;
				textCtx.fillStyle = "white";
				textCtx.fillText(txt, x * newSize - karttaOffsetX + newSize / 2, y * newSize - karttaOffsetY);
				const message = document.querySelector(".messageTile");
				ctx.drawImage(message, x * newSize - karttaOffsetX, y * newSize - karttaOffsetY, newSize, newSize);
			}
			if (entranceImg) {
				ctx.drawImage(entranceImg, x * newSize - karttaOffsetX, y * newSize - karttaOffsetY, newSize, newSize);
			}
		}
	}

	piirraSelect({ x: select.x, y: select.y });

	canvas.onclick = painaCanvasta;
	canvas.onmousemove = painaCanvasta;
	function painaCanvasta({ offsetX, offsetY, buttons, type }) {
		const { width, height } = canvas.getBoundingClientRect(),
			venytysX = (width / canvas.width) * newSize,
			venytysY = (height / canvas.height) * newSize,
			venytysOffsetX = (width / canvas.width) * karttaOffsetX,
			venytysOffsetY = (height / canvas.height) * karttaOffsetY;

		const valittuX = Math.floor((offsetX + venytysOffsetX) / venytysX) + offsetMapAloitusX,
			valittuY = Math.floor((offsetY + venytysOffsetY) / venytysY) + offsetMapAloitusY;

		if (editingMap.vihuMap[valittuY]?.[valittuX]?.id != null) {
			const enemy = editingMap.vihuMap[valittuY]?.[valittuX];
			if (currentAggro.cords.x != enemy.cords.x || currentAggro.cords.y != enemy.cords.y) {
				calculateEnemyAggroArea(enemy);
			} else {
				if (!currentAggro.rendered) renderEnemyAggroArea();
			}
		} else {
			currentAggro.rendered = false;
			effectCanvas.width = effectCanvas.width;
		}

		if ((buttons == 1 && type !== "click") || type == "click") {
			if (editingMap.base?.[valittuY]?.[valittuX] === undefined) return;
			const nykyTieto = paintCtrlZArray({ x: valittuX, y: valittuY });
			if (nykyTieto && !onkoEdellinenCtrlZSama(nykyTieto)) lisaaCtrlZ(nykyTieto);

			select = { x: valittuX, y: valittuY };

			if (brush.tile !== null) editingMap.base[valittuY][valittuX] = tiles.findIndex((tile) => tile.name == brush.tile.name);
			if (brush.clutter !== null)
				editingMap.clutter[valittuY][valittuX] = clutters.findIndex((clutter) => clutter.name == brush.clutter.name);
			else if (enemySelect !== null) {
				if (!editingMap.vihuMap[valittuY]) editingMap.vihuMap[valittuY] = [];
				editingMap.vihuMap[valittuY][valittuX] = new Enemy({
					...enemies[enemySelect.id],
					cords: { x: valittuX, y: valittuY },
					spawnCords: { x: valittuX, y: valittuY },
					level: enemySpawnLevel,
				});
			} else if (chestSelect !== null) {
				if (!editingMap.chestMap[valittuY]) editingMap.chestMap[valittuY] = [];
				editingMap.chestMap[valittuY][valittuX] = new treasureChest({
					...chestTemplates[chestSelect.id],
					spawnMap: editingMap.id,
					cords: { x: valittuX, y: valittuY },
				});
			} else if (misc_brush !== null) {
				if (misc_brush == "shrine") {
					if (!editingMap.shrineMap[valittuY]) if (!editingMap.shrineMap?.[valittuY]) editingMap.shrineMap[valittuY] = [];
					editingMap.shrineMap[valittuY][valittuX] = {
						cords: { x: valittuX, y: valittuY },
					};
				} else if (misc_brush == "message") {
					if (!editingMap.messageMap[valittuY]) editingMap.messageMap[valittuY] = [];
					let message_id = prompt("Message ID");
					if (!message_id || message_id == "") {
						console.log("Cancelled");
					} else {
						editingMap.messageMap[valittuY][valittuX] = {
							id: message_id,
							cords: { x: valittuX, y: valittuY },
						};
					}
				} else if (misc_brush == "entrance") {
					if (!editingMap.entranceMap[valittuY]) editingMap.entranceMap[valittuY] = [];
					let entrance_id = prompt("Entrance ID");
					let entrance_to = prompt("Specify the id of the map this entrance leads to");
					let entrance_x = +prompt("Specify the x coordinate of where this entrance leads to");
					let entrance_y = +prompt("Specify the y coordinate of where this entrance leads to");
					let use_default = confirm("Use default entrance sprite?");
					let entrance_sprite = "entrance";
					if (!use_default) {
						entrance_sprite = prompt("Specify the entrance sprite to be used");
					}
					if (!entrance_id || entrance_id == "") {
						console.log("Cancelled");
					} else {
						editingMap.entranceMap[valittuY][valittuX] = {
							id: entrance_id,
							path: {
								to: entrance_to,
								cords: { x: entrance_x, y: entrance_y },
							},
							cords: { x: valittuX, y: valittuY },
							sprite: entrance_sprite,
						};
					}
				}
			} else if (editingMap.vihuMap?.[valittuY]?.[valittuX]?.id) {
				let vihu = editingMap.vihuMap[valittuY][valittuX];
				console.log("klikkasit vihua " + vihu.id);
				selectedEnemyCords = vihu.cords;
				editEnemyStats(vihu);
			} else if (editingMap.shrineMap?.[valittuY]?.[valittuX]) {
				console.log("pyhäkkö poistettu");
				delete editingMap.shrineMap[valittuY][valittuX];
			} else {
				selectedEnemyCords = null;
			}

			const uusiTieto = paintCtrlZArray({ x: valittuX, y: valittuY });
			if (uusiTieto && !onkoEdellinenCtrlZSama(uusiTieto)) lisaaCtrlZ(uusiTieto);

			drawOnMapsGrid({ x: valittuX, y: valittuY });
			mapProps();
		} else if (buttons == 2 && editingMap.base[valittuY]?.[valittuX] != null) {
			select.x2 = valittuX;
			select.y2 = valittuY;
		}

		piirraSelect({ x: valittuX, y: valittuY });

		if (buttons == 4 && type == "mousemove") {
			brush.tile = tiles[editingMap?.map?.[valittuY]?.[valittuX]] || null;
			brush.clutter = clutters[editingMap?.clutterMap?.[valittuY]?.[valittuX]] || null;
			mapProps();
		}
	}
}
canvas.addEventListener("contextmenu", (e) => {
	e.preventDefault();
	return false;
});
canvas.addEventListener("mousedown", mouseDownCanvas);
function mouseDownCanvas({ offsetX, offsetY, buttons }) {
	if (buttons !== 4 && buttons !== 2) return;
	const newSize = baseSize * zoomLevel;
	const karttaSpriteMaaraY = Math.ceil(canvas.height / newSize) + (1 - (Math.ceil(canvas.height / newSize) % 2)),
		karttaSpriteMaaraX = Math.ceil(canvas.width / newSize) + (1 - (Math.ceil(canvas.width / newSize) % 2));
	const karttaOffsetX = (karttaSpriteMaaraX * newSize - canvas.width) / 2,
		karttaOffsetY = (karttaSpriteMaaraY * newSize - canvas.height) / 2;
	const offsetMapAloitusY = cam.y - Math.floor(karttaSpriteMaaraY / 2),
		offsetMapAloitusX = cam.x - Math.floor(karttaSpriteMaaraX / 2);
	const { width, height } = canvas.getBoundingClientRect(),
		venytysX = (width / canvas.width) * newSize,
		venytysY = (height / canvas.height) * newSize,
		venytysOffsetX = (width / canvas.width) * karttaOffsetX,
		venytysOffsetY = (height / canvas.height) * karttaOffsetY;
	const valittuX = Math.floor((offsetX + venytysOffsetX) / venytysX) + offsetMapAloitusX,
		valittuY = Math.floor((offsetY + venytysOffsetY) / venytysY) + offsetMapAloitusY;

	if (buttons == 2 && editingMap.base[valittuY]?.[valittuX] != null) select = { x: valittuX, y: valittuY };
	else {
		brush.tile = tiles[editingMap?.map?.[valittuY]?.[valittuX]] || null;
		brush.clutter = clutters[editingMap?.clutterMap?.[valittuY]?.[valittuX]] || null;
		mapProps();
	}
}

function piirraSelect({ x, y }) {
	const newSize = baseSize * zoomLevel;
	const karttaSpriteMaaraY = Math.ceil(canvas.height / newSize) + (1 - (Math.ceil(canvas.height / newSize) % 2));
	const karttaSpriteMaaraX = Math.ceil(canvas.width / newSize) + (1 - (Math.ceil(canvas.width / newSize) % 2));
	const karttaOffsetX = (karttaSpriteMaaraX * newSize - canvas.width) / 2;
	const karttaOffsetY = (karttaSpriteMaaraY * newSize - canvas.height) / 2;
	const offsetMapAloitusY = cam.y - Math.floor(karttaSpriteMaaraY / 2);
	const offsetMapAloitusX = cam.x - Math.floor(karttaSpriteMaaraX / 2);

	selectCanvas.width = selectCanvas.width; // Nollaa canvaksen

	if (x !== select.x || y !== select.y) {
		selectCtx.strokeStyle = "white";
		selectCtx.lineWidth = 4;
		selectCtx.strokeRect(
			(x - offsetMapAloitusX) * newSize - karttaOffsetX,
			(y - offsetMapAloitusY) * newSize - karttaOffsetY,
			newSize,
			newSize
		);
		if (brush.tile?.spriteMap) {
			selectCtx.globalAlpha = 0.5;
			selectCtx.drawImage(
				_spriteMap_tiles,
				brush.tile?.spriteMap.x,
				brush.tile?.spriteMap.y,
				128,
				128,
				(x - offsetMapAloitusX) * newSize - karttaOffsetX,
				(y - offsetMapAloitusY) * newSize - karttaOffsetY,
				newSize,
				newSize
			);
			selectCtx.globalAlpha = 1;
		}
		if (brush.clutter?.spriteMap) {
			selectCtx.globalAlpha = 0.5;
			selectCtx.drawImage(
				_spriteMap_tiles,
				brush.clutter?.spriteMap.x,
				brush.clutter?.spriteMap.y,
				128,
				128,
				(x - offsetMapAloitusX) * newSize - karttaOffsetX,
				(y - offsetMapAloitusY) * newSize - karttaOffsetY,
				newSize,
				newSize
			);
			selectCtx.globalAlpha = 1;
		}
		if (enemySelect !== null) {
			selectCtx.globalAlpha = 0.5;
			const sprite = document.querySelector("." + enemies[enemySelect.id].sprite);
			selectCtx.drawImage(
				sprite,
				(x - offsetMapAloitusX) * newSize - karttaOffsetX,
				(y - offsetMapAloitusY) * newSize - karttaOffsetY,
				newSize,
				newSize
			);
			selectCtx.globalAlpha = 1;
		}
		if (chestSelect !== null) {
			selectCtx.globalAlpha = 0.5;
			const sprite = document.querySelector("." + chestTemplates[chestSelect.id].sprite);
			selectCtx.drawImage(
				sprite,
				(x - offsetMapAloitusX) * newSize - karttaOffsetX,
				(y - offsetMapAloitusY) * newSize - karttaOffsetY,
				newSize,
				newSize
			);
			selectCtx.globalAlpha = 1;
		}
	}

	if (select.x !== null || select.y !== null) {
		selectCtx.strokeStyle = "red";
		selectCtx.lineWidth = 4;
		if (select.x2 == null || select.y2 == null) {
			selectCtx.strokeRect(
				(select.x - offsetMapAloitusX) * newSize - karttaOffsetX,
				(select.y - offsetMapAloitusY) * newSize - karttaOffsetY,
				newSize,
				newSize
			);
		} else {
			const xSize = (Math.abs(select.x - select.x2) + 1) * newSize,
				ySize = (Math.abs(select.y - select.y2) + 1) * newSize;
			const pieniX = Math.min(select.x, select.x2),
				pieniY = Math.min(select.y, select.y2);
			selectCtx.strokeRect(
				(pieniX - offsetMapAloitusX) * newSize - karttaOffsetX,
				(pieniY - offsetMapAloitusY) * newSize - karttaOffsetY,
				xSize,
				ySize
			);
		}
	}
}

function drawOnMapsGrid({ x, y, x2 = x, y2 = y }) {
	const newSize = baseSize * zoomLevel;
	const karttaSpriteMaaraY = Math.ceil(canvas.height / newSize) + (1 - (Math.ceil(canvas.height / newSize) % 2));
	const karttaSpriteMaaraX = Math.ceil(canvas.width / newSize) + (1 - (Math.ceil(canvas.width / newSize) % 2));
	const karttaOffsetX = (karttaSpriteMaaraX * newSize - canvas.width) / 2;
	const karttaOffsetY = (karttaSpriteMaaraY * newSize - canvas.height) / 2;
	const offsetMapAloitusY = cam.y - Math.floor(karttaSpriteMaaraY / 2);
	const offsetMapAloitusX = cam.x - Math.floor(karttaSpriteMaaraX / 2);
	const yEro = Math.abs(y - y2) + y + 1 - offsetMapAloitusY;
	const xEro = Math.abs(x - x2) + x + 1 - offsetMapAloitusX;

	let test = 5 % 2;

	for (let aloitusY = y - offsetMapAloitusY; aloitusY < karttaSpriteMaaraY && aloitusY < yEro; aloitusY++) {
		for (let aloitusX = x - offsetMapAloitusX; aloitusX < karttaSpriteMaaraX && aloitusX < xEro; aloitusX++) {
			const imgId = editingMap.base[offsetMapAloitusY + aloitusY]?.[offsetMapAloitusX + aloitusX];
			const sprite = tiles[imgId]?.spriteMap ?? { x: 128, y: 0 };
			const clutterId = editingMap.clutter[offsetMapAloitusY + aloitusY]?.[offsetMapAloitusX + aloitusX];
			const clutterSprite = clutterId !== 0 ? clutters[clutterId]?.spriteMap : null;
			const enemyId = editingMap.vihuMap[offsetMapAloitusY + aloitusY]?.[offsetMapAloitusX + aloitusX]?.id;
			const chestSpriteId = editingMap.chestMap[offsetMapAloitusY + aloitusY]?.[offsetMapAloitusX + aloitusX]?.sprite;
			const enemyImg = enemyId != null ? document.querySelector("." + enemies[enemyId].sprite) : null;
			const chestImg = chestSpriteId != null ? document.querySelector("." + chestSpriteId) : null;

			if (sprite) {
				ctx.drawImage(
					_spriteMap_tiles,
					sprite.x,
					sprite.y,
					128,
					128,
					aloitusX * newSize - karttaOffsetX,
					aloitusY * newSize - karttaOffsetY,
					newSize + 1,
					newSize + 1
				);
			}
			if (clutterSprite) {
				ctx.drawImage(
					_spriteMap_tiles,
					clutterSprite.x,
					clutterSprite.y,
					128,
					128,
					aloitusX * newSize - karttaOffsetX,
					aloitusY * newSize - karttaOffsetY,
					newSize + 1,
					newSize + 1
				);
			}
			if (enemyImg) {
				ctx.drawImage(enemyImg, aloitusX * newSize - karttaOffsetX, aloitusY * newSize - karttaOffsetY, newSize, newSize);
			}
			if (chestImg) {
				ctx.drawImage(chestImg, aloitusX * newSize - karttaOffsetX, aloitusY * newSize - karttaOffsetY, newSize, newSize);
			}
			if (editingMap.shrineMap[offsetMapAloitusY + aloitusY]?.[offsetMapAloitusX + aloitusX]) {
				const shrineSprite = staticTiles[7].spriteMap;
				ctx.drawImage(
					_spriteMap_tiles,
					shrineSprite.x,
					shrineSprite.y,
					128,
					128,
					aloitusX * newSize - karttaOffsetX,
					aloitusY * newSize - karttaOffsetY,
					newSize + 1,
					newSize + 1
				);
			}
			if (editingMap.messageMap[offsetMapAloitusY + aloitusY]?.[offsetMapAloitusX + aloitusX]) {
				const message = document.querySelector(".messageTile");
				ctx.drawImage(message, aloitusX * newSize - karttaOffsetX, aloitusY * newSize - karttaOffsetY, newSize, newSize);
			}
		}
	}
}

window.addEventListener("keydown", hotkey);
function hotkey(e) {
	if (e.target.tagName == "INPUT") return;
	let kerroin = 1;
	if (e.shiftKey) kerroin = 10;
	if (e.altKey) kerroin = 25;
	if (e.ctrlKey) kerroin = 50;

	if (e.code == "KeyD") cam.x += 1 * kerroin;
	else if (e.code == "KeyA") cam.x -= 1 * kerroin;
	else if (e.code == "KeyW") cam.y -= 1 * kerroin;
	else if (e.code == "KeyS") cam.y += 1 * kerroin;

	if (e.key == "Delete") {
		if (editingMap.chestMap?.[select.y]?.[select.x]?.id) {
			delete editingMap.chestMap[select.y][select.x];
		}
		if (editingMap.vihuMap?.[select.y]?.[select.x]?.id) {
			delete editingMap.vihuMap[select.y][select.x];
		}
		editingMap.vihuMap?.map((y) =>
			y.map((x) => {
				if (x.cords.y >= select.y && x.cords.x >= select.x && x.cords.y <= select.y2 && x.cords.x <= select.x2) {
					console.log("?");
					delete editingMap.vihuMap[x.cords.y][x.cords.x];
				}
			})
		);
		createMap();
	}

	const wasd = [65, 83, 87, 68];
	if (wasd.indexOf(e.keyCode) !== -1) {
		e.preventDefault();
		createMap();
	}

	// if(e.code == "Space" && enemySelect != null) {
	//   editEnemyStats();
	// }
}

function showTileInfo() {
	let tile = tiles[editingMap.base[select.y][select.x]];
	document.querySelector("#tileProperties").textContent = "";
	for (let property in tile) {
		let text = document.createElement("p");
		text.textContent = property + ": " + tile[property];
		document.querySelector("#tileProperties").appendChild(text);
	}
}

function printMap() {
	let mapArray = `[\n`;
	editingMap.base.forEach((rivi) => {
		mapArray += "\t\t" + JSON.stringify(rivi) + ", \n";
	});
	mapArray += "\t]";

	let clutterArray = `[\n`;
	editingMap.clutter.forEach((rivi) => {
		clutterArray += "\t\t" + JSON.stringify(rivi) + ", \n";
	});
	clutterArray += "\t]";

	let vihutArray = `[\n`;
	editingMap.vihuMap?.forEach((rivi, y) => {
		rivi.forEach((vihu, x) => {
			let text = `cords: { x: ${x}, y: ${y} }, spawnCords: { x: ${x}, y: ${y} }, level: ${vihu.level}, isUnique: ${vihu.isUnique}, spawnMap: "${editingMap.id}" `;
			vihutArray += "\t\t" + `new Enemy({...enemies["${vihu.id}"], ${text}})` + ", \n";
		});
	});
	vihutArray += "\t]";
	let arkutArray = `[\n`;
	editingMap.chestMap?.forEach((rivi, y) => {
		rivi.forEach((arkku, x) => {
			let text = `cords: { x: ${x}, y: ${y} }`;
			arkutArray += "\t\t" + `new treasureChest({...chestTemplates["${arkku.id}"], ${text}})` + ", \n";
		});
	});
	arkutArray += "\t]";
	let viestitArray = `[\n`;
	editingMap.messageMap?.forEach((rivi, y) => {
		rivi.forEach((msg, x) => {
			let text = `cords: { x: ${x}, y: ${y} }`;
			viestitArray += "\t\t" + `{id: "${msg.id}", ${text}}` + ", \n";
		});
	});
	viestitArray += "\t]";
	let pyhäkötArray = `[\n`;
	editingMap.shrineMap?.forEach((rivi, y) => {
		rivi.forEach((arkku, x) => {
			let text = `cords: { x: ${x}, y: ${y} }`;
			pyhäkötArray += "\t\t" + `{${text}}` + ", \n";
		});
	});
	pyhäkötArray += "\t]";
	let reititArray = `[\n`;
	editingMap.entranceMap?.forEach((rivi, y) => {
		rivi.forEach((reitti, x) => {
			let text = `cords: { x: ${x}, y: ${y} }, sprite: "entrance"`;
			reititArray +=
				"\t\t" +
				`{id: "${reitti.id}", path: {to: "${reitti.path.to}", cords: {x: ${reitti.path.cords.x}, y: ${reitti.path.cords.y}}}, ${text}}` +
				", \n";
		});
	});
	reititArray += "\t]";
	let editingMapText = `{
    \tname: "${editingMap.name}",
    \tarea: "${editingMap.area}",
    \tid: "${editingMap.id}",
    \tbase: ${mapArray},
    \tclutter: ${clutterArray},
    \tenemies: ${vihutArray},
    \ttreasureChests: ${arkutArray},
    \tmessages: ${viestitArray},
    \tshrines: ${pyhäkötArray},
    \tentrances: ${reititArray}
    },`;
	let totalText = "";
	let addMap = true;
	maps.forEach((map) => {
		if (map.id == editingMap.id) {
			totalText += editingMapText;
			addMap = false;
		} else {
			let _mapArray = `[\n`;
			map.base.forEach((rivi) => {
				_mapArray += "\t\t" + JSON.stringify(rivi) + ", \n";
			});
			_mapArray += "\t]";

			let _clutterArray = `[\n`;
			map.clutter.forEach((rivi) => {
				_clutterArray += "\t\t" + JSON.stringify(rivi) + ", \n";
			});
			_clutterArray += "\t]";
			let enArray = `[\n`;
			map.enemies?.forEach((enemy) => {
				let text = `cords: { x: ${enemy.cords.x}, y: ${enemy.cords.y} }, spawnCords: { x: ${enemy.spawnCords.x}, y: ${enemy.spawnCords.y} }, level: ${enemy.level}, isUnique: ${enemy.isUnique}, spawnMap: "${map.id}" `;
				enArray += "\t\t" + `new Enemy({...enemies["${enemy.id}"], ${text}})` + ", \n";
			});
			enArray += "\t]";
			let chestArray = `[\n`;
			map.treasureChests?.forEach((chest) => {
				let text = `cords: { x: ${chest.cords.x}, y: ${chest.cords.y} }`;
				chestArray += "\t\t" + `new treasureChest({...chestTemplates["${chest.id}"], ${text}})` + ", \n";
			});
			chestArray += "\t]";
			let messageArray = `[\n`;
			map.messages?.forEach((message) => {
				let text = `cords: { x: ${message.cords.x}, y: ${message.cords.y} }`;
				messageArray += "\t\t" + `{id: "${message.id}", ${text}}` + ", \n";
			});
			messageArray += "\t]";
			let shrineArray = `[\n`;
			map.shrines?.forEach((shrine) => {
				let text = `cords: { x: ${shrine.cords.x}, y: ${shrine.cords.y} }`;
				shrineArray += "\t\t" + `{${text}}` + ", \n";
			});
			shrineArray += "\t]";
			let entranceArray = `[\n`;
			map.entrances?.forEach((entrance) => {
				let text = `cords: { x: ${entrance.cords.x}, y: ${entrance.cords.y} }, sprite: "entrance"`;
				entranceArray +=
					"\t\t" +
					`{id: "${entrance.id}", path: {to: "${entrance.path.to}", cords: {x: ${entrance.path.cords.x}, y: ${entrance.path.cords.y}}}, ${text}}` +
					", \n";
			});
			entranceArray += "\t]";
			totalText += `{
        \tname: "${map.name}",
        \tarea: "${map.area}",
        \tid: "${map.id}",
        \tbase: ${_mapArray},
        \tclutter: ${_clutterArray},
        \tenemies: ${enArray},
        \ttreasureChests: ${chestArray},
        \tmessages: ${messageArray},
        \tshrines: ${shrineArray},
        \tentrances: ${entranceArray}
      },`;
		}
	});
	if (addMap) totalText += editingMapText;
	console.log("const maps = [\n" + totalText + "\n] as any;");
}
const importScreen = document.querySelector(".importMapBox");
const importContainer = importScreen.querySelector(".importContainer");
function importMap() {
	importScreen.style.display = "block";
	createImportableMaps();
}

function createImportableMaps() {
	importContainer.innerHTML = "";
	Object.values(maps).forEach((map) => {
		const importDiv = document.createElement("div");
		const importCanvas = document.createElement("canvas");
		const importName = document.createElement("p");
		const importArea = document.createElement("p");
		const importId = document.createElement("p");
		importCanvas.width = "220";
		importCanvas.height = "130";
		importName.textContent = `Name: ${map.name}`;
		importArea.textContent = `Area: ${map.area}`;
		importId.textContent = `Id: ${map.id}`;
		importDiv.onclick = (e) => importThisMap(map.id);
		importDiv.append(importCanvas, importName, importArea, importId);
		importContainer.append(importDiv);
		createSmallMap(importCanvas, map);
	});
}

function importThisMap(id) {
	importScreen.style.display = "none";
	editingMap = { ...maps[id] };
	editingMap.vihuMap = [];
	editingMap.chestMap = [];
	editingMap.shrineMap = [];
	editingMap.messageMap = [];
	editingMap.entranceMap = [];
	editingMap.enemies.forEach(({ ...vihu }) => {
		let y = vihu.cords.y;
		let x = vihu.cords.x;
		if (!editingMap.vihuMap[y]) editingMap.vihuMap[y] = [];
		editingMap.vihuMap[y][x] = vihu;
	});
	editingMap.treasureChests.forEach(({ ...chest }) => {
		let y = chest.cords.y;
		let x = chest.cords.x;
		if (!editingMap.chestMap[y]) editingMap.chestMap[y] = [];
		editingMap.chestMap[y][x] = chest;
	});
	editingMap.shrines.forEach(({ ...shrine }) => {
		let y = shrine.cords.y;
		let x = shrine.cords.x;
		if (!editingMap.shrineMap[y]) editingMap.shrineMap[y] = [];
		editingMap.shrineMap[y][x] = shrine;
	});
	editingMap.messages.forEach(({ ...msg }) => {
		let y = msg.cords.y;
		let x = msg.cords.x;
		if (!editingMap.messageMap[y]) editingMap.messageMap[y] = [];
		editingMap.messageMap[y][x] = msg;
	});
	editingMap.entrances?.forEach(({ ...entrance }) => {
		let y = entrance.cords.y;
		let x = entrance.cords.x;
		console.log(editingMap);
		if (!editingMap.entranceMap[y]) editingMap.entranceMap[y] = [];
		editingMap.entranceMap[y][x] = entrance;
	});
	cam.x = Math.ceil(editingMap.base[0].length / 2);
	cam.y = Math.ceil(editingMap.base.length / 2);
	createMap();
	ctrlZArray = [];
	ctrlZIndex = -1;
}

function createSmallMap(canvas, map) {
	const smallCtx = canvas.getContext("2d");
	const newSize = 2;
	const karttaSpriteMaaraY = Math.ceil(canvas.height / newSize) + (1 - (Math.ceil(canvas.height / newSize) % 2));
	const karttaSpriteMaaraX = Math.ceil(canvas.width / newSize) + (1 - (Math.ceil(canvas.width / newSize) % 2));
	const karttaOffsetX = (karttaSpriteMaaraX * newSize - canvas.width) / 2;
	const karttaOffsetY = (karttaSpriteMaaraY * newSize - canvas.height) / 2;
	const offsetMapAloitusY = Math.floor(map.base.length / 2 - Math.floor(karttaSpriteMaaraY / 2));
	const offsetMapAloitusX = Math.floor(map.base[0].length / 2 - Math.floor(karttaSpriteMaaraX / 2));
	canvas.width = canvas.width; // Reset canvas
	for (let y = 0; y < karttaSpriteMaaraY; y++) {
		for (let x = 0; x < karttaSpriteMaaraX; x++) {
			const imgId = map.base[offsetMapAloitusY + y]?.[offsetMapAloitusX + x];
			const sprite = tiles[imgId]?.spriteMap ?? { x: 128, y: 0 };
			const clutterId = map.clutter[offsetMapAloitusY + y]?.[offsetMapAloitusX + x];
			const clutterSprite = clutters[clutterId]?.spriteMap;
			if (sprite) {
				smallCtx.drawImage(
					_spriteMap_tiles,
					sprite.x,
					sprite.y,
					128,
					128,
					x * newSize - karttaOffsetX,
					y * newSize - karttaOffsetY,
					newSize + 1,
					newSize + 1
				);
				//ctx.drawImage(img, x * newSize - karttaOffsetX, y * newSize - karttaOffsetY, newSize, newSize);
			}
			if (clutterSprite) {
				smallCtx.drawImage(
					_spriteMap_tiles,
					clutterSprite.x,
					clutterSprite.y,
					128,
					128,
					x * newSize - karttaOffsetX,
					y * newSize - karttaOffsetY,
					newSize + 1,
					newSize + 1
				);
				//ctx.drawImage(clutterImg, x * newSize - karttaOffsetX, y * newSize - karttaOffsetY, newSize, newSize);
			}
		}
	}
}

function dontImportMap() {
	importScreen.style.display = "none";
}

const newMapDiv = document.querySelector(".createNewMap");
const mapName = newMapDiv.querySelector(".mapName");
const mapArea = newMapDiv.querySelector(".mapArea");
const mapId = newMapDiv.querySelector(".mapId");
const mapTile = newMapDiv.querySelector(".baseTile");
const mapWidth = newMapDiv.querySelector(".width");
const mapHeight = newMapDiv.querySelector(".height");
function createNewMap() {
	newMapDiv.style.display = "grid";
	mapName.value = "New Map";
	mapArea.value = "New Area";
	mapId.value = "new_map";
	mapTile.innerHTML = "";
	mapWidth.value = 50;
	mapHeight.value = 50;
	tiles.forEach((tile) => {
		const tileOption = document.createElement("option");
		tileOption.value = tile.id;
		tileOption.textContent = tile.name;
		mapTile.append(tileOption);
	});
}

function confirmMapCreate() {
	newMapDiv.style.display = "none";
	let height = parseInt(mapHeight.value);
	let width = parseInt(mapWidth.value);
	editingMap = {};
	editingMap.name = mapName.value;
	editingMap.area = mapArea.value;
	editingMap.id = mapId.value;
	editingMap.base = new Array(height).fill("0").map((e) => new Array(width).fill(mapTile.value));
	editingMap.clutter = new Array(height).fill("0").map((e) => new Array(width).fill(0));
	editingMap.voidTexture = 0;
	editingMap.chestMap = [];
	editingMap.vihuMap = [];
	editingMap.messageMap = [];
	editingMap.shrineMap = [];
	editingMap.entranceMap = [];

	cam.x = Math.ceil(width / 2);
	cam.y = Math.ceil(height / 2);

	createMap();
	ctrlZArray = [];
	ctrlZIndex = -1;
}

function cancelMapCreate() {
	newMapDiv.style.display = "none";
}

canvas.addEventListener("wheel", changeZoomLevel);
function changeZoomLevel({ deltaY }) {
	const zoomLevels = [0.1, 0.2, 0.4, 0.75, 1, 1.3, 1.75, 2];
	if (deltaY > 0) {
		zoomLevel = zoomLevels[zoomLevels.indexOf(zoomLevel) - 1] || zoomLevels[0];
	} else {
		zoomLevel = zoomLevels[zoomLevels.indexOf(zoomLevel) + 1] || zoomLevels[zoomLevels.length - 1];
	}

	createMap();
}

function mapProps() {
	document.querySelector("#tileProperties").textContent = "";
	let pos = editingMap.base[select.y]?.[select.x];
	let clu = editingMap.clutter[select.y]?.[select.x];
	let text = document.createElement("pre");
	text.textContent = `
    CamX: ${cam.x}
    CamY: ${cam.y}

    MapWidth: ${editingMap.base[0].length}
    MapHeight: ${editingMap.base.length}
    MapArea: ${editingMap.base.length * editingMap.base[0].length + " tiles"}
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
    EnemySelect: ${enemySelect !== null ? enemySelect.id : "not selected"}
    ChestSelect: ${chestSelect !== null ? chestSelect.id : "not selected"}
    MiscBrush: ${misc_brush !== null ? misc_brush : "not selected"}
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
		let taulu = [[{ nimi: "Tile name", tyyli: "string" }, { nimi: "isWall" }, { nimi: "isLedge" }, { nimi: "img" }]];
		tiles.forEach(({ name, isLedge, isWall, img, sprite }) => {
			let rivi = { data: [name, isWall, isLedge, { text: " ", img: img }] };
			taulu.push(rivi);
		});

		return taulu;
	}

	document.querySelector("#tilesContainer").style.display = "block";
	lisaaSpreadSheet(document.querySelector("#tilesContainer"), luoTaulu(), false, "tile");
}

function updateClutterMenu() {
	function luoTaulu() {
		let taulu = [[{ nimi: "Clutter", tyyli: "string" }, { nimi: "isWall" }, { nimi: "img" }]];
		clutters.forEach(({ name, isWall, img }) => {
			let rivi = { data: [name, isWall, { text: " ", img: img }] };
			taulu.push(rivi);
		});

		return taulu;
	}

	document.querySelector("#tilesContainer").style.display = "block";
	lisaaSpreadSheet(document.querySelector("#tilesContainer"), luoTaulu(), false, "clutter");
}

// const chestTemplates = {
//   defaultChest: {
//     id: "defaultChest",
//     cords: { x: 0, y: 0 },
//     map: 0,
//     sprite: "treasureChest1",
//     isUnique: false,
//     respawnTime: 750,
//     lootPool: "default",
//     itemsGenerate: [1, 7],
//     sinceOpened: -1
//   },

function updateChestMenu() {
	function luoTaulu() {
		let taulu = [
			[
				{ nimi: "Chest", tyyli: "string" },
				{ nimi: "lootPool" },
				{ nimi: "isUnique" },
				{ nimi: "respawnTime" },
				{ nimi: "itemsGenerate" },
				{ nimi: "img" },
			],
		];
		for (let chest in chestTemplates) {
			let data = chestTemplates[chest];
			let rivi = {
				data: [chest, data.lootPool, data.isUnique, data.respawnTime, data.itemsGenerate, { text: " ", img: data.img }],
			};
			taulu.push(rivi);
		}
		return taulu;
	}

	document.querySelector("#tilesContainer").style.display = "block";
	lisaaSpreadSheet(document.querySelector("#tilesContainer"), luoTaulu(), false, "chest");
}

function updateEnemiesMenu() {
	function luoTaulu() {
		let taulu = [
			[
				{ nimi: "id", tyyli: "string" },
				{ nimi: "STR" },
				{ nimi: "DEX" },
				{ nimi: "VIT" },
				{ nimi: "INT" },
				{ nimi: "CUN" },
				{ nimi: "HP" },
				{ nimi: "MP" },
				{ nimi: "img" },
			],
		];
		for (let enemy in enemies) {
			const foe = new Enemy(enemies[enemy]);
			const str = foe.stats.str;
			const dex = foe.stats.dex;
			const vit = foe.stats.vit;
			const int = foe.stats.int;
			const cun = foe.stats.cun;
			const hp = foe.stats.hp;
			const mp = foe.stats.mp;
			let rivi = {
				data: [foe.id, str, dex, vit, int, cun, hp, mp, { text: " ", img: foe.img }],
			};
			taulu.push(rivi);
		}

		return taulu;
	}

	document.querySelector("#tilesContainer").style.display = "block";
	lisaaSpreadSheet(document.querySelector("#tilesContainer"), luoTaulu(), false, "enemy");
}

function selectEnemy(id) {
	enemySelect = { id };
	chestSelect = null;
	brush.tile = null;
	brush.clutter = null;
	// editEnemyStats(new Enemy(enemies[id]));
	mapProps();
}

function selectChest(id) {
	chestSelect = { id };
	enemySelect = null;
	brush.tile = null;
	brush.clutter = null;
	mapProps();
}

function selectTile(id) {
	lisaaCtrlZ({ event: "brush", run: copy(brush) });
	brush.tile = copy(tiles.find((tile) => tile.name == id));
	let index = tiles.findIndex((tile) => tile.name == id);
	lisaaCtrlZ({ event: "brush", run: copy(brush) });
	if (select.x2 != null && select.y2 != null) {
		lisaaCtrlZ({ event: "tileMap", run: { map: copy(editingMap.base) } });
		const minY = Math.min(select.y, select.y2),
			minX = Math.min(select.x, select.x2);
		const maxY = Math.max(select.y, select.y2),
			maxX = Math.max(select.x, select.x2);
		for (let y = minY; y <= maxY; y++) {
			for (let x = minX; x <= maxX; x++) {
				editingMap.base[y][x] = index;
			}
		}
		drawOnMapsGrid({ x: minX, y: minY, x2: maxX, y2: maxY });
		lisaaCtrlZ({ event: "tileMap", run: { map: copy(editingMap.base) } });
	}
	mapProps();
}

function selectClutter(id) {
	lisaaCtrlZ({ event: "brush", run: copy(brush) });
	brush.clutter = copy(clutters.find((c) => c.name == id));
	lisaaCtrlZ({ event: "brush", run: copy(brush) });

	if (select.x2 != null && select.y2 != null) {
		lisaaCtrlZ({ event: "clutterMap", run: { map: copy(editingMap.clutter) } });
		const minY = Math.min(select.y, select.y2),
			minX = Math.min(select.x, select.x2);
		const maxY = Math.max(select.y, select.y2),
			maxX = Math.max(select.x, select.x2);
		for (let y = minY; y <= maxY; y++) {
			for (let x = minX; x <= maxX; x++) {
				editingMap.clutter[y][x] = id;
			}
		}
		drawOnMapsGrid({ x: minX, y: minY, x2: maxX, y2: maxY });
		lisaaCtrlZ({ event: "clutterMap", run: { map: copy(editingMap.clutter) } });
	}
	mapProps();
}

function clearTileSelect() {
	document.querySelector("#tilesContainer").style.display = null;
	lisaaCtrlZ({ event: "brush", run: copy(brush) });
	brush.tile = null;
	lisaaCtrlZ({ event: "brush", run: copy(brush) });
	mapProps();
}

function clearClutterSelect() {
	document.querySelector("#tilesContainer").style.display = null;
	lisaaCtrlZ({ event: "brush", run: copy(brush) });
	brush.clutter = null;
	lisaaCtrlZ({ event: "brush", run: copy(brush) });
	mapProps();
}

function clearEnemySelect() {
	document.querySelector("#tilesContainer").style.display = null;
	lisaaCtrlZ({ event: "enemy", run: copy(enemySelect) });
	enemySelect = null;
	lisaaCtrlZ({ event: "enemy", run: copy(enemySelect) });
	mapProps();
}

function clearChestSelect() {
	document.querySelector("#tilesContainer").style.display = null;
	lisaaCtrlZ({ event: "chest", run: copy(chestSelect) });
	chestSelect = null;
	lisaaCtrlZ({ event: "chest", run: copy(chestSelect) });
	mapProps();
}

window.addEventListener("keydown", ctrlZHotkey);
function ctrlZHotkey({ ctrlKey, shiftKey, code }) {
	if ((code !== "KeyZ" && code !== "KeyY") || !ctrlKey) return;
	if (ctrlZArray.length == 0) return;

	for (let i = 0; i < 10; i++) {
		if (code == "KeyZ" && ctrlZIndex > -1) ctrlZIndex--;
		if (code == "KeyY" && ctrlZArray.length - 1 > ctrlZIndex) ctrlZIndex++;

		if (ctrlZIndex == -1) return;
		const valittu = ctrlZArray[ctrlZIndex];

		if (valittu.event == "paint") {
			editingMap.base[valittu.run.y][valittu.run.x] = valittu.run.tile;
			editingMap.clutter[valittu.run.y][valittu.run.x] = valittu.run.clutter;
			drawOnMapsGrid({ x: valittu.run.x, y: valittu.run.y });
		} else if (valittu.event == "brush") {
			brush = valittu.run;
			mapProps();
		} else if (valittu.event == "tileMap") {
			editingMap.base = copy(valittu.run.map);
			createMap();
		} else if (valittu.event == "clutterMap") {
			editingMap.clutter = copy(valittu.run.map);
			createMap();
		}

		if (!shiftKey) return;
	}
}

function onkoEdellinenCtrlZSama({ event, run }) {
	const nyky = ctrlZArray[ctrlZIndex] || {};
	const { x, y, tile, clutter } = nyky.run || {};
	if (event == nyky.event && x == run.x && y == run.y && tile == run.tile && clutter == run.clutter) return true;
	return false;
}

function paintCtrlZArray({ x, y }) {
	const tileMap = editingMap.base,
		clutterMap = editingMap.clutter;

	if (tileMap?.[y]?.[x] === undefined) return false;
	return {
		event: "paint",
		run: { x, y, tile: tileMap[y][x], clutter: clutterMap[y][x] },
	};
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

let levelSet = 0;
let uniqueSet = false;
function editEnemyStats(vihollinen) {
	const pohja = document.querySelector(".enemyInfoBox .valintaPohja");
	document.querySelector(".enemyInfoContainer").style.display = "block";
	levelSet = vihollinen.level;
	uniqueSet = vihollinen.isUnique;

	pohja.innerHTML = "";

	if (vihollinen.id) {
		const soluBox = document.createElement("div");
		soluBox.classList.add("solu");
		const nameInput = document.createElement("input");
		nameInput.value = vihollinen.id;
		const nameText = document.createElement("p");
		nameText.textContent = "Id";
		nameInput.setAttribute("readOnly", true);
		soluBox.appendChild(nameText);
		soluBox.appendChild(nameInput);
		pohja.appendChild(soluBox);
	}
	if (vihollinen.stats) {
		const level = vihollinen.level;
		const isUnique = vihollinen.isUnique;
		newBlock({
			values: level,
			value: vihollinen.level,
			text: "Level",
			boolean: false,
		});
		newBlock({
			values: isUnique,
			value: vihollinen.isUnique,
			text: "Unique",
			boolean: true,
		});
	}

	function newBlock({ values, value, text, boolean, score = value }) {
		const soluBox = document.createElement("div");
		soluBox.classList.add("solu");
		const titleText = document.createElement("p");
		titleText.textContent = text;
		const scoreText = document.createElement("p");
		scoreText.textContent = score;

		const input = document.createElement("input");
		input.addEventListener("input", ({ target }) => {
			if (!boolean) {
				scoreText.textContent = target.value;
				levelSet = target.value;
			} else {
				scoreText.textContent = target.checked;
				uniqueSet = target.checked;
			}
		});
		input.value = value;
		if (boolean) input.type = "checkbox";
		else {
			input.type = "range";
		}
		soluBox.appendChild(titleText);
		soluBox.appendChild(scoreText);
		soluBox.appendChild(input);
		pohja.appendChild(soluBox);
	}
}

function enemyStatsConfirm() {
	let enemy = editingMap.vihuMap[selectedEnemyCords.y][selectedEnemyCords.x];
	enemy.level = levelSet;
	enemy.isUnique = uniqueSet;
	selectedEnemyCords = null;
	document.querySelector(".enemyInfoContainer").style.display = "none";
	createMap();
}

function enemyDelete() {
	editingMap.vihuMap[selectedEnemyCords.y][selectedEnemyCords.x] = null;
	selectedEnemyCords = null;
	document.querySelector(".enemyInfoContainer").style.display = "none";
	createMap();
}

function testaaKopio() {
	let vihu1 = new Enemy({ ...enemies["mugger"], x: 29, y: 32 });
	let vihu2 = new Enemy({
		...enemies["mugger"],
		x: 3,
		y: 2,
		stats: { armor: 4 },
	});

	console.log(vihu1);
	console.log(vihu2);
}

function addShrine() {
	misc_brush = "shrine";
	mapProps();
}

function addMessage() {
	misc_brush = "message";
	mapProps();
}

function addEntrance() {
	misc_brush = "entrance";
	mapProps();
}

function clearMiscBrush() {
	misc_brush = null;
	mapProps();
}

function saveMapToMemory() {
	let saveMap = { ...editingMap };
	const enemyArray = [];
	const chestArray = [];
	const shrineArray = [];
	const messageArray = [];
	const entranceArray = [];
	saveMap.vihuMap.map((_en) =>
		_en.map((en) => {
			if (en == null) return;
			let enemy = { ...en };
			en = {};
			en.id = enemy.id;
			en.cords = enemy.cords;
			en.spawnCords = enemy.spawnCords;
			en.level = enemy.level;
			en.isUnique = enemy.isUnique;
			enemyArray.push(en);
		})
	);
	saveMap.chestMap.map((_chest) =>
		_chest.map((chest) => {
			let _chest = { ...chest };
			chest = {};
			chest.id = _chest.id;
			chest.cords = _chest.cords;
			chestArray.push(chest);
		})
	);
	saveMap.shrineMap.map((_shrine) =>
		_shrine.map((shrine) => {
			let _shrine = { ...shrine };
			shrine = {};
			shrine.cords = _shrine.cords;
			shrineArray.push(shrine);
		})
	);
	saveMap.messageMap.map((_message) =>
		_message.map((message) => {
			let _message = { ...message };
			message = {};
			message.id = _message.id;
			message.cords = _message.cords;
			messageArray.push(message);
		})
	);
	saveMap.entranceMap.map((_entrance) =>
		_entrance.map((entrance) => {
			let _entrance = { ...entrance };
			entrance = {};
			entrance.id = _entrance.id;
			entrance.sprite = _entrance.sprite;
			entrance.path = _entrance.path;
			entrance.cords = _entrance.cords;
			entranceArray.push(entrance);
		})
	);
	saveMap.vihuMap = null;
	saveMap.chestMap = null;
	saveMap.messageMap = null;
	saveMap.shrineMap = null;
	saveMap.entranceMap = null;
	saveMap.enemies = enemyArray;
	saveMap.treasureChests = chestArray;
	saveMap.shrines = shrineArray;
	saveMap.messages = messageArray;
	saveMap.entrances = entranceArray;
	localStorage.setItem("DOT_editor_current_map", JSON.stringify(saveMap));
}

function loadMapFromMemory() {
	let loadedMap = JSON.parse(localStorage.getItem("DOT_editor_current_map"));
	if (!loadedMap) return;
	console.log(loadedMap);
	loadedMap.enemies = loadedMap.enemies.map((en) => {
		if (!en.id) return;
		return new Enemy({
			...enemies[en.id],
			cords: en.cords,
			spawnCords: en.spawnCords,
			level: en.level,
			isUnique: en.isUnique,
		});
	});
	loadedMap.treasureChests = loadedMap.treasureChests.map((chest) => {
		return new treasureChest({
			...chestTemplates[chest.id],
			cords: chest.cords,
		});
	});
	editingMap = { ...loadedMap };
	editingMap.vihuMap = [];
	editingMap.chestMap = [];
	editingMap.shrineMap = [];
	editingMap.messageMap = [];
	editingMap.entranceMap = [];
	editingMap?.enemies?.forEach(({ ...vihu }) => {
		let y = vihu.cords.y;
		let x = vihu.cords.x;
		if (!editingMap.vihuMap[y]) editingMap.vihuMap[y] = [];
		editingMap.vihuMap[y][x] = vihu;
	});
	editingMap?.treasureChests?.forEach(({ ...chest }) => {
		let y = chest.cords.y;
		let x = chest.cords.x;
		if (!editingMap.chestMap[y]) editingMap.chestMap[y] = [];
		editingMap.chestMap[y][x] = chest;
	});
	editingMap?.shrines?.forEach(({ ...shrine }) => {
		let y = shrine.cords.y;
		let x = shrine.cords.x;
		if (!editingMap.shrineMap[y]) editingMap.shrineMap[y] = [];
		editingMap.shrineMap[y][x] = shrine;
	});
	editingMap?.messages?.forEach(({ ...msg }) => {
		let y = msg.cords.y;
		let x = msg.cords.x;
		if (!editingMap.messageMap[y]) editingMap.messageMap[y] = [];
		editingMap.messageMap[y][x] = msg;
	});
	editingMap?.entrances?.forEach(({ ...entrance }) => {
		let y = entrance.cords.y;
		let x = entrance.cords.x;
		if (!editingMap.entranceMap[y]) editingMap.entranceMap[y] = [];
		editingMap.entranceMap[y][x] = entrance;
	});
	cam.x = Math.ceil(editingMap.base[0].length / 2);
	cam.y = Math.ceil(editingMap.base.length / 2);
	createMap();
	ctrlZArray = [];
	ctrlZIndex = -1;
}
const currentAggro = {
	map: [],
	cords: { x: -1, y: -1 },
	rendered: false,
};
function calculateEnemyAggroArea(enemy) {
	let aggroArea = new Array(editingMap.base.length).fill(0).map(() => new Array(editingMap.base[0].length).fill(0));
	let aggroLength = Math.ceil(enemy.aggroRange * 0.5);
	let cords = enemy.cords;
	const newSize = baseSize * zoomLevel;
	const karttaSpriteMaaraY = Math.ceil(canvas.height / newSize) + (1 - (Math.ceil(canvas.height / newSize) % 2));
	const karttaSpriteMaaraX = Math.ceil(canvas.width / newSize) + (1 - (Math.ceil(canvas.width / newSize) % 2));
	for (let y = enemy.cords.y - aggroLength; y < enemy.cords.y + aggroLength; y++) {
		for (let x = enemy.cords.x - aggroLength; x < enemy.cords.x + aggroLength; x++) {
			if (y > aggroArea.length - 1 || y < 0) {
				continue;
			}
			if (x > aggroArea[0].length - 1 || x < 0) {
				continue;
			}
			aggroArea[y][x] = "x";
		}
	}
	currentAggro.map = aggroArea;
	currentAggro.cords = cords;
	currentAggro.rendered = false;
	renderEnemyAggroArea();
	return aggroArea;
}

function renderEnemyAggroArea() {
	let aggroArea = currentAggro.map;
	const newSize = baseSize * zoomLevel;
	const karttaSpriteMaaraY = Math.ceil(canvas.height / newSize) + (1 - (Math.ceil(canvas.height / newSize) % 2));
	const karttaSpriteMaaraX = Math.ceil(canvas.width / newSize) + (1 - (Math.ceil(canvas.width / newSize) % 2));
	const karttaOffsetX = (karttaSpriteMaaraX * newSize - canvas.width) / 2;
	const karttaOffsetY = (karttaSpriteMaaraY * newSize - canvas.height) / 2;
	const offsetMapAloitusY = cam.y - Math.floor(karttaSpriteMaaraY / 2);
	const offsetMapAloitusX = cam.x - Math.floor(karttaSpriteMaaraX / 2);
	effectCanvas.width = effectCanvas.width; // Reset canvas
	for (let y = 0; y < karttaSpriteMaaraY; y++) {
		for (let x = 0; x < karttaSpriteMaaraX; x++) {
			let mapY = y + offsetMapAloitusY;
			let mapX = x + offsetMapAloitusX;
			if (mapY > aggroArea.length - 1 || mapY < 0 || mapX > aggroArea[0].length - 1 || mapX < 0) {
				continue;
			}
			if (aggroArea[mapY][mapX] === "x") {
				effectCtx.fillStyle = "rgba(255,0,0,0.5)";
				effectCtx.fillRect(x * newSize - karttaOffsetX, y * newSize - karttaOffsetY, newSize, newSize);
			}
		}
	}
	currentAggro.rendered = true;
}

loadMapFromMemory();
