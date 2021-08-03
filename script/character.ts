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
  threat: number;
  statModifiers?: any;
  statusEffects?: any;
  getStats?: Function;
  getResists?: Function;
  getStatusResists?: Function;
  effects?: Function;
  updateAbilities?: Function;
  aura?: string;
  silenced?: Function;
  concentration?: Function;
  hpRemain?: Function;
  perks?: any;
  unarmedDamages?: any;
  fistDmg?: Function;
  getThreat?: Function;
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
  });
  return fulfilled;
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
  });
  return { v: val, m: modif };
}

class Character {
  id: string;
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
  threat: number;
  statModifiers?: any;
  statusEffects?: any;
  getStats?: Function;
  getResists?: Function;
  getStatusResists?: Function;
  effects?: Function;
  updateAbilities?: Function;
  aura?: string;
  silenced?: Function;
  concentration?: Function;
  statRemaining?: Function;
  hpRemain?: Function;
  getThreat?: Function;
  constructor(base: characterObject) {
    this.id = base.id;
    this.name = base.name ?? "name_404";
    this.cords = base.cords ?? { x: 0, y: 0 };
    this.stats = { ...base.stats };
    this.resistances = { ...base.resistances };
    this.statusResistances = { ...base.statusResistances };
    this.statModifiers = base.statModifiers ?? [];
    this.statusEffects = base.statusEffects ?? [];
    this.threat = base.threat ?? 25;

    this.getStats = (withConditions = true) => {
      let stats = {} as statusObject;
      baseStats.forEach((stat: string) => {
        const { v: val, m: mod } = getModifiers(this, stat, withConditions);
        stats[stat] = Math.floor((this.stats[stat] + val) * mod);
        stats[stat] > 100 ? stats[stat] = Math.floor(100 + (stats[stat] - 100) / 17) : "";
      });
      // get hp
      const { v: hp_val, m: hp_mod } = getModifiers(this, "hpMax", withConditions);
      stats["hpMax"] = Math.floor(((this.stats?.hpMax ?? 20) + hp_val + stats.vit * 5) * hp_mod);
      // get mp
      const { v: mp_val, m: mp_mod } = getModifiers(this, "mpMax", withConditions);
      stats["mpMax"] = Math.floor(((this.stats?.mpMax ?? 10) + mp_val + stats.int * 2) * mp_mod);
      stats["mpMax"] < 0 ? stats["mpMax"] = 0 : "";
      stats["hpMax"] < 0 ? stats["hpMax"] = 0 : "";
      const { v: critAtkVal, m: critAtkMulti } = getModifiers(this, "critDamage", withConditions);
      const { v: critHitVal, m: critHitMulti } = getModifiers(this, "critChance", withConditions);
      stats["critDamage"] = Math.floor(critAtkVal + (critAtkMulti - 1) * 100 + (stats["cun"] * 1.5));
      stats["critChance"] = Math.floor(critHitVal + (critHitMulti - 1) * 100 + (stats["cun"] * 0.4));
      return stats;
    };

    this.getResists = () => {
      let resists = {} as resistances;
      Object.keys(this.resistances).forEach((res: string) => {
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
    }

    this.getStatusResists = () => {
      let resists = {} as statusResistances;
      Object.keys(this.statusResistances).forEach((res: string) => {
        const { v: val, m: mod } = getModifiers(this, res + "Resist");
        resists[res] = Math.floor((this.statusResistances[res] + val) * mod);
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

    this.abilities = base.abilities ?? [];

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
      return (this.stats.hp / this.getStats(false).hpMax) * 100;
    };

    this.updateAbilities = () => {
      // @ts-ignore
      for (let i = 0; i < this.abilities?.length; i++) {
        // @ts-ignore
        this.abilities[i] = new Ability(this.abilities[i], this);
      }
      // @ts-ignore
      if (this.inventory) {
        // @ts-ignore
        for (let i = 0; i < this.inventory?.length; i++) {
          // @ts-ignore
          if (this.inventory[i].type == "weapon") this.inventory[i] = new Weapon({ ...this.inventory[i] });
          // @ts-ignore
          else if (this.inventory[i].type == "armor") this.inventory[i] = new Armor(this.inventory[i]);
          // @ts-ignore
          else if (this.inventory[i].type == "consumable") this.inventory[i] = new Consumable(this.inventory[i]);
        }
      }
      if (this.weapon?.type) this.weapon = new Weapon({ ...this.weapon });
      if (this.chest?.type) this.chest = new Armor({ ...this.chest });
      if (this.legs?.type) this.legs = new Armor({ ...this.legs });
      if (this.helmet?.type) this.helmet = new Armor({ ...this.helmet });
      if (this.gloves?.type) this.gloves = new Armor({ ...this.gloves });
      if (this.boots?.type) this.boots = new Armor({ ...this.boots });
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