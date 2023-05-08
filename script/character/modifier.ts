function statConditions(conditions: any, char: characterObject) {
  let fulfilled = true;
  Object.entries(conditions).forEach((condition: any) => {
    const key = condition[0];
    const val = condition[1];
    if (key.includes("hp")) {
      if (key.includes("more_than")) {
        if (char.hpRemain() <= val) fulfilled = false;
      } else if (key.includes("less_than")) {
        if (char.hpRemain() >= val) fulfilled = false;
      }
    }
    if (key.includes("mp")) {
      if (key.includes("more_than")) {
        if (char.mpRemain() <= val) fulfilled = false;
      } else if (key.includes("less_than")) {
        if (char.mpRemain() >= val) fulfilled = false;
      }
    }
  });
  return fulfilled;
}

function applyModifierToTotal(modifier: any, total: any) {
  const key = modifier[0];
  const value = modifier[1];
  if (total?.[key] === undefined) {
    total[key] = value;
    if (typeof value === "number") {
      if (key.endsWith("P")) {
        total[key] = 1 + total[key] / 100;
      }
    }
  } else if (typeof value === "number") {
    if (key.endsWith("P")) total[key] += value / 100;
    else if (key.endsWith("V")) total[key] += value;
  } else {
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
const mergeObjects = (obj1: any, obj2: any, options?: { subtract?: boolean }) => {
  return Object.entries(obj1).reduce(
    (prev, [key, value]) => {
      if (typeof value === "number") {
        if (options?.subtract) {
          prev[key] = value - (prev[key] || 0);
          if (!prev[key]) prev[key] = value;
        } else {
          prev[key] = value + (prev[key] || 0);
        }
      } else {
        if (obj2 === undefined) obj2 = {};
        prev[key] = mergeObjects(value, obj2[key]);
      }
      return prev;
    },
    { ...obj2 }
  ); // spread to avoid mutating obj2
};

const updateObject = (key: string, object: any, mods: any): object => {
  return Object.entries(object).map(([_key, value]) => {
    if (typeof value === "number") {
      const bonus = mods?.[key]?.[_key + "V"] ?? 0;
      const modifier = 1 + (mods?.[key]?.[_key + "P"] / 100 || 0);
      return +(((value || 0) + bonus) * modifier).toFixed(2);
    } else if (typeof value === "object") {
      return updateObject(_key, value, mods?.[key]);
    }
  });
};

const updateObjectWithoutReturn = (key: string, object: any, mods: any) => {
  return Object.entries(object).map(([_key, value]) => {
    if (typeof value === "number") {
      const bonus = mods?.[key]?.[_key + "V"] ?? 0;
      const modifier = 1 + (mods?.[key]?.[_key + "P"] / 100 || 0);
      object[_key] + (((value || 0) + bonus) * modifier).toFixed(2);
    } else if (typeof value === "object") {
      return updateObject(_key, value, mods?.[key]);
    }
  });
};

function getAllModifiersOnce(char: any, withConditions = true) {
  const obj: any = {
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
  };
  char.traits.forEach((mod: any) => {
    if (!mod.effects) return;
    let apply = true;
    if (mod.conditions && withConditions) {
      apply = statConditions(mod.conditions, char);
    }
    if (mod.conditions && !withConditions) apply = false;
    if (apply) {
      Object.entries(mod.effects).forEach((eff: any) => {
        applyModifierToTotal(eff, obj);
      });
    }
  });
  char.statusEffects.forEach((mod: any) => {
    Object.entries(mod.effects).forEach((eff: any) => {
      applyModifierToTotal(eff, obj);
    });
  });
  if (char.classes?.main?.statBonuses) {
    Object.entries(char.classes.main.statBonuses).forEach((eff: any) => {
      applyModifierToTotal(eff, obj);
    });
  }
  if (char.classes?.sub?.statBonuses) {
    Object.entries(char.classes.sub.statBonuses).forEach((eff: any) => {
      applyModifierToTotal(eff, obj);
    });
  }
  char.perks?.forEach((mod: any) => {
    Object.entries(mod.effects).forEach((eff: any) => {
      applyModifierToTotal(eff, obj);
    });
  });
  if (char.raceEffect?.modifiers) {
    Object.entries(char.raceEffect?.modifiers).forEach((eff: any) => {
      applyModifierToTotal(eff, obj);
    });
  }
  if (char.id === "player") {
    equipmentSlots.forEach((slot: string) => {
      if (char[slot]?.stats) {
        Object.entries(char[slot].stats).forEach((eff: any) => {
          applyModifierToTotal(eff, obj);
        });
      }
    });
    const artifactEffects = char.getArtifactSetBonuses();
    Object.entries(artifactEffects).forEach((eff: any) => {
      applyModifierToTotal(eff, obj);
    });
  }
  return obj;
}

// function getModifiers(char: any, stat: string, withConditions = true) {
//   let val = 0;
//   let modif = 1;
//   char.traits.forEach((mod: any) => {
//     if (!mod.effects) return;
//     let apply = true;
//     if (mod.conditions && withConditions) {
//       apply = statConditions(mod.conditions, char);
//     }
//     if (mod.conditions && !withConditions) apply = false;
//     if (apply && mod.effects) {
//       Object.entries(mod.effects).forEach((eff: any) => {
//         if (eff[0].startsWith(stat)) {
//           if (eff[0] == stat + "P" && eff[1] < 0) modif *= 1 + eff[1] / 100;
//           else if (eff[0] == stat + "P") modif += eff[1] / 100;
//           else if (eff[0] == stat + "V") val += eff[1];
//         }
//       });
//     }
//   });
//   char.statusEffects.forEach((mod: any) => {
//     if (!mod.effects) return;
//     Object.entries(mod.effects).forEach((eff: any) => {
//       if (eff[0].startsWith(stat)) {
//         if (eff[0] == stat + "P" && eff[1] < 0) modif *= 1 + eff[1] / 100;
//         else if (eff[0] == stat + "P") modif += eff[1] / 100;
//         else if (eff[0] == stat + "V") val += eff[1];
//       }
//     });
//   });
//   if (char.classes?.main?.statBonuses) {
//     Object.entries(char.classes.main.statBonuses).forEach((eff: any) => {
//       if (eff[0].startsWith(stat)) {
//         if (eff[0] == stat + "P" && eff[1] < 0) modif *= 1 + eff[1] / 100;
//         else if (eff[0] == stat + "P") modif += eff[1] / 100;
//         else if (eff[0] == stat + "V") val += eff[1];
//       }
//     });
//   }
//   if (char.classes?.sub?.statBonuses) {
//     Object.entries(char.classes.sub.statBonuses).forEach((eff: any) => {
//       if (eff[0].startsWith(stat)) {
//         if (eff[0] == stat + "P" && eff[1] < 0) modif *= 1 + eff[1] / 100;
//         else if (eff[0] == stat + "P") modif += eff[1] / 100;
//         else if (eff[0] == stat + "V") val += eff[1];
//       }
//     });
//   }
//   char.perks?.forEach((mod: any) => {
//     Object.entries(mod.effects).forEach((eff: any) => {
//       if (eff[0].startsWith(stat)) {
//         if (eff[0] == stat + "P" && eff[1] < 0) modif *= 1 + eff[1] / 100;
//         else if (eff[0] == stat + "P") modif += eff[1] / 100;
//         else if (eff[0] == stat + "V") val += eff[1];
//       }
//     });
//   });
//   if (char.raceEffect?.modifiers) {
//     Object.entries(char.raceEffect?.modifiers).forEach((eff: any) => {
//       if (eff[0].startsWith(stat)) {
//         if (eff[0] == stat + "P" && eff[1] < 0) modif *= 1 + eff[1] / 100;
//         else if (eff[0] == stat + "P") modif += eff[1] / 100;
//         else if (eff[0] == stat + "V") val += eff[1];
//       }
//     });
//   }
//   if (char.id === "player") {
//     equipmentSlots.forEach((slot: string) => {
//       if (char[slot]?.stats) {
//         Object.entries(char[slot].stats).forEach((eff: any) => {
//           if (eff[0].startsWith(stat)) {
//             if (eff[0] == stat + "P" && eff[1] < 0) modif *= 1 + eff[1] / 100;
//             else if (eff[0] == stat + "P") modif += eff[1] / 100;
//             else if (eff[0] == stat + "V") val += eff[1];
//           }
//         });
//       }
//       if (stat.includes("Resist")) {
//         if (char[slot]?.resistances) {
//           if (char[slot].resistances[stat.replace("Resist", "")]) val += char[slot].resistances[stat.replace("Resist", "")];
//         }
//       }
//       if (stat.includes("Def")) {
//         if (char[slot]?.armor) {
//           if (char[slot].armor[stat.replace("Def", "")]) val += char[slot].armor[stat.replace("Def", "")];
//         }
//       }
//     });
//     const artifactEffects = char.getArtifactSetBonuses();
//     Object.entries(artifactEffects).forEach((eff: any) => {
//       if (eff[0].startsWith(stat)) {
//         if (eff[0] == stat + "P" && eff[1] < 0) modif *= 1 + eff[1] / 100;
//         else if (eff[0] == stat + "P") modif += eff[1] / 100;
//         else if (eff[0] == stat + "V") val += eff[1];
//       }
//     });
//   }
//   return { v: val, m: modif };
// }
