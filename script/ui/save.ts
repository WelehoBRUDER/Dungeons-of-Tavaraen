let saveMenuScroll = 0;
let timePlayedNow = 0;
document.querySelector<HTMLDivElement>(".savesMenu .saves").addEventListener("wheel", (wheel: any) => saveMenuScroll = wheel.path[1].scrollTop);
async function gotoSaveMenu(inMainMenu = false, animate: boolean = true) {
  hideHover();
  saves = JSON.parse(localStorage.getItem(`DOT_game_saves`)) || [];
  const saveBg = document.querySelector<HTMLDivElement>(".savesMenu");
  const savesArea = saveBg.querySelector<HTMLDivElement>(".saves");
  const saveNameInput = saveBg.querySelector<HTMLInputElement>(".saveName");
  state.savesOpen = true;
  if (!inMainMenu) closeGameMenu(true);
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
    await helper.sleep(5);
  }
  saveNameInput.value = player.name + "_save";
  saves = saves.sort((x1, x2) => x2.time - x1.time);
  resetIds();
  let renderedSaves = 1;
  for (let save of saves) {
    if (renderedSaves < 10 && animate) await helper.sleep(80);
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
      player.timePlayed += Math.round((performance.now() - timePlayedNow) / 1000);
      timePlayedNow = performance.now();
      saveData.player = helper.trimPlayerObjectForSaveFile(player);
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
      player.updateTraits();
      player.updatePerks(true);
      player.updateAbilities();
      gotoSaveMenu(false, false);
    });
    loadGame.addEventListener("click", async () => {
      timePlayedNow = performance.now();
      loadingScreen.style.display = "flex";
      loadingText.textContent = "Loading save...";
      await helper.sleep(5);
      let fm;
      let pl;
      let fe;
      let id;
      let lc;
      try {
        fm = maps.findIndex((map: any) => map.id == save.save.currentMap);
        if (fm == -1) fm = save.save.currentMap;
        if (fm < 0) throw Error("CAN'T FIND MAP!");
        pl = new PlayerCharacter({ ...save.save.player });
        fe = save.save.fallenEnemies ? [...save.save.fallenEnemies] : [];
        id = save.save.itemData ? [...save.save.itemData] : [];
        lc = save.save.lootedChests ? [...save.save.lootedChests] : [];
        // update classes of all dropped items just in case
        id.map((item) => {
          if (item.itm.type === "weapon") return item.itm = new Weapon({ ...items[item.itm.id] });
          if (item.itm.type === "armor") return item.itm = new Armor({ ...items[item.itm.id] });
          if (item.itm.type === "artifact") return item.itm = new Artifact({ ...items[item.itm.id] });
          if (item.itm.type === "consumable") return item.itm = new Consumable({ ...items[item.itm.id] });
        });
        pl.updateTraits();
        pl.updatePerks(true);
        pl.updateAbilities();
      }
      catch (err: any) {
        console.error(err.message);
        loadingScreen.style.display = "none";
        return warningMessage("<i>resources/icons/error.png<i>Failed to load save.\nIt may be corrupted or too old.");
      }
      closeSaveMenu();
      player = pl;
      fallenEnemies = fe;
      itemData = id;
      lootedChests = lc;
      helper.reviveAllDeadEnemies();
      currentMap = fm;
      tree = player.classes.main.perkTree;
      turnOver = true;
      enemiesHadTurn = 0;
      actionCooldown = false;
      movementCooldown = false;
      state.inCombat = false;
      console.log("map", fm);
      player.updateTraits();
      player.updatePerks(true);
      player.updateAbilities();
      renderMinimap(maps[currentMap]);
      renderAreaMap(maps[currentMap]);
      helper.purgeDeadEnemies();
      helper.killAllQuestEnemies();
      spawnQuestMonsters();
      convertEnemytraits();
      closeGameMenu();
      resetAllChests();
      createStaticMap();
      modifyCanvas(true);
      updateUI();
      handleEscape();
      closeAllWindowsAndMenus();
      loadingScreen.style.display = "none";

    });
    deleteGame.addEventListener("click", () => {
      saves.splice(save.id, 1);
      resetIds();
      localStorage.setItem("DOT_game_saves", JSON.stringify(saves));
      gotoSaveMenu(inMainMenu, false);
    });
    try {
      let renderedPlayer = new PlayerCharacter({ ...save.save.player });
      renderedPlayer.updateTraits();
      renderedPlayer.updatePerks(true, true);
      renderedPlayer.updateAbilities(true);
      let saveTime = new Date(save.time);
      let saveDateString: string = saveTime.getDate() + "." + (saveTime.getMonth() + 1) + "." + saveTime.getFullYear();
      let saveTimeString: string = ("0" + saveTime.getHours()).slice(-2).toString() + "." + ("0" + saveTime.getMinutes()).slice(-2).toString();
      let totalText = ``;
      let saveSize = (JSON.stringify(save).length / 1024).toFixed(2);
      let foundMap = maps.findIndex((map: any) => map.id == save.save.currentMap);
      if (foundMap == -1) foundMap = save.save.currentMap;
      totalText += save.text.split("||")[0];
      totalText += `§<c>goldenrod<c><f>24px<f>|§ Lvl ${renderedPlayer.level.level} ${lang[renderedPlayer.race + "_name"]} `;
      totalText += `§<c>goldenrod<c><f>24px<f>|§ ${lang["last_played"]}: ${saveDateString} @ ${saveTimeString} §<c>goldenrod<c><f>24px<f>|§ `;
      totalText += `§\n${lang["map"]}: §<c>gold<c>${maps?.[foundMap]?.name}§ `;
      totalText += `§| ${lang["playtime"]}: ${secondsToHoursAndMinutes(renderedPlayer.timePlayed) || lang["no_time_recorded"]}§`;
      totalText += `§<c>silver<c><f>24px<f>|§ ${saveSize} kb§ `;
      let verColor: string = "lime";
      let addVersionWarning: boolean = false;
      if ((+save.save.version + .1 < +GAME_VERSION) || !save.save.version || +save.save.version < 1.1) {
        verColor = "orange";
        addVersionWarning = true;
      }
      let versionText = `${save.save?.version?.[0]}.${save.save?.version?.[2]}.${save.save?.version?.[3]}`;
      if (versionText.includes('undefined')) versionText = lang["old_save"];
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
    catch (err) { console.warn(err); }
  }
  savesArea.scrollBy(saveMenuScroll, saveMenuScroll);
}

async function closeSaveMenu() {
  const saveBg = document.querySelector<HTMLDivElement>(".savesMenu");
  saveBg.style.display = "block";
  saveBg.style.animation = 'none';
  // @ts-ignore
  saveBg.offsetHeight; /* trigger reflow */
  // @ts-ignore
  saveBg.style.animation = null;
  await helper.sleep(5);
  saveBg.style.animationName = `slideToTop`;
  saveBg.style.display = "none";
  setTimeout(() => { dim.style.height = "0%"; }, 5);
}

function secondsToHoursAndMinutes(seconds: number) {
  if (seconds <= 0) return undefined;
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds - (hours * 3600)) / 60);
  let secondsLeft = seconds - (hours * 3600) - (minutes * 60);
  // @ts-ignore
  if (hours < 10) hours = "0" + hours;
  // @ts-ignore
  if (minutes < 10) minutes = "0" + minutes;
  // @ts-ignore
  if (secondsLeft < 10) secondsLeft = "0" + secondsLeft;
  return hours + ":" + minutes + ":" + secondsLeft;
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

function updatePlayerToPreventCrash() {
  player.updateTraits();
  player.updatePerks(true);
  player.updateAbilities();
}

function createNewSaveGame() {
  const saveBg = document.querySelector<HTMLDivElement>(".savesMenu");
  const saveNameInput = saveBg.querySelector<HTMLInputElement>(".saveName");
  let saveName = saveNameInput.value || player.name;
  let sortTime = +(new Date());
  let gameSave = {} as any;
  player.timePlayed += Math.round((performance.now() - timePlayedNow) / 1000);
  timePlayedNow = performance.now();
  gameSave.player = helper.trimPlayerObjectForSaveFile({ ...player });
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

function saveToFile(input: string) {
  player.timePlayed += Math.round((performance.now() - timePlayedNow) / 1000);
  timePlayedNow = performance.now();
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
      data: helper.trimPlayerObjectForSaveFile(player)
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
  player.updateTraits();
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
      return object;
    }
  }
}

function warningMessage(txt: string) {
  let warning = document.querySelector<HTMLDivElement>(".warningWindow");
  warning.style.transform = "scale(1)";
  warning.innerHTML = "";
  warning.append(textSyntax(txt));
  setTimeout(() => { warning.style.transform = "scale(0)"; }, 5000);
}