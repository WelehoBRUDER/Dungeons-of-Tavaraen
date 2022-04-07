"use strict";
const codexWindow = document.querySelector(".codexWindow");
const listContainer = codexWindow.querySelector(".contentList");
const contentContainer = codexWindow.querySelector(".contentContainer");
function openIngameCodex() {
    state.codexOpen = true;
    codexWindow.style.transform = "scale(1)";
    codexWindow.style.opacity = "1";
    listContainer.innerHTML = "";
    Object.values(codex).forEach((codexEntry) => {
        var _a;
        const title = document.createElement("ul");
        title.textContent = codexEntry.title;
        title.classList.add("title");
        title.addEventListener("mouseup", e => animateTitle(e, title));
        let needsEncounter = (_a = codexEntry.needs_encounter) !== null && _a !== void 0 ? _a : true;
        if (codexEntry.import_from_array) {
            Object.values(Object.assign({}, eval(codexEntry.import_from_array))).forEach((entry, index) => {
                if (entry.id.includes("error"))
                    return;
                createCodexEntry(codexEntry, entry, needsEncounter, title, index);
            });
        }
        else if (codexEntry.sub_categories) {
            Object.values(codexEntry.sub_categories).forEach((subCategory) => {
                createSubCategoryEntry(codexEntry, subCategory, needsEncounter, title);
            });
        }
        listContainer.append(title);
    });
    const defaultHeight = 30;
    listContainer.childNodes.forEach((listPart) => {
        listPart.style.height = `${defaultHeight * settings.ui_scale / 100}px`;
        let extraHeight = 0;
        let subListsHeight = 0;
        listPart.childNodes.forEach((subListPart) => {
            var _a, _b;
            if (!subListPart.style)
                return;
            subListPart.style.height = `${defaultHeight * settings.ui_scale / 100}px`;
            extraHeight += defaultHeight * settings.ui_scale / 100;
            if ((_b = (_a = subListPart.childNodes) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.classList.contains("subList")) {
                let subListHeight = 0;
                subListPart.childNodes[1].childNodes.forEach((subListObject) => {
                    if (!subListObject.style)
                        return;
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
function createCodexEntry(codexEntry, entry, needsEncounter, title, index) {
    var _a, _b, _c;
    const entryElement = document.createElement("li");
    const entryText = document.createElement("p");
    let playerHasEntry = false;
    if ((_a = player === null || player === void 0 ? void 0 : player.entitiesEverEncountered[codexEntry === null || codexEntry === void 0 ? void 0 : codexEntry.import_from_array]) === null || _a === void 0 ? void 0 : _a[entry.id])
        playerHasEntry = true;
    if (!needsEncounter)
        playerHasEntry = true;
    let displayName = lang[entry.id + "_name"];
    if (!displayName)
        displayName = lang[entry.id];
    if (!displayName)
        displayName = (_b = entry.name) !== null && _b !== void 0 ? _b : entry.title;
    if (DEVMODE)
        playerHasEntry = true;
    if (codexEntry.import_from_array == "items")
        index--;
    entryText.textContent = `${index + 1}. ` + (playerHasEntry ? displayName : "???");
    entryElement.classList.add(entry.id);
    entryElement.classList.add(codexEntry.import_from_array);
    if (!playerHasEntry) {
        entryElement.classList.add("noEntry");
        entryText.style.left = `0px`;
    }
    else if (!entry.no_img) {
        const icon = document.createElement("img");
        icon.src = (_c = entry.img) !== null && _c !== void 0 ? _c : entry.icon;
        entryText.style.left = `-${15 * settings.ui_scale / 100}px`;
        icon.style.left = `-${15 * settings.ui_scale / 100}px`;
        entryElement.append(icon);
    }
    entryElement.style.maxHeight = `${30 * settings.ui_scale / 100}px`;
    entryElement.append(entryText);
    title.append(entryElement);
}
function createSubCategoryEntry(codexEntry, subCategory, needsEncounter, title) {
    var _a;
    const entryElement = document.createElement("li");
    let playerHasEntry = false;
    if ((_a = player === null || player === void 0 ? void 0 : player.entitiesEverEncountered[codexEntry === null || codexEntry === void 0 ? void 0 : codexEntry.import_from_array]) === null || _a === void 0 ? void 0 : _a[subCategory.id])
        playerHasEntry = true;
    if (!needsEncounter)
        playerHasEntry = true;
    let displayName = lang[subCategory.title + "_title"];
    if (!displayName)
        displayName = subCategory.title;
    entryElement.textContent = playerHasEntry ? displayName : "???";
    entryElement.classList.add("title");
    entryElement.classList.add("subCategory");
    if (!playerHasEntry) {
        entryElement.classList.add("noEntry");
    }
    const subList = document.createElement("ul");
    subList.classList.add("subList");
    if (subCategory.content) {
        subCategory.content.forEach((item, index) => {
            createCodexEntry(subCategory, item, needsEncounter, subList, index);
        });
    }
    if (subCategory.import_from_array) {
        Object.values(Object.assign({}, eval(subCategory.import_from_array))).forEach((entry, index) => {
            createCodexEntry(subCategory, entry, needsEncounter, subList, index);
        });
    }
    entryElement.append(subList);
    title.append(entryElement);
}
function clickListEntry(entry) {
    if (entry.classList.contains("noEntry"))
        return;
    const id = entry.classList[0];
    const category = entry.classList[1];
    contentContainer.innerHTML = "";
    let object;
    try {
        object = Object.assign({}, eval(category)[id]);
    }
    catch (err) {
        if (DEVMODE)
            displayText(`<c>red<c>${err} at line codex:268`);
    }
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
//# sourceMappingURL=codex.js.map