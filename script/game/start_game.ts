const emptyModel = {
  id: "player",
  name: "",
  cords: { x: 30, y: 105 },
  stats: {
    str: 1,
    dex: 1,
    int: 1,
    vit: 1,
    cun: 1,
    hp: 100,
    mp: 30
  },
  resistances: {
    slash: 0,
    crush: 0,
    pierce: 0,
    magic: 0,
    dark: 0,
    divine: 0,
    fire: 0,
    lightning: 0,
    ice: 0
  },
  statusResistances: {
    poison: 0,
    burning: 0,
    curse: 0,
    stun: 0,
    bleed: 0
  },
  level: {
    xp: 0,
    xpNeed: 100,
    level: 1
  },
  classes: {
    main: null,
    sub: null
  },
  sprite: ".player",
  race: "human",
  hair: 1,
  eyes: 1,
  face: 1,
  weapon: new Weapon({ ...items.stick }),
  chest: new Armor({ ...items.raggedShirt }),
  helmet: {},
  gloves: {},
  legs: new Armor({ ...items.raggedBoots }),
  boots: {},
  offhand: {},
  artifact1: {},
  artifact2: {},
  artifact3: {},
  grave: null,
  threat: 25,
  canFly: false,
  perks: [],
  abilities: [
    new Ability({ ...abilities.attack }, dummy),
    new Ability({ ...abilities.retreat, equippedSlot: 0 }, dummy),
    new Ability({ ...abilities.first_aid, equippedSlot: 1 }, dummy),
    new Ability({ ...abilities.defend, equippedSlot: 2 }, dummy),
  ],
  traits: [
    {
      id: "resilience_of_the_lone_wanderer",
    }
  ],
  regen: {
    hp: 0,
    mp: 0,
  },
  hit: {
    chance: 60,
    evasion: 30
  },
  unarmed_damages: { crush: 1 },
  statusEffects: [],
  inventory: [],
  gold: 50,
  sp: 5,
  pp: 1,
  respawnPoint: { cords: { x: 29, y: 105 } },
  usedShrines: [],
  flags: {},
  questProgress: [],
} as playerChar;
const creation = document.querySelector<HTMLDivElement>(".mainMenu .characterCreation");
const creationCanvas = creation.querySelector<HTMLCanvasElement>(".layerRender");
const creationCtx = creationCanvas.getContext("2d");

const hairs = [1, 10];
const eyes = [1, 5];
const faces = [1, 5];

const classEquipments = {
  fighter: {
    weapon: new Weapon({ ...items.chippedBlade }),
    chest: new Armor({ ...items.raggedShirt }),
    helmet: new Armor({ ...items.leatherHelmet }),
    gloves: {},
    legs: new Armor({ ...items.raggedPants }),
    boots: new Armor({ ...items.raggedBoots }),
    offhand: new Armor({ ...items.woodenShield }),
  },
  barbarian: {
    weapon: new Weapon({ ...items.chippedAxe }),
    chest: new Armor({ ...items.leatherChest }),
    helmet: {},
    gloves: new Armor({ ...items.leatherBracers }),
    legs: new Armor({ ...items.raggedPants }),
    boots: new Armor({ ...items.raggedBoots }),
    offhand: {},
  },
  sorcerer: {
    weapon: new Weapon({ ...items.apprenticeWand }),
    chest: new Armor({ ...items.raggedShirt }),
    helmet: {},
    gloves: new Armor({ ...items.raggedGloves }),
    legs: new Armor({ ...items.raggedPants }),
    boots: new Armor({ ...items.raggedBoots }),
    offhand: {},
  },
  rogue: {
    weapon: new Weapon({ ...items.dagger }),
    chest: new Armor({ ...items.raggedShirt }),
    helmet: new Armor({ ...items.raggedHood }),
    gloves: new Armor({ ...items.raggedGloves }),
    legs: new Armor({ ...items.raggedPants }),
    boots: new Armor({ ...items.raggedBoots }),
    offhand: new Armor({ ...items.parryingDagger }),
  },
  ranger: {
    weapon: new Weapon({ ...items.huntingBow }),
    chest: new Armor({ ...items.raggedShirt }),
    helmet: new Armor({ ...items.woolHat }),
    gloves: new Armor({ ...items.raggedGloves }),
    legs: new Armor({ ...items.raggedPants }),
    boots: new Armor({ ...items.raggedBoots }),
    offhand: {},
  }
} as any;

var clothToggleCreation = false;
function characterCreation(withAnimations = true) {
  if (withAnimations) {
    const copiedModel = JSON.parse(JSON.stringify({ ...emptyModel }));
    player = new PlayerCharacter({ ...copiedModel });
    creation.style.display = "block";
    setTimeout(() => { creation.style.opacity = "1"; }, 5);
  }
  checkIfCanStartGame();
  renderPlayerOutOfMap(256, creationCanvas, creationCtx, "center", player, clothToggleCreation);
  creation.querySelector(".nameText").textContent = lang["choose_name"] ?? "lang_choose_name";
  creation.querySelector(".raceText").textContent = lang["choose_race"] ?? "lang_choose_race";
  creation.querySelector(".classText").textContent = lang["choose_class"] ?? "lang_choose_class";
  const raceContainer = creation.querySelector<HTMLDivElement>(".racesContainer");
  const classContainer = creation.querySelector<HTMLDivElement>(".classesContainer");
  raceContainer.textContent = "";
  classContainer.textContent = "";
  Object.entries(raceTexts).forEach((race: any) => {
    const content = race[1];
    const btn = document.createElement("div");
    btn.textContent = lang[race[0] + "_name"] ?? content.name;
    btn.classList.add("raceButton");
    tooltip(btn, raceTT(race[0]));
    if (player.race == race[0]) btn.style.border = "4px solid gold";
    else {
      btn.addEventListener("click", a => changeRace(race));
    }
    raceContainer.append(btn);
  });
  Object.values(combatClasses).forEach((combatClass: any) => {
    const bg = document.createElement("div");
    const title = document.createElement("p");
    const icon = document.createElement("img");
    bg.classList.add("classCard");
    bg.style.background = combatClass.color;
    title.textContent = lang[combatClass.id + "_name"];
    icon.src = combatClass.icon;
    tooltip(bg, classTT(combatClass));
    if (player.classes?.main?.id == combatClass.id) bg.style.border = "4px solid gold";
    else {
      bg.addEventListener("click", a => changeClass(combatClass));
    }
    bg.append(title, icon);
    classContainer.append(bg);
  });
}

creation.querySelector<HTMLInputElement>(".nameInput").addEventListener("keyup", (key) => {
  player.name = creation.querySelector<HTMLInputElement>(".nameInput").value;
  checkIfCanStartGame();
});

function beginGame() {
  player.updateTraits();
  player.updateAbilities();
  creation.style.opacity = "0";
  setTimeout(() => { creation.style.display = "none"; }, 750);
  tree = player.classes.main.perkTree;
  closeGameMenu(false, true);
  helper.reviveAllDeadEnemies();
  helper.resetAllLivingEnemiesInAllMaps();
  helper.killAllQuestEnemies();
  player.updatePerks(true);
  player.updateAbilities();
  fallenEnemies = [];
  turnOver = true;
  enemiesHadTurn = 0;
  lootedChests = [];
  currentMap = 4;
  state.inCombat = false;
  resetAllChests();
  handleEscape();
  createStaticMap();
  renderMinimap(maps[currentMap]);
  renderAreaMap(maps[currentMap]);
  moveMinimap();
  resizeCanvas();
  setTimeout(() => {
    openLevelingScreen();
  }, 0);
}

function checkIfCanStartGame() {
  let canStart = false;
  if (player.name.trim().length > 1 && player.classes.main) canStart = true;
  try {
    if (canStart) {
      creation.querySelector(".startGame").classList.remove("greyedOut");
    }
    else creation.querySelector(".startGame").classList.add("greyedOut");
  }
  catch { }
}

function changeHair(e: MouseEvent) {
  if (e.button === 0) {
    if (player.hair + 1 <= hairs[1]) {
      player.hair++;
      creation.querySelector(".hair").textContent = `hair ${player.hair}`;
      characterCreation(false);
    }
    else {
      player.hair = hairs[0];
      creation.querySelector(".hair").textContent = `hair ${player.hair}`;
      characterCreation(false);
    }
  }
  else if (e.button === 2) {
    if (player.hair - 1 >= hairs[0]) {
      player.hair--;
      creation.querySelector(".hair").textContent = `hair ${player.hair}`;
      characterCreation(false);
    }
    else {
      player.hair = hairs[1];
      creation.querySelector(".hair").textContent = `hair ${player.hair}`;
      characterCreation(false);
    }
  }
}
function changeEyes(e: MouseEvent) {
  if (e.button === 0) {
    if (player.eyes + 1 <= eyes[1]) {
      player.eyes++;
      creation.querySelector(".eyes").textContent = `eyes ${player.eyes}`;
      characterCreation(false);
    }
    else {
      player.eyes = eyes[0];
      creation.querySelector(".eyes").textContent = `eyes ${player.eyes}`;
      characterCreation(false);
    }
  }
  else if (e.button === 2) {
    if (player.eyes - 1 >= eyes[0]) {
      player.eyes--;
      creation.querySelector(".eyes").textContent = `eyes ${player.eyes}`;
      characterCreation(false);
    }
    else {
      player.eyes = eyes[1];
      creation.querySelector(".eyes").textContent = `eyes ${player.eyes}`;
      characterCreation(false);
    }
  }
}
function changeFace(e: MouseEvent) {
  if (e.button === 0) {
    if (player.face + 1 <= faces[1]) {
      player.face++;
      creation.querySelector(".face").textContent = `face ${player.face}`;
      characterCreation(false);
    }
    else {
      player.face = faces[0];
      creation.querySelector(".face").textContent = `face ${player.face}`;
      characterCreation(false);
    }
  }
  else if (e.button === 2) {
    if (player.face - 1 >= faces[0]) {
      player.face--;
      creation.querySelector(".face").textContent = `face ${player.face}`;
      characterCreation(false);
    }
    else {
      player.face = faces[1];
      creation.querySelector(".face").textContent = `face ${player.face}`;
      characterCreation(false);
    }
  }
}

function changeRace(race: any) {
  player.race = race[0];
  // @ts-ignore
  player.raceEffect = raceEffects[player.race];
  characterCreation(false);
}

function changeClass(_combatClass: any) {
  player.classes.main = new combatClass(_combatClass);
  Object.entries(classEquipments[player.classes.main.perkTree]).forEach((eq: any) => {
    let id = eq[0];
    let val = eq[1];
    player[id] = { ...val };
  });
  characterCreation(false);
  checkIfCanStartGame();
}

function changeSex(sex: string) {
  player.sex = sex;
  document.querySelector(".genderWrapper .selected").classList.remove("selected");
  document.querySelector(`.genderWrapper .${sex}`).classList.add("selected");
  characterCreation(false);
  checkIfCanStartGame();
}

function toggleClothes() {
  clothToggleCreation = !clothToggleCreation;
  if (clothToggleCreation) {
    document.querySelector(".toggleClothes").classList.add("selected");
  }
  else document.querySelector(".toggleClothes").classList.remove("selected");
  characterCreation(false);
  checkIfCanStartGame();
}

function raceTT(race: string) {
  let txt = "";
  // @ts-expect-error
  let entries: any = Object.entries(raceEffects[race].modifiers).sort((a: number, b: number) => b[1] - a[1]);
  let sortedTotal: any = {};
  entries.forEach((entry: any) => {
    sortedTotal[entry[0]] = entry[1];
  });
  Object.entries(sortedTotal).forEach(effect => {
    txt += effectSyntax(effect);
  });
  return txt;
}

function classTT(data: any) {
  let txt = `<c>white<c><f>24px<f>${lang[data.id + "_name"]}\n`;
  txt += lang[data.id + "_desc"];
  // @ts-expect-error
  let entries: any = Object.entries(data.statBonuses).sort((a: number, b: number) => b[1] - a[1]);
  let sortedTotal: any = {};
  entries.forEach((entry: any) => {
    sortedTotal[entry[0]] = entry[1];
  });
  Object.entries(sortedTotal).forEach(effect => {
    txt += effectSyntax(effect);
  });
  return txt;
}

for (let i = 0; i < 20; i++) {
  player.addItem({ ...randomProperty(items) });
}

function initGame() {
  let options = JSON.parse(localStorage.getItem(`DOT_game_settings`));
  if (options) {
    settings = new gameSettings(options);
    lang = eval(JSON.parse(localStorage.getItem(`DOT_game_language`)));
  }
  else settings = new gameSettings(settings);
  state.menuOpen = true;
  state.titleScreen = true;
  gotoMainMenu(true);
  createStaticMap();
  resizeCanvas();
  renderMinimap(maps[currentMap]);
  renderAreaMap(maps[currentMap]);
  tooltip(document.querySelector(".invScrb"), `${lang["setting_hotkey_inv"]} [${settings["hotkey_inv"]}]`);
  tooltip(document.querySelector(".chaScrb"), `${lang["setting_hotkey_char"]} [${settings["hotkey_char"]}]`);
  tooltip(document.querySelector(".perScrb"), `${lang["setting_hotkey_perk"]} [${settings["hotkey_perk"]}]`);
  tooltip(document.querySelector(".escScrb"), `${lang["open_menu"]} [ESCAPE]`);
  setTimeout(() => document.querySelector<HTMLDivElement>(".loading").style.display = "none", 0);
}

document.addEventListener("DOMContentLoaded", initGame);