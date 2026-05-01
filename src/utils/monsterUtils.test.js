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
      expect(getNameString(['blinded'])).toBe('blinded');
    });

   it('returns comma-separated string for multiple names', () => {
      expect(getNameString(['blinded', 'charmed'])).toBe('blinded, charmed');
    });

   it('handles three or more names', () => {
      expect(getNameString(['blinded', 'charmed', 'deafened'])).toBe('blinded, charmed, deafened');
    });

   it('does not have trailing comma or space', () => {
      const result = getNameString(['fire', 'cold']);
      expect(result).not.toMatch(/, $/);
    });
});