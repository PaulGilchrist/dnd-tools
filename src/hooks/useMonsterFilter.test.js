import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockGetLocalStorageItem = vi.fn(() => null);
const mockSetLocalStorageItem = vi.fn();

vi.mock('../utils/localStorage', () => ({
   LOCAL_STORAGE_KEYS: {
      MONSTER_FILTER: 'monsterFilter',
         },
   getLocalStorageItem: () => mockGetLocalStorageItem(),
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
      const initialFilter = { name: 'orc' };
      const { result } = renderHook(() => useMonsterFilter(initialFilter));
      expect(result.current.filter.name).toBe('orc');
     });

   describe('showMonster', () => {
      const createMonster = (overrides = {}) => ({
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
         const monster = createMonster();
         expect(result.current.showMonster(monster)).toBe(true);
       });

      it('filters by bookmarked status', () => {
         const { result } = renderHook(() => useMonsterFilter());
         act(() => {
            result.current.updateFilter('bookmarked', 'Bookmarked');
          });

         const bookmarkedMonster = createMonster({ bookmarked: true });
         const unbookmarkedMonster = createMonster({ bookmarked: false });

         expect(result.current.showMonster(bookmarkedMonster)).toBe(true);
         expect(result.current.showMonster(unbookmarkedMonster)).toBe(false);
       });

      it('filters by challenge rating range', () => {
         const { result } = renderHook(() => useMonsterFilter());
         act(() => {
            result.current.updateFilter('challengeRatingMin', 5);
            result.current.updateFilter('challengeRatingMax', 10);
          });

         const lowCRMonster = createMonster({ challenge_rating: 1 });
         const inRangeMonster = createMonster({ challenge_rating: 7 });
         const highCRMonster = createMonster({ challenge_rating: 15 });

         expect(result.current.showMonster(lowCRMonster)).toBe(false);
         expect(result.current.showMonster(inRangeMonster)).toBe(true);
         expect(result.current.showMonster(highCRMonster)).toBe(false);
       });

      it('filters by environment', () => {
         const { result } = renderHook(() => useMonsterFilter());
         act(() => {
            result.current.updateFilter('environment', 'Underground');
          });

         const undergroundMonster = createMonster({ environments: ['Underground'] });
         const noEnvironmentMonster = createMonster({ environments: [] });

         expect(result.current.showMonster(undergroundMonster)).toBe(true);
         expect(result.current.showMonster(noEnvironmentMonster)).toBe(false);
       });

      it('filters by name (case-insensitive)', () => {
         const { result } = renderHook(() => useMonsterFilter());
         act(() => {
            result.current.updateFilter('name', 'gob');
          });

         const matchingMonster = createMonster({ name: 'Goblin' });
         const nonMatchingMonster = createMonster({ name: 'Orc' });

         expect(result.current.showMonster(matchingMonster)).toBe(true);
         expect(result.current.showMonster(nonMatchingMonster)).toBe(false);
       });

      it('filters by size', () => {
         const { result } = renderHook(() => useMonsterFilter());
         act(() => {
            result.current.updateFilter('size', 'Medium');
          });

         const smallMonster = createMonster({ size: 'Small' });
         const mediumMonster = createMonster({ size: 'Medium' });

         expect(result.current.showMonster(smallMonster)).toBe(false);
         expect(result.current.showMonster(mediumMonster)).toBe(true);
       });

      it('filters by type', () => {
         const { result } = renderHook(() => useMonsterFilter());
         act(() => {
            result.current.updateFilter('type', 'Humanoid');
          });

         const humanoidMonster = createMonster({ type: 'Humanoid' });
         const beastMonster = createMonster({ type: 'Beast' });

         expect(result.current.showMonster(humanoidMonster)).toBe(true);
         expect(result.current.showMonster(beastMonster)).toBe(false);
       });

      it('filters by XP range', () => {
         const { result } = renderHook(() => useMonsterFilter());
         act(() => {
            result.current.updateFilter('xpMin', 100);
            result.current.updateFilter('xpMax', 1000);
          });

         const lowXPMonster = createMonster({ xp: 50 });
         const inRangeMonster = createMonster({ xp: 500 });
         const highXPMonster = createMonster({ xp: 5000 });

         expect(result.current.showMonster(lowXPMonster)).toBe(false);
         expect(result.current.showMonster(inRangeMonster)).toBe(true);
         expect(result.current.showMonster(highXPMonster)).toBe(false);
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
});
