"use strict";
const staticTiles = [
    {
        name: "focus",
        img: "resources/tiles/hovering.png",
        spriteMap: { x: 0, y: 0 },
        id: 0
    },
    {
        name: "void",
        img: "resources/tiles/void.png",
        spriteMap: { x: 128, y: 0 },
        id: 1
    },
    {
        name: "fogOfWar",
        img: "resources/tiles/fog_of_war_2.png",
        spriteMap: { x: 256, y: 0 },
        id: 2
    },
    {
        name: "highlightGreen",
        img: "resources/tiles/highlight.png",
        spriteMap: { x: 384, y: 0 },
        id: 3
    },
    {
        name: "highlightRed",
        img: "resources/tiles/highlight_red.png",
        spriteMap: { x: 512, y: 0 },
        id: 4
    },
    {
        name: "highlightStripesGreen",
        img: "resources/tiles/highlight2.png",
        spriteMap: { x: 640, y: 0 },
        id: 5
    },
    {
        name: "highlightStripesRed",
        img: "resources/tiles/highlight2_red.png",
        spriteMap: { x: 768, y: 0 },
        id: 6
    },
    {
        name: "shrineInactive",
        img: "resources/tiles/shrine.png",
        spriteMap: { x: 896, y: 0 },
        id: 7
    },
    {
        name: "shrineActive",
        img: "resources/tiles/shrine_lit.png",
        spriteMap: { x: 1024, y: 0 },
        id: 8
    }
];
const tiles = [
    {
        name: "Water",
        img: "resources/tiles/water.png",
        sprite: ".tile0",
        isLedge: true,
        isWall: false,
        spriteMap: { x: 1152, y: 0 },
        id: 0
    },
    {
        name: "Grass",
        img: "resources/tiles/grass_seamless.png",
        sprite: ".tile1",
        isLedge: false,
        isWall: false,
        spriteMap: { x: 1280, y: 0 },
        id: 1
    },
    {
        name: "Dirt",
        img: "resources/tiles/dirt.png",
        sprite: ".tile2",
        isLedge: false,
        isWall: false,
        spriteMap: { x: 1408, y: 0 },
        id: 2
    },
    {
        name: "Pond",
        img: "resources/tiles/pond_water.png",
        sprite: ".tile3",
        isLedge: false,
        isWall: false,
        spriteMap: { x: 1536, y: 0 },
        id: 3
    },
    {
        name: "Gravel",
        img: "resources/tiles/gravel.png",
        sprite: ".tile4",
        isLedge: false,
        isWall: false,
        spriteMap: { x: 1664, y: 0 },
        id: 4
    },
    {
        name: "Cobble",
        img: "resources/tiles/cobble_flooring.png",
        sprite: ".tile5",
        isLedge: false,
        isWall: false,
        spriteMap: { x: 1792, y: 0 },
        id: 5
    },
    {
        name: "Dungeon Wall",
        img: "resources/tiles/dungeon_wall.png",
        sprite: ".tile6",
        isLedge: false,
        isWall: true,
        spriteMap: { x: 1920, y: 0 },
        id: 6
    },
    {
        name: "Sand",
        img: "resources/tiles/sand.png",
        sprite: ".tile7",
        isLedge: false,
        isWall: false,
        spriteMap: { x: 2048, y: 0 },
        id: 7
    },
    {
        name: "Grate",
        img: "resources/tiles/grate.png",
        sprite: ".tile8",
        isLedge: false,
        isWall: false,
        spriteMap: { x: 2176, y: 0 },
        id: 8
    },
    {
        name: "Stone",
        img: "resources/tiles/stone.png",
        sprite: ".tile9",
        isLedge: false,
        isWall: false,
        spriteMap: { x: 2304, y: 0 },
        id: 9
    },
    {
        name: "Cracked Stone",
        img: "resources/tiles/cracked_stone.png",
        sprite: ".tile10",
        isLedge: false,
        isWall: false,
        spriteMap: { x: 2432, y: 0 },
        id: 10
    },
    {
        name: "Stone Wall",
        img: "resources/tiles/stone_wall.png",
        sprite: ".tile11",
        isLedge: false,
        isWall: true,
        spriteMap: { x: 2560, y: 0 },
        id: 11
    },
    {
        name: "Void",
        img: "resources/tiles/void.png",
        sprite: ".tile0",
        isLedge: true,
        isWall: true,
        spriteMap: { x: 2816, y: 0 },
        id: 12
    },
    {
        name: "Wood",
        img: "resources/tiles/wood.png",
        isLedge: false,
        isWall: true,
        id: 13,
        spriteMap: { x: 2688, y: 0 }
    },
];
const clutters = [
    {
        name: "Nothing",
        img: "resources/tiles/void.png",
        sprite: ".tileVOID",
        isWall: false,
        spriteMap: null
    },
    {
        name: "Tree 1",
        img: "resources/tiles/tree_1.png",
        sprite: ".clutter1",
        isWall: true,
        spriteMap: { x: 2944, y: 0 },
        id: 1
    },
    {
        name: "Tree 2",
        img: "resources/tiles/tree_2.png",
        sprite: ".clutter2",
        isWall: true,
        spriteMap: { x: 0, y: 128 },
        id: 2
    },
    {
        name: "Tree 3",
        img: "resources/tiles/tree_3.png",
        sprite: ".clutter3",
        isWall: true,
        spriteMap: { x: 128, y: 128 },
        id: 3
    }
];
//# sourceMappingURL=tiles.js.map