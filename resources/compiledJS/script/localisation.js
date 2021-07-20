"use strict";
// /* NOTE - THIS WILL *NEVER* FULLY TRANSLATE THE GAME, BUT IT WILL ATLEAST PROVIDE YOU WITH FLAVOUR TEXTS IN YOUR PREFERRED LANGUAGE */ //
const finnish = {
    // Technical stuff
    changeWordOrder: true,
    mana: "taika",
    health: "terveys",
    str: "Voimaa",
    dex: "Taitoa",
    vit: "Sisua",
    int: "Älykkyyttä",
    cun: "Oveluutta",
    crush: "Murskaavaa",
    slash: "Viiltävää",
    pierce: "Lävistävää",
    fire: "Tuli",
    ice: "Jää",
    dark: "Pimeää",
    divine: "Jumalallinen",
    lightning: "Sähkö",
    crush_def: "Murskaus",
    slash_def: "Viilto",
    pierce_def: "Lävistävyys",
    fire_def: "Tuli",
    ice_def: "Jää",
    dark_def: "Pimeä",
    divine_def: "Jumalallinen",
    lightning_def: "Sähkö",
    hpMax: "Terveyttä",
    mpMax: "Taikaa",
    sight: "Näköä",
    increases: "Parantaa",
    decreases: "Heikentää",
    damage: "Vahinkoa",
    by: "",
    strV: "Voima",
    strP: "Voima%",
    vitV: "Sisu",
    vitP: "Sisu%",
    dexV: "Taito",
    dexP: "Taito%",
    intV: "Älykkyys",
    intP: "Älykkyys%",
    hpV: "Terveys",
    hpP: "Terveys%",
    mpV: "Taika",
    mpP: "Taika%",
    status_effect: "Tila efekti",
    last: "Efektin kesto",
    lasts_for: "Efekti kestää",
    resist: "Puolustusta",
    silence_text: "Taikasi on estetty!",
    silence: "Estää taian!",
    concentration_text: "Et kykene keskittymään!",
    concentration_req: "Vaatii keskittymisen",
    concentration: "Estää keskittymisen!",
    heal_power: "Parannus voima",
    type: "Tyyppi",
    ranged: "Kauko käyttö",
    requires_melee_weapon: "Vaatii lähitaistelu aseen",
    requires_ranged_weapon: "Vaatii kaukotaistelu aseen",
    targets_self: "Kohde on oma hahmo",
    mana_cost: "taian käyttö",
    use_range: "Käyttö matka",
    damage_multiplier: "Vahingon kerroin",
    resistance_penetration: "Puolustuksen läpäisy",
    yes: "kyllä",
    no: "ei",
    tiles: "tiiliä",
    attack: "Hyökkäys",
    heal: "Parannus",
    buff: "Tehoste/Buffi",
    movement: "Liikkuminen",
    charge: "Ryntäys",
    turn: "Kierros",
    turns: "kierrosta",
    cooldown: "CD",
    map_to_hotbar: "Lisää kyky/työkalu",
    remove_from_hotbar: "Poista kyky/työkalu",
    removed_in: "Kestää",
    deals: "Aiheuttaa",
    // Item definitions
    slash_damageSub: "Viiltävä",
    slash_damageMain: "Haavoittavan",
    crush_damageSub: "Tylppä",
    crush_damageMain: "Murskaavan",
    pierce_damageSub: "Pistävä",
    pierce_damageMain: "Lävistävän",
    dark_damageSub: "Pimeä",
    dark_damageMain: "Kamalan",
    divine_damageSub: "Pyhä",
    divine_damageMain: " Jumalallisen",
    fire_damageSub: "Tulinen",
    fire_damageMain: "Liekehtivän",
    lightning_damageSub: "Ukkostava",
    lightning_damageMain: "Salamoivan",
    ice_damageSub: "Jäinen",
    ice_damageMain: "Hyytävän",
    // armor defs
    slash_resistanceSub: "Suojelevainen",
    slash_resistanceMain: "Viilloilta Suojaava",
    crush_resistanceSub: "Pehmeä",
    crush_resistanceMain: "Murskaukselta Suojeleva",
    pierce_resistanceSub: "Paksu",
    pierce_resistanceMain: "Pistoilta Suojaava",
    dark_resistanceSub: "Pyhä",
    dark_resistanceMain: "Pimeyden Karkottava",
    divine_resistanceSub: "Kirottu",
    divine_resistanceMain: "Virsiä Karttava",
    fire_resistanceSub: "Viilentävä",
    fire_resistanceMain: "Tulenkestävä",
    lightning_resistanceSub: "Sähkönjohtava",
    lightning_resistanceMain: "Salamankestävä",
    ice_resistanceSub: "Sulattava",
    ice_resistanceMain: "Jäänmurtava",
    // Item names
    dagger_name: "Tikari",
    stick_name: "Keppi",
    chippedBlade_name: "Kulunut Terä",
    longsword_name: "Pitkämiekkä",
    chippedAxe_name: "Kulunut Kirves",
    huntingBow_name: "Metsästys Jousi",
    raggedShirt_name: "Ryysyinen Paita",
    raggedBoots_name: "Ryysyiset Jalkimet",
    // Enemy names
    skeletonWarrior_name: "Luuranko Soturi",
    skeletonArcher_name: "Luuranko Jousimies",
    skeletonMage_name: "Luuranko Maagi",
    greySlime_name: "Harmaa Lima",
    norsemanBerserk_name: "Pohjoismies Berserkki",
    norsemanHunter_name: "Pohjoismies Metsästäjä",
    // LOG TEXTS
    you: "",
    recovery_pl: "parantaen",
    health_points: "terveys pistettä",
    for: "aiheuttaen",
    death: "kuoli.",
    damage_from_effect_pl: "<c>white<c>[STATUS] aiheuttaa [ICON][DMG] vahinkoa kehollesi!",
    damage_from_effect: "<c>white<c>[STATUS] aiheuttaa hahmolle [TARGET] [ICON][DMG] vahinkoa.",
    player_death_log: "OLET KUOLLUT...",
    cure_pl: "Parannat itsesi!",
    cure: "[ACTOR] parantaa itsensä.",
    // WORLD TEXTS
    gained_xp: "Sait [XP] XP!",
    player_death: "SINUT SURMATTIIN!",
    // Damage types
    poison_damage: "Myrkytys",
    // Misc
    attack_name: "tavallisten iskujen vahinkoa",
    cures_statuses: "Parantaa efektit",
    item_weight: "Paino",
    item_worth: "Arvo",
    item_grade: "Taso",
    resistance: "Puolustus",
    status_effects: "Tila efektit",
    encumbrance: "Taakka",
    shrine_activated: "Pyhäkkö aktivoitu!",
    shrine_used: "Pyhäkön voimat ovat jo kulutettu...",
    // Grades
    common: "Yleinen",
    uncommon: "Epätavallinen",
    rare: "Harvinainen",
    mythical: "Myyttinen",
    legendary: "Legendaarinen",
    // Statuses
    effect_poison_name: "Myrkky",
    effect_poison_desc: "Myrkky kiertää veressäsi, \nsyöden voimasi ja terveytesi.",
    effect_venom_name: "Syvä myrkky",
    effect_venom_desc: "Myrkytys heikentää kehoasi.",
    effect_rage_name: "Raivo",
    effect_rage_desc: "Hävisit äskettäin kilpailun, \nmutta vain koska vastustajasi huijasi!",
    effect_berserk_name: "Berserkki",
    effect_berserk_desc: "HAKKAA PÄÄLLE POHJANPOIKA!!!",
    effect_dazed_name: "Pökerryksissä",
    effect_dazed_desc: "Pääsi on sekaisin iskun jäljiltä, \njonka takia et kykene tarkkoihin liikkeisiin.",
    effect_blighted_name: "Vitsattu",
    effect_blighted_desc: "Kehosi on heikentynyt vitsauksesta.",
    // Abilities and stuff
    attack_action_desc_pl: "Teet [DMG] vahinkoa hahmoon [TARGET] hyökkäykselläsi.",
    attack_action_desc: "iskee hahmoa [TARGET], tehden [DMG] vahinkoa.",
    focus_strike_name: "Tarkka Isku",
    focus_strike_desc: "Silmäile kohteesi liikettä tarkasti,\niskien sopivimmalla hetkellä.",
    focus_strike_action_desc_pl: "Isket hahmoa [TARGET] tarkasti koko voimallasi, ja teet [DMG] vahinkoa.",
    focus_strike_action_desc: "käyttää koko voimaansa iskien hahmoa",
    true_shot_name: "Tappava Nuoli",
    true_shot_desc: "Laita kaikki voimasi tähän laukaukseen,\ntähdäten vastustajasi heikkouteen.",
    true_shot_action_desc_pl: "Täytät seuraavan nuolesi taialla, ja vapautat sen jousestasi hahmoa [TARGET] kohti, tehden [DMG] vahinkoa.",
    true_shot_action_desc: "[ACTOR] ampuu kohdetta [TARGET] taialla vahvistetulla nuolella, tehden [DMG] vahinkoa.",
    first_aid_name: "Ensiapu",
    first_aid_desc: "Hoida pienet haavasi tavalla tai toisella.",
    first_aid_action_desc_pl: "Käytät ensiapu taitojasi haavoihisi, ",
    first_aid_action_desc: "käyttää ensipau taitojaan haavoihinsa, ",
    icy_javelin_name: "Jäinen Keihäs",
    icy_javelin_desc: "Ammu jäästä tehty keihäs vihollistasi päin.",
    icy_javelin_action_desc_pl: "Ammut jäästä tehdyn keihään kohti hahmoa [TARGET], tehden [DMG] vahinkoa.",
    icy_javelin_action_desc: "ampuu jäästä tehdyn keihään kohti hahmoa [TARGET], aiheuttaen [DMG] vahinkoa.",
    barbarian_rage_name: "Barbaarin Raivo",
    barbarian_rage_desc: "Aivotyö on ajan tuhlaamista,\nhaluat näkyviä tuloksia HETI!",
    barbarian_rage_action_desc_pl: "Taistelussa ei muuta tarvitse kuin vihata näitä mulkkuja ympärilläsi! HAAA!!",
    barbarian_rage_action_desc: "käy kuumana ja alkaa raivota kovaa.",
    berserk_name: "Berserkki",
    berserk_desc: "PERRRRRRRRKELE!!!!",
    berserk_action_desc_pl: "NYT KYLLÄ PALO PINNA, ON AIKA PISTÄÄ NÄITÄ HULLUJA KUONOON!!!!!!",
    berserk_action_desc: "MENETTI JÄRKENSÄ, NYT KANNATTAA VAROA TAI SE ANTAA ISÄN KÄDESTÄ!!",
    shadow_step_name: "Varjoaskel",
    shadow_step_desc: "Astu varjojen välillä nopeasti.",
    shadow_step_action_desc_pl: "Käytät varjoja hyväksesi, ja liikut haluamaasi suuntaan väläyksessä.",
    shadow_step_action: "käyttää ympäröiviä varjoja liikkuakseen nopeasti.",
    charge_name: "Rynnäkkö",
    charge_desc: "Ryntää vihollistasi päin rajusti.",
    charge_action_desc_pl: "Ryntäät vastustajaa [TARGET] päin, tehden [DMG] vahinkoa!",
    charge_action_desc: "ryntää päin hahmoa [TARGET], aiheuttaen [DMG] vahinkoa.",
    purification_name: "Puhdistus",
    purification_desc: "Puhdista kehosi myrkyistä ja epäpuhtauksista.",
    blight_name: "Vitsaus",
    blight_desc: "Kiroa kohteesi vitsauksella.",
    blight_action_desc_pl: "Vitsaat hahmon [TARGET], tehden [DMG] vahinkoa, ja heikentäen häntä!",
    blight_action_desc: "vitsaa hahmon [TARGET], aiheuttaen [DMG] vahinkoa, ja heikentäen häntä.",
};
const english = {
    // Technical stuff
    changeWordOrder: false,
    mana: "mana",
    health: "health",
    str: "Strength",
    dex: "Dexterity",
    vit: "Vitality",
    int: "Intelligence",
    cun: "Cunning",
    crush: "Crushing",
    slash: "Slashing",
    pierce: "Piercing",
    fire: "Fire",
    ice: "Ice",
    dark: "Dark",
    divine: "Divine",
    lightning: "Lightning",
    crush_def: "Crushing",
    slash_def: "Slashing",
    pierce_def: "Piercing",
    fire_def: "Fire",
    ice_def: "Ice",
    dark_def: "Dark",
    divine_def: "Divine",
    lightning_def: "Lightning",
    hpMax: "Health",
    mpMax: "Mana",
    sight: "Sight",
    increases: "Increases",
    decreases: "Decreases",
    damage: "Damage",
    by: "by ",
    strV: "Strength",
    strP: "Strength%",
    vitV: "Vitality",
    vitP: "Vitality%",
    dexV: "Dexterity",
    dexP: "Dexterity%",
    intV: "Intelligence",
    intP: "Intelligence%",
    hpV: "Health",
    hpP: "Health%",
    mpV: "Mana",
    mpP: "Mana%",
    status_effect: "Status effect",
    last: "Effect time",
    lasts_for: "Lasts for",
    resist: "Resist",
    silence_text: "You are silenced!",
    silence: "Silences magic!",
    concentration_text: "Your concentration is broken!",
    concentration: "Breaks concentration!",
    heal_power: "Healing Power",
    concentration_req: "Requires Concentration",
    type: "Type",
    ranged: "Ranged",
    requires_melee_weapon: "Requires Melee Weapon",
    requires_ranged_weapon: "Requires Ranged Weapon",
    targets_self: "Targets Self",
    mana_cost: "Mana Cost",
    use_range: "Use Range",
    damage_multiplier: "Damage Multiplier",
    resistance_penetration: "Resistance Penetration",
    yes: "yes",
    no: "no",
    tiles: "tiles",
    attack: "Attack",
    heal: "Heal",
    buff: "Buff",
    movement: "Movement",
    charge: "Charge",
    turn: "Turn",
    turns: "turns",
    cooldown: "Cooldown",
    map_to_hotbar: "Map ability/item",
    remove_from_hotbar: "Remove ability/item",
    removed_in: "Removed in",
    deals: "Deals",
    // Enemy names
    skeletonWarrior_name: "Skeleton Warrior",
    skeletonArcher_name: "Skeleton Archer",
    skeletonMage_name: "Skeleton Mage",
    greySlime_name: "Grey Slime",
    norsemanBerserk_name: "Norseman Berserker",
    norsemanHunter_name: "Norseman Hunter",
    // LOG TEXTS
    you: "You",
    recovery_pl: "recovering",
    health_points: "health",
    for: "for",
    death: "dies.",
    damage_from_effect_pl: "<c>yellow<c>You<c>white<c> take [ICON][DMG] damage from [STATUS]!",
    damage_from_effect: "<c>white<c>[TARGET] takes [ICON][DMG] damage from [STATUS].",
    player_death_log: "YOU ARE DEAD...",
    cure_pl: "<c>yellow<c>You<c>white<c> cure yourself!",
    cure: "[ACTOR] cures themself.",
    // WORLD TEXTS
    gained_xp: "Gained [XP] XP!",
    player_death: "YOU WERE KILLED!",
    // Damage types
    poison_damage: "Poison",
    // Misc
    attack_name: "base attack damage",
    cures_statuses: "Cures",
    resistance: "Resistances",
    item_weight: "Weight",
    item_worth: "Worth",
    item_grade: "Grade",
    status_effects: "Status effects",
    encumbrance: "Encumbrance",
    shrine_activated: "Shrine activated!",
    shrine_used: "Shrine's power has already been spent...",
    // Grades
    common: "Common",
    uncommon: "Uncommon",
    rare: "Rare",
    mythical: "Mythical",
    legendary: "Legendary",
    // Statuses
    effect_poison_name: "Poison",
    effect_poison_desc: "Poison courses through your body, \nweakening and harming you.",
    effect_venom_name: "Venom",
    effect_venom_desc: "Venom courses through your body, \nweakening and harming you.",
    effect_rage_name: "Rage",
    effect_rage_desc: "You are slighty upset.",
    effect_berserk_name: "Berserk",
    effect_berserk_desc: "RRAAAAAGHH!!",
    efect_dazed_name: "Dazed",
    effect_dazed_desc: "A blow has left you dazed, \nmaking it much harder to perform any action.",
    // Abilities and stuff
    attack_action_desc_pl: "<c>yellow<c>You<c>white<c> connect an attack against [TARGET] and harm them for [DMG] damage.",
    attack_action_desc: "attacks [TARGET], dealing [DMG] damage.",
    focus_strike_name: "Focus Strike",
    focus_strike_desc: "Observe your opponent with precision,\nstriking only at the greatest opening.",
    focus_strike_action_desc_pl: "<c>yellow<c>You<c>white<c> focus on your opponents' mistakes, punishing [TARGET] with [DMG] damage.",
    focus_strike_action_desc: "focus strikes [TARGET] for [DMG] damage.",
    true_shot_name: "True Shot",
    true_shot_desc: "Unleash a precise arrow with all your might,\nstriking your opponent's weak point.",
    true_shot_action_desc_pl: "<c>yellow<c>You<c>white<c> coat an arrow in magic, and cast true shot on [TARGET], dealing [DMG] damage.",
    true_shot_action_desc: "shoots a magic powered arrow at [TARGET], dealing [DMG] damage.",
    first_aid_name: "First Aid",
    first_aid_desc: "Do whatever you can to recover\nfrom slight injuries on the field, ",
    first_aid_action_desc_pl: "perform first aid on your wounds, ",
    first_aid_action_desc: "performs first aid on their wounds, ",
    icy_javelin_name: "Icy Javelin",
    icy_javelin_desc: "Shoot a javelin made of pure ice and magic.",
    icy_javelin_action_desc_pl: "<c>yellow<c>You<c>white<c> form a pike from ice, and cast it towards [TARGET], dealing [DMG] damage.",
    icy_javelin_action_desc: "fires a javelin of ice at [TARGET], dealing [DMG] damage.",
    barbarian_rage_name: "Barbarian Rage",
    barbarian_rage_desc: "Stop thinking and switch to pure offense,\nbolstered by your ability to ignore pain!",
    barbarian_rage_action_desc_pl: "fill your mind with nothing but rage at the bastard enemies you face!",
    barbarian_rage_action_desc: "fills their mind with unyielding rage!",
    berserk_name: "Berserk",
    berserk_desc: "RRRAAAAAAAAAAAAAAAAAAGHHHHH!!!!!!",
    berserk_action_desc_pl: "YOU THROW AWAY ANY THOUGHT OF SELF PRESERVATION, IT'S TIME TO PUT THESE BASTARDS TO SLEEP!!!",
    berserk_action_desc: "GOES COMPLETELY BERSERK, BETTER BE WARY!!",
    shadow_step_name: "Shadow Step",
    shadow_step_desc: "Step in to the shadow, \nto find a new realm.",
    shadow_step_action_desc_pl: "<c>yellow<c>You<c>white<c> use the shadows to your advantage, moving rapidly to your destination.",
    shadow_step_action: "uses the shadows as a boost to get to their destination.",
    charge_name: "Charge",
    charge_desc: "Charge wildly at your foe.",
    charge_action_desc_pl: "<c>yellow<c>You<c>white<c> charge at [TARGET], dealing [DMG] damage!",
    charge_action_desc: "charges at [TARGET], dealing [DMG] damage.",
    purification_name: "Purification",
    purification_desc: "Purify your body of poisons and other maladies.",
    blight_name: "Blight",
    blight_desc: "Blight your foe to weaken them.",
    blight_action_desc_pl: "<c>yellow<c>You<c>white<c> blight [TARGET], dealing [DMG] damage and weakening them!",
    blight_action_desc: "blights [TARGET], dealing [DMG] damage and weakening them.",
};
//# sourceMappingURL=localisation.js.map