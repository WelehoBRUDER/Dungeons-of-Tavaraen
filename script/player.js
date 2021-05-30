"use strict";
class PlayerCharacter extends Character {
    constructor(base) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        super(base);
        this.canFly = (_a = base.canFly) !== null && _a !== void 0 ? _a : false;
        this.sprite = (_b = base.sprite) !== null && _b !== void 0 ? _b : ".player";
        this.race = (_c = base.race) !== null && _c !== void 0 ? _c : "human";
        this.hair = (_d = base.hair) !== null && _d !== void 0 ? _d : 1;
        this.eyes = (_e = base.eyes) !== null && _e !== void 0 ? _e : 1;
        this.face = (_f = base.face) !== null && _f !== void 0 ? _f : 1;
        this.level = base.level;
        this.weapon = (_g = base.weapon) !== null && _g !== void 0 ? _g : {};
        this.chest = (_h = base.chest) !== null && _h !== void 0 ? _h : {};
        this.helmet = (_j = base.helmet) !== null && _j !== void 0 ? _j : {};
        this.gloves = (_k = base.gloves) !== null && _k !== void 0 ? _k : {};
        this.boots = (_l = base.boots) !== null && _l !== void 0 ? _l : {};
        this.hpRegen = () => {
            const { v: val, m: mod } = getModifiers(this, "hpRegen");
            return Math.floor((1 + val) * mod);
        };
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
    weapon: new Weapon(Object.assign({}, items.stick)),
    chest: new Armor(Object.assign({}, items.raggedShirt)),
    helmet: {},
    gloves: {},
    boots: new Armor(Object.assign({}, items.raggedBoots)),
    canFly: false,
    abilities: [
        new Ability(Object.assign({}, abilities.attack), dummy),
        new Ability(Object.assign(Object.assign({}, abilities.focus_strike), { equippedSlot: 0 }), dummy),
        new Ability(Object.assign(Object.assign({}, abilities.true_shot), { equippedSlot: 1 }), dummy),
        new Ability(Object.assign(Object.assign({}, abilities.first_aid), { equippedSlot: 2 }), dummy),
        new Ability(Object.assign(Object.assign({}, abilities.icy_javelin), { equippedSlot: 3 }), dummy),
        new Ability(Object.assign(Object.assign({}, abilities.barbarian_rage), { equippedSlot: 4 }), dummy),
        new Ability(Object.assign(Object.assign({}, abilities.berserk), { equippedSlot: 5 }), dummy)
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
        new statEffect(Object.assign({}, statusEffects.poison), s_def)
    ],
});
