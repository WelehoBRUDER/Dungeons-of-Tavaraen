function statConditions(conditions: any, char: characterObject) {
  let fulfilled = true;
  Object.entries(conditions).forEach((condition: any) => {
    const key = condition[0];
    const val = condition[1];
    if (key.includes("hp")) {
      if (key.includes("more_than")) {
        if (char.hpRemain() <= val) fulfilled = false;
      }
      else if (key.includes("less_than")) {
        if (char.hpRemain() >= val) fulfilled = false;
      }
    }
    if (key.includes("mp")) {
      if (key.includes("more_than")) {
        if (char.mpRemain() <= val) fulfilled = false;
      }
      else if (key.includes("less_than")) {
        if (char.mpRemain() >= val) fulfilled = false;
      }
    }
  });
  return fulfilled;
}

function effectApply(eff: any, obj: any) {
  if (!obj?.[eff[0]]) {
    obj[eff[0]] = eff[1];
    if (eff[0].endsWith("P")) {
      obj[eff[0]] = obj[eff[0]] / 100;
      if (!eff[0].includes("regen") || eff[1] > 0) obj[eff[0]]++;
    }
  }
  else if (eff[0].endsWith("P") && eff[1] < 0) obj[eff[0]] *= (1 + eff[1] / 100);
  else if (eff[0].endsWith("P")) obj[eff[0]] += (eff[1] / 100);
  else if (eff[0].endsWith("V")) obj[eff[0]] += eff[1];
}

function getAllModifiersOnce(char: any, withConditions = true) {
  let obj = {} as any;
  obj["expGainP"] = 1;
  obj["meleeDamageP"] = 1;
  obj["rangedDamageP"] = 1;
  obj["spellDamageP"] = 1;
  obj["movementSpeedV"] = 0;
  obj["attackSpeedV"] = 0;
  char.traits.forEach((mod: any) => {
    if (!mod.effects) return;
    let apply = true;
    if (mod.conditions && withConditions) {
      apply = statConditions(mod.conditions, char);
    }
    if (mod.conditions && !withConditions) apply = false;
    if (apply) {
      Object.entries(mod.effects).forEach((eff: any) => {
        effectApply(eff, obj);
      });
    }
  });
  char.statusEffects.forEach((mod: any) => {
    Object.entries(mod.effects).forEach((eff: any) => {
      effectApply(eff, obj);
    });
  });
  if (char.classes?.main?.statBonuses) {
    Object.entries(char.classes.main.statBonuses).forEach((eff: any) => {
      effectApply(eff, obj);
    });
  }
  if (char.classes?.sub?.statBonuses) {
    Object.entries(char.classes.sub.statBonuses).forEach((eff: any) => {
      effectApply(eff, obj);
    });
  }
  char.perks?.forEach((mod: any) => {
    Object.entries(mod.effects).forEach((eff: any) => {
      effectApply(eff, obj);
    });
  });
  if (char.raceEffect?.modifiers) {
    Object.entries(char.raceEffect?.modifiers).forEach((eff: any) => {
      effectApply(eff, obj);
    });
  }
  if (char.id === "player") {
    equipmentSlots.forEach((slot: string) => {
      if (char[slot]?.stats) {
        Object.entries(char[slot].stats).forEach((eff: any) => {
          effectApply(eff, obj);
        });
      }
    });
    const artifactEffects = char.getArtifactSetBonuses();
    Object.entries(artifactEffects).forEach((eff: any) => {
      effectApply(eff, obj);
    });
  }
  return obj;
}

function getModifiers(char: any, stat: string, withConditions = true) {
  let val = 0;
  let modif = 1;
  char.traits.forEach((mod: any) => {
    if (!mod.effects) return;
    let apply = true;
    if (mod.conditions && withConditions) {
      apply = statConditions(mod.conditions, char);
    }
    if (mod.conditions && !withConditions) apply = false;
    if (apply && mod.effects) {
      Object.entries(mod.effects).forEach((eff: any) => {
        if (eff[0].startsWith(stat)) {
          if (eff[0] == stat + "P" && eff[1] < 0) modif *= (1 + eff[1] / 100);
          else if (eff[0] == stat + "P") modif += (eff[1] / 100);
          else if (eff[0] == stat + "V") val += eff[1];
        }
      });
    }
  });
  char.statusEffects.forEach((mod: any) => {
    if (!mod.effects) return;
    Object.entries(mod.effects).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P" && eff[1] < 0) modif *= (1 + eff[1] / 100);
        else if (eff[0] == stat + "P") modif += (eff[1] / 100);
        else if (eff[0] == stat + "V") val += eff[1];
      }
    });
  });
  if (char.classes?.main?.statBonuses) {
    Object.entries(char.classes.main.statBonuses).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P" && eff[1] < 0) modif *= (1 + eff[1] / 100);
        else if (eff[0] == stat + "P") modif += (eff[1] / 100);
        else if (eff[0] == stat + "V") val += eff[1];
      }
    });
  }
  if (char.classes?.sub?.statBonuses) {
    Object.entries(char.classes.sub.statBonuses).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P" && eff[1] < 0) modif *= (1 + eff[1] / 100);
        else if (eff[0] == stat + "P") modif += (eff[1] / 100);
        else if (eff[0] == stat + "V") val += eff[1];
      }
    });
  }
  char.perks?.forEach((mod: any) => {
    Object.entries(mod.effects).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P" && eff[1] < 0) modif *= (1 + eff[1] / 100);
        else if (eff[0] == stat + "P") modif += (eff[1] / 100);
        else if (eff[0] == stat + "V") val += eff[1];
      }
    });
  });
  if (char.raceEffect?.modifiers) {
    Object.entries(char.raceEffect?.modifiers).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P" && eff[1] < 0) modif *= (1 + eff[1] / 100);
        else if (eff[0] == stat + "P") modif += (eff[1] / 100);
        else if (eff[0] == stat + "V") val += eff[1];
      }
    });
  }
  if (char.id === "player") {
    equipmentSlots.forEach((slot: string) => {
      if (char[slot]?.stats) {
        Object.entries(char[slot].stats).forEach((eff: any) => {
          if (eff[0].startsWith(stat)) {
            if (eff[0] == stat + "P" && eff[1] < 0) modif *= (1 + eff[1] / 100);
            else if (eff[0] == stat + "P") modif += (eff[1] / 100);
            else if (eff[0] == stat + "V") val += eff[1];
          }
        });
      }
      if (stat.includes("Resist")) {
        if (char[slot]?.resistances) {
          if (char[slot].resistances[stat.replace("Resist", '')]) val += char[slot].resistances[stat.replace("Resist", '')];
        }
      }
      if (stat.includes("Def")) {
        if (char[slot]?.armor) {
          if (char[slot].armor[stat.replace("Def", '')]) val += char[slot].armor[stat.replace("Def", '')];
        }
      }
    });
    const artifactEffects = char.getArtifactSetBonuses();
    Object.entries(artifactEffects).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P" && eff[1] < 0) modif *= (1 + eff[1] / 100);
        else if (eff[0] == stat + "P") modif += (eff[1] / 100);
        else if (eff[0] == stat + "V") val += eff[1];
      }
    });
  }
  return { v: val, m: modif };
}