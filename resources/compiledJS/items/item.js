"use strict";
class Item {
    name;
    price;
    weight;
    type;
    img;
    sprite;
    grade;
    gradeValue;
    index;
    slot;
    spriteMap;
    requiresStats;
    mainTitle;
    amount;
    stacks;
    indexInBaseArray;
    equippedSprite;
    equippedSpriteFemale;
    constructor(base) {
        this.id = base.id;
        // @ts-ignore
        const baseItem = { ...items[this.id] };
        this.name = baseItem.name;
        this.price = baseItem.price;
        this.amount = isNaN(base.amount) ? 1 : base.amount ?? 1;
        this.weight = helper.roundFloat(baseItem.weight * this.amount);
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
        this.stacks = baseItem.stacks ?? false;
        this.indexInBaseArray = Object.keys(items).findIndex((item) => item == this.id);
        this.equippedSprite = baseItem.equippedSprite ?? null;
        this.equippedSpriteFemale = baseItem.equippedSpriteFemale ?? null;
    }
}
const grades = {
    common: {
        color: "#e0e0e0",
        worth: 1,
    },
    uncommon: {
        color: "#7ccf63",
        worth: 2,
    },
    rare: {
        color: "#4287f5",
        worth: 3.25,
    },
    mythical: {
        color: "#5e18a3",
        worth: 5,
    },
    legendary: {
        color: "#cfcf32",
        worth: 8,
    },
};
function itemTT(item) {
    let text = "";
    if (!item.grade)
        return;
    text += `\t<css>z-index: 5; position: relative;<css><f>22px<f><c>${grades[item.grade].color}<c>${item.name}§<c>white<c>\t\n`;
    if (item.requiresStats) {
        let cantEquip = false;
        Object.entries(item.requiresStats)?.forEach((dmg) => {
            if (player.getStats()[dmg[0]] < dmg[1]) {
                cantEquip = true;
            }
        });
        if (cantEquip) {
            text += `§<css>background: rgba(209, 44, 77, .25); padding: 2px; margin-top: 8px; z-index: 1; position: relative;<css><i>${icons.warning}<i><c>red<c><f>19px<f>${lang["cant_equip"]}\n§`;
        }
    }
    text += `<i>${icons.silence}<i><f>18px<f><c>white<c>${lang["item_grade"]}: <c>${grades[item.grade].color}<c>${lang[item.grade]}§\n`;
    if (item.damages) {
        let total = 0;
        let totalCompare = 0;
        let txt = "";
        if (player.weapon?.id)
            Object.entries(player.weapon.damages).forEach((dmg) => {
                totalCompare += dmg[1];
            });
        Object.entries(item.damages)?.forEach((dmg) => {
            total += dmg[1];
            if (dmg[1] !== 0) {
                let color = "lime";
                if (player.weapon?.damages?.[dmg[0]]) {
                    if (player.weapon.damages[dmg[0]] > dmg[1])
                        color = "red";
                    else if (player.weapon.damages[dmg[0]] == dmg[1])
                        color = "white";
                }
                txt += `<i>${icons[dmg[0]]}<i><f>17px<f><c>${color}<c>${dmg[1]}<c>white<c>, `;
            }
        });
        txt = txt.substring(0, txt.length - 2);
        text += `<i>${icons.damage}<i><f>18px<f><c>white<c>${lang["damage"]}: <c>${total > totalCompare ? "lime" : total < totalCompare ? "red" : "white"}<c>${total} <c>white<c><f>17px<f>(${txt})\n`;
    }
    if (item.armor) {
        if (Object.keys(item.armor)?.length > 0) {
            Object.entries(item.armor).forEach((armor) => {
                let value = armor[1];
                let key = armor[0];
                let color = "lime";
                let compareValue = player?.[item.slot]?.armor?.[key];
                if (compareValue) {
                    if (compareValue > value)
                        color = "red";
                    else if (compareValue == value)
                        color = "white";
                }
                else if (value < 0)
                    color = "red";
                text += `<i>${icons[key + "_armor"]}<i><f>18px<f><c>white<c>${lang[key]}: <c>${color}<c>${value} <c>white<c>\n`;
            });
        }
    }
    if (item.resistances) {
        if (Object.keys(item.resistances)?.length > 0) {
            let total = 0;
            let totalCompare = 0;
            let txt = "";
            if (player[item.slot]?.resistances)
                Object.entries(player[item.slot].resistances).forEach((dmg) => {
                    totalCompare += dmg[1];
                });
            Object.entries(item.resistances)?.forEach((dmg) => {
                total += dmg[1];
                if (dmg[1] !== 0) {
                    let color = "lime";
                    if (player?.[item.slot]?.resistances?.[dmg[0]]) {
                        if (player[item.slot]?.resistances[dmg[0]] > dmg[1])
                            color = "red";
                        else if (player[item.slot]?.resistances[dmg[0]] == dmg[1])
                            color = "white";
                    }
                    else if (dmg[1] < 0)
                        color = "red";
                    txt += `<i>${icons[dmg[0]]}<i><f>17px<f><c>${color}<c>${dmg[1]}<c>white<c>, `;
                }
            });
            txt = txt.substring(0, txt.length - 2);
            text += `<i>${icons.resistance}<i><f>18px<f><c>white<c>${lang["resistance"]}: <c>${total > totalCompare ? "lime" : total < totalCompare ? "red" : "white"}<c>${total} <c>white<c> <f>17px<f>(${txt})\n`;
        }
    }
    if (item.requiresStats) {
        let txt = "";
        Object.entries(item.requiresStats)?.forEach((dmg) => {
            txt += `<i>${icons[dmg[0]]}<i><f>17px<f><c>${player.getStats()[dmg[0]] < dmg[1] ? "red" : "white"}<c>${dmg[1]}, `;
        });
        txt = txt.substring(0, txt.length - 2);
        text += `<i>${icons.resistance}<i><f>18px<f>${lang["required_stats"]}: <f>17px<f>(${txt}<c>white<c>)\n§`;
    }
    if (Object.values(item?.stats)?.length > 0) {
        text += `<i>${icons.resistance}<i><f>18px<f>${lang["status_effects"]}:\n§`;
        Object.entries(item.stats).forEach((eff) => {
            if (eff[1] !== 0)
                text += " " + effectSyntax(eff, true);
        });
        text += "§";
    }
    if (Object.values(item.commands)?.length > 0) {
        Object.entries(item.commands).forEach((eff) => (text += `${commandSyntax(eff[0], eff[1])}\n`));
    }
    if (item.statusesUser?.length > 0) {
        text += `<f>20px<f>${lang["status_effects_you"]}<c>white<c>: \n`;
        item.statusesUser.forEach((status) => {
            text += `<i>${statusEffects[status].icon}<i><f>17px<f>${lang["effect_" + statusEffects[status].id + "_name"]}\n`;
            const statEff = new statEffect(statusEffects[status]);
            statEff.init(item.modifiers);
            text += statTT(statEff, true);
        });
    }
    if (item.range > 0)
        text += `<i>${icons.range}<i><c>white<c><f>18px<f>${lang["use_range"]}: ${item.range} ${lang["tiles"]}\n`;
    if (item.healValue)
        text += `<i>${icons.heal}<i><f>18px<f>${lang["heal_power"]}: ${item.healValue}\n`;
    if (item.manaValue)
        text += `<i>${icons.mana}<i><f>18px<f>${lang["heal_power"]}: ${item.manaValue}\n`;
    if (item.usesRemaining)
        text += `<i>${icons.resistance}<i><f>18px<f>${lang["uses"]}: ${item.usesRemaining}/${item.usesTotal}\n`;
    if (item.stacks)
        text += `<i>${icons.resistance}<i><f>18px<f>${lang["amount"]}: ${item.amount}\n`;
    if (item.twoHanded)
        text += `<i>${icons.resistance}<i><f>18px<f>${lang["two_handed_weapon"]}\n`;
    if (item.statBonus)
        text += `<i>${icons.hitChance}<i><c>white<c><f>18px<f>${lang["item_stat_bonus"]}: <i>${icons[item.statBonus]}<i>${lang[item.statBonus]}\n`;
    if (item.slot)
        text += `<i>${icons.resistance}<i><f>18px<f>${lang["item_slot"]}: ${lang[item.slot]}\n`;
    text += `<i>${icons.resistance}<i><c>white<c><f>18px<f>${lang["item_weight"]}: ${item.weight}\n`;
    if (typeof item.fullPrice === "function") {
        text += `<f>18px<f><c>white<c>${lang["item_worth"]}: <i>${icons.gold}<i><f>18px<f>${item.fullPrice()}\n`;
    }
    else
        text += `<f>18px<f><c>white<c>${lang["item_worth"]}: <i>${icons.gold}<i><f>18px<f>${item.price}\n`;
    if (item.artifactSet) {
        text += `\n<c>silver<c><f>18px<f>${lang["part_of_set"]} ${lang["artifact_set"]}:  <c>silver<c><c>yellow<c>${lang[item.artifactSet + "Set_name"]}<c>silver<c>\n`;
        let sets = player.getArtifactSetBonuses(true);
        text += `<c>${sets[item.artifactSet] > 1 ? "lime" : "grey"}<c><f>18px<f>${lang["artifact_two_piece"]}\n`;
        Object.entries(artifactSets[item.artifactSet]?.twoPieceEffect).forEach((effect) => {
            if (effect[1] !== 0)
                text += effectSyntax(effect, true);
        });
        text += `\n<c>${sets[item.artifactSet] > 2 ? "lime" : "grey"}<c><f>18px<f>${lang["artifact_three_piece"]}\n`;
        Object.entries(artifactSets[item.artifactSet]?.threePieceEffect).forEach((effect) => {
            if (effect[1] !== 0)
                text += effectSyntax(effect, true);
        });
    }
    return text;
}
function constructItem(item) {
    if (item.type == "weapon")
        return new Weapon({ ...items[item.id] });
    else if (item.type == "armor")
        return new Armor({ ...items[item.id] });
    else if (item.type == "artifact")
        return new Artifact({ ...items[item.id] });
    else if (item.type == "consumable")
        return new Consumable({ ...items[item.id] });
}
//# sourceMappingURL=item.js.map