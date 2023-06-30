const consoleElement = document.querySelector(".console") as HTMLDivElement;
const consoleInput = consoleElement.querySelector("#console-input") as HTMLInputElement;
const consoleLog = consoleElement.querySelector(".log") as HTMLDivElement;
const consoleIntellisenseElem = consoleElement.querySelector(".console-intellisense") as HTMLDivElement;
const phantomText = consoleElement.querySelector(".phantom") as HTMLSpanElement;
const trailingText = consoleElement.querySelector(".trailing") as HTMLSpanElement;

consoleInput.oninput = (e: Event) => {
  clearBadSymbols();
  typeToConsole(e as InputEvent);
};

consoleInput.onkeydown = (e: KeyboardEvent) => {
  handleKeydownConsole(e);
};

const intellisenseData = {
  active: false,
  index: 0,
};

class DeveloperConsole {
  commandHistory: string[];
  commandsHistory: string[];
  command: number;
  open: boolean;
  constructor() {
    this.commandHistory = [];
    this.commandsHistory = [];
    this.command = 0;
    this.open = false;
  }

  executeCommand(command: string) {
    const commandArr: string[] = command.split(" ");
    const [commandName, ...commandValue] = commandArr;
    const commandFunction = developerCommands.find((command: any) => command.name === commandName);
    if (commandFunction) {
      if (commandFunction.isCheat && !DEVTOOLS.ENABLED) {
        consoleLog.innerHTML += `<p>Command ${commandName} is a cheat command and is disabled.<br>Type "dev" if you wish to access cheats.</p>`;
      } else {
        commandFunction.execute(commandValue);
        consoleLog.innerHTML += `<p>${this.commandHistory.at(-1)}</p>`;
      }
    } else {
      consoleLog.innerHTML += `<p>Command ${commandName} does not exist, type "help" to see all available commands.</p>`;
    }
    this.commandsHistory.push(command);
    this.command = this.commandsHistory.length;
  }

  toggle() {
    this.open = !this.open;
    if (this.open) {
      consoleElement.style.display = "flex";
      consoleInput.focus();
    } else {
      consoleElement.style.display = "none";
    }
  }
}

function updateTrailingText() {
  const predict = consoleIntellisenseElem.querySelector(".selected")?.textContent;
  if (predict) {
    const consoleInputValue = consoleInput.value.split(" ").at(-1) || "";
    trailingText.textContent = predict.slice(consoleInputValue.length);
  } else {
    trailingText.textContent = "";
  }
}

function handleKeydownConsole(e: KeyboardEvent) {
  const value = consoleInput.value;
  const tabbed = e.key === "Tab";
  const listOpen = intellisenseData.active;
  if (tabbed) {
    e.preventDefault();
    phantomText.textContent = consoleInput.value;
    if (intellisenseData.active) {
      intellisenseData.index++;
      if (intellisenseData.index >= consoleIntellisenseElem.children.length) intellisenseData.index = 0;
      const intellisenseOption = consoleIntellisenseElem.children[intellisenseData.index] as HTMLDivElement;
      [...consoleIntellisenseElem.children].forEach((itm: any) => itm.classList.remove("selected"));
      intellisenseOption.scrollIntoView({ block: "start", inline: "nearest" });
      intellisenseOption.classList.add("selected");
      updateTrailingText();
    } else {
      consoleIntellisense({ showAll: true });
      updateTrailingText();
    }
  }
  if (e.key === "§") {
    return (consoleInput.value = "");
  }
  if (e.key === " ") {
    const command: HTMLDivElement = consoleIntellisenseElem.querySelector(".selected") as HTMLDivElement;
    if (command) {
      e.preventDefault();
      return command.click();
    }
    updateTrailingText();
  }
  if (e.key === "ArrowUp") {
    if (!listOpen) {
      devConsole.command--;
      if (devConsole.command < 0) devConsole.command = 0;
      consoleInput.value = devConsole.commandsHistory[devConsole.command] || "";
    }
  }
  if (e.key === "ArrowDown") {
    if (!listOpen) {
      devConsole.command++;
      if (devConsole.command >= devConsole.commandsHistory.length) devConsole.command = devConsole.commandHistory.length - 1;
      consoleInput.value = devConsole.commandsHistory[devConsole.command] || "";
    }
  }
  if (e.key === "Enter") {
    consoleInput.value = "";
    consoleIntellisenseElem.innerHTML = "";
    intellisenseData.active = false;
    intellisenseData.index = 0;
    if (value.replaceAll(" ", "") === "") return;
    devConsole.executeCommand(value);
    updateTrailingText();
  }
}

function typeToConsole(e: InputEvent) {
  updateTrailingText();
  if (intellisenseData.active && intellisenseData.index !== -1 && e.data === " ") {
    consoleInput.value = consoleInput.value.slice(0, -1);
    return (phantomText.textContent = consoleInput.value);
  }
  consoleIntellisenseElem.innerHTML = "";
  if (consoleInput.value === "§") consoleInput.value = "";
  if (!devConsole.open) return (consoleInput.value = "");
  phantomText.textContent = consoleInput.value;
  consoleIntellisense();
}

function consoleIntellisense(options?: { showAll?: boolean }) {
  consoleIntellisenseElem.innerHTML = "";
  updateTrailingText();
  const value = consoleInput.value;
  const valueArr = value.split(" ");
  const [commandName] = valueArr;
  const commandIndex = valueArr.length - 2;
  let commandOptions: any[] = [];
  intellisenseData.index = 0;
  if (valueArr.length === 1 && (commandName.length > 0 || options?.showAll)) {
    commandOptions = options?.showAll
      ? developerCommands
      : developerCommands.filter((command: any) => command.name.startsWith(commandName));
  } else if (valueArr.length >= 2) {
    const commandData = developerCommands.find((command: any) => command.name === commandName);
    if (commandData) {
      commandOptions =
        commandData.availableParams?.[commandIndex]?.filter((itm: any) => itm.id.startsWith(valueArr[valueArr.length - 1])) || [];
    }
  }
  if (commandOptions.length === 0) return (intellisenseData.active = false);
  intellisenseData.active = true;
  commandOptions.forEach((command: any, index: number) => {
    const intellisenseOption = document.createElement("div");
    intellisenseOption.classList.add("intellisense-option");
    intellisenseOption.innerHTML = command.name || command.id;
    intellisenseOption.onclick = () => {
      if (valueArr.length > 1) {
        const id = command.onSelect ? command.onSelect : command.id;
        let commandValue = commandName + " ";
        for (let i = 1; i < valueArr.length - 1; i++) {
          commandValue += valueArr[i] + " ";
        }
        advanceIntellisense(commandValue + id);
      } else {
        advanceIntellisense(command.name);
      }
    };
    consoleIntellisenseElem.append(intellisenseOption);
    if (index === 0) {
      intellisenseOption.classList.add("selected");
      updateTrailingText();
    }
  });
}

function advanceIntellisense(command: string) {
  intellisenseData.active = false;
  consoleIntellisenseElem.innerHTML = "";
  consoleInput.value = command + " ";
  phantomText.textContent = consoleInput.value;
  consoleInput.focus();
  consoleIntellisense();
}

function clearBadSymbols() {
  if (consoleInput.value.includes("§")) {
    consoleInput.value = consoleInput.value.replaceAll("§", "");
  }
}

consoleInput.addEventListener("click", () => {
  consoleIntellisenseElem.innerHTML = "";
});

const devConsole = new DeveloperConsole();
