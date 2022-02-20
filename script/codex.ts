const codex = {
  items: {
    title: "ITEMS",
    import_from_array: "items"
  },
  enemies: {
    title: "ENEMIES",
    import_from_array: "enemies"
  },
  classes: {
    title: "CLASSES",
    needs_encounter: false,
    sub_categories: {
      overview: {
        title: "OVERVIEW",
        no_img: true,
        content: [
          {
            id: "classOverview",
            no_img: true,
            title: "COMBAT CLASS",
          },
          {
            id: "perks",
            no_img: true,
            title: "PERKS",
          }
        ],
      },
      fighter: {
        title: "FIGHTER",
        import_from_array: "perksArray.fighter.perks"
      },
      barbarian: {
        title: "BARBARIAN",
        import_from_array: "perksArray.barbarian.perks"
      },
      sorcerer: {
        title: "SORCERER",
        import_from_array: "perksArray.sorcerer.perks"
      },
      rogue: {
        title: "ROGUE",
        import_from_array: "perksArray.rogue.perks"
      },
      ranger: {
        title: "RANGER",
        import_from_array: "perksArray.ranger.perks"
      },
      adventurer: {
        title: "ADVENTURER",
        import_from_array: "perksArray.adventurer_shared.perks"
      }
    }
  },
} as any;
const codexWindow = document.querySelector<HTMLDivElement>(".codexWindow");
const listContainer = codexWindow.querySelector(".contentList");
const contentContainer = codexWindow.querySelector(".contentContainer");
function openIngameCodex() {
  state.codexOpen = true;
  codexWindow.style.transform = "scale(1)";
  codexWindow.style.opacity = "1";
  listContainer.innerHTML = "";
  Object.values(codex).forEach((codexEntry: any) => {
    const title = document.createElement("ul");
    title.textContent = codexEntry.title;
    title.classList.add("title");
    title.addEventListener("mouseup", e => animateTitle(e, title));
    let needsEncounter = codexEntry.needs_encounter ?? true;
    if (codexEntry.import_from_array) {
      Object.values({ ...eval(codexEntry.import_from_array) }).forEach((entry: any, index: number) => {
        if (entry.id.includes("error")) return;
        createCodexEntry(codexEntry, entry, needsEncounter, title, index);
      });
    }
    else if (codexEntry.sub_categories) {
      Object.values(codexEntry.sub_categories).forEach((subCategory: any) => {
        createSubCategoryEntry(codexEntry, subCategory, needsEncounter, title);
      });
    }
    listContainer.append(title);
  });
  const defaultHeight = 30;
  listContainer.childNodes.forEach((listPart: any) => {
    listPart.style.height = `${defaultHeight * settings.ui_scale / 100}px`;
    let extraHeight = 0;
    let subListsHeight = 0;
    listPart.childNodes.forEach((subListPart: any) => {
      if (!subListPart.style) return;
      subListPart.style.height = `${defaultHeight * settings.ui_scale / 100}px`;
      extraHeight += defaultHeight * settings.ui_scale / 100;
      if (subListPart.childNodes?.[1]?.classList.contains("subList")) {
        let subListHeight = 0;
        subListPart.childNodes[1].childNodes.forEach((subListObject: any) => {
          if (!subListObject.style) return;
          subListObject.style.height = `${defaultHeight * settings.ui_scale / 100}px`;
          subListsHeight += defaultHeight * settings.ui_scale / 100;
          subListHeight += defaultHeight * settings.ui_scale / 100;
        });
        subListPart.childNodes[1].style.height = `${defaultHeight * settings.ui_scale / 100}px`;
        subListPart.childNodes[1].style.maxHeight = `${defaultHeight * settings.ui_scale / 100 + subListHeight}px`;
        subListPart.style.maxHeight = `${(defaultHeight * 2) * settings.ui_scale / 100 + subListHeight}px`;
      }
    });
    extraHeight += subListsHeight;
    listPart.style.maxHeight = `${defaultHeight * settings.ui_scale / 100 + extraHeight}px`;
  });
}

function createCodexEntry(codexEntry: any, entry: any, needsEncounter: boolean, title: HTMLElement, index: number) {
  const entryElement = document.createElement("li");
  const entryText = document.createElement("p");
  let playerHasEntry = false;
  if (player?.entitiesEverEncountered[codexEntry?.import_from_array]?.[entry.id]) playerHasEntry = true;
  if (!needsEncounter) playerHasEntry = true;
  let displayName = lang[entry.id + "_name"];
  if (!displayName) displayName = lang[entry.id];
  if (!displayName) displayName = entry.name ?? entry.title;
  if (DEVMODE) playerHasEntry = true;
  if (codexEntry.import_from_array == "items") index--;
  entryText.textContent = `${index + 1}. ` + (playerHasEntry ? displayName : "???");
  entryElement.classList.add(entry.id);
  entryElement.classList.add(codexEntry.import_from_array);
  if (!playerHasEntry) {
    entryElement.classList.add("noEntry");
    entryText.style.left = `0px`;
  }
  else if (!entry.no_img) {
    const icon = document.createElement("img");
    icon.src = entry.img ?? entry.icon;
    entryText.style.left = `-${15 * settings.ui_scale / 100}px`;
    icon.style.left = `-${15 * settings.ui_scale / 100}px`;
    entryElement.append(icon);
  }
  entryElement.style.maxHeight = `${30 * settings.ui_scale / 100}px`;
  entryElement.append(entryText);
  title.append(entryElement);
}

function createSubCategoryEntry(codexEntry: any, subCategory: any, needsEncounter: boolean, title: HTMLElement) {
  const entryElement = document.createElement("li");
  let playerHasEntry = false;
  if (player?.entitiesEverEncountered[codexEntry?.import_from_array]?.[subCategory.id]) playerHasEntry = true;
  if (!needsEncounter) playerHasEntry = true;
  let displayName = lang[subCategory.title + "_title"];
  if (!displayName) displayName = subCategory.title;
  entryElement.textContent = playerHasEntry ? displayName : "???";
  entryElement.classList.add("title");
  entryElement.classList.add("subCategory");
  if (!playerHasEntry) {
    entryElement.classList.add("noEntry");
  }
  const subList = document.createElement("ul");
  subList.classList.add("subList");
  if (subCategory.content) {
    subCategory.content.forEach((item: any, index: number) => {
      createCodexEntry(subCategory, item, needsEncounter, subList, index);
    });
  }
  if (subCategory.import_from_array) {
    Object.values({ ...eval(subCategory.import_from_array) }).forEach((entry: any, index: number) => {
      createCodexEntry(subCategory, entry, needsEncounter, subList, index);
    });
  }
  entryElement.append(subList);
  title.append(entryElement);
}

// THIS FUNCTION IS A MESS AND A HALF, BUT ATLEAST IT WORKS (MOSTLY) //
async function animateTitle(e: MouseEvent, title: HTMLUListElement) {
  // all this shit defines some dumb logic
  let extraParts: number = 0; // make the parent bigger
  let extraHeight: number = 0; // still making the parent bigger
  let alsoChangeParent: boolean = false; // does the parent element change its height
  let subList = null; // whether or not the title has a <ul> element in it
  // @ts-expect-error
  if (!e?.target?.classList?.contains("title")) { // you didn't click a title
    clickListEntry(e.target as HTMLLIElement);
    return;
  }
  // @ts-expect-error
  else if (e?.target?.classList?.contains("subCategory")) { // this shit is dumb but works
    title = e.target as HTMLUListElement;

  }
  let subHeight = 0;
  // Now we know we're dealing with the highest element already.
  if (title.parentElement.classList.contains("content")) {
    let maximumHeight = title.getBoundingClientRect().height;
  }
  // This time we're dealing with a sublist.
  else if (title.parentElement.classList.contains("title")) {
    subList = title.childNodes[1];
    subHeight += title.getBoundingClientRect().height;

  }
  let childrenToRead = title.childNodes as any; // Where to find the crap we want to display
  if (subList) childrenToRead = subList.childNodes; // Oh look, this was a sub category so the kids are in a <ul>
  let transitionTime = 1; // animation lasts 1 second
  let transitionDelay = 0; // applies delay to animatable objects so no async needed, more responsive
  const defaultHeight = 30 * settings.ui_scale / 100;
  if (title.classList.contains("isOpen")) { // this section handles the closing animation.
    title.style.height = `${defaultHeight}px`;
    title.style.transition = `all ${transitionTime}s, text-shadow 1ms 1ms, background 1ms 1ms`;
    for (let listObject of childrenToRead as any) {
      if (listObject?.style) {
        transitionDelay += transitionTime / childrenToRead.length * 750;
        listObject.style.transition = `all ${transitionTime / childrenToRead.length * 4}s ${transitionDelay}ms, text-shadow 1ms 1ms, background 1ms 1ms`;
        listObject.style.transform = "scale(0)";
      }
    }
  }
  else { // this section handles the opening section
    title.style.transition = `all ${transitionTime}s 0ms, text-shadow: 1ms 1ms, background 1ms 1ms`;
    if (!title.classList.contains("subCategory")) { // We know it's the original title
      let test = 0;
      title.childNodes.forEach((child: any) => {
        if (!child?.style) return;
        let height = +child.style.height.substring(0, child.style.height.length - 2);
        if (height < 1) test += defaultHeight;
        else test += height;
      });
      title.style.height = `${test + defaultHeight}px`;
    }
    // This is a sublist
    else {
      let test = 0;
      let parent = title.parentElement;
      parent.childNodes.forEach((child: any) => {
        if (!child?.style) return;
        if (child.getBoundingClientRect().height < 1) test += defaultHeight;
        else test += child.getBoundingClientRect().height;
      });
      let test2 = 0;
      title.childNodes[1].childNodes.forEach((subItem: any) => {
        if (!subItem?.style) return;
        if (subItem.getBoundingClientRect().height < 1) test2 += defaultHeight;
        else test2 += subItem.getBoundingClientRect().height;
      });
      // @ts-ignore
      title.childNodes[1].style.height = `${test2}px`;
      title.style.height = `${test2 + defaultHeight}px`;
      parent.style.height = `${test + test2 + defaultHeight}px`;
    }
    /* THIS SHIT DOESN'T WORK!!!! */
    /* IT WON'T RUN ON FIRST TRY NO MATTER WHAT! */
    for (let listObject of childrenToRead as any) {
      if (listObject?.style) {
        transitionDelay += transitionTime / childrenToRead.length * 750;
        listObject.style.transition = `all ${transitionTime / childrenToRead.length * 4}s ${transitionDelay}ms, text-shadow 1ms 1ms, background 1ms 1ms`;
        listObject.style.transform = "scale(1)";
      }
    }
  }
  title.classList.toggle("isOpen");
}

function clickListEntry(entry: HTMLLIElement) {
  if (entry.classList.contains("noEntry")) return;
  const id = entry.classList[0];
  const category = entry.classList[1];
  contentContainer.innerHTML = "";
  let object: any = { ...eval(category)[id] };
  if (category === "enemies") {
    createEnemyInfo(object);
  }
  // let text = `<f>30px<f><c>silver<c>${object.name}`;
  // text += `\n<i>${object.img ?? object.icon}<i>`;
  //contentContainer.append(textSyntax(text));
}

function createEnemyInfo(enemy: Enemy) {
  enemy = new Enemy(enemy);
  enemy.updateStatModifiers();
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
  const enemyPassiveAbilitiesContainer = document.createElement("div");
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
  enemyPassiveAbilitiesContainer.classList.add("passives");
  enemySkillsContainer.classList.add("skills");
  enemyImage.src = enemy.img;
  enemyName.textContent = lang[enemy.id + "_name"];
  enemyHealth.append(textSyntax(`<i>${icons.health}<i>${enemy.getHpMax()}`));
  enemyMana.append(textSyntax(`<i>${icons.mana}<i>${enemy.getMpMax()}`));
  enemyDamage.append(textSyntax(`<i>${icons.damage}<i>${totalDmg}`));
  enemyType.append(textSyntax(`${lang["type"]}:<i>${icons[enemy.type + "_type_icon"]}<i>${lang["singular_type_" + enemy.type]}`));
  enemyRace.append(textSyntax(`${lang["choose_race"]}:<i>${icons[enemy.race + "_race_icon"]}<i>${lang["singular_race_" + enemy.race]}`));
  Object.entries(enemyCoreStats).map((stat: any) => {
    enemyCoreStatsContainer.append(createStatDisplay(stat));
  });
  Object.entries(enemyResists).map((stat: any) => {
    enemyResistsContainer.append(createArmorOrResistanceDisplay(stat, false));
  });
  Object.entries(enemyStatusResists).map((stat: any) => {
    enemyStatusResistsContainer.append(createStatusResistanceDisplay(stat));
  });
  enemy.statModifiers.map((mod: PermanentStatModifier) => {
    enemyPassiveAbilitiesContainer.append(createStatModifierDisplay(mod));
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
  contentContainer.append(imageContainer, enemyName, enemyHealth, enemyMana, enemyDamage, enemyType, enemyRace, enemyCoreStatsContainer, enemyResistsContainer, enemyStatusResistsContainer, enemyPassiveAbilitiesContainer, enemySkillsContainer);

}

function closeCodex() {
  state.codexOpen = false;
  codexWindow.style.transform = "scale(0)";
  codexWindow.style.opacity = "0";
}

// let one = {id: "one"};
// let two = {id2: "two"};
// let three = Object.assign({}, one, two);
// console.log(three);

// var o1 = { a: 1 };
// var o2 = { b: 2 };
// var o3 = { c: 3 };

// var obj = Object.assign({}, o1, o2, o3);
// console.log(obj); // { a: 1, b: 2, c: 3 }