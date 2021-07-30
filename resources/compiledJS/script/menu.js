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
        action: () => closeGameMenu(false, true)
    },
    {
        id: "menu_new_game",
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
const menuSettings = [
    {
        id: "setting_log_enemy_movement",
        type: "toggle",
    },
    {
        id: "setting_test",
        type: "toggle",
    },
    {
        id: "setting_test",
        type: "toggle",
    },
    {
        id: "setting_test",
        type: "toggle",
    },
    {
        id: "setting_test",
        type: "toggle",
    },
    {
        id: "setting_test",
        type: "toggle",
    },
    {
        id: "setting_test",
        type: "toggle",
    },
    {
        id: "setting_test",
        type: "toggle",
    },
    {
        id: "setting_test",
        type: "toggle",
    },
    {
        id: "setting_game_language",
        type: "languageSelection"
    }
];
setTimeout(() => {
    let options = JSON.parse(localStorage.getItem(`DOT_game_settings`));
    if (options) {
        settings = new gameSettings(options);
        lang = eval(JSON.parse(localStorage.getItem(`DOT_game_language`)));
    }
    menuOpen = true;
    gotoMainMenu();
}, 300);
let saveGamesOpen = false;
const languages = ["english", "finnish"];
const mainMenu = document.querySelector(".mainMenu");
const menu = document.querySelector(".gameMenu");
const dim = document.querySelector(".dim");
const mainMenuButtons = mainMenu.querySelector(".menuButtons");
async function openGameMenu() {
    var _a;
    menu.textContent = "";
    setTimeout(() => { dim.style.height = "100%"; }, 150);
    for (let button of menuOptions) {
        await sleep(150);
        const frame = document.createElement("div");
        frame.textContent = (_a = lang[button.id]) !== null && _a !== void 0 ? _a : button.id;
        frame.classList.add("menuButton");
        frame.classList.add(button.id);
        frame.style.animationName = "popIn";
        if (button.action) {
            frame.addEventListener("click", () => button.action());
        }
        menu.append(frame);
    }
}
async function closeGameMenu(noDim = false, escape = false, keepMainMenu = false) {
    const reverseOptions = [...menuOptions].reverse();
    if (!noDim) {
        setTimeout(() => { dim.style.height = "0%"; }, 150);
        const settingsBackground = document.querySelector(".settingsMenu");
        settingsBackground.textContent = "";
    }
    if (!keepMainMenu) {
        setTimeout(() => { mainMenu.style.display = "none"; }, 575);
        mainMenu.style.opacity = "0";
    }
    for (let button of reverseOptions) {
        try {
            await sleep(150);
            const frame = menu.querySelector(`.${button.id}`);
            frame.style.animationName = "popOut";
            setTimeout(() => { frame.remove(); }, 175);
        }
        catch (_a) { }
    }
    if (escape)
        handleEscape();
}
async function gotoSettingsMenu(inMainMenu = false) {
    var _a, _b;
    if (!inMainMenu)
        closeGameMenu(true);
    const settingsBackground = document.querySelector(".settingsMenu");
    settingsBackground.textContent = "";
    for (let setting of menuSettings) {
        await sleep(75);
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
                if (settings[_setting])
                    toggleBox.textContent = "X";
                else
                    toggleBox.textContent = "";
            });
            container.append(text, toggleBox);
            settingsBackground.append(container);
        }
        else if (setting.type == "languageSelection") {
            container.classList.add("languageSelection");
            const text = document.createElement("p");
            text.textContent = (_b = lang[setting.id]) !== null && _b !== void 0 ? _b : setting.id;
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
                    player.updateAbilities();
                    gotoSettingsMenu(true);
                });
                container.append(langButton);
            });
            settingsBackground.append(container);
        }
    }
}
async function gotoMainMenu() {
    var _a;
    menu.textContent = "";
    setTimeout(() => { dim.style.height = "0%"; }, 150);
    mainMenu.style.display = "block";
    await sleep(20);
    mainMenu.style.opacity = "1";
    mainMenuButtons.textContent = "";
    for (let button of mainButtons) {
        await sleep(200);
        const frame = document.createElement("div");
        frame.textContent = (_a = lang[button.id]) !== null && _a !== void 0 ? _a : button.id;
        frame.classList.add("menuButton");
        frame.classList.add(button.id);
        frame.style.animationName = "slideFromRight";
        if (button.action) {
            frame.addEventListener("click", () => button.action());
        }
        mainMenuButtons.append(frame);
    }
}
async function gotoSaveMenu(inMainMenu = false, animate = true) {
    saveGamesOpen = true;
    hideHover();
    saves = JSON.parse(localStorage.getItem(`DOT_game_saves`)) || [];
    if (!inMainMenu)
        closeGameMenu(true);
    const saveBg = document.querySelector(".savesMenu");
    const savesArea = saveBg.querySelector(".saves");
    const saveNameInput = saveBg.querySelector(".saveName");
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
    savesArea.textContent = "";
    if (animate) {
        saveBg.style.display = "block";
        saveBg.style.animation = 'none';
        // @ts-ignore
        saveBg.offsetHeight; /* trigger reflow */
        // @ts-ignore
        saveBg.style.animation = null;
        await sleep(5);
        saveBg.style.animationName = `slideFromTop`;
        await sleep(375);
    }
    saveNameInput.value = player.name + "_save";
    saves = saves.sort((x1, x2) => x2.time - x1.time);
    resetIds();
    for (let save of saves) {
        await sleep(100);
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
        if (inMainMenu) {
            saveOverwrite.classList.add("unavailable");
        }
        saveOverwrite.addEventListener("click", () => {
            let saveData = {};
            saveData.player = Object.assign({}, player);
            saveData.fallenEnemies = [...fallenEnemies];
            saveData.itemData = [...itemData];
            saveData.currentMap = currentMap;
            let sortTime = +(new Date());
            let saveTime = new Date();
            let saveTimeString = ("0" + saveTime.getHours()).slice(-2).toString() + "." + ("0" + saveTime.getMinutes()).slice(-2).toString() + " - " + saveTime.getDate() + "." + (saveTime.getMonth() + 1) + "." + saveTime.getFullYear();
            let name = save.text.split(" ||")[0];
            saves[save.id].text = `${name} || ${saveTimeString} || Lvl ${player.level.level} ${player.race} || ${maps[currentMap].name}`;
            saves[save.id].time = sortTime;
            saves[save.id].save = saveData;
            localStorage.setItem("DOT_game_saves", JSON.stringify(saves));
            localStorage.setItem("DOT_game_settings", JSON.stringify(settings));
            gotoSaveMenu(false, false);
        });
        loadGame.addEventListener("click", () => {
            player = new PlayerCharacter(Object.assign({}, save.save.player));
            fallenEnemies = [...save.save.fallenEnemies];
            itemData = [...save.save.itemData];
            currentMap = save.save.currentMap;
            handleEscape();
            closeGameMenu();
            modifyCanvas();
            updateUI();
            player.updateAbilities();
        });
        deleteGame.addEventListener("click", () => {
            saves.splice(save.id, 1);
            resetIds();
            localStorage.setItem("DOT_game_saves", JSON.stringify(saves));
            gotoSaveMenu(false, false);
        });
        saveName.textContent = save.text;
        renderPlayerOutOfMap(148, saveCanvas, saveCtx, "center", save.save.player);
        await sleep(25);
        buttonsContainer.append(saveOverwrite, loadGame, deleteGame);
        saveContainer.append(saveCanvas, saveName, buttonsContainer);
        savesArea.append(saveContainer);
    }
}
async function closeSaveMenu() {
    saveGamesOpen = false;
    const saveBg = document.querySelector(".savesMenu");
    saveBg.style.display = "block";
    saveBg.style.animation = 'none';
    // @ts-ignore
    saveBg.offsetHeight; /* trigger reflow */
    // @ts-ignore
    saveBg.style.animation = null;
    await sleep(5);
    saveBg.style.animationName = `slideToTop`;
    await sleep(725);
    saveBg.style.display = "none";
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
function createNewSaveGame() {
    const saveBg = document.querySelector(".savesMenu");
    const savesArea = saveBg.querySelector(".saves");
    const saveNameInput = saveBg.querySelector(".saveName");
    let saveName = saveNameInput.value || player.name;
    let sortTime = +(new Date());
    let saveTime = new Date();
    let gameSave = {};
    gameSave.player = Object.assign({}, player);
    gameSave.fallenEnemies = [...fallenEnemies];
    gameSave.itemData = [...itemData];
    gameSave.currentMap = currentMap;
    let saveTimeString = ("0" + saveTime.getHours()).slice(-2).toString() + "." + ("0" + saveTime.getMinutes()).slice(-2).toString() + " - " + saveTime.getDate() + "." + (saveTime.getMonth() + 1) + "." + saveTime.getFullYear();
    let key = generateKey(7);
    saves.push({ text: `${saveName} || ${saveTimeString} || Lvl ${player.level.level} ${player.race} || ${maps[currentMap].name}`, save: gameSave, id: saves.length, time: sortTime, key: key });
    findIDs();
    localStorage.setItem("DOT_game_saves", JSON.stringify(saves));
    localStorage.setItem("DOT_game_settings", JSON.stringify(settings));
    localStorage.setItem("DOT_game_language", JSON.stringify(lang.language_id));
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
            data: Object.assign({}, player)
        },
        {
            key: "itemData",
            data: [...itemData]
        },
        {
            key: "enemies",
            data: [...fallenEnemies]
        },
        {
            key: "currentMap",
            data: currentMap
        }
    ];
    let minutes = new Date().getMinutes();
    if (minutes < 10)
        minutes = `0${new Date().getMinutes()}`;
    saveData(saveArray, `DUNGEONS_OF_TAVARAEN-${input !== null && input !== void 0 ? input : player.name}-save_file-${new Date().getHours()}.${minutes}.txt`);
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
function LoadSlot(data) {
    player = new PlayerCharacter(GetKey("player", data).data);
    itemData = GetKey("itemData", data).data;
    fallenEnemies = GetKey("enemies", data).data;
    currentMap = GetKey("currentMap", data).data;
    handleEscape();
    closeGameMenu();
    modifyCanvas();
    player.updateAbilities();
    updateUI();
}
// const layer = document.querySelector<HTMLCanvasElement>(`.enemy${enemyIndex(target.cords)}`);
// layer.style.animation = 'none';
// // @ts-ignore
// layer.offsetHeight; /* trigger reflow */
// // @ts-ignore
// layer.style.animation = null;
// layer.style.animationName = `charHurt`;
//# sourceMappingURL=menu.js.map