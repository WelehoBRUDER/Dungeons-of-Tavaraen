/*
  EXAMPLE NPC CHARACTER
  new Npc({
    id: "exampleCharacter", Id MUST always be defined and written correctly, this will be used to link characters to their interactions!!
    sprite: "villageMan", Sprite works identically to enemies, but try to make unique ones :D
    greeting: "generic", Greeting is the id of the opening dialog displayed when speaking to this character, before choosing any dialog options.
    pronounSet: "neutral", He/She/They, obviosly does not apply to Finnish.
    currentMap: "cave_of_awakening", Which map the character appears in right now
    currentCords: {x: 16, y: 74}, Where on the map the character appears right now
    conditionalMaps: [], List of maps the character will appear in the future
    conditionalCords: [] List of the places where the character will appear in
  }),
*/
const NPCcharacters = [
  new Npc({
    id: "testMerchant",
    sprite: "villageMan",
    img: "resources/tiles/characters/generic_village_man.png",
    greeting: "generic_hail_friend",
    pronounSet: "masculine",
    currentMap: "western_heere_coast",
    currentCords: { x: 45, y: 168 },
    conditionalMaps: [],
    conditionalCords: []
  }),
  new Npc({
    id: "blacksmithMaroch",
    sprite: "blacksmithMaroch",
    img: "resources/tiles/characters/blacksmith_maroch.png",
    greeting: "generic_hail_friend",
    pronounSet: "masculine",
    currentMap: "central_heere",
    currentCords: { x: 179, y: 24 },
    conditionalMaps: [],
    conditionalCords: []
  }),
  new Npc({
    id: "warriorThrisna",
    sprite: "orcLady",
    img: "resources/tiles/characters/orc_warrior_lady.png",
    greeting: "thrisna_welcome",
    pronounSet: "feminine",
    currentMap: "central_heere",
    currentCords: { x: 179, y: 38 },
    conditionalMaps: [],
    conditionalCords: []
  }),
];

const NPCInventories = {
  testMerchant: {
    normal: [
      { id: "dagger", unique: false, price: 75 },
      { id: "chippedAxe", unique: false, price: 100 },
      { ...items["longsword"], unique: false, price: 200 },
      { ...items["apprenticeWand"], unique: false, price: 100 },
      { ...items["raggedHood"], unique: false, price: 15 },
      { ...items["raggedShirt"], unique: false, price: 25 },
      { ...items["raggedGloves"], unique: false, price: 12 },
      { ...items["raggedPants"], unique: false, price: 20 },
      { ...items["raggedBoots"], unique: false, price: 25 },
      { ...items["leatherHelmet"], unique: false, price: 50 },
      { ...items["leatherChest"], unique: false, price: 140 },
      { ...items["leatherBracers"], unique: false, price: 40 },
      { ...items["leatherLeggings"], unique: false, price: 110 },
      { ...items["leatherBoots"], unique: false, price: 40 },
      { ...items["woodenShield"], unique: false, price: 75 },
      { ...items["apprenticeRobe"], unique: false, price: 900 },
      { ...items["apprenticePants"], unique: false, price: 700 },
      { ...items["apprenticeBoots"], unique: false, price: 500 },
      { id: "healingPotion_weak", unique: false, price: 250 },
      { id: "manaPotion_weak", unique: false, price: 250 },
    ],
  },
  blacksmithMaroch: {
    normal: [
      { id: "longBow", unique: true, price: 1000 },
      { ...items["dualDaggers"], unique: false, price: 315 },
      { ...items["crimsonStaff"], unique: false, price: 800 },
      { ...items["ironHelmet"], unique: false, price: 225 },
      { ...items["ironArmor"], unique: false, price: 500 },
      { ...items["ironGauntlets"], unique: false, price: 180 },
      { ...items["ironLegplates"], unique: false, price: 410 },
      { ...items["ironBoots"], unique: false, price: 180 },
      { ...items["rangerHood"], unique: false, price: 750 },
      { ...items["rangerArmor"], unique: false, price: 1800 },
      { ...items["rangerGloves"], unique: false, price: 600 },
      { ...items["rangerPants"], unique: false, price: 1200 },
      { ...items["rangerBoots"], unique: false, price: 600 },
      { ...items["ironShield"], unique: false, price: 400 },
    ]
  },
  warriorThrisna: {
    normal: [
      { ...items["orcishAxe"], unique: false, price: 425 },
      { ...items["silverSword"], unique: false, price: 1200 },
      { ...items["pikeMore"], unique: false, price: 1170 },
      { ...items["galadorSpear"], unique: false, price: 1900 },
      { ...items["warriorsTalisman"], unique: false, price: 300 },
      { ...items["warriorsRing"], unique: false, price: 300 },
      { ...items["warriorsEmblem"], unique: false, price: 300 },
      { id: "beer", unique: false, price: 70 },
    ]
  }
} as any;