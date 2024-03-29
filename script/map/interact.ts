const areaTitle = document.querySelector<HTMLDivElement>(".area-name");
const areaTitleText = areaTitle.querySelector<HTMLTitleElement>(".title");
const loadingScreen = document.querySelector<HTMLDivElement>(".loading");
const loadingText = loadingScreen.querySelector<HTMLTitleElement>(".loading-text");
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
	if (!foundPrompt) {
		maps[currentMap].entrances?.some((entrance: entrance) => {
			if (entrance.cords.x == player.cords.x && entrance.cords.y == player.cords.y) {
				foundPrompt = true;
				interactPrompt.textContent = `[${interactKey}] ` + lang["enter_area"];
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
	let mainStatText: string = "";
	mainStatText += `<f>16px<f><i>${icons.health}<i>${helper.localise("hpMax")}: ${Math.floor(enemy.stats.hp)}/${enemy.getHpMax()}\n`;
	mainStatText += `<f>16px<f><i>${icons.mana}<i>${helper.localise("mpMax")}: ${Math.floor(enemy.stats.mp)}/${enemy.getMpMax()}\n`;
	const charArmor = enemy.getArmor();
	mainStatText += `<f>16px<f><i>${icons.physicalArmor}<i>${lang["physicalArmor"]}: ${charArmor.physical}\n`;
	mainStatText += `<f>16px<f><i>${icons.magicalArmor}<i>${lang["magicalArmor"]}: ${charArmor.magical}\n`;
	mainStatText += `<f>16px<f><i>${icons.elementalArmor}<i>${lang["elementalArmor"]}: ${charArmor.elemental}\n`;
	mainStatText += `<f>16px<f><i>${icons.str}<i>${lang["str"]}: ${enemyStats.str}\n`;
	mainStatText += `<f>16px<f><i>${icons.dex}<i>${lang["dex"]}: ${enemyStats.dex}\n`;
	mainStatText += `<f>16px<f><i>${icons.vit}<i>${lang["vit"]}: ${enemyStats.vit}\n`;
	mainStatText += `<f>16px<f><i>${icons.int}<i>${lang["int"]}: ${enemyStats.int}\n`;
	mainStatText += `<f>16px<f><i>${icons.cun}<i>${lang["cun"]}: ${enemyStats.cun}\n`;
	mainStatText += `<f>16px<f><i>${icons.hitChance}<i>${lang["hitChance"]}: ${enemyMiscStats.chance}\n`;
	mainStatText += `<f>16px<f><i>${icons.evasion}<i>${lang["evasion"]}: ${enemyMiscStats.evasion}\n`;
	let enTotalDmg = enemy.trueDamage();
	mainStatText += `<f>16px<f><i>${icons.damage}<i>${lang["damage"]}: ${enTotalDmg.total}(`;
	Object.entries(enTotalDmg.split).forEach((res: any) => {
		const key = res[0];
		const val = res[1];
		mainStatText += `<f>16px<f><i>${icons[key]}<i>${val}`;
	});
	mainStatText += "<c>white<c>)\n";
	const mainStats = textSyntax(mainStatText);
	let resists: string = `<f>16px<f><i>${icons.resistAll}<i>${lang["resistance"]}\n`;
	Object.entries(enemy.getResists()).forEach((res: any) => {
		const key = res[0];
		const val = res[1];
		resists += `<f>16x<f><i>${icons[key + "Resist"]}<i>${lang[key]} ${val}%\n`;
	});
	const resistFrame = textSyntax(resists);
	resistFrame.classList.add("enResists");
	staticHover.append(name, mainStats, resistFrame);
}

// function hoverProjectile(projectile: Projectile) {
//   staticHover.textContent = "";
//   staticHover.style.display = "block";
//   const name = document.createElement("p");
//   name.classList.add("enemyName");
//   name.textContent = `${lang[projectile.id + "_name"] ?? projectile.id}`;
//   let mainStatText = "";
//   mainStatText += `<f>19px<f>${lang["speed"] ?? "speed"}: ${projectile.speed} ${lang["tiles_per_turn"] ?? "tpt"}\n`;
//   mainStatText += `<f>19px<f>${lang["origin"] ?? "origin"}: ${lang[projectile.shooter.id + "_name"]}\n`;
//   mainStatText += `<f>19px<f><i>${icons.damage}<i>${lang["predicted_damage"] ?? "predicted_damage"}: ${
//     calculateDamage(projectile.shooter, dummy, projectile.ability, true).dmg
//   }`;
//   const mainStats = textSyntax(mainStatText);
//   staticHover.append(name, mainStats);
// }

/* Hide map hover */
function hideMapHover() {
	staticHover.textContent = "";
	staticHover.style.display = "none";
}

function activateShrine() {
	maps[currentMap].shrines.forEach((shrine: any) => {
		if (shrine.cords.x == player.cords.x && shrine.cords.y == player.cords.y) {
			if (
				!player.usedShrines.find((used: any) => used.cords.x == shrine.cords.x && used.cords.y == shrine.cords.y && used.map == currentMap)
			) {
				player.stats.hp = player.getHpMax();
				player.stats.mp = player.getMpMax();
				player.respawnPoint.cords = shrine.cords;
				player.respawnPoint.map = currentMap;
				player.usedShrines.push({ cords: shrine.cords, map: currentMap });
				player.statusEffects = [];
				spawnFloatingText(player.cords, lang["shrine_activated"], "lime", 30, 500, 75);
				updateUI();
				modifyCanvas();
			} else {
				spawnFloatingText(player.cords, lang["shrine_used"], "cyan", 30, 500, 75);
			}
		}
	});
}

function mapHover(event: MouseEvent) {
	const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
	const lX = Math.floor((event.offsetX - baseCanvas.width / 2 + spriteSize / 2) / spriteSize);
	const lY = Math.floor((event.offsetY - baseCanvas.height / 2 + spriteSize / 2) / spriteSize);
	const x = lX + player.cords.x - settings.map_offset_x;
	const y = lY + player.cords.y - settings.map_offset_y;
	if (x < 0 || x > maps[currentMap].base[0].length - 1 || y < 0 || y > maps[currentMap].base.length - 1) return;
	if (DEVTOOLS.ENABLED) {
		CURSOR_LOCATION.x = x;
		CURSOR_LOCATION.y = y;
		updateDeveloperInformation();
	}
	renderTileHover({ x: x, y: y }, event);
}

interface entrance {
	id: string;
	sprite: string;
	path: { cords: tileObject; to: string };
	cords: tileObject;
}

interface message {
	id: string;
	cords: tileObject;
}

interface shrine {
	cords: tileObject;
}

function clickMap(event: MouseEvent) {
	if (state.clicked || player.isDead) return;
	if (state.invOpen || (event.button != 0 && event.button != 1 && event.button != 2)) {
		closeInventory();
		return;
	}
	closeTextWindow();
	const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
	const lX = Math.floor((event.offsetX - baseCanvas.width / 2 + spriteSize / 2) / spriteSize);
	const lY = Math.floor((event.offsetY - baseCanvas.height / 2 + spriteSize / 2) / spriteSize);
	const x = lX + player.cords.x - settings.map_offset_x;
	const y = lY + player.cords.y - settings.map_offset_y;
	if (event.button === 2) {
		state.isSelected = false;
		state.abiSelected = {};
		updateUI();
		mapSelection.x = null;
		mapSelection.y = null;
		renderTileHover({ x: x, y: y }, event);
		dontMove = true;
		return;
	}
	1;
	if (dontMove) {
		dontMove = false;
		return;
	}
	if (event.button === 1) {
		state.isSelected = false;
		state.abiSelected = {};
		updateUI();
		mapSelection.x = null;
		mapSelection.y = null;
		renderTileHover({ x: x, y: y }, event);
		maps[currentMap].enemies.some((en: Enemy) => {
			if (en.cords.x === x && en.cords.y === y) {
				return openCodexToPage(["ENEMIES"], { id: en.id, category: "enemies", object: en });
			}
		});
		return;
	}
	itemData.some((item: any) => {
		if (item.cords.x == x && item.cords.y == y) {
			pickLoot();
			return true;
		}
	});
	maps[currentMap].shrines.some((shrine: shrine) => {
		if (shrine.cords.x == x && shrine.cords.y == y) {
			activateShrine();
			return true;
		}
	});
	maps[currentMap].messages.some((msg: message) => {
		if (msg.cords.x == x && msg.cords.y == y && msg.cords.x === player.cords.x && msg.cords.y === player.cords.y) {
			readMessage();
			return true;
		}
	});
	maps[currentMap].treasureChests.some((chest: treasureChest) => {
		if (chest.cords.x === x && chest.cords.y === y) {
			const lootedChest = lootedChests.find((trs) => trs.cords.x == chest.cords.x && trs.cords.y == chest.cords.y && trs.map == currentMap);
			if (chest.cords.x == player.cords.x && chest.cords.y == player.cords.y && !lootedChest) {
				chest.lootChest();
				return true;
			}
		}
	});
	maps[currentMap].entrances?.some((entrance: entrance) => {
		if (entrance.cords.x == x && entrance.cords.y == y) {
			if (entrance.cords.x == player.cords.x && entrance.cords.y == player.cords.y) {
				dontMove = true;
				loadingScreen.style.display = "flex";
				loadingText.textContent = "Loading map...";
				return changeMap(entrance);
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
	if (dontMove) return;
	let move = true;
	let targetingEnemy = false;
	for (let enemy of maps[currentMap].enemies) {
		if (enemy.cords.x == x && enemy.cords.y == y) {
			if (!enemy.alive) break;
			targetingEnemy = true;
			move = false;
			if (state.isSelected) {
				if (
					// @ts-expect-error
					generateArrowPath(player.cords, enemy.cords).length <= state.abiSelected.use_range ||
					weaponReach(player, state.abiSelected.use_range, enemy)
				) {
					if (
						(state.abiSelected.requires_melee_weapon && player.weapon.firesProjectile) ||
						(state.abiSelected.requires_ranged_weapon && !player.weapon.firesProjectile)
					)
						break;
					if (state.abiSelected.type == "attack") {
						if (state.abiSelected.shoots_projectile)
							fireProjectile(player.cords, enemy.cords, state.abiSelected.shoots_projectile, state.abiSelected, true, player);
						else regularAttack(player, enemy, state.abiSelected);
						if (weaponReach(player, state.abiSelected.use_range, enemy))
							// @ts-expect-error
							attackTarget(player, enemy, weaponReach(player, state.abiSelected.use_range, enemy));
						if (!state.abiSelected.shoots_projectile) advanceTurn();
					}
				}
				if (
					state.abiSelected.type == "charge" &&
					generatePath(player.cords, enemy.cords, false).length <= state.abiSelected.use_range &&
					!player.isRooted()
				) {
					player.stats.mp -= state.abiSelected.mana_cost;
					state.abiSelected.onCooldown = state.abiSelected.cooldown;
					movePlayer(enemy.cords, true, 99, () => regularAttack(player, enemy, state.abiSelected));
				}
			} else if (weaponReach(player, player.weapon.range, enemy)) {
				// @ts-expect-error
				attackTarget(player, enemy, weaponReach(player, player.weapon.range, enemy));
				if (weaponReach(player, player.weapon.range, enemy)) {
					player.doNormalAttack(enemy);
				}
			} else {
				move = true;
			}
			break;
		}
	}
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
	setTimeout(() => {
		state.clicked = false;
	}, 30);
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
	} else if (move && !player.isRooted()) {
		if (parseInt(player.carryingWeight()) > parseInt(player.maxCarryWeight())) {
			displayText(`<c>white<c>[WORLD] <c>orange<c>${lang["too_much_weight"]}`);
		} else {
			movePlayer({ x: x, y: y });
		}
	} else if (player.isRooted()) {
		advanceTurn();
		state.abiSelected = {};
	}
}

function changeMap(entrance: entrance) {
	const id = entrance.path.to;
	if (!id) {
		displayText(`<c>white<c>[WORLD] <c>orange<c>${lang["map_not_found"]}`);
		loadingScreen.style.display = "none";
		return;
	}
	document.querySelector<HTMLDivElement>(".loading-bar-fill").style.width = "0%";
	currentMap = id;
	player.cords = { ...entrance.path.cords };
	turnOver = true;
	enemiesHadTurn = 0;
	state.inCombat = false;
	executeLoad();
	areaName(maps[currentMap].name);
}

function loadMap(map: string) {
	currentMap = map;
	executeLoad();
	areaName(maps[currentMap].name);
}

async function executeLoad() {
	loadingText.textContent = "Loading minimap assets...";
	document.querySelector<HTMLDivElement>(".loading-bar-fill").style.width = "10%";
	loadMiscMaps().then(() => {
		setLoadingText("Loading static map assets...").then(() => {
			document.querySelector<HTMLDivElement>(".loading-bar-fill").style.width = "46%";
			loadStaticMaps().then(() => {
				setLoadingText("Loading UI...").then(() => {
					document.querySelector<HTMLDivElement>(".loading-bar-fill").style.width = "64%";
					loadUI().then(() => {
						document.querySelector<HTMLDivElement>(".loading-bar-fill").style.width = "80%";
						loadingScreen.style.display = "none";
						modifyCanvas(true);
						renderMinimap(maps[currentMap]);
						renderAreaMap(maps[currentMap]);
					});
				});
			});
		});
	});
}

function setLoadingText(text: string) {
	return new Promise((resolve) => {
		loadingText.textContent = text;
		setTimeout(() => resolve(""), 10);
	});
}

function loadMiscMaps() {
	return new Promise((resolve, reject) => {
		loadingText.textContent = "Loading minimap assets...";
		renderMinimap(maps[currentMap]);
		renderAreaMap(maps[currentMap]);
		resolve("rendered misc maps");
	});
}

function loadStaticMaps() {
	return new Promise((resolve, reject) => {
		createStaticMap();
		convertEnemytraits();
		resolve("rendered static maps");
	});
}

function loadUI() {
	return new Promise((resolve, reject) => {
		updateUI();
		resolve("loaded UI");
	});
}

function areaName(name: string) {
	areaTitleText.textContent = name;
	areaTitle.style.animation = "none";
	areaTitle.offsetHeight; /* trigger reflow */
	areaTitle.style.animation = null;
	areaTitle.style.animationName = `charHurt`;
	areaTitle.style.animationName = "fadeInFadeOut";
}
