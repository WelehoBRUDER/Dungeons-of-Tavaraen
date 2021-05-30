"use strict";
function getModifiers(char, stat) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    let val = 0;
    let modif = 1;
    char.statModifiers.forEach((mod) => {
        Object.entries(mod.effects).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P")
                    modif *= (1 + eff[1] / 100);
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    });
    char.statusEffects.forEach((mod) => {
        Object.entries(mod.effects).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P")
                    modif *= (1 + eff[1] / 100);
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    });
    if ((_a = char.weapon) === null || _a === void 0 ? void 0 : _a.stats) {
        Object.entries(char.weapon.stats).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P")
                    modif *= (1 + eff[1] / 100);
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    }
    if ((_b = char.chest) === null || _b === void 0 ? void 0 : _b.stats) {
        Object.entries(char.chest.stats).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P")
                    modif *= (1 + eff[1] / 100);
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    }
    if ((_c = char.helmet) === null || _c === void 0 ? void 0 : _c.stats) {
        Object.entries(char.helmet.stats).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P")
                    modif *= (1 + eff[1] / 100);
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    }
    if ((_d = char.gloves) === null || _d === void 0 ? void 0 : _d.stats) {
        Object.entries(char.gloves.stats).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P")
                    modif *= (1 + eff[1] / 100);
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    }
    if ((_e = char.boots) === null || _e === void 0 ? void 0 : _e.stats) {
        Object.entries(char.boots.stats).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P")
                    modif *= (1 + eff[1] / 100);
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
        var _a, _b, _c, _d, _e;
        this.id = base.id;
        this.name = (_a = base.name) !== null && _a !== void 0 ? _a : "name_404";
        this.cords = (_b = base.cords) !== null && _b !== void 0 ? _b : { x: 0, y: 0 };
        this.stats = Object.assign({}, base.stats);
        this.resistances = Object.assign({}, base.resistances);
        this.statusResistances = Object.assign({}, base.statusResistances);
        this.statModifiers = (_c = base.statModifiers) !== null && _c !== void 0 ? _c : [];
        this.statusEffects = (_d = base.statusEffects) !== null && _d !== void 0 ? _d : [];
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
            stats["mpMax"] < 0 ? stats["mpMax"] = 0 : "";
            stats["hpMax"] < 0 ? stats["hpMax"] = 0 : "";
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
        this.getStatusResists = () => {
            let resists = {};
            Object.keys(this.statusResistances).forEach((res) => {
                const { v: val, m: mod } = getModifiers(this, res + "Resist");
                resists[res] = Math.floor((this.statusResistances[res] + val) * mod);
            });
            return resists;
        };
        this.statRemaining = (stat) => {
            return ((this.stats[stat] / this.getStats()[stat + "Max"]) * 100);
        };
        this.effects = () => {
            var _a;
            this.statusEffects.forEach((status, index) => {
                if (status.dot) {
                    const dmg = Math.floor(status.dot.damageAmount * (1 - this.getStatusResists()[status.dot.damageType]));
                    this.stats.hp -= dmg;
                    spawnFloatingText(this.cords, dmg.toString(), "red", 32);
                    if (this.id == "player")
                        displayText(`<c>purple<c>[EFFECT] <c>yellow<c>You <c>white<c>take ${dmg} damage from <i>${status.dot.icon}<i>${status.dot.damageType}.`);
                    else
                        displayText(`<c>yellow<c>${this.name} <c>white<c>takes ${dmg} damage from ${status.dot.damageType}.`);
                    if (this.stats.hp <= 0) {
                        // @ts-expect-error
                        this.kill();
                    }
                }
                status.last.current--;
                if (status.last.current <= 0) {
                    this.statusEffects.splice(index, 1);
                }
            });
            (_a = this.abilities) === null || _a === void 0 ? void 0 : _a.forEach((abi) => {
                // @ts-expect-error
                if (abi.onCooldown > 0)
                    abi.onCooldown--;
            });
        };
        this.abilities = (_e = base.abilities) !== null && _e !== void 0 ? _e : [];
        this.silenced = () => {
            var result = false;
            this.statusEffects.forEach((eff) => {
                if (eff.silence) {
                    result = true;
                    return;
                }
            });
            return result;
        };
        this.concentration = () => {
            var result = true;
            this.statusEffects.forEach((eff) => {
                if (eff.break_concentration) {
                    result = false;
                    return;
                }
            });
            return result;
        };
        this.updateAbilities = () => {
            var _a;
            // @ts-ignore
            for (let i = 0; i < ((_a = this.abilities) === null || _a === void 0 ? void 0 : _a.length); i++) {
                // @ts-ignore
                this.abilities[i] = new Ability(this.abilities[i], this);
            }
        };
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
