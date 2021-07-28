"use strict";
function getModifiers(char, stat) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    let val = 0;
    let modif = 1;
    char.statModifiers.forEach((mod) => {
        Object.entries(mod.effects).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P" && eff[1] < 0)
                    modif *= (1 + eff[1] / 100);
                else if (eff[0] == stat + "P")
                    modif += (eff[1] / 100);
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    });
    char.statusEffects.forEach((mod) => {
        Object.entries(mod.effects).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P" && eff[1] < 0)
                    modif *= (1 + eff[1] / 100);
                else if (eff[0] == stat + "P")
                    modif += (eff[1] / 100);
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    });
    (_a = char.perks) === null || _a === void 0 ? void 0 : _a.forEach((mod) => {
        Object.entries(mod.effects).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P" && eff[1] < 0)
                    modif *= (1 + eff[1] / 100);
                else if (eff[0] == stat + "P")
                    modif += (eff[1] / 100);
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    });
    if ((_b = char.raceEffect) === null || _b === void 0 ? void 0 : _b.modifiers) {
        Object.entries((_c = char.raceEffect) === null || _c === void 0 ? void 0 : _c.modifiers).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P" && eff[1] < 0)
                    modif *= (1 + eff[1] / 100);
                else if (eff[0] == stat + "P")
                    modif += (eff[1] / 100);
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    }
    if ((_d = char.weapon) === null || _d === void 0 ? void 0 : _d.stats) {
        Object.entries(char.weapon.stats).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P" && eff[1] < 0)
                    modif *= (1 + eff[1] / 100);
                else if (eff[0] == stat + "P")
                    modif += (eff[1] / 100);
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    }
    if ((_e = char.chest) === null || _e === void 0 ? void 0 : _e.stats) {
        Object.entries(char.chest.stats).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P" && eff[1] < 0)
                    modif *= (1 + eff[1] / 100);
                else if (eff[0] == stat + "P")
                    modif += (eff[1] / 100);
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    }
    if ((_f = char.helmet) === null || _f === void 0 ? void 0 : _f.stats) {
        Object.entries(char.helmet.stats).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P" && eff[1] < 0)
                    modif *= (1 + eff[1] / 100);
                else if (eff[0] == stat + "P")
                    modif += (eff[1] / 100);
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    }
    if ((_g = char.gloves) === null || _g === void 0 ? void 0 : _g.stats) {
        Object.entries(char.gloves.stats).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P" && eff[1] < 0)
                    modif *= (1 + eff[1] / 100);
                else if (eff[0] == stat + "P")
                    modif += (eff[1] / 100);
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    }
    if ((_h = char.boots) === null || _h === void 0 ? void 0 : _h.stats) {
        Object.entries(char.boots.stats).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P" && eff[1] < 0)
                    modif *= (1 + eff[1] / 100);
                else if (eff[0] == stat + "P")
                    modif += (eff[1] / 100);
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    }
    if (stat.includes("Resist")) {
        if ((_j = char.chest) === null || _j === void 0 ? void 0 : _j.resistances) {
            if (char.chest.resistances[stat.replace("Resist", '')])
                val += char.chest.resistances[stat.replace("Resist", '')];
        }
        if ((_k = char.helmet) === null || _k === void 0 ? void 0 : _k.resistances) {
            if (char.helmet.resistances[stat.replace("Resist", '')])
                val += char.helmet.resistances[stat.replace("Resist", '')];
        }
        if ((_l = char.gloves) === null || _l === void 0 ? void 0 : _l.resistances) {
            if (char.gloves.resistances[stat.replace("Resist", '')])
                val += char.gloves.resistances[stat.replace("Resist", '')];
        }
        if ((_m = char.boots) === null || _m === void 0 ? void 0 : _m.resistances) {
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
                stats[stat] > 100 ? stats[stat] = Math.floor(100 + (stats[stat] - 100) / 17) : "";
            });
            // get hp
            const { v: hp_val, m: hp_mod } = getModifiers(this, "hpMax");
            stats["hpMax"] = Math.floor((((_b = (_a = this.stats) === null || _a === void 0 ? void 0 : _a.hpMax) !== null && _b !== void 0 ? _b : 20) + hp_val + stats.vit * 5) * hp_mod);
            // get mp
            const { v: mp_val, m: mp_mod } = getModifiers(this, "mpMax");
            stats["mpMax"] = Math.floor((((_d = (_c = this.stats) === null || _c === void 0 ? void 0 : _c.mpMax) !== null && _d !== void 0 ? _d : 10) + mp_val + stats.int * 2) * mp_mod);
            stats["mpMax"] < 0 ? stats["mpMax"] = 0 : "";
            stats["hpMax"] < 0 ? stats["hpMax"] = 0 : "";
            const { v: critAtkVal, m: critAtkMulti } = getModifiers(this, "critDamage");
            const { v: critHitVal, m: critHitMulti } = getModifiers(this, "critChance");
            stats["critDamage"] = Math.floor(critAtkVal + (critAtkMulti - 1) * 100 + (stats["cun"] * 1.5));
            stats["critChance"] = Math.floor(critHitVal + (critHitMulti - 1) * 100 + (stats["cun"] * 0.4));
            return stats;
        };
        this.getResists = () => {
            let resists = {};
            Object.keys(this.resistances).forEach((res) => {
                const { v: val, m: mod } = getModifiers(this, res + "Resist");
                const { v: _val, m: _mod } = getModifiers(this, "resistAll");
                let value = Math.floor((this.resistances[res] + val) * mod);
                resists[res] = Math.floor((value + _val) * _mod);
                resists[res] > 85 ? resists[res] = Math.floor(85 + (resists[res] - 85) / 17) : "";
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
                    const dmg = Math.floor(status.dot.damageAmount * (1 - this.getStatusResists()[status.dot.damageType] / 100));
                    this.stats.hp -= dmg;
                    spawnFloatingText(this.cords, dmg.toString(), "red", 32);
                    let effectText = this.id == "player" ? lang["damage_from_effect_pl"] : lang["damage_from_effect"];
                    effectText = effectText === null || effectText === void 0 ? void 0 : effectText.replace("[TARGET]", `<c>white<c>'<c>yellow<c>${this.name}<c>white<c>'`);
                    effectText = effectText === null || effectText === void 0 ? void 0 : effectText.replace("[ICON]", `<i>${status.dot.icon}<i>`);
                    effectText = effectText === null || effectText === void 0 ? void 0 : effectText.replace("[STATUS]", `${lang[status.dot.damageType + "_damage"]}`);
                    effectText = effectText === null || effectText === void 0 ? void 0 : effectText.replace("[DMG]", `${dmg}`);
                    displayText(`<c>purple<c>[EFFECT] ${effectText}`);
                    if (this.stats.hp <= 0) {
                        this.kill();
                    }
                }
                status.last.current--;
                if (status.last.current <= 0) {
                    this.statusEffects.splice(index, 1);
                }
            });
            (_a = this.abilities) === null || _a === void 0 ? void 0 : _a.forEach((abi) => {
                if (abi.onCooldown > 0) {
                    if (abi.recharge_only_in_combat) {
                        if (state.inCombat)
                            abi.onCooldown--;
                    }
                    else
                        abi.onCooldown--;
                }
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
        this.hpRemain = () => {
            return (this.stats.hp / this.getStats().hpMax) * 100;
        };
        this.updateAbilities = () => {
            var _a, _b;
            // @ts-ignore
            for (let i = 0; i < ((_a = this.abilities) === null || _a === void 0 ? void 0 : _a.length); i++) {
                // @ts-ignore
                this.abilities[i] = new Ability(this.abilities[i], this);
            }
            // @ts-ignore
            if (this.inventory) {
                // @ts-ignore
                for (let i = 0; i < ((_b = this.inventory) === null || _b === void 0 ? void 0 : _b.length); i++) {
                    // @ts-ignore
                    if (this.inventory[i].type == "weapon")
                        this.inventory[i] = new Weapon(Object.assign({}, this.inventory[i]));
                    // @ts-ignore
                    else if (this.inventory[i].type == "armor")
                        this.inventory[i] = new Armor(this.inventory[i]);
                }
            }
        };
    }
}
const baseStats = [
    "str",
    "vit",
    "dex",
    "int",
    "cun"
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
//# sourceMappingURL=character.js.map