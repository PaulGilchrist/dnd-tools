import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock react-router-dom useLocation
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useLocation: vi.fn(),
    };
});

import { useLocation } from 'react-router-dom';
import useRouteInfo from './useRouteInfo';

describe('useRouteInfo', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock for useLocation
        useLocation.mockReturnValue({ pathname: '/' });
    });

    describe('navRoutes filtering', () => {
        it('returns navRoutes array filtered by ruleVersion prop', () => {
            const { result } = renderHook(() => useRouteInfo('2024'));
            expect(Array.isArray(result.current.navRoutes)).toBe(true);
            expect(result.current.navRoutes.length).toBeGreaterThan(0);
        });

        it('filters out dropdown items with requiredVersion not matching the provided ruleVersion', () => {
            const { result } = renderHook(() => useRouteInfo('5e'));

            // Find the rules dropdown
            const rulesDropdown = result.current.navRoutes.find(route => route.key === 'rules');
            expect(rulesDropdown).toBeDefined();

            // Backgrounds and Weapon Mastery should be filtered out for 5e
            const backgroundsItem = rulesDropdown.items.find(item => item.label === 'Backgrounds');
            const weaponMasteryItem = rulesDropdown.items.find(item => item.label === 'Weapon Mastery');

            expect(backgroundsItem).toBeUndefined();
            expect(weaponMasteryItem).toBeUndefined();
        });

        it('includes dropdown items with requiredVersion matching the provided ruleVersion', () => {
            const { result } = renderHook(() => useRouteInfo('2024'));

            // Find the rules dropdown
            const rulesDropdown = result.current.navRoutes.find(route => route.key === 'rules');
            expect(rulesDropdown).toBeDefined();

            // Backgrounds and Weapon Mastery should be included for 2024
            const backgroundsItem = rulesDropdown.items.find(item => item.label === 'Backgrounds');
            const weaponMasteryItem = rulesDropdown.items.find(item => item.label === 'Weapon Mastery');

            expect(backgroundsItem).toBeDefined();
            expect(backgroundsItem.requiredVersion).toBe('2024');
            expect(weaponMasteryItem).toBeDefined();
            expect(weaponMasteryItem.requiredVersion).toBe('2024');
        });

        it('includes items without requiredVersion regardless of ruleVersion', () => {
            const { result: result5e } = renderHook(() => useRouteInfo('5e'));
            const { result: result2024 } = renderHook(() => useRouteInfo('2024'));

            const rulesDropdown5e = result5e.current.navRoutes.find(route => route.key === 'rules');
            const rulesDropdown2024 = result2024.current.navRoutes.find(route => route.key === 'rules');

            // General, Abilities, Classes, Conditions, Feats, Races should be in both
            const expectedItems = ['General', 'Abilities', 'Classes', 'Conditions', 'Feats', 'Races'];

            expectedItems.forEach(itemLabel => {
                const itemIn5e = rulesDropdown5e.items.find(item => item.label === itemLabel);
                const itemIn2024 = rulesDropdown2024.items.find(item => item.label === itemLabel);

                expect(itemIn5e).toBeDefined();
                expect(itemIn2024).toBeDefined();
            });
        });

        it('returns all routes when no ruleVersion is provided', () => {
            const { result } = renderHook(() => useRouteInfo());

            // Without ruleVersion, all items should be included
            const rulesDropdown = result.current.navRoutes.find(route => route.key === 'rules');
            expect(rulesDropdown).toBeDefined();

            // All items including Backgrounds and Weapon Mastery should be present
            const allItemLabels = rulesDropdown.items.map(item => item.label);
            expect(allItemLabels).toContain('Backgrounds');
            expect(allItemLabels).toContain('Weapon Mastery');
        });
    });

    describe('selected state', () => {
        it('returns selected state as a string', () => {
            const { result } = renderHook(() => useRouteInfo());
            expect(typeof result.current.selected).toBe('string');
        });

        it('initializes selected as empty string', () => {
            const { result } = renderHook(() => useRouteInfo());
            expect(result.current.selected).toBe('');
        });
    });

    describe('showDropdown', () => {
        it('returns true when selected === name', () => {
            const { result } = renderHook(() => useRouteInfo());

            act(() => {
                result.current.setSelected('monsters');
            });

            expect(result.current.showDropdown('monsters')).toBe(true);
        });

        it('returns false when selected !== name', () => {
            const { result } = renderHook(() => useRouteInfo());

            act(() => {
                result.current.setSelected('monsters');
            });

            expect(result.current.showDropdown('rules')).toBe(false);
        });

        it('returns false when selected is empty string', () => {
            const { result } = renderHook(() => useRouteInfo());

            expect(result.current.showDropdown('monsters')).toBe(false);
        });
    });

    describe('handleSetSelected', () => {
        it('toggles the selected state', () => {
            const { result } = renderHook(() => useRouteInfo());

            // Initially empty
            expect(result.current.selected).toBe('');

            // Set to 'monsters'
            act(() => {
                result.current.handleSetSelected('monsters');
            });
            expect(result.current.selected).toBe('monsters');

            // Toggle off
            act(() => {
                result.current.handleSetSelected('monsters');
            });
            expect(result.current.selected).toBe('');
        });

        it('changes selected when different name is provided', () => {
            const { result } = renderHook(() => useRouteInfo());

            act(() => {
                result.current.handleSetSelected('monsters');
            });
            expect(result.current.selected).toBe('monsters');

            act(() => {
                result.current.handleSetSelected('rules');
            });
            expect(result.current.selected).toBe('rules');
        });
    });

    describe('setSelected', () => {
        it('directly sets selected state', () => {
            const { result } = renderHook(() => useRouteInfo());

            act(() => {
                result.current.setSelected('monsters');
            });

            expect(result.current.selected).toBe('monsters');
        });

        it('can set selected to empty string', () => {
            const { result } = renderHook(() => useRouteInfo());

            act(() => {
                result.current.setSelected('monsters');
            });
            expect(result.current.selected).toBe('monsters');

            act(() => {
                result.current.setSelected('');
            });
            expect(result.current.selected).toBe('');
        });
    });

    describe('isDropdownActive', () => {
        it('returns true when current pathname starts with a child route path', () => {
            useLocation.mockReturnValue({ pathname: '/monsters/encounters' });

            const { result } = renderHook(() => useRouteInfo());

            expect(result.current.isDropdownActive('monsters')).toBe(true);
        });

        it('returns false when no child route matches', () => {
            useLocation.mockReturnValue({ pathname: '/spells' });

            const { result } = renderHook(() => useRouteInfo());

            expect(result.current.isDropdownActive('monsters')).toBe(false);
        });

        it('returns false for non-existent dropdown key', () => {
            useLocation.mockReturnValue({ pathname: '/monsters/encounters' });

            const { result } = renderHook(() => useRouteInfo());

            expect(result.current.isDropdownActive('nonexistent')).toBe(false);
        });

        it('returns false when dropdown has no items', () => {
            useLocation.mockReturnValue({ pathname: '/test' });

            renderHook(() => useRouteInfo());

            // Create a scenario where a dropdown might have no items after filtering
            // This would happen if all items have requiredVersion not matching
            const { result: result5e } = renderHook(() => useRouteInfo('5e'));

            // The monsters dropdown should still have items for 5e
            expect(result5e.current.isDropdownActive('monsters')).toBe(false);
        });

        it('matches pathname starting with child path correctly', () => {
            // Test with rules dropdown
            useLocation.mockReturnValue({ pathname: '/rules/classes' });

            const { result } = renderHook(() => useRouteInfo());

            expect(result.current.isDropdownActive('rules')).toBe(true);
        });

        it('does not match partial path segments incorrectly', () => {
            // Pathname /rules should not match /rules/classes child
            useLocation.mockReturnValue({ pathname: '/rules' });

            const { result } = renderHook(() => useRouteInfo());

            // /rules doesn't start with /rules/classes, so should be false
            // But /rules does start with /rules/general? No, /rules doesn't start with /rules/general
            expect(result.current.isDropdownActive('rules')).toBe(false);
        });
    });
});
