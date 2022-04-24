const codexWindow = document.querySelector<HTMLDivElement>(".codexWindow");
const listContainer = codexWindow.querySelector(".contentList");
const contentContainer = codexWindow.querySelector(".contentContainer");

const codexHistory = {} as any;

function openIngameCodex() {
  state.codexOpen = true;
  codexWindow.style.transform = "scale(1)";
  codexWindow.style.opacity = "1";
  listContainer.innerHTML = "";
  /* If an entry has been selected before, display it now */
  if (codexHistory["displayed"]?.id) {
    const { category, object } = codexHistory["displayed"];
    handleDisplayEntry(category, object);
  }
  /* Recursion to support dynamic nesting */
  Object.values(codex).forEach((entry: any) => {
    loopCodex(entry);
  });
  /* Make sure to scroll until previosly selected entry is in screen */
  if (codexHistory["displayed"]?.object) {
    const { object } = codexHistory["displayed"];
    const entry: HTMLDivElement = listContainer.querySelector(`.${object.id}`);
    scrollEntryToView(entry);
  }
}

/* 
  This is a recursive function, meaning that it calls itself.
  It is used to loop through the codex and create entries.
  It also handles animation.
*/
function loopCodex(entry: any) {
  const fullEntry = document.createElement("div");
  const title = document.createElement("div");
  const titleText = document.createElement("p");
  const titleArrow = document.createElement("span");
  const content = document.createElement("div");
  const maxHeight = 780 * settings.ui_scale / 100; // Max height of the content container
  fullEntry.classList.add("codex-entry");
  fullEntry.classList.add(entry.title.replaceAll(" ", "_"));
  title.classList.add("entry-title");
  content.classList.add("entry-content");
  titleText.textContent = entry.title;
  titleArrow.textContent = ">";
  if (codexHistory[entry.title.replaceAll(" ", "_")]) {
    content.style.height = "auto";
    titleArrow.style.transform = "rotate(90deg)";
  } else {
    codexHistory[entry.title.replaceAll(" ", "_")] = false;
  }
  let animator: ReturnType<typeof setTimeout> = undefined;
  title.onclick = () => {
    codexHistory[entry.title.replaceAll(" ", "_")] = !codexHistory[entry.title.replaceAll(" ", "_")];
    if (codexHistory[entry.title.replaceAll(" ", "_")]) {
      clearTimeout(animator);
      content.style.height = "auto";
      const height = content.getBoundingClientRect().height; // Get height of content with dirty trick
      const totalHeight = height > maxHeight ? maxHeight : height; // Limit height to max visible height
      const transitionTime = totalHeight; // Set transition time to height of content in ms
      if (entry.parent !== "NONE" && entry.parent) {
        const parent = document.querySelector<HTMLDivElement>(`.codex-entry.${entry.parent.replaceAll(" ", "_")}`);
        if (parent) {
          parent.querySelector<HTMLDivElement>(".entry-content").style.height = `auto`;
        }
      }
      content.style.height = "0px";
      content.style.transition = `${transitionTime}ms`;
      titleArrow.style.transform = "rotate(90deg)";
      animator = setTimeout(() => content.style.height = `${totalHeight}px`, 0);
      animator = setTimeout(() => {
        content.style.transition = "";
        content.style.height = `${height}px`;
      }, transitionTime);
    } else {
      clearTimeout(animator);
      titleArrow.style.transform = "rotate(0deg)";
      const height = content.getBoundingClientRect().height; // Get height of content with dirty trick
      const totalHeight = height > maxHeight ? maxHeight : height; // Limit height to max visible height
      const transitionTime = totalHeight; // Set transition time to height of content in ms
      content.style.height = `${totalHeight}px`;
      content.style.transition = `${transitionTime}ms`;
      if (entry.parent !== "NONE" && entry.parent) {
        const parent = document.querySelector<HTMLDivElement>(`.codex-entry.${entry.parent.replaceAll(" ", "_")}`);
        if (parent) {
          parent.querySelector<HTMLDivElement>(".entry-content").style.height = `auto`;
        }
      }
      animator = setTimeout(() => content.style.height = "0px", 0);
      animator = setTimeout(() => {
        content.style.transition = "";
      }, transitionTime);
    }
  };
  title.append(titleText, titleArrow);
  fullEntry.append(title, content);
  if (entry.parent === "NONE") {
    listContainer.append(fullEntry);
  }
  else {
    listContainer.querySelector(`.${entry?.parent?.replaceAll(" ", "_")} .entry-content`).append(fullEntry);
  }
  if (entry.import_from_array) {
    Object.values({ ...eval(entry.import_from_array) }).forEach((_entry: any, index: number) => {
      if (_entry.id.includes("error")) return;
      createCodexEntry(entry, _entry, entry.needs_encounter, content, index);
    });
  }
  else {
    entry?.content?.forEach((content: any) => {
      loopCodex(content);
    });
  }
}

function createCodexEntry(codexEntry: any, entry: any, needsEncounter: boolean, title: HTMLElement, index: number) {
  const entryElement = document.createElement("div");
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
  entryElement.classList.add("entry-item");
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
  entryElement.onclick = () => {
    clickListEntry(entryElement);
  };
  if (codexHistory["displayed"]?.id === entry.id) {
    entryElement.classList.add("displayed");
  }
  entryElement.style.maxHeight = `${30 * settings.ui_scale / 100}px`;
  entryElement.append(entryText);
  const hoverText = playerHasEntry ? displayName : lang["no_entry"];
  tooltip(entryElement, hoverText);
  title.append(entryElement);
}

function clickListEntry(entry: HTMLDivElement) {
  if (entry.classList.contains("noEntry")) return;
  const id = entry.classList[1];
  const category = entry.classList[2];
  entry.classList.add("displayed");
  document.querySelector(`.${codexHistory["displayed"]?.id}`)?.classList?.remove("displayed");
  contentContainer.innerHTML = "";
  let object: any;
  try {
    object = { ...eval(category)[id] };
  }
  catch (err) { if (DEVMODE) displayText(`<c>red<c>${err} at line codex:177`); }
  codexHistory["displayed"] = { id: id, category: category, object: { ...object } };
  handleDisplayEntry(category, object);

}

function handleDisplayEntry(category: string, object: any) {
  contentContainer.innerHTML = "";
  if (category === "enemies" || category === "summons") {
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
}

function openCodexToPage(path: Array<string>, displayed: any) {
  path.forEach(step => {
    codexHistory[step] = true;
  });
  codexHistory["displayed"] = displayed;
  openIngameCodex();
  const entry: HTMLDivElement = listContainer.querySelector(`.${displayed.id}`);
  scrollEntryToView(entry);
}

function scrollEntryToView(entry: HTMLDivElement) {
  const posInList = entry.offsetTop;
  const scrollHeight = getParentOffset(entry, posInList);
  if (scrollHeight) {
    listContainer.scrollTo({ top: scrollHeight, behavior: "smooth" });
  }
}

// Typescript doesn't like recursive functions so I'm putting this here
// @ts-ignore
function getParentOffset(child: HTMLDivElement, val: number) {
  if (!child.parentElement.classList.contains("contentList")) {
    return getParentOffset(child.parentElement as HTMLDivElement, val + child.parentElement.offsetTop);
  }
  return val;
}

function closeCodex() {
  state.codexOpen = false;
  codexWindow.style.transform = "scale(0)";
  codexWindow.style.opacity = "0";
}