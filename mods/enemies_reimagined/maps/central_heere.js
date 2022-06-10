const central_heere = {
  DONT_REPLACE_EXISTING: true, // Only replace properties defined in this file
  DONT_REPLACE_ENEMIES: true, // Don't remove enemies that are already defined in the game
  enemies: [
    new Enemy({
      ...enemies["norsemanBerserk"],
      cords: { x: 190, y: 26 },
      spawnCords: { x: 190, y: 26 },
      level: 1,
      isUnique: false,
      spawnMap: "central_heere",
    }),
  ],
};
