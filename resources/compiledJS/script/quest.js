"use strict";
// Save quest progress as index pointing at objective.
// Further breakdown needs a variable.
// Quest progress example:
// {id: 0, obj: 0, prog: {1:1}}
// Will be hard to read, but efficient to save.
// Objective flag is added AFTER objective is fulfilled.
const quests = {
    defeat_slimes_task: {
        id: "defeat_slimes_task",
        objectives: [
            {
                objective: "killEnemies",
                desc: "slimes_kill_desc",
                spawnUnique: "slime_posse",
                flag: "defeated_robber_slimes_talk",
                prog: "saveEnemyKillIndex"
            },
            {
                objective: "speakWithNpc",
                npc: "testMerchant",
                desc: "slimes_killed_talk_desc",
                flag: "completed_quest_defeat_slimes",
                completesQuest: true
            }
        ],
        reward: [
            { type: "gold", amount: 100 },
            { type: "xp", amount: 25 }
        ],
        giveNewQuestAfterCompletion: false
    }
};
const uniqueQuestSpawns = {
    slime_posse: [
        { enemy: "greySlime", pos: { x: 42, y: 163 }, map: "western_heere_coast", level: 1 },
        { enemy: "greySlime", pos: { x: 40, y: 162 }, map: "western_heere_coast", level: 1 },
        { enemy: "flamingSlime", pos: { x: 42, y: 161 }, map: "western_heere_coast", level: 1 },
    ]
};
class Quest {
    constructor(baseQuest) {
        var _a;
        this.id = baseQuest.id;
        if (!this.id)
            throw new Error("QUEST IS MISSING ID!");
        const defaultQuest = quests[this.id];
        this.objectives = defaultQuest.objectives;
        this.reward = defaultQuest.reward;
        this.giveNewQuestAfterCompletion = defaultQuest.giveNewQuestAfterCompletion;
        this.nextQuest = (_a = defaultQuest.nextQuest) !== null && _a !== void 0 ? _a : null;
    }
}
const journalWindow = document.querySelector(".questJournalWindow");
const questList = journalWindow.querySelector(".questList");
const questInfo = journalWindow.querySelector(".questInfo");
let defaultQuestSelected = 0;
function renderPlayerQuests() {
    state.journalOpen = true;
    journalWindow.style.transform = "scale(1)";
    journalWindow.style.opacity = "1";
    questList.innerHTML = "";
    questInfo.innerHTML = "";
    player.questProgress.forEach((set) => {
        createQuestFromIds(set);
        if (set.id == defaultQuestSelected)
            createQuestData(set);
    });
}
function closePlayerQuests() {
    state.journalOpen = false;
    journalWindow.style.transform = "scale(0)";
    journalWindow.style.opacity = "0";
    questList.innerHTML = "";
    questInfo.innerHTML = "";
}
// This simply creates a quest entry in the journal from player data.
function createQuestFromIds(idSet) {
    let quest = new Quest(Object.values(quests)[idSet.id]);
    const questEntry = document.createElement("p");
    questEntry.textContent = questLang[lang.language_id][quest.id + "_name"];
    questEntry.id = quest.id + idSet.id;
    questEntry.addEventListener("click", e => selectEntry(questEntry, idSet));
    questList.append(questEntry);
}
function selectEntry(entryElement, entry) {
    try {
        questList.childNodes.forEach((entry) => entry.classList.remove("selectedEntry"));
    }
    catch (_a) { }
    entryElement.classList.add("selectedEntry");
    defaultQuestSelected = player.questProgress.findIndex((prog) => prog.id == entry.id);
    createQuestData(entry);
}
function createQuestData(entry) {
    questInfo.innerHTML = "";
    let quest = new Quest(Object.values(quests)[entry.id]);
    let text = `<f>${36 * settings.ui_scale / 100}px<f><c>goldenrod<c>${questLang[lang.language_id][quest.id + "_name"]}`;
    let currentTask = quest.objectives[entry.obj];
    if (entry.obj >= quest.objectives.length) {
        text += "\n<f>54px<f><c>goldenrod<c>This quest is complete!"; // Make it display all objectives later, for now this is a placeholder. 
    }
    else {
        text += `\n<c>grey<c>"${currentTask.desc}"`;
        if (currentTask.objective == "killEnemies") {
            if (currentTask.spawnUnique) {
                uniqueQuestSpawns[currentTask.spawnUnique].forEach((enemy, index) => {
                    var _a;
                    let col = "silver";
                    if (entry.prog[index])
                        col = "lime";
                    text += `\n<c>${col}<c>(${(_a = entry.prog[index]) !== null && _a !== void 0 ? _a : 0}/1) Defeat ${lang[enemy.enemy + "_name"]}`;
                });
            }
        }
        else if (currentTask.objective == "speakWithNpc") {
            text += `\n<c>silver<c>Talk to ${currentTask.npc}`;
        }
    }
    questInfo.append(textSyntax(text));
}
function startNewQuest(id) {
    let index = Object.keys(quests).findIndex(q => q == id);
    player.questProgress.push({ id: index, obj: 0, prog: {} });
    console.log("Got new quest!");
    spawnQuestMonsters();
}
function spawnQuestMonsters() {
    player.questProgress.forEach((q) => {
        // @ts-expect-error
        let obj = Object.values(quests)[q.id].objectives[q.obj];
        if (obj.spawnUnique) {
            let uniques = uniqueQuestSpawns[obj.spawnUnique];
            uniques.forEach((enemy, index) => {
                let foundUniqueMob = false;
                maps.find((m) => m.id == enemy.map).enemies.forEach((en) => {
                    if (en.spawnCords.x == enemy.pos.x && en.spawnCords.y == enemy.pos.y)
                        foundUniqueMob = true;
                });
                if (!foundUniqueMob) {
                    maps.find((m) => m.id == enemy.map).enemies.push(new Enemy(Object.assign(Object.assign({}, enemies[enemy.enemy]), { cords: enemy.pos, spawnCords: enemy.pos, level: enemy.level, map: enemy.map, questSpawn: { quest: q.id, index: index } })));
                }
            });
        }
    });
}
function updateQuestProgress(data, npc = "") {
    let questId = player.questProgress[data.id];
    let thisQuest = quests[data.quest];
    let objective = thisQuest.objectives[questId.obj];
    let isObjectiveComplete = false;
    if (objective.objective == "killEnemies") {
        if (objective.spawnUnique) {
            let spawns = uniqueQuestSpawns[objective.spawnUnique];
            let killed = 0;
            spawns.forEach((en, index) => {
                if (questId.prog[index])
                    killed++;
            });
            if (killed >= spawns.length)
                isObjectiveComplete = true;
        }
        else {
            if (questId.prog[0] >= objective.amountNeeded)
                isObjectiveComplete = true;
        }
    }
    else if (objective.objective == "speakWithNpc") {
        if (objective.npc == npc)
            isObjectiveComplete = true;
    }
    if (isObjectiveComplete) {
        questId.obj += 1;
        questId.prog = {};
        setFlag(objective.flag, true);
        if (objective.completesQuest) {
            spawnFloatingText(player.cords, "Quest completed!", "gold", 30, 3000, 500);
            thisQuest.reward.forEach((reward) => {
                if (reward.type == "gold")
                    player.addGold(reward.amount);
                else if (reward.type == "xp")
                    player.level.xp += reward.amount;
            });
        }
        else
            spawnFloatingText(player.cords, "Quest objective fulfilled!", "lime", 27, 3000, 500);
    }
}
//# sourceMappingURL=quest.js.map