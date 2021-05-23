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
  dark: number;
  divine: number;
  fire: number;
  lightning: number;
  ice: number;
}

interface characterObject {
  id: string;
  name: string;
  cords: tileObject;
  stats: stats;
  resistances: resistances;
  abilities: ability[];
  weapon?: weaponClass | {};
  chest?: armorClass | {};
  helmet?: armorClass | {};
  gloves?: armorClass | {};
  boots?: armorClass | {};
  isFoe?: boolean;
  kill?: Function;
  xp?: number;
  statModifiers?: any;
  getStats?: Function;
  getResists?: Function;
}

interface statusObject {
  [hpMax: string]: number;
  mpMax: number;
  str: number;
  dex: number;
  int: number;
  vit: number;
}

function getModifiers(char: any, stat: string) {
  let val = 0;
  let modif = 1;
  char.statModifiers.forEach((mod: any) => {
    Object.entries(mod.effects).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P") modif *= eff[1] / 100;
        else if (eff[0] == stat + "V") val += eff[1];
      }
    });
  });
  if (char.weapon?.stats) {
    Object.entries(char.weapon.stats).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P") modif *= eff[1] / 100;
        else if (eff[0] == stat + "V") val += eff[1];
      }
    });
  }
  if (char.chest?.stats) {
    Object.entries(char.chest.stats).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P") modif *= eff[1] / 100;
        else if (eff[0] == stat + "V") val += eff[1];
      }
    });
  }
  if (char.helmet?.stats) {
    Object.entries(char.helmet.stats).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P") modif *= eff[1] / 100;
        else if (eff[0] == stat + "V") val += eff[1];
      }
    });
  }
  if (char.gloves?.stats) {
    Object.entries(char.gloves.stats).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P") modif *= eff[1] / 100;
        else if (eff[0] == stat + "V") val += eff[1];
      }
    });
  }
  if (char.boots?.stats) {
    Object.entries(char.boots.stats).forEach((eff: any) => {
      if (eff[0].startsWith(stat)) {
        if (eff[0] == stat + "P") modif *= eff[1] / 100;
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
  getStats: Function;
  getResists: Function;
  kill?: Function;
  statModifiers?: any;
  statRemaining?: Function;
  abilities?: ability[];
  constructor(base: characterObject) {
    this.id = base.id;
    this.name = base.name ?? "name_404";
    this.cords = base.cords ?? { x: 0, y: 0 };
    this.stats = { ...base.stats };
    this.resistances = { ...base.resistances };
    this.statModifiers = base.statModifiers ?? [];

    this.getStats = () => {
      let stats = {} as statusObject;
      baseStats.forEach((stat: string) => {
        const { v: val, m: mod } = getModifiers(this, stat);
        stats[stat] = Math.floor((this.stats[stat] + val) * mod);
      });
      // get hp
      const { v: hp_val, m: hp_mod } = getModifiers(this, "hpMax");
      stats["hpMax"] = Math.floor(((this.stats?.hpMax ?? 20) + hp_val + stats.vit * 5) * hp_mod);
      // get mp
      const { v: mp_val, m: mp_mod } = getModifiers(this, "mpMax");
      stats["mpMax"] = Math.floor(((this.stats?.mpMax ?? 10) + mp_val + stats.int * 2) * mp_mod);

      return stats;
    };

    this.getResists = () => {
      let resists = {} as resistances;
      Object.keys(this.resistances).forEach((res: string) => {
        const { v: val, m: mod } = getModifiers(this, res + "Resist");
        resists[res] = Math.floor((this.resistances[res] + val) * mod);
      });
      return resists;
    };

    this.statRemaining = (stat: string) => {
      return <number>((this.stats[stat] / this.getStats()[stat + "Max"]) * 100);
    };

    this.abilities = base.abilities ?? [];
  }
}

const baseStats = [
  "str",
  "vit",
  "dex",
  "int"
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