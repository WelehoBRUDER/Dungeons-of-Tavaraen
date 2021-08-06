"use strict";
function statConditions(conditions, char) {
    let fulfilled = true;
    Object.entries(conditions).forEach((condition) => {
        const key = condition[0];
        const val = condition[1];
        if (key.includes("hp")) {
            if (key.includes("more_than")) {
                if (char.hpRemain() <= val)
                    fulfilled = false;
            }
            else if (key.includes("less_than")) {
                if (char.hpRemain() >= val)
                    fulfilled = false;
            }
        }
    });
    return fulfilled;
}
function getModifiers(char, stat, withConditions = true) {
    var _a, _b, _c, _d, _e, _f, _g;
    let val = 0;
    let modif = 1;
    char.statModifiers.forEach((mod) => {
        let apply = true;
        if (mod.conditions && withConditions) {
            apply = statConditions(mod.conditions, char);
        }
        if (mod.conditions && !withConditions)
            apply = false;
        if (apply) {
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
        }
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
    if ((_b = (_a = char.classes) === null || _a === void 0 ? void 0 : _a.main) === null || _b === void 0 ? void 0 : _b.statBonuses) {
        Object.entries(char.classes.main.statBonuses).forEach((eff) => {
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
    if ((_d = (_c = char.classes) === null || _c === void 0 ? void 0 : _c.sub) === null || _d === void 0 ? void 0 : _d.statBonuses) {
        Object.entries(char.classes.sub.statBonuses).forEach((eff) => {
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
    (_e = char.perks) === null || _e === void 0 ? void 0 : _e.forEach((mod) => {
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
        if (mod.statModifiers) {
            mod.statModifiers.forEach((_mod) => {
                let apply = true;
                if (_mod.conditions && withConditions) {
                    apply = statConditions(_mod.conditions, char);
                }
                if (_mod.conditions && !withConditions)
                    apply = false;
                if (apply) {
                    Object.entries(_mod.effects).forEach((eff) => {
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
            });
        }
    });
    if ((_f = char.raceEffect) === null || _f === void 0 ? void 0 : _f.modifiers) {
        Object.entries((_g = char.raceEffect) === null || _g === void 0 ? void 0 : _g.modifiers).forEach((eff) => {
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
    if (char.id === "player") {
        equipmentSlots.forEach((slot) => {
            var _a, _b;
            if ((_a = char[slot]) === null || _a === void 0 ? void 0 : _a.stats) {
                Object.entries(char[slot].stats).forEach((eff) => {
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
                if ((_b = char[slot]) === null || _b === void 0 ? void 0 : _b.resistances) {
                    if (char[slot].resistances[stat.replace("Resist", '')])
                        val += char[slot].resistances[stat.replace("Resist", '')];
                }
            }
        });
    }
    return { v: val, m: modif };
}
class Character {
    constructor(base) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.id = base.id;
        this.name = (_a = base.name) !== null && _a !== void 0 ? _a : "name_404";
        this.cords = (_b = base.cords) !== null && _b !== void 0 ? _b : { x: 0, y: 0 };
        this.stats = Object.assign({}, base.stats);
        this.resistances = Object.assign({}, base.resistances);
        this.statusResistances = Object.assign({}, base.statusResistances);
        this.statModifiers = (_c = base.statModifiers) !== null && _c !== void 0 ? _c : [];
        this.statusEffects = (_d = base.statusEffects) !== null && _d !== void 0 ? _d : [];
        this.threat = (_e = base.threat) !== null && _e !== void 0 ? _e : 25;
        this.regen = (_f = base.regen) !== null && _f !== void 0 ? _f : { hp: 0, mp: 0 };
        this.hit = (_g = Object.assign({}, base.hit)) !== null && _g !== void 0 ? _g : { chance: 10, evasion: 5 };
        this.getStats = (withConditions = true) => {
            let stats = {};
            baseStats.forEach((stat) => {
                const { v: val, m: mod } = getModifiers(this, stat, withConditions);
                stats[stat] = Math.floor((this.stats[stat] + val) * mod);
                stats[stat] > 100 ? stats[stat] = Math.floor(100 + (stats[stat] - 100) / 17) : "";
            });
            const { v: critAtkVal, m: critAtkMulti } = getModifiers(this, "critDamage", withConditions);
            const { v: critHitVal, m: critHitMulti } = getModifiers(this, "critChance", withConditions);
            stats["critDamage"] = Math.floor(critAtkVal + (critAtkMulti - 1) * 100 + (stats["cun"] * 1.5));
            stats["critChance"] = Math.floor(critHitVal + (critHitMulti - 1) * 100 + (stats["cun"] * 0.4));
            return stats;
        };
        this.getHpMax = (withConditions = true) => {
            var _a, _b;
            let hpMax = 0;
            const { v: hp_val, m: hp_mod } = getModifiers(this, "hpMax", withConditions);
            const { v: vitVal, m: vitMod } = getModifiers(this, "vit", withConditions);
            let vit = Math.floor((this.stats.vit + vitVal) * vitMod);
            hpMax = Math.floor((((_b = (_a = this.stats) === null || _a === void 0 ? void 0 : _a.hpMax) !== null && _b !== void 0 ? _b : 20) + hp_val + vit * 5) * hp_mod);
            return hpMax < 0 ? 0 : hpMax;
        };
        this.getMpMax = (withConditions = true) => {
            var _a, _b;
            let mpMax = 0;
            const { v: mp_val, m: mp_mod } = getModifiers(this, "mpMax", withConditions);
            const { v: intVal, m: intMod } = getModifiers(this, "int", withConditions);
            let int = Math.floor((this.stats.int + intVal) * intMod);
            mpMax = Math.floor((((_b = (_a = this.stats) === null || _a === void 0 ? void 0 : _a.hpMax) !== null && _b !== void 0 ? _b : 10) + mp_val + int * 2) * mp_mod);
            return mpMax < 0 ? 0 : mpMax;
        };
        this.getHitchance = () => {
            var _a, _b;
            const chances = {
                chance: 0,
                evasion: 0
            };
            const { v: hitVal, m: hitMod } = getModifiers(this, "hitChance");
            const { v: evaVal, m: evaMod } = getModifiers(this, "evasion");
            chances["chance"] = Math.floor((((_a = this.hit) === null || _a === void 0 ? void 0 : _a.chance) + hitVal) * hitMod);
            chances["evasion"] = Math.floor((((_b = this.hit) === null || _b === void 0 ? void 0 : _b.evasion) + evaVal) * evaMod);
            return chances;
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
        this.getThreat = () => {
            let threat = 0;
            const { v: val, m: mod } = getModifiers(this, "threat");
            return (this.threat + val) * mod;
        };
        this.getRegen = () => {
            const { v: valHp, m: modHp } = getModifiers(this, "regenHp");
            const { v: valMp, m: modMp } = getModifiers(this, "regenMp");
            let reg = { hp: 0, mp: 0 };
            reg["hp"] = (this.regen["hp"] + this.getHpMax() * 0.0025 + valHp) * modHp;
            reg["mp"] = (this.regen["mp"] + this.getMpMax() * 0.0025 + valMp) * modMp;
            if (reg["hp"] < 0)
                reg["hp"] = 0;
            if (reg["mp"] < 0)
                reg["mp"] = 0;
            return reg;
        };
        this.isRooted = () => {
            let rooted = false;
            this.statusEffects.forEach((eff) => {
                if (eff.rooted) {
                    rooted = true;
                    return;
                }
            });
            return rooted;
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
        this.abilities = (_h = base.abilities) !== null && _h !== void 0 ? _h : [];
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
            return (this.stats.hp / this.getHpMax(false)) * 100;
        };
        this.mpRemain = () => {
            return (this.stats.mp / this.getMpMax(false)) * 100;
        };
        this.updateAbilities = () => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
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
                    // @ts-ignore
                    else if (this.inventory[i].type == "consumable")
                        this.inventory[i] = new Consumable(this.inventory[i]);
                }
            }
            if ((_c = this.weapon) === null || _c === void 0 ? void 0 : _c.type)
                this.weapon = new Weapon(Object.assign({}, this.weapon));
            if ((_d = this.chest) === null || _d === void 0 ? void 0 : _d.type)
                this.chest = new Armor(Object.assign({}, this.chest));
            if ((_e = this.legs) === null || _e === void 0 ? void 0 : _e.type)
                this.legs = new Armor(Object.assign({}, this.legs));
            if ((_f = this.helmet) === null || _f === void 0 ? void 0 : _f.type)
                this.helmet = new Armor(Object.assign({}, this.helmet));
            if ((_g = this.gloves) === null || _g === void 0 ? void 0 : _g.type)
                this.gloves = new Armor(Object.assign({}, this.gloves));
            if ((_h = this.boots) === null || _h === void 0 ? void 0 : _h.type)
                this.boots = new Armor(Object.assign({}, this.boots));
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