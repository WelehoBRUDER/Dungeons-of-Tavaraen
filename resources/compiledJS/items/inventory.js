"use strict";
var _a, _b, _c;
(_b = (_a = document.querySelector(".playerInventory")) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".slot")) === null || _b === void 0 ? void 0 : _b.forEach(slot => slot.addEventListener("mousedown", e => player.unequip(e, slot.classList[0].toString())));
(_c = document.querySelector(".playerInventory")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", e => removeContextMenu(e));
let invScroll = 0;
let sellingScroll = 0;
function renderInventory() {
    state.invOpen = true;
    updatePlayerInventoryIndexes();
    contextMenu.textContent = "";
    hideHover();
    const inventory = document.querySelector(".playerInventory");
    inventory.style.transform = "scale(1)";
    const playerModel = inventory.querySelector(".playerRender");
    const ctx = playerModel.getContext("2d");
    renderPlayerOutOfMap(256, playerModel, ctx);
    document.querySelector(".worldText").style.opacity = "0";
    equipSlots.forEach((slot) => {
        inventory.querySelector("." + slot + "Bg").style.opacity = "0.33";
        inventory.querySelector("." + slot).textContent = "";
        if (Object.values(player[slot]).length > 0) {
            const _item = Object.assign({}, player[slot]);
            const img = document.createElement("img");
            const name = document.createElement("p");
            img.addEventListener("click", e => clickItem(e, player[slot], img, "PLAYER_EQUIPMENT"));
            img.src = _item.img;
            name.textContent = _item.name;
            img.classList.add("slotItem");
            name.classList.add("slotText");
            name.style.color = grades[_item.grade].color;
            tooltip(img, itemTT(_item));
            inventory.querySelector("." + slot + "Bg").style.opacity = "0";
            inventory.querySelector("." + slot).append(img, name);
        }
    });
    inventory.querySelector(".enc").textContent = `${lang["encumbrance"]}: ${player.carryingWeight()}/${player.maxCarryWeight()}`;
    const itemsArea = inventory.querySelector(".items");
    itemsArea.textContent = "";
    itemsArea.append(createItems(player.inventory));
    itemsArea.querySelector(".itemList").scrollBy(0, invScroll);
}
function closeInventory() {
    state.invOpen = false;
    hideHover();
    contextMenu.textContent = "";
    document.querySelector(".worldText").style.opacity = "1";
    const inventory = document.querySelector(".playerInventory");
    inventory.style.transform = "scale(0)";
    const _inv = document.querySelector(".defaultItemsArray");
    _inv.textContent = "";
    _inv.style.transform = "scale(0)";
}
function closeLeveling() {
    state.perkOpen = false;
    document.querySelector(".worldText").style.opacity = "1";
    const lvling = document.querySelector(".playerLeveling");
    lvling.style.transform = "scale(0)";
}
let sortingReverse = false;
function createItems(inventory, context = "PLAYER_INVENTORY", chest = null, resetItem = true, itemToMatch = null) {
    const container = document.createElement("div");
    const itemsList = document.createElement("div");
    const itemsListBar = document.createElement("div");
    const topImage = document.createElement("p");
    const topName = document.createElement("p");
    const topType = document.createElement("p");
    const topRarity = document.createElement("p");
    const topWeight = document.createElement("p");
    const topWorth = document.createElement("p");
    container.classList.add("itemsContainer");
    topImage.classList.add("topImage");
    topName.classList.add("topName");
    topType.classList.add("topType");
    topRarity.classList.add("topRarity");
    topWeight.classList.add("topWeight");
    topWorth.classList.add("topWorth");
    topName.textContent = lang["item_name"];
    topType.textContent = lang["item_type"];
    topRarity.textContent = lang["item_rarity"];
    topWeight.textContent = lang["item_weight_title"];
    topWorth.textContent = lang["item_worth_title"];
    topName.addEventListener("click", e => sortInventory("name", sortingReverse, inventory, context));
    topType.addEventListener("click", e => sortInventory("type", sortingReverse, inventory, context));
    topRarity.addEventListener("click", e => sortInventory("grade", sortingReverse, inventory, context));
    topWeight.addEventListener("click", e => sortInventory("weight", sortingReverse, inventory, context));
    topWorth.addEventListener("click", e => sortInventory("worth", sortingReverse, inventory, context));
    itemsList.classList.add("itemList");
    itemsListBar.classList.add("itemListTop");
    itemsListBar.append(topImage, topName, topType, topRarity, topWeight, topWorth);
    itemsList.addEventListener("click", e => removeContextMenu(e));
    const items = [...inventory];
    items.forEach((item) => {
        if (context == "UPGRADE" && (itemToMatch === null || itemToMatch === void 0 ? void 0 : itemToMatch.id)) {
            if (item.id !== (itemToMatch === null || itemToMatch === void 0 ? void 0 : itemToMatch.id) || item.level !== (itemToMatch === null || itemToMatch === void 0 ? void 0 : itemToMatch.level))
                return;
        }
        ;
        if (context == "UPGRADE" && (item.type == "artifact" || item.type == "consumable"))
            return;
        let itm = Object.assign({}, item);
        if (resetItem) {
            if (itm.type == "weapon")
                itm = new Weapon(Object.assign({}, itm), 0, context === "MERCHANT_SELLING" ? true : false);
            else if (itm.type == "armor")
                itm = new Armor(Object.assign({}, itm), 0, context === "MERCHANT_SELLING" ? true : false);
            else if (itm.type == "artifact")
                itm = new Artifact(Object.assign({}, itm), 0, context === "MERCHANT_SELLING" ? true : false);
            else if (itm.type == "consumable")
                itm = new Consumable(Object.assign({}, itm));
        }
        const itemObject = document.createElement("div");
        const itemImage = document.createElement("img");
        const itemName = document.createElement("p");
        const itemRarity = document.createElement("p");
        const itemType = document.createElement("p");
        const itemWeight = document.createElement("p");
        const itemWorth = document.createElement("p");
        itemObject.classList.add("itemListObject");
        itemImage.classList.add("itemImg");
        itemName.classList.add("itemName");
        itemRarity.classList.add("itemRarity");
        itemType.classList.add("itemType");
        itemWeight.classList.add("itemWeight");
        itemWorth.classList.add("itemWorth");
        itemImage.src = itm.img;
        itemName.style.color = grades[itm.grade].color;
        itemType.style.color = grades[itm.grade].color;
        itemRarity.style.color = grades[itm.grade].color;
        itemWeight.style.color = grades[itm.grade].color;
        itemWorth.style.color = "gold";
        itemName.textContent = `${itm.name} ${itm.stacks ? "x" + itm.amount : ""}`;
        itemRarity.textContent = lang[itm.grade].toLowerCase();
        itemType.textContent = lang[itm.type];
        itemWeight.textContent = itm.weight;
        let price = itm.price;
        if (typeof itm.fullPrice === "function") {
            price = itm.fullPrice();
        }
        if (price > 999)
            price = `${(price / 1000).toFixed(1)}k`;
        itemWorth.textContent = price;
        if (context == "PLAYER_INVENTORY") {
            itemObject.addEventListener("mousedown", e => player.equip(e, itm));
            itemObject.addEventListener("mouseup", e => fastDrop(e, itm));
            itemObject.addEventListener("click", e => clickItem(e, itm, itemObject, "PLAYER_INVENTORY"));
        }
        if (context == "PICK_LOOT") {
            itemObject.addEventListener("mousedown", e => grabLoot(e, itm, item.dataIndex));
            itemObject.addEventListener("click", e => clickItem(e, itm, itemObject, "PICK_LOOT", null, item.dataIndex));
        }
        if (context == "PICK_TREASURE") {
            itemObject.addEventListener("mousedown", e => grabTreasure(e, itm, chest, item.dataIndex));
            itemObject.addEventListener("click", e => clickItem(e, itm, itemObject, "PICK_TREASURE", chest, item.dataIndex));
        }
        if (context == "MERCHANT_SELLING") {
            itemObject.addEventListener("mousedown", e => buyItem(e, itm));
            itemObject.addEventListener("click", e => clickItem(e, itm, itemObject, "MERCHANT_SELLING", chest));
        }
        if (context == "PLAYER_SELLING") {
            itemObject.addEventListener("mousedown", e => sellItem(e, itm));
            itemObject.addEventListener("click", e => clickItem(e, itm, itemObject, "PLAYER_SELLING", chest));
        }
        if (context == "UPGRADE") {
            itemObject.addEventListener("mousedown", e => handleUpgradeAdding(e, itm));
            itemObject.addEventListener("click", e => clickItem(e, itm, itemObject, "UPGRADE", chest));
        }
        tooltip(itemObject, itemTT(itm));
        itemObject.append(itemImage, itemName, itemType, itemRarity, itemWeight, itemWorth);
        itemsList.append(itemObject);
    });
    if (context == "PLAYER_SELLING") {
        itemsList.addEventListener("wheel", deltaY => {
            sellingScroll = itemsList.scrollTop;
        });
        itemsList.scrollBy(sellingScroll, sellingScroll);
    }
    else {
        itemsList.addEventListener("wheel", deltaY => {
            invScroll = itemsList.scrollTop;
        });
        itemsList.scrollBy(invScroll, invScroll);
    }
    container.append(itemsList, itemsListBar);
    return container;
}
function buyItem(e, itm) {
    if (e.button !== 2)
        return;
    addItemToBuying(itm);
}
function sellItem(e, itm) {
    if (e.button !== 2)
        return;
    addItemToSelling(itm);
}
function clickItem(Event, item, itemObject, context = "PLAYER_INVENTORY", chest = null, dataIndex = -1) {
    var _a, _b;
    if (item.id == "A0_error")
        return;
    contextMenu.textContent = "";
    (_b = (_a = document.querySelector(".itemSelected")) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.remove("itemSelected");
    if (Event.shiftKey)
        return;
    if (context != "PLAYER_EQUIPMENT")
        itemObject.classList.add("itemSelected");
    contextMenu.style.left = `${Event.x}px`;
    contextMenu.style.top = `${Event.y}px`;
    if (context == "PLAYER_INVENTORY") {
        if (item.type != "consumable") { }
        contextMenuButton(lang["equip"], () => player.equip(Event, item, true));
        contextMenuButton(lang["drop"], () => player.drop(item, true));
    }
    else if (context == "PICK_LOOT") {
        contextMenuButton(lang["pick_up"], () => grabLoot(Event, item, dataIndex, true));
    }
    else if (context == "PICK_TREASURE") {
        contextMenuButton(lang["pick_up"], () => grabTreasure(Event, item, chest, dataIndex, true));
    }
    else if (context == "PLAYER_EQUIPMENT") {
        contextMenuButton(lang["unequip"], () => player.unequip(Event, item.slot, -1, false, true));
    }
    else if (context == "MERCHANT_SELLING") {
        contextMenuButton(lang["buy_item"], () => { addItemToBuying(item); });
    }
    else if (context == "PLAYER_SELLING") {
        contextMenuButton(lang["sell_item"], () => { addItemToSelling(item); });
    }
}
function fastDrop(Event, itm) {
    if (Event.shiftKey) {
        player.drop(itm);
    }
}
function removeContextMenu(Event = null) {
    var _a, _b;
    let target = Event.target;
    if (target.className.includes("itemList") || target.className.includes("playerInventory")) {
        (_b = (_a = document.querySelector(".itemSelected")) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.remove("itemSelected");
        contextMenu.textContent = "";
    }
}
//# sourceMappingURL=inventory.js.map