"use strict";
var itemData = [];
const once = {
    once: true
};
const lootPools = {
    default: [
        { type: "armor", amount: [1, 1], item: "raggedShirt", chance: 10 },
        { type: "armor", amount: [1, 1], item: "raggedPants", chance: 10 },
        { type: "armor", amount: [1, 1], item: "raggedHood", chance: 10 },
        { type: "armor", amount: [1, 1], item: "raggedGloves", chance: 10 },
        { type: "armor", amount: [1, 1], item: "raggedBoots", chance: 10 },
        { type: "armor", amount: [1, 1], item: "woolHat", chance: 10 },
        { type: "armor", amount: [1, 1], item: "woodenShield", chance: 10 },
        { type: "armor", amount: [1, 1], item: "leatherChest", chance: 10 },
        { type: "armor", amount: [1, 1], item: "leatherLeggings", chance: 6 },
        { type: "armor", amount: [1, 1], item: "leatherBracers", chance: 6 },
        { type: "armor", amount: [1, 1], item: "leatherHelmet", chance: 6 },
        { type: "armor", amount: [1, 1], item: "leatherBoots", chance: 6 },
        { type: "armor", amount: [1, 1], item: "ironHelmet", chance: 2 },
        { type: "weapon", amount: [1, 1], item: "stick", chance: 20 },
        { type: "weapon", amount: [1, 1], item: "dagger", chance: 20 },
        { type: "weapon", amount: [1, 1], item: "chippedAxe", chance: 16 },
        { type: "weapon", amount: [1, 1], item: "huntingBow", chance: 16 },
        { type: "weapon", amount: [1, 1], item: "apprenticeWand", chance: 16 },
        { type: "artifact", amount: [1, 1], item: "talismanOfProtection", chance: 8 },
        { type: "artifact", amount: [1, 1], item: "ringOfProtection", chance: 8 },
        { type: "artifact", amount: [1, 1], item: "emblemOfProtection", chance: 8 },
        { type: "artifact", amount: [1, 1], item: "scholarsTalisman", chance: 8 },
        { type: "artifact", amount: [1, 1], item: "scholarsRing", chance: 8 },
        { type: "artifact", amount: [1, 1], item: "scholarsEmblem", chance: 8 },
        { type: "artifact", amount: [1, 1], item: "warriorsTalisman", chance: 8 },
        { type: "artifact", amount: [1, 1], item: "warriorsRing", chance: 8 },
        { type: "artifact", amount: [1, 1], item: "warriorsEmblem", chance: 8 },
        { type: "artifact", amount: [1, 1], item: "loneShadesTalisman", chance: 8 },
        { type: "artifact", amount: [1, 1], item: "loneShadesRing", chance: 8 },
        { type: "artifact", amount: [1, 1], item: "loneShadesEmblem", chance: 8 },
        { type: "artifact", amount: [1, 1], item: "huntersTalisman", chance: 8 },
        { type: "artifact", amount: [1, 1], item: "huntersRing", chance: 8 },
        { type: "artifact", amount: [1, 1], item: "huntersEmblem", chance: 8 },
        { type: "consumable", amount: [1, 3], item: "healingPotion_weak", chance: 5 },
        { type: "consumable", amount: [1, 3], item: "manaPotion_weak", chance: 5 },
        { type: "gold", amount: [13, 76] }
    ],
    lichLoot: [
        { type: "weapon", amount: [1, 1], item: "crimsonStaff", chance: 100 },
        { type: "armor", amount: [1, 1], item: "lichRobes", chance: 100 },
        { type: "armor", amount: [1, 1], item: "crownOfWisdom", chance: 100 },
        { type: "gold", amount: [180, 250] }
    ],
    knightLoot: [
        { type: "armor", amount: [1, 1], item: "ironShield", chance: 100 },
        { type: "armor", amount: [1, 1], item: "ironHelmet", chance: 100 },
        { type: "armor", amount: [1, 1], item: "ironArmor", chance: 100 },
        { type: "armor", amount: [1, 1], item: "ironLegplates", chance: 100 },
        { type: "armor", amount: [1, 1], item: "ironGauntlets", chance: 100 },
        { type: "armor", amount: [1, 1], item: "ironBoots", chance: 100 },
        { type: "gold", amount: [300, 500] }
    ],
};
let lootedChests = [];
const chestTemplates = {
    defaultChest: {
        id: "defaultChest",
        cords: { x: 0, y: 0 },
        map: 0,
        sprite: "treasureChest1",
        img: "resources/tiles/treasure_chest_1.png",
        isUnique: false,
        respawnTime: 750,
        lootPool: "default",
        itemsGenerate: [1, 7],
        sinceOpened: -1
    },
    lichChest: {
        id: "lichChest",
        cords: { x: 0, y: 0 },
        map: 0,
        sprite: "treasureChestMagical",
        img: "resources/tiles/treasure_chest_magical.png",
        isUnique: false,
        respawnTime: 1000,
        lootPool: "lichLoot",
        itemsGenerate: [2, 3],
        sinceOpened: -1
    },
    knightChest: {
        id: "knightChest",
        cords: { x: 0, y: 0 },
        map: 0,
        sprite: "treasureChest2",
        img: "resources/tiles/treasure_chest_2.png",
        isUnique: false,
        respawnTime: 1000,
        lootPool: "knightLoot",
        itemsGenerate: [5, 6],
        sinceOpened: -1
    }
};
class treasureChest {
    constructor(base) {
        var _a, _b, _c, _d, _e, _f;
        this.id = base.id;
        if (!this.id)
            throw new Error("NO ID");
        this.cords = Object.assign({}, base.cords);
        this.map = (_a = base.map) !== null && _a !== void 0 ? _a : 0;
        this.sprite = (_b = base.sprite) !== null && _b !== void 0 ? _b : "treasureChest1";
        this.isUnique = (_c = base.isUnique) !== null && _c !== void 0 ? _c : false;
        this.respawnTime = (_d = base.respawnTime) !== null && _d !== void 0 ? _d : 500;
        this.lootPool = (_e = base.lootPool) !== null && _e !== void 0 ? _e : "default";
        this.loot = base.loot;
        this.itemsGenerate = base.itemsGenerate;
        this.sinceOpened = (_f = base.sinceOpened) !== null && _f !== void 0 ? _f : -1;
        if (!this.loot) {
            const pool = [...lootPools[this.lootPool]];
            const min = this.itemsGenerate[0];
            const max = this.itemsGenerate[1];
            this.loot = [];
            pool.forEach((obj) => {
                if (random(100, 0) <= obj.chance) {
                    var itm;
                    // @ts-ignore
                    if (obj.type == "weapon")
                        itm = new Weapon(Object.assign({}, items[obj.item]));
                    else if (obj.type == "armor")
                        itm = new Armor(Object.assign({}, items[obj.item]));
                    else if (obj.type == "artifact")
                        itm = new Artifact(Object.assign({}, items[obj.item]));
                    else if (obj.type == "consumable")
                        itm = new Consumable(Object.assign({}, items[obj.item]));
                    if (itm.stacks)
                        itm.amount = Math.floor(random(obj.amount[1], obj.amount[0]));
                    if (this.loot.length < max)
                        this.loot.push(Object.assign(Object.assign({}, itm), { dataIndex: this.loot.length }));
                }
                else if (obj.type == "gold") {
                    let amount = random(obj.amount[1], obj.amount[0]);
                    this.gold = Math.floor(amount);
                }
            });
            if (this.loot.length < min) {
                let obj = pool[Math.floor(random(pool.length - 2, 0))];
                let itm;
                if (obj.type == "weapon")
                    itm = new Weapon(Object.assign({}, items[obj.item]));
                else if (obj.type == "armor")
                    itm = new Armor(Object.assign({}, items[obj.item]));
                else if (obj.type == "artifact")
                    itm = new Artifact(Object.assign({}, items[obj.item]));
                else if (obj.type == "consumable")
                    itm = new Consumable(Object.assign({}, items[obj.item]));
                if (itm.stacks)
                    itm.amount = Math.floor(random(obj.amount[1], obj.amount[0]));
                this.loot.push(Object.assign(Object.assign({}, itm), { dataIndex: this.loot.length }));
            }
        }
        this.lootChest = () => {
            if (this.gold > 0) {
                player.addGold(this.gold);
                spawnFloatingText(this.cords, `${this.gold}G`, "gold");
                this.gold = 0;
            }
            this.loot.forEach((loot, index) => { loot.dataIndex = index; });
            if (this.loot.length > 0) {
                state.invOpen = true;
                const _inv = document.querySelector(".defaultItemsArray");
                _inv.textContent = "";
                _inv.style.transform = "scale(1)";
                _inv.append(createItems(this.loot, "PICK_TREASURE", this));
                document.body.addEventListener("keyup", e => fastGrabTreasure(e, this), once);
            }
            else {
                lootedChests.push({ cords: Object.assign({}, this.cords), sinceOpened: 0, map: this.map });
                showInteractPrompt();
                modifyCanvas();
                closeInventory();
            }
        };
    }
}
function lootEnemy(enemy) {
    enemy.loot.forEach((obj) => {
        if (random(100, 0) <= obj.chance) {
            var itm;
            // @ts-ignore
            if (obj.type == "weapon")
                itm = new Weapon(Object.assign({}, items[obj.item]));
            else if (obj.type == "armor")
                itm = new Armor(Object.assign({}, items[obj.item]));
            else if (obj.type == "artifact")
                itm = new Artifact(Object.assign({}, items[obj.item]));
            else if (obj.type == "consumable")
                itm = new Consumable(Object.assign({}, items[obj.item]));
            createDroppedItem(enemy.cords, itm);
        }
        else if (obj.type == "gold") {
            let amount = random(obj.amount[1], obj.amount[0]);
            amount *= 1 + (enemy.level / 4.9);
            amount = Math.floor(amount);
            player.addGold(amount);
            spawnFloatingText(enemy.cords, `${amount}G`, "gold");
        }
        showInteractPrompt();
    });
}
function createDroppedItem(spawnLoc, item) {
    var xMod = random(0.7, 0.25);
    var yMod = random(0.7, 0.25);
    itemData.push({ cords: { x: spawnLoc.x, y: spawnLoc.y }, itm: item, mapCords: { xMod: xMod, yMod: yMod }, map: currentMap });
    showInteractPrompt();
}
function pickLoot() {
    let totalArray = [];
    itemData.forEach((item, index) => {
        if (item.cords.x == player.cords.x && item.cords.y == player.cords.y && currentMap == item.map) {
            totalArray.push(Object.assign(Object.assign({}, item.itm), { dataIndex: index }));
        }
    });
    if (totalArray.length > 0) {
        state.invOpen = true;
        const _inv = document.querySelector(".defaultItemsArray");
        _inv.textContent = "";
        _inv.style.transform = "scale(1)";
        _inv.append(createItems(totalArray, "PICK_LOOT"));
        document.body.addEventListener("keyup", e => fastGrabLoot(e, totalArray), once);
    }
    else
        closeInventory();
}
function readMessage() {
    let foundMsg = false;
    maps[currentMap].messages.forEach((msg) => {
        if (player.cords.x == msg.cords.x && player.cords.y == msg.cords.y && !state.textWindowOpen) {
            openTextWindow(lang[msg.id]);
            foundMsg = true;
        }
    });
    if (!foundMsg) {
        closeTextWindow();
    }
}
function grabLoot(e, item, index, fromContextMenu = false) {
    if (e.button !== 2 && !fromContextMenu)
        return;
    if (fromContextMenu) {
        contextMenu.textContent = "";
    }
    itemData.splice(index, 1);
    player.addItem(item);
    pickLoot();
    modifyCanvas();
}
function fastGrabLoot(e, totalArray) {
    if (e.key !== settings.hotkey_interact)
        return;
    let item = totalArray[0];
    itemData.splice(item.dataIndex, 1);
    player.addItem(item);
    pickLoot();
    showInteractPrompt();
    modifyCanvas();
}
function grabTreasure(e, item, chest, index, fromContextMenu = false) {
    if (e.button !== 2 && !fromContextMenu)
        return;
    if (fromContextMenu) {
        contextMenu.textContent = "";
    }
    chest.loot.splice(index, 1);
    player.addItem(item);
    chest.lootChest();
    showInteractPrompt();
    modifyCanvas();
}
function fastGrabTreasure(e, chest) {
    if (e.key !== settings.hotkey_interact)
        return;
    player.addItem(Object.assign({}, chest.loot[0]));
    chest.loot.splice(0, 1);
    chest.lootChest();
    modifyCanvas();
}
function resetAllChests() {
    maps.forEach((mp) => {
        mp.treasureChests.forEach((chest, index) => {
            chest.loot = null;
            mp.treasureChests[index] = new treasureChest(Object.assign({}, chest));
        });
    });
}
//# sourceMappingURL=mapData.js.map