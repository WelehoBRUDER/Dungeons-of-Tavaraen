"use strict";
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
    console.log(playerInv.childNodes[0]);
    playerInv.querySelector(".itemList").scrollBy(sellingScroll, sellingScroll);
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
        itemFrame.classList.add("itmFrame");
        itemImg.src = pending.img;
        tooltip(itemFrame, itemTT(pending));
        itemFrame.append(itemImg);
        if (pending.stacks) {
            const itemAmnt = document.createElement("p");
            itemAmnt.classList.add("itemAmount");
            itemAmnt.textContent = pending.amount;
            itemFrame.append(itemAmnt);
            sellingPrice += Math.round(pending.price * pending.amount * 0.5);
        }
        else
            sellingPrice += Math.round(pending.fullPrice() * 0.5);
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
        confirmButton.classList?.remove("greyedOut");
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
        let _item = { ...items[item.id] };
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
    input.min = "1";
    input.max = selling ? item.amount : 999;
    but.onclick = () => {
        let value = parseInt(input.value);
        if (value <= 0)
            value = 1;
        if (selling && value > item.amount)
            value = item.amount;
        if (selling) {
            const _item = { ...item };
            _item.amount = value;
            pendingItemsSelling.push(_item);
            for (let i = 0; i < player.inventory.length; i++) {
                if (player.inventory[i].id == _item.id) {
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
//# sourceMappingURL=merchant.js.map