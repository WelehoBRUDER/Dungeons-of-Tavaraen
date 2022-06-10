function renderPlayerModel(size: number, canvas: HTMLCanvasElement, ctx: any) {
  canvas.width = canvas.width; // Clear canvas
  const sex = player.sex === "male" ? "" : capitalizeFirstLetter(player.sex);
  if (player.isDead) return;
  const bodyModel = <HTMLImageElement>document.querySelector(".sprites ." + player.race + "Model" + capitalizeFirstLetter(player.sex));
  const earModel = <HTMLImageElement>document.querySelector(".sprites ." + player.race + "Ears");
  const hairModel = <HTMLImageElement>document.querySelector(".sprites .hair" + player.hair);
  const eyeModel = <HTMLImageElement>document.querySelector(".sprites .eyes" + player.eyes);
  const faceModel = <HTMLImageElement>document.querySelector(".sprites .face" + player.face);
  const posX = baseCanvas.width / 2 - size / 2 + (size * settings.map_offset_x);
  const posY = baseCanvas.height / 2 - size / 2 + (size * settings.map_offset_y);
  player.statusEffects.forEach((eff: statEffect) => {
    if (eff.aura) {
      const aura = <HTMLImageElement>document.querySelector(".sprites ." + eff.aura);
      ctx?.drawImage(aura, posX, posY, size, size);
    }
  });
  ctx?.drawImage(bodyModel, posX, posY, size, size);
  ctx?.drawImage(earModel, posX, posY, size, size);
  ctx?.drawImage(eyeModel, posX, posY, size, size);
  ctx?.drawImage(faceModel, posX, posY, size, size);
  if (!player.helmet?.coversHair || settings["hide_helmet"]) ctx?.drawImage(hairModel, posX, posY, size, size);
  try {
    if (player.helmet?.sprite && !settings["hide_helmet"]) {
      const helmetModel = sex === "Female" ? player.helmet.equippedSpriteFemale : player.helmet.equippedSprite;
      ctx?.drawImage(textureAtlas, helmetModel.x, helmetModel.y, 128, 128, posX, posY, size, size);
    }
    if (player.gloves?.sprite) {
      const glovesModel = sex === "Female" ? player.gloves.equippedSpriteFemale : player.gloves.equippedSprite;
      ctx?.drawImage(textureAtlas, glovesModel.x, glovesModel.y, 128, 128, posX, posY, size, size);
    }
    if (player.boots?.sprite) {
      const bootsModel = sex === "Female" ? player.boots.equippedSpriteFemale : player.boots.equippedSprite;
      ctx?.drawImage(textureAtlas, bootsModel.x, bootsModel.y, 128, 128, posX, posY, size, size);
    }
    if (!player.legs?.sprite || (sex === "Female" && !player.chest?.sprite)) {
      const leggings = <HTMLImageElement>document.querySelector(`.sprites .defaultPants${capitalizeFirstLetter(player.sex)}`);
      ctx?.drawImage(leggings, posX, posY, size, size);
    }
    if (player.legs?.sprite) {
      const leggingsModel = sex === "Female" ? player.legs.equippedSpriteFemale : player.legs.equippedSprite;
      ctx?.drawImage(textureAtlas, leggingsModel.x, leggingsModel.y, 128, 128, posX, posY, size, size);
    }
    if (player.chest?.sprite) {
      const chestModel = sex === "Female" ? player.chest.equippedSpriteFemale : player.chest.equippedSprite;
      ctx?.drawImage(textureAtlas, chestModel.x, chestModel.y, 128, 128, posX, posY, size, size);
    }
    if (player.weapon?.sprite) {
      const weaponModel = player.weapon.equippedSprite;
      ctx?.drawImage(textureAtlas, weaponModel.x, weaponModel.y, 128, 128, posX, posY, size, size);
    }
    if (player.offhand?.sprite) {
      const offhandModel = player.offhand.equippedSprite;
      ctx?.drawImage(textureAtlas, offhandModel.x, offhandModel.y, 128, 128, posX, posY, size, size);
    }
  }
  catch (e) { }
}


function renderPlayerOutOfMap(size: number, canvas: HTMLCanvasElement, ctx: any, side: string = "center", playerModel: any = player, noClothes: boolean = false) {
  canvas.width = canvas.width; // Clear canvas
  const sex = playerModel.sex === "male" ? "" : capitalizeFirstLetter(playerModel.sex);
  const bodyModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.race + "Model" + capitalizeFirstLetter(playerModel.sex));
  const earModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.race + "Ears");
  const hairModel = <HTMLImageElement>document.querySelector(".sprites .hair" + playerModel.hair);
  const eyeModel = <HTMLImageElement>document.querySelector(".sprites .eyes" + playerModel.eyes);
  const faceModel = <HTMLImageElement>document.querySelector(".sprites .face" + playerModel.face);
  const leggings = <HTMLImageElement>document.querySelector(`.sprites .defaultPants${capitalizeFirstLetter(player.sex)}`);
  let x = 0;
  let y = 0;
  if (side == "left") x = 0 - size / 4;
  ctx?.drawImage(bodyModel, x, y, size, size);
  ctx?.drawImage(earModel, x, y, size, size);
  ctx?.drawImage(eyeModel, x, y, size, size);
  ctx?.drawImage(faceModel, x, y, size, size);
  ctx?.drawImage(leggings, x, y, size, size);
  if (!playerModel.helmet?.coversHair || noClothes) ctx?.drawImage(hairModel, x, y, size, size);
  try {
    if (!noClothes) {
      if (playerModel.helmet?.sprite && !settings["hide_helmet"]) {
        const helmetModel = sex === "Female" ? items[playerModel.helmet.id].equippedSpriteFemale : items[playerModel.helmet.id].equippedSprite;
        ctx?.drawImage(textureAtlas, helmetModel.x, helmetModel.y, 128, 128, x, y, size, size);
      }
      if (playerModel.gloves?.sprite) {
        const glovesModel = sex === "Female" ? items[playerModel.gloves.id].equippedSpriteFemale : items[playerModel.gloves.id].equippedSprite;
        ctx?.drawImage(textureAtlas, glovesModel.x, glovesModel.y, 128, 128, x, y, size, size);
      }
      if (playerModel.boots?.sprite) {
        const bootsModel = sex === "Female" ? items[playerModel.boots.id].equippedSpriteFemale : items[playerModel.boots.id].equippedSprite;
        ctx?.drawImage(textureAtlas, bootsModel.x, bootsModel.y, 128, 128, x, y, size, size);
      }
      if (!playerModel.legs?.sprite || (sex === "Female" && !playerModel.chest?.sprite)) {
        const leggings = <HTMLImageElement>document.querySelector(`.sprites .defaultPants${capitalizeFirstLetter(playerModel.sex)}`);
        ctx?.drawImage(leggings, x, y, size, size);
      }
      if (playerModel.legs?.sprite) {
        const leggingsModel = sex === "Female" ? items[playerModel.legs.id].equippedSpriteFemale : items[playerModel.legs.id].equippedSprite;
        ctx?.drawImage(textureAtlas, leggingsModel.x, leggingsModel.y, 128, 128, x, y, size, size);
      }
      if (playerModel.chest?.sprite) {
        const chestModel = sex === "Female" ? items[playerModel.chest.id].equippedSpriteFemale : items[playerModel.chest.id].equippedSprite;
        ctx?.drawImage(textureAtlas, chestModel.x, chestModel.y, 128, 128, x, y, size, size);
      }
      if (playerModel.weapon?.sprite) {
        const weaponModel = items[playerModel.weapon.id].equippedSprite;
        ctx?.drawImage(textureAtlas, weaponModel.x, weaponModel.y, 128, 128, x, y, size, size);
      }
      if (playerModel.offhand?.sprite) {
        const offhandModel = items[playerModel.offhand.id].equippedSprite;
        ctx?.drawImage(textureAtlas, offhandModel.x, offhandModel.y, 128, 128, x, y, size, size);
      }
    }
  }
  catch (e) { }
}

function renderPlayerPortrait() {
  const portrait = document.createElement("div");
  const canvas = document.createElement("canvas");
  canvas.width = 512 * (settings["ui_scale"] / 100);
  canvas.height = 512 * (settings["ui_scale"] / 100);
  const ctx = canvas.getContext("2d");
  portrait.classList.add("playerPortrait");
  renderPlayerOutOfMap(512 * (settings["ui_scale"] / 100), canvas, ctx, "left");
  portrait.append(canvas);
  return portrait;
}

function renderNPCOutOfMap(size: number, canvas: HTMLCanvasElement, ctx: any, npc: Npc, side: string = "center") {
  canvas.width = canvas.width; // Clear canvas
  const sprite = <HTMLImageElement>document.querySelector(".sprites ." + npc.sprite);
  var x = 0;
  var y = 0;
  if (side == "left") x = 0 - size / 4;
  ctx?.drawImage(sprite, x, y, size, size);
}