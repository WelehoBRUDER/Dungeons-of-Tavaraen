"use strict";
var perksData = [];
var perks = [];
var tree = "sorcerer"; // replace with player class when added
const perkColors = {
    necromancer: "#20142e",
    sorcerer: "#183952",
};
class perk {
    constructor(base) {
        var _a, _b, _c, _d, _e;
        this.id = base.id;
        const basePerk = perksArray[tree]["perks"][this.id];
        if (!basePerk)
            console.error("Perk invalid! Most likely id is wrong!");
        this.name = basePerk.name;
        this.desc = basePerk.desc;
        this.commands = (_a = Object.assign({}, basePerk.commands)) !== null && _a !== void 0 ? _a : {};
        this.effects = (_b = Object.assign({}, basePerk.effects)) !== null && _b !== void 0 ? _b : {};
        this.commandsExecuted = (_c = base.commandsExecuted) !== null && _c !== void 0 ? _c : false;
        this.pos = basePerk.pos;
        this.relative_to = (_d = basePerk.relative_to) !== null && _d !== void 0 ? _d : "";
        this.requires = (_e = basePerk.requires) !== null && _e !== void 0 ? _e : [];
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
            if (this.available() && !this.bought()) {
                player.perks.push(new perk(Object.assign({}, this)));
                player.pp--;
                player.updatePerks();
                formPerks();
            }
        };
    }
}
function formPerks() {
    perks = [];
    const bg = document.querySelector(".playerLeveling .perks");
    const perkArea = bg.querySelector(".container");
    perkArea.innerHTML = "";
    Object.entries(perksArray[tree].perks).forEach((_perk) => {
        perks.push(new perk(_perk[1]));
    });
    const points = document.createElement("p");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', "4000");
    svg.setAttribute('height', "4000");
    points.textContent = lang["perk_points"] + ": " + player.pp.toString();
    points.classList.add("perkPoints");
    bg.append(points);
    perks.forEach((_perk) => {
        var _a;
        const perk = document.createElement("div");
        const img = document.createElement("img");
        const name = document.createElement("p");
        perk.classList.add("perkBg");
        perk.classList.add(`${_perk.id}`);
        perk.style.backgroundColor = perkColors[tree];
        img.src = _perk.icon;
        name.textContent = (_a = lang[_perk.id + "_name"]) !== null && _a !== void 0 ? _a : _perk.name;
        tooltip(perk, perkTT(_perk));
        perk.addEventListener("click", a => _perk.buy());
        if (_perk.bought())
            perk.classList.add("perkBought");
        if (!_perk.available()) {
            perk.classList.add("perkUnavailable");
        }
        if (_perk.relative_to) {
            let found = perkArea.querySelector(`.${_perk.relative_to}`);
            perk.style.left = `${(_perk.pos.x * 128) + found.offsetLeft}px`;
            perk.style.top = `${(_perk.pos.y * 128) + found.offsetTop}px`;
        }
        else {
            perk.style.left = `${_perk.pos.x * 128}px`;
            perk.style.top = `${_perk.pos.y * 128}px`;
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
                line.setAttribute('x1', `${+perk.style.left.replace(/\D/g, '') + 64}px`);
                line.setAttribute('y1', `${+perk.style.top.replace(/\D/g, '') + 64}px`);
                line.setAttribute('x2', `${+found.style.left.replace(/\D/g, '') + 64}px`);
                line.setAttribute('y2', `${+found.style.top.replace(/\D/g, '') + 64}px`);
                line.setAttribute("stroke", color);
                line.setAttribute("stroke-width", "10px");
                svg.appendChild(line);
            });
        }
    });
}
function formStatUpgrades() {
    const bg = document.querySelector(".playerLeveling .stats");
    const points = document.createElement("p");
    const baseStats = ["str", "dex", "vit", "int", "cun"];
    bg.innerHTML = "";
    points.textContent = lang["stat_points"] + ": " + player.sp.toString();
    points.classList.add("statPoints");
    /* Form stats */
    const container = document.createElement("div");
    container.classList.add("statContainer");
    baseStats.forEach(stat => {
        const base = document.createElement("div");
        const baseImg = document.createElement("img");
        const baseText = document.createElement("p");
        const baseNumber = document.createElement("p");
        const upgrade = document.createElement("span");
        base.classList.add("statUp");
        baseImg.src = icons[stat];
        baseText.textContent = lang[stat];
        baseNumber.textContent = player.getStats()[stat].toString();
        upgrade.textContent = "+";
        upgrade.addEventListener("click", a => upStat(stat));
        if (player.sp <= 0)
            upgrade.style.transform = "scale(0)";
        base.append(baseImg, baseText, baseNumber, upgrade);
        container.append(base);
    });
    bg.append(points, container);
}
function upStat(stat) {
    if (player.sp >= 1) {
        player.sp--;
        player.stats[stat]++;
        formStatUpgrades();
    }
}
function openLevelingScreen() {
    hideHover();
    const lvling = document.querySelector(".playerLeveling");
    lvling.style.transform = "scale(1)";
    document.querySelector(".worldText").style.opacity = "0";
    formPerks();
    formStatUpgrades();
    invOpen = true;
}
function perkTT(perk) {
    var txt = "";
    txt += `\t<f>21px<f>${lang[perk.id + "_name"]}\t\n`;
    txt += `<f>15px<f><c>silver<c>"${lang[perk.id + "_desc"]}"<c>white<c>\n`;
    if (Object.values(perk.commands).length > 0) {
        Object.entries(perk.commands).forEach(com => txt += com[0]);
    }
    if (Object.values(perk.effects).length > 0) {
        txt += `\n<i>${icons.resistance}<i><f>16px<f>${lang["status_effects"]}:\n`;
        Object.entries(perk.effects).forEach(eff => txt += effectSyntax(eff, true, ""));
    }
    return txt;
}
//formPerks();
//# sourceMappingURL=perk.js.map