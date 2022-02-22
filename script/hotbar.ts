/* THIS FILE IS ACTUALLY FOR MOST UI RELATED STUFF, DESPITE THE NAME */
// @ts-nocheck
const tooltipBox = <HTMLDivElement>document.querySelector("#globalHover");
const contextMenu = document.querySelector<HTMLDivElement>(".contextMenu");
const assignContainer = document.querySelector<HTMLDivElement>(".assignContainer");

class gameSettings {
  [log_enemy_movement: string]: boolean | any;
  toggle_minimap: boolean;
  hide_helmet: boolean;
  hotkey_inv: string;
  hotkey_char: string;
  hotkey_perk: string;
  hotkey_ranged: string;
  ui_scale: number;
  hotkey_move_up: string;
  hotkey_move_down: string;
  hotkey_move_left: string;
  hotkey_move_right: string;
  hotkey_move_right_up: string;
  hotkey_move_right_down: string;
  hotkey_move_left_up: string;
  hotkey_move_left_down: string;
  hotkey_open_world_messages: string;
  hotkey_interact: string;
  hotkey_journal: string;
  hotkey_codex: string;
  constructor(base: gameSettings) {
    this.log_enemy_movement = base.log_enemy_movement || false;
    this.toggle_minimap = base.toggle_minimap || true;
    this.hide_helmet = base.hide_helmet || false;
    this.hotkey_inv = base.hotkey_inv || "i";
    this.hotkey_char = base.hotkey_char || "c";
    this.hotkey_perk = base.hotkey_perk || "p";
    this.hotkey_ranged = base.hotkey_ranged || "g";
    this.ui_scale = base.ui_scale || 100;
    this.hotkey_move_up = base.hotkey_move_up || "w";
    this.hotkey_move_down = base.hotkey_move_down || "s";
    this.hotkey_move_left = base.hotkey_move_left || "a";
    this.hotkey_move_right = base.hotkey_move_right || "d";
    this.hotkey_move_right_up = base.hotkey_move_right_up || "PageUp";
    this.hotkey_move_right_down = base.hotkey_move_right_down || "PageDown";
    this.hotkey_move_left_up = base.hotkey_move_left_up || "Home";
    this.hotkey_move_left_down = base.hotkey_move_left_down || "End";
    this.hotkey_open_world_messages = base.hotkey_open_world_messages || "Enter";
    this.hotkey_interact = base.hotkey_interact || " ";
    this.hotkey_journal = base.hotkey_journal || "j";
    this.hotkey_codex = base.hotkey_codex || "y";
  }
}

let settings = new gameSettings({
  log_enemy_movement: false,
  toggle_minimap: true,
  hide_helmet: false,
  hotkey_inv: "i",
  hotkey_char: "c",
  hotkey_perk: "p",
  hotkey_ranged: "g",
  ui_scale: 100,
  hotkey_move_up: "w",
  hotkey_move_down: "s",
  hotkey_move_left: "a",
  hotkey_move_right: "d",
  hotkey_move_right_up: "PageUp",
  hotkey_move_right_down: "PageDown",
  hotkey_move_left_up: "Home",
  hotkey_move_left_down: "End",
  hotkey_interact: " ",
  hotkey_open_world_messages: "Enter",
  hotkey_journal: "j",
  hotkey_codex: "y",
});

// Hotkeys
document.addEventListener("keyup", e => {
  if (e.key == "r" && !state.savesOpen) {
    if (player.isDead) {
      respawnPlayer();
      return;
    }
  }
  else if (e.key == "Escape") {
    handleEscape();
    return;
  }
  if (e.key == settings["hotkey_open_world_messages"]) {
    if (state.displayingTextHistory) state.displayingTextHistory = false;
    else state.displayingTextHistory = true;
    displayAllTextHistory();
    return;
  }
  if (e.key == settings["hotkey_ranged"]) {
    state.rangedMode = !state.rangedMode;
  }
  if (player.isDead || state.savesOpen) return;
  const number = parseInt(e.keyCode) - 48;
  if (e.key == settings.hotkey_inv && !state.menuOpen) {
    if (!state.invOpen) renderInventory();
    else closeInventory();
  }
  else if (e.key == settings.hotkey_char && !state.menuOpen) {
    if (!state.charOpen) renderCharacter();
    else closeCharacter();
  }
  else if (e.key == settings.hotkey_perk && !state.menuOpen) {
    if (!state.perkOpen) openLevelingScreen();
    else closeLeveling();
  }
  else if (e.key == settings.hotkey_journal && !state.menuOpen) {
    if (!state.journalOpen) renderPlayerQuests();
    else closePlayerQuests();
  }
  else if (e.key == settings.hotkey_codex && !state.menuOpen) {
    if (!state.codexOpen) openIngameCodex();
    else closeCodex();
  }
  else if (state.invOpen || state.menuOpen) return;
  else if (number > -1 && e.shiftKey) {
    let abi = player.abilities.find(a => a.equippedSlot == number + 9);
    if (number == 0) abi = player.abilities.find(a => a.equippedSlot == 19);
    if (!abi) {
      let itm = player.inventory.find(a => a.equippedSlot == number + 9);
      if (number == 0) itm = player.inventory.find(a => a.equippedSlot == 19);
      if (itm) useConsumable(itm);
      return;
    }
    else if ((abi.onCooldown == 0 && player.stats.mp >= abi.mana_cost && (abi.health_cost_percentage > 0 ? player.hpRemain() >= abi.health_cost_percentage : true) && ((abi.requires_melee_weapon ? abi.requires_melee_weapon && !player.weapon.firesProjectile : true) && (abi.requires_ranged_weapon ? abi.requires_ranged_weapon && player.weapon.firesProjectile : true)) && !(abi.mana_cost > 0 ? player.silenced() : false) && (abi.requires_concentration ? player.concentration() : true))) useAbi(abi);
  }
  else if (number > -1 && !e.shiftKey) {
    let abi = player.abilities.find(a => a.equippedSlot == number - 1);
    if (number == 0) abi = player.abilities.find(a => a.equippedSlot == 9);
    if (!abi) {
      let itm = player.inventory.find(a => a.equippedSlot == number - 1);
      if (number == 0) itm = player.inventory.find(a => a.equippedSlot == 9);
      if (itm) useConsumable(itm);
      return;
    }
    if ((abi.onCooldown == 0 && player.stats.mp >= abi.mana_cost && (abi.health_cost_percentage > 0 ? player.hpRemain() >= abi.health_cost_percentage : true) && ((abi.requires_melee_weapon ? abi.requires_melee_weapon && !player.weapon.firesProjectile : true) && (abi.requires_ranged_weapon ? abi.requires_ranged_weapon && player.weapon.firesProjectile : true)) && !(abi.mana_cost > 0 ? player.silenced() : false) && (abi.requires_concentration ? player.concentration() : true))) useAbi(abi);
  }
});

function generateHotbar() {
  const hotbar = <HTMLDivElement>document.querySelector(".hotbar");
  hotbar.textContent = "";
  for (let i = 0; i < 20; i++) {
    const bg = document.createElement("img");
    const frame = document.createElement("div");
    const hotKey = document.createElement("span");
    frame.classList.add("hotbarFrame");
    bg.src = "resources/ui/hotbar_bg.png";
    hotKey.textContent = `${i > 9 ? "Shift + " : ""}${i < 9 ? (i + 1).toString() : i == 9 ? "0" : i > 9 && i < 19 ? (i - 9).toString() : "0"}`;
    frame.addEventListener("mouseup", e => rightClickHotBar(e, i));
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
          }
          else {
            cdTxt.classList.add("usesHotbar");
            cdTxt.textContent = `${abi.usesRemaining}/${abi.usesTotal}`;
          }
          frame.append(cdTxt);
        }
        else {
          tooltip(abiDiv, abiTT(abi));
          if (abi.onCooldown == 0 && player.stats.mp >= abi.mana_cost && (abi.health_cost_percentage > 0 ? player.hpRemain() >= abi.health_cost_percentage : true) && ((abi.requires_melee_weapon ? abi.requires_melee_weapon && !player.weapon.firesProjectile : true) && (abi.requires_ranged_weapon ? abi.requires_ranged_weapon && player.weapon.firesProjectile : true)) && !(abi.mana_cost > 0 ? player.silenced() : false) && (abi.requires_concentration ? player.concentration() : true) && !player.isDead) abiDiv.addEventListener("click", () => useAbi(abi));
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
            abiDiv.addEventListener("mouseover", e => renderAOEHoverOnPlayer(abi.aoe_size, abi.aoe_ignore_ledge));
            abiDiv.addEventListener("mouseleave", e => renderTileHover(player.cords, e));
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
  console.log(from);
  console.log(to);
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
  displayText(`<c>cyan<c>[ACTION] <c>white<c>${lang["useConsumable"]}`);
  if (itm.stacks) {
    itm.amount--;
    if (itm.amount <= 0) {
      player.inventory.splice(player.inventory.findIndex(item => item.equippedSlot == itm.equippedSlot), 1);
    }
  }
  else {
    itm.usesRemaining--;
    if (itm.usesRemaining <= 0) {
      player.inventory.splice(player.inventory.findIndex(item => item.equippedSlot == itm.equippedSlot), 1);
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
  let hotbarItem = player.abilities.find(a => a.equippedSlot == Index);
  if (!hotbarItem) hotbarItem = player.inventory.find(itm => itm.equippedSlot == Index);
  if (hotbarItem) {
    contextMenuButton(lang["map_to_hotbar"], a => mapToHotBar(Index));
    contextMenuButton(lang["remove_from_hotbar"], a => removeFromHotBar(Index));
  }
  else {
    contextMenuButton(lang["map_to_hotbar"], a => mapToHotBar(Index));
  }
}

function contextMenuButton(text: string, onClick: any) {
  const but = document.createElement("button");
  but.addEventListener("click", e => onClick());
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
      }
      else tooltip(abiDiv, abiTT(abi));
      abiDiv.append(abiImg);
      frame.append(abiDiv);
      frame.addEventListener("click", a => addToHotBar(index, abi));
      assignContainer.append(frame);
    }
  });
}

function addToHotBar(index, abi) {
  contextMenu.textContent = "";
  assignContainer.style.display = "none";
  player.abilities.find(a => a.equippedSlot == index)?.equippedSlot = -1;
  player.inventory.find(i => i.equippedSlot == index)?.equippedSlot = -1;
  abi.equippedSlot = index;
  updateUI();
}

function removeFromHotBar(index) {
  contextMenu.textContent = "";
  player.abilities.find(a => a.equippedSlot == index)?.equippedSlot = -1;
  player.inventory.find(i => i.equippedSlot == index)?.equippedSlot = -1;
  updateUI();
}

function generateEffects() {
  const effects = <HTMLDivElement>document.querySelector(".playerEffects");
  effects.textContent = "";
  player.statusEffects.forEach((effect: statEffect) => {
    const img = document.createElement("img");
    img.classList.add("status");
    img.src = effect.icon;
    tooltip(img, statTT(effect));
    effects.append(img);
  });
}

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

function keyIncludesAbility(key: string) {
  let answer: string = "";
  straight_modifiers.forEach((mod: string) => {
    if (key.includes(mod)) answer = mod;
  });
  return answer;
}

// Syntax for effects
function effectSyntax(effect: any, embed: boolean = false, effectId: string = "") {
  let text: string = "";
  const rawKey = effect[0];
  var value = effect[1];
  var flipColor = false;
  var key: string = rawKey.substring(0, rawKey.length - 1);
  var key_: string = key;
  var tailEnd: string = "";
  var lastBit: string = "";
  const _key: string = key;
  var frontImg: string = "";
  var backImg: string = "";
  if (key.includes("Resist")) {
    key = key.replace("Resist", "");
    key_ = key;
    tailEnd = lang["resist"];
  }
  else if (key.includes("Def") && !key.includes("status_effect")) {
    key = key.replace("Def", "");
    key_ = key;
    //tailEnd = lang["resist"];
  }
  else if (key.includes("Damage") && !key.includes("crit")) {
    key = key.replace("Damage", "");
    key_ = key;
    tailEnd = lang["damage"];
  }
  else if (key.includes("status_effect")) {
    key_ = key.replace("status_effect_", "");
    let id = key_;
    let _d: string = "";
    const mod_array = possible_modifiers.concat(possible_stat_modifiers);
    mod_array.forEach((modi: string) => {
      if (id.includes(modi)) {
        id = id.replace("_" + modi, "");
        if (modi[modi.length - 1] == "P" || modi[modi.length - 1] == "V") key_ = modi.substring(0, modi.length - 1);
        else key_ = modi;
        _d = modi;
      }
    });
    let statusId = "";
    Object.keys(statusEffects).forEach((keyStr: string) => {
      if (id.endsWith(keyStr)) {
        statusId = keyStr;
        id = id.replace("_" + keyStr, "");
      }
    });
    key = id + "_name";
    let _value = 0;
    if (player.statusEffects.find((eff: any) => eff.id == effectId)) _value = value;
    frontImg = abilities[id]?.icon ?? icons.damage;
    if (value < 0) backImg = `<i>${icons[key_ + "_icon"]}<i>§<c>${flipColor ? "lime" : "red"}<c><f>${embed ? "15px" : "18px"}<f>`;
    else backImg = `<i>${icons[key_ + "_icon"]}<i>§<c>${flipColor ? "red" : "lime"}<c><f>${embed ? "15px" : "18px"}<f>`;
    try {
      var _abi: ability = new Ability(player.abilities?.find((__abi: ability) => __abi.id == id), player);
    }
    catch { }
    if (!_abi) _abi = new Ability(abilities[id], dummy);
    let status: statusEffect = new statEffect(statusEffects[statusId], _abi.statusModifiers);
    if (_d.includes("attack_damage_multiplier")) {
      tailEnd = lang["attack_name"];
    }
    else tailEnd = lang[_d] + " status";
    if (tailEnd.includes("undefined")) tailEnd = _d + " status";
    lastBit = `[${(status?.effects[_d] - _value || status?.[_d]?.["total"] - _value || status?.[_d] - _value) || 0}${_d.endsWith("P") ? "%" : ""}-->${((status?.effects[_d] - _value || status?.[_d]?.["total"] - _value || status?.[_d] - _value) || 0) + value}${_d.endsWith("P") ? "%" : ""}]`;
  }
  else if (keyIncludesAbility(key)) {
    key_ = keyIncludesAbility(key);
    let id = key.replace("_" + key_, "");
    frontImg = abilities[id]?.icon ?? icons.damage;
    key = id + "_name";
    flipColor = less_is_better[key_];
    if (key !== "attack_name") {
      if (value < 0) backImg = `<i>${icons[key_ + "_icon"]}<i>§<c>${flipColor ? "lime" : "red"}<c><f>${embed ? "15px" : "18px"}<f>`;
      else backImg = `<i>${icons[key_ + "_icon"]}<i>§<c>${flipColor ? "red" : "lime"}<c><f>${embed ? "15px" : "18px"}<f>`;
      tailEnd = lang[key_];
      if (!tailEnd) tailEnd = key_;
      else if (tailEnd.includes("undefined")) tailEnd = key_;
    }
    //if (tailEnd.includes("multiplier")) value = value * 100;
  }
  if (key.includes("against_type")) {
    key_ = key.replace("against_type", "");
    let id1 = key_.split("_")[0];
    let id2 = key_.split("_")[2];
    frontImg = icons[id1];
    key = lang[id1];
    tailEnd = lang[`plural_type_${id2}`];
    if (lang.changeWordOrder) tailEnd += lang["against_type_syntax"];
    else key += lang["against_type_syntax"];
    backImg = `<i>${icons[id2 + "_type_icon"]}<i>`;
  }
  else if (key.includes("against_race")) {
    key_ = key.replace("against_race", "");
    let id1 = key_.split("_")[0];
    let id2 = key_.split("_")[2];
    frontImg = icons[id1];
    key = lang[id1];
    tailEnd = lang[`plural_race_${id2}`];
    if (lang.changeWordOrder) tailEnd += lang["against_race_syntax"];
    else key += lang["against_race_syntax"];
    backImg = `<i>${icons[id2 + "_race_icon"]}<i>`;
  }
  if (tailEnd == lang["resist"]) key = lang[key + "_def"];
  else if (lang[key]) key = lang[key];
  var img = icons[_key + "_icon"];
  if (!img) img = icons[key_ + tailEnd + "_icon"];
  if (!img) img = icons[key_ + "_icon"];
  if (value < 0) {
    text += `§${embed ? " " : ""}<c>${flipColor ? "lime" : "red"}<c><f>${embed ? "15px" : "18px"}<f>${lang["decreases"]}  <i>${frontImg === "" ? img : frontImg}<i>${key} ${backImg ? backImg : ""}${tailEnd} ${lang["by"]}${rawKey.endsWith("P") ? value + "%" : value} ${lastBit}\n`;
  } else text += `§${embed ? " " : ""}<c>${flipColor ? "red" : "lime"}<c><f>${embed ? "15px" : "18px"}<f>${lang["increases"]} <i>${frontImg === "" ? img : frontImg}<i>${key} ${backImg ? backImg : ""}${tailEnd} ${lang["by"]}${rawKey.endsWith("P") ? value + "%" : value} ${lastBit}\n`;
  return text;
}


tooltip(document.querySelector(".playerMpBg"), "<i><v>icons.mana_icon<v><i><f>20px<f>Mana: <v>Math.round(player.stats.mp)<v>§/§<v>player.getMpMax()<v>§");
tooltip(document.querySelector(".playerHpBg"), "<i><v>icons.health_icon<v><i><f>20px<f>Health: <v>Math.round(player.stats.hp)<v>§/§<v>player.getHpMax()<v>§");
tooltip(document.querySelector(".goldContainer"), "<i><v>icons.gold_icon<v><i><f>20px<f>Gold: §<v>player.gold<v>§");
tooltip(document.querySelector(".xpBar"), "<f>20px<f>Experience: <v>player.level.xp<v>§/§<v>player.level.xpNeed<v>§");

function updateUI() {
  const ui = <HTMLDivElement>document.querySelector(".playerUI");
  if (!ui) throw new Error("UI NOT LOADED!");
  const hpText = <HTMLParagraphElement>ui.querySelector(".hpText");
  const hpImg = <HTMLImageElement>ui.querySelector(".PlayerHpFill");
  const mpImg = <HTMLImageElement>ui.querySelector(".PlayerMpFill");
  const xp = <HTMLDivElement>document.querySelector(".xpBar .barFill");
  hpText.textContent = `${Math.round(player.stats.hp)} / ${player.getHpMax()}`;
  hpImg.style.setProperty("--value", (100 - player.hpRemain()) + "%");
  mpImg.style.setProperty("--value", (100 - player.mpRemain()) + "%");
  ui.querySelector(".playerGoldNumber").textContent = player.gold.toString();
  generateHotbar();
  generateEffects();
  generateSummonList();
  xp.style.width = `${player.level.xp / player.level.xpNeed * 100}%`;
}

const worldTextHistoryArray = [];
const worldTextHistoryMaximumSize = 200;
const worldTextHistoryDisplayAutoSize = 12; // Display 12 latest messages without player input. Active for 15s every time a new message appears.
const worldTextDisplayTime = 15000; // 15 seconds
const worldTextContainer = document.querySelector<HTMLDivElement>(".worldText");
let worldTextScroll = -1; // Current scroll
function displayText(txt: string) {
  worldTextContainer.style.transition = `0.25s`;
  worldTextContainer.style.opacity = 1;
  if (!state.displayingTextHistory) {
    worldTextContainer.textContent = "";
    worldTextContainer.style.pointerEvents = "none";
  }
  displayLatestWorldHistoryMessages();
  const textElement = textSyntax(txt);
  worldTextHistoryArray.push(textElement);
  worldTextContainer.append(textElement);
  if (!state.displayingTextHistory) worldTextContainer.scrollBy(0, 1000);
  if (worldTextContainer.childNodes.length > 199) worldTextContainer.removeChild(worldTextContainer.childNodes[0]);
  if (worldTextHistoryArray.length > worldTextHistoryMaximumSize) worldTextHistoryArray.splice(0, 1);
  if (state.displayingTextHistory) return;
  setTimeout(() => {
    if (state.displayingTextHistory) return;
    worldTextContainer.style.transition = `${worldTextDisplayTime / 3000}s`;
    worldTextContainer.style.opacity = 0;
  }, worldTextDisplayTime * 0.6);
  setTimeout(() => {
    if (state.displayingTextHistory) return;
    try { worldTextContainer.removeChild(textElement); }
    catch { }
  }, worldTextDisplayTime);
}

function displayLatestWorldHistoryMessages() {
  if (state.displayingTextHistory) return;
  for (let i = startIndexOfWorldTextHistory(); i < worldTextHistoryArray.length; i++) {
    worldTextContainer.append(worldTextHistoryArray[i]);
  }
}

worldTextContainer.addEventListener("wheel", () => {
  worldTextScroll = worldTextContainer.scrollTop;
});

function displayAllTextHistory() {
  worldTextContainer.style.transition = `0.25s`;
  worldTextContainer.style.opacity = 1;
  worldTextContainer.textContent = "";
  if (!state.displayingTextHistory) {
    worldTextContainer.style.opacity = 0;
    worldTextContainer.style.pointerEvents = "none";
    return;
  }
  worldTextContainer.style.pointerEvents = "all";
  worldTextContainer.innerHTML = `
  <img src="resources/icons/triangleUp.png" class="scrollUp" onclick="scrollWorldText(-100)">
  <img src="resources/icons/triangleDown.png" class="scrollDown" onclick="scrollWorldText(100)">
  `;
  worldTextHistoryArray.forEach((txt: HTMLPreElement) => {
    worldTextContainer.append(txt);
    worldTextContainer.scrollBy(0, 1000);
  });
  if (worldTextScroll < 0) worldTextScroll = worldTextContainer.scrollTop;
  worldTextContainer.scrollTo(0, worldTextScroll);
}

function startIndexOfWorldTextHistory() {
  if (worldTextHistoryArray.length - worldTextHistoryDisplayAutoSize > 1) return worldTextHistoryArray.length - worldTextHistoryDisplayAutoSize;
  else return 0;
}

function scrollWorldText(num: number) {
  worldTextContainer.scrollBy(0, num);
  worldTextScroll = worldTextContainer.scrollTop;
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

function createStatDisplay(stat: any) {
  const key = stat[0] == "chance" ? "hitChance" : stat[0];
  const val = stat[1];
  const { statContainer, statImage, statText, statValue } = createBaseElementsForStatDisplay();
  statImage.src = icons[key];
  statText.textContent = lang[key];
  statValue.textContent = key.includes("crit") ? val + "%" : val;
  tooltip(statContainer, lang[key + "_tt"] ?? "no tooltip");
  statContainer.append(statImage, statText, statValue);
  return statContainer;
}

function createArmorOrResistanceDisplay(stat: any, armor: boolean) {
  const key = stat[0];
  const val = stat[1];
  const { statContainer, statImage, statText, statValue } = createBaseElementsForStatDisplay();
  statImage.src = icons[key + (armor ? "_armor" : "")];
  statText.textContent = lang[key];
  statValue.textContent = val + (armor ? "" : "%");
  tooltip(statContainer, lang[armor ? key + "_tt" : "resistances_tt"] ?? "no tooltip");
  if (val > 0) statValue.classList.add("positive");
  else if (val < 0) statValue.classList.add("negative");
  statContainer.append(statImage, statText, statValue);
  return statContainer;
}

function createStatusResistanceDisplay(stat: any) {
  const key = stat[0];
  const val = stat[1];
  const { statContainer, statImage, statText, statValue } = createBaseElementsForStatDisplay();
  statImage.src = icons[key] ?? icons["damage"];
  statText.textContent = lang[key + "_status"];
  statValue.textContent = val + "%";
  if (val > 0) statValue.classList.add("positive");
  else if (val < 0) statValue.classList.add("negative");
  statContainer.append(statImage, statText, statValue);
  return statContainer;
}

function createStatModifierDisplay(mod: any) {
  const statContainer = document.createElement("div");
  const statImage = document.createElement("img");
  const statText = document.createElement("p");
  statImage.src = mod.icon ?? icons["damage"];
  statText.textContent = lang[mod.id + "_name"];
  if (mod.conditions) {
    let active = statConditions(mod.conditions, player);
    if (active) statText.classList.add("positive");
    else statText.classList.add("inactive");
  }
  statContainer.append(statImage, statText);
  tooltip(statContainer, statModifTT(mod));
  return statContainer;
}

function createBaseElementsForStatDisplay() {
  const sc = document.createElement("div");
  const si = document.createElement("img");
  const st = document.createElement("p");
  const sv = document.createElement("span");
  return { statContainer: sc, statImage: si, statText: st, statValue: sv };
}

function renderCharacter() {
  state.charOpen = true;
  hideHover();
  const bg = document.querySelector<HTMLDivElement>(".playerWindow");
  document.querySelector<HTMLDivElement>(".worldText").style.opacity = "0";
  bg.style.transform = "scale(1)";
  bg.textContent = "";
  const playerStats = player.getStats();
  const hitChances = player.getHitchance();
  const playerCoreStats = { ...playerStats, ...hitChances };
  const playerArmor = player.getArmor();
  const playerResists = player.getResists();
  const playerStatusResists = player.getStatusResists();
  const generalInfo = document.createElement("div");
  const pc = renderPlayerPortrait();
  generalInfo.classList.add("generalInfo");
  const charName = document.createElement("p");
  const charRaceLevel = document.createElement("p");
  const charHealthContainer = document.createElement("div");
  const charManaContainer = document.createElement("div");
  const charHealth = document.createElement("p");
  const charHealthImage = document.createElement("img");
  const charMana = document.createElement("p");
  const charManaImage = document.createElement("img");
  charName.classList.add("charName");
  charRaceLevel.classList.add("charRaceLevel");
  charHealthContainer.classList.add("charHealthContainer");
  charManaContainer.classList.add("charManaContainer");
  charName.textContent = player.name;
  charRaceLevel.textContent = `Lvl ${player.level.level}, ${lang[player.race + "_name"]}`;
  charHealth.textContent = `${Math.round(player.stats.hp)}/${player.getHpMax()}`;
  charMana.textContent = `${Math.round(player.stats.mp)}/${player.getMpMax()}`;
  charHealthImage.src = "resources/icons/health.png";
  charManaImage.src = "resources/icons/mana.png";
  charHealthContainer.append(charHealthImage, charHealth);
  charManaContainer.append(charManaImage, charMana);
  generalInfo.append(charName, charRaceLevel, charHealthContainer, charManaContainer);
  const coreStats = document.createElement("div");
  const coreResistances = document.createElement("div");
  const statusResistances = document.createElement("div");
  const passiveAbilities = document.createElement("div");
  const coreStatsTitle = document.createElement("p");
  const coreResistancesTitle = document.createElement("p");
  const statusResistancesTitle = document.createElement("p");
  const passiveAbilitiesTitle = document.createElement("p");
  coreStatsTitle.classList.add("coreStatsTitle");
  coreStatsTitle.textContent = lang["core_stats"];
  coreResistancesTitle.classList.add("coreResistancesTitle");
  coreResistancesTitle.textContent = lang["core_resistances"];
  statusResistancesTitle.classList.add("statusResistancesTitle");
  statusResistancesTitle.textContent = lang["status_resistances"];
  passiveAbilitiesTitle.classList.add("passiveAbilitiesTitle");
  passiveAbilitiesTitle.textContent = lang["passives"];
  coreStats.classList.add("coreStats");
  coreResistances.classList.add("coreResistances");
  statusResistances.classList.add("statusResistances");
  passiveAbilities.classList.add("passiveAbilities");
  Object.entries(playerCoreStats).forEach((stat: any) => {
    coreStats.append(createStatDisplay(stat));
  });
  Object.entries(playerArmor).forEach((stat: any) => {
    coreResistances.append(createArmorOrResistanceDisplay(stat, true));
  });
  Object.entries(playerResists).forEach((stat: any) => {
    coreResistances.append(createArmorOrResistanceDisplay(stat, false));
  });
  Object.entries(playerStatusResists).forEach((stat: any) => {
    statusResistances.append(createStatusResistanceDisplay(stat));
  });
  player.statModifiers.forEach((mod: PermanentStatModifier) => {
    passiveAbilities.append(createStatModifierDisplay(mod));
  });
  var resistancesText = `<bcss>position: absolute; left: 24px; top: 500px;<bcss><f>32px<f>Core resistances§\n\n`;
  Object.entries(player.getResists()).forEach(resistance => {
    const str = resistance[0];
    const val = resistance[1];
    resistancesText += `<i>${icons[str + "_icon"]}<i><c>white<c>${str}: <c>${val < 0 ? "crimson" : val > 0 ? "lime" : "white"}<c>${val}%\n`;
  });
  const resistances = textSyntax(resistancesText);
  tooltip(resistances, "Resistance decreases incoming damage\n of its type by the indicated number.\n For example, 50% resistance means\n you take half damage.");
  var effectResTxt = `<bcss>position: absolute; left: 364px; top: 298px;<bcss><f>32px<f>Status resistances§\n\n`;
  Object.entries(player.getStatusResists()).forEach(resistance => {
    const str = resistance[0];
    const val = resistance[1];
    effectResTxt += `<i>${icons[str] ? icons[str] : "resources/icons/damage_icon.png"}<i><c>white<c>${str}: <c>${val < 0 ? "crimson" : val > 0 ? "lime" : "white"}<c>${val}%\n`;
  });
  const effResistances = textSyntax(effectResTxt);
  tooltip(effResistances, "Status resistance either decreases damage\n of its type by the indicated number\n or decreases the chance of the status effecting you.");
  pc.style.left = "24px";
  pc.style.top = "24px";
  tooltip(statusResistances, lang["stat_resist_tt"]);
  bg.append(pc, generalInfo, coreStatsTitle, coreStats, coreResistancesTitle, coreResistances, statusResistancesTitle, statusResistances, passiveAbilitiesTitle, passiveAbilities);
}

function closeCharacter() {
  state.charOpen = false;
  hideHover();
  document.querySelector<HTMLDivElement>(".worldText").style.opacity = "1";
  const bg = document.querySelector<HTMLDivElement>(".playerWindow");
  bg.style.transform = "scale(0)";
}

player.updateAbilities();
maps[currentMap].enemies.forEach((en: Enemy) => {
  en.updateStatModifiers();
  en.updateAbilities();
});
updateUI();


tooltip(document.querySelector(".invScrb"), `${lang["setting_hotkey_inv"]} [${settings["hotkey_inv"]}]`);
tooltip(document.querySelector(".chaScrb"), `${lang["setting_hotkey_char"]} [${settings["hotkey_char"]}]`);
tooltip(document.querySelector(".perScrb"), `${lang["setting_hotkey_perk"]} [${settings["hotkey_perk"]}]`);
tooltip(document.querySelector(".jorScrb"), `${lang["setting_hotkey_journal"]} [${settings["hotkey_journal"]}]`);
tooltip(document.querySelector(".escScrb"), `${lang["open_menu"]} [ESCAPE]`);