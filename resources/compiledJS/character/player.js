"use strict";
class PlayerCharacter extends Character {
    constructor(base) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
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
        this.legs = (_o = base.legs) !== null && _o !== void 0 ? _o : {};
        this.raceEffect = raceEffects[this.race];
        this.artifact1 = (_p = base.artifact1) !== null && _p !== void 0 ? _p : {};
        this.artifact2 = (_q = base.artifact2) !== null && _q !== void 0 ? _q : {};
        this.artifact3 = (_r = base.artifact3) !== null && _r !== void 0 ? _r : {};
        this.inventory = (_s = [...base.inventory]) !== null && _s !== void 0 ? _s : [];
        this.isDead = (_t = base.isDead) !== null && _t !== void 0 ? _t : false;
        this.grave = (_u = base.grave) !== null && _u !== void 0 ? _u : null;
        this.respawnPoint = (_v = { ...base.respawnPoint }) !== null && _v !== void 0 ? _v : null; // need to add default point, or this might soft lock
        this.gold = (_w = base.gold) !== null && _w !== void 0 ? _w : 0;
        this.perks = (_x = [...base.perks]) !== null && _x !== void 0 ? _x : [];
        this.sp = (_y = base.sp) !== null && _y !== void 0 ? _y : 0;
        this.pp = (_z = base.pp) !== null && _z !== void 0 ? _z : 0;
        this.usedShrines = (_0 = [...base.usedShrines]) !== null && _0 !== void 0 ? _0 : [];
        this.unarmedDamages = (_1 = base.unarmedDamages) !== null && _1 !== void 0 ? _1 : { crush: 5 };
        this.classes = (_2 = { ...base.classes }) !== null && _2 !== void 0 ? _2 : {};
        this.oldCords = (_3 = { ...base.oldCords }) !== null && _3 !== void 0 ? _3 : this.cords;
        this.flags = (_4 = { ...base.flags }) !== null && _4 !== void 0 ? _4 : [];
        this.questProgress = base.questProgress ? [...base.questProgress] : [];
        this.entitiesEverEncountered = base.entitiesEverEncountered
            ? { ...base.entitiesEverEncountered }
            : { items: {}, enemies: {}, summons: {} };
        this.sex = (_5 = base.sex) !== null && _5 !== void 0 ? _5 : "male";
        this.activeQuest = (_6 = base.activeQuest) !== null && _6 !== void 0 ? _6 : -1;
        this.timePlayed = base.timePlayed ? Math.round(base.timePlayed) : 0;
        this.fistDmg = () => {
            let damages = {};
            Object.entries(this.unarmedDamages).forEach((dmg) => {
                const key = dmg[0];
                const _val = dmg[1];
                const { v: val, m: mod } = getModifiers(this, "unarmedDmg" + key);
                const { v: baseVal, m: baseMod } = getModifiers(this, "unarmedDmg");
                damages[key] = Math.floor(((val + _val) * mod + baseVal) * baseMod);
            });
            return damages;
        };
        this.hpRegen = () => {
            const { v: val, m: mod } = getModifiers(this, "hpRegen");
            return Math.floor(val * mod);
        };
        this.sight = () => {
            const { v: val, m: mod } = getModifiers(this, "sight");
            return Math.floor((15 + val) * mod);
        };
        this.drop = (itm, fromContextMenu = false) => {
            const item = { ...itm };
            this.inventory.splice(itm.index, 1);
            createDroppedItem(this.cords, item);
            renderInventory();
            modifyCanvas();
            if (fromContextMenu)
                contextMenu.textContent = "";
        };
        this.updatePerks = (dontUpdateUI = false, dontExecuteCommands = false) => {
            var _a;
            this.perks.forEach((prk, index) => {
                var _a;
                let cmdsEx = prk.commandsExecuted;
                prk = new perk({ ...perksArray[prk.tree]["perks"][prk.id] });
                if (!cmdsEx && !dontExecuteCommands) {
                    console.log("executing commands");
                    (_a = Object.entries(prk.commands)) === null || _a === void 0 ? void 0 : _a.forEach((cmd) => {
                        command(cmd);
                    });
                }
                prk.commandsExecuted = true;
                this.perks[index] = { ...prk };
                prk.traits.forEach((stat) => {
                    if (player.traits.findIndex((t) => t.id === stat.id) !== -1)
                        return;
                    else {
                        this.traits.push({ ...stat });
                    }
                });
            });
            for (let i = this.perks.length - 1; i >= 0; i--) {
                if (((_a = this.perks[i]) === null || _a === void 0 ? void 0 : _a.id) == undefined) {
                    this.perks.splice(i, 1);
                }
            }
            if (dontUpdateUI)
                return;
            updateUI();
        };
        this.unequip = (event, slot, putToIndex = -1, shiftItems = false, fromContextMenu = false) => {
            var _a, _b;
            if ((event.button !== 2 && !fromContextMenu) || !((_a = this[slot]) === null || _a === void 0 ? void 0 : _a.id))
                return;
            if (fromContextMenu) {
                contextMenu.textContent = "";
            }
            if ((_b = this[slot]) === null || _b === void 0 ? void 0 : _b.id) {
                if (putToIndex != -1) {
                    if (shiftItems) {
                        this.inventory.splice(putToIndex, 0, this[slot]);
                    }
                    else
                        this.inventory[putToIndex] = this[slot];
                }
                else
                    this.inventory.push(this[slot]);
            }
            Object.entries(this[slot].commands).forEach((cmd) => {
                if (cmd[0].includes("ability_")) {
                    commandRemoveAbility(cmd);
                }
            });
            this[slot] = {};
            player.allModifiers = getAllModifiersOnce(player, true);
            renderInventory();
        };
        this.equip = (event, item, fromContextMenu = false, auto = false) => {
            var _a, _b, _c;
            if (event.button !== 2 && !fromContextMenu)
                return;
            if (fromContextMenu) {
                contextMenu.textContent = "";
            }
            if (item.type == "consumable")
                return;
            if (item.id == "A0_error") {
                player.inventory.splice(item.index, 1);
                renderInventory();
                return;
            }
            const itm = { ...item };
            let canEquip = true;
            if (itm.requiresStats) {
                const stats = this.getStats();
                Object.entries(itm.requiresStats).forEach((stat) => {
                    const key = stat[0];
                    const val = stat[1];
                    if (stats[key] < val)
                        canEquip = false;
                });
            }
            let spliceFromInv = true;
            let shiftOffhand = true;
            if (!canEquip)
                return;
            if (item.slot == "offhand" && ((_a = this.weapon) === null || _a === void 0 ? void 0 : _a.twoHanded)) {
                this.unequip(event, "weapon", item.index, false, fromContextMenu);
                spliceFromInv = false;
            }
            if (!((_b = this[itm.slot]) === null || _b === void 0 ? void 0 : _b.id) && spliceFromInv)
                player.inventory.splice(item.index, 1);
            if (!((_c = this[itm.slot]) === null || _c === void 0 ? void 0 : _c.id))
                shiftOffhand = false;
            else
                this.unequip(event, itm.slot, itm.index, false, fromContextMenu);
            this[itm.slot] = { ...itm };
            Object.entries(item.commands).forEach((cmd) => command(cmd));
            if (item.twoHanded) {
                if (shiftOffhand) {
                    this.unequip(event, "offhand", item.index + 1, true, fromContextMenu);
                }
                else
                    this.unequip(event, "offhand", item.index, true, fromContextMenu);
            }
            player.allModifiers = getAllModifiersOnce(player, true);
            if (!auto)
                renderInventory();
        };
        this.carryingWeight = () => {
            let total = 0;
            this.inventory.forEach((itm) => {
                total += itm.weight;
            });
            return total.toFixed(1);
        };
        this.maxCarryWeight = () => {
            const { v: val, m: mod } = getModifiers(this, "carryStrength");
            return ((92.5 + val + this.getStats().str / 2 + this.getStats().vit) *
                mod).toFixed(1);
        };
        this.lvlUp = () => {
            while (this.level.xp >= this.level.xpNeed) {
                this.level.xp -= this.level.xpNeed;
                this.level.level++;
                if (this.level.level < 6) {
                    this.pp += 2;
                    this.sp += 4;
                }
                else if (this.level.level % 10 == 0) {
                    this.pp += 3;
                    this.sp += 5;
                }
                else {
                    this.pp++;
                    this.sp += 3;
                }
                this.level.xpNeed = nextLevel(this.level.level);
                this.stats.hp = this.getHpMax();
                this.stats.mp = this.getMpMax();
                let lvlText = lang["lvl_up"];
                lvlText = lvlText.replace("[LVL]", this.level.level.toString());
                spawnFloatingText(this.cords, "LVL UP!", "lime", 50, 2000, 450);
                displayText(`<c>white<c>[WORLD] <c>gold<c>${lvlText}`);
                updateUI();
            }
            // Add racial bonus
            if (this.level.level >= 10 &&
                this.traits.findIndex((m) => m.id === `racial_ability_${this.race}_1`) === -1) {
                this.traits.push(new PermanentStatModifier(traits[`racial_ability_${this.race}_1`]));
                spawnFloatingText(this.cords, "RACIAL ABILITY!", "lime", 50, 2000, 450);
            }
        };
        this.getArtifactSetBonuses = (getOnlySetAmounts = false) => {
            var _a, _b, _c;
            let sets = {};
            let effects = {};
            if ((_a = this.artifact1) === null || _a === void 0 ? void 0 : _a.artifactSet) {
                sets[this.artifact1.artifactSet] = 1;
            }
            if ((_b = this.artifact2) === null || _b === void 0 ? void 0 : _b.artifactSet) {
                if (sets[this.artifact2.artifactSet])
                    sets[this.artifact2.artifactSet]++;
                else
                    sets[this.artifact2.artifactSet] = 1;
            }
            if ((_c = this.artifact3) === null || _c === void 0 ? void 0 : _c.artifactSet) {
                if (sets[this.artifact3.artifactSet])
                    sets[this.artifact3.artifactSet]++;
                else
                    sets[this.artifact3.artifactSet] = 1;
            }
            Object.entries(sets).forEach((set) => {
                const key = set[0];
                const amnt = set[1];
                if (amnt > 1) {
                    let curSet = { ...artifactSets[key] };
                    Object.entries(curSet.twoPieceEffect).forEach((stat) => {
                        const statKey = stat[0];
                        const statVal = stat[1];
                        if (effects[statKey])
                            effects[statKey] += statVal;
                        else
                            effects[statKey] = statVal;
                    });
                    if (amnt > 2) {
                        Object.entries(curSet.threePieceEffect).forEach((stat) => {
                            const statKey = stat[0];
                            const statVal = stat[1];
                            if (effects[statKey])
                                effects[statKey] += statVal;
                            else
                                effects[statKey] = statVal;
                        });
                    }
                }
            });
            if (getOnlySetAmounts)
                return sets;
            return effects;
        };
        this.kill = () => {
            if (DEVTOOLS.GOD) {
                this.stats.hp = this.getHpMax();
                return;
            }
            if (this.isDead)
                return;
            this.isDead = true;
            spawnFloatingText(this.cords, lang["player_death"], "red", 32, 1800, 100);
            displayText(`<c>white<c>[WORLD] <c>crimson<c>${lang["player_death_log"]}`);
            const xpLoss = Math.floor(helper.random(this.level.xp * 0.5, this.level.xp * 0.07));
            const goldLoss = Math.floor(helper.random(this.gold * 0.6, this.gold * 0.1));
            this.level.xp -= xpLoss;
            this.gold -= goldLoss;
            if (xpLoss > 0)
                spawnFloatingText(this.cords, `-${xpLoss} XP`, "orange", 32, 900, 350);
            if (goldLoss > 0)
                spawnFloatingText(this.cords, `-${goldLoss} G`, "orange", 32, 1000, 450);
            this.grave = {
                cords: { ...this.cords },
                xp: xpLoss,
                gold: goldLoss,
                map: currentMap,
            };
            this.usedShrines = [];
            setTimeout(modifyCanvas, 300);
            //displayText("PAINA [R] JA RESPAWNAAT");
            spawnDeathScreen();
            updateUI();
        };
        this.getBaseStats = () => {
            var _a, _b, _c, _d, _e, _f;
            const vals = { ...this.stats };
            const mods = {};
            if ((_a = this.raceEffect) === null || _a === void 0 ? void 0 : _a.modifiers) {
                Object.entries((_b = this.raceEffect) === null || _b === void 0 ? void 0 : _b.modifiers).forEach((eff) => {
                    if (!(mods === null || mods === void 0 ? void 0 : mods[eff[0]])) {
                        mods[eff[0]] = eff[1];
                    }
                    else if (eff[0].endsWith("V"))
                        mods[eff[0]] += eff[1];
                });
            }
            if ((_d = (_c = this.classes) === null || _c === void 0 ? void 0 : _c.main) === null || _d === void 0 ? void 0 : _d.statBonuses) {
                Object.entries(this.classes.main.statBonuses).forEach((eff) => {
                    if (!(mods === null || mods === void 0 ? void 0 : mods[eff[0]])) {
                        mods[eff[0]] = eff[1];
                    }
                    else if (eff[0].endsWith("V"))
                        mods[eff[0]] += eff[1];
                });
            }
            if ((_f = (_e = this.classes) === null || _e === void 0 ? void 0 : _e.sub) === null || _f === void 0 ? void 0 : _f.statBonuses) {
                Object.entries(this.classes.sub.statBonuses).forEach((eff) => {
                    if (!(mods === null || mods === void 0 ? void 0 : mods[eff[0]])) {
                        mods[eff[0]] = eff[1];
                    }
                    else if (eff[0].endsWith("V"))
                        mods[eff[0]] += eff[1];
                });
            }
            baseStats.forEach((stat) => {
                if (!mods[stat + "V"])
                    mods[stat + "V"] = 0;
                if (!mods[stat + "P"])
                    mods[stat + "P"] = 1;
                vals[stat] = Math.floor(this.stats[stat] + mods[stat + "V"]);
            });
            return vals;
        };
        this.addItem = (itm) => {
            var _a, _b;
            if (itm.stacks) {
                let wasAdded = false;
                this.inventory.forEach((item) => {
                    if (itm.id == item.id) {
                        wasAdded = true;
                        item.amount += itm.amount;
                    }
                });
                if (!wasAdded)
                    this.inventory.push({ ...itm });
            }
            else {
                this.inventory.push({ ...itm });
            }
            let encounter = (_b = (_a = player.entitiesEverEncountered) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b[itm.id];
            if (encounter < 1 || !encounter) {
                player.entitiesEverEncountered.items[itm.id] = 1;
            }
            this.updateAbilities();
            if (slotEmpty(itm)) {
                this.equip({ button: 2 }, this.inventory[this.inventory.length - 1], false, true);
            }
        };
        this.addGold = (amnt) => {
            if (isNaN(amnt))
                amnt = 0;
            player.gold += amnt;
            document.querySelector(".playerGoldNumber").textContent =
                player.gold.toString();
        };
        this.calcDamage = (base = false) => {
            var _a, _b;
            let dmg = 0;
            if (base) {
                if ((_a = this.weapon) === null || _a === void 0 ? void 0 : _a.id) {
                    Object.values(this.weapon.damages).map((val) => {
                        return (dmg += val);
                    });
                }
                else {
                    Object.values(this.fistDmg()).map((val) => {
                        return (dmg += val);
                    });
                }
            }
            else {
                let damages = ((_b = this.weapon) === null || _b === void 0 ? void 0 : _b.id)
                    ? Object.entries(this.weapon.damages)
                    : Object.entries(this.fistDmg());
                const stats = this.getStats();
                damages.map(([key, num]) => {
                    var _a;
                    let { v: val, m: mod } = getModifiers(this, key + "Damage");
                    val += this.allModifiers["damageV"];
                    mod *= this.allModifiers["damageP"];
                    let bonus = 0;
                    bonus += (num * stats[(_a = this.weapon) === null || _a === void 0 ? void 0 : _a.statBonus]) / 50;
                    if (!this.weapon)
                        bonus = (num * stats["str"]) / 50;
                    if (isNaN(val))
                        val = 0;
                    if (isNaN(mod))
                        mod = 1;
                    if (isNaN(bonus))
                        bonus = 0;
                    if (isNaN(num))
                        num = 0;
                    console.log(Math.floor((num + val + bonus) * mod));
                    dmg += Math.floor((num + val + bonus) * mod);
                });
            }
            return dmg;
        };
    }
}
function nextLevel(level) {
    let base = 75;
    let exponent = 1.23;
    if (level >= 4 && level < 10)
        base = 100;
    if (level >= 10 && level < 29)
        base = 150;
    if (level >= 29 && level < 40)
        base = 275;
    if (level >= 40 && level < 50)
        base = 500;
    if (level >= 50)
        base = 50000;
    return Math.floor(base * Math.pow(level, exponent));
}
function updatePlayerInventoryIndexes() {
    for (let i = 0; i < player.inventory.length; i++) {
        player.inventory[i].index = i;
    }
}
function commandRemoveAbility(cmd) {
    const id = cmd[0].replace("add_ability_", "");
    for (let i = 0; i < player.abilities.length; i++) {
        if (player.abilities[i].id == id)
            player.abilities.splice(i, 1);
    }
    updateUI();
}
let player = new PlayerCharacter({
    id: "player",
    name: "Varien Loreanus",
    cords: { x: 175, y: 46 },
    stats: {
        str: 1,
        dex: 1,
        int: 1,
        vit: 1,
        cun: 1,
        hp: 100,
        mp: 30,
    },
    armor: {
        physical: 0,
        magical: 0,
        elemental: 0,
    },
    // 340 resistance equals to 100% damage negation, meaning 1 damage taken.
    resistances: {
        slash: 0,
        crush: 0,
        pierce: 0,
        magic: 0,
        dark: 0,
        divine: 0,
        fire: 0,
        lightning: 0,
        ice: 0,
    },
    statusResistances: {
        poison: 0,
        burning: 0,
        curse: 0,
        stun: 0,
        bleed: 0,
    },
    level: {
        xp: 0,
        xpNeed: 100,
        level: 1,
    },
    classes: {
        main: new combatClass(combatClasses["rogueClass"]),
        sub: null,
    },
    sprite: ".player",
    race: "human",
    hair: 5,
    eyes: 2,
    face: 1,
    weapon: new Weapon(items.huntingBow),
    chest: {},
    offhand: {},
    helmet: {},
    gloves: {},
    legs: {},
    artifact1: {},
    artifact2: {},
    artifact3: {},
    boots: {},
    canFly: false,
    perks: [],
    abilities: [
        new Ability({ ...abilities.attack }, dummy),
        new Ability({ ...abilities.retreat, equippedSlot: 0 }, dummy),
        new Ability({ ...abilities.first_aid, equippedSlot: 1 }, dummy),
        new Ability({ ...abilities.defend, equippedSlot: 2 }, dummy),
    ],
    traits: [{ id: "resilience_of_the_lone_wanderer" }],
    regen: {
        hp: 0,
        mp: 0.5,
    },
    hit: {
        chance: 60,
        evasion: 30,
    },
    threat: 25,
    unarmed_damages: { crush: 1 },
    statusEffects: [],
    inventory: [],
    gold: 50,
    sp: 5,
    pp: 1,
    respawnPoint: { cords: { x: 175, y: 46 } },
    usedShrines: [],
    grave: null,
    flags: {},
    questProgress: [],
    sex: "male",
});
let combatSummons = [];
const randomProperty = function (mods) {
    const keys = Object.keys(mods);
    return mods[keys[(keys.length * Math.random()) << 0]];
};
function slotEmpty(item) {
    var _a, _b, _c;
    let isEmpty = false;
    if (!((_a = player[item.slot]) === null || _a === void 0 ? void 0 : _a.id)) {
        if (item.slot === "offhand" && !((_b = player["weapon"]) === null || _b === void 0 ? void 0 : _b.twoHanded))
            isEmpty = true;
        else if (item.twoHanded && !((_c = player["offhand"]) === null || _c === void 0 ? void 0 : _c.id))
            isEmpty = true;
        else if (!item.twoHanded && item.slot !== "offhand")
            isEmpty = true;
    }
    return isEmpty;
}
function spawnDeathScreen() {
    const dScreen = document.querySelector(".deathScreen");
    dim.style.height = "100%";
    dScreen.style.transform = "scale(1)";
    dScreen.style.opacity = "1";
    const deathMessage = lang["slain"];
    dScreen.querySelector(".textContainer").innerHTML = "";
    dScreen.querySelector(".textContainer").append(textSyntax(deathMessage));
    dScreen.querySelector(".respawn").textContent = lang["respawn"];
    dScreen.querySelector(".backToTitle").textContent = lang["title_screen"];
}
function despawnDeathScreen() {
    const dScreen = document.querySelector(".deathScreen");
    dim.style.height = "0%";
    dScreen.style.transform = "scale(0)";
    dScreen.style.opacity = "0";
}
function respawnPlayer() {
    despawnDeathScreen();
    player.cords.x = player.respawnPoint.cords.x;
    player.cords.y = player.respawnPoint.cords.y;
    player.isDead = false;
    player.stats.hp = player.getHpMax();
    player.stats.mp = player.getMpMax();
    state.inCombat = false;
    state.isSelected = false;
    state.abiSelected = {};
    combatSummons = [];
    enemiesHadTurn = 0;
    turnOver = true;
    player.updateAbilities();
    player.abilities.forEach((abi) => (abi.onCooldown = 0));
    player.statusEffects = [];
    if (currentMap !== player.respawnPoint.map && player.respawnPoint.map) {
        if (typeof player.respawnPoint.map === "number")
            player.respawnPoint.map = Object.keys(maps)[player.respawnPoint.map];
        loadingScreen.style.display = "block";
        loadMap(player.respawnPoint.map);
    }
    else {
        loadingScreen.style.display = "none";
        modifyCanvas(true);
        updateUI();
    }
    helper.resetAllLivingEnemiesInAllMaps();
    displayText(`[WORLD] ${lang["revive"]}`);
    spawnFloatingText(player.cords, "REVIVE!", "green", 36, 575, 75);
}
player.updateTraits();
player.stats.hp = player.getHpMax();
player.stats.mp = player.getMpMax();
//# sourceMappingURL=player.js.map