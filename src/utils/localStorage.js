// Centralized localStorage keys to avoid typos and collisions
export const LOCAL_STORAGE_KEYS = {
  // Monsters
  MONSTERS_BOOKMARKED: 'monstersBookmarked',
  MONSTER_FILTER: 'monsterFilter',
  MONSTER_FILTER_5E: 'monsterFilter5e',
  MONSTER_FILTER_2024: 'monsterFilter2024',
  MONSTER_LORE_FILTER: 'monsterLoreFilter',
  MONSTER_LORE_FILTER_2024: 'monsterLore2024Filter',

  // Encounters
  ENCOUNTER_FILTER: 'encounterFilter',

  // Spells
  SPELL_FILTER: 'spellFilter',
  SPELL_FILTER_2024: 'spellFilter2024',
  SPELLS_KNOWN: 'spellsKnown',
  SPELLS_PREPARED: 'spellsPrepared',
  SPELLS_KNOWN_2024: 'spellsKnown2024',
  SPELLS_PREPARED_2024: 'spellsPrepared2024',

  // Magic Items
  MAGIC_ITEMS_FILTER: 'magicItemsFilter',
  MAGIC_ITEMS_BOOKMARKED: 'magicItemsBookmarked',
  MAGIC_ITEMS_FILTER_2024: 'magicItems2024Filter',
  MAGIC_ITEMS_BOOKMARKED_2024: 'magicItems2024Bookmarked',

  // Equipment Items
  EQUIPMENT_ITEMS_FILTER: 'equipmentItemsFilter',
  EQUIPMENT_ITEMS_BOOKMARKED: 'equipmentItemsBookmarked',

  // Names
  NAMES_FILTER: 'namesFilter',
  NAMES_USED: 'namesUsed',

  // Races
  RACES_FILTER: 'racesFilter',
  RACES_FILTER_2024: 'races2024Filter',

  // Feats
  FEAT_FILTER_2024: 'featFilter2024',

  // Navigation / App
  URL: 'url',
  RULE_VERSION: 'ruleVersion'
};

// Helper functions for localStorage operations
export const getLocalStorageItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return null;
  }
};

export const setLocalStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};

export const removeLocalStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};

// Convenience wrapper for string values (non-JSON)
export const setLocalStorageString = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error writing string to localStorage key "${key}":`, error);
  }
};

export const getLocalStorageString = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error reading string from localStorage key "${key}":`, error);
    return null;
  }
};