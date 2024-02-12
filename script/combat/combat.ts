function enemyIndex(cords: tileObject) {
	for (let i = 0; i < maps[currentMap].enemies.length; i++) {
		if (maps[currentMap].enemies[i].cords == cords) return i;
	}
}

function summonIndex(cords: tileObject) {
	for (let i = 0; i < combatSummons.length; i++) {
		if (combatSummons[i].cords == cords) return i;
	}
}
function useAbi(abi: ability) {
	if (dragging) {
		dragging = false;
		updateUI();
		return;
	}
	state.abiSelected = abi;
	state.isSelected = true;
	if (abi.self_target) {
		// @ts-ignore
		buffOrHeal(player, state.abiSelected);
	} else if (abi.instant_aoe) {
		aoeCollision(createAOEMap(player.cords, abi.aoe_size, abi.aoe_ignore_ledge), player, abi);
	}
	updateUI();
}

const currentProjectiles: Projectile[] = [];

function buffOrHeal(character: characterObject, ability: ability) {
	state.isSelected = false;

	if (ability.base_heal) {
		const val = character.allModifiers["healPowerV"] || 0;
		const mod = character.allModifiers["healPowerP"] || 1;
		let healFromHP = 0;
		if (ability.heal_percentage) healFromHP = (character.getHpMax() * ability.heal_percentage) / 100;
		const heal: number = Math.floor((ability.base_heal + val + healFromHP) * mod);
		character.stats.hp += heal;
		spawnFloatingText(character.cords, heal.toString(), "lime", 36);
		if (character.isFoe)
			displayText(
				`<c>crimson<c>[ENEMY] <c>yellow<c>${character.name} <c>white<c>${lang[ability.id + "_action_desc"]} ${
					lang["recovery_foe"]
				} ${heal} ${lang["health_points"]}.`
			);
		else
			displayText(
				`<c>cyan<c>[ACTION] <c>yellow<c>${lang["you"]} <c>white<c>${lang[ability.id + "_action_desc_pl"]} ${lang["recovery_pl"]} ${heal} ${
					lang["health_points"]
				}.`
			);
	} else if (ability.heal_percentage) {
		const val = character.allModifiers["healPowerV"] || 0;
		const mod = character.allModifiers["healPowerP"] || 1;
		let healFromHP = (character.getHpMax() * ability.heal_percentage) / 100;
		const heal: number = Math.floor((healFromHP + val) * mod);
		character.stats.hp += heal;
		spawnFloatingText(character.cords, heal.toString(), "lime", 36);
		if (character.isFoe)
			displayText(
				`<c>crimson<c>[ENEMY] <c>yellow<c>${character.name} <c>white<c>${lang[ability.id + "_action_desc"]} ${
					lang["recovery_foe"]
				} ${heal} ${lang["health_points"]}.`
			);
		else
			displayText(
				`<c>cyan<c>[ACTION] <c>yellow<c>${lang["you"]} <c>white<c>${lang[ability.id + "_action_desc_pl"]} ${lang["recovery_pl"]} ${heal} ${
					lang["health_points"]
				}.`
			);
	}
	if (ability.statusesUser?.length > 0) {
		ability.statusesUser.forEach((status: string) => {
			const _Effect = new statEffect({ ...statusEffects[status] });
			const modifiers = character.allModifiers[`ability_${ability.id}`]?.[`effect_${status}`] || {};
			character.addEffect(_Effect, modifiers);
			if (character.id === "player") _Effect.last.current -= 1;
			character.addEffect(_Effect);
			spawnFloatingText(character.cords, ability.line, "crimson", 36);
			let string: string = "";
			if (character.id == "player") string = lang[ability.id + "_action_desc_pl"];
			else string = lang[ability.id + "_action_desc"];
			if (character.isFoe) displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${lang[character.id + "_name"]} <c>white<c>${string}`);
			else displayText(`<c>cyan<c>[ACTION] <c>white<c>${string}`);
		});
	}
	if (ability.remove_status) {
		ability.remove_status.forEach((status) => {
			character.statusEffects.forEach((effect: statusEffect, index: number) => {
				if (effect.id == status) {
					character.statusEffects.splice(index, 1);
				}
			});
		});
		let string: string = "";
		if (character.id == "player") string = lang["cure_pl"];
		else string = lang["cure"];
		string.replace("[ACTOR]", `<c>yellow<c>${lang[character.id + "_name"]}<c>white<c>`);
		displayText(`<c>cyan<c>[ACTION] <c>white<c>${string}`);
	}
	character.stats.mp -= ability.mana_cost;
	ability.onCooldown = ability.cooldown + 1;
	if (character.id == "player") advanceTurn();
	else {
		updateEnemiesTurn();
	}
}

/* This function needs to be updated at some point */
function regularAttack(attacker: characterObject, target: characterObject, ability: ability, targetCords?: any, isAoe: boolean = false) {
	console.log("CURRENT ATTACKER", attacker);
	if (targetCords) {
		maps[currentMap].enemies.forEach((en: any) => {
			if (targetCords.x == en.cords.x && targetCords.y == en.cords.y) target = en;
		});
	}

	if (ability?.health_cost || ability?.health_cost_percentage) {
		if (ability.health_cost) attacker.stats.hp -= ability.health_cost;
		if (ability.health_cost_percentage) attacker.stats.hp -= (attacker.getHpMax() * ability.health_cost_percentage) / 100;
	}
	const { dmg, evade, critRolled } = calculateDamage(attacker, target, ability);
	console.log("dmg", dmg);

	if (ability.statusesEnemy?.length > 0) {
		ability.statusesEnemy.forEach((status: string) => {
			const _Effect = new statEffect({ ...statusEffects[status] });
			const resist = target.getStatusResists()[_Effect.type];
			const resisted = resist + helper.random(9, -9) > ability.status_power + helper.random(18, -18);
			if (!resisted) {
				const modifiers = attacker.allModifiers[`ability_${ability.id}`]?.[`effect_${status}`] || {};
				target.addEffect(_Effect, modifiers);
			} else {
				spawnFloatingText(target.cords, "RESISTED!", "grey", 36);
			}
		});
	}
	if (ability.statusesUser?.length > 0) {
		ability.statusesUser.forEach((status: string) => {
			const _Effect = new statEffect({ ...statusEffects[status] });
			if (attacker.id === "player") _Effect.last.current -= 1;
			if (!attacker.statusEffects.find((eff: statEffect) => eff.id == status)) {
				const modifiers = attacker.allModifiers[`ability_${ability.id}`]?.[`effect_${status}}`] || {};
				attacker.addEffect(_Effect, modifiers);
				spawnFloatingText(attacker.cords, ability.line, "crimson", 36);
				if (!isAoe) {
					let string: string = "";
					if (attacker.id == "player") string = lang[ability.id + "_action_desc_pl"];
					else string = lang[ability.id + "_action_desc"];
					if (attacker.isFoe) displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${lang[attacker.id + "_name"]} <c>white<c>${string}`);
					else displayText(`<c>cyan<c>[ACTION] <c>white<c>${string}`);
				}
			}
		});
	}

	if (target.isFoe) {
		const layer = document.querySelector<HTMLCanvasElement>(`.enemy${enemyIndex(target.cords)}`);
		setTimeout((paskaFixi: null) => {
			if (!enemyIndex(target.cords)) return;
			try {
				layer.style.animation = "none";
				layer.offsetHeight; /* trigger reflow */
				layer.style.animation = null;
				layer.style.animationName = `charHurt`;
				layer.width = layer.width;
				// @ts-ignore
				renderSingleEnemy(target, layer);
			} catch {}
		}, 110);
		if (!target.aggro()) {
			target.tempAggro = 12;
			target.tempAggroLast = 6;
		}
		target.stats.hp -= dmg;
		if (critRolled) spawnFloatingText(target.cords, dmg.toString() + "!", "red", 48);
		else spawnFloatingText(target.cords, dmg.toString(), "red", 36);
		if (evade) spawnFloatingText(target.cords, "EVADE!", "white", 36);
		if (isAoe) {
			let actionText: string = lang[ability.id + "_action_desc_aoe_pl"] ?? ability.action_desc_pl;
			actionText = actionText.replace("[TARGET]", `'<c>yellow<c>${lang[target.id + "_name"]}<c>white<c>'`);
			actionText = actionText.replace("[DMG]", `${dmg}`);
			displayText(`<c>cyan<c>[ACTION] <c>white<c>${actionText}`);
		} else {
			let ally = true;
			let desc = "_action_desc";
			if (attacker.id == "player") {
				desc += "_pl";
				ally = false;
			}
			let actionText: string = lang[ability.id + desc] ?? ability.action_desc_pl;
			actionText = actionText.replace("[TARGET]", `'<c>yellow<c>${lang[target.id + "_name"]}<c>white<c>'`);
			actionText = actionText.replace("[DMG]", `${dmg}`);
			displayText(
				`${ally ? "<c>lime<c>[ALLY]" + "<c>yellow<c> " + lang[attacker.id + "_name"] : "<c>cyan<c>[ACTION]"} <c>white<c>${actionText}`
			);
			if (ability.cooldown) ability.onCooldown = ability.cooldown + 1;
			if (ability.mana_cost) attacker.stats.mp -= ability.mana_cost;
		}

		if (ability.life_steal_percentage && !ability.life_steal_trigger_only_when_killing_enemy) {
			let lifeSteal = Math.floor((target.getHpMax() * ability.life_steal_percentage) / 100);
			attacker.stats.hp += lifeSteal;
			spawnFloatingText(attacker.cords, lifeSteal.toString(), "lime", 36);
		}

		renderSingleEnemy(target as Enemy, layer);

		if (target.stats.hp <= 0) {
			target.kill();
			spawnFloatingText(
				target.cords,
				lang["gained_xp"].replace("[XP]", Math.floor(target.xp * player.allModifiers.expGainP)),
				"lime",
				32,
				1800,
				100
			);
			if (ability.life_steal_percentage && ability.life_steal_trigger_only_when_killing_enemy) {
				let lifeSteal = Math.floor((target.getHpMax() * ability.life_steal_percentage) / 100);
				attacker.stats.hp += lifeSteal;
				spawnFloatingText(attacker.cords, lifeSteal.toString(), "lime", 36);
			}
			setTimeout(modifyCanvas, 100);
		}
	} else {
		const layer = <HTMLCanvasElement>document.querySelector(".playerSheet");
		if (target.id == "player") {
			setTimeout((paskaFixi: null) => {
				layer.style.animation = "none";
				layer.offsetHeight; /* trigger reflow */
				layer.style.animation = null;
				layer.style.animationName = `screenHurt`;
			}, 110);
		}
		target.stats.hp -= dmg;
		if (critRolled) spawnFloatingText(target.cords, dmg.toString() + "!", "red", 48);
		else spawnFloatingText(target.cords, dmg.toString(), "red", 36);
		if (evade) spawnFloatingText(target.cords, "EVADE!", "white", 36);
		let actionText = lang[ability.id + "_action_desc"] ?? "[TEXT NOT FOUND]";
		let targetName = lang[target.id + "_name"];
		if (!targetName) targetName = player.name;
		actionText = actionText.replace("[TARGET]", `'<c>yellow<c>${targetName}<c>white<c>'`);
		actionText = actionText.replace("[DMG]", `${dmg}`);
		displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${lang[attacker.id + "_name"]} <c>white<c>${actionText}`);
		if (ability.cooldown) ability.onCooldown = ability.cooldown + 1;
		if (ability.mana_cost) attacker.stats.mp -= ability.mana_cost;
		if (target.stats.hp <= 0) {
			target.kill();
			setTimeout(modifyCanvas, 300);
		}
		updateUI();
	}
	state.isSelected = false;
}

function tileCordsToScreen(cords: tileObject) {
	// This function returns screen pixel values from cords.
	const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
	const screenX = (cords.x - player.cords.x + settings.map_offset_x) * spriteSize + baseCanvas.width / 2 - spriteSize / 2;
	const screenY = (cords.y - player.cords.y + settings.map_offset_y) * spriteSize + baseCanvas.height / 2 - spriteSize / 2;
	return { screenX, screenY };
}

function collision(target: tileObject, ability: ability, isPlayer: boolean, attacker: characterObject, theme?: string) {
	if (!attacker.isFoe || isPlayer) {
		let targetEnemy = maps[currentMap].enemies.find((en: any) => en.cords.x == target.x && en.cords.y == target.y);
		if (!targetEnemy) targetEnemy = maps[currentMap].enemies.find((en: any) => en.oldCords.x == target.x && en.oldCords.y == target.y);
		if (ability.aoe_size > 0) {
			aoeCollision(createAOEMap(targetEnemy?.cords, ability.aoe_size, ability.aoe_ignore_ledge), attacker, ability);
		} else {
			regularAttack(attacker, targetEnemy, ability);
		}
	} else if (player.cords.x == target.x && player.cords.y == target.y && attacker.isFoe) {
		regularAttack(attacker, player, ability);
	} else if (attacker.isFoe) {
		let summonTarget = combatSummons.find((summon) => summon.cords.x == target.x && summon.cords.y == target.y);
		regularAttack(attacker, summonTarget, ability);
	}
}

function threatDistance(targets: Array<any>, from: characterObject) {
	let chosenTarget: any = null;
	let highestThreat = -50;
	targets.forEach((target) => {
		let dist = +generatePath(from.cords, target.cords, from.canFly, true);
		let threat = (target.getThreat() + helper.random(18, -18)) / dist;
		if (threat > highestThreat && dist <= (from.aggroRange + from.tempAggro ?? 28)) {
			highestThreat = threat;
			chosenTarget = target;
		}
	});
	return chosenTarget;
}

function summonUnit(ability: ability, cords: tileObject) {
	state.isSelected = false;
	state.abiSelected = {};
	if (ability.cooldown) ability.onCooldown = ability.cooldown + 1;
	if (ability.mana_cost) player.stats.mp -= ability.mana_cost;
	let firstFound: Summon = null;
	let totalSummonsOfSameType: number = 0;
	combatSummons.forEach((summon: Summon, index) => {
		if (summon.id == ability.summon_unit) {
			if (!firstFound) firstFound = summon;
			totalSummonsOfSameType++;
		}
	});
	if (totalSummonsOfSameType >= ability.total_summon_limit) {
		for (let summon of combatSummons) {
			if (summon.id == firstFound.id) {
				summon.kill();
				break;
			}
		}
	}
	const playerBuffs: any = {};
	Object.entries(player.allModifiers).forEach((eff: any) => {
		if (eff[0].startsWith("all_summons")) {
			let key = eff[0].replace("all_summons_", "");
			let value = eff[1];
			playerBuffs[key] = value;
		}
	});

	let newSummon = new Summon({
		...{
			...summons[ability.summon_unit],
			level: ability.summon_level,
			permanent: ability.permanent,
			lastsFor: ability.summon_last,
			cords: { ...cords },
		},
	});
	newSummon.updateTraits();
	newSummon.restore(true);
	newSummon.traits.push({
		id: "buffs_from_player",
		effects: { ...playerBuffs },
	});
	if (ability.summon_status) {
		const modifiers = player.allModifiers[`ability_${ability.id}`][`effect_${ability.summon_status}}`] || {};
		const effect = new statEffect({ ...statusEffects[ability.summon_status] });
		effect.init(modifiers);
		newSummon.statusEffects.push(effect);
	}
	combatSummons.push({ ...newSummon });
	if (ability.statusesUser?.length > 0) {
		ability.statusesUser.forEach((status: string) => {
			const modifiers = player.allModifiers[`ability_${ability.id}`][`effect_${ability.summon_status}}`] || {};
			// @ts-ignore - addEffect takes 2 arguments, but the IDE thinks it takes 1
			player.addEffect(new statEffect({ ...statusEffects[status] }, modifiers));
		});
	}
	let encounter = player.entitiesEverEncountered?.summons?.[newSummon.id];
	if (encounter < 1 || !encounter) {
		player.entitiesEverEncountered.enemies[newSummon.id] = 1;
		displayText("New creature encountered!");
		displayText(newSummon.id + " added to codex.");
		spawnFloatingText(newSummon.cords, "NEW CREATURE ENCOUNTER", "yellow", 22, 2000, 0);
	}
	modifyCanvas();
}

function calcAngleDegrees(x: number, y: number) {
	return (Math.atan2(y, x) * 180) / Math.PI;
}
