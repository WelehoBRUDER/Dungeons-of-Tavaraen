"use strict";
function getModifiers(char, stat) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    let val = 0;
    let modif = 1;
    char.statModifiers.forEach((mod) => {
        Object.entries(mod.effects).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P")
                    modif *= eff[1] / 100;
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    });
    if ((_a = char.weapon) === null || _a === void 0 ? void 0 : _a.stats) {
        Object.entries(char.weapon.stats).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P")
                    modif *= eff[1] / 100;
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    }
    if ((_b = char.chest) === null || _b === void 0 ? void 0 : _b.stats) {
        Object.entries(char.chest.stats).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P")
                    modif *= eff[1] / 100;
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    }
    if ((_c = char.helmet) === null || _c === void 0 ? void 0 : _c.stats) {
        Object.entries(char.helmet.stats).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P")
                    modif *= eff[1] / 100;
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    }
    if ((_d = char.gloves) === null || _d === void 0 ? void 0 : _d.stats) {
        Object.entries(char.gloves.stats).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P")
                    modif *= eff[1] / 100;
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    }
    if ((_e = char.boots) === null || _e === void 0 ? void 0 : _e.stats) {
        Object.entries(char.boots.stats).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P")
                    modif *= eff[1] / 100;
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    }
    if (stat.includes("Resist")) {
        if ((_f = char.chest) === null || _f === void 0 ? void 0 : _f.resistances) {
            if (char.chest.resistances[stat.replace("Resist", '')])
                val += char.chest.resistances[stat.replace("Resist", '')];
        }
        if ((_g = char.helmet) === null || _g === void 0 ? void 0 : _g.resistances) {
            if (char.helmet.resistances[stat.replace("Resist", '')])
                val += char.helmet.resistances[stat.replace("Resist", '')];
        }
        if ((_h = char.gloves) === null || _h === void 0 ? void 0 : _h.resistances) {
            if (char.gloves.resistances[stat.replace("Resist", '')])
                val += char.gloves.resistances[stat.replace("Resist", '')];
        }
        if ((_j = char.boots) === null || _j === void 0 ? void 0 : _j.resistances) {
            if (char.boots.resistances[stat.replace("Resist", '')])
                val += char.boots.resistances[stat.replace("Resist", '')];
        }
    }
    return { v: val, m: modif };
}
class Character {
    constructor(base) {
        var _a, _b, _c, _d;
        this.id = base.id;
        this.name = (_a = base.name) !== null && _a !== void 0 ? _a : "name_404";
        this.cords = (_b = base.cords) !== null && _b !== void 0 ? _b : { x: 0, y: 0 };
        this.stats = Object.assign({}, base.stats);
        this.resistances = Object.assign({}, base.resistances);
        this.statModifiers = (_c = base.statModifiers) !== null && _c !== void 0 ? _c : [];
        this.getStats = () => {
            var _a, _b, _c, _d;
            let stats = {};
            baseStats.forEach((stat) => {
                const { v: val, m: mod } = getModifiers(this, stat);
                stats[stat] = Math.floor((this.stats[stat] + val) * mod);
            });
            // get hp
            const { v: hp_val, m: hp_mod } = getModifiers(this, "hpMax");
            stats["hpMax"] = Math.floor((((_b = (_a = this.stats) === null || _a === void 0 ? void 0 : _a.hpMax) !== null && _b !== void 0 ? _b : 20) + hp_val + stats.vit * 5) * hp_mod);
            // get mp
            const { v: mp_val, m: mp_mod } = getModifiers(this, "mpMax");
            stats["mpMax"] = Math.floor((((_d = (_c = this.stats) === null || _c === void 0 ? void 0 : _c.mpMax) !== null && _d !== void 0 ? _d : 10) + mp_val + stats.int * 2) * mp_mod);
            return stats;
        };
        this.getResists = () => {
            let resists = {};
            Object.keys(this.resistances).forEach((res) => {
                const { v: val, m: mod } = getModifiers(this, res + "Resist");
                resists[res] = Math.floor((this.resistances[res] + val) * mod);
            });
            return resists;
        };
        this.statRemaining = (stat) => {
            return ((this.stats[stat] / this.getStats()[stat + "Max"]) * 100);
        };
        this.abilities = (_d = base.abilities) !== null && _d !== void 0 ? _d : [];
    }
}
const baseStats = [
    "str",
    "vit",
    "dex",
    "int"
];
;
// var ley = new Character({
//   id: "ley",
//   name: "leyli",
//   cords: {x: 0, y: 0},
//   stats: {
//     str: 1,
//     dex: 1,
//     int: 1,
//     vit: 1,
//     hp: 10,
//     mp: 5
//   }
// })
