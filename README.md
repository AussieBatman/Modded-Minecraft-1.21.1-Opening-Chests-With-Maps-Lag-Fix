#[Fix] Severe lag/Stutter/Server Crashing when opening chests in Modded Minecraft, especially with the Lootr mod and Heavy Terrain Gen mods (1.21.1 NeoForge/Fabric)

The Problem:

In 1.21.1 (And possibly other versions, untested), Opening chests which happen to contain a map such as buried treasure maps or even modded maps causes a massive server-thread hang while the game tries to locate the structures the maps point to (Shipwrecks, Treasure, modded dungeons, etc.). With complex terrain mods such as Terralith or Tectonic this can cause the whole game to lock up, mobs will freeze, etc and you're server may even crash.

The Solution:
Using the mods; KubeJS and LootJS and theire dependency rhino, we can create a global filter that deletes maps from loot tables before the game tries to locate the structures. This completely removes the stutter.

Step 1: Install the Requirements
You must have these three mods installed on both the Client and the Server. Even for singleplayer, the mods must be in your personal mods folder.

1. KubeJS
2. LootJS
3. Rhino (The JavaScript engine for KubeJS). 
Please note: at the time of writing this, Rhino requires the beta version to be downloaded to work with the other two mods, if you just click install on cursefore, it will not install a beta version, you must manually choose the beta version.

Note for Servers: Every player must have these three mods on their own PC to join the server, or they will get a Registry Mismatch or Unknown Keys error.

Step 2: Create the Script
The location of the script depends on how you are playing:

For Servers:
Navigate to your dedicated server folder. Go to kubejs/server_scripts/.
For servers the players dont need the script in their profile/game files, it only needs to be in the server's files.

For Singleplayer:
Navigate to your local Minecraft instance folder (where your mods and saves are). Go to kubejs/server_scripts/.

How to create the file:

Inside the server_scripts folder, right-click and create a New Text Document.

Rename it to fix_map_lag.js (ensure the .txt extension is removed, to do this, make sure extensions are visible in your file explorer, you dont want it to be fix_map_lag.js.txt).

To add the code, right-click the fix_map_lag.js file and select "Open with," then choose Notepad or a similar text editing program.

Paste the following code into that file and save it:

LootJS.modifiers((event) => {
// This looks for any loot table categorized as a CHEST (works for vanilla and mods)
event.addTableModifier(LootType.CHEST)
// Removes the 'filled map' which triggers the 'locate structure' lag
.removeLoot(Item.of("minecraft:filled_map"))
// Removes the blank maps often found in shipwreck supply chests, this one might not actually be an issue, I haven't tested it.
.removeLoot(Item.of("minecraft:map"));
});

Important Version Note: This script is written for Minecraft 1.21.1. If you are using an older version of Minecraft, the LootJS syntax is different. You will need to adapt the function names to match your specific version of the mod. The core concept remains the same.

Step 3: How to Initiate (No Server or Client Restart Required)
For Servers:

Type /kubejs reload server_scripts in-game.

After that, type /reload to ensure all loot tables are refreshed.

For Singleplayer:
Type /reload in your world.

To Test:
Type /loot give @s loot minecraft:chests/shipwreck_map several times. If you receive regular items (like paper or compasses) but no maps appear after multiple tries, the fix is working. You should now notice whenever you open a chest such as a lootr chest, you no longer get a lag spike.

Why this works:
Multiplayer: The server handles the loot logic; the script intercepts the Map item in the server folder before it is sent to your screen.
Singleplayer: Your client runs an internal server. The script in your client folder works exactly the same way, preventing your CPU from maxing out while trying to find structures.
Lootr: Since Lootr is a wrapper for standard loot tables, this script cleans the loot before Lootr ever populates the chest.

Summary:
While I'm aware there are datapacks that are supposed to fix this bug, most of those datapacks only target vanilla files/structures like shipwreck_map.json. This LootJS method is a global filter. It will catch maps from Towns and Towers, When Dungeons Arise, and any other modded structure without you having to hunt down hundreds of individual JSON files. This could intefere with certain mods that generate modded maps only capable of being obtained through chests, so keep that in mind.
