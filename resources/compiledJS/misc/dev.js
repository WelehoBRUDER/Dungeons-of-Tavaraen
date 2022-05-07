"use strict";
const CURSOR_LOCATION = {
    x: 0,
    y: 0
};
const DEVTOOLS = {
    GOD: false,
    FREE_SKILLS: false,
    PERK_NO_COST: false
};
const GAME_VERSION = 1.11.toFixed(2); // Current version of the game, just used to warn players about old saves being potetiantially broken.
const DEVMODE = false; // Whether developer mode is enabled or not.
const devBox = document.querySelector(".devInfo");
if (DEVMODE) {
    document.querySelector(".devTools").style.display = "block";
}
;
function updateDeveloperInformation() {
    let txt = "";
    devBox.textContent = "";
    const hoveredTileId = maps[currentMap].base[CURSOR_LOCATION.y][CURSOR_LOCATION.x];
    const hoveredClutterId = maps[currentMap].clutter[CURSOR_LOCATION.y][CURSOR_LOCATION.x];
    txt =
        `
  \t----|DEVELOPER TOOLS|----
  PLAYER_LOCATION: [X:${player.cords.x} Y:${player.cords.y}]
  POINTER_LOCATION: [X:${CURSOR_LOCATION.x} Y:${CURSOR_LOCATION.y}]
  TILE_HOVERED: [${tiles[hoveredTileId].name}, id: ${hoveredTileId}]
  CLUTTER_HOVERED: [${clutters[hoveredClutterId].name}, id: ${hoveredClutterId}]
  `;
    devBox.append(textSyntax(txt));
}
//# sourceMappingURL=dev.js.map