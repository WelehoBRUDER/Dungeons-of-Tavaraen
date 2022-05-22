"use strict";
const modsWindow = document.querySelector(".mods-menu");
const modsWindowContent = modsWindow.querySelector(".content");
const modsWindowList = modsWindowContent.querySelector(".mods-list");
const modsWindowInfo = modsWindowContent.querySelector(".mod-info");
function gotoMods() {
    modsWindow.style.display = "flex";
    modsWindowList.innerHTML = "";
    modsWindowInfo.innerHTML = "";
    console.log(modsInformation);
    modsInformation.forEach((mod) => {
        const modItem = document.createElement("div");
        modItem.classList.add("mod-item");
        modItem.innerHTML = `
      <div class="mod-name">${mod.name} ${mod.version}</div>
    `;
        modItem.addEventListener("click", () => {
            modsWindowInfo.innerHTML = `
        <div class="mod-name">${mod.name}</div>
        <div class="mod-author">Author: ${mod.author}</div>
        <div class="mod-version">Version: ${mod.version}</div>
        <div class="mod-description">${mod.description}</div>
      `;
        });
        modsWindowList.appendChild(modItem);
    });
}
function closeModsMenu() {
    modsWindow.style.display = "none";
}
//# sourceMappingURL=menu.js.map