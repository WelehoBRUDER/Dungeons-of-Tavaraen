"use strict";
class PlayerCharacter extends Character {
    constructor(base) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        super(base);
        this.canFly = (_a = base.canFly) !== null && _a !== void 0 ? _a : false;
        this.sprite = (_b = base.sprite) !== null && _b !== void 0 ? _b : ".player";
        this.race = (_c = base.race) !== null && _c !== void 0 ? _c : "human";
        this.hair = (_d = base.hair) !== null && _d !== void 0 ? _d : 1;
        this.eyes = (_e = base.eyes) !== null && _e !== void 0 ? _e : 1;
        this.face = (_f = base.face) !== null && _f !== void 0 ? _f : 1;
        this.level = base.level;
        this.weapon = (_g = base.weapon) !== null && _g !== void 0 ? _g : {};
        this.offhand = (_h = base.offhand) !== null && _h !== void 0 ? _h : {};
        this.chest = (_j = base.chest) !== null && _j !== void 0 ? _j : {};
        this.helmet = (_k = base.helmet) !== null && _k !== void 0 ? _k : {};
        this.gloves = (_l = base.gloves) !== null && _l !== void 0 ? _l : {};
        this.boots = (_m = base.boots) !== null && _m !== void 0 ? _m : {};
        this.artifact1 = (_o = base.artifact1) !== null && _o !== void 0 ? _o : {};
        this.artifact2 = (_p = base.artifact2) !== null && _p !== void 0 ? _p : {};
        this.artifact3 = (_q = base.artifact3) !== null && _q !== void 0 ? _q : {};
        this.inventory = (_r = base.inventory) !== null && _r !== void 0 ? _r : [];
        this.hpRegen = () => {
            const { v: val, m: mod } = getModifiers(this, "hpRegen");
            return Math.floor((1 + val) * mod);
        };
        this.drop = (itm) => {
            const item = Object.assign({}, itm);
            this.inventory.splice(itm.index, 1);
            createDroppedItem(this.cords, item);
            renderInventory();
            modifyCanvas();
        };
        this.unequip = (event, slot) => {
            var _a;
            if (event.button !== 2)
                return;
            if ((_a = this[slot]) === null || _a === void 0 ? void 0 : _a.id) {
                this.inventory.push(this[slot]);
            }
            ;
            this[slot] = {};
            renderInventory();
        };
        this.equip = (event, item) => {
            if (event.button !== 2)
                return;
            const itm = Object.assign({}, item);
            player.inventory.splice(item.index, 1);
            this.unequip(event, itm.slot);
            this[itm.slot] = Object.assign({}, itm);
            renderInventory();
        };
        this.carryingWeight = () => {
            let total = 0;
            this.inventory.forEach(itm => {
                total += itm.weight;
            });
            return total.toFixed(1);
        };
        this.maxCarryWeight = () => {
            const { v: val, m: mod } = getModifiers(this, "carryStrength");
            return ((92.5 + val + this.getStats().str / 2 + this.getStats().vit) * mod).toFixed(1);
        };
    }
}
function updatePlayerInventoryIndexes() {
    for (let i = 0; i < player.inventory.length; i++) {
        player.inventory[i].index = i;
    }
}
function sortInventory(category, reverse) {
    sortingReverse = !sortingReverse;
    if (category == "name" || category == "type") {
        player.inventory.sort((a, b) => stringSort(a, b, category, reverse));
    }
    else
        player.inventory.sort((a, b) => numberSort(a, b, category, reverse));
    renderInventory();
}
function stringSort(a, b, string, reverse = false) {
    var nameA = a[string].toUpperCase(); // ignore upper and lowercase
    var nameB = b[string].toUpperCase(); // ignore upper and lowercase
    if (reverse) {
        if (nameA > nameB) {
            return -1;
        }
        if (nameA < nameB) {
            return 1;
        }
        // names must be equal
        return 0;
    }
    else {
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        // names must be equal
        return 0;
    }
}
;
function numberSort(a, b, string, reverse = false) {
    var numA = a[string];
    var numB = b[string];
    if (!reverse) {
        if (numA > numB) {
            return -1;
        }
        if (numA < numB) {
            return 1;
        }
        // names must be equal
        return 0;
    }
    else {
        if (numA < numB) {
            return -1;
        }
        if (numA > numB) {
            return 1;
        }
        // names must be equal
        return 0;
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
    weapon: new Weapon(Object.assign({}, items.longsword)),
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
    inventory: []
});
var randomProperty = function (obj) {
    var keys = Object.keys(obj);
    return obj[keys[keys.length * Math.random() << 0]];
};
for (let i = 0; i < 25; i++) {
    player.inventory.push(Object.assign({}, randomProperty(items)));
}
