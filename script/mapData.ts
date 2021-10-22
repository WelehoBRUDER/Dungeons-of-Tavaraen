var itemData: Array<any> = [];

const once = {
  once : true
};

const lootPools = {
  default: [
    {type: "armor", amount: [1, 1], item: "raggedShirt", chance: 10},
    {type: "armor", amount: [1, 1], item: "raggedPants", chance: 10},
    {type: "armor", amount: [1, 1], item: "raggedHood", chance: 10},
    {type: "armor", amount: [1, 1], item: "raggedGloves", chance: 10},
    {type: "armor", amount: [1, 1], item: "raggedBoots", chance: 10},
    {type: "armor", amount: [1, 1], item: "woolHat", chance: 10},
    {type: "armor", amount: [1, 1], item: "woodenShield", chance: 10},
    {type: "armor", amount: [1, 1], item: "leatherChest", chance: 10},
    {type: "armor", amount: [1, 1], item: "leatherLeggings", chance: 6},
    {type: "armor", amount: [1, 1], item: "leatherBracers", chance: 6},
    {type: "armor", amount: [1, 1], item: "leatherHelmet", chance: 6},
    {type: "armor", amount: [1, 1], item: "leatherBoots", chance: 6},
    {type: "armor", amount: [1, 1], item: "ironHelmet", chance: 2},
    {type: "weapon", amount: [1, 1], item: "stick", chance: 20},
    {type: "weapon", amount: [1, 1], item: "dagger", chance: 20},
    {type: "weapon", amount: [1, 1], item: "chippedAxe", chance: 16},
    {type: "weapon", amount: [1, 1], item: "huntingBow", chance: 16},
    {type: "weapon", amount: [1, 1], item: "apprenticeWand", chance: 16},
    {type: "artifact", amount: [1, 1], item: "talismanOfProtection", chance: 8},
    {type: "artifact", amount: [1, 1], item: "ringOfProtection", chance: 8},
    {type: "artifact", amount: [1, 1], item: "emblemOfProtection", chance: 8},
    {type: "artifact", amount: [1, 1], item: "scholarsTalisman", chance: 8},
    {type: "artifact", amount: [1, 1], item: "scholarsRing", chance: 8},
    {type: "artifact", amount: [1, 1], item: "scholarsEmblem", chance: 8},
    {type: "artifact", amount: [1, 1], item: "warriorsTalisman", chance: 8},
    {type: "artifact", amount: [1, 1], item: "warriorsRing", chance: 8},
    {type: "artifact", amount: [1, 1], item: "warriorsEmblem", chance: 8},
    {type: "artifact", amount: [1, 1], item: "loneShadesTalisman", chance: 8},
    {type: "artifact", amount: [1, 1], item: "loneShadesRing", chance: 8},
    {type: "artifact", amount: [1, 1], item: "loneShadesEmblem", chance: 8},
    {type: "gold", amount: [13, 76]}
  ],
  lichLoot: [
    {type: "weapon", amount: [1, 1], item: "apprenticeWand", chance: 100},
    {type: "armor", amount: [1, 1], item: "lichRobes", chance: 100},
    {type: "armor", amount: [1, 1], item: "crownOfWisdom", chance: 100},
    {type: "gold", amount: [180, 250]}
  ],
  knightLoot: [
    {type: "armor", amount: [1, 1], item: "ironShield", chance: 100},
    {type: "armor", amount: [1, 1], item: "ironHelmet", chance: 100},
    {type: "armor", amount: [1, 1], item: "ironArmor", chance: 100},
    {type: "armor", amount: [1, 1], item: "ironLegplates", chance: 100},
    {type: "armor", amount: [1, 1], item: "ironGauntlets", chance: 100},
    {type: "armor", amount: [1, 1], item: "ironBoots", chance: 100},
    {type: "gold", amount: [300, 500]}
  ],
} as any;

let lootedChests: Array<any> = [];

const chestTemplates = {
  default: {
    id: "defaultChest",
    cords: {x: 0, y: 0},
    map: 0,
    sprite: "treasureChest1",
    isUnique: false,
    respawnTime: 750,
    lootPool: "default",
    itemsGenerate: [1, 7],
    sinceOpened: -1
  },
  lichChest: {
    id: "lichChest",
    cords: {x: 0, y: 0},
    map: 0,
    sprite: "treasureChestMagical",
    isUnique: false,
    respawnTime: 1000,
    lootPool: "lichLoot",
    itemsGenerate: [2, 3],
    sinceOpened: -1
  },
  knightChest: {
    id: "knightChest",
    cords: {x: 0, y: 0},
    map: 0,
    sprite: "treasureChest2",
    isUnique: false,
    respawnTime: 1000,
    lootPool: "knightLoot",
    itemsGenerate: [5, 6],
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
  itemsGenerate?: Array<number> // Set min and max items to generate, eg. [1, 5]
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
    this.itemsGenerate = base.itemsGenerate;
    this.sinceOpened = base.sinceOpened ?? -1;

    if(!this.loot) {
      const pool = [...lootPools[this.lootPool]];
      const min = this.itemsGenerate[0];
      const max = this.itemsGenerate[1];
      this.loot = [];
      pool.forEach((obj: any) => {
        if (random(100, 0) <= obj.chance) {
          var itm: any;
          // @ts-ignore
          if (obj.type == "weapon") itm = new Weapon({ ...items[obj.item] });
          else if (obj.type == "armor") itm = new Armor({ ...items[obj.item] });
          else if (obj.type == "artifact") itm = new Artifact({ ...items[obj.item] });
          else if (obj.type == "consumable") itm = new Consumable({ ...items[obj.item] });
          if(this.loot.length < max) this.loot.push({...itm, dataIndex: this.loot.length});
        }
        else if(obj.type == "gold") {
          let amount = random(obj.amount[1], obj.amount[0]);
          this.gold = Math.floor(amount);
        }
      });
      if(this.loot.length < min) {
        let obj = pool[Math.floor(random(pool.length-2, 0))];
        let itm: any;
        if (obj.type == "weapon") itm = new Weapon({ ...items[obj.item] });
        else if (obj.type == "armor") itm = new Armor({ ...items[obj.item] });
        else if (obj.type == "artifact") itm = new Artifact({ ...items[obj.item] });
        else if (obj.type == "consumable") itm = new Consumable({ ...items[obj.item] });
        this.loot.push({...itm, dataIndex: this.loot.length});
      }
    }

    this.lootChest = () => {
      if(this.gold > 0) {
        player.gold += this.gold;
        spawnFloatingText(this.cords, `${this.gold}G`, "gold");
        this.gold = 0;
      }
      this.loot.forEach((loot: any, index)=>{loot.dataIndex = index;});
      if(this.loot.length > 0) {
        state.invOpen = true;
        const _inv = document.querySelector<HTMLDivElement>(".defaultItemsArray");
        _inv.textContent = "";
        _inv.style.transform = "scale(1)";
        _inv.append(createItems(this.loot, "PICK_TREASURE", this));
        document.body.addEventListener("keyup", e => fastGrabTreasure(e, this), once);
      }
      else {
        lootedChests.push({cords: {...this.cords}, sinceOpened: 0, map: this.map});
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
      else if (obj.type == "artifact") itm = new Artifact({ ...items[obj.item] });
      else if (obj.type == "consumable") itm = new Consumable({ ...items[obj.item] });
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
    state.invOpen = true;
    const _inv = document.querySelector<HTMLDivElement>(".defaultItemsArray");
    _inv.textContent = "";
    _inv.style.transform = "scale(1)";
    _inv.append(createItems(totalArray, "PICK_LOOT"));
    document.body.addEventListener("keyup", e => fastGrabLoot(e, totalArray), once);
  }
  else closeInventory();
}

function grabLoot(e: MouseEvent, item: any, index: number) {
  if(e.button !== 2) return;
  itemData.splice(index, 1);
  player.inventory.push(item);
  pickLoot();
  modifyCanvas();
}

function fastGrabLoot(e: KeyboardEvent, totalArray: Array<any>) {
  if(e.key !== settings.hotkey_interact) return;
  let item = totalArray[0];
  itemData.splice(item.dataIndex, 1);
  player.inventory.push(item);
  pickLoot();
  modifyCanvas();
}

function grabTreasure(e: MouseEvent, item: any, chest: treasureChest, index: number) {
  if(e.button !== 2) return;
  chest.loot.splice(index, 1);
  player.inventory.push(item);
  chest.lootChest();
  modifyCanvas();
}

function fastGrabTreasure(e: KeyboardEvent, chest: treasureChest) {
  if(e.key !== settings.hotkey_interact) return;
  player.inventory.push({...chest.loot[0]});
  chest.loot.splice(0, 1);
  chest.lootChest();
  modifyCanvas();
}