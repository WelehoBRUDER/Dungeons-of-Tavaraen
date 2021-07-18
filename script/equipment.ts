const random = (max: number, min: number = -100) => (Math.random() * (max - min) + min);

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
  index?: number;
  slot?: string;
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
    this.index = base.index ?? -1;
    this.slot = baseItem.slot;
  }
}

interface damageClass {
  [slash: string]: number;
  crush?: number;
  pierce?: number;
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
}

const namePartsArmor = {
  slashSub: "Protective ",
  slashMain: " Of Slash Protection",
  crushSub: "Defensive ",
  crushMain: " Of Bluntness",
  pierceSub: "Shielding ",
  pierceMain: " Of Missile Protection",
  darkSub: "Grimshielding ",
  darkMain: " Of Darkshatter",
  divineSub: "Blinding ",
  divineMain: " Of Seraphic Guard",
  fireSub: "Burning ",
  fireMain: " Of Flameguard",
  lightningSub: "Electric ",
  lightningMain: " Of Shock Aversion",
  iceSub: "Melting ",
  iceMain: " Of Frost Defense"
};

const nameParts = {
  slashSub: "Edged ",
  slashMain: " Of Slashing",
  crushSub: "Blunt ",
  crushMain: " Of Crushing",
  pierceSub: "Penetrating ",
  pierceMain: " Of Breakthrough",
  darkSub: "Corrupt ",
  darkMain: " Of Calamity",
  divineSub: "Divine ",
  divineMain: " Of Celestial Might",
  fireSub: "Flaming ",
  fireMain: " Of Ashes",
  lightningSub: "Shocking ",
  lightningMain: " Of Sparks",
  iceSub: "Chilling ",
  iceMain: " Of Frost"
};


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
  constructor(base: weaponClass) {
    super(base);
    // @ts-ignore
    const baseItem = { ...items[this.id] };
    this.range = baseItem.range;
    this.firesProjectile = baseItem.firesProjectile;
    this.damagesTemplate = baseItem.damagesTemplate;
    this.statsTemplate = baseItem.statsTemplate;
    this.damages = { ...baseItem.damages } ?? {};
    this.stats = { ...baseItem.stats } ?? {};
    this.commands = { ...baseItem.commands } ?? {};
    this.rolledDamages = {...base.rolledDamages} ?? {};
    this.rolledStats = {...base.rolledStats} ?? {};

    if (Object.values(this.rolledDamages).length == 0) {
      /* RANDOMIZE DAMAGE VALUES FOR WEAPON */
      this.damagesTemplate.forEach((template: any) => {
        if (random(100, 0) < template.chance) {
          this.rolledDamages[template.type] = Math.round(random(template.value[1], template.value[0]));
        }
      });
    }
    if (Object.values(this.rolledStats).length == 0) {
      /* RANDOMIZE STAT MODIFIERS */
      this.statsTemplate.forEach((template: any) => {
        if (random(100, 0) < template.chance) {
          this.rolledStats[template.type] = template.value[Math.round(random(template.value.length - 1, 0))];
        }
      });
    }

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
    }
    if(lang["changeWordOrder"]) {
      this.name = `${lang[this.statStrings["main"] + "_damageMain"]} ${lang[this.statStrings["sub"] + "_damageSub"]} ${lang[this.id + "_name"]}`;
    }
    // @ts-expect-error
    else this.name = `${Object.values(this.damages).length > 1 ? nameParts[subDamage + "Sub"] : ""}${baseItem.name}${nameParts[mainDamage + "Main"]}`;
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
  constructor(base: armorClass) {
    super(base);
    // @ts-ignore
    const baseItem = { ...items[this.id] };
    this.resistancesTemplate = baseItem.resistancesTemplate;
    this.statsTemplate = baseItem.statsTemplate;
    this.resistances = {...baseItem.resistances};
    this.stats = {...baseItem.stats} ?? {};
    this.commands = {...baseItem.commands} ?? {};
    this.rolledResistances = {...base.rolledResistances} ?? {};
    this.rolledStats = {...base.rolledStats} ?? {};

    if (Object.values(this.rolledResistances).length == 0) {
      /* RANDOMIZE DAMAGE VALUES FOR WEAPON */
      this.resistancesTemplate.forEach((template: any) => {
        if (random(100, 0) < template.chance) {
          this.rolledResistances[template.type] = Math.round(random(template.value[1], template.value[0]));
        }
      });
    }
    if (Object.values(this.rolledStats).length == 0) {
      /* RANDOMIZE STAT MODIFIERS */
      this.statsTemplate.forEach((template: any) => {
        if (random(100, 0) < template.chance) {
          this.rolledStats[template.type] = template.value[Math.round(random(template.value.length - 1, 0))];
        }
      });
    }

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
    }

    if(lang["changeWordOrder"]) {
      this.name = `${lang[this.resStrings["main"] + "_resistanceMain"]} ${lang[this.resStrings["sub"] + "_resistanceSub"]} ${lang[this.id + "_name"]}`;
    } 
    else {
    // @ts-expect-error
    this.name = `${Object.values(this.resistances).length > 1 ? namePartsArmor[subResistance + "Sub"] : ""}${baseItem.name}${namePartsArmor[mainResistance + "Main"]}`;
    }


  }
}

var invOpen: boolean = false;

const equipSlots = [
  "weapon",
  "offhand",
  "helmet",
  "chest",
  "gloves",
  "boots",
  "artifact1",
  "artifact2",
  "artifact3"
];

document.querySelector<HTMLDivElement>(".playerInventory").querySelectorAll<HTMLDivElement>(".slot").forEach(slot=>slot.addEventListener("mousedown", e=>player.unequip(e, slot.classList[0].toString())));

function renderInventory() {
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
      const _item = {...player[slot]};
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
  inventory.querySelector<HTMLParagraphElement>(".enc").textContent = `Encumbrance: ${player.carryingWeight()}/${player.maxCarryWeight()}`;
  const itemsArea = inventory.querySelector<HTMLDivElement>(".items");
  itemsArea.textContent = "";
  itemsArea.append(createItems(player.inventory));
  invOpen = true;
}

function closeInventory() {
  document.querySelector<HTMLDivElement>(".worldText").style.opacity = "1";
  const inventory = document.querySelector<HTMLDivElement>(".playerInventory");
  inventory.style.transform = "scale(0)";
  invOpen = false;
}

function itemTT(item: any) {
  var text = "";
  text += `\t<f>22px<f><c>${grades[item.grade].color}<c>${item.name}§<c>white<c>\t\n`;
  text += `<i>${icons.silence_icon}<i><f>18px<f><c>white<c>${lang["item_grade"]}: <c>${grades[item.grade].color}<c>${lang[item.grade]}§\n`;
  if (item.damages) {
    let total: number = 0;
    let txt: string = "";
    Object.entries(item.damages).forEach((dmg: any) => { total += dmg[1]; txt += `<i>${icons[dmg[0] + "_icon"]}<i><f>17px<f>${dmg[1]}, `; });
    txt = txt.substring(0, txt.length - 2);
    text += `<i>${icons.damage_icon}<i><f>18px<f>${lang["damage"]}: ${total} <f>17px<f>(${txt})\n`;
  }
  if (item.resistances) {
    let total: number = 0;
    let txt: string = "";
    Object.entries(item.resistances).forEach((dmg: any) => { total += dmg[1]; txt += `<i>${icons[dmg[0] + "_icon"]}<i><f>17px<f>${dmg[1]}, `; });
    txt = txt.substring(0, txt.length - 2);
    text += `<i>${icons.resistance}<i><f>18px<f>${lang["resistance"]}: ${total} <f>17px<f>(${txt})\n`;
  }
  if(Object.values(item.stats).length > 0) {
    text += `<i>${icons.resistance}<i><f>18px<f>${lang["status_effects"]}:\n`;
    Object.entries(item.stats).forEach(eff => text += effectSyntax(eff, true, ""));
  }
  if(Object.values(item.commands).length > 0) {
    Object.entries(item.commands).forEach(eff => text += `<f>18px<f>${eff[0]}\n`);
  }
  text += `<i>${icons.resistance}<i><c>white<c><f>18px<f>${lang["item_weight"]}: ${item.weight}\n`;
  text += `<f>18px<f><c>white<c>${lang["item_worth"]}: <i>${icons.gold_icon}<i><f>18px<f>${item.price}\n`;
  return text;
}

var sortingReverse = false;

function createItems(inventory: Array<any>, context: string = "PLAYER_INVENTORY") {
  const container = document.createElement("div");
  const itemsList = document.createElement("div");
  const itemsListBar = document.createElement("div");
  const topImage = document.createElement("p");
  const topName = document.createElement("p");
  const topType = document.createElement("p");
  const topRarity = document.createElement("p");
  const topWeight = document.createElement("p");
  container.classList.add("itemsContainer");
  topImage.classList.add("topImage");
  topName.classList.add("topName");
  topType.classList.add("topType");
  topRarity.classList.add("topRarity");
  topWeight.classList.add("topWeight");
  topName.textContent = "Item name";
  topType.textContent = "Type";
  topRarity.textContent = "Rarity";
  topWeight.textContent = "Weight";
  topName.addEventListener("click", e=>sortInventory("name", sortingReverse));
  topType.addEventListener("click", e=>sortInventory("type", sortingReverse));
  topRarity.addEventListener("click", e=>sortInventory("grade", sortingReverse));
  topWeight.addEventListener("click", e=>sortInventory("weight", sortingReverse));
  itemsList.classList.add("itemList");
  itemsListBar.classList.add("itemListTop");
  itemsListBar.append(topImage, topName, topType, topRarity, topWeight);
  const items: Array<any> = [...inventory];
  items.forEach((itm: any) => {
    const itemObject = document.createElement("div");
    const itemImage = document.createElement("img");
    const itemName = document.createElement("p");
    const itemRarity = document.createElement("p");
    const itemType = document.createElement("p");
    const itemWeight = document.createElement("p");
    itemObject.classList.add("itemListObject");
    itemImage.classList.add("itemImg");
    itemName.classList.add("itemName");
    itemRarity.classList.add("itemRarity");
    itemType.classList.add("itemType");
    itemWeight.classList.add("itemWeight");
    itemImage.src = itm.img;
    itemName.style.color = grades[itm.grade].color;
    itemType.style.color = grades[itm.grade].color;
    itemRarity.style.color = grades[itm.grade].color;
    itemWeight.style.color = grades[itm.grade].color;
    itemName.textContent = itm.name;
    itemRarity.textContent = itm.grade;
    itemType.textContent = itm.type;
    itemWeight.textContent = itm.weight;
    if(context == "PLAYER_INVENTORY") {
      itemObject.addEventListener("mousedown", e=>player.equip(e, itm));
      itemObject.addEventListener("dblclick", e=>player.drop(itm));
    } 
    tooltip(itemObject, itemTT(itm));
    itemObject.append(itemImage, itemName, itemType, itemRarity, itemWeight);
    itemsList.append(itemObject);
  });
  container.append(itemsList, itemsListBar);
  return container;
}