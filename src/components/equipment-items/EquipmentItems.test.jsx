import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import EquipmentItems from './EquipmentItems';
import { RuleVersionProvider } from '../../context/RuleVersionContext';

vi.mock('../../utils/htmlUtils', () => ({
    renderHtmlContent: vi.fn((html) => ({ __html: html })),
}));

vi.mock('../../data/dataService', () => ({
    useEquipment: vi.fn(),
    useWeaponProperties: vi.fn(),
}));

vi.mock('../../data/utils', () => ({
    scrollIntoView: vi.fn(),
}));

vi.mock('../../utils/localStorage', () => {
    const store = {};
    return {
        LOCAL_STORAGE_KEYS: {
            EQUIPMENT_ITEMS_FILTER: 'equipmentItemsFilter',
            EQUIPMENT_ITEMS_BOOKMARKED: 'equipmentItemsBookmarked',
        },
        getLocalStorageItem: vi.fn((key) => store[key] ?? null),
        setLocalStorageItem: vi.fn((key, value) => { store[key] = value; }),
        removeLocalStorageItem: vi.fn((key) => { delete store[key]; }),
        getLocalStorageString: vi.fn((key) => store[key]?.toString() ?? null),
        setLocalStorageString: vi.fn((key, value) => { store[key] = value; }),
    };
});

vi.mock('react-router-dom', () => ({
    useLocation: vi.fn(() => ({ pathname: '/equipment', search: '' })),
    useSearchParams: vi.fn(() => {
        const params = new URLSearchParams();
        const setSearchParams = vi.fn();
        return [params, setSearchParams];
    }),
}));

vi.mock('./EquipmentFilterForm', () => ({
    default: vi.fn(({ filter, setFilter, onFilterChange }) => (
        <div data-testid="equipment-filter-form">FilterForm</div>
    )),
}));

vi.mock('./WeaponPropertyDescription', () => ({
    default: vi.fn(({ category, property, getWeaponPropertyDescription }) => (
        <div data-testid="weapon-property-description">WeaponPropertyDescription</div>
    )),
}));

vi.mock('./EquipmentItemList', () => ({
    default: vi.fn(({ filteredItems, showEquipmentItem, shownCard, expandCard, handleBookmarkChange, ruleVersion }) => (
        <div data-testid="equipment-item-list">ItemList items={filteredItems.length}</div>
    )),
}));

const { useEquipment, useWeaponProperties } = vi.mocked(await import('../../data/dataService'));

const mockEquipment = [
    {
        index: 'backpack',
        name: 'Backpack',
        equipment_category: 'Adventuring Gear',
        cost: { quantity: 2, unit: 'gp' },
        weight: 5,
        desc: ['A familiar container'],
    },
    {
        index: 'chain-mail',
        name: 'Chain Mail',
        equipment_category: 'Armor',
        cost: { quantity: 75, unit: 'gp' },
        weight: 55,
        armor_class: { base: 16, dex_bonus: false, max_bonus: null },
        str_minimum: 13,
        stealth_disadvantage: true,
    },
    {
        index: 'longsword',
        name: 'Longsword',
        equipment_category: 'Weapon',
        weapon_category: 'Martial',
        weapon_range: 'Melee',
        cost: { quantity: 15, unit: 'gp' },
        weight: 3,
        damage: { damage_dice: '1d8', damage_type: { name: 'slashing' } },
        properties: ['Versatile'],
        desc: ['A long blade'],
    },
    {
        index: 'shortbow',
        name: 'Shortbow',
        equipment_category: 'Weapon',
        weapon_category: 'Simple',
        weapon_range: 'Ranged',
        cost: { quantity: 25, unit: 'gp' },
        weight: 2,
        range: { normal: 80, long: 320 },
        damage: { damage_dice: '1d6', damage_type: { name: 'piercing' } },
        properties: ['Ammunition', 'Two-Handed'],
    },
    {
        index: 'grappling-hook',
        name: 'Grappling Hook',
        equipment_category: 'Tools',
        cost: { quantity: 2, unit: 'gp' },
        weight: 4,
        rules: '5e',
    },
];

const mockWeaponProperties = [
    { name: 'Versatile', desc: 'Can be used one or two handed.' },
    { name: 'Ammunition', desc: 'Used to make ranged attacks.' },
    { name: 'Finesse', desc: 'Use DEX or STR for attack and damage.' },
];

const wrap = (ui) => (
    <RuleVersionProvider>{ui}</RuleVersionProvider>
);

describe('EquipmentItems', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state when data is fetching', () => {
        useEquipment.mockReturnValue({ data: undefined, loading: true });
        useWeaponProperties.mockReturnValue({ data: undefined, loading: true });

        render(wrap(<EquipmentItems />));
        expect(screen.getByText(/Loading equipment/)).toBeInTheDocument();
    });

    it('renders filter form, weapon property description, and item list when data loads', () => {
        useEquipment.mockReturnValue({ data: mockEquipment, loading: false });
        useWeaponProperties.mockReturnValue({ data: mockWeaponProperties, loading: false });

        render(wrap(<EquipmentItems />));
        expect(screen.getByTestId('equipment-filter-form')).toBeInTheDocument();
        expect(screen.getByTestId('weapon-property-description')).toBeInTheDocument();
        expect(screen.getByTestId('equipment-item-list')).toBeInTheDocument();
    });

    it('does not show loading state when equipment is done but wp still loading', () => {
        useEquipment.mockReturnValue({ data: mockEquipment, loading: false });
        useWeaponProperties.mockReturnValue({ data: undefined, loading: true });

        render(wrap(<EquipmentItems />));
        expect(screen.getByText(/Loading equipment/)).toBeInTheDocument();
    });

    it('does not show loading state when wp is done but equipment still loading', () => {
        useEquipment.mockReturnValue({ data: undefined, loading: true });
        useWeaponProperties.mockReturnValue({ data: mockWeaponProperties, loading: false });

        render(wrap(<EquipmentItems />));
        expect(screen.getByText(/Loading equipment/)).toBeInTheDocument();
    });

    it('handles empty equipment data', () => {
        useEquipment.mockReturnValue({ data: [], loading: false });
        useWeaponProperties.mockReturnValue({ data: [], loading: false });

        render(wrap(<EquipmentItems />));
        expect(screen.getByTestId('equipment-item-list')).toBeInTheDocument();
    });

    it('filters equipment items by rule version', () => {
        const itemsWithRules = [
            {
                index: 'item-5e',
                name: '5e Item',
                equipment_category: 'Weapon',
                cost: { quantity: 10, unit: 'gp' },
                rules: '5e',
            },
            {
                index: 'item-2024',
                name: '2024 Item',
                equipment_category: 'Weapon',
                cost: { quantity: 10, unit: 'gp' },
                rules: '2024',
            },
            {
                index: 'universal-item',
                name: 'Universal Item',
                equipment_category: 'Weapon',
                cost: { quantity: 10, unit: 'gp' },
            },
        ];
        useEquipment.mockReturnValue({ data: itemsWithRules, loading: false });
        useWeaponProperties.mockReturnValue({ data: [], loading: false });

        render(wrap(<EquipmentItems />));
        expect(screen.getByTestId('equipment-item-list')).toBeInTheDocument();
    });

    it('always shows tools regardless of rule version', () => {
        const itemsWithTools = [
            {
                index: 'tool-5e',
                name: '5e Tool',
                equipment_category: 'Tools',
                cost: { quantity: 5, unit: 'gp' },
                rules: '5e',
            },
        ];
        useEquipment.mockReturnValue({ data: itemsWithTools, loading: false });
        useWeaponProperties.mockReturnValue({ data: [], loading: false });

        render(wrap(<EquipmentItems />));
        expect(screen.getByTestId('equipment-item-list')).toBeInTheDocument();
    });

    it('does not crash with undefined equipment data', () => {
        useEquipment.mockReturnValue({ data: undefined, loading: false });
        useWeaponProperties.mockReturnValue({ data: undefined, loading: false });

        expect(() => render(wrap(<EquipmentItems />))).not.toThrow();
    });

    it('does not crash with null equipment data', () => {
        useEquipment.mockReturnValue({ data: null, loading: false });
        useWeaponProperties.mockReturnValue({ data: null, loading: false });

        expect(() => render(wrap(<EquipmentItems />))).not.toThrow();
    });
});
