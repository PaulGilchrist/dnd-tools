// Centralized localStorage keys to avoid typos and collisions
// These are BASE keys. Use getVersionedStorageKey() to get the versioned variant.
export const LOCAL_STORAGE_KEYS = {
  // Monsters
  MONSTERS_BOOKMARKED: 'monstersBookmarked',
  MONSTER_FILTER: 'monsterFilter',
  MONSTER_LORE_FILTER: 'monsterLoreFilter',

  // Encounters
  ENCOUNTER_FILTER: 'encounterFilter',

  // Spells
  SPELL_FILTER: 'spellFilter',
  SPELLS_KNOWN: 'spellsKnown',
  SPELLS_PREPARED: 'spellsPrepared',

  // Magic Items
  MAGIC_ITEMS_FILTER: 'magicItemsFilter',
  MAGIC_ITEMS_BOOKMARKED: 'magicItemsBookmarked',

  // Equipment Items
  EQUIPMENT_ITEMS_FILTER: 'equipmentItemsFilter',
  EQUIPMENT_ITEMS_BOOKMARKED: 'equipmentItemsBookmarked',

  // Names
  NAMES_FILTER: 'namesFilter',
  NAMES_USED: 'namesUsed',

  // Races
  RACES_FILTER: 'racesFilter',

  // Feats
  FEAT_FILTER: 'featFilter',

  // Navigation / App
  URL: 'url',
  RULE_VERSION: 'ruleVersion'
};

// Generate a versioned storage key from a base key and rule version
// - '5e' or undefined/null returns the base key as-is
// - '2024' appends '2024' to the base key
// Example: getVersionedStorageKey('spellFilter', '2024') -> 'spellFilter2024'
// Example: getVersionedStorageKey('spellsKnown', '5e') -> 'spellsKnown'
export const getVersionedStorageKey = (baseKey, ruleVersion) => {
  if (ruleVersion === '2024') {
    return `${baseKey}2024`;
  }
  return baseKey;
};

// Map over an object of base keys, applying versioning to each value
// Example: getVersionedStorageKeys({ known: 'spellsKnown', prepared: 'spellsPrepared' }, '2024')
//   -> { known: 'spellsKnown2024', prepared: 'spellsPrepared2024' }
export const getVersionedStorageKeys = (baseKeys, ruleVersion) => {
  const keys = {};
  for (const [name, baseKey] of Object.entries(baseKeys)) {
    keys[name] = getVersionedStorageKey(baseKey, ruleVersion);
  }
  return keys;
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