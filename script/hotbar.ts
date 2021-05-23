function generateHotbar() {
  const hotbar = <HTMLDivElement> document.querySelector(".hotbar");
  hotbar.textContent = "";
  for(let i = 0; i < 20; i++) {
    const bg = document.createElement("img");
    const frame = document.createElement("div");
    frame.classList.add("hotbarFrame");
    bg.src = "resources/ui/hotbar_bg.png";
    frame.append(bg);
    hotbar.append(frame);
    player.abilities?.map((abi: ability)=>{
      if(abi.equippedSlot == i) {
        const abiDiv = document.createElement("div");
        const abiImg = document.createElement("img");
        abiDiv.classList.add("ability");
        abiImg.src = abi.icon;
        abiDiv.append(abiImg);
        frame.append(abiDiv);
      }
    })
  }
}

function updateUI() {
  const ui = <HTMLDivElement> document.querySelector(".playerUI");
  if(!ui) throw new Error("UI NOT LOADED!");
  const hpText = <HTMLParagraphElement> ui.querySelector(".hpText");
  const hpImg = <HTMLImageElement> ui.querySelector(".PlayerHpFill");
  const mpImg = <HTMLImageElement> ui.querySelector(".PlayerMpFill");
  const xp = <HTMLDivElement> document.querySelector(".xpBar .barFill");
  hpText.textContent = `${player.stats.hp} / ${player.getStats().hpMax}`;
  // @ts-ignore
  hpImg.style.setProperty("--value", (100 - player.statRemaining("hp")) + "%");
  // @ts-ignore
  mpImg.style.setProperty("--value", (100 - player.statRemaining("mp")) + "%");

  xp.style.width = `${player.level.xp / player.level.xpNeed * 100}%`
}

generateHotbar();
updateUI();