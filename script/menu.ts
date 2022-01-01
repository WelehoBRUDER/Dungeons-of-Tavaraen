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

interface grades {
  [common: string]: any;
  uncommon: any;
  rare: any;
  mythical: any;
  legendary: any;
}

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
} as grades;

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
  savesOpen: false as boolean,
  displayingTextHistory: false as boolean,
  rangedMode: false as boolean,
  textWindowOpen: false as boolean,
  dialogWindow: false as boolean,
  storeOpen: false as boolean,
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
  else if(state.displayingTextHistory) {
    state.displayingTextHistory = false
    displayAllTextHistory();
  }
  else if(state.rangedMode) {
    state.rangedMode = false;
    renderTileHover(player.cords, null);
  }
  else if (state.menuOpen && !state.titleScreen) {
    closeGameMenu(false, false, false);
    state.menuOpen = false;
  }
  else if(state.dialogWindow) {
    exitDialog();
  }
  else if(state.storeOpen) {
    cancelTransaction();
  }
  else if (!state.isSelected) {
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
  renderMinimap(maps[currentMap]);
  createStaticMap();
  modifyCanvas(true);
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
  hideHover();
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
  hideHover();
}

function scaleUI(scale: number) {
  settings["ui_scale"] = scale * 100;
  document.documentElement.style.setProperty('--ui-scale', scale.toString());
  moveMinimap();
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
        moveMinimap();
        if (settings[_setting]) toggleBox.textContent = "X";
        else toggleBox.textContent = "";
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
      text.textContent = lang[setting.id] ?? setting.id;
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
      }
      text.append(textVal);
      container.append(text, slider);
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

function trimPlayerObjectForSaveFile(playerObject: PlayerCharacter) {
  const trimmed: PlayerCharacter = { ...playerObject };
  trimmed.inventory.forEach((itm: any, index: number) =>{
    if(itm.stackable) trimmed.inventory[index] = {id: itm.id, type: itm.type, amount: itm.amount};
    else if(itm.level) trimmed.inventory[index] = {id: itm.id, type: itm.type, level: itm.level};
    else trimmed.inventory[index] = {id: itm.id, type: itm.type};
  });
  trimmed.abilities.forEach((abi: any, index: number) => {
    // @ts-ignore
    trimmed.abilities[index] = {id: abi.id, equippedSlot: abi.equippedSlot};
  });
  trimmed.allModifiers = {};
  equipSlots.forEach((slot: string) => {
    if(trimmed[slot]?.id) {
      trimmed[slot] = { id: trimmed[slot].id, type: trimmed[slot].type, level: trimmed[slot].level ?? 0 };
    }
  });
  trimmed.perks.forEach((perk: any, index: number) => {
    trimmed.perks[index] = {id: perk.id, tree: perk.tree, commandsExecuted: perk.commandsExecuted};
  });
  return trimmed;
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
  saveBg.querySelector<HTMLDivElement>(".usedBarFill").style.width = `${(calcLocalStorageUsedSpace() / calcLocalStorageMaxSpace()) * 100}%`;
  saveBg.querySelector<HTMLParagraphElement>(".usedText").textContent = `${lang["storage_used"]}: ${(calcLocalStorageUsedSpace() / 1000).toFixed(2)}/${(calcLocalStorageMaxSpace() / 1000).toFixed(2)}mb`;
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
  await sleep(5);
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
      saveData.player = trimPlayerObjectForSaveFile(player);
      saveData.fallenEnemies = [...fallenEnemies];
      saveData.itemData = [...itemData];
      saveData.currentMap = maps[currentMap].id;
      saveData.lootedChests = [...lootedChests];
      saveData.version = GAME_VERSION;
      let sortTime = +(new Date());
      let saveTime = new Date();
      let saveTimeString: string = ("0" + saveTime.getHours()).slice(-2).toString() + "." + ("0" + saveTime.getMinutes()).slice(-2).toString() + " - " + saveTime.getDate() + "." + (saveTime.getMonth() + 1) + "." + saveTime.getFullYear();
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
      reviveAllDeadEnemies();
      player = new PlayerCharacter({ ...save.save.player });
      fallenEnemies = [...save.save.fallenEnemies];
      itemData = [...save.save.itemData];
      if (save.save.lootedChests) lootedChests = [...save.save.lootedChests] ?? [];
      let foundMap = maps.findIndex((map: any) => map.id == save.save.currentMap);
      if(foundMap == -1) foundMap = save.save.currentMap;
      currentMap = foundMap;
      tree = player.classes.main.perkTree;
      turnOver = true;
      enemiesHadTurn = 0;
      state.inCombat = false;
      player.updatePerks(true);
      player.updateAbilities();
      purgeDeadEnemies();
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
      gotoSaveMenu(false, false);
    });
    let renderedPlayer = new PlayerCharacter({ ...save.save.player });
    renderedPlayer.updatePerks(true, true)
    renderedPlayer.updateAbilities(true);
    let saveTime = new Date(save.time);
    let saveDateString: string = saveTime.getDate() + "." + (saveTime.getMonth() + 1) + "." + saveTime.getFullYear();
    let saveTimeString: string = ("0" + saveTime.getHours()).slice(-2).toString() + "." + ("0" + saveTime.getMinutes()).slice(-2).toString();
    let totalText = ``;
    let saveSize = (JSON.stringify(save).length / 1024).toFixed(2);
    let foundMap = maps.findIndex((map: any) => map.id == save.save.currentMap);
    if(foundMap == -1) foundMap = save.save.currentMap;
    totalText += save.text.split("||")[0];
    totalText += `§<c>goldenrod<c><f>24px<f>|§ Lvl ${renderedPlayer.level.level} ${lang[renderedPlayer.race + "_name"]} `;
    totalText += `§<c>goldenrod<c><f>24px<f>|§ ${lang["last_played"]}: ${saveDateString} @ ${saveTimeString} §<c>goldenrod<c><f>24px<f>|§ `;
    totalText += `§\n${lang["map"]}: §<c>gold<c>${maps?.[foundMap]?.name}§ `;
    totalText += `§<c>silver<c><f>24px<f>|§ ${saveSize} kb§ `;
    let verColor: string = "lime";
    let addVersionWarning: boolean = false;
    if((+save.save.version + .1 < +GAME_VERSION) || !save.save.version) {
      verColor = "orange";
      addVersionWarning = true;
    } 
    
    let versionText = `${save.save?.version?.[0]}.${save.save?.version?.[2]}.${save.save?.version?.[3]}`;
    if(versionText.includes('undefined')) versionText = lang["old_save"];
    totalText += `§<c>silver<c><f>24px<f>|§ ${lang["version"]}: §<c>${verColor}<c>${versionText}`;
    if(addVersionWarning) {
      totalText += ` <i>resources/icons/warn.png[warningOutOfDate]<i>`;
    }
    saveName.append(textSyntax(totalText));
    saveName.style.display = "flex";
    renderPlayerOutOfMap(148, saveCanvas, saveCtx, "center", renderedPlayer);
    await sleep(5);
    buttonsContainer.append(saveOverwrite, loadGame, deleteGame);
    saveContainer.append(saveCanvas, saveName, buttonsContainer);
    savesArea.append(saveContainer);
    if(addVersionWarning) {
      tooltip(saveName.querySelector(".warningOutOfDate"), lang["out_of_date"]);
    }
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
  let gameSave = {} as any;
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
  let minutes: any = new Date().getMinutes();
  if (minutes < 10) minutes = `0${new Date().getMinutes()}`;
  saveData(saveArray, `DUNGEONS_OF_TAVARAEN-${input ?? player.name}-save_file-${new Date().getHours()}.${minutes}.txt`);
  player.updatePerks(true);
  player.updateAbilities();
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
    maps.forEach((mp: any, index: number) => {
      if (deadFoe.spawnMap == index) {
        let purgeList: Array<number> = [];
        mp.enemies.forEach((en: any, _index: number) => {
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
    maps.forEach((mp: any, index: number) => {
      if (deadFoe.spawnMap == index) {
        let foe = new Enemy({ ...enemies[deadFoe.id], cords: deadFoe.spawnCords, spawnCords: deadFoe.spawnCords, level: deadFoe.level });
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
  let foundMap = maps.findIndex((map: any) => map.id == GetKey("currentMap", data).data);
  if(foundMap == -1) foundMap = GetKey("currentMap", data).data;
  currentMap = foundMap;
  tree = player.classes.main.perkTree;
  turnOver = true;
  enemiesHadTurn = 0;
  state.inCombat = false;
  player.updatePerks(true);
  player.updateAbilities();
  purgeDeadEnemies();
  handleEscape();
  closeGameMenu();
  resetAllChests();
  createStaticMap();
  modifyCanvas();
  updateUI();
}

function openTextWindow(txt: string) {
  state.textWindowOpen = true;
  const textWindow = document.querySelector<HTMLDivElement>(".textWindow");
  textWindow.style.transform = "scale(1)";
  textWindow.textContent = "";
  textWindow.append(textSyntax(txt));
}

function closeTextWindow() {
  state.textWindowOpen = false;
  const textWindow = document.querySelector<HTMLDivElement>(".textWindow");
  textWindow.style.transform = "scale(0)";
  textWindow.textContent = "";
}


// This function was provided by courtesy of kassu11
// thanks
function calcLocalStorageMaxSpace() {
  try {
      for(let tuhat = 1000; tuhat < 100005; tuhat += 1000) localStorage.tuhat = "a".repeat(1024 * tuhat);
  } catch {}
  try {
      for(let sata = 100; sata < 1005; sata += 100) localStorage.sata = "a".repeat(1024 * sata);
  } catch {}
  try {
      for(let kymmenen = 10; kymmenen < 105; kymmenen += 10) localStorage.kymppi = "a".repeat(1024 * kymmenen);
  } catch {}
  try {
      for(let single = 1; single < 15; single++) localStorage.single = "a".repeat(1024 * single);
  } catch {}
  try {
      for(let half = 20; half > 0; half--) localStorage.half = "a".repeat(Math.ceil(1024 / half));
  } catch {}
  try {
      for(let pieni = 1; pieni < 512; pieni++) localStorage.pieni = "a".repeat(pieni);
  } catch {}

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
  for(const key in localStorage) {
      if(localStorage.hasOwnProperty(key)) {
          const length = (localStorage[key].length + key.length) * 2;
          total += length;
      }
  }
  return parseInt((total / 1024).toFixed(2));
}
console.log(Math.round(calcLocalStorageMaxSpace()));