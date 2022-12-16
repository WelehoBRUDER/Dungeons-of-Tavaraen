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
function applyModifierToTotal(modifier, total) {
    const key = modifier[0];
    const value = modifier[1];
    if (!(total === null || total === void 0 ? void 0 : total[key])) {
        total[key] = value;
        if (typeof value === "number") {
            if (key.endsWith("P")) {
                total[key] = 1 + total[key] / 100;
            }
        }
    }
    else if (typeof value === "number") {
        if (key.endsWith("P"))
            total[key] += value / 100;
        else if (key.endsWith("V"))
            total[key] += value;
    }
    else {
        total[key] = mergeObjects(total[key], value);
    }
}
// function effectApply(eff: any, obj: any) {
//   if (!obj?.[eff[0]]) {
//     obj[eff[0]] = eff[1];
//     if (eff[0].endsWith("P")) {
//       obj[eff[0]] = obj[eff[0]] / 100;
//       if (!eff[0].includes("regen") || eff[1] > 0) obj[eff[0]]++;
//     }
//   } else if (eff[0].endsWith("P") && eff[1] < 0) obj[eff[0]] *= 1 + eff[1] / 100;
//   else if (eff[0].endsWith("P")) obj[eff[0]] += eff[1] / 100;
//   else if (eff[0].endsWith("V")) obj[eff[0]] += eff[1];
// }
// This function was found here:
// https://stackoverflow.com/a/53509503
const mergeObjects = (obj1, obj2, options) => {
    return Object.entries(obj1).reduce((prev, [key, value]) => {
        if (typeof value === "number") {
            if (options === null || options === void 0 ? void 0 : options.subtract) {
                prev[key] = value - (prev[key] || 0);
                if (!prev[key])
                    prev[key] = value;
            }
            else {
                prev[key] = value + (prev[key] || 0);
            }
        }
        else {
            if (obj2 === undefined)
                obj2 = {};
            prev[key] = mergeObjects(value, obj2[key]);
        }
        return prev;
    }, { ...obj2 }); // spread to avoid mutating obj2
};
const updateObject = (key, object, mods) => {
    return Object.entries(object).map(([_key, value]) => {
        var _a, _b, _c;
        if (typeof value === "number") {
            const bonus = (_b = (_a = mods === null || mods === void 0 ? void 0 : mods[key]) === null || _a === void 0 ? void 0 : _a[_key + "V"]) !== null && _b !== void 0 ? _b : 0;
            const modifier = 1 + (((_c = mods === null || mods === void 0 ? void 0 : mods[key]) === null || _c === void 0 ? void 0 : _c[_key + "P"]) / 100 || 0);
            return +(((value || 0) + bonus) * modifier).toFixed(2);
        }
        else if (typeof value === "object") {
            return updateObject(_key, value, mods === null || mods === void 0 ? void 0 : mods[key]);
        }
    });
};
const updateObjectWithoutReturn = (key, object, mods) => {
    return Object.entries(object).map(([_key, value]) => {
        var _a, _b, _c;
        if (typeof value === "number") {
            const bonus = (_b = (_a = mods === null || mods === void 0 ? void 0 : mods[key]) === null || _a === void 0 ? void 0 : _a[_key + "V"]) !== null && _b !== void 0 ? _b : 0;
            const modifier = 1 + (((_c = mods === null || mods === void 0 ? void 0 : mods[key]) === null || _c === void 0 ? void 0 : _c[_key + "P"]) / 100 || 0);
            object[_key] + (((value || 0) + bonus) * modifier).toFixed(2);
        }
        else if (typeof value === "object") {
            return updateObject(_key, value, mods === null || mods === void 0 ? void 0 : mods[key]);
        }
    });
};
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
                applyModifierToTotal(eff, obj);
            });
        }
    });
    char.statusEffects.forEach((mod) => {
        Object.entries(mod.effects).forEach((eff) => {
            applyModifierToTotal(eff, obj);
        });
    });
    if ((_b = (_a = char.classes) === null || _a === void 0 ? void 0 : _a.main) === null || _b === void 0 ? void 0 : _b.statBonuses) {
        Object.entries(char.classes.main.statBonuses).forEach((eff) => {
            applyModifierToTotal(eff, obj);
        });
    }
    if ((_d = (_c = char.classes) === null || _c === void 0 ? void 0 : _c.sub) === null || _d === void 0 ? void 0 : _d.statBonuses) {
        Object.entries(char.classes.sub.statBonuses).forEach((eff) => {
            applyModifierToTotal(eff, obj);
        });
    }
    (_e = char.perks) === null || _e === void 0 ? void 0 : _e.forEach((mod) => {
        Object.entries(mod.effects).forEach((eff) => {
            applyModifierToTotal(eff, obj);
        });
    });
    if ((_f = char.raceEffect) === null || _f === void 0 ? void 0 : _f.modifiers) {
        Object.entries((_g = char.raceEffect) === null || _g === void 0 ? void 0 : _g.modifiers).forEach((eff) => {
            applyModifierToTotal(eff, obj);
        });
    }
    if (char.id === "player") {
        equipmentSlots.forEach((slot) => {
            var _a;
            if ((_a = char[slot]) === null || _a === void 0 ? void 0 : _a.stats) {
                Object.entries(char[slot].stats).forEach((eff) => {
                    applyModifierToTotal(eff, obj);
                });
            }
        });
        const artifactEffects = char.getArtifactSetBonuses();
        Object.entries(artifactEffects).forEach((eff) => {
            applyModifierToTotal(eff, obj);
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
                        modif *= 1 + eff[1] / 100;
                    else if (eff[0] == stat + "P")
                        modif += eff[1] / 100;
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
                    modif *= 1 + eff[1] / 100;
                else if (eff[0] == stat + "P")
                    modif += eff[1] / 100;
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    });
    if ((_b = (_a = char.classes) === null || _a === void 0 ? void 0 : _a.main) === null || _b === void 0 ? void 0 : _b.statBonuses) {
        Object.entries(char.classes.main.statBonuses).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P" && eff[1] < 0)
                    modif *= 1 + eff[1] / 100;
                else if (eff[0] == stat + "P")
                    modif += eff[1] / 100;
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    }
    if ((_d = (_c = char.classes) === null || _c === void 0 ? void 0 : _c.sub) === null || _d === void 0 ? void 0 : _d.statBonuses) {
        Object.entries(char.classes.sub.statBonuses).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P" && eff[1] < 0)
                    modif *= 1 + eff[1] / 100;
                else if (eff[0] == stat + "P")
                    modif += eff[1] / 100;
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    }
    (_e = char.perks) === null || _e === void 0 ? void 0 : _e.forEach((mod) => {
        Object.entries(mod.effects).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P" && eff[1] < 0)
                    modif *= 1 + eff[1] / 100;
                else if (eff[0] == stat + "P")
                    modif += eff[1] / 100;
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    });
    if ((_f = char.raceEffect) === null || _f === void 0 ? void 0 : _f.modifiers) {
        Object.entries((_g = char.raceEffect) === null || _g === void 0 ? void 0 : _g.modifiers).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P" && eff[1] < 0)
                    modif *= 1 + eff[1] / 100;
                else if (eff[0] == stat + "P")
                    modif += eff[1] / 100;
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
                            modif *= 1 + eff[1] / 100;
                        else if (eff[0] == stat + "P")
                            modif += eff[1] / 100;
                        else if (eff[0] == stat + "V")
                            val += eff[1];
                    }
                });
            }
            if (stat.includes("Resist")) {
                if ((_b = char[slot]) === null || _b === void 0 ? void 0 : _b.resistances) {
                    if (char[slot].resistances[stat.replace("Resist", "")])
                        val += char[slot].resistances[stat.replace("Resist", "")];
                }
            }
            if (stat.includes("Def")) {
                if ((_c = char[slot]) === null || _c === void 0 ? void 0 : _c.armor) {
                    if (char[slot].armor[stat.replace("Def", "")])
                        val += char[slot].armor[stat.replace("Def", "")];
                }
            }
        });
        const artifactEffects = char.getArtifactSetBonuses();
        Object.entries(artifactEffects).forEach((eff) => {
            if (eff[0].startsWith(stat)) {
                if (eff[0] == stat + "P" && eff[1] < 0)
                    modif *= 1 + eff[1] / 100;
                else if (eff[0] == stat + "P")
                    modif += eff[1] / 100;
                else if (eff[0] == stat + "V")
                    val += eff[1];
            }
        });
    }
    return { v: val, m: modif };
}
//# sourceMappingURL=modifier.js.map