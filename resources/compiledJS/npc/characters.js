"use strict";
/*
  EXAMPLE NPC CHARACTER
  new Npc({
    id: "exampleCharacter", Id MUST always be defined and written correctly, this will be used to link characters to their interactions!!
    sprite: "villageMan", Sprite works identically to enemies, but try to make unique ones :D
    greeting: "generic", Greeting is the id of the opening dialog displayed when speaking to this character, before choosing any dialog options.
    pronounSet: "neutral", He/She/They, obviosly does not apply to Finnish.
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
        img: "resources/tiles/characters/generic_village_man.png",
        greeting: "generic_hail_friend",
        pronounSet: "masculine",
        currentMap: 2,
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
        currentMap: 3,
        currentCords: { x: 179, y: 24 },
        conditionalMaps: [],
        conditionalCords: []
    }),
    new Npc({
        id: "warriorThrisna",
        sprite: "orcLady",
        img: "resources/tiles/characters/orc_warrior_lady.png",
        greeting: "generic_hail_friend",
        pronounSet: "feminine",
        currentMap: 3,
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
            Object.assign(Object.assign({}, items["longsword"]), { unique: false, price: 200 }),
            Object.assign(Object.assign({}, items["apprenticeWand"]), { unique: false, price: 100 }),
            Object.assign(Object.assign({}, items["raggedHood"]), { unique: false, price: 15 }),
            Object.assign(Object.assign({}, items["raggedShirt"]), { unique: false, price: 25 }),
            Object.assign(Object.assign({}, items["raggedGloves"]), { unique: false, price: 12 }),
            Object.assign(Object.assign({}, items["raggedPants"]), { unique: false, price: 20 }),
            Object.assign(Object.assign({}, items["raggedBoots"]), { unique: false, price: 25 }),
            Object.assign(Object.assign({}, items["leatherHelmet"]), { unique: false, price: 50 }),
            Object.assign(Object.assign({}, items["leatherChest"]), { unique: false, price: 140 }),
            Object.assign(Object.assign({}, items["leatherBracers"]), { unique: false, price: 40 }),
            Object.assign(Object.assign({}, items["leatherLeggings"]), { unique: false, price: 110 }),
            Object.assign(Object.assign({}, items["leatherBoots"]), { unique: false, price: 40 }),
            Object.assign(Object.assign({}, items["woodenShield"]), { unique: false, price: 75 }),
            Object.assign(Object.assign({}, items["apprenticeRobe"]), { unique: false, price: 900 }),
            Object.assign(Object.assign({}, items["apprenticePants"]), { unique: false, price: 700 }),
            Object.assign(Object.assign({}, items["apprenticeBoots"]), { unique: false, price: 500 }),
            { id: "healingPotion_weak", unique: false, price: 250 },
            { id: "manaPotion_weak", unique: false, price: 250 },
            { id: "beer", unique: false, price: 70 },
        ],
    },
    blacksmithMaroch: {
        normal: [
            { id: "longBow", unique: true, price: 1000 },
            Object.assign(Object.assign({}, items["dualDaggers"]), { unique: false, price: 315 }),
            Object.assign(Object.assign({}, items["crimsonStaff"]), { unique: false, price: 800 }),
            Object.assign(Object.assign({}, items["ironHelmet"]), { unique: false, price: 225 }),
            Object.assign(Object.assign({}, items["ironArmor"]), { unique: false, price: 500 }),
            Object.assign(Object.assign({}, items["ironGauntlets"]), { unique: false, price: 180 }),
            Object.assign(Object.assign({}, items["ironLegplates"]), { unique: false, price: 410 }),
            Object.assign(Object.assign({}, items["ironBoots"]), { unique: false, price: 180 }),
            Object.assign(Object.assign({}, items["rangerHood"]), { unique: false, price: 750 }),
            Object.assign(Object.assign({}, items["rangerArmor"]), { unique: false, price: 1800 }),
            Object.assign(Object.assign({}, items["rangerGloves"]), { unique: false, price: 600 }),
            Object.assign(Object.assign({}, items["rangerPants"]), { unique: false, price: 1200 }),
            Object.assign(Object.assign({}, items["rangerBoots"]), { unique: false, price: 600 }),
            Object.assign(Object.assign({}, items["ironShield"]), { unique: false, price: 400 }),
        ]
    },
    warriorThrisna: {
        normal: [
            Object.assign(Object.assign({}, items["orcishAxe"]), { unique: false, price: 425 }),
            Object.assign(Object.assign({}, items["warriorsTalisman"]), { unique: false, price: 300 }),
            Object.assign(Object.assign({}, items["warriorsRing"]), { unique: false, price: 300 }),
            Object.assign(Object.assign({}, items["warriorsEmblem"]), { unique: false, price: 300 }),
        ]
    }
};
//# sourceMappingURL=characters.js.map