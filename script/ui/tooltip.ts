
// Tooltip for ability
function abiTT(abi: ability) {
  var txt: string = "";
  txt += `\t<f>26px<f>${lang[abi.id + "_name"] ?? abi.id}\t\n`;
  txt += `<f>19px<f><c>silver<c>"${lang[abi.id + "_desc"] ?? abi.id + "_desc"}"<c>white<c>\n`;
  if (abi.mana_cost > 0 && player.silenced()) txt += `<i>${icons.silence_icon}<i><f>20px<f><c>orange<c>${lang["silence_text"]}§\n`;
  if (abi.requires_concentration && !player.concentration()) txt += `<i>${icons.break_concentration_icon}<i><f>20px<f><c>orange<c>${lang["concentration_text"]}§\n`;
  if (abi.base_heal) {
    let healFromHP = Math.floor(player.getHpMax() * abi.heal_percentage / 100) ?? 0;
    txt += `<i>${icons.heal_icon}<i><f>20px<f>${lang["heal_power"]}: ${abi.base_heal + healFromHP}\n`;
    if (abi.heal_percentage) {
      txt += ` <c>silver<c><f>17px<f>${abi.base_heal} + ${abi.heal_percentage}% ${lang["of_max_hp"]}<c>white<c>\n`;
    }
  }
  else if (abi.heal_percentage) {
    txt += `<i>${icons.heal_icon}<i><f>20px<f>${lang["heal_power"]}: ${abi.heal_percentage}% ${lang["of_max_hp"]} (${Math.floor(player.getHpMax() * abi.heal_percentage / 100)})\n`;
  }
  if (abi.damages) {
    var total: number = 0;
    var text: string = "";
    Object.entries(abi.get_true_damage(player))?.forEach((dmg: any) => { total += dmg[1]; text += `<i>${icons[dmg[0] + "_icon"]}<i><f>17px<f>${dmg[1]}, `; });
    text = text.substring(0, text.length - 2);
    txt += `<i>${icons.damage_icon}<i><f>20px<f>${lang["damage"]}: ${total} <f>17px<f>(${text})\n`;
  }
  if (abi.remove_status) {
    txt += `§<c>white<c><f>20px<f>${lang["cures_statuses"]}: `;
    abi.remove_status.forEach(stat => {
      txt += `<f>16px<f><c>white<c>'<c>yellow<c>${lang["effect_" + stat + "_name"]}<c>white<c>' §`;
    });
    txt += "\n";
  }
  if (abi.damage_multiplier) txt += `<i>${icons.damage_icon}<i><f>20px<f>${lang["damage_multiplier"]}: ${Math.round(abi.damage_multiplier * 100)}%\n`;
  if (abi.resistance_penetration) txt += `<i>${icons.rp_icon}<i><f>20px<f>${lang["resistance_penetration"]}: ${abi.resistance_penetration ? abi.resistance_penetration : "0"}%\n`;
  if (parseInt(abi.use_range) > 0) txt += `<i>${icons.range_icon}<i><f>20px<f>${lang["use_range"]}: ${abi.use_range} ${lang["tiles"]}\n`;
  // if (abi.status) {
  //   txt += `<f>20px<f>${lang["status_effect"]}:\n <i>${statusEffects[abi.status].icon}<i><f>17px<f>${lang["effect_" + statusEffects[abi.status].id + "_name"]}\n`;
  //   txt += statTT(new statEffect(statusEffects[abi.status], abi.statusModifiers), true);
  // }
  if (abi.life_steal_percentage && !abi.life_steal_trigger_only_when_killing_enemy) {
    txt += `<f>20px<f>${lang["life_steal"]}: ${abi.life_steal_percentage}%\n`;
  }
  else if (abi.life_steal_percentage && abi.life_steal_trigger_only_when_killing_enemy) {
    txt += `<f>20px<f>${lang["life_steal_on_kill_1"]} ${abi.life_steal_percentage}% ${lang["life_steal_on_kill_2"]}\n`;
  }
  if (abi.statusesEnemy?.length > 0) {
    txt += `<f>20px<f>${lang["status_effects_enemy"]}<c>white<c>: \n`;
    abi.statusesEnemy.forEach((status: string) => {
      txt += `<i>${statusEffects[status].icon}<i><f>17px<f>${lang["effect_" + statusEffects[status].id + "_name"]}\n`;
      txt += statTT(new statEffect(statusEffects[status], abi.statusModifiers), true);
    });
  }
  if (abi.statusesUser?.length > 0) {
    txt += `<f>20px<f>${lang["status_effects_you"]}<c>white<c>: \n`;
    abi.statusesUser.forEach((status: string) => {
      txt += `<i>${statusEffects[status].icon}<i><f>17px<f>${lang["effect_" + statusEffects[status].id + "_name"]}\n`;
      txt += statTT(new statEffect(statusEffects[status], abi.statusModifiers), true);
    });
  }
  if (abi.statusesUser?.length > 0 && abi.aoe_size > 0) {
    txt += `<f>20px<f>${lang["for_each_enemy_hit"]} ${statusEffects[abi.statusesUser[0]].last.total} ${lang["turns_alt"]}\n`;
  }
  if (abi.type) txt += `<f>20px<f>${lang["type"]}: ${lang[abi.type]}\n`;
  if (abi.shoots_projectile != "") txt += `<f>20px<f>${lang["ranged"]}: ${abi.shoots_projectile != "" ? lang["yes"] : lang["no"]}\n`;
  if (abi.requires_melee_weapon) txt += `<i>${icons.melee}<i><f>20px<f>${lang["requires_melee_weapon"]}: ${abi.requires_melee_weapon ? lang["yes"] : lang["no"]}\n`;
  else if (abi.requires_ranged_weapon) txt += `<i>${icons.ranged}<i><f>20px<f>${lang["requires_ranged_weapon"]}: ${abi.requires_ranged_weapon ? lang["yes"] : lang["no"]}\n`;
  if (abi.requires_concentration) txt += `<i>${icons.concentration_icon}<i><f>20px<f>${lang["concentration_req"]}: ${abi.requires_concentration ? lang["yes"] : lang["no"]}\n`;
  if (abi.recharge_only_in_combat) txt += `<i>${icons.fighter_symbol_icon}<i><f>20px<f>${lang["recharge_only_in_combat"]}: ${lang["yes"]}\n`;
  if (abi.summon_unit) txt += `<i>${icons.fighter_symbol_icon}<i><f>20px<f><c>white<c>${lang["summons_unit"]}: <c>yellow<c><f>20px<f>${lang[abi.summon_unit + "_name"]}<c>white<c>\n`;
  if (abi.summon_level) txt += `<f>20px<f>${lang["summon_level"]}: ${abi.summon_level}\n`;
  if (abi.summon_last || abi.permanent) txt += `<f>20px<f>${lang["summon_last"]}: ${abi.permanent ? lang["permanent"] : abi.summon_last - 1} ${abi.permanent ? "" : lang["turns"]}\n`;
  if (abi.total_summon_limit) txt += `<f>20px<f>${lang["total_summon_limit"]}: ${abi.total_summon_limit}\n`;
  if (abi.aoe_size > 0) txt += `<i>${icons.aoe_size_icon}<i><f>20px<f>${lang["aoe_size"]}: ${Math.floor(abi.aoe_size * 2)}x${Math.floor(abi.aoe_size * 2)}\n`;
  if (abi.self_target) txt += `<f>20px<f>${lang["targets_self"]}: ${lang["yes"]}\n`;
  if (abi.mana_cost > 0) txt += `<i>${icons.mana_icon}<i><f>20px<f>${lang["mana_cost"]}: ${abi.mana_cost}\n`;
  if (abi.health_cost > 0 || abi.health_cost_percentage > 0) {
    if (abi.health_cost > 0) txt += `<f>20px<f><i>${icons.health_cost_icon}<i>${lang["health_cost"]}: ${abi.health_cost}`;
    else txt += `<f>20px<f><i>${icons.health_cost_icon}<i>${lang["health_cost"]}: ${abi.health_cost_percentage}% ${lang["of_max_hp"]}\n`;
  }
  if (abi.cooldown > 0) txt += `<i>${icons.cooldown_icon}<i><f>20px<f>${lang["cooldown"]}: ${abi.cooldown} ${lang["turns"]}\n`;
  return txt;
}

function embedAbiTT(abi: ability) {
  var txt: string = "";
  txt += `\t<f>17px<f>${lang[abi.id + "_name"] ?? abi.id}\t\n`;
  txt += `<f>14px<f><c>silver<c>"${lang[abi.id + "_desc"] ?? abi.id + "_desc"}"<c>white<c>\n`;
  if (abi.mana_cost > 0 && player.silenced()) txt += `<i>${icons.silence_icon}<i><f>15px<f><c>orange<c>${lang["silence_text"]}§\n`;
  if (abi.requires_concentration && !player.concentration()) txt += `<i>${icons.break_concentration_icon}<i><f>15px<f><c>orange<c>${lang["concentration_text"]}§\n`;
  if (abi.base_heal) txt += `<i>${icons.heal_icon}<i><f>15px<f>${lang["heal_power"]}: ${abi.base_heal}\n`;
  if (abi.damages) {
    var total: number = 0;
    var text: string = "";
    Object.entries(abi.get_true_damage(player)).forEach((dmg: any) => { total += dmg[1]; text += `<i>${icons[dmg[0] + "_icon"]}<i><f>17px<f>${dmg[1]}, `; });
    text = text.substring(0, text.length - 2);
    txt += `<i>${icons.damage_icon}<i><f>15px<f>${lang["damage"]}: ${total} <f>17px<f>(${text})\n`;
  }
  if (abi.remove_status) {
    txt += `§<c>white<c><f>15px<f>${lang["cures_statuses"]}: `;
    abi.remove_status.forEach(stat => {
      txt += `<f>16px<f><c>white<c>'<c>yellow<c>${lang["effect_" + stat + "_name"]}<c>white<c>' §`;
    });
    txt += "\n";
  }
  if (abi.damage_multiplier) txt += `<i>${icons.damage_icon}<i><f>15px<f>${lang["damage_multiplier"]}: ${Math.round(abi.damage_multiplier * 100)}%\n`;
  if (abi.resistance_penetration) txt += `<i>${icons.rp_icon}<i><f>15px<f>${lang["resistance_penetration"]}: ${abi.resistance_penetration ? abi.resistance_penetration : "0"}%\n`;
  if (parseInt(abi.use_range) > 0) txt += `<i>${icons.range_icon}<i><f>15px<f>${lang["use_range"]}: ${abi.use_range} ${lang["tiles"]}\n`;
  if (abi.life_steal_percentage && !abi.life_steal_trigger_only_when_killing_enemy) {
    txt += `<f>15px<f>${lang["life_steal"]}: ${abi.life_steal_percentage}%\n`;
  }
  else if (abi.life_steal_percentage && abi.life_steal_trigger_only_when_killing_enemy) {
    txt += `<f>15px<f>${lang["life_steal_on_kill_1"]} ${abi.life_steal_percentage}% ${lang["life_steal_on_kill_2"]}\n`;
  }
  if (abi.statusesEnemy?.length > 0) {
    txt += `<f>17px<f>${lang["status_effects_enemy"]}<c>white<c>: \n`;
    abi.statusesEnemy.forEach((status: string) => {
      txt += `<i>${statusEffects[status].icon}<i><f>15px<f>${lang["effect_" + statusEffects[status].id + "_name"]}\n`;
      txt += statTT(new statEffect(statusEffects[status], abi.statusModifiers), true);
    });
  }
  if (abi.statusesUser?.length > 0) {
    txt += `<f>17px<f>${lang["status_effects_you"]}<c>white<c>: \n`;
    abi.statusesUser.forEach((status: string) => {
      txt += `<i>${statusEffects[status].icon}<i><f>15px<f>${lang["effect_" + statusEffects[status].id + "_name"]}\n`;
      txt += statTT(new statEffect(statusEffects[status], abi.statusModifiers), true);
    });
  }
  if (abi.statusesUser?.length > 0 && abi.aoe_size > 0) {
    txt += `<f>14px<f>${lang["for_each_enemy_hit"]} ${statusEffects[abi.statusesUser[0]].last.total} ${lang["turns_alt"]}\n`;
  }
  if (abi.type) txt += `<f>15px<f>${lang["type"]}: ${lang[abi.type]}\n`;
  if (abi.shoots_projectile != "") txt += `<f>15px<f>${lang["ranged"]}: ${abi.shoots_projectile != "" ? lang["yes"] : lang["no"]}\n`;
  if (abi.requires_melee_weapon) txt += `<i>${icons.melee}<i><f>15px<f>${lang["requires_melee_weapon"]}: ${abi.requires_melee_weapon ? lang["yes"] : lang["no"]}\n`;
  else if (abi.requires_ranged_weapon) txt += `<i>${icons.ranged}<i><f>15px<f>${lang["requires_ranged_weapon"]}: ${abi.requires_ranged_weapon ? lang["yes"] : lang["no"]}\n`;
  if (abi.requires_concentration) txt += `<i>${icons.concentration_icon}<i><f>15px<f>${lang["concentration_req"]}: ${abi.requires_concentration ? lang["yes"] : lang["no"]}\n`;
  if (abi.recharge_only_in_combat) txt += `<i>${icons.fighter_symbol_icon}<i><f>15px<f>${lang["recharge_only_in_combat"]}: ${lang["yes"]}\n`;
  if (abi.summon_unit) txt += `<i>${icons.fighter_symbol_icon}<i><f>15px<f><c>white<c>${lang["summons_unit"]}: <c>yellow<c><f>15px<f>${lang[abi.summon_unit + "_name"] ?? abi.summon_unit}<c>white<c>\n`;
  if (abi.summon_level) txt += `<f>15px<f>${lang["summon_level"]}: ${abi.summon_level}\n`;
  if (abi.summon_last || abi.permanent) txt += `<f>15px<f>${lang["summon_last"]}: ${abi.permanent ? lang["permanent"] : abi.summon_last - 1} ${abi.permanent ? "" : lang["turns"]}\n`;
  if (abi.total_summon_limit) txt += `<f>15px<f>${lang["total_summon_limit"]}: ${abi.total_summon_limit}\n`;
  if (abi.aoe_size > 0) txt += `<i>${icons.aoe_size_icon}<i><f>15px<f>${lang["aoe_size"]}: ${Math.floor(abi.aoe_size * 2)}x${Math.floor(abi.aoe_size * 2)}\n`;
  if (abi.self_target) txt += `<f>15px<f>${lang["targets_self"]}: ${lang["yes"]}\n`;
  if (abi.mana_cost > 0) txt += `<i>${icons.mana_icon}<i><f>15px<f>${lang["mana_cost"]}: ${abi.mana_cost}\n`;
  if (abi.health_cost > 0 || abi.health_cost_percentage > 0) {
    if (abi.health_cost > 0) txt += `<f>15px<f><i>${icons.health_cost_icon}<i>${lang["health_cost"]}: ${abi.health_cost}`;
    else txt += `<f>15px<f><i>${icons.health_cost_icon}<i>${lang["health_cost"]}: ${abi.health_cost_percentage}% ${lang["of_max_hp"]}\n`;
  }
  if (abi.cooldown > 0) txt += `<i>${icons.cooldown_icon}<i><f>15px<f>${lang["cooldown"]}: ${abi.cooldown} ${lang["turns"]}\n`;
  return txt;
}

// Tooltip for status
function statTT(status: statEffect, embed: boolean = false) {
  var txt: string = "";
  if (!embed) txt += `\t<f>26px<f>${lang["effect_" + status.id + "_name"] ?? status.id}\t\n`;
  if (!embed) txt += `<f>18px<f><c>silver<c>"${lang["effect_" + status.id + "_desc"] ?? status.id + "_desc"}"\t\n`;
  if (status.dot) txt += `§${embed ? " " : ""}<f>${embed ? "16px" : "20px"}<f>${lang["deals"]} ${status.dot.damageAmount} <i>${status.dot.icon}<i>${lang[status.dot.damageType + "_damage"].toLowerCase()} ${lang["damage"].toLowerCase()}\n`;
  Object.entries(status.effects).forEach(eff => txt += effectSyntax(eff, embed, status.id));
  if (status.silence) txt += `§${embed ? " " : ""}<i>${icons.silence_icon}<i><f>${embed ? "16px" : "20px"}<f><c>orange<c>${lang["silence"]}\n`;
  if (status.break_concentration) txt += `§${embed ? " " : ""}<i>${icons.break_concentration_icon}<i><f>${embed ? "16px" : "20px"}<f><c>orange<c>${lang["concentration"]}\n`;
  if (status.rooted) txt += `§${embed ? " " : ""}<b>800<b><f>${embed ? "16px" : "20px"}<f><c>red<c>${lang["rooted"]}\n`;
  if (!embed) txt += `§<i>${icons.cooldown_icon}<i><f>20px<f>${lang["removed_in"]}: ${status.last.current} ${lang["turns"]}\n`;
  else txt += `§${embed ? " " : ""}<i>${icons.cooldown_icon}<i><f>16px<f>${lang["lasts_for"]}: ${status.last.total} ${lang["turns"]}\n`;
  return txt;
}

function tooltip(element: HTMLElement, text: string) {
  element.addEventListener("mouseover", e => { showHover(e, text); });
  element.addEventListener("mousemove", moveHover);
  element.addEventListener("mouseleave", hideHover);
}

function showHover(mouseEvent: MouseEvent, text: string) {
  tooltipBox.textContent = "";
  tooltipBox.style.display = "block";
  tooltipBox.append(textSyntax(text));
  moveHover(mouseEvent);
}

function moveHover(mouseEvent: MouseEvent) {
  tooltipBox.style.left = `${mouseEvent.x + 15}px`;
  tooltipBox.style.top = `${mouseEvent.y - 25}px`;
  if (tooltipBox.offsetLeft + tooltipBox.offsetWidth > innerWidth) {
    tooltipBox.style.left = innerWidth - tooltipBox.offsetWidth - (innerWidth - mouseEvent.x) + 'px';
  }
  if (tooltipBox.offsetTop + tooltipBox.offsetHeight > innerHeight) {
    tooltipBox.style.top = innerHeight - tooltipBox.offsetHeight - (innerHeight - mouseEvent.y) + 'px';
  }
}

function hideHover() {
  tooltipBox.textContent = "";
  tooltipBox.style.display = "none";
}