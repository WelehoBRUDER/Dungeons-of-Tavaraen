"use strict";
function createItemInfo(item) {
    let parsedItem = item;
    if (item.type === "weapon") {
        parsedItem = new Weapon(parsedItem, 0, true);
    }
    else if (item.type === "armor") {
        parsedItem = new Armor(parsedItem, 0, true);
    }
    else if (item.type === "artifact") {
        parsedItem = new Artifact(parsedItem, 0, true);
    }
    else if (item.type === "consumable") {
        parsedItem = new Consumable(parsedItem);
    }
    // else if(item.type === "material") {
    //   parsedItem = new Material(parsedItem);
    // }
    const imageContainer = document.createElement("div");
    const itemImage = document.createElement("img");
    const tempWrapper = document.createElement("div");
    imageContainer.classList.add("entryImage");
    itemImage.src = item.img;
    imageContainer.append(itemImage);
    tempWrapper.classList.add("tempWrapper");
    tempWrapper.append(textSyntax(itemTT(parsedItem)));
    contentContainer.append(tempWrapper, imageContainer);
}
//# sourceMappingURL=item_entry.js.map