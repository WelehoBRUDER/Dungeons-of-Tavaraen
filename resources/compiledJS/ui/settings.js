"use strict";
class gameSettings {
    toggle_minimap;
    hide_helmet;
    randomize_items;
    draw_wall_outlines;
    show_fps_counter;
    load_mods;
    enable_developer_console;
    hotkey_developer_console;
    hotkey_inv;
    hotkey_char;
    hotkey_perk;
    hotkey_ranged;
    hotkey_area_map;
    ui_scale;
    map_offset_x;
    map_offset_y;
    hotkey_move_up;
    hotkey_move_down;
    hotkey_move_left;
    hotkey_move_right;
    hotkey_move_right_up;
    hotkey_move_right_down;
    hotkey_move_left_up;
    hotkey_move_left_down;
    hotkey_open_world_messages;
    hotkey_interact;
    hotkey_journal;
    hotkey_codex;
    language;
    constructor(base) {
        this.log_enemy_movement = base.log_enemy_movement ?? false;
        this.toggle_minimap = base.toggle_minimap ?? true;
        this.hide_helmet = base.hide_helmet ?? false;
        this.randomize_items = base.randomize_items ?? false;
        this.draw_wall_outlines = base.draw_wall_outlines ?? true;
        this.show_fps_counter = base.show_fps_counter ?? true;
        this.load_mods = base.load_mods ?? true;
        this.enable_developer_console = base.enable_developer_console ?? false;
        this.hotkey_developer_console = base.hotkey_developer_console ?? "§";
        this.hotkey_inv = base.hotkey_inv ?? "i";
        this.hotkey_char = base.hotkey_char ?? "c";
        this.hotkey_perk = base.hotkey_perk ?? "p";
        this.hotkey_ranged = base.hotkey_ranged ?? "g";
        this.hotkey_area_map = base.hotkey_area_map ?? "m";
        this.ui_scale = base.ui_scale ?? 100;
        this.map_offset_x = base.map_offset_x ?? 0;
        this.map_offset_y = base.map_offset_x ?? 0;
        this.hotkey_move_up = base.hotkey_move_up ?? "w";
        this.hotkey_move_down = base.hotkey_move_down ?? "s";
        this.hotkey_move_left = base.hotkey_move_left ?? "a";
        this.hotkey_move_right = base.hotkey_move_right ?? "d";
        this.hotkey_move_right_up = base.hotkey_move_right_up ?? "PageUp";
        this.hotkey_move_right_down = base.hotkey_move_right_down ?? "PageDown";
        this.hotkey_move_left_up = base.hotkey_move_left_up ?? "Home";
        this.hotkey_move_left_down = base.hotkey_move_left_down ?? "End";
        this.hotkey_open_world_messages = base.hotkey_open_world_messages ?? "Enter";
        this.hotkey_interact = base.hotkey_interact ?? " ";
        this.hotkey_journal = base.hotkey_journal ?? "j";
        this.hotkey_codex = base.hotkey_codex ?? "y";
        this.language = base.language ?? "english";
    }
}
let settings = new gameSettings({
    log_enemy_movement: false,
    toggle_minimap: true,
    hide_helmet: false,
    randomize_items: true,
    draw_wall_outlines: true,
    show_fps_counter: true,
    load_mods: true,
    enable_developer_console: false,
    hotkey_developer_console: "§",
    hotkey_inv: "i",
    hotkey_char: "c",
    hotkey_perk: "p",
    hotkey_ranged: "g",
    hotkey_area_map: "m",
    ui_scale: 100,
    map_offset_x: 0,
    map_offset_y: 0,
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
    language: "english",
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