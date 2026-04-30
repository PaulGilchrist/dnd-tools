import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem } from '../utils/localStorage';

export function useMonsterFilter(initialFilter = {}) {
    const [filter, setFilter] = useState(() => {
          // Try to load from localStorage on initial mount
        const savedFilter = getLocalStorageItem(LOCAL_STORAGE_KEYS.MONSTER_FILTER);
        if (savedFilter) {
            try {
                return savedFilter;
              } catch (e) {
                console.error('Failed to parse saved filter:', e);
        }
          }
        
        // Return default values
        return {
            bookmarked: 'All',
            challengeRatingMin: 0,
            challengeRatingMax: 25,
            environment: 'All',
            name: '',
            size: 'All',
            type: 'All',
            xpMin: 0,
            xpMax: 50000,
             ...initialFilter
          };
      });

    // Save to localStorage whenever filter changes
    useEffect(() => {
        setLocalStorageItem(LOCAL_STORAGE_KEYS.MONSTER_FILTER, filter);
      }, [filter]);

    const showMonster = (monster) => {
        // Bookmarked filter
        if (filter.bookmarked !== 'All' && !monster.bookmarked) {
            return false;
          }
          // Challenge Range
        if (monster.challenge_rating < filter.challengeRatingMin || monster.challenge_rating > filter.challengeRatingMax) {
            return false;
          }
          // Environment filter
        if (filter.environment !== 'All' && (!monster.environments || !monster.environments.includes(filter.environment))) {
            return false;
          }
          // Name filter
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
          // XP
        if (monster.xp < filter.xpMin || monster.xp > filter.xpMax) {
            return false;
        }
        return true;
    };

    const updateFilter = (key, value) => {
        setFilter(prevFilter => ({
              ...prevFilter,
              [key]: value
          }));
      };

    return {
        filter,
        setFilter,
        updateFilter,
        showMonster
    };
}
