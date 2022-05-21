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
    const load: any = {};
    load.modItems = { path: `${modPath}/items.js`, func: applyModItems };
    load.modLocalisationGeneral = { path: `${modPath}/localisation/aa_localisation.js`, func: applyModLocalisationGeneral };
    load.modLocalisationCodex = { path: `${modPath}/localisation/codex_localisation.js`, func: applyModLocalisation };
    load.modLocalisationDialog = { path: `${modPath}/localisation/dialog_localisation.js`, func: applyModLocalisation };
    load.modLocalisationQuest = { path: `${modPath}/localisation/quest_localisation.js`, func: applyModLocalisation };
    const modConfig: ModInfo = await JSONmod.json();
    modsInformation.push(modConfig);
    Object.values(load).forEach(({ path, func }: any) => {
      loadModFile(path, mod, func);
    });
  });
  lang = eval(settings.language);
}

const namesFromPaths = {
  "items.js": ["items"],
  "aa_localisation.js": ["english", "finnish"],
  "codex_localisation.js": ["codexLang"],
  "dialog_localisation.js": ["dialogLang"],
  "quest_localisation.js": ["questLang"],

} as any;

const replacePaths = (path: string) => {
  const pathParts = path.split("/");
  const target = pathParts[pathParts.length - 1];
  return namesFromPaths[target];
};

async function loadModFile(path: string, modName: string, insertFunction: Function) {
  try {
    const toReplace = replacePaths(path);
    const file = await fetch(path);
    if (file.status === 404) return;
    let fileData = await file.text();
    toReplace.forEach((name: string) => {
      fileData = fileData.split(`${name}`).join(`${modName}_${name}`);
    });
    const script = document.createElement("script");
    script.innerHTML = fileData;
    document.head.appendChild(script);
    insertFunction(modName);
  } catch (error) {
    console.warn(`Failed loading file for mod: ${modName}`);
    console.log(error);
  }
}

function applyModItems(mod: string) {
  const itemsFromMod = eval(`${mod}_items`);
  Object.entries(itemsFromMod).forEach(([itemName, item]: any) => {
    items[itemName] = { ...item };
  });
}

function applyModLocalisationGeneral(mod: string) {
  let finLoc;
  let engLoc;
  try {
    finLoc = eval(`${mod}_finnish`);
    engLoc = eval(`${mod}_english`);
  }
  catch { }
  if (engLoc) {
    Object.entries(engLoc).forEach(([key, text]: any) => {
      english[key] = text;
    }
    );
  }
  if (finLoc) {
    Object.entries(finLoc).forEach(([key, text]: any) => {
      finnish[key] = text;
    }
    );
  }
}

function applyModLocalisation() {
  // TODO
}