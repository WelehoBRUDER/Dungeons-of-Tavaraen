"use strict";
const raceTexts = {
    human: {
        name: "Human",
        desc: ""
    },
    elf: {
        name: "Half-Elf",
        desc: ""
    },
    orc: {
        name: "Half-Orc",
        desc: ""
    },
    ashen: {
        name: "Ashen",
        desc: ""
    }
};
const raceEffects = {
    elf: {
        modifiers: {
            strV: -3,
            vitV: -3,
            dexV: 5,
            intV: 5,
            cunV: 3,
            sightV: 2,
            mpMaxV: 20
        },
        name: "Elvish Blood",
        desc: "Snobby pricks can show a good dance, but not a good fight."
    },
    orc: {
        modifiers: {
            strV: 5,
            vit: 8,
            dexV: -4,
            intV: -4,
            cunV: -1,
            sightV: 1,
            hpMaxV: 30
        },
        name: "Orcy Bod",
        desc: "Orcies not make gud thinkaz', but do good git smashaz."
    },
    ashen: {
        modifiers: {
            strV: -1,
            vitV: -1,
            intV: -1,
            dexV: 3,
            cunV: 3,
            sightV: 5,
            hpMaxV: 15
        },
        name: "Ashen Constitution",
        desc: "The Ashen are sly and slippery, not gifted in straight battle."
    },
    human: {
        modifiers: {
            strV: 1,
            vitV: 2,
            dexV: 1,
            intV: 3,
            cunV: 2
        },
        name: "Human Will",
        desc: "No scenario is unbeatable to man, any adversary can be overcome with determination and grit! Where power fails, smarts will succeed."
    }
};
class PlayerCharacter extends Character {
    constructor(base) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
        super(base);
        this.canFly = (_a = base.canFly) !== null && _a !== void 0 ? _a : false;
        this.sprite = (_b = base.sprite) !== null && _b !== void 0 ? _b : ".player";
        this.race = (_c = base.race) !== null && _c !== void 0 ? _c : "human";
        this.hair = (_d = base.hair) !== null && _d !== void 0 ? _d : 1;
        this.eyes = (_e = base.eyes) !== null && _e !== void 0 ? _e : 1;
        this.face = (_f = base.face) !== null && _f !== void 0 ? _f : 1;
        this.level = base.level;
        this.weapon = (_g = base.weapon) !== null && _g !== void 0 ? _g : {};
        this.offhand = (_h = base.offhand) !== null && _h !== void 0 ? _h : {};
        this.chest = (_j = base.chest) !== null && _j !== void 0 ? _j : {};
        this.helmet = (_k = base.helmet) !== null && _k !== void 0 ? _k : {};
        this.gloves = (_l = base.gloves) !== null && _l !== void 0 ? _l : {};
        this.boots = (_m = base.boots) !== null && _m !== void 0 ? _m : {};
        this.raceEffect = raceEffects[this.race];
        this.artifact1 = (_o = base.artifact1) !== null && _o !== void 0 ? _o : {};
        this.artifact2 = (_p = base.artifact2) !== null && _p !== void 0 ? _p : {};
        this.artifact3 = (_q = base.artifact3) !== null && _q !== void 0 ? _q : {};
        this.inventory = (_r = base.inventory) !== null && _r !== void 0 ? _r : [];
        this.isDead = (_s = base.isDead) !== null && _s !== void 0 ? _s : false;
        this.grave = (_t = base.grave) !== null && _t !== void 0 ? _t : null;
        this.respawnPoint = (_u = base.respawnPoint) !== null && _u !== void 0 ? _u : null; // need to add default point, or this might soft lock
        this.gold = (_v = base.gold) !== null && _v !== void 0 ? _v : 0;
        this.perks = (_w = base.perks) !== null && _w !== void 0 ? _w : [];
        this.sp = (_x = base.sp) !== null && _x !== void 0 ? _x : 0;
        this.pp = (_y = base.pp) !== null && _y !== void 0 ? _y : 0;
        this.usedShrines = (_z = base.usedShrines) !== null && _z !== void 0 ? _z : [];
        this.hpRegen = () => {
            const { v: val, m: mod } = getModifiers(this, "hpRegen");
            return Math.floor((val) * mod);
        };
        this.sight = () => {
            const { v: val, m: mod } = getModifiers(this, "sight");
            return Math.floor((5 + val) * mod);
        };
        this.drop = (itm) => {
            const item = Object.assign({}, itm);
            this.inventory.splice(itm.index, 1);
            createDroppedItem(this.cords, item);
            renderInventory();
            modifyCanvas();
        };
        this.updatePerks = () => {
            this.perks.forEach(prk => {
                var _a;
                let cmdsEx = prk.commandsExecuted;
                prk = new perk(Object.assign({}, perksArray[prk.tree]["perks"][prk.id]));
                if (!cmdsEx) {
                    (_a = Object.entries(prk.commands)) === null || _a === void 0 ? void 0 : _a.forEach(cmd => { command(cmd); });
                }
                prk.commandsExecuted = cmdsEx;
            });
            updateUI();
        };
        this.unequip = (event, slot) => {
            var _a, _b;
            if (event.button !== 2 || !((_a = this[slot]) === null || _a === void 0 ? void 0 : _a.id))
                return;
            if ((_b = this[slot]) === null || _b === void 0 ? void 0 : _b.id) {
                this.inventory.push(this[slot]);
            }
            ;
            Object.entries(this[slot].commands).forEach(cmd => {
                if (cmd[0].includes("ability_")) {
                    commandRemoveAbility(cmd);
                }
            });
            this[slot] = {};
            renderInventory();
        };
        this.equip = (event, item) => {
            if (event.button !== 2)
                return;
            const itm = Object.assign({}, item);
            player.inventory.splice(item.index, 1);
            this.unequip(event, itm.slot);
            this[itm.slot] = Object.assign({}, itm);
            Object.entries(item.commands).forEach(cmd => command(cmd));
            renderInventory();
        };
        this.carryingWeight = () => {
            let total = 0;
            this.inventory.forEach(itm => {
                total += itm.weight;
            });
            return total.toFixed(1);
        };
        this.maxCarryWeight = () => {
            const { v: val, m: mod } = getModifiers(this, "carryStrength");
            return ((92.5 + val + this.getStats().str / 2 + this.getStats().vit) * mod).toFixed(1);
        };
        this.lvlUp = () => {
            while (this.level.xp >= this.level.xpNeed) {
                this.level.xp -= this.level.xpNeed;
                this.level.level++;
                this.sp += 3;
                this.pp += 1;
                this.level.xpNeed = nextLevel(this.level.level);
                let lvlText = lang["lvl_up"];
                lvlText = lvlText.replace("[LVL]", this.level.level.toString());
                spawnFloatingText(this.cords, "LVL UP!", "lime", 50, 2000, 450);
                displayText(`<c>white<c>[WORLD] <c>gold<c>${lvlText}`);
                updateUI();
            }
        };
        this.kill = () => {
            if (this.isDead)
                return;
            // handle death logic once we get there ;)
            this.isDead = true;
            displayText(`<c>white<c>[WORLD] <c>crimson<c>${lang["player_death_log"]}`);
            const xpLoss = Math.floor(random(this.level.xp * 0.5, this.level.xp * 0.07));
            const goldLoss = Math.floor(random(this.gold * 0.6, this.gold * 0.1));
            this.level.xp -= xpLoss;
            this.gold -= goldLoss;
            if (xpLoss > 0)
                spawnFloatingText(this.cords, `-${xpLoss} XP`, "orange", 32, 900, 350);
            if (goldLoss > 0)
                spawnFloatingText(this.cords, `-${goldLoss} G`, "orange", 32, 1000, 450);
            this.grave = { cords: Object.assign({}, this.cords), xp: xpLoss, gold: goldLoss };
            this.usedShrines = [];
            setTimeout(modifyCanvas, 300);
            displayText("PAINA [R] JA RESPAWNAAT");
            updateUI();
        };
    }
}
function nextLevel(level) {
    let base = 75;
    let exponent = 1.35;
    if (level >= 9)
        base = 100;
    if (level >= 29)
        base = 200;
    if (level >= 49)
        base = 375;
    return Math.floor(base * (Math.pow(level, exponent)));
}
function updatePlayerInventoryIndexes() {
    for (let i = 0; i < player.inventory.length; i++) {
        player.inventory[i].index = i;
    }
}
function sortInventory(category, reverse) {
    sortingReverse = !sortingReverse;
    if (category == "name" || category == "type") {
        player.inventory.sort((a, b) => stringSort(a, b, category, reverse));
    }
    if (category == "grade") {
        player.inventory.sort((a, b) => gradeSort(a, b, "grade", reverse));
    }
    else
        player.inventory.sort((a, b) => numberSort(a, b, category, reverse));
    renderInventory();
}
function commandRemoveAbility(cmd) {
    const id = cmd[0].replace("add_ability_", "");
    for (let i = 0; i < player.abilities.length; i++) {
        if (player.abilities[i].id == id)
            player.abilities.splice(i, 1);
    }
    updateUI();
}
function stringSort(a, b, string, reverse = false) {
    var nameA = a[string].toUpperCase(); // ignore upper and lowercase
    var nameB = b[string].toUpperCase(); // ignore upper and lowercase
    if (reverse) {
        if (nameA > nameB) {
            return -1;
        }
        if (nameA < nameB) {
            return 1;
        }
        // names must be equal
        return 0;
    }
    else {
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        // names must be equal
        return 0;
    }
}
;
const grade_vals = {
    common: 0,
    uncommon: 1,
    rare: 2,
    mythical: 3,
    legendary: 4
};
function gradeSort(a, b, string, reverse = false) {
    var nameA = grade_vals[a[string]];
    var nameB = grade_vals[b[string]];
    if (reverse) {
        if (nameA > nameB) {
            return -1;
        }
        if (nameA < nameB) {
            return 1;
        }
        // names must be equal
        return 0;
    }
    else {
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        // names must be equal
        return 0;
    }
}
;
function numberSort(a, b, string, reverse = false) {
    var numA = a[string];
    var numB = b[string];
    if (!reverse) {
        if (numA > numB) {
            return -1;
        }
        if (numA < numB) {
            return 1;
        }
        // names must be equal
        return 0;
    }
    else {
        if (numA < numB) {
            return -1;
        }
        if (numA > numB) {
            return 1;
        }
        // names must be equal
        return 0;
    }
}
var player = new PlayerCharacter({
    id: "player",
    name: "Varien Loreanus",
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
    sprite: ".player",
    race: "elf",
    hair: 4,
    eyes: 2,
    face: 1,
    weapon: new Weapon(Object.assign({}, items.longsword)),
    chest: new Armor(Object.assign({}, items.raggedShirt)),
    helmet: {},
    gloves: {},
    boots: new Armor(Object.assign({}, items.raggedBoots)),
    canFly: false,
    perks: [],
    abilities: [
        new Ability(Object.assign({}, abilities.attack), dummy),
    ],
    statModifiers: [
        {
            name: "Resilience of the Lone Wanderer",
            effects: {
                hpMaxV: 55,
                mpMaxV: 10
            }
        }
    ],
    statusEffects: [
        new statEffect(Object.assign({}, statusEffects.poison), s_def)
    ],
    inventory: [],
    gold: 50,
    sp: 5,
    pp: 1,
    respawnPoint: { cords: { x: 4, y: 4 } },
    usedShrines: []
});
var randomProperty = function (obj) {
    var keys = Object.keys(obj);
    return obj[keys[keys.length * Math.random() << 0]];
};
for (let i = 0; i < 25; i++) {
    player.inventory.push(Object.assign({}, randomProperty(items)));
}
//# sourceMappingURL=player.js.map