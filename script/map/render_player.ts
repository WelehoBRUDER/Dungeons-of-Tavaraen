function renderPlayerModel(size: number, canvas: HTMLCanvasElement, ctx: any) {
  canvas.width = canvas.width; // Clear canvas
  const sex = player.sex === "male" ? "" : capitalizeFirstLetter(player.sex);
  if (player.isDead) return;
  const bodyModel = <HTMLImageElement>document.querySelector(".sprites ." + player.race + "Model" + capitalizeFirstLetter(player.sex));
  const earModel = <HTMLImageElement>document.querySelector(".sprites ." + player.race + "Ears");
  const hairModel = <HTMLImageElement>document.querySelector(".sprites .hair" + player.hair);
  const eyeModel = <HTMLImageElement>document.querySelector(".sprites .eyes" + player.eyes);
  const faceModel = <HTMLImageElement>document.querySelector(".sprites .face" + player.face);

  player.statusEffects.forEach((eff: statEffect) => {
    if (eff.aura) {
      const aura = <HTMLImageElement>document.querySelector(".sprites ." + eff.aura);
      ctx?.drawImage(aura, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
    }
  });
  ctx?.drawImage(bodyModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  ctx?.drawImage(earModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  ctx?.drawImage(eyeModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  ctx?.drawImage(faceModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  if (!player.helmet?.coversHair || settings["hide_helmet"]) ctx?.drawImage(hairModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  if (player.helmet?.sprite && !settings["hide_helmet"]) {
    const helmetModel = <HTMLImageElement>document.querySelector(".sprites ." + player.helmet.sprite + sex);
    ctx?.drawImage(helmetModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
  if (player.gloves?.sprite) {
    const glovesModel = <HTMLImageElement>document.querySelector(".sprites ." + player.gloves.sprite + sex);
    ctx?.drawImage(glovesModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
  if (player.boots?.sprite) {
    const bootsModel = <HTMLImageElement>document.querySelector(".sprites ." + player.boots.sprite + sex);
    ctx?.drawImage(bootsModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
  if (!player.legs?.sprite || (sex === "Female" && !player.chest?.sprite)) {
    const leggings = <HTMLImageElement>document.querySelector(`.sprites .defaultPants${capitalizeFirstLetter(player.sex)}`);
    ctx?.drawImage(leggings, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
  if (player.legs?.sprite) {
    const leggingsModel = <HTMLImageElement>document.querySelector(".sprites ." + player.legs.sprite + sex);
    ctx?.drawImage(leggingsModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
  if (player.chest?.sprite) {
    const chestModel = <HTMLImageElement>document.querySelector(".sprites ." + player.chest.sprite + sex);
    ctx?.drawImage(chestModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
  if (player.weapon?.sprite) {
    const weaponModel = <HTMLImageElement>document.querySelector(".sprites ." + player.weapon.sprite);
    ctx?.drawImage(weaponModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
  if (player.offhand?.sprite) {
    const offhandModel = <HTMLImageElement>document.querySelector(".sprites ." + player.offhand.sprite);
    ctx?.drawImage(offhandModel, baseCanvas.width / 2 - size / 2, baseCanvas.height / 2 - size / 2, size, size);
  }
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
  var x = 0;
  var y = 0;
  if (side == "left") x = 0 - size / 4;
  ctx?.drawImage(bodyModel, x, y, size, size);
  ctx?.drawImage(earModel, x, y, size, size);
  ctx?.drawImage(eyeModel, x, y, size, size);
  ctx?.drawImage(faceModel, x, y, size, size);
  ctx?.drawImage(leggings, x, y, size, size);
  if (!playerModel.helmet?.coversHair || noClothes) ctx?.drawImage(hairModel, x, y, size, size);
  if (!noClothes) {
    if (playerModel.helmet?.sprite) {
      const helmetModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.helmet.sprite + sex);
      ctx?.drawImage(helmetModel, x, y, size, size);
    }
    if (playerModel.gloves?.sprite) {
      const glovesModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.gloves.sprite + sex);
      ctx?.drawImage(glovesModel, x, y, size, size);
    }
    if (playerModel.boots?.sprite) {
      const bootsModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.boots.sprite + sex);
      ctx?.drawImage(bootsModel, x, y, size, size);
    }
    if (!playerModel.legs?.sprite || (player.sex === "female" && !player.chest?.sprite)) {
      const leggings = <HTMLImageElement>document.querySelector(`.sprites .defaultPants${capitalizeFirstLetter(player.sex)}`);
      ctx?.drawImage(leggings, x, y, size, size);
    }
    if (playerModel.legs?.sprite) {
      const leggingsModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.legs.sprite + sex);
      ctx?.drawImage(leggingsModel, x, y, size, size);
    }

    if (playerModel.chest?.sprite) {
      const chestModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.chest.sprite + sex);
      ctx?.drawImage(chestModel, x, y, size, size);
    }
  }
  if (playerModel.weapon?.sprite) {
    const weaponModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.weapon.sprite);
    ctx?.drawImage(weaponModel, x, y, size, size);
  }
  if (playerModel.offhand?.sprite) {
    const offhandModel = <HTMLImageElement>document.querySelector(".sprites ." + playerModel.offhand.sprite);
    ctx?.drawImage(offhandModel, x, y, size, size);
  }
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