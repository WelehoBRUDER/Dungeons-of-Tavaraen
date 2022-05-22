# Dungeons of Tavaraen

### Changelog moved back to [Changelog.md](https://github.com/WelehoBRUDER/Dungeons-of-Tavaraen/blob/main/Changelog.md)

### Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Modding Guide](#modding-guide)<br>
   3.1 [What is modding?](#what-is-modding)<br>
   3.2 [Installing mods](#installing-mods)
   3.3 [Creating a mod](#creating-a-mod)

## Introduction

Dungeons of Tavaraen is a roguelite game with light RPG mechanics.<br>
It is a simple dungeon crawler with a focus on tactical combat.<br>
Choose from five classes and create a character to fight your way through the dungeons.<br>

## Features

- Large game world full of treasure and foes.
- Turn based combat system.
- Five unique combat classes
- Character customization
- Mods

## Modding Guide

### What is modding?

Modding is the process of adding new features to the game.<br>
This guide will help you to understand how to install mods or make your own.<br>
Mods can range from small changes like adding a new item to the game to large changes like adding a new class or a complete overhaul of the game.<br>

#### Something to note

> Due to the way Javascript works, **404-errors** can't be suppressed.<br>
> This means that if you have mods installed that don't copy the game structure 100%,<br> you will be flooded with "not found" errors in the console.<br> **This is irrevelant, and these errors can safely be ignored**

### Installing mods

**Local mods**:

- Download the mod zip file from the mod page.
- Extract the zip file.
- Add the mod folder to the mods folder in the game directory.<br>
  -> `mods/mod_name` make sure this folder contains the **mod.json** file.
- Open the **mods_config.json** file with any text editor (notepad++ recommended).<br>
  -> **mods_config.json** is located in the game directory.
- Add the mod name to the end of the mods list. Example:<br>
  -> `list: ["awesome_mod", "mod_name"]` copy the mod name here exactly.<br>
  -> `list: ["awesome_mod"]` if you want to remove the mod.<br>
  -> Note: this is a JSON list and names must be separated by commas.
- Launch the game and check the mods menu, it should show the mod you just added.

### Creating a mod

To begin modding the game, I recommend you clone the game repository.<br>
This will make it easier to access game files and test your mod.<br>

If you're unfamiliar with git, you can learn more about it [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).<br>
You can also simply download the game directory as a zip file and extract it.<br>

#### Getting started

To begin modding, I recommend you get some tools to work with.<br>
Tools you need will vary depending on what you're trying to do, so here are the most common ones:<br>

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)<br>
- Some text editor, recommended:<br>
  - [Notepad++](https://notepad-plus-plus.org/download/)<br>
  - [Atom](https://atom.io/)<br>
  - [Visual Studio Code](https://code.visualstudio.com/)<br>
- Image editing software, recommended:<br>
  - [Paint.net](https://www.getpaint.net/)<br>
  - [GIMP](https://www.gimp.org/)<br>
  - [Photoshop](https://www.adobe.com/products/photoshop.html)<br>

#### Creating the mod folder

- Create a new folder in the **mods** folder in your game directory.
- Move into the folder.
- Create a new file called **mod.json**.
- Copy the following text into the file:

```json
{
  "name": "Your Mod Name",
  "description": "A short description of your mod",
  "version": "1.0.0",
  "author": "Your Name"
}
```

**mod.json** is a JSON file that contains information about your mod.<br>
Without it, the mod can't be loaded by the game.

This will initialize your mod, allowing the game to read it.<br>
To add your mod to the game, you will need to add it to the **mods_config.json** file.

#### Adding a new item

This guide will help you add a new item to the game.<br>

- create a new file called **items.js** in the mod directory.
- copy the following text into the file:

  ```js
  const items = {};
  ```

- Let's say you want to add a new item called **sword**.
- Create a new object in the **items.js** file.

```js
items.sword = {
  id: "sword", // Unique ID, must match the key in items object
  name: "Sword", // This is the item name in english
  damages: { slash: 5, pierce: 5 }, // This is the damage dealt by the item
  range: 1, // This is the attack range of the item in tiles
  img: "/icons/sword.png", // This is the path to the item icon
  sprite: "/sprites/sword.png", // This is the path to the item sprite
  price: 10, // This is the price of the item
  weight: 1.7, // This is the weight of the item
  type: "weapon", // This is the item type (weapon, armor, consumable, artifact)
  statBonus: "str", // Determine which stat improves the damage of this weapon
  grade: "common", // This is the item grade (common, uncommon, rare, mythical, legendary)
  slot: "weapon", // Which slot the item can be equipped in
};
```

- The comments aren't needed and are only there to guide you as a modder.
- In the path, note how it starts with **/**. This tells the game to look for the file in the root of the mod directory.<br> If you'd like to use a file in the game directory, you need to reference the entire path, like "resources/icons/dagger.png".

- Weapons and armors need a **sprite** property. This is the image that is displayed when the item is equipped.<br>
  In case of armors, you need to add both the "normal" sprite, and a female version.<br>
  For example: `grey_robe.png` and `grey_robe_female.png`. This is because the game treats "male" as the default.

- Most textures are compiled to a spritesheet at game start and then referenced from it during rendering.

- Currently this item can't be obtained without cheats, so let's add a way for it to be found!
