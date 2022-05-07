
class Artifact extends Item {
  commands?: any;
  stats: any;
  artifactSet: string;
  rolledStats?: any;
  fullPrice?: Function;
  constructor(base: Artifact, setPrice: number = 0, dontRollStats: boolean = false) {
    super(base);
    const baseItem = { ...items[this.id] };
    this.stats = { ...baseItem.stats } ?? {};
    this.artifactSet = baseItem.artifactSet;
    this.rolledStats = base.rolledStats || [];
    this.commands = {};
    if (setPrice > 0) this.price = setPrice;

    if (lang.language_id !== "english") this.name = lang[this.id + "_name"];

    if (this.rolledStats.length === 0 && !dontRollStats) {
      const amountOfStats = helper.random(maxStatsForArtifactsToRoll[this.grade], 0);
      for (let i = 0; i <= amountOfStats; i++) {
        const randomStat = helper.weightedRandom(Object.values(artifactStatRandomization));
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
        let val = artifactStatRandomization[stat.stat.substring(0, stat.stat.length - 1)];
        val = val[stat.stat.endsWith("V") ? "Value" : "Percent"][stat.value];
        if (!this.stats[stat.stat]) this.stats[stat.stat] = val;
        else this.stats[stat.stat] += val;
      });
    }
    catch (err) {
      if (DEVMODE) displayText("<c>red<c>Error trying to randomize stats for: " + this.id + " " + err);
    }

    if (this.rolledStats.length > 0) {
      let name: string = "";
      const maxAdjectives = 2;
      let adjectivesUsed = 0;
      const statKeys: Array<any> = [];
      Object.entries(this.stats).forEach((stat: any) => {
        if (!stat[0].includes("damage_against")) {
          statKeys.push({ key: stat[0], num: stat[1] });
        }
      });
      statKeys.sort((key1: any, key2: any) => {
        if (Math.abs(key1.num) > Math.abs(key2.num)) return -1;
        else if (Math.abs(key2.num) > Math.abs(key1.num)) return 1;
        else return 0;
      });
      let langName = lang[this.id + "_name"];
      if (!langName) langName = items[this.id].name;
      statKeys.forEach((stat: any) => {
        stat.key = stat.key.substring(0, stat.key.length - 1);
        if (adjectivesUsed >= maxAdjectives || name.includes(lang[stat.key + "_adjective"])) return;
        adjectivesUsed++;
        name += `${adjectivesUsed === 1 ? " " : ""}${lang[stat.key + "_adjective" + `${stat.num < 0 ? "_negative" : ""}`]} `;
      });
      name += `${langName}`;
      this.name = name;
    }

    if (setPrice > 0) this.fullPrice = () => { return this.price; };
    else {
      this.fullPrice = () => {
        let bonus = 0;
        Object.entries(this.stats).forEach((stat: any) => {
          let _sw = statWorths[stat[0]] * stat[1];
          if (isNaN(_sw)) _sw = stat[1] * 2;
          bonus += _sw * 1.5;
        });
        bonus *= grades[this.grade]["worth"];
        let price = Math.floor(bonus + this.price);
        return price < 1 ? 1 : price;
      };
    }
  }
}