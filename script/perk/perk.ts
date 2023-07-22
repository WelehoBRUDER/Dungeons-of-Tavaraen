let perksData: Array<any> = [];
let perks: Array<any> = [];
let tree = player.classes[0].perkTree;
const lvl_history = {
  classUpgrades: [],
  perks: [],
  stats: { str: 0, dex: 0, vit: 0, int: 0, cun: 0 },
  classPoints: 0,
  pp: 0,
  sp: 0,
} as any;

const perkColors = {
  necromancer: "#20142e",
  sorcerer: "#183952",
  fighter: "#5e2813",
  barbarian: "#5c2323",
  rogue: "#2b2b2b",
} as any;

function convertAllThosePerksForMePlease() {
  const convertedPerks = { ...perksArray };
  Object.entries(convertedPerks).forEach(([id, tree]: [string, any]) => {
    Object.entries(tree.perks).forEach(([perkId, perk]: [string, any]) => {
      if (perk.effects) {
        perk.levelEffects = [{ ...perk.effects }];
        delete perk.effects;
      }
    });
  });
  console.log(JSON.stringify(convertedPerks, null, 2));
}

class Perk {
  [id: string]: any;
  name: string;
  desc: string;
  commands?: any;
  commandsExecuted?: boolean;
  pos: tileObject;
  traits?: Array<any>;
  relative_to?: any;
  requires: Array<string>;
  mutually_exclusive?: Array<string>;
  icon: string;
  available: Function;
  bought: Function;
  tree: string;
  constructor(base: Perk) {
    this.id = base.id;
    let base_ = perksArray[base.tree || tree]["perks"][this.id];
    if (!base_ && this.id) {
      base_ = { ...dummyPerk };
    }
    const basePerk = { ...base_ };
    if (!basePerk) {
      console.error("Perk invalid! Most likely id is wrong!");
      console.log(this);
      displayText(`<c>red<c>Perk ${this.id} is invalid! Check console for more info.`);
    }
    this.name = basePerk.name;
    this.desc = basePerk.desc;
    this.commands = { ...basePerk.commands } ?? {};
    this.commandsExecuted = base.commandsExecuted ?? false;
    console.log(base.level);
    this.level = base.level ?? 0;
    this.levelEffects = base.levelEffects ?? [{}];
    this.pos = basePerk.pos;
    this.relative_to = basePerk.relative_to ?? "";
    this.requires = basePerk.requires ?? [];
    this.mutually_exclusive = basePerk.mutually_exclusive ?? [];
    this.traits = basePerk.traits ?? [];
    this.icon = basePerk.icon;
    this.tree = basePerk.tree;

    if (this.levelEffects.length < 1) this.levelEffects = [{}];

    this.available = () => {
      if (player.pp <= 0 && !this.bought()) return false;
      let available = true;
      if (this.requires?.length > 0) {
        this.requires.some((id: string) => {
          if (player.getPerkLevel(id) === 0) available = false;
        });
      }
      if (this.mutually_exclusive?.length > 0) {
        this.mutually_exclusive.some((id: string) => {
          if (player.getPerkLevel(id) > 0) available = false;
        });
      }
      return available;
    };

    this.bought = () => {
      console.log(player.getPerkLevel(this.id));
      console.log(this.levelEffects.length);
      console.log(player.getPerkLevel(this.id) >= this.levelEffects.length);
      return player.getPerkLevel(this.id) >= this.levelEffects.length;
    };

    this.buy = () => {
      if (this.available() && !this.bought()) {
        const ownedPerk = player.getPerk(this.id);
        if (!ownedPerk) {
          player.perks.push(new Perk({ ...this, level: 1 }));
          lvl_history.perks.push({ id: this.id, level: 1 });
          this.traits.forEach((stat: any) => {
            let add = true;
            player.traits.some((mod: PermanentStatModifier) => {
              if (mod.id === stat.id) {
                add = false;
                return true;
              }
            });
            if (add) player.traits.push(stat);
          });
        } else {
          ownedPerk.level++;
          if (!lvl_history.perks.find((perk: any) => perk.id == this.id)) {
            lvl_history.perks.push({ id: this.id, level: 1 });
          } else {
            lvl_history.perks.find((perk: any) => perk.id == this.id).level++;
          }
        }
        lvl_history.pp++;
        player.pp--;
        player.updateTraits();
        player.updatePerks();
        player.updateAbilities();
        formPerks();
        formStatUpgrades();
      }
    };
  }

  getEffects(level: number = this.level) {
    const effects = {};
    this.levelEffects.forEach((effect: any, index: number) => {
      if (index >= level) return;
      Object.entries(effect).forEach((stat: any) => {
        applyModifierToTotal(stat, effects);
      });
    });
    return effects;
  }

  // getNextLevelEffects() {
  //   if (this.level >= this.levelEffects.length) return {};
  //   return this.getEffects(this.level + 1);
  // }
}

function upgradeClassLevel(id: string) {
  if (player.classPoints <= 0) return;
  const classToUp = player.getClass({ id: id });
  if (!classToUp) {
    player.classes.push(new combatClass(combatClasses[id]));
  } else {
    if (classToUp.level >= 20) return;
    classToUp.level++;
  }
  player.classPoints--;
  lvl_history.classPoints++;
  if (lvl_history.classUpgrades.findIndex((upg: any) => upg.id == id) == -1) {
    lvl_history.classUpgrades.push({ id, level: 1 });
  } else {
    lvl_history.classUpgrades.find((upg: any) => upg.id == id).level++;
  }
  formPerks();
}

function changePerkTree(newTree: string) {
  tree = newTree;
  formPerks(null, true);
}

const perkScroll = {
  x: 0,
  y: 0,
};

function formPerks(e: MouseEvent = null, scrollDefault: boolean = false) {
  perks = [];
  const bg = document.querySelector<HTMLDivElement>(".playerLeveling .perks");
  const staticBg = document.querySelector<HTMLDivElement>(".playerLeveling .perksStatic");
  const perkTreesContainer = document.querySelector<HTMLDivElement>(".playerLeveling .perkTreesContainer");
  const perkArea = bg.querySelector<HTMLDivElement>(".container");
  // const leftScroll = perkArea.scrollLeft;
  // const topScroll = perkArea.scrollTop;
  perkArea.innerHTML = "";
  Object.entries(perksArray[tree].perks).forEach((_perk: any) => {
    perks.push(new Perk(_perk[1]));
  });
  hideHover();
  const baseSize: number = 128;
  const baseImg: number = 104;
  const baseFont: number = 12;
  const lineSize: number = 64;
  const lineWidth: number = 10;
  const upgradeClass = document.createElement("div");
  const classUpButton = document.createElement("button");
  const classLevel = document.createElement("p");
  const classPoints = document.createElement("p");
  const points = document.createElement("p");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  staticBg.textContent = "";
  perkTreesContainer.textContent = "";

  const currentClass = player.getClass({ tree: tree });
  const isCombatClass = tree !== "adventurer_shared";

  if (isCombatClass) {
    upgradeClass.classList.add("upgradeClass");
    classUpButton.classList.add("classUpButton");
    classLevel.classList.add("classLevel");
    classLevel.textContent = (player.getClass({ tree: tree })?.level?.toString() ?? "0") + " / 20" ?? "0 / 20";
    upgradeClass.append(classUpButton, classLevel);
    let currentEffects = ``;
    Object.entries(currentClass?.getLevelBonuses()).forEach((stat: any) => {
      currentEffects += effectSyntax(stat);
    });
    let nextEffects = ``;
    Object.entries(currentClass?.getLevelBonuses({ addToLevel: 1 })).forEach((stat: any) => {
      nextEffects += effectSyntax(stat);
    });
    const classUpText = `${lang["upgrade_class"]}\n\nCurrent effects:\n${currentEffects}§\nNext effects:\n${nextEffects}`;
    tooltip(upgradeClass, classUpText);
    classUpButton.addEventListener("click", () => upgradeClassLevel(tree + "Class"));

    staticBg.append(upgradeClass);
  }

  classPoints.textContent = lang["class_points"] + ": " + player.classPoints.toString();
  points.textContent = lang["perk_points"] + ": " + player.pp.toString();
  classPoints.classList.add("classPoints");
  points.classList.add("perkPoints");
  Object.entries(combatClasses).forEach((combatClassObject: any) => {
    const combatClass = combatClassObject[1];
    const classButtonContainer = document.createElement("div");
    const combatClassName = document.createElement("p");
    const combatClassIcon = document.createElement("img");
    // if (combatClass.perkTree == tree) {
    //   classButtonContainer.classList.add("goldenBorder");
    // } else if (combatClass.id != player.classes.main.id && player.level.level < 10) {
    //   classButtonContainer.classList.add("greyedOut");
    // }
    const level = player.getClass({ id: combatClass.id })?.level ?? 0;
    if (level === 0 && combatClass.id != "adventurer") {
      let canMultiClass = true;
      let playerStats = player.getStats();
      Object.entries(perksArray[combatClass.perkTree].multiClassRequires).forEach((req: any) => {
        if (playerStats[req[0]] < req[1]) canMultiClass = false;
      });
      if (!canMultiClass) {
        classButtonContainer.classList.add("greyedOut");
      }
    } else if (combatClass.perkTree == tree) {
      classButtonContainer.classList.add("goldenBorder");
    }
    classButtonContainer.addEventListener("click", (a) => changePerkTree(combatClass.perkTree));
    classButtonContainer.classList.add("classButtonContainer");
    combatClassName.textContent = `${lang[combatClass.id + "_name"]} ${level > 0 ? `(${level})` : ""}`;
    combatClassIcon.src = combatClass.icon;
    classButtonContainer.style.background = combatClass.color;
    classButtonContainer.append(combatClassIcon, combatClassName);
    perkTreesContainer.append(classButtonContainer);
  });
  const classButtonContainer = document.createElement("div");
  const combatClassName = document.createElement("p");
  const combatClassIcon = document.createElement("img");
  classButtonContainer.addEventListener("click", (a) => changePerkTree("adventurer_shared"));
  classButtonContainer.classList.add("classButtonContainer");
  combatClassName.textContent = lang["adventurerPerks"];
  combatClassIcon.src = "resources/icons/adventurer.png";
  classButtonContainer.style.background = "rgb(100, 52, 5)";
  if (tree == "adventurer_shared") {
    classButtonContainer.classList.add("goldenBorder");
  }
  classButtonContainer.append(combatClassIcon, combatClassName);
  perkTreesContainer.append(classButtonContainer);
  staticBg.append(classPoints, points);
  perks.forEach((_perk: Perk) => {
    const perk = document.createElement("div");
    const img = document.createElement("img");
    const name = document.createElement("p");
    perk.classList.add("perkBg");
    perk.classList.add(`${_perk.id}`);
    perk.style.backgroundColor = perkColors[tree];
    img.src = _perk.icon;
    name.textContent = lang[_perk.id + "_name"] ?? _perk.id;
    tooltip(perk, perkTT(_perk));
    perk.style.width = `${baseSize}px`;
    perk.style.height = `${baseSize}px`;
    img.style.width = `${baseImg}px`;
    img.style.height = `${baseImg}px`;
    name.style.fontSize = `${baseFont}px`;
    perk.addEventListener("click", (a) => _perk.buy());
    if (_perk.bought()) perk.classList.add("perkBought");
    if (!_perk.available()) {
      perk.classList.add("perkUnavailable");
    }
    if (_perk.relative_to) {
      let found = perkArea.querySelector<HTMLDivElement>(`.${_perk.relative_to}`);
      perk.style.left = `${_perk.pos.x * baseSize + found.offsetLeft}px`;
      perk.style.top = `${_perk.pos.y * baseSize + found.offsetTop}px`;
    } else {
      perk.style.left = `${_perk.pos.x * baseSize}px`;
      perk.style.top = `${_perk.pos.y * baseSize}px`;
    }

    perk.append(img, name);
    perkArea.append(perk, svg);
  });
  perks.forEach((_perk: Perk) => {
    let perk = perkArea.querySelector<HTMLDivElement>(`.${_perk.id}`);
    if (_perk.requires) {
      _perk.requires.forEach((req: string) => {
        let found = perkArea.querySelector<HTMLDivElement>(`.${req}`);
        let color = "rgb(65, 65, 65)";
        let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        if (_perk.bought()) color = "gold";
        else if (!_perk.available()) color = "rgb(40, 40, 40)";
        line.setAttribute("x1", `${+perk.style.left.replace(/\D/g, "") + lineSize}px`);
        line.setAttribute("y1", `${+perk.style.top.replace(/\D/g, "") + lineSize}px`);
        line.setAttribute("x2", `${+found.style.left.replace(/\D/g, "") + lineSize}px`);
        line.setAttribute("y2", `${+found.style.top.replace(/\D/g, "") + lineSize}px`);
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", `${lineWidth}px`);
        svg.appendChild(line);
      });
    }
    if (_perk.mutually_exclusive) {
      _perk.mutually_exclusive.forEach((mutex: string) => {
        let found = perkArea.querySelector<HTMLDivElement>(`.${mutex}`);
        let color = "rgb(25, 25, 25)";
        let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        let image = document.createElementNS("http://www.w3.org/2000/svg", "image");
        const startX = +perk.style.left.replace(/\D/g, "") + lineSize;
        const startY = +perk.style.top.replace(/\D/g, "") + lineSize;
        let endX = +found.style.left.replace(/\D/g, "") + lineSize;
        let endY = +found.style.top.replace(/\D/g, "") + lineSize;
        let centre = { x: (startX + endX) / 2, y: (startY + endY) / 2 };
        if (endX - startX < 0) endX = centre.x + 48;
        else endX = centre.x - 48;
        endY = centre.y;
        line.setAttribute("x1", `${startX}px`);
        line.setAttribute("y1", `${startY}px`);
        line.setAttribute("x2", `${endX}px`);
        line.setAttribute("y2", `${endY}px`);
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", `${lineWidth}px`);
        image.setAttribute("x", `${centre.x - 32}px`);
        image.setAttribute("y", `${centre.y - 32}px`);
        image.setAttribute("width", `${64}px`);
        image.setAttribute("height", `${64}px`);
        image.setAttributeNS("http://www.w3.org/1999/xlink", "href", "resources/icons/exclusive.png");
        svg.appendChild(line);
        svg.appendChild(image);
      });
    }
  });
  perkArea.style.transform = `scale(${currentZoomBG})`;
  svg.setAttribute("width", "4000");
  svg.setAttribute("height", "4000");
  if (!scrollDefault) background.scrollTo(perkScroll.x, perkScroll.y);
  else background.scrollTo(perksArray[tree].startPos * currentZoomBG, 0);
  /* Making a proper zoom has defeated me, it will simply not center on mouse, ever. */
}

function formStatUpgrades() {
  const bg = document.querySelector<HTMLDivElement>(".playerLeveling .stats");
  const points = document.createElement("p");
  const undo = document.createElement("div");
  const baseStats = ["str", "dex", "vit", "int", "cun"];
  bg.innerHTML = "";
  points.textContent = lang["stat_points"] + ": " + player.sp.toString();
  points.classList.add("statPoints");
  /* Form stats */
  const container = document.createElement("div");
  container.classList.add("statContainer");
  undo.classList.add("undo");
  undo.textContent = "Undo changes";
  baseStats.forEach((stat) => {
    const base = document.createElement("div");
    const baseImg = document.createElement("img");
    const baseText = document.createElement("p");
    const baseNumber = document.createElement("p");
    const upgrade = document.createElement("span");
    base.classList.add("statUp");
    baseImg.src = icons[stat];
    baseText.textContent = lang[stat];
    baseNumber.textContent = player.getBaseStats()[stat].toString();
    upgrade.textContent = "+";
    upgrade.addEventListener("click", (a) => upStat(stat));
    tooltip(base, lang[stat + "_tt"] ?? "no tooltip");
    if (player.sp <= 0) upgrade.style.transform = "scale(0)";
    base.append(baseImg, baseText, baseNumber, upgrade);
    container.append(base);
  });
  undo.addEventListener("click", undoChanges);
  bg.append(points, container, undo);
}

function upStat(stat: string) {
  if (player.sp >= 1) {
    player.sp--;
    player.stats[stat]++;
    lvl_history.stats[stat]++;
    lvl_history.sp++;
    formStatUpgrades();
  }
}

function openLevelingScreen() {
  hideHover();
  const lvling = document.querySelector<HTMLDivElement>(".playerLeveling");
  lvling.style.transform = "scale(1)";
  document.querySelector<HTMLDivElement>(".worldText").style.opacity = "0";
  lvl_history.perks = [];
  lvl_history.stats = { str: 0, dex: 0, vit: 0, int: 0, cun: 0 };
  lvl_history.classPoints = 0;
  lvl_history.pp = 0;
  lvl_history.sp = 0;
  formPerks();
  formStatUpgrades();
  state.perkOpen = true;
}

function perkTT(perk: Perk) {
  const lvl = player.getPerkLevel(perk.id);
  let txt: string = "";
  txt += `\t<f>21px<f>${lang[perk.id + "_name"] ?? perk.id}\t\n`;
  txt += `<f>15px<f><c>silver<c>"${lang[perk.id + "_desc"] ?? perk.id + "_desc"}"<c>white<c>\n`;
  if (DEVTOOLS.ENABLED) txt += `<f>18px<f><c>gold<c>${perk.id}<c>white<c>\n`;
  if (perk.requires?.length > 0) {
    txt += `<f>16px<f><c>white<c>${lang["requires"]}:  `;
    perk.requires.forEach((req) => {
      let found = false;
      player.perks.forEach((prk: Perk) => {
        if (prk.id == req) {
          found = true;
        }
      });
      txt += `<c> ${found ? "lime" : "red"}<c>${lang[req + "_name"] ?? req}, `;
    });
    txt = txt.substring(0, txt.length - 2);
    txt += "§";
  }
  if (perk.mutually_exclusive?.length > 0) {
    txt += `§\n<f>16px<f><c>white<c>${lang["mutually_exclusive"]}:  `;
    perk.mutually_exclusive.forEach((req) => {
      let found = false;
      player.perks.forEach((prk: Perk) => {
        if (prk.id == req) {
          found = true;
        }
      });
      txt += `<c> ${found ? "red" : "lime"}<c>${lang[req + "_name"] ?? req}, `;
    });
    txt = txt.substring(0, txt.length - 2);
    txt += "§";
  }
  if (Object.values(perk.commands).length > 0 && lvl === 0) {
    Object.entries(perk.commands).forEach((com: any) => (txt += commandSyntax(com[0], com[1])));
  }
  if (Object.keys(perk.levelEffects[0]).length > 0) {
    if (lvl > 0) {
      txt += `\n<f>16px<f>${lang["current_effects"] ?? "current_effects"}:\n`;
      Object.entries(perk.getEffects(lvl)).forEach((stat) => {
        txt += effectSyntax(stat, true);
      });
    }
    txt += `\n<f>16px<f>${lang["next_level_effects"] ?? "next_level_effects"}:\n`;
    Object.entries(perk.getEffects(lvl + 1)).forEach((stat) => {
      txt += effectSyntax(stat, true);
    });
  }
  if (perk.traits && lvl === 0) {
    perk.traits.forEach((statModif: any) => {
      txt += statModifTT(statModif);
    });
  }
  return txt;
}

function statModifTT(statModif: any) {
  statModif = new PermanentStatModifier({ ...statModif });
  let txt = `§\n ${lang["passive"]} <f>16px<f><c>white<c>'<c>gold<c>${lang[statModif.id + "_name"] ?? statModif.id}<c>white<c>'\n`;
  if (statModif.desc) txt += `§<c>silver<c><f>13px<f>"${lang[statModif.desc]}"\n§`;
  if (statModif.conditions) {
    txt += `<c>white<c><f>15px<f>${lang["active_if"]}:\n`;
    Object.entries(statModif.conditions).forEach((cond) => {
      const key = cond[0];
      const val = cond[1];
      txt += `<c>white<c><f>13px<f>${lang[key]} ${val}%\n`;
    });
  }
  txt += `<c>white<c><f>15px<f>${lang["status_effects"]}:\n`;
  Object.entries(statModif.effects).forEach((eff) => (txt += effectSyntax(eff, true)));
  return txt;
}

const zoomLevelsBG = [0.17, 0.25, 0.33, 0.41, 0.5, 0.6, 0.7, 0.75, 0.87, 1, 1.12, 1.25, 1.33, 1.5, 1.64, 1.75, 1.87, 2];
let currentZoomBG = 1;

const background = document.querySelector<HTMLDivElement>(".playerLeveling .perks");
background.addEventListener("mousedown", action1);
background.addEventListener("mousemove", action2);
background.addEventListener("wheel", changeZoomLevelBG, { passive: true });
// @ts-expect-error
function changeZoomLevelBG(e) {
  if (e.deltaY > 0) {
    currentZoomBG = zoomLevelsBG[zoomLevelsBG.indexOf(currentZoomBG) - 1] || zoomLevelsBG[0];
  } else {
    currentZoomBG = zoomLevelsBG[zoomLevelsBG.indexOf(currentZoomBG) + 1] || zoomLevelsBG[zoomLevelsBG.length - 1];
  }
  formPerks(e);
}

let mouseX = 0;
let mouseY = 0;
let bgPosX = 0;
let bgPosY = 0;
let eAction: MouseEvent = null;

function action1(e: MouseEvent) {
  mouseX = e.x;
  mouseY = e.y;
  eAction = e;
  bgPosX = background.scrollLeft;
  bgPosY = background.scrollTop;
}

function action2(e: MouseEvent) {
  if (e.buttons == 1) {
    let offsetX = e.x - mouseX;
    let offsetY = e.y - mouseY;
    background.scrollTo(bgPosX - offsetX, bgPosY - offsetY);
    perkScroll.x = bgPosX - offsetX;
    perkScroll.y = bgPosY - offsetY;
  }
}

function undoChanges() {
  lvl_history.classUpgrades.forEach((upg: any) => {
    const classToUp = player.getClass({ id: upg.id });
    classToUp.level -= upg.level;
    if (classToUp.level <= 0) {
      player.classes.splice(
        player.classes.findIndex((cls: any) => cls.id == upg.id),
        1
      );
    }
  });
  lvl_history.perks.forEach((prk: { id: string; level: number }) => {
    const ownedPerk = player.getPerk(prk.id);
    ownedPerk.level -= prk.level;
    if (ownedPerk.level <= 0) {
      let index = player.perks.findIndex((_prk: any) => _prk.id == prk.id);
      player.perks[index].traits.forEach((rem: any) => {
        const modIndex = player.traits.findIndex((stat: any) => stat.id === rem.id);
        player.traits.splice(modIndex, 1);
      });
      player.perks.splice(index, 1);
    }
  });
  Object.entries(lvl_history.stats).forEach((stat: any) => {
    const id = stat[0];
    const val = stat[1];
    player.stats[id] -= val;
  });
  player.classPoints += lvl_history.classPoints;
  player.sp += lvl_history.sp;
  player.pp += lvl_history.pp;
  lvl_history.perks = [];
  lvl_history.stats = { str: 0, dex: 0, vit: 0, int: 0, cun: 0 };
  lvl_history.classPoints = 0;
  lvl_history.pp = 0;
  lvl_history.sp = 0;
  formPerks();
  formStatUpgrades();
}

//formPerks();
