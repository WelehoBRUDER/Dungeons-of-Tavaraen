const emptyModel = {
  id: "player",
  name: "Player",
  cords: { x: 1, y: 1 },
  stats: {
    str: 5,
    dex: 5,
    int: 5,
    vit: 5,
    cun: 5,
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
  weapon: {},
  chest: {},
  helmet: {},
  gloves: {},
  legs: {},
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
  ],
  statModifiers: [
    {
      name: "Resilience of the Lone Wanderer",
      effects: {
        hpMaxV: 55,
        mpMaxV: 10,
        retreat_status_effect_lastV: 1,
      }
    },
  ],
  regen: {
    hp: 0,
    mp: 0,
  },
  hit: {
    chance: 50,
    evasion: 25
  },
  unarmed_damages: { crush: 5 },
  statusEffects: [],
  inventory: [],
  gold: 50,
  sp: 5,
  pp: 1,
  respawnPoint: { cords: { x: 4, y: 4 } },
  usedShrines: [],
} as playerChar;
const creation = document.querySelector<HTMLDivElement>(".mainMenu .characterCreation");
const creationCanvas = creation.querySelector<HTMLCanvasElement>(".layerRender");
const creationCtx = creationCanvas.getContext("2d");

const hairs = [1, 4];
const eyes = [1, 3];
const faces = [1, 3];

function characterCreation(withAnimations = true) {
  if (withAnimations) {
    player = new PlayerCharacter({ ...emptyModel });
    creation.style.display = "block";
    setTimeout(() => { creation.style.opacity = "1"; }, 5);
  }
  renderPlayerOutOfMap(256, creationCanvas, creationCtx);
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
    btn.textContent = content.name;
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

function beginGame() {
  if (player.classes.main) {
    player.name = creation.querySelector<HTMLInputElement>(".nameInput").value;
    creation.style.opacity = "0";
    setTimeout(() => { creation.style.display = "none"; }, 750);
    tree = player.classes.main.perkTree;
    closeGameMenu(false, true);
    modifyCanvas();
  }
}

function changeHair() {
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
function changeEyes() {
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
function changeFace() {
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

function changeRace(race: any) {
  player.race = race[0];
  // @ts-ignore
  player.raceEffect = raceEffects[player.race];
  characterCreation(false);
}

function changeClass(_combatClass: any) {
  player.classes.main = new combatClass(_combatClass);
  characterCreation(false);
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