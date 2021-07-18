interface ability {
  id: string;
  name: string;
  mana_cost: number;
  cooldown: number;
  type: string;
  onCooldown?: number;
  equippedSlot?: number;
  damages?: damageClass;
  resistance_penetration?: number;
  base_heal?: number;
  damage_multiplier?: number;
  shoots_projectile?: string;
  stat_bonus?: string;
  status?: string;
  line?: string;
  icon: string;
  use_range: string;
  requires_melee_weapon?: boolean;
  requires_ranged_weapon?: boolean;
  requires_concentration?: boolean;
  self_target?: boolean;
  statusModifiers?: any;
  action_desc: string;
  action_desc_pl: string;
  ai_chance?: number;
  remove_status: Array<string>
}

const straight_modifiers = [
  "mana_cost",
  "cooldown",
  "resistance_penetration",
  "base_heal",
  "damage_multiplier",
  "use_range",
];

const less_is_better = {
  mana_cost: true,
  cooldown: true,
  resistance_penetration: false,
  base_heal: false,
  damage_multiplier: false,
  use_range: false
};

const possible_stat_modifiers = [
  "strV",
  "strP",
  "vitV",
  "vitP",
  "dexV",
  "dexP",
  "intV",
  "intP",
  "hpV",
  "hpP",
  "mpV",
  "mpP",
];

const possible_modifiers = [
  "last"
];

class Ability {
  id: string;
  name: string;
  mana_cost: number;
  cooldown: number;
  type: string;
  onCooldown?: number;
  equippedSlot?: number;
  damages?: damageClass;
  resistance_penetration?: number;
  base_heal?: number;
  damage_multiplier?: number;
  shoots_projectile?: string;
  stat_bonus?: string;
  status?: string;
  line?: string;
  icon: string;
  use_range: string;
  requires_melee_weapon?: boolean;
  requires_ranged_weapon?: boolean;
  requires_concentration?: boolean;
  self_target?: boolean;
  statusModifiers?: any;
  action_desc: string;
  action_desc_pl: string;
  ai_chance?: number;
  remove_status: Array<string>;
  constructor(base: ability, user: characterObject) {
    this.id = base.id;
    const values = getAbiModifiers(user, base.id);
    // @ts-ignore
    const baseAbility = abilities[this.id];
    const statusModifiers = getAbiStatusModifiers(user, base.id, baseAbility.status);
    this.name = baseAbility.name;
    this.mana_cost = Math.floor((baseAbility.mana_cost + values.mana_cost.value) * values.mana_cost.modif) ?? 0;
    this.cooldown = Math.floor((baseAbility.cooldown + values.cooldown.value) * values.cooldown.modif) ?? 0;
    this.type = baseAbility.type ?? "none";
    this.onCooldown = base.onCooldown ?? 0;
    this.equippedSlot = base.equippedSlot ?? -1;
    this.damages = baseAbility.damages;
    this.damage_multiplier = (baseAbility.damage_multiplier + values.damage_multiplier.value + (values.damage_multiplier.modif - 1)) ?? 1;
    this.resistance_penetration = Math.floor((baseAbility.resistance_penetration + values.resistance_penetration.value +( values.resistance_penetration.modif - 1))) ?? 0;
    this.base_heal = Math.floor((baseAbility.base_heal + values.base_heal.value) * values.base_heal.modif) ?? 0;
    this.stat_bonus = baseAbility.stat_bonus ?? "";
    this.status = baseAbility.status ?? "";
    this.shoots_projectile = baseAbility.shoots_projectile ?? "";
    this.icon = baseAbility.icon;
    this.line = baseAbility.line ?? "";
    this.use_range = typeof parseInt(baseAbility.use_range) === 'number' ? Math.floor(((parseInt(baseAbility.use_range) + values.use_range.value) * values.use_range.modif)).toString() : baseAbility.use_range;
    this.requires_melee_weapon = baseAbility.requires_melee_weapon ?? false;
    this.requires_ranged_weapon = baseAbility.requires_ranged_weapon ?? false;
    this.requires_concentration = baseAbility.requires_concentration ?? false;
    this.self_target = baseAbility.self_target ?? false;
    this.statusModifiers = statusModifiers;
    this.action_desc = baseAbility.action_desc;
    this.action_desc_pl = baseAbility.action_desc_pl;
    this.ai_chance = baseAbility.ai_chance;
    this.remove_status = baseAbility.remove_status;

    if(this.cooldown < 0) this.cooldown = 0;
  }
}

function getAbiModifiers(char: characterObject, id: string) {
  const total: any = {};
  straight_modifiers.forEach((mod: string) => {
    total[mod] = { value: 0, modif: 1 };
  });
  char.statusEffects.forEach((stat: statEffect) => {
    Object.entries(stat.effects).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(id) && !key.includes("status")) {
        key = key.replace(id + "_", "");
        const _key = key.substring(0, key.length - 1);
        if (key.endsWith("V")) total[_key].value += value;
        else if (key.endsWith("P")) total[_key].modif *= (1 + value / 100);
      }
    });
  });
  if (char.weapon?.stats) {
    Object.entries(char.weapon.stats).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(id) && !key.includes("status")) {
        key = key.replace(id + "_", "");
        const _key = key.substring(0, key.length - 1);
        if (key.endsWith("V")) total[_key].value += value;
        else if (key.endsWith("P")) total[_key].modif *= (1 + value / 100);
      }
    });
  }
  if (char.offhand?.stats) {
    Object.entries(char.offhand.stats).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(id) && !key.includes("status")) {
        key = key.replace(id + "_", "");
        const _key = key.substring(0, key.length - 1);
        if (key.endsWith("V")) total[_key].value += value;
        else if (key.endsWith("P")) total[_key].modif *= (1 + value / 100);
      }
    });
  }
  if (char.helmet?.stats) {
    Object.entries(char.helmet.stats).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(id) && !key.includes("status")) {
        key = key.replace(id + "_", "");
        const _key = key.substring(0, key.length - 1);
        if (key.endsWith("V")) total[_key].value += value;
        else if (key.endsWith("P")) total[_key].modif *= (1 + value / 100);
      }
    });
  }
  if (char.chest?.stats) {
    Object.entries(char.chest.stats).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(id) && !key.includes("status")) {
        key = key.replace(id + "_", "");
        const _key = key.substring(0, key.length - 1);
        if (key.endsWith("V")) total[_key].value += value;
        else if (key.endsWith("P")) total[_key].modif *= (1 + value / 100);
      }
    });
  }
  if (char.boots?.stats) {
    Object.entries(char.boots.stats).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(id) && !key.includes("status")) {
        key = key.replace(id + "_", "");
        const _key = key.substring(0, key.length - 1);
        if (key.endsWith("V")) total[_key].value += value;
        else if (key.endsWith("P")) total[_key].modif *= (1 + value / 100);
      }
    });
  }
  if (char.artifact1?.stats) {
    Object.entries(char.artifact1.stats).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(id) && !key.includes("status")) {
        key = key.replace(id + "_", "");
        const _key = key.substring(0, key.length - 1);
        if (key.endsWith("V")) total[_key].value += value;
        else if (key.endsWith("P")) total[_key].modif *= (1 + value / 100);
      }
    });
  }
  if (char.artifact2?.stats) {
    Object.entries(char.artifact2.stats).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(id) && !key.includes("status")) {
        key = key.replace(id + "_", "");
        const _key = key.substring(0, key.length - 1);
        if (key.endsWith("V")) total[_key].value += value;
        else if (key.endsWith("P")) total[_key].modif *= (1 + value / 100);
      }
    });
  }
  if (char.artifact3?.stats) {
    Object.entries(char.artifact3.stats).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(id) && !key.includes("status")) {
        key = key.replace(id + "_", "");
        const _key = key.substring(0, key.length - 1);
        if (key.endsWith("V")) total[_key].value += value;
        else if (key.endsWith("P")) total[_key].modif *= (1 + value / 100);
      }
    });
  }
  return total;
}

function getAbiStatusModifiers(char: characterObject, abilityId: string, effectId: string) {
  const total: any = { effects: {} };
  possible_stat_modifiers.forEach((mod: string) => {
    total["effects"][mod] = { value: 0, modif: 1 };
  });
  possible_modifiers.forEach((mod: string) => {
    total[mod] = { value: 0, modif: 1 };
  });
  char.statusEffects.forEach((stat: statEffect) => {
    // Go through stat modifiers
    Object.entries(stat.effects).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(abilityId) && key.includes("status")) {
        key = key.replace(abilityId + "_", "");
        if (key.includes("status_effect")) {
          const _key = key.replace("status_effect_", "");
          const __key = _key.substring(0, _key.length - 1);
          if (possible_stat_modifiers.find((m: string) => m == __key.toString())) {
            if (key.endsWith("V")) total["effects"][__key].value += value;
            else if (key.endsWith("P")) total["effects"][__key].modif *= (1 + value / 100);
          }
          else {
            if (key.endsWith("V")) total[__key].value += value;
            else if (key.endsWith("P")) total[__key].modif *= (1 + value / 100);
          }
        }
      }
    });
  });
  if (char.weapon?.stats) {
    Object.entries(char.weapon.stats).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(abilityId) && key.includes("status")) {
        key = key.replace(abilityId + "_", "");
        if (key.includes("status_effect")) {
          const _key = key.replace("status_effect_", "");
          const __key = _key.substring(0, _key.length - 1);
          if (possible_stat_modifiers.find((m: string) => m == __key.toString())) {
            if (key.endsWith("V")) total["effects"][__key].value += value;
            else if (key.endsWith("P")) total["effects"][__key].modif *= (1 + value / 100);
          }
          else {
            if (key.endsWith("V")) total[__key].value += value;
            else if (key.endsWith("P")) total[__key].modif *= (1 + value / 100);
          }
        }
      }
    });
  }
  if (char.offhand?.stats) {
    Object.entries(char.offhand.stats).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(abilityId) && key.includes("status")) {
        key = key.replace(abilityId + "_", "");
        if (key.includes("status_effect")) {
          const _key = key.replace("status_effect_", "");
          const __key = _key.substring(0, _key.length - 1);
          if (possible_stat_modifiers.find((m: string) => m == __key.toString())) {
            if (key.endsWith("V")) total["effects"][__key].value += value;
            else if (key.endsWith("P")) total["effects"][__key].modif *= (1 + value / 100);
          }
          else {
            if (key.endsWith("V")) total[__key].value += value;
            else if (key.endsWith("P")) total[__key].modif *= (1 + value / 100);
          }
        }
      }
    });
  }
  if (char.helmet?.stats) {
    Object.entries(char.helmet.stats).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(abilityId) && key.includes("status")) {
        key = key.replace(abilityId + "_", "");
        if (key.includes("status_effect")) {
          const _key = key.replace("status_effect_", "");
          const __key = _key.substring(0, _key.length - 1);
          if (possible_stat_modifiers.find((m: string) => m == __key.toString())) {
            if (key.endsWith("V")) total["effects"][__key].value += value;
            else if (key.endsWith("P")) total["effects"][__key].modif *= (1 + value / 100);
          }
          else {
            if (key.endsWith("V")) total[__key].value += value;
            else if (key.endsWith("P")) total[__key].modif *= (1 + value / 100);
          }
        }
      }
    });
  }
  if (char.chest?.stats) {
    Object.entries(char.chest.stats).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(abilityId) && key.includes("status")) {
        key = key.replace(abilityId + "_", "");
        if (key.includes("status_effect")) {
          const _key = key.replace("status_effect_", "");
          const __key = _key.substring(0, _key.length - 1);
          if (possible_stat_modifiers.find((m: string) => m == __key.toString())) {
            if (key.endsWith("V")) total["effects"][__key].value += value;
            else if (key.endsWith("P")) total["effects"][__key].modif *= (1 + value / 100);
          }
          else {
            if (key.endsWith("V")) total[__key].value += value;
            else if (key.endsWith("P")) total[__key].modif *= (1 + value / 100);
          }
        }
      }
    });
  }
  if (char.boots?.stats) {
    Object.entries(char.boots.stats).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(abilityId) && key.includes("status")) {
        key = key.replace(abilityId + "_", "");
        if (key.includes("status_effect")) {
          const _key = key.replace("status_effect_", "");
          const __key = _key.substring(0, _key.length - 1);
          if (possible_stat_modifiers.find((m: string) => m == __key.toString())) {
            if (key.endsWith("V")) total["effects"][__key].value += value;
            else if (key.endsWith("P")) total["effects"][__key].modif *= (1 + value / 100);
          }
          else {
            if (key.endsWith("V")) total[__key].value += value;
            else if (key.endsWith("P")) total[__key].modif *= (1 + value / 100);
          }
        }
      }
    });
  }
  if (char.artifact1?.stats) {
    Object.entries(char.artifact1.stats).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(abilityId) && key.includes("status")) {
        key = key.replace(abilityId + "_", "");
        if (key.includes("status_effect")) {
          const _key = key.replace("status_effect_", "");
          const __key = _key.substring(0, _key.length - 1);
          if (possible_stat_modifiers.find((m: string) => m == __key.toString())) {
            if (key.endsWith("V")) total["effects"][__key].value += value;
            else if (key.endsWith("P")) total["effects"][__key].modif *= (1 + value / 100);
          }
          else {
            if (key.endsWith("V")) total[__key].value += value;
            else if (key.endsWith("P")) total[__key].modif *= (1 + value / 100);
          }
        }
      }
    });
  }
  if (char.artifact2?.stats) {
    Object.entries(char.artifact2.stats).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(abilityId) && key.includes("status")) {
        key = key.replace(abilityId + "_", "");
        if (key.includes("status_effect")) {
          const _key = key.replace("status_effect_", "");
          const __key = _key.substring(0, _key.length - 1);
          if (possible_stat_modifiers.find((m: string) => m == __key.toString())) {
            if (key.endsWith("V")) total["effects"][__key].value += value;
            else if (key.endsWith("P")) total["effects"][__key].modif *= (1 + value / 100);
          }
          else {
            if (key.endsWith("V")) total[__key].value += value;
            else if (key.endsWith("P")) total[__key].modif *= (1 + value / 100);
          }
        }
      }
    });
  }
  if (char.artifact3?.stats) {
    Object.entries(char.artifact3.stats).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(abilityId) && key.includes("status")) {
        key = key.replace(abilityId + "_", "");
        if (key.includes("status_effect")) {
          const _key = key.replace("status_effect_", "");
          const __key = _key.substring(0, _key.length - 1);
          if (possible_stat_modifiers.find((m: string) => m == __key.toString())) {
            if (key.endsWith("V")) total["effects"][__key].value += value;
            else if (key.endsWith("P")) total["effects"][__key].modif *= (1 + value / 100);
          }
          else {
            if (key.endsWith("V")) total[__key].value += value;
            else if (key.endsWith("P")) total[__key].modif *= (1 + value / 100);
          }
        }
      }
    });
  }

  return total;
}
