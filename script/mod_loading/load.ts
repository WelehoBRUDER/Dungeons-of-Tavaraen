interface ModInfo {
  name: string;
  description: string;
  author: string;
  version: string;
};
const modsInformation: Array<ModInfo> = [];

async function loadMods() {
  const JSONdata = await fetch("../../mods_config.json");
  const modsConfig = await JSONdata.json();
  const list = modsConfig.list;
  list.forEach(async (mod: string) => {
    const modPath = `../../mods/${mod}`;
    const JSONmod = await fetch(`${modPath}/mod.json`);
    const modItems = `${modPath}/items.js`;
    const modConfig: ModInfo = await JSONmod.json();
    console.log(`Loading mod: ${mod}`);
    console.log(`Name: ${modConfig.name}`);
    console.log(`Author: ${modConfig.author}`);
    console.log(`Version: ${modConfig.version}`);
    console.log(`Description: ${modConfig.description}`);
    modsInformation.push(modConfig);
    loadModFile(modItems, mod, applyModItems);
  });
}

async function loadModFile(path: string, modName: string, insertFunction: Function) {
  try {
    const itemsFile = await fetch(path);
    let itemsFileData = await itemsFile.text();
    itemsFileData = itemsFileData.replace("items", `${modName}_items`);
    const script = document.createElement("script");
    script.innerHTML = itemsFileData;
    document.head.appendChild(script);
    insertFunction(modName);
  } catch (error) {
    console.log(`Failed loading file for mod: ${modName}`);
  }
}

function applyModItems(mod: string) {
  const itemsFromMod = eval(`${mod}_items`);
  Object.entries(itemsFromMod).forEach(([itemName, item]: any) => {
    items[itemName] = { ...item };
  });
}