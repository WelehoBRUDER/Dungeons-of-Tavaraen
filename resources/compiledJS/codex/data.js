"use strict";
const codex = {
    items: {
        title: "ITEMS",
        parent: "NONE",
        no_img: true,
        needs_encounter: true,
        import_from_array: "items"
    },
    enemies: {
        title: "ENEMIES",
        parent: "NONE",
        no_img: true,
        needs_encounter: true,
        import_from_array: "enemies"
    },
    summons: {
        title: "SUMMONS",
        parent: "NONE",
        no_img: true,
        needs_encounter: true,
        import_from_array: "summons"
    },
    classes: {
        title: "CLASSES",
        needs_encounter: false,
        parent: "NONE",
        no_img: true,
        content: [
            {
                title: "OVERVIEW",
                needs_encounter: false,
                parent: "CLASSES",
                no_img: true,
                content: [
                    {
                        id: "classOverview",
                        parent: "OVERVIEW",
                        no_img: true,
                        title: "COMBAT CLASS",
                        content: [
                            {
                                id: "nestedDeep",
                                parent: "COMBAT CLASS",
                                no_img: true,
                                title: "DEEPER NESTED",
                            }
                        ]
                    },
                    {
                        id: "perks",
                        parent: "OVERVIEW",
                        no_img: true,
                        title: "PERKS",
                    }
                ]
            },
            {
                title: "PERKS LIST",
                needs_encounter: false,
                parent: "CLASSES",
                no_img: true,
                content: [
                    {
                        title: "FIGHTER",
                        parent: "PERKS LIST",
                        no_img: true,
                        import_from_array: "perksArray.fighter.perks"
                    },
                    {
                        title: "BARBARIAN",
                        parent: "PERKS LIST",
                        no_img: true,
                        import_from_array: "perksArray.barbarian.perks"
                    },
                    {
                        title: "SORCERER",
                        parent: "PERKS LIST",
                        no_img: true,
                        import_from_array: "perksArray.sorcerer.perks"
                    },
                    {
                        title: "ROGUE",
                        parent: "PERKS LIST",
                        no_img: true,
                        import_from_array: "perksArray.rogue.perks"
                    },
                    {
                        title: "RANGER",
                        parent: "PERKS LIST",
                        no_img: true,
                        import_from_array: "perksArray.ranger.perks"
                    },
                    {
                        title: "ADVENTURER",
                        parent: "PERKS LIST",
                        no_img: true,
                        import_from_array: "perksArray.adventurer_shared.perks"
                    },
                ]
            }
        ]
    },
    characters: {
        title: "CHARACTERS",
        parent: "NONE",
        no_img: true,
        content: [
            {
                title: "OVERVIEW",
                needs_encounter: false,
                parent: "CHARACTERS",
                no_img: true,
            },
            {
                title: "PLAYER",
                needs_encounter: false,
                parent: "CHARACTERS",
                no_img: true,
            },
            {
                title: "NPCS",
                needs_encounter: false,
                parent: "CHARACTERS",
                no_img: true,
                import_from_array: "NPCcharacters"
            }
        ]
    }
};
// sub_categories: {
//   overview: {
//     title: "OVERVIEW",
//     no_img: true,
//     content: [
//       {
//         id: "classOverview",
//         no_img: true,
//         title: "COMBAT CLASS",
//       },
//       {
//         id: "perks",
//         no_img: true,
//         title: "PERKS",
//       }
//     ],
//   },
//   fighter: {
//     title: "FIGHTER",
//     import_from_array: "perksArray.fighter.perks"
//   },
//   barbarian: {
//     title: "BARBARIAN",
//     import_from_array: "perksArray.barbarian.perks"
//   },
//   sorcerer: {
//     title: "SORCERER",
//     import_from_array: "perksArray.sorcerer.perks"
//   },
//   rogue: {
//     title: "ROGUE",
//     import_from_array: "perksArray.rogue.perks"
//   },
//   ranger: {
//     title: "RANGER",
//     import_from_array: "perksArray.ranger.perks"
//   },
//   adventurer: {
//     title: "ADVENTURER",
//     import_from_array: "perksArray.adventurer_shared.perks"
//   }
// }
//# sourceMappingURL=data.js.map