interface ability {
  id: string;
  name: string;
  mana_cost: number;
  cooldown: number;
  onCooldown?: number;
  equippedSlot?: number;
  damages?: damageClass;
  damage_multiplier: number;
  icon: string;
  use_range: string;
}

class Ability {
  id: string;
  name: string;
  mana_cost: number;
  cooldown: number;
  onCooldown?: number;
  equippedSlot?: number;
  damages?: damageClass;
  damage_multiplier: number;
  icon: string;
  use_range: string;
  constructor(base: ability) {
    this.id = base.id;
    // @ts-ignore
    const baseAbility = abilities[this.id];
    this.name = baseAbility.name;
    this.mana_cost = baseAbility.mana_cost ?? 0;
    this.cooldown = baseAbility.cooldown ?? 0;
    this.onCooldown = base.onCooldown ?? 0;
    this.equippedSlot = base.equippedSlot ?? -1;
    this.damage_multiplier = baseAbility.damage_multiplier ?? 1;
    this.icon = baseAbility.icon;
    this.use_range = baseAbility.use_range;
  }
}