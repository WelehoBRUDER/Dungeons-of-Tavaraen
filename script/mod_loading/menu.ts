const modsWindow: HTMLDivElement = document.querySelector(".mods-menu");
const modsWindowContent: HTMLDivElement = modsWindow.querySelector(".content");
const modsWindowList: HTMLDivElement = modsWindowContent.querySelector(".mods-list");
const modsWindowInfo: HTMLDivElement = modsWindowContent.querySelector(".mod-info");

async function gotoMods() {
	if (!preloadFinished || modsData?.mods?.length === 0) {
		// This will update modsData
		await uploadModDirectory();
	}
	modsWindow.style.display = "flex";
	modsWindowList.innerHTML = "";
	modsWindowInfo.innerHTML = "";
	Object.entries(modsData.mods).forEach(async ([key, mod]: any) => {
		const rawData = await mod.find((file: any) => file.name === "mod.json").text();
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
			modsWindowInfo.innerHTML = `
        <div class="mod-name">${modInfo.name}</div>
        <div class="mod-author">Author: ${modInfo.author}</div>
        <div class="mod-version">Version: ${modInfo.version}</div>
        <div class="mod-description">${modInfo.description}</div>
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
	if (!preloadFinished) return;
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
	localStorage.setItem("DOT_mods_config", JSON.stringify(modsSettings));
}

function reloadMods() {
	modsWindow.style.display = "none";
	if (preloadFinished) {
		return location.reload();
	}
	loadMods();
}
