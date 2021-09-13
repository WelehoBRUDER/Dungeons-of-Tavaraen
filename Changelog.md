## Hotfix
  * Fixed an issue where item classes did not generate, causing a softlock.
  * Fixed an issue where upon loading game the player's perk tree would display incorrectly.

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