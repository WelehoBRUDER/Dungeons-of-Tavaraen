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
    "completed_quest_defeat_slimes_2"
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
    let interactions = characterInteractions[id];
    choices.innerHTML = "";
    interactions.always.forEach((choice) => {
        if (!choice.displayAtBottom) {
            createChoice(choice, choices, npc);
        }
    });
    interactions.conditional.forEach((choice) => {
        if (checkDialogConditions(choice.conditions)) {
            createChoice(choice, choices, npc);
        }
    });
    interactions.dialogChoices.forEach((choice) => {
        if (checkDialogConditions(choice.conditions)) {
            createChoice(choice, choices, npc);
        }
    });
    interactions.always.forEach((choice) => {
        if (choice.displayAtBottom) {
            createChoice(choice, choices, npc);
        }
    });
}
function createChoice(choice, choices, npc) {
    const button = document.createElement("div");
    button.classList.add("option");
    button.append(textSyntax(`<c>gold<c>[<c>white<c>${lang[choice.type]}<c>gold<c>]<c>white<c> ${dialogLang[lang.language_id][choice.name]}`));
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
    ;
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
const loremIpsum = `<c>white<c>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur scelerisque luctus varius. Aenean tristique a nulla luctus accumsan. Curabitur vehicula sodales congue. Sed porta egestas justo et posuere. Ut et velit vitae massa facilisis dapibus. Suspendisse ac luctus felis, vel luctus augue. Nulla facilisi. Sed in malesuada felis. Nam nec dapibus elit. Suspendisse potenti. Donec lacinia nulla nibh, laoreet commodo orci blandit vitae. In hac habitasse platea dictumst.

Ut in eros dapibus, ultrices neque sit amet, varius tortor. Nullam pellentesque consectetur tellus, vitae commodo magna tristique ac. Nunc viverra viverra ex et pharetra. Quisque sollicitudin ullamcorper convallis. Mauris pretium porttitor purus, eu dignissim diam cursus vel. Duis eu urna a est cursus eleifend vitae quis massa. Aenean quis lacus ut quam vestibulum sollicitudin. Etiam eget vulputate nunc. Fusce elementum luctus dolor sit amet tempor. Ut vestibulum volutpat magna, vel consequat lorem fermentum at.

Ut eget quam vel tellus pulvinar finibus. Nulla facilisi. Fusce interdum libero a erat consequat, sit amet vulputate sapien hendrerit. Curabitur pretium risus non lectus tristique tincidunt. Etiam interdum, justo quis pulvinar imperdiet, nibh lorem finibus erat, non tincidunt velit ipsum vel ligula. Maecenas ligula neque, tempus eget lorem ut, viverra rhoncus diam. Donec pellentesque lacus et augue posuere, eget consectetur elit laoreet. Donec dictum diam nec elit porta dictum. Donec ipsum lacus, tincidunt viverra lorem vel, sagittis pharetra nisi. Morbi in ante fringilla, vulputate massa eu, interdum turpis.

Maecenas bibendum porta nulla non porttitor. Morbi ac egestas lectus, quis elementum leo. Pellentesque ligula dui, gravida quis tempor non, auctor nec tortor. Phasellus tortor libero, tincidunt ut lacinia in, porta vitae metus. Aliquam id vestibulum metus. Aenean vel vehicula ipsum. Pellentesque ac augue nec sem sagittis porttitor. Curabitur ac volutpat tellus. In ac consectetur quam. Sed iaculis et quam eget mattis.

Integer vulputate erat eu velit eleifend, nec tristique ligula consectetur. Nulla facilisi. Pellentesque justo dui, lobortis quis scelerisque non, semper ut neque. Integer aliquet efficitur urna eu tempor. Proin magna mi, semper sed enim non, blandit consectetur nisi. Nunc ultricies metus nec elit maximus ornare. Maecenas felis dolor, vehicula et rhoncus vel, posuere in mauris. Quisque tortor nibh, molestie ut augue eu, fermentum auctor quam. Nullam imperdiet a tellus commodo lobortis. In quis malesuada diam. Curabitur varius risus sed quam vulputate, vitae accumsan urna hendrerit. Sed facilisis erat euismod volutpat pulvinar. Duis vitae urna turpis. Proin id cursus urna. In id placerat leo, at dictum orci. Cras a tellus in ligula dapibus rhoncus sed quis quam.`;
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
            itm = new Weapon(_item, item.price);
        else if (_item.type == "armor")
            itm = new Armor(_item, item.price);
        else if (item.type == "artifact")
            itm = new Artifact(_item, item.price);
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
//# sourceMappingURL=npc.js.map