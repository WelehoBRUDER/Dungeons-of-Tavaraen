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
  },
  defeat_slimes_task_2: {
    id: "defeat_slimes_task_2",
    objectives: [
      {
        objective: "killEnemies",
        desc: "exterminate_slimes_desc",
        enemiesToKill: [{ type: "greySlime", amount: 8 }, { type: "flamingSlime", amount: 1 }, { type: "electricSlime", amount: 1 }],
        flag: "exterminate_slimes_talk",
        prog: "saveEnemyKillIndex",
      },
      {
        objective: "speakWithNpc",
        npc: "testMerchant",
        desc: "slimes_exterminated_talk_desc",
        flag: "completed_quest_defeat_slimes_2",
        completesQuest: true
      }
    ],
    reward: [
      { type: "gold", amount: 250 },
      { type: "xp", amount: 100 }
    ]
  }
} as any;

const uniqueQuestSpawns = {
  slime_posse: [
    { enemy: "greySlime", pos: { x: 42, y: 163 }, map: "western_heere_coast", level: 1 },
    { enemy: "greySlime", pos: { x: 40, y: 162 }, map: "western_heere_coast", level: 1 },
    { enemy: "flamingSlime", pos: { x: 42, y: 161 }, map: "western_heere_coast", level: 2 },
  ]
} as any;

class Quest {
  [id: string]: any;
  objectives: Array<any>;
  reward: Array<any>;
  giveNewQuestAfterCompletion: boolean;
  nextQuest?: string;
  constructor(baseQuest: any) {
    this.id = baseQuest.id;
    if (!this.id) throw new Error("QUEST IS MISSING ID!");
    const defaultQuest = quests[this.id];
    this.objectives = defaultQuest.objectives;
    this.reward = defaultQuest.reward;
    this.giveNewQuestAfterCompletion = defaultQuest.giveNewQuestAfterCompletion;
    this.nextQuest = defaultQuest.nextQuest ?? null;
  }
}
const journalWindow = <HTMLDivElement>document.querySelector(".questJournalWindow");
const questList = <HTMLDivElement>journalWindow.querySelector(".questList");
const questInfo = <HTMLDivElement>journalWindow.querySelector(".questInfo");
let defaultQuestSelected: number = 0;
function renderPlayerQuests() {
  state.journalOpen = true;
  journalWindow.style.transform = "scale(1)";
  journalWindow.style.opacity = "1";
  questList.innerHTML = "";
  questInfo.innerHTML = "";
  player.questProgress.forEach((set: any) => {
    createQuestFromIds(set);
    if (set.id == defaultQuestSelected) createQuestData(set);
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
function createQuestFromIds(idSet: any) {
  let quest = new Quest(Object.values(quests)[idSet.id]);
  const questEntry = document.createElement("p");
  questEntry.textContent = questLang[lang.language_id][quest.id + "_name"] ?? quest.id;
  questEntry.id = quest.id + idSet.id;
  questEntry.addEventListener("click", e => selectEntry(questEntry, idSet));
  questList.append(questEntry);
}

function selectEntry(entryElement: HTMLParagraphElement, entry: any) {
  try {
    questList.childNodes.forEach((entry: any) => entry.classList.remove("selectedEntry"));
  }
  catch { }
  entryElement.classList.add("selectedEntry");
  defaultQuestSelected = player.questProgress.findIndex((prog: any) => prog.id == entry.id);
  createQuestData(entry);
}

function createQuestData(entry: any) {
  questInfo.innerHTML = "";
  let quest = new Quest(Object.values(quests)[entry.id]);
  let text = `<f>${36 * settings.ui_scale / 100}px<f><c>goldenrod<c>${questLang[lang.language_id][quest.id + "_name"]}`;
  //let currentTask = quest.objectives[entry.obj];
  quest.objectives.forEach((currentTask: any, ObjectiveIndex: number) => {
    if (ObjectiveIndex > entry.obj) return;
    let objectiveDoneAlready: boolean = false;
    if (entry.obj > ObjectiveIndex) objectiveDoneAlready = true;
    text += `\n<c>grey<c>"${currentTask.desc}"`;
    if (currentTask.objective == "killEnemies") {
      if (currentTask.spawnUnique) {
        uniqueQuestSpawns[currentTask.spawnUnique].forEach((enemy: any, index: number) => {
          let col = "silver";
          if (entry.prog[index] || objectiveDoneAlready) col = "lime";
          text += `\n<c>${col}<c>(${entry.prog[index] ? entry.prog[index] : objectiveDoneAlready ? 1 : 0}/1) Defeat ${lang[enemy.enemy + "_name"]} (Lvl ${enemy.level})`;
        });
      }
      else {
        currentTask.enemiesToKill.forEach((en: any, index: number) => {
          let col = "silver";
          if (entry?.prog?.[index] >= en.amount || objectiveDoneAlready) col = "lime";
          text += `\n<c>${col}<c>(${entry.prog[index] ? entry.prog[index] : objectiveDoneAlready ? en.amount : 0}/${en.amount}) Defeat ${lang[en.type + "_name"]}`;
        });
      }
    }
    else if (currentTask.objective == "speakWithNpc") {
      let col = "silver";
      if (objectiveDoneAlready) col = "lime";
      text += `\n<c>${col}<c>Talk to ${currentTask.npc}`;
    }
  });
  if (entry.obj >= quest.objectives.length) { text += "\n\n§<f>28px<f><c>goldenrod<c>This quest is complete!"; }
  else {
    text += `\n\n§<c>white<c><f>24px<f>Quest reward: `;
    quest.reward.forEach((reward: any) => {
      text += `${reward.amount} ${reward.type} `;
    });
  }
  questInfo.append(textSyntax(text));
}

function startNewQuest(id: string) {
  let index = Object.keys(quests).findIndex(q => q == id);
  player.questProgress.push({ id: index, obj: 0, prog: {} });
  console.log("Got new quest!");
  spawnQuestMonsters();
}

function spawnQuestMonsters() {
  player.questProgress.forEach((q: any) => {
    // @ts-expect-error
    let obj = Object.values(quests)[q.id].objectives[q.obj];
    if (obj?.spawnUnique) {
      let uniques = uniqueQuestSpawns[obj.spawnUnique];
      uniques.forEach((enemy: any, index: number) => {
        let foundUniqueMob = false;
        maps.find((m: any) => m.id == enemy.map).enemies.forEach((en: any) => {
          if (en.spawnCords.x == enemy.pos.x && en.spawnCords.y == enemy.pos.y) foundUniqueMob = true;
        });
        if (!foundUniqueMob) {
          let spawnMap = maps.find((m: any) => m.id == enemy.map);
          spawnMap.enemies.push(new Enemy({ ...enemies[enemy.enemy], cords: enemy.pos, spawnCords: enemy.pos, level: enemy.level, map: enemy.map, questSpawn: { quest: q.id, index: index } }));
          spawnMap.enemies[spawnMap.enemies.length - 1].updateStatModifiers();
        }
      });
    }
  });
}

function updateQuestProgress(data: any, npc: string = "") {
  let questId: any = player.questProgress[data.id];
  let thisQuest: any = quests[data.quest];
  let objective: any = thisQuest.objectives[questId.obj];
  let isObjectiveComplete: boolean = false;
  if (objective.objective == "killEnemies") {
    if (objective.spawnUnique) {
      let spawns = uniqueQuestSpawns[objective.spawnUnique];
      let killed = 0;
      spawns.forEach((en: any, index: number) => {
        if (questId.prog[index]) killed++;
      });
      if (killed >= spawns.length) isObjectiveComplete = true;
    }
    else {
      let totalCurrent = 0;
      let totalNeeded = 0;
      objective.enemiesToKill.forEach((en: any, index: number) => {
        totalNeeded += en.amount;
        totalCurrent += questId.prog[index] > en.amount ? en.amount : questId.prog[index] ?? 0;
      });
      if (totalCurrent >= totalNeeded) isObjectiveComplete = true;
    }
  }
  else if (objective.objective == "speakWithNpc") {
    if (objective.npc == npc) isObjectiveComplete = true;
  }
  if (isObjectiveComplete) {
    questId.obj += 1;
    questId.prog = {};
    setFlag(objective.flag, true);
    if (objective.completesQuest) {
      spawnFloatingText(player.cords, "Quest completed!", "gold", 30, 3000, 500);
      thisQuest.reward.forEach((reward: any) => {
        if (reward.type == "gold") player.addGold(reward.amount);
        else if (reward.type == "xp") player.level.xp += reward.amount;
        player.lvlUp();
      });
    }
    else spawnFloatingText(player.cords, "Quest objective fulfilled!", "lime", 27, 3000, 500);
  }
}