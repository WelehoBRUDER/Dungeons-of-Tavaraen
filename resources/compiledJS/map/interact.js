"use strict";
const areaTitle = document.querySelector(".area-name");
const areaTitleText = areaTitle.querySelector(".title");
const loadingScreen = document.querySelector(".loading");
const loadingText = loadingScreen.querySelector(".loading-text");
function showInteractPrompt() {
    var _a;
    const interactPrompt = document.querySelector(".interactPrompt");
    let foundPrompt = false;
    let interactKey = settings["hotkey_interact"] == " " ? lang["space_key"] : settings["hotkey_interact"].toUpperCase();
    interactPrompt.textContent = "";
    itemData.some((itm) => {
        if (itm.cords.x == player.cords.x && itm.cords.y == player.cords.y) {
            foundPrompt = true;
            interactPrompt.textContent = `[${interactKey}] ` + lang["pick_item"];
        }
    });
    if (!foundPrompt) {
        maps[currentMap].treasureChests.some((chest) => {
            if (chest.cords.x == player.cords.x && chest.cords.y == player.cords.y && chest.loot.length > 0) {
                foundPrompt = true;
                interactPrompt.textContent = `[${interactKey}] ` + lang["pick_chest"];
            }
        });
    }
    if (!foundPrompt) {
        maps[currentMap].messages.some((msg) => {
            if (msg.cords.x == player.cords.x && msg.cords.y == player.cords.y) {
                foundPrompt = true;
                interactPrompt.textContent = `[${interactKey}] ` + lang["read_msg"];
            }
        });
    }
    if (!foundPrompt) {
        NPCcharacters.some((npc) => {
            let dist = calcDistance(player.cords.x, player.cords.y, npc.currentCords.x, npc.currentCords.y);
            if (dist < 3) {
                foundPrompt = true;
                interactPrompt.textContent = `[${interactKey}] ` + lang["talk_to_npc"] + ` ${lang[npc.id + "_name"]}`;
            }
        });
    }
    if (!foundPrompt) {
        (_a = maps[currentMap].entrances) === null || _a === void 0 ? void 0 : _a.some((entrance) => {
            if (entrance.cords.x == player.cords.x && entrance.cords.y == player.cords.y) {
                foundPrompt = true;
                interactPrompt.textContent = `[${interactKey}] ` + lang["enter_area"];
            }
        });
    }
}
/* Show enemy stats when hovering */
function hoverEnemyShow(enemy) {
    var _a;
    staticHover.textContent = "";
    staticHover.style.display = "block";
    const name = document.createElement("p");
    name.classList.add("enemyName");
    name.textContent = `Lvl ${enemy.level} ${(_a = lang[enemy.id + "_name"]) !== null && _a !== void 0 ? _a : enemy.id}`;
    const enemyStats = enemy.getStats();
    const enemyMiscStats = enemy.getHitchance();
    var mainStatText = "";
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
    Object.entries(enTotalDmg.split).forEach((res) => {
        const key = res[0];
        const val = res[1];
        mainStatText += `<f>20px<f><i>${icons[key + "_icon"]}<i>${val}`;
    });
    mainStatText += "<c>white<c>)\n";
    const mainStats = textSyntax(mainStatText);
    var resists = `<f>20px<f><i>${icons.resistAll_icon}<i>${lang["resistance"]}\n`;
    Object.entries(enemy.getResists()).forEach((res) => {
        const key = res[0];
        const val = res[1];
        resists += `<f>20px<f><i>${icons[key + "Resist" + "_icon"]}<i>${lang[key]} ${val}%\n`;
    });
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
    maps[currentMap].shrines.forEach((shrine) => {
        if (shrine.cords.x == player.cords.x && shrine.cords.y == player.cords.y && !state.inCombat) {
            if (!(player.usedShrines.find((used) => used.cords.x == shrine.cords.x && used.cords.y == shrine.cords.y && used.map == currentMap))) {
                player.stats.hp = player.getHpMax();
                player.stats.mp = player.getMpMax();
                player.respawnPoint.cords = shrine.cords;
                player.respawnPoint.map = currentMap;
                player.usedShrines.push({ cords: shrine.cords, map: currentMap });
                player.statusEffects = [];
                spawnFloatingText(player.cords, lang["shrine_activated"], "lime", 30, 500, 75);
                updateUI();
                modifyCanvas();
            }
            else {
                spawnFloatingText(player.cords, lang["shrine_used"], "cyan", 30, 500, 75);
            }
        }
    });
}
function mapHover(event) {
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    const lX = Math.floor(((event.offsetX - baseCanvas.width / 2) + spriteSize / 2) / spriteSize);
    const lY = Math.floor(((event.offsetY - baseCanvas.height / 2) + spriteSize / 2) / spriteSize);
    const x = lX + player.cords.x - settings.map_offset_x;
    const y = lY + player.cords.y - settings.map_offset_y;
    if (x < 0 || x > maps[currentMap].base[0].length - 1 || y < 0 || y > maps[currentMap].base.length - 1)
        return;
    if (DEVMODE) {
        CURSOR_LOCATION.x = x;
        CURSOR_LOCATION.y = y;
        updateDeveloperInformation();
    }
    renderTileHover({ x: x, y: y }, event);
}
function clickMap(event) {
    var _a, _b, _c;
    if (state.clicked || player.isDead)
        return;
    if (state.invOpen || (event.button != 0 && event.button != 1 && event.button != 2)) {
        closeInventory();
        return;
    }
    closeTextWindow();
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    const lX = Math.floor(((event.offsetX - baseCanvas.width / 2) + spriteSize / 2) / spriteSize);
    const lY = Math.floor(((event.offsetY - baseCanvas.height / 2) + spriteSize / 2) / spriteSize);
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
        maps[currentMap].enemies.some((en) => {
            if (en.cords.x === x && en.cords.y === y) {
                return openCodexToPage(["ENEMIES"], { id: en.id, category: "enemies", object: en });
            }
        });
        return;
    }
    itemData.some((item) => {
        if (item.cords.x == x && item.cords.y == y) {
            pickLoot();
            return true;
        }
    });
    maps[currentMap].shrines.some((shrine) => {
        if (shrine.cords.x == x && shrine.cords.y == y) {
            activateShrine();
            return true;
        }
    });
    maps[currentMap].messages.some((msg) => {
        if (msg.cords.x == x && msg.cords.y == y && msg.cords.x === player.cords.x && msg.cords.y === player.cords.y) {
            readMessage();
            return true;
        }
    });
    maps[currentMap].treasureChests.some((chest) => {
        if (chest.cords.x === x && chest.cords.y === y) {
            const lootedChest = lootedChests.find(trs => trs.cords.x == chest.cords.x && trs.cords.y == chest.cords.y && trs.map == currentMap);
            if (chest.cords.x == player.cords.x && chest.cords.y == player.cords.y && !lootedChest) {
                chest.lootChest();
                return true;
            }
        }
    });
    (_a = maps[currentMap].entrances) === null || _a === void 0 ? void 0 : _a.some((entrance) => {
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
        NPCcharacters.some((npc) => {
            if (npc.currentCords.x === x && npc.currentCords.y == y) {
                talkToCharacter();
                return true;
            }
        });
    }
    if (dontMove)
        return;
    let move = true;
    let targetingEnemy = false;
    for (let enemy of maps[currentMap].enemies) {
        if (enemy.cords.x == x && enemy.cords.y == y) {
            if (!enemy.alive)
                break;
            targetingEnemy = true;
            if (state.isSelected) {
                // @ts-expect-error
                if (generateArrowPath(player.cords, enemy.cords).length <= state.abiSelected.use_range || weaponReach(player, state.abiSelected.use_range, enemy)) {
                    if ((state.abiSelected.requires_melee_weapon && player.weapon.firesProjectile) || (state.abiSelected.requires_ranged_weapon && !player.weapon.firesProjectile))
                        break;
                    if (state.abiSelected.type == "attack") {
                        if (state.abiSelected.shoots_projectile)
                            fireProjectile(player.cords, enemy.cords, state.abiSelected.shoots_projectile, state.abiSelected, true, player);
                        else
                            regularAttack(player, enemy, state.abiSelected);
                        // @ts-expect-error
                        if (weaponReach(player, state.abiSelected.use_range, enemy))
                            attackTarget(player, enemy, weaponReach(player, state.abiSelected.use_range, enemy));
                        if (!state.abiSelected.shoots_projectile)
                            advanceTurn();
                    }
                }
                if (state.abiSelected.type == "charge" && generatePath(player.cords, enemy.cords, false).length <= state.abiSelected.use_range && !player.isRooted()) {
                    player.stats.mp -= state.abiSelected.mana_cost;
                    state.abiSelected.onCooldown = state.abiSelected.cooldown;
                    movePlayer(enemy.cords, true, 99, () => regularAttack(player, enemy, state.abiSelected));
                }
            }
            else if (weaponReach(player, player.weapon.range, enemy)) {
                // @ts-expect-error
                attackTarget(player, enemy, weaponReach(player, player.weapon.range, enemy));
                if (weaponReach(player, player.weapon.range, enemy)) {
                    player.doNormalAttack(enemy);
                }
            }
            move = false;
            break;
        }
    }
    ;
    if (state.isSelected && ((_b = state.abiSelected) === null || _b === void 0 ? void 0 : _b.aoe_size) > 0 && !targetingEnemy) {
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
        if (((_c = state.abiSelected.statusesUser) === null || _c === void 0 ? void 0 : _c.length) > 0) {
            state.abiSelected.statusesUser.forEach((status) => {
                if (!player.statusEffects.find((eff) => eff.id == status)) {
                    // @ts-ignore
                    player.statusEffects.push(new statEffect(Object.assign({}, statusEffects[status]), state.abiSelected.statusModifiers));
                }
                else {
                    player.statusEffects.find((eff) => eff.id == status).last.current += statusEffects[status].last.total;
                }
                // @ts-ignore
                statusEffects[status].last.current = statusEffects[status].last.total;
                spawnFloatingText(player.cords, state.abiSelected.line, "crimson", 36);
                let string = "";
                string = lang[state.abiSelected.id + "_action_desc_pl"];
                displayText(`<c>cyan<c>[ACTION] <c>white<c>${string}`);
            });
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
        state.abiSelected = {};
    }
}
function changeMap(entrance) {
    const id = maps.findIndex((m) => m.id == entrance.path.to);
    if (id == -1) {
        displayText(`<c>white<c>[WORLD] <c>orange<c>${lang["map_not_found"]}`);
        loadingScreen.style.display = "none";
        return;
    }
    ;
    currentMap = id;
    player.cords = Object.assign({}, entrance.path.cords);
    turnOver = true;
    enemiesHadTurn = 0;
    state.inCombat = false;
    executeLoad();
    areaName(maps[currentMap].name);
}
function loadMap(map) {
    currentMap = map;
    executeLoad();
    areaName(maps[currentMap].name);
}
async function executeLoad() {
    loadingText.textContent = "Loading minimap assets...";
    loadMiscMaps().then(() => {
        setLoadingText("Loading static map assets...").then(() => {
            loadStaticMaps().then(() => {
                setLoadingText("Loading UI...").then(() => {
                    loadUI().then(() => {
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
function setLoadingText(text) {
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
function areaName(name) {
    areaTitleText.textContent = name;
    areaTitle.style.animation = 'none';
    areaTitle.offsetHeight; /* trigger reflow */
    areaTitle.style.animation = null;
    areaTitle.style.animationName = `charHurt`;
    areaTitle.style.animationName = "fadeInFadeOut";
}
//# sourceMappingURL=interact.js.map