import { describe, it, expect } from 'vitest';
import { getNameString } from './monsterUtils';

describe('getNameString', () => {
   it('returns empty string for null input', () => {
      expect(getNameString(null)).toBe('');
   });

   it('returns empty string for undefined input', () => {
      expect(getNameString(undefined)).toBe('');
   });

   it('returns empty string for empty array', () => {
      expect(getNameString([])).toBe('');
   });

   it('returns single name without trailing comma', () => {
      expect(getNameString(['Goblin'])).toBe('Goblin');
   });

   it('concatenates multiple names with comma and space', () => {
      expect(getNameString(['Goblin', 'Orc', 'Wolf'])).toBe('Goblin, Orc, Wolf');
   });

   it('handles array with empty strings', () => {
      expect(getNameString([''])).toBe('');
   });
});
