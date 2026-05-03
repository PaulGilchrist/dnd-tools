import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockGetLocalStorageItem = vi.fn(() => null);
const mockSetLocalStorageItem = vi.fn();

vi.mock('../utils/localStorage', () => ({
   LOCAL_STORAGE_KEYS: {
      MONSTERS_BOOKMARKED: 'monstersBookmarked',
   },
   getLocalStorageItem: () => mockGetLocalStorageItem(),
   setLocalStorageItem: (...args) => mockSetLocalStorageItem(...args),
}));

import { useMonsterBookmarks } from './useMonsterBookmarks';

describe('useMonsterBookmarks', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   it('initializes with empty bookmarks array', () => {
      const { result } = renderHook(() => useMonsterBookmarks());
      expect(result.current.monstersBookmarked).toEqual([]);
   });

   it('loads bookmarks from localStorage on mount', () => {
      const savedBookmarks = ['goblin', 'orc'];
      mockGetLocalStorageItem.mockReturnValueOnce(savedBookmarks);
      const { result } = renderHook(() => useMonsterBookmarks());
      expect(result.current.monstersBookmarked).toEqual(savedBookmarks);
   });

   describe('updateMonstersWithBookmarks', () => {
      it('returns empty array when monsters data is empty', () => {
         const { result } = renderHook(() => useMonsterBookmarks());
         const updated = result.current.updateMonstersWithBookmarks([]);
         expect(updated).toEqual([]);
      });

      it('returns empty array when monsters data is null', () => {
         const { result } = renderHook(() => useMonsterBookmarks());
         const updated = result.current.updateMonstersWithBookmarks(null);
         expect(updated).toEqual([]);
      });

      it('adds bookmarked property to monsters', () => {
         const { result } = renderHook(() => useMonsterBookmarks());
         act(() => {
            result.current.handleBookmarkChange('goblin', true);
         });

         const monsters = [
            { index: 'goblin', name: 'Goblin' },
            { index: 'orc', name: 'Orc' },
         ];

         const updated = result.current.updateMonstersWithBookmarks(monsters);
         expect(updated[0].bookmarked).toBe(true);
         expect(updated[1].bookmarked).toBe(false);
      });
   });

   describe('handleBookmarkChange', () => {
      it('adds bookmark when isBookmarked is true', () => {
         const { result } = renderHook(() => useMonsterBookmarks());

         act(() => {
            result.current.handleBookmarkChange('goblin', true);
         });

         expect(result.current.monstersBookmarked).toContain('goblin');
         expect(mockSetLocalStorageItem).toHaveBeenCalled();
      });

      it('removes bookmark when isBookmarked is false', () => {
         const { result } = renderHook(() => useMonsterBookmarks());

         act(() => {
            result.current.handleBookmarkChange('goblin', true);
            result.current.handleBookmarkChange('goblin', false);
         });

         expect(result.current.monstersBookmarked).not.toContain('goblin');
      });
   });

   describe('saveBookmark', () => {
      it('saves current bookmarks to localStorage', () => {
         const { result } = renderHook(() => useMonsterBookmarks());

         // Set up bookmarks directly via state
         act(() => {
            result.current.handleBookmarkChange('goblin', true);
         });

         // Verify state was updated
         expect(result.current.monstersBookmarked).toContain('goblin');

         // Clear mock calls from handleBookmarkChange
         mockSetLocalStorageItem.mockClear();

         act(() => {
            result.current.saveBookmark();
         });

         expect(mockSetLocalStorageItem).toHaveBeenCalledWith(
            'monstersBookmarked',
            ['goblin']
         );
      });
   });
});
