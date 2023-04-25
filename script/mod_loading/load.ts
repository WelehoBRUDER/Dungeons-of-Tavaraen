interface ModInfo {
  [key: string]: any;
  name: string;
  description: string;
  maps: string[];
  author: string;
  version: string;
}
const modsInformation: Array<ModInfo> = [];
const modsSettings: any = JSON.parse(localStorage.getItem("DOT_mods_config")) ?? {};

const modsData: any = {
  folder: null,
  mods: [],
};

async function uploadModDirectory() {
  // @ts-expect-error
  modsData.directory = await getDirectory();
  const mods: any = {};
  modsData.directory.forEach((file: any) => {
    const modName = file.webkitRelativePath.split("/")[1];
    if (!mods[modName]) mods[modName] = [];
    mods[modName].push(file);
  });
  modsData.mods = mods;
}

async function loadMods() {
  console.log("called!");
  Object.entries(modsData.mods).forEach(async ([id, files]: any) => {
    if (modsSettings[id] === false) return;
    files.forEach(async (file: any) => {
      if (file.type !== "text/javascript") return;
      let fileData = await file.text();
      if (namesFromPaths[file.name]) {
        namesFromPaths[file.name].forEach((name: string) => {
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

function loadMaps(maps: string[], modPath: string, mod: string) {
  return Promise.all(
    maps.map(async (map: string) => {
      await loadModMapFile(`${modPath}/maps/${map}.js`, mod, map);
    })
  );
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
    await insertFunction(modName);
  } catch (error) {
    console.warn(`Failed loading file for mod: ${modName}`);
    console.log(error);
  }
}

function parseModScript(id: string, file: string, dir: string) {
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

function applyModItems(mod: string) {
  const itemsFromMod = eval(`${mod}_items`);
  Object.entries(itemsFromMod).forEach(([itemName, item]: any) => {
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

function applyModEnemies(mod: string) {
  const enemiesFromMod = eval(`${mod}_enemies`);
  Object.entries(enemiesFromMod).forEach(([enemyName, enemy]: any) => {
    let src = enemy.img;
    if (src.startsWith("/")) {
      src = `/mods/${mod}${src}`;
    }
    enemies[enemyName] = { ...enemy, img: src };
  });
}

function applyModAbilities(mod: string) {
  const abilitiesFromMod = eval(`${mod}_abilities`);
  Object.entries(abilitiesFromMod).forEach(([abilityName, ability]: any) => {
    let src = ability.img;
    if (src.startsWith("/")) {
      src = `/mods/${mod}${src}`;
    }
    abilities[abilityName] = { ...ability, icon: src };
  });
}
function applyModStatEffects(mod: string) {
  const effectsFromMods = eval(`${mod}_statusEffects`);
  Object.entries(effectsFromMods).forEach(([effectName, effect]: any) => {
    statusEffects[effectName] = { ...effect };
  });
}
function applyModTraits(mod: string) {
  const traitsFromMod = eval(`${mod}_traits`);
  Object.entries(traitsFromMod).forEach(([traitName, trait]: any) => {
    traits[traitName] = { ...trait };
  });
}

function applyModLocalisationGeneral(mod: string) {
  let finLoc;
  let engLoc;
  try {
    finLoc = eval(`${mod}_finnish`);
  } catch {}
  try {
    engLoc = eval(`${mod}_english`);
  } catch {}
  if (engLoc) {
    Object.entries(engLoc).forEach(([key, text]: any) => {
      english[key] = text;
    });
  }
  if (finLoc) {
    Object.entries(finLoc).forEach(([key, text]: any) => {
      finnish[key] = text;
    });
  }
}

function applyModLocalisation(mod: string) {
  let codexMod, dialogMod, questMod;
  try {
    codexMod = eval(`${mod}_codexLang`);
  } catch {}
  try {
    dialogMod = eval(`${mod}_dialogLang`);
  } catch {}
  try {
    questMod = eval(`${mod}_questLang`);
  } catch {}
  if (codexMod) {
    Object.entries(codexMod).forEach(([key, text]: any) => {
      codexLang[key] = text;
    });
  }
  if (dialogMod) {
    Object.entries(dialogMod).forEach(([key, text]: any) => {
      dialogLang[key] = text;
    });
  }
  if (questMod) {
    Object.entries(questMod).forEach(([key, text]: any) => {
      questLang[key] = text;
    });
  }
}

function applyModFlags(mod: string) {
  const flagsFromMod = eval(`${mod}_flags`);
  flags.concat(flagsFromMod);
}

function applyModCharacters(mod: string) {
  let modChars, modInvs;
  try {
    modChars = eval(`${mod}_NPCcharacters`);
  } catch {}
  try {
    modInvs = eval(`${mod}_NPCInventories`);
  } catch {}
  if (modChars) {
    Object.entries(modChars).forEach(([key, char]: any) => {
      NPCcharacters[key] = { ...char };
    });
  }
  if (modInvs) {
    Object.entries(modInvs).forEach(([key, inv]: any) => {
      NPCInventories[key] = { ...inv };
    });
  }
}

function applyModInteractions(mod: string) {
  const interactionsFromMod = eval(`${mod}_characterInteractions`);
  Object.entries(interactionsFromMod).forEach(([key, interaction]: any) => {
    characterInteractions[key] = { ...interaction };
  });
}

async function loadModMapFile(path: string, mod: string, id: string) {
  const file = await fetch(path);
  if (file.status === 404) return;
  let fileData = await file.text();
  fileData = fileData.split(`${id}`).join(`${mod}_${id}`);
  const script = document.createElement("script");
  script.innerHTML = fileData;
  document.head.appendChild(script);
  Promise.resolve("ok");
}

const replace_in_map: any = {
  enemies: true,
  treasureChests: true,
  messages: true,
  shrines: true,
  entrances: true,
};

function applyModMap(mod: string, map: string) {
  let mod_map: any;
  try {
    mod_map = eval(`${mod}_${map}`);
  } catch (err) {
    console.error(err);
  }
  if (mod_map) {
    if (!mod_map.DONT_REPLACE_EXISTING) {
      maps[map] = { ...mod_map };
    } else {
      Object.entries(mod_map).forEach(([key, data]: [string, any]) => {
        if (!maps[map][key]) {
          maps[map][key] = data;
        } else if (replace_in_map[key]) {
          if (mod_map["DONT_REPLACE_" + key.toUpperCase()]) {
            data.forEach((obj: any) => {
              maps[map][key].push(obj);
            });
          } else {
            maps[map][key] = data;
          }
        } else {
          maps[map][key] = data;
        }
      });
    }
  }
}
