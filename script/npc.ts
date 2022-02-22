// THIS FILE CONTAINS THE LOGIC FOR FRIENDLY CHARACTERS //

// Flags are stored as index (5: true, 0: 1) to save memory.
// Function getFlag(str) will return the flag index.
const flags: Array<string> =
  [
    "has_spoken_to_merchant",
    "accepted_merchant_quest_1",
    "defeated_robber_slimes_talk",
    "completed_quest_defeat_slimes",
    "has_heard_merchant_troubles",
    "accepted_merchant_quest_2",
    "exterminate_slimes_talk",
    "completed_quest_defeat_slimes_2"
  ];

// Returns flag index by searching with string.
function getFlag(str: string) {
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
function setFlag(str: string, value: any, override: boolean = false) {
  let index = getFlag(str);
  if (index > -1) {
    if (player.flags?.[index]) {
      if (override) player.flags[index] = value;
      else {
        if (typeof value == "number") {
          if (typeof player.flags[index] !== "number") player.flags[index] = 0;
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
  [id: string]: any;
  sprite: string;
  greeting: string;
  pronounSet: string;
  currentMap: number;
  currentCords: tileObject;
  conditionalMaps: any;
  conditionalCords: any;
  constructor(base: Npc) {
    this.id = base.id;
    this.sprite = base.sprite;
    this.greeting = base.greeting;
    this.pronounSet = base.pronounSet;
    this.currentMap = base.currentMap;
    this.currentCords = base.currentCords;
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
  button.append(textSyntax(`<c>gold<c>[<c>white<c>${lang[choice.type]}<c>gold<c>]<c>white<c> ${dialogLang[lang.language_id][choice.name]}`));
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
  };
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

let currentMerchant: any;
let currentMerchantInventory: Array<any> = [];
let pendingItemsSelling: Array<any> = [];
let pendingItemsBuying: Array<any> = [];
let totalPrice: number = 0;
const storeWindow = document.querySelector<HTMLDivElement>(".storeWindow");
const merchantInv = document.querySelector<HTMLDivElement>(".merchantInv");
const playerInv = document.querySelector(".playerInv");
const confirmation = document.querySelector(".confirmation");
const pendingBuy = confirmation.querySelector(".pendingItemsBuying");
const pendingSell = confirmation.querySelector(".pendingItemsSelling");
const pendingBuyArea = pendingBuy.querySelector(".area");
const pendingSellArea = pendingSell.querySelector(".area");
const priceArea = confirmation.querySelector(".price");
const amountScreen = document.querySelector<HTMLDivElement>(".amountSelector");
const confirmButton = confirmation.querySelector(".confirmButton");
const smithingWindow = document.querySelector<HTMLDivElement>(".smithingWindow");
function createMerchantWindow(resetInv: boolean = true, justSort: boolean = false) {
  storeWindow.style.transform = "scale(1)";
  amountScreen.style.display = "none";
  hideHover();
  contextMenu.textContent = "";
  merchantInv.innerHTML = "";
  playerInv.innerHTML = "";
  state.storeOpen = true;
  if (resetInv) {
    pendingItemsSelling = [];
    pendingItemsBuying = [];
  }
  if (!justSort) currentMerchantInventory = createMerchantItems(currentMerchant);
  merchantInv.append(createItems(currentMerchantInventory, "MERCHANT_SELLING", null, false));
  playerInv.append(createItems(player.inventory, "PLAYER_SELLING"));
  pendingBuyArea.innerHTML = "";
  pendingSellArea.innerHTML = "";
  let buyingPrice = 0;
  let sellingPrice = 0;
  for (let i = 0; i < pendingItemsBuying.length; i++) {
    let pending = pendingItemsBuying[i];
    const itemFrame = document.createElement("div");
    const itemImg = document.createElement("img");
    buyingPrice += pending.price * pending.amount;
    itemFrame.classList.add("itmFrame");
    itemImg.src = pending.img;
    tooltip(itemFrame, itemTT(pending));
    itemFrame.append(itemImg);
    if (pending.stacks) {
      const itemAmnt = document.createElement("p");
      itemAmnt.classList.add("itemAmount");
      itemAmnt.textContent = pending.amount;
      itemFrame.append(itemAmnt);
    }
    itemFrame.addEventListener("mouseup", e => removeItemFromBuying(i));
    pendingBuyArea.append(itemFrame);
  }
  for (let i = 0; i < pendingItemsSelling.length; i++) {
    let pending = pendingItemsSelling[i];
    const itemFrame = document.createElement("div");
    const itemImg = document.createElement("img");
    sellingPrice += pending.fullPrice() * pending.amount;
    itemFrame.classList.add("itmFrame");
    itemImg.src = pending.img;
    tooltip(itemFrame, itemTT(pending));
    itemFrame.append(itemImg);
    itemFrame.addEventListener("mouseup", e => removeItemFromSelling(i));
    pendingSellArea.append(itemFrame);
  }
  priceArea.innerHTML = "";
  let priceTxt: string = "";
  priceTxt += `\t<c>lime<c>+${sellingPrice}`;
  priceTxt += `\n\t<c>red<c>-${buyingPrice}`;
  priceTxt += `\n<c>white<c>____________\n`;
  priceTxt += `\n<c>white<c>Total: <c>${sellingPrice > buyingPrice ? "lime" : sellingPrice == buyingPrice ? "white" : "red"}<c>${sellingPrice - buyingPrice}`;
  priceArea.append(textSyntax(priceTxt));
  totalPrice = sellingPrice - buyingPrice;
  if (Math.abs(totalPrice) > player.gold && totalPrice < 0) {
    confirmButton.classList.add("greyedOut");
  }
  else {
    confirmButton.classList?.remove("greyedOut");
  }
}

function closeMerchantWindow() {
  amountScreen.style.display = "none";
  hideHover();
  contextMenu.textContent = "";
  merchantInv.innerHTML = "";
  playerInv.innerHTML = "";
  storeWindow.style.transform = "scale(0)";
}

function createMerchantItems(itemsInv: any) {
  let inv = [];
  for (let item of itemsInv) {
    let addThisItem: boolean = true;
    pendingItemsBuying.forEach((pending: any) => { if (pending.id == item.id && item.unique) addThisItem = false; });
    if (!addThisItem) continue;
    let _item = { ...items[item.id] };
    let itm: any;
    if (_item.type == "consumable") itm = new Consumable(_item, item.price);
    else if (_item.type == "weapon") itm = new Weapon(_item, item.price);
    else if (_item.type == "armor") itm = new Armor(_item, item.price);
    else if (item.type == "artifact") itm = new Artifact(_item, item.price);
    itm.unique = item.unique;
    inv.push(itm);
  }
  return inv;
}

function itemAmountSelector(item: any, selling: boolean = false) {
  const input = amountScreen.querySelector<HTMLInputElement>(".amount");
  const but = amountScreen.querySelector<HTMLDivElement>(".confirm");
  amountScreen.style.display = "block";
  input.value = item.amount;
  but.onclick = () => {
    let value = parseInt(input.value);
    if (value <= 0) value = 1;
    if (selling && value > item.amount) value = item.amount;
    if (selling) {
      pendingItemsSelling.push(item);
      for (let i = 0; i < player.inventory.length; i++) {
        if (player.inventory[i].id == item.id) {
          if (value == item.amount) {
            player.inventory.splice(i, 1);
          }
          else player.inventory[i].amount -= value;
        }
      }
      createMerchantWindow(false);
    }
    else {
      item.amount = value;
      pendingItemsBuying.push(item);
      createMerchantWindow(false);
    }
  };
}

function addItemToBuying(item: any) {
  if (!item.stacks) {
    pendingItemsBuying.push(item);
    createMerchantWindow(false);
  }
  else {
    itemAmountSelector(item);
  }
}

function addItemToSelling(item: any) {
  if (item.id === "A0_error") return;
  if (!item.stacks) {
    pendingItemsSelling.push(item);
    player.inventory.splice(item.index, 1);
    player.updateAbilities();
    createMerchantWindow(false);
  }
  else {
    itemAmountSelector(item, true);
  }
}

function removeItemFromBuying(index: number) {
  pendingItemsBuying.splice(index, 1);
  createMerchantWindow(false);
}

function removeItemFromSelling(index: number) {
  let item = pendingItemsSelling[index];
  if (item.stacks) {
    let found: boolean = false;
    player.inventory.forEach((itm: any) => {
      if (itm.id == item.id) {
        found = true;
        itm.amount += item.amount;
      }
    });
    if (!found) {
      player.inventory.push(item);
    }
  }
  else player.inventory.push(item);
  pendingItemsSelling.splice(index, 1);
  createMerchantWindow(false);
}

function confirmTransaction() {
  if (totalPrice < 0 && Math.abs(totalPrice) > player.gold) return;
  pendingItemsBuying.forEach((pending: any) => {
    if (pending.stacks) {
      let found: boolean = false;
      player.inventory.forEach((itm: any) => {
        if (itm.id == pending.id) {
          itm.amount += pending.amount;
          found = true;
        }
      });
      if (!found) player.inventory.push(pending);
    }
    else {
      player.inventory.push(pending);
    }
  });
  pendingItemsBuying = [];
  pendingItemsSelling = [];
  player.addGold(totalPrice);
  closeMerchantWindow();
  updateUI();
  state.storeOpen = false;
}

function cancelTransaction() {
  pendingItemsBuying = [];
  pendingItemsSelling.forEach((pending: any) => {
    if (pending.stacks) {
      let found: boolean = false;
      player.inventory.forEach((itm: any) => {
        if (itm.id == pending.id) {
          itm.amount += pending.amount;
          found = true;
        }
      });
      if (!found) player.inventory.push(pending);
    }
    else {
      player.inventory.push(pending);
    }
  });
  pendingItemsSelling = [];
  closeMerchantWindow();
  updateUI();
  state.storeOpen = false;
}

let pendingUpgrade = {
  upgradeItem: null,
  materials: []
} as any;
function createSmithingWindow(reset: boolean = true) {
  hideHover();
  smithingWindow.style.transform = "scale(1)";
  if (reset) {
    pendingUpgrade.upgradeItem = null;
    pendingUpgrade.materials = [];
  }
  const invContainer = smithingWindow.querySelector(".invContainer");
  const upSlot = smithingWindow.querySelector(".upgradeSlot");
  smithingWindow.querySelector(".mat1").innerHTML = "";
  smithingWindow.querySelector(".mat2").innerHTML = "";
  upSlot.innerHTML = "";
  invContainer.innerHTML = "";
  if (pendingUpgrade.upgradeItem) {
    invContainer.append(createItems(player.inventory, "UPGRADE", null, true, pendingUpgrade.upgradeItem));
    upSlot.append(createItemToSlot(pendingUpgrade.upgradeItem, false));
  }
  else {
    invContainer.append(createItems(player.inventory, "UPGRADE"));
  }
  pendingUpgrade.materials.forEach((item: any, index: number) => {
    smithingWindow.querySelector(`.mat${index + 1}`).append(createItemToSlot(item, true));
  });
}

function createItemToSlot(item: any, material: boolean = true) {
  const img = document.createElement("img");
  img.addEventListener("mousedown", e => removeItemFromUpgrade(e, item, material));
  img.src = item.img;
  img.classList.add("slotItem");
  tooltip(img, itemTT(item));
  return img;
}

function handleUpgradeAdding(e: MouseEvent, item: any) {
  if (e.button !== 2) return;
  if (!pendingUpgrade.upgradeItem) {
    addUpgradeItem(item);
  }
  else if (pendingUpgrade.materials.length < 2) {
    addMaterialItem(item);
  }
}

function removeItemFromUpgrade(e: MouseEvent, item: any, material: boolean = true) {
  if (e.button !== 2) return;
  if (material) {
    pendingUpgrade.materials.some((itm: any, index: number) => {
      if (itm.id == item.id) {
        player.inventory.push(itm);
        pendingUpgrade.materials.splice(index, 1);
        return true;
      }
    });
  }
  else {
    player.inventory.push(pendingUpgrade.upgradeItem);
    pendingUpgrade.upgradeItem = null;
  }
  createSmithingWindow(false);
}

function addUpgradeItem(item: any) {
  pendingUpgrade.upgradeItem = item;
  player.inventory.splice(item.index, 1);
  player.updateAbilities();
  createSmithingWindow(false);
}

function addMaterialItem(item: any) {
  pendingUpgrade.materials.push(item);
  player.inventory.splice(item.index, 1);
  player.updateAbilities();
  createSmithingWindow(false);
}

function upgrade() {
  if (pendingUpgrade.upgradeItem && pendingUpgrade.materials.length == 2) {
    pendingUpgrade.upgradeItem.level++;
    player.inventory.push(pendingUpgrade.upgradeItem);
    player.updateAbilities();
    createSmithingWindow();
  }
}

function closeSmithingWindow() {
  if (pendingUpgrade.upgradeItem) {
    player.inventory.push(pendingUpgrade.upgradeItem);
    pendingUpgrade.upgradeItem = null;
  }
  if (pendingUpgrade.materials.length > 0) {
    pendingUpgrade.materials.forEach((itm: any) => {
      player.inventory.push(itm);
    });
    pendingUpgrade.materials = [];
  }

  smithingWindow.style.transform = "scale(0)";
}