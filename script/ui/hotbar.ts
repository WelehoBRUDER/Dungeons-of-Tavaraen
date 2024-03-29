/* Codebase has been refactored, most files have been split to much smaller files */
// @ts-nocheck
const tooltipBox = <HTMLDivElement>document.querySelector("#globalHover");
const contextMenu = document.querySelector<HTMLDivElement>(".contextMenu");
const assignContainer = document.querySelector<HTMLDivElement>(".assignContainer");

function generateHotbar() {
	const hotbar = <HTMLDivElement>document.querySelector(".hotbar");
	hotbar.textContent = "";
	for (let i = 0; i < 20; i++) {
		const bg = document.createElement("img");
		const frame = document.createElement("div");
		const hotKey = document.createElement("span");
		frame.classList.add("hotbarFrame");
		bg.src = "resources/ui/hotbar_bg.png";
		hotKey.textContent = `${i > 9 ? "Shift + " : ""}${
			i < 9 ? (i + 1).toString() : i == 9 ? "0" : i > 9 && i < 19 ? (i - 9).toString() : "0"
		}`;
		frame.addEventListener("mouseup", (e) => rightClickHotBar(e, i));
		frame.append(bg, hotKey);
		hotbar.append(frame);
		const total = player.abilities.concat(player.inventory);
		total?.map((abi: ability) => {
			if (abi.equippedSlot == i && abi.id != "attack") {
				const abiDiv = document.createElement("div");
				const abiImg = document.createElement("img");
				abiDiv.classList.add("ability");
				abiDiv.classList.add(abi.equippedSlot);
				if (state.abiSelected == abi && state.isSelected) {
					frame.style.border = "4px solid gold";
				}
				abiImg.src = abi.icon;
				if (!abi.icon) {
					abiImg.src = abi.img;
					tooltip(abiDiv, itemTT(abi));
					abiDiv.addEventListener("click", () => useConsumable(abi));
					const cdTxt = document.createElement("p");
					if (abi.stacks) {
						cdTxt.classList.add("amountHotbar");
						cdTxt.textContent = `${abi.amount}`;
					} else {
						cdTxt.classList.add("usesHotbar");
						cdTxt.textContent = `${abi.usesRemaining}/${abi.usesTotal}`;
					}
					frame.append(cdTxt);
				} else {
					tooltip(abiDiv, abiTT(abi, player, { fontSize: 18 }));
					if (
						abi.onCooldown == 0 &&
						player.stats.mp >= abi.mana_cost &&
						(abi.health_cost_percentage > 0 ? player.hpRemain() >= abi.health_cost_percentage : true) &&
						(abi.requires_melee_weapon ? abi.requires_melee_weapon && !player.weapon.firesProjectile : true) &&
						(abi.requires_ranged_weapon ? abi.requires_ranged_weapon && player.weapon.firesProjectile : true) &&
						!(abi.mana_cost > 0 ? player.silenced() : false) &&
						(abi.requires_concentration ? player.concentration() : true) &&
						!player.isDead
					)
						abiDiv.addEventListener("click", () => useAbi(abi));
					else {
						abiDiv.style.filter = "brightness(0.25)";
						if (abi.onCooldown > 0) {
							const cdTxt = document.createElement("p");
							if (abi.recharge_only_in_combat && !state.inCombat) cdTxt.style.color = "red";
							cdTxt.textContent = abi.onCooldown?.toString() || "0";
							frame.append(cdTxt);
						}
					}
					if (abi.instant_aoe) {
						abiDiv.addEventListener("mouseover", (e) => renderAOEHoverOnPlayer(abi.aoe_size, abi.aoe_ignore_ledge));
						abiDiv.addEventListener("mouseleave", (e) => renderTileHover(player.cords, e));
					}
				}
				dragElem(abiDiv, [hotbar], updateUI);
				abiDiv.append(abiImg);
				frame.append(abiDiv);
			}
		});
	}
}

function swapAbility(from: number, to: number) {
	let mainSkill = null;
	let replaceSkill = null;
	player.inventory.map((itm: any) => {
		if (itm.equippedSlot === from) mainSkill = itm;
		if (itm.equippedSlot === to) replaceSkill = itm;
	});
	player.abilities.map((abi: any) => {
		if (abi.equippedSlot === from) mainSkill = abi;
		if (abi.equippedSlot === to) replaceSkill = abi;
	});
	if (mainSkill) mainSkill.equippedSlot = to;
	if (replaceSkill) replaceSkill.equippedSlot = from;
	updateUI();
}

function generateSummonList() {
	const summonList = document.querySelector(".playerUI .summonList");
	summonList.innerHTML = "";
	combatSummons.forEach((summon: Summon) => {
		const container = document.createElement("div");
		const img = document.createElement("img");
		const name = document.createElement("p");
		const hpBarBg = document.createElement("img");
		const hpBarFill = document.createElement("img");
		const lastTurns = document.createElement("p");
		container.classList.add("summonContainer");
		img.classList.add("summonImage");
		name.classList.add("summonName");
		hpBarBg.classList.add("summonHpBarBg");
		hpBarFill.classList.add("summonHpBarFill");
		lastTurns.classList.add("summonLastTurns");
		img.src = summon.img;
		name.textContent = lang[summon.id + "_name"];
		hpBarBg.src = "resources/tiles/enemies/healthBorder.png";
		hpBarFill.src = "resources/tiles/enemies/healthBar.png";
		hpBarFill.style.clipPath = `inset(0 ${100 - summon.hpRemain()}% 0 0)`;
		lastTurns.textContent = summon.permanent ? "" : summon.lastsFor;
		container.append(img, name, hpBarBg, hpBarFill, lastTurns);
		summonList.append(container);
	});
}

function useConsumable(itm) {
	if (dragging) {
		dragging = false;
		return;
	}
	if (itm.healValue) {
		player.stats.hp += itm.healValue;
		spawnFloatingText(player.cords, itm.healValue.toString(), "lime", 36, 1000, 200);
	}
	if (itm.manaValue) {
		player.stats.mp += itm.manaValue;
		spawnFloatingText(player.cords, itm.manaValue.toString(), "cyan", 36, 1000, 200);
	}
	if (itm.statusesUser) {
		itm.statusesUser.forEach((status) => {
			player.addEffect(status, itm.modifiers);
		});
	}
	displayText(`<c>cyan<c>[ACTION] <c>white<c>${lang["useConsumable"]}`);
	if (itm.stacks) {
		itm.amount--;
		if (itm.amount <= 0) {
			player.inventory.splice(
				player.inventory.findIndex((item) => item.equippedSlot == itm.equippedSlot),
				1
			);
		}
	} else {
		itm.usesRemaining--;
		if (itm.usesRemaining <= 0) {
			player.inventory.splice(
				player.inventory.findIndex((item) => item.equippedSlot == itm.equippedSlot),
				1
			);
		}
	}
	hideHover();
	advanceTurn();
	updateUI();
}

function rightClickHotBar(Event: MouseEvent, Index: number) {
	contextMenu.textContent = "";
	if (Event.button != 2) return;
	contextMenu.style.left = `${Event.x}px`;
	contextMenu.style.top = `${Event.y}px`;
	let hotbarItem = player.abilities.find((a) => a.equippedSlot == Index);
	if (!hotbarItem) hotbarItem = player.inventory.find((itm) => itm.equippedSlot == Index);
	if (hotbarItem) {
		contextMenuButton(lang["map_to_hotbar"], (a) => mapToHotBar(Index));
		contextMenuButton(lang["remove_from_hotbar"], (a) => removeFromHotBar(Index));
	} else {
		contextMenuButton(lang["map_to_hotbar"], (a) => mapToHotBar(Index));
	}
}

function contextMenuButton(text: string, onClick: any) {
	const but = document.createElement("button");
	but.addEventListener("click", (e) => onClick());
	but.textContent = text;
	contextMenu.append(but);
}

function mapToHotBar(index) {
	contextMenu.textContent = "";
	assignContainer.style.display = "grid";
	assignContainer.textContent = "";
	const total = player.abilities.concat(player.inventory);
	total?.map((abi: ability) => {
		const bg = document.createElement("img");
		const frame = document.createElement("div");
		frame.classList.add("assignFrame");
		bg.src = "resources/ui/hotbar_bg.png";
		frame.append(bg);
		if (abi.equippedSlot == -1 && abi.id != "attack") {
			const abiDiv = document.createElement("div");
			const abiImg = document.createElement("img");
			abiDiv.classList.add("ability");
			if (state.abiSelected == abi && state.isSelected) frame.style.border = "4px solid gold";
			abiImg.src = abi.icon;
			if (!abi.icon) {
				abiImg.src = abi.img;
				tooltip(abiDiv, itemTT(abi));
			} else tooltip(abiDiv, abiTT(abi));
			abiDiv.append(abiImg);
			frame.append(abiDiv);
			frame.addEventListener("click", (a) => addToHotBar(index, abi));
			assignContainer.append(frame);
		}
	});
}

function addToHotBar(index, abi) {
	contextMenu.textContent = "";
	assignContainer.style.display = "none";
	player.abilities.find((a) => a.equippedSlot == index).equippedSlot = -1;
	player.inventory.find((i) => i.equippedSlot == index).equippedSlot = -1;
	abi.equippedSlot = index;
	updateUI();
}

function removeFromHotBar(index) {
	contextMenu.textContent = "";
	player.abilities.find((a) => a.equippedSlot == index).equippedSlot = -1;
	player.inventory.find((i) => i.equippedSlot == index).equippedSlot = -1;
	updateUI();
}

function generateEffects() {
	const effects = <HTMLDivElement>document.querySelector(".playerEffects");
	effects.textContent = "";
	player.statusEffects.forEach((effect: statEffect) => {
		const wrapper = document.createElement("div");
		const img = document.createElement("img");
		const bg = document.createElement("div");
		wrapper.classList.add("status");
		img.classList.add("status");
		bg.classList.add("status-bg");
		bg.style.height = `${Math.min((effect.last.current / effect.last.total) * 100, 100)}%`;
		img.src = effect.icon;
		wrapper.append(img, bg);
		tooltip(wrapper, statTT(effect));
		effects.append(wrapper);
	});
}

function keyIncludesAbility(key: string) {
	let answer: string = "";
	straight_modifiers.forEach((mod: string) => {
		if (key.includes(mod)) answer = mod;
	});
	return answer;
}

tooltip(
	document.querySelector(".playerMpBg"),
	"<i><v>icons.mana_icon<v><i><f>20px<f>Mana: <v>Math.round(player.stats.mp)<v>§/§<v>player.getMpMax()<v>§"
);
tooltip(
	document.querySelector(".playerHpBg"),
	"<i><v>icons.health_icon<v><i><f>20px<f>Health: <v>Math.round(player.stats.hp)<v>§/§<v>player.getHpMax()<v>§"
);
tooltip(document.querySelector(".goldContainer"), "<i><v>icons.gold_icon<v><i><f>20px<f>Gold: §<v>player.gold<v>§");
tooltip(document.querySelector(".xpBar"), "<f>20px<f>Experience: <v>player.level.xp<v>§/§<v>player.level.xpNeed<v>§");

function updateUI() {
	const ui = <HTMLDivElement>document.querySelector(".playerUI");
	if (!ui) throw new Error("UI NOT LOADED!");
	const hpText = <HTMLParagraphElement>ui.querySelector(".hpText");
	const mpText = <HTMLParagraphElement>ui.querySelector(".mpText");
	const hpImg = <HTMLImageElement>ui.querySelector(".PlayerHpFill");
	const mpImg = <HTMLImageElement>ui.querySelector(".PlayerMpFill");
	const xp = <HTMLDivElement>document.querySelector(".xpBar .barFill");
	hpText.textContent = `${Math.floor(player.stats.hp)} / ${player.getHpMax()}`;
	hpText.innerHTML += `<br><span>+${player.getRegen().hp.toFixed(2)}</span>`;
	mpText.textContent = `${Math.floor(player.stats.mp)} / ${player.getMpMax()}`;
	mpText.innerHTML += ` <span>+${player.getRegen().mp.toFixed(2)}</span>`;
	hpImg.style.setProperty("--value", 100 - player.hpRemain() + "%");
	mpImg.style.setProperty("--value", 100 - player.mpRemain() + "%");
	ui.querySelector(".playerGoldNumber").textContent = player.gold.toString();
	generateHotbar();
	generateEffects();
	generateSummonList();
	displayLevelNotification();
	xp.style.width = `${(player.level.xp / player.level.xpNeed) * 100}%`;
}

player.updateAbilities();
maps[currentMap].enemies.forEach((en: Enemy) => {
	en.updateTraits();
	en.updateAbilities();
});
updateUI();

function displayLevelNotification() {
	const levelNotification = document.querySelector(".perScrb .notif");
	if (player.pp > 0 || player.sp > 0) {
		levelNotification.style.display = "block";
	} else levelNotification.style.display = "none";
}

tooltip(document.querySelector(".invScrb"), `${lang["setting_hotkey_inv"]} [${settings["hotkey_inv"]}]`);
tooltip(document.querySelector(".chaScrb"), `${lang["setting_hotkey_char"]} [${settings["hotkey_char"]}]`);
tooltip(document.querySelector(".perScrb"), `${lang["setting_hotkey_perk"]} [${settings["hotkey_perk"]}]`);
tooltip(document.querySelector(".jorScrb"), `${lang["setting_hotkey_journal"]} [${settings["hotkey_journal"]}]`);
tooltip(document.querySelector(".codScrb"), `${lang["setting_hotkey_codex"]} [${settings["hotkey_codex"]}]`);
tooltip(document.querySelector(".escScrb"), `${lang["open_menu"]} [ESCAPE]`);
