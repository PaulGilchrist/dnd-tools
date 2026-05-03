import { useState, useEffect, useRef } from 'react';

// Get the base URL from Vite's environment variables (set by vite.config.js)
const BASE_URL = import.meta.env.BASE_URL || '';

// Cache for storing loaded data to avoid repeated fetches
const dataCache = {};

// Track which datasets have been loaded (even if still loading)
const loadingPromises = {};
// Helper function to sort array of objects by property name
export function sort(inputObjectArray, propertyName, descending = false) {
    if (inputObjectArray && propertyName) {
        inputObjectArray.sort((a, b) => {
            let aValue = a[propertyName];
            let bValue = b[propertyName];
            if (aValue < bValue) {
                return descending ? 1 : -1;
            }
            if (bValue < aValue) {
                return descending ? -1 : 1;
            }
            return 0;
          });
      }
}

// Error handler function
export function handleError(error) {
    console.error(error);
    throw error;
}

// Fetch data with caching - never re-fetches once loaded or loading
async function fetchAndCache(key, url) {
     // Return cached data if already loaded
    if (dataCache[key]) {
        return dataCache[key];
     }

     // Reuse existing in-flight request if loading
    if (loadingPromises[key]) {
        return loadingPromises[key];
     }

     // Create new fetch promise and cache it
    const promise = (async () => {
        try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const jsonData = await response.json();
                
                // Special handling for names - sort by name
                if (key === 'names') {
                    sort(jsonData, 'name');
                }

            dataCache[key] = jsonData;
            return jsonData;
            } finally {
             // Clean up the promise reference after completion
            delete loadingPromises[key];
            }
     })();

    loadingPromises[key] = promise;
    return promise;
}

// Hook to fetch and cache data lazily
function useDataCache(key, url) {
    const [data, setData] = useState(() => dataCache[key]);
    const [loading, setLoading] = useState(!dataCache[key]);
    const [error, setError] = useState(null);
    const initialized = useRef(false);

    useEffect(() => {
         // Only fetch once per component lifetime
        if (initialized.current) {
            return;
}
        initialized.current = true;

         // If data is already cached, resolve immediately
        if (dataCache[key]) {
            setData(dataCache[key]);
            setLoading(false);
            return;
}

         // Start fetch
        setLoading(true);
        fetchAndCache(key, url)
             .then((jsonData) => {
                setData(jsonData);
                setLoading(false);
             })
             .catch((err) => {
                setError(err);
                setLoading(false);
             });
     }, [key, url]);

    return { data, loading, error };
}

// Individual hooks for each data type
export function useAbilityScores() {
    return useDataCache('abilityScores', BASE_URL + 'data/ability-scores.json');
}

export function useConditions() {
    return useDataCache('conditions', BASE_URL + 'data/conditions.json');
}

export function useEquipment() {
    return useDataCache('equipment', BASE_URL + 'data/equipment.json');
}

export function useFeats() {
    return useDataCache('feats', BASE_URL + 'data/feats.json');
}

export function useLocations() {
    return useDataCache('locations', BASE_URL + 'data/locations.json');
}

export function useMagicItems() {
    return useDataCache('magicItems', BASE_URL + 'data/magic-items.json');
}

export function useMonsters() {
    return useDataCache('monsters', BASE_URL + 'data/monsters.json');
}

export function useMonsterTypes() {
    return useDataCache('monsterTypes', BASE_URL + 'data/monster-types.json');
}

export function useNames() {
    return useDataCache('names', BASE_URL + 'data/names.json');
}

export function usePlayerClasses() {
    return useDataCache('playerClasses', BASE_URL + 'data/classes.json');
}

export function useRaces() {
    return useDataCache('races', BASE_URL + 'data/races.json');
}

export function useRules() {
    return useDataCache('rules', BASE_URL + 'data/rules.json');
}

export function useSpells() {
    return useDataCache('spells', BASE_URL + 'data/spells.json');
}

export function use2024Spells() {
    return useDataCache('spells2024', BASE_URL + 'data/2024/spells.json');
}

export function use2024Monsters() {
    return useDataCache('monsters2024', BASE_URL + 'data/2024/monsters.json');
}

export function use2024MonsterTypes() {
    return useDataCache('monsters2024Types', BASE_URL + 'data/2024/monster-types.json');
}

export function use2024MonsterSubtypes() {
    return useDataCache('monsters2024Subtypes', BASE_URL + 'data/2024/monster-subtypes.json');
}

export function use2024MagicItems() {
    return useDataCache('magicItems2024', BASE_URL + 'data/2024/magic-items.json');
}

export function useWeaponProperties() {
    return useDataCache('weaponProperties', BASE_URL + 'data/weapon-properties.json');
}

export function use2024Classes() {
    return useDataCache('classes2024', BASE_URL + 'data/2024/classes.json');
}

export function use2024Races() {
    return useDataCache('races2024', BASE_URL + 'data/2024/races.json');
}

export function use2024Backgrounds() {
    return useDataCache('backgrounds2024', BASE_URL + 'data/2024/backgrounds.json');
}

export function use2024Feats() {
    return useDataCache('feats2024', BASE_URL + 'data/2024/feats.json');
}

export function useWeaponMastery2024() {
    return useDataCache('weaponMastery2024', BASE_URL + 'data/2024/weapon-mastery.json');
}

// Alternative: Create a DataService class for non-React usage or compatibility
export class DataService {
    constructor() {
        this.cache = dataCache;
    }

    async getAbilityScores() {
        return fetchAndCache('abilityScores', BASE_URL + 'data/ability-scores.json');
      }
    async getConditions() {
        return fetchAndCache('conditions', BASE_URL + 'data/conditions.json');
      }
    async getEquipment() {
        return fetchAndCache('equipment', BASE_URL + 'data/equipment.json');
      }
    async getFeats() {
        return fetchAndCache('feats', BASE_URL + 'data/feats.json');
      }
    async getLocations() {
        return fetchAndCache('locations', BASE_URL + 'data/locations.json');
      }
    async getMagicItems() {
        return fetchAndCache('magicItems', BASE_URL + 'data/magic-items.json');
      }
    async getMonsters() {
        return fetchAndCache('monsters', BASE_URL + 'data/monsters.json');
      }
    async getMonsterTypes() {
        return fetchAndCache('monsterTypes', BASE_URL + 'data/monster-types.json');
      }
    async get2024MonsterTypes() {
        return fetchAndCache('monsters2024Types', BASE_URL + 'data/2024/monster-types.json');
      }
    async getNames() {
        return fetchAndCache('names', BASE_URL + 'data/names.json');
      }
    async getPlayerClasses() {
        return fetchAndCache('playerClasses', BASE_URL + 'data/classes.json');
      }
    async getRaces() {
        return fetchAndCache('races', BASE_URL + 'data/races.json');
      }
    async getRules() {
        return fetchAndCache('rules', BASE_URL + 'data/rules.json');
      }
    async getSpells() {
        return fetchAndCache('spells', BASE_URL + 'data/spells.json');
      }
    async getWeaponProperties() {
        return fetchAndCache('weaponProperties', BASE_URL + 'data/weapon-properties.json');
      }
    async getBackgrounds2024() {
        return fetchAndCache('backgrounds2024', BASE_URL + 'data/2024/backgrounds.json');
      }
}
// Export singleton instance for class-based usage
export const dataService = new DataService();

// Clear cache helper for testing
export function __clearCache() {
    Object.keys(dataCache).forEach(key => delete dataCache[key]);
    Object.keys(loadingPromises).forEach(key => delete loadingPromises[key]);
}

