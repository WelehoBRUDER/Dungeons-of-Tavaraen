"use strict";
// THIS FILE CONTAINS THE LOGIC FOR FRIENDLY CHARACTERS //
// Flags are stored as index (5: true, 0: 1) to save memory.
// Function getFlag(str) will return the flag index.
const flags = [
    "has_spoken_to_merchant",
    "accepted_merchant_quest_1",
    "defeated_robber_slimes_talk",
    "completed_quest_defeat_slimes",
    "has_heard_merchant_troubles",
    "accepted_merchant_quest_2",
    "exterminate_slimes_talk",
    "completed_quest_defeat_slimes_2",
    "maroch_slay_brethren_quest",
    "brethren_slain_talk",
    "completed_quest_slay_brethren"
];
// Returns flag index by searching with string.
function getFlag(str) {
    str = str.toLowerCase();
    for (let index = 0; index < flags.length; index++) {
        if (str == flags[index].toLowerCase()) {
            return index;
        }
    }
    return -1;
}
// Either sets a flag to specified value, or modifies it.
// If override is enabled, value is replaced instead of modified.
// Boolean values can't be modified and will instead always be replaced (duh).
function setFlag(str, value, override = false) {
    var _a;
    let index = getFlag(str);
    if (index > -1) {
        if ((_a = player.flags) === null || _a === void 0 ? void 0 : _a[index]) {
            if (override)
                player.flags[index] = value;
            else {
                if (typeof value == "number") {
                    if (typeof player.flags[index] !== "number")
                        player.flags[index] = 0;
                    player.flags[index] += value;
                }
                else {
                    player.flags[index] = value;
                }
            }
        }
        else {
            console.log("adding new flag!");
            player.flags[index] = value;
        }
    }
}
class Npc {
    constructor(base) {
        this.id = base.id;
        this.sprite = base.sprite;
        this.img = base.img;
        this.greeting = base.greeting;
        this.pronounSet = base.pronounSet;
        this.currentMap = base.currentMap;
        this.currentCords = Object.assign({}, base.currentCords);
        this.conditionalMaps = base.conditionalMaps;
        this.conditionalCords = base.conditionalCords;
    }
}
function talkToCharacter() {
    if (state.dialogWindow || state.inCombat)
        return;
    NPCcharacters.some((npc) => {
        let dist = calcDistance(player.cords.x, player.cords.y, npc.currentCords.x, npc.currentCords.y);
        if (dist < 3) {
            state.dialogWindow = true;
            createDialogWindow(npc);
        }
    });
}
const dialogWindow = document.querySelector(".dialogWindow");
const dialogCharName = dialogWindow.querySelector(".dialogCharName");
const dialogText = dialogWindow.querySelector(".dialogText");
const dialogChoices = dialogWindow.querySelector(".dialogChoices");
function createDialogWindow(npc) {
    dialogText.innerHTML = "";
    let greetingText = applyVarsToDialogText(dialogLang[lang.language_id][npc.greeting], npc.pronounSet);
    dialogText.append(textSyntax(greetingText));
    dialogCharName.textContent = lang[npc.id + "_name"];
    dialogWindow.style.transform = "scale(1)";
    createNPCPortrait(npc);
    createDialogChoices(npc.id, dialogChoices, npc);
    setTimeout(() => { dialogWindow.style.opacity = "1"; }, 10);
}
function applyVarsToDialogText(text, pronounSet) {
    if (!text)
        return "empty";
    text = text.replaceAll("/heShe/", dialogLang[lang.language_id][pronounSet + "_heShe"]);
    text = text.replaceAll("/hisHer/", dialogLang[lang.language_id][pronounSet + "_hisHer"]);
    return text;
}
function createNPCPortrait(npc) {
    const canvas = document.querySelector(".dialogCanvas");
    canvas.width = 512 * (settings["ui_scale"] / 100);
    canvas.height = 512 * (settings["ui_scale"] / 100);
    const ctx = canvas.getContext("2d");
    renderNPCOutOfMap(512 * (settings["ui_scale"] / 100), canvas, ctx, npc, "left");
}
function createDialogChoices(id, choices, npc) {
    var _a, _b, _c, _d;
    let interactions = characterInteractions[id];
    if (!interactions)
        return;
    choices.innerHTML = "";
    (_a = interactions.always) === null || _a === void 0 ? void 0 : _a.forEach((choice) => {
        if (!choice.displayAtBottom) {
            createChoice(choice, choices, npc);
        }
    });
    (_b = interactions.conditional) === null || _b === void 0 ? void 0 : _b.forEach((choice) => {
        if (checkDialogConditions(choice.conditions)) {
            createChoice(choice, choices, npc);
        }
    });
    (_c = interactions.dialogChoices) === null || _c === void 0 ? void 0 : _c.forEach((choice) => {
        if (checkDialogConditions(choice.conditions)) {
            createChoice(choice, choices, npc);
        }
    });
    (_d = interactions.always) === null || _d === void 0 ? void 0 : _d.forEach((choice) => {
        if (choice.displayAtBottom) {
            createChoice(choice, choices, npc);
        }
    });
}
function createChoice(choice, choices, npc) {
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
function openMerchantStore(id) {
    exitDialog();
    id = id.split("_store_");
    currentMerchant = NPCInventories[id[0]][id[1]];
    createMerchantWindow();
}
function exitDialog() {
    dialogWindow.style.transform = "scale(0)";
    state.dialogWindow = false;
}
function exitWithFlags(choice) {
    choice.flags.forEach((flag) => {
        if (flag.set_flag) {
            setFlag(flag.set_flag.flag, flag.set_flag.value, true);
        }
    });
    exitDialog();
}
function checkDialogConditions(conditions) {
    let pass = true;
    conditions.forEach((condition) => {
        if (condition.NOT_has_flag) {
            let flag = getFlag(condition.NOT_has_flag);
            if (player.flags[flag])
                pass = false;
        }
        if (condition.has_flag) {
            let flag = getFlag(condition.has_flag);
            if (!player.flags[flag])
                pass = false;
        }
    });
    return pass;
}
function nextDialog(choice, npc) {
    var _a;
    dialogText.innerHTML = "";
    let text = applyVarsToDialogText(dialogLang[lang.language_id][choice.action.id], npc.pronounSet);
    dialogText.append(textSyntax(text));
    (_a = choice.flags) === null || _a === void 0 ? void 0 : _a.forEach((flag) => {
        if (flag.set_flag) {
            setFlag(flag.set_flag.flag, flag.set_flag.value, true);
        }
    });
    createDialogChoices(npc.id, dialogChoices, npc);
}
function questDialog(choice, npc) {
    var _a, _b;
    dialogText.innerHTML = "";
    let text = applyVarsToDialogText(dialogLang[lang.language_id][choice.action.id], npc.pronounSet);
    dialogText.append(textSyntax(text));
    (_a = choice.flags) === null || _a === void 0 ? void 0 : _a.forEach((flag) => {
        if (flag.set_flag) {
            setFlag(flag.set_flag.flag, flag.set_flag.value, true);
        }
    });
    if (choice.action.questId) {
        startNewQuest(choice.action.questId);
    }
    let questAddedText = lang["quest_added"];
    questAddedText = questAddedText.replace("[QUEST]", (_b = questLang[lang.language_id][choice.action.questId + "_name"]) !== null && _b !== void 0 ? _b : choice.action.questId);
    dialogText.append(textSyntax(`\n\n${questAddedText}`));
    createDialogChoices(npc.id, dialogChoices, npc);
}
function getQuestParams(questId) {
    let questIndex = player.questProgress.findIndex((q) => Object.keys(quests)[q.id] == questId);
    return { id: questIndex, quest: questId };
}
function questObjectiveDialog(choice, npc) {
    var _a;
    dialogText.innerHTML = "";
    let text = applyVarsToDialogText(dialogLang[lang.language_id][choice.action.id], npc.pronounSet);
    dialogText.append(textSyntax(text));
    (_a = choice.flags) === null || _a === void 0 ? void 0 : _a.forEach((flag) => {
        if (flag.set_flag) {
            setFlag(flag.set_flag.flag, flag.set_flag.value, true);
        }
    });
    updateQuestProgress(getQuestParams(choice.action.questId), npc.id);
    createDialogChoices(npc.id, dialogChoices, npc);
}
//# sourceMappingURL=npc.js.map