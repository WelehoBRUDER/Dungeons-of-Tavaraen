"use strict";
const random = (max, min = -100) => (Math.random() * (max - min) + min);
class Item {
    constructor(base) {
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
    }
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
    constructor(base) {
        var _a, _b;
        super(base);
        // @ts-ignore
        const baseItem = Object.assign({}, items[this.id]);
        this.range = baseItem.range;
        this.firesProjectile = baseItem.firesProjectile;
        this.damagesTemplate = baseItem.damagesTemplate;
        this.statsTemplate = baseItem.statsTemplate;
        this.damages = Object.assign({}, baseItem.damages);
        this.stats = (_a = Object.assign({}, baseItem.stats)) !== null && _a !== void 0 ? _a : {};
        this.rolledStats = (_b = base.rolledStats) !== null && _b !== void 0 ? _b : false;
        if (!this.rolledStats) {
            this.rolledStats = true;
            /* RANDOMIZE DAMAGE VALUES FOR WEAPON */
            this.damagesTemplate.forEach((template) => {
                if (random(100, 0) < template.chance) {
                    if (!this.damages[template.type])
                        this.damages[template.type] = Math.round(random(template.value[1], template.value[0]));
                    else
                        this.damages[template.type] += Math.round(random(template.value[1], template.value[0]));
                }
            });
            /* RANDOMIZE STAT MODIFIERS */
            this.statsTemplate.forEach((template) => {
                if (random(100, 0) < template.chance) {
                    // @ts-expect-error
                    if (!this.stats[template.type])
                        this.stats[template.type] = template.value[Math.round(random(template.value.length - 1, 0))];
                    // @ts-expect-error
                    else
                        this.stats[template.type] += template.value[random(template.value.length, 0)];
                }
            });
        }
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
        // @ts-expect-error
        this.name = `${Object.values(this.damages).length > 1 ? nameParts[subDamage + "Sub"] : ""}${baseItem.name}${nameParts[mainDamage + "Main"]}`;
    }
}
class Armor extends Item {
    constructor(base) {
        var _a, _b;
        super(base);
        // @ts-ignore
        const baseItem = Object.assign({}, items[this.id]);
        this.resistancesTemplate = baseItem.resistancesTemplate;
        this.statsTemplate = baseItem.statsTemplate;
        this.resistances = baseItem.resistances;
        this.stats = (_a = baseItem.stats) !== null && _a !== void 0 ? _a : {};
        this.rolledStats = (_b = base.rolledStats) !== null && _b !== void 0 ? _b : false;
        if (!this.rolledStats) {
            this.rolledStats = true;
            /* RANDOMIZE RESISTANCE VALUES FOR ARMOR */
            this.resistancesTemplate.forEach((template) => {
                if (random(100, 0) < template.chance) {
                    if (!this.resistances[template.type])
                        this.resistances[template.type] = Math.round(random(template.value[1], template.value[0]));
                    else
                        this.resistances[template.type] += Math.round(random(template.value[1], template.value[0]));
                }
            });
            /* RANDOMIZE STAT MODIFIERS */
            this.statsTemplate.forEach((template) => {
                if (random(100, 0) < template.chance) {
                    // @ts-expect-error
                    if (!this.stats[template.type])
                        this.stats[template.type] = template.value[Math.round(random(template.value.length - 1, 0))];
                    // @ts-expect-error
                    else
                        this.stats[template.type] += template.value[random(template.value.length, 0)];
                }
            });
        }
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
        // @ts-expect-error
        this.name = `${Object.values(this.resistances).length > 1 ? namePartsArmor[subResistance + "Sub"] : ""}${baseItem.name}${namePartsArmor[mainResistance + "Main"]}`;
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
    "artifact1",
    "artifact2",
    "artifact3"
];
function renderInventory() {
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
    invOpen = true;
}
function closeInventory() {
    document.querySelector(".worldText").style.opacity = "1";
    const inventory = document.querySelector(".playerInventory");
    inventory.style.transform = "scale(0)";
    invOpen = false;
}
function itemTT(item) {
    var text = "";
    text += `\t<f>22px<f><c>${grades[item.grade].color}<c>${item.name}§\t\n`;
    text += `<i>${icons.silence_icon}<i><f>18px<f><c>white<c>Grade: <c>${grades[item.grade].color}<c>${item.grade}§\n`;
    if (item.damages) {
        let total = 0;
        let txt = "";
        Object.entries(item.damages).forEach((dmg) => { total += dmg[1]; txt += `<i>${icons[dmg[0] + "_icon"]}<i><f>17px<f>${dmg[1]}, `; });
        txt = txt.substring(0, txt.length - 2);
        text += `<i>${icons.damage_icon}<i><f>20px<f>Damage: ${total} <f>17px<f>(${txt})\n`;
    }
    if (item.resistances) {
        let total = 0;
        let txt = "";
        Object.entries(item.resistances).forEach((dmg) => { total += dmg[1]; txt += `<i>${icons[dmg[0] + "_icon"]}<i><f>17px<f>${dmg[1]}, `; });
        txt = txt.substring(0, txt.length - 2);
        text += `<i>${icons.resistance}<i><f>18px<f>Resistance: ${total} <f>17px<f>(${txt})\n`;
    }
    if (Object.values(item.stats).length > 0) {
        text += `<i>${icons.resistance}<i><f>18px<f>Stat effects:\n`;
        Object.entries(item.stats).forEach(eff => text += effectSyntax(eff, true, ""));
    }
    text += `<i>${icons.resistance}<i><f>18px<f>Weight: ${item.weight}\n`;
    text += `<f>18px<f>Worth: <i>${icons.gold_icon}<i><f>18px<f>${item.price}\n`;
    return text;
}
