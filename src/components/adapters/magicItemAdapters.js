/**
 * Normalize a 5e magic item into a common data shape
 */
export function normalizeMagicItem5e(magicItem) {
    if (!magicItem) return null;

    return {
          // Basic info
        index: magicItem.index,
        name: magicItem.name,
        type: magicItem.type,
        rarity: magicItem.rarity,
        requiresAttunement: magicItem.requiresAttunement,
        subtype: magicItem.subtype,
        bookmarked: magicItem.bookmarked,

          // Description
        description: magicItem.description,

          // 2024-specific fields (not in 5e)
        chargeSystem: null,
        spellCasting: null,
        damage: null,
        savingThrows: [],
        bonuses: null,
        advantageDisadvantage: null,
        conditions: [],
        resistances: [],
        immunities: [],
        curse: null,
        sentience: null,
        itemSlot: null,
        usageLimit: null,
        duration: null,
        actionTypes: [],
        properties: [],
        attunementRequirements: null,

          // Version metadata
        version: '5e'
      };
}

/**
 * Normalize a 2024 magic item into a common data shape
 */
export function normalizeMagicItem2024(magicItem) {
    if (!magicItem) return null;

    return {
          // Basic info
        index: magicItem.index,
        name: magicItem.name,
        type: magicItem.type,
        rarity: magicItem.rarity,
        requiresAttunement: magicItem.requiresAttunement,
        subtype: magicItem.subtype,
        bookmarked: magicItem.bookmarked,

          // Description
        description: magicItem.description,

          // 2024-specific fields
        chargeSystem: magicItem.charge_system,
        spellCasting: magicItem.spell_casting,
        damage: magicItem.damage,
        savingThrows: magicItem.saving_throws || [],
        bonuses: magicItem.bonuses,
        advantageDisadvantage: magicItem.advantage_disadvantage,
        conditions: magicItem.conditions || [],
        resistances: magicItem.resistances || [],
        immunities: magicItem.immunities || [],
        curse: magicItem.curse,
        sentience: magicItem.sentience,
        itemSlot: magicItem.item_slot,
        usageLimit: magicItem.usage_limit,
        duration: magicItem.duration,
        actionTypes: magicItem.action_types || [],
        properties: magicItem.properties || [],
        attunementRequirements: magicItem.attunement_requirements,

          // Version metadata
        version: '2024'
      };
}