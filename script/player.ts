// @ts-nocheck
interface playerChar extends characterObject {
  canFly: boolean,
  sprite: string,
  race: string;
  hair: number;
  eyes: number;
  face: number;
  weapon: weaponClass | any;
  offhand: any;
  chest: armorClass | any;
  helmet: armorClass | any;
  gloves: armorClass | any;
  boots: armorClass | any;
  artifact1: any;
  artifact2: any;
  artifact3: any;
  level: levelObject;
  hpRegen?: Function;
}

interface levelObject {
  xp: number;
  xpNeed: number;
  level: number;
}

class PlayerCharacter extends Character {
  [canFly: string]: any;
  sprite: string;
  race: string;
  hair: number;
  eyes: number;
  face: number;
  level: levelObject;
  weapon: weaponClass | any;
  offhand: any;
  chest: armorClass | any;
  helmet: armorClass | any;
  gloves: armorClass | any;
  boots: armorClass | any;
  artifact1: any;
  artifact2: any;
  artifact3: any;
  hpRegen: Function;
  inventory: Array<any>;
  constructor(base: playerChar) {
    super(base);
    this.canFly = base.canFly ?? false;
    this.sprite = base.sprite ?? ".player";
    this.race = base.race ?? "human";
    this.hair = base.hair ?? 1;
    this.eyes = base.eyes ?? 1;
    this.face = base.face ?? 1;
    this.level = base.level;
    this.weapon = base.weapon ?? {};
    this.offhand = base.offhand ?? {};
    this.chest = base.chest ?? {};
    this.helmet = base.helmet ?? {};
    this.gloves = base.gloves ?? {};
    this.boots = base.boots ?? {};
    this.artifact1 = base.artifact1 ?? {};
    this.artifact2 = base.artifact2 ?? {};
    this.artifact3 = base.artifact3 ?? {};
    this.inventory = base.inventory ?? [];

    this.hpRegen = () => {
      const { v: val, m: mod } = getModifiers(this, "hpRegen");
      return Math.floor((1 + val) * mod);
    }
  }
}

var player = new PlayerCharacter({
  id: "player",
  name: "Player",
  cords: { x: 1, y: 1 },
  stats: {
      str: 5,
      dex: 5,
      int: 5,
      vit: 5,
      hp: 100,
      mp: 30
  },
  resistances: {
    slash: 0,
    crush: 0,
    pierce: 0,
    dark: 0,
    divine: 0,
    fire: 0,
    lightning: 0,
    ice: 0
  },
  statusResistances: {
    poison: 0,
    burning: 0,
    curse: 0,
    stun: 0,
    bleed: 0
  },
  level: {
    xp: 0,
    xpNeed: 100,
    level: 1
  },
  sprite: ".player",
  race: "elf",
  hair: 4,
  eyes: 2,
  face: 1,
  weapon: new Weapon({...items.longsword}),
  chest: new Armor({...items.raggedShirt}),
  helmet: {},
  gloves: {},
  boots: new Armor({...items.raggedBoots}),
  canFly: false,
  abilities: [
    new Ability({...abilities.attack}, dummy),
    new Ability({...abilities.focus_strike, equippedSlot: 0}, dummy),
    new Ability({...abilities.true_shot, equippedSlot: 1}, dummy),
    new Ability({...abilities.first_aid, equippedSlot: 2}, dummy),
    new Ability({...abilities.icy_javelin, equippedSlot: 3}, dummy),
    new Ability({...abilities.barbarian_rage, equippedSlot: 4}, dummy),
    new Ability({...abilities.berserk, equippedSlot: 5}, dummy)
  ],
  statModifiers: [
    {
      name: "Resilience of the Lone Wanderer",
      effects: {
        hpMaxV: 55,
        mpMaxV: 10
      }
    }
  ],
  statusEffects: [
    new statEffect({...statusEffects.poison}, s_def)
  ],
  inventory: []
});