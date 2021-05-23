const random = (max: number, min: number = -100) => (Math.random() * (max - min) + min);

interface itemClass {
  id: string;
  name: string;
  price: number;
  weight: number;
  type: string;
  img: string;
  sprite: string;
}

class Item {
  id: string;
  name: string;
  price: number;
  weight: number;
  type: string;
  img: string;
  sprite: string;
  constructor(base: itemClass) {
    this.id = base.id;
    // @ts-ignore
    const baseItem = { ...items[this.id] };
    this.name = baseItem.name;
    this.price = baseItem.price;
    this.weight = baseItem.weight;
    this.type = baseItem.type;
    this.img = baseItem.img;
    this.sprite = baseItem.sprite;
  }
}

interface damageClass {
  slash?: number;
  crush?: number;
  pierce?: number;
  dark?: number;
  divine?: number;
  fire?: number;
  lightning?: number;
  ice?: number;
}

interface statModifiers {
  strV?: number;
  strP?: number;
  vitV?: number;
  vitP?: number;
  dexV?: number;
  dexP?: number;
  intV?: number;
  intP?: number;
  hpV?: number;
  hpP?: number;
  mpV?: number;
  mpP?: number;
}

interface weaponClass extends itemClass {
  damages: damageClass;
  damagesTemplate: any;
  statsTemplate: any;
  range: number;
  firesProjectile?: string;
  stats?: statModifiers;
}

const namePartsArmor = {
  slashSub: "Protective ",
  slashMain: " Of Slash Protection",
  crushSub: "Defensive ",
  crushMain: " Of Bluntness",
  pierceSub: "Shielding ",
  pierceMain: " Of Missile Protection",
  darkSub: "Grimshielding ",
  darkMain: " Of Darkshatter",
  divineSub: "Blinding ",
  divineMain: " Of Seraphic Guard",
  fireSub: "Burning ",
  fireMain: " Of Flameguard",
  lightningSub: "Electric ",
  lightningMain: " Of Shock Aversion",
  iceSub: "Melting ",
  iceMain: " Of Frost Defense"
};

const nameParts = {
  slashSub: "Edged ",
  slashMain: " Of Slashing",
  crushSub: "Blunt ",
  crushMain: " Of Crushing",
  pierceSub: "Penetrating ",
  pierceMain: " Of Breakthrough",
  darkSub: "Corrupt ",
  darkMain: " Of Calamity",
  divineSub: "Divine ",
  divineMain: " Of Celestial Might",
  fireSub: "Flaming ",
  fireMain: " Of Ashes",
  lightningSub: "Shocking ",
  lightningMain: " Of Sparks",
  iceSub: "Chilling ",
  iceMain: " Of Frost"
};


class Weapon extends Item {
  damages: damageClass;
  damagesTemplate: any;
  statsTemplate: any;
  range: number;
  firesProjectile?: string;
  stats?: statModifiers;
  constructor(base: weaponClass) {
    super(base);
    // @ts-ignore
    const baseItem = { ...items[this.id] };
    this.range = baseItem.range;
    this.firesProjectile = baseItem.firesProjectile;
    this.damagesTemplate = baseItem.damagesTemplate;
    this.statsTemplate = baseItem.statsTemplate;
    this.damages = baseItem.damages;
    this.stats = baseItem.stats ?? {};

    /* RANDOMIZE DAMAGE VALUES FOR WEAPON */
    this.damagesTemplate.forEach((template: any) => {
      if (random(100, 0) < template.chance) {
        // @ts-expect-error
        if (!this.damages[template.type]) this.damages[template.type] = Math.round(random(template.value[1], template.value[0]));
        // @ts-expect-error
        else this.damages[template.type] += Math.round(random(template.value[1], template.value[0]));
      }
    });

    /* RANDOMIZE STAT MODIFIERS */
    this.statsTemplate.forEach((template: any) => {
      if (random(100, 0) < template.chance) {
        // @ts-expect-error
        if (!this.stats[template.type]) this.stats[template.type] = template.value[Math.round(random(template.value.length-1, 0))];
        // @ts-expect-error
        else this.stats[template.type] += template.value[random(template.value.length, 0)];
      }
    });

    /* SET NEW NAME FOR ITEM */
    var mainDamage: string;
    var subDamage: string;

    if (Object.values(this.damages).length == 1) {
      mainDamage = Object.keys(this.damages)[0];
      subDamage = Object.keys(this.damages)[0];
    }
    else {
      let max = -100;
      let _max = -100;
      Object.entries(this.damages).forEach((dmg: any) => {
        if (dmg[1] > max) { max = dmg[1]; mainDamage = dmg[0]; }
      });
      Object.entries(this.damages).forEach((dmg: any) => {
        if (dmg[1] == max && mainDamage != dmg[0]) {
          if (dmg[1] > _max) { _max = dmg[1]; subDamage = dmg[0]; }
        }
        else if(mainDamage != dmg[0]) {
          if (dmg[1] > _max) { _max = dmg[1]; subDamage = dmg[0]; }
        }
      });
    }

    // @ts-expect-error
    this.name = `${Object.values(this.damages).length > 1 ? nameParts[subDamage + "Sub"] : ""}${baseItem.name}${nameParts[mainDamage + "Main"]}`;
  }
}

interface armorClass extends itemClass {
  resistances: damageClass;
  resistancesTemplate: any;
  statsTemplate: any;
  stats?: statModifiers;
}

class Armor extends Item {
  resistances: damageClass;
  resistancesTemplate: any;
  statsTemplate: any;
  stats?: statModifiers;
  constructor(base: armorClass) {
    super(base);
    // @ts-ignore
    const baseItem = { ...items[this.id] };
    this.resistancesTemplate = baseItem.resistancesTemplate;
    this.statsTemplate = baseItem.statsTemplate;
    this.resistances = baseItem.resistances;
    this.stats = baseItem.stats ?? {};

    /* RANDOMIZE RESISTANCE VALUES FOR ARMOR */
    this.resistancesTemplate.forEach((template: any) => {
      if (random(100, 0) < template.chance) {
        // @ts-expect-error
        if (!this.resistances[template.type]) this.resistances[template.type] = Math.round(random(template.value[1], template.value[0]));
        // @ts-expect-error
        else this.resistances[template.type] += Math.round(random(template.value[1], template.value[0]));
      }
    });

    /* RANDOMIZE STAT MODIFIERS */
    this.statsTemplate.forEach((template: any) => {
      if (random(100, 0) < template.chance) {
        // @ts-expect-error
        if (!this.stats[template.type]) this.stats[template.type] = template.value[Math.round(random(template.value.length-1, 0))];
        // @ts-expect-error
        else this.stats[template.type] += template.value[random(template.value.length, 0)];
      }
    });

    /* SET NEW NAME FOR ITEM */
    var mainResistance: string;
    var subResistance: string;

    if (Object.values(this.resistances).length == 1) {
      mainResistance = Object.keys(this.resistances)[0];
      subResistance = Object.keys(this.resistances)[0];
    }
    else {
      let max = -100;
      let _max = -100;
      Object.entries(this.resistances).forEach((dmg: any) => {
        if (dmg[1] > max) { max = dmg[1]; mainResistance = dmg[0]; }
      });
      Object.entries(this.resistances).forEach((dmg: any) => {
        if (dmg[1] == max && mainResistance != dmg[0]) {
          if (dmg[1] > _max) { _max = dmg[1]; subResistance = dmg[0]; }
        } else if(mainResistance != dmg[0]) {
          if (dmg[1] > _max) { _max = dmg[1]; subResistance = dmg[0]; }
        }
      });
    }

    // @ts-expect-error
    this.name = `${Object.values(this.resistances).length > 1 ? namePartsArmor[subResistance + "Sub"] : ""}${baseItem.name}${namePartsArmor[mainResistance + "Main"]}`;
  }
}