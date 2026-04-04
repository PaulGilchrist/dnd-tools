import { useState } from 'react';

export function useMonsterFilter(initialFilter = {}) {
    const [filter, setFilter] = useState({
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
    });

    const filterChanged = (newFilter) => {
        localStorage.setItem('monsterFilter', JSON.stringify(newFilter));
    };

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
        const newFilter = { ...filter, [key]: value };
        setFilter(newFilter);
        filterChanged(newFilter);
    };

    return {
        filter,
        setFilter,
        updateFilter,
        showMonster
    };
}
