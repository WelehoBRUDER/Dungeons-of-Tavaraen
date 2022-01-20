const codex = {
  items: {
    title: "ITEMS",
    import_from_array: "items"
  },
  enemies: {
    title: "ENEMIES",
    import_from_array: "enemies"
  },
  perks: {
    title: "PERKS",
    import_from_array: "perksArray"
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
    title.addEventListener("click", e => animateTitle(e, title));
    Object.values({ ...eval(codexEntry.import_from_array) }).forEach((entry: any, index: number) => {
      const entryElement = document.createElement("li");
      const entryText = document.createElement("p");
      let playerHasEntry = false;
      if (player?.entitiesEverEncountered[codexEntry?.import_from_array]?.[index]) playerHasEntry = true;
      let displayName = lang[entry.id + "_name"];
      if (!displayName) displayName = lang[entry.id];
      if (!displayName) displayName = entry.name;
      entryText.textContent = playerHasEntry ? displayName : "???";
      entryElement.classList.add(entry.id);
      entryElement.classList.add(codexEntry.import_from_array);
      if (!playerHasEntry) {
        entryElement.classList.add("noEntry");
        entryText.style.left = `0px`;
      } 
      else {
        const icon = document.createElement("img");
        icon.src = entry.img;
        entryText.style.left = `-${15 * settings.ui_scale/100}px`;
        icon.style.left = `-${15 * settings.ui_scale/100}px`;
        entryElement.append(icon);
      }
      entryElement.append(entryText);
      title.append(entryElement);
    });
    listContainer.append(title);
  });
}

async function animateTitle(e: MouseEvent, title: HTMLUListElement) {
  // @ts-expect-error
  if (!e?.target?.classList?.contains("title")) {
    clickListEntry(e.target as HTMLLIElement);
    return;
  };
  const maxHeightNeeded = Math.ceil((title.childElementCount * (30 * settings.ui_scale / 100)) + (27 * settings.ui_scale / 100));
  const transitionTime = maxHeightNeeded / 700;
  if (title.classList.contains("isOpen")) {
    title.style.maxHeight = `${25 * settings.ui_scale / 100}px`;
    title.style.transition = `max-height ${transitionTime}s`;
    for(let listObject of title.childNodes as any) {
      if (listObject?.style) {
        await sleep(transitionTime / title.childElementCount * 1000);
        listObject.style.transform = "scale(0)";
      }
    }
  }
  else {
    title.style.maxHeight = `${maxHeightNeeded}px`;
    title.style.transition = `max-height ${transitionTime}s`;
    for(let listObject of title.childNodes as any) {
      if (listObject?.style) {
        await sleep(transitionTime / title.childElementCount * 1000);
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
  let text = `<f>30px<f><c>silver<c>${object.name}`;
  text += `\n<i>${object.img}<i>`;
  contentContainer.append(textSyntax(text));
}

function closeCodex() {
  state.codexOpen = false;
  codexWindow.style.transform = "scale(0)";
  codexWindow.style.opacity = "0";
}