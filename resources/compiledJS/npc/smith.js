"use strict";
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
    if (player.gold < upgradePrice() || pendingUpgrade.upgradeItem.level >= 10)
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
//# sourceMappingURL=smith.js.map