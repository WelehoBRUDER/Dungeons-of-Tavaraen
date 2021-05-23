"use strict";
class Ability {
    constructor(base) {
        var _a, _b, _c, _d, _e;
        this.id = base.id;
        // @ts-ignore
        const baseAbility = abilities[this.id];
        this.name = baseAbility.name;
        this.mana_cost = (_a = baseAbility.mana_cost) !== null && _a !== void 0 ? _a : 0;
        this.cooldown = (_b = baseAbility.cooldown) !== null && _b !== void 0 ? _b : 0;
        this.onCooldown = (_c = base.onCooldown) !== null && _c !== void 0 ? _c : 0;
        this.equippedSlot = (_d = base.equippedSlot) !== null && _d !== void 0 ? _d : -1;
        this.damage_multiplier = (_e = baseAbility.damage_multiplier) !== null && _e !== void 0 ? _e : 1;
        this.icon = baseAbility.icon;
        this.use_range = baseAbility.use_range;
    }
}
