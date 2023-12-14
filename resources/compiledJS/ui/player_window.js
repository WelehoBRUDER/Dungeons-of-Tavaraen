"use strict";
function createStatDisplay(stat) {
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
function createArmorOrResistanceDisplay(stat, armor) {
    const key = stat[0];
    const val = stat[1];
    const { statContainer, statImage, statText, statValue } = createBaseElementsForStatDisplay();
    statImage.src = icons[key + (armor ? "Armor" : "Resist")];
    statText.textContent = lang[key];
    statValue.textContent = val + (armor ? "" : "%");
    tooltip(statContainer, lang[armor ? key + "_tt" : "resistances_tt"] ?? "no tooltip");
    if (val > 0)
        statValue.classList.add("positive");
    else if (val < 0)
        statValue.classList.add("negative");
    statContainer.append(statImage, statText, statValue);
    return statContainer;
}
function createStatusResistanceDisplay(stat) {
    const key = stat[0];
    const val = stat[1];
    const { statContainer, statImage, statText, statValue } = createBaseElementsForStatDisplay();
    statImage.src = icons[key] ?? icons["damage"];
    statText.textContent = lang[key + "_status"];
    statValue.textContent = val + "%";
    if (val > 0)
        statValue.classList.add("positive");
    else if (val < 0)
        statValue.classList.add("negative");
    statContainer.append(statImage, statText, statValue);
    return statContainer;
}
function createStatModifierDisplay(mod) {
    const statContainer = document.createElement("div");
    const statImage = document.createElement("img");
    const statText = document.createElement("p");
    statImage.src = mod.icon ?? icons["damage"];
    statText.textContent = lang[mod.id + "_name"];
    if (mod.conditions) {
        let active = statConditions(mod.conditions, player);
        if (active)
            statText.classList.add("positive");
        else
            statText.classList.add("inactive");
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
    const bg = document.querySelector(".playerWindow");
    document.querySelector(".worldText").style.opacity = "0";
    bg.style.transform = "scale(1)";
    bg.textContent = "";
    const xBut = document.createElement("div");
    xBut.classList.add("closeWindowButton");
    xBut.textContent = "X";
    xBut.onclick = closeCharacter;
    bg.append(xBut);
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
    const charHealthRegen = document.createElement("p");
    const charHealthRegenImage = document.createElement("img");
    const charManaRegen = document.createElement("p");
    const charManaRegenImage = document.createElement("img");
    const charBaseAttack = document.createElement("p");
    const charBaseAttackImage = document.createElement("img");
    const charTrueAttack = document.createElement("p");
    const charTrueAttackImage = document.createElement("img");
    const charAttackSpeed = document.createElement("p");
    const charAttackSpeedImage = document.createElement("img");
    const charMovementSpeed = document.createElement("p");
    const charMovementSpeedImage = document.createElement("img");
    const hpContainer = document.createElement("div");
    const mpContainer = document.createElement("div");
    const hpRegenContainer = document.createElement("div");
    const mpRegenContainer = document.createElement("div");
    const baseAttackContainer = document.createElement("div");
    const trueAttackContainer = document.createElement("div");
    const attackContainer = document.createElement("div");
    const movementContainer = document.createElement("div");
    const { attack, movement } = player.getSpeed();
    charName.classList.add("charName");
    charRaceLevel.classList.add("charRaceLevel");
    charHealthContainer.classList.add("charHealthContainer");
    charManaContainer.classList.add("charManaContainer");
    charName.textContent = player.name;
    charRaceLevel.textContent = `Lvl ${player.level.level}, ${lang[player.race + "_name"]}`;
    charHealth.textContent = `${Math.round(player.stats.hp)}/${player.getHpMax()}`;
    charHealthRegen.textContent = `+${player.getRegen().hp.toFixed(2)}`;
    charMana.textContent = `${Math.round(player.stats.mp)}/${player.getMpMax()}`;
    charManaRegen.textContent = `+${player.getRegen().mp.toFixed(2)}`;
    charBaseAttack.textContent = `${player.calcDamage(true)}`;
    charTrueAttack.textContent = `${player.calcDamage()}`;
    charAttackSpeed.textContent = `${attack}%`;
    charMovementSpeed.textContent = `${movement}%`;
    charHealthImage.src = "resources/icons/health.png";
    charHealthRegenImage.src = "resources/icons/regen.png";
    charManaImage.src = "resources/icons/mana.png";
    charManaRegenImage.src = "resources/icons/mana_regen.png";
    charBaseAttackImage.src = "resources/icons/damage.png";
    charTrueAttackImage.src = "resources/icons/atk.png";
    charAttackSpeedImage.src = icons.attackSpeed;
    charMovementSpeedImage.src = icons.movementSpeed;
    if (attack > 100)
        charAttackSpeed.classList.add("positive");
    else if (attack < 100)
        charAttackSpeed.classList.add("negative");
    if (movement > 100)
        charMovementSpeed.classList.add("positive");
    else if (movement < 100)
        charMovementSpeed.classList.add("negative");
    hpContainer.append(charHealthImage, charHealth);
    mpContainer.append(charManaImage, charMana);
    hpRegenContainer.append(charHealthRegenImage, charHealthRegen);
    mpRegenContainer.append(charManaRegenImage, charManaRegen);
    baseAttackContainer.append(charBaseAttackImage, charBaseAttack);
    trueAttackContainer.append(charTrueAttackImage, charTrueAttack);
    attackContainer.append(charAttackSpeedImage, charAttackSpeed);
    movementContainer.append(charMovementSpeedImage, charMovementSpeed);
    charHealthContainer.append(hpContainer, hpRegenContainer, baseAttackContainer, attackContainer);
    charManaContainer.append(mpContainer, mpRegenContainer, trueAttackContainer, movementContainer);
    tooltip(baseAttackContainer, lang["base_attack_tt"]);
    tooltip(trueAttackContainer, lang["true_attack_tt"]);
    tooltip(attackContainer, lang["atk_speed_tt"]);
    tooltip(movementContainer, lang["mov_speed_tt"]);
    generalInfo.append(charName, charRaceLevel, charHealthContainer, charManaContainer);
    const coreStats = document.createElement("div");
    const coreResistances = document.createElement("div");
    const statusResistances = document.createElement("div");
    const traits = document.createElement("div");
    const coreStatsTitle = document.createElement("p");
    const coreResistancesTitle = document.createElement("p");
    const statusResistancesTitle = document.createElement("p");
    const traitsTitle = document.createElement("p");
    coreStatsTitle.classList.add("coreStatsTitle");
    coreStatsTitle.textContent = lang["core_stats"];
    coreResistancesTitle.classList.add("coreResistancesTitle");
    coreResistancesTitle.textContent = lang["core_resistances"];
    statusResistancesTitle.classList.add("statusResistancesTitle");
    statusResistancesTitle.textContent = lang["status_resistances"];
    traitsTitle.classList.add("traitsTitle");
    traitsTitle.textContent = lang["passives"];
    coreStats.classList.add("coreStats");
    coreResistances.classList.add("coreResistances");
    statusResistances.classList.add("statusResistances");
    traits.classList.add("traits");
    let allMods = "<f>20px<f>All modifiers: §\n";
    // This convoluted mess allows us to "sort" an object.
    const modsToSort = [];
    Object.entries(player.allModifiers).map((eff) => {
        // Trim the object data to what we're going to display
        if (eff[1] - 1 === 0)
            return;
        else if (eff[1] === 0)
            return;
        const displayEff = { ...eff };
        if (displayEff[0].endsWith("P") && !displayEff[0].includes("crit"))
            displayEff[1] = displayEff[1] * 100 - 100;
        modsToSort.push([displayEff[0], displayEff[1]]); // Copy object data to an Array
    });
    // Sort the Array
    modsToSort.sort((a, b) => modsSort(a, b));
    modsToSort.forEach((mod) => {
        allMods += effectSyntax(mod); // Finally process the data
    });
    // Done !
    tooltip(pc, allMods);
    Object.entries(playerCoreStats).forEach((stat) => {
        coreStats.append(createStatDisplay(stat));
    });
    Object.entries(playerArmor).forEach((stat) => {
        coreResistances.append(createArmorOrResistanceDisplay(stat, true));
    });
    Object.entries(playerResists).forEach((stat) => {
        coreResistances.append(createArmorOrResistanceDisplay(stat, false));
    });
    Object.entries(playerStatusResists).forEach((stat) => {
        statusResistances.append(createStatusResistanceDisplay(stat));
    });
    player.traits.forEach((mod) => {
        traits.append(createStatModifierDisplay(mod));
    });
    pc.style.left = "24px";
    pc.style.top = "24px";
    tooltip(statusResistances, lang["stat_resist_tt"]);
    bg.append(pc, generalInfo, coreStatsTitle, coreStats, coreResistancesTitle, coreResistances, statusResistancesTitle, statusResistances, traitsTitle, traits);
}
function closeCharacter() {
    state.charOpen = false;
    hideHover();
    document.querySelector(".worldText").style.opacity = "1";
    const bg = document.querySelector(".playerWindow");
    bg.style.transform = "scale(0)";
}
//# sourceMappingURL=player_window.js.map