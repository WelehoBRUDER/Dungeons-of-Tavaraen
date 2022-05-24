// THIS FILE CONTAINS THE LOGIC FOR FRIENDLY CHARACTERS //

// Returns flag by searching with string.
function getFlag(str: string) {
  str = str.toLowerCase();
  return flags.find((flag: any) => flag.toLowerCase() == str) ?? -1;
}
// Either sets a flag to specified value, or modifies it.
// If override is enabled, value is replaced instead of modified.
// Boolean values can't be modified and will instead always be replaced (duh).
function setFlag(str: string, value: any, override: boolean = false) {
  let flag = getFlag(str);
  if (flag != -1) {
    if (player.flags?.[flag]) {
      if (override) player.flags[flag] = value;
      else {
        if (typeof value == "number") {
          if (typeof player.flags[flag] !== "number") player.flags[flag] = 0;
          player.flags[flag] += value;
        }
        else {
          player.flags[flag] = value;
        }
      }
    }
    else {
      console.log("adding new flag!");
      player.flags[flag] = value;
    }
  }
}

class Npc {
  [id: string]: any;
  sprite: string;
  img: string;
  greeting: string;
  pronounSet: string;
  currentMap: number;
  currentCords: tileObject;
  conditionalMaps: any;
  conditionalCords: any;
  constructor(base: Npc) {
    this.id = base.id;
    this.sprite = base.sprite;
    this.img = base.img;
    this.greeting = base.greeting;
    this.pronounSet = base.pronounSet;
    this.currentMap = base.currentMap;
    this.currentCords = { ...base.currentCords };
    this.conditionalMaps = base.conditionalMaps;
    this.conditionalCords = base.conditionalCords;
  }
}

function talkToCharacter() {
  if (state.dialogWindow || state.inCombat) return;
  NPCcharacters.some((npc: Npc) => {
    let dist = calcDistance(player.cords.x, player.cords.y, npc.currentCords.x, npc.currentCords.y);
    if (dist < 3) {
      state.dialogWindow = true;
      createDialogWindow(npc);
    }
  });
}

const dialogWindow: HTMLDivElement = document.querySelector(".dialogWindow");
const dialogCharName: HTMLParagraphElement = dialogWindow.querySelector(".dialogCharName");
const dialogText: HTMLDivElement = dialogWindow.querySelector(".dialogText");
const dialogChoices: HTMLDivElement = dialogWindow.querySelector(".dialogChoices");
function createDialogWindow(npc: Npc) {
  dialogText.innerHTML = "";
  let greetingText = applyVarsToDialogText(dialogLang[lang.language_id][npc.greeting], npc.pronounSet);
  dialogText.append(textSyntax(greetingText));
  dialogCharName.textContent = lang[npc.id + "_name"];
  dialogWindow.style.transform = "scale(1)";
  createNPCPortrait(npc);
  createDialogChoices(npc.id, dialogChoices, npc);
  setTimeout(() => { dialogWindow.style.opacity = "1"; }, 10);
}


function applyVarsToDialogText(text: any, pronounSet: string) {
  if (!text) return "empty";
  text = text.replaceAll("/heShe/", dialogLang[lang.language_id][pronounSet + "_heShe"]);
  text = text.replaceAll("/hisHer/", dialogLang[lang.language_id][pronounSet + "_hisHer"]);
  return text;
}

function createNPCPortrait(npc: Npc) {
  const canvas: HTMLCanvasElement = document.querySelector(".dialogCanvas");
  canvas.width = 512 * (settings["ui_scale"] / 100);
  canvas.height = 512 * (settings["ui_scale"] / 100);
  const ctx = canvas.getContext("2d");
  renderNPCOutOfMap(512 * (settings["ui_scale"] / 100), canvas, ctx, npc, "left");
}

function createDialogChoices(id: string, choices: HTMLDivElement, npc: Npc) {
  let interactions = characterInteractions[id];
  if (!interactions) return;
  choices.innerHTML = "";
  interactions.always?.forEach((choice: any) => {
    if (!choice.displayAtBottom) {
      createChoice(choice, choices, npc);
    }
  });
  interactions.conditional?.forEach((choice: any) => {
    if (checkDialogConditions(choice.conditions)) {
      createChoice(choice, choices, npc);
    }
  });
  interactions.dialogChoices?.forEach((choice: any) => {
    if (checkDialogConditions(choice.conditions)) {
      createChoice(choice, choices, npc);
    }
  });
  interactions.always?.forEach((choice: any) => {
    if (choice.displayAtBottom) {
      createChoice(choice, choices, npc);
    }
  });
}

function createChoice(choice: any, choices: HTMLDivElement, npc: Npc) {
  const button = document.createElement("div");
  button.classList.add("option");
  let type = lang[choice.type] || choice.type;
  let name = dialogLang[lang.language_id][choice.name] || choice.name;
  button.append(textSyntax(`<c>gold<c>[<c>white<c>${type}<c>gold<c>]<c>white<c> ${name}`));
  if (choice.action.type == "store") {
    button.addEventListener("click", e => openMerchantStore(choice.action.id));
  }
  else if (choice.action.type == "exit") {
    button.addEventListener("click", exitDialog);
  }
  else if (choice.action.type == "exitWithFlags") {
    button.addEventListener("click", e => exitWithFlags(choice));
  }
  else if (choice.action.type == "dialog") {
    button.addEventListener("click", e => nextDialog(choice, npc));
  }
  else if (choice.action.type == "quest") {
    button.addEventListener("click", e => questDialog(choice, npc));
  }
  else if (choice.action.type == "questObjective") {
    button.addEventListener("click", e => questObjectiveDialog(choice, npc));
  }
  else if (choice.action.type == "smith") {
    button.addEventListener("click", e => createSmithingWindow());
  }
  choices.append(button);

}

function openMerchantStore(id: any) {
  exitDialog();
  id = id.split("_store_");
  currentMerchant = NPCInventories[id[0]][id[1]];
  createMerchantWindow();
}

function exitDialog() {
  dialogWindow.style.transform = "scale(0)";
  state.dialogWindow = false;
}

function exitWithFlags(choice: any) {
  choice.flags.forEach((flag: any) => {
    if (flag.set_flag) {
      setFlag(flag.set_flag.flag, flag.set_flag.value, true);
    }
  });
  exitDialog();
}

function checkDialogConditions(conditions: any) {
  let pass = true;
  conditions.forEach((condition: any) => {
    if (condition.NOT_has_flag) {
      let flag = getFlag(condition.NOT_has_flag);
      if (player.flags[flag]) pass = false;
    }
    if (condition.has_flag) {
      let flag = getFlag(condition.has_flag);
      if (!player.flags[flag]) pass = false;
    }
  });
  return pass;
}

function nextDialog(choice: any, npc: Npc) {
  dialogText.innerHTML = "";
  let text = applyVarsToDialogText(dialogLang[lang.language_id][choice.action.id], npc.pronounSet);
  dialogText.append(textSyntax(text));
  choice.flags?.forEach((flag: any) => {
    if (flag.set_flag) {
      setFlag(flag.set_flag.flag, flag.set_flag.value, true);
    }
  });
  createDialogChoices(npc.id, dialogChoices, npc);
}

function questDialog(choice: any, npc: Npc) {
  dialogText.innerHTML = "";
  let text = applyVarsToDialogText(dialogLang[lang.language_id][choice.action.id], npc.pronounSet);
  dialogText.append(textSyntax(text));
  choice.flags?.forEach((flag: any) => {
    if (flag.set_flag) {
      setFlag(flag.set_flag.flag, flag.set_flag.value, true);
    }
  });
  if (choice.action.questId) {
    startNewQuest(choice.action.questId);
  }
  let questAddedText = lang["quest_added"];
  questAddedText = questAddedText.replace("[QUEST]", questLang[lang.language_id][choice.action.questId + "_name"] ?? choice.action.questId);
  dialogText.append(textSyntax(`\n\n${questAddedText}`));
  createDialogChoices(npc.id, dialogChoices, npc);
}

function getQuestParams(questId: string) {
  let questIndex = player.questProgress.findIndex((q) => Object.keys(quests)[q.id] == questId);
  return { id: questIndex, quest: questId };
}

function questObjectiveDialog(choice: any, npc: Npc) {
  dialogText.innerHTML = "";
  let text = applyVarsToDialogText(dialogLang[lang.language_id][choice.action.id], npc.pronounSet);
  dialogText.append(textSyntax(text));
  choice.flags?.forEach((flag: any) => {
    if (flag.set_flag) {
      setFlag(flag.set_flag.flag, flag.set_flag.value, true);
    }
  });
  updateQuestProgress(getQuestParams(choice.action.questId), npc.id);
  createDialogChoices(npc.id, dialogChoices, npc);
}