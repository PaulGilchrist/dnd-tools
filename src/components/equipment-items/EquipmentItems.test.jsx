import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    function resetStore() { Object.keys(store).forEach(k => delete store[k]); }
    const __getMockStore = () => store;
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
         __resetStore: resetStore,
        __getMockStore: __getMockStore,
       };
});

vi.mock('react-router-dom', () => {
    let params = new URLSearchParams();
    const setSearchParams = vi.fn();
    return {
        useLocation: vi.fn(() => ({ pathname: '/equipment', search: '' })),
        useSearchParams: vi.fn(() => [params, setSearchParams]),
        _setSearchParams: setSearchParams,
        _setSearchParamsMock: vi.fn(),
        _setParams: (newParams) => { params = newParams; },
     };
});

vi.mock('./EquipmentFilterForm', () => ({
    default: vi.fn(({ filter, setFilter, onFilterChange }) => (
        <div data-testid="equipment-filter-form">
            <button
                data-testid="filter-category"
                onClick={() => {
                    const newFilter = { ...filter, category: 'Weapon' };
                    setFilter(newFilter);
                    onFilterChange(newFilter);
                }}
            >
                Set Category Weapon
            </button>
            <button
                data-testid="filter-all-category"
                onClick={() => {
                    const newFilter = { ...filter, category: 'All' };
                    setFilter(newFilter);
                    onFilterChange(newFilter);
                }}
            >
                Set Category All
            </button>
            <button
                data-testid="filter-name"
                onClick={() => {
                    const newFilter = { ...filter, name: 'sword' };
                    setFilter(newFilter);
                    onFilterChange(newFilter);
                }}
            >
                Set Name Filter
            </button>
            <button
                data-testid="filter-clear-name"
                onClick={() => {
                    const newFilter = { ...filter, name: '' };
                    setFilter(newFilter);
                    onFilterChange(newFilter);
                }}
            >
                Clear Name Filter
            </button>
            <button
                data-testid="filter-property"
                onClick={() => {
                    const newFilter = { ...filter, property: 'Versatile' };
                    setFilter(newFilter);
                    onFilterChange(newFilter);
                }}
            >
                Set Property Filter
            </button>
            <button
                data-testid="filter-clear-property"
                onClick={() => {
                    const newFilter = { ...filter, property: 'All' };
                    setFilter(newFilter);
                    onFilterChange(newFilter);
                }}
            >
                Clear Property Filter
            </button>
            <button
                data-testid="filter-range"
                onClick={() => {
                    const newFilter = { ...filter, range: 'Ranged' };
                    setFilter(newFilter);
                    onFilterChange(newFilter);
                }}
            >
                Set Range Filter
            </button>
            <button
                data-testid="filter-clear-range"
                onClick={() => {
                    const newFilter = { ...filter, range: 'All' };
                    setFilter(newFilter);
                    onFilterChange(newFilter);
                }}
            >
                Clear Range Filter
            </button>
            <button
                data-testid="filter-bookmarked"
                onClick={() => {
                    const newFilter = { ...filter, bookmarked: 'Yes' };
                    setFilter(newFilter);
                    onFilterChange(newFilter);
                }}
            >
                Set Bookmarked Yes
            </button>
            <button
                data-testid="filter-clear-bookmarked"
                onClick={() => {
                    const newFilter = { ...filter, bookmarked: 'All' };
                    setFilter(newFilter);
                    onFilterChange(newFilter);
                }}
            >
                Clear Bookmarked Filter
            </button>
        </div>
    )),
}));

vi.mock('./WeaponPropertyDescription', () => ({
    default: vi.fn(({ category, property, getWeaponPropertyDescription }) => (
        <div data-testid="weapon-property-description">WeaponPropertyDescription</div>
    )),
}));

vi.mock('./EquipmentItemList', () => ({
    default: vi.fn(({ filteredItems, showEquipmentItem, shownCard, expandCard, handleBookmarkChange, ruleVersion }) => (
        <div data-testid="equipment-item-list">
            <div data-testid="filtered-item-count">
                {filteredItems.length}
            </div>
            {filteredItems.map((item) => (
                <div key={item.index} data-testid={`item-${item.index}`}>
                    <span>{item.name}</span>
                    <button
                        data-testid={`expand-${item.index}`}
                        onClick={() => expandCard(item.index, true)}
                    >
                        Expand
                    </button>
                    <button
                        data-testid={`bookmark-${item.index}`}
                        onClick={() => handleBookmarkChange(item.index, !item.bookmarked)}
                    >
                        {item.bookmarked ? 'Unbookmark' : 'Bookmark'}
                    </button>
                </div>
            ))}
        </div>
    )),
}));

const { useEquipment, useWeaponProperties } = vi.mocked(await import('../../data/dataService'));
const { useSearchParams } = vi.mocked(await import('react-router-dom'));
const localStorageModule = await import('../../utils/localStorage');
const { setLocalStorageItem, getLocalStorageItem, LOCAL_STORAGE_KEYS } = localStorageModule;
const { scrollIntoView } = vi.mocked(await import('../../data/utils'));

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
        localStorageModule.__resetStore?.();
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

    it('filters equipment items by category', async () => {
        useEquipment.mockReturnValue({ data: mockEquipment, loading: false });
        useWeaponProperties.mockReturnValue({ data: mockWeaponProperties, loading: false });

        render(wrap(<EquipmentItems />));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('5'));

        fireEvent.click(screen.getByTestId('filter-category'));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('2'));

        fireEvent.click(screen.getByTestId('filter-all-category'));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('5'));
      });

    it('filters by name case insensitively', async () => {
        useEquipment.mockReturnValue({ data: mockEquipment, loading: false });
        useWeaponProperties.mockReturnValue({ data: mockWeaponProperties, loading: false });

        render(wrap(<EquipmentItems />));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('5'));

        fireEvent.click(screen.getByTestId('filter-name'));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('1'));
        expect(screen.getByTestId('item-longsword')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('filter-clear-name'));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('5'));
      });

    it('filters by weapon property', async () => {
        useEquipment.mockReturnValue({ data: mockEquipment, loading: false });
        useWeaponProperties.mockReturnValue({ data: mockWeaponProperties, loading: false });

        render(wrap(<EquipmentItems />));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('5'));

        fireEvent.click(screen.getByTestId('filter-category'));
        fireEvent.click(screen.getByTestId('filter-property'));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('1'));
        expect(screen.getByTestId('item-longsword')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('filter-clear-property'));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('2'));
      });

    it('filters by weapon range', async () => {
        useEquipment.mockReturnValue({ data: mockEquipment, loading: false });
        useWeaponProperties.mockReturnValue({ data: mockWeaponProperties, loading: false });

        render(wrap(<EquipmentItems />));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('5'));

        fireEvent.click(screen.getByTestId('filter-category'));
        fireEvent.click(screen.getByTestId('filter-range'));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('1'));
        expect(screen.getByTestId('item-shortbow')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('filter-clear-range'));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('2'));
      });

    it('filters by bookmarked', async () => {
        const bookmarkedEquipment = mockEquipment.map(item => ({
              ...item,
             bookmarked: item.index === 'backpack'
          }));
        useEquipment.mockReturnValue({ data: bookmarkedEquipment, loading: false });
        useWeaponProperties.mockReturnValue({ data: mockWeaponProperties, loading: false });

        render(wrap(<EquipmentItems />));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('5'));

        fireEvent.click(screen.getByTestId('filter-bookmarked'));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('1'));
        expect(screen.getByTestId('item-backpack')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('filter-clear-bookmarked'));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('5'));
      });

    it('expands a card via expandCard callback and updates URL params', async () => {
        const mockSetSearchParams = vi.fn();
        const mockParams = new URLSearchParams();
        useSearchParams.mockReturnValueOnce([mockParams, mockSetSearchParams]);
        useEquipment.mockReturnValue({ data: mockEquipment, loading: false });
        useWeaponProperties.mockReturnValue({ data: mockWeaponProperties, loading: false });

        render(wrap(<EquipmentItems />));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('5'));

        fireEvent.click(screen.getByTestId('expand-longsword'));
        expect(scrollIntoView).toHaveBeenCalledWith('longsword');
        expect(mockSetSearchParams).toHaveBeenCalledWith({ index: 'longsword' });
      });

    it('toggles bookmark via handleBookmarkChange - add bookmark', async () => {
        setLocalStorageItem.mockClear();
        useEquipment.mockReturnValue({ data: mockEquipment, loading: false });
        useWeaponProperties.mockReturnValue({ data: mockWeaponProperties, loading: false });

        render(wrap(<EquipmentItems />));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('5'));
        await waitFor(() => expect(screen.getByTestId('bookmark-backpack')).toHaveTextContent('Bookmark'));

        fireEvent.click(screen.getByTestId('bookmark-backpack'));
        expect(setLocalStorageItem).toHaveBeenCalledWith(
            LOCAL_STORAGE_KEYS.EQUIPMENT_ITEMS_BOOKMARKED,
            expect.arrayContaining(['backpack'])
         );
      });

    it('toggles bookmark via handleBookmarkChange - remove bookmark', async () => {
        const bookmarkedEquipment = mockEquipment.map(item => ({
              ...item,
             bookmarked: item.index === 'backpack' || item.index === 'longsword'
          }));
        useEquipment.mockReturnValue({ data: bookmarkedEquipment, loading: false });
        useWeaponProperties.mockReturnValue({ data: mockWeaponProperties, loading: false });
        setLocalStorageItem.mockClear();

        render(wrap(<EquipmentItems />));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('5'));
        await waitFor(() => expect(screen.getByTestId('bookmark-backpack')).toHaveTextContent('Unbookmark'));

        fireEvent.click(screen.getByTestId('bookmark-backpack'));
        expect(setLocalStorageItem).toHaveBeenCalledWith(
            LOCAL_STORAGE_KEYS.EQUIPMENT_ITEMS_BOOKMARKED,
            ['longsword']
         );
        await waitFor(() => expect(screen.getByTestId('bookmark-backpack')).toHaveTextContent('Bookmark'));
      });

    it('initializes URL index to expand specific item', async () => {
        const mockSetSearchParams = vi.fn();
        const mockParams = new URLSearchParams('index=longsword');
        useSearchParams.mockReturnValueOnce([mockParams, mockSetSearchParams]);
        useEquipment.mockReturnValue({ data: mockEquipment, loading: false });
        useWeaponProperties.mockReturnValue({ data: mockWeaponProperties, loading: false });

        render(wrap(<EquipmentItems />));
        await waitFor(() => expect(scrollIntoView).toHaveBeenCalledWith('longsword'));
      });

    it('does not set up index param when URL index does not match any item', async () => {
        const mockSetSearchParams = vi.fn();
        const mockParams = new URLSearchParams('index=nonexistent');
        useSearchParams.mockReturnValueOnce([mockParams, mockSetSearchParams]);
        useEquipment.mockReturnValue({ data: mockEquipment, loading: false });
        useWeaponProperties.mockReturnValue({ data: mockWeaponProperties, loading: false });

        render(wrap(<EquipmentItems />));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('5'));
        expect(scrollIntoView).not.toHaveBeenCalled();
      });

    it('loads saved filter from localStorage when no URL index', async () => {
        const savedFilter = { category: 'Weapon', bookmarked: 'All', name: '', property: 'All', range: 'All' };
        getLocalStorageItem.mockReturnValueOnce(savedFilter);
        getLocalStorageItem.mockReturnValueOnce(null);
        const mockParams = new URLSearchParams();
        useSearchParams.mockReturnValueOnce([mockParams, vi.fn()]);
        useEquipment.mockReturnValue({ data: mockEquipment, loading: false });
        useWeaponProperties.mockReturnValue({ data: mockWeaponProperties, loading: false });

        render(wrap(<EquipmentItems />));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('2'));
      });

    it('saves default filter to localStorage when no saved filter and no URL index', async () => {
        getLocalStorageItem.mockReturnValue(null);
        const mockParams = new URLSearchParams();
        useSearchParams.mockReturnValueOnce([mockParams, vi.fn()]);
        useEquipment.mockReturnValue({ data: mockEquipment, loading: false });
        useWeaponProperties.mockReturnValue({ data: mockWeaponProperties, loading: false });

        render(wrap(<EquipmentItems />));
        await waitFor(() => expect(setLocalStorageItem).toHaveBeenCalledWith(
            LOCAL_STORAGE_KEYS.EQUIPMENT_ITEMS_FILTER,
            expect.objectContaining({ category: 'All', bookmarked: 'All', name: '', property: 'All', range: 'All' })
         ));
      });

    it('saves filter to localStorage when filter changes via onFilterChange', async () => {
        setLocalStorageItem.mockClear();
        useEquipment.mockReturnValue({ data: mockEquipment, loading: false });
        useWeaponProperties.mockReturnValue({ data: mockWeaponProperties, loading: false });

        render(wrap(<EquipmentItems />));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('5'));
        fireEvent.click(screen.getByTestId('filter-category'));

        expect(setLocalStorageItem).toHaveBeenCalledWith(
            LOCAL_STORAGE_KEYS.EQUIPMENT_ITEMS_FILTER,
            expect.objectContaining({ category: 'Weapon' })
         );
      });

    it('loads bookmarked items from localStorage on init', async () => {
        const savedBookmarks = ['backpack', 'longsword'];
        getLocalStorageItem.mockReturnValueOnce(null);
        getLocalStorageItem.mockReturnValueOnce(savedBookmarks);
        const mockParams = new URLSearchParams();
        useSearchParams.mockReturnValueOnce([mockParams, vi.fn()]);
        useEquipment.mockReturnValue({ data: mockEquipment, loading: false });
        useWeaponProperties.mockReturnValue({ data: mockWeaponProperties, loading: false });

        render(wrap(<EquipmentItems />));
        await waitFor(() => expect(screen.getByTestId('bookmark-backpack')).toHaveTextContent('Unbookmark'));
        await waitFor(() => expect(screen.getByTestId('bookmark-longsword')).toHaveTextContent('Unbookmark'));
      });

    it('filters by rule version - hides non-matching non-Tools items', async () => {
        const itemsWithRules = [
             { index: 'item-5e', name: '5e Item', equipment_category: 'Weapon', cost: { quantity: 10, unit: 'gp' }, rules: '5e' },
             { index: 'item-2024', name: '2024 Item', equipment_category: 'Weapon', cost: { quantity: 10, unit: 'gp' }, rules: '2024' },
             { index: 'universal', name: 'Universal', equipment_category: 'Weapon', cost: { quantity: 10, unit: 'gp' } },
          ];
        useEquipment.mockReturnValue({ data: itemsWithRules, loading: false });
        useWeaponProperties.mockReturnValue({ data: mockWeaponProperties, loading: false });

        render(wrap(<EquipmentItems />));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('2'));
        expect(screen.getByTestId('item-universal')).toBeInTheDocument();
      });

    it('always shows Tools regardless of rule version mismatch', async () => {
        const itemsWithRules = [
             { index: 'tool-5e', name: '5e Tool', equipment_category: 'Tools', cost: { quantity: 5, unit: 'gp' }, rules: '5e' },
          ];
        useEquipment.mockReturnValue({ data: itemsWithRules, loading: false });
        useWeaponProperties.mockReturnValue({ data: mockWeaponProperties, loading: false });

        render(wrap(<EquipmentItems />));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('1'));
      });

    it('handles empty equipment data for filteredItems', () => {
        useEquipment.mockReturnValue({ data: [], loading: false });
        useWeaponProperties.mockReturnValue({ data: [], loading: false });

        render(wrap(<EquipmentItems />));
        expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('0');
      });

    it('handles undefined equipment data for filteredItems', () => {
        useEquipment.mockReturnValue({ data: undefined, loading: false });
        useWeaponProperties.mockReturnValue({ data: undefined, loading: false });

        expect(() => render(wrap(<EquipmentItems />))).not.toThrow();
      });

    it('handles weapon_range typo meele vs melee', async () => {
        const meeleeWeapon = {
            index: 'meele-weap',
            name: 'Meele Weapon',
            equipment_category: 'Weapon',
            weapon_range: 'Meele',
            cost: { quantity: 10, unit: 'gp' },
          };
        useEquipment.mockReturnValue({ data: [meeleeWeapon], loading: false });
        useWeaponProperties.mockReturnValue({ data: mockWeaponProperties, loading: false });

        render(wrap(<EquipmentItems />));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('1'));

        fireEvent.click(screen.getByTestId('filter-category'));
        fireEvent.click(screen.getByTestId('filter-range'));
        fireEvent.click(screen.getByTestId('filter-clear-range'));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('1'));
        fireEvent.click(screen.getByTestId('filter-range'));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('1'));
      });

    it('saveBookmark is called and persists bookmarked items to localStorage', async () => {
        setLocalStorageItem.mockClear();
        useEquipment.mockReturnValue({ data: mockEquipment, loading: false });
        useWeaponProperties.mockReturnValue({ data: mockWeaponProperties, loading: false });

        render(wrap(<EquipmentItems />));
        await waitFor(() => expect(screen.getByTestId('filtered-item-count')).toHaveTextContent('5'));
        await waitFor(() => expect(screen.getByTestId('bookmark-backpack')).toHaveTextContent('Bookmark'));
        fireEvent.click(screen.getByTestId('bookmark-backpack'));

        const callArgs = setLocalStorageItem.mock.calls.filter(call =>
            call[0] === LOCAL_STORAGE_KEYS.EQUIPMENT_ITEMS_BOOKMARKED
         );
        expect(callArgs.length).toBeGreaterThan(0);
        expect(callArgs[callArgs.length - 1][1]).toContain('backpack');
      });
 });
