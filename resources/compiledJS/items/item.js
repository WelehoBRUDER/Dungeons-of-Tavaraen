"use strict";
class Item {
    constructor(base) {
        var _a, _b, _c, _d, _e;
        this.id = base.id;
        // @ts-ignore
        const baseItem = Object.assign({}, items[this.id]);
        this.name = baseItem.name;
        this.price = baseItem.price;
        this.amount = isNaN(base.amount) ? 1 : (_a = base.amount) !== null && _a !== void 0 ? _a : 1;
        this.weight = helper.roundFloat(baseItem.weight * this.amount);
        this.type = baseItem.type;
        this.img = baseItem.img;
        this.sprite = baseItem.sprite;
        this.grade = baseItem.grade;
        this.gradeValue = grade_vals[this.grade];
        this.index = (_b = base.index) !== null && _b !== void 0 ? _b : -1;
        this.slot = baseItem.slot;
        this.spriteMap = baseItem.spriteMap;
        this.requiresStats = (_c = baseItem.requiresStats) !== null && _c !== void 0 ? _c : null;
        this.mainTitle = (_d = baseItem.mainTitle) !== null && _d !== void 0 ? _d : true;
        this.stacks = (_e = baseItem.stacks) !== null && _e !== void 0 ? _e : false;
        this.indexInBaseArray = Object.keys(items).findIndex((item) => item == this.id);
    }
}
const grades = {
    common: {
        color: "#e0e0e0",
        worth: 1
    },
    uncommon: {
        color: "#7ccf63",
        worth: 2
    },
    rare: {
        color: "#4287f5",
        worth: 3.25
    },
    mythical: {
        color: "#5e18a3",
        worth: 5
    },
    legendary: {
        color: "#cfcf32",
        worth: 8
    }
};
function itemTT(item) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var text = "";
    if (!item.grade)
        return;
    text += `\t<css>z-index: 5; position: relative;<css><f>22px<f><c>${grades[item.grade].color}<c>${item.name}§<c>white<c>\t\n`;
    if (item.requiresStats) {
        let cantEquip = false;
        (_a = Object.entries(item.requiresStats)) === null || _a === void 0 ? void 0 : _a.forEach((dmg) => {
            if (player.getStats()[dmg[0]] < dmg[1]) {
                cantEquip = true;
            }
        });
        if (cantEquip) {
            text += `§<css>background: rgba(209, 44, 77, .25); padding: 2px; margin-top: 8px; z-index: 1; position: relative;<css><i>${icons.warning_icon}<i><c>red<c><f>19px<f>${lang["cant_equip"]}\n§`;
        }
    }
    text += `<i>${icons.silence_icon}<i><f>18px<f><c>white<c>${lang["item_grade"]}: <c>${grades[item.grade].color}<c>${lang[item.grade]}§\n`;
    if (item.damages) {
        let total = 0;
        let totalCompare = 0;
        let txt = "";
        if ((_b = player.weapon) === null || _b === void 0 ? void 0 : _b.id)
            Object.entries(player.weapon.damages).forEach((dmg) => { totalCompare += dmg[1]; });
        (_c = Object.entries(item.damages)) === null || _c === void 0 ? void 0 : _c.forEach((dmg) => {
            var _a, _b;
            total += dmg[1];
            if (dmg[1] !== 0) {
                let color = "lime";
                if ((_b = (_a = player.weapon) === null || _a === void 0 ? void 0 : _a.damages) === null || _b === void 0 ? void 0 : _b[dmg[0]]) {
                    if (player.weapon.damages[dmg[0]] > dmg[1])
                        color = "red";
                    else if (player.weapon.damages[dmg[0]] == dmg[1])
                        color = "white";
                }
                txt += `<i>${icons[dmg[0] + "_icon"]}<i><f>17px<f><c>${color}<c>${dmg[1]}<c>white<c>, `;
            }
        });
        txt = txt.substring(0, txt.length - 2);
        text += `<i>${icons.damage_icon}<i><f>18px<f><c>white<c>${lang["damage"]}: <c>${total > totalCompare ? "lime" : total < totalCompare ? "red" : "white"}<c>${total} <c>white<c><f>17px<f>(${txt})\n`;
    }
    if (item.armor) {
        if (((_d = Object.keys(item.armor)) === null || _d === void 0 ? void 0 : _d.length) > 0) {
            Object.entries(item.armor).forEach((armor) => {
                var _a, _b;
                let value = armor[1];
                let key = armor[0];
                let color = "lime";
                let compareValue = (_b = (_a = player === null || player === void 0 ? void 0 : player[item.slot]) === null || _a === void 0 ? void 0 : _a.armor) === null || _b === void 0 ? void 0 : _b[key];
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
        if (((_e = Object.keys(item.resistances)) === null || _e === void 0 ? void 0 : _e.length) > 0) {
            let total = 0;
            let totalCompare = 0;
            let txt = "";
            if ((_f = player[item.slot]) === null || _f === void 0 ? void 0 : _f.resistances)
                Object.entries(player[item.slot].resistances).forEach((dmg) => { totalCompare += dmg[1]; });
            (_g = Object.entries(item.resistances)) === null || _g === void 0 ? void 0 : _g.forEach((dmg) => {
                var _a, _b, _c, _d;
                total += dmg[1];
                if (dmg[1] !== 0) {
                    let color = "lime";
                    if ((_b = (_a = player === null || player === void 0 ? void 0 : player[item.slot]) === null || _a === void 0 ? void 0 : _a.resistances) === null || _b === void 0 ? void 0 : _b[dmg[0]]) {
                        if (((_c = player[item.slot]) === null || _c === void 0 ? void 0 : _c.resistances[dmg[0]]) > dmg[1])
                            color = "red";
                        else if (((_d = player[item.slot]) === null || _d === void 0 ? void 0 : _d.resistances[dmg[0]]) == dmg[1])
                            color = "white";
                    }
                    else if (dmg[1] < 0)
                        color = "red";
                    txt += `<i>${icons[dmg[0] + "_icon"]}<i><f>17px<f><c>${color}<c>${dmg[1]}<c>white<c>, `;
                }
            });
            txt = txt.substring(0, txt.length - 2);
            text += `<i>${icons.resistance}<i><f>18px<f><c>white<c>${lang["resistance"]}: <c>${total > totalCompare ? "lime" : total < totalCompare ? "red" : "white"}<c>${total} <c>white<c> <f>17px<f>(${txt})\n`;
        }
    }
    if (item.requiresStats) {
        let txt = "";
        (_h = Object.entries(item.requiresStats)) === null || _h === void 0 ? void 0 : _h.forEach((dmg) => { txt += `<i>${icons[dmg[0] + "_icon"]}<i><f>17px<f><c>${player.getStats()[dmg[0]] < dmg[1] ? "red" : "white"}<c>${dmg[1]}, `; });
        txt = txt.substring(0, txt.length - 2);
        text += `<i>${icons.resistance}<i><f>18px<f>${lang["required_stats"]}: <f>17px<f>(${txt}<c>white<c>)\n§`;
    }
    if (((_j = Object.values(item === null || item === void 0 ? void 0 : item.stats)) === null || _j === void 0 ? void 0 : _j.length) > 0) {
        text += `<i>${icons.resistance}<i><f>18px<f>${lang["status_effects"]}:\n`;
        Object.entries(item.stats).forEach(eff => { if (eff[1] !== 0)
            text += effectSyntax(eff, true, ""); });
    }
    if (((_k = Object.values(item.commands)) === null || _k === void 0 ? void 0 : _k.length) > 0) {
        Object.entries(item.commands).forEach((eff) => text += `${commandSyntax(eff[0], eff[1])}\n`);
    }
    if (((_l = item.statusesUser) === null || _l === void 0 ? void 0 : _l.length) > 0) {
        text += `<f>20px<f>${lang["status_effects_you"]}<c>white<c>: \n`;
        item.statusesUser.forEach((status) => {
            text += `<i>${statusEffects[status].icon}<i><f>17px<f>${lang["effect_" + statusEffects[status].id + "_name"]}\n`;
            text += statTT(new statEffect(statusEffects[status], item.modifiers), true);
        });
    }
    if (item.range > 0)
        text += `<i>${icons.range}<i><c>white<c><f>18px<f>${lang["use_range"]}: ${item.range} ${lang["tiles"]}\n`;
    if (item.healValue)
        text += `<i>${icons.heal_icon}<i><f>18px<f>${lang["heal_power"]}: ${item.healValue}\n`;
    if (item.manaValue)
        text += `<i>${icons.mana_icon}<i><f>18px<f>${lang["heal_power"]}: ${item.manaValue}\n`;
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
        text += `<f>18px<f><c>white<c>${lang["item_worth"]}: <i>${icons.gold_icon}<i><f>18px<f>${item.fullPrice()}\n`;
    }
    else
        text += `<f>18px<f><c>white<c>${lang["item_worth"]}: <i>${icons.gold_icon}<i><f>18px<f>${item.price}\n`;
    if (item.artifactSet) {
        text += `\n<c>silver<c><f>18px<f>${lang["part_of_set"]} ${lang["artifact_set"]}:  <c>silver<c><c>yellow<c>${lang[item.artifactSet + "Set_name"]}<c>silver<c>\n`;
        let sets = player.getArtifactSetBonuses(true);
        text += `<c>${sets[item.artifactSet] > 1 ? "lime" : "grey"}<c><f>18px<f>${lang["artifact_two_piece"]}\n`;
        Object.entries((_m = artifactSets[item.artifactSet]) === null || _m === void 0 ? void 0 : _m.twoPieceEffect).forEach((effect) => {
            if (effect[1] !== 0)
                text += effectSyntax(effect, true, "");
        });
        text += `\n<c>${sets[item.artifactSet] > 2 ? "lime" : "grey"}<c><f>18px<f>${lang["artifact_three_piece"]}\n`;
        Object.entries((_o = artifactSets[item.artifactSet]) === null || _o === void 0 ? void 0 : _o.threePieceEffect).forEach((effect) => {
            if (effect[1] !== 0)
                text += effectSyntax(effect, true, "");
        });
    }
    return text;
}
//# sourceMappingURL=item.js.map