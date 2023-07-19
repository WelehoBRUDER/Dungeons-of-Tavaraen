"use strict";
const emptyModel = {
    id: "player",
    name: "",
    cords: { x: 30, y: 105 },
    stats: {
        str: 1,
        dex: 1,
        int: 1,
        vit: 1,
        cun: 1,
        hp: 100,
        mp: 30,
    },
    resistances: {
        slash: 0,
        crush: 0,
        pierce: 0,
        magic: 0,
        dark: 0,
        divine: 0,
        fire: 0,
        lightning: 0,
        ice: 0,
    },
    statusResistances: {
        poison: 0,
        burning: 0,
        curse: 0,
        stun: 0,
        bleed: 0,
    },
    level: {
        xp: 0,
        xpNeed: 100,
        level: 1,
    },
    classes: [],
    sprite: ".player",
    race: "human",
    hair: 1,
    eyes: 1,
    face: 1,
    weapon: new Weapon({ ...items.stick }),
    chest: new Armor({ ...items.raggedShirt }),
    helmet: {},
    gloves: {},
    legs: new Armor({ ...items.raggedPants }),
    boots: new Armor({ ...items.raggedBoots }),
    offhand: {},
    artifact1: {},
    artifact2: {},
    artifact3: {},
    grave: null,
    threat: 25,
    canFly: false,
    perks: [],
    abilities: [
        new Ability({ ...abilities.attack }, dummy),
        new Ability({ ...abilities.retreat, equippedSlot: 0 }, dummy),
        new Ability({ ...abilities.first_aid, equippedSlot: 1 }, dummy),
        new Ability({ ...abilities.defend, equippedSlot: 2 }, dummy),
    ],
    traits: [
        {
            id: "resilience_of_the_lone_wanderer",
        },
    ],
    regen: {
        hp: 0,
        mp: 0,
    },
    hit: {
        chance: 60,
        evasion: 30,
    },
    unarmed_damages: { crush: 1 },
    statusEffects: [],
    inventory: [],
    gold: 50,
    sp: 5,
    pp: 1,
    respawnPoint: { cords: { x: 29, y: 105 } },
    usedShrines: [],
    flags: {},
    questProgress: [],
};
const creation = document.querySelector(".mainMenu .characterCreation");
const content = creation.querySelector(".content .creation-content");
const creationCanvas = creation.querySelector(".layerRender");
const creationCtx = creationCanvas.getContext("2d");
const hairs = [1, 10];
const eyes = [1, 5];
const faces = [1, 5];
const classEquipments = {
    fighter: {
        weapon: new Weapon({ ...items.chippedBlade }),
        chest: new Armor({ ...items.raggedShirt }),
        helmet: new Armor({ ...items.leatherHelmet }),
        gloves: {},
        legs: new Armor({ ...items.raggedPants }),
        boots: new Armor({ ...items.raggedBoots }),
        offhand: new Armor({ ...items.woodenShield }),
    },
    barbarian: {
        weapon: new Weapon({ ...items.chippedAxe }),
        chest: new Armor({ ...items.leatherChest }),
        helmet: {},
        gloves: new Armor({ ...items.leatherBracers }),
        legs: new Armor({ ...items.raggedPants }),
        boots: new Armor({ ...items.raggedBoots }),
        offhand: {},
    },
    paladin: {
        weapon: new Weapon({ ...items.chippedBlade }),
        chest: new Armor({ ...items.ironArmor }),
        helmet: new Armor({ ...items.leatherHelmet }),
        gloves: {},
        legs: new Armor({ ...items.leatherLeggings }),
        boots: new Armor({ ...items.raggedBoots }),
        offhand: new Armor({ ...items.ironShield }),
    },
    sorcerer: {
        weapon: new Weapon({ ...items.apprenticeWand }),
        chest: new Armor({ ...items.raggedShirt }),
        helmet: {},
        gloves: new Armor({ ...items.raggedGloves }),
        legs: new Armor({ ...items.raggedPants }),
        boots: new Armor({ ...items.raggedBoots }),
        offhand: {},
    },
    rogue: {
        weapon: new Weapon({ ...items.dagger }),
        chest: new Armor({ ...items.raggedShirt }),
        helmet: new Armor({ ...items.raggedHood }),
        gloves: new Armor({ ...items.raggedGloves }),
        legs: new Armor({ ...items.raggedPants }),
        boots: new Armor({ ...items.raggedBoots }),
        offhand: new Armor({ ...items.parryingDagger }),
    },
    ranger: {
        weapon: new Weapon({ ...items.huntingBow }),
        chest: new Armor({ ...items.raggedShirt }),
        helmet: new Armor({ ...items.woolHat }),
        gloves: new Armor({ ...items.raggedGloves }),
        legs: new Armor({ ...items.raggedPants }),
        boots: new Armor({ ...items.raggedBoots }),
        offhand: {},
    },
};
let clothToggleCreation = false;
// steps: class-race, appearance
let creationStep = "class-race";
function characterCreation(withAnimations = true) {
    if (withAnimations) {
        const copiedModel = JSON.parse(JSON.stringify({ ...emptyModel }));
        player = new PlayerCharacter({ ...copiedModel });
        creation.style.display = "flex";
        traitPicks = 2;
        creationStep = "class-race";
        setTimeout(() => {
            creation.style.opacity = "1";
        }, 5);
    }
    checkIfCanStartGame();
    content.innerHTML = ""; // Clear screen
    if (creationStep === "class-race") {
        classRaceSelection();
    }
    else if (creationStep === "appearance") {
        appearanceSelection();
    }
    renderPlayerOutOfMap(256, creationCanvas, creationCtx, "center", player, clothToggleCreation);
}
const startingTraits = [
    "strong",
    "quick",
    "enduring",
    "intelligent",
    "stealthy",
    "lucky",
    "healthy",
    "wise",
    "regenerating",
    "magical",
    "adrenaline",
    "confident",
];
let traitPicks = 2;
function classRaceSelection() {
    content.innerHTML = `
  <div class="char-race-container">
    <h1 class="race-select">${lang.choose_race}</h1>
    <div class="races">
      ${Object.entries(raceTexts)
        .map(([key, { name }]) => {
        return `<div class="race-pick ${key} ${player.race === key ? "selected" : ""}" onclick="changeRace('${key}')"><p>${name}</p></div>`;
    })
        .join("")}
    </div>
  </div>
  <div class="char-class-container">
    <h1 class="class-select">${lang.choose_class}</h1>
    <div class="classes">
      ${Object.values(combatClasses)
        .map((combatClass) => {
        return `<div class="class-pick ${combatClass.id} ${player.classes[0]?.id === combatClass.id ? "selected" : ""}" style="background: ${combatClass.color}" onclick='changeClass(${JSON.stringify(combatClass)})'>
      <p>${lang[combatClass.id + "_name"]}</p>
      <img src="${combatClass.icon}" alt="${combatClass.id}">
    </div>`;
    })
        .join("")}
    </div>
  </div>
  <div class="char-traits-container">
    <h1 class="trait-select">${lang.choose_traits ?? "lang.choose_traits"}</h1>
    <p class="trait-picks-left">${traitPicks} points</p>
    <div class="traits">
      ${startingTraits
        .map((trait) => {
        return `<div class="trait-pick ${trait} ${player.traits.findIndex((t) => t.id === trait) > -1 ? "selected" : ""}" onclick="changeTrait('${trait}')"><p>${lang[trait + "_name"] ?? trait}</p></div>`;
    })
        .join("")}
  </div>
  </div>
  <div class="continue-buttons">
    <div class="blue-button no-anim ${canContinue() ? "" : "disabled"}" onclick="toggleStep()">Confirm</div>
    <div class="red-button no-anim" onclick="closeCharacterCreation()">Cancel</div>
  </div>
  `;
    Array.from(content.querySelector(".races").children).map((race) => {
        tooltip(race, raceTT(race.classList[1]));
    });
    Array.from(content.querySelector(".classes").children).map((combatClass) => {
        tooltip(combatClass, classTT(combatClasses[combatClass.classList[1]]));
    });
    Array.from(content.querySelector(".traits").children).map((trait) => {
        tooltip(trait, statModifTT(traits[trait.classList[1]]));
    });
}
function getHairArray() {
    const hairArray = [];
    for (let i = hairs[0]; i <= hairs[1]; i++) {
        hairArray.push(i);
    }
    return hairArray;
}
function getEyesArray() {
    const eyesArray = [];
    for (let i = eyes[0]; i <= eyes[1]; i++) {
        eyesArray.push(i);
    }
    return eyesArray;
}
function getFaceArray() {
    const faceArray = [];
    for (let i = faces[0]; i <= faces[1]; i++) {
        faceArray.push(i);
    }
    return faceArray;
}
function getHairImg(hair) {
    return `./resources/tiles/player/hair_${hair}.png`;
}
function getEyesImg(eyes) {
    return `./resources/tiles/player/eyes_${eyes}.png`;
}
function getFaceImg(face) {
    return `./resources/tiles/player/nose_mouth_${face}.png`;
}
function appearanceSelection() {
    content.innerHTML = `
  <div class="char-appearance-container">
    <h1 class="appearance-select">${lang.choose_hair ?? "choose_hair"}</h1>
    <div class="appearances">
      ${getHairArray()
        .map((hair) => {
        return `<div  class="appearance-pick ${hair} ${player.hair === hair ? "selected" : ""}" onclick="changeHair(${hair})"><img src="${getHairImg(hair)}" alt="hair image ${hair}" ></div>`;
    })
        .join("")}
    </div>
  </div>
  <div class="char-appearance-container">
  <h1 class="appearance-select">${lang.choose_eyes ?? "choose_eyes"}</h1>
  <div class="appearances">
    ${getEyesArray()
        .map((eyes) => {
        return `<div  class="appearance-pick ${eyes} ${player.eyes === eyes ? "selected" : ""}" onclick="changeEyes(${eyes})"><img src="${getEyesImg(eyes)}" alt="eyes image ${eyes}" ></div>`;
    })
        .join("")}
    </div>
  </div>
  <div class="char-appearance-container">
    <h1 class="appearance-select">${lang.choose_face ?? "choose_face"}</h1>
    <div class="appearances">
      ${getFaceArray()
        .map((face) => {
        return `<div  class="appearance-pick ${face} ${player.face === face ? "selected" : ""}" onclick="changeFace(${face})"><img src="${getFaceImg(face)}" alt="face image ${face}" ></div>`;
    })
        .join("")}
    </div>
  </div>
  <div class="char-appearance-container">
    <h1 class="appearance-select">${lang.choose_name ?? "choose_name"}</h1>
    <input class="name-input" type="text" value="${player.name}" placeholder="Varien Loreanus" maxlength="24" oninput="changeName(this.value)">
  </div>
  <div class="continue-buttons">
    <div class="blue-button no-anim ${canContinue() ? "" : "disabled"}" onclick="beginGame()">Confirm</div>
    <div class="red-button no-anim" onclick="toggleStep()">Cancel</div>
  </div>
  `;
}
// creation.querySelector<HTMLInputElement>(".nameInput").addEventListener("keyup", (key) => {
//   player.name = creation.querySelector<HTMLInputElement>(".nameInput").value;
//   checkIfCanStartGame();
// });
function changeName(value) {
    player.name = value;
    if (canContinue()) {
        document.querySelector(".continue-buttons .blue-button").classList.remove("disabled");
    }
    else {
        document.querySelector(".continue-buttons .blue-button").classList.add("disabled");
    }
}
function closeCharacterCreation() {
    creation.style.opacity = "0";
    setTimeout(() => {
        creation.style.display = "none";
    }, 750);
    gotoMainMenu(true);
}
function toggleStep() {
    if (creationStep === "class-race") {
        if (canContinue()) {
            creationStep = "appearance";
        }
    }
    else
        creationStep = "class-race";
    characterCreation(false);
}
function beginGame() {
    player.updateTraits();
    player.updateAbilities();
    creation.style.opacity = "0";
    setTimeout(() => {
        creation.style.display = "none";
    }, 750);
    tree = player.classes[0].perkTree;
    closeGameMenu(false, true);
    helper.reviveAllDeadEnemies();
    helper.resetAllLivingEnemiesInAllMaps();
    helper.killAllQuestEnemies();
    player.updatePerks(true);
    player.updateAbilities();
    fallenEnemies = [];
    turnOver = true;
    enemiesHadTurn = 0;
    lootedChests = [];
    currentMap = "cave_of_awakening";
    state.inCombat = false;
    resetAllChests();
    handleEscape();
    createStaticMap();
    renderMinimap(maps[currentMap]);
    renderAreaMap(maps[currentMap]);
    moveMinimap();
    resizeCanvas();
    setTimeout(() => {
        openLevelingScreen();
    }, 0);
}
function changeTrait(trait) {
    if (traitPicks > 0) {
        if (player.traits.findIndex((t) => t.id === trait) === -1) {
            player.traits.push(traits[trait]);
            traitPicks--;
        }
        else {
            player.traits = player.traits.filter((t) => t.id !== trait);
            traitPicks++;
        }
    }
    else {
        if (player.traits.findIndex((t) => t.id === trait) > -1) {
            player.traits = player.traits.filter((t) => t.id !== trait);
            traitPicks++;
        }
    }
    characterCreation(false);
}
function checkIfCanStartGame() {
    let canStart = false;
    if (player.name.trim().length > 1 && player.classes[0])
        canStart = true;
    try {
        if (canStart) {
            creation.querySelector(".startGame").classList.remove("greyedOut");
        }
        else
            creation.querySelector(".startGame").classList.add("greyedOut");
    }
    catch { }
}
function canContinue() {
    if (creationStep === "class-race") {
        if (!player.classes[0]?.id)
            return false;
        if (traitPicks < 0 || traitPicks > 1)
            return false;
    }
    else {
        if (player.name.trim().length <= 3 || player.name.length > 24)
            return false;
    }
    return true;
}
function changeHair(n) {
    player.hair = n;
    characterCreation(false);
}
function changeEyes(n) {
    player.eyes = n;
    characterCreation(false);
}
function changeFace(n) {
    player.face = n;
    characterCreation(false);
}
function changeRace(race) {
    player.race = race;
    player.raceEffect = raceEffects[player.race];
    characterCreation(false);
}
function changeClass(_combatClass) {
    player.classes[0] = new combatClass(_combatClass);
    Object.entries(classEquipments[player.classes[0].perkTree]).forEach((eq) => {
        let id = eq[0];
        let val = eq[1];
        player[id] = { ...val };
    });
    characterCreation(false);
    checkIfCanStartGame();
}
function changeSex(sex) {
    player.sex = sex;
    document.querySelector(".player-sex-clothes .selected").classList.remove("selected");
    document.querySelector(`.player-sex-clothes .${sex}`).classList.add("selected");
    characterCreation(false);
    checkIfCanStartGame();
}
function toggleClothes() {
    clothToggleCreation = !clothToggleCreation;
    if (clothToggleCreation) {
        document.querySelector(".toggleClothes").classList.add("selected");
    }
    else
        document.querySelector(".toggleClothes").classList.remove("selected");
    characterCreation(false);
    checkIfCanStartGame();
}
function raceTT(race) {
    let txt = "";
    // @ts-expect-error
    let entries = Object.entries(raceEffects[race].modifiers).sort((a, b) => b[1] - a[1]);
    let sortedTotal = {};
    entries.forEach((entry) => {
        sortedTotal[entry[0]] = entry[1];
    });
    Object.entries(sortedTotal).forEach((effect) => {
        txt += effectSyntax(effect);
    });
    return txt;
}
function classTT(data) {
    let txt = `<c>white<c><f>24px<f>${lang[data.id + "_name"]}\n`;
    txt += lang[data.id + "_desc"];
    // @ts-expect-error
    let entries = Object.entries(data.statBonuses).sort((a, b) => b[1] - a[1]);
    let sortedTotal = {};
    entries.forEach((entry) => {
        sortedTotal[entry[0]] = entry[1];
    });
    Object.entries(sortedTotal).forEach((effect) => {
        txt += effectSyntax(effect);
    });
    return txt;
}
// for (let i = 0; i < 30; i++) {
//   player.addItem({ ...randomProperty(items) });
// }
player.addItem(new Armor(items.mysteriousMask));
player.addItem(new Armor(items.mysteriousBodysuit));
player.addItem(new Armor(items.mysteriousGloves));
player.addItem(new Armor(items.mysteriousLeggings));
player.addItem(new Armor(items.mysteriousBoots));
let preloadFinished = false;
async function initGame() {
    document.querySelector(".loading-bar-fill").style.width = "0%";
    let options = JSON.parse(localStorage.getItem(`DOT_game_settings`));
    if (options) {
        settings = new gameSettings(options);
        lang = await eval(JSON.parse(localStorage.getItem(`DOT_game_language`)));
    }
    else
        settings = new gameSettings(settings);
    await gotoMainMenu(true);
    document.querySelector(".loading-bar-fill").style.width = "10%";
    document.querySelector(".loading-text").textContent = "Updating player...";
    state.menuOpen = true;
    state.titleScreen = true;
    document.querySelector(".loading-text").textContent = "Loading mods...";
    document.querySelector(".loading-bar-fill").style.width = "50%";
    if (!settings.load_mods) {
        continueLoad();
        return;
    }
    const buttons = [
        {
            text: "Load mods",
            class: "blue-button",
            callback: () => {
                gotoMods();
                closeMultiButtonPrompt();
            },
        },
        {
            text: "Don't load",
            class: "red-button",
            callback: () => {
                continueLoad();
                closeMultiButtonPrompt();
            },
        },
    ];
    multiButtonPrompt("load_mods_prompt", buttons);
}
async function continueLoad() {
    preloadFinished = true;
    document.querySelector(".loading-bar-fill").style.width = "55%";
    await player.updateAbilities();
    player.updatePerks();
    player.updateTraits();
    document.querySelector(".loading-text").textContent = "Creating tooltips....";
    document.querySelector(".loading-bar-fill").style.width = "60%";
    tooltip(document.querySelector(".invScrb"), `${lang["setting_hotkey_inv"]} [${settings["hotkey_inv"]}]`);
    tooltip(document.querySelector(".chaScrb"), `${lang["setting_hotkey_char"]} [${settings["hotkey_char"]}]`);
    tooltip(document.querySelector(".perScrb"), `${lang["setting_hotkey_perk"]} [${settings["hotkey_perk"]}]`);
    tooltip(document.querySelector(".escScrb"), `${lang["open_menu"]} [ESCAPE]`);
    tooltip(settingsTopbar.querySelector(".save"), lang["save_settings"]);
    tooltip(settingsTopbar.querySelector(".saveFile"), lang["save_settings_file"]);
    tooltip(settingsTopbar.querySelector(".loadFile"), lang["load_settings_file"]);
    updateCommands();
    document.querySelector(".loading-text").textContent = "Building textures...";
    await helper.sleep(500); // This stupid buffer ensures that textures replaced by mods are loaded properly
    document.querySelector(".loading-bar-fill").style.width = "70%";
    try {
        document.querySelector(".loading-text").textContent = "Loading textures...";
        await loadTextures();
        document.querySelector(".loading-bar-fill").style.width = "80%";
        document.querySelector(".loading-text").textContent = "Creating static maps...";
        await createStaticMap();
        document.querySelector(".loading-bar-fill").style.width = "85%";
        document.querySelector(".loading-text").textContent = "Rendering map...";
        resizeCanvas();
        renderMinimap(maps[currentMap]);
        renderAreaMap(maps[currentMap]);
        document.querySelector(".loading-bar-fill").style.width = "95%";
    }
    catch (err) {
        console.warn("Failed rendering map", err);
    }
    document.querySelector(".loading-text").textContent = "Finishing load";
    document.querySelector(".loading-bar-fill").style.width = "100%";
    setTimeout(() => (document.querySelector(".loading").style.display = "none"), 0);
    resizeCanvas();
    renderMinimap(maps[currentMap]);
    renderAreaMap(maps[currentMap]);
}
document.addEventListener("DOMContentLoaded", initGame);
//# sourceMappingURL=start_game.js.map