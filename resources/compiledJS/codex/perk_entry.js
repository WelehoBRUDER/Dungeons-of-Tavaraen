"use strict";
function createPerkInfo(_perk) {
    const imageContainer = document.createElement("div");
    const perkImage = document.createElement("img");
    const tempWrapper = document.createElement("div");
    imageContainer.classList.add("entryImage");
    perkImage.src = _perk.icon;
    imageContainer.append(perkImage);
    tempWrapper.classList.add("tempWrapper");
    tempWrapper.append(textSyntax(perkTT(new perk(_perk))));
    contentContainer.append(tempWrapper, imageContainer);
}
//# sourceMappingURL=perk_entry.js.map