/* THIS FILE IS ACTUALLY FOR MOST UI RELATED STUFF, DESPITE THE NAME */
// @ts-nocheck
const tooltipBox = <HTMLDivElement>document.querySelector("#globalHover");
const contextMenu = document.querySelector<HTMLDivElement>(".contextMenu");
const assignContainer = document.querySelector<HTMLDivElement>(".assignContainer");

let windowOpen = false;
let menuOpen = false;

class gameSettings {
  [log_enemy_movement: string]: boolean | any;
  constructor(base: gameSettings) {
    this.log_enemy_movement = base.log_enemy_movement || false;
  }
}

let settings = new gameSettings({
  log_enemy_movement: false
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
        if (abiSelected == abi && isSelected) frame.style.border = "4px solid gold";
        abiImg.src = abi.icon;
        if (!abi.icon) {
          abiImg.src = abi.img;
          tooltip(abiDiv, itemTT(abi));
          abiDiv.addEventListener("click", () => useConsumable(abi));
          const cdTxt = document.createElement("p");
          cdTxt.classList.add("usesHotbar");
          cdTxt.textContent = `${abi.usesRemaining}/${abi.usesTotal}`;
          frame.append(cdTxt);
        }
        else {
          tooltip(abiDiv, abiTT(abi));
          if (abi.onCooldown == 0 && player.stats.mp >= abi.mana_cost && ((abi.requires_melee_weapon ? abi.requires_melee_weapon && !player.weapon.firesProjectile : true) && (abi.requires_ranged_weapon ? abi.requires_ranged_weapon && player.weapon.firesProjectile : true)) && !(abi.mana_cost > 0 ? player.silenced() : false) && (abi.requires_concentration ? player.concentration() : true) && !player.isDead) abiDiv.addEventListener("click", () => useAbi(abi));
          else {
            abiDiv.style.filter = "brightness(0.25)";
            if (abi.onCooldown > 0) {
              const cdTxt = document.createElement("p");
              if (abi.recharge_only_in_combat && !state.inCombat) cdTxt.style.color = "red";
              cdTxt.textContent = abi.onCooldown?.toString() || "0";
              frame.append(cdTxt);
            }
          }
        }
        abiDiv.append(abiImg);
        frame.append(abiDiv);
      }
    });
  }
}

function useConsumable(itm) {
  player.effects();
  if(itm.healValue) {
    player.stats.hp += itm.healValue;
    spawnFloatingText(player.cords, itm.healValue.toString(), "lime", 36, 1000, 200);
  } 
  if(itm.manaValue) {
    player.stats.mp += itm.manaValue;
    spawnFloatingText(player.cords, itm.manaValue.toString(), "cyan", 36, 1000, 200);
  } 
  displayText(`<c>cyan<c>[ACTION] <c>white<c>${lang["useConsumable"]}`);
  itm.usesRemaining--;
  if(itm.usesRemaining <= 0) {
    player.inventory.splice(player.inventory.findIndex(item=>item.equippedSlot == itm.equippedSlot), 1);
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
      if (abiSelected == abi && isSelected) frame.style.border = "4px solid gold";
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
  if (abi.base_heal) txt += `<i>${icons.heal_icon}<i><f>20px<f>${lang["heal_power"]}: ${abi.base_heal}\n`;
  if (abi.damages) {
    var total: number = 0;
    var text: string = "";
    Object.entries(abi.damages).forEach((dmg: any) => { total += dmg[1]; text += `<i>${icons[dmg[0] + "_icon"]}<i><f>17px<f>${dmg[1]}, `; });
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
  if (abi.status) {
    txt += `<f>20px<f>${lang["status_effect"]}:\n <i>${statusEffects[abi.status].icon}<i><f>17px<f>${lang["effect_" + statusEffects[abi.status].id + "_name"]}\n`;
    txt += statTT(new statEffect(statusEffects[abi.status], abi.statusModifiers), true);
  }
  if (abi.type) txt += `<f>20px<f>${lang["type"]}: ${lang[abi.type]}\n`;
  if (abi.shoots_projectile != "") txt += `<f>20px<f>${lang["ranged"]}: ${abi.shoots_projectile != "" ? lang["yes"] : lang["no"]}\n`;
  if (abi.requires_melee_weapon) txt += `<i>${icons.melee}<i><f>20px<f>${lang["requires_melee_weapon"]}: ${abi.requires_melee_weapon ? lang["yes"] : lang["no"]}\n`;
  else if (abi.requires_ranged_weapon) txt += `<i>${icons.ranged}<i><f>20px<f>${lang["requires_ranged_weapon"]}: ${abi.requires_ranged_weapon ? lang["yes"] : lang["no"]}\n`;
  if (abi.requires_concentration) txt += `<i>${icons.concentration_icon}<i><f>20px<f>${lang["concentration_req"]}: ${abi.requires_concentration ? lang["yes"] : lang["no"]}\n`;
  if (abi.recharge_only_in_combat) txt += `<i>${icons.fighter_symbol_icon}<i><f>20px<f>${lang["recharge_only_in_combat"]}: ${lang["yes"]}\n`;
  if (abi.aoe_size > 0) txt += `<i>${icons.aoe_size_icon}<i><f>20px<f>${lang["aoe_size"]}: ${Math.floor(abi.aoe_size * 2)}x${Math.floor(abi.aoe_size * 2)}\n`;
  if (abi.self_target) txt += `<f>20px<f>${lang["targets_self"]}: ${lang["yes"]}\n`;
  if (abi.mana_cost > 0) txt += `<i>${icons.mana_icon}<i><f>20px<f>${lang["mana_cost"]}: ${abi.mana_cost}\n`;
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
    Object.entries(abi.damages).forEach((dmg: any) => { total += dmg[1]; text += `<i>${icons[dmg[0] + "_icon"]}<i><f>17px<f>${dmg[1]}, `; });
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
  if (abi.status) {
    txt += `<f>15px<f>${lang["status_effect"]}:\n <i>${statusEffects[abi.status].icon}<i><f>17px<f>${lang["effect_" + statusEffects[abi.status].id + "_name"]}\n`;
    txt += statTT(new statEffect(statusEffects[abi.status], abi.statusModifiers), true);
  }
  if (abi.type) txt += `<f>15px<f>${lang["type"]}: ${lang[abi.type]}\n`;
  if (abi.shoots_projectile != "") txt += `<f>15px<f>${lang["ranged"]}: ${abi.shoots_projectile != "" ? lang["yes"] : lang["no"]}\n`;
  if (abi.requires_melee_weapon) txt += `<i>${icons.melee}<i><f>15px<f>${lang["requires_melee_weapon"]}: ${abi.requires_melee_weapon ? lang["yes"] : lang["no"]}\n`;
  else if (abi.requires_ranged_weapon) txt += `<i>${icons.ranged}<i><f>15px<f>${lang["requires_ranged_weapon"]}: ${abi.requires_ranged_weapon ? lang["yes"] : lang["no"]}\n`;
  if (abi.requires_concentration) txt += `<i>${icons.concentration_icon}<i><f>15px<f>${lang["concentration_req"]}: ${abi.requires_concentration ? lang["yes"] : lang["no"]}\n`;
  if (abi.recharge_only_in_combat) txt += `<i>${icons.fighter_symbol_icon}<i><f>15px<f>${lang["recharge_only_in_combat"]}: ${lang["yes"]}\n`;
  if (abi.aoe_size > 0) txt += `<i>${icons.aoe_size_icon}<i><f>15px<f>${lang["aoe_size"]}: ${Math.floor(abi.aoe_size * 2)}x${Math.floor(abi.aoe_size * 2)}\n`;
  if (abi.self_target) txt += `<f>15px<f>${lang["targets_self"]}: ${lang["yes"]}\n`;
  if (abi.mana_cost > 0) txt += `<i>${icons.mana_icon}<i><f>15px<f>${lang["mana_cost"]}: ${abi.mana_cost}\n`;
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
    key = id + "_name";
    let _value = 0;
    if (player.statusEffects.find((eff: any) => eff.id == effectId)) _value = value;
    frontImg = abilities[id].icon;
    if (value < 0) backImg = `<i>${icons[key_ + "_icon"]}<i>§<c>${flipColor ? "lime" : "red"}<c><f>${embed ? "15px" : "18px"}<f>`;
    else backImg = `<i>${icons[key_ + "_icon"]}<i>§<c>${flipColor ? "red" : "lime"}<c><f>${embed ? "15px" : "18px"}<f>`;
    try {
      var _abi: ability = new Ability(player.abilities?.find((__abi: ability) => __abi.id == id), player);
    }
    catch { }
    if (!_abi) _abi = new Ability(abilities[id], dummy);
    let status: statusEffect = new statEffect(statusEffects[_abi.status], _abi.statusModifiers);
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
    frontImg = abilities[id].icon;
    key = id + "_name";
    flipColor = less_is_better[key_];
    if (key !== "attack_name") {
      if (value < 0) backImg = `<i>${icons[key_ + "_icon"]}<i>§<c>${flipColor ? "lime" : "red"}<c><f>${embed ? "15px" : "18px"}<f>`;
      else backImg = `<i>${icons[key_ + "_icon"]}<i>§<c>${flipColor ? "red" : "lime"}<c><f>${embed ? "15px" : "18px"}<f>`;
      tailEnd = lang[key_];
      if (tailEnd.includes("undefined")) tailEnd = key_;
    }
    //if (tailEnd.includes("multiplier")) value = value * 100;
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


tooltip(document.querySelector(".playerMpBg"), "<i><v>icons.mana_icon<v><i><f>20px<f>Mana: <v>player.stats.mp<v>§/§<v>player.getStats().mpMax<v>§");
tooltip(document.querySelector(".playerHpBg"), "<i><v>icons.health_icon<v><i><f>20px<f>Health: <v>player.stats.hp<v>§/§<v>player.getStats().hpMax<v>§");
tooltip(document.querySelector(".xpBar"), "<f>20px<f>Experience: <v>player.level.xp<v>§/§<v>player.level.xpNeed<v>§");

function updateUI() {
  const ui = <HTMLDivElement>document.querySelector(".playerUI");
  if (!ui) throw new Error("UI NOT LOADED!");
  const hpText = <HTMLParagraphElement>ui.querySelector(".hpText");
  const hpImg = <HTMLImageElement>ui.querySelector(".PlayerHpFill");
  const mpImg = <HTMLImageElement>ui.querySelector(".PlayerMpFill");
  const xp = <HTMLDivElement>document.querySelector(".xpBar .barFill");
  hpText.textContent = `${player.stats.hp} / ${player.getStats().hpMax}`;
  hpImg.style.setProperty("--value", (100 - player.statRemaining("hp")) + "%");
  mpImg.style.setProperty("--value", (100 - player.statRemaining("mp")) + "%");
  generateHotbar();
  generateEffects();
  xp.style.width = `${player.level.xp / player.level.xpNeed * 100}%`;
}

function displayText(txt: string) {
  document.querySelector(".worldText")?.append(textSyntax(txt));
  document.querySelector(".worldText")?.scrollBy(0, 1000);
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

function handleEscape() {
  if(!isSelected && !invOpen && !windowOpen && !menuOpen) {
    openGameMenu();
    menuOpen = true;
  }
  else if(menuOpen) {
    closeGameMenu(false, false, true);
    menuOpen = false;
  }
  if(saveGamesOpen) {
    closeSaveMenu();
  }
  isSelected = false;
  abiSelected = {};
  closeInventory();
  closeCharacter();
  closeLeveling();
  windowOpen = false;
  updateUI();
  contextMenu.textContent = "";
  assignContainer.style.display = "none";
}

window.addEventListener("keyup", e => {
  if (e.key == "r" && !saveGamesOpen) {
    if (player.isDead) {
      player.cords.x = player.respawnPoint.cords.x;
      player.cords.y = player.respawnPoint.cords.y;
      player.isDead = false;
      player.stats.hp = player.getStats().hpMax;
      player.stats.mp = player.getStats().mpMax;
      state.inCombat = false;
      isSelected = false;
      abiSelected = {};
      enemiesHadTurn = 0;
      turnOver = true;
      updateUI();
      modifyCanvas();
      displayText("HERÄSIT KUOLLEISTA!");
      spawnFloatingText(player.cords, "REVIVE!", "green", 36, 575, 75);
    }
  }
  else if (e.key == "Escape") {
    handleEscape();
  }
  if (player.isDead || saveGamesOpen) return;
  const number = parseInt(e.keyCode) - 48;
  if (e.key == "i" && !menuOpen ) {
    renderInventory();
  }
  else if (e.key == "c" && !menuOpen) {
    windowOpen = true;
    renderCharacter();
  }
  else if (e.key == "p" && !menuOpen) {
    windowOpen = true;
    openLevelingScreen();
  }
  else if(invOpen || windowOpen || menuOpen) return;
  else if (number > -1 && e.shiftKey) {
    let abi = player.abilities.find(a => a.equippedSlot == number + 9);
    if (number == 0) abi = player.abilities.find(a => a.equippedSlot == 19);
    if (!abi) {
      let itm = player.inventory.find(a => a.equippedSlot == number + 9);
      if (number == 0) itm = player.inventory.find(a => a.equippedSlot == 19);
      if(itm) useConsumable(itm);
      return;
    } 
    else if ((abi.onCooldown == 0 && player.stats.mp >= abi.mana_cost && ((abi.requires_melee_weapon ? abi.requires_melee_weapon && !player.weapon.firesProjectile : true) && (abi.requires_ranged_weapon ? abi.requires_ranged_weapon && player.weapon.firesProjectile : true)) && !(abi.mana_cost > 0 ? player.silenced() : false) && (abi.requires_concentration ? player.concentration() : true))) useAbi(abi);
  }
  else if (number > -1 && !e.shiftKey) {
    let abi = player.abilities.find(a => a.equippedSlot == number - 1);
    if (number == 0) abi = player.abilities.find(a => a.equippedSlot == 9);
    if (!abi) {
      let itm = player.inventory.find(a => a.equippedSlot == number - 1);
      if (number == 0) itm = player.inventory.find(a => a.equippedSlot == 9);
      if(itm) useConsumable(itm);
      return;
    } 
    if ((abi.onCooldown == 0 && player.stats.mp >= abi.mana_cost && ((abi.requires_melee_weapon ? abi.requires_melee_weapon && !player.weapon.firesProjectile : true) && (abi.requires_ranged_weapon ? abi.requires_ranged_weapon && player.weapon.firesProjectile : true)) && !(abi.mana_cost > 0 ? player.silenced() : false) && (abi.requires_concentration ? player.concentration() : true))) useAbi(abi);
  }
});

function renderCharacter() {
  hideHover();
  const bg = document.querySelector<HTMLDivElement>(".playerWindow");
  document.querySelector<HTMLDivElement>(".worldText").style.opacity = "0";
  bg.style.transform = "scale(1)";
  bg.textContent = "";
  const pc = renderPlayerPortrait();
  const nameAndRace = textSyntax(`<bcss>position: absolute; left: 328px; top: 36px<bcss><f>42px<f><c>yellow<c>${player.name} \n\n§<f>32px<f><c>white<c>Level ${player.level.level} ${raceTexts[player.race].name}\n\n§<i>${icons.health_icon}<i><f>32px<f><c>red<c>${player.stats.hp}/${player.getStats().hpMax} HP\n§<i>${icons.mana_icon}<i><f>32px<f><c>blue<c>${player.stats.mp}/${player.getStats().mpMax} MP`);
  var statsText = `<bcss>position: absolute; left: 24px; top: 298px;<bcss><f>32px<f>Core stats§\n\n`;
  statsText += `<cl>strSpan<cl><i>${icons.str_icon}<i><f>24px<f>Strength: ${player.getStats().str}\n§<cl>dexSpan<cl><i>${icons.dex_icon}<i><f>24px<f>Dexterity: ${player.getStats().dex}\n§<cl>vitSpan<cl><i>${icons.vit_icon}<i><f>24px<f>Vitality: ${player.getStats().vit}\n§<cl>intSpan<cl><i>${icons.int_icon}<i><f>24px<f>Intelligence: ${player.getStats().int}\n§<cl>cunSpan<cl><i>${icons.cun_icon}<i><f>24px<f>Cunning: ${player.getStats().cun}`;
  const stats = textSyntax(statsText);
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
  bg.append(pc, nameAndRace, stats, resistances, effResistances);
  tooltip(bg.querySelector(".strSpan"), `<i>${icons.str_icon}<i>Strength increases <i>${icons.melee}<i>melee \ndamage by 5% per level. \nAlso increases carry weight by 0.5.`);
  tooltip(bg.querySelector(".dexSpan"), `<i>${icons.dex_icon}<i>Dexterity increases <i>${icons.ranged}<i>ranged \ndamage by 5% per level.`);
  tooltip(bg.querySelector(".vitSpan"), `<i>${icons.vit_icon}<i>Vitality increases <i>${icons.health_icon}<i>health by by 5 per level. \nAlso increases carry weight by 1.`);
  tooltip(bg.querySelector(".intSpan"), `<i>${icons.int_icon}<i>Intelligence increases spell \ndamage by 5% per level. \nAlso increases mana by 2.`);
  tooltip(bg.querySelector(".cunSpan"), `<i>${icons.cun_icon}<i>Cunning increases crit chance by 0.25% \nand crit dmg by 2% per level.`);
}

function closeCharacter() {
  hideHover();
  document.querySelector<HTMLDivElement>(".worldText").style.opacity = "1";
  const bg = document.querySelector<HTMLDivElement>(".playerWindow");
  bg.style.transform = "scale(0)";
}

player.updateAbilities();
maps[currentMap].enemies.forEach((en: Enemy) => en.updateAbilities());
updateUI();