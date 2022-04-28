function createEnemyInfo(enemy: Enemy | any) {
  enemy = enemy.isFoe ? new Enemy(enemy) : new Summon(enemy);
  enemy.updatetraits();
  let totalDmg = 0;
  Object.values(enemy.damages).forEach((dmg: any) => totalDmg += dmg);
  const enemyStats = enemy.getStats();
  const hitChances = enemy.getHitchance();
  const enemyCoreStats = { ...enemyStats, ...hitChances };
  const enemyResists = enemy.getResists();
  const enemyStatusResists = enemy.getStatusResists();
  const imageContainer = document.createElement("div");
  const enemyImage = document.createElement("img");
  const enemyName = document.createElement("p");
  const enemyHealth = document.createElement("div");
  const enemyMana = document.createElement("div");
  const enemyDamage = document.createElement("div");
  const enemyType = document.createElement("div");
  const enemyRace = document.createElement("div");
  const enemyCoreStatsContainer = document.createElement("div");
  const enemyResistsContainer = document.createElement("div");
  const enemyStatusResistsContainer = document.createElement("div");
  const enemytraitsContainer = document.createElement("div");
  const enemySkillsContainer = document.createElement("div");
  imageContainer.classList.add("entryImage");
  enemyName.classList.add("entryTitle");
  enemyHealth.classList.add("entryHealth");
  enemyMana.classList.add("entryMana");
  enemyDamage.classList.add("entryDamage");
  enemyType.classList.add("entryType");
  enemyRace.classList.add("entryRace");
  enemyCoreStatsContainer.classList.add("coreStats");
  enemyResistsContainer.classList.add("coreResists");
  enemyStatusResistsContainer.classList.add("statResists");
  enemytraitsContainer.classList.add("passives");
  enemySkillsContainer.classList.add("skills");
  enemyImage.src = enemy.img;
  enemyName.textContent = lang[enemy.id + "_name"];
  enemyHealth.append(textSyntax(`<i>${icons.health}<i>${enemy.getHpMax()}`));
  enemyMana.append(textSyntax(`<i>${icons.mana}<i>${enemy.getMpMax()}`));
  enemyDamage.append(textSyntax(`<i>${icons.damage}<i>${totalDmg}`));
  enemyType.append(textSyntax(`${lang["type"]}:<i>${icons[enemy.type + "_type_icon"] || icons.damage}<i>${lang["singular_type_" + enemy.type] || enemy.type}`));
  enemyRace.append(textSyntax(`${lang["choose_race"]}:<i>${icons[enemy.race + "_race_icon"] || icons.damage}<i>${lang["singular_race_" + enemy.race] || enemy.race}`));
  Object.entries(enemyCoreStats).map((stat: any) => {
    enemyCoreStatsContainer.append(createStatDisplay(stat));
  });
  Object.entries(enemyResists).map((stat: any) => {
    enemyResistsContainer.append(createArmorOrResistanceDisplay(stat, false));
  });
  Object.entries(enemyStatusResists).map((stat: any) => {
    enemyStatusResistsContainer.append(createStatusResistanceDisplay(stat));
  });
  enemy.traits.map((mod: PermanentStatModifier) => {
    enemytraitsContainer.append(createStatModifierDisplay(mod));
  });
  enemy.abilities.map((abi: Ability) => {
    if (abi.id != "attack") {
      const bg = document.createElement("img");
      const frame = document.createElement("div");
      frame.classList.add("hotbarFrame");
      bg.src = "resources/ui/hotbar_bg.png";
      frame.append(bg);
      const abiImg = document.createElement("img");
      abiImg.src = abi.icon ?? icons.damage;
      tooltip(abiImg, abiTT(abi));
      frame.append(abiImg);
      enemySkillsContainer.append(frame);
    }
  });
  imageContainer.append(enemyImage);
  contentContainer.append(imageContainer, enemyName, enemyHealth, enemyMana, enemyDamage, enemyType, enemyRace, enemyCoreStatsContainer, enemyResistsContainer, enemyStatusResistsContainer, enemytraitsContainer, enemySkillsContainer);

}