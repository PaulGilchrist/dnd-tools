import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem, sanitizeFilter } from '../utils/localStorage';
import { parseChallengeRating } from '../utils/monsterUtils';

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
 * Monster filter hook that works with the consolidated monster data.
 *
 * @param {Object} opts
 * @param {Object} opts.initialFilter - Override default filter values
 * @returns {{ filter: Object, setFilter: Function, updateFilter: Function, showMonster: Function }}
 */
export function useMonsterFilter({ initialFilter } = {}) {
    const storageKey = LOCAL_STORAGE_KEYS.MONSTER_FILTER;

    const [filter, setFilter] = useState(() => {
        // Try to load from localStorage on initial mount
        const savedFilter = getLocalStorageItem(storageKey);
        if (savedFilter) {
            try {
                return sanitizeFilter(defaultFilter, savedFilter);
            } catch (e) {
                console.error('Failed to parse saved filter:', e);
            }
        }

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

        // Challenge rating range
        const cr = parseChallengeRating(monster.challenge_rating);
        const crMin = filter.challengeRatingMin === '' ? 0 : filter.challengeRatingMin;
        const crMax = filter.challengeRatingMax === '' ? 25 : filter.challengeRatingMax;
        if (cr < crMin || cr > crMax) {
            return false;
        }

        // Environment filter — handles 5e array and 2024 string
        if (filter.environment !== 'All') {
            if (Array.isArray(monster.environments)) {
                // 5e: environments is an array of strings
                const envs = monster.environments.map(e => e.toLowerCase());
                if (!envs.includes(filter.environment.toLowerCase())) {
                    return false;
                }
            } else if (typeof monster.environment === 'string') {
                // 2024: environment is a single string
                if (monster.environment.toLowerCase() !== filter.environment.toLowerCase()) {
                    return false;
                }
            }
            // If no environment data exists, skip this filter (don't hide the monster)
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
        if (filter.type !== 'All' && monster.type.toLowerCase() !== filter.type.toLowerCase()) {
            return false;
        }

        // XP range
        const xpMin = filter.xpMin === '' ? 0 : filter.xpMin;
        const xpMax = filter.xpMax === '' ? 50000 : filter.xpMax;
        if (monster.xp < xpMin || monster.xp > xpMax) {
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
