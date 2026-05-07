import { useState, useEffect } from 'react';
import { fetchAndCache, dataCache } from './dataServiceCore.js';
import { getBaseUrl } from './dataServiceUtils.js';

// Hook to fetch and cache data lazily
export function useDataCache(key, url) {
    const [cached] = useState(() => dataCache[key]);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(!cached);
    const [error] = useState(null);

    // Always call useEffect (required by Rules of Hooks)
    useEffect(() => {
        // If data is already cached, do nothing — the post-hook early return handles it.
        // We only need to fetch when data is NOT cached.
        if (cached) {
            return;
        }

        let cancelled = false;
        (async () => {
            try {
                const result = await fetchAndCache(key, url);
                if (!cancelled) {
                    setData(result);
                    setLoading(false);
                }
            } catch {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();
        return () => { cancelled = true; };
    }, [key, url]);

    // Early return for cached data (after all hooks)
    if (cached) {
        return { data: cached, loading: false, error: null };
    }

    return { data, loading, error };
}

// Individual hooks for each data type
export function useAbilityScores() {
    return useDataCache('abilityScores', getBaseUrl() + 'data/ability-scores.json');
}

export function useConditions() {
    return useDataCache('conditions', getBaseUrl() + 'data/conditions.json');
}

export function useEquipment() {
    return useDataCache('equipment', getBaseUrl() + 'data/equipment.json');
}

export function useFeats() {
    return useDataCache('feats', getBaseUrl() + 'data/feats.json');
}

export function useLocations() {
    return useDataCache('locations', getBaseUrl() + 'data/locations.json');
}

export function useMagicItems() {
    return useDataCache('magicItems', getBaseUrl() + 'data/magic-items.json');
}

export function useMonsters() {
    return useDataCache('monsters', getBaseUrl() + 'data/monsters.json');
}

export function useMonsterTypes() {
    return useDataCache('monsterTypes', getBaseUrl() + 'data/monster-types.json');
}

export function useNames() {
    return useDataCache('names', getBaseUrl() + 'data/names.json');
}

export function usePlayerClasses() {
    return useDataCache('playerClasses', getBaseUrl() + 'data/classes.json');
}

export function useRaces() {
    return useDataCache('races', getBaseUrl() + 'data/races.json');
}

export function useRules() {
    return useDataCache('rules', getBaseUrl() + 'data/rules.json');
}

export function useSpells() {
    return useDataCache('spells', getBaseUrl() + 'data/spells.json');
}

export function use2024Spells() {
    return useDataCache('spells2024', getBaseUrl() + 'data/2024/spells.json');
}

export function use2024Monsters() {
    return useDataCache('monsters2024', getBaseUrl() + 'data/2024/monsters.json');
}

export function use2024MonsterTypes() {
    return useDataCache('monsters2024Types', getBaseUrl() + 'data/2024/monster-types.json');
}

export function use2024MonsterSubtypes() {
    return useDataCache('monsters2024Subtypes', getBaseUrl() + 'data/2024/monster-subtypes.json');
}

export function use2024MagicItems() {
    return useDataCache('magicItems2024', getBaseUrl() + 'data/2024/magic-items.json');
}

export function useWeaponProperties() {
    return useDataCache('weaponProperties', getBaseUrl() + 'data/weapon-properties.json');
}

export function use2024Classes() {
    return useDataCache('classes2024', getBaseUrl() + 'data/2024/classes.json');
}

export function use2024Races() {
    return useDataCache('races2024', getBaseUrl() + 'data/2024/races.json');
}

export function use2024Backgrounds() {
    return useDataCache('backgrounds2024', getBaseUrl() + 'data/2024/backgrounds.json');
}

export function use2024Feats() {
    return useDataCache('feats2024', getBaseUrl() + 'data/2024/feats.json');
}

export function useWeaponMastery2024() {
    return useDataCache('weaponMastery2024', getBaseUrl() + 'data/2024/weapon-mastery.json');
}
