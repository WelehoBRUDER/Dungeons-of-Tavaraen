interface weaponClass extends itemClass {
  damages: damageClass;
  range: number;
  firesProjectile?: string;
  stats?: any;
  commands?: any;
  statStrings?: any;
  fullPrice?: Function;
  twoHanded?: boolean;
  level?: number;
  maxLevel?: number;
}

class Weapon extends Item {
  damages: damageClass;
  range: number;
  firesProjectile?: string;
  stats?: traits;
  commands?: any;
  statStrings?: any;
  fullPrice?: Function;
  twoHanded?: boolean;
  statBonus: string;
  level?: number;
  maxLevel?: number;
  rolledStats?: Array<any>;
  constructor(base: weaponClass, setPrice: number = 0, dontRollStats: boolean = false) {
    super(base);
    const baseItem = { ...items[this.id] };
    this.name = lang[this.id + "_name"] ?? baseItem.name;
    this.level = base.level ?? 0;
    this.maxLevel = baseItem.maxLevel ?? 5;
    this.range = baseItem.range;
    this.firesProjectile = baseItem.firesProjectile;
    this.twoHanded = baseItem.twoHanded ?? false;
    this.damages = leveledStats({ ...baseItem.damages }, this.level ?? 0) ?? {};
    this.stats = { ...baseItem.stats } ?? {};
    this.commands = { ...baseItem.commands } ?? {};
    this.statBonus = baseItem.statBonus ?? "str";
    this.rolledStats = base.rolledStats || [];
    if (setPrice > 0) this.price = setPrice;
    if (this.level > 0) this.name += ` +${this.level}`;

    if (this.rolledStats.length === 0 && settings.randomize_items && !dontRollStats) {
      const amountOfMainStats = helper.random(maxStatsForEquipmentToRoll[this.grade].main, 0);
      for (let i = 0; i <= amountOfMainStats; i++) {
        const randomStat = helper.weightedRandom(Object.values(equipmentStatRandomization.damage));
        const key = randomStat.id;
        const data = randomStat;
        this.rolledStats.push({ damage: key, value: Math.floor(helper.random(data.Value.length - 1, 0)) });
      }
      const amountOfSideStats = helper.random(maxStatsForEquipmentToRoll[this.grade].side, 0);
      for (let i = 0; i <= amountOfSideStats; i++) {
        const randomStat = helper.weightedRandom(Object.values(equipmentStatRandomization.side));
        const key = randomStat.id;
        const data = randomStat;
        if ((Math.random() > 0.5 && !data.disablePercent) || data.disableValue) {
          this.rolledStats.push({ stat: key + "P", value: Math.floor(helper.random(data.Percent.length - 1, 0)) });
        }
        else if (!data.disableValue) {
          this.rolledStats.push({ stat: key + "V", value: Math.floor(helper.random(data.Value.length - 1, 0)) });
        }
      }
    }
    try {
      this.rolledStats?.forEach((stat: any) => {
        if (stat.damage) {
          let val = equipmentStatRandomization["damage"][stat.damage]["Value"][stat.value];
          if (!this.damages[stat.damage]) this.damages[stat.damage] = Math.floor(val * gradeStatMultis[this.grade]);
          else this.damages[stat.damage] += Math.floor(val * gradeStatMultis[this.grade]);
        }
        else {
          let val = equipmentStatRandomization["side"][stat.stat.substring(0, stat.stat.length - 1)];
          val = val[stat.stat.endsWith("V") ? "Value" : "Percent"][stat.value];
          if (!this.stats[stat.stat]) this.stats[stat.stat] = Math.floor(val * gradeStatMultis[this.grade]);
          else this.stats[stat.stat] += Math.floor(val * gradeStatMultis[this.grade]);
        }
      });
    }
    catch (err) { if (DEVMODE) displayText(`<c>red<c>${err} at line equipment:264`); }

    // Assign correct name based on stat effects.
    if (this.rolledStats.length > 0) {
      let name: string = "";
      const maxAdjectives = 3;
      let adjectivesUsed = 0;
      const statKeys: Array<any> = [];
      Object.entries(this.stats).forEach((stat: any) => {
        if (!stat[0].includes("damage_against")) {
          statKeys.push({ key: stat[0], num: stat[1] });
        }
      });
      statKeys.sort((key1: any, key2: any) => {
        if (key1.num > key2.num) return -1;
        else if (key2.num > key1.num) return 1;
        else return 0;
      });
      let langName = lang[this.id + "_name"];
      if (!langName) langName = items[this.id].name;
      statKeys.forEach((stat: any) => {
        stat.key = stat.key.substring(0, stat.key.length - 1);
        if (adjectivesUsed >= maxAdjectives || name.includes(lang[stat.key + "_adjective"])) return;
        adjectivesUsed++;
        name += `${adjectivesUsed === 1 ? " " : ""}${lang[stat.key + "_adjective"]} `;
      });
      name += `${langName}`;
      this.name = name;
      if (this.level > 0) this.name += ` +${this.level}`;
    }

    if (setPrice > 0) this.fullPrice = () => { return this.price; };
    else {
      this.fullPrice = () => {
        let bonus = 0;
        Object.entries(this.damages).forEach((dmg: any) => {
          const key = dmg[0];
          const val = dmg[1];
          bonus += val * dmgWorths[key];
        });
        Object.entries(this.stats).forEach((stat: any) => {
          let _sw = statWorths[stat[0]] * stat[1];
          if (isNaN(_sw)) _sw = stat[1] * 2;
          bonus += _sw;
        });
        bonus *= grades[this.grade]["worth"];
        let price = Math.floor((bonus + this.price) * (1 + this.level / 2));
        return price < 1 ? 1 : price;
      };
    }

    function leveledStats(stats: any, level: number) {
      const values: any = {};
      Object.entries(stats).forEach((stat: any) => {
        values[stat[0]] = Math.round(stat[1] * (1 + level / 10));
      });
      return values;
    }
  }
}