function command(cmd: any) {
  const key: string = cmd[0];
  const value: number = cmd[1];

  if (key.startsWith("add_")) {
    var _key = key.replace("add_", "");
    if (_key.includes("ability_")) {
      const id = _key.replace("ability_", "");
      var ability = new Ability(abilities[id], dummy);
      var foundId = player.abilities.find(abi => abi.id == id);
      if (!foundId) {
        let lowestAvailableSlot = 0;
        for (let i = 0; i < 20; i++) {
          let _continue = true;
          player.abilities.forEach(abi => {
            if (abi.equippedSlot == lowestAvailableSlot) {
              lowestAvailableSlot++;
              _continue = false;
              return;
            }
          });
          if (_continue) {
            player.inventory.forEach(itm => {
              if (itm.equippedSlot == lowestAvailableSlot) {
                lowestAvailableSlot++;
                return;
              }
            });
          }
        }
        if (lowestAvailableSlot < 20) ability.equippedSlot = lowestAvailableSlot;
        player.abilities.push(ability);
        updateUI();
      }
    }
  }
}


function commandSyntax(cmd: string, val: number) {
  let txt = "";
  if (cmd.startsWith("add_")) {
    let key = cmd.replace("add_", "");
    if (key.includes("ability_")) {
      key = key.replace("ability_", "");
      let abi = new Ability(abilities[key], dummy);
      txt = `\n<f>18px<f><c>white<c>${lang["add_ability"]} '<c>yellow<c>${lang[abi.id + "_name"] ?? abi.id}<c>white<c>'\n§`;
      txt += embedAbiTT(abi);
    }
  }
  return txt;
}