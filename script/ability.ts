interface ability {
  id: string;
  name: string;
  mana_cost: number;
  health_cost?: number;
  health_cost_percentage?: number;
  cooldown: number;
  type: string;
  onCooldown?: number;
  equippedSlot?: number;
  damages?: damageClass;
  resistance_penetration?: number;
  base_heal?: number;
  heal_percentage?: number;
  life_steal?: number;
  life_steal_percentage?: number;
  life_steal_trigger_only_when_killing_enemy?: boolean;
  mana_steal?: number;
  mana_steal_percentage?: number;
  damage_multiplier?: number;
  shoots_projectile?: string;
  stat_bonus?: string;
  statusesUser?: Array<string>;
  statusesEnemy?: Array<string>;
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
  summon_status?: string;
  total_summon_limit?: number;
  instant_aoe?: boolean;
  aoe_size?: number;
  aoe_effect?: string;
  aoe_ignore_ledge?: boolean;
  self_target?: boolean;
  statusModifiers?: any;
  action_desc: string;
  action_desc_pl: string;
  ai_chance?: number;
  remove_status: Array<string>;
  get_true_damage?: Function;
}

const straight_modifiers = [
  "mana_cost",
  "health_cost",
  "health_cost_percentage",
  "cooldown",
  "resistance_penetration",
  "base_heal",
  "heal_percentage",
  "life_steal",
  "life_steal_percentage",
  "damage_multiplier",
  "use_range",
  "summon_level",
  "summon_last",
  "total_summon_limit",
  "aoe_size",
];

const less_is_better = {
  mana_cost: true,
  cooldown: true,
  resistance_penetration: false,
  base_heal: false,
  damage_multiplier: false,
  use_range: false,
  health_cost: true,
  health_cost_percentage: true
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
  "physicalDefP",
  "magicalDefP",
  "elementalDefP",
  "hitChanceV",
  "hitChanceP",
  "evasionV",
  "evasionP",
  "critChanceV",
  "critDamageV",
  "critChanceP",
  "critDamageP",
  "damageV",
  "damageP",
  "regenHpP",
  "regenMpP",
];

const possible_modifiers = [
  "last",
  "attack_damage_multiplierV",
  "attack_damage_multiplierP",
  "attack_resistance_penetrationV",
  "attack_resistance_penetrationP",
  "damageAmount",
];

class Ability {
  id: string;
  name: string;
  mana_cost: number;
  health_cost?: number;
  health_cost_percentage?: number;
  cooldown: number;
  type: string;
  onCooldown?: number;
  equippedSlot?: number;
  damages?: damageClass;
  resistance_penetration?: number;
  base_heal?: number;
  heal_percentage?: number;
  life_steal?: number;
  life_steal_percentage?: number;
  life_steal_trigger_only_when_killing_enemy?: boolean;
  mana_steal?: number;
  mana_steal_percentage?: number;
  damage_multiplier?: number;
  shoots_projectile?: string;
  stat_bonus?: string;
  statusesUser?: Array<string>;
  statusesEnemy?: Array<string>;
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
  summon_status?: string;
  total_summon_limit?: number;
  instant_aoe?: boolean;
  aoe_size?: number;
  aoe_effect?: string;
  aoe_ignore_ledge?: boolean;
  self_target?: boolean;
  statusModifiers?: any;
  action_desc: string;
  action_desc_pl: string;
  ai_chance?: number;
  remove_status: Array<string>;
  get_true_damage?: Function;
  constructor(base: ability, user: characterObject) {
    this.id = base.id;
    const values = getAbiModifiers(user, base.id);
    // @ts-ignore
    const baseAbility = abilities[this.id];
    let statusModifiers: any = {}; 
    baseAbility.statusesUser?.forEach((str: string) => statusModifiers = {...statusModifiers, ...getAbiStatusModifiers(user, base.id, str)});
    baseAbility.statusesEnemy?.forEach((str: string) => statusModifiers = {...statusModifiers, ...getAbiStatusModifiers(user, base.id, str)});
    if(baseAbility.id == "finishing_blow") console.log(values);
    if(baseAbility.summon_status) statusModifiers = {...statusModifiers, ...getAbiStatusModifiers(user, base.id, baseAbility.summon_status)};
    this.name = baseAbility.name;
    this.mana_cost = Math.floor((baseAbility.mana_cost + values.mana_cost.value) * values.mana_cost.modif) ?? 0;
    this.health_cost = Math.floor((baseAbility.health_cost + values.health_cost.value) * values.health_cost.modif) ?? 0;
    this.health_cost_percentage = Math.floor((baseAbility.health_cost_percentage + values.health_cost_percentage.value) * values.health_cost_percentage.modif) ?? 0;
    this.cooldown = Math.floor((baseAbility.cooldown + values.cooldown.value) * values.cooldown.modif) ?? 0;
    this.type = baseAbility.type ?? "none";
    this.onCooldown = base.onCooldown ?? 0;
    this.equippedSlot = base.equippedSlot ?? -1;
    this.damages = baseAbility.damages;
    this.damage_multiplier = (baseAbility.damage_multiplier + values.damage_multiplier.value + (values.damage_multiplier.modif - 1)) ?? 1;
    this.resistance_penetration = Math.floor((baseAbility.resistance_penetration + values.resistance_penetration.value + (values.resistance_penetration.modif - 1))) ?? 0;
    this.base_heal = Math.floor((baseAbility.base_heal + values.base_heal.value) * values.base_heal.modif) ?? 0;
    this.heal_percentage = Math.floor((baseAbility.heal_percentage + values.heal_percentage.value) * values.heal_percentage.modif) ?? 0;
    this.life_steal = Math.floor((baseAbility.life_steal + values.life_steal.value) * values.life_steal.modif) ?? 0;
    this.life_steal_percentage = Math.floor((baseAbility.life_steal_percentage + values.life_steal_percentage.value) * values.life_steal_percentage.modif) ?? 0;
    this.life_steal_trigger_only_when_killing_enemy = baseAbility.life_steal_trigger_only_when_killing_enemy ?? false;
    this.stat_bonus = baseAbility.stat_bonus ?? "";
    this.statusesUser = baseAbility.statusesUser ?? [];
    this.statusesEnemy = baseAbility.statusesEnemy ?? [];
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
    this.summon_status = baseAbility.summon_status;
    this.total_summon_limit = baseAbility.total_summon_limit + values.total_summon_limit.value;
    this.instant_aoe = baseAbility.instant_aoe ?? false;
    this.aoe_size = (baseAbility.aoe_size + values.aoe_size.value) * values.aoe_size.modif ?? 0;
    this.aoe_effect = baseAbility.aoe_effect ?? "";
    this.aoe_ignore_ledge = baseAbility.aoe_ignore_ledge ?? false;
    this.self_target = baseAbility.self_target ?? false;
    this.statusModifiers = statusModifiers;
    this.action_desc = baseAbility.action_desc;
    this.action_desc_pl = baseAbility.action_desc_pl;
    this.ai_chance = baseAbility.ai_chance;
    this.remove_status = baseAbility.remove_status;

    if (this.cooldown < 0) this.cooldown = 0;

    this.get_true_damage = (_user: characterObject | PlayerCharacter) => {
      let damages = {} as damageClass;
      let takenValues: any;
      let total: number = 0;
      if (_user.weapon?.damages) takenValues = _user.weapon.damages;
      else if (!_user.weapon?.damages && _user.unarmedDamages) takenValues = _user.unarmedDamages;
      else takenValues = _user.damages;
      Object.entries(takenValues).forEach((dmg: any) => {
        total += dmg[1];
      });
      Object.entries(this.damages).forEach((dmg: any) => {
        const str = dmg[0];
        const num = dmg[1] / 100;
        damages[str] = Math.floor(total * num * this.damage_multiplier);
      });
      return damages;
    };
  }
}

function getAbiKey(key: string) {
  if (key.includes("status")) return key;
  let newKey = key.substring(0, key.length - 1);
  straight_modifiers.forEach((modifs: any) => {
    if (newKey.includes(modifs)) {
      newKey = newKey.replace(modifs, "");
      newKey = newKey.substring(0, newKey.length - 1);
    }
  });
  return newKey;
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
      const comparisonKey = getAbiKey(key);
      if (id == comparisonKey && !key.includes("status")) {
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
            const comparisonKey = getAbiKey(key);
            if (id == comparisonKey && !key.includes("status")) {
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
      const comparisonKey = getAbiKey(key);
      if (id == comparisonKey && !key.includes("status")) {
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
        const comparisonKey = getAbiKey(key);
        if (id == comparisonKey && !key.includes("status")) {
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
        const comparisonKey = getAbiKey(key);
        if (id == comparisonKey && !key.includes("status")) {
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
            total["effects"][__key].status = effectId;
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
              total["effects"][__key].status = effectId;
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
          const trueKey = _key.replace(effectId + "_", "");
          const __key = trueKey.substring(0, trueKey.length - 1);
          if (possible_stat_modifiers.find((m: string) => m == __key.toString())) {
            if (key.endsWith("V")) total["effects"][__key].value += value;
            else if (key.endsWith("P") && value < 0) total["effects"][__key].modif *= (1 + value / 100);
            else if (key.endsWith("P")) total["effects"][__key].modif += (1 + value / 100);
            total["effects"][__key].status = effectId;
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
                  total["effects"][__key].status = effectId;
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



// {
//   const arr = [1, 2, 3];

//   console.log(JSON.stringify(arr, (key: any, value: any) => {
//     console.log(key);
//     return value;
//   }, "\t"));
// }
