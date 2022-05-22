"use strict";
;
const modsInformation = [];
async function loadMods() {
    const JSONdata = await fetch("../../mods_config.json");
    const modsConfig = await JSONdata.json();
    const list = modsConfig.list;
    list.forEach(async (mod) => {
        const modPath = `../../mods/${mod}`;
        const JSONmod = await fetch(`${modPath}/mod.json`);
        const load = {};
        load.modItems = { path: `${modPath}/items.js`, func: applyModItems };
        load.modEnemies = { path: `${modPath}/enemies.js`, func: applyModEnemies };
        load.modAbilities = { path: `${modPath}/abilities.js`, func: applyModAbilities };
        load.modStatEffects = { path: `${modPath}/status_effects.js`, func: applyModStatEffects };
        load.modTraits = { path: `${modPath}/traits.js`, func: applyModTraits };
        load.modLocalisationGeneral = { path: `${modPath}/localisation/aa_localisation.js`, func: applyModLocalisationGeneral };
        load.modLocalisationCodex = { path: `${modPath}/localisation/codex_localisation.js`, func: applyModLocalisation };
        load.modLocalisationDialog = { path: `${modPath}/localisation/dialog_localisation.js`, func: applyModLocalisation };
        load.modLocalisationQuest = { path: `${modPath}/localisation/quest_localisation.js`, func: applyModLocalisation };
        const modConfig = await JSONmod.json();
        modsInformation.push(modConfig);
        Object.values(load).forEach(({ path, func }) => {
            loadModFile(path, mod, func);
        });
    });
    loadTextures();
    lang = eval(settings.language);
}
const namesFromPaths = {
    "items.js": ["items"],
    "enemies.js": ["enemies"],
    "abilities.js": ["abilities"],
    "status_effects.js": ["statusEffects"],
    "traits.js": ["traits"],
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
        insertFunction(modName);
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
        items[itemName] = Object.assign(Object.assign({}, item), { img: src });
    });
}
function applyModEnemies(mod) {
    const enemiesFromMod = eval(`${mod}_enemies`);
    Object.entries(enemiesFromMod).forEach(([enemyName, enemy]) => {
        let src = enemy.img;
        if (src.startsWith("/")) {
            src = `../../mods/${mod}${src}`;
        }
        enemies[enemyName] = Object.assign(Object.assign({}, enemy), { img: src });
    });
}
function applyModAbilities(mod) {
    const abilitiesFromMod = eval(`${mod}_abilities`);
    Object.entries(abilitiesFromMod).forEach(([abilityName, ability]) => {
        let src = ability.img;
        if (src.startsWith("/")) {
            src = `../../mods/${mod}${src}`;
        }
        abilities[abilityName] = Object.assign(Object.assign({}, ability), { icon: src });
    });
}
function applyModStatEffects(mod) {
    const effectsFromMods = eval(`${mod}_statusEffects`);
    Object.entries(effectsFromMods).forEach(([effectName, effect]) => {
        statusEffects[effectName] = Object.assign({}, effect);
    });
}
function applyModTraits(mod) {
    const traitsFromMod = eval(`${mod}_traits`);
    Object.entries(traitsFromMod).forEach(([traitName, trait]) => {
        traits[traitName] = Object.assign({}, trait);
    });
}
function applyModLocalisationGeneral(mod) {
    let finLoc;
    let engLoc;
    try {
        finLoc = eval(`${mod}_finnish`);
        engLoc = eval(`${mod}_english`);
    }
    catch (_a) { }
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
        dialogMod = eval(`${mod}_dialogLang`);
        questMod = eval(`${mod}_questLang`);
    }
    catch (_a) { }
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
//# sourceMappingURL=load.js.map