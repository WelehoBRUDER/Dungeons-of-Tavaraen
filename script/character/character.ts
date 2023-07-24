//@ts-nocheck
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
  [key: string]: any;
  id: string;
  name: string;
  cords: tileObject;
  stats: stats;
  resistances: resistances;
  statusResistances: statusResistances;
  abilities: ability[];
  weapon?: weaponClass | any;
  offhand?: armorClass | any;
  chest?: armorClass | any;
  helmet?: armorClass | any;
  gloves?: armorClass | any;
  boots?: armorClass | any;
  legs?: armorClass | any;
  artifact1?: Artifact | any;
  artifact2?: Artifact | any;
  artifact3?: Artifact | any;
  isFoe?: boolean;
  kill?: Function;
  xp?: number;
  regen?: any;
  hit?: any;
  threat: number;
  traits?: any;
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
  addEffect?: Function;
  spriteMap?: tileObject;
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

const baseSpeed = {
  movement: 100,
  attack: 100,
  movementFill: 0,
  attackFill: 0,
} as any;

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
  traits?: any;
  statusEffects?: any;
  getStats?: Function;
  getResists?: Function;
  getArmor?: Function;
  getStatusResists?: Function;
  effects?: Function;
  updateAbilities?: Function;
  updateTraits?: Function;
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
  speed?: any;
  getSpeed?: Function;
  doNormalAttack?: Function;
  addEffect?: Function;
  spriteMap?: tileObject;
  constructor(base: characterObject) {
    this.id = base.id;
    this.name = base.name ?? "name_404";
    this.cords = base.cords ?? { x: 0, y: 0 };
    this.stats = { ...base.stats };
    this.armor = { ...base.armor } ?? { physical: 0, magical: 0, elemental: 0 };
    this.resistances = { ...base.resistances };
    this.statusResistances = { ...base.statusResistances };
    this.traits = base.traits ? [...base.traits] : [];
    this.statusEffects = base.statusEffects ? [...base.statusEffects] : [];
    this.threat = base.threat ?? 25;
    this.regen = base.regen ?? { hp: 0, mp: 0 };
    this.hit = { ...base.hit } ?? { chance: 10, evasion: 5 };
    this.scale = base.scale ?? 1;
    this.allModifiers = {};
    this.speed = base.speed ? { ...base.speed } : { ...baseSpeed };
    this.spriteMap = base.spriteMap ? { ...base.spriteMap } : null;

    if (Object.keys(this.armor).length < 1) this.armor = { physical: 0, magical: 0, elemental: 0 };

    this.getStats = () => {
      let stats = {} as statusObject;
      baseStats.forEach((stat: string) => {
        if (!this.allModifiers[stat + "V"]) this.allModifiers[stat + "V"] = 0;
        if (!this.allModifiers[stat + "P"]) this.allModifiers[stat + "P"] = 1;
        stats[stat] = Math.floor((this.stats[stat] + this.allModifiers[stat + "V"]) * this.allModifiers[stat + "P"]);
        stats[stat] > 100 ? (stats[stat] = Math.floor(100 + (stats[stat] - 100) / 17)) : "";
      });
      if (!this.allModifiers["critDamageV"]) this.allModifiers["critDamageV"] = 0;
      if (!this.allModifiers["critDamageP"]) this.allModifiers["critDamageP"] = 1;
      if (!this.allModifiers["critChanceV"]) this.allModifiers["critChanceV"] = 0;
      if (!this.allModifiers["critChanceP"]) this.allModifiers["critChanceP"] = 1;
      if (!this.allModifiers["movementSpeedV"]) this.allModifiers["movementSpeedV"] = 0;
      if (!this.allModifiers["attackSpeedV"]) this.allModifiers["attackSpeedV"] = 0;
      stats["critDamage"] = Math.floor(
        this.allModifiers["critDamageV"] + (this.allModifiers["critDamageP"] - 1) * 100 + stats["cun"] * 1.5 + 18.5
      );
      stats["critChance"] = Math.floor(
        this.allModifiers["critChanceV"] + (this.allModifiers["critChanceP"] - 1) * 100 + stats["cun"] * 0.4 + 4.6
      );
      return stats;
    };

    this.getSpeed = () => {
      let speed = {} as any;
      speed.movement = this.speed.movement + this.allModifiers["movementSpeedV"];
      speed.attack = this.speed.attack + this.allModifiers["attackSpeedV"];
      return { ...speed };
    };

    this.getHpMax = () => {
      const hpFlat = this.allModifiers["hpMaxV"] || 0;
      const hpModifier = this.allModifiers["hpMaxP"] || 1;
      const vit = this.getStats().vit;
      const levelBonus = this.allModifiers["hpMaxPerLevelV"] || 0;

      return Math.max(Math.floor(((this.stats?.hpMax ?? 20) + hpFlat + levelBonus + vit * 3) * hpModifier), 0);
    };

    this.getMpMax = () => {
      const mpFlat = this.allModifiers["mpMaxV"] || 0;
      const mpModifier = this.allModifiers["mpMaxP"] || 1;
      const int = this.getStats().int;

      return Math.max(Math.floor(((this.stats?.hpMax ?? 10) + mpFlat + int * 2) * mpModifier), 0);
    };

    this.getHitchance = () => {
      const chances = {
        chance: 0,
        evasion: 0,
      };
      if (!this.allModifiers["hitChanceV"]) this.allModifiers["hitChanceV"] = 0;
      if (!this.allModifiers["hitChanceP"]) this.allModifiers["hitChanceP"] = 1;
      if (!this.allModifiers["evasionV"]) this.allModifiers["evasionV"] = 0;
      if (!this.allModifiers["evasionP"]) this.allModifiers["evasionP"] = 1;
      chances["chance"] = Math.floor(
        (this.hit?.chance + this.allModifiers["hitChanceV"] + this.stats["dex"] * 0.25) * this.allModifiers["hitChanceP"]
      );
      chances["evasion"] = Math.floor(
        (this.hit?.evasion + this.allModifiers["evasionV"] + this.stats["dex"] * 0.25) * this.allModifiers["evasionP"]
      );
      return chances;
    };

    this.getResists = () => {
      let resists = {} as resistances;
      Object.keys(this.resistances).forEach((res: string) => {
        const specificFlat = this.allModifiers[res + "ResistV"] || 0;
        const allFlat = this.allModifiers["resistAllV"] || 0;
        let value = Math.floor(this.resistances[res] + specificFlat);
        resists[res] = Math.floor(value + allFlat);
        if (resists[res] > 100) resists[res] = 100;
      });
      return resists;
    };

    this.getArmor = () => {
      let armors = {} as defenseClass;
      Object.keys(this.armor).forEach((armor: string) => {
        const armorFlat = this.allModifiers[armor + "ArmorV"] || 0;
        const armorModifier = this.allModifiers[armor + "ArmorP"] || 1;
        armors[armor] = Math.floor((this.armor[armor] + armorFlat) * armorModifier);
        if (armors[armor] < 0) armors[armor] = 0;
      });
      return armors;
    };

    this.getArmorReduction = () => {
      const armors = this.getArmor();
      let reductions = {} as defenseClass;
      Object.keys(armors).forEach((armor: string) => {
        // Get the armor value
        const armorValue = armors[armor];
        // Then we calculate the reduction
        reductions[armor] = +(1 - 1 / (1 + armorValue / 100)).toFixed(3);
      });
      return reductions;
    };

    this.getThreat = () => {
      if (!this.allModifiers["threatV"]) this.allModifiers["threatV"] = 0;
      if (!this.allModifiers["threatP"]) this.allModifiers["threatP"] = 1;
      return (this.threat + this.allModifiers["threatV"]) * this.allModifiers["threatP"];
    };

    this.getRegen = () => {
      let stats = this.getStats();
      let hpRegenBase = this.regen.hp;
      let hpRegenVit = 0;
      let hpRegenPercent = 1;
      let mpRegenBase = this.regen.mp;
      let mpRegenInt = 0;
      let mpRegenPercent = 1;

      if (this.allModifiers.regenHpV) {
        hpRegenVit += this.allModifiers.regenHpV;
      }
      if (this.allModifiers.regenHpP) {
        hpRegenPercent += this.allModifiers.regenHpP;
      }
      if (this.allModifiers.regenMpV) {
        mpRegenInt += this.allModifiers.regenMpV;
      }
      if (this.allModifiers.regenMpP) {
        mpRegenPercent += this.allModifiers.regenMpP;
      }

      let hpRegen = (hpRegenBase + this.getHpMax() * 0.004 + hpRegenVit) * hpRegenPercent;
      let mpRegen = (mpRegenBase + this.getMpMax() * 0.004 + mpRegenInt) * mpRegenPercent;

      if (hpRegen < 0) {
        hpRegen = 0;
      }
      if (mpRegen < 0) {
        mpRegen = 0;
      }

      return {
        hp: hpRegen * (1 + stats.vit / 100),
        mp: mpRegen * (1 + stats.int / 100),
      };
    };

    this.isRooted = () => {
      let rooted = false;
      this.statusEffects.forEach((eff: any) => {
        if (eff.rooted) {
          rooted = true;
          return;
        }
      });
      return rooted;
    };

    this.getStatusResists = () => {
      let resists = {} as statusResistances;
      Object.keys(this.statusResistances).forEach((res: string) => {
        if (!this.allModifiers[res + "DefenseV"]) this.allModifiers[res + "DefenseV"] = 0;
        if (!this.allModifiers[res + "DefenseP"]) this.allModifiers[res + "DefenseP"] = 1;
        resists[res] = Math.floor(
          (this.statusResistances[res] + this.allModifiers[res + "DefenseV"]) * this.allModifiers[res + "DefenseP"]
        );
      });
      return resists;
    };

    this.statRemaining = (stat: string) => {
      return <number>((this.stats[stat] / this.getStats()[stat + "Max"]) * 100);
    };

    this.effects = () => {
      this.statusEffects.forEach((status: statEffect, index: number) => {
        if (Object.keys(status.dot).length > 0) {
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
          } else abi.onCooldown--;
        }
      });
    };

    this.addEffect = (effect, modifiers = {}) => {
      if (!effect?.id) {
        effect = new statEffect({ ...statusEffects[effect] });
      }
      let missing = true;
      this.statusEffects.forEach((_effect: statEffect) => {
        if (_effect.id == effect.id) {
          _effect.last.current = effect.last.total;
          missing = false;
          return;
        }
      });
      if (missing) {
        effect.init(modifiers);
        this.statusEffects.push({ ...effect });
      }
    };

    this.doNormalAttack = async (target: any) => {
      // @ts-expect-error
      const reach: number = this.id === "player" ? this.weapon?.range : this.attackRange;
      let attacks: number = 1;
      this.speed.attackFill += this.getSpeed().attack - 100;
      while (this.speed.attackFill >= 100) {
        this.speed.attackFill -= 100;
        attacks++;
      }
      if (this.speed.attackFill <= -150) {
        this.speed.attackFill += 200;
        attacks--;
      }
      // @ts-expect-error
      if (this.weapon?.firesProjectile || this.shootsProjectile) {
        for (let i = attacks; i > 0; i--) {
          if (target.stats.hp <= 0) break;
          // @ts-expect-error
          const projectile = this.weapon?.firesProjectile || this.shootsProjectile;
          const isPlayer = this.id === "player";
          fireProjectile(
            this.cords,
            target.cords,
            projectile,
            this.abilities.find((e) => e.id === "attack"),
            isPlayer,
            this
          );
          await helper.sleep(110);
        }
      } else {
        for (let i = attacks; i > 0; i--) {
          if (target.stats.hp <= 0) break;
          // @ts-expect-error
          attackTarget(this, target, weaponReach(this, reach, target));
          regularAttack(
            this,
            target,
            this.abilities.find((e) => e.id === "attack")
          );
          await helper.sleep(110);
        }
      }
      if (this.id === "player") advanceTurn();
      else if (this.isFoe) updateEnemiesTurn();
    };

    this.abilities = [...base.abilities] ?? [];

    this.silenced = () => {
      let result = false;
      this.statusEffects.forEach((eff: statEffect) => {
        if (eff.silence) {
          result = true;
          return;
        }
      });
      return result;
    };

    this.concentration = () => {
      let result = true;
      this.statusEffects.forEach((eff: statEffect) => {
        if (eff.break_concentration) {
          result = false;
          return;
        }
      });
      return result;
    };

    this.hpRemain = () => {
      return (this.stats.hp / this.getHpMax(false)) * 100;
    };

    this.mpRemain = () => {
      return (this.stats.mp / this.getMpMax(false)) * 100;
    };

    this.updateAllModifiers = () => {
      this.allModifiers = getAllModifiersOnce(this, true);
      if (!this.allModifiers["damageV"]) this.allModifiers["damageV"] = 0;
      if (!this.allModifiers["damageP"]) this.allModifiers["damageP"] = 1;
    };

    this.updateAbilities = (useDummy: boolean = false) => {
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
          }
          this.inventory[i].index = i;
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

    this.updateTraits = () => {
      this.traits.forEach((mod: PermanentStatModifier, index: number) => {
        if (mod.name) mod.id = mod.name.replaceAll(" ", "_").toLowerCase();
        let modifier = new PermanentStatModifier(mod);
        this.traits[index] = modifier;
      });
      const purgeList = {};
      for (let i = this.traits.length - 1; i >= 0; i--) {
        if (!purgeList[this.traits[i].id]) purgeList[this.traits[i].id] = 1;
        else {
          this.traits.splice(i, 1);
        }
      }
    };
  }
}
const dummy = new Character({
  id: "dummy",
  name: "dummy",
  cords: { x: 0, y: 0 },
  stats: {
    str: 1,
    dex: 1,
    int: 1,
    vit: 0,
    hp: 10000,
    mp: 0,
    hpMax: 10000,
    mpMax: 0,
  },
  resistances: {
    slash: 0,
    crush: 0,
    pierce: 0,
    dark: 0,
    divine: 0,
    magic: 0,
    fire: 0,
    lightning: 0,
    ice: 0,
  },
  statusResistances: {
    poison: 0,
    burning: 0,
    curse: 0,
    stun: 0,
    bleed: 0,
  },
  xp: 10,
  abilities: [],
});

const baseStats = ["str", "vit", "dex", "int", "cun"];

// let ley = new Character({
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
