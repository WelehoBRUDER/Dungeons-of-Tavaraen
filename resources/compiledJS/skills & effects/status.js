"use strict";
class statEffect {
    constructor(base, modifiers) {
        var _a, _b, _c;
        // @ts-ignore
        if (!base)
            throw new Error("BASE EFFECT INVALID!");
        const defaultEffect = statusEffects[base.id];
        this.id = defaultEffect.id;
        this.name = defaultEffect.name;
        this.dot = setDOT(Object.assign({}, defaultEffect.dot));
        this.effects = effectsInit(Object.assign({}, defaultEffect.effects), this.id);
        this.last = { total: Math.floor((defaultEffect.last.total + modifiers.last.value) * modifiers.last.modif), current: Math.floor((defaultEffect.last.total + modifiers.last.value + 1) * modifiers.last.modif) };
        this.rooted = defaultEffect.rooted;
        this.type = defaultEffect.type;
        this.onRemove = defaultEffect.onRemove;
        this.textIcon = defaultEffect.textIcon;
        this.icon = defaultEffect.icon;
        this.aura = (_a = defaultEffect.aura) !== null && _a !== void 0 ? _a : "";
        this.silence = (_b = defaultEffect.silence) !== null && _b !== void 0 ? _b : false;
        this.break_concentration = (_c = defaultEffect.break_concentration) !== null && _c !== void 0 ? _c : false;
        function effectsInit(effects, id) {
            let total = effects;
            Object.entries(modifiers.effects).forEach((eff) => {
                const key = eff[0];
                const val = eff[1].value;
                const mod = eff[1].modif;
                const statusId = eff[1].status;
                if ((val !== 0 || mod !== 1) && statusId == id) {
                    var num = total[key];
                    if (!num)
                        num = 0;
                    total[key] = Math.floor(((num + val) * mod));
                }
            });
            // @ts-expect-error
            let entries = Object.entries(total).sort((a, b) => b[1] - a[1]);
            let sortedTotal = {};
            entries.forEach((entry) => {
                sortedTotal[entry[0]] = entry[1];
            });
            return sortedTotal;
        }
        function setDOT(defaultDot) {
            let dot = defaultDot;
            if (dot.damageAmount) {
                dot.damageAmount = Math.floor((dot.damageAmount + modifiers.damageAmount.value) * modifiers.damageAmount.modif);
            }
            else
                return null;
            return dot;
        }
    }
}
//# sourceMappingURL=status.js.map