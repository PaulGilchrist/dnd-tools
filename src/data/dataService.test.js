import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Mock import.meta.env
Object.defineProperty(import.meta, 'env', {
    value: { BASE_URL: '' },
    writable: true,
});

// Import after mocking
import { sort, handleError, __clearCache } from './dataService';

describe('sort', () => {
    it('sorts array by property name ascending', () => {
        const arr = [{ name: 'zebra' }, { name: 'apple' }, { name: 'banana' }];
        sort(arr, 'name');
        expect(arr[0].name).toBe('apple');
        expect(arr[1].name).toBe('banana');
        expect(arr[2].name).toBe('zebra');
    });

    it('sorts array by property name descending', () => {
        const arr = [{ name: 'apple' }, { name: 'zebra' }, { name: 'banana' }];
        sort(arr, 'name', true);
        expect(arr[0].name).toBe('zebra');
        expect(arr[1].name).toBe('banana');
        expect(arr[2].name).toBe('apple');
    });

    it('handles null input gracefully', () => {
        expect(() => sort(null, 'name')).not.toThrow();
    });

    it('handles empty array', () => {
        const arr = [];
        sort(arr, 'name');
        expect(arr).toEqual([]);
    });
});

describe('handleError', () => {
    it('throws the error', () => {
        const error = new Error('test error');
        expect(() => handleError(error)).toThrow('test error');
    });

    it('logs error to console', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const error = new Error('test');
        try { handleError(error); } catch (e) {}
        expect(consoleSpy).toHaveBeenCalledWith(error);
        consoleSpy.mockRestore();
    });
});

describe('__clearCache', () => {
    it('clears the cache without error', () => {
        expect(() => __clearCache()).not.toThrow();
    });
});

describe('dataService exports', () => {
    it('has all required exports', async () => {
        const ds = await import('./dataService');
        expect(typeof ds.sort).toBe('function');
        expect(typeof ds.handleError).toBe('function');
        expect(typeof ds.__clearCache).toBe('function');
        expect(typeof ds.useAbilityScores).toBe('function');
        expect(typeof ds.useConditions).toBe('function');
        expect(typeof ds.useEquipment).toBe('function');
        expect(typeof ds.useFeats).toBe('function');
        expect(typeof ds.useMagicItems).toBe('function');
        expect(typeof ds.useMonsters).toBe('function');
    });

    it('has useWeaponProperties export', async () => {
        const ds = await import('./dataService');
        expect(typeof ds.useWeaponProperties).toBe('function');
    });

    it('has use2024Spells export', async () => {
        const ds = await import('./dataService');
        expect(typeof ds.use2024Spells).toBe('function');
    });

    it('has use2024MonsterTypes export', async () => {
        const ds = await import('./dataService');
        expect(typeof ds.use2024MonsterTypes).toBe('function');
    });

    it('has use2024MonsterSubtypes export', async () => {
        const ds = await import('./dataService');
        expect(typeof ds.use2024MonsterSubtypes).toBe('function');
    });

    it('has use2024MagicItems export', async () => {
        const ds = await import('./dataService');
        expect(typeof ds.use2024MagicItems).toBe('function');
    });

    it('has use2024Classes export', async () => {
        const ds = await import('./dataService');
        expect(typeof ds.use2024Classes).toBe('function');
    });

    it('has use2024Races export', async () => {
        const ds = await import('./dataService');
        expect(typeof ds.use2024Races).toBe('function');
    });

    it('has use2024Backgrounds export', async () => {
        const ds = await import('./dataService');
        expect(typeof ds.use2024Backgrounds).toBe('function');
    });

    it('has use2024Feats export', async () => {
        const ds = await import('./dataService');
        expect(typeof ds.use2024Feats).toBe('function');
    });

    it('has useWeaponMastery2024 export', async () => {
        const ds = await import('./dataService');
        expect(typeof ds.useWeaponMastery2024).toBe('function');
    });
});
