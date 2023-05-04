"use strict";
const modsInformation = [];
const modsSettings = JSON.parse(localStorage.getItem("DOT_mods_config")) ?? {};
const modsData = {
    directory: null,
    mods: [],
};
async function uploadModDirectory() {
    // @ts-expect-error
    modsData.directory = await getDirectory();
    const mods = {};
    modsData.directory.forEach((file) => {
        const modName = file.webkitRelativePath.split("/")[1];
        if (!mods[modName])
            mods[modName] = [];
        mods[modName].push(file);
    });
    modsData.mods = mods;
    console.log(JSON.stringify(modsData));
}
async function loadMods() {
    console.log("called!");
    Object.entries(modsData.mods).forEach(async ([id, files]) => {
        if (modsSettings[id] === false)
            return;
        files.forEach(async (file) => {
            if (file.type !== "text/javascript")
                return;
            let fileData = await file.text();
            if (namesFromPaths[file.name]) {
                namesFromPaths[file.name].forEach((name) => {
                    fileData = fileData.split(`${name}`).join(`${id}_${name}`);
                });
            }
            if (file.directoryHandle.name === "maps") {
                fileData = fileData.split(`${file.name.split(".")[0]}`).join(`${id}_${file.name.split(".")[0]}`);
            }
            const script = document.createElement("script");
            script.innerHTML = fileData;
            document.head.appendChild(script);
            parseModScript(id, file.name, file.directoryHandle.name);
        });
    });
    lang = eval(settings.language);
    continueLoad();
}
function loadMaps(maps, modPath, mod) {
    return Promise.all(maps.map(async (map) => {
        await loadModMapFile(`${modPath}/maps/${map}.js`, mod, map);
    }));
}
const namesFromPaths = {
    "items.js": ["items"],
    "enemies.js": ["enemies"],
    "abilities.js": ["abilities"],
    "status_effects.js": ["statusEffects"],
    "traits.js": ["traits"],
    "flags.js": ["flags"],
    "characters.js": ["NPCcharacters", "NPCInventories"],
    "character_interactions.js": ["characterInteractions"],
    "aa_localisation.js": ["english", "finnish"],
    "codex_localisation.js": ["codexLang"],
    "dialog_localisation.js": ["dialogLang"],
    "quest_localisation.js": ["questLang"],
};
const replacePaths = (path) => {
    const pathParts = path.split("/");
    const target = pathParts[pathParts.length - 1];
    return namesFromPaths[target];
};
async function loadModFile(path, modName, insertFunction) {
    try {
        const toReplace = replacePaths(path);
        const file = await fetch(path);
        if (file.status === 404)
            return;
        let fileData = await file.text();
        toReplace.forEach((name) => {
            fileData = fileData.split(`${name}`).join(`${modName}_${name}`);
        });
        const script = document.createElement("script");
        script.innerHTML = fileData;
        document.head.appendChild(script);
        await insertFunction(modName);
    }
    catch (error) {
        console.warn(`Failed loading file for mod: ${modName}`);
        console.log(error);
    }
}
function parseModScript(id, file, dir) {
    if (dir === "maps") {
        return applyModMap(id, file.split(".")[0]);
    }
    switch (file) {
        case "items.js":
            applyModItems(id);
            break;
        case "enemies.js":
            applyModEnemies(id);
            break;
        case "abilities.js":
            applyModAbilities(id);
            break;
        case "status_effects.js":
            applyModStatEffects(id);
            break;
        case "traits.js":
            applyModTraits(id);
            break;
        case "flags.js":
            applyModFlags(id);
            break;
        case "characters.js":
            applyModCharacters(id);
            break;
        case "character_interactions.js":
            applyModInteractions(id);
            break;
        case "aa_localisation.js":
            applyModLocalisationGeneral(id);
            break;
        case "codex_localisation.js":
            applyModLocalisation(id);
            break;
        case "dialog_localisation.js":
            applyModLocalisation(id);
            break;
        case "quest_localisation.js":
            applyModLocalisation(id);
            break;
    }
}
function applyModItems(mod) {
    const itemsFromMod = eval(`${mod}_items`);
    Object.entries(itemsFromMod).forEach(([itemName, item]) => {
        let src = item.img;
        if (src.startsWith("/")) {
            src = `/mods/${mod}${src}`;
        }
        let src2 = item.sprite;
        if (src2.startsWith("/")) {
            src2 = `/mods/${mod}${src2}`;
        }
        items[itemName] = { ...item, img: src, sprite: src2 };
    });
}
function applyModEnemies(mod) {
    const enemiesFromMod = eval(`${mod}_enemies`);
    Object.entries(enemiesFromMod).forEach(([enemyName, enemy]) => {
        let src = enemy.img;
        if (src.startsWith("/")) {
            src = `/mods/${mod}${src}`;
        }
        enemies[enemyName] = { ...enemy, img: src };
    });
}
function applyModAbilities(mod) {
    const abilitiesFromMod = eval(`${mod}_abilities`);
    Object.entries(abilitiesFromMod).forEach(([abilityName, ability]) => {
        let src = ability.img;
        if (src.startsWith("/")) {
            src = `/mods/${mod}${src}`;
        }
        abilities[abilityName] = { ...ability, icon: src };
    });
}
function applyModStatEffects(mod) {
    const effectsFromMods = eval(`${mod}_statusEffects`);
    Object.entries(effectsFromMods).forEach(([effectName, effect]) => {
        statusEffects[effectName] = { ...effect };
    });
}
function applyModTraits(mod) {
    const traitsFromMod = eval(`${mod}_traits`);
    Object.entries(traitsFromMod).forEach(([traitName, trait]) => {
        traits[traitName] = { ...trait };
    });
}
function applyModLocalisationGeneral(mod) {
    let finLoc;
    let engLoc;
    try {
        finLoc = eval(`${mod}_finnish`);
    }
    catch { }
    try {
        engLoc = eval(`${mod}_english`);
    }
    catch { }
    if (engLoc) {
        Object.entries(engLoc).forEach(([key, text]) => {
            english[key] = text;
        });
    }
    if (finLoc) {
        Object.entries(finLoc).forEach(([key, text]) => {
            finnish[key] = text;
        });
    }
}
function applyModLocalisation(mod) {
    let codexMod, dialogMod, questMod;
    try {
        codexMod = eval(`${mod}_codexLang`);
    }
    catch { }
    try {
        dialogMod = eval(`${mod}_dialogLang`);
    }
    catch { }
    try {
        questMod = eval(`${mod}_questLang`);
    }
    catch { }
    if (codexMod) {
        Object.entries(codexMod).forEach(([key, text]) => {
            codexLang[key] = text;
        });
    }
    if (dialogMod) {
        Object.entries(dialogMod).forEach(([key, text]) => {
            dialogLang[key] = text;
        });
    }
    if (questMod) {
        Object.entries(questMod).forEach(([key, text]) => {
            questLang[key] = text;
        });
    }
}
function applyModFlags(mod) {
    const flagsFromMod = eval(`${mod}_flags`);
    flags.concat(flagsFromMod);
}
function applyModCharacters(mod) {
    let modChars, modInvs;
    try {
        modChars = eval(`${mod}_NPCcharacters`);
    }
    catch { }
    try {
        modInvs = eval(`${mod}_NPCInventories`);
    }
    catch { }
    if (modChars) {
        Object.entries(modChars).forEach(([key, char]) => {
            NPCcharacters[key] = { ...char };
        });
    }
    if (modInvs) {
        Object.entries(modInvs).forEach(([key, inv]) => {
            NPCInventories[key] = { ...inv };
        });
    }
}
function applyModInteractions(mod) {
    const interactionsFromMod = eval(`${mod}_characterInteractions`);
    Object.entries(interactionsFromMod).forEach(([key, interaction]) => {
        characterInteractions[key] = { ...interaction };
    });
}
async function loadModMapFile(path, mod, id) {
    const file = await fetch(path);
    if (file.status === 404)
        return;
    let fileData = await file.text();
    fileData = fileData.split(`${id}`).join(`${mod}_${id}`);
    const script = document.createElement("script");
    script.innerHTML = fileData;
    document.head.appendChild(script);
    Promise.resolve("ok");
}
const replace_in_map = {
    enemies: true,
    treasureChests: true,
    messages: true,
    shrines: true,
    entrances: true,
};
function applyModMap(mod, map) {
    let mod_map;
    try {
        mod_map = eval(`${mod}_${map}`);
    }
    catch (err) {
        console.error(err);
    }
    if (mod_map) {
        if (!mod_map.DONT_REPLACE_EXISTING) {
            maps[map] = { ...mod_map };
        }
        else {
            Object.entries(mod_map).forEach(([key, data]) => {
                if (!maps[map][key]) {
                    maps[map][key] = data;
                }
                else if (replace_in_map[key]) {
                    if (mod_map["DONT_REPLACE_" + key.toUpperCase()]) {
                        data.forEach((obj) => {
                            maps[map][key].push(obj);
                        });
                    }
                    else {
                        maps[map][key] = data;
                    }
                }
                else {
                    maps[map][key] = data;
                }
            });
        }
    }
}
//# sourceMappingURL=load.js.map