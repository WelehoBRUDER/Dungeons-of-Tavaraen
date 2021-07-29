"use strict";
var itemData = [];
function lootEnemy(enemy) {
    enemy.loot.forEach((obj) => {
        if (random(100, 0) <= obj.chance) {
            var itm;
            // @ts-ignore
            if (obj.type == "weapon")
                itm = new Weapon(Object.assign({}, items[obj.item]));
            createDroppedItem(enemy.cords, itm);
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
//# sourceMappingURL=mapData.js.map