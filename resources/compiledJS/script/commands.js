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
function commandSyntax(cmd, val) {
    let txt = "";
    if (cmd.startsWith("add_")) {
        let key = cmd.replace("add_", "");
        if (key.includes("ability_")) {
            key = key.replace("ability_", "");
            let abi = new Ability(abilities[key], dummy);
            txt = `\n<f>18px<f><c>white<c>${lang["add_ability"]} '<c>yellow<c>${lang[abi.id + "_name"]}<c>white<c>'\n§`;
            txt += embedAbiTT(abi);
        }
    }
    return txt;
}
//# sourceMappingURL=commands.js.map