"use strict";
const menuOptions = [
    {
        id: "menu_resume",
        action: () => handleEscape()
    },
    {
        id: "menu_options",
        action: () => gotoSettingsMenu()
    },
    {
        id: "menu_main_screen",
        action: () => gotoMainMenu()
    }
];
const mainButtons = [
    {
        id: "menu_resume",
        action: () => closeGameMenu(false, true)
    },
    {
        id: "menu_new_game",
    },
    {
        id: "menu_load_game",
    },
    {
        id: "menu_options",
        action: () => gotoSettingsMenu(true)
    },
];
const menuSettings = [
    {
        id: "setting_log_enemy_movement",
        type: "toggle",
    },
    {
        id: "setting_test",
        type: "toggle",
    },
    {
        id: "setting_test",
        type: "toggle",
    },
    {
        id: "setting_test",
        type: "toggle",
    },
    {
        id: "setting_test",
        type: "toggle",
    },
    {
        id: "setting_test",
        type: "toggle",
    },
    {
        id: "setting_test",
        type: "toggle",
    },
    {
        id: "setting_test",
        type: "toggle",
    },
    {
        id: "setting_test",
        type: "toggle",
    },
    {
        id: "setting_game_language",
        type: "languageSelection"
    }
];
const languages = ["english", "finnish"];
const mainMenu = document.querySelector(".mainMenu");
const menu = document.querySelector(".gameMenu");
const dim = document.querySelector(".dim");
const mainMenuButtons = mainMenu.querySelector(".menuButtons");
async function openGameMenu() {
    var _a;
    menu.textContent = "";
    setTimeout(() => { dim.style.height = "100%"; }, 150);
    for (let button of menuOptions) {
        await sleep(150);
        const frame = document.createElement("div");
        frame.textContent = (_a = lang[button.id]) !== null && _a !== void 0 ? _a : button.id;
        frame.classList.add("menuButton");
        frame.classList.add(button.id);
        frame.style.animationName = "popIn";
        if (button.action) {
            frame.addEventListener("click", () => button.action());
        }
        menu.append(frame);
    }
}
async function closeGameMenu(noDim = false, escape = false) {
    const reverseOptions = [...menuOptions].reverse();
    if (!noDim) {
        setTimeout(() => { dim.style.height = "0%"; }, 150);
        const settingsBackground = document.querySelector(".settingsMenu");
        settingsBackground.textContent = "";
    }
    setTimeout(() => { mainMenu.style.display = "none"; }, 575);
    mainMenu.style.opacity = "0";
    for (let button of reverseOptions) {
        try {
            await sleep(150);
            const frame = menu.querySelector(`.${button.id}`);
            frame.style.animationName = "popOut";
            setTimeout(() => { frame.remove(); }, 175);
        }
        catch (_a) { }
    }
    if (escape)
        handleEscape();
}
async function gotoSettingsMenu(inMainMenu = false) {
    var _a, _b;
    if (!inMainMenu)
        closeGameMenu(true);
    const settingsBackground = document.querySelector(".settingsMenu");
    settingsBackground.textContent = "";
    for (let setting of menuSettings) {
        await sleep(75);
        const container = document.createElement("div");
        if (setting.type == "toggle") {
            container.classList.add("toggle");
            const text = document.createElement("p");
            const toggleBox = document.createElement("div");
            text.textContent = (_a = lang[setting.id]) !== null && _a !== void 0 ? _a : setting.id;
            let _setting = setting.id.replace("setting_", "");
            if (settings[_setting])
                toggleBox.textContent = "X";
            else
                toggleBox.textContent = "";
            container.addEventListener("click", tog => {
                settings[_setting] = !settings[_setting];
                if (settings[_setting])
                    toggleBox.textContent = "X";
                else
                    toggleBox.textContent = "";
            });
            container.append(text, toggleBox);
            settingsBackground.append(container);
        }
        else if (setting.type == "languageSelection") {
            container.classList.add("languageSelection");
            const text = document.createElement("p");
            text.textContent = (_b = lang[setting.id]) !== null && _b !== void 0 ? _b : setting.id;
            container.append(text);
            languages.forEach((language) => {
                const langButton = document.createElement("div");
                langButton.textContent = lang[language];
                if (language == lang["language_id"])
                    langButton.classList.add("selectedLang");
                langButton.addEventListener("click", () => {
                    container.childNodes.forEach((child) => {
                        try {
                            child.classList.remove("selectedLang");
                        }
                        catch (_a) { }
                    });
                    lang = eval(language);
                    player.updateAbilities();
                    gotoSettingsMenu(true);
                });
                container.append(langButton);
            });
            settingsBackground.append(container);
        }
    }
}
async function gotoMainMenu() {
    var _a;
    menu.textContent = "";
    setTimeout(() => { dim.style.height = "0%"; }, 150);
    mainMenu.style.display = "block";
    await sleep(20);
    mainMenu.style.opacity = "1";
    mainMenuButtons.textContent = "";
    for (let button of mainButtons) {
        await sleep(200);
        const frame = document.createElement("div");
        frame.textContent = (_a = lang[button.id]) !== null && _a !== void 0 ? _a : button.id;
        frame.classList.add("menuButton");
        frame.classList.add(button.id);
        frame.style.animationName = "slideFromRight";
        if (button.action) {
            frame.addEventListener("click", () => button.action());
        }
        mainMenuButtons.append(frame);
    }
}
//# sourceMappingURL=menu.js.map