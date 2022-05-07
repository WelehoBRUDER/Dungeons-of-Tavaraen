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
        if (key.includes("mp")) {
            if (key.includes("more_than")) {
                if (char.mpRemain() <= val)
                    fulfilled = false;
            }
            else if (key.includes("less_than")) {
                if (char.mpRemain() >= val)
                    fulfilled = false;
            }
        }
    });
    return fulfilled;
}
function effectApply(eff, obj) {
    if (!(obj === null || obj === void 0 ? void 0 : obj[eff[0]])) {
        obj[eff[0]] = eff[1];
        if (eff[0].endsWith("P")) {
            obj[eff[0]] = obj[eff[0]] / 100;
            if (!eff[0].includes("regen") || eff[1] > 0)
                obj[eff[0]]++;
        }
    }
    else if (eff[0].endsWith("P") && eff[1] < 0)
        obj[eff[0]] *= (1 + eff[1] / 100);
    else if (eff[0].endsWith("P"))
        obj[eff[0]] += (eff[1] / 100);
    else if (eff[0].endsWith("V"))
        obj[eff[0]] += eff[1];
}
function getAllModifiersOnce(char, withConditions = true) {
    var _a, _b, _c, _d, _e, _f, _g;
    let obj = {};
    obj["expGainP"] = 1;
    obj["meleeDamageP"] = 1;
    obj["rangedDamageP"] = 1;
    obj["spellDamageP"] = 1;
    obj["movementSpeedV"] = 0;
    obj["attackSpeedV"] = 0;
    char.traits.forEach((mod) => {
        if (!mod.effects)
            return;
        let apply = true;
        if (mod.conditions && withConditions) {
            apply = statConditions(mod.conditions, char);
        }
        if (mod.conditions && !withConditions)
            apply = false;
        if (apply) {
            Object.entries(mod.effects).forEach((eff) => {
                effectApply(eff, obj);
            });
        }
    });
    char.statusEffects.forEach((mod) => {
        Object.entries(mod.effects).forEach((eff) => {
            effectApply(eff, obj);
        });
    });
    if ((_b = (_a = char.classes) === null || _a === void 0 ? void 0 : _a.main) === null || _b === void 0 ? void 0 : _b.statBonuses) {
        Object.entries(char.classes.main.statBonuses).forEach((eff) => {
            effectApply(eff, obj);
        });
    }
    if ((_d = (_c = char.classes) === null || _c === void 0 ? void 0 : _c.sub) === null || _d === void 0 ? void 0 : _d.statBonuses) {
        Object.entries(char.classes.sub.statBonuses).forEach((eff) => {
            effectApply(eff, obj);
        });
    }
    (_e = char.perks) === null || _e === void 0 ? void 0 : _e.forEach((mod) => {
        Object.entries(mod.effects).forEach((eff) => {
            effectApply(eff, obj);
        });
    });
    if ((_f = char.raceEffect) === null || _f === void 0 ? void 0 : _f.modifiers) {
        Object.entries((_g = char.raceEffect) === null || _g === void 0 ? void 0 : _g.modifiers).forEach((eff) => {
            effectApply(eff, obj);
        });
    }
    if (char.id === "player") {
        equipmentSlots.forEach((slot) => {
            var _a;
            if ((_a = char[slot]) === null || _a === void 0 ? void 0 : _a.stats) {
                Object.entries(char[slot].stats).forEach((eff) => {
                    effectApply(eff, obj);
                });
            }
        });
        const artifactEffects = char.getArtifactSetBonuses();
        Object.entries(artifactEffects).forEach((eff) => {
            effectApply(eff, obj);
        });
    }
    return obj;
}
function getModifiers(char, stat, withConditions = true) {
    var _a, _b, _c, _d, _e, _f, _g;
    let val = 0;
    let modif = 1;
    char.traits.forEach((mod) => {
        if (!mod.effects)
            return;
        let apply = true;
        if (mod.conditions && withConditions) {
            apply = statConditions(mod.conditions, char);
        }
        if (mod.conditions && !withConditions)
            apply = false;
        if (apply && mod.effects) {
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
        if (!mod.effects)
            return;
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
            var _a, _b, _c;
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
            if (stat.includes("Def")) {
                if ((_c = char[slot]) === null || _c === void 0 ? void 0 : _c.armor) {
                    if (char[slot].armor[stat.replace("Def", '')])
                        val += char[slot].armor[stat.replace("Def", '')];
                }
            }
        });
        const artifactEffects = char.getArtifactSetBonuses();
        Object.entries(artifactEffects).forEach((eff) => {
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
    return { v: val, m: modif };
}
//# sourceMappingURL=modifier.js.map