import { describe, it, expect } from 'vitest';
import * as adapters from './index';

describe('adapters/index', () => {
    it('exports normalizeMonster2024', () => {
        expect(typeof adapters.normalizeMonster2024).toBe('function');
    });

    it('exports normalizeSpell5e', () => {
        expect(typeof adapters.normalizeSpell5e).toBe('function');
    });

    it('exports normalizeSpell2024', () => {
        expect(typeof adapters.normalizeSpell2024).toBe('function');
    });

    it('exports normalizeMagicItem2024', () => {
        expect(typeof adapters.normalizeMagicItem2024).toBe('function');
    });

    it('exports exactly 4 adapter functions', () => {
        const expectedExports = [
            'normalizeMonster2024',
            'normalizeSpell5e',
            'normalizeSpell2024',
            'normalizeMagicItem2024'
        ];
        expect(Object.keys(adapters)).toHaveLength(expectedExports.length);
        expectedExports.forEach(name => {
            expect(adapters).toHaveProperty(name);
        });
    });
});
