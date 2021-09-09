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