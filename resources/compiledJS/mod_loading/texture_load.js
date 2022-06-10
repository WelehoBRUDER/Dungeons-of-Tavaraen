"use strict";
const texturesPerRow = 15;
const textureAtlas = document.querySelector(".texture-sheet");
const textureAtlasCtx = textureAtlas.getContext("2d");
async function loadTextures() {
    const textures = await getTextures();
    textureAtlas.width = texturesPerRow * 128;
    textureAtlas.height = textures.length * 128;
    textures.map(async (row, y) => {
        row.map(async (texture, x) => {
            const img = new Image();
            img.src = await texture.src;
            img.onload = async () => {
                textureAtlasCtx.drawImage(img, x * 128, y * 128, 128, 128);
            };
        });
    });
    return new Promise((resolve) => {
        resolve(true);
    });
}
/* ¯\_(ツ)_/¯ */
async function getTextures() {
    const textures = [[]];
    let perRow = 0;
    Object.values(staticTiles).forEach(({ img }, id) => {
        staticTiles[id].spriteMap = {
            x: perRow * 128 > 1920 ? 0 : perRow * 128,
            y: perRow * 128 > 1920
                ? textures.length * 128
                : (textures.length - 1) * 128,
        };
        addTexture(img);
    });
    Object.values(tiles).forEach(({ img }, id) => {
        tiles[id].spriteMap = {
            x: perRow * 128 > 1920 ? 0 : perRow * 128,
            y: perRow * 128 > 1920
                ? textures.length * 128
                : (textures.length - 1) * 128,
        };
        addTexture(img);
    });
    Object.values(clutters).forEach(({ img }, id) => {
        clutters[id].spriteMap = {
            x: perRow * 128 > 1920 ? 0 : perRow * 128,
            y: perRow * 128 > 1920
                ? textures.length * 128
                : (textures.length - 1) * 128,
        };
        addTexture(img);
    });
    Object.values(enemies).forEach(({ id, img }, index) => {
        enemies[id].spriteMap = {
            x: perRow * 128 > 1920 ? 0 : perRow * 128,
            y: perRow * 128 > 1920
                ? textures.length * 128
                : (textures.length - 1) * 128,
        };
        addTexture(img);
    });
    Object.values(summons).forEach(({ id, img }) => {
        summons[id].spriteMap = {
            x: perRow * 128 > 1920 ? 0 : perRow * 128,
            y: perRow * 128 > 1920
                ? textures.length * 128
                : (textures.length - 1) * 128,
        };
        addTexture(img);
    });
    Object.values(items).forEach(({ id, img, sprite, type, slot }) => {
        items[id].spriteMap = {
            x: perRow * 128 > 1920 ? 0 : perRow * 128,
            y: perRow * 128 > 1920
                ? textures.length * 128
                : (textures.length - 1) * 128,
        };
        addTexture(img);
        if (type === "weapon" || slot === "offhand") {
            items[id].equippedSprite = {
                x: perRow * 128 > 1920 ? 0 : perRow * 128,
                y: perRow * 128 > 1920
                    ? textures.length * 128
                    : (textures.length - 1) * 128,
            };
            addTexture(sprite);
        }
        else if (type === "armor") {
            items[id].equippedSprite = {
                x: perRow * 128 > 1920 ? 0 : perRow * 128,
                y: perRow * 128 > 1920
                    ? textures.length * 128
                    : (textures.length - 1) * 128,
            };
            addTexture(sprite);
            items[id].equippedSpriteFemale = {
                x: perRow * 128 > 1920 ? 0 : perRow * 128,
                y: perRow * 128 > 1920
                    ? textures.length * 128
                    : (textures.length - 1) * 128,
            };
            addTexture(sprite.replace(".", "_female."));
        }
    });
    function addTexture(src) {
        if (perRow > texturesPerRow) {
            textures.push([]);
            perRow = 0;
        }
        //@ts-ignore
        textures[textures.length - 1].push({ src: src });
        return perRow++;
    }
    return textures;
}
//# sourceMappingURL=texture_load.js.map