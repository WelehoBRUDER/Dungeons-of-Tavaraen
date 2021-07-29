var itemData: Array<any> = [];

function lootEnemy(enemy: Enemy) {
  enemy.loot.forEach((obj: any) => {
    if (random(100, 0) <= obj.chance) {
      var itm: any;
      // @ts-ignore
      if (obj.type == "weapon") itm = new Weapon({ ...items[obj.item] });
      createDroppedItem(enemy.cords, itm);
    }
  });
}

function createDroppedItem(spawnLoc: tileObject, item: any) {
  var xMod = random(0.7, 0.25);
  var yMod = random(0.7, 0.25);
  itemData.push({ cords: { x: spawnLoc.x, y: spawnLoc.y }, itm: item, mapCords: { xMod: xMod, yMod: yMod }, map: currentMap });
}

function pickLoot() {
  let totalArray: Array<any> = [];
  itemData.forEach((item: any, index) => {
    if (item.cords.x == player.cords.x && item.cords.y == player.cords.y && currentMap == item.map) {
      totalArray.push({ ...item.itm, dataIndex: index });
    }
  });
  if(totalArray.length > 0) {
    invOpen = true;
    const _inv = document.querySelector<HTMLDivElement>(".defaultItemsArray");
    _inv.textContent = "";
    _inv.style.transform = "scale(1)";
    _inv.append(createItems(totalArray, "PICK_LOOT"));
  }
  else closeInventory();

}

function grabLoot(e: MouseEvent, item: any) {
  if(e.button !== 2) return;
  itemData.splice(item.dataIndex, 1);
  player.inventory.push(item);
  pickLoot();
  modifyCanvas();
}