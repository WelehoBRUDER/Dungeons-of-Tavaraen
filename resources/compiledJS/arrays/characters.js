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
        greeting: "generic_hail_friend",
        pronounSet: "masculine",
        currentMap: 2,
        currentCords: { x: 45, y: 168 },
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
            Object.assign(Object.assign({}, items["ironHelmet"]), { unique: false, price: 225 }),
            Object.assign(Object.assign({}, items["ironArmor"]), { unique: false, price: 500 }),
            Object.assign(Object.assign({}, items["ironGauntlets"]), { unique: false, price: 180 }),
            Object.assign(Object.assign({}, items["ironLegplates"]), { unique: false, price: 410 }),
            Object.assign(Object.assign({}, items["ironBoots"]), { unique: false, price: 180 }),
            Object.assign(Object.assign({}, items["woodenShield"]), { unique: false, price: 75 }),
            Object.assign(Object.assign({}, items["ironShield"]), { unique: false, price: 400 }),
            { id: "longBow", unique: true, price: 1000 },
            { id: "healingPotion_weak", unique: false, price: 250 },
        ],
    }
};
//# sourceMappingURL=characters.js.map