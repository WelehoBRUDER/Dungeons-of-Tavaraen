"use strict";
const menuOptions = [
    {
        id: "menu_resume",
        action: () => handleEscape()
    },
    {
        id: "menu_save_games",
        action: () => gotoSaveMenu()
    },
    {
        id: "menu_options",
        action: () => gotoSettingsMenu()
    },
    {
        id: "menu_main_screen",
        action: () => gotoMainMenu()
    }
];
const mainButtons = [
    {
        id: "menu_resume",
        action: () => closeGameMenu(false, false)
    },
    {
        id: "menu_new_game",
        action: () => characterCreation()
    },
    {
        id: "menu_load_game",
        action: () => gotoSaveMenu(true)
    },
    {
        id: "menu_options",
        action: () => gotoSettingsMenu(true)
    },
];
const grades = {
    common: {
        color: "#e0e0e0",
        worth: 1
    },
    uncommon: {
        color: "#7ccf63",
        worth: 2
    },
    rare: {
        color: "#4287f5",
        worth: 3.25
    },
    mythical: {
        color: "#5e18a3",
        worth: 5
    },
    legendary: {
        color: "#cfcf32",
        worth: 8
    }
};
const menuSettings = [
    {
        id: "setting_log_enemy_movement",
        tooltip: "log_char_movement",
        type: "toggle",
    },
    {
        id: "setting_toggle_minimap",
        tooltip: "toggle_minimap",
        type: "toggle",
    },
    {
        id: "setting_hotkey_inv",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_char",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_perk",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_journal",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_codex",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_ranged",
        tooltip: "toggle_rangedMode",
        type: "hotkey",
    },
    {
        id: "setting_ui_scale",
        tooltip: "ui_scale",
        type: "inputSlider",
    },
    {
        id: "setting_hotkey_move_up",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_move_down",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_move_left",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_move_right",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_interact",
        tooltip: "interact_help",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_open_world_messages",
        tooltip: "world_messages",
        type: "hotkey",
    },
    {
        id: "setting_game_language",
        type: "languageSelection"
    }
];
const state = {
    inCombat: false,
    clicked: false,
    isSelected: false,
    abiSelected: {},
    invOpen: false,
    charOpen: false,
    perkOpen: false,
    menuOpen: false,
    titleScreen: false,
    optionsOpen: false,
    savesOpen: false,
    displayingTextHistory: false,
    rangedMode: false,
    textWindowOpen: false,
    dialogWindow: false,
    storeOpen: false,
    journalOpen: false,
    codexOpen: false,
};
function handleEscape() {
    if (state.perkOpen) {
        closeLeveling();
        state.perkOpen = false;
    }
    else if (state.charOpen) {
        closeCharacter();
        state.charOpen = false;
    }
    else if (state.invOpen) {
        closeInventory();
        state.invOpen = false;
    }
    else if (state.savesOpen) {
        closeSaveMenu();
        state.savesOpen = false;
    }
    else if (state.optionsOpen) {
        closeSettingsMenu();
        state.optionsOpen = false;
    }
    else if (state.displayingTextHistory) {
        state.displayingTextHistory = false;
        displayAllTextHistory();
    }
    else if (state.rangedMode) {
        state.rangedMode = false;
        renderTileHover(player.cords, null);
    }
    else if (state.menuOpen && !state.titleScreen) {
        closeGameMenu(false, false, false);
        state.menuOpen = false;
    }
    else if (state.dialogWindow) {
        exitDialog();
    }
    else if (state.storeOpen) {
        cancelTransaction();
    }
    else if (state.journalOpen) {
        closePlayerQuests();
    }
    else if (state.codexOpen) {
        closeCodex();
    }
    else if (!state.isSelected && !player.isDead) {
        openGameMenu();
        state.menuOpen = true;
    }
    state.isSelected = false;
    state.abiSelected = {};
    closeTextWindow();
    updateUI();
    hideHover();
    contextMenu.textContent = "";
    assignContainer.style.display = "none";
    if (player.isDead)
        spawnDeathScreen();
}
// This happens on a slight timeout to make sure resources can load in time.
setTimeout(() => {
    let options = JSON.parse(localStorage.getItem(`DOT_game_settings`));
    if (options) {
        settings = new gameSettings(options);
        lang = eval(JSON.parse(localStorage.getItem(`DOT_game_language`)));
    }
    state.menuOpen = true;
    state.titleScreen = true;
    gotoMainMenu(true);
    if (DEVMODE) {
        renderMinimap(maps[currentMap]);
        createStaticMap();
        modifyCanvas(true);
    }
    tooltip(document.querySelector(".invScrb"), `${lang["setting_hotkey_inv"]} [${settings["hotkey_inv"]}]`);
    tooltip(document.querySelector(".chaScrb"), `${lang["setting_hotkey_char"]} [${settings["hotkey_char"]}]`);
    tooltip(document.querySelector(".perScrb"), `${lang["setting_hotkey_perk"]} [${settings["hotkey_perk"]}]`);
    tooltip(document.querySelector(".escScrb"), `${lang["open_menu"]} [ESCAPE]`);
}, 350);
const languages = ["english", "finnish"];
const mainMenu = document.querySelector(".mainMenu");
const menu = document.querySelector(".gameMenu");
const dim = document.querySelector(".dim");
const mainMenuButtons = mainMenu.querySelector(".menuButtons");
function openGameMenu() {
    var _a;
    menu.textContent = "";
    setTimeout(() => { dim.style.height = "100%"; }, 5);
    for (let button of menuOptions) {
        const frame = document.createElement("div");
        frame.textContent = (_a = lang[button.id]) !== null && _a !== void 0 ? _a : button.id;
        frame.classList.add("menuButton");
        frame.classList.add(button.id);
        if (button.action) {
            frame.addEventListener("click", () => button.action());
        }
        menu.append(frame);
    }
}
function closeGameMenu(noDim = false, escape = false, keepMainMenu = false) {
    const reverseOptions = [...menuOptions].reverse();
    if (!noDim) {
        setTimeout(() => { dim.style.height = "0%"; }, 5);
        const settingsBackground = document.querySelector(".settingsMenu");
        settingsBackground.textContent = "";
    }
    if (!keepMainMenu) {
        setTimeout(() => { mainMenu.style.display = "none"; }, 575);
        state.menuOpen = false;
        state.titleScreen = false;
        mainMenu.style.opacity = "0";
    }
    for (let button of reverseOptions) {
        try {
            const frame = menu.querySelector(`.${button.id}`);
            frame.remove();
        }
        catch (_a) {
            console.log("This doesn't affect anything");
        }
    }
    if (escape)
        handleEscape();
    hideHover();
    if (player.isDead)
        spawnDeathScreen();
}
let selectingHotkey = "";
window.addEventListener("keyup", (e) => {
    if (selectingHotkey != "") {
        settings[selectingHotkey] = e.key;
        document.querySelector(`.${selectingHotkey}`).childNodes[1].textContent = e.key.toUpperCase();
        tooltip(document.querySelector(".invScrb"), `${lang["setting_hotkey_inv"]} [${settings["hotkey_inv"]}]`);
        tooltip(document.querySelector(".chaScrb"), `${lang["setting_hotkey_char"]} [${settings["hotkey_char"]}]`);
        tooltip(document.querySelector(".perScrb"), `${lang["setting_hotkey_perk"]} [${settings["hotkey_perk"]}]`);
        tooltip(document.querySelector(".jorScrb"), `${lang["setting_hotkey_journal"]} [${settings["hotkey_journal"]}]`);
        tooltip(document.querySelector(".escScrb"), `${lang["open_menu"]} [ESCAPE]`);
        selectingHotkey = "";
    }
});
async function closeSettingsMenu() {
    const settingsBackground = document.querySelector(".settingsMenu");
    settingsBackground.textContent = "";
    state.optionsOpen = false;
    setTimeout(() => { dim.style.height = "0%"; }, 5);
    hideHover();
}
function scaleUI(scale) {
    settings["ui_scale"] = scale * 100;
    document.documentElement.style.setProperty('--ui-scale', scale.toString());
    moveMinimap();
}
function gotoSettingsMenu(inMainMenu = false) {
    var _a, _b, _c, _d;
    selectingHotkey = "";
    state.optionsOpen = true;
    if (!inMainMenu)
        closeGameMenu(true);
    const settingsBackground = document.querySelector(".settingsMenu");
    settingsBackground.textContent = "";
    for (let setting of menuSettings) {
        const container = document.createElement("div");
        if (setting.type == "toggle") {
            container.classList.add("toggle");
            const text = document.createElement("p");
            const toggleBox = document.createElement("div");
            text.textContent = (_a = lang[setting.id]) !== null && _a !== void 0 ? _a : setting.id;
            let _setting = setting.id.replace("setting_", "");
            if (settings[_setting])
                toggleBox.textContent = "X";
            else
                toggleBox.textContent = "";
            container.addEventListener("click", tog => {
                settings[_setting] = !settings[_setting];
                moveMinimap();
                if (settings[_setting])
                    toggleBox.textContent = "X";
                else
                    toggleBox.textContent = "";
            });
            if (setting.tooltip) {
                tooltip(container, lang[setting.tooltip]);
            }
            container.append(text, toggleBox);
            settingsBackground.append(container);
        }
        else if (setting.type == "hotkey") {
            container.classList.add("hotkeySelection");
            const text = document.createElement("p");
            text.textContent = (_b = lang[setting.id]) !== null && _b !== void 0 ? _b : setting.id;
            let _setting = setting.id.replace("setting_", "");
            container.classList.add(_setting);
            const keyButton = document.createElement("div");
            keyButton.textContent = settings[_setting].toUpperCase();
            if (settings[_setting] == " ")
                keyButton.textContent = lang["space_key"];
            container.addEventListener("click", () => {
                if (selectingHotkey == "") {
                    keyButton.textContent = "<>";
                    selectingHotkey = _setting;
                }
            });
            if (setting.tooltip) {
                tooltip(container, lang[setting.tooltip]);
            }
            container.append(text, keyButton);
            settingsBackground.append(container);
        }
        else if (setting.type == "inputSlider") {
            container.classList.add("sliderContainer");
            const text = document.createElement("p");
            const slider = document.createElement("input");
            const textVal = document.createElement("p");
            slider.classList.add("slider");
            textVal.classList.add("inputValue");
            text.textContent = (_c = lang[setting.id]) !== null && _c !== void 0 ? _c : setting.id;
            let _setting = setting.id.replace("setting_", "");
            slider.type = "range";
            slider.min = "50";
            slider.max = "150";
            slider.value = settings[_setting].toString();
            container.classList.add(_setting);
            if (setting.tooltip) {
                tooltip(container, lang[setting.tooltip]);
            }
            textVal.textContent = `${(parseInt(slider.value) / 100).toString()}x`;
            slider.oninput = () => {
                scaleUI(parseInt(slider.value) / 100);
                textVal.textContent = `${(parseInt(slider.value) / 100).toString()}x`;
            };
            text.append(textVal);
            container.append(text, slider);
            settingsBackground.append(container);
        }
        else if (setting.type == "languageSelection") {
            container.classList.add("languageSelection");
            const text = document.createElement("p");
            text.textContent = (_d = lang[setting.id]) !== null && _d !== void 0 ? _d : setting.id;
            container.append(text);
            languages.forEach((language) => {
                const langButton = document.createElement("div");
                langButton.textContent = lang[language];
                if (language == lang["language_id"])
                    langButton.classList.add("selectedLang");
                langButton.addEventListener("click", () => {
                    container.childNodes.forEach((child) => {
                        try {
                            child.classList.remove("selectedLang");
                        }
                        catch (_a) { }
                    });
                    lang = eval(language);
                    tooltip(document.querySelector(".invScrb"), `${lang["setting_hotkey_inv"]} [${settings["hotkey_inv"]}]`);
                    tooltip(document.querySelector(".chaScrb"), `${lang["setting_hotkey_char"]} [${settings["hotkey_char"]}]`);
                    tooltip(document.querySelector(".perScrb"), `${lang["setting_hotkey_perk"]} [${settings["hotkey_perk"]}]`);
                    tooltip(document.querySelector(".jorScrb"), `${lang["setting_hotkey_journal"]} [${settings["hotkey_journal"]}]`);
                    tooltip(document.querySelector(".escScrb"), `${lang["open_menu"]} [ESCAPE]`);
                    player.updateAbilities();
                    gotoSettingsMenu(true);
                });
                container.append(langButton);
            });
            settingsBackground.append(container);
        }
    }
}
async function gotoMainMenu(init = false) {
    var _a;
    despawnDeathScreen();
    menu.textContent = "";
    setTimeout(() => { dim.style.height = "0%"; }, 150);
    mainMenu.style.display = "block";
    await sleep(10);
    mainMenu.style.opacity = "1";
    mainMenuButtons.textContent = "";
    for (let button of mainButtons) {
        const frame = document.createElement("div");
        frame.textContent = (_a = lang[button.id]) !== null && _a !== void 0 ? _a : button.id;
        frame.classList.add("menuButton");
        frame.classList.add(button.id);
        if (button.action) {
            frame.addEventListener("click", () => button.action());
        }
        if (button.id.includes("resume") && !DEVMODE && init)
            frame.classList.add("greyedOut");
        mainMenuButtons.append(frame);
    }
}
function trimPlayerObjectForSaveFile(playerObject) {
    const trimmed = Object.assign({}, playerObject);
    trimmed.inventory.forEach((itm, index) => {
        if (itm.stackable)
            trimmed.inventory[index] = { id: itm.id, type: itm.type, amount: itm.amount };
        else if (itm.level)
            trimmed.inventory[index] = { id: itm.id, type: itm.type, level: itm.level };
        else
            trimmed.inventory[index] = { id: itm.id, type: itm.type };
    });
    trimmed.abilities.forEach((abi, index) => {
        // @ts-ignore
        trimmed.abilities[index] = { id: abi.id, equippedSlot: abi.equippedSlot };
    });
    trimmed.allModifiers = {};
    equipSlots.forEach((slot) => {
        var _a, _b;
        if ((_a = trimmed[slot]) === null || _a === void 0 ? void 0 : _a.id) {
            trimmed[slot] = { id: trimmed[slot].id, type: trimmed[slot].type, level: (_b = trimmed[slot].level) !== null && _b !== void 0 ? _b : 0 };
        }
    });
    trimmed.perks.forEach((perk, index) => {
        trimmed.perks[index] = { id: perk.id, tree: perk.tree, commandsExecuted: perk.commandsExecuted };
    });
    return Object.assign({}, trimmed);
}
let saveMenuScroll = 0;
document.querySelector(".savesMenu .saves").addEventListener("wheel", (wheel) => saveMenuScroll = wheel.path[1].scrollTop);
async function gotoSaveMenu(inMainMenu = false, animate = true) {
    var _a, _b, _c, _d, _e, _f, _g;
    hideHover();
    saves = JSON.parse(localStorage.getItem(`DOT_game_saves`)) || [];
    const saveBg = document.querySelector(".savesMenu");
    const savesArea = saveBg.querySelector(".saves");
    const saveNameInput = saveBg.querySelector(".saveName");
    state.savesOpen = true;
    if (!inMainMenu)
        closeGameMenu(true);
    if (inMainMenu) {
        saveNameInput.classList.add("unavailable");
        saveBg.querySelector(".saveGame").classList.add("unavailable");
        saveBg.querySelector(".saveFile").classList.add("unavailable");
    }
    else {
        saveNameInput.classList.remove("unavailable");
        saveBg.querySelector(".saveGame").classList.remove("unavailable");
        saveBg.querySelector(".saveFile").classList.remove("unavailable");
    }
    tooltip(saveBg.querySelector(".saveGame"), `<f>15px<f><c>white<c>${lang["create_save"]}`);
    tooltip(saveBg.querySelector(".saveFile"), `<f>15px<f><c>white<c>${lang["create_file"]}`);
    tooltip(saveBg.querySelector(".loadFile"), `<f>15px<f><c>white<c>${lang["load_file"]}`);
    saveBg.querySelector(".saveGame").onclick = () => createNewSaveGame();
    saveBg.querySelector(".saveFile").onclick = () => saveToFile(saveNameInput.value);
    saveBg.querySelector(".loadFile").onclick = () => loadFromfile();
    saveBg.querySelector(".usedBarFill").style.width = `${(calcLocalStorageUsedSpace() / calcLocalStorageMaxSpace()) * 100}%`;
    saveBg.querySelector(".usedText").textContent = `${lang["storage_used"]}: ${(calcLocalStorageUsedSpace() / 1000).toFixed(2)}/${(calcLocalStorageMaxSpace() / 1000).toFixed(2)}mb`;
    savesArea.textContent = "";
    if (animate) {
        saveBg.style.display = "block";
        saveBg.style.animation = 'none';
        // @ts-ignore
        saveBg.offsetHeight; /* trigger reflow */
        // @ts-ignore
        saveBg.style.animation = null;
        await sleep(5);
    }
    saveNameInput.value = player.name + "_save";
    saves = saves.sort((x1, x2) => x2.time - x1.time);
    resetIds();
    let renderedSaves = 1;
    for (let save of saves) {
        if (renderedSaves < 10 && animate)
            await sleep(110);
        const saveContainer = document.createElement("div");
        const saveCanvas = document.createElement("canvas");
        const saveName = document.createElement("p");
        const buttonsContainer = document.createElement("div");
        const saveOverwrite = document.createElement("div");
        const saveIcon = document.createElement("img");
        const loadGame = document.createElement("div");
        const loadIcon = document.createElement("img");
        const deleteGame = document.createElement("div");
        const deleteIcon = document.createElement("img");
        const saveCtx = saveCanvas.getContext("2d");
        saveContainer.classList.add("saveObject");
        buttonsContainer.classList.add("buttonsContainer");
        saveIcon.src = "resources/icons/save_game.png";
        loadIcon.src = "resources/icons/load_game.png";
        deleteIcon.src = "resources/icons/trash_icon.png";
        saveOverwrite.classList.add("saveButton");
        loadGame.classList.add("saveButton");
        deleteGame.classList.add("saveButton");
        tooltip(saveOverwrite, `<f>15px<f><c>white<c>${lang["save_over"]}`);
        tooltip(loadGame, `<f>15px<f><c>white<c>${lang["load_game"]}`);
        tooltip(deleteGame, `<f>15px<f><c>white<c>${lang["delete_save"]}`);
        saveOverwrite.append(saveIcon);
        loadGame.append(loadIcon);
        deleteGame.append(deleteIcon);
        renderedSaves++;
        if (inMainMenu) {
            saveOverwrite.classList.add("unavailable");
        }
        saveOverwrite.addEventListener("click", () => {
            let saveData = {};
            saveData.player = trimPlayerObjectForSaveFile(player);
            saveData.fallenEnemies = [...fallenEnemies];
            saveData.itemData = [...itemData];
            saveData.currentMap = maps[currentMap].id;
            saveData.lootedChests = [...lootedChests];
            saveData.version = GAME_VERSION;
            let sortTime = +(new Date());
            let saveTime = new Date();
            let saveTimeString = ("0" + saveTime.getHours()).slice(-2).toString() + "." + ("0" + saveTime.getMinutes()).slice(-2).toString() + " - " + saveTime.getDate() + "." + (saveTime.getMonth() + 1) + "." + saveTime.getFullYear();
            let name = save.text.split(" ||")[0];
            saves[save.id].text = `${name} || ${saveTimeString} || Lvl ${player.level.level} ${player.race} || ${maps[currentMap].name}`;
            saves[save.id].time = sortTime;
            saves[save.id].save = saveData;
            localStorage.setItem("DOT_game_saves", JSON.stringify(saves));
            localStorage.setItem("DOT_game_settings", JSON.stringify(settings));
            player.updatePerks(true);
            player.updateAbilities();
            gotoSaveMenu(false, false);
        });
        loadGame.addEventListener("click", () => {
            var _a;
            reviveAllDeadEnemies();
            player = new PlayerCharacter(Object.assign({}, save.save.player));
            fallenEnemies = [...save.save.fallenEnemies];
            itemData = [...save.save.itemData];
            if (save.save.lootedChests)
                lootedChests = (_a = [...save.save.lootedChests]) !== null && _a !== void 0 ? _a : [];
            let foundMap = maps.findIndex((map) => map.id == save.save.currentMap);
            if (foundMap == -1)
                foundMap = save.save.currentMap;
            currentMap = foundMap;
            tree = player.classes.main.perkTree;
            turnOver = true;
            enemiesHadTurn = 0;
            state.inCombat = false;
            player.updatePerks(true);
            player.updateStatModifiers();
            player.updateAbilities();
            renderMinimap(maps[currentMap]);
            purgeDeadEnemies();
            killAllQuestEnemies();
            spawnQuestMonsters();
            convertEnemyStatModifiers();
            handleEscape();
            closeGameMenu();
            resetAllChests();
            createStaticMap();
            modifyCanvas();
            updateUI();
        });
        deleteGame.addEventListener("click", () => {
            saves.splice(save.id, 1);
            resetIds();
            localStorage.setItem("DOT_game_saves", JSON.stringify(saves));
            gotoSaveMenu(inMainMenu, false);
        });
        let renderedPlayer = new PlayerCharacter(Object.assign({}, save.save.player));
        renderedPlayer.updatePerks(true, true);
        renderedPlayer.updateStatModifiers();
        renderedPlayer.updateAbilities(true);
        let saveTime = new Date(save.time);
        let saveDateString = saveTime.getDate() + "." + (saveTime.getMonth() + 1) + "." + saveTime.getFullYear();
        let saveTimeString = ("0" + saveTime.getHours()).slice(-2).toString() + "." + ("0" + saveTime.getMinutes()).slice(-2).toString();
        let totalText = ``;
        let saveSize = (JSON.stringify(save).length / 1024).toFixed(2);
        let foundMap = maps.findIndex((map) => map.id == save.save.currentMap);
        if (foundMap == -1)
            foundMap = save.save.currentMap;
        totalText += save.text.split("||")[0];
        totalText += `§<c>goldenrod<c><f>24px<f>|§ Lvl ${renderedPlayer.level.level} ${lang[renderedPlayer.race + "_name"]} `;
        totalText += `§<c>goldenrod<c><f>24px<f>|§ ${lang["last_played"]}: ${saveDateString} @ ${saveTimeString} §<c>goldenrod<c><f>24px<f>|§ `;
        totalText += `§\n${lang["map"]}: §<c>gold<c>${(_a = maps === null || maps === void 0 ? void 0 : maps[foundMap]) === null || _a === void 0 ? void 0 : _a.name}§ `;
        totalText += `§<c>silver<c><f>24px<f>|§ ${saveSize} kb§ `;
        let verColor = "lime";
        let addVersionWarning = false;
        if ((+save.save.version + .1 < +GAME_VERSION) || !save.save.version) {
            verColor = "orange";
            addVersionWarning = true;
        }
        let versionText = `${(_c = (_b = save.save) === null || _b === void 0 ? void 0 : _b.version) === null || _c === void 0 ? void 0 : _c[0]}.${(_e = (_d = save.save) === null || _d === void 0 ? void 0 : _d.version) === null || _e === void 0 ? void 0 : _e[2]}.${(_g = (_f = save.save) === null || _f === void 0 ? void 0 : _f.version) === null || _g === void 0 ? void 0 : _g[3]}`;
        if (versionText.includes('undefined'))
            versionText = lang["old_save"];
        totalText += `§<c>silver<c><f>24px<f>|§ ${lang["version"]}: §<c>${verColor}<c>${versionText}`;
        if (addVersionWarning) {
            totalText += ` <i>resources/icons/warn.png[warningOutOfDate]<i>`;
        }
        saveName.append(textSyntax(totalText));
        saveName.style.display = "flex";
        renderPlayerOutOfMap(148, saveCanvas, saveCtx, "center", renderedPlayer);
        buttonsContainer.append(saveOverwrite, loadGame, deleteGame);
        saveContainer.append(saveCanvas, saveName, buttonsContainer);
        savesArea.append(saveContainer);
        if (addVersionWarning) {
            tooltip(saveName.querySelector(".warningOutOfDate"), lang["out_of_date"]);
        }
    }
    savesArea.scrollBy(saveMenuScroll, saveMenuScroll);
}
async function closeSaveMenu() {
    const saveBg = document.querySelector(".savesMenu");
    saveBg.style.display = "block";
    saveBg.style.animation = 'none';
    // @ts-ignore
    saveBg.offsetHeight; /* trigger reflow */
    // @ts-ignore
    saveBg.style.animation = null;
    await sleep(5);
    saveBg.style.animationName = `slideToTop`;
    saveBg.style.display = "none";
    setTimeout(() => { dim.style.height = "0%"; }, 5);
}
let saves = [];
let input = "";
function generateKey(len) {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}
function keyExists(key) {
    let found = 0;
    for (let save of saves) {
        if (save.key === key)
            found++;
    }
    return found;
}
function findIDs() {
    for (let save of saves) {
        if (!save.key) {
            save.key = generateKey(7);
            while (keyExists(save.key) > 1)
                save.key = generateKey(7);
        }
        else
            while (keyExists(save.key) > 1)
                save.key = generateKey(7);
    }
}
function resetIds() {
    for (let i = 0; i < saves.length; i++) {
        saves[i].id = i;
    }
}
function updatePlayerToPreventCrash() {
    player.updatePerks(true);
    player.updateAbilities();
}
function createNewSaveGame() {
    const saveBg = document.querySelector(".savesMenu");
    const savesArea = saveBg.querySelector(".saves");
    const saveNameInput = saveBg.querySelector(".saveName");
    let saveName = saveNameInput.value || player.name;
    let sortTime = +(new Date());
    let gameSave = {};
    gameSave.player = trimPlayerObjectForSaveFile(player);
    gameSave.fallenEnemies = [...fallenEnemies];
    gameSave.itemData = [...itemData];
    gameSave.currentMap = maps[currentMap].id;
    gameSave.lootedChests = [...lootedChests];
    gameSave.version = GAME_VERSION;
    let key = generateKey(7);
    saves.push({ text: `${saveName} ||`, save: gameSave, id: saves.length, time: sortTime, key: key });
    findIDs();
    localStorage.setItem("DOT_game_saves", JSON.stringify(saves));
    localStorage.setItem("DOT_game_settings", JSON.stringify(settings));
    localStorage.setItem("DOT_game_language", JSON.stringify(lang.language_id));
    updatePlayerToPreventCrash();
    gotoSaveMenu(false, false);
}
function saveToFile(input) {
    var saveData = (function () {
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function (data, fileName) {
            var json = JSON.stringify(data), blob = new Blob([json], { type: "octet/stream" }), url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());
    let saveArray = [
        {
            key: "player",
            data: trimPlayerObjectForSaveFile(player)
        },
        {
            key: "itemData",
            data: [...itemData]
        },
        {
            key: "lootedChests",
            data: [...lootedChests]
        },
        {
            key: "enemies",
            data: [...fallenEnemies]
        },
        {
            key: "currentMap",
            data: maps[currentMap].id
        },
        {
            key: "version",
            data: GAME_VERSION
        }
    ];
    let minutes = new Date().getMinutes();
    if (minutes < 10)
        minutes = `0${new Date().getMinutes()}`;
    saveData(saveArray, `DUNGEONS_OF_TAVARAEN-${input !== null && input !== void 0 ? input : player.name}-save_file-${new Date().getHours()}.${minutes}.txt`);
    player.updatePerks(true);
    player.updateAbilities();
}
function loadFromfile() {
    let fileInput = document.createElement("input");
    fileInput.setAttribute('type', 'file');
    fileInput.click();
    fileInput.addEventListener("change", () => HandleFile(fileInput.files[0]));
}
function HandleFile(file) {
    let reader = new FileReader();
    let text = "";
    // file reading finished successfully
    reader.addEventListener('load', function (e) {
        // contents of file in variable     
        text = e.target.result;
        FinishRead();
    });
    // read as text file
    reader.readAsText(file);
    function FinishRead() {
        let Table = JSON.parse(text);
        LoadSlotPromptFile(file.name, Table);
    }
}
function LoadSlotPromptFile(name, data) {
    LoadSlot(data);
}
function GetKey(key, table) {
    for (let object of table) {
        if (object.key == key) {
            return Object.assign({}, object);
        }
    }
}
function purgeDeadEnemies() {
    fallenEnemies.forEach(deadFoe => {
        maps.forEach((mp, index) => {
            if (deadFoe.spawnMap == index) {
                let purgeList = [];
                mp.enemies.forEach((en, _index) => {
                    if (en.spawnCords.x == deadFoe.spawnCords.x && en.spawnCords.y == deadFoe.spawnCords.y) {
                        purgeList.push(_index);
                    }
                });
                for (let __index of purgeList) {
                    maps[index].enemies.splice(__index, 1);
                }
            }
        });
    });
}
function reviveAllDeadEnemies() {
    fallenEnemies.forEach(deadFoe => {
        maps.forEach((mp, index) => {
            if (deadFoe.spawnMap == index) {
                let foe = new Enemy(Object.assign(Object.assign({}, enemies[deadFoe.id]), { cords: deadFoe.spawnCords, spawnCords: deadFoe.spawnCords, level: deadFoe.level }));
                foe.restore();
                maps[index].enemies.push(new Enemy(Object.assign({}, foe)));
            }
        });
    });
}
function killAllQuestEnemies() {
    maps.forEach((mp, index) => {
        var _a;
        for (let i = mp.enemies.length - 1; i >= 0; i--) {
            if (((_a = mp.enemies[i].questSpawn) === null || _a === void 0 ? void 0 : _a.quest) > -1)
                mp.enemies.splice(i, 1);
        }
    });
}
function convertEnemyStatModifiers() {
    maps.forEach((mp) => {
        mp.enemies.map((en) => {
            en.updateStatModifiers();
        });
    });
}
function LoadSlot(data) {
    reviveAllDeadEnemies();
    player = new PlayerCharacter(Object.assign({}, GetKey("player", data).data));
    itemData = GetKey("itemData", data).data;
    fallenEnemies = GetKey("enemies", data).data;
    lootedChests = GetKey("lootedChests", data).data;
    let foundMap = maps.findIndex((map) => map.id == GetKey("currentMap", data).data);
    if (foundMap == -1)
        foundMap = GetKey("currentMap", data).data;
    currentMap = foundMap;
    tree = player.classes.main.perkTree;
    turnOver = true;
    enemiesHadTurn = 0;
    state.inCombat = false;
    player.updatePerks(true);
    player.updateStatModifiers();
    player.updateAbilities();
    purgeDeadEnemies();
    killAllQuestEnemies();
    spawnQuestMonsters();
    handleEscape();
    closeGameMenu();
    resetAllChests();
    createStaticMap();
    modifyCanvas();
    updateUI();
}
function openTextWindow(txt) {
    state.textWindowOpen = true;
    const textWindow = document.querySelector(".textWindow");
    textWindow.style.transform = "scale(1)";
    textWindow.textContent = "";
    textWindow.append(textSyntax(txt));
}
function closeTextWindow() {
    state.textWindowOpen = false;
    const textWindow = document.querySelector(".textWindow");
    textWindow.style.transform = "scale(0)";
    textWindow.textContent = "";
}
// This function was provided by courtesy of kassu11
// thanks
function calcLocalStorageMaxSpace() {
    try {
        for (let tuhat = 1000; tuhat < 100005; tuhat += 1000)
            localStorage.tuhat = "a".repeat(1024 * tuhat);
    }
    catch (_a) { }
    try {
        for (let sata = 100; sata < 1005; sata += 100)
            localStorage.sata = "a".repeat(1024 * sata);
    }
    catch (_b) { }
    try {
        for (let kymmenen = 10; kymmenen < 105; kymmenen += 10)
            localStorage.kymppi = "a".repeat(1024 * kymmenen);
    }
    catch (_c) { }
    try {
        for (let single = 1; single < 15; single++)
            localStorage.single = "a".repeat(1024 * single);
    }
    catch (_d) { }
    try {
        for (let half = 20; half > 0; half--)
            localStorage.half = "a".repeat(Math.ceil(1024 / half));
    }
    catch (_e) { }
    try {
        for (let pieni = 1; pieni < 512; pieni++)
            localStorage.pieni = "a".repeat(pieni);
    }
    catch (_f) { }
    const endSpace = calcLocalStorageUsedSpace();
    localStorage.removeItem("tuhat");
    localStorage.removeItem("sata");
    localStorage.removeItem("kymppi");
    localStorage.removeItem("single");
    localStorage.removeItem("half");
    localStorage.removeItem("pieni");
    return Math.round(endSpace);
}
function calcLocalStorageUsedSpace() {
    let total = 0;
    for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            const length = (localStorage[key].length + key.length) * 2;
            total += length;
        }
    }
    return parseInt((total / 1024).toFixed(2));
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
}
//# sourceMappingURL=menu.js.map