interface DoT {
	[damageType: string]: any;
	damageAmount: number;
	icon: string;
}

interface statusTime {
	[total: string]: number;
	current: number;
}

interface statusEffect {
	[id: string]: any;
	name: string;
	dot?: DoT;
	effects?: traits;
	last: statusTime;
	type: string;
	onRemove?: Function;
	textIcon: string;
	icon: string;
	aura?: string;
	silence?: boolean;
	break_concentration?: boolean;
}

class statEffect {
	[id: string]: string | any;
	name: string;
	dot?: DoT;
	effects?: traits;
	last: statusTime;
	type: string;
	onRemove?: Function;
	textIcon: string;
	icon: string;
	aura?: string;
	silence?: boolean;
	rooted?: boolean;
	break_concentration?: boolean;
	constructor(base: statusEffect) {
		// @ts-ignore
		if (!base) throw new Error("BASE EFFECT INVALID!");
		const defaultEffect: statusEffect = { ...statusEffects[base.id] };
		this.id = defaultEffect.id;
		this.name = defaultEffect.name;
		this.dot = { ...defaultEffect?.dot };
		this.effects = { ...defaultEffect.effects };
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

	init(bonuses: any) {
		if (!bonuses) bonuses = {};
		Object.entries(this).forEach(([key, value]) => {
			if (typeof value === "number") {
				let bonus = bonuses?.[key + "V"] || 0;
				let modifier = 1 + (bonuses?.[key + "P"] / 100 || 0);
				this[key] = +((value + bonus) * modifier).toFixed(2);
			} else if (typeof value === "object") {
				Object.entries(value).forEach(([_key, _value]) => {
					if (!_value) return;
					if (typeof _value === "number") {
						let bonus = bonuses?.[key]?.[_key + "V"] || 0;
						let modifier = 1 + (bonuses?.[key]?.[_key + "P"] / 100 || 0);
						this[key][_key] = +((_value + bonus) * modifier).toFixed(2);
					} else updateObjectWithoutReturn(_key, _value, bonuses[key]);
				});
			}
		});
		Object.entries(bonuses).forEach(([bonusKey, bonusValue]: [string, any]) => {
			if (bonusKey === "effects") {
				Object.entries(bonusValue).forEach(([key, value]) => {
					const _key = key.substring(0, key.length - 1);
					if (!this.effects[_key] && typeof value === "number") {
						this.effects[_key] = value;
					}
				});
			}
			if (typeof bonusValue === "boolean") {
				if (bonusValue) {
					this[bonusKey] = true;
				} else {
					delete this[bonusKey];
				}
			}
		});

		return this;
	}
}
