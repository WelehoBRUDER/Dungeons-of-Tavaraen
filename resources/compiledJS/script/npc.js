"use strict";
// THIS FILE CONTAINS THE LOGIC FOR FRIENDLY CHARACTERS //
// Flags are stored as index (5: true, 0: 1) to save memory.
// Function getFlag(str) will return the flag index.
const flags = [
    "test_flag_has_spoken_to_merchant",
    "test_flag_has_purchased_from_merchant"
];
// Returns flag index by searching with string.
function getFlag(str) {
    str = str.toLowerCase();
    for (let index = 0; index < flags.length; index++) {
        if (str == flags[index].toLowerCase()) {
            return index;
        }
    }
    return -1;
}
// Either sets a flag to specified value, or modifies it.
// If override is enabled, value is replaced instead of modified.
// Boolean values can't be modified and will instead always be replaced (duh).
function setFlag(str, value, override = false) {
    var _a;
    for (let index = 0; index < flags.length; index++) {
        if (str == flags[index].toLowerCase()) {
            // @ts-expect-error
            if (((_a = player.flags) === null || _a === void 0 ? void 0 : _a[index]) == str) {
                // @ts-expect-error
                if (override)
                    player.flags[index] = value;
                else {
                    if (typeof value == "number") {
                        // @ts-expect-error
                        if (typeof player.flags[index] !== "number")
                            player.flags[index] = 0;
                        // @ts-expect-error
                        player.flags[index] += value;
                    }
                    else {
                        // @ts-expect-error
                        player.flags[index] = value;
                    }
                }
            }
            else {
                console.log("adding new flag!");
                // @ts-expect-error
                player.flags[index] = value;
            }
        }
    }
}
class Npc {
    constructor(base) {
        this.id = base.id;
        this.sprite = base.sprite;
        this.currentMap = base.currentMap;
        this.currentCords = base.currentCords;
        this.conditionalMaps = base.conditionalMaps;
        this.conditionalCords = base.conditionalCords;
    }
}
//# sourceMappingURL=npc.js.map