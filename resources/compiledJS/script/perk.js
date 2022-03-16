"use strict";
var perksData = [];
var perks = [];
var tree = player.classes.main.perkTree;
const lvl_history = {
    perks: [],
    stats: { str: 0, dex: 0, vit: 0, int: 0, cun: 0 },
    pp: 0,
    sp: 0
};
const perkColors = {
    necromancer: "#20142e",
    sorcerer: "#183952",
    fighter: "#5e2813",
    barbarian: "#5c2323",
    rogue: "#2b2b2b",
};
class perk {
    constructor(base) {
        var _a, _b, _c, _d, _e, _f;
        this.id = base.id;
        let base_ = perksArray[base.tree || tree]["perks"][this.id];
        if (!base_ && this.id) {
            base_ = Object.assign({}, dummyPerk);
        }
        const basePerk = Object.assign({}, base_);
        if (!basePerk) {
            console.error("Perk invalid! Most likely id is wrong!");
            console.log(this);
            displayText(`<c>red<c>Perk ${this.id} is invalid! Check console for more info.`);
        }
        this.name = basePerk.name;
        this.desc = basePerk.desc;
        this.commands = (_a = Object.assign({}, basePerk.commands)) !== null && _a !== void 0 ? _a : {};
        this.effects = (_b = Object.assign({}, basePerk.effects)) !== null && _b !== void 0 ? _b : {};
        this.commandsExecuted = (_c = base.commandsExecuted) !== null && _c !== void 0 ? _c : false;
        this.pos = basePerk.pos;
        this.relative_to = (_d = basePerk.relative_to) !== null && _d !== void 0 ? _d : "";
        this.requires = (_e = basePerk.requires) !== null && _e !== void 0 ? _e : [];
        this.statModifiers = (_f = basePerk.statModifiers) !== null && _f !== void 0 ? _f : [];
        this.icon = basePerk.icon;
        this.tree = basePerk.tree;
        this.available = () => {
            var _a, _b, _c, _d;
            if (player.pp <= 0 && !this.bought())
                return false;
            if (((_a = this.requires) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                let needed = (_b = this.requires) === null || _b === void 0 ? void 0 : _b.length;
                let cur = 0;
                (_c = this.requires) === null || _c === void 0 ? void 0 : _c.forEach(req => {
                    player.perks.forEach(prk => { prk.id == req ? cur++ : ''; });
                });
                if (cur >= needed)
                    return true;
            }
            if (((_d = this.requires) === null || _d === void 0 ? void 0 : _d.length) <= 0)
                return true;
            return false;
        };
        this.bought = () => {
            let isBought = false;
            player.perks.forEach(prk => {
                if (prk.id == this.id) {
                    isBought = true;
                    return;
                }
                ;
            });
            return isBought;
        };
        this.buy = () => {
            var _a, _b;
            if (this.available() && !this.bought()) {
                player.perks.push(new perk(Object.assign({}, this)));
                player.pp--;
                if (this.tree != "adventurer_shared" && this.tree != player.classes.main.perkTree && this.tree != ((_b = (_a = player.classes) === null || _a === void 0 ? void 0 : _a.sub) === null || _b === void 0 ? void 0 : _b.perkTree)) {
                    player.classes.sub = new combatClass(combatClasses[this.tree + "Class"]);
                }
                this.statModifiers.forEach((stat) => {
                    let add = true;
                    player.statModifiers.some((mod) => {
                        if (mod.id === stat.id) {
                            add = false;
                            return true;
                        }
                    });
                    if (add)
                        player.statModifiers.push(stat);
                });
                player.updateStatModifiers();
                player.updatePerks();
                player.updateAbilities();
                lvl_history.perks.push(this.id);
                lvl_history.pp++;
                formPerks();
                formStatUpgrades();
            }
        };
    }
}
function changePerkTree(newTree) {
    tree = newTree;
    formPerks(null, true);
}
const perkScroll = {
    x: 0,
    y: 0
};
function formPerks(e = null, scrollDefault = false) {
    perks = [];
    const bg = document.querySelector(".playerLeveling .perks");
    const staticBg = document.querySelector(".playerLeveling .perksStatic");
    const perkTreesContainer = document.querySelector(".playerLeveling .perkTreesContainer");
    const perkArea = bg.querySelector(".container");
    // const leftScroll = perkArea.scrollLeft;
    // const topScroll = perkArea.scrollTop;
    perkArea.innerHTML = "";
    Object.entries(perksArray[tree].perks).forEach((_perk) => {
        perks.push(new perk(_perk[1]));
    });
    hideHover();
    const baseSize = 128;
    const baseImg = 104;
    const baseFont = 12;
    const lineSize = 64;
    const lineWidth = 10;
    const points = document.createElement("p");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    points.textContent = lang["perk_points"] + ": " + player.pp.toString();
    points.classList.add("perkPoints");
    staticBg.textContent = "";
    perkTreesContainer.textContent = "";
    Object.entries(combatClasses).forEach((combatClassObject) => {
        var _a, _b, _c, _d;
        const combatClass = combatClassObject[1];
        if ((((_a = player.classes.main) === null || _a === void 0 ? void 0 : _a.id) && ((_b = player.classes.sub) === null || _b === void 0 ? void 0 : _b.id)) || player.level.level < 10) {
            if (combatClass.id != player.classes.main.id && combatClass.id != ((_d = (_c = player.classes) === null || _c === void 0 ? void 0 : _c.sub) === null || _d === void 0 ? void 0 : _d.id))
                return;
        }
        const classButtonContainer = document.createElement("div");
        const combatClassName = document.createElement("p");
        const combatClassIcon = document.createElement("img");
        if (combatClass.perkTree == tree) {
            classButtonContainer.classList.add("goldenBorder");
        }
        else if (combatClass.id != player.classes.main.id && player.level.level < 10) {
            classButtonContainer.classList.add("greyedOut");
        }
        classButtonContainer.addEventListener("click", a => changePerkTree(combatClass.perkTree));
        classButtonContainer.classList.add("classButtonContainer");
        combatClassName.textContent = lang[combatClass.id + "_name"];
        combatClassIcon.src = combatClass.icon;
        classButtonContainer.style.background = combatClass.color;
        classButtonContainer.append(combatClassIcon, combatClassName);
        perkTreesContainer.append(classButtonContainer);
    });
    const classButtonContainer = document.createElement("div");
    const combatClassName = document.createElement("p");
    const combatClassIcon = document.createElement("img");
    classButtonContainer.addEventListener("click", a => changePerkTree("adventurer_shared"));
    classButtonContainer.classList.add("classButtonContainer");
    combatClassName.textContent = lang["adventurerPerks"];
    combatClassIcon.src = "resources/icons/adventurer.png";
    classButtonContainer.style.background = "rgb(100, 52, 5)";
    if (tree == "adventurer_shared") {
        classButtonContainer.classList.add("goldenBorder");
    }
    classButtonContainer.append(combatClassIcon, combatClassName);
    perkTreesContainer.append(classButtonContainer);
    staticBg.append(points);
    perks.forEach((_perk) => {
        var _a;
        const perk = document.createElement("div");
        const img = document.createElement("img");
        const name = document.createElement("p");
        perk.classList.add("perkBg");
        perk.classList.add(`${_perk.id}`);
        perk.style.backgroundColor = perkColors[tree];
        img.src = _perk.icon;
        name.textContent = (_a = lang[_perk.id + "_name"]) !== null && _a !== void 0 ? _a : _perk.id;
        tooltip(perk, perkTT(_perk));
        perk.style.width = `${baseSize}px`;
        perk.style.height = `${baseSize}px`;
        img.style.width = `${baseImg}px`;
        img.style.height = `${baseImg}px`;
        name.style.fontSize = `${baseFont}px`;
        perk.addEventListener("click", a => _perk.buy());
        if (_perk.bought())
            perk.classList.add("perkBought");
        if (!_perk.available()) {
            perk.classList.add("perkUnavailable");
        }
        if (_perk.relative_to) {
            let found = perkArea.querySelector(`.${_perk.relative_to}`);
            perk.style.left = `${(_perk.pos.x * baseSize) + found.offsetLeft}px`;
            perk.style.top = `${(_perk.pos.y * baseSize) + found.offsetTop}px`;
        }
        else {
            perk.style.left = `${(_perk.pos.x * baseSize)}px`;
            perk.style.top = `${(_perk.pos.y * baseSize)}px`;
        }
        perk.append(img, name);
        perkArea.append(perk, svg);
    });
    perks.forEach((_perk) => {
        let perk = perkArea.querySelector(`.${_perk.id}`);
        if (_perk.requires) {
            _perk.requires.forEach((req) => {
                let found = perkArea.querySelector(`.${req}`);
                let color = "rgb(65, 65, 65)";
                let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                if (_perk.bought())
                    color = "gold";
                else if (!_perk.available())
                    color = "rgb(40, 40, 40)";
                line.setAttribute('x1', `${+perk.style.left.replace(/\D/g, '') + (lineSize)}px`);
                line.setAttribute('y1', `${+perk.style.top.replace(/\D/g, '') + (lineSize)}px`);
                line.setAttribute('x2', `${+found.style.left.replace(/\D/g, '') + (lineSize)}px`);
                line.setAttribute('y2', `${+found.style.top.replace(/\D/g, '') + (lineSize)}px`);
                line.setAttribute("stroke", color);
                line.setAttribute("stroke-width", `${lineWidth}px`);
                svg.appendChild(line);
            });
        }
    });
    perkArea.style.transform = `scale(${currentZoomBG})`;
    svg.setAttribute('width', "4000");
    svg.setAttribute('height', "4000");
    if (!scrollDefault)
        background.scrollTo(perkScroll.x, perkScroll.y);
    else
        background.scrollTo(perksArray[tree].startPos * currentZoomBG, 0);
    /* Making a proper zoom has defeated me, it will simply not center on mouse, ever. */
}
function formStatUpgrades() {
    const bg = document.querySelector(".playerLeveling .stats");
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
    baseStats.forEach(stat => {
        var _a;
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
        upgrade.addEventListener("click", a => upStat(stat));
        tooltip(base, (_a = lang[stat + "_tt"]) !== null && _a !== void 0 ? _a : "no tooltip");
        if (player.sp <= 0)
            upgrade.style.transform = "scale(0)";
        base.append(baseImg, baseText, baseNumber, upgrade);
        container.append(base);
    });
    undo.addEventListener("click", undoChanges);
    bg.append(points, container, undo);
}
function upStat(stat) {
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
    const lvling = document.querySelector(".playerLeveling");
    lvling.style.transform = "scale(1)";
    document.querySelector(".worldText").style.opacity = "0";
    lvl_history.perks = [];
    lvl_history.stats = { str: 0, dex: 0, vit: 0, int: 0, cun: 0 };
    lvl_history.pp = 0;
    lvl_history.sp = 0;
    formPerks();
    formStatUpgrades();
    state.perkOpen = true;
}
function perkTT(perk) {
    var _a, _b, _c;
    var txt = "";
    txt += `\t<f>21px<f>${(_a = lang[perk.id + "_name"]) !== null && _a !== void 0 ? _a : perk.id}\t\n`;
    txt += `<f>15px<f><c>silver<c>"${(_b = lang[perk.id + "_desc"]) !== null && _b !== void 0 ? _b : perk.id + "_desc"}"<c>white<c>\n`;
    if (DEVMODE)
        txt += `<f>18px<f><c>gold<c>${perk.id}<c>white<c>\n`;
    if (((_c = perk.requires) === null || _c === void 0 ? void 0 : _c.length) > 0) {
        txt += `<f>16px<f><c>white<c>${lang["requires"]}:  `;
        perk.requires.forEach(req => {
            var _a;
            let found = false;
            player.perks.forEach((prk) => {
                if (prk.id == req) {
                    found = true;
                }
            });
            txt += `<c> ${found ? "lime" : "red"}<c>${(_a = lang[req + "_name"]) !== null && _a !== void 0 ? _a : req}, `;
        });
        txt = txt.substring(0, txt.length - 2);
        txt += "§";
    }
    if (Object.values(perk.commands).length > 0) {
        Object.entries(perk.commands).forEach((com) => txt += commandSyntax(com[0], com[1]));
    }
    if (Object.values(perk.effects).length > 0) {
        txt += `\n<i>${icons.resistance}<i><f>16px<f>${lang["status_effects"]}:\n`;
        Object.entries(perk.effects).forEach(eff => txt += effectSyntax(eff, true, ""));
    }
    if (perk.statModifiers) {
        perk.statModifiers.forEach((statModif) => {
            txt += statModifTT(statModif);
        });
    }
    return txt;
}
function statModifTT(statModif) {
    var _a;
    statModif = new PermanentStatModifier(Object.assign({}, statModif));
    let txt = `§\n ${lang["passive"]} <f>16px<f><c>white<c>'<c>gold<c>${(_a = lang[statModif.id + "_name"]) !== null && _a !== void 0 ? _a : statModif.id}<c>white<c>'\n`;
    if (statModif.desc)
        txt += `§<c>silver<c><f>13px<f>"${lang[statModif.desc]}"\n§`;
    if (statModif.conditions) {
        txt += `<c>white<c><f>15px<f>${lang["active_if"]}:\n`;
        Object.entries(statModif.conditions).forEach(cond => {
            const key = cond[0];
            const val = cond[1];
            txt += `<c>white<c><f>13px<f>${lang[key]} ${val}%\n`;
        });
    }
    txt += `<c>white<c><f>15px<f>${lang["status_effects"]}:\n`;
    Object.entries(statModif.effects).forEach(eff => txt += effectSyntax(eff, true, ""));
    return txt;
}
const zoomLevelsBG = [0.17, 0.25, 0.33, 0.41, 0.5, 0.6, 0.7, 0.75, 0.87, 1, 1.12, 1.25, 1.33, 1.5, 1.64, 1.75, 1.87, 2];
var currentZoomBG = 1;
const background = document.querySelector(".playerLeveling .perks");
background.addEventListener('mousedown', action1);
background.addEventListener('mousemove', action2);
background.addEventListener("wheel", changeZoomLevelBG);
// @ts-expect-error
function changeZoomLevelBG(e) {
    if (e.deltaY > 0) {
        currentZoomBG = zoomLevelsBG[zoomLevelsBG.indexOf(currentZoomBG) - 1] || zoomLevelsBG[0];
    }
    else {
        currentZoomBG = zoomLevelsBG[zoomLevelsBG.indexOf(currentZoomBG) + 1] || zoomLevelsBG[zoomLevelsBG.length - 1];
    }
    formPerks(e);
}
let mouseX = 0;
let mouseY = 0;
let bgPosX = 0;
let bgPosY = 0;
let eAction = null;
function action1(e) {
    mouseX = e.x;
    mouseY = e.y;
    eAction = e;
    bgPosX = background.scrollLeft;
    bgPosY = background.scrollTop;
}
function action2(e) {
    if (e.buttons == 1) {
        let offsetX = e.x - mouseX;
        let offsetY = e.y - mouseY;
        background.scrollTo(bgPosX - offsetX, bgPosY - offsetY);
        perkScroll.x = bgPosX - offsetX;
        perkScroll.y = bgPosY - offsetY;
    }
}
function undoChanges() {
    lvl_history.perks.forEach((prk) => {
        let index = player.perks.findIndex((_prk) => _prk.id == prk);
        player.perks[index].statModifiers.forEach((rem) => {
            const modIndex = player.statModifiers.findIndex((stat) => stat.id === rem.id);
            player.statModifiers.splice(modIndex, 1);
        });
        player.perks.splice(index, 1);
    });
    Object.entries(lvl_history.stats).forEach((stat) => {
        const id = stat[0];
        const val = stat[1];
        player.stats[id] -= val;
    });
    player.sp += lvl_history.sp;
    player.pp += lvl_history.pp;
    lvl_history.perks = [];
    lvl_history.stats = { str: 0, dex: 0, vit: 0, int: 0, cun: 0 };
    lvl_history.pp = 0;
    lvl_history.sp = 0;
    formPerks();
    formStatUpgrades();
}
//formPerks();
//# sourceMappingURL=perk.js.map