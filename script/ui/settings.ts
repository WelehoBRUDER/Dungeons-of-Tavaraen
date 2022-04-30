class gameSettings {
  [log_enemy_movement: string]: boolean | any;
  toggle_minimap: boolean;
  hide_helmet: boolean;
  randomize_items: boolean;
  draw_wall_outlines: boolean;
  hotkey_inv: string;
  hotkey_char: string;
  hotkey_perk: string;
  hotkey_ranged: string;
  hotkey_area_map: string;
  ui_scale: number;
  map_offset_x: number;
  map_offset_y: number;
  hotkey_move_up: string;
  hotkey_move_down: string;
  hotkey_move_left: string;
  hotkey_move_right: string;
  hotkey_move_right_up: string;
  hotkey_move_right_down: string;
  hotkey_move_left_up: string;
  hotkey_move_left_down: string;
  hotkey_open_world_messages: string;
  hotkey_interact: string;
  hotkey_journal: string;
  hotkey_codex: string;
  constructor(base: gameSettings) {
    this.log_enemy_movement = base.log_enemy_movement || false;
    this.toggle_minimap = base.toggle_minimap || true;
    this.hide_helmet = base.hide_helmet || false;
    this.randomize_items = base.randomize_items || false;
    this.draw_wall_outlines = base.draw_wall_outlines || true;
    this.hotkey_inv = base.hotkey_inv || "i";
    this.hotkey_char = base.hotkey_char || "c";
    this.hotkey_perk = base.hotkey_perk || "p";
    this.hotkey_ranged = base.hotkey_ranged || "g";
    this.hotkey_area_map = base.hotkey_area_map || "m";
    this.ui_scale = base.ui_scale || 100;
    this.map_offset_x = base.map_offset_x || 0;
    this.map_offset_y = base.map_offset_x || 0;
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
  draw_wall_outlines: true,
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
});

const state = {
  inCombat: false as boolean,
  clicked: false as boolean,
  isSelected: false as boolean,
  abiSelected: {} as any,
  invOpen: false as boolean,
  charOpen: false as boolean,
  perkOpen: false as boolean,
  menuOpen: false as boolean,
  titleScreen: false as boolean,
  optionsOpen: false as boolean,
  savesOpen: false as boolean,
  displayingTextHistory: false as boolean,
  rangedMode: false as boolean,
  textWindowOpen: false as boolean,
  dialogWindow: false as boolean,
  storeOpen: false as boolean,
  smithOpen: false as boolean,
  journalOpen: false as boolean,
  codexOpen: false as boolean,
  areaMapOpen: false as boolean,
};