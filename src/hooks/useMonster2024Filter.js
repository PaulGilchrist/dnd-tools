import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS, getLocalStorageItem, setLocalStorageItem } from '../utils/localStorage';

export function useMonster2024Filter() {
    const [filter, setFilter] = useState(() => {
           // Try to load from localStorage on initial mount
        const savedFilter = getLocalStorageItem(LOCAL_STORAGE_KEYS.MONSTER_FILTER_2024);
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
            xpMax: 50000
           };
       });

    // Save to localStorage whenever filter changes
    useEffect(() => {
        setLocalStorageItem(LOCAL_STORAGE_KEYS.MONSTER_FILTER_2024, filter);
       }, [filter]);

    const updateFilter = (key, value) => {
        setFilter(prevFilter => ({
               ...prevFilter,
               [key]: value
           }));
       };

    return {
        filter,
        setFilter,
        updateFilter
    };
}