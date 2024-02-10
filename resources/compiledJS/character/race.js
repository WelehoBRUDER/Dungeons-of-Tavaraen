"use strict";
const raceTexts = {
    human: {
        name: "Human",
        desc: "",
    },
    orc: {
        name: "Half-Orc",
        desc: "",
    },
    elf: {
        name: "Half-Elf",
        desc: "",
    },
    ashen: {
        name: "Ashen",
        desc: "",
    },
};
const raceEffects = {
    human: {
        modifiers: {
            vitV: 3,
            expGainP: 5,
            hpMaxPerLevelV: 3,
        },
        name: "Human Will",
        desc: "No scenario is unbeatable to man, any adversary can be overcome with determination and grit! Where power fails, smarts will succeed.",
    },
    elf: {
        modifiers: {
            intV: 5,
            cunV: 3,
            dexV: 2,
            vitV: -3,
            strV: -2,
            expGainP: -10,
            hpMaxPerLevelV: 2,
        },
        name: "Elvish Blood",
        desc: "Snobby pricks can show a good dance, but not a good fight.",
    },
    orc: {
        modifiers: {
            strV: 5,
            vitV: 3,
            dexV: -2,
            intV: -3,
            cunV: -1,
            expGainP: -7.5,
            hpMaxPerLevelV: 4,
        },
        name: "Orcy Bod",
        desc: "Orcies not make gud thinkaz', but do good git smashaz.",
    },
    ashen: {
        modifiers: {
            dexV: 5,
            cunV: 3,
            strV: 1,
            vitV: -3,
            intV: -1,
            expGainP: -7.5,
            hpMaxPerLevelV: 2,
        },
        name: "Ashen Constitution",
        desc: "The Ashen are sly and slippery, not gifted in straight battle.",
    },
};
//# sourceMappingURL=race.js.map