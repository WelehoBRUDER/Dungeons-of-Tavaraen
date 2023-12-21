// Tooltip for ability
function abiTT(abi: ability, character: any = player, options?: { fontSize?: number }) {
	let txt: string = "";
	const fontSize = options?.fontSize ?? 20;
	txt += `\t<f>${fontSize * 1.3}px<f>${lang[abi.id + "_name"] ?? abi.id}\t\n`;
	txt += `<f>${fontSize * 0.95}px<f><c>silver<c>"${lang[abi.id + "_desc"] ?? abi.id + "_desc"}"<c>white<c>\n`;
	if (abi.mana_cost > 0 && character.silenced()) txt += `<i>${icons.silence}<i><f>${fontSize}px<f><c>orange<c>${lang["silence_text"]}§\n`;
	if (abi.requires_concentration && !character.concentration())
		txt += `<i>${icons.break_concentration}<i><f>${fontSize}px<f><c>orange<c>${lang["concentration_text"]}§\n`;
	if (abi.base_heal) {
		let healFromHP = Math.floor((character.getHpMax() * abi.heal_percentage) / 100) ?? 0;
		txt += `<i>${icons.heal}<i><f>${fontSize}px<f>${lang["heal_power"]}: ${abi.base_heal + healFromHP}\n`;
		if (abi.heal_percentage) {
			txt += ` <c>silver<c><f>17px<f>${abi.base_heal} + ${abi.heal_percentage}% ${lang["of_max_hp"]}<c>white<c>\n`;
		}
	} else if (abi.heal_percentage) {
		txt += `<i>${icons.heal}<i><f>${fontSize}px<f>${lang["heal_power"]}: ${abi.heal_percentage}% ${lang["of_max_hp"]} (${Math.floor(
			(character.getHpMax() * abi.heal_percentage) / 100
		)})\n`;
	}
	if (abi.damages) {
		let total: number = 0;
		let text: string = "";
		Object.entries(abi.get_true_damage(character))?.forEach((dmg: any) => {
			total += dmg[1];
			text += `<i>${icons[dmg[0]]}<i><f>17px<f>${dmg[1]}, `;
		});
		text = text.substring(0, text.length - 2);
		txt += `<i>${icons.damage}<i><f>${fontSize}px<f>${lang["damage"]}: ${total} <f>17px<f>(${text})\n`;
	}
	if (abi.remove_status) {
		txt += `§<c>white<c><f>${fontSize}px<f>${lang["cures_statuses"]}: `;
		abi.remove_status.forEach((stat) => {
			txt += `<f>${fontSize * 0.8}px<f><c>white<c>'<c>yellow<c>${lang["effect_" + stat + "_name"]}<c>white<c>' §`;
		});
		txt += "\n";
	}
	if (abi.damage_multiplier) {
		const abiDamage = approximateDamage(character, abi);
		txt += `<i>${icons.damage}<i><f>${fontSize}px<f>${lang["damage_flat"]}: ${abiDamage[0]}-${abiDamage[1]}\n`;
		txt += `<i>${icons.damage}<i><f>${fontSize}px<f>${lang["damage_multiplier"]}: ${Math.round(abi.damage_multiplier * 100)}%\n`;
	}
	if (abi.resistance_penetration)
		txt += `<i>${icons.rp}<i><f>${fontSize}px<f>${lang["resistance_penetration"]}: ${
			abi.resistance_penetration ? abi.resistance_penetration : "0"
		}%\n`;
	if (parseInt(abi.use_range) > 0)
		txt += `<i>${icons.range}<i><f>${fontSize}px<f>${lang["use_range"]}: ${abi.use_range} ${lang["tiles"]}\n`;
	if (abi.life_steal_percentage && !abi.life_steal_trigger_only_when_killing_enemy) {
		txt += `<f>${fontSize}px<f>${lang["life_steal"]}: ${abi.life_steal_percentage}%\n`;
	} else if (abi.life_steal_percentage && abi.life_steal_trigger_only_when_killing_enemy) {
		txt += `<f>${fontSize}px<f>${lang["life_steal_on_kill_1"]} ${abi.life_steal_percentage}% ${lang["life_steal_on_kill_2"]}\n`;
	}
	if (abi.statusesEnemy?.length > 0) {
		txt += `<f>${fontSize}px<f>${lang["status_effects_enemy"]}<c>white<c>: \n`;
		abi.statusesEnemy.forEach((status: string) => {
			txt += `<ct>effect-container<ct><i>${statusEffects[status].icon}<i><f>17px<f>${
				lang["effect_" + statusEffects[status].id + "_name"]
			}\n`;
			const effect = new statEffect(statusEffects[status]);
			effect.init(character?.allModifiers?.["ability_" + abi.id]?.["effect_" + status]);
			txt += statTT(effect, { embed: true }) + "§<nct>-<nct>";
		});
	}
	if (abi.statusesUser?.length > 0) {
		txt += `<f>${fontSize}px<f>${lang["status_effects_you"]}<c>white<c>: \n`;
		abi.statusesUser.forEach((status: string) => {
			txt += `<ct>effect-container<ct><i>${statusEffects[status].icon}<i><f>17px<f>${
				lang["effect_" + statusEffects[status].id + "_name"]
			}\n`;
			const effect = new statEffect(statusEffects[status]);
			effect.init({ ...character?.allModifiers?.["ability_" + abi.id]?.["effect_" + status] });
			txt += statTT(effect, { embed: true }) + "§<nct>-<nct>";
		});
	}
	if (abi.statusesUser?.length > 0 && abi.aoe_size > 0) {
		txt += `<f>${fontSize}px<f>${lang["for_each_enemy_hit"]} ${statusEffects[abi.statusesUser[0]].last.total} ${lang["turns_alt"]}\n`;
	}
	if (abi.type) txt += `<f>${fontSize}px<f>${lang["type"]}: ${lang[abi.type]}\n`;
	if (abi.shoots_projectile != "")
		txt += `<f>${fontSize}px<f>${lang["ranged"]}: ${abi.shoots_projectile != "" ? lang["yes"] : lang["no"]}\n`;
	if (abi.requires_melee_weapon)
		txt += `<i>${icons.melee}<i><f>${fontSize}px<f>${lang["requires_melee_weapon"]}: ${
			abi.requires_melee_weapon ? lang["yes"] : lang["no"]
		}\n`;
	else if (abi.requires_ranged_weapon)
		txt += `<i>${icons.ranged}<i><f>${fontSize}px<f>${lang["requires_ranged_weapon"]}: ${
			abi.requires_ranged_weapon ? lang["yes"] : lang["no"]
		}\n`;
	if (abi.requires_concentration)
		txt += `<i>${icons.concentration}<i><f>${fontSize}px<f>${lang["concentration_req"]}: ${
			abi.requires_concentration ? lang["yes"] : lang["no"]
		}\n`;
	if (abi.recharge_only_in_combat)
		txt += `<i>${icons.fighter_symbol}<i><f>${fontSize}px<f>${lang["recharge_only_in_combat"]}: ${lang["yes"]}\n`;
	if (abi.summon_unit)
		txt += `<i>${icons.fighter_symbol}<i><f>${fontSize}px<f><c>white<c>${lang["summons_unit"]}: <c>yellow<c><f>${fontSize}px<f>${
			lang[abi.summon_unit + "_name"]
		}<c>white<c>\n`;
	if (abi.summon_level) txt += `<f>${fontSize}px<f>${lang["summon_level"]}: ${abi.summon_level}\n`;
	if (abi.summon_last || abi.permanent)
		txt += `<f>${fontSize}px<f>${lang["summon_last"]}: ${abi.permanent ? lang["permanent"] : abi.summon_last - 1} ${
			abi.permanent ? "" : lang["turns"]
		}\n`;
	if (abi.total_summon_limit) txt += `<f>${fontSize}px<f>${lang["total_summon_limit"]}: ${abi.total_summon_limit}\n`;
	if (abi.aoe_size > 0)
		txt += `<i>${icons.aoe_size}<i><f>${fontSize}px<f>${lang["aoe_size"]}: ${Math.floor(abi.aoe_size * 2)}x${Math.floor(
			abi.aoe_size * 2
		)}\n`;
	if (abi.self_target) txt += `<f>${fontSize}px<f>${lang["targets_self"]}: ${lang["yes"]}\n`;
	if (abi.mana_cost > 0) txt += `<i>${icons.mana}<i><f>${fontSize}px<f>${lang["mana_cost"]}: ${abi.mana_cost}\n`;
	if (abi.health_cost > 0 || abi.health_cost_percentage > 0) {
		if (abi.health_cost > 0) txt += `<f>${fontSize}px<f><i>${icons.health_cost}<i>${lang["health_cost"]}: ${abi.health_cost}`;
		else
			txt += `<f>${fontSize}px<f><i>${icons.health_cost}<i>${lang["health_cost"]}: ${abi.health_cost_percentage}% ${lang["of_max_hp"]}\n`;
	}
	if (abi.cooldown > 0) txt += `<i>${icons.cooldown}<i><f>${fontSize}px<f>${lang["cooldown"]}: ${abi.cooldown} ${lang["turns"]}\n`;
	return txt;
}

function compareAbilityTooltip(ability: ability, character: any, bonuses: any) {
	const abi = new Ability(ability, character);
	const compare = bonuses["ability_" + ability.id];
	console.log(compare);
	let txt: string = "<ct>ability-container<ct>";
	txt += `\t<f>17px<f>${lang[abi.id + "_name"] ?? abi.id}\t\n`;
	txt += `<f>14px<f><c>silver<c>"${lang[abi.id + "_desc"] ?? abi.id + "_desc"}"<c>white<c>\n`;
	if (abi.base_heal) txt += `<i>${icons.heal}<i><f>16px<f>${lang["heal_power"]}: ${abi.base_heal}\n`;
	if (abi.damages) {
		let total: number = 0;
		let text: string = "";
		Object.entries(abi.get_true_damage(character)).forEach((dmg: any) => {
			total += dmg[1];

			text += `<i>${icons[dmg[0]]}<i><f>17px<f>${dmg[1]}, `;
		});
		text = text.substring(0, text.length - 2);

		txt += `<i>${icons.damage}<i><f>16px<f>${lang["damage"]}: ${total} <f>17px<f>(${text})\n`;
	}
	if (abi.remove_status) {
		txt += `§<c>white<c><f>16px<f>${lang["cures_statuses"]}: `;
		abi.remove_status.forEach((stat) => {
			txt += `<f>16px<f><c>white<c>'<c>yellow<c>${lang["effect_" + stat + "_name"]}<c>white<c>' §`;
		});
		txt += "\n";
	}
	if (abi.damage_multiplier) {
		if (compare.damage_multiplierP) {
			const value = Math.round(abi.damage_multiplier * 100);
			txt += `<i>${icons.damage}<i><f>16px<f>${lang["damage_multiplier"]}: [${value}% ---> ${value + compare.damage_multiplierP}%]\n`;
		} else {
			txt += `<i>${icons.damage}<i><f>16px<f>${lang["damage_multiplier"]}: ${Math.round(abi.damage_multiplier * 100)}%\n`;
		}
	}
	if (abi.resistance_penetration) {
		const value = abi.resistance_penetration ?? 0;
		if (compare.resistance_penetrationV) {
			txt += `<i>${icons.rp}<i><f>16px<f><c>white<c>${lang["resistance_penetration"]}: <c>lime<c>[${value}% ---> ${
				value + compare.resistance_penetrationV
			}%]<c>white<c>\n`;
		} else {
			txt += `<i>${icons.rp}<i><f>16px<f>${lang["resistance_penetration"]}: ${value}%\n`;
		}
	}
	if (parseInt(abi.use_range) > 0) {
		const value = parseInt(abi.use_range);
		if (compare.use_rangeV) {
			txt += `<i>${icons.range}<i><f>16px<f><c>white<c>${lang["use_range"]}: <c>lime<c>[${value} ---> ${
				value + compare.use_rangeV
			}] <c>white<c>${lang["tiles"]}\n`;
		} else {
			txt += `<i>${icons.range}<i><f>16px<f>${lang["use_range"]}: ${value} ${lang["tiles"]}\n`;
		}
	}
	if (abi.life_steal_percentage && !abi.life_steal_trigger_only_when_killing_enemy) {
		const value = abi.life_steal_percentage;
		const bonus = compare.life_steal_percentageV;
		if (bonus) {
			txt += `<f>16px<f><c>white<c>${lang["life_steal"]}: <c>lime<c>[${value}% ---> ${value + bonus}]<c>white<c>\n`;
		} else {
			txt += `<f>16px<f>${lang["life_steal"]}: ${abi.life_steal_percentage}%\n`;
		}
	} else if (abi.life_steal_percentage && abi.life_steal_trigger_only_when_killing_enemy) {
		const value = abi.life_steal_percentage;
		const bonus = compare.life_steal_percentageV;
		txt += `<f>16px<f><c>white<c>${lang["life_steal_on_kill_1"]} <c>lime<c>[${value}% ---> ${value + bonus}]<c>white<c> ${
			lang["life_steal_on_kill_2"]
		}\n`;
	}
	if (abi.statusesEnemy?.length > 0) {
		txt += `<ct>effect-container<ct><f>17px<f>${lang["status_effects_enemy"]}<c>white<c>: \n`;
		abi.statusesEnemy.forEach((status: string) => {
			txt += `<i>${statusEffects[status].icon}<i><f>16px<f>${lang["effect_" + statusEffects[status].id + "_name"]}\n`;
			const effect = new statEffect(statusEffects[status]);
			effect.init(character?.allModifiers?.["ability_" + abi.id]?.["effect_" + status]);
			if (compare["effect_" + status]) {
				txt += compareStatTooltip(effect, compare["effect_" + status]) + "§<nct>-<nct>";
			} else {
				txt += statTT(effect, { embed: true }) + "§<nct>-<nct>";
			}
		});
	}
	if (abi.statusesUser?.length > 0) {
		txt += `<f>17px<f>${lang["status_effects_you"]}<c>white<c>: \n`;
		abi.statusesUser.forEach((status: string) => {
			txt += `<ct>effect-container<ct><i>${statusEffects[status].icon}<i><f>16px<f>${
				lang["effect_" + statusEffects[status].id + "_name"]
			}\n`;
			const effect = new statEffect(statusEffects[status]);
			effect.init(character?.allModifiers?.["ability_" + abi.id]?.["effect_" + status]);
			if (compare["effect_" + status]) {
				txt += compareStatTooltip(effect, compare["effect_" + status]) + "§<nct>-<nct>";
			} else {
				txt += statTT(effect, { embed: true }) + "§<nct>-<nct>";
			}
		});
	}
	if (abi.statusesUser?.length > 0 && abi.aoe_size > 0) {
		txt += `<f>14px<f>${lang["for_each_enemy_hit"]} ${statusEffects[abi.statusesUser[0]].last.total} ${lang["turns_alt"]}\n`;
	}
	if (abi.type) txt += `<f>16px<f>${lang["type"]}: ${lang[abi.type]}\n`;
	if (abi.shoots_projectile != "") txt += `<f>16px<f>${lang["ranged"]}: ${abi.shoots_projectile != "" ? lang["yes"] : lang["no"]}\n`;
	if (abi.requires_melee_weapon)
		txt += `<i>${icons.melee}<i><f>16px<f>${lang["requires_melee_weapon"]}: ${abi.requires_melee_weapon ? lang["yes"] : lang["no"]}\n`;
	else if (abi.requires_ranged_weapon)
		txt += `<i>${icons.ranged}<i><f>16px<f>${lang["requires_ranged_weapon"]}: ${abi.requires_ranged_weapon ? lang["yes"] : lang["no"]}\n`;
	if (abi.requires_concentration)
		txt += `<i>${icons.concentration}<i><f>16px<f>${lang["concentration_req"]}: ${abi.requires_concentration ? lang["yes"] : lang["no"]}\n`;
	if (abi.recharge_only_in_combat) txt += `<i>${icons.fighter_symbol}<i><f>16px<f>${lang["recharge_only_in_combat"]}: ${lang["yes"]}\n`;
	if (abi.summon_unit)
		txt += `<i>${icons.fighter_symbol}<i><f>16px<f><c>white<c>${lang["summons_unit"]}: <c>yellow<c><f>16px<f>${
			lang[abi.summon_unit + "_name"] ?? abi.summon_unit
		}<c>white<c>\n`;
	if (abi.summon_level) txt += `<f>16px<f>${lang["summon_level"]}: ${abi.summon_level}\n`;
	if (abi.summon_last || abi.permanent)
		txt += `<f>16px<f>${lang["summon_last"]}: ${abi.permanent ? lang["permanent"] : abi.summon_last - 1} ${
			abi.permanent ? "" : lang["turns"]
		}\n`;
	if (abi.total_summon_limit) txt += `<f>16px<f>${lang["total_summon_limit"]}: ${abi.total_summon_limit}\n`;
	if (abi.aoe_size > 0 || compare.aoe_sizeV) {
		const value = Math.floor(abi.aoe_size * 2) || 0;
		const compareValue = Math.floor((abi.aoe_size + compare.aoe_sizeV) * 2) || 0;
		if (compare.aoe_sizeV) {
			txt += `<i>${icons.aoe_size}<i><f>16px<f><c>white<c>${lang["aoe_size"]}: <c>lime<c>[${value}x${value} ---> ${compareValue}x${compareValue}]<c>white<c>\n`;
		} else {
			txt += `<i>${icons.aoe_size}<i><f>16px<f>${lang["aoe_size"]}: ${value}x${value}\n`;
		}
	}
	if (abi.self_target) txt += `<f>16px<f>${lang["targets_self"]}: ${lang["yes"]}\n`;
	if (abi.mana_cost > 0) {
		if (compare.mana_costV) {
			const value = abi.mana_cost;
			txt += `<i>${icons.mana}<i><f>16px<f><c>white<c>${lang["mana_cost"]}: <c>lime<c>[${value} ---> ${
				value + compare.mana_costV
			}]<c>white<c>\n`;
		} else {
			txt += `<i>${icons.mana}<i><f>16px<f>${lang["mana_cost"]}: ${abi.mana_cost}\n`;
		}
	}
	if (abi.health_cost > 0 || abi.health_cost_percentage > 0) {
		if (abi.health_cost > 0) {
			if (compare.health_costV) {
				const value = abi.health_cost;
				txt += `<f>16px<f><i>${icons.health_cost}<i><c>white<c>${lang["health_cost"]}: <c>lime<c>[${value} ---> ${
					value + compare.health_costV
				}]<c>white<c>\n`;
			} else {
				txt += `<f>16px<f><i>${icons.health_cost}<i>${lang["health_cost"]}: ${abi.health_cost}`;
			}
		} else {
			if (compare.health_cost_percentageV) {
				const value = abi.health_cost_percentage;
				txt += `<f>16px<f><i>${icons.health_cost}<i><c>white<c>${lang["health_cost"]}: <c>lime<c>[${value}% ---> ${
					value + compare.health_cost_percentageV
				}%]<c>white<c>\n`;
			} else {
				txt += `<f>16px<f><i>${icons.health_cost}<i>${lang["health_cost"]}: ${abi.health_cost_percentage}% ${lang["of_max_hp"]}\n`;
			}
		}
	}
	if (abi.cooldown > 0) {
		if (compare.cooldownV) {
			const value = abi.cooldown;
			txt += `<i>${icons.cooldown}<i><f>16px<f><c>white<c>${lang["cooldown"]}: <c>lime<c>[${value} ---> ${
				value + compare.cooldownV
			}] <c>white<c>${lang["turns"]}\n`;
		} else {
			txt += `<i>${icons.cooldown}<i><f>16px<f>${lang["cooldown"]}: ${abi.cooldown} ${lang["turns"]}\n`;
		}
	}
	return txt;
}

// Tooltip for status
function statTT(status: statEffect, options?: { embed?: boolean; container?: boolean }) {
	let txt: string = "";
	if (options?.container) {
		txt += "<ct>effect-container<ct>";
	}
	if (!options?.embed) txt += `\t<f>26px<f>${lang["effect_" + status.id + "_name"] ?? status.id}\t\n`;
	if (!options?.embed) txt += `<f>18px<f><c>silver<c>"${lang["effect_" + status.id + "_desc"] ?? status.id + "_desc"}"\t\n`;
	if (Object.keys(status.dot).length > 0) {
		txt += `§${options?.embed ? " " : ""}<f>${options?.embed ? "16px" : "${fontSize}px"}<f>${lang["deals"]} ${status.dot.damageAmount} <i>${
			status.dot.icon
		}<i>${lang[status.dot.damageType + "_damage"].toLowerCase()} ${lang["damage"].toLowerCase()}\n`;
	}
	Object.entries(status.effects).forEach((eff) => (txt += effectSyntax(eff, options?.embed)));
	if (status.silence)
		txt += `§${options?.embed ? " " : ""}<i>${icons.silence}<i><f>${options?.embed ? "16px" : "${fontSize}px"}<f><c>orange<c>${
			lang["silence"]
		}\n`;
	if (status.break_concentration)
		txt += `§${options?.embed ? " " : ""}<i>${icons.break_concentration}<i><f>${options?.embed ? "16px" : "${fontSize}px"}<f><c>orange<c>${
			lang["concentration"]
		}\n`;
	if (status.rooted)
		txt += `§${options?.embed ? " " : ""}<b>800<b><f>${options?.embed ? "16px" : "${fontSize}px"}<f><c>red<c>${lang["rooted"]}\n`;
	if (!options?.embed) txt += `§<i>${icons.cooldown}<i><f>20px<f>${lang["removed_in"]}: ${status.last.current} ${lang["turns"]}\n`;
	else txt += `§${options?.embed ? " " : ""}<i>${icons.cooldown}<i><f>16px<f>${lang["lasts_for"]}: ${status.last.total} ${lang["turns"]}\n`;
	return txt;
}

function compareStatTooltip(status: statEffect, bonuses: any) {
	let txt: string = "";
	if (bonuses.effects) {
		Object.keys(bonuses.effects).forEach((eff) => {
			bonuses.effects[eff.substring(0, eff.length - 1)] = bonuses.effects[eff];
		});
	}
	if (Object.keys(status.dot).length > 0) {
		const value = status.dot.damageAmount;
		if (bonuses.dot) {
			txt += `§<f>"16px"<f><c>white<c>${lang["deals"]} <c>lime<c>[${value} ---> ${value + bonuses.dot.damageAmount}] <c>white<c><i>${
				status.dot.icon
			}<i>${lang[status.dot.damageType + "_damage"].toLowerCase()} ${lang["damage"].toLowerCase()}\n`;
		} else {
			txt += `§<f>"16px"<f>${lang["deals"]} ${value} <i>${status.dot.icon}<i>${lang[
				status.dot.damageType + "_damage"
			].toLowerCase()} ${lang["damage"].toLowerCase()}\n`;
		}
	}
	Object.entries(status.effects).forEach((eff) => {
		if (bonuses?.effects?.[eff[0]]) {
			txt += effectSyntax(eff, true, eff[1] + bonuses.effects[eff[0]]);
		} else {
			txt += effectSyntax(eff, true);
		}
	});
	if (bonuses?.effects) {
		Object.entries(bonuses.effects).forEach((bonus: [string, any]) => {
			const key = bonus[0].substring(0, bonus[0].length - 1);
			if (!key.endsWith("V") && !key.endsWith("P")) return;
			if (!status.effects[bonus[0]] && !status.effects[key]) {
				const comparison = bonus[1];
				bonus[1] = 0;
				txt += effectSyntax(bonus, true, comparison);
			}
		});
	}
	if (status.silence) {
		txt += `§<i>${icons.silence}<i><f>16px<f><c>orange<c>${lang["silence"]}\n`;
	}
	if (status.break_concentration) {
		txt += `§<i>${icons.break_concentration}<i><f>16px<f><c>orange<c>${lang["concentration"]}\n`;
	}

	if (status.rooted) {
		txt += `§<b>800<b><f>16px<f><c>red<c>${lang["rooted"]}\n`;
	}
	if (bonuses.lastV) {
		const value = status.last.total;
		txt += `§<i>${icons.cooldown}<i><f>16px<f>${lang["lasts_for"]}: [${value} ---> ${value + bonuses.lastV}] ${lang["turns"]}\n`;
	} else {
		txt += `§<i>${icons.cooldown}<i><f>16px<f>${lang["lasts_for"]}: ${status.last.total} ${lang["turns"]}\n`;
	}
	return txt;
}

function tooltip(element: HTMLElement, text: string) {
	element.addEventListener("mouseover", (e) => {
		showHover(e, text);
	});
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
		tooltipBox.style.left = innerWidth - tooltipBox.offsetWidth - (innerWidth - mouseEvent.x) + "px";
	}
	if (tooltipBox.offsetTop + tooltipBox.offsetHeight > innerHeight) {
		tooltipBox.style.top = innerHeight - tooltipBox.offsetHeight - (innerHeight - mouseEvent.y) + "px";
	}
}

function hideHover() {
	tooltipBox.textContent = "";
	tooltipBox.style.display = "none";
}
