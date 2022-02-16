"use strict";
const emptyModel = {
    id: "player",
    name: "",
    cords: { x: 41, y: 169 },
    stats: {
        str: 1,
        dex: 1,
        int: 1,
        vit: 1,
        cun: 1,
        hp: 100,
        mp: 30
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
        ice: 0
    },
    statusResistances: {
        poison: 0,
        burning: 0,
        curse: 0,
        stun: 0,
        bleed: 0
    },
    level: {
        xp: 0,
        xpNeed: 100,
        level: 1
    },
    classes: {
        main: null,
        sub: null
    },
    sprite: ".player",
    race: "human",
    hair: 1,
    eyes: 1,
    face: 1,
    weapon: new Weapon(Object.assign({}, items.stick)),
    chest: new Armor(Object.assign({}, items.raggedShirt)),
    helmet: {},
    gloves: {},
    legs: new Armor(Object.assign({}, items.raggedBoots)),
    boots: {},
    offhand: {},
    artifact1: {},
    artifact2: {},
    artifact3: {},
    grave: null,
    threat: 25,
    canFly: false,
    perks: [],
    abilities: [
        new Ability(Object.assign({}, abilities.attack), dummy),
        new Ability(Object.assign(Object.assign({}, abilities.retreat), { equippedSlot: 0 }), dummy),
        new Ability(Object.assign(Object.assign({}, abilities.first_aid), { equippedSlot: 1 }), dummy),
        new Ability(Object.assign(Object.assign({}, abilities.defend), { equippedSlot: 2 }), dummy),
    ],
    statModifiers: [
        {
            id: "resilience_of_the_lone_wanderer",
        }
    ],
    regen: {
        hp: 0,
        mp: 0,
    },
    hit: {
        chance: 60,
        evasion: 30
    },
    unarmed_damages: { crush: 1 },
    statusEffects: [],
    inventory: [],
    gold: 50,
    sp: 5,
    pp: 1,
    respawnPoint: { cords: { x: 41, y: 169 } },
    usedShrines: [],
    flags: {},
    questProgress: [],
};
const creation = document.querySelector(".mainMenu .characterCreation");
const creationCanvas = creation.querySelector(".layerRender");
const creationCtx = creationCanvas.getContext("2d");
const hairs = [1, 10];
const eyes = [1, 5];
const faces = [1, 5];
const classEquipments = {
    fighter: {
        weapon: new Weapon(Object.assign({}, items.chippedBlade)),
        chest: new Armor(Object.assign({}, items.raggedShirt)),
        helmet: new Armor(Object.assign({}, items.leatherHelmet)),
        gloves: {},
        legs: new Armor(Object.assign({}, items.raggedPants)),
        boots: new Armor(Object.assign({}, items.raggedBoots)),
        offhand: new Armor(Object.assign({}, items.woodenShield)),
    },
    barbarian: {
        weapon: new Weapon(Object.assign({}, items.chippedAxe)),
        chest: new Armor(Object.assign({}, items.leatherChest)),
        helmet: {},
        gloves: new Armor(Object.assign({}, items.leatherBracers)),
        legs: new Armor(Object.assign({}, items.raggedPants)),
        boots: new Armor(Object.assign({}, items.raggedBoots)),
        offhand: {},
    },
    sorcerer: {
        weapon: new Weapon(Object.assign({}, items.apprenticeWand)),
        chest: new Armor(Object.assign({}, items.raggedShirt)),
        helmet: {},
        gloves: new Armor(Object.assign({}, items.raggedGloves)),
        legs: new Armor(Object.assign({}, items.raggedPants)),
        boots: new Armor(Object.assign({}, items.raggedBoots)),
        offhand: {},
    },
    rogue: {
        weapon: new Weapon(Object.assign({}, items.dagger)),
        chest: new Armor(Object.assign({}, items.raggedShirt)),
        helmet: new Armor(Object.assign({}, items.raggedHood)),
        gloves: new Armor(Object.assign({}, items.raggedGloves)),
        legs: new Armor(Object.assign({}, items.raggedPants)),
        boots: new Armor(Object.assign({}, items.raggedBoots)),
        offhand: new Armor(Object.assign({}, items.parryingDagger)),
    },
    ranger: {
        weapon: new Weapon(Object.assign({}, items.huntingBow)),
        chest: new Armor(Object.assign({}, items.raggedShirt)),
        helmet: new Armor(Object.assign({}, items.woolHat)),
        gloves: new Armor(Object.assign({}, items.raggedGloves)),
        legs: new Armor(Object.assign({}, items.raggedPants)),
        boots: new Armor(Object.assign({}, items.raggedBoots)),
        offhand: {},
    }
};
var clothToggleCreation = false;
function characterCreation(withAnimations = true) {
    var _a, _b, _c;
    if (withAnimations) {
        const copiedModel = JSON.parse(JSON.stringify(Object.assign({}, emptyModel)));
        player = new PlayerCharacter(Object.assign({}, copiedModel));
        creation.style.display = "block";
        setTimeout(() => { creation.style.opacity = "1"; }, 5);
    }
    checkIfCanStartGame();
    renderPlayerOutOfMap(256, creationCanvas, creationCtx, "center", player, clothToggleCreation);
    creation.querySelector(".nameText").textContent = (_a = lang["choose_name"]) !== null && _a !== void 0 ? _a : "lang_choose_name";
    creation.querySelector(".raceText").textContent = (_b = lang["choose_race"]) !== null && _b !== void 0 ? _b : "lang_choose_race";
    creation.querySelector(".classText").textContent = (_c = lang["choose_class"]) !== null && _c !== void 0 ? _c : "lang_choose_class";
    const raceContainer = creation.querySelector(".racesContainer");
    const classContainer = creation.querySelector(".classesContainer");
    raceContainer.textContent = "";
    classContainer.textContent = "";
    Object.entries(raceTexts).forEach((race) => {
        const content = race[1];
        const btn = document.createElement("div");
        btn.textContent = content.name;
        btn.classList.add("raceButton");
        tooltip(btn, raceTT(race[0]));
        if (player.race == race[0])
            btn.style.border = "4px solid gold";
        else {
            btn.addEventListener("click", a => changeRace(race));
        }
        raceContainer.append(btn);
    });
    Object.values(combatClasses).forEach((combatClass) => {
        var _a, _b;
        const bg = document.createElement("div");
        const title = document.createElement("p");
        const icon = document.createElement("img");
        bg.classList.add("classCard");
        bg.style.background = combatClass.color;
        title.textContent = lang[combatClass.id + "_name"];
        icon.src = combatClass.icon;
        tooltip(bg, classTT(combatClass));
        if (((_b = (_a = player.classes) === null || _a === void 0 ? void 0 : _a.main) === null || _b === void 0 ? void 0 : _b.id) == combatClass.id)
            bg.style.border = "4px solid gold";
        else {
            bg.addEventListener("click", a => changeClass(combatClass));
        }
        bg.append(title, icon);
        classContainer.append(bg);
    });
}
creation.querySelector(".nameInput").addEventListener("keyup", (key) => {
    player.name = creation.querySelector(".nameInput").value;
    checkIfCanStartGame();
});
function beginGame() {
    player.updateStatModifiers();
    player.updateAbilities();
    creation.style.opacity = "0";
    setTimeout(() => { creation.style.display = "none"; }, 750);
    tree = player.classes.main.perkTree;
    closeGameMenu(false, true);
    reviveAllDeadEnemies();
    resetAllLivingEnemiesInAllMaps();
    killAllQuestEnemies();
    player.updatePerks(true);
    player.updateAbilities();
    fallenEnemies = [];
    turnOver = true;
    enemiesHadTurn = 0;
    lootedChests = [];
    state.inCombat = false;
    resetAllChests();
    handleEscape();
    createStaticMap();
    modifyCanvas();
    setTimeout(() => {
        openLevelingScreen();
    }, 100);
}
function checkIfCanStartGame() {
    let canStart = false;
    if (player.name.trim().length > 1 && player.classes.main)
        canStart = true;
    try {
        if (canStart) {
            creation.querySelector(".startGame").classList.remove("greyedOut");
        }
        else
            creation.querySelector(".startGame").classList.add("greyedOut");
    }
    catch (_a) { }
}
function changeHair(e) {
    if (e.button === 0) {
        if (player.hair + 1 <= hairs[1]) {
            player.hair++;
            creation.querySelector(".hair").textContent = `hair ${player.hair}`;
            characterCreation(false);
        }
        else {
            player.hair = hairs[0];
            creation.querySelector(".hair").textContent = `hair ${player.hair}`;
            characterCreation(false);
        }
    }
    else if (e.button === 2) {
        if (player.hair - 1 >= hairs[0]) {
            player.hair--;
            creation.querySelector(".hair").textContent = `hair ${player.hair}`;
            characterCreation(false);
        }
        else {
            player.hair = hairs[1];
            creation.querySelector(".hair").textContent = `hair ${player.hair}`;
            characterCreation(false);
        }
    }
}
function changeEyes(e) {
    if (e.button === 0) {
        if (player.eyes + 1 <= eyes[1]) {
            player.eyes++;
            creation.querySelector(".eyes").textContent = `eyes ${player.eyes}`;
            characterCreation(false);
        }
        else {
            player.eyes = eyes[0];
            creation.querySelector(".eyes").textContent = `eyes ${player.eyes}`;
            characterCreation(false);
        }
    }
    else if (e.button === 2) {
        if (player.eyes - 1 >= eyes[0]) {
            player.eyes--;
            creation.querySelector(".eyes").textContent = `eyes ${player.eyes}`;
            characterCreation(false);
        }
        else {
            player.eyes = eyes[1];
            creation.querySelector(".eyes").textContent = `eyes ${player.eyes}`;
            characterCreation(false);
        }
    }
}
function changeFace(e) {
    if (e.button === 0) {
        if (player.face + 1 <= faces[1]) {
            player.face++;
            creation.querySelector(".face").textContent = `face ${player.face}`;
            characterCreation(false);
        }
        else {
            player.face = faces[0];
            creation.querySelector(".face").textContent = `face ${player.face}`;
            characterCreation(false);
        }
    }
    else if (e.button === 2) {
        if (player.face - 1 >= faces[0]) {
            player.face--;
            creation.querySelector(".face").textContent = `face ${player.face}`;
            characterCreation(false);
        }
        else {
            player.face = faces[1];
            creation.querySelector(".face").textContent = `face ${player.face}`;
            characterCreation(false);
        }
    }
}
function changeRace(race) {
    player.race = race[0];
    // @ts-ignore
    player.raceEffect = raceEffects[player.race];
    characterCreation(false);
}
function changeClass(_combatClass) {
    player.classes.main = new combatClass(_combatClass);
    Object.entries(classEquipments[player.classes.main.perkTree]).forEach((eq) => {
        let id = eq[0];
        let val = eq[1];
        player[id] = Object.assign({}, val);
    });
    characterCreation(false);
    checkIfCanStartGame();
}
function changeSex(sex) {
    player.sex = sex;
    document.querySelector(".genderWrapper .selected").classList.remove("selected");
    document.querySelector(`.genderWrapper .${sex}`).classList.add("selected");
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
    Object.entries(sortedTotal).forEach(effect => {
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
    Object.entries(sortedTotal).forEach(effect => {
        txt += effectSyntax(effect);
    });
    return txt;
}
for (let i = 0; i < 20; i++) {
    player.addItem(Object.assign({}, randomProperty(items)));
}
//# sourceMappingURL=startGame.js.map