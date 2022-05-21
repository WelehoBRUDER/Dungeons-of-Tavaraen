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
        const modItems = `${modPath}/items.js`;
        const modConfig = await JSONmod.json();
        console.log(`Loading mod: ${mod}`);
        console.log(`Name: ${modConfig.name}`);
        console.log(`Author: ${modConfig.author}`);
        console.log(`Version: ${modConfig.version}`);
        console.log(`Description: ${modConfig.description}`);
        modsInformation.push(modConfig);
        loadModFile(modItems, mod, applyModItems);
    });
}
async function loadModFile(path, modName, insertFunction) {
    try {
        const itemsFile = await fetch(path);
        let itemsFileData = await itemsFile.text();
        itemsFileData = itemsFileData.replace("items", `${modName}_items`);
        const script = document.createElement("script");
        script.innerHTML = itemsFileData;
        document.head.appendChild(script);
        insertFunction(modName);
    }
    catch (error) {
        console.log(`Failed loading file for mod: ${modName}`);
    }
}
function applyModItems(mod) {
    const itemsFromMod = eval(`${mod}_items`);
    Object.entries(itemsFromMod).forEach(([itemName, item]) => {
        items[itemName] = Object.assign({}, item);
    });
}
//# sourceMappingURL=load.js.map