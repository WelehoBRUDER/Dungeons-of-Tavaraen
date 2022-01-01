"use strict";
const raceTexts = {
    human: {
        name: "Human",
        desc: ""
    },
    orc: {
        name: "Half-Orc",
        desc: ""
    },
    elf: {
        name: "Half-Elf",
        desc: ""
    },
    ashen: {
        name: "Ashen",
        desc: ""
    }
};
const raceEffects = {
    human: {
        modifiers: {
            vitV: 3
        },
        name: "Human Will",
        desc: "No scenario is unbeatable to man, any adversary can be overcome with determination and grit! Where power fails, smarts will succeed."
    },
    elf: {
        modifiers: {
            intV: 3
        },
        name: "Elvish Blood",
        desc: "Snobby pricks can show a good dance, but not a good fight."
    },
    orc: {
        modifiers: {
            strV: 3
        },
        name: "Orcy Bod",
        desc: "Orcies not make gud thinkaz', but do good git smashaz."
    },
    ashen: {
        modifiers: {
            dexV: 3
        },
        name: "Ashen Constitution",
        desc: "The Ashen are sly and slippery, not gifted in straight battle."
    },
};
class PlayerCharacter extends Character {
    constructor(base) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
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
        this.respawnPoint = (_v = Object.assign({}, base.respawnPoint)) !== null && _v !== void 0 ? _v : null; // need to add default point, or this might soft lock
        this.gold = (_w = base.gold) !== null && _w !== void 0 ? _w : 0;
        this.perks = (_x = [...base.perks]) !== null && _x !== void 0 ? _x : [];
        this.sp = (_y = base.sp) !== null && _y !== void 0 ? _y : 0;
        this.pp = (_z = base.pp) !== null && _z !== void 0 ? _z : 0;
        this.usedShrines = (_0 = [...base.usedShrines]) !== null && _0 !== void 0 ? _0 : [];
        this.unarmedDamages = (_1 = base.unarmedDamages) !== null && _1 !== void 0 ? _1 : { crush: 5 };
        this.classes = (_2 = Object.assign({}, base.classes)) !== null && _2 !== void 0 ? _2 : {};
        this.oldCords = (_3 = Object.assign({}, base.oldCords)) !== null && _3 !== void 0 ? _3 : this.cords;
        this.flags = (_4 = Object.assign({}, base.flags)) !== null && _4 !== void 0 ? _4 : [];
        this.fistDmg = () => {
            let damages = {};
            Object.entries(this.unarmedDamages).forEach((dmg) => {
                const key = dmg[0];
                const _val = dmg[1];
                const { v: val, m: mod } = getModifiers(this, "unarmedDmg" + key);
                const { v: baseVal, m: baseMod } = getModifiers(this, "unarmedDmg");
                damages[key] = Math.floor((((val + _val) * mod) + baseVal) * baseMod);
            });
            return damages;
        };
        this.hpRegen = () => {
            const { v: val, m: mod } = getModifiers(this, "hpRegen");
            return Math.floor((val) * mod);
        };
        this.sight = () => {
            const { v: val, m: mod } = getModifiers(this, "sight");
            return Math.floor((11 + val) * mod);
        };
        this.drop = (itm, fromContextMenu = false) => {
            const item = Object.assign({}, itm);
            this.inventory.splice(itm.index, 1);
            createDroppedItem(this.cords, item);
            renderInventory();
            modifyCanvas();
            if (fromContextMenu)
                contextMenu.textContent = "";
        };
        this.updatePerks = (dontUpdateUI = false, dontExecuteCommands = false) => {
            this.perks.forEach((prk, index) => {
                var _a;
                let cmdsEx = prk.commandsExecuted;
                prk = new perk(Object.assign({}, perksArray[prk.tree]["perks"][prk.id]));
                if (!cmdsEx && !dontExecuteCommands) {
                    (_a = Object.entries(prk.commands)) === null || _a === void 0 ? void 0 : _a.forEach(cmd => { command(cmd); });
                }
                prk.commandsExecuted = cmdsEx;
                this.perks[index] = Object.assign({}, prk);
            });
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
            ;
            Object.entries(this[slot].commands).forEach(cmd => {
                if (cmd[0].includes("ability_")) {
                    commandRemoveAbility(cmd);
                }
            });
            this[slot] = {};
            renderInventory();
        };
        this.equip = (event, item, fromContextMenu = false) => {
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
            const itm = Object.assign({}, item);
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
            if (item.slot == "offhand" && ((_a = this.weapon) === null || _a === void 0 ? void 0 : _a.twoHanded)) {
                this.unequip(event, "weapon", item.index);
                spliceFromInv = false;
            }
            if (!canEquip)
                return;
            if (!((_b = this[itm.slot]) === null || _b === void 0 ? void 0 : _b.id) && spliceFromInv)
                player.inventory.splice(item.index, 1);
            if (!((_c = this[itm.slot]) === null || _c === void 0 ? void 0 : _c.id))
                shiftOffhand = false;
            else
                this.unequip(event, itm.slot, itm.index);
            this[itm.slot] = Object.assign({}, itm);
            Object.entries(item.commands).forEach(cmd => command(cmd));
            if (item.twoHanded) {
                if (shiftOffhand) {
                    this.unequip(event, "offhand", item.index + 1, true);
                }
                else
                    this.unequip(event, "offhand", item.index, true);
            }
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
                if (this.level.level < 6) {
                    this.pp += 2;
                    this.sp += 2;
                }
                else if (this.level.level % 10 == 0) {
                    this.pp += 3;
                    this.sp += 5;
                }
                else {
                    this.pp++;
                    this.sp += 2;
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
                    let curSet = Object.assign({}, artifactSets[key]);
                    Object.entries(curSet.twoPieceEffect).forEach(stat => {
                        const statKey = stat[0];
                        const statVal = stat[1];
                        if (effects[statKey])
                            effects[statKey] += statVal;
                        else
                            effects[statKey] = statVal;
                    });
                    if (amnt > 2) {
                        Object.entries(curSet.threePieceEffect).forEach(stat => {
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
            if (this.isDead)
                return;
            // handle death logic once we get there ;)
            this.isDead = true;
            spawnFloatingText(this.cords, lang["player_death"], "red", 32, 1800, 100);
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
        this.getBaseStats = () => {
            var _a, _b, _c, _d, _e, _f;
            const vals = Object.assign({}, this.stats);
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
            if (itm.stacks) {
                let wasAdded = false;
                this.inventory.forEach((item) => {
                    if (itm.id == item.id) {
                        wasAdded = true;
                        item.amount += itm.amount;
                    }
                });
                if (!wasAdded)
                    this.inventory.push(Object.assign({}, itm));
            }
            else {
                this.inventory.push(Object.assign({}, itm));
            }
        };
        this.addGold = (amnt) => {
            if (isNaN(amnt))
                amnt = 0;
            player.gold += amnt;
            document.querySelector(".playerGoldNumber").textContent = player.gold.toString();
        };
    }
}
function nextLevel(level) {
    let base = 75;
    let exponent = 1.25;
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
    else if (category == "grade") {
        player.inventory.sort((a, b) => gradeSort(a, b, reverse));
    }
    else if (category == "worth") {
        player.inventory.sort((a, b) => worthSort(a, b, reverse));
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
function gradeSort(a, b, reverse = false) {
    var numA = parseInt(a.gradeValue);
    var numB = parseInt(b.gradeValue);
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
function worthSort(a, b, reverse = false) {
    if (typeof a.fullPrice !== "function")
        return 1;
    else if (typeof b.fullPrice !== "function")
        return -1;
    var numA = a.fullPrice();
    var numB = b.fullPrice();
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
    cords: { x: 41, y: 169 },
    stats: {
        str: 1,
        dex: 1,
        int: 1,
        vit: 1,
        cun: 1,
        hp: 100,
        mp: 30
    },
    armor: {
        physical: 0,
        magical: 0,
        elemental: 0
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
        main: new combatClass(combatClasses["rangerClass"]),
        sub: null
    },
    sprite: ".player",
    race: "human",
    hair: 3,
    eyes: 2,
    face: 1,
    weapon: new Weapon(Object.assign({}, items.huntingBow)),
    chest: new Armor(Object.assign({}, items.raggedShirt)),
    offhand: {},
    helmet: {},
    gloves: {},
    legs: {},
    artifact1: {},
    artifact2: {},
    artifact3: {},
    boots: new Armor(Object.assign({}, items.raggedBoots)),
    canFly: false,
    perks: [],
    abilities: [
        new Ability(Object.assign({}, abilities.attack), dummy),
        new Ability(Object.assign(Object.assign({}, abilities.retreat), { equippedSlot: 0 }), dummy),
        new Ability(Object.assign(Object.assign({}, abilities.first_aid), { equippedSlot: 1 }), dummy),
        new Ability(Object.assign(Object.assign({}, abilities.defend), { equippedSlot: 2 }), dummy),
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
        mp: 0.5,
    },
    hit: {
        chance: 60,
        evasion: 30
    },
    threat: 25,
    unarmed_damages: { crush: 1 },
    statusEffects: [],
    inventory: [],
    gold: 50,
    sp: 5,
    pp: 1,
    respawnPoint: { cords: { x: 41, y: 169 } },
    usedShrines: [],
    grave: null,
    flags: {},
});
let combatSummons = [];
var randomProperty = function (mods) {
    var keys = Object.keys(mods);
    return mods[keys[keys.length * Math.random() << 0]];
};
// for (let i = 0; i < 20; i++) {
//   player.addItem({...items.A0_error});
// }
for (let i = 0; i < 20; i++) {
    player.addItem(Object.assign({}, randomProperty(items)));
}
// for (let itm of Object.entries(items)) {
//   player.addItem({...itm[1], level: 5});
// }
player.stats.hp = player.getHpMax();
player.stats.mp = player.getMpMax();
//# sourceMappingURL=player.js.map