"use strict";
var itemData = [];
const lootPools = {
    default: [
        { type: "armor", amount: [1, 1], item: "raggedShirt", chance: 5 },
        { type: "armor", amount: [1, 1], item: "raggedPants", chance: 5 },
        { type: "armor", amount: [1, 1], item: "raggedHood", chance: 5 },
        { type: "armor", amount: [1, 1], item: "raggedGloves", chance: 5 },
        { type: "armor", amount: [1, 1], item: "raggedBoots", chance: 5 },
        { type: "weapon", amount: [1, 1], item: "stick", chance: 10 },
        { type: "weapon", amount: [1, 1], item: "dagger", chance: 10 },
        { type: "weapon", amount: [1, 1], item: "chippedAxe", chance: 8 },
        { type: "gold", amount: [9, 53] }
    ]
};
const chestTemplates = {
    default: {
        id: "defaultChest",
        cords: { x: 0, y: 0 },
        map: 0,
        sprite: "treasureChest1",
        isUnique: false,
        respawnTime: 750,
        lootPool: "default",
        sinceOpened: -1
    }
};
class treasureChest {
    constructor(base) {
        var _a, _b, _c, _d, _e, _f;
        this.id = base.id;
        this.cords = Object.assign({}, base.cords);
        this.map = (_a = base.map) !== null && _a !== void 0 ? _a : 0;
        this.sprite = (_b = base.sprite) !== null && _b !== void 0 ? _b : "treasureChest1";
        this.isUnique = (_c = base.isUnique) !== null && _c !== void 0 ? _c : false;
        this.respawnTime = (_d = base.respawnTime) !== null && _d !== void 0 ? _d : 500;
        this.lootPool = (_e = base.lootPool) !== null && _e !== void 0 ? _e : "default";
        this.loot = base.loot;
        this.sinceOpened = (_f = base.sinceOpened) !== null && _f !== void 0 ? _f : -1;
        if (!this.loot) {
            const pool = [...lootPools[this.lootPool]];
            this.loot = [];
            pool.forEach((obj) => {
                if (random(100, 0) <= obj.chance) {
                    var itm;
                    // @ts-ignore
                    if (obj.type == "weapon")
                        itm = new Weapon(Object.assign({}, items[obj.item]));
                    else if (obj.type == "armor")
                        itm = new Armor(Object.assign({}, items[obj.item]));
                    this.loot.push(Object.assign(Object.assign({}, itm), { dataIndex: this.loot.length }));
                }
                else if (obj.type == "gold") {
                    let amount = random(obj.amount[1], obj.amount[0]);
                    this.gold = Math.floor(amount);
                }
            });
        }
        this.lootChest = () => {
            if (this.gold > 0) {
                player.gold += this.gold;
                spawnFloatingText(this.cords, `${this.gold}G`, "gold");
                this.gold = 0;
            }
            this.loot.forEach((loot, index) => { loot.dataIndex = index; });
            if (this.loot.length > 0) {
                invOpen = true;
                const _inv = document.querySelector(".defaultItemsArray");
                _inv.textContent = "";
                _inv.style.transform = "scale(1)";
                _inv.append(createItems(this.loot, "PICK_TREASURE", this));
            }
            else {
                this.sinceOpened = 0;
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
            createDroppedItem(enemy.cords, itm);
        }
        else if (obj.type == "gold") {
            let amount = random(obj.amount[1], obj.amount[0]);
            amount *= 1 + (enemy.level / 4.9);
            amount = Math.floor(amount);
            player.gold += amount;
            spawnFloatingText(enemy.cords, `${amount}G`, "gold");
        }
    });
}
function createDroppedItem(spawnLoc, item) {
    var xMod = random(0.7, 0.25);
    var yMod = random(0.7, 0.25);
    itemData.push({ cords: { x: spawnLoc.x, y: spawnLoc.y }, itm: item, mapCords: { xMod: xMod, yMod: yMod }, map: currentMap });
}
function pickLoot() {
    let totalArray = [];
    itemData.forEach((item, index) => {
        if (item.cords.x == player.cords.x && item.cords.y == player.cords.y && currentMap == item.map) {
            totalArray.push(Object.assign(Object.assign({}, item.itm), { dataIndex: index }));
        }
    });
    if (totalArray.length > 0) {
        invOpen = true;
        const _inv = document.querySelector(".defaultItemsArray");
        _inv.textContent = "";
        _inv.style.transform = "scale(1)";
        _inv.append(createItems(totalArray, "PICK_LOOT"));
    }
    else
        closeInventory();
}
function grabLoot(e, item) {
    if (e.button !== 2)
        return;
    itemData.splice(item.dataIndex, 1);
    player.inventory.push(item);
    pickLoot();
    modifyCanvas();
}
function grabTreasure(e, item, chest) {
    if (e.button !== 2)
        return;
    chest.loot.splice(item.dataIndex, 1);
    player.inventory.push(item);
    chest.lootChest();
    modifyCanvas();
}
//# sourceMappingURL=mapData.js.map