import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { usePlayerClassLogic } from './usePlayerClassLogic';

describe('usePlayerClassLogic', () => {
   const createPlayerClass = (overrides = {}) => ({
      class_levels: [
          { level: 1, features: [{ name: 'Feature 1', desc: ['Description 1'], details: [] }] },
          { level: 2, features: [{ name: 'Feature 2', desc: ['Description 2'], details: [] }] },
         ],
      subclasses: [],
        ...overrides,
      });

   beforeEach(() => {
      vi.clearAllMocks();
      });

   it('initializes with default values', () => {
      const playerClass = createPlayerClass();
      const { result } = renderHook(() => usePlayerClassLogic(playerClass));
      expect(result.current.isExpanded).toBe(false);
      expect(result.current.shownLevel).toBe(1);
      expect(result.current.shownSubclass).toBe('');
      });

   it('initializes with provided subclass', () => {
      const playerClass = createPlayerClass();
      const { result } = renderHook(() => usePlayerClassLogic(playerClass, 0, 'warlock-pact-of-the-chain'));
      expect(result.current.shownSubclass).toBe('warlock-pact-of-the-chain');
      });

   describe('getNameString', () => {
      it('returns empty string for empty array', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         expect(result.current.getNameString([])).toBe('');
        });

      it('returns empty string for null', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         expect(result.current.getNameString(null)).toBe('');
        });

      it('returns comma-separated string for single item', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         expect(result.current.getNameString(['Strength'])).toBe('Strength');
        });

      it('returns comma-separated string for multiple items', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         expect(result.current.getNameString(['Strength', 'Dexterity'])).toBe('Strength, Dexterity');
     });
      });

   describe('getPrerequisites', () => {
      it('returns empty string for empty array', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         expect(result.current.getPrerequisites([])).toBe('');
        });

      it('returns empty string for null', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         expect(result.current.getPrerequisites(null)).toBe('');
        });

      it('parses feature prerequisites', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         const prereqs = [{ type: 'feature', feature: 'feature-extra-attack' }];
         const resultStr = result.current.getPrerequisites(prereqs);
         expect(resultStr).toContain('attack');
          });
      });

   describe('toggleDetails', () => {
      it('toggles isExpanded state', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         expect(result.current.isExpanded).toBe(false);

         act(() => {
            result.current.toggleDetails();
           });

         expect(result.current.isExpanded).toBe(true);

         act(() => {
            result.current.toggleDetails();
           });

         expect(result.current.isExpanded).toBe(false);
     });
      });

   describe('showLevel', () => {
      it('sets the shown level', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));

         act(() => {
            result.current.showLevel(5);
           });

         expect(result.current.shownLevel).toBe(5);
        });

      it('resets to 0 when clicking the same level', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         act(() => {
            result.current.showLevel(5);
           });

         expect(result.current.shownLevel).toBe(5);

         act(() => {
            result.current.showLevel(5);
           });

         expect(result.current.shownLevel).toBe(0);
     });
      });

   describe('showSubclass', () => {
      it('sets the shown subclass', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));

         act(() => {
            result.current.showSubclass('barbarian-berzerker');
           });

         expect(result.current.shownSubclass).toBe('barbarian-berzerker');
        });

      it('resets to empty string when clicking the same subclass', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         act(() => {
            result.current.showSubclass('barbarian-berzerker');
           });

         expect(result.current.shownSubclass).toBe('barbarian-berzerker');

         act(() => {
            result.current.showSubclass('barbarian-berzerker');
           });

         expect(result.current.shownSubclass).toBe('');
     });
      });

   describe('classFeatures', () => {
      it('returns empty array when no player class', () => {
         // Hook requires a playerClass object, so we test with empty class_levels
         const playerClass = { class_levels: [], subclasses: [] };
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         expect(result.current.classFeatures).toEqual([]);
        });

      it('returns features for current level', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));

         expect(result.current.classFeatures).toHaveLength(1);
         expect(result.current.classFeatures[0].name).toBe('Feature 1');
        });

      it('returns features for higher levels', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));

         act(() => {
            result.current.showLevel(2);
           });

         expect(result.current.classFeatures).toHaveLength(2);
         expect(result.current.classFeatures[0].name).toBe('Feature 2');
         expect(result.current.classFeatures[1].name).toBe('Feature 1');
     });
      });

   describe('subclassFeatures', () => {
      it('returns empty array when no subclass selected', () => {
         const playerClass = createPlayerClass({
            subclasses: [
                { index: 'test-subclass', class_levels: [{ level: 1, features: [{ name: 'Sub Feature', desc: [], details: [] }] }] },
               ],
            });
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         expect(result.current.subclassFeatures).toEqual([]);
        });

      it('returns subclass features when subclass is selected', () => {
         const playerClass = createPlayerClass({
            subclasses: [
                { index: 'test-subclass', class_levels: [{ level: 1, features: [{ name: 'Sub Feature', desc: [], details: [] }] }] },
               ],
            });
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));

         act(() => {
            result.current.showSubclass('test-subclass');
           });

         expect(result.current.subclassFeatures).toHaveLength(1);
         expect(result.current.subclassFeatures[0].name).toBe('Sub Feature');
     });
      });
});
