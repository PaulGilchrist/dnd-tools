import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
   LOCAL_STORAGE_KEYS,
   getLocalStorageItem,
   setLocalStorageItem,
   removeLocalStorageItem,
   setLocalStorageString,
   getLocalStorageString,
} from './localStorage';

describe('LOCAL_STORAGE_KEYS', () => {
   it('exports all expected keys', () => {
      expect(LOCAL_STORAGE_KEYS.MONSTERS_BOOKMARKED).toBe('monstersBookmarked');
      expect(LOCAL_STORAGE_KEYS.MONSTER_FILTER).toBe('monsterFilter');
      expect(LOCAL_STORAGE_KEYS.SPELL_FILTER).toBe('spellFilter');
      expect(LOCAL_STORAGE_KEYS.SPELLS_KNOWN).toBe('spellsKnown');
      expect(LOCAL_STORAGE_KEYS.SPELLS_PREPARED).toBe('spellsPrepared');
      expect(LOCAL_STORAGE_KEYS.MAGIC_ITEMS_FILTER).toBe('magicItemsFilter');
      expect(LOCAL_STORAGE_KEYS.RULE_VERSION).toBe('ruleVersion');
      expect(LOCAL_STORAGE_KEYS.URL).toBe('url');
    });

   it('has 2024 variant keys', () => {
      expect(LOCAL_STORAGE_KEYS.SPELL_FILTER_2024).toBe('spellFilter2024');
      expect(LOCAL_STORAGE_KEYS.SPELLS_KNOWN_2024).toBe('spellsKnown2024');
      expect(LOCAL_STORAGE_KEYS.SPELLS_PREPARED_2024).toBe('spellsPrepared2024');
      expect(LOCAL_STORAGE_KEYS.MONSTER_FILTER_2024).toBe('monsterFilter2024');
    });
});

describe('localStorage helpers', () => {
   let localStorageMock;

   beforeEach(() => {
      localStorageMock = {
         store: {},
         getItem: vi.fn((key) => localStorageMock.store[key] || null),
         setItem: vi.fn((key, value) => {
            localStorageMock.store[key] = value;
         }),
         removeItem: vi.fn((key) => {
            delete localStorageMock.store[key];
         }),
         clear: vi.fn(() => {
            localStorageMock.store = {};
         }),
      };
      Object.defineProperty(window, 'localStorage', {
         value: localStorageMock,
         writable: true,
      });
    });

   describe('getLocalStorageItem', () => {
      it('returns parsed JSON for valid stored value', () => {
         localStorageMock.setItem('testKey', JSON.stringify({ foo: 'bar' }));
         const result = getLocalStorageItem('testKey');
         expect(result).toEqual({ foo: 'bar' });
      });

      it('returns null for non-existent key', () => {
         const result = getLocalStorageItem('nonExistent');
         expect(result).toBeNull();
      });

      it('returns null for invalid JSON', () => {
         localStorageMock.setItem('badKey', 'not valid json');
         const result = getLocalStorageItem('badKey');
         expect(result).toBeNull();
      });

      it('returns null for empty string', () => {
         localStorageMock.setItem('emptyKey', '');
         const result = getLocalStorageItem('emptyKey');
         expect(result).toBeNull();
      });

      it('returns parsed array', () => {
         localStorageMock.setItem('arrayKey', JSON.stringify([1, 2, 3]));
         const result = getLocalStorageItem('arrayKey');
         expect(result).toEqual([1, 2, 3]);
      });
    });

   describe('setLocalStorageItem', () => {
      it('stores JSON stringified value', () => {
         setLocalStorageItem('testKey', { foo: 'bar' });
         expect(localStorageMock.setItem).toHaveBeenCalledWith('testKey', JSON.stringify({ foo: 'bar' }));
      });

      it('stores array as JSON', () => {
         setLocalStorageItem('arrayKey', [1, 2, 3]);
         expect(localStorageMock.setItem).toHaveBeenCalledWith('arrayKey', '[1,2,3]');
      });

      it('stores null value', () => {
         setLocalStorageItem('nullKey', null);
         expect(localStorageMock.setItem).toHaveBeenCalledWith('nullKey', 'null');
      });
    });

   describe('removeLocalStorageItem', () => {
      it('removes item from localStorage', () => {
         localStorageMock.setItem('keyToRemove', 'value');
         removeLocalStorageItem('keyToRemove');
         expect(localStorageMock.removeItem).toHaveBeenCalledWith('keyToRemove');
      });
    });

   describe('setLocalStorageString', () => {
      it('stores raw string without JSON encoding', () => {
         setLocalStorageString('stringKey', 'raw value');
         expect(localStorageMock.setItem).toHaveBeenCalledWith('stringKey', 'raw value');
      });
    });

   describe('getLocalStorageString', () => {
      it('returns raw string value', () => {
         localStorageMock.setItem('stringKey', 'raw value');
         const result = getLocalStorageString('stringKey');
         expect(result).toBe('raw value');
      });

      it('returns null for non-existent key', () => {
         const result = getLocalStorageString('nonExistent');
         expect(result).toBeNull();
      });
    });
});