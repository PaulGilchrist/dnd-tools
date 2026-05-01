import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockGetLocalStorageItem = vi.fn(() => null);
const mockSetLocalStorageItem = vi.fn();

vi.mock('../utils/localStorage', () => ({
   LOCAL_STORAGE_KEYS: {
      SPELLS_KNOWN: 'spellsKnown',
      SPELLS_PREPARED: 'spellsPrepared',
       },
   getLocalStorageItem: () => mockGetLocalStorageItem(),
   setLocalStorageItem: () => mockSetLocalStorageItem(),
}));

import { useSpellPersistence } from './useSpellPersistence';

describe('useSpellPersistence', () => {
   beforeEach(() => {
      vi.clearAllMocks();
    });

   it('initializes with empty arrays', () => {
      const { result } = renderHook(() => useSpellPersistence());
      expect(result.current.knownSpells).toEqual([]);
      expect(result.current.preparedSpells).toEqual([]);
    });

   it('loads known spells from localStorage on mount', () => {
      mockGetLocalStorageItem.mockReturnValueOnce(['fireball', 'magic-missile']);
      mockGetLocalStorageItem.mockReturnValueOnce(null);
      const { result } = renderHook(() => useSpellPersistence());
      expect(result.current.knownSpells).toEqual(['fireball', 'magic-missile']);
    });

   it('loads prepared spells from localStorage on mount', () => {
      mockGetLocalStorageItem.mockReturnValueOnce(null);
      mockGetLocalStorageItem.mockReturnValueOnce(['fireball']);
      const { result } = renderHook(() => useSpellPersistence());
      expect(result.current.preparedSpells).toEqual(['fireball']);
    });

   describe('saveKnown', () => {
      it('saves known spells from a list', () => {
         const { result } = renderHook(() => useSpellPersistence());
         const spells = [
              { index: 'fireball', known: true },
              { index: 'magic-missile', known: false },
              ];

         act(() => {
            result.current.saveKnown(spells);
         });

         expect(mockSetLocalStorageItem).toHaveBeenCalled();
          });
        });

   describe('savePrepared', () => {
      it('saves prepared spells from a list', () => {
         const { result } = renderHook(() => useSpellPersistence());
         const spells = [
              { index: 'fireball', prepared: true },
              { index: 'magic-missile', prepared: false },
              ];

         act(() => {
            result.current.savePrepared(spells);
         });

         expect(mockSetLocalStorageItem).toHaveBeenCalled();
          });
        });

   describe('updateKnown', () => {
      it('adds a spell to known when isKnown is true', () => {
         const { result } = renderHook(() => useSpellPersistence());

         act(() => {
            result.current.updateKnown('fireball', true, []);
         });

         expect(result.current.knownSpells).toContain('fireball');
      });

      it('removes a spell from known when isKnown is false', () => {
         mockGetLocalStorageItem.mockReturnValueOnce(['fireball', 'magic-missile']);
         mockGetLocalStorageItem.mockReturnValueOnce(null);
         const { result } = renderHook(() => useSpellPersistence());

         act(() => {
            result.current.updateKnown('fireball', false, []);
         });

         expect(result.current.knownSpells).not.toContain('fireball');
         expect(result.current.knownSpells).toContain('magic-missile');
       });
        });

   describe('updatePrepared', () => {
      it('adds a spell to prepared when isPrepared is true', () => {
         const { result } = renderHook(() => useSpellPersistence());

         act(() => {
            result.current.updatePrepared('fireball', true, []);
         });

         expect(result.current.preparedSpells).toContain('fireball');
      });

      it('removes a spell from prepared when isPrepared is false', () => {
         mockGetLocalStorageItem.mockReturnValueOnce(null);
         mockGetLocalStorageItem.mockReturnValueOnce(['fireball', 'magic-missile']);
         const { result } = renderHook(() => useSpellPersistence());

         act(() => {
            result.current.updatePrepared('fireball', false, []);
         });

         expect(result.current.preparedSpells).not.toContain('fireball');
         expect(result.current.preparedSpells).toContain('magic-missile');
       });
        });

   describe('addKnown', () => {
      it('adds a spell to known spells', () => {
         const { result } = renderHook(() => useSpellPersistence());

         act(() => {
            result.current.addKnown('fireball');
         });

         expect(result.current.knownSpells).toContain('fireball');
       });
        });

   describe('removeKnown', () => {
      it('removes a spell from known spells', () => {
         mockGetLocalStorageItem.mockReturnValueOnce(['fireball', 'magic-missile']);
         mockGetLocalStorageItem.mockReturnValueOnce(null);
         const { result } = renderHook(() => useSpellPersistence());

         act(() => {
            result.current.removeKnown('fireball');
         });

         expect(result.current.knownSpells).not.toContain('fireball');
         expect(result.current.knownSpells).toContain('magic-missile');
       });
        });

   describe('addPrepared', () => {
      it('adds a spell to prepared spells', () => {
         const { result } = renderHook(() => useSpellPersistence());

         act(() => {
            result.current.addPrepared('fireball');
         });

         expect(result.current.preparedSpells).toContain('fireball');
       });
        });

   describe('removePrepared', () => {
      it('removes a spell from prepared spells', () => {
         mockGetLocalStorageItem.mockReturnValueOnce(null);
         mockGetLocalStorageItem.mockReturnValueOnce(['fireball', 'magic-missile']);
         const { result } = renderHook(() => useSpellPersistence());

         act(() => {
            result.current.removePrepared('fireball');
         });

         expect(result.current.preparedSpells).not.toContain('fireball');
         expect(result.current.preparedSpells).toContain('magic-missile');
       });
        });
});
