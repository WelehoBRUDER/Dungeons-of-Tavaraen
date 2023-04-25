"use strict";
const modsWindow = document.querySelector(".mods-menu");
const modsWindowContent = modsWindow.querySelector(".content");
const modsWindowList = modsWindowContent.querySelector(".mods-list");
const modsWindowInfo = modsWindowContent.querySelector(".mod-info");
async function gotoMods() {
    var _a;
    if (!preloadFinished || ((_a = modsData === null || modsData === void 0 ? void 0 : modsData.mods) === null || _a === void 0 ? void 0 : _a.length) === 0) {
        // This will update modsData
        await uploadModDirectory();
    }
    modsWindow.style.display = "flex";
    modsWindowList.innerHTML = "";
    modsWindowInfo.innerHTML = "";
    Object.entries(modsData.mods).forEach(async ([key, mod]) => {
        const rawData = await mod.find((file) => file.name === "mod.json").text();
        const modInfo = JSON.parse(rawData);
        const modItem = document.createElement("div");
        if (!modsSettings || !Object.keys(modsSettings).includes(key)) {
            modsSettings[key] = true;
        }
        const enabled = modsSettings[key];
        modItem.classList.add("mod-item");
        if (enabled) {
            modItem.classList.add("enabled");
        }
        modItem.classList.add(key);
        modItem.innerHTML = `
      <div class="mod-name">${modInfo.name} ${modInfo.version}</div>
      <div class="mod-enabled"></div>
    `;
        modItem.addEventListener("click", () => {
            var _a, _b;
            modsWindowInfo.innerHTML = `
        <div class="mod-name">${modInfo.name}</div>
        <div class="mod-author">Author: ${modInfo.author}</div>
        <div class="mod-version">Version: ${modInfo.version}</div>
        <div class="mod-description">${modInfo.description}</div>
        <button class="toggle-mod ${enabled ? "red-button" : "blue-button"}"></button>
      `;
            const button = modsWindowInfo.querySelector(".toggle-mod");
            button === null || button === void 0 ? void 0 : button.addEventListener("click", () => toggleMod(modItem));
            if (enabled) {
                button.textContent = (_a = lang.disable) !== null && _a !== void 0 ? _a : "Disable";
            }
            else {
                button.textContent = (_b = lang.enable) !== null && _b !== void 0 ? _b : "Enable";
            }
        });
        modsWindowList.appendChild(modItem);
    });
    localStorage.setItem("DOT_game_mods", JSON.stringify(modsSettings));
}
function closeModsMenu() {
    if (!preloadFinished)
        return;
    modsWindow.style.display = "none";
}
function toggleMod(mod) {
    var _a, _b, _c, _d, _e, _f;
    mod.classList.toggle("enabled");
    const name = mod.classList[1];
    modsSettings[name] = !modsSettings[name];
    const button = modsWindowInfo.querySelector(".toggle-mod");
    console.log(name);
    if (modsSettings[name]) {
        button.textContent = (_a = lang.disable) !== null && _a !== void 0 ? _a : "Disable";
        (_b = button.classList) === null || _b === void 0 ? void 0 : _b.remove("blue-button");
        (_c = button.classList) === null || _c === void 0 ? void 0 : _c.add("red-button");
    }
    else {
        button.textContent = (_d = lang.enable) !== null && _d !== void 0 ? _d : "Enable";
        (_e = button.classList) === null || _e === void 0 ? void 0 : _e.remove("red-button");
        (_f = button.classList) === null || _f === void 0 ? void 0 : _f.add("blue-button");
    }
    localStorage.setItem("DOT_mods_config", JSON.stringify(modsSettings));
}
function reloadMods() {
    modsWindow.style.display = "none";
    if (preloadFinished) {
        return location.reload();
    }
    loadMods();
}
//# sourceMappingURL=menu.js.map