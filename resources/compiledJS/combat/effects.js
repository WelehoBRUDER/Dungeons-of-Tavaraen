"use strict";
function spawnFloatingText(cords, text, color = "grey", fontSize = 30, ms = 800, delay = 35) {
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
function aoeCollision(area, attacker, ability) {
    var _a, _b;
    const { spriteSize, spriteLimitX, spriteLimitY, mapOffsetX, mapOffsetY, mapOffsetStartX, mapOffsetStartY } = spriteVariables();
    const effect = document.querySelector(`.${ability.aoe_effect}`);
    for (let y = 0; y < spriteLimitY; y++) {
        for (let x = 0; x < spriteLimitX; x++) {
            if (((_a = area[mapOffsetStartY + y]) === null || _a === void 0 ? void 0 : _a[mapOffsetStartX + x]) == "x") {
                baseCtx.drawImage(effect, x * spriteSize - mapOffsetX, y * spriteSize - mapOffsetY, spriteSize, spriteSize);
            }
        }
    }
    let actionText = (_b = lang[ability.id + "_action_desc_pl"]) !== null && _b !== void 0 ? _b : ability.action_desc_pl;
    displayText(`<c>cyan<c>[ACTION] <c>white<c>${actionText}`);
    maps[currentMap].enemies.forEach((en) => {
        if (area[en.cords.y][en.cords.x] == "x") {
            regularAttack(attacker, en, ability, null, true);
        }
    });
    setTimeout(modifyCanvas, 150);
    state.isSelected = false;
    state.abiSelected = {};
    if (ability.cooldown)
        ability.onCooldown = ability.cooldown + 1;
    if (ability.mana_cost)
        attacker.stats.mp -= ability.mana_cost;
}
//# sourceMappingURL=effects.js.map