let invScroll = 0;

interface itemClass {
  id: string;
  name: string;
  price: number;
  weight: number;
  type: string;
  img: string;
  sprite: string;
  grade: string;
  index?: number;
  slot?: string;
  spriteMap?: any;
}

class Item {
  id: string;
  name: string;
  price: number;
  weight: number;
  type: string;
  img: string;
  sprite: string;
  grade: string;
  gradeValue?: number;
  index?: number;
  slot?: string;
  spriteMap?: any;
  requiresStats?: any;
  mainTitle?: boolean;
  constructor(base: itemClass) {
    this.id = base.id;
    // @ts-ignore
    const baseItem = { ...items[this.id] };
    this.name = baseItem.name;
    this.price = baseItem.price;
    this.weight = baseItem.weight;
    this.type = baseItem.type;
    this.img = baseItem.img;
    this.sprite = baseItem.sprite;
    this.grade = baseItem.grade;
    this.gradeValue = grade_vals[this.grade];
    this.index = base.index ?? -1;
    this.slot = baseItem.slot;
    this.spriteMap = baseItem.spriteMap;
    this.requiresStats = baseItem.requiresStats ?? null;
    this.mainTitle = baseItem.mainTitle ?? true;
  }
}

const grade_vals = {
  common: 10,
  uncommon: 20,
  rare: 30,
  mythical: 40,
  legendary: 50
} as any;

interface damageClass {
  [slash: string]: number;
  crush?: number;
  pierce?: number;
  magic?: number;
  dark?: number;
  divine?: number;
  fire?: number;
  lightning?: number;
  ice?: number;
}

interface statModifiers {
  [strV: string]: number;
  strP?: number;
  vitV?: number;
  vitP?: number;
  dexV?: number;
  dexP?: number;
  intV?: number;
  intP?: number;
  hpV?: number;
  hpP?: number;
  mpV?: number;
  mpP?: number;
}

interface weaponClass extends itemClass {
  damages: damageClass;
  damagesTemplate: any;
  statsTemplate: any;
  range: number;
  firesProjectile?: string;
  stats?: any;
  commands?: any;
  rolledStats?: any;
  rolledDamages?: any;
  statStrings?: any;
  fullPrice?: Function;
  twoHanded?: boolean;
}

const namePartsArmor = {
  slashSub: "Protective ",
  slashMain: " of Slash Protection",
  crushSub: "Defensive ",
  crushMain: " of Bluntness",
  pierceSub: "Shielding ",
  pierceMain: " of Missile Protection",
  magicSub: "Enchanted ",
  magicMain: " of Magic",
  darkSub: "Grimshielding ",
  darkMain: " Of Darkshatter",
  divineSub: "Blinding ",
  divineMain: " of Seraphic Guard",
  fireSub: "Burning ",
  fireMain: " of Flameguard",
  lightningSub: "Electric ",
  lightningMain: " of Shock Aversion",
  iceSub: "Melting ",
  iceMain: " of Frost Defense"
};

const nameParts = {
  slashSub: "Edged ",
  slashMain: " of Slashing",
  crushSub: "Blunt ",
  crushMain: " of Crushing",
  pierceSub: "Penetrating ",
  pierceMain: " of Breakthrough",
  magicSub: "Enchanted ",
  magicMain: " of Magic",
  darkSub: "Corrupt ",
  darkMain: " of Calamity",
  divineSub: "Divine ",
  divineMain: " of Celestial Might",
  fireSub: "Flaming ",
  fireMain: " Of Ashes",
  lightningSub: "Shocking ",
  lightningMain: " of Sparks",
  iceSub: "Chilling ",
  iceMain: " of Frost"
};

const dmgWorths = {
  slash: 0.5,
  crush: 0.5,
  pierce: 0.6,
  magic: 1,
  dark: 1.5,
  divine: 1.5,
  fire: 1.25,
  lightning: 1.25,
  ice: 1.25
} as any;

const statWorths = {
  strV: 10,
  strP: 7.5,
  vitV: 10,
  vitP: 7.5,
  dexV: 10,
  dexP: 7.5,
  intV: 10,
  intP: 7.5,
  hpMaxV: 2,
  hpMaxP: 3.5,
  mpMaxV: 5,
  mpMaxP: 3.5,
} as any;

class Consumable extends Item {
  status?: string;
  ability?: string;
  healValue?: number;
  manaValue?: number;
  usesTotal: number;
  usesRemaining?: number;
  equippedSlot?: number;
  fullPrice?: Function;
  stats?: any;
  commands?: any;
  constructor(base: Consumable) {
    super(base);
    const baseItem = { ...items[this.id] };
    this.status = baseItem.status;
    this.ability = baseItem.status;
    this.healValue = baseItem.healValue;
    this.manaValue = baseItem.manaValue;
    this.usesTotal = baseItem.usesTotal;
    this.usesRemaining = base.usesRemaining;
    this.equippedSlot = base.equippedSlot ?? -1;
    this.stats = {};
    this.commands = {};
    this.name = lang[this.id + "_name"] ?? baseItem.name;

    this.fullPrice = () => { return this.price; };
  }
}


class Weapon extends Item {
  damages: damageClass;
  damagesTemplate: any;
  statsTemplate: any;
  range: number;
  firesProjectile?: string;
  stats?: statModifiers;
  commands?: any;
  rolledStats?: any;
  rolledDamages?: any;
  statStrings?: any;
  fullPrice?: Function;
  twoHanded?: boolean;
  statBonus: string;
  constructor(base: weaponClass) {
    super(base);
    const baseItem = { ...items[this.id] };
    this.range = baseItem.range;
    this.firesProjectile = baseItem.firesProjectile;
    this.damagesTemplate = baseItem.damagesTemplate;
    this.statsTemplate = baseItem.statsTemplate;
    this.twoHanded = baseItem.twoHanded ?? false;
    this.damages = { ...baseItem.damages } ?? {};
    this.stats = { ...baseItem.stats } ?? {};
    this.commands = { ...baseItem.commands } ?? {};
    this.rolledDamages = { ...base.rolledDamages } ?? {};
    this.rolledStats = { ...base.rolledStats } ?? {};
    this.statBonus = baseItem.statBonus ?? "str";

    if (Object.values(this.rolledDamages).length == 0) {
      /* RANDOMIZE DAMAGE VALUES FOR WEAPON */
      this.damagesTemplate.forEach((template: any) => {
        if (random(100, 0) < template.chance) {
          this.rolledDamages[template.type] = Math.round(random(template.value[1], template.value[0]));
        }
        else this.rolledDamages[template.type] = 0;
      });
    }
    if (Object.values(this.rolledStats).length == 0) {
      /* RANDOMIZE STAT MODIFIERS */
      this.statsTemplate.forEach((template: any) => {
        if (random(100, 0) < template.chance) {
          this.rolledStats[template.type] = template.value[Math.round(random(template.value.length - 1, 0))];
        }
        else this.rolledStats[template.type] = 0;
      });
    }

    this.fullPrice = () => {
      let bonus = 0;
      Object.entries(this.damages).forEach((dmg: any) => {
        const key = dmg[0];
        const val = dmg[1];
        bonus += val * dmgWorths[key];
      });
      Object.entries(this.stats).forEach((stat: any) => {
        let _sw = statWorths[stat[0]] * stat[1];
        if (isNaN(_sw)) _sw = stat[1] * 2;
        bonus += _sw;
      });
      bonus *= grades[this.grade]["worth"];
      let price = Math.floor(bonus + this.price);
      return price < 1 ? 1 : price;
    };

    Object.entries(this.rolledDamages).forEach((dmg: any) => {
      if (!this.damages[dmg[0]]) this.damages[dmg[0]] = dmg[1];
      else this.damages[dmg[0]] += dmg[1];
    });

    Object.entries(this.rolledStats).forEach((stat: any) => {
      if (!this.stats[stat[0]]) this.stats[stat[0]] = stat[1];
      else this.stats[stat[0]] += stat[1];
    });

    /* SET NEW NAME FOR ITEM */
    var mainDamage: string;
    var subDamage: string;

    if (Object.values(this.damages).length == 1) {
      mainDamage = Object.keys(this.damages)[0];
      subDamage = Object.keys(this.damages)[0];
    }
    else {
      let max = -100;
      let _max = -100;
      Object.entries(this.damages).forEach((dmg: any) => {
        if (dmg[1] > max) { max = dmg[1]; mainDamage = dmg[0]; }
      });
      Object.entries(this.damages).forEach((dmg: any) => {
        if (dmg[1] == max && mainDamage != dmg[0]) {
          if (dmg[1] > _max) { _max = dmg[1]; subDamage = dmg[0]; }
        }
        else if (mainDamage != dmg[0]) {
          if (dmg[1] > _max) { _max = dmg[1]; subDamage = dmg[0]; }
        }
      });
    }

    this.statStrings = {
      main: mainDamage,
      sub: subDamage
    };
    if (lang["changeWordOrder"]) {
      this.name = `${this.mainTitle ? lang[this.statStrings["main"] + "_damageMain"] : ""} ${lang[this.statStrings["sub"] + "_damageSub"]} ${lang[this.id + "_name"]}`;
    }
    // @ts-expect-error
    else this.name = `${Object.values(this.damages).length > 1 ? nameParts[subDamage + "Sub"] : ""}${baseItem.name}${this.mainTitle ? nameParts[mainDamage + "Main"] : ""}`;
  }
}

interface armorClass extends itemClass {
  resistances: damageClass;
  resistancesTemplate: any;
  statsTemplate: any;
  stats?: any;
  commands?: any;
  rolledResistances?: any;
  rolledStats?: any;
  resString?: any;
  coversHair?: boolean;
  fullPrice?: Function;
}

class Armor extends Item {
  resistances: damageClass;
  resistancesTemplate: any;
  statsTemplate: any;
  stats?: any;
  commands?: any;
  rolledResistances?: any;
  rolledStats?: any;
  resStrings?: any;
  coversHair?: boolean;
  fullPrice?: Function;
  constructor(base: armorClass) {
    super(base);
    // @ts-ignore
    const baseItem = { ...items[this.id] };
    this.resistancesTemplate = baseItem.resistancesTemplate;
    this.statsTemplate = baseItem.statsTemplate;
    this.resistances = { ...baseItem.resistances };
    this.stats = { ...baseItem.stats } ?? {};
    this.commands = { ...baseItem.commands } ?? {};
    this.rolledResistances = { ...base.rolledResistances } ?? {};
    this.rolledStats = { ...base.rolledStats } ?? {};
    this.coversHair = base.coversHair ?? false;

    if (Object.values(this.rolledResistances).length == 0) {
      /* RANDOMIZE DAMAGE VALUES FOR WEAPON */
      this.resistancesTemplate.forEach((template: any) => {
        if (random(100, 0) < template.chance) {
          this.rolledResistances[template.type] = Math.round(random(template.value[1], template.value[0]));
        }
        else this.rolledResistances[template.type] = 0;
      });
    }
    if (Object.values(this.rolledStats).length == 0) {
      /* RANDOMIZE STAT MODIFIERS */
      this.statsTemplate.forEach((template: any) => {
        if (random(100, 0) < template.chance) {
          this.rolledStats[template.type] = template.value[Math.round(random(template.value.length - 1, 0))];
        }
        else this.rolledStats[template.type] = 0;
      });
    }

    this.fullPrice = () => {
      let bonus = 0;
      Object.entries(this.resistances).forEach((dmg: any) => {
        const key = dmg[0];
        const val = dmg[1];
        bonus += val * dmgWorths[key];
      });
      Object.entries(this.stats).forEach((stat: any) => {
        let _sw = statWorths[stat[0]] * stat[1];
        if (isNaN(_sw)) _sw = stat[1] * 2;
        bonus += _sw;
      });
      bonus *= grades[this.grade]["worth"];
      let price = Math.floor(bonus + this.price);
      return price < 1 ? 1 : price;
    };

    Object.entries(this.rolledResistances).forEach((dmg: any) => {
      if (!this.resistances[dmg[0]]) this.resistances[dmg[0]] = dmg[1];
      else this.resistances[dmg[0]] += dmg[1];
    });

    Object.entries(this.rolledStats).forEach((stat: any) => {
      if (!this.stats[stat[0]]) this.stats[stat[0]] = stat[1];
      else this.stats[stat[0]] += stat[1];
    });

    /* SET NEW NAME FOR ITEM */
    var mainResistance: string;
    var subResistance: string;

    if (Object.values(this.resistances).length == 1) {
      mainResistance = Object.keys(this.resistances)[0];
      subResistance = Object.keys(this.resistances)[0];
    }
    else {
      let max = -100;
      let _max = -100;
      Object.entries(this.resistances).forEach((dmg: any) => {
        if (dmg[1] > max) { max = dmg[1]; mainResistance = dmg[0]; }
      });
      Object.entries(this.resistances).forEach((dmg: any) => {
        if (dmg[1] == max && mainResistance != dmg[0]) {
          if (dmg[1] > _max) { _max = dmg[1]; subResistance = dmg[0]; }
        } else if (mainResistance != dmg[0]) {
          if (dmg[1] > _max) { _max = dmg[1]; subResistance = dmg[0]; }
        }
      });
    }

    this.resStrings = {
      main: mainResistance,
      sub: subResistance
    };

    if (lang["changeWordOrder"]) {
      this.name = `${this.mainTitle ? lang[this.resStrings["main"] + "_resistanceMain"] : ""} ${lang[this.resStrings["sub"] + "_resistanceSub"]} ${lang[this.id + "_name"]}`;
    }
    else {
      // @ts-expect-error
      this.name = `${Object.values(this.resistances).length > 1 ? namePartsArmor[subResistance + "Sub"] : ""}${baseItem.name}${this.mainTitle ? namePartsArmor[mainResistance + "Main"] : ""}`;
    }
  }
}

class Artifact extends Item {
  commands?: any;
  statsTemplate: any;
  stats: any;
  artifactSet: string;
  rolledStats?: any;
  fullPrice?: Function;
  constructor(base: Artifact) {
    super(base);
    const baseItem = { ...items[this.id] };
    this.statsTemplate = baseItem.statsTemplate;
    this.stats = { ...baseItem.stats } ?? {};
    this.artifactSet = baseItem.artifactSet;
    this.rolledStats = { ...base.rolledStats } ?? {};
    this.commands = {};

    if(lang.language_id !== "english") this.name = lang[this.id + "_name"];

    if (Object.values(this.rolledStats).length == 0) {
      /* RANDOMIZE STAT MODIFIERS */
      this.statsTemplate.forEach((template: any) => {
        if (random(100, 0) < template.chance) {
          this.rolledStats[template.type] = template.value[Math.round(random(template.value.length - 1, 0))];
        }
        else this.rolledStats[template.type] = 0;
      });
    }

    Object.entries(this.rolledStats).forEach((stat: any) => {
      if (!this.stats[stat[0]]) this.stats[stat[0]] = stat[1];
      else this.stats[stat[0]] += stat[1];
    });

    this.fullPrice = () => {
      let bonus = 0;
      Object.entries(this.stats).forEach((stat: any) => {
        let _sw = statWorths[stat[0]] * stat[1];
        if (isNaN(_sw)) _sw = stat[1] * 2;
        bonus += _sw * 1.5;
      });
      bonus *= grades[this.grade]["worth"];
      let price = Math.floor(bonus + this.price);
      return price < 1 ? 1 : price;
    };
  }
}

const equipSlots = [
  "weapon",
  "offhand",
  "helmet",
  "chest",
  "gloves",
  "boots",
  "legs",
  "artifact1",
  "artifact2",
  "artifact3"
];

document.querySelector<HTMLDivElement>(".playerInventory").querySelectorAll<HTMLDivElement>(".slot").forEach(slot => slot.addEventListener("mousedown", e => player.unequip(e, slot.classList[0].toString())));

function renderInventory() {
  state.invOpen = true;
  updatePlayerInventoryIndexes();
  hideHover();
  const inventory = document.querySelector<HTMLDivElement>(".playerInventory");
  inventory.style.transform = "scale(1)";
  const playerModel = inventory.querySelector<HTMLCanvasElement>(".playerRender");
  const ctx = playerModel.getContext("2d");
  renderPlayerOutOfMap(256, playerModel, ctx);
  document.querySelector<HTMLDivElement>(".worldText").style.opacity = "0";
  equipSlots.forEach((slot: string) => {
    inventory.querySelector<HTMLDivElement>("." + slot + "Bg").style.opacity = "0.33";
    inventory.querySelector<HTMLDivElement>("." + slot).textContent = "";
    if (Object.values(player[slot]).length > 0) {
      const _item = { ...player[slot] };
      const img = document.createElement("img");
      const name = document.createElement("p");
      img.src = _item.img;
      name.textContent = _item.name;
      img.classList.add("slotItem");
      name.classList.add("slotText");
      name.style.color = grades[_item.grade].color;
      tooltip(img, itemTT(_item));
      inventory.querySelector<HTMLDivElement>("." + slot + "Bg").style.opacity = "0";
      inventory.querySelector<HTMLDivElement>("." + slot).append(img, name);
    }
  });
  inventory.querySelector<HTMLParagraphElement>(".enc").textContent = `${lang["encumbrance"]}: ${player.carryingWeight()}/${player.maxCarryWeight()}`;
  const itemsArea = inventory.querySelector<HTMLDivElement>(".items");
  itemsArea.textContent = "";
  itemsArea.append(createItems(player.inventory));
  itemsArea.querySelector<HTMLDivElement>(".itemList").scrollBy(0, invScroll);
}

function closeInventory() {
  state.invOpen = false;
  hideHover();
  document.querySelector<HTMLDivElement>(".worldText").style.opacity = "1";
  const inventory = document.querySelector<HTMLDivElement>(".playerInventory");
  inventory.style.transform = "scale(0)";
  const _inv = document.querySelector<HTMLDivElement>(".defaultItemsArray");
  _inv.textContent = "";
  _inv.style.transform = "scale(0)";
}

function closeLeveling() {
  state.perkOpen = false;
  document.querySelector<HTMLDivElement>(".worldText").style.opacity = "1";
  const lvling = document.querySelector<HTMLDivElement>(".playerLeveling");
  lvling.style.transform = "scale(0)";
}

function itemTT(item: any) {
  var text = "";
  text += `\t<f>22px<f><c>${grades[item.grade].color}<c>${item.name}§<c>white<c>\t\n`;
  text += `<i>${icons.silence_icon}<i><f>18px<f><c>white<c>${lang["item_grade"]}: <c>${grades[item.grade].color}<c>${lang[item.grade]}§\n`;
  if (item.damages) {
    let total: number = 0;
    let totalCompare: number = 0;
    let txt: string = "";
    if (player.weapon?.id) Object.entries(player.weapon.damages).forEach((dmg: any) => { totalCompare += dmg[1]; });
    Object.entries(item.damages)?.forEach((dmg: any) => {
      total += dmg[1];
      if (dmg[1] !== 0) {
        let color = "lime";
        if (player.weapon?.damages?.[dmg[0]]) {
          if (player.weapon.damages[dmg[0]] > dmg[1]) color = "red";
          else if (player.weapon.damages[dmg[0]] == dmg[1]) color = "white";
        }
        txt += `<i>${icons[dmg[0] + "_icon"]}<i><f>17px<f><c>${color}<c>${dmg[1]}<c>white<c>, `;
      }
    });
    txt = txt.substring(0, txt.length - 2);
    text += `<i>${icons.damage_icon}<i><f>18px<f><c>white<c>${lang["damage"]}: <c>${total > totalCompare ? "lime" : total < totalCompare ? "red" : "white"}<c>${total} <c>white<c><f>17px<f>(${txt})\n`;
  }
  if (item.resistances) {
    let total: number = 0;
    let totalCompare: number = 0;
    let txt: string = "";
    if (player[item.slot]?.resistances) Object.entries(player[item.slot].resistances).forEach((dmg: any) => { totalCompare += dmg[1]; });
    Object.entries(item.resistances)?.forEach((dmg: any) => {
      total += dmg[1];
      if (dmg[1] !== 0) {
        let color = "lime";
        if (player?.[item.slot]?.resistances?.[dmg[0]]) {
          if (player[item.slot]?.resistances[dmg[0]] > dmg[1]) color = "red";
          else if (player[item.slot]?.resistances[dmg[0]] == dmg[1]) color = "white";
        }
        txt += `<i>${icons[dmg[0] + "_icon"]}<i><f>17px<f><c>${color}<c>${dmg[1]}<c>white<c>, `;
      }
    });
    txt = txt.substring(0, txt.length - 2);
    text += `<i>${icons.resistance}<i><f>18px<f><c>white<c>${lang["resistance"]}: <c>${total > totalCompare ? "lime" : total < totalCompare ? "red" : "white"}<c>${total} <c>white<c> <f>17px<f>(${txt})\n`;
  }
  if (item.requiresStats) {
    let txt: string = "";
    Object.entries(item.requiresStats)?.forEach((dmg: any) => { txt += `<i>${icons[dmg[0] + "_icon"]}<i><f>17px<f><c>${player.getStats()[dmg[0]] < dmg[1] ? "red" : "white"}<c>${dmg[1]}, `; });
    txt = txt.substring(0, txt.length - 2);
    text += `<i>${icons.resistance}<i><f>18px<f>${lang["required_stats"]}: <f>17px<f>(${txt})\n§`;
  }
  if (Object.values(item?.stats)?.length > 0) {
    text += `<i>${icons.resistance}<i><f>18px<f>${lang["status_effects"]}:\n`;
    Object.entries(item.stats).forEach(eff => { if (eff[1] !== 0) text += effectSyntax(eff, true, ""); });
  }
  if (Object.values(item.commands)?.length > 0) {
    Object.entries(item.commands).forEach((eff: any) => text += `${commandSyntax(eff[0], eff[1])}\n`);
  }
  if (item.range > 1) text += `<f>18px<f><c>lime<c>${lang["weapon_has_great_reach"]}\n`;
  if (item.healValue) text += `<i>${icons.heal_icon}<i><f>18px<f>${lang["heal_power"]}: ${item.healValue}\n`;
  if (item.manaValue) text += `<i>${icons.mana_icon}<i><f>18px<f>${lang["heal_power"]}: ${item.manaValue}\n`;
  if (item.usesRemaining) text += `<i>${icons.resistance}<i><f>18px<f>${lang["uses"]}: ${item.usesRemaining}/${item.usesTotal}\n`;
  if (item.twoHanded) text += `<i>${icons.resistance}<i><f>18px<f>${lang["two_handed_weapon"]}\n`;
  if (item.statBonus) text += `<i>${icons.hitChance}<i><c>white<c><f>18px<f>${lang["item_stat_bonus"]}: <i>${icons[item.statBonus]}<i>${lang[item.statBonus]}\n`;
  text += `<i>${icons.resistance}<i><c>white<c><f>18px<f>${lang["item_weight"]}: ${item.weight}\n`;
  text += `<f>18px<f><c>white<c>${lang["item_worth"]}: <i>${icons.gold_icon}<i><f>18px<f>${item.fullPrice()}\n`;

  if (item.artifactSet) {
    text += `\n<c>silver<c><f>18px<f>${lang["part_of_set"]} ${lang["artifact_set"]}:  <c>silver<c><c>yellow<c>${lang[item.artifactSet + "Set_name"]}<c>silver<c>\n`;
    let sets = player.getArtifactSetBonuses(true);
    text += `<c>${sets[item.artifactSet] > 1 ? "lime" : "grey"}<c><f>18px<f>${lang["artifact_two_piece"]}\n`;
    Object.entries(artifactSets[item.artifactSet]?.twoPieceEffect).forEach((effect: any)=>{
      if (effect[1] !== 0) text += effectSyntax(effect, true, ""); 
    });
    text += `\n<c>${sets[item.artifactSet] > 2 ? "lime" : "grey"}<c><f>18px<f>${lang["artifact_three_piece"]}\n`;
    Object.entries(artifactSets[item.artifactSet]?.threePieceEffect).forEach((effect: any)=>{
      if (effect[1] !== 0) text += effectSyntax(effect, true, ""); 
    });
  }

  return text;
}

var sortingReverse = false;

function createItems(inventory: Array<any>, context: string = "PLAYER_INVENTORY", chest: any = null) {
  const container = document.createElement("div");
  const itemsList = document.createElement("div");
  const itemsListBar = document.createElement("div");
  const topImage = document.createElement("p");
  const topName = document.createElement("p");
  const topType = document.createElement("p");
  const topRarity = document.createElement("p");
  const topWeight = document.createElement("p");
  const topWorth = document.createElement("p");
  container.classList.add("itemsContainer");
  topImage.classList.add("topImage");
  topName.classList.add("topName");
  topType.classList.add("topType");
  topRarity.classList.add("topRarity");
  topWeight.classList.add("topWeight");
  topWorth.classList.add("topWorth");
  topName.textContent = lang["item_name"];
  topType.textContent = lang["item_type"];
  topRarity.textContent = lang["item_rarity"];
  topWeight.textContent = lang["item_weight_title"];
  topWorth.textContent = lang["item_worth_title"];
  topName.addEventListener("click", e => sortInventory("name", sortingReverse));
  topType.addEventListener("click", e => sortInventory("type", sortingReverse));
  topRarity.addEventListener("click", e => sortInventory("grade", sortingReverse));
  topWeight.addEventListener("click", e => sortInventory("weight", sortingReverse));
  topWorth.addEventListener("click", e => sortInventory("worth", sortingReverse));
  itemsList.classList.add("itemList");
  itemsListBar.classList.add("itemListTop");
  itemsListBar.append(topImage, topName, topType, topRarity, topWeight, topWorth);
  const items: Array<any> = [...inventory];
  items.forEach((item: any) => {
    let itm = {...item};
    if (itm.type == "weapon") itm = new Weapon({ ...itm });
    else if (itm.type == "armor") itm = new Armor({ ...itm });
    else if (itm.type == "artifact") itm = new Artifact({ ...itm });
    else if (itm.type == "consumable") itm = new Consumable({ ...itm });
    const itemObject = document.createElement("div");
    const itemImage = document.createElement("img");
    const itemName = document.createElement("p");
    const itemRarity = document.createElement("p");
    const itemType = document.createElement("p");
    const itemWeight = document.createElement("p");
    const itemWorth = document.createElement("p");
    itemObject.classList.add("itemListObject");
    itemImage.classList.add("itemImg");
    itemName.classList.add("itemName");
    itemRarity.classList.add("itemRarity");
    itemType.classList.add("itemType");
    itemWeight.classList.add("itemWeight");
    itemWorth.classList.add("itemWorth");
    itemImage.src = itm.img;
    itemName.style.color = grades[itm.grade].color;
    itemType.style.color = grades[itm.grade].color;
    itemRarity.style.color = grades[itm.grade].color;
    itemWeight.style.color = grades[itm.grade].color;
    itemWorth.style.color = "gold";
    itemName.textContent = itm.name;
    itemRarity.textContent = lang[itm.grade].toLowerCase();
    itemType.textContent = lang[itm.type];
    itemWeight.textContent = itm.weight;
    itemWorth.textContent = itm.fullPrice() ?? itm.price;
    if (context == "PLAYER_INVENTORY") {
      itemObject.addEventListener("mousedown", e => player.equip(e, itm));
      itemObject.addEventListener("dblclick", e => player.drop(itm));
    }
    if (context == "PICK_LOOT") {
      itemObject.addEventListener("mousedown", e => grabLoot(e, itm, item.dataIndex));
    }
    if (context == "PICK_TREASURE") {
      itemObject.addEventListener("mousedown", e => grabTreasure(e, itm, chest, item.dataIndex));
    }
    tooltip(itemObject, itemTT(itm));
    itemObject.append(itemImage, itemName, itemType, itemRarity, itemWeight, itemWorth);
    itemsList.append(itemObject);
  });
  itemsList.addEventListener("wheel", deltaY => {
    invScroll = itemsList.scrollTop;
  });
  container.append(itemsList, itemsListBar);
  itemsList.scrollBy(invScroll, invScroll);
  return container;
}

const artifactSets = {
  defender: {
    id: "defender",
    twoPieceEffect: {
      hpMaxP: 10
    },
    threePieceEffect: {
      hpMaxV: 10,
      resistAllV: 3
    }
  },
  scholar: {
    id: "scholar",
    twoPieceEffect: {
      mpMaxP: 10
    },
    threePieceEffect: {
      intV: 5,
      magicDamageP: 12
    }
  },
  warrior: {
    id: "warrior",
    twoPieceEffect: {
      attack_damage_multiplierP: 10
    },
    threePieceEffect: {
      hitChanceV: 10,
      hpMaxP: 5
    }
  },
  loneShade: {
    id: "loneShade",
    twoPieceEffect: {
      evasionV: 3,
      hitChanceV: 3,
      critDamageP: 2.5
    },
    threePieceEffect: {
      evasionV: 2,
      hitChanceV: 2,
      critChanceP: 5,
      critDamageP: 7.5,
      dexV: 2
    }
  },
} as any;