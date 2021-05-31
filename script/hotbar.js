"use strict";
/* THIS FILE IS ACTUALLY FOR MOST UI RELATED STUFF, DESPITE THE NAME */
// @ts-nocheck
const tooltipBox = document.querySelector("#globalHover");
var settings = {
    log_enemy_movement: false
};
function generateHotbar() {
    var _a;
    const hotbar = document.querySelector(".hotbar");
    hotbar.textContent = "";
    for (let i = 0; i < 20; i++) {
        const bg = document.createElement("img");
        const frame = document.createElement("div");
        frame.classList.add("hotbarFrame");
        bg.src = "resources/ui/hotbar_bg.png";
        frame.append(bg);
        hotbar.append(frame);
        (_a = player.abilities) === null || _a === void 0 ? void 0 : _a.map((abi) => {
            var _a;
            if (abi.equippedSlot == i && abi.id != "attack") {
                const abiDiv = document.createElement("div");
                const abiImg = document.createElement("img");
                abiDiv.classList.add("ability");
                if (abiSelected == abi && isSelected)
                    frame.style.border = "4px solid gold";
                abiImg.src = abi.icon;
                tooltip(abiDiv, abiTT(abi));
                if (abi.onCooldown == 0 && player.stats.mp >= abi.mana_cost && ((abi.requires_melee_weapon ? abi.requires_melee_weapon && !player.weapon.firesProjectile : true) && (abi.requires_ranged_weapon ? abi.requires_ranged_weapon && player.weapon.firesProjectile : true)) && !(abi.mana_cost > 0 ? player.silenced() : false) && (abi.requires_concentration ? player.concentration() : true))
                    abiDiv.addEventListener("click", () => useAbi(abi));
                else {
                    abiDiv.style.filter = "brightness(0.25)";
                    if (abi.onCooldown > 0) {
                        const cdTxt = document.createElement("p");
                        cdTxt.textContent = ((_a = abi.onCooldown) === null || _a === void 0 ? void 0 : _a.toString()) || "0";
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
    const effects = document.querySelector(".playerEffects");
    effects.textContent = "";
    player.statusEffects.forEach((effect) => {
        const img = document.createElement("img");
        img.classList.add("status");
        img.src = effect.icon;
        tooltip(img, statTT(effect));
        effects.append(img);
    });
}
// Tooltip for ability
function abiTT(abi) {
    var txt = "";
    txt += `\t<f>26px<f>${abi.name}\t\n`;
    if (abi.mana_cost > 0 && player.silenced())
        txt += `<i>${icons.silence_icon}<i><f>20px<f><c>orange<c>You are silenced!§\n`;
    if (abi.requires_concentration && !player.concentration())
        txt += `<i>${icons.break_concentration_icon}<i><f>20px<f><c>orange<c>Your concentration is broken!§\n`;
    if (abi.base_heal)
        txt += `<i>${icons.heal_icon}<i><f>20px<f>Healing Power: ${abi.base_heal}\n`;
    if (abi.damages) {
        var total = 0;
        var text = "";
        Object.entries(abi.damages).forEach((dmg) => { total += dmg[1]; text += `<i>${icons[dmg[0] + "_icon"]}<i><f>17px<f>${dmg[1]}, `; });
        text = text.substring(0, text.length - 2);
        txt += `<i>${icons.damage_icon}<i><f>20px<f>Damage: ${total} <f>17px<f>(${text})\n`;
    }
    if (abi.damage_multiplier)
        txt += `<i>${icons.damage_icon}<i><f>20px<f>Damage Multiplier: ${abi.damage_multiplier * 100}%\n`;
    if (abi.resistance_penetration)
        txt += `<i>${icons.rp_icon}<i><f>20px<f>Resistance Penetration: ${abi.resistance_penetration ? abi.resistance_penetration : "0"}%\n`;
    if (parseInt(abi.use_range) > 0)
        txt += `<i>${icons.range_icon}<i><f>20px<f>Use Range: ${abi.use_range} tiles\n`;
    if (abi.status) {
        txt += `<f>20px<f>Status Effect:\n <i>${statusEffects[abi.status].icon}<i><f>17px<f>${statusEffects[abi.status].name}\n`;
        txt += statTT(new statEffect(statusEffects[abi.status], abi.statusModifiers), true);
    }
    if (abi.type)
        txt += `<f>20px<f>Type: ${abi.type}\n`;
    txt += `<f>20px<f>Ranged: ${abi.shoots_projectile != "" ? "yes" : "no"}\n`;
    if (abi.requires_melee_weapon)
        txt += `<i>${icons.melee}<i><f>20px<f>Requires Melee Weapon: ${abi.requires_melee_weapon ? "yes" : "no"}\n`;
    else if (abi.requires_ranged_weapon)
        txt += `<i>${icons.ranged}<i><f>20px<f>Requires Ranged Weapon: ${abi.requires_ranged_weapon ? "yes" : "no"}\n`;
    if (abi.requires_concentration)
        txt += `<i>${icons.concentration_icon}<i><f>20px<f>Requires Concentration: ${abi.requires_concentration ? "yes" : "no"}\n`;
    if (abi.self_target)
        txt += `<f>20px<f>Targets Self: yes\n`;
    if (abi.mana_cost > 0)
        txt += `<i>${icons.mana_icon}<i><f>20px<f>Mana Cost: ${abi.mana_cost}\n`;
    if (abi.cooldown > 0)
        txt += `<i>${icons.cooldown_icon}<i><f>20px<f>Cooldown: ${abi.cooldown} turns\n`;
    return txt;
}
// Tooltip for status
function statTT(status, embed = false) {
    var txt = "";
    if (!embed)
        txt += `\t<f>26px<f>${status.name}\t\n`;
    if (status.dot)
        txt += `§${embed ? " " : ""}<f>${embed ? "16px" : "20px"}<f>Deals ${status.dot.damageAmount} <i>${status.dot.icon}<i>${status.dot.damageType} damage\n`;
    Object.entries(status.effects).forEach(eff => txt += effectSyntax(eff, embed, status.id));
    if (status.silence)
        txt += `§${embed ? " " : ""}<i>${icons.silence_icon}<i><f>${embed ? "16px" : "20px"}<f><c>orange<c>Magic silenced!\n`;
    if (status.break_concentration)
        txt += `§${embed ? " " : ""}<i>${icons.break_concentration_icon}<i><f>${embed ? "16px" : "20px"}<f><c>orange<c>Concentration broken!\n`;
    if (!embed)
        txt += `§<i>${icons.cooldown_icon}<i><f>20px<f>Removed in: ${status.last.current} turns\n`;
    else
        txt += `§${embed ? " " : ""}<i>${icons.cooldown_icon}<i><f>16px<f>Lasts for: ${status.last.total} turns\n`;
    return txt;
}
function keyIncludesAbility(key) {
    let answer = "";
    straight_modifiers.forEach((mod) => {
        if (key.includes(mod))
            answer = mod;
    });
    return answer;
}
// Syntax for effects
function effectSyntax(effect, embed = false, effectId = "") {
    var _a, _b, _c;
    let text = "";
    const rawKey = effect[0];
    var value = effect[1];
    var flipColor = false;
    var key = rawKey.substring(0, rawKey.length - 1);
    var key_ = key;
    var tailEnd = "";
    var lastBit = "";
    const _key = key;
    var frontImg = "";
    var backImg = "";
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
        let _d = "";
        const mod_array = possible_modifiers.concat(possible_stat_modifiers);
        mod_array.forEach((modi) => {
            if (id.includes(modi)) {
                id = id.replace("_" + modi, "");
                if (modi[modi.length - 1] == "P" || modi[modi.length - 1] == "V")
                    key_ = modi.substring(0, modi.length - 1);
                else
                    key_ = modi;
                _d = modi;
            }
        });
        let _value = 0;
        if (player.statusEffects.find((eff) => eff.id == effectId))
            _value = value;
        key = abilities[id].name + "'s";
        frontImg = abilities[id].icon;
        if (value < 0)
            backImg = `<i>${icons[key_ + "_icon"]}<i>§<c>${flipColor ? "lime" : "red"}<c><f>${embed ? "15px" : "18px"}<f>`;
        else
            backImg = `<i>${icons[key_ + "_icon"]}<i>§<c>${flipColor ? "red" : "lime"}<c><f>${embed ? "15px" : "18px"}<f>`;
        var _abi = new Ability((_a = player.abilities) === null || _a === void 0 ? void 0 : _a.find((__abi) => __abi.id == id), player);
        if (!_abi)
            _abi = new Ability(abilities[id], dummy);
        let status = new statEffect(statusEffects[_abi.status], _abi.statusModifiers);
        tailEnd = parsed_modifiers[_d] + " status";
        lastBit = `[${((status === null || status === void 0 ? void 0 : status.effects[_d]) - _value || ((_b = status === null || status === void 0 ? void 0 : status[_d]) === null || _b === void 0 ? void 0 : _b["total"]) - _value || (status === null || status === void 0 ? void 0 : status[_d]) - _value) || 0}${_d.endsWith("P") ? "%" : ""}-->${(((status === null || status === void 0 ? void 0 : status.effects[_d]) - _value || ((_c = status === null || status === void 0 ? void 0 : status[_d]) === null || _c === void 0 ? void 0 : _c["total"]) - _value || (status === null || status === void 0 ? void 0 : status[_d]) - _value) || 0) + value}${_d.endsWith("P") ? "%" : ""}]`;
    }
    else if (keyIncludesAbility(key)) {
        key_ = keyIncludesAbility(key);
        let id = key.replace("_" + key_, "");
        frontImg = abilities[id].icon;
        key = abilities[id].name;
        key += "'s";
        flipColor = less_is_better[key_];
        if (value < 0)
            backImg = `<i>${icons[key_ + "_icon"]}<i>§<c>${flipColor ? "lime" : "red"}<c><f>${embed ? "15px" : "18px"}<f>`;
        else
            backImg = `<i>${icons[key_ + "_icon"]}<i>§<c>${flipColor ? "red" : "lime"}<c><f>${embed ? "15px" : "18px"}<f>`;
        tailEnd = key_.replace("_", " ");
        if (tailEnd.includes("multiplier"))
            value = value * 100;
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
    var img = icons[_key + "_icon"];
    if (!img)
        img = icons[key_ + tailEnd + "_icon"];
    if (!img)
        img = icons[key_ + "_icon"];
    if (value < 0) {
        text += `§${embed ? " " : ""}<c>${flipColor ? "lime" : "red"}<c><f>${embed ? "15px" : "18px"}<f>Decreases <i>${frontImg === "" ? img : frontImg}<i>${key} ${backImg ? backImg : ""}${tailEnd} by ${rawKey.endsWith("P") ? Math.abs(value) + "%" : Math.abs(value)} ${lastBit}\n`;
    }
    else
        text += `§${embed ? " " : ""}<c>${flipColor ? "red" : "lime"}<c><f>${embed ? "15px" : "18px"}<f>Increases <i>${frontImg === "" ? img : frontImg}<i>${key} ${backImg ? backImg : ""}${tailEnd} by ${rawKey.endsWith("P") ? value + "%" : value} ${lastBit}\n`;
    return text;
}
tooltip(document.querySelector(".playerMpBg"), "<i><v>icons.mana_icon<v><i><f>20px<f>Mana: <v>player.stats.mp<v>§/§<v>player.getStats().mpMax<v>§");
tooltip(document.querySelector(".playerHpBg"), "<i><v>icons.health_icon<v><i><f>20px<f>Health: <v>player.stats.hp<v>§/§<v>player.getStats().hpMax<v>§");
tooltip(document.querySelector(".xpBar"), "<f>20px<f>Experience: <v>player.level.xp<v>§/§<v>player.level.xpNeed<v>§");
function updateUI() {
    const ui = document.querySelector(".playerUI");
    if (!ui)
        throw new Error("UI NOT LOADED!");
    const hpText = ui.querySelector(".hpText");
    const hpImg = ui.querySelector(".PlayerHpFill");
    const mpImg = ui.querySelector(".PlayerMpFill");
    const xp = document.querySelector(".xpBar .barFill");
    hpText.textContent = `${player.stats.hp} / ${player.getStats().hpMax}`;
    hpImg.style.setProperty("--value", (100 - player.statRemaining("hp")) + "%");
    mpImg.style.setProperty("--value", (100 - player.statRemaining("mp")) + "%");
    generateHotbar();
    generateEffects();
    xp.style.width = `${player.level.xp / player.level.xpNeed * 100}%`;
}
function displayText(txt) {
    var _a, _b;
    (_a = document.querySelector(".worldText")) === null || _a === void 0 ? void 0 : _a.append(textSyntax(txt));
    (_b = document.querySelector(".worldText")) === null || _b === void 0 ? void 0 : _b.scrollBy(0, 1000);
}
function tooltip(element, text) {
    element.addEventListener("mouseover", e => { showHover(e, text); });
    element.addEventListener("mousemove", moveHover);
    element.addEventListener("mouseleave", hideHover);
}
function showHover(mouseEvent, text) {
    tooltipBox.textContent = "";
    tooltipBox.style.display = "block";
    tooltipBox.append(textSyntax(text));
    moveHover(mouseEvent);
}
function moveHover(mouseEvent) {
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
player.updateAbilities();
maps[currentMap].enemies.forEach((en) => en.updateAbilities());
updateUI();
setTimeout(renderInventory, 700);
