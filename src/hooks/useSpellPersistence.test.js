import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockGetLocalStorageItem = vi.fn(() => null);
const mockSetLocalStorageItem = vi.fn();

vi.mock('../utils/localStorage', () => ({
   LOCAL_STORAGE_KEYS: {
      SPELLS_KNOWN: 'spellsKnown',
      SPELLS_PREPARED: 'spellsPrepared',
   },
   getLocalStorageItem: (...args) => mockGetLocalStorageItem(...args),
   setLocalStorageItem: (...args) => mockSetLocalStorageItem(...args),
   getVersionedStorageKey: (baseKey, ruleVersion) => {
      if (ruleVersion === '2024') {
         return `${baseKey}2024`;
      }
      return baseKey;
   },
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

    it('uses versioned keys for 2024 rule version', () => {
       mockGetLocalStorageItem
          .mockReturnValueOnce(['fireball2024'])
          .mockReturnValueOnce(null);

       const { result } = renderHook(() => useSpellPersistence({ ruleVersion: '2024' }));
       expect(result.current.knownSpells).toEqual(['fireball2024']);
       expect(mockGetLocalStorageItem).toHaveBeenNthCalledWith(1, 'spellsKnown2024');
       expect(mockGetLocalStorageItem).toHaveBeenNthCalledWith(2, 'spellsPrepared2024');
    });

    it('uses base keys for 5e rule version', () => {
       mockGetLocalStorageItem
          .mockReturnValueOnce(['fireball'])
          .mockReturnValueOnce(null);

       const { result } = renderHook(() => useSpellPersistence({ ruleVersion: '5e' }));
       expect(result.current.knownSpells).toEqual(['fireball']);
       expect(mockGetLocalStorageItem).toHaveBeenNthCalledWith(1, 'spellsKnown');
       expect(mockGetLocalStorageItem).toHaveBeenNthCalledWith(2, 'spellsPrepared');
    });

    it('defaults to 5e keys when no ruleVersion provided', () => {
       mockGetLocalStorageItem
          .mockReturnValueOnce(['fireball'])
          .mockReturnValueOnce(null);

       const { result } = renderHook(() => useSpellPersistence());
       expect(result.current.knownSpells).toEqual(['fireball']);
       expect(mockGetLocalStorageItem).toHaveBeenNthCalledWith(1, 'spellsKnown');
       expect(mockGetLocalStorageItem).toHaveBeenNthCalledWith(2, 'spellsPrepared');
    });

   it('loads known spells from localStorage on mount', () => {
      mockGetLocalStorageItem
         .mockReturnValueOnce(['fireball', 'magic-missile'])
         .mockReturnValueOnce(null);
      
      const { result } = renderHook(() => useSpellPersistence());
      expect(result.current.knownSpells).toEqual(['fireball', 'magic-missile']);
   });

   it('loads prepared spells from localStorage on mount', () => {
      mockGetLocalStorageItem
         .mockReturnValueOnce(null)
         .mockReturnValueOnce(['fireball']);
      
      const { result } = renderHook(() => useSpellPersistence());
      expect(result.current.preparedSpells).toEqual(['fireball']);
   });

   describe('saveKnown', () => {
      it('saves known spell indices to localStorage', () => {
         const { result } = renderHook(() => useSpellPersistence());
         
         const spellsList = [
            { index: 'fireball', known: true },
            { index: 'magic-missile', known: false },
            { index: 'shield', known: true },
         ];

         act(() => {
            result.current.saveKnown(spellsList);
         });

         expect(mockSetLocalStorageItem).toHaveBeenCalledWith(
            'spellsKnown',
            ['fireball', 'shield']
         );
      });

      it('returns the saved known spells', () => {
         const { result } = renderHook(() => useSpellPersistence());
         
         const spellsList = [
            { index: 'fireball', known: true },
         ];

         let saved;
         act(() => {
            saved = result.current.saveKnown(spellsList);
         });

         expect(saved).toEqual(['fireball']);
      });
   });

   describe('savePrepared', () => {
      it('saves prepared spell indices to localStorage', () => {
         const { result } = renderHook(() => useSpellPersistence());
         
         const spellsList = [
            { index: 'fireball', prepared: true },
            { index: 'magic-missile', prepared: false },
            { index: 'shield', prepared: true },
         ];

         act(() => {
            result.current.savePrepared(spellsList);
         });

         expect(mockSetLocalStorageItem).toHaveBeenCalledWith(
            'spellsPrepared',
            ['fireball', 'shield']
         );
      });
   });

   describe('updateKnown', () => {
      it('adds spell to known list', () => {
         const { result } = renderHook(() => useSpellPersistence());
         
         act(() => {
            result.current.updateKnown('fireball', true);
         });

         expect(result.current.knownSpells).toContain('fireball');
         expect(mockSetLocalStorageItem).toHaveBeenCalledWith(
            'spellsKnown',
            ['fireball']
         );
      });

      it('removes spell from known list', () => {
         const { result } = renderHook(() => useSpellPersistence());
         
         // First add it
         act(() => {
            result.current.updateKnown('fireball', true);
         });

         // Then remove it
         act(() => {
            result.current.updateKnown('fireball', false);
         });

         expect(result.current.knownSpells).not.toContain('fireball');
      });

      it('returns the updated known spells', () => {
         const { result } = renderHook(() => useSpellPersistence());
         
         let updated;
         act(() => {
            updated = result.current.updateKnown('fireball', true);
         });

         expect(updated).toContain('fireball');
      });
   });

   describe('updatePrepared', () => {
      it('adds spell to prepared list', () => {
         const { result } = renderHook(() => useSpellPersistence());
         
         act(() => {
            result.current.updatePrepared('fireball', true);
         });

         expect(result.current.preparedSpells).toContain('fireball');
      });

      it('removes spell from prepared list', () => {
         const { result } = renderHook(() => useSpellPersistence());
         
         act(() => {
            result.current.updatePrepared('fireball', true);
         });
         act(() => {
            result.current.updatePrepared('fireball', false);
         });

         expect(result.current.preparedSpells).not.toContain('fireball');
      });
   });

    describe('addKnown', () => {
       it('adds spell to known list', () => {
          const { result } = renderHook(() => useSpellPersistence());

          act(() => {
             result.current.addKnown('fireball');
          });

          expect(result.current.knownSpells).toContain('fireball');
       });

       it('does not duplicate if spell already known', () => {
          const { result } = renderHook(() => useSpellPersistence());

          act(() => {
             result.current.addKnown('fireball');
             result.current.addKnown('fireball');
          });

          expect(result.current.knownSpells).toEqual(['fireball']);
       });
    });

   describe('removeKnown', () => {
      it('removes spell from known list', () => {
         const { result } = renderHook(() => useSpellPersistence());
         
         act(() => {
            result.current.addKnown('fireball');
            result.current.removeKnown('fireball');
         });

         expect(result.current.knownSpells).not.toContain('fireball');
      });
   });

    describe('addPrepared', () => {
       it('adds spell to prepared list', () => {
          const { result } = renderHook(() => useSpellPersistence());

          act(() => {
             result.current.addPrepared('fireball');
          });

          expect(result.current.preparedSpells).toContain('fireball');
       });

       it('does not duplicate if spell already prepared', () => {
          const { result } = renderHook(() => useSpellPersistence());

          act(() => {
             result.current.addPrepared('fireball');
             result.current.addPrepared('fireball');
          });

          expect(result.current.preparedSpells).toEqual(['fireball']);
       });
    });

   describe('removePrepared', () => {
      it('removes spell from prepared list', () => {
         const { result } = renderHook(() => useSpellPersistence());
         
         act(() => {
            result.current.addPrepared('fireball');
            result.current.removePrepared('fireball');
         });

         expect(result.current.preparedSpells).not.toContain('fireball');
      });
   });
});
