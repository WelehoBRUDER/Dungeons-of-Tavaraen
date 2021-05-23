interface playerChar extends characterObject {
  canFly: boolean,
  sprite: string,
  race: string;
  hair: number;
  eyes: number;
  face: number;
  level: levelObject;
}

interface levelObject {
  xp: number;
  xpNeed: number;
  level: number;
}

class PlayerCharacter extends Character {
  canFly: boolean;
  sprite: string;
  race: string;
  hair: number;
  eyes: number;
  face: number;
  level: levelObject;
  weapon: weaponClass | {};
  chest: armorClass | {};
  helmet: armorClass | {};
  gloves: armorClass | {};
  boots: armorClass | {};
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
    this.chest = base.chest ?? {};
    this.helmet = base.helmet ?? {};
    this.gloves = base.gloves ?? {};
    this.boots = base.boots ?? {};
  }
}

var player = new PlayerCharacter({
  id: "player",
  name: "Player",
  cords: { x: 1, y: 1 },
  stats: {
      str: 1,
      dex: 1,
      int: 1,
      vit: 1,
      hp: 100,
      mp: 35
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
  weapon: new Weapon(items.huntingBow),
  chest: new Armor(items.raggedShirt),
  helmet: {},
  gloves: {},
  boots: new Armor(items.raggedBoots),
  canFly: false,
  abilities: [
    new Ability({...abilities.attack, equippedSlot: 0})
  ],
  statModifiers: [
    {
      name: "Resilience of the Lone Wanderer",
      effects: {
        hpMaxV: 75,
        mpMaxV: 20
      }
    }
  ]
});