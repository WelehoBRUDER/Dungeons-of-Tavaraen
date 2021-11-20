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
const DEVMODE = false; // Whether developer mode is enabled or not.
const devBox = document.querySelector(".devInfo");
if (DEVMODE) {
    document.querySelector(".devTools").style.display = "block";
}
;
function updateDeveloperInformation() {
    let txt = "";
    devBox.textContent = "";
    txt =
        `
  PLAYER_LOCATION: [X:${player.cords.x} Y:${player.cords.y}]
  POINTER_LOCATION: [X:${CURSOR_LOCATION.x} Y:${CURSOR_LOCATION.y}]
  `;
    // @ts-expect-error
    devBox.append(textSyntax(txt));
}
function roundFloat(value, decimals = 2) {
    let rounded = Math.pow(10, decimals);
    return +(Math.round(value * rounded) / rounded).toFixed(decimals);
}
//# sourceMappingURL=dev.js.map