function handleEscape() {
	if (devConsole.open) {
		devConsole.open = false;
		consoleElement.style.display = "none";
	}
	if (state.perkOpen) {
		closeLeveling();
		state.perkOpen = false;
	} else if (state.charOpen) {
		closeCharacter();
		state.charOpen = false;
	} else if (state.invOpen) {
		closeInventory();
		state.invOpen = false;
	} else if (state.savesOpen) {
		closeSaveMenu();
		state.savesOpen = false;
	} else if (state.optionsOpen) {
		closeSettingsMenu();
		state.optionsOpen = false;
	} else if (state.displayingTextHistory) {
		state.displayingTextHistory = false;
		displayAllTextHistory();
	} else if (state.rangedMode) {
		state.rangedMode = false;
		renderTileHover(player.cords, null);
	} else if (state.menuOpen && !state.titleScreen) {
		closeGameMenu(false, false, false);
		state.menuOpen = false;
	} else if (state.dialogWindow) {
		exitDialog();
	} else if (state.storeOpen) {
		cancelTransaction();
	} else if (state.journalOpen) {
		closePlayerQuests();
	} else if (state.codexOpen) {
		closeCodex();
	} else if (state.smithOpen) {
		closeSmithingWindow();
	} else if (!state.isSelected && !player.isDead) {
		openGameMenu();
		state.menuOpen = true;
	}
	if (state.areaMapOpen) {
		state.areaMapOpen = false;
		moveAreaMap();
	}
	state.isSelected = false;
	state.abiSelected = {};
	mapSelection.x = null;
	mapSelection.y = null;
	closeTextWindow();
	updateUI();
	hideHover();
	renderTileHover(player.cords);
	contextMenu.textContent = "";
	assignContainer.style.display = "none";
	if (player.isDead) spawnDeathScreen();
}

function closeAllWindowsAndMenus() {
	state.menuOpen = false;
	closeGameMenu(true, false, false);
	closeSettingsMenu();
	closeCharacter();
	closeInventory();
	closeLeveling();
	closeSaveMenu();
	closePlayerQuests();
	closeCodex();
	closeSmithingWindow();
	closeTextWindow();
	hideHover();
}

const languages = ["english", "finnish"] as any;

const mainMenu = document.querySelector<HTMLDivElement>(".mainMenu");
const menu = document.querySelector<HTMLDivElement>(".gameMenu");
const dim = document.querySelector<HTMLDivElement>(".dim");
const mainMenuButtons = mainMenu.querySelector<HTMLDivElement>(".menuButtons");
const settingsBackground = document.querySelector<HTMLDivElement>(".settingsMenu");
const settingsContent = settingsBackground.querySelector<HTMLDivElement>(".content");
const settingsTopbar = settingsBackground.querySelector<HTMLDivElement>(".top-bar");

function openGameMenu() {
	menu.textContent = "";
	setTimeout(() => {
		dim.style.height = "100%";
	}, 5);
	for (let button of menuOptions) {
		const frame = document.createElement("div");
		frame.textContent = lang[button.id] ?? button.id;
		frame.classList.add("blue-button");
		frame.classList.add(button.id);
		if (button.action) {
			frame.addEventListener("click", () => button.action());
		}
		menu.append(frame);
	}
}

function closeGameMenu(noDim = false, escape = false, keepMainMenu = false) {
	const reverseOptions = [...menuOptions].reverse();
	if (!noDim) {
		setTimeout(() => {
			dim.style.height = "0%";
		}, 5);
		settingsContent.textContent = "";
		settingsTopbar.style.height = "0px";
	}
	if (!keepMainMenu) {
		setTimeout(() => {
			mainMenu.style.display = "none";
		}, 575);
		state.menuOpen = false;
		state.titleScreen = false;
		mainMenu.style.opacity = "0";
	}
	for (let button of reverseOptions) {
		try {
			const frame = menu.querySelector<HTMLDivElement>(`.${button.id}`);
			frame.remove();
		} catch (err) {
			if (DEVTOOLS.ENABLED) displayText(`<c>red<c>${err} at line menu:398`);
		}
	}
	if (escape) handleEscape();
	hideHover();
	if (player.isDead) spawnDeathScreen();
}

let selectingHotkey = "";
window.addEventListener("keyup", (e) => {
	if (selectingHotkey != "") {
		settings[selectingHotkey] = e.key;
		document.querySelector(`.${selectingHotkey}`).childNodes[1].textContent = e.key.toUpperCase();
		tooltip(document.querySelector(".invScrb"), `${lang["setting_hotkey_inv"]} [${settings["hotkey_inv"]}]`);
		tooltip(document.querySelector(".chaScrb"), `${lang["setting_hotkey_char"]} [${settings["hotkey_char"]}]`);
		tooltip(document.querySelector(".perScrb"), `${lang["setting_hotkey_perk"]} [${settings["hotkey_perk"]}]`);
		tooltip(document.querySelector(".jorScrb"), `${lang["setting_hotkey_journal"]} [${settings["hotkey_journal"]}]`);
		tooltip(document.querySelector(".codScrb"), `${lang["setting_hotkey_codex"]} [${settings["hotkey_codex"]}]`);
		tooltip(document.querySelector(".escScrb"), `${lang["open_menu"]} [ESCAPE]`);
		selectingHotkey = "";
	}
});

async function closeSettingsMenu() {
	settingsContent.textContent = "";
	settingsTopbar.style.height = "0px";
	state.optionsOpen = false;
	setTimeout(() => {
		dim.style.height = "0%";
	}, 5);
	hideHover();
}

function scaleUI(scale: number) {
	settings["ui_scale"] = scale * 100;
	document.documentElement.style.setProperty("--ui-scale", scale.toString());
	moveMinimap();
}

function gotoSettingsMenu(inMainMenu = false) {
	selectingHotkey = "";
	state.optionsOpen = true;
	if (!inMainMenu) closeGameMenu(true);
	settingsTopbar.style.height = "32px";
	settingsContent.textContent = "";
	for (let setting of menuSettings) {
		const container = document.createElement("div");
		if (setting.type == "toggle") {
			container.classList.add("toggle");
			const text = document.createElement("p");
			const toggleBox = document.createElement("div");
			text.textContent = lang[setting.id] ?? setting.id;
			let _setting = setting.id.replace("setting_", "");
			if (settings[_setting]) toggleBox.textContent = "X";
			else toggleBox.textContent = "";
			container.addEventListener("click", (tog) => {
				settings[_setting] = !settings[_setting];
				moveMinimap();
				if (_setting.includes("draw")) resizeCanvas();
				if (_setting.includes("fps")) refreshLoop();
				if (settings[_setting]) toggleBox.textContent = "X";
				else toggleBox.textContent = "";
			});
			if (setting.tooltip) {
				tooltip(container, lang[setting.tooltip]);
			}
			container.append(text, toggleBox);
			settingsContent.append(container);
		} else if (setting.type == "hotkey") {
			container.classList.add("hotkeySelection");
			const text = document.createElement("p");
			text.textContent = lang[setting.id] ?? setting.id;
			let _setting = setting.id.replace("setting_", "");
			container.classList.add(_setting);
			const keyButton = document.createElement("div");
			keyButton.textContent = settings[_setting].toUpperCase();
			if (settings[_setting] == " ") keyButton.textContent = lang["space_key"];
			container.addEventListener("click", () => {
				if (selectingHotkey == "") {
					keyButton.textContent = "<>";
					selectingHotkey = _setting;
				}
			});
			if (setting.tooltip) {
				tooltip(container, lang[setting.tooltip]);
			}
			container.append(text, keyButton);
			settingsContent.append(container);
		} else if (setting.type == "inputSlider") {
			container.classList.add("sliderContainer");
			const text = document.createElement("p");
			const slider = document.createElement("input");
			const textVal = document.createElement("p");
			slider.classList.add("slider");
			textVal.classList.add("inputValue");
			text.textContent = lang[setting.id] ?? setting.id;
			let _setting = setting.id.replace("setting_", "");
			slider.type = "range";
			slider.min = "50";
			slider.max = "150";
			slider.value = settings[_setting].toString();
			container.classList.add(_setting);
			if (setting.tooltip) {
				tooltip(container, lang[setting.tooltip]);
			}
			textVal.textContent = `${(parseInt(slider.value) / 100).toString()}x`;
			slider.oninput = () => {
				scaleUI(parseInt(slider.value) / 100);
				textVal.textContent = `${(parseInt(slider.value) / 100).toString()}x`;
			};
			text.append(textVal);
			container.append(text, slider);
			settingsContent.append(container);
		} else if (setting.type == "inputSliderReduced") {
			container.classList.add("sliderContainer");
			const text = document.createElement("p");
			const slider = document.createElement("input");
			const textVal = document.createElement("p");
			slider.classList.add("slider");
			textVal.classList.add("inputValue");
			text.textContent = lang[setting.id] ?? setting.id;
			let _setting = setting.id.replace("setting_", "");
			slider.type = "range";
			slider.min = "-10";
			slider.max = "10";
			slider.value = settings[_setting].toString();
			container.classList.add(_setting);
			if (setting.tooltip) {
				tooltip(container, lang[setting.tooltip]);
			}
			textVal.textContent = `${parseInt(slider.value).toString()}`;
			slider.oninput = () => {
				settings[_setting] = parseInt(slider.value);
				renderEntireMap(maps[currentMap]);
				textVal.textContent = `${parseInt(slider.value).toString()}`;
			};
			text.append(textVal);
			container.append(text, slider);
			settingsContent.append(container);
		} else if (setting.type == "languageSelection") {
			container.classList.add("languageSelection");
			const text = document.createElement("p");
			text.textContent = lang[setting.id] ?? setting.id;
			container.append(text);
			languages.forEach((language: string) => {
				const langButton = document.createElement("div");
				langButton.textContent = lang[language];
				if (language == lang["language_id"]) langButton.classList.add("selectedLang");
				langButton.addEventListener("click", () => {
					container.childNodes.forEach((child: any) => {
						try {
							child.classList.remove("selectedLang");
						} catch (err) {
							if (DEVTOOLS.ENABLED) displayText(`<c>red<c>${err} at line menu:279`);
						}
					});
					settings.language = language;
					lang = eval(language);
					tooltip(document.querySelector(".invScrb"), `${lang["setting_hotkey_inv"]} [${settings["hotkey_inv"]}]`);
					tooltip(document.querySelector(".chaScrb"), `${lang["setting_hotkey_char"]} [${settings["hotkey_char"]}]`);
					tooltip(document.querySelector(".perScrb"), `${lang["setting_hotkey_perk"]} [${settings["hotkey_perk"]}]`);
					tooltip(document.querySelector(".jorScrb"), `${lang["setting_hotkey_journal"]} [${settings["hotkey_journal"]}]`);
					tooltip(document.querySelector(".codScrb"), `${lang["setting_hotkey_codex"]} [${settings["hotkey_codex"]}]`);
					tooltip(document.querySelector(".escScrb"), `${lang["open_menu"]} [ESCAPE]`);
					tooltip(settingsTopbar.querySelector(".save"), lang["save_settings"]);
					tooltip(settingsTopbar.querySelector(".saveFile"), lang["save_settings_file"]);
					tooltip(settingsTopbar.querySelector(".loadFile"), lang["load_settings_file"]);
					player.updateAbilities();
					gotoSettingsMenu(true);
				});
				container.append(langButton);
			});
			settingsContent.append(container);
		}
	}
}

async function gotoMainMenu(init: boolean = false) {
	despawnDeathScreen();
	menu.textContent = "";
	setTimeout(() => {
		dim.style.height = "0%";
	}, 150);
	mainMenu.style.display = "block";
	await helper.sleep(10);
	mainMenu.style.opacity = "1";
	mainMenuButtons.textContent = "";
	for (let button of mainButtons) {
		const frame = document.createElement("div");
		frame.textContent = lang[button.id] ?? button.id;
		frame.classList.add("menuButton");
		frame.classList.add(button.id);
		if (button.action) {
			frame.addEventListener("click", () => button.action());
		}
		if (button.id.includes("resume") && !DEVTOOLS.ENABLED && init) frame.classList.add("greyedOut");
		mainMenuButtons.append(frame);
	}
}

function openChangelog() {
	location.href = "https://github.com/WelehoBRUDER/Dungeons-of-Tavaraen/blob/main/Changelog.md";
}

function convertEnemytraits() {
	Object.values(maps).forEach((mp: any) => {
		mp.enemies.map((en: any) => {
			en.updateTraits();
		});
	});
}

function LoadSlot(data: any) {
	timePlayedNow = performance.now();
	loadingScreen.style.display = "flex";
	loadingText.textContent = "Loading save...";
	document.querySelector<HTMLDivElement>(".loading-bar-fill").style.width = "0%";
	let foundMap;
	let _pl;
	let _itmData;
	let _falEnemies;
	let _loot;
	try {
		let key = GetKey("currentMap", data).data;
		if (typeof key === "number") {
			key = Object.keys(maps)[key];
		}
		foundMap = key;
		if (!foundMap) foundMap = GetKey("currentMap", data).data;
		if (foundMap < 0 || foundMap === undefined) throw Error("CAN'T FIND MAP!");
		_pl = new PlayerCharacter({ ...GetKey("player", data).data });
		_itmData = GetKey("itemData", data).data ?? [];
		_falEnemies = GetKey("enemies", data).data ?? [];
		_loot = GetKey("lootedChests", data).data ?? [];
		// update classes of all dropped items just in case
		_itmData.map((item: any) => {
			if (item.itm.type === "weapon") return (item.itm = new Weapon({ ...items[item.itm.id] }));
			if (item.itm.type === "armor") return (item.itm = new Armor({ ...items[item.itm.id] }));
			if (item.itm.type === "artifact") return (item.itm = new Artifact({ ...items[item.itm.id] }));
			if (item.itm.type === "consumable") return (item.itm = new Consumable({ ...items[item.itm.id] }));
		});
		for (let i = _pl.traits?.length ?? 0; i >= 0; i--) {
			// Find faulty trait
			try {
				if (Object.keys(_pl.traits[i].effects).length === 0) {
					// literally do nothing
				}
			} catch {
				_pl.traits.splice(i, 1);
			}
		}
		_pl.updateTraits();
		_pl.updatePerks(true);
		_pl.updateAbilities();
		Object.entries(_pl.classes.main.statBonuses).forEach((stat: any) => {}); // dirty trick to catch invalid save
	} catch (err: any) {
		console.error(err);
		loadingScreen.style.display = "none";
		return warningMessage("<i>resources/icons/error.png<i>Failed to load save.\nIt may be corrupted or too old.");
	}
	helper.reviveAllDeadEnemies();
	player = _pl;
	itemData = _itmData;
	lootedChests = _loot;
	fallenEnemies = _falEnemies;
	currentMap = foundMap;
	tree = player.classes.main.perkTree;
	turnOver = true;
	enemiesHadTurn = 0;
	state.inCombat = false;
	player.updateTraits();
	player.updatePerks(true);
	player.updateAbilities();
	helper.purgeDeadEnemies();
	helper.killAllQuestEnemies();
	document.querySelector<HTMLDivElement>(".loading-bar-fill").style.width = "100%";
	spawnQuestMonsters();
	handleEscape();
	closeGameMenu();
	resetAllChests();
	createStaticMap();
	modifyCanvas(true);
	updateUI();
	loadingScreen.style.display = "none";
}

function openTextWindow(txt: string) {
	state.textWindowOpen = true;
	const textWindow = document.querySelector<HTMLDivElement>(".textWindow");
	textWindow.style.transform = "scale(1)";
	textWindow.textContent = "";
	textWindow.append(textSyntax(txt));
}

function closeTextWindow() {
	state.textWindowOpen = false;
	const textWindow = document.querySelector<HTMLDivElement>(".textWindow");
	textWindow.style.transform = "scale(0)";
	textWindow.textContent = "";
}

// This function was provided by courtesy of kassu11
// thanks
function calcLocalStorageMaxSpace() {
	try {
		for (let tuhat = 1000; tuhat < 100005; tuhat += 1000) localStorage.tuhat = "a".repeat(1024 * tuhat);
	} catch {}
	try {
		for (let sata = 100; sata < 1005; sata += 100) localStorage.sata = "a".repeat(1024 * sata);
	} catch {}
	try {
		for (let kymmenen = 10; kymmenen < 105; kymmenen += 10) localStorage.kymppi = "a".repeat(1024 * kymmenen);
	} catch {}
	try {
		for (let single = 1; single < 15; single++) localStorage.single = "a".repeat(1024 * single);
	} catch {}
	try {
		for (let half = 20; half > 0; half--) localStorage.half = "a".repeat(Math.ceil(1024 / half));
	} catch {}
	try {
		for (let pieni = 1; pieni < 512; pieni++) localStorage.pieni = "a".repeat(pieni);
	} catch {}

	const endSpace = calcLocalStorageUsedSpace();
	localStorage.removeItem("tuhat");
	localStorage.removeItem("sata");
	localStorage.removeItem("kymppi");
	localStorage.removeItem("single");
	localStorage.removeItem("half");
	localStorage.removeItem("pieni");
	return Math.round(endSpace);
}

function calcLocalStorageUsedSpace() {
	let total = 0;
	for (const key in localStorage) {
		if (localStorage.hasOwnProperty(key)) {
			const length = (localStorage[key].length + key.length) * 2;
			total += length;
		}
	}
	return parseInt((total / 1024).toFixed(2));
}

function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.substring(1);
}

function saveSettings() {
	localStorage.setItem("DOT_game_settings", JSON.stringify(settings));
	localStorage.setItem("DOT_game_language", JSON.stringify(lang.language_id));
}

function saveSettingsFile() {
	const saveData = (function () {
		let link = document.createElement("a") as any;
		document.body.appendChild(link);
		link.style = "display: none";
		return function (data: any, fileName: string) {
			const json = JSON.stringify(data, null, 2),
				blob = new Blob([json], { type: "octet/stream" }),
				url = window.URL.createObjectURL(blob);
			link.href = url;
			link.download = fileName;
			link.click();
			window.URL.revokeObjectURL(url);
		};
	})();
	saveData(settings, "settings.json");
}

function loadSettingsFile() {
	const fileInput = document.createElement("input");
	fileInput.setAttribute("type", "file");
	fileInput.click();
	fileInput.addEventListener("change", () => HandleSettingsFile(fileInput.files[0]));
}

function HandleSettingsFile(file: any) {
	const reader = new FileReader();
	let text = "";

	// file reading finished successfully
	reader.addEventListener("load", function (e) {
		// contents of file in variable
		text = e.target.result as any;
		FinishRead();
	});

	// read as text file
	reader.readAsText(file);

	function FinishRead() {
		let Table = JSON.parse(text);
		LoadSettings(file.name, Table);
	}
}

function LoadSettings(name: string, settings: any) {
	settings = new gameSettings(settings);
	gotoSettingsMenu(state.titleScreen);
	lang = eval(settings.language);
	tooltip(document.querySelector(".invScrb"), `${lang["setting_hotkey_inv"]} [${settings["hotkey_inv"]}]`);
	tooltip(document.querySelector(".chaScrb"), `${lang["setting_hotkey_char"]} [${settings["hotkey_char"]}]`);
	tooltip(document.querySelector(".perScrb"), `${lang["setting_hotkey_perk"]} [${settings["hotkey_perk"]}]`);
	tooltip(document.querySelector(".jorScrb"), `${lang["setting_hotkey_journal"]} [${settings["hotkey_journal"]}]`);
	tooltip(document.querySelector(".codScrb"), `${lang["setting_hotkey_codex"]} [${settings["hotkey_codex"]}]`);
	tooltip(document.querySelector(".escScrb"), `${lang["open_menu"]} [ESCAPE]`);
	tooltip(settingsTopbar.querySelector(".save"), lang["save_settings"]);
	tooltip(settingsTopbar.querySelector(".saveFile"), lang["save_settings_file"]);
	tooltip(settingsTopbar.querySelector(".loadFile"), lang["load_settings_file"]);
	player.updateAbilities();
	gotoSettingsMenu(true);
}

interface multiButtonPrompt_button {
	text: string;
	class: string;
	callback: () => void;
}

const multiButtonPromptWindow = document.querySelector<HTMLDivElement>(".multiButtonPrompt");
const multiButtonPromptText = multiButtonPromptWindow.querySelector<HTMLDivElement>(".prompt-text");
const multiButtonPromptButtons = multiButtonPromptWindow.querySelector<HTMLDivElement>(".prompt-buttons");
function multiButtonPrompt(text: string, buttons: multiButtonPrompt_button[]) {
	multiButtonPromptWindow.style.transform = "scale(1)";
	const translatedText = lang[text] || text;
	multiButtonPromptText.innerHTML = "";
	multiButtonPromptButtons.innerHTML = "";
	multiButtonPromptText.append(textSyntax(translatedText));
	for (const button of buttons) {
		const buttonElement = document.createElement("div");
		buttonElement.textContent = button.text;
		buttonElement.classList.add(button.class);
		buttonElement.addEventListener("click", button.callback);
		multiButtonPromptButtons.appendChild(buttonElement);
	}
}
function closeMultiButtonPrompt() {
	multiButtonPromptWindow.style.transform = "scale(0)";
	multiButtonPromptText.textContent = "";
	multiButtonPromptButtons.innerHTML = "";
}
