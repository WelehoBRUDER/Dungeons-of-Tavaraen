// @ts-nocheck
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
}

interface levelObject {
  xp: number;
  xpNeed: number;
  level: number;
}

interface racesTxt {
  [human: string]: any;
}

interface raceTxt {
  [name: string]: string;
}

const raceTexts = {
  human: {
    name: "Human",
    desc: ""
  } as raceTxt,
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
} as racesTxt;

interface RaceEffect {
  [modifiers: string]: any;
  name: string;
  desc: string;
}

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
    this.raceEffect = raceEffects[this.race];
    this.artifact1 = base.artifact1 ?? {};
    this.artifact2 = base.artifact2 ?? {};
    this.artifact3 = base.artifact3 ?? {};
    this.inventory = base.inventory ?? [];
    this.isDead = base.isDead ?? false;
    this.grave = base.grave ?? null;
    this.respawnPoint = base.respawnPoint ?? null // need to add default point, or this might soft lock
    this.gold = base.gold ?? 0;
    this.perks = base.perks ?? [];
    this.sp = base.sp ?? 0;
    this.pp = base.pp ?? 0;
    this.usedShrines = base.usedShrines ?? [];
    this.unarmedDamages = base.unarmedDamages ?? { crush: 5 };

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
    }

    this.hpRegen = () => {
      const { v: val, m: mod } = getModifiers(this, "hpRegen");
      return Math.floor((val) * mod);
    }

    this.sight = () => {
      const { v: val, m: mod } = getModifiers(this, "sight");
      return Math.floor((5 + val) * mod);
    }

    this.drop = (itm) => {
      const item = {...itm};
      this.inventory.splice(itm.index, 1);
      createDroppedItem(this.cords, item);
      renderInventory();
      modifyCanvas();
    }

    this.updatePerks = () => {
      this.perks.forEach(prk=>{
        let cmdsEx = prk.commandsExecuted;
        prk = new perk({...perksArray[prk.tree]["perks"][prk.id]});
        if(!cmdsEx) {
          Object.entries(prk.commands)?.forEach(cmd=>{command(cmd);})
        }
        prk.commandsExecuted = cmdsEx;
      });
      updateUI();
    }

    this.unequip = (event: any, slot: string) => {
      if(event.button !== 2 || !this[slot]?.id) return;
      if(this[slot]?.id) {
        this.inventory.push(this[slot]);
      };
      Object.entries(this[slot].commands).forEach(cmd=>{
        if(cmd[0].includes("ability_")) {
          commandRemoveAbility(cmd);
        }
      })
      this[slot] = {};
      renderInventory();
    }

    this.equip = (event: any, item: any) => {
      if(event.button !== 2) return;
      const itm = {...item};
      player.inventory.splice(item.index, 1);
      this.unequip(event, itm.slot);
      this[itm.slot] = {...itm};
      Object.entries(item.commands).forEach(cmd=>command(cmd));
      renderInventory();
    }

    this.carryingWeight = () => {
      let total = 0;
      this.inventory.forEach(itm=>{
        total += itm.weight;
      });
      return total.toFixed(1);
    }

    this.maxCarryWeight = () => {
      const { v: val, m: mod } = getModifiers(this, "carryStrength");
      return ((92.5 + val + this.getStats().str/2 + this.getStats().vit) * mod).toFixed(1);
    }

    this.lvlUp = () => {
      while(this.level.xp >= this.level.xpNeed) {
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
    }

    this.kill = () => {
      if(this.isDead) return;
      // handle death logic once we get there ;)
      this.isDead = true;
      displayText(`<c>white<c>[WORLD] <c>crimson<c>${lang["player_death_log"]}`);
      const xpLoss = Math.floor(random(this.level.xp * 0.5, this.level.xp * 0.07));
      const goldLoss = Math.floor(random(this.gold * 0.6, this.gold * 0.1));
      this.level.xp -= xpLoss;
      this.gold -= goldLoss;
      if(xpLoss > 0) spawnFloatingText(this.cords, `-${xpLoss} XP`, "orange", 32, 900, 350);
      if(goldLoss > 0) spawnFloatingText(this.cords, `-${goldLoss} G`, "orange", 32, 1000, 450);
      this.grave = {cords: {...this.cords}, xp: xpLoss, gold: goldLoss};
      this.usedShrines = [];
      setTimeout(modifyCanvas, 300);
      displayText("PAINA [R] JA RESPAWNAAT");
      updateUI();
    }
  }
}


function nextLevel(level) {
  let base = 75;
  let exponent = 1.35;
  if(level >= 9) base = 100;
  if(level >= 29) base = 200;
  if(level >= 49) base = 375; 
  return Math.floor(base * (Math.pow(level, exponent)));
}

function updatePlayerInventoryIndexes() {
  for(let i = 0; i < player.inventory.length; i++) {
    player.inventory[i].index = i;
  }
}

function sortInventory(category: string, reverse: boolean) {
  sortingReverse = !sortingReverse;
  if(category == "name" || category == "type") {
    player.inventory.sort((a,b)=>stringSort(a,b, category, reverse));
  }
  if(category == "grade") {
    player.inventory.sort((a,b)=>gradeSort(a,b, "grade", reverse));
  }
  if(category == "worth") {
    player.inventory.sort((a,b)=>worthSort(a,b, reverse));
  }
  else player.inventory.sort((a,b)=>numberSort(a,b, category, reverse));
  renderInventory();
}

function commandRemoveAbility(cmd: any) {
  const id = cmd[0].replace("add_ability_", "");
  for(let i = 0; i < player.abilities.length; i++) {
    if(player.abilities[i].id == id) player.abilities.splice(i, 1);
  }
  updateUI();
}

function stringSort(a, b, string: string, reverse: boolean = false) {
  var nameA = a[string].toUpperCase(); // ignore upper and lowercase
  var nameB = b[string].toUpperCase(); // ignore upper and lowercase
  if(reverse) {
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
};

const grade_vals = {
  common: 0,
  uncommon: 1,
  rare: 2,
  mythical: 3,
  legendary: 4
}


function gradeSort(a, b, string: string, reverse: boolean = false) {
  var nameA = grade_vals[a[string]];
  var nameB = grade_vals[b[string]];
  if(reverse) {
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
};

function numberSort(a, b, string: string, reverse: boolean = false) {
  var numA = a[string];
  var numB = b[string];
  if(!reverse) {
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
  
  function worthSort(a, b, reverse: boolean = false) {
    var numA = a.fullPrice();
    var numB = b.fullPrice();
    if(!reverse) {
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
  weapon: new Weapon({...items.longsword}),
  chest: new Armor({...items.raggedShirt}),
  helmet: {},
  gloves: {},
  boots: new Armor({...items.raggedBoots}),
  canFly: false,
  perks: [],
  abilities: [
    new Ability({...abilities.attack}, dummy),
    new Ability({...abilities.first_aid, equippedSlot: 0}, dummy),
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
  unarmed_damages: { crush: 5 },
  statusEffects: [
    new statEffect({...statusEffects.poison}, s_def)
  ],
  inventory: [],
  gold: 50,
  sp: 5,
  pp: 1,
  respawnPoint: {cords: {x: 4, y: 4}},
  usedShrines: []
});

var randomProperty = function (obj) {
  var keys = Object.keys(obj);
  return obj[keys[ keys.length * Math.random() << 0]];
};

for(let i = 0; i < 50; i++) {
  player.inventory.push({...randomProperty(items)});
}

