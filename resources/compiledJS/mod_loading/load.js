"use strict";
var _a;
const modsInformation = [];
const modsSettings = (_a = JSON.parse(localStorage.getItem("DOT_game_mods"))) !== null && _a !== void 0 ? _a : {};
const modsData = {
    folder: null,
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
}
async function loadMods() {
    // total rework
    //openModsMenu();
    // const JSONdata = await fetch("mods_config.json");
    // const modsConfig = await JSONdata.json();
    // const list = modsConfig.list;
    // list.forEach(async (mod: string) => {
    //   const modPath = `/mods/${mod}`;
    //   const JSONmod = await fetch(`${modPath}/mod.json`);
    //   const load: any = {};
    //   const modConfig: ModInfo = await JSONmod.json();
    //   mod = mod.replace(/\s|-/g, "_");
    //   modConfig.key = mod;
    //   modsInformation.push(modConfig);
    //   if (modsSettings?.[mod] === false) return;
    //   load.modItems = { path: `${modPath}/items.js`, func: applyModItems };
    //   load.modEnemies = { path: `${modPath}/enemies.js`, func: applyModEnemies };
    //   load.modAbilities = { path: `${modPath}/abilities.js`, func: applyModAbilities };
    //   load.modStatEffects = { path: `${modPath}/status_effects.js`, func: applyModStatEffects };
    //   load.modTraits = { path: `${modPath}/traits.js`, func: applyModTraits };
    //   load.modFlags = { path: `${modPath}/flags.js`, func: applyModFlags };
    //   load.modCharacters = { path: `${modPath}/characters.js`, func: applyModCharacters };
    //   load.modInteractions = { path: `${modPath}/character_interactions.js`, func: applyModInteractions };
    //   load.modLocalisationGeneral = { path: `${modPath}/localisation/aa_localisation.js`, func: applyModLocalisationGeneral };
    //   load.modLocalisationCodex = { path: `${modPath}/localisation/codex_localisation.js`, func: applyModLocalisation };
    //   load.modLocalisationDialog = { path: `${modPath}/localisation/dialog_localisation.js`, func: applyModLocalisation };
    //   load.modLocalisationQuest = { path: `${modPath}/localisation/quest_localisation.js`, func: applyModLocalisation };
    //   Object.values(load).forEach(async ({ path, func }: any) => {
    //     await loadModFile(path, mod, func);
    //   });
    //   if (modConfig.maps) {
    //     loadMaps(modConfig.maps, modPath, mod).then(() => {
    //       applyModMaps(mod, modConfig.maps);
    //     });
    //   }
    // });
    // lang = eval(settings.language);
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
function applyModItems(mod) {
    const itemsFromMod = eval(`${mod}_items`);
    Object.entries(itemsFromMod).forEach(([itemName, item]) => {
        let src = item.img;
        if (src.startsWith("/")) {
            src = `../../mods/${mod}${src}`;
        }
        let src2 = item.sprite;
        if (src2.startsWith("/")) {
            src2 = `../../mods/${mod}${src2}`;
        }
        items[itemName] = { ...item, img: src, sprite: src2 };
    });
}
function applyModEnemies(mod) {
    const enemiesFromMod = eval(`${mod}_enemies`);
    Object.entries(enemiesFromMod).forEach(([enemyName, enemy]) => {
        let src = enemy.img;
        if (src.startsWith("/")) {
            src = `../../mods/${mod}${src}`;
        }
        enemies[enemyName] = { ...enemy, img: src };
    });
}
function applyModAbilities(mod) {
    const abilitiesFromMod = eval(`${mod}_abilities`);
    Object.entries(abilitiesFromMod).forEach(([abilityName, ability]) => {
        let src = ability.img;
        if (src.startsWith("/")) {
            src = `../../mods/${mod}${src}`;
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
    catch (_a) { }
    try {
        engLoc = eval(`${mod}_english`);
    }
    catch (_b) { }
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
    catch (_a) { }
    try {
        dialogMod = eval(`${mod}_dialogLang`);
    }
    catch (_b) { }
    try {
        questMod = eval(`${mod}_questLang`);
    }
    catch (_c) { }
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
    catch (_a) { }
    try {
        modInvs = eval(`${mod}_NPCInventories`);
    }
    catch (_b) { }
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
function applyModMaps(mod, maps_array) {
    maps_array.forEach((map) => {
        let mod_map;
        try {
            mod_map = eval(`${mod}_${map}`);
        }
        catch (err) {
            console.log(err);
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
    });
}
//# sourceMappingURL=load.js.map