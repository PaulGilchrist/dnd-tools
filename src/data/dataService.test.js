import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const mockFetchResponse = (data, ok = true) => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok,
    status: ok ? 200 : 404,
    json: ok ? (async () => data) : undefined,
  });
  return data;
};

const mockFetchReject = (message) => {
  vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error(message));
  return message;
};

describe('dataService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useAbilityScores uses cache', () => {
    it('fetches ability scores data on first call', async () => {
      const mod = await import('./dataService');
      const mockData = [{ name: 'Strength', abbr: 'STR' }];

      mockFetchResponse(mockData);
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
      const mockData = [{ name: 'Strength', abbr: 'STR' }];

      mockFetchResponse(mockData);
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
      const mockData = [{ name: 'Dexterity', abbr: 'DEX' }];

      mockFetchResponse(mockData);
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
      const mockData = [{ name: 'Blinded' }, { name: 'Charmed' }];

      mockFetchResponse(mockData);
      const { result } = renderHook(() => mod.useConditions());

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toEqual(mockData);
    });

    it('returns cached data without re-fetching', async () => {
      const mod = await import('./dataService');
      const mockData = [{ name: 'Blinded' }];

      mockFetchResponse(mockData);
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
      const mockData = [{ name: 'Dagger', cost: 2 }];

      mockFetchResponse(mockData);
      const { result } = renderHook(() => mod.useEquipment());

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('useMonsters', () => {
    it('fetches and returns monster data without sorting', async () => {
      const mod = await import('./dataService');
      const mockData = [{ name: 'Goblin', cr: '1/4' }, { name: 'Dragon', cr: '20' }];

      mockFetchResponse(mockData);
      const { result } = renderHook(() => mod.useMonsters());

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('useNames', () => {
    it('fetches and sorts names data by name property', async () => {
      const mod = await import('./dataService');
      const mockData = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];

      mockFetchResponse(mockData);
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
      const mockData = [{ name: 'Test' }, { name: 'Test' }];

      mockFetchResponse(mockData);
      const { result } = renderHook(() => mod.useNames());

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toHaveLength(2);
      expect(result.current.data.every((n) => n.name === 'Test')).toBe(true);
    });
  });

  describe('useSpells', () => {
    it('fetches and returns spells data', async () => {
      const mod = await import('./dataService');
      const mockData = [{ name: 'Fireball', level: 3 }];

      mockFetchResponse(mockData);
      const { result } = renderHook(() => mod.useSpells());

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('use2024Spells', () => {
    it('fetches and returns 2024 spells data', async () => {
      const mod = await import('./dataService');
      const mockData = [{ name: 'Magic Missile' }];

      mockFetchResponse(mockData);
      const { result } = renderHook(() => mod.use2024Spells());

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('useFeats', () => {
    it('fetches and returns feats data', async () => {
      const mod = await import('./dataService');
      const mockData = [{ name: 'Tough' }];

      mockFetchResponse(mockData);
      const { result } = renderHook(() => mod.useFeats());

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('error handling', () => {
    it('sets error state when HTTP response is not ok', async () => {
      const mod = await import('./dataService');
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
      mockFetchReject('Network error');

      const { result } = renderHook(() => mod.useEquipment());
      expect(result.current.loading).toBe(true);

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.error).toBeTruthy();
      expect(result.current.error.message).toBe('Network error');
    });

    it('sets error state when JSON parsing fails', async () => {
      const mod = await import('./dataService');
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

    it('logs error to console on failure', async () => {
      const mod = await import('./dataService');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockFetchReject('Test failure');

      const { result } = renderHook(() => mod.useEquipment());
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('DataService class', () => {
    it('getAbilityScores returns fetched data', async () => {
      const mod = await import('./dataService');
      const mockData = [{ name: 'Strength' }];
      mockFetchResponse(mockData);

      const service = new mod.DataService();
      const result = await service.getAbilityScores();
      expect(result).toEqual(mockData);
    });

    it('getConditions returns fetched data', async () => {
      const mod = await import('./dataService');
      const mockData = [{ name: 'Charmed' }];
      mockFetchResponse(mockData);

      const service = new mod.DataService();
      const result = await service.getConditions();
      expect(result).toEqual(mockData);
    });

    it('getEquipment returns fetched data', async () => {
      const mod = await import('./dataService');
      const mockData = [{ name: 'Sword' }];
      mockFetchResponse(mockData);

      const service = new mod.DataService();
      const result = await service.getEquipment();
      expect(result).toEqual(mockData);
    });

    it('getMonsters returns fetched data', async () => {
      const mod = await import('./dataService');
      const mockData = [{ name: 'Dragon' }];
      mockFetchResponse(mockData);

      const service = new mod.DataService();
      const result = await service.getMonsters();
      expect(result).toEqual(mockData);
    });

    it('getNames returns sorted data', async () => {
      const mod = await import('./dataService');
      const mockData = [{ name: 'Zeke' }, { name: 'Aaron' }];
      mockFetchResponse(mockData);

      const service = new mod.DataService();
      const result = await service.getNames();
      expect(result).toEqual([{ name: 'Aaron' }, { name: 'Zeke' }]);
    });

    it('getSpells returns fetched data', async () => {
      const mod = await import('./dataService');
      const mockData = [{ name: 'Fireball' }];
      mockFetchResponse(mockData);

      const service = new mod.DataService();
      const result = await service.getSpells();
      expect(result).toEqual(mockData);
    });

    it('get2024MonsterTypes returns fetched data', async () => {
      const mod = await import('./dataService');
      const mockData = [{ name: 'Aberration' }];
      mockFetchResponse(mockData);

      const service = new mod.DataService();
      const result = await service.get2024MonsterTypes();
      expect(result).toEqual(mockData);
    });

    it('getBackgrounds2024 returns fetched data', async () => {
      const mod = await import('./dataService');
      const mockData = [{ name: 'Acolyte' }];
      mockFetchResponse(mockData);

      const service = new mod.DataService();
      const result = await service.getBackgrounds2024();
      expect(result).toEqual(mockData);
    });

    it('caches results across multiple calls', async () => {
      const mod = await import('./dataService');
      const mockData = [{ id: 1 }];
      mockFetchResponse(mockData);

      const service = new mod.DataService();
      await service.getRaces();
      await service.getRaces();

      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    it('rejects when fetch fails', async () => {
      const mod = await import('./dataService');
      mockFetchReject('Network failure');

      const service = new mod.DataService();
      await expect(service.getRaces()).rejects.toThrow('Network failure');
    });

    it('rejects with HTTP error on non-ok response', async () => {
      const mod = await import('./dataService');
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        status: 500,
      });

      const service = new mod.DataService();
      await expect(service.getRules()).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('dataService singleton', () => {
    it('is an instance of DataService', () => {
      const mod = import('./dataService');
      expect(mod.dataService).toBeInstanceOf(mod.DataService);
    });

    it('shares the same cache between instances', () => {
      const mod = import('./dataService');
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
