/*
  EXAMPLE NPC CHARACTER
  new Npc({
    id: "exampleCharacter", Id MUST always be defined and written correctly, this will be used to link characters to their interactions!!
    sprite: "villageMan", Sprite works identically to enemies, but try to make unique ones :D
    currentMap: 0, Which map the character appears in right now
    currentCords: {x: 16, y: 74}, Where on the map the character appears right now
    conditionalMaps: [], List of maps the character will appear in the future
    conditionalCords: [] List of the places where the character will appear in
  }),
*/
const NPCcharacters = [
  new Npc({
    id: "testMerchant",
    sprite: "villageMan",
    currentMap: 0,
    currentCords: {x: 16, y: 74},
    conditionalMaps: [],
    conditionalCords: []
  }),
];