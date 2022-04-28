function spawnFloatingText(cords: tileObject, text: string, color: string = "grey", fontSize: number = 30, ms: number = 800, delay: number = 35) {
  const { screenX: x, screenY: y } = tileCordsToScreen(cords);
  const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
  setTimeout(() => {
    const floatingText = document.createElement("p");
    floatingText.textContent = text;
    floatingText.style.fontSize = `${fontSize}px`;
    floatingText.style.color = color;
    floatingText.style.background = "rgba(50, 50, 50, 0.25)";
    floatingText.style.padding = "2px";
    floatingText.style.borderRadius = "5px";
    floatingText.style.textShadow = `0 0 12px ${color}`;
    floatingText.style.left = `${x - spriteSize / 2.5 + spriteSize / (helper.random(2.5, 0.5))}px`;
    floatingText.style.top = `${y + spriteSize / (helper.random(4, 1))}px`;
    floatingText.classList.add("floatingText");
    floatingText.style.animationDuration = `${ms / 1000}s`;
    document.body.append(floatingText);
    setTimeout(() => {
      document.body.removeChild(floatingText);
    }, ms);
  }, delay);

}

function aoeCollision(area: Array<any>, attacker: characterObject, ability: ability) {
  const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
  const effect = document.querySelector<HTMLImageElement>(`.${ability.aoe_effect}`);
  for (let y = 0; y < spriteLimitY; y++) {
    for (let x = 0; x < spriteLimitX; x++) {
      if (area[mapOffsetStartY + y]?.[mapOffsetStartX + x] == "x") {
        baseCtx.drawImage(effect, x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, spriteSize, spriteSize);
      }
    }
  }
  let actionText: string = lang[ability.id + "_action_desc_pl"] ?? ability.action_desc_pl;
  displayText(`<c>cyan<c>[ACTION] <c>white<c>${actionText}`);
  maps[currentMap].enemies.forEach((en: any) => {
    if (area[en.cords.y][en.cords.x] == "x") {
      regularAttack(attacker, en, ability, null, true);
    }
  });
  setTimeout(modifyCanvas, 150);
  state.isSelected = false;
  state.abiSelected = {};
  if (ability.cooldown) ability.onCooldown = ability.cooldown + 1;
  if (ability.mana_cost) attacker.stats.mp -= ability.mana_cost;
}