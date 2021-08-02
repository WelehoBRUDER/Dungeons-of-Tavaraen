var itemData: Array<any> = [];

const lootPools = {
  default: [
    {type: "armor", amount: [1, 1], item: "raggedShirt", chance: 5},
    {type: "armor", amount: [1, 1], item: "raggedPants", chance: 5},
    {type: "armor", amount: [1, 1], item: "raggedHood", chance: 5},
    {type: "armor", amount: [1, 1], item: "raggedGloves", chance: 5},
    {type: "armor", amount: [1, 1], item: "raggedBoots", chance: 5},
    {type: "weapon", amount: [1, 1], item: "stick", chance: 10},
    {type: "weapon", amount: [1, 1], item: "dagger", chance: 10},
    {type: "weapon", amount: [1, 1], item: "chippedAxe", chance: 8},
    {type: "gold", amount: [9, 53]}
  ]
} as any;

const chestTemplates = {
  default: {
    id: "defaultChest",
    cords: {x: 0, y: 0},
    map: 0,
    sprite: "treasureChest1",
    isUnique: false,
    respawnTime: 750,
    lootPool: "default",
    sinceOpened: -1
  }
}

class treasureChest {
  [id: string]: string | any;
  cords: tileObject;
  map: number;
  sprite: string; // Tells the game which sprite to load for the chest.
  isUnique: boolean; // Whether this chest respawns or not.
  respawnTime: number; // If it respawns, this answers when.
  lootPool: string; // Generate loot based on this.
  loot?: Array<any> // If this doesn't exist, it's created.
  gold?: any; // Just store how much gold we've rolled.
  sinceOpened?: number; // Should be -1 to indicate chest is fresh.
  lootChest?: Function;
  constructor(base: treasureChest) {
    this.id = base.id;
    this.cords = {...base.cords};
    this.map = base.map ?? 0;
    this.sprite = base.sprite ?? "treasureChest1";
    this.isUnique = base.isUnique ?? false;
    this.respawnTime = base.respawnTime ?? 500;
    this.lootPool = base.lootPool ?? "default";
    this.loot = base.loot;
    this.sinceOpened = base.sinceOpened ?? -1;

    if(!this.loot) {
      const pool = [...lootPools[this.lootPool]];
      this.loot = [];
      pool.forEach((obj: any) => {
        if (random(100, 0) <= obj.chance) {
          var itm: any;
          // @ts-ignore
          if (obj.type == "weapon") itm = new Weapon({ ...items[obj.item] });
          else if (obj.type == "armor") itm = new Armor({ ...items[obj.item] });
          this.loot.push({...itm, dataIndex: this.loot.length});
        }
        else if(obj.type == "gold") {
          let amount = random(obj.amount[1], obj.amount[0]);
          this.gold = Math.floor(amount);
        }
      });
    }

    this.lootChest = () => {
      if(this.gold > 0) {
        player.gold += this.gold;
        spawnFloatingText(this.cords, `${this.gold}G`, "gold");
        this.gold = 0;
      }
      this.loot.forEach((loot: any, index)=>{loot.dataIndex = index;})
      if(this.loot.length > 0) {
        invOpen = true;
        const _inv = document.querySelector<HTMLDivElement>(".defaultItemsArray");
        _inv.textContent = "";
        _inv.style.transform = "scale(1)";
        _inv.append(createItems(this.loot, "PICK_TREASURE", this));
      }
      else {
        this.sinceOpened = 0;
        modifyCanvas();
        closeInventory();
      } 
    }
  }
}

function lootEnemy(enemy: Enemy) {
  enemy.loot.forEach((obj: any) => {
    if (random(100, 0) <= obj.chance) {
      var itm: any;
      // @ts-ignore
      if (obj.type == "weapon") itm = new Weapon({ ...items[obj.item] });
      else if (obj.type == "armor") itm = new Armor({ ...items[obj.item] });
      createDroppedItem(enemy.cords, itm);
    }
    else if(obj.type == "gold") {
      let amount = random(obj.amount[1], obj.amount[0]);
      amount *= 1 + (enemy.level / 4.9);
      amount = Math.floor(amount);
      player.gold += amount;
      spawnFloatingText(enemy.cords, `${amount}G`, "gold");
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

function grabTreasure(e: MouseEvent, item: any, chest: treasureChest) {
  if(e.button !== 2) return;
  chest.loot.splice(item.dataIndex, 1);
  player.inventory.push(item);
  chest.lootChest();
  modifyCanvas();
}