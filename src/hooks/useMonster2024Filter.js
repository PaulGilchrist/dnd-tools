import { useState, useEffect } from 'react';

export function useMonster2024Filter() {
    const [filter, setFilter] = useState(() => {
        // Try to load from localStorage on initial mount
        const savedFilter = localStorage.getItem('monsterFilter2024');
        if (savedFilter) {
            try {
                return JSON.parse(savedFilter);
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
        localStorage.setItem('monsterFilter2024', JSON.stringify(filter));
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