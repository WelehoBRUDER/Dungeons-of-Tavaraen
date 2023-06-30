function renderMinimap(map: mapObject) {
  const miniSpriteSize = 8;
  const spriteSize = miniSpriteSize;
  minimapCanvas.width = map.base[0].length * miniSpriteSize;
  minimapCanvas.height = map.base.length * miniSpriteSize;
  minimapUpdateCanvas.width = map.base[0].length * spriteSize;
  minimapUpdateCanvas.height = map.base.length * spriteSize;
  if (!settings.toggle_minimap) {
    minimapContainer.style.display = "none";
    return;
  } else {
    minimapContainer.style.display = "block";
  }
  for (let y = 0; y < map.base.length; y++) {
    for (let x = 0; x < map.base[y].length; x++) {
      const imgId = map.base?.[y]?.[x];
      const sprite = tiles[imgId]?.spriteMap ?? { x: 128, y: 0 };
      const clutterId = map.clutter?.[y]?.[x];
      const clutterSprite = clutters[clutterId]?.spriteMap;
      if (sprite) {
        minimapCtx.drawImage(
          textureAtlas,
          sprite.x,
          sprite.y,
          128,
          128,
          x * miniSpriteSize,
          y * miniSpriteSize,
          miniSpriteSize + 1,
          miniSpriteSize + 1
        );
      }
      if (clutterSprite) {
        minimapCtx.drawImage(
          textureAtlas,
          clutterSprite.x,
          clutterSprite.y,
          128,
          128,
          x * miniSpriteSize,
          y * miniSpriteSize,
          miniSpriteSize + 1,
          miniSpriteSize + 1
        );
      }
    }
  }
  map.shrines.forEach((checkpoint: any) => {
    const shrine = document.querySelector<HTMLImageElement>(".sprites .shrineTile");
    let tileX = checkpoint.cords.x * spriteSize;
    let tileY = checkpoint.cords.y * spriteSize;
    minimapCtx?.drawImage(shrine, tileX, tileY, spriteSize, spriteSize);
  });
  map.messages.forEach((msg: any) => {
    const message = document.querySelector<HTMLImageElement>(".messageTile");
    let tileX = msg.cords.x * spriteSize;
    let tileY = msg.cords.y * spriteSize;
    minimapCtx?.drawImage(message, tileX, tileY, spriteSize, spriteSize);
  });
  /* Render Characters */
  NPCcharacters.forEach((npc: Npc) => {
    if (npc.currentMap == currentMap) {
      const charSprite = document.querySelector<HTMLImageElement>(`.sprites .${npc.sprite}`);
      let tileX = npc.currentCords.x * spriteSize;
      let tileY = npc.currentCords.y * spriteSize;
      if (charSprite) {
        minimapCtx?.drawImage(charSprite, tileX, tileY, spriteSize, spriteSize);
      }
    }
  });
}

// Found this from google, the function returns true / false depending on whether or not the canvas is empty.
// function isCanvasBlank(canvas: HTMLCanvasElement) {
//   try {
//     return !canvas.getContext('2d')
//       .getImageData(0, 0, canvas.width, canvas.height).data
//       .some(channel => channel !== 0);
//   }
//   catch (err) { }
// }

function moveMinimap() {
  // if (isCanvasBlank(minimapCanvas)) renderMinimap(maps[currentMap]);
  if (!settings.toggle_minimap) {
    minimapContainer.style.display = "none";
    return;
  } else {
    minimapContainer.style.display = "block";
  }
  const map = maps[currentMap];
  const spriteSize = 8;
  minimapUpdateCanvas.width = minimapUpdateCanvas.width;
  // map.treasureChests.forEach((chest: treasureChest) => {
  //   const lootedChest = lootedChests.find(trs => trs.cords.x == chest.cords.x && trs.cords.y == chest.cords.y && trs.map == chest.map);
  //   if (!lootedChest) {
  //     const chestSprite = document.querySelector<HTMLImageElement>(`.sprites .${chest.sprite}`);
  //     let tileX = chest.cords.x * spriteSize;
  //     let tileY = chest.cords.y * spriteSize;
  //     minimapUpdateCtx?.drawImage(chestSprite, tileX, tileY, spriteSize, spriteSize);
  //   }
  // });
  minimapCanvas.style.left = `${player.cords.x * -8 + (172 * settings["ui_scale"]) / 100}px`;
  minimapCanvas.style.top = `${player.cords.y * -8 + (112 * settings["ui_scale"]) / 100}px`;
  minimapUpdateCanvas.style.left = `${player.cords.x * -8 + (172 * settings["ui_scale"]) / 100}px`;
  minimapUpdateCanvas.style.top = `${player.cords.y * -8 + (112 * settings["ui_scale"]) / 100}px`;
}

function renderAreaMap(map: mapObject) {
  const miniSpriteSize = 11.97;
  const spriteSize = miniSpriteSize;
  areaMapCanvas.width = map.base[0].length * miniSpriteSize;
  areaMapCanvas.height = map.base.length * miniSpriteSize;
  areaMapUpdateCanvas.width = map.base[0].length * miniSpriteSize;
  areaMapUpdateCanvas.height = map.base.length * miniSpriteSize;
  for (let y = 0; y < map.base.length; y++) {
    for (let x = 0; x < map.base[y].length; x++) {
      const imgId = map.base?.[y]?.[x];
      const sprite = tiles[imgId]?.spriteMap ?? { x: 128, y: 0 };
      const clutterId = map.clutter?.[y]?.[x];
      const clutterSprite = clutters[clutterId]?.spriteMap;
      if (sprite) {
        areaMapCtx.drawImage(
          textureAtlas,
          sprite.x,
          sprite.y,
          128,
          128,
          x * miniSpriteSize,
          y * miniSpriteSize,
          miniSpriteSize + 1,
          miniSpriteSize + 1
        );
      }
      if (clutterSprite) {
        areaMapCtx.drawImage(
          textureAtlas,
          clutterSprite.x,
          clutterSprite.y,
          128,
          128,
          x * miniSpriteSize,
          y * miniSpriteSize,
          miniSpriteSize + 1,
          miniSpriteSize + 1
        );
      }
    }
  }
  map.shrines.forEach((checkpoint: any) => {
    const shrine = document.querySelector<HTMLImageElement>(".sprites .shrineTile");
    let tileX = checkpoint.cords.x * spriteSize;
    let tileY = checkpoint.cords.y * spriteSize;
    areaMapCtx?.drawImage(shrine, tileX, tileY, spriteSize, spriteSize);
  });
  map.messages.forEach((msg: any) => {
    const message = document.querySelector<HTMLImageElement>(".messageTile");
    let tileX = msg.cords.x * spriteSize;
    let tileY = msg.cords.y * spriteSize;
    areaMapCtx?.drawImage(message, tileX, tileY, spriteSize, spriteSize);
  });
  /* Render Characters */
  NPCcharacters.forEach((npc: Npc) => {
    if (npc.currentMap == currentMap) {
      const charSprite = document.querySelector<HTMLImageElement>(`.sprites .${npc.sprite}`);
      let tileX = npc.currentCords.x * spriteSize;
      let tileY = npc.currentCords.y * spriteSize;
      if (charSprite) {
        areaMapCtx?.drawImage(charSprite, tileX, tileY, spriteSize, spriteSize);
      }
    }
  });
}

function moveAreaMap() {
  //const displayLimit = areaMapCalcDisplay();
  // if (isCanvasBlank(areaMapCanvas)) renderAreaMap(maps[currentMap]);
  if (state.areaMapOpen) {
    areaMapContainer.style.display = "block";
  } else {
    areaMapContainer.style.display = "none";
  }
  const spriteSize = 11.97;
  //areaMapUpdateCanvas.width = areaMapUpdateCanvas.width;
  // maps[currentMap].treasureChests.forEach((chest: treasureChest) => {
  //   const lootedChest = lootedChests.find(trs => trs.cords.x == chest.cords.x && trs.cords.y == chest.cords.y && trs.map == chest.map);
  //   if (!lootedChest) {
  //     const chestSprite = document.querySelector<HTMLImageElement>(`.sprites .${chest.sprite}`);
  //     let tileX = chest.cords.x * spriteSize;
  //     let tileY = chest.cords.y * spriteSize;
  //     areaMapUpdateCtx?.drawImage(chestSprite, tileX, tileY, spriteSize, spriteSize);
  //   }
  // });
  areaMapCanvas.style.left = `${player.cords.x * -12 + (window.innerWidth * 0.6) / 2}px`;
  areaMapCanvas.style.top = `${player.cords.y * -12 + (window.innerHeight * 0.8) / 2}px`;
  areaMapUpdateCanvas.style.left = `${player.cords.x * -12 + (window.innerWidth * 0.6) / 2}px`;
  areaMapUpdateCanvas.style.top = `${player.cords.y * -12 + (window.innerHeight * 0.8) / 2}px`;
  // if (player.cords.y >= maps[currentMap].base.length - displayLimit.heightLimit) {
  //   areaMapCanvas.style.top = `${player.cords.y * -12 + (window.innerHeight * .8) * settings["ui_scale"] / 100}px`;
  // }
  // if (player.cords.y <= displayLimit.heightLimit) {
  //   areaMapCanvas.style.top = `${player.cords.y * -12 * settings["ui_scale"] / 100}px`;
  // }
  // if (player.cords.x >= maps[currentMap].base[0].length - displayLimit.widthLimit) {
  //   areaMapCanvas.style.left = `${player.cords.x * -12 + (window.innerWidth * .6) * settings["ui_scale"] / 100}px`;
  // }
  // if (player.cords.x <= displayLimit.widthLimit) {
  //   areaMapCanvas.style.left = `${player.cords.x * -12 * settings["ui_scale"] / 100}px`;
  // }
}

function areaMapCalcDisplay() {
  let height = 0;
  let width = 0;
  const spriteSize = 12;
  width = areaMapContainer.getBoundingClientRect().width / 2;
  height = areaMapContainer.getBoundingClientRect().height / 2;
  return { widthLimit: Math.ceil(width / spriteSize), heightLimit: Math.ceil(height / spriteSize) };
}
