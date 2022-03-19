"use strict";
const codex = {
    items: {
        title: "ITEMS",
        import_from_array: "items"
    },
    enemies: {
        title: "ENEMIES",
        import_from_array: "enemies"
    },
    classes: {
        title: "CLASSES",
        needs_encounter: false,
        sub_categories: {
            overview: {
                title: "OVERVIEW",
                no_img: true,
                content: [
                    {
                        id: "classOverview",
                        no_img: true,
                        title: "COMBAT CLASS",
                    },
                    {
                        id: "perks",
                        no_img: true,
                        title: "PERKS",
                    }
                ],
            },
            fighter: {
                title: "FIGHTER",
                import_from_array: "perksArray.fighter.perks"
            },
            barbarian: {
                title: "BARBARIAN",
                import_from_array: "perksArray.barbarian.perks"
            },
            sorcerer: {
                title: "SORCERER",
                import_from_array: "perksArray.sorcerer.perks"
            },
            rogue: {
                title: "ROGUE",
                import_from_array: "perksArray.rogue.perks"
            },
            ranger: {
                title: "RANGER",
                import_from_array: "perksArray.ranger.perks"
            },
            adventurer: {
                title: "ADVENTURER",
                import_from_array: "perksArray.adventurer_shared.perks"
            }
        }
    },
};
//# sourceMappingURL=data.js.map