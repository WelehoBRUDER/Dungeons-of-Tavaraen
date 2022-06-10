interface ModInfo {
  [key: string]: string;
  name: string;
  description: string;
  author: string;
  version: string;
};
const modsInformation: Array<ModInfo> = [];
const modsSettings: any = JSON.parse(localStorage.getItem("DOT_game_mods")) ?? {};

async function loadMods() {
  const JSONdata = await fetch("mods_config.json");
  const modsConfig = await JSONdata.json();
  const list = modsConfig.list;
  list.forEach(async (mod: string) => {
    const modPath = `../../mods/${mod}`;
    const JSONmod = await fetch(`${modPath}/mod.json`);
    const load: any = {};
    const modConfig: ModInfo = await JSONmod.json();
    mod = mod.replace(/\s|-/g, "_");
    modConfig.key = mod;
    modsInformation.push(modConfig);
    if (modsSettings?.[mod] === false) return;
    load.modItems = { path: `${modPath}/items.js`, func: applyModItems };
    load.modEnemies = { path: `${modPath}/enemies.js`, func: applyModEnemies };
    load.modAbilities = { path: `${modPath}/abilities.js`, func: applyModAbilities };
    load.modStatEffects = { path: `${modPath}/status_effects.js`, func: applyModStatEffects };
    load.modTraits = { path: `${modPath}/traits.js`, func: applyModTraits };
    load.modFlags = { path: `${modPath}/flags.js`, func: applyModFlags };
    load.modCharacters = { path: `${modPath}/characters.js`, func: applyModCharacters };
    load.modInteractions = { path: `${modPath}/character_interactions.js`, func: applyModInteractions };
    load.modLocalisationGeneral = { path: `${modPath}/localisation/aa_localisation.js`, func: applyModLocalisationGeneral };
    load.modLocalisationCodex = { path: `${modPath}/localisation/codex_localisation.js`, func: applyModLocalisation };
    load.modLocalisationDialog = { path: `${modPath}/localisation/dialog_localisation.js`, func: applyModLocalisation };
    load.modLocalisationQuest = { path: `${modPath}/localisation/quest_localisation.js`, func: applyModLocalisation };
    Object.values(load).forEach(async ({ path, func }: any) => {
      await loadModFile(path, mod, func);
    });
    if (modConfig.maps) {
      // @ts-ignore
      loadMaps(modConfig.maps, modPath, mod).then(() => {
        // @ts-ignore
        applyModMaps(mod, modConfig.maps);
      });
    }
  });
  lang = eval(settings.language);
}

function loadMaps(maps: string[], modPath: string, mod: string) {
  return Promise.all(maps.map(async (map: string) => {
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

function applyModItems(mod: string) {
  const itemsFromMod = eval(`${mod}_items`);
  Object.entries(itemsFromMod).forEach(([itemName, item]: any) => {
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

function applyModEnemies(mod: string) {
  const enemiesFromMod = eval(`${mod}_enemies`);
  Object.entries(enemiesFromMod).forEach(([enemyName, enemy]: any) => {
    let src = enemy.img;
    if (src.startsWith("/")) {
      src = `../../mods/${mod}${src}`;
    }
    enemies[enemyName] = { ...enemy, img: src };
  });
}

function applyModAbilities(mod: string) {
  const abilitiesFromMod = eval(`${mod}_abilities`);
  Object.entries(abilitiesFromMod).forEach(([abilityName, ability]: any) => {
    let src = ability.img;
    if (src.startsWith("/")) {
      src = `../../mods/${mod}${src}`;
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
  try { finLoc = eval(`${mod}_finnish`); } catch { }
  try { engLoc = eval(`${mod}_english`); } catch { }
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

function applyModLocalisation(mod: string) {
  let codexMod, dialogMod, questMod;
  try { codexMod = eval(`${mod}_codexLang`); } catch { }
  try { dialogMod = eval(`${mod}_dialogLang`); } catch { }
  try { questMod = eval(`${mod}_questLang`); } catch { }
  if (codexMod) {
    Object.entries(codexMod).forEach(([key, text]: any) => {
      codexLang[key] = text;
    }
    );
  }
  if (dialogMod) {
    Object.entries(dialogMod).forEach(([key, text]: any) => {
      dialogLang[key] = text;
    }
    );
  }
  if (questMod) {
    Object.entries(questMod).forEach(([key, text]: any) => {
      questLang[key] = text;
    }
    );
  }
}

function applyModFlags(mod: string) {
  const flagsFromMod = eval(`${mod}_flags`);
  flags.concat(flagsFromMod);
}

function applyModCharacters(mod: string) {
  let modChars, modInvs;
  try { modChars = eval(`${mod}_NPCcharacters`); } catch { }
  try { modInvs = eval(`${mod}_NPCInventories`); } catch { }
  if (modChars) {
    Object.entries(modChars).forEach(([key, char]: any) => {
      NPCcharacters[key] = { ...char };
    }
    );
  }
  if (modInvs) {
    Object.entries(modInvs).forEach(([key, inv]: any) => {
      NPCInventories[key] = { ...inv };
    }
    );
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
  entrances: true
};

function applyModMaps(mod: string, maps_array: string[]) {
  maps_array.forEach((map: string) => {
    let mod_map: any;
    try { mod_map = eval(`${mod}_${map}`); } catch (err) { console.log(err); }
    if (mod_map) {
      if (!mod_map.DONT_REPLACE_EXISTING) {
        maps[map] = { ...mod_map };
      }
      else {
        Object.entries(mod_map).forEach(([key, data]: [string, any]) => {
          if (!maps[map][key]) {
            maps[map][key] = data;
          }
          else if (replace_in_map[key]) {
            if (mod_map["DONT_REPLACE_" + key.toUpperCase()]) {
              data.forEach((obj: any) => {
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

