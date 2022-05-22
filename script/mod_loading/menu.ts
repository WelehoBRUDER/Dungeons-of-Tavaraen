const modsWindow: HTMLDivElement = document.querySelector(".mods-menu");
const modsWindowContent: HTMLDivElement = modsWindow.querySelector(".content");
const modsWindowList: HTMLDivElement = modsWindowContent.querySelector(".mods-list");
const modsWindowInfo: HTMLDivElement = modsWindowContent.querySelector(".mod-info");

function gotoMods() {
  modsWindow.style.display = "flex";
  modsWindowList.innerHTML = "";
  modsWindowInfo.innerHTML = "";
  console.log(modsInformation);
  modsInformation.forEach((mod: ModInfo) => {
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