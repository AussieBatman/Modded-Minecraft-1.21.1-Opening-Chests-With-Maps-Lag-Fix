// Global Map-Lag Fix for 1.21.1
// This prevents server hangs when opening chests in modded terrain.
LootJS.modifiers((event) => {
    // This looks for any loot table categorized as a CHEST (works for vanilla and mods)
    event.addTableModifier(LootType.CHEST)
        // Removes the 'filled map' which triggers the 'locate structure' lag
        .removeLoot(Item.of("minecraft:filled_map"))
        // Removes the blank maps often found in shipwreck supply chests
        .removeLoot(Item.of("minecraft:map"));
});
