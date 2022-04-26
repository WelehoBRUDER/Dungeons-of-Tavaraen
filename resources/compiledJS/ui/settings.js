"use strict";
class gameSettings {
    constructor(base) {
        this.log_enemy_movement = base.log_enemy_movement || false;
        this.toggle_minimap = base.toggle_minimap || true;
        this.hide_helmet = base.hide_helmet || false;
        this.randomize_items = base.randomize_items || false;
        this.hotkey_inv = base.hotkey_inv || "i";
        this.hotkey_char = base.hotkey_char || "c";
        this.hotkey_perk = base.hotkey_perk || "p";
        this.hotkey_ranged = base.hotkey_ranged || "g";
        this.hotkey_area_map = base.hotkey_area_map || "m";
        this.ui_scale = base.ui_scale || 100;
        this.hotkey_move_up = base.hotkey_move_up || "w";
        this.hotkey_move_down = base.hotkey_move_down || "s";
        this.hotkey_move_left = base.hotkey_move_left || "a";
        this.hotkey_move_right = base.hotkey_move_right || "d";
        this.hotkey_move_right_up = base.hotkey_move_right_up || "PageUp";
        this.hotkey_move_right_down = base.hotkey_move_right_down || "PageDown";
        this.hotkey_move_left_up = base.hotkey_move_left_up || "Home";
        this.hotkey_move_left_down = base.hotkey_move_left_down || "End";
        this.hotkey_open_world_messages = base.hotkey_open_world_messages || "Enter";
        this.hotkey_interact = base.hotkey_interact || " ";
        this.hotkey_journal = base.hotkey_journal || "j";
        this.hotkey_codex = base.hotkey_codex || "y";
    }
}
let settings = new gameSettings({
    log_enemy_movement: false,
    toggle_minimap: true,
    hide_helmet: false,
    randomize_items: true,
    hotkey_inv: "i",
    hotkey_char: "c",
    hotkey_perk: "p",
    hotkey_ranged: "g",
    hotkey_area_map: "m",
    ui_scale: 100,
    hotkey_move_up: "w",
    hotkey_move_down: "s",
    hotkey_move_left: "a",
    hotkey_move_right: "d",
    hotkey_move_right_up: "PageUp",
    hotkey_move_right_down: "PageDown",
    hotkey_move_left_up: "Home",
    hotkey_move_left_down: "End",
    hotkey_interact: " ",
    hotkey_open_world_messages: "Enter",
    hotkey_journal: "j",
    hotkey_codex: "y",
});
const state = {
    inCombat: false,
    clicked: false,
    isSelected: false,
    abiSelected: {},
    invOpen: false,
    charOpen: false,
    perkOpen: false,
    menuOpen: false,
    titleScreen: false,
    optionsOpen: false,
    savesOpen: false,
    displayingTextHistory: false,
    rangedMode: false,
    textWindowOpen: false,
    dialogWindow: false,
    storeOpen: false,
    smithOpen: false,
    journalOpen: false,
    codexOpen: false,
    areaMapOpen: false,
};
//# sourceMappingURL=settings.js.map