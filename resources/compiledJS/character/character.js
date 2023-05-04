"use strict";
const baseSpeed = {
    movement: 100,
    attack: 100,
    movementFill: 0,
    attackFill: 0,
};
class Character {
    id;
    name;
    cords;
    stats;
    armor;
    resistances;
    statusResistances;
    abilities;
    weapon;
    offhand;
    chest;
    helmet;
    gloves;
    boots;
    legs;
    artifact1;
    artifact2;
    artifact3;
    isFoe;
    kill;
    xp;
    threat;
    traits;
    statusEffects;
    getStats;
    getResists;
    getArmor;
    getStatusResists;
    effects;
    updateAbilities;
    updateTraits;
    aura;
    regen;
    hit;
    silenced;
    concentration;
    statRemaining;
    hpRemain;
    mpRemain;
    getThreat;
    getHpMax;
    getMpMax;
    getRegen;
    getHitchance;
    isRooted;
    scale;
    allModifiers;
    inventory;
    speed;
    getSpeed;
    doNormalAttack;
    addEffect;
    spriteMap;
    constructor(base) {
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
        if (Object.keys(this.armor).length < 1)
            this.armor = { physical: 0, magical: 0, elemental: 0 };
        this.getStats = (withConditions = true) => {
            let stats = {};
            baseStats.forEach((stat) => {
                if (!this.allModifiers[stat + "V"])
                    this.allModifiers[stat + "V"] = 0;
                if (!this.allModifiers[stat + "P"])
                    this.allModifiers[stat + "P"] = 1;
                stats[stat] = Math.floor((this.stats[stat] + this.allModifiers[stat + "V"]) * this.allModifiers[stat + "P"]);
                stats[stat] > 100 ? (stats[stat] = Math.floor(100 + (stats[stat] - 100) / 17)) : "";
            });
            if (!this.allModifiers["critDamageV"])
                this.allModifiers["critDamageV"] = 0;
            if (!this.allModifiers["critDamageP"])
                this.allModifiers["critDamageP"] = 1;
            if (!this.allModifiers["critChanceV"])
                this.allModifiers["critChanceV"] = 0;
            if (!this.allModifiers["critChanceP"])
                this.allModifiers["critChanceP"] = 1;
            if (!this.allModifiers["movementSpeedV"])
                this.allModifiers["movementSpeedV"] = 0;
            if (!this.allModifiers["attackSpeedV"])
                this.allModifiers["attackSpeedV"] = 0;
            stats["critDamage"] = Math.floor(this.allModifiers["critDamageV"] + (this.allModifiers["critDamageP"] - 1) * 100 + stats["cun"] * 1.5 + 18.5);
            stats["critChance"] = Math.floor(this.allModifiers["critChanceV"] + (this.allModifiers["critChanceP"] - 1) * 100 + stats["cun"] * 0.4 + 4.6);
            return stats;
        };
        this.getSpeed = () => {
            let speed = {};
            speed.movement = this.speed.movement + this.allModifiers["movementSpeedV"];
            speed.attack = this.speed.attack + this.allModifiers["attackSpeedV"];
            return { ...speed };
        };
        this.getHpMax = (withConditions = true) => {
            let hpMax = 0;
            const { v: hp_val, m: hp_mod } = getModifiers(this, "hpMax", withConditions);
            const { v: vitVal, m: vitMod } = getModifiers(this, "vit", withConditions);
            let vit = Math.floor((this.stats.vit + vitVal) * vitMod);
            hpMax = Math.floor(((this.stats?.hpMax ?? 20) + hp_val + vit * 5) * hp_mod);
            return hpMax < 0 ? 0 : hpMax;
        };
        this.getMpMax = (withConditions = true) => {
            let mpMax = 0;
            const { v: mp_val, m: mp_mod } = getModifiers(this, "mpMax", withConditions);
            const { v: intVal, m: intMod } = getModifiers(this, "int", withConditions);
            let int = Math.floor((this.stats.int + intVal) * intMod);
            mpMax = Math.floor(((this.stats?.hpMax ?? 10) + mp_val + int * 2) * mp_mod);
            return mpMax < 0 ? 0 : mpMax;
        };
        this.getHitchance = () => {
            const chances = {
                chance: 0,
                evasion: 0,
            };
            if (!this.allModifiers["hitChanceV"])
                this.allModifiers["hitChanceV"] = 0;
            if (!this.allModifiers["hitChanceP"])
                this.allModifiers["hitChanceP"] = 1;
            if (!this.allModifiers["evasionV"])
                this.allModifiers["evasionV"] = 0;
            if (!this.allModifiers["evasionP"])
                this.allModifiers["evasionP"] = 1;
            chances["chance"] = Math.floor((this.hit?.chance + this.allModifiers["hitChanceV"] + this.stats["dex"] * 0.25) * this.allModifiers["hitChanceP"]);
            chances["evasion"] = Math.floor((this.hit?.evasion + this.allModifiers["evasionV"] + this.stats["dex"] * 0.25) * this.allModifiers["evasionP"]);
            return chances;
        };
        this.getResists = () => {
            let resists = {};
            Object.keys(this.resistances).forEach((res) => {
                const { v: val, m: mod } = getModifiers(this, res + "Resist");
                const { v: _val, m: _mod } = getModifiers(this, "resistAll");
                let value = Math.floor((this.resistances[res] + val) * mod);
                resists[res] = Math.floor((value + _val) * _mod);
                if (resists[res] > 100)
                    resists[res] = 100;
            });
            return resists;
        };
        this.getArmor = () => {
            let armors = {};
            Object.keys(this.armor).forEach((armor) => {
                const { v: val, m: mod } = getModifiers(this, armor + "Def");
                armors[armor] = Math.floor((this.armor[armor] + val) * mod);
            });
            return armors;
        };
        this.getArmorReduction = () => {
            const armors = this.getArmor();
            let reductions = {};
            Object.keys(armors).forEach((armor) => {
                // Get the armor value
                const armorValue = armors[armor];
                // Then we calculate the reduction
                reductions[armor] = +(1 - 1 / (1 + armorValue / 100)).toFixed(3);
            });
            return reductions;
        };
        this.getThreat = () => {
            if (!this.allModifiers["threatV"])
                this.allModifiers["threatV"] = 0;
            if (!this.allModifiers["threatP"])
                this.allModifiers["threatP"] = 1;
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
            let hpRegen = (hpRegenBase + this.getHpMax() * 0.006 + hpRegenVit) * hpRegenPercent;
            let mpRegen = (mpRegenBase + this.getMpMax() * 0.006 + mpRegenInt) * mpRegenPercent;
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
            this.statusEffects.forEach((eff) => {
                if (eff.rooted) {
                    rooted = true;
                    return;
                }
            });
            return rooted;
        };
        this.getStatusResists = () => {
            let resists = {};
            Object.keys(this.statusResistances).forEach((res) => {
                if (!this.allModifiers[res + "DefenseV"])
                    this.allModifiers[res + "DefenseV"] = 0;
                if (!this.allModifiers[res + "DefenseP"])
                    this.allModifiers[res + "DefenseP"] = 1;
                resists[res] = Math.floor((this.statusResistances[res] + this.allModifiers[res + "DefenseV"]) * this.allModifiers[res + "DefenseP"]);
            });
            return resists;
        };
        this.statRemaining = (stat) => {
            return ((this.stats[stat] / this.getStats()[stat + "Max"]) * 100);
        };
        this.effects = () => {
            this.statusEffects.forEach((status, index) => {
                if (status.dot) {
                    const dmg = Math.floor(status.dot.damageAmount * (1 - this.getStatusResists()[status.dot.damageType] / 100));
                    this.stats.hp -= dmg;
                    spawnFloatingText(this.cords, dmg.toString(), "red", 32);
                    let effectText = this.id == "player" ? lang["damage_from_effect_pl"] : lang["damage_from_effect"];
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
            this.abilities?.forEach((abi) => {
                if (abi.onCooldown > 0) {
                    if (abi.recharge_only_in_combat) {
                        if (state.inCombat)
                            abi.onCooldown--;
                    }
                    else
                        abi.onCooldown--;
                }
            });
        };
        this.addEffect = (effect, modifiers = {}) => {
            if (!effect?.id) {
                effect = new statEffect({ ...statusEffects[effect] });
            }
            let missing = true;
            this.statusEffects.forEach((_effect) => {
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
        this.doNormalAttack = async (target) => {
            // @ts-expect-error
            const reach = this.id === "player" ? this.weapon?.range : this.attackRange;
            let attacks = 1;
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
                    if (target.stats.hp <= 0)
                        break;
                    // @ts-expect-error
                    const projectile = this.weapon?.firesProjectile || this.shootsProjectile;
                    const isPlayer = this.id === "player";
                    fireProjectile(this.cords, target.cords, projectile, this.abilities.find((e) => e.id === "attack"), isPlayer, this);
                    await helper.sleep(110);
                }
            }
            else {
                for (let i = attacks; i > 0; i--) {
                    if (target.stats.hp <= 0)
                        break;
                    // @ts-expect-error
                    attackTarget(this, target, weaponReach(this, reach, target));
                    regularAttack(this, target, this.abilities.find((e) => e.id === "attack"));
                    await helper.sleep(110);
                }
            }
            if (this.id === "player")
                advanceTurn();
            else if (this.isFoe)
                updateEnemiesTurn();
        };
        this.abilities = [...base.abilities] ?? [];
        this.silenced = () => {
            let result = false;
            this.statusEffects.forEach((eff) => {
                if (eff.silence) {
                    result = true;
                    return;
                }
            });
            return result;
        };
        this.concentration = () => {
            let result = true;
            this.statusEffects.forEach((eff) => {
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
        this.updateAbilities = (useDummy = false) => {
            this.allModifiers = getAllModifiersOnce(this);
            if (!this.allModifiers["damageV"])
                this.allModifiers["damageV"] = 0;
            if (!this.allModifiers["damageP"])
                this.allModifiers["damageP"] = 1;
            for (let i = 0; i < this.abilities?.length; i++) {
                if (!useDummy)
                    this.abilities[i] = new Ability(this.abilities[i], this);
                else
                    this.abilities[i] = new Ability(this.abilities[i], dummy);
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
                    if (this.inventory[i].type == "weapon")
                        this.inventory[i] = new Weapon({ ...this.inventory[i] });
                    else if (this.inventory[i].type == "armor")
                        this.inventory[i] = new Armor({ ...this.inventory[i] });
                    else if (this.inventory[i].type == "consumable")
                        this.inventory[i] = new Consumable({ ...this.inventory[i] });
                    else if (this.inventory[i].type == "artifact")
                        this.inventory[i] = new Artifact({ ...this.inventory[i] });
                    if (!this.inventory[i].indexInBaseArray)
                        continue;
                    let encounter = player.entitiesEverEncountered?.items?.[this.inventory[i].id];
                    if (encounter < 1 || !encounter) {
                        player.entitiesEverEncountered.items[this.inventory[i].id] = 1;
                    }
                }
            }
            if (this.weapon?.type)
                this.weapon = new Weapon({ ...this.weapon });
            if (this.offhand?.type)
                this.offhand = new Armor({ ...this.offhand });
            if (this.chest?.type)
                this.chest = new Armor({ ...this.chest });
            if (this.legs?.type)
                this.legs = new Armor({ ...this.legs });
            if (this.helmet?.type)
                this.helmet = new Armor({ ...this.helmet });
            if (this.gloves?.type)
                this.gloves = new Armor({ ...this.gloves });
            if (this.boots?.type)
                this.boots = new Armor({ ...this.boots });
            if (this.artifact1?.type)
                this.artifact1 = new Artifact({ ...this.artifact1 });
            if (this.artifact2?.type)
                this.artifact2 = new Artifact({ ...this.artifact2 });
            if (this.artifact3?.type)
                this.artifact3 = new Artifact({ ...this.artifact3 });
        };
        this.updateTraits = () => {
            this.traits.forEach((mod, index) => {
                if (mod.name)
                    mod.id = mod.name.replaceAll(" ", "_").toLowerCase();
                let modifier = new PermanentStatModifier(mod);
                this.traits[index] = modifier;
            });
            const purgeList = {};
            for (let i = this.traits.length - 1; i >= 0; i--) {
                if (!purgeList[this.traits[i].id])
                    purgeList[this.traits[i].id] = 1;
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
//# sourceMappingURL=character.js.map