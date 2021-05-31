"use strict";
var itemData = [];
function lootEnemy(enemy) {
    enemy.loot.forEach((obj) => {
        if (random(100, 0) <= obj.chance) {
            var itm;
            var xMod = random(0.7, 0.25);
            var yMod = random(0.7, 0.25);
            // @ts-ignore
            if (obj.type == "weapon")
                itm = new Weapon(Object.assign({}, items[obj.item]));
            itemData.push({ cords: { x: enemy.cords.x, y: enemy.cords.y }, itm: itm, mapCords: { xMod: xMod, yMod: yMod } });
        }
    });
    console.log(itemData);
}
function pickLoot() {
    itemData.forEach((item, index) => {
        if (item.cords.x == player.cords.x && item.cords.y == player.cords.y) {
            player.inventory.push(item.itm);
            itemData.splice(index, 1);
        }
    });
    modifyCanvas();
}
