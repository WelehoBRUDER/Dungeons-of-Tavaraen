"use strict";
class statEffect {
    name;
    dot;
    effects;
    last;
    type;
    onRemove;
    textIcon;
    icon;
    aura;
    silence;
    rooted;
    break_concentration;
    constructor(base) {
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
        this.aura = defaultEffect.aura ?? "";
        this.silence = defaultEffect.silence ?? false;
        this.break_concentration = defaultEffect.break_concentration ?? false;
    }
    init(bonuses) {
        if (!bonuses)
            bonuses = {};
        Object.entries(this).forEach(([key, value]) => {
            if (typeof value === "number") {
                let bonus = bonuses?.[key + "V"] || 0;
                let modifier = 1 + (bonuses?.[key + "P"] / 100 || 0);
                this[key] = +((value + bonus) * modifier).toFixed(2);
            }
            else if (typeof value === "object") {
                Object.entries(value).forEach(([_key, _value]) => {
                    if (!_value)
                        return;
                    if (typeof _value === "number") {
                        let bonus = bonuses?.[key]?.[_key + "V"] || 0;
                        let modifier = 1 + (bonuses?.[key]?.[_key + "P"] / 100 || 0);
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