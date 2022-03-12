"use strict";
var _a, _b, _c;
let invScroll = 0;
class Item {
    constructor(base) {
        var _a, _b, _c, _d, _e;
        this.id = base.id;
        // @ts-ignore
        const baseItem = Object.assign({}, items[this.id]);
        this.name = baseItem.name;
        this.price = baseItem.price;
        this.amount = isNaN(base.amount) ? 1 : (_a = base.amount) !== null && _a !== void 0 ? _a : 1;
        this.weight = roundFloat(baseItem.weight * this.amount);
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
const grade_vals = {
    common: 10,
    uncommon: 20,
    rare: 30,
    mythical: 40,
    legendary: 50
};
const damageCategories = {
    slash: "physical",
    crush: "physical",
    pierce: "physical",
    magic: "magical",
    dark: "magical",
    divine: "magical",
    fire: "elemental",
    lightning: "elemental",
    ice: "elemental"
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
    cunV: 10,
    cunP: 7.5,
    hpMaxV: 2,
    hpMaxP: 3.5,
    mpMaxV: 5,
    mpMaxP: 4.5,
};
class Consumable extends Item {
    constructor(base, setPrice = 0) {
        var _a, _b, _c, _d;
        super(base);
        const baseItem = Object.assign({}, items[this.id]);
        this.status = baseItem.status;
        this.ability = baseItem.status;
        this.healValue = baseItem.healValue;
        this.manaValue = baseItem.manaValue;
        this.usesTotal = (_a = baseItem.usesTotal) !== null && _a !== void 0 ? _a : 1;
        this.usesRemaining = (_b = base.usesRemaining) !== null && _b !== void 0 ? _b : 1;
        this.equippedSlot = (_c = base.equippedSlot) !== null && _c !== void 0 ? _c : -1;
        this.stats = {};
        this.commands = {};
        this.name = (_d = lang[this.id + "_name"]) !== null && _d !== void 0 ? _d : baseItem.name;
        if (setPrice > 0)
            this.price = setPrice;
        if (setPrice > 0) {
            this.fullPrice = () => { return this.price; };
        }
        else
            this.fullPrice = () => { return this.price * this.amount; };
    }
}
const gradeStatMultis = {
    common: 1,
    uncommon: 1.25,
    rare: 1.5,
    mythical: 1.75,
    legendary: 2
};
class Weapon extends Item {
    constructor(base, setPrice = 0, dontRollStats = false) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        super(base);
        const baseItem = Object.assign({}, items[this.id]);
        this.name = (_a = lang[this.id + "_name"]) !== null && _a !== void 0 ? _a : baseItem.name;
        this.level = (_b = base.level) !== null && _b !== void 0 ? _b : 0;
        this.maxLevel = (_c = baseItem.maxLevel) !== null && _c !== void 0 ? _c : 5;
        this.range = baseItem.range;
        this.firesProjectile = baseItem.firesProjectile;
        this.twoHanded = (_d = baseItem.twoHanded) !== null && _d !== void 0 ? _d : false;
        this.damages = (_f = leveledStats(Object.assign({}, baseItem.damages), (_e = this.level) !== null && _e !== void 0 ? _e : 0)) !== null && _f !== void 0 ? _f : {};
        this.stats = (_g = Object.assign({}, baseItem.stats)) !== null && _g !== void 0 ? _g : {};
        this.commands = (_h = Object.assign({}, baseItem.commands)) !== null && _h !== void 0 ? _h : {};
        this.statBonus = (_j = baseItem.statBonus) !== null && _j !== void 0 ? _j : "str";
        this.rolledStats = base.rolledStats || [];
        if (setPrice > 0)
            this.price = setPrice;
        if (this.level > 0)
            this.name += ` +${this.level}`;
        if (this.rolledStats.length === 0 && settings.randomize_items && !dontRollStats) {
            const amountOfMainStats = random(maxStatsForEquipmentToRoll[this.grade].main, 0);
            for (let i = 0; i <= amountOfMainStats; i++) {
                const randomStat = weightedRandom(Object.values(equipmentStatRandomization.damage));
                const key = randomStat.id;
                const data = randomStat;
                this.rolledStats.push({ damage: key, value: Math.floor(random(data.Value.length - 1, 0)) });
            }
            const amountOfSideStats = random(maxStatsForEquipmentToRoll[this.grade].side, 0);
            for (let i = 0; i <= amountOfSideStats; i++) {
                const randomStat = weightedRandom(Object.values(equipmentStatRandomization.side));
                const key = randomStat.id;
                const data = randomStat;
                if ((Math.random() > 0.5 && !data.disablePercent) || data.disableValue) {
                    this.rolledStats.push({ stat: key + "P", value: Math.floor(random(data.Percent.length - 1, 0)) });
                }
                else if (!data.disableValue) {
                    this.rolledStats.push({ stat: key + "V", value: Math.floor(random(data.Value.length - 1, 0)) });
                }
            }
        }
        (_k = this.rolledStats) === null || _k === void 0 ? void 0 : _k.forEach((stat) => {
            if (stat.damage) {
                let val = equipmentStatRandomization["damage"][stat.damage]["Value"][stat.value];
                if (!this.damages[stat.damage])
                    this.damages[stat.damage] = Math.floor(val * gradeStatMultis[this.grade]);
                else
                    this.damages[stat.damage] += Math.floor(val * gradeStatMultis[this.grade]);
            }
            else {
                let val = artifactStatRandomization[stat.stat.substring(0, stat.stat.length - 1)];
                val = val[stat.stat.endsWith("V") ? "Value" : "Percent"][stat.value];
                if (!this.stats[stat.stat])
                    this.stats[stat.stat] = Math.floor(val * gradeStatMultis[this.grade]);
                else
                    this.stats[stat.stat] += Math.floor(val * gradeStatMultis[this.grade]);
            }
        });
        // Assign correct name based on stat effects.
        if (this.rolledStats.length > 0) {
            let name = "";
            const maxAdjectives = 3;
            let adjectivesUsed = 0;
            const statKeys = [];
            Object.entries(this.stats).forEach((stat) => {
                if (!stat[0].includes("damage_against")) {
                    statKeys.push({ key: stat[0], num: stat[1] });
                }
            });
            statKeys.sort((key1, key2) => {
                if (key1.num > key2.num)
                    return -1;
                else if (key2.num > key1.num)
                    return 1;
                else
                    return 0;
            });
            let langName = lang[this.id + "_name"];
            if (!langName)
                langName = items[this.id].name;
            statKeys.forEach((stat) => {
                stat.key = stat.key.substring(0, stat.key.length - 1);
                if (adjectivesUsed >= maxAdjectives || name.includes(lang[stat.key + "_adjective"]))
                    return;
                adjectivesUsed++;
                name += `${adjectivesUsed === 1 ? " " : ""}${lang[stat.key + "_adjective"]} `;
            });
            name += `${langName}`;
            this.name = name;
        }
        if (setPrice > 0)
            this.fullPrice = () => { return this.price; };
        else {
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
                let price = Math.floor((bonus + this.price) * (1 + this.level / 2));
                return price < 1 ? 1 : price;
            };
        }
        function leveledStats(stats, level) {
            const values = {};
            Object.entries(stats).forEach((stat) => {
                values[stat[0]] = Math.round(stat[1] * (1 + level / 10));
            });
            return values;
        }
    }
}
class Armor extends Item {
    constructor(base, setPrice = 0, dontRollStats = false) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        super(base);
        // @ts-ignore
        const baseItem = Object.assign({}, items[this.id]);
        this.name = (_a = lang[this.id + "_name"]) !== null && _a !== void 0 ? _a : baseItem.name;
        this.level = (_b = base.level) !== null && _b !== void 0 ? _b : 0;
        this.maxLevel = (_c = baseItem.maxLevel) !== null && _c !== void 0 ? _c : 5;
        this.armor = (_e = leveledStats(Object.assign({}, baseItem.armor), (_d = this.level) !== null && _d !== void 0 ? _d : 0)) !== null && _e !== void 0 ? _e : {};
        this.resistances = (_g = leveledStats(Object.assign({}, baseItem.resistances), (_f = this.level) !== null && _f !== void 0 ? _f : 0)) !== null && _g !== void 0 ? _g : {};
        this.stats = (_h = Object.assign({}, baseItem.stats)) !== null && _h !== void 0 ? _h : {};
        this.commands = (_j = Object.assign({}, baseItem.commands)) !== null && _j !== void 0 ? _j : {};
        this.coversHair = (_k = baseItem.coversHair) !== null && _k !== void 0 ? _k : false;
        this.rolledStats = base.rolledStats || [];
        if (setPrice > 0)
            this.price = setPrice;
        if (this.level > 0)
            this.name += ` +${this.level}`;
        // Randomization reintroduced
        if (this.rolledStats.length === 0 && settings.randomize_items && !dontRollStats) {
            const amountOfMainStats = random(maxStatsForEquipmentToRoll[this.grade].main, 0);
            for (let i = 0; i <= amountOfMainStats; i++) {
                const randomStat = weightedRandom(Object.values(equipmentStatRandomization.armor));
                const key = randomStat.id;
                const data = randomStat;
                this.rolledStats.push({ armor: key, value: Math.floor(random(data.Value.length - 1, 0)) });
            }
            const amountOfSideStats = random(maxStatsForEquipmentToRoll[this.grade].side, 0);
            for (let i = 0; i <= amountOfSideStats; i++) {
                const randomStat = weightedRandom(Object.values(equipmentStatRandomization.side));
                const key = randomStat.id;
                const data = randomStat;
                if ((Math.random() > 0.5 && !data.disablePercent) || data.disableValue) {
                    this.rolledStats.push({ stat: key + "P", value: Math.floor(random(data.Percent.length - 1, 0)) });
                }
                else if (!data.disableValue) {
                    this.rolledStats.push({ stat: key + "V", value: Math.floor(random(data.Value.length - 1, 0)) });
                }
            }
        }
        (_l = this.rolledStats) === null || _l === void 0 ? void 0 : _l.forEach((stat) => {
            if (stat.armor) {
                let val = equipmentStatRandomization["armor"][stat.armor]["Value"][stat.value];
                if (!this.armor[stat.armor])
                    this.armor[stat.armor] = Math.floor(val * gradeStatMultis[this.grade]);
                else
                    this.armor[stat.armor] += Math.floor(val * gradeStatMultis[this.grade]);
            }
            else {
                let val = artifactStatRandomization[stat.stat.substring(0, stat.stat.length - 1)];
                val = val[stat.stat.endsWith("V") ? "Value" : "Percent"][stat.value];
                if (!this.stats[stat.stat])
                    this.stats[stat.stat] = Math.floor(val * gradeStatMultis[this.grade]);
                else
                    this.stats[stat.stat] += Math.floor(val * gradeStatMultis[this.grade]);
            }
        });
        if (this.rolledStats.length > 0) {
            let name = "";
            const maxAdjectives = 3;
            let adjectivesUsed = 0;
            const statKeys = [];
            Object.entries(this.stats).forEach((stat) => {
                if (!stat[0].includes("damage_against")) {
                    statKeys.push({ key: stat[0], num: stat[1] });
                }
            });
            statKeys.sort((key1, key2) => {
                if (key1.num > key2.num)
                    return -1;
                else if (key2.num > key1.num)
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
                name += `${adjectivesUsed === 1 ? " " : ""}${lang[stat.key + "_adjective"]} `;
            });
            name += `${langName}`;
            this.name = name;
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
// Artifact stat generation has been reintroduced.
const artifactStatRandomization = {
    str: {
        id: "str",
        Value: [1, 2, 3, 4, 5],
        Percent: [2, 3, 6, 8, 10, 13],
        chance: 10
    },
    dex: {
        id: "dex",
        Value: [1, 2, 3, 4, 5],
        Percent: [2, 3, 6, 8, 10, 13],
        chance: 10
    },
    vit: {
        id: "vit",
        Value: [1, 2, 3, 4, 5],
        Percent: [2, 3, 6, 8, 10, 13],
        chance: 10
    },
    int: {
        id: "int",
        Value: [1, 2, 3, 4, 5],
        Percent: [2, 3, 6, 8, 10, 13],
        chance: 10
    },
    cun: {
        id: "cun",
        Value: [1, 2, 3, 4, 5],
        Percent: [2, 3, 6, 8, 10, 13],
        chance: 10
    },
    hpMax: {
        id: "hpMax",
        Value: [4, 7, 10, 14, 17],
        Percent: [2, 3, 6, 8, 10, 13],
        chance: 7
    },
    mpMax: {
        id: "mpMax",
        Value: [3, 5, 6, 9],
        Percent: [2, 3, 6, 8, 10, 13],
        chance: 7
    },
    critChance: {
        id: "critChance",
        Percent: [1, 1.5, 2, 2.5, 3, 3.5, 4.1],
        disableValue: true,
        chance: 5
    },
    critDamage: {
        id: "critDamage",
        Percent: [2, 3.3, 4.7, 5.6, 7.4, 9.3, 10],
        disableValue: true,
        chance: 5
    },
    evasion: {
        id: "evasion",
        disablePercent: true,
        Value: [1, 2, 3, 4, 5, 6],
        chance: 6
    },
    rangedDamage: {
        id: "rangedDamage",
        disableValue: true,
        Percent: [0.5, 1.5, 2.7, 3.8, 4.5, 5],
        chance: 3
    },
    meleeDamage: {
        id: "meleeDamage",
        disableValue: true,
        Percent: [0.5, 1.5, 2.7, 3.8, 4.5, 5],
        chance: 3
    },
    spellDamage: {
        id: "spellDamage",
        disableValue: true,
        Percent: [0.5, 1.5, 2.7, 3.8, 4.5, 5],
        chance: 3
    },
    resistAll: {
        id: "resistAll",
        Value: [1, 2, 3, 4, 5],
        Percent: [1.5, 3, 4.5, 6, 7.5],
        chance: 2
    },
    movementSpeed: {
        id: "movementSpeed",
        disablePercent: true,
        Value: [2, 5, 7, 8, 10, 12, 13, 14, 15, 16],
        chance: 3
    },
    attackSpeed: {
        id: "attackSpeed",
        disablePercent: true,
        Value: [2, 5, 7, 8, 10, 12, 13, 14, 15, 16],
        chance: 3
    },
};
const equipmentStatRandomization = {
    damage: {
        slash: {
            id: "slash",
            Value: [1, 2, 3, 4, 5],
            chance: 8
        },
        crush: {
            id: "crush",
            Value: [1, 2, 3, 4, 5],
            chance: 8
        },
        pierce: {
            id: "pierce",
            Value: [1, 2, 3, 4, 5],
            chance: 8
        },
        magic: {
            id: "magic",
            Value: [1, 2, 3, 4, 5],
            chance: 8
        },
        dark: {
            id: "dark",
            Value: [1, 2, 3, 4, 5],
            chance: 8
        },
        divine: {
            id: "divine",
            Value: [1, 2, 3, 4, 5],
            chance: 8
        },
        fire: {
            id: "fire",
            Value: [1, 2, 3, 4, 5],
            chance: 8
        },
        lightning: {
            id: "lightning",
            Value: [1, 2, 3, 4, 5],
            chance: 8
        },
        ice: {
            id: "ice",
            Value: [1, 2, 3, 4, 5],
            chance: 8
        },
    },
    armor: {
        physical: {
            id: "physical",
            Value: [2, 4, 6, 8],
            chance: 20
        },
        magical: {
            id: "magical",
            Value: [2, 4, 6, 8],
            chance: 20
        },
        elemental: {
            id: "elemental",
            Value: [2, 4, 6, 8],
            chance: 20
        }
    },
    side: {
        str: {
            id: "str",
            Value: [1, 2, 3, 4, 5],
            Percent: [2, 3, 6, 8, 10, 13],
            chance: 10
        },
        dex: {
            id: "dex",
            Value: [1, 2, 3, 4, 5],
            Percent: [2, 3, 6, 8, 10, 13],
            chance: 10
        },
        vit: {
            id: "vit",
            Value: [1, 2, 3, 4, 5],
            Percent: [2, 3, 6, 8, 10, 13],
            chance: 10
        },
        int: {
            id: "int",
            Value: [1, 2, 3, 4, 5],
            Percent: [2, 3, 6, 8, 10, 13],
            chance: 10
        },
        cun: {
            id: "cun",
            Value: [1, 2, 3, 4, 5],
            Percent: [2, 3, 6, 8, 10, 13],
            chance: 10
        },
        hpMax: {
            id: "hpMax",
            Value: [4, 7, 10, 14, 17],
            Percent: [2, 3, 6, 8, 10, 13],
            chance: 7
        },
        mpMax: {
            id: "mpMax",
            Value: [3, 5, 6, 9],
            Percent: [2, 3, 6, 8, 10, 13],
            chance: 7
        },
        critChance: {
            id: "critChance",
            Percent: [1, 1.5, 2, 2.5, 3, 3.5, 4.1],
            disableValue: true,
            chance: 5
        },
        critDamage: {
            id: "critDamage",
            Percent: [2, 3.3, 4.7, 5.6, 7.4, 9.3, 10],
            disableValue: true,
            chance: 5
        },
        movementSpeed: {
            id: "movementSpeed",
            disablePercent: true,
            Value: [2, 5, 7, 8, 10, 12, 13, 14, 15, 16],
            chance: 3
        },
        evasion: {
            id: "evasion",
            disablePercent: true,
            Value: [1, 2, 3, 4, 5, 6],
            chance: 6
        },
        rangedDamage: {
            id: "rangedDamage",
            disableValue: true,
            Percent: [0.5, 1.5, 2.7, 3.8, 4.5, 5],
            chance: 3
        },
        meleeDamage: {
            id: "meleeDamage",
            disableValue: true,
            Percent: [0.5, 1.5, 2.7, 3.8, 4.5, 5],
            chance: 3
        },
        spellDamage: {
            id: "spellDamage",
            disableValue: true,
            Percent: [0.5, 1.5, 2.7, 3.8, 4.5, 5],
            chance: 3
        },
        resistAll: {
            id: "resistAll",
            Value: [1, 2, 3, 4, 5],
            Percent: [1.5, 3, 4.5, 6, 7.5],
            chance: 2
        },
        attackSpeed: {
            id: "attackSpeed",
            disablePercent: true,
            Value: [2, 5, 7, 8, 10, 12, 13, 14, 15, 16],
            chance: 3
        },
    }
};
const maxStatsForArtifactsToRoll = {
    uncommon: 4
};
// Main: for weapons damage, for armor, well armor.
// Side: any random stat effect.
const maxStatsForEquipmentToRoll = {
    common: { main: 1, side: 1 },
    uncommon: { main: 1, side: 2 },
    rare: { main: 2, side: 3 },
    mythical: { main: 3, side: 3 },
    legendary: { main: 3, side: 4 }
};
class Artifact extends Item {
    constructor(base, setPrice = 0, dontRollStats = false) {
        var _a, _b;
        super(base);
        const baseItem = Object.assign({}, items[this.id]);
        this.stats = (_a = Object.assign({}, baseItem.stats)) !== null && _a !== void 0 ? _a : {};
        this.artifactSet = baseItem.artifactSet;
        this.rolledStats = base.rolledStats || [];
        this.commands = {};
        if (setPrice > 0)
            this.price = setPrice;
        if (lang.language_id !== "english")
            this.name = lang[this.id + "_name"];
        if (this.rolledStats.length === 0 && !dontRollStats) {
            const amountOfStats = random(maxStatsForArtifactsToRoll[this.grade], 0);
            for (let i = 0; i <= amountOfStats; i++) {
                const randomStat = weightedRandom(Object.values(artifactStatRandomization));
                const key = randomStat.id;
                const data = randomStat;
                if ((Math.random() > 0.5 && !data.disablePercent) || data.disableValue) {
                    this.rolledStats.push({ stat: key + "P", value: Math.floor(random(data.Percent.length - 1, 0)) });
                }
                else if (!data.disableValue) {
                    this.rolledStats.push({ stat: key + "V", value: Math.floor(random(data.Value.length - 1, 0)) });
                }
            }
        }
        (_b = this.rolledStats) === null || _b === void 0 ? void 0 : _b.forEach((stat) => {
            let val = artifactStatRandomization[stat.stat.substring(0, stat.stat.length - 1)];
            val = val[stat.stat.endsWith("V") ? "Value" : "Percent"][stat.value];
            if (!this.stats[stat.stat])
                this.stats[stat.stat] = val;
            else
                this.stats[stat.stat] += val;
        });
        if (setPrice > 0)
            this.fullPrice = () => { return this.price; };
        else {
            this.fullPrice = () => {
                let bonus = 0;
                Object.entries(this.stats).forEach((stat) => {
                    let _sw = statWorths[stat[0]] * stat[1];
                    if (isNaN(_sw))
                        _sw = stat[1] * 2;
                    bonus += _sw * 1.5;
                });
                bonus *= grades[this.grade]["worth"];
                let price = Math.floor(bonus + this.price);
                return price < 1 ? 1 : price;
            };
        }
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
(_b = (_a = document.querySelector(".playerInventory")) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".slot")) === null || _b === void 0 ? void 0 : _b.forEach(slot => slot.addEventListener("mousedown", e => player.unequip(e, slot.classList[0].toString())));
(_c = document.querySelector(".playerInventory")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", e => removeContextMenu(e));
function renderInventory() {
    state.invOpen = true;
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
            img.addEventListener("click", e => clickItem(e, player[slot], img, "PLAYER_EQUIPMENT"));
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
}
function closeInventory() {
    state.invOpen = false;
    hideHover();
    document.querySelector(".worldText").style.opacity = "1";
    const inventory = document.querySelector(".playerInventory");
    inventory.style.transform = "scale(0)";
    const _inv = document.querySelector(".defaultItemsArray");
    _inv.textContent = "";
    _inv.style.transform = "scale(0)";
}
function closeLeveling() {
    state.perkOpen = false;
    document.querySelector(".worldText").style.opacity = "1";
    const lvling = document.querySelector(".playerLeveling");
    lvling.style.transform = "scale(0)";
}
function itemTT(item) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
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
        text += `<i>${icons.resistance}<i><f>18px<f>${lang["required_stats"]}: <f>17px<f>(${txt})\n§`;
    }
    if (((_j = Object.values(item === null || item === void 0 ? void 0 : item.stats)) === null || _j === void 0 ? void 0 : _j.length) > 0) {
        text += `<i>${icons.resistance}<i><f>18px<f>${lang["status_effects"]}:\n`;
        Object.entries(item.stats).forEach(eff => { if (eff[1] !== 0)
            text += effectSyntax(eff, true, ""); });
    }
    if (((_k = Object.values(item.commands)) === null || _k === void 0 ? void 0 : _k.length) > 0) {
        Object.entries(item.commands).forEach((eff) => text += `${commandSyntax(eff[0], eff[1])}\n`);
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
        Object.entries((_l = artifactSets[item.artifactSet]) === null || _l === void 0 ? void 0 : _l.twoPieceEffect).forEach((effect) => {
            if (effect[1] !== 0)
                text += effectSyntax(effect, true, "");
        });
        text += `\n<c>${sets[item.artifactSet] > 2 ? "lime" : "grey"}<c><f>18px<f>${lang["artifact_three_piece"]}\n`;
        Object.entries((_m = artifactSets[item.artifactSet]) === null || _m === void 0 ? void 0 : _m.threePieceEffect).forEach((effect) => {
            if (effect[1] !== 0)
                text += effectSyntax(effect, true, "");
        });
    }
    return text;
}
var sortingReverse = false;
function createItems(inventory, context = "PLAYER_INVENTORY", chest = null, resetItem = true, itemToMatch = null) {
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
    topName.addEventListener("click", e => sortInventory("name", sortingReverse, inventory, context));
    topType.addEventListener("click", e => sortInventory("type", sortingReverse, inventory, context));
    topRarity.addEventListener("click", e => sortInventory("grade", sortingReverse, inventory, context));
    topWeight.addEventListener("click", e => sortInventory("weight", sortingReverse, inventory, context));
    topWorth.addEventListener("click", e => sortInventory("worth", sortingReverse, inventory, context));
    itemsList.classList.add("itemList");
    itemsListBar.classList.add("itemListTop");
    itemsListBar.append(topImage, topName, topType, topRarity, topWeight, topWorth);
    itemsList.addEventListener("click", e => removeContextMenu(e));
    const items = [...inventory];
    items.forEach((item) => {
        if (context == "UPGRADE" && (itemToMatch === null || itemToMatch === void 0 ? void 0 : itemToMatch.id)) {
            if (item.id !== (itemToMatch === null || itemToMatch === void 0 ? void 0 : itemToMatch.id) || item.level !== (itemToMatch === null || itemToMatch === void 0 ? void 0 : itemToMatch.level))
                return;
        }
        ;
        if (context == "UPGRADE" && (item.type == "artifact" || item.type == "consumable"))
            return;
        let itm = Object.assign({}, item);
        if (resetItem) {
            if (itm.type == "weapon")
                itm = new Weapon(Object.assign({}, itm), 0, context === "MERCHANT_SELLING" ? true : false);
            else if (itm.type == "armor")
                itm = new Armor(Object.assign({}, itm), 0, context === "MERCHANT_SELLING" ? true : false);
            else if (itm.type == "artifact")
                itm = new Artifact(Object.assign({}, itm), 0, context === "MERCHANT_SELLING" ? true : false);
            else if (itm.type == "consumable")
                itm = new Consumable(Object.assign({}, itm));
        }
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
        itemName.textContent = `${itm.name} ${itm.stacks ? "x" + itm.amount : ""}`;
        itemRarity.textContent = lang[itm.grade].toLowerCase();
        itemType.textContent = lang[itm.type];
        itemWeight.textContent = itm.weight;
        let price = itm.price;
        if (typeof itm.fullPrice === "function") {
            price = itm.fullPrice();
        }
        if (price > 999)
            price = `${Math.round(price / 1000)}k`;
        itemWorth.textContent = price;
        if (context == "PLAYER_INVENTORY") {
            itemObject.addEventListener("mousedown", e => player.equip(e, itm));
            itemObject.addEventListener("mouseup", e => fastDrop(e, itm));
            itemObject.addEventListener("click", e => clickItem(e, itm, itemObject, "PLAYER_INVENTORY"));
        }
        if (context == "PICK_LOOT") {
            itemObject.addEventListener("mousedown", e => grabLoot(e, itm, item.dataIndex));
            itemObject.addEventListener("click", e => clickItem(e, itm, itemObject, "PICK_LOOT", null, item.dataIndex));
        }
        if (context == "PICK_TREASURE") {
            itemObject.addEventListener("mousedown", e => grabTreasure(e, itm, chest, item.dataIndex));
            itemObject.addEventListener("click", e => clickItem(e, itm, itemObject, "PICK_TREASURE", chest, item.dataIndex));
        }
        if (context == "MERCHANT_SELLING") {
            itemObject.addEventListener("mousedown", e => buyItem(e, itm));
            itemObject.addEventListener("click", e => clickItem(e, itm, itemObject, "MERCHANT_SELLING", chest));
        }
        if (context == "PLAYER_SELLING") {
            itemObject.addEventListener("mousedown", e => sellItem(e, itm));
            itemObject.addEventListener("click", e => clickItem(e, itm, itemObject, "PLAYER_SELLING", chest));
        }
        if (context == "UPGRADE") {
            itemObject.addEventListener("mousedown", e => handleUpgradeAdding(e, itm));
            itemObject.addEventListener("click", e => clickItem(e, itm, itemObject, "UPGRADE", chest));
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
function buyItem(e, itm) {
    if (e.button !== 2)
        return;
    addItemToBuying(itm);
}
function sellItem(e, itm) {
    if (e.button !== 2)
        return;
    addItemToSelling(itm);
}
function clickItem(Event, item, itemObject, context = "PLAYER_INVENTORY", chest = null, dataIndex = -1) {
    if (item.id == "A0_error")
        return;
    contextMenu.textContent = "";
    try {
        document.querySelector(".itemSelected").classList.remove("itemSelected");
    }
    catch (_a) { }
    if (Event.shiftKey)
        return;
    if (context != "PLAYER_EQUIPMENT")
        itemObject.classList.add("itemSelected");
    contextMenu.style.left = `${Event.x}px`;
    contextMenu.style.top = `${Event.y}px`;
    if (context == "PLAYER_INVENTORY") {
        if (item.type != "consumable") { }
        contextMenuButton(lang["equip"], () => player.equip(Event, item, true));
        contextMenuButton(lang["drop"], () => player.drop(item, true));
    }
    else if (context == "PICK_LOOT") {
        contextMenuButton(lang["pick_up"], () => grabLoot(Event, item, dataIndex, true));
    }
    else if (context == "PICK_TREASURE") {
        contextMenuButton(lang["pick_up"], () => grabTreasure(Event, item, chest, dataIndex, true));
    }
    else if (context == "PLAYER_EQUIPMENT") {
        contextMenuButton(lang["unequip"], () => player.unequip(Event, item.slot, -1, false, true));
    }
    else if (context == "MERCHANT_SELLING") {
        contextMenuButton(lang["buy_item"], () => { addItemToBuying(item); });
    }
    else if (context == "PLAYER_SELLING") {
        contextMenuButton(lang["sell_item"], () => { addItemToSelling(item); });
    }
}
function fastDrop(Event, itm) {
    if (Event.shiftKey) {
        player.drop(itm);
    }
}
function removeContextMenu(Event) {
    let target = Event.target;
    if (target.className.includes("itemList") || target.className.includes("playerInventory")) {
        try {
            document.querySelector(".itemSelected").classList.remove("itemSelected");
        }
        catch (_a) { }
        contextMenu.textContent = "";
    }
}
const artifactSets = {
    defender: {
        id: "defender",
        twoPieceEffect: {
            hpMaxP: 10
        },
        threePieceEffect: {
            resistAllV: 10
        }
    },
    scholar: {
        id: "scholar",
        twoPieceEffect: {
            mpMaxP: 10
        },
        threePieceEffect: {
            intV: 5,
            spellDamageP: 10
        }
    },
    warrior: {
        id: "warrior",
        twoPieceEffect: {
            meleeDamageP: 10
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
    hunter: {
        id: "hunter",
        twoPieceEffect: {
            rangedDamageP: 5,
            sightV: 1
        },
        threePieceEffect: {
            rangedDamageP: 5,
            hpMaxV: 5,
            all_summons_damageP: 10,
            all_summons_regenHpP: 10
        }
    }
};
//# sourceMappingURL=equipment.js.map