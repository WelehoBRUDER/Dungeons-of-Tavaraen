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
    title.addEventListener("click", e => animateTitle(e, title));
    let needsEncounter = codexEntry.needs_encounter ?? true;
    if(codexEntry.import_from_array) {
      Object.values({ ...eval(codexEntry.import_from_array) }).forEach((entry: any, index: number) => {
        if(entry.id.includes("error")) return;
        createCodexEntry(codexEntry, entry, needsEncounter, title);
      });
    }
    else if(codexEntry.sub_categories) {
      Object.values(codexEntry.sub_categories).forEach((subCategory: any)=>{
        createSubCategoryEntry(codexEntry, subCategory, needsEncounter, title);
      });
    }
    listContainer.append(title);
  });
}

function createCodexEntry(codexEntry: any, entry: any, needsEncounter: boolean, title: HTMLElement) {
  const entryElement = document.createElement("li");
  const entryText = document.createElement("p");
  let playerHasEntry = false;
  if (player?.entitiesEverEncountered[codexEntry?.import_from_array]?.[entry.id]) playerHasEntry = true;
  if(!needsEncounter) playerHasEntry = true;
  let displayName = lang[entry.id + "_name"];
  if (!displayName) displayName = lang[entry.id];
  if (!displayName) displayName = entry.name ?? entry.title;
  entryText.textContent = playerHasEntry ? displayName : "???";
  entryElement.classList.add(entry.id);
  entryElement.classList.add(codexEntry.import_from_array);
  if (!playerHasEntry) {
    entryElement.classList.add("noEntry");
    entryText.style.left = `0px`;
  } 
  else if(!entry.no_img) {
    const icon = document.createElement("img");
    icon.src = entry.img ?? entry.icon;
    entryText.style.left = `-${15 * settings.ui_scale/100}px`;
    icon.style.left = `-${15 * settings.ui_scale/100}px`;
    entryElement.append(icon);
  }
  entryElement.append(entryText);
  title.append(entryElement);
}

function createSubCategoryEntry(codexEntry: any, subCategory: any, needsEncounter: boolean, title: HTMLElement) {
  const entryElement = document.createElement("li");
  let playerHasEntry = false;
  if (player?.entitiesEverEncountered[codexEntry?.import_from_array]?.[subCategory.id]) playerHasEntry = true;
  if(!needsEncounter) playerHasEntry = true;
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
  if(subCategory.content) {
    subCategory.content.forEach((item: any) => {
      createCodexEntry(subCategory, item, needsEncounter, subList);
    });
  }
  if(subCategory.import_from_array) {
    Object.values({...eval(subCategory.import_from_array)}).forEach((entry: any)=>{
      createCodexEntry(subCategory, entry, needsEncounter, subList);
    });
  }
  entryElement.append(subList);
  title.append(entryElement);
}

// THIS FUNCTION IS A MESS AND A HALF, BUT ATLEAST IT WORKS //
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
  else if(e?.target?.classList?.contains("subCategory")) { // this shit is dumb but works
    title = e.target as HTMLUListElement;
      // @ts-expect-error
    if(title.childNodes[1].classList.contains("subList")) { // categories can't have images so just look for second child
      subList = title.childNodes[1] as any;
      extraParts += subList.childElementCount; // more height
      extraParts += title.parentElement.childElementCount; // even more height
      alsoChangeParent = true; // parent element is changing height
    }
  } 
  title.parentElement.childNodes.forEach((child: any)=>{ // just get extra height
    if(child?.style?.maxHeight) {
      extraHeight += +child.style.maxHeight.substring(0, child.style.maxHeight.length-2);
    }
  });
  title.childNodes.forEach((child: any)=> { // fuck it, even more height
    if(child?.style?.maxHeight) {
      extraHeight += +child.style.maxHeight.substring(0, child.style.maxHeight.length-2);
    }
  });
  const parts = title.childElementCount + extraParts; // all the kids we could find
  const maxHeightNeeded = Math.ceil((parts * (34 * settings.ui_scale / 100)) + (30 * settings.ui_scale / 100)) + extraHeight; // if 30k pixels ain't enough height, nothing is. Just makes sure that nothing gets cut off.
  let childrenToRead = title.childNodes as any; // Where to find the crap we want to display
  if(subList) childrenToRead = subList.childNodes; // Oh look, this was a sub category so the kids are in a <ul>
  let transitionTime = 1; // animation lasts 1 second
  let transitionDelay = 0; // applies delay to animatable objects so no async needed, more responsive
  if (title.classList.contains("isOpen")) { // this section handles the closing animation.
    title.style.maxHeight = `${28 * settings.ui_scale / 100}px`;
    title.style.transition = `all ${transitionTime}s, text-shadow 1ms 1ms, background 1ms 1ms`;
    for(let listObject of childrenToRead as any) {
      if (listObject?.style) {
        transitionDelay += transitionTime / parts * 750;
        listObject.style.transition = `all ${transitionTime / parts * 4}s ${transitionDelay}ms, text-shadow 1ms 1ms, background 1ms 1ms`;
        listObject.style.transform = "scale(0)";
      }
    }
  }
  else { // this section handles the opening section
    if(alsoChangeParent) title.parentElement.style.maxHeight = `${maxHeightNeeded}px`;
    title.style.maxHeight = `${maxHeightNeeded}px`;
    title.style.transition = `all ${transitionTime}s, text-shadow: 1ms 1ms, background 1ms 1ms`;
    for(let listObject of childrenToRead as any) {
      if (listObject?.style) {
        transitionDelay += transitionTime / parts * 750;
        listObject.style.transition = `all ${transitionTime / parts * 4}s ${transitionDelay}ms, text-shadow 1ms 1ms, background 1ms 1ms`;
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
  text += `\n<i>${object.img ?? object.icon}<i>`;
  contentContainer.append(textSyntax(text));
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