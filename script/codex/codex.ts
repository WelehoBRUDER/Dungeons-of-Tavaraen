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

function clickListEntry(entry: HTMLLIElement) {
  if (entry.classList.contains("noEntry")) return;
  const id = entry.classList[0];
  const category = entry.classList[1];
  contentContainer.innerHTML = "";
  let object: any;
  try {
    object = { ...eval(category)[id] };
  }
  catch (err) { if (DEVMODE) displayText(`<c>red<c>${err} at line codex:268`); }
  if (category === "enemies") {
    createEnemyInfo(object);
  }
  else if (category === "items") {
    createItemInfo(object);
  }
  else if (category.includes("perks")) {
    createPerkInfo(object);
  }
  // else if (category === "npcs") {
  //   createNPCInfo(object);
  // }
  // else if (category === "quests") {
  //   createQuestInfo(object);
  // }
  // else if (category === "encounters") {
  //   createEncounterInfo(object);
  // }
  // else if (category === "achievements") {
  //   createAchievementInfo(object);
  // }
  // let text = `<f>30px<f><c>silver<c>${object.name}`;
  // text += `\n<i>${object.img ?? object.icon}<i>`;
  //contentContainer.append(textSyntax(text));
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