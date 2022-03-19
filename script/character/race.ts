
interface raceTxt {
  [name: string]: string;
}

const raceTexts = {
  human: {
    name: "Human",
    desc: ""
  } as raceTxt,
  orc: {
    name: "Half-Orc",
    desc: ""
  },
  elf: {
    name: "Half-Elf",
    desc: ""
  },
  ashen: {
    name: "Ashen",
    desc: ""
  }
} as any;

interface RaceEffect {
  [modifiers: string]: any;
  name: string;
  desc: string;
}

const raceEffects = {
  human: {
    modifiers: {
      vitV: 3
    },
    name: "Human Will",
    desc: "No scenario is unbeatable to man, any adversary can be overcome with determination and grit! Where power fails, smarts will succeed."
  },
  elf: {
    modifiers: {
      intV: 3
    },
    name: "Elvish Blood",
    desc: "Snobby pricks can show a good dance, but not a good fight."
  },
  orc: {
    modifiers: {
      strV: 3
    },
    name: "Orcy Bod",
    desc: "Orcies not make gud thinkaz', but do good git smashaz."
  },
  ashen: {
    modifiers: {
      dexV: 3
    },
    name: "Ashen Constitution",
    desc: "The Ashen are sly and slippery, not gifted in straight battle."
  },
} as any;