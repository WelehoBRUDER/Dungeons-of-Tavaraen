"use strict";
const maps = [
    {
        id: "tutorial_cave",
        base: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ],
        clutter: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 2, 1, 0, 2, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ],
        enemies: [
            new Enemy(Object.assign(Object.assign({}, enemies.skeletonWarrior), { cords: { x: 3, y: 10 }, spawnCords: { x: 3, y: 10 }, level: 1 })),
            new Enemy(Object.assign(Object.assign({}, enemies.norsemanBerserk), { cords: { x: 5, y: 6 }, spawnCords: { x: 5, y: 6 }, level: 2 })),
            new Enemy(Object.assign(Object.assign({}, enemies.norsemanHunter), { cords: { x: 5, y: 6 }, spawnCords: { x: 4, y: 3 }, level: 2 })),
            new Enemy(Object.assign(Object.assign({}, enemies.skeletonArcher), { cords: { x: 3, y: 7 }, spawnCords: { x: 3, y: 7 }, level: 1 })),
            new Enemy(Object.assign(Object.assign({}, enemies.skeletonMage), { cords: { x: 2, y: 5 }, spawnCords: { x: 3, y: 7 }, level: 1 })),
            new Enemy(Object.assign(Object.assign({}, enemies.greySlime), { cords: { x: 13, y: 8 }, spawnCords: { x: 13, y: 8 }, level: 1 }))
        ],
    }
];
//# sourceMappingURL=maps.js.map