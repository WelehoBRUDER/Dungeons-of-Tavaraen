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
  status_power?: number;
  line?: string;
  icon: string;
  use_range: string;
  requires_melee_weapon?: boolean;
  requires_ranged_weapon?: boolean;
  requires_concentration?: boolean;
  recharge_only_in_combat?: boolean;
  summon_unit?: string;
  summon_level?: number;
  summon_last?: number;
  aoe_size?: number;
  aoe_effect?: string;
  self_target?: boolean;
  statusModifiers?: any;
  action_desc: string;
  action_desc_pl: string;
  ai_chance?: number;
  remove_status: Array<string>;
}

const straight_modifiers = [
  "mana_cost",
  "cooldown",
  "resistance_penetration",
  "base_heal",
  "damage_multiplier",
  "use_range",
  "summon_level",
  "summon_last",
  "aoe_size",
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
  "resistAllV",
  "resistAllP",
  "hitChanceV",
  "hitChanceP",
  "evasionV",
  "evasionP"
];

const possible_modifiers = [
  "last",
  "attack_damage_multiplierV",
  "attack_damage_multiplierP",
  "attack_resistance_penetrationV",
  "attack_resistance_penetrationP"
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
  status_power?: number;
  line?: string;
  icon: string;
  use_range: string;
  requires_melee_weapon?: boolean;
  requires_ranged_weapon?: boolean;
  requires_concentration?: boolean;
  recharge_only_in_combat?: boolean;
  summon_unit?: string;
  summon_level?: number;
  summon_last?: number;
  aoe_size?: number;
  aoe_effect?: string;
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
    this.resistance_penetration = Math.floor((baseAbility.resistance_penetration + values.resistance_penetration.value + (values.resistance_penetration.modif - 1))) ?? 0;
    this.base_heal = Math.floor((baseAbility.base_heal + values.base_heal.value) * values.base_heal.modif) ?? 0;
    this.stat_bonus = baseAbility.stat_bonus ?? "";
    this.status = baseAbility.status ?? "";
    this.status_power = baseAbility.status_power ?? 0;
    this.shoots_projectile = baseAbility.shoots_projectile ?? "";
    this.icon = baseAbility.icon;
    this.line = baseAbility.line ?? "";
    this.use_range = typeof parseInt(baseAbility.use_range) === 'number' ? Math.floor(((parseInt(baseAbility.use_range) + values.use_range.value) * values.use_range.modif)).toString() : baseAbility.use_range;
    this.requires_melee_weapon = baseAbility.requires_melee_weapon ?? false;
    this.requires_ranged_weapon = baseAbility.requires_ranged_weapon ?? false;
    this.requires_concentration = baseAbility.requires_concentration ?? false;
    this.recharge_only_in_combat = baseAbility.recharge_only_in_combat ?? false;
    this.summon_unit = baseAbility.summon_unit;
    this.summon_level = Math.floor((baseAbility.summon_level + values.summon_level.value) * values.summon_level.modif) ?? 0;;
    this.summon_last = Math.floor((baseAbility.summon_last + values.summon_last.value) * values.summon_last.modif) ?? 0;;
    this.aoe_size = (baseAbility.aoe_size + values.aoe_size.value) * values.aoe_size.modif ?? 0;
    this.aoe_effect = baseAbility.aoe_effect ?? "";
    this.self_target = baseAbility.self_target ?? false;
    this.statusModifiers = statusModifiers;
    this.action_desc = baseAbility.action_desc;
    this.action_desc_pl = baseAbility.action_desc_pl;
    this.ai_chance = baseAbility.ai_chance;
    this.remove_status = baseAbility.remove_status;

    if (this.cooldown < 0) this.cooldown = 0;
  }
}

function getAbiModifiers(char: characterObject, id: string) {
  const total: any = {};
  straight_modifiers.forEach((mod: string) => {
    total[mod] = { value: 0, modif: 1 };
  });
  char.perks?.forEach((prk: statEffect) => {
    Object.entries(prk.effects).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(id) && !key.includes("status")) {
        key = key.replace(id + "_", "");
        const _key = key.substring(0, key.length - 1);
        if (key.endsWith("V")) total[_key].value += value;
        else if (key.endsWith("P") && value < 0) total[_key].modif *= (1 + value / 100);
        else if (key.endsWith("P")) total[_key].modif += (value / 100);
      }
    });
    if (prk.statModifiers) {
      prk.statModifiers.forEach((mod: any) => {
        let apply = true;
        if (mod.conditions) {
          apply = statConditions(mod.conditions, char);
        }
        if (apply) {
          Object.entries(mod.effects).forEach((eff: any) => {
            let key = eff[0];
            let value = eff[1];
            if (key.includes(id) && !key.includes("status")) {
              key = key.replace(id + "_", "");
              const _key = key.substring(0, key.length - 1);
              if (key.endsWith("V")) total[_key].value += value;
              else if (key.endsWith("P") && value < 0) total[_key].modif *= (1 + value / 100);
              else if (key.endsWith("P")) total[_key].modif += (value / 100);
            }
          });
        }
      });
    }
  });
  char.statusEffects.forEach((stat: statEffect) => {
    Object.entries(stat.effects).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(id) && !key.includes("status")) {
        key = key.replace(id + "_", "");
        const _key = key.substring(0, key.length - 1);
        if (key.endsWith("V")) total[_key].value += value;
        else if (key.endsWith("P") && value < 0) total[_key].modif *= (1 + value / 100);
        else if (key.endsWith("P")) total[_key].modif += (value / 100);
      }
    });
  });
  char.statModifiers?.forEach((stat: statEffect) => {
    let apply = true;
    if (stat.conditions) {
      apply = statConditions(stat.conditions, char);
    }
    if (apply) {
      Object.entries(stat.effects).forEach((eff: any) => {
        let key = eff[0];
        let value = eff[1];
        if (key.includes(id) && !key.includes("status")) {
          key = key.replace(id + "_", "");
          const _key = key.substring(0, key.length - 1);
          if (key.endsWith("V")) total[_key].value += value;
          else if (key.endsWith("P") && value < 0) total[_key].modif *= (1 + value / 100);
          else if (key.endsWith("P")) total[_key].modif += (value / 100);
        }
      });
    }
  });
  equipmentSlots.forEach((slot: string) => {
    if (char[slot]?.stats) {
      Object.entries(char[slot].stats).forEach((eff: any) => {
        let key = eff[0];
        let value = eff[1];
        if (key.includes(id) && !key.includes("status")) {
          key = key.replace(id + "_", "");
          const _key = key.substring(0, key.length - 1);
          if (key.endsWith("V")) total[_key].value += value;
          else if (key.endsWith("P") && value < 0) total[_key].modif *= (1 + value / 100);
          else if (key.endsWith("P")) total[_key].modif += (value / 100);
        }
      });
    }
  });
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
            else if (key.endsWith("P") && value < 0) total["effects"][__key].modif *= (1 + value / 100);
            else if (key.endsWith("P")) total["effects"][__key].modif += (1 + value / 100);
          }
          else {
            if (key.endsWith("V")) total[__key].value += value;
            else if (key.endsWith("P") && value < 0) total[__key].modif *= (1 + value / 100);
            else if (key.endsWith("P")) total[__key].modif += (1 + value / 100);
          }
        }
      }
    });
  });
  char.statModifiers?.forEach((stat: statEffect) => {
    let apply = true;
    if (stat.conditions) {
      apply = statConditions(stat.conditions, char);
    }
    if (apply) {
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
              else if (key.endsWith("P") && value < 0) total["effects"][__key].modif *= (1 + value / 100);
              else if (key.endsWith("P")) total["effects"][__key].modif += (1 + value / 100);
            }
            else {
              if (key.endsWith("V")) total[__key].value += value;
              else if (key.endsWith("P") && value < 0) total[__key].modif *= (1 + value / 100);
              else if (key.endsWith("P")) total[__key].modif += (1 + value / 100);
            }
          }
        }
      });
    }
  });
  char.perks?.forEach((prk: statEffect) => {
    // Go through stat modifiers
    Object.entries(prk.effects).forEach((eff: any) => {
      let key = eff[0];
      let value = eff[1];
      if (key.includes(abilityId) && key.includes("status")) {
        key = key.replace(abilityId + "_", "");
        if (key.includes("status_effect")) {
          const _key = key.replace("status_effect_", "");
          const __key = _key.substring(0, _key.length - 1);
          if (possible_stat_modifiers.find((m: string) => m == __key.toString())) {
            if (key.endsWith("V")) total["effects"][__key].value += value;
            else if (key.endsWith("P") && value < 0) total["effects"][__key].modif *= (1 + value / 100);
            else if (key.endsWith("P")) total["effects"][__key].modif += (1 + value / 100);
          }
          else {
            if (key.endsWith("V")) total[__key].value += value;
            else if (key.endsWith("P") && value < 0) total[__key].modif *= (1 + value / 100);
            else if (key.endsWith("P")) total[__key].modif += (1 + value / 100);
          }
        }
      }
    });
    if (prk.statModifiers) {
      prk.statModifiers.forEach((mod: any) => {
        let apply = true;
        if (mod.conditions) {
          apply = statConditions(mod.conditions, char);
        }
        if (apply) {
          Object.entries(mod.effects).forEach((eff: any) => {
            let key = eff[0];
            let value = eff[1];
            if (key.includes(abilityId) && key.includes("status")) {
              key = key.replace(abilityId + "_", "");
              if (key.includes("status_effect")) {
                const _key = key.replace("status_effect_", "");
                const __key = _key.substring(0, _key.length - 1);
                if (possible_stat_modifiers.find((m: string) => m == __key.toString())) {
                  if (key.endsWith("V")) total["effects"][__key].value += value;
                  else if (key.endsWith("P") && value < 0) total["effects"][__key].modif *= (1 + value / 100);
                  else if (key.endsWith("P")) total["effects"][__key].modif += (1 + value / 100);
                }
                else {
                  if (key.endsWith("V")) total[__key].value += value;
                  else if (key.endsWith("P") && value < 0) total[__key].modif *= (1 + value / 100);
                  else if (key.endsWith("P")) total[__key].modif += (1 + value / 100);
                }
              }
            }
          });
        }
      });
    }
  });
  equipmentSlots.forEach((slot: string) => {
    if (char[slot]?.stats) {
      Object.entries(char[slot].stats).forEach((eff: any) => {
        let key = eff[0];
        let value = eff[1];
        if (key.includes(abilityId) && key.includes("status")) {
          key = key.replace(abilityId + "_", "");
          if (key.includes("status_effect")) {
            const _key = key.replace("status_effect_", "");
            const __key = _key.substring(0, _key.length - 1);
            if (possible_stat_modifiers.find((m: string) => m == __key.toString())) {
              if (key.endsWith("V")) total["effects"][__key].value += value;
              else if (key.endsWith("P") && value < 0) total["effects"][__key].modif *= (1 + value / 100);
              else if (key.endsWith("P")) total["effects"][__key].modif += (1 + value / 100);
            }
            else {
              if (key.endsWith("V")) total[__key].value += value;
              else if (key.endsWith("P") && value < 0) total[__key].modif *= (1 + value / 100);
              else if (key.endsWith("P")) total[__key].modif += (1 + value / 100);
            }
          }
        }
      });
    }
  });
  return total;
}
