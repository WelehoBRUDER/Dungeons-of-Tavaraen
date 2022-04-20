"use strict";
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
    else if (state.smithOpen) {
        closeSmithingWindow();
    }
    else if (!state.isSelected && !player.isDead) {
        openGameMenu();
        state.menuOpen = true;
    }
    if (state.areaMapOpen) {
        state.areaMapOpen = false;
        moveAreaMap();
    }
    state.isSelected = false;
    state.abiSelected = {};
    mapSelection.x = null;
    mapSelection.y = null;
    closeTextWindow();
    updateUI();
    hideHover();
    renderTileHover(player.cords);
    contextMenu.textContent = "";
    assignContainer.style.display = "none";
    if (player.isDead)
        spawnDeathScreen();
}
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
        catch (err) {
            if (DEVMODE)
                displayText(`<c>red<c>${err} at line menu:398`);
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
                        catch (err) {
                            if (DEVMODE)
                                displayText(`<c>red<c>${err} at line menu:520`);
                        }
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
    await helper.sleep(10);
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
function convertEnemyStatModifiers() {
    maps.forEach((mp) => {
        mp.enemies.map((en) => {
            en.updateStatModifiers();
        });
    });
}
function LoadSlot(data) {
    helper.reviveAllDeadEnemies();
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
    helper.purgeDeadEnemies();
    helper.killAllQuestEnemies();
    spawnQuestMonsters();
    handleEscape();
    closeGameMenu();
    resetAllChests();
    createStaticMap();
    modifyCanvas(true);
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