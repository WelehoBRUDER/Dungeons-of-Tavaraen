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

const menuSettings = [
  {
    id: "setting_log_enemy_movement",
    type: "toggle",
  },
  {
    id: "setting_toggle_minimap",
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
    type: "hotkey",
  },
  {
    id: "setting_game_language",
    type: "languageSelection"
  }
];

const state = {
  inCombat: false as boolean,
  clicked: false as boolean,
  isSelected: false as boolean,
  abiSelected: {} as any,
  invOpen: false as boolean,
  charOpen: false as boolean,
  perkOpen: false as boolean,
  menuOpen: false as boolean,
  titleScreen: false as boolean,
  optionsOpen: false as boolean,
  savesOpen: false as boolean
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
  else if (state.menuOpen && !state.titleScreen) {
    closeGameMenu(false, false, false);
    state.menuOpen = false;
  }
  else if (!state.isSelected) {
    openGameMenu();
    state.menuOpen = true;
  }
  state.isSelected = false;
  state.abiSelected = {};
  updateUI();
  contextMenu.textContent = "";
  assignContainer.style.display = "none";
}

setTimeout(() => {
  let options = JSON.parse(localStorage.getItem(`DOT_game_settings`));
  if (options) {
    settings = new gameSettings(options);
    lang = eval(JSON.parse(localStorage.getItem(`DOT_game_language`)));
  }
  state.menuOpen = true;
  state.titleScreen = true;
  gotoMainMenu();
  tooltip(document.querySelector(".invScrb"), `${lang["setting_hotkey_inv"]} [${settings["hotkey_inv"]}]`);
  tooltip(document.querySelector(".chaScrb"), `${lang["setting_hotkey_char"]} [${settings["hotkey_char"]}]`);
  tooltip(document.querySelector(".perScrb"), `${lang["setting_hotkey_perk"]} [${settings["hotkey_perk"]}]`);
  tooltip(document.querySelector(".escScrb"), `${lang["open_menu"]} [ESCAPE]`);
}, 1200);

const languages = ["english", "finnish"] as any;

const mainMenu = document.querySelector<HTMLDivElement>(".mainMenu");
const menu = document.querySelector<HTMLDivElement>(".gameMenu");
const dim = document.querySelector<HTMLDivElement>(".dim");
const mainMenuButtons = mainMenu.querySelector<HTMLDivElement>(".menuButtons");

function openGameMenu() {
  menu.textContent = "";
  setTimeout(() => { dim.style.height = "100%"; }, 5);
  for (let button of menuOptions) {
    const frame = document.createElement("div");
    frame.textContent = lang[button.id] ?? button.id;
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
    const settingsBackground = document.querySelector<HTMLDivElement>(".settingsMenu");
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
      const frame = menu.querySelector<HTMLDivElement>(`.${button.id}`);
      frame.remove();
    }
    catch { console.log("This doesn't affect anything"); }
  }
  if (escape) handleEscape();
}

let selectingHotkey = "";
window.addEventListener("keyup", (e) => {
  if (selectingHotkey != "") {
    settings[selectingHotkey] = e.key;
    document.querySelector(`.${selectingHotkey}`).childNodes[1].textContent = e.key.toUpperCase();
    tooltip(document.querySelector(".invScrb"), `${lang["setting_hotkey_inv"]} [${settings["hotkey_inv"]}]`);
    tooltip(document.querySelector(".chaScrb"), `${lang["setting_hotkey_char"]} [${settings["hotkey_char"]}]`);
    tooltip(document.querySelector(".perScrb"), `${lang["setting_hotkey_perk"]} [${settings["hotkey_perk"]}]`);
    tooltip(document.querySelector(".escScrb"), `${lang["open_menu"]} [ESCAPE]`);
    selectingHotkey = "";
  }
});

async function closeSettingsMenu() {
  const settingsBackground = document.querySelector<HTMLDivElement>(".settingsMenu");
  settingsBackground.textContent = "";
  state.optionsOpen = false;
  setTimeout(() => { dim.style.height = "0%"; }, 5);
}

function gotoSettingsMenu(inMainMenu = false) {
  selectingHotkey = "";
  state.optionsOpen = true;
  if (!inMainMenu) closeGameMenu(true);
  const settingsBackground = document.querySelector<HTMLDivElement>(".settingsMenu");
  settingsBackground.textContent = "";
  for (let setting of menuSettings) {
    const container = document.createElement("div");
    if (setting.type == "toggle") {
      container.classList.add("toggle");
      const text = document.createElement("p");
      const toggleBox = document.createElement("div");
      text.textContent = lang[setting.id] ?? setting.id;
      let _setting = setting.id.replace("setting_", "");
      if (settings[_setting]) toggleBox.textContent = "X";
      else toggleBox.textContent = "";
      container.addEventListener("click", tog => {
        settings[_setting] = !settings[_setting];
        if (settings[_setting]) toggleBox.textContent = "X";
        else toggleBox.textContent = "";
      });
      container.append(text, toggleBox);
      settingsBackground.append(container);
    }
    else if (setting.type == "hotkey") {
      container.classList.add("hotkeySelection");
      const text = document.createElement("p");
      text.textContent = lang[setting.id] ?? setting.id;
      let _setting = setting.id.replace("setting_", "");
      container.classList.add(_setting);
      const keyButton = document.createElement("div");
      keyButton.textContent = settings[_setting].toUpperCase();
      if (settings[_setting] == " ") keyButton.textContent = lang["space_key"];
      container.addEventListener("click", () => {
        if (selectingHotkey == "") {
          keyButton.textContent = "<>";
          selectingHotkey = _setting;
        }
      });
      container.append(text, keyButton);
      settingsBackground.append(container);
    }
    else if (setting.type == "languageSelection") {
      container.classList.add("languageSelection");
      const text = document.createElement("p");
      text.textContent = lang[setting.id] ?? setting.id;
      container.append(text);
      languages.forEach((language: string) => {
        const langButton = document.createElement("div");
        langButton.textContent = lang[language];
        if (language == lang["language_id"]) langButton.classList.add("selectedLang");
        langButton.addEventListener("click", () => {
          container.childNodes.forEach((child: any) => {
            try { child.classList.remove("selectedLang"); }
            catch { }
          });
          lang = eval(language);
          tooltip(document.querySelector(".invScrb"), `${lang["setting_hotkey_inv"]} [${settings["hotkey_inv"]}]`);
          tooltip(document.querySelector(".chaScrb"), `${lang["setting_hotkey_char"]} [${settings["hotkey_char"]}]`);
          tooltip(document.querySelector(".perScrb"), `${lang["setting_hotkey_perk"]} [${settings["hotkey_perk"]}]`);
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

async function gotoMainMenu() {
  menu.textContent = "";
  setTimeout(() => { dim.style.height = "0%"; }, 150);
  mainMenu.style.display = "block";
  await sleep(10);
  mainMenu.style.opacity = "1";
  mainMenuButtons.textContent = "";
  for (let button of mainButtons) {
    const frame = document.createElement("div");
    frame.textContent = lang[button.id] ?? button.id;
    frame.classList.add("menuButton");
    frame.classList.add(button.id);
    if (button.action) {
      frame.addEventListener("click", () => button.action());
    }
    mainMenuButtons.append(frame);
  }
}

async function gotoSaveMenu(inMainMenu = false, animate: boolean = true) {
  hideHover();
  saves = JSON.parse(localStorage.getItem(`DOT_game_saves`)) || [];
  state.savesOpen = true;
  if (!inMainMenu) closeGameMenu(true);
  const saveBg = document.querySelector<HTMLDivElement>(".savesMenu");
  const savesArea = saveBg.querySelector<HTMLDivElement>(".saves");
  const saveNameInput = saveBg.querySelector<HTMLInputElement>(".saveName");
  if (inMainMenu) {
    saveNameInput.classList.add("unavailable");
    saveBg.querySelector<HTMLDivElement>(".saveGame").classList.add("unavailable");
    saveBg.querySelector<HTMLDivElement>(".saveFile").classList.add("unavailable");
  }
  else {
    saveNameInput.classList.remove("unavailable");
    saveBg.querySelector<HTMLDivElement>(".saveGame").classList.remove("unavailable");
    saveBg.querySelector<HTMLDivElement>(".saveFile").classList.remove("unavailable");
  }
  tooltip(saveBg.querySelector<HTMLDivElement>(".saveGame"), `<f>15px<f><c>white<c>${lang["create_save"]}`);
  tooltip(saveBg.querySelector<HTMLDivElement>(".saveFile"), `<f>15px<f><c>white<c>${lang["create_file"]}`);
  tooltip(saveBg.querySelector<HTMLDivElement>(".loadFile"), `<f>15px<f><c>white<c>${lang["load_file"]}`);
  saveBg.querySelector<HTMLDivElement>(".saveGame").onclick = () => createNewSaveGame();
  saveBg.querySelector<HTMLDivElement>(".saveFile").onclick = () => saveToFile(saveNameInput.value);
  saveBg.querySelector<HTMLDivElement>(".loadFile").onclick = () => loadFromfile();
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
    if (renderedSaves < 15) await sleep(100);
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
      let saveData = {} as any;
      saveData.player = { ...player };
      saveData.fallenEnemies = [...fallenEnemies];
      saveData.itemData = [...itemData];
      saveData.currentMap = currentMap;
      saveData.lootedChests = [...lootedChests];
      let sortTime = +(new Date());
      let saveTime = new Date();
      let saveTimeString: string = ("0" + saveTime.getHours()).slice(-2).toString() + "." + ("0" + saveTime.getMinutes()).slice(-2).toString() + " - " + saveTime.getDate() + "." + (saveTime.getMonth() + 1) + "." + saveTime.getFullYear();
      let name = save.text.split(" ||")[0];
      saves[save.id].text = `${name} || ${saveTimeString} || Lvl ${player.level.level} ${player.race} || ${maps[currentMap].name}`;
      saves[save.id].time = sortTime;
      saves[save.id].save = saveData;
      localStorage.setItem("DOT_game_saves", JSON.stringify(saves));
      localStorage.setItem("DOT_game_settings", JSON.stringify(settings));
      gotoSaveMenu(false, false);
    });
    loadGame.addEventListener("click", () => {
      reviveAllDeadEnemies();
      player = new PlayerCharacter({ ...save.save.player });
      fallenEnemies = [...save.save.fallenEnemies];
      itemData = [...save.save.itemData];
      if (save.save.lootedChests) lootedChests = [...save.save.lootedChests] ?? [];
      currentMap = save.save.currentMap;
      tree = player.classes.main.perkTree;
      player.updateAbilities();
      purgeDeadEnemies();
      handleEscape();
      closeGameMenu();
      modifyCanvas();
      updateUI();
    });
    deleteGame.addEventListener("click", () => {
      saves.splice(save.id, 1);
      resetIds();
      localStorage.setItem("DOT_game_saves", JSON.stringify(saves));
      gotoSaveMenu(false, false);
    });
    saveName.textContent = save.text;
    let renderedPlayer = new PlayerCharacter({ ...save.save.player });
    renderPlayerOutOfMap(148, saveCanvas, saveCtx, "center", renderedPlayer);
    await sleep(5);
    buttonsContainer.append(saveOverwrite, loadGame, deleteGame);
    saveContainer.append(saveCanvas, saveName, buttonsContainer);
    savesArea.append(saveContainer);
  }
}

async function closeSaveMenu() {
  const saveBg = document.querySelector<HTMLDivElement>(".savesMenu");
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

let saves: Array<any> = [];
let input: string = "";

function generateKey(len: number) {
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

function keyExists(key: string) {
  let found = 0;
  for (let save of saves) {
    if (save.key === key) found++;
  }
  return found;
}

function findIDs() {
  for (let save of saves) {
    if (!save.key) {
      save.key = generateKey(7);
      while (keyExists(save.key) > 1) save.key = generateKey(7);
    } else while (keyExists(save.key) > 1) save.key = generateKey(7);
  }
}

function resetIds() {
  for (let i = 0; i < saves.length; i++) {
    saves[i].id = i;
  }
}

function createNewSaveGame() {
  const saveBg = document.querySelector<HTMLDivElement>(".savesMenu");
  const savesArea = saveBg.querySelector<HTMLDivElement>(".saves");
  const saveNameInput = saveBg.querySelector<HTMLInputElement>(".saveName");
  let saveName = saveNameInput.value || player.name;
  let sortTime = +(new Date());
  let saveTime = new Date();
  let gameSave = {} as any;
  gameSave.player = { ...player };
  gameSave.fallenEnemies = [...fallenEnemies];
  gameSave.itemData = [...itemData];
  gameSave.currentMap = currentMap;
  gameSave.lootedChests = [...lootedChests];
  let saveTimeString: string = ("0" + saveTime.getHours()).slice(-2).toString() + "." + ("0" + saveTime.getMinutes()).slice(-2).toString() + " - " + saveTime.getDate() + "." + (saveTime.getMonth() + 1) + "." + saveTime.getFullYear();
  let key = generateKey(7);
  saves.push({ text: `${saveName} || ${saveTimeString} || Lvl ${player.level.level} ${player.race} || ${maps[currentMap].name}`, save: gameSave, id: saves.length, time: sortTime, key: key });
  findIDs();
  localStorage.setItem("DOT_game_saves", JSON.stringify(saves));
  localStorage.setItem("DOT_game_settings", JSON.stringify(settings));
  localStorage.setItem("DOT_game_language", JSON.stringify(lang.language_id));
  gotoSaveMenu(false, false);
}

function saveToFile(input: string) {
  var saveData = (function () {
    let a = document.createElement("a") as any;
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data: any, fileName: string) {
      var json = JSON.stringify(data),
        blob = new Blob([json], { type: "octet/stream" }),
        url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    };

  }());
  let saveArray = [
    {
      key: "player",
      data: { ...player }
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
      data: currentMap
    }
  ];
  let minutes: any = new Date().getMinutes();
  if (minutes < 10) minutes = `0${new Date().getMinutes()}`;
  saveData(saveArray, `DUNGEONS_OF_TAVARAEN-${input ?? player.name}-save_file-${new Date().getHours()}.${minutes}.txt`);
}

function loadFromfile() {
  let fileInput = document.createElement("input");
  fileInput.setAttribute('type', 'file');
  fileInput.click();
  fileInput.addEventListener("change", () => HandleFile(fileInput.files[0]));
}

function HandleFile(file: any) {
  let reader = new FileReader();
  let text = "";

  // file reading finished successfully
  reader.addEventListener('load', function (e) {
    // contents of file in variable     
    text = e.target.result as any;
    FinishRead();
  });

  // read as text file
  reader.readAsText(file);

  function FinishRead() {
    let Table = JSON.parse(text);
    LoadSlotPromptFile(file.name, Table);
  }
}


function LoadSlotPromptFile(name: string, data: any) {
  LoadSlot(data);
}

function GetKey(key: string, table: any) {
  for (let object of table) {
    if (object.key == key) {
      return { ...object };
    }
  }
}

function purgeDeadEnemies() {
  fallenEnemies.forEach(deadFoe => {
    maps.forEach((mp, index) => {
      if (deadFoe.spawnMap == index) {
        let purgeList: Array<number> = [];
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
        let foe = new Enemy({ ...deadFoe });
        foe.restore();
        maps[index].enemies.push(new Enemy({ ...foe }));
      }
    });
  });
}

function LoadSlot(data: any) {
  reviveAllDeadEnemies();
  player = new PlayerCharacter({ ...GetKey("player", data).data });
  itemData = GetKey("itemData", data).data;
  fallenEnemies = GetKey("enemies", data).data;
  lootedChests = GetKey("lootedChests", data).data;
  currentMap = GetKey("currentMap", data).data;
  tree = player.classes.main.perkTree;
  player.updateAbilities();
  player.updatePerks();
  purgeDeadEnemies();
  handleEscape();
  closeGameMenu();
  modifyCanvas();
  updateUI();
}