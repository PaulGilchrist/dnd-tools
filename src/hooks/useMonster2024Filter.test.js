import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockGetLocalStorageItem = vi.fn(() => null);
const mockSetLocalStorageItem = vi.fn();

vi.mock('../utils/localStorage', () => ({
   LOCAL_STORAGE_KEYS: {
      MONSTER_FILTER_2024: 'monsterFilter2024',
   },
   getLocalStorageItem: () => mockGetLocalStorageItem(),
   setLocalStorageItem: () => mockSetLocalStorageItem(),
}));

import { useMonster2024Filter } from './useMonster2024Filter';

describe('useMonster2024Filter', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   it('initializes with default filter values', () => {
      const { result } = renderHook(() => useMonster2024Filter());
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
      const { result } = renderHook(() => useMonster2024Filter());
      expect(result.current.filter).toEqual(savedFilter);
   });

   describe('updateFilter', () => {
      it('updates a single filter property', () => {
         const { result } = renderHook(() => useMonster2024Filter());

         act(() => {
            result.current.updateFilter('name', 'goblin');
         });

         expect(result.current.filter.name).toBe('goblin');
      });

      it('preserves other filter properties when updating one', () => {
         const { result } = renderHook(() => useMonster2024Filter());

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
      const { result } = renderHook(() => useMonster2024Filter());

      act(() => {
         result.current.updateFilter('name', 'goblin');
      });

      expect(mockSetLocalStorageItem).toHaveBeenCalled();
   });

   it('setFilter allows complete filter replacement', () => {
      const { result } = renderHook(() => useMonster2024Filter());

      act(() => {
         result.current.setFilter({ name: 'dragon', size: 'Large' });
      });

      expect(result.current.filter.name).toBe('dragon');
      expect(result.current.filter.size).toBe('Large');
   });
});
