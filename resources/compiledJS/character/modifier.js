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
    if (total?.[key] === undefined) {
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
// This function was found here:
// https://stackoverflow.com/a/53509503
const mergeObjects = (obj1, obj2, options) => {
    return Object.entries(obj1).reduce((prev, [key, value]) => {
        if (typeof value === "number") {
            if (options?.subtract) {
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
        if (typeof value === "number") {
            const bonus = mods?.[key]?.[_key + "V"] ?? 0;
            const modifier = 1 + (mods?.[key]?.[_key + "P"] / 100 || 0);
            return +(((value || 0) + bonus) * modifier).toFixed(2);
        }
        else if (typeof value === "object") {
            return updateObject(_key, value, mods?.[key]);
        }
    });
};
const updateObjectWithoutReturn = (key, object, mods) => {
    return Object.entries(object).map(([_key, value]) => {
        if (typeof value === "number") {
            const bonus = mods?.[key]?.[_key + "V"] ?? 0;
            const modifier = 1 + (mods?.[key]?.[_key + "P"] / 100 || 0);
            object[_key] + (((value || 0) + bonus) * modifier).toFixed(2);
        }
        else if (typeof value === "object") {
            return updateObject(_key, value, mods?.[key]);
        }
    });
};
function getAllModifiersOnce(char, withConditions = true) {
    const obj = {
        hpMaxV: 0,
        hpMaxP: 1,
        mpMaxV: 0,
        mpMaxP: 1,
        hpRegenV: 0,
        hpRegenP: 0,
        mpRegenV: 0,
        mpRegenP: 0,
        expGainP: 1,
        meleeDamageP: 1,
        rangedDamageP: 1,
        spellDamageP: 1,
        movementSpeedV: 0,
        attackSpeedV: 0,
        critChanceV: 0,
        critDamageV: 0,
        physicalArmorV: 0,
        physicalArmorP: 0,
        magicalArmorV: 0,
        magicalArmorP: 0,
        elementalArmorV: 0,
        elementalArmorP: 0,
        slashResistV: 0,
        crushResistV: 0,
        pierceResistV: 0,
        magicResistV: 0,
        darkResistV: 0,
        divineResistV: 0,
        fireResistV: 0,
        lightningResistV: 0,
        iceResistV: 0,
    };
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
    if (char.classes) {
        let hpMaxPerLevelV = 0;
        char.classes.forEach((cls) => {
            if (cls.statBonuses) {
                Object.entries(cls.statBonuses).forEach((eff) => {
                    if (eff[0] === "hpMaxPerLevelV")
                        hpMaxPerLevelV += eff[1];
                    else
                        applyModifierToTotal(eff, obj);
                });
            }
            Object.entries(cls.getLevelBonuses()).forEach((eff) => {
                applyModifierToTotal(eff, obj);
            });
        });
        obj.hpMaxPerLevelV = Math.floor(hpMaxPerLevelV / char.classes.length);
    }
    char.perks?.forEach((mod) => {
        //console.log(mod);
        //console.log(typeof mod);
        console.log("GETTING EFFECTS");
        const effects = mod.getEffects();
        Object.entries(effects).forEach((eff) => {
            applyModifierToTotal(eff, obj);
        });
    });
    if (char.raceEffect?.modifiers) {
        Object.entries(char.raceEffect?.modifiers).forEach((eff) => {
            if (eff[0] === "hpMaxPerLevelV")
                eff[1] = eff[1] * char.level.level;
            applyModifierToTotal(eff, obj);
        });
    }
    if (char.id === "player") {
        equipmentSlots.forEach((slot) => {
            if (char[slot]?.armor) {
                Object.entries(char[slot].armor).forEach((armor) => {
                    const eff = [armor[0] + "ArmorV", armor[1]];
                    applyModifierToTotal(eff, obj);
                });
            }
            if (char[slot]?.resistances) {
                Object.entries(char[slot].resistances).forEach((res) => {
                    const eff = [res[0] + "ResistV", res[1]];
                    applyModifierToTotal(eff, obj);
                });
            }
            if (char[slot]?.stats) {
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
//# sourceMappingURL=modifier.js.map