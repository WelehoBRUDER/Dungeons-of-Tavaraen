"use strict";
const random = (max, min = -100) => (Math.random() * (max - min) + min);
let invScroll = 0;
class Item {
    constructor(base) {
        var _a, _b;
        this.id = base.id;
        // @ts-ignore
        const baseItem = Object.assign({}, items[this.id]);
        this.name = baseItem.name;
        this.price = baseItem.price;
        this.weight = baseItem.weight;
        this.type = baseItem.type;
        this.img = baseItem.img;
        this.sprite = baseItem.sprite;
        this.grade = baseItem.grade;
        this.index = (_a = base.index) !== null && _a !== void 0 ? _a : -1;
        this.slot = baseItem.slot;
        this.requiresStats = (_b = baseItem.requiresStats) !== null && _b !== void 0 ? _b : null;
    }
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
};
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
};
class Consumable extends Item {
    constructor(base) {
        var _a, _b;
        super(base);
        const baseItem = Object.assign({}, items[this.id]);
        this.status = baseItem.status;
        this.ability = baseItem.status;
        this.healValue = baseItem.healValue;
        this.manaValue = baseItem.manaValue;
        this.usesTotal = baseItem.usesTotal;
        this.usesRemaining = base.usesRemaining;
        this.equippedSlot = (_a = base.equippedSlot) !== null && _a !== void 0 ? _a : -1;
        this.stats = {};
        this.commands = {};
        this.name = (_b = lang[this.id + "_name"]) !== null && _b !== void 0 ? _b : baseItem.name;
        this.fullPrice = () => { return this.price; };
    }
}
class Weapon extends Item {
    constructor(base) {
        var _a, _b, _c, _d, _e;
        super(base);
        const baseItem = Object.assign({}, items[this.id]);
        this.range = baseItem.range;
        this.firesProjectile = baseItem.firesProjectile;
        this.damagesTemplate = baseItem.damagesTemplate;
        this.statsTemplate = baseItem.statsTemplate;
        this.damages = (_a = Object.assign({}, baseItem.damages)) !== null && _a !== void 0 ? _a : {};
        this.stats = (_b = Object.assign({}, baseItem.stats)) !== null && _b !== void 0 ? _b : {};
        this.commands = (_c = Object.assign({}, baseItem.commands)) !== null && _c !== void 0 ? _c : {};
        this.rolledDamages = (_d = Object.assign({}, base.rolledDamages)) !== null && _d !== void 0 ? _d : {};
        this.rolledStats = (_e = Object.assign({}, base.rolledStats)) !== null && _e !== void 0 ? _e : {};
        if (Object.values(this.rolledDamages).length == 0) {
            /* RANDOMIZE DAMAGE VALUES FOR WEAPON */
            this.damagesTemplate.forEach((template) => {
                if (random(100, 0) < template.chance) {
                    this.rolledDamages[template.type] = Math.round(random(template.value[1], template.value[0]));
                }
                else
                    this.rolledDamages[template.type] = 0;
            });
        }
        if (Object.values(this.rolledStats).length == 0) {
            /* RANDOMIZE STAT MODIFIERS */
            this.statsTemplate.forEach((template) => {
                if (random(100, 0) < template.chance) {
                    this.rolledStats[template.type] = template.value[Math.round(random(template.value.length - 1, 0))];
                }
                else
                    this.rolledStats[template.type] = 0;
            });
        }
        this.fullPrice = () => {
            let bonus = 0;
            Object.entries(this.damages).forEach((dmg) => {
                const key = dmg[0];
                const val = dmg[1];
                bonus += val * dmgWorths[key];
            });
            Object.entries(this.stats).forEach((stat) => {
                let _sw = statWorths[stat[0]] * stat[1];
                if (isNaN(_sw))
                    _sw = stat[1] * 2;
                bonus += _sw;
            });
            bonus *= grades[this.grade]["worth"];
            let price = Math.floor(bonus + this.price);
            return price < 1 ? 1 : price;
        };
        Object.entries(this.rolledDamages).forEach((dmg) => {
            if (!this.damages[dmg[0]])
                this.damages[dmg[0]] = dmg[1];
            else
                this.damages[dmg[0]] += dmg[1];
        });
        Object.entries(this.rolledStats).forEach((stat) => {
            if (!this.stats[stat[0]])
                this.stats[stat[0]] = stat[1];
            else
                this.stats[stat[0]] += stat[1];
        });
        /* SET NEW NAME FOR ITEM */
        var mainDamage;
        var subDamage;
        if (Object.values(this.damages).length == 1) {
            mainDamage = Object.keys(this.damages)[0];
            subDamage = Object.keys(this.damages)[0];
        }
        else {
            let max = -100;
            let _max = -100;
            Object.entries(this.damages).forEach((dmg) => {
                if (dmg[1] > max) {
                    max = dmg[1];
                    mainDamage = dmg[0];
                }
            });
            Object.entries(this.damages).forEach((dmg) => {
                if (dmg[1] == max && mainDamage != dmg[0]) {
                    if (dmg[1] > _max) {
                        _max = dmg[1];
                        subDamage = dmg[0];
                    }
                }
                else if (mainDamage != dmg[0]) {
                    if (dmg[1] > _max) {
                        _max = dmg[1];
                        subDamage = dmg[0];
                    }
                }
            });
        }
        this.statStrings = {
            main: mainDamage,
            sub: subDamage
        };
        if (lang["changeWordOrder"]) {
            this.name = `${lang[this.statStrings["main"] + "_damageMain"]} ${lang[this.statStrings["sub"] + "_damageSub"]} ${lang[this.id + "_name"]}`;
        }
        // @ts-expect-error
        else
            this.name = `${Object.values(this.damages).length > 1 ? nameParts[subDamage + "Sub"] : ""}${baseItem.name}${nameParts[mainDamage + "Main"]}`;
    }
}
class Armor extends Item {
    constructor(base) {
        var _a, _b, _c, _d, _e;
        super(base);
        // @ts-ignore
        const baseItem = Object.assign({}, items[this.id]);
        this.resistancesTemplate = baseItem.resistancesTemplate;
        this.statsTemplate = baseItem.statsTemplate;
        this.resistances = Object.assign({}, baseItem.resistances);
        this.stats = (_a = Object.assign({}, baseItem.stats)) !== null && _a !== void 0 ? _a : {};
        this.commands = (_b = Object.assign({}, baseItem.commands)) !== null && _b !== void 0 ? _b : {};
        this.rolledResistances = (_c = Object.assign({}, base.rolledResistances)) !== null && _c !== void 0 ? _c : {};
        this.rolledStats = (_d = Object.assign({}, base.rolledStats)) !== null && _d !== void 0 ? _d : {};
        this.coversHair = (_e = base.coversHair) !== null && _e !== void 0 ? _e : false;
        if (Object.values(this.rolledResistances).length == 0) {
            /* RANDOMIZE DAMAGE VALUES FOR WEAPON */
            this.resistancesTemplate.forEach((template) => {
                if (random(100, 0) < template.chance) {
                    this.rolledResistances[template.type] = Math.round(random(template.value[1], template.value[0]));
                }
                else
                    this.rolledResistances[template.type] = 0;
            });
        }
        if (Object.values(this.rolledStats).length == 0) {
            /* RANDOMIZE STAT MODIFIERS */
            this.statsTemplate.forEach((template) => {
                if (random(100, 0) < template.chance) {
                    this.rolledStats[template.type] = template.value[Math.round(random(template.value.length - 1, 0))];
                }
                else
                    this.rolledStats[template.type] = 0;
            });
        }
        this.fullPrice = () => {
            let bonus = 0;
            Object.entries(this.resistances).forEach((dmg) => {
                const key = dmg[0];
                const val = dmg[1];
                bonus += val * dmgWorths[key];
            });
            Object.entries(this.stats).forEach((stat) => {
                let _sw = statWorths[stat[0]] * stat[1];
                if (isNaN(_sw))
                    _sw = stat[1] * 2;
                bonus += _sw;
            });
            bonus *= grades[this.grade]["worth"];
            let price = Math.floor(bonus + this.price);
            return price < 1 ? 1 : price;
        };
        Object.entries(this.rolledResistances).forEach((dmg) => {
            if (!this.resistances[dmg[0]])
                this.resistances[dmg[0]] = dmg[1];
            else
                this.resistances[dmg[0]] += dmg[1];
        });
        Object.entries(this.rolledStats).forEach((stat) => {
            if (!this.stats[stat[0]])
                this.stats[stat[0]] = stat[1];
            else
                this.stats[stat[0]] += stat[1];
        });
        /* SET NEW NAME FOR ITEM */
        var mainResistance;
        var subResistance;
        if (Object.values(this.resistances).length == 1) {
            mainResistance = Object.keys(this.resistances)[0];
            subResistance = Object.keys(this.resistances)[0];
        }
        else {
            let max = -100;
            let _max = -100;
            Object.entries(this.resistances).forEach((dmg) => {
                if (dmg[1] > max) {
                    max = dmg[1];
                    mainResistance = dmg[0];
                }
            });
            Object.entries(this.resistances).forEach((dmg) => {
                if (dmg[1] == max && mainResistance != dmg[0]) {
                    if (dmg[1] > _max) {
                        _max = dmg[1];
                        subResistance = dmg[0];
                    }
                }
                else if (mainResistance != dmg[0]) {
                    if (dmg[1] > _max) {
                        _max = dmg[1];
                        subResistance = dmg[0];
                    }
                }
            });
        }
        this.resStrings = {
            main: mainResistance,
            sub: subResistance
        };
        if (lang["changeWordOrder"]) {
            this.name = `${lang[this.resStrings["main"] + "_resistanceMain"]} ${lang[this.resStrings["sub"] + "_resistanceSub"]} ${lang[this.id + "_name"]}`;
        }
        else {
            // @ts-expect-error
            this.name = `${Object.values(this.resistances).length > 1 ? namePartsArmor[subResistance + "Sub"] : ""}${baseItem.name}${namePartsArmor[mainResistance + "Main"]}`;
        }
    }
}
var invOpen = false;
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
document.querySelector(".playerInventory").querySelectorAll(".slot").forEach(slot => slot.addEventListener("mousedown", e => player.unequip(e, slot.classList[0].toString())));
function renderInventory() {
    updatePlayerInventoryIndexes();
    hideHover();
    const inventory = document.querySelector(".playerInventory");
    inventory.style.transform = "scale(1)";
    const playerModel = inventory.querySelector(".playerRender");
    const ctx = playerModel.getContext("2d");
    renderPlayerOutOfMap(256, playerModel, ctx);
    document.querySelector(".worldText").style.opacity = "0";
    equipSlots.forEach((slot) => {
        inventory.querySelector("." + slot + "Bg").style.opacity = "0.33";
        inventory.querySelector("." + slot).textContent = "";
        if (Object.values(player[slot]).length > 0) {
            const _item = Object.assign({}, player[slot]);
            const img = document.createElement("img");
            const name = document.createElement("p");
            img.src = _item.img;
            name.textContent = _item.name;
            img.classList.add("slotItem");
            name.classList.add("slotText");
            name.style.color = grades[_item.grade].color;
            tooltip(img, itemTT(_item));
            inventory.querySelector("." + slot + "Bg").style.opacity = "0";
            inventory.querySelector("." + slot).append(img, name);
        }
    });
    inventory.querySelector(".enc").textContent = `${lang["encumbrance"]}: ${player.carryingWeight()}/${player.maxCarryWeight()}`;
    const itemsArea = inventory.querySelector(".items");
    itemsArea.textContent = "";
    itemsArea.append(createItems(player.inventory));
    itemsArea.querySelector(".itemList").scrollBy(0, invScroll);
    invOpen = true;
}
function closeInventory() {
    hideHover();
    document.querySelector(".worldText").style.opacity = "1";
    const inventory = document.querySelector(".playerInventory");
    inventory.style.transform = "scale(0)";
    const _inv = document.querySelector(".defaultItemsArray");
    _inv.textContent = "";
    _inv.style.transform = "scale(0)";
    invOpen = false;
}
function closeLeveling() {
    document.querySelector(".worldText").style.opacity = "1";
    const lvling = document.querySelector(".playerLeveling");
    lvling.style.transform = "scale(0)";
}
function itemTT(item) {
    var _a, _b, _c, _d, _e;
    var text = "";
    text += `\t<f>22px<f><c>${grades[item.grade].color}<c>${item.name}§<c>white<c>\t\n`;
    text += `<i>${icons.silence_icon}<i><f>18px<f><c>white<c>${lang["item_grade"]}: <c>${grades[item.grade].color}<c>${lang[item.grade]}§\n`;
    if (item.damages) {
        let total = 0;
        let txt = "";
        (_a = Object.entries(item.damages)) === null || _a === void 0 ? void 0 : _a.forEach((dmg) => { total += dmg[1]; if (dmg[1] !== 0)
            txt += `<i>${icons[dmg[0] + "_icon"]}<i><f>17px<f>${dmg[1]}, `; });
        txt = txt.substring(0, txt.length - 2);
        text += `<i>${icons.damage_icon}<i><f>18px<f>${lang["damage"]}: ${total} <f>17px<f>(${txt})\n`;
    }
    if (item.resistances) {
        let total = 0;
        let txt = "";
        (_b = Object.entries(item.resistances)) === null || _b === void 0 ? void 0 : _b.forEach((dmg) => { total += dmg[1]; if (dmg[1] !== 0)
            txt += `<i>${icons[dmg[0] + "_icon"]}<i><f>17px<f>${dmg[1]}, `; });
        txt = txt.substring(0, txt.length - 2);
        text += `<i>${icons.resistance}<i><f>18px<f>${lang["resistance"]}: ${total} <f>17px<f>(${txt})\n`;
    }
    if (item.requiresStats) {
        let txt = "";
        (_c = Object.entries(item.requiresStats)) === null || _c === void 0 ? void 0 : _c.forEach((dmg) => { txt += `<i>${icons[dmg[0] + "_icon"]}<i><f>17px<f><c>${player.getStats()[dmg[0]] < dmg[1] ? "red" : "white"}<c>${dmg[1]}, `; });
        txt = txt.substring(0, txt.length - 2);
        text += `<i>${icons.resistance}<i><f>18px<f>${lang["required_stats"]}: <f>17px<f>(${txt})\n§`;
    }
    if (((_d = Object.values(item === null || item === void 0 ? void 0 : item.stats)) === null || _d === void 0 ? void 0 : _d.length) > 0) {
        text += `<i>${icons.resistance}<i><f>18px<f>${lang["status_effects"]}:\n`;
        Object.entries(item.stats).forEach(eff => { if (eff[1] !== 0)
            text += effectSyntax(eff, true, ""); });
    }
    if (((_e = Object.values(item.commands)) === null || _e === void 0 ? void 0 : _e.length) > 0) {
        Object.entries(item.commands).forEach((eff) => text += `${commandSyntax(eff[0], eff[1])}\n`);
    }
    if (item.healValue)
        text += `<i>${icons.heal_icon}<i><f>18px<f>${lang["heal_power"]}: ${item.healValue}\n`;
    if (item.manaValue)
        text += `<i>${icons.mana_icon}<i><f>18px<f>${lang["heal_power"]}: ${item.manaValue}\n`;
    if (item.usesRemaining)
        text += `<i>${icons.resistance}<i><f>18px<f>${lang["uses"]}: ${item.usesRemaining}/${item.usesTotal}\n`;
    text += `<i>${icons.resistance}<i><c>white<c><f>18px<f>${lang["item_weight"]}: ${item.weight}\n`;
    text += `<f>18px<f><c>white<c>${lang["item_worth"]}: <i>${icons.gold_icon}<i><f>18px<f>${item.fullPrice()}\n`;
    return text;
}
var sortingReverse = false;
function createItems(inventory, context = "PLAYER_INVENTORY", chest = null) {
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
    const items = [...inventory];
    items.forEach((itm) => {
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
        itemWorth.textContent = itm.fullPrice();
        if (context == "PLAYER_INVENTORY") {
            itemObject.addEventListener("mousedown", e => player.equip(e, itm));
            itemObject.addEventListener("dblclick", e => player.drop(itm));
        }
        if (context == "PICK_LOOT") {
            itemObject.addEventListener("mousedown", e => grabLoot(e, itm));
        }
        if (context == "PICK_TREASURE") {
            itemObject.addEventListener("mousedown", e => grabTreasure(e, itm, chest));
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
//# sourceMappingURL=equipment.js.map