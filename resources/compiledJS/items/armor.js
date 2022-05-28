"use strict";
class Armor extends Item {
    constructor(base, setPrice = 0, dontRollStats = false) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        super(base);
        // @ts-ignore
        const baseItem = { ...items[this.id] };
        this.name = (_a = lang[this.id + "_name"]) !== null && _a !== void 0 ? _a : baseItem.name;
        this.level = (_b = base.level) !== null && _b !== void 0 ? _b : 0;
        this.maxLevel = (_c = baseItem.maxLevel) !== null && _c !== void 0 ? _c : 5;
        this.armor = (_e = leveledStats({ ...baseItem.armor }, (_d = this.level) !== null && _d !== void 0 ? _d : 0)) !== null && _e !== void 0 ? _e : {};
        this.resistances = (_g = leveledStats({ ...baseItem.resistances }, (_f = this.level) !== null && _f !== void 0 ? _f : 0)) !== null && _g !== void 0 ? _g : {};
        this.stats = (_h = { ...baseItem.stats }) !== null && _h !== void 0 ? _h : {};
        this.commands = (_j = { ...baseItem.commands }) !== null && _j !== void 0 ? _j : {};
        this.coversHair = (_k = baseItem.coversHair) !== null && _k !== void 0 ? _k : false;
        this.rolledStats = base.rolledStats || [];
        if (setPrice > 0)
            this.price = setPrice;
        if (this.level > 0)
            this.name += ` +${this.level}`;
        // Randomization reintroduced
        if (this.rolledStats.length === 0 && settings.randomize_items && !dontRollStats) {
            const amountOfMainStats = helper.random(maxStatsForEquipmentToRoll[this.grade].main, 0);
            for (let i = 0; i <= amountOfMainStats; i++) {
                const randomStat = helper.weightedRandom(Object.values(equipmentStatRandomization.armor));
                const key = randomStat.id;
                const data = randomStat;
                this.rolledStats.push({ armor: key, value: Math.floor(helper.random(data.Value.length - 1, 0)) });
            }
            const amountOfSideStats = helper.random(maxStatsForEquipmentToRoll[this.grade].side, 0);
            for (let i = 0; i <= amountOfSideStats; i++) {
                const randomStat = helper.weightedRandom(Object.values(equipmentStatRandomization.side));
                const key = randomStat.id;
                const data = randomStat;
                if ((Math.random() > 0.5 && !data.disablePercent) || data.disableValue) {
                    this.rolledStats.push({ stat: key + "P", value: Math.floor(helper.random(data.Percent.length - 1, 0)) });
                }
                else if (!data.disableValue) {
                    this.rolledStats.push({ stat: key + "V", value: Math.floor(helper.random(data.Value.length - 1, 0)) });
                }
            }
        }
        try {
            (_l = this.rolledStats) === null || _l === void 0 ? void 0 : _l.forEach((stat) => {
                if (stat.armor) {
                    let val = equipmentStatRandomization["armor"][stat.armor]["Value"][stat.value];
                    if (!this.armor[stat.armor])
                        this.armor[stat.armor] = Math.floor(val * gradeStatMultis[this.grade]);
                    else
                        this.armor[stat.armor] += Math.floor(val * gradeStatMultis[this.grade]);
                }
                else {
                    let val = equipmentStatRandomization["side"][stat.stat.substring(0, stat.stat.length - 1)];
                    val = val[stat.stat.endsWith("V") ? "Value" : "Percent"][stat.value];
                    if (!this.stats[stat.stat])
                        this.stats[stat.stat] = Math.floor(val * gradeStatMultis[this.grade]);
                    else
                        this.stats[stat.stat] += Math.floor(val * gradeStatMultis[this.grade]);
                }
            });
        }
        catch (err) {
            if (DEVMODE)
                displayText("<c>red<c>Error trying to randomize stats for: " + this.id + " " + err);
        }
        if (this.rolledStats.length > 0) {
            let name = "";
            const maxAdjectives = 2;
            let adjectivesUsed = 0;
            const statKeys = [];
            Object.entries(this.stats).forEach((stat) => {
                if (!stat[0].includes("damage_against")) {
                    statKeys.push({ key: stat[0], num: stat[1] });
                }
            });
            statKeys.sort((key1, key2) => {
                if (Math.abs(key1.num) > Math.abs(key2.num))
                    return -1;
                else if (Math.abs(key2.num) > Math.abs(key1.num))
                    return 1;
                else
                    return 0;
            });
            let langName = lang[this.id + "_name"];
            if (!langName)
                langName = items[this.id].name;
            statKeys.forEach((stat) => {
                if (adjectivesUsed >= maxAdjectives)
                    return;
                adjectivesUsed++;
                stat.key = stat.key.substring(0, stat.key.length - 1);
                const key = `${adjectivesUsed === 1 ? " " : ""}${lang[stat.key + "_adjective" + `${stat.num < 0 ? "_negative" : ""}`]} `;
                if (key)
                    name += key;
                else
                    adjectivesUsed--;
            });
            name += `${langName}`;
            this.name = name;
            if (this.level > 0)
                this.name += ` +${this.level}`;
        }
        if (setPrice > 0)
            this.fullPrice = () => { return this.price; };
        else {
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
                let price = Math.floor((bonus + this.price) * (1 + this.level / 2));
                return price < 1 ? 1 : price;
            };
        }
        function leveledStats(stats, level) {
            const values = {};
            Object.entries(stats).forEach((stat) => {
                values[stat[0]] = Math.ceil(stat[1] * (1 + level / 10));
            });
            return values;
        }
    }
}
//# sourceMappingURL=armor.js.map