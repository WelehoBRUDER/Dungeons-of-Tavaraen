/* THIS FILE IS ACTUALLY FOR MOST UI RELATED STUFF, DESPITE THE NAME */
// @ts-nocheck
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
        if (abi.onCooldown == 0 && player.stats.mp >= abi.mana_cost && ((abi.requires_melee_weapon ? abi.requires_melee_weapon && !player.weapon.firesProjectile : true) && (abi.requires_ranged_weapon ? abi.requires_ranged_weapon && player.weapon.firesProjectile : true)) && !(abi.mana_cost > 0 ? player.silenced() : false) && (abi.requires_concentration ? player.concentration() : true)) abiDiv.addEventListener("click", () => useAbi(abi));
        else {
          abiDiv.style.filter = "brightness(0.25)";
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
  if (abi.mana_cost > 0 && player.silenced()) txt += `<i>${icons.silence_icon}<i><f>20px<f><c>orange<c>You are silenced!§\n`;
  if (abi.requires_concentration && !player.concentration()) txt += `<i>${icons.break_concentration_icon}<i><f>20px<f><c>orange<c>Your concentration is broken!§\n`;
  if (abi.base_heal) txt += `<i>${icons.heal_icon}<i><f>20px<f>Healing Power: ${abi.base_heal}\n`;
  if (abi.damages) {
    var total: number = 0;
    var text: string = "";
    Object.entries(abi.damages).forEach((dmg: any) => { total += dmg[1]; text += `<i>${icons[dmg[0] + "_icon"]}<i><f>17px<f>${dmg[1]}, `; });
    text = text.substring(0, text.length - 2);
    txt += `<i>${icons.damage_icon}<i><f>20px<f>Damage: ${total} <f>17px<f>(${text})\n`;
  }
  if (abi.damage_multiplier) txt += `<i>${icons.damage_icon}<i><f>20px<f>Damage Multiplier: ${abi.damage_multiplier * 100}%\n`;
  if (abi.resistance_penetration) txt += `<i>${icons.rp_icon}<i><f>20px<f>Resistance Penetration: ${abi.resistance_penetration ? abi.resistance_penetration : "0"}%\n`;
  if (parseInt(abi.use_range) > 0) txt += `<i>${icons.range_icon}<i><f>20px<f>Use Range: ${abi.use_range} tiles\n`;
  if (abi.status) {
    txt += `<f>20px<f>Status Effect:\n <i>${statusEffects[abi.status].icon}<i><f>17px<f>${statusEffects[abi.status].name}\n`;
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
  Object.entries(status.effects).forEach(eff => txt += effectSyntax(eff, embed, status.id));
  if (status.silence) txt += `§${embed ? " " : ""}<i>${icons.silence_icon}<i><f>${embed ? "16px" : "20px"}<f><c>orange<c>Magic silenced!\n`;
  if (status.break_concentration) txt += `§${embed ? " " : ""}<i>${icons.break_concentration_icon}<i><f>${embed ? "16px" : "20px"}<f><c>orange<c>Concentration broken!\n`;
  if (!embed) txt += `§<i>${icons.cooldown_icon}<i><f>20px<f>Removed in: ${status.last.current} turns\n`;
  else txt += `§${embed ? " " : ""}<i>${icons.cooldown_icon}<i><f>16px<f>Lasts for: ${status.last.total} turns\n`;
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
    tailEnd = "Resist";
  }
  else if (key.includes("Damage")) {
    key = key.replace("Damage", "");
    key_ = key;
    tailEnd = "Damage";
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
    let _value = 0;
    if (player.statusEffects.find((eff: any) => eff.id == effectId)) _value = value;
    key = abilities[id].name + "'s";
    frontImg = abilities[id].icon;
    if (value < 0) backImg = `<i>${icons[key_ + "_icon"]}<i>§<c>${flipColor ? "lime" : "red"}<c><f>${embed ? "15px" : "18px"}<f>`;
    else backImg = `<i>${icons[key_ + "_icon"]}<i>§<c>${flipColor ? "red" : "lime"}<c><f>${embed ? "15px" : "18px"}<f>`;
    var _abi: ability = new Ability(player.abilities?.find((__abi: ability) => __abi.id == id), player);
    if (!_abi) _abi = new Ability(abilities[id], dummy);
    let status: statusEffect = new statEffect(statusEffects[_abi.status], _abi.statusModifiers);
    tailEnd = parsed_modifiers[_d] + " status";
    lastBit = `[${(status?.effects[_d] - _value || status?.[_d]?.["total"] - _value || status?.[_d] - _value) || 0}${_d.endsWith("P") ? "%" : ""}-->${((status?.effects[_d] - _value || status?.[_d]?.["total"] - _value || status?.[_d] - _value) || 0) + value}${_d.endsWith("P") ? "%" : ""}]`;
  }
  else if (keyIncludesAbility(key)) {
    key_ = keyIncludesAbility(key);
    let id = key.replace("_" + key_, "");
    frontImg = abilities[id].icon;
    key = abilities[id].name;
    key += "'s";
    flipColor = less_is_better[key_];
    if (value < 0) backImg = `<i>${icons[key_ + "_icon"]}<i>§<c>${flipColor ? "lime" : "red"}<c><f>${embed ? "15px" : "18px"}<f>`;
    else backImg = `<i>${icons[key_ + "_icon"]}<i>§<c>${flipColor ? "red" : "lime"}<c><f>${embed ? "15px" : "18px"}<f>`;
    tailEnd = key_.replace("_", " ");
    if (tailEnd.includes("multiplier")) value = value * 100;
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
    case "hpMax":
      key = "Health";
      break;
    case "mpMax":
      key = "Mana";
      break;
  }
  var img = icons[_key + "_icon"];
  if (!img) img = icons[key_ + tailEnd + "_icon"];
  if (!img) img = icons[key_ + "_icon"];
  if (value < 0) {
    text += `§${embed ? " " : ""}<c>${flipColor ? "lime" : "red"}<c><f>${embed ? "15px" : "18px"}<f>Decreases <i>${frontImg === "" ? img : frontImg}<i>${key} ${backImg ? backImg : ""}${tailEnd} by ${rawKey.endsWith("P") ? Math.abs(value) + "%" : Math.abs(value)} ${lastBit}\n`;
  } else text += `§${embed ? " " : ""}<c>${flipColor ? "red" : "lime"}<c><f>${embed ? "15px" : "18px"}<f>Increases <i>${frontImg === "" ? img : frontImg}<i>${key} ${backImg ? backImg : ""}${tailEnd} by ${rawKey.endsWith("P") ? value + "%" : value} ${lastBit}\n`;
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

window.addEventListener("keyup", e => {
  if (e.key == "i") {
    renderInventory();
  }
  else if (e.key == "c") {
    renderCharacter();
  }
  else if (e.key == "Escape") {
    closeInventory();
    closeCharacter();
  }
});

function renderCharacter() {
  hideHover();
  const bg = document.querySelector<HTMLDivElement>(".playerWindow");
  document.querySelector<HTMLDivElement>(".worldText").style.opacity = "0";
  bg.style.transform = "scale(1)";
  bg.textContent = "";
  const pc = renderPlayerPortrait();
  const nameAndRace = textSyntax(`<bcss>position: absolute; left: 328px; top: 36px<bcss><f>42px<f><c>yellow<c>${player.name} \n\n§<f>32px<f><c>white<c>${raceTexts[player.race].name}\n\n§<i>${icons.health_icon}<i><f>32px<f><c>red<c>${player.stats.hp}/${player.getStats().hpMax} HP\n§<i>${icons.mana_icon}<i><f>32px<f><c>blue<c>${player.stats.mp}/${player.getStats().mpMax} MP`);
  var statsText = `<bcss>position: absolute; left: 24px; top: 298px;<bcss><f>32px<f>Core stats§\n\n`;
  statsText += `<cl>strSpan<cl><i>${icons.str_icon}<i><f>24px<f>Strength: ${player.getStats().str}\n§<cl>dexSpan<cl><i>${icons.dex_icon}<i><f>24px<f>Dexterity: ${player.getStats().dex}\n§<cl>vitSpan<cl><i>${icons.vit_icon}<i><f>24px<f>Vitality: ${player.getStats().vit}\n§<cl>intSpan<cl><i>${icons.int_icon}<i><f>24px<f>Intelligence: ${player.getStats().int}\n§<cl>cunSpan<cl><i>${icons.cun_icon}<i><f>24px<f>Cunning: ${player.getStats().cun}`;
  const stats = textSyntax(statsText);
  var resistancesText = `<bcss>position: absolute; left: 24px; top: 500px;<bcss><f>32px<f>Core resistances§\n\n`;
  Object.entries(player.getResists()).forEach(resistance=>{
    const str = resistance[0];
    const val = resistance[1];
    resistancesText += `<i>${icons[str + "_icon"]}<i><c>white<c>${str}: <c>${val < 0 ? "crimson" : val > 0 ? "lime" : "white"}<c>${val}%\n`;
  });
  const resistances = textSyntax(resistancesText);
  tooltip(resistances, "Resistance decreases incoming damage\n of its type by the indicated number.\n For example, 50% resistance means\n you take half damage.");
  var effectResTxt = `<bcss>position: absolute; left: 364px; top: 298px;<bcss><f>32px<f>Status resistances§\n\n`;
  Object.entries(player.getStatusResists()).forEach(resistance=>{
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

function saveToFile() {
  var saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
      var json = JSON.stringify(data),
        blob = new Blob([json], { type: "octet/stream" }),
        url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    };

  }());
  let saveArray = [
    {
      key: "player",
      data: player
    },
    {
      key: "itemData",
      data: itemData
    },
    {
      key: "enemies",
      data: fallenEnemies
    }
  ];
  let minutes = new Date().getMinutes();
  if (minutes < 10) minutes = `0${new Date().getMinutes()}`;
  saveData(saveArray, `TAVARAEN-${player.name}-save-${new Date().getHours()}.${minutes}.txt`);
}

function loadFromfile() {
  let fileInput = document.createElement("input");
  fileInput.setAttribute('type', 'file');
  fileInput.click();
  fileInput.addEventListener("change", () => HandleFile(fileInput.files[0]));
}

function HandleFile(file) {
  let reader = new FileReader();
  let text = "";

  // file reading finished successfully
  reader.addEventListener('load', function (e) {
    // contents of file in variable     
    text = e.target.result;
    FinishRead();
  });

  // read as text file
  reader.readAsText(file);

  function FinishRead() {
    let Table = JSON.parse(text);
    LoadSlotPromptFile(file.name, Table);
  }
}

function LoadSlotPromptFile(name, data) {
  LoadSlot(data);
}

function GetKey(key, table) {
  for (let object of table) {
    if (object.key == key) {
      return object;
    }
  }
}

function LoadSlot(data) {
  player = new PlayerCharacter(GetKey("player", data).data);
  itemData = GetKey("itemData", data).data;
  fallenEnemies = GetKey("enemies", data).data;
  modifyCanvas();
  player.updateAbilities();
  updateUI();
}




player.updateAbilities();
maps[currentMap].enemies.forEach((en: Enemy) => en.updateAbilities());
updateUI();