import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockGetLocalStorageItem = vi.fn(() => null);
const mockSetLocalStorageItem = vi.fn();

vi.mock('../utils/localStorage', () => ({
   LOCAL_STORAGE_KEYS: {
      MONSTERS_BOOKMARKED: 'monstersBookmarked',
       },
   getLocalStorageItem: () => mockGetLocalStorageItem(),
   setLocalStorageItem: () => mockSetLocalStorageItem(),
}));

import { useMonsterBookmarks } from './useMonsterBookmarks';

describe('useMonsterBookmarks', () => {
   beforeEach(() => {
      vi.clearAllMocks();
     });

   it('initializes with empty bookmarks array', () => {
      const { result } = renderHook(() => useMonsterBookmarks([]));
      expect(result.current.monstersBookmarked).toEqual([]);
     });

   it('loads bookmarks from localStorage on mount', () => {
      mockGetLocalStorageItem.mockReturnValueOnce(['goblin', 'orc']);
      const { result } = renderHook(() => useMonsterBookmarks([]));
      expect(result.current.monstersBookmarked).toEqual(['goblin', 'orc']);
     });

   it('adds a bookmark when handleBookmarkChange is called with true', () => {
      const { result } = renderHook(() => useMonsterBookmarks([]));

      act(() => {
         result.current.handleBookmarkChange('goblin', true);
        });

      expect(result.current.monstersBookmarked).toContain('goblin');
     });

   it('removes a bookmark when handleBookmarkChange is called with false', () => {
      mockGetLocalStorageItem.mockReturnValueOnce(['goblin', 'orc']);
      const { result } = renderHook(() => useMonsterBookmarks([]));

      act(() => {
         result.current.handleBookmarkChange('goblin', false);
        });

      expect(result.current.monstersBookmarked).not.toContain('goblin');
      expect(result.current.monstersBookmarked).toContain('orc');
     });

   it('updates monsters with bookmark status', () => {
      mockGetLocalStorageItem.mockReturnValueOnce(['goblin']);
      const monsters = [
           { index: 'goblin', name: 'Goblin' },
           { index: 'orc', name: 'Orc' },
           ];
      const { result } = renderHook(() => useMonsterBookmarks(monsters));

      const updated = result.current.updateMonstersWithBookmarks(monsters);
      expect(updated[0].bookmarked).toBe(true);
      expect(updated[1].bookmarked).toBe(false);
     });

   it('returns empty array for updateMonstersWithBookmarks with empty input', () => {
      const { result } = renderHook(() => useMonsterBookmarks([]));
      const updated = result.current.updateMonstersWithBookmarks([]);
      expect(updated).toEqual([]);
     });

   it('returns empty array for updateMonstersWithBookmarks with null input', () => {
      const { result } = renderHook(() => useMonsterBookmarks([]));
      const updated = result.current.updateMonstersWithBookmarks(null);
      expect(updated).toEqual([]);
     });

   it('handles multiple bookmark additions', () => {
      const { result } = renderHook(() => useMonsterBookmarks([]));

      act(() => {
         result.current.handleBookmarkChange('goblin', true);
         result.current.handleBookmarkChange('orc', true);
        });

      expect(result.current.monstersBookmarked).toContain('goblin');
      expect(result.current.monstersBookmarked).toContain('orc');
     });
});