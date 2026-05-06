import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS, getVersionedStorageKey, getLocalStorageItem, setLocalStorageItem } from '../utils/localStorage';

const defaultFilter = {
    bookmarked: 'All',
    challengeRatingMin: 0,
    challengeRatingMax: 25,
    environment: 'All',
    name: '',
    size: 'All',
    type: 'All',
    xpMin: 0,
    xpMax: 50000,
};

/**
 * Version-aware monster filter hook that works with both 5e and 2024 monster data.
 *
 * @param {Object} opts
 * @param {Object} opts.initialFilter - Override default filter values
 * @param {'5e'|'2024'} opts.ruleVersion - Rule version for storage key and monster shape detection (default: '5e')
 * @returns {{ filter: Object, setFilter: Function, updateFilter: Function, showMonster: Function }}
 */
export function useMonsterFilter({ initialFilter, ruleVersion = '5e' } = {}) {
    const storageKey = getVersionedStorageKey(LOCAL_STORAGE_KEYS.MONSTER_FILTER, ruleVersion);

    const [filter, setFilter] = useState(() => {
        // Try to load from localStorage on initial mount
        const savedFilter = getLocalStorageItem(storageKey);
        if (savedFilter) {
            try {
                return savedFilter;
            } catch (e) {
                console.error('Failed to parse saved filter:', e);
            }
        }

        // Return default values merged with initialFilter overrides
        return { ...defaultFilter, ...initialFilter };
    });

    // Save to localStorage whenever filter changes
    useEffect(() => {
        setLocalStorageItem(storageKey, filter);
    }, [filter, storageKey]);

    /**
     * Predicate that checks if a monster matches the current filter.
     * Handles both 5e (environments as array) and 2024 (environment as string) monster shapes.
     */
    const showMonster = (monster) => {
        // Bookmarked filter
        if (filter.bookmarked !== 'All' && !monster.bookmarked) {
            return false;
        }

        // Challenge rating range (both 5e and 2024 use numeric challenge_rating)
        if (monster.challenge_rating < filter.challengeRatingMin || monster.challenge_rating > filter.challengeRatingMax) {
            return false;
        }

        // Environment filter — handles 5e array and 2024 string
        if (filter.environment !== 'All') {
            if (Array.isArray(monster.environments)) {
                // 5e: environments is an array of strings
                if (!monster.environments.includes(filter.environment)) {
                    return false;
                }
            } else if (typeof monster.environment === 'string') {
                // 2024: environment is a single string
                if (monster.environment !== filter.environment) {
                    return false;
                }
            } else {
                return false;
            }
        }

        // Name filter (case-insensitive)
        if (filter.name !== '' && !monster.name.toLowerCase().includes(filter.name.toLowerCase())) {
            return false;
        }

        // Size filter
        if (filter.size !== 'All' && filter.size !== monster.size) {
            return false;
        }

        // Type filter
        if (filter.type !== 'All' && filter.type !== monster.type) {
            return false;
        }

        // XP range
        if (monster.xp < filter.xpMin || monster.xp > filter.xpMax) {
            return false;
        }

        return true;
    };

    const updateFilter = (key, value) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            [key]: value,
        }));
    };

    return {
        filter,
        setFilter,
        updateFilter,
        showMonster,
    };
}
