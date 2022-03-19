
interface playerChar extends characterObject {
  canFly: boolean,
  sprite: string,
  race: string;
  hair: number;
  eyes: number;
  face: number;
  weapon: weaponClass | any;
  offhand: any;
  chest: armorClass | any;
  helmet: armorClass | any;
  gloves: armorClass | any;
  boots: armorClass | any;
  legs: armorClass | any;
  artifact1: any;
  artifact2: any;
  artifact3: any;
  level: levelObject;
  hpRegen?: Function;
  carryingWeight?: Function;
  maxCarryWeight?: Function;
  isDead?: boolean;
  grave: any;
  respawnPoint: any;
  gold: number;
  usedShrines: Array<any>;
  unarmedDamages?: any;
  fistDmg?: Function;
  classes?: any;
  oldCords?: tileObject;
  getArtifactSetBonuses?: Function;
  flags?: any;
  getBaseStats?: Function;
  addItem?: Function;
  addGold?: Function;
  questProgress?: Array<any>;
  entitiesEverEncountered?: entityMemory;
}

interface levelObject {
  xp: number;
  xpNeed: number;
  level: number;
}

// Save entities to memory like such: 0:1, meaning for example "Has encountered grey slime"
interface entityMemory {
  [items: string]: any;
  enemies: any;
}

class PlayerCharacter extends Character {
  [canFly: string]: any;
  sprite: string;
  race: string;
  hair: number;
  eyes: number;
  face: number;
  level: levelObject;
  weapon: weaponClass | any;
  offhand: any;
  chest: armorClass | any;
  helmet: armorClass | any;
  gloves: armorClass | any;
  boots: armorClass | any;
  legs: armorClass | any;
  artifact1: any;
  artifact2: any;
  artifact3: any;
  hpRegen: Function;
  inventory: Array<any>;
  raceEffect: RaceEffect;
  carryingWeight?: Function;
  maxCarryWeight?: Function;
  sight?: Function;
  isDead?: boolean;
  grave: any;
  respawnPoint: any;
  gold: number;
  perks: Array<any>;
  sp: number;
  pp: number;
  usedShrines: Array<any>;
  updatePerks?: Function;
  lvlUp?: Function;
  unarmedDamages?: any;
  fistDmg?: Function;
  classes?: any;
  oldCords?: tileObject;
  getArtifactSetBonuses?: Function;
  flags?: any;
  addItem?: Function;
  addGold?: Function;
  questProgress?: Array<any>;
  entitiesEverEncountered: entityMemory;
  sex: string;
  constructor(base: playerChar) {
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
    this.sp = base.sp ?? 0;
    this.pp = base.pp ?? 0;
    this.usedShrines = [...base.usedShrines] ?? [];
    this.unarmedDamages = base.unarmedDamages ?? { crush: 5 };
    this.classes = { ...base.classes } ?? {};
    this.oldCords = { ...base.oldCords } ?? this.cords;
    this.flags = { ...base.flags } ?? [];
    this.questProgress = base.questProgress ? [...base.questProgress] : [];
    this.entitiesEverEncountered = base.entitiesEverEncountered ? { ...base.entitiesEverEncountered } : { items: {}, enemies: {} } as entityMemory;
    this.sex = base.sex ?? "male";

    this.fistDmg = () => {
      let damages = {} as damageClass;
      Object.entries(this.unarmedDamages).forEach((dmg: any) => {
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

    this.drop = (itm: any, fromContextMenu: boolean = false) => {
      const item = { ...itm };
      this.inventory.splice(itm.index, 1);
      createDroppedItem(this.cords, item);
      renderInventory();
      modifyCanvas();
      if (fromContextMenu) contextMenu.textContent = "";
    };

    this.updatePerks = (dontUpdateUI: boolean = false, dontExecuteCommands: boolean = false) => {
      this.perks.forEach((prk: any, index: number) => {
        let cmdsEx = prk.commandsExecuted;
        prk = new perk({ ...perksArray[prk.tree]["perks"][prk.id] });
        if (!cmdsEx && !dontExecuteCommands) {
          Object.entries(prk.commands)?.forEach(cmd => { command(cmd); });
        }
        prk.commandsExecuted = cmdsEx;
        this.perks[index] = { ...prk };
        prk.statModifiers.forEach((stat: any) => {
          let add = true;
          player.statModifiers.some((mod: PermanentStatModifier) => {
            if (mod.id === stat.id) {
              add = false;
              return true;
            }
          });
          if (add) this.statModifiers.push(stat);
        });
      });
      for (let i = this.perks.length - 1; i >= 0; i--) {
        if (this.perks[i]?.id == undefined) {
          this.perks.splice(i, 1);
        }
      }
      if (dontUpdateUI) return;
      updateUI();
    };

    this.unequip = (event: any, slot: string, putToIndex: number = -1, shiftItems: boolean = false, fromContextMenu: boolean = false) => {
      if ((event.button !== 2 && !fromContextMenu) || !this[slot]?.id) return;
      if (fromContextMenu) {
        contextMenu.textContent = "";
      }
      if (this[slot]?.id) {
        if (putToIndex != -1) {
          if (shiftItems) {
            this.inventory.splice(putToIndex, 0, this[slot]);
          }
          else this.inventory[putToIndex] = this[slot];
        }
        else this.inventory.push(this[slot]);
      };
      Object.entries(this[slot].commands).forEach(cmd => {
        if (cmd[0].includes("ability_")) {
          commandRemoveAbility(cmd);
        }
      });
      this[slot] = {};
      player.allModifiers = getAllModifiersOnce(player, true);
      renderInventory();
    };

    this.equip = (event: any, item: any, fromContextMenu: boolean = false, auto: boolean = false) => {
      if (event.button !== 2 && !fromContextMenu) return;
      if (fromContextMenu) {
        contextMenu.textContent = "";
      }
      if (item.type == "consumable") return;
      if (item.id == "A0_error") {
        player.inventory.splice(item.index, 1);
        renderInventory();
        return;
      }
      const itm = { ...item };
      let canEquip = true;
      if (itm.requiresStats) {
        const stats = this.getStats();
        Object.entries(itm.requiresStats).forEach((stat: any) => {
          const key = stat[0];
          const val = stat[1];
          if (stats[key] < val) canEquip = false;
        });
      }
      let spliceFromInv: boolean = true;
      let shiftOffhand: boolean = true;
      if (!canEquip) return;
      if (item.slot == "offhand" && this.weapon?.twoHanded) {
        this.unequip(event, "weapon", item.index, false, fromContextMenu);
        spliceFromInv = false;
      }
      if (!this[itm.slot]?.id && spliceFromInv) player.inventory.splice(item.index, 1);
      if (!this[itm.slot]?.id) shiftOffhand = false;
      else this.unequip(event, itm.slot, itm.index, false, fromContextMenu);
      this[itm.slot] = { ...itm };
      Object.entries(item.commands).forEach(cmd => command(cmd));
      if (item.twoHanded) {
        if (shiftOffhand) {
          this.unequip(event, "offhand", item.index + 1, true, fromContextMenu);
        }
        else this.unequip(event, "offhand", item.index, true, fromContextMenu);
      }
      player.allModifiers = getAllModifiersOnce(player, true);
      if (!auto) renderInventory();
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
      if (this.level.level >= 10 && this.statModifiers.findIndex((m: any) => m.id === `racial_ability_${this.race}_1`) === -1) {
        this.statModifiers.push(new PermanentStatModifier(statModifiers[`racial_ability_${this.race}_1`]));
        spawnFloatingText(this.cords, "RACIAL ABILITY!", "lime", 50, 2000, 450);
      }
    };

    this.getArtifactSetBonuses = (getOnlySetAmounts = false as boolean) => {
      let sets = {} as any;
      let effects = {} as any;
      if (this.artifact1?.artifactSet) {
        sets[this.artifact1.artifactSet] = 1;
      }
      if (this.artifact2?.artifactSet) {
        if (sets[this.artifact2.artifactSet]) sets[this.artifact2.artifactSet]++;
        else sets[this.artifact2.artifactSet] = 1;
      }
      if (this.artifact3?.artifactSet) {
        if (sets[this.artifact3.artifactSet]) sets[this.artifact3.artifactSet]++;
        else sets[this.artifact3.artifactSet] = 1;
      }
      Object.entries(sets).forEach((set: any) => {
        const key = set[0];
        const amnt = set[1];
        if (amnt > 1) {
          let curSet = { ...artifactSets[key] };
          Object.entries(curSet.twoPieceEffect).forEach(stat => {
            const statKey = stat[0];
            const statVal = stat[1];
            if (effects[statKey]) effects[statKey] += statVal;
            else effects[statKey] = statVal;
          });
          if (amnt > 2) {
            Object.entries(curSet.threePieceEffect).forEach(stat => {
              const statKey = stat[0];
              const statVal = stat[1];
              if (effects[statKey]) effects[statKey] += statVal;
              else effects[statKey] = statVal;
            });
          }
        }
      });
      if (getOnlySetAmounts) return sets;
      return effects;
    };

    this.kill = () => {
      if (DEVTOOLS.GOD) {
        this.stats.hp = this.getHpMax();
        return;
      }
      if (this.isDead) return;
      // handle death logic once we get there ;)
      this.isDead = true;
      spawnFloatingText(this.cords, lang["player_death"], "red", 32, 1800, 100);
      displayText(`<c>white<c>[WORLD] <c>crimson<c>${lang["player_death_log"]}`);
      const xpLoss = Math.floor(helper.random(this.level.xp * 0.5, this.level.xp * 0.07));
      const goldLoss = Math.floor(helper.random(this.gold * 0.6, this.gold * 0.1));
      this.level.xp -= xpLoss;
      this.gold -= goldLoss;
      if (xpLoss > 0) spawnFloatingText(this.cords, `-${xpLoss} XP`, "orange", 32, 900, 350);
      if (goldLoss > 0) spawnFloatingText(this.cords, `-${goldLoss} G`, "orange", 32, 1000, 450);
      this.grave = { cords: { ...this.cords }, xp: xpLoss, gold: goldLoss };
      this.usedShrines = [];
      setTimeout(modifyCanvas, 300);
      //displayText("PAINA [R] JA RESPAWNAAT");
      spawnDeathScreen();
      updateUI();
    };

    this.getBaseStats = () => {
      const vals: any = { ...this.stats };
      const mods: any = {};
      if (this.raceEffect?.modifiers) {
        Object.entries(this.raceEffect?.modifiers).forEach((eff: any) => {
          if (!mods?.[eff[0]]) {
            mods[eff[0]] = eff[1];
          }
          else if (eff[0].endsWith("V")) mods[eff[0]] += eff[1];
        });
      }
      if (this.classes?.main?.statBonuses) {
        Object.entries(this.classes.main.statBonuses).forEach((eff: any) => {
          if (!mods?.[eff[0]]) {
            mods[eff[0]] = eff[1];
          }
          else if (eff[0].endsWith("V")) mods[eff[0]] += eff[1];
        });
      }
      if (this.classes?.sub?.statBonuses) {
        Object.entries(this.classes.sub.statBonuses).forEach((eff: any) => {
          if (!mods?.[eff[0]]) {
            mods[eff[0]] = eff[1];
          }
          else if (eff[0].endsWith("V")) mods[eff[0]] += eff[1];
        });
      }
      baseStats.forEach((stat: string) => {
        if (!mods[stat + "V"]) mods[stat + "V"] = 0;
        if (!mods[stat + "P"]) mods[stat + "P"] = 1;
        vals[stat] = Math.floor(this.stats[stat] + mods[stat + "V"]);
      });
      return vals;
    };

    this.addItem = (itm: any) => {
      if (itm.stacks) {
        let wasAdded = false;
        this.inventory.forEach((item: any) => {
          if (itm.id == item.id) {
            wasAdded = true;
            item.amount += itm.amount;
          }
        });
        if (!wasAdded) this.inventory.push({ ...itm });
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

    this.addGold = (amnt: number) => {
      if (isNaN(amnt)) amnt = 0;
      player.gold += amnt;
      document.querySelector(".playerGoldNumber").textContent = player.gold.toString();
    };
  }
}


function nextLevel(level: number) {
  let base = 75;
  let exponent = 1.32;
  if (level >= 4 && level < 10) base = 150;
  if (level >= 10 && level < 29) base = 225;
  if (level >= 29 && level < 39) base = 375;
  if (level >= 39 && level < 50) base = 450;
  if (level >= 50) base = 5000;
  return Math.floor(base * (Math.pow(level, exponent)));
}

function updatePlayerInventoryIndexes() {
  for (let i = 0; i < player.inventory.length; i++) {
    player.inventory[i].index = i;
  }
}

function commandRemoveAbility(cmd: any) {
  const id = cmd[0].replace("add_ability_", "");
  for (let i = 0; i < player.abilities.length; i++) {
    if (player.abilities[i].id == id) player.abilities.splice(i, 1);
  }
  updateUI();
}

let player = new PlayerCharacter({
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
    main: new combatClass(combatClasses["rogueClass"]),
    sub: null
  },
  sprite: ".player",
  race: "orc",
  hair: 5,
  eyes: 2,
  face: 1,
  weapon: {},
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
  statModifiers: [
    { id: "resilience_of_the_lone_wanderer" },
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
  flags: {} as any,
  questProgress: [],
  sex: "male"
});

let combatSummons: Array<any> = [];

var randomProperty = function (mods: any) {
  var keys = Object.keys(mods);
  return mods[keys[keys.length * Math.random() << 0]];
};

function slotEmpty(item: itemClass) {
  let isEmpty = false;
  if (!player[item.slot]?.id) {
    if (item.slot === "offhand" && !player["weapon"]?.twoHanded) isEmpty = true;
    else if (item.twoHanded && !player["offhand"]?.id) isEmpty = true;
    else if (!item.twoHanded && item.slot !== "offhand") isEmpty = true;
  }
  return isEmpty;
}

function spawnDeathScreen() {
  const dScreen = document.querySelector<HTMLDivElement>(".deathScreen");
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
  const dScreen = document.querySelector<HTMLDivElement>(".deathScreen");
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
  enemiesHadTurn = 0;
  turnOver = true;
  player.updateAbilities();
  player.abilities.forEach(abi => abi.onCooldown = 0);
  player.statusEffects = [];
  updateUI();
  helper.resetAllLivingEnemiesInAllMaps();
  modifyCanvas(true);
  displayText(`[WORLD] ${lang["revive"]}`);
  spawnFloatingText(player.cords, "REVIVE!", "green", 36, 575, 75);
}
player.updateStatModifiers();
player.stats.hp = player.getHpMax();
player.stats.mp = player.getMpMax();

