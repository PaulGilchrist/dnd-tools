import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { sort, handleError, __clearCache, dataService, DataService, useAbilityScores, useConditions, useSpells, useNames, useEquipment, useFeats, useMonsters, useMagicItems, usePlayerClasses, useRaces, useRules, useWeaponProperties, use2024Spells, use2024Monsters, use2024MonsterTypes, use2024MonsterSubtypes, use2024MagicItems, use2024Classes, use2024Races, use2024Backgrounds, use2024Feats, useWeaponMastery2024 } from './dataService';

// Mock the fetch API
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Mock import.meta.env
vi.stubGlobal('import.meta', { env: { BASE_URL: '/' } });

describe('dataService', () => {
  beforeEach(() => {
    __clearCache();
    mockFetch.mockReset();
  });

  describe('sort', () => {
    it('sorts array of objects by property name ascending', () => {
      const input = [
        { name: 'Charlie', value: 3 },
        { name: 'Alice', value: 1 },
        { name: 'Bob', value: 2 }
      ];
      sort(input, 'name');
      expect(input[0].name).toBe('Alice');
      expect(input[1].name).toBe('Bob');
      expect(input[2].name).toBe('Charlie');
    });

    it('sorts array of objects by property name descending', () => {
      const input = [
        { name: 'Alice', value: 1 },
        { name: 'Charlie', value: 3 },
        { name: 'Bob', value: 2 }
      ];
      sort(input, 'name', true);
      expect(input[0].name).toBe('Charlie');
      expect(input[1].name).toBe('Bob');
      expect(input[2].name).toBe('Alice');
    });

    it('handles null input', () => {
      expect(() => sort(null, 'name')).not.toThrow();
    });

    it('handles missing property name', () => {
      const input = [{ name: 'Test' }];
      expect(() => sort(input, null)).not.toThrow();
    });

    it('sorts by numeric values correctly', () => {
      const input = [
        { name: 'Item3', value: 30 },
        { name: 'Item1', value: 10 },
        { name: 'Item2', value: 20 }
      ];
      sort(input, 'value');
      expect(input[0].value).toBe(10);
      expect(input[1].value).toBe(20);
      expect(input[2].value).toBe(30);
    });
  });

  describe('handleError', () => {
    it('logs error to console and throws', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');
      
      expect(() => handleError(error)).toThrow('Test error');
      expect(consoleSpy).toHaveBeenCalledWith(error);
      
      consoleSpy.mockRestore();
    });
  });

  describe('DataService class', () => {
    it('creates instance with cache reference', () => {
      const service = new DataService();
      expect(service.cache).toBeDefined();
    });

    it('has all data getter methods', () => {
      const service = new DataService();
      const methods = [
        'getAbilityScores', 'getConditions', 'getEquipment', 'getFeats',
        'getLocations', 'getMagicItems', 'getMonsters', 'getMonsterTypes',
        'get2024MonsterTypes', 'getNames', 'getPlayerClasses', 'getRaces',
        'getRules', 'getSpells', 'getWeaponProperties', 'getBackgrounds2024'
      ];
      methods.forEach(method => {
        expect(typeof service[method]).toBe('function');
      });
    });

    it('fetches data through class methods', async () => {
      const mockData = [{ id: 1, name: 'Test' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const service = new DataService();
      const result = await service.getAbilityScores();
      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith('/data/ability-scores.json');
    });

    it('caches repeated calls through class methods', async () => {
      const mockData = [{ id: 1, name: 'Test' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const service = new DataService();
      const result1 = await service.getAbilityScores();
      const result2 = await service.getAbilityScores();
      expect(result1).toBe(result2); // Same reference due to caching
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('handles fetch errors in class methods', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const service = new DataService();
      await expect(service.getAbilityScores()).rejects.toThrow('HTTP error! status: 404');
    });
  });

  describe('dataService singleton', () => {
    it('exports a singleton instance', () => {
      expect(dataService).toBeInstanceOf(DataService);
    });

    it('singleton has all methods', () => {
      expect(typeof dataService.getSpells).toBe('function');
      expect(typeof dataService.getMonsters).toBe('function');
    });
  });

  describe('fetchAndCache', () => {
    it('caches fetched data', async () => {
      const mockData = { test: 'data' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      // We need to test the internal fetchAndCache function
      // Since it's not exported, we'll test through the DataService class
      const service = new DataService();
      const result = await service.getEquipment();
      expect(result).toEqual(mockData);
    });

    it('reuses in-flight requests', async () => {
      const mockData = { test: 'data' };
      let resolveFetch;
      const fetchPromise = new Promise(resolve => {
        resolveFetch = resolve;
      });
      mockFetch.mockReturnValueOnce(fetchPromise);

      const service = new DataService();
      const promise1 = service.getRaces();
      const promise2 = service.getRaces(); // Should reuse

      resolveFetch({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const [result1, result2] = await Promise.all([promise1, promise2]);
      expect(result1).toEqual(mockData);
      expect(result2).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('__clearCache', () => {
    it('clears all cached data', async () => {
      const mockData = { test: 'data' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const service = new DataService();
      await service.getRules();
      
      __clearCache();
      
      // After clearing, next call should fetch again
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      });
      
      await service.getRules();
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('React hooks', () => {
    const mockData = [{ id: 1, name: 'Test' }];

    beforeEach(() => {
      mockFetch.mockReset();
    });

    it('useAbilityScores returns data, loading, and error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const { result } = renderHook(() => useAbilityScores());
      
      // Initially loading
      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeUndefined();
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });

    it('useConditions handles fetch error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const { result } = renderHook(() => useConditions());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.error).toBeDefined();
      expect(result.current.data).toBeUndefined();
    });

    it('useSpells returns cached data on subsequent calls', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      // First hook call
      const { result: result1 } = renderHook(() => useSpells());
      
      await waitFor(() => {
        expect(result1.current.loading).toBe(false);
      });
      
      expect(result1.current.data).toEqual(mockData);
      
      // Second hook call should use cache
      const { result: result2 } = renderHook(() => useSpells());
      
      // Should have data immediately (cached)
      expect(result2.current.loading).toBe(false);
      expect(result2.current.data).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledTimes(1); // Only fetched once
    });

    it('useNames sorts data by name property', async () => {
      const unsortedData = [
        { name: 'Charlie' },
        { name: 'Alice' },
        { name: 'Bob' }
      ];
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(unsortedData)
      });

      const { result } = renderHook(() => useNames());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      // Data should be sorted by name
      expect(result.current.data[0].name).toBe('Alice');
      expect(result.current.data[1].name).toBe('Bob');
      expect(result.current.data[2].name).toBe('Charlie');
    });

    it('useEquipment fetches and caches data', async () => {
      const mockEquipment = [{ id: 1, name: 'Sword' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockEquipment)
      });

      const { result } = renderHook(() => useEquipment());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockEquipment);
    });

    it('useFeats handles loading state', async () => {
      const mockFeats = [{ id: 1, name: 'Sharpshooter' }];
      
      // Create a promise we can resolve later
      let resolveFetch;
      const fetchPromise = new Promise(resolve => {
        resolveFetch = resolve;
      });
      mockFetch.mockReturnValueOnce(fetchPromise);

      const { result } = renderHook(() => useFeats());
      
      // Should be loading initially
      expect(result.current.loading).toBe(true);
      
      // Resolve the fetch
      resolveFetch({
        ok: true,
        json: () => Promise.resolve(mockFeats)
      });
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockFeats);
    });

    it('useMonsters returns empty initially then loads', async () => {
      const mockMonsters = [{ id: 1, name: 'Goblin' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMonsters)
      });

      const { result } = renderHook(() => useMonsters());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockMonsters);
      expect(result.current.error).toBeNull();
    });

    it('useMagicItems handles HTTP error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const { result } = renderHook(() => useMagicItems());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.error).toBeDefined();
      expect(result.current.data).toBeUndefined();
    });

    it('usePlayerClasses loads data correctly', async () => {
      const mockClasses = [{ index: 'fighter', name: 'Fighter' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockClasses)
      });

      const { result } = renderHook(() => usePlayerClasses());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockClasses);
    });

    it('useRaces returns data and handles re-fetch', async () => {
      const mockRaces = [{ index: 'human', name: 'Human' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRaces)
      });

      const { result, rerender } = renderHook(() => useRaces());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockRaces);
      
      // Clear cache and rerender to trigger re-fetch
      __clearCache();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRaces)
      });
      
      rerender();
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('useRules fetches from correct URL', async () => {
      const mockRules = [{ id: 1, name: 'Rule 1' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRules)
      });

      const { result } = renderHook(() => useRules());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockRules);
      expect(mockFetch).toHaveBeenCalledWith('/data/rules.json');
    });

    it('useWeaponProperties loads correctly', async () => {
      const mockProps = [{ id: 1, name: 'Finesse' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProps)
      });

      const { result } = renderHook(() => useWeaponProperties());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockProps);
    });

    it('use2024Spells fetches from 2024 directory', async () => {
      const mockSpells = [{ id: 1, name: 'Fireball 2024' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSpells)
      });

      const { result } = renderHook(() => use2024Spells());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockSpells);
      expect(mockFetch).toHaveBeenCalledWith('/data/2024/spells.json');
    });

    it('use2024Monsters loads 2024 monster data', async () => {
      const mockMonsters = [{ id: 1, name: 'Young Red Dragon' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMonsters)
      });

      const { result } = renderHook(() => use2024Monsters());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockMonsters);
      expect(mockFetch).toHaveBeenCalledWith('/data/2024/monsters.json');
    });

    it('use2024MonsterTypes fetches correctly', async () => {
      const mockTypes = [{ id: 1, name: 'Dragon' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTypes)
      });

      const { result } = renderHook(() => use2024MonsterTypes());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockTypes);
    });

    it('use2024MonsterSubtypes works correctly', async () => {
      const mockSubtypes = [{ id: 1, name: 'Fire' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSubtypes)
      });

      const { result } = renderHook(() => use2024MonsterSubtypes());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockSubtypes);
    });

    it('use2024MagicItems fetches from 2024 data', async () => {
      const mockItems = [{ id: 1, name: 'Vorpal Sword +3' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockItems)
      });

      const { result } = renderHook(() => use2024MagicItems());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockItems);
      expect(mockFetch).toHaveBeenCalledWith('/data/2024/magic-items.json');
    });

    it('use2024Classes loads 2024 class data', async () => {
      const mockClasses = [{ id: 1, name: 'Fighter (2024)' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockClasses)
      });

      const { result } = renderHook(() => use2024Classes());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockClasses);
    });

    it('use2024Races fetches correctly', async () => {
      const mockRaces = [{ id: 1, name: 'Human (2024)' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRaces)
      });

      const { result } = renderHook(() => use2024Races());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockRaces);
    });

    it('use2024Backgrounds loads background data', async () => {
      const mockBackgrounds = [{ id: 1, name: 'Acolyte' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBackgrounds)
      });

      const { result } = renderHook(() => use2024Backgrounds());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockBackgrounds);
    });

    it('use2024Feats fetches 2024 feats', async () => {
      const mockFeats = [{ id: 1, name: 'Great Weapon Master' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFeats)
      });

      const { result } = renderHook(() => use2024Feats());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockFeats);
    });

    it('useWeaponMastery2024 loads mastery data', async () => {
      const mockMastery = [{ id: 1, name: 'Topple' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMastery)
      });

      const { result } = renderHook(() => useWeaponMastery2024());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockMastery);
    });
  });

  describe('DataService additional methods', () => {
    it('get2024MonsterTypes works correctly', async () => {
      const mockData = [{ id: 1, name: 'Dragon' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const service = new DataService();
      const result = await service.get2024MonsterTypes();
      expect(result).toEqual(mockData);
    });

    it('getNames returns sorted data', async () => {
      const unsortedData = [{ name: 'Bob' }, { name: 'Alice' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(unsortedData)
      });

      const service = new DataService();
      const result = await service.getNames();
      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Bob');
    });

    it('getBackgrounds2024 fetches correctly', async () => {
      const mockData = [{ id: 1, name: 'Acolyte' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const service = new DataService();
      const result = await service.getBackgrounds2024();
      expect(result).toEqual(mockData);
    });
  });
});
