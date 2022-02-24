# 1.0.7 ~ 24.2.2022

### Patch - The Roguelikery

## New Additions

- Improved the map editor.
- Reintroduced all stat randomization as a toggleable option.
  > Randomization is by default off and must be enabled in the settings.

## Fixes & Tweaks

- Fixed some more localisation.
- Made the character creation screen scale slightly better.

# 1.0.6 ~ 23.2.2022

### Patch - The Blacksmithing Update

## New Additions

- Added new npc "Blacksmith Maroch"
  > Maroch can upgrade your items and has a quest.
- Added smithing, you can now upgrade your equipment up to +5!
  > Note: Smithing screen is very rough, expect to have some minor inconveniences.
  > To upgrade an item, you need to have an extra two identical items of the same level.
  > Upgrading an item costs 50% of its full price.
- Hovering your portrait in the character screen will display all modifiers from perks, items etc combined.

## Fixes & Tweaks

- Added a close button to most windows.
- Fixed some localisation issues.
- Made some fallbacks to missing localisation.

# 1.0.5 ~ 22.2.2022

### Patch - The Equipment Rush

## New Additions

- Added 2 new weapons:
  - Crimson Staff, wand for mages using fire.
  - Crystal Wand, wand for mages using ice.
- Added 2 new armor sets:
  - Apprentice, a light set for mages.
  - Ranger, a medium set for all characters.
- Added `Hunter` artifact set.
- Reintroduced stat randomness for artifacts.
- Added the option to toggle helmet visibility.

## Fixes & Tweaks

- Fixed duplicate items being removed when selling one copy.
- Made some screens scale slightly better.
- Reworked keyboard movement, added diagonal movement keys.
- Fixed some player rendering errors.
- Made hotbar items and abilities draggable.

# 1.0.4 ~ 20.2.2022

### Patch - The Summoning of the Codex

## New Additions

- Codex now displays actual information about its contents.

## Fixes & Tweaks

- Codex now displays the index of each entry.
- The effect "Dazed" no longer stuns.
- You can now heal even while stunned.
- Summoned creatures are now shown in a list with their hp bar and name.
- Fixed some issues with summoned creatures.
- Fixed perk screen scroll resetting when buying new perk.
- Enforced stackable items to not have an amount of NaN.

# 1.0.3 - ~ 17.2.2022

### Patch - The Customization

## New Additions

- Added 4 new hairstyles.
- Added 2 new eye styles.
- Added 2 new face variants.

## Fixes & Tweaks

- Added more zoom levels.
- Ranged mode no longer shows red when enemy is in range to be hit.
- Added mana potions to store.
- Slight balance changes.
- Fixed some localisation issues.
- Fixed some issues with loading saves.

# 1.0.2 ~ 16.2.2022

### Patch - The Ability Scheme

## New Additions

- You can now view your passive abilities in the character screen.
- You now gain a racial ability upon reaching level 10.
- Added the option to play as a woman when creating a new character.
- Added a clothing toggle in character creation.

## Fixes & Tweaks

- Fixed an issue with the perk `On second thought..` decreasing status effects instead of increasing.
- Fixed an issue with older saves being unable to be loaded due to the reworked stat modifiers.
- Fixed crash when quest enemies spawn.
- Added some minor localisation and expanded texts.

# 1.0.1 ~ 15.2.2022

### Patch - The Grip of Death

## New Additions

- Added a death screen.
- Interacting with your grave now restores lost gold and exp.

## Fixes & Tweaks

- Fixed looting always picking top option regardless of where the user clicked.
- Fixed some issues with interacting by clicking.
- Fixed diagonal movement when going straight.
- Turned all permanent stat modifiers into Classes to make managing them easier.
- Made a few minor styling adjustments.

# 1.0.0 ~ 13.2.2022

### This release contains a lot of fixes and mechanics in preparation for a playtest.

## New Additions

- Added a questing system, allowing you to get quests from npcs!
  > Basic functionality already there, just needs a lot of expansion and polish.  
  > There are currently 2 test quests in the game, both about defeating slimes.
- Added an ingame codex
  > Codex has basic information about items, enemies and classes.
  > Will be expanded with mechanics and lore as the game progresses.
- Added 4 new barbarian perks and 2 new abilities
- Added 2 new ranger perks, changed 3 old ones and added 2 new abilities.

## Fixes & Tweaks

- Added diagonal movement.
- Improved outline rendering.
- Improved save menu:
  > Now remembers scroll and does not reset when deleting saves.
  > No longer delays loading each save without reason.
- Increased xp needed for leveling.
- You can now multiclass after level 10, allowing a main and sub class.
  > Main class is picked at game start, sub class gained later.
- Tweaked some abilities.
- Resistance penetration no longer lowers defense below 0.
- Merchant inventories can now be sorted.
- Items you pick up will now automatically be equipped if the corresponding slot is empty.
- Gold can no longer become NaN.
- You can now interact by clicking.
- Fixed equipped items replacing old item when using context menu.
- Added "undo changes" option to leveling screen.
- Added tooltips for stats in leveling screen.
- Dex now increases hit chance and evasion.

# 0.9.0 ~ 1.1.2022

### This is an alpha release, most game mechanics are implemented!

## New Additions

- Added new enemies, including a new boss mob.
- Added new map
- Added merchants into the game
  > Talk to an NPC and click "STORE" to see their wares.  
  > Characters have more interactions, but they currently lead nowhere.  
  > Quests will be implemented later, so stay tuned!
- Added 1 new item
- Reworked map editor, next update will have new larger and better maps!

## Fixes & Tweaks

- Fixed some rendering errors.
- Interact prompt no longer shows after looting chest completely.
- Held gold is now visible near health and mana.
- Weapons now display their actual attack range.
- Inventory now has a context menu and a new shortcut for dropping items. (Shift + m1)
- When hovering items and having lower stats than needed to equip, a warning is shown.
- Heavily rebalanced player stats:
  > Classes and races give far less starting stats, but significant modifiers.  
  > Player now gains only +2 stat points per level, +5 every 10 levels.
- Classes now have unique starting equipment.

# Indev Update 9 ~ 12.12.2021

## New Additions

- Added NPC characters
  > Currently only rendered in game with no interactions.
- Added UI-scaling!
  > In options, there's a new slider for UI scaling.  
  > Allows you to decide the size of the game's interface.  
  > Very useful if the interface is too big or small for your screen.

## Fixes & Tweaks

- Fixed an issue with being unable to move after starting new game when dead.
- Fixed an issue with the tooltip being stuck on the screen.
- Fixed the inventory breaking due to malformed items.
- Fixed chests not respawning when starting new game.
- Optimized pathfinding and rendering.
- Unequipped items are now placed at the position of the equipped item.

# Indev Update 8 ~ 20.11.2021

## New Features & Additions

- **_`Equipment has been completely reworked:`_**

  > Items no longer generate random stats, but instead can be upgraded from +0 to +5.  
  > Upgrades increase an item's base stats by 10% per level, max 50%.  
  > **NOTE: Upgades are not yet implemented.**

  Armor now has three new values:

  - Physical Armor that governs Slash, Crush and Pierce.
  - Magical Warding that governs Magic, Dark and Divine.
  - Elemental Shielding that govers Fire, Lightning and Ice.

  > Each point of armor reduces received damage of the governed attribute by 0.4%.  
  > Resistances are still a thing, but have been drastically lowered due to armor.

- Reworked how status effects work with abilities. Abilities can now give multiple status effects to user and target.
- Added new class:
  `Ranger`
  > Rangers focus on dealing damage with ranged attacks and setting up totems to aid them.  
  > Can summon a wolf companion to aid in combat.
- Added new abilities:
  - `Invigorating Finish`, a fighter skill that allows you to steal 50% of the defeated enemy's hp to heal yourself.'
  - `Warrior Shout`, a fighter skill for dealing AOE damage.
  - `Defend`, default skill for all classes, improves your defense for the turn it's picked on. No cooldown.
  - `Totem of Arrows`, a ranger skill that summons an immobile totem to shoot arrows at enemies.
  - `Ranger's Wolf`, a ranger skill that summons your wolf companion.
  - `Awaken`, a ranger skill that improves damage and sight.
- Added new items:
  - `Hiisi Bow`, slightly stronger ranged weapon.
  - `Healing & Mana Potions`, restorative items that stack.
- Added 2 new fighter perks.
- Added message system:
  - Messages are interactable entities that pop up to give the player a text to read.

## Tweaks

- Healing abilities can recover health based on % of max hp.
- Increased base sight by 2, allowing you to see a bit farther away.
- Enemies now reset their position and health when the player respawns.
- Enemies now have their aggro range increased when taking damage,
  making distant enemies chase the player for a limited time after being damaged.
- Reworked the text box, it now displays 13 messages by default, and can be expanded by pressing "Enter".
- When wielding a ranged weapon, pressing "G" will toggle ranged mode, allowing the player to see the arrow path.
- Added prompt when standing on interactable object.
- Minor text reworks and typo fixes.
- Vastly reduced save file size, allowing for more slots.

## Fixes

- Fixed minimap lagging behind while moving with keyboard.
- Fixed `Barbarian Charge` having infinite use range.
- Fixed summons being counted as player when displaying effects.
- Fixed "Distance to closest enemy" text getting in the way.
- Fixed ranged weapons not firing projectiles.
- Fixed enemies charging inside summons.

# Indev Update 7 ~ 22.10.2021

## New Features & Additions

- Added new artifact set `Lone Shade`, designed for rogues.

## Tweaks

- Reworked map rendering, added spritemap containing all tiles.
- Reworked minimap rendering, it should no longer slow the game down.
- Lowered base mana cost of `Icy Javelin` from **24** --> **16**.
- Perk screen now shows base stats with no modifiers, giving you a clearer picture of what you're upgrading.
- All race and class stats have been modified, hopefully making each one more balanced.

## Fixes

- Fixed perk screen jumping back when purchasing new perks.
- Fixed cooldowns not displaying properly.
- Fixed a bug that made perks persist when creating new characters without refreshing page.
- Items on the ground no longer flicker.

# Indev Update 6 ~ 5.10.2021

## New Features & Additions

- Added 3 new weapons.
- Added 1 new armour piece.
- Added 2 new hair styles.
- Added new enemies:
  - Orc Raider, heavy hitting melee beast.

## Tweaks

- Items on the ground are now highlighted with a golden shadow.
- Pressing the interact key will now pick items from the top of the loot pool.
- Increased rogue dummy's hit points from **8**-->**10**, but halved its aggro pulling (threat).
- Lowered all starting stats from **5**-->**1** and modified race stats.
- Upon starting a new game, the leveling screen will open automatically.

## Fixes

- Fixed an issue with enemies charging from too far away and not moving. Also slightly improved lag from enemy AI.
- Fixed an issue with enemies attacking twice when player is stunned.
- Fixed an issue with loading from file causing multiple errors.
- Fixed item rarity sorting in the inventory. Items are now sorted in order of grade properly.

# Indev Update 5 ~ 26.9.2021

## New Features & Additions

- Added new abilities:
  - `Hasty Distraction`, a Rogue ability that summons a dummy that distracts enemies.
    > The dummy has 8 hp and takes 1 damage per hit.  
    > The dummy can not move or attack.
  - `Icy Javelin`, a Sorcerer spell. High damage single target spell with a nasty debuff.
- Added new perks:
  - `Tricky Distraction`, a Rogue perk that grants the ability `Hasty Distraction`.
  - `Poison Taster`, a Rogue perk that improves poison resistances.
  - `Elemental Mage`, a Sorcerer perk that grants the ability `Icy Javelin` and increases elemental damage.
  - `Armour Piercing Javelin`, a Sorcerer perk that buffs the ability `Icy Javelin`.

## Tweaks

- Reworked evasion, it no longer grants immunity to damage and statuses, instead it halves incoming damage.
  > Lowered the player's base hit chance from the previous **75** to **60**.
- Performance increase, made offscreen enemies not even try to render.
- Removed some error messages, this has no impact on gameplay.
- Modified the Ashen model.
- Burning status effect damage increased **3** --> **4**, stats modified to: **+10** Fire Res, **-10** Ice Res, **-5** All Res.
- Vitality and intelligence now increase hp and mana regen by 1%.

## Fixes

- Optimised modifier reading, performance should be improved slightly.
- Fixed chest indexing issue allowing the player to dupe items down the list.

# Indev Update 4 ~ 19.9.2021

## New Features & Additions

- Map has been updated:
  - Added new dungeon area with unique loot and plenty of chests!
  - Added roads and land marks to previosly desolate areas, making exploration easier and more fun!
  - Added more enemies to empty areas.
- Added new abilities:
  - `Smoke Bomb`, a Rogue ability that debuffs enemies in an AOE.
  - `Summon Skeleton Warrior`, a Sorcerer spell that summons a Skeleton Warrior to fight for you.
- Added new perks:
  - `Smoke Screen`, a Rogue perk that grants the ability `Smoke Bomb`.
  - `Sneakier Stabbing`, a Rogue perk that improves the ability `Sneaky Stabbing`.
  - `Smoke & Mirrors`, a Rogue perk that improves the ability `Smoke Bomb`.
  - `The Summoner King's Call`, a Sorcerer perk that grants the ability `Summon Skeleton Warrior`.
  - `Bonds forged from Magic`, a Sorcerer perk that improves the ability `Summon Skeleton Warrior`.
- Added tooltip marking the distance to closest enemy.

## Tweaks

- Lowered Hiisi Hunter's poison damage from **5** to **3**.
- English name of `Retreat` changed to `Draw Back`.
- `Introduction to Sorcery` and `Wisdoms of the Past` perks now grant additional mana recovery.
- `Heightened Casting` passive ability now requires **75%** mp instead of **70%**, but grants additional **25** hit chance.
- Increased the player's base hit chance from **50** to **75**, and base evasion from **25** to **30**.
- Player now has a base mana regen, on top of bonus based on max mana. This translates to more regen in the early game.

## Bug Fixes

- Fixed items in chests not displaying in correct language.
- Fixed enemy health bars becoming massive.
- Fixed slime that spawned inside a tree.
- Fixed path to area with 2 slimes and a chest.
- Fixed peninsula with trolls being an inaccessible island.

# Indev Update 3 ~ 18.9.2021

## New Features & Additions

- Added new perk tree: Adventurer
  > Adventurer is a generic tree available to all classes.  
  > It provides placeholder bonuses for when you max out your class.
- Added new abilities:
  - `Sneaky Stabbing`, a Rogue ability that buffs your attack.

## Tweaks

- Increased stat and perk point gains per level up:
  - SP gain increased from 3 to 5.
  - Up to level 5, gain 2 perk points per level up.
  - On levels 10, 20, 30, 40 and 50, gain 3 perk points per level up, otherwise 1.
- Made each level take ~15% less xp.
- Increased the xp gained from killing most enemies.
- Changed the Rogue perk `Weakpoint Spotter` from giving 5% crit chance to giving the ability `Sneaky Stabbing`.

## Bug fixes

- Fixed invalid comparison of ability keys:
  > Previosly, two abilities that both had "charge" in the id, were conflicting.  
  > Now the code checks for exact id, not close.

# Indev Update 2 ~ 13.9.2021

## New Features & Additions

- Expanded artifact system:
  > Added working set bonuses, 2 and 3 piece variants.  
  > Added tooltip for set bonuses, grey means inactive, green means active.  
  > Added artwork for existing artifacts.
- Added 2 new artifact sets:
  - Scholar, granting mages great bonuses to wizardry.
  - Warrior, granting melee characters great bonuses to fighting.

## Tweaks

- Increased damage values of all weapons:
  - Dagger total damage increased from **4** to **8**. (6 piercing, 2 slashing)
  - Stick total damage increased from **3** to **9**. (9 crushing)
  - Troll Club total damage increased from **13** to **24**. (24 crushing)
  - Chipped Longsword total damage increased from **6** to **12**. (9 slashing, 3 piercing)
  - Longsword total damage increased from **9** to **14**. (10 slashing, 4 piercing)
  - Silver Sword total damage increased from **20** to **25**. (15 slashing, 5 piercing, 5 magic)
  - Chipped Axe total damage increased from **7** to **11**. (6 piercing, 5 crushing)
  - Hunting Bow total damage increased from **5** to **10**. (10 piercing)
  - Apprentice Wand total damage increased from **5** to **10**. (10 magic)
- Doubled all item spawn chances in chests.
- Made save name input text light.

## Bug fixes

- Removed the "charge" ability from slime type enemies.
- Fixed artifacts rolling stats on top of rolled stats, making them infinitely more powerful. This issue was caused by linked arrays.
- Fixed an issue where item classes did not generate, causing a softlock.
- Fixed an issue where upon loading game the player's perk tree would display incorrectly.

# Indev Update 1 ~ 9.9.2021

## New Features

- Added artifacts, items with great stat bonuses and matching sets.
  > Artifacts are equipped as invisible items in the inventory.  
  > There are currently 3 artifacts, with no art and no set effect yet.  
  > This feature is very much in development.

## Tweaks

- Spells scale with weapon damage instead of having a base damage.
  > Previosly spells would have a set damage that would receive only small multipliers.  
  > This lead to spells being incredibly powerful in the early game,  
  > but in the coming late game they would have become underpowered.  
  > Now spells modify your weapon's base damage to the damage the spell causes.  
  > For example, if your weapon deals 15 damage in total (types are irrelevant)  
  > then a spell might convert 80% of that damage (12) to fire and (3) to magic.
- Weapons now have unique scaling instead of just str for melee and dex for ranged.
  > Previosly weapons were in 2 categories, ranged and melee.  
  > Now they have a separate value for determining the used stat.  
  > It's possible, for example to have a dagger that scales with dex, not str.
- Chests now drop a minimum number of items (usually one) and have a maximum cap.  
  No more empty chests!

## Bug fixes

- Fixed respawning not working due to a non-existent variable.
- Fixed enemies not having cooldowns, this issue was caused by linked arrays.
