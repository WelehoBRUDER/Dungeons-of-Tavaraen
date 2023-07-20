"use strict";
// @ts-nocheck
class PlayerCharacter extends Character {
    sprite;
    race;
    hair;
    eyes;
    face;
    level;
    weapon;
    offhand;
    chest;
    helmet;
    gloves;
    boots;
    legs;
    artifact1;
    artifact2;
    artifact3;
    hpRegen;
    inventory;
    raceEffect;
    carryingWeight;
    maxCarryWeight;
    sight;
    isDead;
    grave;
    respawnPoint;
    gold;
    perks;
    classPoints;
    sp;
    pp;
    usedShrines;
    updatePerks;
    lvlUp;
    unarmedDamages;
    fistDmg;
    classes;
    oldCords;
    getArtifactSetBonuses;
    flags;
    addItem;
    addGold;
    questProgress;
    entitiesEverEncountered;
    sex;
    activeQuest;
    timePlayed;
    calcDamage;
    constructor(base) {
        super(base);
        this.canFly = base.canFly ?? false;
        this.sprite = base.sprite ?? ".player";
        this.race = base.race ?? "human";
        this.hair = base.hair ?? 1;
        this.eyes = base.eyes ?? 1;
        this.face = base.face ?? 1;
        this.level = base.level;
        this.weapon = base.weapon ?? {};
        this.offhand = base.offhand ?? {};
        this.chest = base.chest ?? {};
        this.helmet = base.helmet ?? {};
        this.gloves = base.gloves ?? {};
        this.boots = base.boots ?? {};
        this.legs = base.legs ?? {};
        this.raceEffect = raceEffects[this.race];
        this.artifact1 = base.artifact1 ?? {};
        this.artifact2 = base.artifact2 ?? {};
        this.artifact3 = base.artifact3 ?? {};
        this.inventory = [...base.inventory] ?? [];
        this.isDead = base.isDead ?? false;
        this.grave = base.grave ?? null;
        this.respawnPoint = { ...base.respawnPoint } ?? null; // need to add default point, or this might soft lock
        this.gold = base.gold ?? 0;
        this.perks = [...base.perks] ?? [];
        this.classPoints = base.classPoints ?? 0;
        this.sp = base.sp ?? 0;
        this.pp = base.pp ?? 0;
        this.usedShrines = [...base.usedShrines] ?? [];
        this.unarmedDamages = base.unarmedDamages ?? { crush: 5 };
        this.classes = base?.classes?.main?.id ? convertOldClasses(base.classes) : [...base?.classes] ?? [];
        this.oldCords = { ...base.oldCords } ?? this.cords;
        this.flags = { ...base.flags } ?? [];
        this.questProgress = base.questProgress ? [...base.questProgress] : [];
        this.entitiesEverEncountered = base.entitiesEverEncountered
            ? { ...base.entitiesEverEncountered }
            : { items: {}, enemies: {}, summons: {} };
        this.sex = base.sex ?? "male";
        this.activeQuest = base.activeQuest ?? -1;
        this.timePlayed = base.timePlayed ? Math.round(base.timePlayed) : 0;
        this.fistDmg = () => {
            let damages = {};
            Object.entries(this.unarmedDamages).forEach((dmg) => {
                const key = dmg[0];
                const _val = dmg[1];
                const damageFlat = this.allModifiers["unarmedDmgV"] ?? 0;
                const damageModifier = this.allModifiers["unarmedDmgP"] ?? 1;
                damages[key] = Math.floor((damageFlat + _val) * damageModifier);
            });
            return damages;
        };
        this.hpRegen = () => {
            const regenFlat = this.allModifiers["hpRegenV"] ?? 0;
            const regenModifier = this.allModifiers["hpRegenP"] ?? 1;
            return Math.floor(regenFlat * regenModifier);
        };
        this.sight = () => {
            const sightFlat = this.allModifiers["sightV"] ?? 0;
            const sightModifier = this.allModifiers["sightP"] ?? 1;
            return Math.floor((15 + sightFlat) * sightModifier);
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
            this.perks.forEach((prk, index) => {
                let cmdsEx = prk.commandsExecuted;
                prk = new perk({ ...perksArray[prk.tree]["perks"][prk.id] });
                if (!cmdsEx && !dontExecuteCommands) {
                    console.log("executing commands");
                    Object.entries(prk.commands)?.forEach((cmd) => {
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
                if (this.perks[i]?.id == undefined) {
                    this.perks.splice(i, 1);
                }
            }
            if (dontUpdateUI)
                return;
            updateUI();
        };
        this.unequip = (event, slot, putToIndex = -1, shiftItems = false, fromContextMenu = false) => {
            if ((event.button !== 2 && !fromContextMenu) || !this[slot]?.id)
                return;
            if (fromContextMenu) {
                contextMenu.textContent = "";
            }
            if (this[slot]?.id) {
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
            this.updateAllModifiers();
            renderInventory();
        };
        this.equip = (event, item, fromContextMenu = false, auto = false) => {
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
            if (item.slot == "offhand" && this.weapon?.twoHanded) {
                this.unequip(event, "weapon", item.index, false, fromContextMenu);
                spliceFromInv = false;
            }
            if (!this[itm.slot]?.id && spliceFromInv)
                player.inventory.splice(item.index, 1);
            if (!this[itm.slot]?.id)
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
            this.updateAllModifiers();
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
            const carryFlat = this.allModifiers["carryWeightV"] ?? 0;
            const carryModifier = this.allModifiers["carryWeightP"] ?? 1;
            const { str, vit } = this.getStats();
            return ((92.5 + carryFlat + str / 2 + vit) * carryModifier).toFixed(1);
        };
        this.addXP = (xp, flat = false) => {
            if (!flat) {
                this.level.xp += Math.floor(xp * player.allModifiers.expGainP);
            }
            else {
                this.level.xp += Math.floor(xp);
            }
            this.lvlUp();
        };
        this.lvlUp = () => {
            while (this.level.xp >= this.level.xpNeed) {
                this.level.xp -= this.level.xpNeed;
                this.level.level++;
                this.classPoints++;
                if (this.level.level % 10 == 0) {
                    this.pp += 2;
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
            if (this.level.level >= 10 && this.traits.findIndex((m) => m.id === `racial_ability_${this.race}_1`) === -1) {
                this.traits.push(new PermanentStatModifier(traits[`racial_ability_${this.race}_1`]));
                spawnFloatingText(this.cords, "RACIAL ABILITY!", "lime", 50, 2000, 450);
            }
        };
        this.getArtifactSetBonuses = (getOnlySetAmounts = false) => {
            let sets = {};
            let effects = {};
            if (this.artifact1?.artifactSet) {
                sets[this.artifact1.artifactSet] = 1;
            }
            if (this.artifact2?.artifactSet) {
                if (sets[this.artifact2.artifactSet])
                    sets[this.artifact2.artifactSet]++;
                else
                    sets[this.artifact2.artifactSet] = 1;
            }
            if (this.artifact3?.artifactSet) {
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
            const vals = { ...this.stats };
            const mods = {};
            if (this.raceEffect?.modifiers) {
                Object.entries(this.raceEffect?.modifiers).forEach((eff) => {
                    if (!mods?.[eff[0]]) {
                        mods[eff[0]] = eff[1];
                    }
                    else if (eff[0].endsWith("V"))
                        mods[eff[0]] += eff[1];
                });
            }
            if (this.classes?.main?.statBonuses) {
                Object.entries(this.classes.main.statBonuses).forEach((eff) => {
                    if (!mods?.[eff[0]]) {
                        mods[eff[0]] = eff[1];
                    }
                    else if (eff[0].endsWith("V"))
                        mods[eff[0]] += eff[1];
                });
            }
            if (this.classes?.sub?.statBonuses) {
                Object.entries(this.classes.sub.statBonuses).forEach((eff) => {
                    if (!mods?.[eff[0]]) {
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
                    this.inventory.push({ ...itm });
            }
            else {
                this.inventory.push({ ...itm });
            }
            let encounter = player.entitiesEverEncountered?.items?.[itm.id];
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
            document.querySelector(".playerGoldNumber").textContent = player.gold.toString();
        };
        this.calcDamage = (base = false) => {
            let dmg = 0;
            if (base) {
                if (this.weapon?.id) {
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
                let damages = this.weapon?.id ? Object.entries(this.weapon.damages) : Object.entries(this.fistDmg());
                const stats = this.getStats();
                damages.map(([key, num]) => {
                    const dmgFlat = this.allModifiers[key + "DamageV"] ?? 0;
                    const dmgModifier = this.allModifiers[key + "DamageP"] ?? 1;
                    const val = dmgFlat + (this.allModifiers["damageV"] ?? 0);
                    const mod = dmgModifier * (this.allModifiers["damageP"] ?? 1);
                    let bonus = 0;
                    bonus += (num * stats[this.weapon?.statBonus]) / 50;
                    if (!this.weapon)
                        bonus = (num * stats["str"]) / 50;
                    if (isNaN(bonus))
                        bonus = 0;
                    if (isNaN(num))
                        num = 0;
                    dmg += Math.floor((num + val + bonus) * mod);
                });
            }
            return dmg;
        };
    }
    hasClass(options) {
        if (options?.id) {
            if (this.classes.findIndex((c) => c.id === options.id) !== -1)
                return true;
        }
        if (options?.tree) {
            if (this.classes.findIndex((c) => c.perkTree === options.tree) !== -1)
                return true;
        }
    }
    getClass(options) {
        if (options?.id) {
            return this.classes.find((c) => c.id === options.id);
        }
        if (options?.tree) {
            return this.classes.find((c) => c.perkTree === options.tree);
        }
    }
}
function nextLevel(level) {
    let base = 50;
    let exponent = 1.23;
    if (level >= 4 && level < 10)
        base = 75;
    if (level >= 10 && level < 29)
        base = 125;
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
        int: 10,
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
    classes: [new combatClass(combatClasses["barbarianClass"])],
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
    classPoints: 0,
    sp: 3,
    pp: 1,
    respawnPoint: { cords: { x: 175, y: 46 } },
    usedShrines: [],
    grave: null,
    flags: {},
    questProgress: [],
    sex: "female",
});
let combatSummons = [];
const randomProperty = function (mods) {
    const keys = Object.keys(mods);
    return mods[keys[(keys.length * Math.random()) << 0]];
};
function slotEmpty(item) {
    let isEmpty = false;
    if (!player[item.slot]?.id) {
        if (item.slot === "offhand" && !player["weapon"]?.twoHanded)
            isEmpty = true;
        else if (item.twoHanded && !player["offhand"]?.id)
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
    renderEntireMap(maps[currentMap]);
    helper.resetAllLivingEnemiesInAllMaps();
    displayText(`[WORLD] ${lang["revive"]}`);
    spawnFloatingText(player.cords, "REVIVE!", "green", 36, 575, 75);
}
player.updateTraits();
player.stats.hp = player.getHpMax();
player.stats.mp = player.getMpMax();
//# sourceMappingURL=player.js.map