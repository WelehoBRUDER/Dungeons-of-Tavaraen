"use strict";
const menuOptions = [
    {
        id: "menu_resume",
        action: () => handleEscape(),
    },
    {
        id: "menu_save_games",
        action: () => gotoSaveMenu(),
    },
    {
        id: "menu_options",
        action: () => gotoSettingsMenu(),
    },
    {
        id: "menu_main_screen",
        action: () => gotoMainMenu(),
    },
];
const mainButtons = [
    {
        id: "menu_resume",
        action: () => closeGameMenu(false, false),
    },
    {
        id: "menu_new_game",
        action: () => characterCreation(),
    },
    {
        id: "menu_load_game",
        action: () => gotoSaveMenu(true),
    },
    {
        id: "menu_mods",
        action: () => gotoMods(),
    },
    {
        id: "menu_changelog",
        action: () => openChangelog(),
    },
    {
        id: "menu_options",
        action: () => gotoSettingsMenu(true),
    },
];
const menuSettings = [
    {
        id: "setting_log_enemy_movement",
        tooltip: "log_char_movement",
        type: "toggle",
    },
    {
        id: "setting_toggle_minimap",
        tooltip: "toggle_minimap",
        type: "toggle",
    },
    {
        id: "setting_hide_helmet",
        tooltip: "hide_helmet",
        type: "toggle",
    },
    {
        id: "setting_randomize_items",
        tooltip: "randomize_items",
        type: "toggle",
    },
    {
        id: "setting_draw_wall_outlines",
        type: "toggle",
    },
    {
        id: "setting_show_fps_counter",
        type: "toggle",
    },
    {
        id: "setting_load_mods",
        type: "toggle",
    },
    {
        id: "setting_enable_developer_console",
        tooltip: "enable_developer_console",
        type: "toggle",
    },
    {
        id: "setting_ui_scale",
        tooltip: "ui_scale",
        type: "inputSlider",
    },
    {
        id: "setting_map_offset_x",
        type: "inputSliderReduced",
    },
    {
        id: "setting_map_offset_y",
        type: "inputSliderReduced",
    },
    {
        id: "setting_hotkey_developer_console",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_inv",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_char",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_perk",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_journal",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_codex",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_area_map",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_ranged",
        tooltip: "toggle_rangedMode",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_move_up",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_move_down",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_move_left",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_move_right",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_move_right_up",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_move_right_down",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_move_left_up",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_move_left_down",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_interact",
        tooltip: "interact_help",
        type: "hotkey",
    },
    {
        id: "setting_hotkey_open_world_messages",
        tooltip: "world_messages",
        type: "hotkey",
    },
    {
        id: "setting_game_language",
        type: "languageSelection",
    },
];
//# sourceMappingURL=menu_buttons.js.map