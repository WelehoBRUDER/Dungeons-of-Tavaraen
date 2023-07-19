interface raceTxt {
  [name: string]: string;
}

const raceTexts = {
  human: {
    name: "Human",
    desc: "",
  } as raceTxt,
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
} as any;

interface RaceEffect {
  [modifiers: string]: any;
  name: string;
  desc: string;
}

const raceEffects = {
  human: {
    modifiers: {
      vitV: 3,
      expGainP: 5,
      hpMaxPerLevelV: 10,
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
      hpMaxPerLevelV: 6,
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
      hpMaxPerLevelV: 12,
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
      hpMaxPerLevelV: 9,
    },
    name: "Ashen Constitution",
    desc: "The Ashen are sly and slippery, not gifted in straight battle.",
  },
} as any;
