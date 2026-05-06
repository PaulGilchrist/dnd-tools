import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockGetLocalStorageItem = vi.fn(() => null);
const mockSetLocalStorageItem = vi.fn();

vi.mock('../utils/localStorage', () => ({
    LOCAL_STORAGE_KEYS: {
        MONSTER_FILTER: 'monsterFilter',
    },
    getVersionedStorageKey: (baseKey, ruleVersion) => {
        if (ruleVersion === '2024') {
            return `${baseKey}2024`;
        }
        return baseKey;
    },
    getLocalStorageItem: (key) => mockGetLocalStorageItem(key),
    setLocalStorageItem: () => mockSetLocalStorageItem(),
}));

import { useMonsterFilter } from './useMonsterFilter';

describe('useMonsterFilter', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('initializes with default filter values', () => {
        const { result } = renderHook(() => useMonsterFilter());
        expect(result.current.filter).toEqual({
            bookmarked: 'All',
            challengeRatingMin: 0,
            challengeRatingMax: 25,
            environment: 'All',
            name: '',
            size: 'All',
            type: 'All',
            xpMin: 0,
            xpMax: 50000,
        });
    });

    it('loads filter from localStorage on mount', () => {
        const savedFilter = { bookmarked: 'Bookmarked', name: 'goblin' };
        mockGetLocalStorageItem.mockReturnValueOnce(savedFilter);
        const { result } = renderHook(() => useMonsterFilter());
        expect(result.current.filter).toEqual(savedFilter);
    });

    it('uses initialFilter when no saved filter exists', () => {
        const { result } = renderHook(() => useMonsterFilter({ initialFilter: { name: 'orc' } }));
        expect(result.current.filter.name).toBe('orc');
    });

    it('uses 5e storage key by default', () => {
        mockGetLocalStorageItem.mockReturnValueOnce(null);
        renderHook(() => useMonsterFilter());
        expect(mockGetLocalStorageItem).toHaveBeenCalledWith('monsterFilter');
    });

    it('uses 2024 storage key when ruleVersion is 2024', () => {
        mockGetLocalStorageItem.mockReturnValueOnce(null);
        renderHook(() => useMonsterFilter({ ruleVersion: '2024' }));
        expect(mockGetLocalStorageItem).toHaveBeenCalledWith('monsterFilter2024');
    });

    describe('showMonster with 5e monster shape', () => {
        const create5eMonster = (overrides = {}) => ({
            index: 'goblin',
            name: 'Goblin',
            challenge_rating: 1,
            environments: ['Underground'],
            size: 'Small',
            type: 'Humanoid',
            xp: 50,
            bookmarked: false,
            ...overrides,
        });

        it('shows monster when all filters are set to All', () => {
            const { result } = renderHook(() => useMonsterFilter());
            const monster = create5eMonster();
            expect(result.current.showMonster(monster)).toBe(true);
        });

        it('filters by bookmarked status', () => {
            const { result } = renderHook(() => useMonsterFilter());
            act(() => {
                result.current.updateFilter('bookmarked', 'Bookmarked');
            });

            const bookmarkedMonster = create5eMonster({ bookmarked: true });
            const unbookmarkedMonster = create5eMonster({ bookmarked: false });

            expect(result.current.showMonster(bookmarkedMonster)).toBe(true);
            expect(result.current.showMonster(unbookmarkedMonster)).toBe(false);
        });

        it('filters by challenge rating range', () => {
            const { result } = renderHook(() => useMonsterFilter());
            act(() => {
                result.current.updateFilter('challengeRatingMin', 5);
                result.current.updateFilter('challengeRatingMax', 10);
            });

            const lowCRMonster = create5eMonster({ challenge_rating: 1 });
            const inRangeMonster = create5eMonster({ challenge_rating: 7 });
            const highCRMonster = create5eMonster({ challenge_rating: 15 });

            expect(result.current.showMonster(lowCRMonster)).toBe(false);
            expect(result.current.showMonster(inRangeMonster)).toBe(true);
            expect(result.current.showMonster(highCRMonster)).toBe(false);
        });

        it('filters by environment using 5e array format', () => {
            const { result } = renderHook(() => useMonsterFilter());
            act(() => {
                result.current.updateFilter('environment', 'Underground');
            });

            const undergroundMonster = create5eMonster({ environments: ['Underground'] });
            const noEnvironmentMonster = create5eMonster({ environments: [] });

            expect(result.current.showMonster(undergroundMonster)).toBe(true);
            expect(result.current.showMonster(noEnvironmentMonster)).toBe(false);
        });

        it('filters by name (case-insensitive)', () => {
            const { result } = renderHook(() => useMonsterFilter());
            act(() => {
                result.current.updateFilter('name', 'gob');
            });

            const matchingMonster = create5eMonster({ name: 'Goblin' });
            const nonMatchingMonster = create5eMonster({ name: 'Orc' });

            expect(result.current.showMonster(matchingMonster)).toBe(true);
            expect(result.current.showMonster(nonMatchingMonster)).toBe(false);
        });

        it('filters by size', () => {
            const { result } = renderHook(() => useMonsterFilter());
            act(() => {
                result.current.updateFilter('size', 'Medium');
            });

            const smallMonster = create5eMonster({ size: 'Small' });
            const mediumMonster = create5eMonster({ size: 'Medium' });

            expect(result.current.showMonster(smallMonster)).toBe(false);
            expect(result.current.showMonster(mediumMonster)).toBe(true);
        });

        it('filters by type', () => {
            const { result } = renderHook(() => useMonsterFilter());
            act(() => {
                result.current.updateFilter('type', 'Humanoid');
            });

            const humanoidMonster = create5eMonster({ type: 'Humanoid' });
            const beastMonster = create5eMonster({ type: 'Beast' });

            expect(result.current.showMonster(humanoidMonster)).toBe(true);
            expect(result.current.showMonster(beastMonster)).toBe(false);
        });

        it('filters by XP range', () => {
            const { result } = renderHook(() => useMonsterFilter());
            act(() => {
                result.current.updateFilter('xpMin', 100);
                result.current.updateFilter('xpMax', 1000);
            });

            const lowXPMonster = create5eMonster({ xp: 50 });
            const inRangeMonster = create5eMonster({ xp: 500 });
            const highXPMonster = create5eMonster({ xp: 5000 });

            expect(result.current.showMonster(lowXPMonster)).toBe(false);
            expect(result.current.showMonster(inRangeMonster)).toBe(true);
            expect(result.current.showMonster(highXPMonster)).toBe(false);
        });
    });

    describe('showMonster with 2024 monster shape', () => {
        const create2024Monster = (overrides = {}) => ({
            index: 'goblin',
            name: 'Goblin',
            challenge_rating: 1,
            environment: 'Underground',
            size: 'Small',
            type: 'Humanoid',
            xp: 50,
            bookmarked: false,
            ...overrides,
        });

        it('shows 2024 monster when all filters are set to All', () => {
            const { result } = renderHook(() => useMonsterFilter({ ruleVersion: '2024' }));
            const monster = create2024Monster();
            expect(result.current.showMonster(monster)).toBe(true);
        });

        it('filters 2024 monster by environment using string format', () => {
            const { result } = renderHook(() => useMonsterFilter({ ruleVersion: '2024' }));
            act(() => {
                result.current.updateFilter('environment', 'Underground');
            });

            const undergroundMonster = create2024Monster({ environment: 'Underground' });
            const mountainsMonster = create2024Monster({ environment: 'Mountains' });

            expect(result.current.showMonster(undergroundMonster)).toBe(true);
            expect(result.current.showMonster(mountainsMonster)).toBe(false);
        });

        it('filters 2024 monster by challenge rating range', () => {
            const { result } = renderHook(() => useMonsterFilter({ ruleVersion: '2024' }));
            act(() => {
                result.current.updateFilter('challengeRatingMin', 5);
                result.current.updateFilter('challengeRatingMax', 10);
            });

            const lowCRMonster = create2024Monster({ challenge_rating: 1 });
            const inRangeMonster = create2024Monster({ challenge_rating: 7 });
            const highCRMonster = create2024Monster({ challenge_rating: 15 });

            expect(result.current.showMonster(lowCRMonster)).toBe(false);
            expect(result.current.showMonster(inRangeMonster)).toBe(true);
            expect(result.current.showMonster(highCRMonster)).toBe(false);
        });

        it('filters 2024 monster by bookmarked status', () => {
            const { result } = renderHook(() => useMonsterFilter({ ruleVersion: '2024' }));
            act(() => {
                result.current.updateFilter('bookmarked', 'Bookmarked');
            });

            const bookmarkedMonster = create2024Monster({ bookmarked: true });
            const unbookmarkedMonster = create2024Monster({ bookmarked: false });

            expect(result.current.showMonster(bookmarkedMonster)).toBe(true);
            expect(result.current.showMonster(unbookmarkedMonster)).toBe(false);
        });

        it('hides 2024 monster when environment filter is active but monster has no environment', () => {
            const { result } = renderHook(() => useMonsterFilter({ ruleVersion: '2024' }));
            act(() => {
                result.current.updateFilter('environment', 'Underground');
            });

            const noEnvMonster = create2024Monster({ environment: undefined });

            expect(result.current.showMonster(noEnvMonster)).toBe(false);
        });
    });

    describe('updateFilter', () => {
        it('updates a single filter property', () => {
            const { result } = renderHook(() => useMonsterFilter());

            act(() => {
                result.current.updateFilter('name', 'goblin');
            });

            expect(result.current.filter.name).toBe('goblin');
        });

        it('preserves other filter properties when updating one', () => {
            const { result } = renderHook(() => useMonsterFilter());

            act(() => {
                result.current.updateFilter('name', 'goblin');
                result.current.updateFilter('size', 'Small');
            });

            expect(result.current.filter.name).toBe('goblin');
            expect(result.current.filter.size).toBe('Small');
            expect(result.current.filter.type).toBe('All');
        });
    });

    it('saves filter to localStorage when it changes', () => {
        const { result } = renderHook(() => useMonsterFilter());

        act(() => {
            result.current.updateFilter('name', 'goblin');
        });

        expect(mockSetLocalStorageItem).toHaveBeenCalled();
    });

    it('setFilter allows complete filter replacement', () => {
        const { result } = renderHook(() => useMonsterFilter());

        act(() => {
            result.current.setFilter({ name: 'dragon', size: 'Large' });
        });

        expect(result.current.filter.name).toBe('dragon');
        expect(result.current.filter.size).toBe('Large');
    });
});
