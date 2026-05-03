import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
   LOCAL_STORAGE_KEYS,
   getLocalStorageItem,
   setLocalStorageItem,
   removeLocalStorageItem,
   setLocalStorageString,
   getLocalStorageString,
} from './localStorage';

// Mock localStorage for testing
const createLocalStorageMock = () => {
   let store = {};
   return {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn((key, value) => {
         store[key] = value;
      }),
      removeItem: vi.fn((key) => {
         delete store[key];
      }),
      clear: vi.fn(() => {
         store = {};
      }),
   };
};

let mockLocalStorage;

beforeEach(() => {
   mockLocalStorage = createLocalStorageMock();
   Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
   });
});

describe('localStorage utilities', () => {
   beforeEach(() => {
      localStorage.clear();
      vi.spyOn(console, 'error').mockImplementation(() => {});
   });

   afterEach(() => {
      vi.restoreAllMocks();
   });

   describe('LOCAL_STORAGE_KEYS', () => {
      it('has all expected keys', () => {
         expect(LOCAL_STORAGE_KEYS.MONSTERS_BOOKMARKED).toBe('monstersBookmarked');
         expect(LOCAL_STORAGE_KEYS.MONSTER_FILTER).toBe('monsterFilter');
         expect(LOCAL_STORAGE_KEYS.SPELL_FILTER).toBe('spellFilter');
      });
   });

   describe('getLocalStorageItem', () => {
      it('returns null when key does not exist', () => {
         expect(getLocalStorageItem('nonexistent')).toBeNull();
      });

      it('returns parsed JSON value when key exists', () => {
         localStorage.setItem('test', JSON.stringify({ foo: 'bar' }));
         expect(getLocalStorageItem('test')).toEqual({ foo: 'bar' });
      });

      it('returns null when JSON parse fails', () => {
         localStorage.setItem('test', 'invalid json');
         expect(getLocalStorageItem('test')).toBeNull();
      });

      it('returns null when localStorage throws', () => {
         vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
            throw new Error('Storage error');
         });
         expect(getLocalStorageItem('test')).toBeNull();
      });
   });

   describe('setLocalStorageItem', () => {
      it('stores value as JSON', () => {
         setLocalStorageItem('test', { foo: 'bar' });
         expect(JSON.parse(localStorage.getItem('test'))).toEqual({ foo: 'bar' });
      });

      it('handles localStorage errors gracefully', () => {
         vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
            throw new Error('Quota exceeded');
         });
         expect(() => setLocalStorageItem('test', 'value')).not.toThrow();
      });
   });

   describe('removeLocalStorageItem', () => {
      it('removes item from localStorage', () => {
         localStorage.setItem('test', 'value');
         removeLocalStorageItem('test');
         expect(localStorage.getItem('test')).toBeNull();
      });

      it('handles localStorage errors gracefully', () => {
         vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
            throw new Error('Storage error');
         });
         expect(() => removeLocalStorageItem('test')).not.toThrow();
      });
   });

   describe('setLocalStorageString', () => {
      it('stores string value directly', () => {
         setLocalStorageString('test', 'hello world');
         expect(localStorage.getItem('test')).toBe('hello world');
      });

      it('handles localStorage errors gracefully', () => {
         vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
            throw new Error('Quota exceeded');
         });
         expect(() => setLocalStorageString('test', 'value')).not.toThrow();
      });
   });

   describe('getLocalStorageString', () => {
      it('returns string value', () => {
         localStorage.setItem('test', 'hello world');
         expect(getLocalStorageString('test')).toBe('hello world');
      });

      it('returns null when key does not exist', () => {
         expect(getLocalStorageString('nonexistent')).toBeNull();
      });

      it('handles localStorage errors gracefully', () => {
         vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
            throw new Error('Storage error');
         });
         expect(getLocalStorageString('test')).toBeNull();
      });
   });
});
