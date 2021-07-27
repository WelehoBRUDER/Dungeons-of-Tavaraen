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
  artifact1?: any;
  artifact2?: any;
  artifact3?: any;
  isFoe?: boolean;
  kill?: Function;
  xp?: number;
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

function getModifiers(char: any, stat: string) {
  let val = 0;
  let modif = 1;
  char.statModifiers.forEach((mod: any) => {
    Object.entries(mod.effects).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P" && eff[1] < 0) modif *= (1 + eff[1] / 100);
        else if (eff[0] == stat + "P") modif += (eff[1] / 100);
        else if (eff[0] == stat + "V") val += eff[1];
      }
    });
  });
  char.statusEffects.forEach((mod: any) => {
    Object.entries(mod.effects).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P" && eff[1] < 0) modif *= (1 + eff[1] / 100);
        else if (eff[0] == stat + "P") modif += (eff[1] / 100);
        else if (eff[0] == stat + "V") val += eff[1];
      }
    });
  })
  char.perks?.forEach((mod: any) => {
    Object.entries(mod.effects).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P" && eff[1] < 0) modif *= (1 + eff[1] / 100);
        else if (eff[0] == stat + "P") modif += (eff[1] / 100);
        else if (eff[0] == stat + "V") val += eff[1];
      }
    });
  });
  if(char.raceEffect?.modifiers) {
    Object.entries(char.raceEffect?.modifiers).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P" && eff[1] < 0) modif *= (1 + eff[1] / 100);
        else if (eff[0] == stat + "P") modif += (eff[1] / 100);
        else if (eff[0] == stat + "V") val += eff[1];
      }
    });
  }
  if (char.weapon?.stats) {
    Object.entries(char.weapon.stats).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P" && eff[1] < 0) modif *= (1 + eff[1] / 100);
        else if (eff[0] == stat + "P") modif += (eff[1] / 100);
        else if (eff[0] == stat + "V") val += eff[1];
      }
    });
  }
  if (char.chest?.stats) {
    Object.entries(char.chest.stats).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P" && eff[1] < 0) modif *= (1 + eff[1] / 100);
        else if (eff[0] == stat + "P") modif += (eff[1] / 100);
        else if (eff[0] == stat + "V") val += eff[1];
      }
    });
  }
  if (char.helmet?.stats) {
    Object.entries(char.helmet.stats).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P" && eff[1] < 0) modif *= (1 + eff[1] / 100);
        else if (eff[0] == stat + "P") modif += (eff[1] / 100);
        else if (eff[0] == stat + "V") val += eff[1];
      }
    });
  }
  if (char.gloves?.stats) {
    Object.entries(char.gloves.stats).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P" && eff[1] < 0) modif *= (1 + eff[1] / 100);
        else if (eff[0] == stat + "P") modif += (eff[1] / 100);
        else if (eff[0] == stat + "V") val += eff[1];
      }
    });
  }
  if (char.boots?.stats) {
    Object.entries(char.boots.stats).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P" && eff[1] < 0) modif *= (1 + eff[1] / 100);
        else if (eff[0] == stat + "P") modif += (eff[1] / 100);
        else if (eff[0] == stat + "V") val += eff[1];
      }
    });
  }
  if (stat.includes("Resist")) {
    if (char.chest?.resistances) {
      if (char.chest.resistances[stat.replace("Resist", '')]) val += char.chest.resistances[stat.replace("Resist", '')];
    }
    if (char.helmet?.resistances) {
      if (char.helmet.resistances[stat.replace("Resist", '')]) val += char.helmet.resistances[stat.replace("Resist", '')];
    }
    if (char.gloves?.resistances) {
      if (char.gloves.resistances[stat.replace("Resist", '')]) val += char.gloves.resistances[stat.replace("Resist", '')];
    }
    if (char.boots?.resistances) {
      if (char.boots.resistances[stat.replace("Resist", '')]) val += char.boots.resistances[stat.replace("Resist", '')];
    }
  }
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
  artifact1?: any;
  artifact2?: any;
  artifact3?: any;
  isFoe?: boolean;
  kill?: Function;
  xp?: number;
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
  constructor(base: characterObject) {
    this.id = base.id;
    this.name = base.name ?? "name_404";
    this.cords = base.cords ?? { x: 0, y: 0 };
    this.stats = { ...base.stats };
    this.resistances = { ...base.resistances };
    this.statusResistances = { ...base.statusResistances };
    this.statModifiers = base.statModifiers ?? [];
    this.statusEffects = base.statusEffects ?? [];

    this.getStats = () => {
      let stats = {} as statusObject;
      baseStats.forEach((stat: string) => {
        const { v: val, m: mod } = getModifiers(this, stat);
        stats[stat] = Math.floor((this.stats[stat] + val) * mod);
        stats[stat] > 100 ? stats[stat] = Math.floor(100 + (stats[stat]-100)/17) : "";
      });
      // get hp
      const { v: hp_val, m: hp_mod } = getModifiers(this, "hpMax");
      stats["hpMax"] = Math.floor(((this.stats?.hpMax ?? 20) + hp_val + stats.vit * 5) * hp_mod);
      // get mp
      const { v: mp_val, m: mp_mod } = getModifiers(this, "mpMax");
      stats["mpMax"] = Math.floor(((this.stats?.mpMax ?? 10) + mp_val + stats.int * 2) * mp_mod);
      stats["mpMax"] < 0 ? stats["mpMax"] = 0 : "";
      stats["hpMax"] < 0 ? stats["hpMax"] = 0 : "";
      const {v: critAtkVal, m: critAtkMulti} = getModifiers(this, "critDamage");
      const {v: critHitVal, m: critHitMulti} = getModifiers(this, "critChance");
      stats["critDamage"] = Math.floor(critAtkVal + critAtkMulti + (stats["cun"]*1.5));
      stats["critChance"] = Math.floor(critHitVal + critHitMulti + (stats["cun"]*0.4));
      return stats;
    };

    this.getResists = () => {
      let resists = {} as resistances;
      Object.keys(this.resistances).forEach((res: string) => {
        const { v: val, m: mod } = getModifiers(this, res + "Resist");
        resists[res] = Math.floor((this.resistances[res] + val) * mod);
        resists[res] > 85 ? resists[res] = Math.floor(85 + (resists[res]-85)/17) : "";
      });
      return resists;
    };

    this.getStatusResists = () => {
      let resists = {} as statusResistances;
      Object.keys(this.statusResistances).forEach((res: string) => {
        const { v: val, m: mod } = getModifiers(this, res + "Resist");
        resists[res] = Math.floor((this.statusResistances[res] + val) * mod);
      });
      return resists;
    }

    this.statRemaining = (stat: string) => {
      return <number>((this.stats[stat] / this.getStats()[stat + "Max"]) * 100);
    };

    this.effects = () => {
      this.statusEffects.forEach((status: statEffect, index: number)=>{
        if(status.dot) {
          const dmg = Math.floor(status.dot.damageAmount * (1 - this.getStatusResists()[status.dot.damageType]));
          this.stats.hp -= dmg;
          spawnFloatingText(this.cords, dmg.toString(), "red", 32);
          let effectText: string = this.id == "player" ? lang["damage_from_effect_pl"] : lang["damage_from_effect"];
          effectText = effectText?.replace("[TARGET]", `<c>white<c>'<c>yellow<c>${this.name}<c>white<c>'`);
          effectText = effectText?.replace("[ICON]", `<i>${status.dot.icon}<i>`);
          effectText = effectText?.replace("[STATUS]", `${lang[status.dot.damageType + "_damage"]}`);
          effectText = effectText?.replace("[DMG]", `${dmg}`);
          displayText(`<c>purple<c>[EFFECT] ${effectText}`);
          if(this.stats.hp <= 0) {
            this.kill();
          }
        }
        status.last.current--;
        if(status.last.current <= 0) {
          this.statusEffects.splice(index, 1);
        }
      });
      this.abilities?.forEach((abi: ability) => {
        if(abi.onCooldown > 0) abi.onCooldown--;
      });
    }

    this.abilities = base.abilities ?? [];

    this.silenced = () => {
      var result = false;
      this.statusEffects.forEach((eff: statEffect) => {
        if(eff.silence) { result = true; return;}
      });
      return result;
    }

    this.concentration = () => {
      var result = true;
      this.statusEffects.forEach((eff: statEffect) => {
        if(eff.break_concentration) { result = false; return;}
      });
      return result;
    }

    this.hpRemain = () => {
      return (this.stats.hp / this.getStats().hpMax) * 100;
    }

    this.updateAbilities = () => {
      // @ts-ignore
      for(let i = 0; i < this.abilities?.length; i++) {
        // @ts-ignore
        this.abilities[i] = new Ability(this.abilities[i], this);
      }
      // @ts-ignore
      if(this.inventory) {
        // @ts-ignore
      for(let i = 0; i < this.inventory?.length; i++) {
        // @ts-ignore
        if(this.inventory[i].type == "weapon") this.inventory[i] = new Weapon({...this.inventory[i]});
        // @ts-ignore
        else if(this.inventory[i].type == "armor") this.inventory[i] = new Armor(this.inventory[i]);
      }
      }
    }
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