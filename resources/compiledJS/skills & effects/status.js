"use strict";
class statEffect {
    constructor(base) {
        var _a, _b, _c;
        // @ts-ignore
        if (!base)
            throw new Error("BASE EFFECT INVALID!");
        const defaultEffect = statusEffects[base.id];
        this.id = defaultEffect.id;
        this.name = defaultEffect.name;
        this.dot = defaultEffect.dot;
        this.effects = defaultEffect.effects;
        this.last = {
            total: defaultEffect.last.total,
            current: defaultEffect.last.total,
        };
        this.rooted = defaultEffect.rooted;
        this.type = defaultEffect.type;
        this.onRemove = defaultEffect.onRemove;
        this.textIcon = defaultEffect.textIcon;
        this.icon = defaultEffect.icon;
        this.aura = (_a = defaultEffect.aura) !== null && _a !== void 0 ? _a : "";
        this.silence = (_b = defaultEffect.silence) !== null && _b !== void 0 ? _b : false;
        this.break_concentration = (_c = defaultEffect.break_concentration) !== null && _c !== void 0 ? _c : false;
    }
    init(bonuses) {
        if (!bonuses)
            bonuses = {};
        Object.entries(this).forEach(([key, value]) => {
            if (typeof value === "number") {
                let bonus = (bonuses === null || bonuses === void 0 ? void 0 : bonuses[key + "V"]) || 0;
                let modifier = 1 + ((bonuses === null || bonuses === void 0 ? void 0 : bonuses[key + "P"]) / 100 || 0);
                this[key] = +((value + bonus) * modifier).toFixed(2);
            }
            else if (typeof value === "object") {
                Object.entries(value).forEach(([_key, _value]) => {
                    var _a, _b;
                    if (!_value)
                        return;
                    if (typeof _value === "number") {
                        let bonus = ((_a = bonuses === null || bonuses === void 0 ? void 0 : bonuses[key]) === null || _a === void 0 ? void 0 : _a[_key + "V"]) || 0;
                        let modifier = 1 + (((_b = bonuses === null || bonuses === void 0 ? void 0 : bonuses[key]) === null || _b === void 0 ? void 0 : _b[_key + "P"]) / 100 || 0);
                        this[key][_key] = +((_value + bonus) * modifier).toFixed(2);
                    }
                    else
                        updateObjectWithoutReturn(_key, _value, bonuses[key]);
                });
            }
        });
        return this;
    }
}
//# sourceMappingURL=status.js.map