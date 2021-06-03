var itemData: Array<any> = [];

function lootEnemy(enemy: Enemy) {
  enemy.loot.forEach((obj: any)=>{
    if (random(100, 0) <= obj.chance) {
      var itm: any;
      // @ts-ignore
      if(obj.type == "weapon") itm = new Weapon({...items[obj.item]});
      createDroppedItem(enemy.cords, itm);
    }
  });
}

function createDroppedItem(spawnLoc: tileObject, item: any) {
  var xMod = random(0.7, 0.25);
  var yMod = random(0.7, 0.25);
  itemData.push({cords: {x: spawnLoc.x, y: spawnLoc.y}, itm: item, mapCords: {xMod: xMod, yMod: yMod}, map: currentMap});
}

function pickLoot() {
  itemData.forEach((item: any, index) => {
    if(item.cords.x == player.cords.x && item.cords.y == player.cords.y && currentMap == item.map) {
      player.inventory.push(item.itm);
      itemData.splice(index, 1);
    }
  });
  modifyCanvas();
}