"use strict";
class Consumable extends Item {
    constructor(base, setPrice = 0) {
        var _a, _b, _c, _d, _e;
        super(base);
        const baseItem = { ...items[this.id] };
        this.status = baseItem.status;
        this.ability = baseItem.status;
        this.healValue = baseItem.healValue;
        this.manaValue = baseItem.manaValue;
        this.usesTotal = (_a = baseItem.usesTotal) !== null && _a !== void 0 ? _a : 1;
        this.usesRemaining = (_b = base.usesRemaining) !== null && _b !== void 0 ? _b : 1;
        this.equippedSlot = (_c = base.equippedSlot) !== null && _c !== void 0 ? _c : -1;
        this.statusesUser = (_d = baseItem.statusesUser) !== null && _d !== void 0 ? _d : [];
        this.modifiers = getAbiStatusModifiers(dummy, "attack", "dazed");
        this.stats = {};
        this.commands = {};
        this.name = (_e = lang[this.id + "_name"]) !== null && _e !== void 0 ? _e : baseItem.name;
        if (setPrice > 0)
            this.price = setPrice;
        if (setPrice > 0) {
            this.fullPrice = () => { return this.price; };
        }
        else
            this.fullPrice = () => { return this.price * this.amount; };
    }
}
//# sourceMappingURL=consumable.js.map