"use strict";
class Consumable extends Item {
    status;
    ability;
    healValue;
    manaValue;
    usesTotal;
    usesRemaining;
    equippedSlot;
    fullPrice;
    stats;
    commands;
    constructor(base, setPrice = 0) {
        super(base);
        const baseItem = { ...items[this.id] };
        this.status = baseItem.status;
        this.ability = baseItem.status;
        this.healValue = baseItem.healValue;
        this.manaValue = baseItem.manaValue;
        this.usesTotal = baseItem.usesTotal ?? 1;
        this.usesRemaining = base.usesRemaining ?? 1;
        this.equippedSlot = base.equippedSlot ?? -1;
        this.statusesUser = baseItem.statusesUser ?? [];
        this.stats = {};
        this.commands = {};
        this.name = lang[this.id + "_name"] ?? baseItem.name;
        if (setPrice > 0)
            this.price = setPrice;
        if (setPrice > 0) {
            this.fullPrice = () => {
                return this.price;
            };
        }
        else
            this.fullPrice = () => {
                return this.price * this.amount;
            };
    }
}
//# sourceMappingURL=consumable.js.map