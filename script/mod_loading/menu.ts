const modsWindow: HTMLDivElement = document.querySelector(".mods-menu");
const modsWindowContent: HTMLDivElement = modsWindow.querySelector(".content");
const modsWindowList: HTMLDivElement = modsWindowContent.querySelector(".mods-list");
const modsWindowInfo: HTMLDivElement = modsWindowContent.querySelector(".mod-info");

function gotoMods() {
  modsWindow.style.display = "flex";
  modsWindowList.innerHTML = "";
  modsWindowInfo.innerHTML = "";
  modsInformation.forEach((mod: ModInfo) => {
    const modItem = document.createElement("div");
    if (!modsSettings || !Object.keys(modsSettings).includes(mod.key)) {
      modsSettings[mod.key] = true;
    }
    const enabled = modsSettings?.[mod.key];
    modItem.classList.add("mod-item");
    if (enabled) {
      modItem.classList.add("enabled");
    }
    modItem.classList.add(mod.key);
    modItem.innerHTML = `
      <div class="mod-name">${mod.name} ${mod.version}</div>
      <div class="mod-enabled"></div>
    `;

    modItem.addEventListener("click", () => {
      modsWindowInfo.innerHTML = `
        <div class="mod-name">${mod.name}</div>
        <div class="mod-author">Author: ${mod.author}</div>
        <div class="mod-version">Version: ${mod.version}</div>
        <div class="mod-description">${mod.description}</div>
        <button class="toggle-mod ${enabled ? "red-button" : "blue-button"}"></button>
      `;
      const button = modsWindowInfo.querySelector(".toggle-mod");
      button?.addEventListener("click", () => toggleMod(modItem));
      if (enabled) {
        button.textContent = lang.disable ?? "Disable";
      } else {
        button.textContent = lang.enable ?? "Enable";
      }
    });

    modsWindowList.appendChild(modItem);
  });
  localStorage.setItem("DOT_game_mods", JSON.stringify(modsSettings));
}

function closeModsMenu() {
  modsWindow.style.display = "none";
}

function toggleMod(mod: HTMLElement) {
  mod.classList.toggle("enabled");
  const name = mod.classList[1];
  modsSettings[name] = !modsSettings[name];
  const button = modsWindowInfo.querySelector(".toggle-mod");
  if (modsSettings[name]) {
    button.textContent = lang.disable ?? "Disable";
    button.classList?.remove("blue-button");
    button.classList?.add("red-button");
  } else {
    button.textContent = lang.enable ?? "Enable";
    button.classList?.remove("red-button");
    button.classList?.add("blue-button");
  }
  localStorage.setItem("DOT_game_mods", JSON.stringify(modsSettings));
}