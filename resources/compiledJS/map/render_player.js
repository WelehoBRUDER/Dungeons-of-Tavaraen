"use strict";
function renderPlayerModel(size, canvas, ctx) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    canvas.width = canvas.width; // Clear canvas
    const sex = player.sex === "male" ? "" : capitalizeFirstLetter(player.sex);
    if (player.isDead)
        return;
    const bodyModel = document.querySelector(".sprites ." + player.race + "Model" + capitalizeFirstLetter(player.sex));
    const earModel = document.querySelector(".sprites ." + player.race + "Ears");
    const hairModel = document.querySelector(".sprites .hair" + player.hair);
    const eyeModel = document.querySelector(".sprites .eyes" + player.eyes);
    const faceModel = document.querySelector(".sprites .face" + player.face);
    const posX = baseCanvas.width / 2 - size / 2 + (size * settings.map_offset_x);
    const posY = baseCanvas.height / 2 - size / 2 + (size * settings.map_offset_y);
    player.statusEffects.forEach((eff) => {
        if (eff.aura) {
            const aura = document.querySelector(".sprites ." + eff.aura);
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(aura, posX, posY, size, size);
        }
    });
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(bodyModel, posX, posY, size, size);
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(earModel, posX, posY, size, size);
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(eyeModel, posX, posY, size, size);
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(faceModel, posX, posY, size, size);
    if (!((_a = player.helmet) === null || _a === void 0 ? void 0 : _a.coversHair) || settings["hide_helmet"])
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hairModel, posX, posY, size, size);
    try {
        if (((_b = player.helmet) === null || _b === void 0 ? void 0 : _b.sprite) && !settings["hide_helmet"]) {
            const helmetModel = sex === "Female" ? player.helmet.equippedSpriteFemale : player.helmet.equippedSprite;
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(textureAtlas, helmetModel.x, helmetModel.y, 128, 128, posX, posY, size, size);
        }
        if ((_c = player.gloves) === null || _c === void 0 ? void 0 : _c.sprite) {
            const glovesModel = sex === "Female" ? player.gloves.equippedSpriteFemale : player.gloves.equippedSprite;
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(textureAtlas, glovesModel.x, glovesModel.y, 128, 128, posX, posY, size, size);
        }
        if ((_d = player.boots) === null || _d === void 0 ? void 0 : _d.sprite) {
            const bootsModel = sex === "Female" ? player.boots.equippedSpriteFemale : player.boots.equippedSprite;
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(textureAtlas, bootsModel.x, bootsModel.y, 128, 128, posX, posY, size, size);
        }
        if (!((_e = player.legs) === null || _e === void 0 ? void 0 : _e.sprite) || (sex === "Female" && !((_f = player.chest) === null || _f === void 0 ? void 0 : _f.sprite))) {
            const leggings = document.querySelector(`.sprites .defaultPants${capitalizeFirstLetter(player.sex)}`);
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(leggings, posX, posY, size, size);
        }
        if ((_g = player.legs) === null || _g === void 0 ? void 0 : _g.sprite) {
            const leggingsModel = sex === "Female" ? player.legs.equippedSpriteFemale : player.legs.equippedSprite;
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(textureAtlas, leggingsModel.x, leggingsModel.y, 128, 128, posX, posY, size, size);
        }
        if ((_h = player.chest) === null || _h === void 0 ? void 0 : _h.sprite) {
            const chestModel = sex === "Female" ? player.chest.equippedSpriteFemale : player.chest.equippedSprite;
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(textureAtlas, chestModel.x, chestModel.y, 128, 128, posX, posY, size, size);
        }
        if ((_j = player.weapon) === null || _j === void 0 ? void 0 : _j.sprite) {
            const weaponModel = player.weapon.equippedSprite;
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(textureAtlas, weaponModel.x, weaponModel.y, 128, 128, posX, posY, size, size);
        }
        if ((_k = player.offhand) === null || _k === void 0 ? void 0 : _k.sprite) {
            const offhandModel = player.offhand.equippedSprite;
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(textureAtlas, offhandModel.x, offhandModel.y, 128, 128, posX, posY, size, size);
        }
    }
    catch (e) { }
}
function renderPlayerOutOfMap(size, canvas, ctx, side = "center", playerModel = player, noClothes = false) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    canvas.width = canvas.width; // Clear canvas
    const sex = playerModel.sex === "male" ? "" : capitalizeFirstLetter(playerModel.sex);
    const bodyModel = document.querySelector(".sprites ." + playerModel.race + "Model" + capitalizeFirstLetter(playerModel.sex));
    const earModel = document.querySelector(".sprites ." + playerModel.race + "Ears");
    const hairModel = document.querySelector(".sprites .hair" + playerModel.hair);
    const eyeModel = document.querySelector(".sprites .eyes" + playerModel.eyes);
    const faceModel = document.querySelector(".sprites .face" + playerModel.face);
    const leggings = document.querySelector(`.sprites .defaultPants${capitalizeFirstLetter(player.sex)}`);
    let x = 0;
    let y = 0;
    if (side == "left")
        x = 0 - size / 4;
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(bodyModel, x, y, size, size);
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(earModel, x, y, size, size);
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(eyeModel, x, y, size, size);
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(faceModel, x, y, size, size);
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(leggings, x, y, size, size);
    if (!((_a = playerModel.helmet) === null || _a === void 0 ? void 0 : _a.coversHair) || noClothes)
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(hairModel, x, y, size, size);
    try {
        if (!noClothes) {
            if (((_b = playerModel.helmet) === null || _b === void 0 ? void 0 : _b.sprite) && !settings["hide_helmet"]) {
                const helmetModel = sex === "Female" ? items[playerModel.helmet.id].equippedSpriteFemale : items[playerModel.helmet.id].equippedSprite;
                ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(textureAtlas, helmetModel.x, helmetModel.y, 128, 128, x, y, size, size);
            }
            if ((_c = playerModel.gloves) === null || _c === void 0 ? void 0 : _c.sprite) {
                const glovesModel = sex === "Female" ? items[playerModel.gloves.id].equippedSpriteFemale : items[playerModel.gloves.id].equippedSprite;
                ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(textureAtlas, glovesModel.x, glovesModel.y, 128, 128, x, y, size, size);
            }
            if ((_d = playerModel.boots) === null || _d === void 0 ? void 0 : _d.sprite) {
                const bootsModel = sex === "Female" ? items[playerModel.boots.id].equippedSpriteFemale : items[playerModel.boots.id].equippedSprite;
                ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(textureAtlas, bootsModel.x, bootsModel.y, 128, 128, x, y, size, size);
            }
            if (!((_e = playerModel.legs) === null || _e === void 0 ? void 0 : _e.sprite) || (sex === "Female" && !((_f = playerModel.chest) === null || _f === void 0 ? void 0 : _f.sprite))) {
                const leggings = document.querySelector(`.sprites .defaultPants${capitalizeFirstLetter(playerModel.sex)}`);
                ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(leggings, x, y, size, size);
            }
            if ((_g = playerModel.legs) === null || _g === void 0 ? void 0 : _g.sprite) {
                const leggingsModel = sex === "Female" ? items[playerModel.legs.id].equippedSpriteFemale : items[playerModel.legs.id].equippedSprite;
                ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(textureAtlas, leggingsModel.x, leggingsModel.y, 128, 128, x, y, size, size);
            }
            if ((_h = playerModel.chest) === null || _h === void 0 ? void 0 : _h.sprite) {
                const chestModel = sex === "Female" ? items[playerModel.chest.id].equippedSpriteFemale : items[playerModel.chest.id].equippedSprite;
                ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(textureAtlas, chestModel.x, chestModel.y, 128, 128, x, y, size, size);
            }
            if ((_j = playerModel.weapon) === null || _j === void 0 ? void 0 : _j.sprite) {
                const weaponModel = items[playerModel.weapon.id].equippedSprite;
                ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(textureAtlas, weaponModel.x, weaponModel.y, 128, 128, x, y, size, size);
            }
            if ((_k = playerModel.offhand) === null || _k === void 0 ? void 0 : _k.sprite) {
                const offhandModel = items[playerModel.offhand.id].equippedSprite;
                ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(textureAtlas, offhandModel.x, offhandModel.y, 128, 128, x, y, size, size);
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
function renderNPCOutOfMap(size, canvas, ctx, npc, side = "center") {
    canvas.width = canvas.width; // Clear canvas
    const sprite = document.querySelector(".sprites ." + npc.sprite);
    var x = 0;
    var y = 0;
    if (side == "left")
        x = 0 - size / 4;
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(sprite, x, y, size, size);
}
//# sourceMappingURL=render_player.js.map