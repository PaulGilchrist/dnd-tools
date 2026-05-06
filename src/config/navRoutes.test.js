import { describe, it, expect } from 'vitest';
import navRoutes from './navRoutes';

describe('navRoutes config', () => {
    it('exports an array', () => {
        expect(Array.isArray(navRoutes)).toBe(true);
    });

    it('contains items with type field (link or dropdown)', () => {
        navRoutes.forEach(route => {
            expect(route.type).toBeDefined();
            expect(['link', 'dropdown']).toContain(route.type);
        });
    });

    describe('link items', () => {
        const linkItems = navRoutes.filter(route => route.type === 'link');

        it('have key, label, path, and type: link', () => {
            linkItems.forEach(link => {
                expect(link.key).toBeDefined();
                expect(typeof link.key).toBe('string');
                expect(link.label).toBeDefined();
                expect(typeof link.label).toBe('string');
                expect(link.path).toBeDefined();
                expect(typeof link.path).toBe('string');
                expect(link.type).toBe('link');
            });
        });
    });

    describe('dropdown items', () => {
        const dropdownItems = navRoutes.filter(route => route.type === 'dropdown');

        it('have key, label, type: dropdown, and items array', () => {
            dropdownItems.forEach(dropdown => {
                expect(dropdown.key).toBeDefined();
                expect(typeof dropdown.key).toBe('string');
                expect(dropdown.label).toBeDefined();
                expect(typeof dropdown.label).toBe('string');
                expect(dropdown.type).toBe('dropdown');
                expect(Array.isArray(dropdown.items)).toBe(true);
            });
        });

        it('have items where each has label and path', () => {
            dropdownItems.forEach(dropdown => {
                dropdown.items.forEach(item => {
                    expect(item.label).toBeDefined();
                    expect(typeof item.label).toBe('string');
                    expect(item.path).toBeDefined();
                    expect(typeof item.path).toBe('string');
                });
            });
        });
    });

    describe('conditional items with requiredVersion', () => {
        it('Backgrounds item has requiredVersion: 2024', () => {
            const rulesDropdown = navRoutes.find(route => route.key === 'rules');
            const backgroundsItem = rulesDropdown.items.find(item => item.label === 'Backgrounds');
            expect(backgroundsItem).toBeDefined();
            expect(backgroundsItem.requiredVersion).toBe('2024');
        });

        it('Weapon Mastery item has requiredVersion: 2024', () => {
            const rulesDropdown = navRoutes.find(route => route.key === 'rules');
            const weaponMasteryItem = rulesDropdown.items.find(item => item.label === 'Weapon Mastery');
            expect(weaponMasteryItem).toBeDefined();
            expect(weaponMasteryItem.requiredVersion).toBe('2024');
        });

        it('other items in dropdowns do not have requiredVersion', () => {
            navRoutes.forEach(route => {
                if (route.type === 'dropdown' && route.items) {
                    route.items.forEach(item => {
                        if (item.label !== 'Backgrounds' && item.label !== 'Weapon Mastery') {
                            expect(item.requiredVersion).toBeUndefined();
                        }
                    });
                }
            });
        });
    });

    it('has the expected number of routes', () => {
        expect(navRoutes.length).toBe(7);
    });

    it('has specific link routes', () => {
        const linkKeys = navRoutes
            .filter(route => route.type === 'link')
            .map(route => route.key);
        expect(linkKeys).toContain('equipment');
        expect(linkKeys).toContain('locations');
        expect(linkKeys).toContain('magic-items');
        expect(linkKeys).toContain('names');
        expect(linkKeys).toContain('spells');
    });

    it('has specific dropdown routes', () => {
        const dropdownKeys = navRoutes
            .filter(route => route.type === 'dropdown')
            .map(route => route.key);
        expect(dropdownKeys).toContain('monsters');
        expect(dropdownKeys).toContain('rules');
    });
});
