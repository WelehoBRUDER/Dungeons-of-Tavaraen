"use strict";
let developerCommands;
function updateCommands() {
    developerCommands = [
        {
            name: "help",
            help: "List all available commands",
            verboseHelp: "help [command] - List all available commands. If a command is specified, the help text for that command will be displayed.",
            availableParams: [],
            execute: (args) => {
                const command = args[0];
                if (command) {
                    const commandObject = developerCommands.find((c) => c.name === command);
                    if (commandObject) {
                        devConsole.commandHistory.push(commandObject.verboseHelp);
                        return;
                    }
                    devConsole.commandHistory.push(`Command ${command} not found, type "help" to see all available commands`);
                    return;
                }
                else {
                    let text = "Available commands:";
                    developerCommands.forEach((command) => {
                        text += `<br>${command.name}: ${command.help}`;
                    });
                    devConsole.commandHistory.push(text);
                }
            },
        },
        {
            name: "clear",
            help: "Clear the console",
            verboseHelp: "Clears the console, while keeping the command history.",
            availableParams: [],
            execute: () => {
                devConsole.commandHistory = [""]; // This only clears the logs, not the actual command history
                consoleLog.innerHTML = "";
            },
        },
        {
            name: "dev",
            help: "Enable developer mode",
            verboseHelp: "dev [save] - Enable developer mode. If 'save' is specified, the setting will be saved to local storage.<br>Use 'dev' again to disable developer mode.<br>Developer mode enables cheat commands and removes certain limitations.",
            availableParams: [[{ id: "save" }]],
            execute: (args) => {
                DEVTOOLS.ENABLED = !DEVTOOLS.ENABLED;
                const saveToLocalStorage = args[0] === "save";
                if (saveToLocalStorage) {
                    localStorage.setItem("DOT_game_devtools", DEVTOOLS.ENABLED.toString());
                }
                else {
                    localStorage.removeItem("DOT_game_devtools");
                }
                devConsole.commandHistory.push(`Developer mode ${DEVTOOLS.ENABLED ? "enabled" : "disabled"}`);
            },
        },
        {
            name: "onepunch",
            help: "Deal massive damage with every attack",
            verboseHelp: "onepunch - Deal massive damage with every attack.<br>Use 'onepunch' again to disable this cheat.",
            isCheat: true,
            availableParams: [],
            execute: () => {
                // DEVTOOLS.ONE_PUNCH = !DEVTOOLS.ONE_PUNCH;
                // devConsole.commandHistory.push(`${DEVTOOLS.ONE_PUNCH ? "You have become ONE" : "Your power has been taken away"}`);
            },
        },
        {
            name: "nocd",
            help: "Remove cooldowns from all abilities",
            verboseHelp: "nocd - Remove cooldowns from all abilities.<br>Use 'nocd' again to disable this cheat.",
            isCheat: true,
            availableParams: [],
            execute: () => {
                // DEVTOOLS.NO_CD = !DEVTOOLS.NO_CD;
                // devConsole.commandHistory.push(`Skills are now ${DEVTOOLS.NO_CD ? "instant" : "lethargic"}`);
            },
        },
        {
            name: "freecast",
            help: "Cast abilities without spending mana",
            verboseHelp: "freecast - Cast abilities without spending mana.<br>Use 'freecast' again to disable this cheat.",
            isCheat: true,
            availableParams: [],
            execute: () => {
                // DEVTOOLS.FREE_CAST = !DEVTOOLS.FREE_CAST;
                // devConsole.commandHistory.push(`Your mana is now ${DEVTOOLS.FREE_CAST ? "infinite" : "very much finite"}`);
            },
        },
        {
            name: "god",
            help: "Become invincible",
            verboseHelp: "god - All damage dealt to you will be 0, and you are immune to debuffs.<br>Use 'god' again to disable this cheat.",
            isCheat: true,
            availableParams: [],
            execute: () => {
                DEVTOOLS.GOD = !DEVTOOLS.GOD;
                devConsole.commandHistory.push(`Invincibility ${DEVTOOLS.GOD ? "granted" : "taken away"}`);
            },
        },
        {
            name: "ignore",
            help: "[category] Ignore specific requirements",
            verboseHelp: "ignore [category] - Ignore certain requirements in the game. Arguments:<br>leveling - ignores all requirements for perks/class/skills<br>Example: ignore leveling.",
            isCheat: true,
            availableParams: [[{ id: "leveling" }]],
            execute: (args) => {
                // const cat = args[0];
                // if (cat) {
                //   if (cat === "leveling") {
                //     DEVTOOLS.IGNORE_REQUIREMENTS = !DEVTOOLS.IGNORE_REQUIREMENTS;
                //     devConsole.commandHistory.push(`Criteria to unlock leveling ${DEVTOOLS.IGNORE_REQUIREMENTS ? "ignored" : "once again needed"}`);
                //   } else {
                //     devConsole.commandHistory.push(`Category "${cat}" is not valid`);
                //   }
                // } else {
                //   devConsole.commandHistory.push("Too few arguments, expected: ignore [category]");
                // }
            },
        },
        {
            name: "killall",
            help: "Kill all enemies in the current fight.",
            verboseHelp: "killall - Kill all enemies in the current fight.",
            isCheat: true,
            availableParams: [],
            execute: () => {
                // const _enemies = combat.getLivingEnemies();
                // if (_enemies.length > 0) {
                //   _enemies.forEach((enemy: Enemy) => {
                //     enemy.stats.hp = 0;
                //     update();
                //     enemy.die();
                //   });
                //   devConsole.commandHistory.push("All enemies killed");
                // } else {
                devConsole.commandHistory.push("No enemies to kill");
                //}
            },
        },
        {
            name: "item",
            help: "[item] [amount] Adds specified quantity of items to your inventory",
            verboseHelp: "item [item] [amount] - Adds specified quantity of items to your inventory.<br>Example: item small_healing_potion 3",
            isCheat: true,
            availableParams: [Object.values(items), [{ id: "amount - number", onSelect: "5" }]],
            execute: (args) => {
                const item = args[0];
                const quantity = args[1] ? parseInt(args[1]) : 1;
                if (item) {
                    // @ts-ignore
                    const itemObject = items[item];
                    if (itemObject) {
                        const newItem = new Item(itemObject);
                        newItem.quantity = quantity || 1;
                        player.addItem(newItem, quantity);
                        devConsole.commandHistory.push(`Added ${quantity} ${item} to your inventory`);
                    }
                    else {
                        devConsole.commandHistory.push(`Item "${item}" not found`);
                    }
                }
                else {
                    devConsole.commandHistory.push("Too few arguments, expected: item [item] [amount]");
                }
            },
        },
        {
            name: "gold",
            help: "Add gold",
            verboseHelp: "gold [amount] - Add gold to your inventory.<br>Example: gold 100",
            isCheat: true,
            availableParams: [[{ id: "amount - number", onSelect: "100" }]],
            execute: (args) => {
                const amount = args[0] ? parseInt(args[0]) : 100;
                player.addGold(amount);
                devConsole.commandHistory.push(`Added ${amount} gold`);
            },
        },
        {
            name: "xp",
            help: "Add experience points",
            verboseHelp: "xp [amount] - Add experience points.<br>Example: xp 100",
            isCheat: true,
            availableParams: [[{ id: "amount - number", onSelect: "50" }]],
            execute: (args) => {
                const xp = args[0] ? parseInt(args[0]) : 0;
                player.addXP(xp);
                devConsole.commandHistory.push(`Added ${xp} experience points`);
            },
        },
        {
            name: "cp",
            help: "Add class points",
            verboseHelp: "cp [amount] - Add class points.<br>Example: cp 5",
            isCheat: true,
            availableParams: [[{ id: "amount - number", onSelect: "5" }]],
            execute: (args) => {
                const cp = args[0] ? parseInt(args[0]) : 0;
                player.classPoints += cp;
                devConsole.commandHistory.push(`Added ${cp} class points`);
            },
        },
        {
            name: "sp",
            help: "Add skill points",
            verboseHelp: "sp [amount] - Add skill points.<br>Example: sp 5",
            isCheat: true,
            availableParams: [[{ id: "amount - number", onSelect: "5" }]],
            execute: (args) => {
                const sp = args[0] ? parseInt(args[0]) : 0;
                player.sp += sp;
                devConsole.commandHistory.push(`Added ${sp} skill points`);
            },
        },
        {
            name: "pp",
            help: "Add perk points",
            verboseHelp: "pp [amount] - Add perk points.<br>Example: pp 5",
            isCheat: true,
            availableParams: [[{ id: "amount - number", onSelect: "5" }]],
            execute: (args) => {
                const pp = args[0] ? parseInt(args[0]) : 0;
                player.pp += pp;
                devConsole.commandHistory.push(`Added ${pp} perk points`);
            },
        },
    ];
}
//# sourceMappingURL=console_commands.js.map