// /* NOTE - THIS WILL *NEVER* FULLY TRANSLATE THE GAME, BUT IT WILL ATLEAST PROVIDE YOU WITH FLAVOUR TEXTS IN YOUR PREFERRED LANGUAGE */ //

const finnish = {
  // identifier
  language_id: "finnish",
  finnish: "Suomi",
  english: "English",

  // Technical stuff
  changeWordOrder: true,
  mana: "Taika",
  health: "Terveys",
  str: "Voimaa",
  dex: "Taitoa",
  vit: "Sisua",
  int: "Älykkyyttä",
  cun: "Oveluutta",
  crush: "Murskaavaa",
  slash: "Viiltävää",
  pierce: "Lävistävää",
  magic: "Maagista",
  fire: "Tuli",
  ice: "Jää",
  dark: "Pimeää",
  divine: "Jumalallinen",
  lightning: "Sähkö",
  crush_def: "Murskaus",
  slash_def: "Viilto",
  pierce_def: "Lävistävyys",
  magic_def: "Maagista",
  fire_def: "Tuli",
  ice_def: "Jää",
  dark_def: "Pimeä",
  divine_def: "Jumalallinen",
  lightning_def: "Sähkö",
  hpMax: "Terveyttä",
  mpMax: "Taikaa",
  sight: "Näköä",
  increases: "Nostaa",
  decreases: "Alentaa",
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
  recharge_only_in_combat: "Latautuu vain taistelussa",
  targets_self: "Kohde on oma hahmo",
  mana_cost: "Taian käyttö",
  use_range: "Käyttö matka",
  damage_multiplier: "Vahingon kerroin",
  resistance_penetration: "Puolustuksen läpäisy",
  aoe_size: "Vahinkoalueen koko",
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
  cooldown: "Latausaika",
  map_to_hotbar: "Lisää kyky/työkalu",
  remove_from_hotbar: "Poista kyky/työkalu",
  removed_in: "Kestää",
  deals: "Aiheuttaa",
  perk_points: "Perkki pisteet",
  stat_points: "Stat pisteet",
  lvl_up: "Tasosi nousi! Se on nyt [LVL]!",

  // Item definitions
  slash_damageSub: "Viiltävä",
  slash_damageMain: "Haavoittavan",
  crush_damageSub: "Tylppä",
  crush_damageMain: "Murskaavan",
  pierce_damageSub: "Pistävä",
  pierce_damageMain: "Lävistävän",
  magic_damageSub: "Lumottu",
  magic_damageMain: "Maagisen",
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
  magic_resistanceSub: "Lumottu",
  magic_resistanceMain: "Magialta Suojaava",
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
  healingScrollI_name: "Parannuksen Loitsukirja I",
  manaScrollI_name: "Taianpalautuksen Loitsukirja I",
  dagger_name: "Tikari",
  stick_name: "Keppi",
  chippedBlade_name: "Kulunut Terä",
  longsword_name: "Pitkämiekkä",
  chippedAxe_name: "Kulunut Kirves",
  huntingBow_name: "Metsästys Jousi",
  raggedShirt_name: "Ryysyinen Paita",
  raggedBoots_name: "Ryysyiset Jalkimet",
  raggedPants_name: "Ryysyiset Housut",
  raggedGloves_name: "Ryysyiset Hanskat",
  raggedHood_name: "Ryysyinen Huppu",

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
  useConsumable: "Käytät taiallisen esineen!",
  moves_to: "liikkuu ruutuun",

  // WORLD TEXTS
  gained_xp: "Sait [XP] XP!",
  player_death: "SINUT SURMATTIIN!",

  // Damage types
  poison_damage: "Myrkytys",
  burning_damage: "Polttavaa",

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
  add_ability: "Lisää kyvyn",
  requires: "Vaatii",
  critChance: "Kriittisen iskun mahdollisuus",
  critDamage: "Kriittisen iskun voima",
  resistAll: "Puolustusvoima",
  uses: "Käyttökerrat",
  item_name: "Tavaran Nimi",
  item_type: "Tyyppi",
  item_rarity: "Harvinaisuus",
  item_weight_title: "Paino",
  item_worth_title: "Arvo",
  weapon: "ase",
  armor: "panssari",
  consumable: "käytettävä",

  /* MENU */

  menu_resume: "Takaisin",
  menu_options: "Asetukset",
  menu_save_games: "Tallennetut Pelit",
  menu_main_screen: "Päämenu",
  menu_new_game: "Uusi Peli",
  menu_load_game: "Lataa Peli",

  setting_log_enemy_movement: "Kirjaa vihollisten sijainnit",
  setting_game_language: "Pelin kieli",

  save_over: "Tallenna peli",
  load_game: "Jatka peliä",
  delete_save: "Poista peli",
  create_save: "Luo uusi tallennus",
  create_file: "Tallenna tiedostoon",
  load_file: "Jatka peliä tiedostosta",

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
  effect_ward_of_aurous_name: "Aurouksen Suoja",
  effect_ward_of_aurous_desc: "Kehosi on turvassa Aurouksen suojan alla.",
  effect_battle_fury_name: "Taistelun Riemu",
  effect_battle_fury_desc: "Riemuitse ja raivoa! Adrenaniili kiertää veressä ja veri lentää!",
  effect_burning_name: "Palaa",
  effect_burning_desc: "OLET TULESSA!",

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
  icy_javelin_action_desc_aoe_pl: "[TARGET] ottaa [DMG] vahinkoa räjähdyksen voimasta!",
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
  fireball_name: "Tulipallo",
  fireball_desc: "Heitä tulinen räjähde vihollistesi suuntaan \nja sytytä kaikki kohteesi liekkeihin.",
  fireball_action_desc_pl: "Lähetät tulisen ammuksen kohti vastustajiesi turmiota!",
  fireball_action_desc_aoe_pl: "[TARGET] paistuu räjähtävissä liekeissä, ottaen [DMG] vahinkoa!",
  piercing_mana_bolt_name: "Maaginen Pultti",
  piercing_mana_bolt_desc: "Ammu taiallinen panos vihollistasi kohti.",
  piercing_mana_bolt_action_desc_pl: "Taiot maagisen ammuksen lentämään kohti hahmoa [TARGET], tehden [DMG] vahinkoa!",
  piercing_mana_bolt_action_desc: "ampuu maagisen pultin hahmoa [TARGET] kohti, aiheuttaen [DMG] vahinkoa.",
  ward_of_aurous_name: "Aurouksen Kilpi",
  ward_of_aurous_desc: "Suojaa kehosi tuhoutumattomalla kilvellä!",
  ward_of_aurous_action_desc_pl: "Kutsut Aurouksen kilven suojaamaan kehoasi!",
  ward_of_aurous_action_desc: "suojaa itsensä maagisella kilvellä.",
  battle_fury_name: "Taistelijan Raivo",
  battle_fury_desc: "Hallittu viha vahvistaa.",
  battle_fury_action_desc_pl: "Annat taistelun viedä mielesi mennessään!",
  battle_fury_action_desc: "riehaantuu taistelun riemusta.",
  venomous_blow_name: "Häijy Isku",
  venomous_blow_desc: "Tässä tällissä onkin ikävä yllätys.",
  venomous_blow_action_desc_pl: "Myrkytät hahmon [TARGET] nopealla iskulla, joka myös aiheuttaa [DMG] vahinkoa!",
  venomous_blow_action_desc: "myrkyttää hahmon [TARGET] iskulla joka tekee [DMG] vahinkoa.",
  poisoned_arrow_name: "Myrkky Nuoli",
  poisoned_arrow_desc: "Taistelu muuttuu metsästykseksi.",
  poisoned_arrow_action_desc_pl: "Ammut myrkyllisen nuolen kohti hahmoa [TARGET], tehden [DMG] vahinkoa!",
  poisoned_arrow_action_desc: "ampuu myrkyllisen nuolen kohti hahmoa [TARGET], aiheuttaen [DMG] vahinkoa.",

  // PERKS // 

  // SORCERER
  introduction_to_sorcery_name: "Maagin Alkukirja",
  introduction_to_sorcery_desc: "Kehitys tapahtuu askel kerrallaan.",
  intent_studies_name: "Taikojan Oppi",
  intent_studies_desc: "Opiskelu korostaa kokemusta.",
  might_of_magic_name: "Magian Mahti",
  might_of_magic_desc: "Sotaan valmistautuminen edistyy parhaiten magialla.",
  spells_of_battle_name: "Taistelun Taiat",
  spells_of_battle_desc: "Keskity helpoimpaan iskuusi ja et voi epäonnistua.",
  school_of_fire_name: "Tulen Opetukset",
  school_of_fire_desc: "Anna sielusi palaa intohimosta!",
  molded_by_flame_name: "Liekeissä Herännyt",
  molded_by_flame_desc: "Tulen voima herättää uusia tuntemuksia.",
  shield_of_ages_name: "Aikojen Kilpi",
  shield_of_ages_desc: "Vanhat kikat suojaavat uusia loitsijoita.",
  shield_of_aurous_name: "Aurouksen Suoja",
  shield_of_aurous_desc: "Aurous on havainnut kunniasi!",
  burning_passion_name: "Palava Intohimo",
  burning_passion_desc: "Mikään ei pysäytä liekehtivää sieluasi!",
  wisdoms_of_the_past_name: "Menneet Viisaudet",
  wisdoms_of_the_past_desc: "Vanhoilta ajoilta voi paljon neuvoja ammentaa.",
  flame_wizard_fury_name: "Tulivelhon Viha",
  flame_wizard_fury_desc: "Viha muuttuu tuleksi, ja tuli voimaksi.",

  // FIGHTER
  battle_sense_name: "Kamppailun Aistit",
  battle_sense_desc: "Ken taistelee elääkseen, tuntee pienimmänkin muutoksen ilmassa.",
  fighters_vitality_name: "Taistelijan Vireys",
  fighters_vitality_desc: "Lähitaistelussa vain vahvimmat soturit selviytyvät.",
  patient_blow_name: "Kärsivällinen Soturi",
  patient_blow_desc: "Tilanteen tarkkailu on taistelijan vahvin kortti.",
  strength_training_name: "Voimatreeni",
  strength_training_desc: "Voima edistää kamppailu-taitoa.",
  fighting_style_name: "Harjaantunut Iskijä",
  fighting_style_desc: "En pelkää miestä, joka on kerran harjoitellut 10 000 eri iskua, \nmutta pelkään miestä joka on harjoitellut yhtä iskua 10 000 kertaa.",
  furious_assault_name: "Raivokas Hyökkäys",
  furious_assault_desc: "Taistelua ei voiteta seisoskelemalla! Eteenpäin!",
  tactical_genius_name: "Taktiikkojen Kuningas",
  tactical_genius_desc: "Vahva on hän, kuka voi ajatella sodan raivossa.",
  resistant_in_melee_name: "Kestävä",
  resistant_in_melee_desc: "Taistelussa pysyminen on jo pitkä askel voittoon.",
  charging_bull_name: "Ryntäävä Sonni",
  charging_bull_desc: "Ottaen mallia karmeasta eläimestä, murskaa esteesi rajulla voimalla!",
  concentrated_warrior_name: "Taistelun Tasapaino",
  concentrated_warrior_desc: "Voiton voi taata vain yhdistämällä julman raivon ja lempeän kärsivällisyyden.",

  // ROGUE
  way_of_the_rogue_name: "Varjoinen Tie",
  way_of_the_rogue_desc: "Kamppailun ei tarvitse olla reilua, vain voitolla on merkitystä.",
  weakpoint_spotter_name: "Heikkouden Löytäjä",
  weakpoint_spotter_desc: "Kohdetta isketään vain parhaimalla hetkellä.",
  shadow_warrior_name: "Varjosoturi",
  shadow_warrior_desc: "Livahda varjoihin kun tilanne kääntyy.",
  fighting_dirty_name: "Likainen Tappelija",
  fighting_dirty_desc: "Luota taitoosi, mutta luota älyysi enemmän.",
  glass_cannon_name: "Hyökkääjä",
  glass_cannon_desc: "Puolustamalla ei taistelua voiteta!",
  ranged_expert_name: "Tarkka-ampuja",
  ranged_expert_desc: "Opettele tappamaan kaukaa.",
  poison_specialist_name: "Myrkyttäjä",
  poison_specialist_desc: "Soturi kuin soturi kärsii myrkytyksen seuraamuksista.",
  simple_strokes_name: "Tehokkaat Viillot",
  simple_strokes_desc: "Kun ei muuhun kykene, varmat iskut pelastavat.",
  dance_of_death_name: "Kuoleman Tanssi",
  dance_of_death_desc: "Kiemurtelu ei pelasta tältä tarkkuudelta!",
  poison_from_afar_name: "Tarkka-Myrkyttäjä",
  poison_from_afar_desc: "Kaukaa turvasta on helpoin murhata.",
  quicker_draw_name: "Nopeami Veto",
  quicker_draw_desc: "Nopeammin, nopeammin!",

  // NECROMANCER
  pursuit_of_undeath_name: "Kuolemattomuuden Tavoittelu",
  pursuit_of_undeath_desc: "Kryptisin keinoin.",
} as any;

const english = {
  // Identifier
  language_id: "english",
  finnish: "Suomi",
  english: "English",

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
  magic: "Magical",
  fire: "Fire",
  ice: "Ice",
  dark: "Dark",
  divine: "Divine",
  lightning: "Lightning",
  crush_def: "Crushing",
  slash_def: "Slashing",
  pierce_def: "Piercing",
  magic_def: "Magical",
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
  recharge_only_in_combat: "Recharge Only In Combat",
  targets_self: "Targets Self",
  mana_cost: "Mana Cost",
  use_range: "Use Range",
  damage_multiplier: "Damage Multiplier",
  resistance_penetration: "Resistance Penetration",
  aoe_size: "Area of Effect",
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
  perk_points: "Perk points",
  stat_points: "Stat points",
  lvl_up: "You levelled up! Your level is now [LVL]!",

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
  useConsumable: "<c>yellow<c>You<c>white<c> use a consumable item!",
  moves_to: "moves to tile",


  // WORLD TEXTS
  gained_xp: "Gained [XP] XP!",
  player_death: "YOU WERE KILLED!",

  // Damage types
  poison_damage: "Poison",
  burning_damage: "Burning",

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
  add_ability: "Grants ability",
  requires: "Requires",
  critChance: "Critical Hit Chance",
  critDamage: "Critical Hit Damage",
  resistAll: "All Resistances",
  uses: "Uses Remaining",
  item_name: "Item name",
  item_type: "Type",
  item_rarity: "Rarity",
  item_weight_title: "Weight",
  item_worth_title: "Worth",
  weapon: "weapon",
  armor: "armor",
  consumable: "consumable",

  /* MENU */

  menu_resume: "Resume",
  menu_options: "Options",
  menu_save_games: "Save Games",
  menu_main_screen: "Main Menu",
  menu_new_game: "New Game",
  menu_load_game: "Load Game",

  setting_log_enemy_movement: "Log enemy movement",
  setting_game_language: "Game language",

  save_over: "Save over file",
  load_game: "Load game",
  delete_save: "Delete save file",
  create_save: "Create new save",
  create_file: "Save to file (downloads a .txt file)",
  load_file: "Load from file (opens prompt)",

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
  effect_blighted_name: "Blighted",
  effect_blighted_desc: "Your very soul is weakened from a vile blight.",
  effect_ward_of_aurous_name: "Ward of Aurous",
  effect_ward_of_aurous_desc: "Feel at ease, Aurous himself is guaranteeing your safety.",
  effect_battle_fury_name: "Fury",
  effect_battle_fury_desc: "You are concentrating on physical might.",
  effect_burning_name: "Burning",
  effect_burning_desc: "YOU ARE ON FIRE!",

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
  fireball_name: "Fireball",
  fireball_desc: "Incinerate your foes with a flaming ball of destruction.",
  fireball_action_desc_pl: "You throw a fiery ball towards your foes!",
  fireball_action_desc_aoe_pl: "[TARGET] is burned by the blast, causing [DMG] damage!",
  piercing_mana_bolt_name: "Piercing Bolt of Magic",
  piercing_mana_bolt_desc: "Pierce your foe with pure magic.",
  piercing_mana_bolt_action_desc_pl: "<c>yellow<c>You<c>white<c> fire a mana bolt at [TARGET], dealing [DMG] damage!",
  piercing_mana_bolt_action_desc: "shoots a mana bolt at [TARGET], dealing [DMG] damage.",
  ward_of_aurous_name: "Ward of Aurous",
  ward_of_aurous_desc: "Defend your body with an invincible shield.",
  ward_of_aurous_action_desc_pl: "<c>yellow<c>You<c>white<c> summon the ward of Aurous himself upon your body!",
  ward_of_aurous_action_desc: "defends themself with a magical ward.",
  battle_fury_name: "Battle Fury",
  battle_fury_desc: "Concentrating your anger into a controlled fury \nwill allow you to summon immense power.",
  battle_fury_action_desc_pl: "<c>yellow<c>You<c>white<c> allow a controlled fury to manifest in your mind!",
  battle_fury_action_desc: "commits to a furious offensive.",
  venomous_blow_name: "Venomous Blow",
  venomous_blow_desc: "This attack has a nasty surprise.",
  venomous_blow_action_desc_pl: "<c>yellow<c>You<c>white<c> strike [TARGET] with a sudden blow, dealing [DMG] damage and poisoning them!",
  venomous_blow_action_desc: "poisons [TARGET] with a sudden strike, dealing [DMG] damage.",
  poisoned_arrow_name: "Poisoned Arrow",
  poisoned_arrow_desc: "Death from afar. Slow death.",
  poisoned_arrow_action_desc_pl: "<c>yellow<c>You<c>white<c> shoot a poisonous arrow at [TARGET], dealing [DMG] damage!",
  poisoned_arrow_action_desc: "shoots an arrow coated in poison at [TARGET], dealing [DMG] damage.",

  // PERKS //

  // SORCERER
  introduction_to_sorcery_name: "Introduction to Sorcery",
  introduction_to_sorcery_desc: "Even the greatest of mages \nmust start somewhere.",
  intent_studies_name: "Intent Studies",
  intent_studies_desc: "Learning is a sign of good fortune.",
  might_of_magic_name: "Might of Magic",
  might_of_magic_desc: "Harness the power of sorcery.",
  spells_of_battle_name: "Spells of Battle",
  spells_of_battle_desc: "In battle only the most simple of spells will act consistently.",
  school_of_fire_name: "The School of Fire",
  school_of_fire_desc: "Your will burns like a great bonfire.",
  molded_by_flame_name: "Molded by Flame",
  molded_by_flame_desc: "Become one with fire.",
  shield_of_ages_name: "Shield of Ages",
  shield_of_ages_desc: "Proper magisters prepare measures against magic.",
  shield_of_aurous_name: "Ward of Aurous",
  shield_of_aurous_desc: "Aurous himself protects you with his warmth.",
  burning_passion_name: "Burning Passion",
  burning_passion_desc: "Your passion for magic is set ablaze!",
  wisdoms_of_the_past_name: "Wisdoms of the Past",
  wisdoms_of_the_past_desc: "Knowledge from the past protects the future.",
  flame_wizard_fury_name: "The Flame Wizard's Fury",
  flame_wizard_fury_desc: "Your foes shall tremble at your flaming fury!",

  // FIGHTER
  battle_sense_name: "Battle Sense",
  battle_sense_desc: "After numerous battles, you have developed a keen sense for danger",
  fighters_vitality_name: "Fighter's Vitality",
  fighters_vitality_desc: "Combat necessitates the sturdiest of bodies.",
  patient_blow_name: "Patient Blow",
  patient_blow_desc: "Careful observation is a fighter's greatest asset.",
  strength_training_name: "Strength Training",
  strength_training_desc: "When tactics fail, strength is relied upon.",
  fighting_style_name: "Fighting Style",
  fighting_style_desc: "I fear not the man who has practiced 10 000 blows once, \nbut I fear the man who has practiced one blow 10 000 times.",
  furious_assault_name: "Furious Assault",
  furious_assault_desc: "Nothing will be gained without a hearty offensive!",
  tactical_genius_name: "Tactical Genius",
  tactical_genius_desc: "Keeping a calm mind in the midst of battle grants one an immense advantage.",
  resistant_in_melee_name: "Resistant in Melee",
  resistant_in_melee_desc: "Developing keen sense of the melee allows you to avoid some blows.",
  charging_bull_name: "Charging Bull",
  charging_bull_desc: "The enemy will be disoriented by a sudden frontal charge!",
  concentrated_warrior_name: "Balanced Warrior",
  concentrated_warrior_desc: "Combining patience with unrelenting offense fells all evils.",

  // ROGUE
  way_of_the_rogue_name: "Way of the Rogue",
  way_of_the_rogue_desc: "Fight from the shadows, never risking your skin!",
  weakpoint_spotter_name: "Weakpoint Spotter",
  weakpoint_spotter_desc: "Strike only at the most opportune moment.",
  shadow_warrior_name: "Shadow Warrior",
  shadow_warrior_desc: "Keep your distance from the foe.",
  fighting_dirty_name: "Fighting Dirty",
  fighting_dirty_desc: "Honor and fairness are excellent ways to get killed.",
  glass_cannon_name: "Glass Cannon",
  glass_cannon_desc: "Make every blow count, for they could be the last.",
  ranged_expert_name: "Ranged Expert",
  ranged_expert_desc: "Pelt them with arrows.",
  poison_specialist_name: "Poison Specialist",
  poison_specialist_desc: "Poison can always be relied upon.",
  simple_strokes_name: "Simple Strokes",
  simple_strokes_desc: "Become a well tuned killing machine.",
  dance_of_death_name: "Dance of Death",
  dance_of_death_desc: "No amount of struggling will stop me!",
  poison_from_afar_name: "Filthy Marksman",
  poison_from_afar_desc: "I'll just stay safe here while you die over there.",
  quicker_draw_name: "Quicker Draw",
  quicker_draw_desc: "Faster, faster!",

  // NECROMANCER
  pursuit_of_undeath_name: "Pursuit of Undeath",
  pursuit_of_undeath_desc: "Pursuing undeath.",
} as any;