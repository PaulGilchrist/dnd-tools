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
               expect(resultStr).toContain('feature');
               // substr(14) strips 'feature-extra-' leaving 'attack'
               expect(resultStr).toContain('attack');
                 });

      it('parses level prerequisites (ignored in output)', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         const prereqs = [{ type: 'level', level: 5 }];
         const resultStr = result.current.getPrerequisites(prereqs);
         expect(resultStr).toBe('');
          });

      it('parses proficiency prerequisites', () => {
               const playerClass = createPlayerClass();
               const { result } = renderHook(() => usePlayerClassLogic(playerClass));
               const prereqs = [{ type: 'proficiency', proficiency: 'proficiency-martial-weapons' }];
               const resultStr = result.current.getPrerequisites(prereqs);
               expect(resultStr).toContain('proficiency');
                // substr(19) strips 'proficiency-martia' leaving '-weapons'
               expect(resultStr).toContain('-weapons');
                  });

      it('parses Spell prerequisites', () => {
               const playerClass = createPlayerClass();
               const { result } = renderHook(() => usePlayerClassLogic(playerClass));
               const prereqs = [{ type: 'Spell', spell: 'spell-fireball' }];
               const resultStr = result.current.getPrerequisites(prereqs);
               expect(resultStr).toContain('spell');
                 // substr(12) strips 'spell-fireba' leaving 'll'
               expect(resultStr).toContain('ll');
                   });

      it('parses unknown prerequisite types using fallback', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         const prereqs = [{ type: 'custom', customKey: 'customValue' }];
         const resultStr = result.current.getPrerequisites(prereqs);
         expect(resultStr).toContain('custom');
         expect(resultStr).toContain('customValue');
          });

      it('parses multiple prerequisites of different types', () => {
               const playerClass = createPlayerClass();
               const { result } = renderHook(() => usePlayerClassLogic(playerClass));
               const prereqs = [
                    { type: 'feature', feature: 'feature-extra-attack' },
                    { type: 'Spell', spell: 'spell-fireball' },
                    { type: 'proficiency', proficiency: 'proficiency-martial-weapons' }
                   ];
               const resultStr = result.current.getPrerequisites(prereqs);
               expect(resultStr).toContain('feature');
               expect(resultStr).toContain('spell');
               expect(resultStr).toContain('proficiency');
                  });
        });

   describe('getSpells', () => {
      it('returns empty string for empty array', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         expect(result.current.getSpells([])).toBe('');
          });

      it('returns empty string for null', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         expect(result.current.getSpells(null)).toBe('');
          });

      it('formats spells with prerequisites', () => {
               const playerClass = createPlayerClass();
               const { result } = renderHook(() => usePlayerClassLogic(playerClass));
               const spells = [
                    {
                     spell: { name: 'Fire Bolt' },
                     prerequisites: [
                         { index: '1-1' },
                          { name: 'Spellcasting' }
                        ]
                     }
                   ];
               const resultStr = result.current.getSpells(spells);
               expect(resultStr).toContain('Fire Bolt');
               expect(resultStr).toContain('Spellcasting');
                    });

      it('formats spells with feature prerequisites', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         const spells = [
             {
               spell: { name: 'Fire Bolt' },
               prerequisites: [
                   { index: '1-1' },
                   { name: 'Spellcasting' }
                 ]
              }
            ];
         const resultStr = result.current.getSpells(spells);
         expect(resultStr).toContain('Spellcasting');
         expect(resultStr).toContain('Fire Bolt');
          });

      it('formats multiple spells from same feature at same level', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         const spells = [
             {
               spell: { name: 'Fire Bolt' },
               prerequisites: [
                   { index: '1-1' },
                   { name: 'Spellcasting' }
                 ]
              },
             {
               spell: { name: 'Magic Missile' },
               prerequisites: [
                   { index: '1-1' },
                   { name: 'Spellcasting' }
                 ]
              }
            ];
         const resultStr = result.current.getSpells(spells);
         expect(resultStr).toContain('Spellcasting');
         expect(resultStr).toContain('Fire Bolt');
         expect(resultStr).toContain('Magic Missile');
          });

      it('formats spells from different features', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         const spells = [
             {
               spell: { name: 'Fire Bolt' },
               prerequisites: [
                   { index: '1-1' },
                   { name: 'Spellcasting' }
                 ]
              },
             {
               spell: { name: 'Eldritch Blast' },
               prerequisites: [
                   { index: '1-1' },
                   { name: 'Eldritch Invocation' }
                 ]
              }
            ];
         const resultStr = result.current.getSpells(spells);
         expect(resultStr).toContain('Spellcasting');
         expect(resultStr).toContain('Eldritch Invocation');
         expect(resultStr).toContain('Fire Bolt');
         expect(resultStr).toContain('Eldritch Blast');
          });

      it('formats spells from same feature at different levels', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         const spells = [
             {
               spell: { name: 'Fire Bolt' },
               prerequisites: [
                   { index: '1-1' },
                   { name: 'Spellcasting' }
                 ]
              },
             {
               spell: { name: 'Magic Missile' },
               prerequisites: [
                   { index: '2-1' },
                   { name: 'Spellcasting' }
                 ]
              }
            ];
         const resultStr = result.current.getSpells(spells);
         expect(resultStr).toContain('Fire Bolt');
         expect(resultStr).toContain('Magic Missile');
         expect(resultStr).toContain('Spellcasting');
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

   describe('useEffect with initialShownLevel', () => {
      it('sets shownLevel when initialShownLevel > 0', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass, 5));
         expect(result.current.shownLevel).toBe(5);
          });

      it('sets isExpanded when initialShownLevel > 0', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass, 5));
         expect(result.current.isExpanded).toBe(true);
          });

      it('does not set shownLevel when initialShownLevel is 0', () => {
         const playerClass = createPlayerClass();
         const { result } = renderHook(() => usePlayerClassLogic(playerClass, 0));
         expect(result.current.shownLevel).toBe(1);
          });

      it('updates when initialShownLevel changes', () => {
               const playerClass = createPlayerClass();
               let currentInitialShownLevel = 0;
               const { result, rerender } = renderHook(() => usePlayerClassLogic(playerClass, currentInitialShownLevel));
               expect(result.current.shownLevel).toBe(1);

               currentInitialShownLevel = 3;
               rerender();
               expect(result.current.shownLevel).toBe(3);
                  });
       });

   describe('edge cases', () => {
      it('handles player class without class_levels', () => {
         const playerClass = { subclasses: [] };
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         expect(result.current.classFeatures).toEqual([]);
          });

      it('handles player class without subclasses', () => {
         const playerClass = createPlayerClass({ subclasses: null });
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         expect(result.current.subclassFeatures).toEqual([]);
          });

      it('handles subclass without class_levels', () => {
         const playerClass = createPlayerClass({
            subclasses: [
                 { index: 'test-subclass', class_levels: null }
                 ],
              });
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));

         act(() => {
            result.current.showSubclass('test-subclass');
             });

         expect(result.current.subclassFeatures).toEqual([]);
          });

      it('handles subclass that does not exist', () => {
         const playerClass = createPlayerClass({
            subclasses: [
                 { index: 'test-subclass', class_levels: [{ level: 1, features: [] }] }
                 ],
              });
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));

         act(() => {
            result.current.showSubclass('nonexistent-subclass');
             });

         expect(result.current.subclassFeatures).toEqual([]);
          });

      it('handles class levels without features', () => {
         const playerClass = {
            class_levels: [{ level: 1, features: null }],
            subclasses: []
            };
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));
         expect(result.current.classFeatures).toEqual([]);
          });

      it('handles subclass levels without features', () => {
         const playerClass = createPlayerClass({
            subclasses: [
                 { index: 'test-subclass', class_levels: [{ level: 1, features: null }] }
                 ],
              });
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));

         act(() => {
            result.current.showSubclass('test-subclass');
             });

         expect(result.current.subclassFeatures).toEqual([]);
          });

      it('deduplicates features across levels', () => {
         const playerClass = {
            class_levels: [
                 { level: 1, features: [{ name: 'Same Feature', desc: ['Desc 1'], details: [] }] },
                 { level: 2, features: [{ name: 'Same Feature', desc: ['Desc 2'], details: [] }] }
                 ],
            subclasses: []
            };
         const { result } = renderHook(() => usePlayerClassLogic(playerClass));

         act(() => {
            result.current.showLevel(2);
             });

         expect(result.current.classFeatures).toHaveLength(1);
         expect(result.current.classFeatures[0].name).toBe('Same Feature');
         expect(result.current.classFeatures[0].description).toEqual(['Desc 2']);
          });
       });
});
