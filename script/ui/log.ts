const worldTextHistoryArray: Array<any> = [];
const worldTextHistoryMaximumSize = 200;
const worldTextHistoryDisplayAutoSize = 12; // Display 12 latest messages without player input. Active for 15s every time a new message appears.
const worldTextDisplayTime = 15000; // 15 seconds
const worldTextContainer = document.querySelector<HTMLDivElement>(".worldText");
let worldTextScroll = -1; // Current scroll

function displayText(txt: string) {
  worldTextContainer.style.transition = `0.25s`;
  worldTextContainer.style.opacity = "1";
  if (!state.displayingTextHistory) {
    worldTextContainer.textContent = "";
    worldTextContainer.style.pointerEvents = "none";
  }
  displayLatestWorldHistoryMessages();
  const textElement: HTMLElement = txt !== "" ? textSyntax(txt) : null;
  if (txt !== "") {
    worldTextHistoryArray.push(textElement);
    worldTextContainer.append(textElement);
  }
  if (!state.displayingTextHistory) worldTextContainer.scrollBy(0, 1000);
  if (worldTextContainer.childNodes.length > 99) worldTextContainer.removeChild(worldTextContainer.childNodes[0]);
  if (worldTextHistoryArray.length > worldTextHistoryMaximumSize) worldTextHistoryArray.splice(0, 1);
  if (state.displayingTextHistory) return;
  setTimeout(() => {
    if (state.displayingTextHistory) return;
    worldTextContainer.style.transition = `${worldTextDisplayTime / 3000}s`;
    worldTextContainer.style.opacity = "0";
  }, worldTextDisplayTime * 0.6);
  setTimeout(() => {
    if (state.displayingTextHistory) return;
    try { worldTextContainer.removeChild(textElement); }
    catch { }
  }, worldTextDisplayTime);
}

function displayLatestWorldHistoryMessages() {
  if (state.displayingTextHistory) return;
  for (let i = startIndexOfWorldTextHistory(); i < worldTextHistoryArray.length; i++) {
    worldTextContainer.append(worldTextHistoryArray[i]);
  }
}

worldTextContainer.addEventListener("wheel", () => {
  worldTextScroll = worldTextContainer.scrollTop;
});

function displayAllTextHistory() {
  worldTextContainer.style.transition = `0.25s`;
  worldTextContainer.style.opacity = "1";
  worldTextContainer.textContent = "";
  if (!state.displayingTextHistory) {
    worldTextContainer.style.opacity = "0";
    worldTextContainer.style.pointerEvents = "none";
    return;
  }
  worldTextContainer.style.pointerEvents = "all";
  worldTextContainer.innerHTML = `
  <img src="resources/icons/triangleUp.png" class="scrollUp" onclick="scrollWorldText(-100)">
  <img src="resources/icons/triangleDown.png" class="scrollDown" onclick="scrollWorldText(100)">
  `;
  worldTextHistoryArray.forEach((txt: HTMLPreElement) => {
    worldTextContainer.append(txt);
    worldTextContainer.scrollBy(0, 1000);
  });
  if (worldTextScroll < 0) worldTextScroll = worldTextContainer.scrollTop;
  worldTextContainer.scrollTo(0, worldTextScroll);
}

function startIndexOfWorldTextHistory() {
  if (worldTextHistoryArray.length - worldTextHistoryDisplayAutoSize > 1) return worldTextHistoryArray.length - worldTextHistoryDisplayAutoSize;
  else return 0;
}

function scrollWorldText(num: number) {
  worldTextContainer.scrollBy(0, num);
  worldTextScroll = worldTextContainer.scrollTop;
}