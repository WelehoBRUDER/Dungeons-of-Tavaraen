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

#### How mods are read
Dungeons of Tavaraen is scripted in Typescript, which gets compiled into Javascript.<br>
Therefore all mods must be either written in Javascript, or compiled to it.<br>

When the game is loaded, all files in your mod directory are read.<br>
If the file is a **.js** file, it is loaded into the game.<br>

Images can be any format you want, but .png is recommended.<br>

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

#### Adding a new item

This guide will help you add a new item to the game.<br>

- create a new file called **items.js** somewhere in the mod directory.
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

- The most convenient way to get an item, is to buy it from a merchant.
- So let's add it to a merchant inventory.

- Create a file named **characters.js** in the mod directory.
- Copy the following text into the file:

  ```js
  const NPCInventories = {};
  ```

- Now, we want to add the item to the merchant inventory.
- For this guide, we'll add it to the **generic merchant** encountered after the tutorial.
- We're updating an existing object, so we need to get the object first.
- All NPC inventories are stored in the **characters.ts** file.

```js
  NPCInventories.testMerchant = {
    normal: [ // Normal means the default inventory you're most likely to see
    { ...items["dagger"], unique: false, price: 75 },
    { ...items["chippedAxe"], unique: false, price: 100 },
    { ...items["longsword"], unique: false, price: 200 },
    { ...items["sword"], unique: false, price: 150 }, // This is our 'sword', it will now be obtainable
    { ...items["apprenticeWand"], unique: false, price: 100 },
    { ...items["raggedHood"], unique: false, price: 15 },
    { ...items["raggedShirt"], unique: false, price: 25 },
    { ...items["raggedGloves"], unique: false, price: 12 },
    { ...items["raggedPants"], unique: false, price: 20 },
    { ...items["raggedBoots"], unique: false, price: 25 },
    { ...items["leatherHelmet"], unique: false, price: 50 },
    { ...items["leatherChest"], unique: false, price: 140 },
    { ...items["leatherBracers"], unique: false, price: 40 },
    { ...items["leatherLeggings"], unique: false, price: 110 },
    { ...items["leatherBoots"], unique: false, price: 40 },
    { ...items["woodenShield"], unique: false, price: 75 },
    { ...items["apprenticeRobe"], unique: false, price: 900 },
    { ...items["apprenticePants"], unique: false, price: 700 },
    { ...items["apprenticeBoots"], unique: false, price: 500 },
    { ...items["healingPotion_weak"], unique: false, price: 250 },
    { ...items["manaPotion_weak"], unique: false, price: 250 },
    ],
  };
```

- You can add your new item anywhere you'd like in the inventory.
- The **unique** property is used to determine if the item can be obtained more than once.
- The **price** property is the price this merchant wants for the item.

- If you load into the game and get the item, you'll see that it's invisible.
- This is because we haven't yet created any textures for the item.
- We could simply reuse textures from the game, but it's better to create your own textures.<br>
  Otherwise it could get hard to identify items in a playthrough.

- To create a new texture, use any editing software that allows you to save with transparent background.
- We need two textures:
  - **sprite**: This is the image that is displayed when the item is equipped.
  - **normal**: This is the image that is displayed when the item is not equipped.
- It's recommended that these go to their own folders, eg. **sprites/sword.png** and **icons/sword.png**.
- Once you've created the textures, you need to add a path in the **items.js** file.

```js
  img: "/icons/sword.png", // This is the path to the item icon
  sprite: "/sprites/sword.png", // This is the path to the item sprite
```

- Launch the game now and try to obtain the item, it should be visible.
- Congratulations! You've added a new item to the game!

- If you want to support other languages, you can add a localisation file to the game!
- Create a folder called **localisation** in the mod directory.
- Create a file called **aa_localisation.js** in the **localisation** directory.
- Copy the following text into the file:

  ```js
  const finnish = {};
  const english = {};
  ```

  - Now, we need to add the item name to the **finnish** object.

  ```js
  finnish.sword_name = "Miekka";
  ```

  - Item names are by default in english, and thus don't need to added to the **english** object.
  - When adding localisation for a name, you need to add '\_name' to the end of the key.
  - For example, the key **sword** needs to be **sword_name**.

- You have now finished your first mod! Share it on discord or something!

## Map modding

Map modding is not yet fully supported, so this section will only list some tips and rules.

- The current map editor is not yet updated to support map modding.
  > It can still be useful for editing maps, but you'll have to sort through the save output manually.

- All maps must be in the **maps** folder within your mod directory.

Don't be afraid to experiment, the worst thing you can do is break the game!