"use strict";
// THIS FILE CONTAINS THE LOGIC FOR FRIENDLY CHARACTERS //
// Flags are stored as index (5: true, 0: 1) to save memory.
// Function getFlag(str) will return the flag index.
const flags = [
    "has_spoken_to_merchant",
    "accepted_merchant_quest_1",
    "defeated_robber_slimes_talk",
    "completed_quest_defeat_slimes",
    "has_heard_merchant_troubles",
    "accepted_merchant_quest_2",
    "exterminate_slimes_talk",
    "completed_quest_defeat_slimes_2",
    "maroch_slay_brethren_quest",
    "brethren_slain_talk",
    "completed_quest_slay_brethren"
];
// Returns flag index by searching with string.
function getFlag(str) {
    str = str.toLowerCase();
    for (let index = 0; index < flags.length; index++) {
        if (str == flags[index].toLowerCase()) {
            return index;
        }
    }
    return -1;
}
// Either sets a flag to specified value, or modifies it.
// If override is enabled, value is replaced instead of modified.
// Boolean values can't be modified and will instead always be replaced (duh).
function setFlag(str, value, override = false) {
    var _a;
    let index = getFlag(str);
    if (index > -1) {
        if ((_a = player.flags) === null || _a === void 0 ? void 0 : _a[index]) {
            if (override)
                player.flags[index] = value;
            else {
                if (typeof value == "number") {
                    if (typeof player.flags[index] !== "number")
                        player.flags[index] = 0;
                    player.flags[index] += value;
                }
                else {
                    player.flags[index] = value;
                }
            }
        }
        else {
            console.log("adding new flag!");
            player.flags[index] = value;
        }
    }
}
class Npc {
    constructor(base) {
        this.id = base.id;
        this.sprite = base.sprite;
        this.greeting = base.greeting;
        this.pronounSet = base.pronounSet;
        this.currentMap = base.currentMap;
        this.currentCords = base.currentCords;
        this.conditionalMaps = base.conditionalMaps;
        this.conditionalCords = base.conditionalCords;
    }
}
function talkToCharacter() {
    if (state.dialogWindow || state.inCombat)
        return;
    NPCcharacters.some((npc) => {
        let dist = calcDistance(player.cords.x, player.cords.y, npc.currentCords.x, npc.currentCords.y);
        if (dist < 3) {
            state.dialogWindow = true;
            createDialogWindow(npc);
        }
    });
}
const dialogWindow = document.querySelector(".dialogWindow");
const dialogCharName = dialogWindow.querySelector(".dialogCharName");
const dialogText = dialogWindow.querySelector(".dialogText");
const dialogChoices = dialogWindow.querySelector(".dialogChoices");
function createDialogWindow(npc) {
    dialogText.innerHTML = "";
    let greetingText = applyVarsToDialogText(dialogLang[lang.language_id][npc.greeting], npc.pronounSet);
    dialogText.append(textSyntax(greetingText));
    dialogCharName.textContent = lang[npc.id + "_name"];
    dialogWindow.style.transform = "scale(1)";
    createNPCPortrait(npc);
    createDialogChoices(npc.id, dialogChoices, npc);
    setTimeout(() => { dialogWindow.style.opacity = "1"; }, 10);
}
function applyVarsToDialogText(text, pronounSet) {
    if (!text)
        return "empty";
    text = text.replaceAll("/heShe/", dialogLang[lang.language_id][pronounSet + "_heShe"]);
    text = text.replaceAll("/hisHer/", dialogLang[lang.language_id][pronounSet + "_hisHer"]);
    return text;
}
function createNPCPortrait(npc) {
    const canvas = document.querySelector(".dialogCanvas");
    canvas.width = 512 * (settings["ui_scale"] / 100);
    canvas.height = 512 * (settings["ui_scale"] / 100);
    const ctx = canvas.getContext("2d");
    renderNPCOutOfMap(512 * (settings["ui_scale"] / 100), canvas, ctx, npc, "left");
}
function createDialogChoices(id, choices, npc) {
    var _a, _b, _c, _d;
    let interactions = characterInteractions[id];
    if (!interactions)
        return;
    choices.innerHTML = "";
    (_a = interactions.always) === null || _a === void 0 ? void 0 : _a.forEach((choice) => {
        if (!choice.displayAtBottom) {
            createChoice(choice, choices, npc);
        }
    });
    (_b = interactions.conditional) === null || _b === void 0 ? void 0 : _b.forEach((choice) => {
        if (checkDialogConditions(choice.conditions)) {
            createChoice(choice, choices, npc);
        }
    });
    (_c = interactions.dialogChoices) === null || _c === void 0 ? void 0 : _c.forEach((choice) => {
        if (checkDialogConditions(choice.conditions)) {
            createChoice(choice, choices, npc);
        }
    });
    (_d = interactions.always) === null || _d === void 0 ? void 0 : _d.forEach((choice) => {
        if (choice.displayAtBottom) {
            createChoice(choice, choices, npc);
        }
    });
}
function createChoice(choice, choices, npc) {
    const button = document.createElement("div");
    button.classList.add("option");
    let type = lang[choice.type] || choice.type;
    let name = dialogLang[lang.language_id][choice.name] || choice.name;
    button.append(textSyntax(`<c>gold<c>[<c>white<c>${type}<c>gold<c>]<c>white<c> ${name}`));
    if (choice.action.type == "store") {
        button.addEventListener("click", e => openMerchantStore(choice.action.id));
    }
    else if (choice.action.type == "exit") {
        button.addEventListener("click", exitDialog);
    }
    else if (choice.action.type == "exitWithFlags") {
        button.addEventListener("click", e => exitWithFlags(choice));
    }
    else if (choice.action.type == "dialog") {
        button.addEventListener("click", e => nextDialog(choice, npc));
    }
    else if (choice.action.type == "quest") {
        button.addEventListener("click", e => questDialog(choice, npc));
    }
    else if (choice.action.type == "questObjective") {
        button.addEventListener("click", e => questObjectiveDialog(choice, npc));
    }
    else if (choice.action.type == "smith") {
        button.addEventListener("click", e => createSmithingWindow());
    }
    choices.append(button);
}
function openMerchantStore(id) {
    exitDialog();
    id = id.split("_store_");
    currentMerchant = NPCInventories[id[0]][id[1]];
    createMerchantWindow();
}
function exitDialog() {
    dialogWindow.style.transform = "scale(0)";
    state.dialogWindow = false;
}
function exitWithFlags(choice) {
    choice.flags.forEach((flag) => {
        if (flag.set_flag) {
            setFlag(flag.set_flag.flag, flag.set_flag.value, true);
        }
    });
    exitDialog();
}
function checkDialogConditions(conditions) {
    let pass = true;
    conditions.forEach((condition) => {
        if (condition.NOT_has_flag) {
            let flag = getFlag(condition.NOT_has_flag);
            if (player.flags[flag])
                pass = false;
        }
        if (condition.has_flag) {
            let flag = getFlag(condition.has_flag);
            if (!player.flags[flag])
                pass = false;
        }
    });
    return pass;
}
function nextDialog(choice, npc) {
    var _a;
    dialogText.innerHTML = "";
    let text = applyVarsToDialogText(dialogLang[lang.language_id][choice.action.id], npc.pronounSet);
    dialogText.append(textSyntax(text));
    (_a = choice.flags) === null || _a === void 0 ? void 0 : _a.forEach((flag) => {
        if (flag.set_flag) {
            setFlag(flag.set_flag.flag, flag.set_flag.value, true);
        }
    });
    createDialogChoices(npc.id, dialogChoices, npc);
}
function questDialog(choice, npc) {
    var _a, _b;
    dialogText.innerHTML = "";
    let text = applyVarsToDialogText(dialogLang[lang.language_id][choice.action.id], npc.pronounSet);
    dialogText.append(textSyntax(text));
    (_a = choice.flags) === null || _a === void 0 ? void 0 : _a.forEach((flag) => {
        if (flag.set_flag) {
            setFlag(flag.set_flag.flag, flag.set_flag.value, true);
        }
    });
    if (choice.action.questId) {
        startNewQuest(choice.action.questId);
    }
    let questAddedText = lang["quest_added"];
    questAddedText = questAddedText.replace("[QUEST]", (_b = questLang[lang.language_id][choice.action.questId + "_name"]) !== null && _b !== void 0 ? _b : choice.action.questId);
    dialogText.append(textSyntax(`\n\n${questAddedText}`));
    createDialogChoices(npc.id, dialogChoices, npc);
}
function getQuestParams(questId) {
    let questIndex = player.questProgress.findIndex((q) => Object.keys(quests)[q.id] == questId);
    return { id: questIndex, quest: questId };
}
function questObjectiveDialog(choice, npc) {
    var _a;
    dialogText.innerHTML = "";
    let text = applyVarsToDialogText(dialogLang[lang.language_id][choice.action.id], npc.pronounSet);
    dialogText.append(textSyntax(text));
    (_a = choice.flags) === null || _a === void 0 ? void 0 : _a.forEach((flag) => {
        if (flag.set_flag) {
            setFlag(flag.set_flag.flag, flag.set_flag.value, true);
        }
    });
    updateQuestProgress(getQuestParams(choice.action.questId), npc.id);
    createDialogChoices(npc.id, dialogChoices, npc);
}
let currentMerchant;
let currentMerchantInventory = [];
let pendingItemsSelling = [];
let pendingItemsBuying = [];
let totalPrice = 0;
const storeWindow = document.querySelector(".storeWindow");
const merchantInv = document.querySelector(".merchantInv");
const playerInv = document.querySelector(".playerInv");
const confirmation = document.querySelector(".confirmation");
const pendingBuy = confirmation.querySelector(".pendingItemsBuying");
const pendingSell = confirmation.querySelector(".pendingItemsSelling");
const pendingBuyArea = pendingBuy.querySelector(".area");
const pendingSellArea = pendingSell.querySelector(".area");
const priceArea = confirmation.querySelector(".price");
const amountScreen = document.querySelector(".amountSelector");
const confirmButton = confirmation.querySelector(".confirmButton");
const smithingWindow = document.querySelector(".smithingWindow");
function createMerchantWindow(resetInv = true, justSort = false) {
    var _a;
    storeWindow.style.transform = "scale(1)";
    amountScreen.style.display = "none";
    hideHover();
    contextMenu.textContent = "";
    merchantInv.innerHTML = "";
    playerInv.innerHTML = "";
    state.storeOpen = true;
    if (resetInv) {
        pendingItemsSelling = [];
        pendingItemsBuying = [];
    }
    if (!justSort)
        currentMerchantInventory = createMerchantItems(currentMerchant);
    merchantInv.append(createItems(currentMerchantInventory, "MERCHANT_SELLING", null, false));
    playerInv.append(createItems(player.inventory, "PLAYER_SELLING"));
    pendingBuyArea.innerHTML = "";
    pendingSellArea.innerHTML = "";
    let buyingPrice = 0;
    let sellingPrice = 0;
    for (let i = 0; i < pendingItemsBuying.length; i++) {
        let pending = pendingItemsBuying[i];
        const itemFrame = document.createElement("div");
        const itemImg = document.createElement("img");
        buyingPrice += pending.price * pending.amount;
        itemFrame.classList.add("itmFrame");
        itemImg.src = pending.img;
        tooltip(itemFrame, itemTT(pending));
        itemFrame.append(itemImg);
        if (pending.stacks) {
            const itemAmnt = document.createElement("p");
            itemAmnt.classList.add("itemAmount");
            itemAmnt.textContent = pending.amount;
            itemFrame.append(itemAmnt);
        }
        itemFrame.addEventListener("mouseup", e => removeItemFromBuying(i));
        pendingBuyArea.append(itemFrame);
    }
    for (let i = 0; i < pendingItemsSelling.length; i++) {
        let pending = pendingItemsSelling[i];
        const itemFrame = document.createElement("div");
        const itemImg = document.createElement("img");
        sellingPrice += pending.fullPrice() * pending.amount;
        itemFrame.classList.add("itmFrame");
        itemImg.src = pending.img;
        tooltip(itemFrame, itemTT(pending));
        itemFrame.append(itemImg);
        itemFrame.addEventListener("mouseup", e => removeItemFromSelling(i));
        pendingSellArea.append(itemFrame);
    }
    priceArea.innerHTML = "";
    let priceTxt = "";
    priceTxt += `\t<c>lime<c>+${sellingPrice}`;
    priceTxt += `\n\t<c>red<c>-${buyingPrice}`;
    priceTxt += `\n<c>white<c>____________\n`;
    priceTxt += `\n<c>white<c>Total: <c>${sellingPrice > buyingPrice ? "lime" : sellingPrice == buyingPrice ? "white" : "red"}<c>${sellingPrice - buyingPrice}`;
    priceArea.append(textSyntax(priceTxt));
    totalPrice = sellingPrice - buyingPrice;
    if (Math.abs(totalPrice) > player.gold && totalPrice < 0) {
        confirmButton.classList.add("greyedOut");
    }
    else {
        (_a = confirmButton.classList) === null || _a === void 0 ? void 0 : _a.remove("greyedOut");
    }
}
function closeMerchantWindow() {
    amountScreen.style.display = "none";
    hideHover();
    contextMenu.textContent = "";
    merchantInv.innerHTML = "";
    playerInv.innerHTML = "";
    storeWindow.style.transform = "scale(0)";
}
function createMerchantItems(itemsInv) {
    let inv = [];
    for (let item of itemsInv) {
        let addThisItem = true;
        pendingItemsBuying.forEach((pending) => { if (pending.id == item.id && item.unique)
            addThisItem = false; });
        if (!addThisItem)
            continue;
        let _item = Object.assign({}, items[item.id]);
        let itm;
        if (_item.type == "consumable")
            itm = new Consumable(_item, item.price);
        else if (_item.type == "weapon")
            itm = new Weapon(_item, item.price, true);
        else if (_item.type == "armor")
            itm = new Armor(_item, item.price, true);
        else if (item.type == "artifact")
            itm = new Artifact(_item, item.price, true);
        itm.unique = item.unique;
        inv.push(itm);
    }
    return inv;
}
function itemAmountSelector(item, selling = false) {
    const input = amountScreen.querySelector(".amount");
    const but = amountScreen.querySelector(".confirm");
    amountScreen.style.display = "block";
    input.value = item.amount;
    but.onclick = () => {
        let value = parseInt(input.value);
        if (value <= 0)
            value = 1;
        if (selling && value > item.amount)
            value = item.amount;
        if (selling) {
            pendingItemsSelling.push(item);
            for (let i = 0; i < player.inventory.length; i++) {
                if (player.inventory[i].id == item.id) {
                    if (value == item.amount) {
                        player.inventory.splice(i, 1);
                    }
                    else
                        player.inventory[i].amount -= value;
                }
            }
            createMerchantWindow(false);
        }
        else {
            item.amount = value;
            pendingItemsBuying.push(item);
            createMerchantWindow(false);
        }
    };
}
function addItemToBuying(item) {
    if (!item.stacks) {
        pendingItemsBuying.push(item);
        createMerchantWindow(false);
    }
    else {
        itemAmountSelector(item);
    }
}
function addItemToSelling(item) {
    if (item.id === "A0_error")
        return;
    if (!item.stacks) {
        pendingItemsSelling.push(item);
        player.inventory.splice(item.index, 1);
        player.updateAbilities();
        createMerchantWindow(false);
    }
    else {
        itemAmountSelector(item, true);
    }
}
function removeItemFromBuying(index) {
    pendingItemsBuying.splice(index, 1);
    createMerchantWindow(false);
}
function removeItemFromSelling(index) {
    let item = pendingItemsSelling[index];
    if (item.stacks) {
        let found = false;
        player.inventory.forEach((itm) => {
            if (itm.id == item.id) {
                found = true;
                itm.amount += item.amount;
            }
        });
        if (!found) {
            player.inventory.push(item);
        }
    }
    else
        player.inventory.push(item);
    pendingItemsSelling.splice(index, 1);
    createMerchantWindow(false);
}
function confirmTransaction() {
    if (totalPrice < 0 && Math.abs(totalPrice) > player.gold)
        return;
    pendingItemsBuying.forEach((pending) => {
        if (pending.stacks) {
            let found = false;
            player.inventory.forEach((itm) => {
                if (itm.id == pending.id) {
                    itm.amount += pending.amount;
                    found = true;
                }
            });
            if (!found)
                player.inventory.push(pending);
        }
        else {
            player.inventory.push(pending);
        }
    });
    pendingItemsBuying = [];
    pendingItemsSelling = [];
    player.addGold(totalPrice);
    closeMerchantWindow();
    updateUI();
    state.storeOpen = false;
}
function cancelTransaction() {
    pendingItemsBuying = [];
    pendingItemsSelling.forEach((pending) => {
        if (pending.stacks) {
            let found = false;
            player.inventory.forEach((itm) => {
                if (itm.id == pending.id) {
                    itm.amount += pending.amount;
                    found = true;
                }
            });
            if (!found)
                player.inventory.push(pending);
        }
        else {
            player.inventory.push(pending);
        }
    });
    pendingItemsSelling = [];
    closeMerchantWindow();
    updateUI();
    state.storeOpen = false;
}
let pendingUpgrade = {
    upgradeItem: null,
    materials: []
};
function createSmithingWindow(reset = true) {
    hideHover();
    exitDialog();
    state.smithOpen = true;
    smithingWindow.style.transform = "scale(1)";
    if (reset) {
        pendingUpgrade.upgradeItem = null;
        pendingUpgrade.materials = [];
    }
    const invContainer = smithingWindow.querySelector(".invContainer");
    const upSlot = smithingWindow.querySelector(".upgradeSlot");
    const price = smithingWindow.querySelector(".smithingGoldContainer .smithingGoldNumber");
    smithingWindow.querySelector(".mat1").innerHTML = "";
    smithingWindow.querySelector(".mat2").innerHTML = "";
    upSlot.innerHTML = "";
    invContainer.innerHTML = "";
    if (pendingUpgrade.upgradeItem) {
        invContainer.append(createItems(player.inventory, "UPGRADE", null, true, pendingUpgrade.upgradeItem));
        upSlot.append(createItemToSlot(pendingUpgrade.upgradeItem, false));
        price.textContent = upgradePrice().toString();
    }
    else {
        invContainer.append(createItems(player.inventory, "UPGRADE"));
        price.textContent = "0";
    }
    pendingUpgrade.materials.forEach((item, index) => {
        smithingWindow.querySelector(`.mat${index + 1}`).append(createItemToSlot(item, true));
    });
}
function createItemToSlot(item, material = true) {
    const img = document.createElement("img");
    img.addEventListener("mousedown", e => removeItemFromUpgrade(e, item, material));
    img.src = item.img;
    img.classList.add("slotItem");
    tooltip(img, itemTT(item));
    return img;
}
function handleUpgradeAdding(e, item) {
    if (e.button !== 2)
        return;
    if (!pendingUpgrade.upgradeItem) {
        addUpgradeItem(item);
    }
    else if (pendingUpgrade.materials.length < 2) {
        addMaterialItem(item);
    }
}
function removeItemFromUpgrade(e, item, material = true) {
    if (e.button !== 2)
        return;
    if (material) {
        pendingUpgrade.materials.some((itm, index) => {
            if (itm.id == item.id) {
                player.inventory.push(itm);
                pendingUpgrade.materials.splice(index, 1);
                return true;
            }
        });
    }
    else {
        player.inventory.push(pendingUpgrade.upgradeItem);
        pendingUpgrade.upgradeItem = null;
    }
    createSmithingWindow(false);
}
function addUpgradeItem(item) {
    pendingUpgrade.upgradeItem = item;
    player.inventory.splice(item.index, 1);
    player.updateAbilities();
    createSmithingWindow(false);
}
function addMaterialItem(item) {
    pendingUpgrade.materials.push(item);
    player.inventory.splice(item.index, 1);
    player.updateAbilities();
    createSmithingWindow(false);
}
function upgrade() {
    if (player.gold < upgradePrice())
        return;
    if (pendingUpgrade.upgradeItem && pendingUpgrade.materials.length == 2) {
        pendingUpgrade.upgradeItem.level++;
        player.addGold(-upgradePrice());
        player.inventory.push(pendingUpgrade.upgradeItem);
        player.updateAbilities();
        createSmithingWindow();
    }
}
function closeSmithingWindow() {
    if (pendingUpgrade.upgradeItem) {
        player.inventory.push(pendingUpgrade.upgradeItem);
        pendingUpgrade.upgradeItem = null;
    }
    if (pendingUpgrade.materials.length > 0) {
        pendingUpgrade.materials.forEach((itm) => {
            player.inventory.push(itm);
        });
        pendingUpgrade.materials = [];
    }
    state.smithOpen = false;
    smithingWindow.style.transform = "scale(0)";
}
function upgradePrice() {
    var _a;
    return Math.floor(((_a = pendingUpgrade.upgradeItem) === null || _a === void 0 ? void 0 : _a.fullPrice()) * .5);
}
//# sourceMappingURL=npc.js.map