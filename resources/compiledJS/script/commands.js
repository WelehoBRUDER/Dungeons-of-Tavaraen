"use strict";
function command(cmd) {
    const key = cmd[0];
    const value = cmd[1];
    if (key.startsWith("add_")) {
        var _key = key.replace("add_", "");
        if (_key.includes("ability_")) {
            const id = _key.replace("ability_", "");
            var ability = new Ability(abilities[id], dummy);
            var foundId = player.abilities.find(abi => abi.id == id);
            if (!foundId)
                player.abilities.push(ability);
        }
    }
}
//# sourceMappingURL=commands.js.map