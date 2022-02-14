interface stats {
  [str: string]: number;
  dex: number;
  int: number;
  vit: number;
  hp: number;
  mp: number;
  hpMax?: number | any;
  mpMax?: number | any;
}

interface resistances {
  [slash: string]: number;
  crush: number;
  pierce: number;
  magic: number;
  dark: number;
  divine: number;
  fire: number;
  lightning: number;
  ice: number;
}

interface statusResistances {
  [poison: string]: number;
  burning: number;
  curse: number;
  stun: number;
  bleed: number;
}

interface characterObject {
  [id: string]: string | any;
  name: string;
  cords: tileObject;
  stats: stats;
  resistances: resistances;
  statusResistances: statusResistances;
  abilities: ability[];
  weapon?: weaponClass | any;
  offhand?: any;
  chest?: armorClass | any;
  helmet?: armorClass | any;
  gloves?: armorClass | any;
  boots?: armorClass | any;
  legs?: armorClass | any;
  artifact1?: any;
  artifact2?: any;
  artifact3?: any;
  isFoe?: boolean;
  kill?: Function;
  xp?: number;
  regen?: any;
  hit?: any;
  threat: number;
  statModifiers?: any;
  statusEffects?: any;
  getStats?: Function;
  getResists?: Function;
  getArmor?: Function;
  getStatusResists?: Function;
  effects?: Function;
  updateAbilities?: Function;
  aura?: string;
  silenced?: Function;
  concentration?: Function;
  hpRemain?: Function;
  mpRemain?: Function;
  perks?: any;
  unarmedDamages?: any;
  fistDmg?: Function;
  getThreat?: Function;
  getHpMax?: Function;
  getMpMax?: Function;
  getRegen?: Function;
  getHitchance?: Function;
  isRooted?: Function;
  inventory?: any;
}

interface statusObject {
  [hpMax: string]: number;
  mpMax: number;
  str: number;
  dex: number;
  int: number;
  vit: number;
  cun: number;
}

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

function getAllModifiersOnce(char: any, withConditions = true) {
  let obj = {} as any;
  obj["expGainP"] = 1;
  obj["meleeDamageP"] = 1;
  obj["rangedDamageP"] = 1;
  obj["spellDamageP"] = 1;
  char.statModifiers.forEach((mod: any) => {
    let apply = true;
    if (mod.conditions && withConditions) {
      apply = statConditions(mod.conditions, char);
    }
    if (mod.conditions && !withConditions) apply = false;
    if (apply) {
      Object.entries(mod.effects).forEach((eff: any) => {
        if (!obj?.[eff[0]]) {
          obj[eff[0]] = eff[1];
          if (eff[0].endsWith("P")) {
            obj[eff[0]] = obj[eff[0]] / 100;
            obj[eff[0]]++;
          }
        }
        else if (eff[0].endsWith("P") && eff[1] < 0) obj[eff[0]] *= (1 + eff[1] / 100);
        else if (eff[0].endsWith("P")) obj[eff[0]] += (eff[1] / 100);
        else if (eff[0].endsWith("V")) obj[eff[0]] += eff[1];
      });
    }
  });
  char.statusEffects.forEach((mod: any) => {
    Object.entries(mod.effects).forEach((eff: any) => {
      if (!obj?.[eff[0]]) {
        obj[eff[0]] = eff[1];
        if (eff[0].endsWith("P")) {
          obj[eff[0]] = obj[eff[0]] / 100;
          obj[eff[0]]++;
        }
      }
      else if (eff[0].endsWith("P") && eff[1] < 0) obj[eff[0]] *= (1 + eff[1] / 100);
      else if (eff[0].endsWith("P")) obj[eff[0]] += (eff[1] / 100);
      else if (eff[0].endsWith("V")) obj[eff[0]] += eff[1];
    });
  });
  if (char.classes?.main?.statBonuses) {
    Object.entries(char.classes.main.statBonuses).forEach((eff: any) => {
      if (!obj?.[eff[0]]) {
        obj[eff[0]] = eff[1];
        if (eff[0].endsWith("P")) {
          obj[eff[0]] = obj[eff[0]] / 100;
          obj[eff[0]]++;
        }
      }
      else if (eff[0].endsWith("P") && eff[1] < 0) obj[eff[0]] *= (1 + eff[1] / 100);
      else if (eff[0].endsWith("P")) obj[eff[0]] += (eff[1] / 100);
      else if (eff[0].endsWith("V")) obj[eff[0]] += eff[1];
    });
  }
  if (char.classes?.sub?.statBonuses) {
    Object.entries(char.classes.sub.statBonuses).forEach((eff: any) => {
      if (!obj?.[eff[0]]) {
        obj[eff[0]] = eff[1];
        if (eff[0].endsWith("P")) {
          obj[eff[0]] = obj[eff[0]] / 100;
          obj[eff[0]]++;
        }
      }
      else if (eff[0].endsWith("P") && eff[1] < 0) obj[eff[0]] *= (1 + eff[1] / 100);
      else if (eff[0].endsWith("P")) obj[eff[0]] += (eff[1] / 100);
      else if (eff[0].endsWith("V")) obj[eff[0]] += eff[1];
    });
  }
  char.perks?.forEach((mod: any) => {
    Object.entries(mod.effects).forEach((eff: any) => {
      if (!obj?.[eff[0]]) {
        obj[eff[0]] = eff[1];
        if (eff[0].endsWith("P")) {
          obj[eff[0]] = obj[eff[0]] / 100;
          obj[eff[0]]++;
        }
      }
      else if (eff[0].endsWith("P") && eff[1] < 0) obj[eff[0]] *= (1 + eff[1] / 100);
      else if (eff[0].endsWith("P")) obj[eff[0]] += (eff[1] / 100);
      else if (eff[0].endsWith("V")) obj[eff[0]] += eff[1];
    });
    if (mod.statModifiers) {
      mod.statModifiers.forEach((_mod: any) => {
        let apply = true;
        if (_mod.conditions && withConditions) {
          apply = statConditions(_mod.conditions, char);
        }
        if (_mod.conditions && !withConditions) apply = false;
        if (apply) {
          Object.entries(_mod.effects).forEach((eff: any) => {
            if (!obj?.[eff[0]]) {
              obj[eff[0]] = eff[1];
              if (eff[0].endsWith("P")) {
                obj[eff[0]] = obj[eff[0]] / 100;
                obj[eff[0]]++;
              }
            }
            else if (eff[0].endsWith("P") && eff[1] < 0) obj[eff[0]] *= (1 + eff[1] / 100);
            else if (eff[0].endsWith("P")) obj[eff[0]] += (eff[1] / 100);
            else if (eff[0].endsWith("V")) obj[eff[0]] += eff[1];
          });
        }
      });
    }
  });
  if (char.raceEffect?.modifiers) {
    Object.entries(char.raceEffect?.modifiers).forEach((eff: any) => {
      if (!obj?.[eff[0]]) {
        obj[eff[0]] = eff[1];
        if (eff[0].endsWith("P")) {
          obj[eff[0]] = obj[eff[0]] / 100;
          obj[eff[0]]++;
        }
      }
      else if (eff[0].endsWith("P") && eff[1] < 0) obj[eff[0]] *= (1 + eff[1] / 100);
      else if (eff[0].endsWith("P")) obj[eff[0]] += (eff[1] / 100);
      else if (eff[0].endsWith("V")) obj[eff[0]] += eff[1];
    });
  }
  if (char.id === "player") {
    equipmentSlots.forEach((slot: string) => {
      if (char[slot]?.stats) {
        Object.entries(char[slot].stats).forEach((eff: any) => {
          if (!obj?.[eff[0]]) {
            obj[eff[0]] = eff[1];
            if (eff[0].endsWith("P")) {
              obj[eff[0]] = obj[eff[0]] / 100;
              obj[eff[0]]++;
            }
          }
          else if (eff[0].endsWith("P") && eff[1] < 0) obj[eff[0]] *= (1 + eff[1] / 100);
          else if (eff[0].endsWith("P")) obj[eff[0]] += (eff[1] / 100);
          else if (eff[0].endsWith("V")) obj[eff[0]] += eff[1];
        });
      }
      // if (stat.includes("Resist")) {
      //   if (char[slot]?.resistances) {
      //     if (char[slot].resistances[stat.replace("Resist", '')]) val += char[slot].resistances[stat.replace("Resist", '')];
      //   }
      // }
    });
    const artifactEffects = char.getArtifactSetBonuses();
    Object.entries(artifactEffects).forEach((eff: any) => {
      if (!obj?.[eff[0]]) {
        obj[eff[0]] = eff[1];
        if (eff[0].endsWith("P")) {
          obj[eff[0]] = obj[eff[0]] / 100;
          obj[eff[0]]++;
        }
      }
      else if (eff[0].endsWith("P") && eff[1] < 0) obj[eff[0]] *= (1 + eff[1] / 100);
      else if (eff[0].endsWith("P")) obj[eff[0]] += (eff[1] / 100);
      else if (eff[0].endsWith("V")) obj[eff[0]] += eff[1];
    });
  }
  return obj;
}

function getModifiers(char: any, stat: string, withConditions = true) {
  let val = 0;
  let modif = 1;
  char.statModifiers.forEach((mod: any) => {
    let apply = true;
    if (mod.conditions && withConditions) {
      apply = statConditions(mod.conditions, char);
    }
    if (mod.conditions && !withConditions) apply = false;
    if (apply) {
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
    if (mod.statModifiers) {
      mod.statModifiers.forEach((_mod: any) => {
        let apply = true;
        if (_mod.conditions && withConditions) {
          apply = statConditions(_mod.conditions, char);
        }
        if (_mod.conditions && !withConditions) apply = false;
        if (apply) {
          Object.entries(_mod.effects).forEach((eff: any) => {
            if (eff[0].startsWith(stat)) {
              if (eff[0] == stat + "P" && eff[1] < 0) modif *= (1 + eff[1] / 100);
              else if (eff[0] == stat + "P") modif += (eff[1] / 100);
              else if (eff[0] == stat + "V") val += eff[1];
            }
          });
        }
      });
    }
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

class Character {
  id: string;
  name: string;
  cords: tileObject;
  stats: stats;
  armor: defenseClass;
  resistances: resistances;
  statusResistances: statusResistances;
  abilities: ability[];
  weapon?: weaponClass | any;
  offhand?: any;
  chest?: armorClass | any;
  helmet?: armorClass | any;
  gloves?: armorClass | any;
  boots?: armorClass | any;
  legs?: armorClass | any;
  artifact1?: any;
  artifact2?: any;
  artifact3?: any;
  isFoe?: boolean;
  kill?: Function;
  xp?: number;
  threat: number;
  statModifiers?: any;
  statusEffects?: any;
  getStats?: Function;
  getResists?: Function;
  getArmor?: Function;
  getStatusResists?: Function;
  effects?: Function;
  updateAbilities?: Function;
  aura?: string;
  regen?: any;
  hit?: any;
  silenced?: Function;
  concentration?: Function;
  statRemaining?: Function;
  hpRemain?: Function;
  mpRemain?: Function;
  getThreat?: Function;
  getHpMax?: Function;
  getMpMax?: Function;
  getRegen?: Function;
  getHitchance?: Function;
  isRooted?: Function;
  scale?: number;
  allModifiers?: any;
  inventory?: any;
  constructor(base: characterObject) {
    this.id = base.id;
    this.name = base.name ?? "name_404";
    this.cords = base.cords ?? { x: 0, y: 0 };
    this.stats = { ...base.stats };
    this.armor = { ...base.armor } ?? { physical: 0, magical: 0, elemental: 0 };
    this.resistances = { ...base.resistances };
    this.statusResistances = { ...base.statusResistances };
    this.statModifiers = base.statModifiers ? [...base.statModifiers] : [];
    this.statusEffects = base.statusEffects ? [...base.statusEffects] : [];
    this.threat = base.threat ?? 25;
    this.regen = base.regen ?? { hp: 0, mp: 0 };
    this.hit = { ...base.hit } ?? { chance: 10, evasion: 5 };
    this.scale = base.scale ?? 1;
    this.allModifiers = {};

    if (Object.keys(this.armor).length < 1) this.armor = { physical: 0, magical: 0, elemental: 0 };

    this.getStats = (withConditions = true) => {
      let stats = {} as statusObject;
      baseStats.forEach((stat: string) => {
        if (!this.allModifiers[stat + "V"]) this.allModifiers[stat + "V"] = 0;
        if (!this.allModifiers[stat + "P"]) this.allModifiers[stat + "P"] = 1;
        stats[stat] = Math.floor((this.stats[stat] + this.allModifiers[stat + "V"]) * this.allModifiers[stat + "P"]);
        stats[stat] > 100 ? stats[stat] = Math.floor(100 + (stats[stat] - 100) / 17) : "";
      });
      if (!this.allModifiers["critDamageV"]) this.allModifiers["critDamageV"] = 0;
      if (!this.allModifiers["critDamageP"]) this.allModifiers["critDamageP"] = 1;
      if (!this.allModifiers["critChanceV"]) this.allModifiers["critChanceV"] = 0;
      if (!this.allModifiers["critChanceP"]) this.allModifiers["critChanceP"] = 1;
      stats["critDamage"] = Math.floor(this.allModifiers["critDamageV"] + (this.allModifiers["critDamageP"] - 1) * 100 + (stats["cun"] * 1.5) + 18.5);
      stats["critChance"] = Math.floor(this.allModifiers["critChanceV"] + (this.allModifiers["critChanceP"] - 1) * 100 + (stats["cun"] * 0.4) + 4.6);
      return stats;
    };

    this.getHpMax = (withConditions = true) => {
      let hpMax: number = 0;
      const { v: hp_val, m: hp_mod } = getModifiers(this, "hpMax", withConditions);
      const { v: vitVal, m: vitMod } = getModifiers(this, "vit", withConditions);
      let vit = Math.floor((this.stats.vit + vitVal) * vitMod);
      hpMax = Math.floor(((this.stats?.hpMax ?? 20) + hp_val + vit * 5) * hp_mod);
      return hpMax < 0 ? 0 : hpMax;
    };

    this.getMpMax = (withConditions = true) => {
      let mpMax: number = 0;
      const { v: mp_val, m: mp_mod } = getModifiers(this, "mpMax", withConditions);
      const { v: intVal, m: intMod } = getModifiers(this, "int", withConditions);
      let int = Math.floor((this.stats.int + intVal) * intMod);
      mpMax = Math.floor(((this.stats?.hpMax ?? 10) + mp_val + int * 2) * mp_mod);
      return mpMax < 0 ? 0 : mpMax;
    };

    this.getHitchance = () => {
      const chances = {
        chance: 0,
        evasion: 0
      };
      if (!this.allModifiers["hitChanceV"]) this.allModifiers["hitChanceV"] = 0;
      if (!this.allModifiers["hitChanceP"]) this.allModifiers["hitChanceP"] = 1;
      if (!this.allModifiers["evasionV"]) this.allModifiers["evasionV"] = 0;
      if (!this.allModifiers["evasionP"]) this.allModifiers["evasionP"] = 1;
      chances["chance"] = Math.floor((this.hit?.chance + this.allModifiers["hitChanceV"] + this.stats["dex"] * .25) * this.allModifiers["hitChanceP"]);
      chances["evasion"] = Math.floor((this.hit?.evasion + this.allModifiers["evasionV"] + this.stats["dex"] * .25) * this.allModifiers["evasionP"]);
      return chances;
    };

    this.getResists = () => {
      let resists = {} as resistances;
      Object.keys(this.resistances).forEach((res: string) => {
        const { v: val, m: mod } = getModifiers(this, res + "Resist");
        const { v: _val, m: _mod } = getModifiers(this, "resistAll");
        let value = Math.floor((this.resistances[res] + val) * mod);
        resists[res] = Math.floor((value + _val) * _mod);
        if (resists[res] >= 320) resists[res] = 100;
        else if (resists[res] > 80) resists[res] = Math.floor(80 + (resists[res] - 80) / 17);
      });
      return resists;
    };

    this.getArmor = () => {
      let armors = {} as defenseClass;
      Object.keys(this.armor).forEach((armor: string) => {
        const { v: val, m: mod } = getModifiers(this, armor + "Def");
        armors[armor] = Math.floor((this.armor[armor] + val) * mod);
        if (armors[armor] > 200) armors[armor] = 200;
      });
      return armors;
    };

    this.getThreat = () => {
      if (!this.allModifiers["threatV"]) this.allModifiers["threatV"] = 0;
      if (!this.allModifiers["threatP"]) this.allModifiers["threatP"] = 1;
      return (this.threat + this.allModifiers["threatV"]) * this.allModifiers["threatP"];
    };

    this.getRegen = () => {
      let stats = this.getStats();
      if (!this.allModifiers["regenHpV"]) this.allModifiers["regenHpV"] = 0;
      if (!this.allModifiers["regenHpP"]) this.allModifiers["regenHpP"] = 1;
      if (!this.allModifiers["regenMpV"]) this.allModifiers["regenMpV"] = 0;
      if (!this.allModifiers["regenMpP"]) this.allModifiers["regenMpP"] = 1;
      let reg = { hp: 0, mp: 0 };
      reg["hp"] = ((this.regen["hp"] + this.getHpMax() * 0.0025 + this.allModifiers["regenHpV"]) * this.allModifiers["regenHpP"]) * (1 + stats.vit / 100);
      reg["mp"] = ((this.regen["mp"] + this.getMpMax() * 0.0025 + this.allModifiers["regenMpV"]) * this.allModifiers["regenMpP"]) * (1 + stats.int / 100);
      if (reg["hp"] < 0) reg["hp"] = 0;
      if (reg["mp"] < 0) reg["mp"] = 0;
      return reg;
    };

    this.isRooted = () => {
      let rooted = false;
      this.statusEffects.forEach((eff: any) => {
        if (eff.rooted) { rooted = true; return; }
      });
      return rooted;
    };

    this.getStatusResists = () => {
      let resists = {} as statusResistances;
      Object.keys(this.statusResistances).forEach((res: string) => {
        if (!this.allModifiers[res + "DefenseV"]) this.allModifiers[res + "DefenseV"] = 0;
        if (!this.allModifiers[res + "DefenseP"]) this.allModifiers[res + "DefenseP"] = 1;
        resists[res] = Math.floor((this.statusResistances[res] + this.allModifiers[res + "DefenseV"]) * this.allModifiers[res + "DefenseP"]);
      });
      return resists;
    };

    this.statRemaining = (stat: string) => {
      return <number>((this.stats[stat] / this.getStats()[stat + "Max"]) * 100);
    };

    this.effects = () => {
      this.statusEffects.forEach((status: statEffect, index: number) => {
        if (status.dot) {
          const dmg = Math.floor(status.dot.damageAmount * (1 - this.getStatusResists()[status.dot.damageType] / 100));
          this.stats.hp -= dmg;
          spawnFloatingText(this.cords, dmg.toString(), "red", 32);
          let effectText: string = this.id == "player" ? lang["damage_from_effect_pl"] : lang["damage_from_effect"];
          effectText = effectText?.replace("[TARGET]", `<c>white<c>'<c>yellow<c>${this.name}<c>white<c>'`);
          effectText = effectText?.replace("[ICON]", `<i>${status.dot.icon}<i>`);
          effectText = effectText?.replace("[STATUS]", `${lang[status.dot.damageType + "_damage"]}`);
          effectText = effectText?.replace("[DMG]", `${dmg}`);
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
      this.abilities?.forEach((abi: ability) => {
        if (abi.onCooldown > 0) {
          if (abi.recharge_only_in_combat) {
            if (state.inCombat) abi.onCooldown--;
          }
          else abi.onCooldown--;
        }
      });
    };

    this.abilities = [...base.abilities] ?? [];

    this.silenced = () => {
      var result = false;
      this.statusEffects.forEach((eff: statEffect) => {
        if (eff.silence) { result = true; return; }
      });
      return result;
    };

    this.concentration = () => {
      var result = true;
      this.statusEffects.forEach((eff: statEffect) => {
        if (eff.break_concentration) { result = false; return; }
      });
      return result;
    };

    this.hpRemain = () => {
      return (this.stats.hp / this.getHpMax(false)) * 100;
    };

    this.mpRemain = () => {
      return (this.stats.mp / this.getMpMax(false)) * 100;
    };

    this.updateAbilities = (useDummy: boolean = false) => {
      this.allModifiers = getAllModifiersOnce(this);
      if (!this.allModifiers["damageV"]) this.allModifiers["damageV"] = 0;
      if (!this.allModifiers["damageP"]) this.allModifiers["damageP"] = 1;
      for (let i = 0; i < this.abilities?.length; i++) {
        if (!useDummy) this.abilities[i] = new Ability(this.abilities[i], this);
        else this.abilities[i] = new Ability(this.abilities[i], dummy);
      }
      if (this.inventory) {
        for (let i = 0; i < this.inventory?.length; i++) {
          // If item is broken, default to error item
          if (!this.inventory[i].id || !this.inventory[i].type) {
            this.inventory[i] = { ...items.A0_error };
          }
          // Manually refresh error items
          if (this.inventory[i].id == "A0_error") {
            this.inventory[i] = { ...items.A0_error };
            this.inventory[i].index = i;
          }
          if (this.inventory[i].type == "weapon") this.inventory[i] = new Weapon({ ...this.inventory[i] });
          else if (this.inventory[i].type == "armor") this.inventory[i] = new Armor({ ...this.inventory[i] });
          else if (this.inventory[i].type == "consumable") this.inventory[i] = new Consumable({ ...this.inventory[i] });
          else if (this.inventory[i].type == "artifact") this.inventory[i] = new Artifact({ ...this.inventory[i] });
          if (!this.inventory[i].indexInBaseArray) continue;
          let encounter = player.entitiesEverEncountered?.items?.[this.inventory[i].id];
          if (encounter < 1 || !encounter) {
            player.entitiesEverEncountered.items[this.inventory[i].id] = 1;
          }
        }
      }
      if (this.weapon?.type) this.weapon = new Weapon({ ...this.weapon });
      if (this.offhand?.type) this.offhand = new Armor({ ...this.offhand });
      if (this.chest?.type) this.chest = new Armor({ ...this.chest });
      if (this.legs?.type) this.legs = new Armor({ ...this.legs });
      if (this.helmet?.type) this.helmet = new Armor({ ...this.helmet });
      if (this.gloves?.type) this.gloves = new Armor({ ...this.gloves });
      if (this.boots?.type) this.boots = new Armor({ ...this.boots });
      if (this.artifact1?.type) this.artifact1 = new Artifact({ ...this.artifact1 });
      if (this.artifact2?.type) this.artifact2 = new Artifact({ ...this.artifact2 });
      if (this.artifact3?.type) this.artifact3 = new Artifact({ ...this.artifact3 });
    };
  }
}

const baseStats = [
  "str",
  "vit",
  "dex",
  "int",
  "cun"
];;

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