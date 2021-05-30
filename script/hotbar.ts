/* THIS FILE IS ACTUALLY FOR MOST UI RELATED STUFF, DESPITE THE NAME */
const tooltipBox = <HTMLDivElement>document.querySelector("#globalHover");

var settings = {
  log_enemy_movement: false
};

function generateHotbar() {
  const hotbar = <HTMLDivElement>document.querySelector(".hotbar");
  hotbar.textContent = "";
  for (let i = 0; i < 20; i++) {
    const bg = document.createElement("img");
    const frame = document.createElement("div");
    frame.classList.add("hotbarFrame");
    bg.src = "resources/ui/hotbar_bg.png";
    frame.append(bg);
    hotbar.append(frame);
    player.abilities?.map((abi: ability) => {
      if (abi.equippedSlot == i && abi.id != "attack") {
        const abiDiv = document.createElement("div");
        const abiImg = document.createElement("img");
        abiDiv.classList.add("ability");
        if (abiSelected == abi && isSelected) frame.style.border = "4px solid gold";
        abiImg.src = abi.icon;
        tooltip(abiDiv, abiTT(abi));
        // @ts-expect-error
        if (abi.onCooldown == 0 && player.stats.mp >= abi.mana_cost && ((abi.requires_melee_weapon ? abi.requires_melee_weapon && !player.weapon.firesProjectile : true) && (abi.requires_ranged_weapon ? abi.requires_ranged_weapon && player.weapon.firesProjectile : true)) && !(abi.mana_cost > 0 ? player.silenced() : false) && (abi.requires_concentration ? player.concentration() : true)) abiDiv.addEventListener("click", () => useAbi(abi));
        else {
          abiDiv.style.filter = "brightness(0.25)";
          // @ts-expect-error
          if (abi.onCooldown > 0) {
            const cdTxt = document.createElement("p");
            cdTxt.textContent = abi.onCooldown?.toString() || "0";
            frame.append(cdTxt);
          }
        }
        abiDiv.append(abiImg);
        frame.append(abiDiv);
      }
    });
  }
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
  txt += `\t<f>26px<f>${abi.name}\t\n`;
  // @ts-expect-error
  if (abi.mana_cost > 0 && player.silenced()) txt += `<i>${icons.silence_icon}<i><f>20px<f><c>orange<c>You are silenced!§\n`;
  // @ts-expect-error
  if (abi.requires_concentration && !player.concentration()) txt += `<i>${icons.break_concentration_icon}<i><f>20px<f><c>orange<c>Your concentration is broken!§\n`;
  if (abi.base_heal) txt += `<i>${icons.heal_icon}<i><f>20px<f>Healing Power: ${abi.base_heal}\n`;
  if (abi.damages) {
    var total: number = 0;
    var text: string = "";
    // @ts-expect-error
    Object.entries(abi.damages).forEach((dmg: any) => { total += dmg[1]; text += `<i>${icons[dmg[0] + "_icon"]}<i><f>17px<f>${dmg[1]}, `; });
    text = text.substring(0, text.length - 2);
    txt += `<i>${icons.damage_icon}<i><f>20px<f>Damage: ${total} <f>17px<f>(${text})\n`;
  }
  if (abi.damage_multiplier) txt += `<i>${icons.damage_icon}<i><f>20px<f>Damage Multiplier: ${abi.damage_multiplier * 100}%\n`;
  if (abi.resistance_penetration !== 0) txt += `<i>${icons.rp_icon}<i><f>20px<f>Resistance Penetration: ${abi.resistance_penetration ? abi.resistance_penetration : "0"}%\n`;
  if (parseInt(abi.use_range) > 0) txt += `<i>${icons.range_icon}<i><f>20px<f>Use Range: ${abi.use_range} tiles\n`;
  if (abi.status) {
    // @ts-ignore
    txt += `<f>20px<f>Status Effect:\n <i>${statusEffects[abi.status].icon}<i><f>17px<f>${statusEffects[abi.status].name}\n`;
    // @ts-expect-error
    txt += statTT(new statEffect(statusEffects[abi.status], abi.statusModifiers), true);
  }
  if (abi.type) txt += `<f>20px<f>Type: ${abi.type}\n`;
  txt += `<f>20px<f>Ranged: ${abi.shoots_projectile != "" ? "yes" : "no"}\n`;
  if (abi.requires_melee_weapon) txt += `<i>${icons.melee}<i><f>20px<f>Requires Melee Weapon: ${abi.requires_melee_weapon ? "yes" : "no"}\n`;
  else if (abi.requires_ranged_weapon) txt += `<i>${icons.ranged}<i><f>20px<f>Requires Ranged Weapon: ${abi.requires_ranged_weapon ? "yes" : "no"}\n`;
  if (abi.requires_concentration) txt += `<i>${icons.concentration_icon}<i><f>20px<f>Requires Concentration: ${abi.requires_concentration ? "yes" : "no"}\n`;
  if (abi.self_target) txt += `<f>20px<f>Targets Self: yes\n`;
  if (abi.mana_cost > 0) txt += `<i>${icons.mana_icon}<i><f>20px<f>Mana Cost: ${abi.mana_cost}\n`;
  if (abi.cooldown > 0) txt += `<i>${icons.cooldown_icon}<i><f>20px<f>Cooldown: ${abi.cooldown} turns\n`;
  return txt;
}

// Tooltip for status
function statTT(status: statEffect, embed: boolean = false) {
  var txt: string = "";
  if (!embed) txt += `\t<f>26px<f>${status.name}\t\n`;
  if (status.dot) txt += `§${embed ? " " : ""}<f>${embed ? "16px" : "20px"}<f>Deals ${status.dot.damageAmount} <i>${status.dot.icon}<i>${status.dot.damageType} damage\n`;
  // @ts-ignore
  Object.entries(status.effects).forEach(eff => txt += effectSyntax(eff, embed));
  if(status.silence) txt += `§${embed ? " " : ""}<i>${icons.silence_icon}<i><f>${embed ? "16px" : "20px"}<f><c>orange<c>Magic silenced!\n`;
  if(status.break_concentration) txt += `§${embed ? " " : ""}<i>${icons.break_concentration_icon}<i><f>${embed ? "16px" : "20px"}<f><c>orange<c>Concentration broken!\n`;
  if (!embed) txt += `§<i>${icons.cooldown_icon}<i><f>20px<f>Removed in: ${status.last.current} turns\n`;
  else txt += `§${embed ? " " : ""}<i>${icons.cooldown_icon}<i><f>16px<f>Lasts for: ${status.last.total} turns\n`;
  return txt;
}

function keyIncludesAbility(key: string) {
  let answer: string = "";
  straight_modifiers.forEach((mod: string)=>{
    if(key.includes(mod)) answer = mod;
  });
  return answer;
}

// Syntax for effects
function effectSyntax(effect: any, embed: boolean = false) {
  let text: string = "";
  const rawKey = effect[0];
  var value = effect[1];
  var flipColor = false;
  var key: string = rawKey.substring(0, rawKey.length - 1);
  var key_: string = key;
  var tailEnd: string = "";
  const _key: string = key;
  var frontImg: string = "";
  var backImg: string = "";
  if(key.includes("Resist")) {
    key = key.replace("Resist", "");
    key_ = key;
    tailEnd = "Resist";
  }
  else if(key.includes("Damage")) {
    key = key.replace("Damage", "");
    key_ = key;
    tailEnd = "Damage";
  }
  else if(keyIncludesAbility(key)) {
    key_ = keyIncludesAbility(key);
    let id = key.replace("_" + key_, "");
     // @ts-ignore
    frontImg = abilities[id].icon;
    // @ts-ignore
    key = abilities[id].name;
    key += "'s";
    // @ts-ignore
    flipColor = less_is_better[key_];
    // @ts-ignore
    if(value < 0) backImg = `<i>${icons[key_ + "_icon"]}<i>§<c>${flipColor ? "lime" : "red"}<c><f>${embed ? "15px" : "18px"}<f>`;
    // @ts-ignore
    else backImg = `<i>${icons[key_ + "_icon"]}<i>§<c>${flipColor ? "red" : "lime"}<c><f>${embed ? "15px" : "18px"}<f>`;
    tailEnd = key_.replace("_", " ");
    if(tailEnd.includes("multiplier")) value = value * 100;
  }
  switch (key) {
    case "str":
      key = "Strength";
      break;
    case "dex":
      key = "Dexterity";
      break;
    case "vit":
      key = "Vitality";
      break;
    case "int":
      key = "Intelligence";
      break;
    case "awr":
      key = "awareness";
      break;
    case "crush":
      key = "Crushing";
      break;
    case "slash":
      key = "Slashing";
      break;
    case "pierce":
      key = "Piercing";
      break;
    case "fire":
      key = "Fire";
      break;
    case "ice":
      key = "Ice";
      break;
    case "dark":
      key = "Dark";
      break;
    case "divine":
      key = "Divine";
      break;
    case "lightning":
      key = "Lightning";
      break;
  }
  // @ts-ignore
  var img = icons[_key + "_icon"];
  // @ts-ignore
  if(!img) img = icons[key_ + tailEnd + "_icon"];
  // @ts-ignore
  if(!img) img = icons[key_ + "_icon"];
  // @ts-ignore
  if (value < 0) {
    // @ts-ignore
    text += `§${embed ? " " : ""}<c>${flipColor ? "lime" : "red"}<c><f>${embed ? "15px" : "18px"}<f>Decreases <i>${frontImg === "" ? img : frontImg}<i>${key} ${backImg ? backImg : ""}${tailEnd} by ${rawKey.endsWith("P") ? Math.abs(value) + "%" : Math.abs(value)}\n`;
    // @ts-ignore
  } else text += `§${embed ? " " : ""}<c>${flipColor ? "red" : "lime"}<c><f>${embed ? "15px" : "18px"}<f>Increases <i>${frontImg === "" ? img : frontImg}<i>${key} ${backImg ? backImg : ""}${tailEnd} by ${rawKey.endsWith("P") ? value + "%" : value}\n`;
  return text;
}

// @ts-ignore
tooltip(document.querySelector(".playerMpBg"), "<i><v>icons.mana_icon<v><i><f>20px<f>Mana: <v>player.stats.mp<v>§/§<v>player.getStats().mpMax<v>§");
// @ts-ignore
tooltip(document.querySelector(".playerHpBg"), "<i><v>icons.health_icon<v><i><f>20px<f>Health: <v>player.stats.hp<v>§/§<v>player.getStats().hpMax<v>§");
// @ts-ignore
tooltip(document.querySelector(".xpBar"), "<f>20px<f>Experience: <v>player.level.xp<v>§/§<v>player.level.xpNeed<v>§");

function updateUI() {
  const ui = <HTMLDivElement>document.querySelector(".playerUI");
  if (!ui) throw new Error("UI NOT LOADED!");
  const hpText = <HTMLParagraphElement>ui.querySelector(".hpText");
  const hpImg = <HTMLImageElement>ui.querySelector(".PlayerHpFill");
  const mpImg = <HTMLImageElement>ui.querySelector(".PlayerMpFill");
  const xp = <HTMLDivElement>document.querySelector(".xpBar .barFill");
  hpText.textContent = `${player.stats.hp} / ${player.getStats().hpMax}`;
  // @ts-ignore
  hpImg.style.setProperty("--value", (100 - player.statRemaining("hp")) + "%");
  // @ts-ignore
  mpImg.style.setProperty("--value", (100 - player.statRemaining("mp")) + "%");
  generateHotbar();
  generateEffects();
  xp.style.width = `${player.level.xp / player.level.xpNeed * 100}%`;
}

function displayText(txt: string) {
  // @ts-ignore
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
  // @ts-expect-error
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


// @ts-expect-error
player.updateAbilities();
// @ts-expect-error
maps[currentMap].enemies.forEach((en: Enemy)=>en.updateAbilities());
updateUI();