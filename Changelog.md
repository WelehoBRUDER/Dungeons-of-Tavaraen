# Indev Update 7 ~ 22.10.2021

## New Features & Additions
  * Added new artifact set ``Lone Shade``, designed for rogues.

## Tweaks
  * Reworked map rendering, added spritemap containing all tiles.
  * Reworked minimap rendering, it should no longer slow the game down.
  * Lowered base mana cost of ``Icy Javelin`` from **24** --> **16**.
  * Perk screen now shows base stats with no modifiers, giving you a clearer picture of what you're upgrading.
  * All race and class stats have been modified, hopefully making each one more balanced.

## Fixes
  * Fixed perk screen jumping back when purchasing new perks.
  * Fixed cooldowns not displaying properly.
  * Fixed a bug that made perks persist when creating new characters without refreshing page.
  * Items on the ground no longer flicker.

# Indev Update 6 ~ 5.10.2021

## New Features & Additions
  * Added 3 new weapons.
  * Added 1 new armour piece.
  * Added 2 new hair styles.
  * Added new enemies:
    - Orc Raider, heavy hitting melee beast.

## Tweaks
  * Items on the ground are now highlighted with a golden shadow.
  * Pressing the interact key will now pick items from the top of the loot pool.
  * Increased rogue dummy's hit points from **8**-->**10**, but halved its aggro pulling (threat).
  * Lowered all starting stats from **5**-->**1** and modified race stats.
  * Upon starting a new game, the leveling screen will open automatically.

## Fixes
  * Fixed an issue with enemies charging from too far away and not moving. Also slightly improved lag from enemy AI.
  * Fixed an issue with enemies attacking twice when player is stunned.
  * Fixed an issue with loading from file causing multiple errors.
  * Fixed item rarity sorting in the inventory. Items are now sorted in order of grade properly.

# Indev Update 5 ~ 26.9.2021

## New Features & Additions
  * Added new abilities:  
    - ``Hasty Distraction``, a Rogue ability that summons a dummy that distracts enemies.
      > The dummy has 8 hp and takes 1 damage per hit.  
      > The dummy can not move or attack.
    - ``Icy Javelin``, a Sorcerer spell. High damage single target spell with a nasty debuff.
  * Added new perks:
    - ``Tricky Distraction``, a Rogue perk that grants the ability ``Hasty Distraction``. 
    - ``Poison Taster``, a Rogue perk that improves poison resistances.
    - ``Elemental Mage``, a Sorcerer perk that grants the ability ``Icy Javelin`` and increases elemental damage.
    - ``Armour Piercing Javelin``, a Sorcerer perk that buffs the ability ``Icy Javelin``.

## Tweaks
  * Reworked evasion, it no longer grants immunity to damage and statuses, instead it halves incoming damage.
    > Lowered the player's base hit chance from the previous **75** to **60**.
  * Performance increase, made offscreen enemies not even try to render. 
  * Removed some error messages, this has no impact on gameplay.
  * Modified the Ashen model.
  * Burning status effect damage increased **3** --> **4**, stats modified to: **+10** Fire Res, **-10** Ice Res, **-5** All Res.
  * Vitality and intelligence now increase hp and mana regen by 1%.

## Fixes
  * Optimised modifier reading, performance should be improved slightly.
  * Fixed chest indexing issue allowing the player to dupe items down the list.

# Indev Update 4 ~ 19.9.2021

## New Features & Additions
  * Map has been updated:
    - Added new dungeon area with unique loot and plenty of chests!
    - Added roads and land marks to previosly desolate areas, making exploration easier and more fun!
    - Added more enemies to empty areas.
  * Added new abilities:
    - ``Smoke Bomb``, a Rogue ability that debuffs enemies in an AOE.
    - ``Summon Skeleton Warrior``, a Sorcerer spell that summons a Skeleton Warrior to fight for you.
  * Added new perks:
    - ``Smoke Screen``, a Rogue perk that grants the ability ``Smoke Bomb``.
    - ``Sneakier Stabbing``, a Rogue perk that improves the ability ``Sneaky Stabbing``.
    - ``Smoke & Mirrors``, a Rogue perk that improves the ability ``Smoke Bomb``.
    - ``The Summoner King's Call``, a Sorcerer perk that grants the ability ``Summon Skeleton Warrior``.
    - ``Bonds forged from Magic``, a Sorcerer perk that improves the ability ``Summon Skeleton Warrior``.
  * Added tooltip marking the distance to closest enemy.
## Tweaks 

  * Lowered Hiisi Hunter's poison damage from **5** to **3**.
  * English name of ``Retreat`` changed to ``Draw Back``.
  * ``Introduction to Sorcery`` and ``Wisdoms of the Past`` perks now grant additional mana recovery.
  * ``Heightened Casting`` passive ability now requires **75%** mp instead of **70%**, but grants additional **25** hit chance.
  * Increased the player's base hit chance from **50** to **75**, and base evasion from **25** to **30**.
  * Player now has a base mana regen, on top of bonus based on max mana. This translates to more regen in the early game.
 
## Bug Fixes

  * Fixed items in chests not displaying in correct language.
  * Fixed enemy health bars becoming massive.
  * Fixed slime that spawned inside a tree.
  * Fixed path to area with 2 slimes and a chest.
  * Fixed peninsula with trolls being an inaccessible island.

# Indev Update 3 ~ 18.9.2021

## New Features & Additions
  * Added new perk tree: Adventurer
    > Adventurer is a generic tree available to all classes.  
    > It provides placeholder bonuses for when you max out your class.
  * Added new abilities:
    - ``Sneaky Stabbing``, a Rogue ability that buffs your attack.

## Tweaks

  * Increased stat and perk point gains per level up:
    - SP gain increased from 3 to 5.
    - Up to level 5, gain 2 perk points per level up.
    - On levels 10, 20, 30, 40 and 50, gain 3 perk points per level up, otherwise 1.
  * Made each level take ~15% less xp.
  * Increased the xp gained from killing most enemies.
  * Changed the Rogue perk ``Weakpoint Spotter`` from giving 5% crit chance to giving the ability ``Sneaky Stabbing``.
  
## Bug fixes

  * Fixed invalid comparison of ability keys:
    > Previosly, two abilities that both had "charge" in the id, were conflicting.  
    > Now the code checks for exact id, not close. 

# Indev Update 2 ~ 13.9.2021

## New Features & Additions
  * Expanded artifact system:
    > Added working set bonuses, 2 and 3 piece variants.  
    > Added tooltip for set bonuses, grey means inactive, green means active.  
    > Added artwork for existing artifacts.  
  * Added 2 new artifact sets:
    - Scholar, granting mages great bonuses to wizardry.
    - Warrior, granting melee characters great bonuses to fighting.

## Tweaks

  * Increased damage values of all weapons:
    - Dagger total damage increased from **4** to **8**. (6 piercing, 2 slashing)
    - Stick total damage increased from **3** to **9**. (9 crushing)
    - Troll Club total damage increased from **13** to **24**. (24 crushing)
    - Chipped Longsword total damage increased from **6** to **12**. (9 slashing, 3 piercing)
    - Longsword total damage increased from **9** to **14**. (10 slashing, 4 piercing)
    - Silver Sword total damage increased from **20** to **25**. (15 slashing, 5 piercing, 5 magic)
    - Chipped Axe total damage increased from **7** to **11**. (6 piercing, 5 crushing)
    - Hunting Bow total damage increased from **5** to **10**. (10 piercing)
    - Apprentice Wand total damage increased from **5** to **10**. (10 magic)
  * Doubled all item spawn chances in chests.
  * Made save name input text light.

## Bug fixes

  * Removed the "charge" ability from slime type enemies.
  * Fixed artifacts rolling stats on top of rolled stats, making them infinitely more powerful. This issue was caused by linked arrays.
  * Fixed an issue where item classes did not generate, causing a softlock.
  * Fixed an issue where upon loading game the player's perk tree would display incorrectly.

# Indev Update 1 ~ 9.9.2021

## New Features

  * Added artifacts, items with great stat bonuses and matching sets.  
    > Artifacts are equipped as invisible items in the inventory.  
    There are currently 3 artifacts, with no art and no set effect yet.  
    This feature is very much in development.
## Tweaks

  * Spells scale with weapon damage instead of having a base damage.
    > Previosly spells would have a set damage that would receive only small multipliers.  
    This lead to spells being incredibly powerful in the early game,  
    but in the coming late game they would have become underpowered.  
    Now spells modify your weapon's base damage to the damage the spell causes.  
    For example, if your weapon deals 15 damage in total (types are irrelevant)  
    then a spell might convert 80% of that damage (12) to fire and (3) to magic.
  * Weapons now have unique scaling instead of just str for melee and dex for ranged.
    > Previosly weapons were in 2 categories, ranged and melee.  
    Now they have a separate value for determining the used stat.  
    It's possible, for example to have a dagger that scales with dex, not str.
  * Chests now drop a minimum number of items (usually one) and have a maximum cap.  
    No more empty chests!

## Bug fixes

  * Fixed respawning not working due to a non-existent variable.
  * Fixed enemies not having cooldowns, this issue was caused by linked arrays.
