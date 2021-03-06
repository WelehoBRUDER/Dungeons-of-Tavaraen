interface DoT {
  [damageType: string]: any;
  damageAmount: number;
  icon: string;
}

interface statusTime {
  [total: string]: number;
  current: number;
}

interface statusEffect {
  [id: string]: any;
  name: string;
  dot?: DoT;
  effects?: traits;
  last: statusTime;
  type: string;
  onRemove?: Function;
  textIcon: string;
  icon: string;
  aura?: string;
  silence?: boolean;
  break_concentration?: boolean;
}

class statEffect {
  [id: string]: string | any;
  name: string;
  dot?: DoT;
  effects?: traits;
  last: statusTime;
  type: string;
  onRemove?: Function;
  textIcon: string;
  icon: string;
  aura?: string;
  silence?: boolean;
  rooted?: boolean;
  break_concentration?: boolean;
  constructor(base: statusEffect, modifiers: any) {
    // @ts-ignore
    if (!base) throw new Error("BASE EFFECT INVALID!");
    const defaultEffect: statusEffect = statusEffects[base.id];
    this.id = defaultEffect.id;
    this.name = defaultEffect.name;
    this.dot = setDOT({ ...defaultEffect.dot });
    this.effects = effectsInit({ ...defaultEffect.effects }, this.id);
    this.last = { total: Math.floor((defaultEffect.last.total + modifiers.last.value) * modifiers.last.modif), current: Math.floor((defaultEffect.last.total + modifiers.last.value + 1) * modifiers.last.modif) };
    this.rooted = defaultEffect.rooted;
    this.type = defaultEffect.type;
    this.onRemove = defaultEffect.onRemove;
    this.textIcon = defaultEffect.textIcon;
    this.icon = defaultEffect.icon;
    this.aura = defaultEffect.aura ?? "";
    this.silence = defaultEffect.silence ?? false;
    this.break_concentration = defaultEffect.break_concentration ?? false;
    function effectsInit(effects: any, id: string) {
      let total: any = effects;
      Object.entries(modifiers?.effects).forEach((eff: any) => {
        const key = eff[0];
        const val = eff[1].value;
        const mod = eff[1].modif;
        const statusId = eff[1].status;
        if ((val !== 0 || mod !== 1) && statusId == id) {
          var num = total[key];
          if (!num) num = 0;
          total[key] = Math.floor(((num + val) * mod));
        }
      });
      // @ts-expect-error
      let entries: any = Object.entries(total).sort((a: number, b: number) => b[1] - a[1]);
      let sortedTotal: any = {};
      entries.forEach((entry: any) => {
        sortedTotal[entry[0]] = entry[1];
      });
      return sortedTotal;
    }

    function setDOT(defaultDot: any) {
      let dot: any = defaultDot;
      if (dot.damageAmount) {
        dot.damageAmount = Math.floor((dot.damageAmount + modifiers.damageAmount.value) * modifiers.damageAmount.modif);
      }
      else return null;
      return dot;
    }
  }
}