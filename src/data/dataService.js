import { useState, useEffect } from 'react';

// Get the base URL from Vite's environment variables (set by vite.config.js)
const BASE_URL = import.meta.env.BASE_URL || '';

// Cache for storing loaded data to avoid repeated fetches
const dataCache = {
    abilityScores: [],
    conditions: [],
    equipment: [],
    feats: [],
    locations: [],
    magicItems: [],
    magicItems2024: [],
    monsters: [],
    monsterTypes: [],
    names: [],
    playerClasses: [],
    races: [],
    races2024: [],
    rules: [],
    spells: [],
    spells2024: [],
    monsters2024: [],
    monsters2024Types: [],
    weaponProperties: [],
    classes2024: [],
    backgrounds2024: []
};

// Helper function to sort array of objects by property name
function sort(inputObjectArray, propertyName, descending = false) {
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
function handleError(error) {
    console.error(error);
    throw error;
}

// Hook to fetch and cache data
function useDataCache(key, url) {
    const [data, setData] = useState(dataCache[key]);
    const [loading, setLoading] = useState(!data || data.length === 0);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (data && data.length > 0) {
            return; // Data already loaded, skip fetch
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const jsonData = await response.json();
                
                // Special handling for names - sort by name
                if (key === 'names') {
                    sort(jsonData, 'name');
                }

                setData(jsonData);
                dataCache[key] = jsonData; // Update cache
            } catch (err) {
                setError(err);
                handleError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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

// Alternative: Create a DataService class for non-React usage or compatibility
export class DataService {
    constructor() {
        this.cache = dataCache;
    }

    async getAbilityScores() {
        if (this.cache.abilityScores.length === 0) {
            try {
                const response = await fetch(BASE_URL + 'data/ability-scores.json');
                const data = await response.json();
                this.cache.abilityScores = data;
                console.log('Get - ability scores');
            } catch (error) {
                handleError(error);
            }
        }
        return this.cache.abilityScores;
    }

    async getConditions() {
        if (this.cache.conditions.length === 0) {
            try {
                const response = await fetch(BASE_URL + 'data/conditions.json');
                const data = await response.json();
                this.cache.conditions = data;
                console.log('Get - conditions');
            } catch (error) {
                handleError(error);
            }
        }
        return this.cache.conditions;
    }

    async getEquipment() {
        if (this.cache.equipment.length === 0) {
            try {
                const response = await fetch(BASE_URL + 'data/equipment.json');
                const data = await response.json();
                this.cache.equipment = data;
                console.log('Get - equipment');
            } catch (error) {
                handleError(error);
            }
        }
        return this.cache.equipment;
    }

    async getFeats() {
        if (this.cache.feats.length === 0) {
            try {
                const response = await fetch(BASE_URL + 'data/feats.json');
                const data = await response.json();
                this.cache.feats = data;
                console.log('Get - feats');
            } catch (error) {
                handleError(error);
            }
        }
        return this.cache.feats;
    }

    async getLocations() {
        if (this.cache.locations.length === 0) {
            try {
                const response = await fetch(BASE_URL + 'data/locations.json');
                const data = await response.json();
                this.cache.locations = data;
                console.log('Get - locations');
            } catch (error) {
                handleError(error);
            }
        }
        return this.cache.locations;
    }

    async getMagicItems() {
        if (this.cache.magicItems.length === 0) {
            try {
                const response = await fetch(BASE_URL + 'data/magic-items.json');
                const data = await response.json();
                this.cache.magicItems = data;
                console.log('Get - magic items');
            } catch (error) {
                handleError(error);
            }
        }
        return this.cache.magicItems;
    }

    async getMonsters() {
        if (this.cache.monsters.length === 0) {
            try {
                const response = await fetch(BASE_URL + 'data/monsters.json');
                const data = await response.json();
                this.cache.monsters = data;
                console.log('Get - monsters');
            } catch (error) {
                handleError(error);
            }
        }
        return this.cache.monsters;
    }

    async getMonsterTypes() {
        if (this.cache.monsterTypes.length === 0) {
            try {
                const response = await fetch(BASE_URL + 'data/monster-types.json');
                const data = await response.json();
                this.cache.monsterTypes = data;
                console.log('Get - monster subtypes');
            } catch (error) {
                handleError(error);
            }
        }
        return this.cache.monsterTypes;
    }

    async get2024MonsterTypes() {
        if (this.cache.monsters2024Types.length === 0) {
            try {
                const response = await fetch(BASE_URL + 'data/2024/monster-types.json');
                const data = await response.json();
                this.cache.monsters2024Types = data;
                console.log('Get - 2024 monster subtypes');
            } catch (error) {
                handleError(error);
            }
        }
        return this.cache.monsters2024Types;
    }

    async getNames() {
        if (this.cache.names.length === 0) {
            try {
                const response = await fetch(BASE_URL + 'data/names.json');
                const data = await response.json();
                sort(data, 'name');
                this.cache.names = data;
                console.log('Get - names');
            } catch (error) {
                handleError(error);
            }
        }
        return this.cache.names;
    }

    async getPlayerClasses() {
        if (this.cache.playerClasses.length === 0) {
            try {
                const response = await fetch(BASE_URL + 'data/classes.json');
                const data = await response.json();
                this.cache.playerClasses = data;
                console.log('Get - player classes');
            } catch (error) {
                handleError(error);
            }
        }
        return this.cache.playerClasses;
    }

    async getRaces() {
        if (this.cache.races.length === 0) {
            try {
                const response = await fetch(BASE_URL + 'data/races.json');
                const data = await response.json();
                this.cache.races = data;
                console.log('Get - races');
            } catch (error) {
                handleError(error);
            }
        }
        return this.cache.races;
    }

    async getRules() {
        if (this.cache.rules.length === 0) {
            try {
                const response = await fetch(BASE_URL + 'data/rules.json');
                const data = await response.json();
                this.cache.rules = data;
                console.log('Get - rules');
            } catch (error) {
                handleError(error);
            }
        }
        return this.cache.rules;
    }

    async getSpells() {
        if (this.cache.spells.length === 0) {
            try {
                const response = await fetch(BASE_URL + 'data/spells.json');
                const data = await response.json();
                this.cache.spells = data;
                console.log('Get - spells');
            } catch (error) {
                handleError(error);
            }
        }
        return this.cache.spells;
    }

    async getWeaponProperties() {
        if (this.cache.weaponProperties.length === 0) {
            try {
                const response = await fetch(BASE_URL + 'data/weapon-properties.json');
                const data = await response.json();
                this.cache.weaponProperties = data;
                console.log('Get - weapon properties');
            } catch (error) {
                handleError(error);
            }
        }
        return this.cache.weaponProperties;
    }

    async getBackgrounds2024() {
        if (this.cache.backgrounds2024.length === 0) {
            try {
                const response = await fetch(BASE_URL + 'data/2024/backgrounds.json');
                const data = await response.json();
                this.cache.backgrounds2024 = data;
                console.log('Get - 2024 backgrounds');
            } catch (error) {
                handleError(error);
            }
        }
        return this.cache.backgrounds2024;
    }
}

// Export singleton instance for class-based usage
export const dataService = new DataService();

