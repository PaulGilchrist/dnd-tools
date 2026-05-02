import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

describe('dataService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useAbilityScores', () => {
    it('fetches ability scores data on first call', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ name: 'Strength', abbr: 'STR' }];

      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });
      const { result } = renderHook(() => mod.useAbilityScores());

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });

    it('returns cached data on second hook invocation without re-fetching', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ name: 'Strength', abbr: 'STR' }];

      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });
      const { result: r1 } = renderHook(() => mod.useAbilityScores());
      await waitFor(() => expect(r1.current.loading).toBe(false));
      expect(r1.current.data).toEqual(mockData);

      const { result: r2 } = renderHook(() => mod.useAbilityScores());
      expect(r2.current.loading).toBe(false);
      expect(r2.current.data).toEqual(mockData);
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    it('does not refetch on component rerender', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ name: 'Dexterity', abbr: 'DEX' }];

      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });
      const { result, rerender } = renderHook(() => mod.useAbilityScores());

      await waitFor(() => expect(result.current.loading).toBe(false));
      const callsAfterLoad = globalThis.fetch.mock.calls.length;

      rerender();
      rerender();

      expect(globalThis.fetch).toHaveBeenCalledTimes(callsAfterLoad);
    });
  });

  describe('useConditions', () => {
    it('fetches and returns conditions data', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ name: 'Blinded' }, { name: 'Charmed' }];

      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });
      const { result } = renderHook(() => mod.useConditions());

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toEqual(mockData);
    });

    it('returns cached data without re-fetching', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ name: 'Blinded' }];

      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });
      const { result: r1 } = renderHook(() => mod.useConditions());
      await waitFor(() => expect(r1.current.loading).toBe(false));

      const { result: r2 } = renderHook(() => mod.useConditions());
      expect(r2.current.loading).toBe(false);
      expect(r2.current.data).toEqual(mockData);
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('useEquipment', () => {
    it('fetches and returns equipment data', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ name: 'Dagger', cost: 2 }];

      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });
      const { result } = renderHook(() => mod.useEquipment());

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('useMonsters', () => {
    it('fetches and returns monster data without sorting', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ name: 'Goblin', cr: '1/4' }, { name: 'Dragon', cr: '20' }];

      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });
      const { result } = renderHook(() => mod.useMonsters());

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('useNames', () => {
    it('fetches and sorts names data by name property', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];

      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });
      const { result } = renderHook(() => mod.useNames());

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toEqual([
        { name: 'Alice' },
        { name: 'Bob' },
        { name: 'Charlie' },
      ]);
    });

    it('handles names with same value', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ name: 'Test' }, { name: 'Test' }];

      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });
      const { result } = renderHook(() => mod.useNames());

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toHaveLength(2);
      expect(result.current.data.every((n) => n.name === 'Test')).toBe(true);
    });
  });

  describe('useSpells', () => {
    it('fetches and returns spells data', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ name: 'Fireball', level: 3 }];

      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });
      const { result } = renderHook(() => mod.useSpells());

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('use2024Spells', () => {
    it('fetches and returns 2024 spells data', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ name: 'Magic Missile' }];

      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });
      const { result } = renderHook(() => mod.use2024Spells());

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('useFeats', () => {
    it('fetches and returns feats data', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ name: 'Tough' }];

      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });
      const { result } = renderHook(() => mod.useFeats());

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('error handling', () => {
    it('sets error state when HTTP response is not ok', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        status: 404,
      });

      const { result } = renderHook(() => mod.useEquipment());
      expect(result.current.loading).toBe(true);

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.error).toBeTruthy();
      expect(result.current.error.message).toContain('HTTP error! status: 404');
    });

    it('sets error state when fetch is rejected', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => mod.useEquipment());
      expect(result.current.loading).toBe(true);

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.error).toBeTruthy();
      expect(result.current.error.message).toBe('Network error');
    });

    it('sets error state when JSON parsing fails', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => { throw new Error('Invalid JSON'); },
      });

      const { result } = renderHook(() => mod.useEquipment());
      expect(result.current.loading).toBe(true);

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.error).toBeTruthy();
      expect(result.current.error.message).toBe('Invalid JSON');
    });

    it('stores error without logging to console on hook failure', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Test failure'));

      const { result } = renderHook(() => mod.useEquipment());
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.error).toBeTruthy();
      expect(result.current.error.message).toBe('Test failure');
     });
  });

  describe('DataService class', () => {
    it('getAbilityScores returns fetched data', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ name: 'Strength' }];
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const service = new mod.DataService();
      const result = await service.getAbilityScores();
      expect(result).toEqual(mockData);
    });

    it('getConditions returns fetched data', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ name: 'Charmed' }];
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const service = new mod.DataService();
      const result = await service.getConditions();
      expect(result).toEqual(mockData);
    });

    it('getEquipment returns fetched data', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ name: 'Sword' }];
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const service = new mod.DataService();
      const result = await service.getEquipment();
      expect(result).toEqual(mockData);
    });

    it('getMonsters returns fetched data', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ name: 'Dragon' }];
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const service = new mod.DataService();
      const result = await service.getMonsters();
      expect(result).toEqual(mockData);
    });

    it('getNames returns sorted data', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ name: 'Zeke' }, { name: 'Aaron' }];
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const service = new mod.DataService();
      const result = await service.getNames();
      expect(result).toEqual([{ name: 'Aaron' }, { name: 'Zeke' }]);
    });

    it('getSpells returns fetched data', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ name: 'Fireball' }];
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const service = new mod.DataService();
      const result = await service.getSpells();
      expect(result).toEqual(mockData);
    });

    it('get2024MonsterTypes returns fetched data', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ name: 'Aberration' }];
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const service = new mod.DataService();
      const result = await service.get2024MonsterTypes();
      expect(result).toEqual(mockData);
    });

    it('getBackgrounds2024 returns fetched data', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ name: 'Acolyte' }];
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const service = new mod.DataService();
      const result = await service.getBackgrounds2024();
      expect(result).toEqual(mockData);
    });

    it('caches results across multiple calls', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      const mockData = [{ id: 1 }];
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const service = new mod.DataService();
      await service.getRaces();
      await service.getRaces();

      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    it('rejects when fetch fails', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network failure'));

      const service = new mod.DataService();
      await expect(service.getRaces()).rejects.toThrow('Network failure');
    });

    it('rejects with HTTP error on non-ok response', async () => {
      const mod = await import('./dataService');
      mod.__clearCache();
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        status: 500,
      });

      const service = new mod.DataService();
      await expect(service.getRules()).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('dataService singleton', () => {
    it('is an instance of DataService', async () => {
      const mod = await import('./dataService');
      expect(mod.dataService).toBeInstanceOf(mod.DataService);
    });

    it('shares the same cache between instances', async () => {
      const mod = await import('./dataService');
      const s1 = new mod.DataService();
      const s2 = new mod.DataService();

      expect(s1.cache).toBe(s2.cache);
    });
  });

  describe('sort helper', () => {
    it('sorts array ascending by property', async () => {
      const mod = await import('./dataService');
      const { sort } = mod;

      const arr = [{ val: 3 }, { val: 1 }, { val: 2 }];
      sort(arr, 'val');
      expect(arr).toEqual([{ val: 1 }, { val: 2 }, { val: 3 }]);
    });

    it('sorts array descending by property', async () => {
      const mod = await import('./dataService');
      const { sort } = mod;

      const arr = [{ val: 3 }, { val: 1 }, { val: 2 }];
      sort(arr, 'val', true);
      expect(arr).toEqual([{ val: 3 }, { val: 2 }, { val: 1 }]);
    });

    it('does nothing when input is null', async () => {
      const mod = await import('./dataService');
      const { sort } = mod;

      expect(() => sort(null, 'name')).not.toThrow();
    });

    it('does nothing when input is undefined', async () => {
      const mod = await import('./dataService');
      const { sort } = mod;

      expect(() => sort(undefined, 'name')).not.toThrow();
    });

    it('does nothing when input is empty array', async () => {
      const mod = await import('./dataService');
      const { sort } = mod;

      const arr = [];
      sort(arr, 'name');
      expect(arr).toEqual([]);
    });

    it('does nothing when propertyName is falsy', async () => {
      const mod = await import('./dataService');
      const { sort } = mod;

      const arr = [{ name: 'test' }];
      expect(() => sort(arr, '')).not.toThrow();
      expect(() => sort(arr, undefined)).not.toThrow();
      expect(() => sort(arr, null)).not.toThrow();
    });
  });

  describe('handleError', () => {
    it('logs error to console and re-throws', async () => {
      const mod = await import('./dataService');
      const { handleError } = mod;
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const testError = new Error('Test error');
      expect(() => handleError(testError)).toThrow('Test error');
      expect(consoleSpy).toHaveBeenCalledWith(testError);
    });
  });
});
