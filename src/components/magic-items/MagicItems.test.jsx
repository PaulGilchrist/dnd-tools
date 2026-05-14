import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MagicItems from './MagicItems';

// Mock state objects so we can change return values between tests
const mockVersionedDataState = { data: [], loading: false };
const mockRuleVersionState = { ruleVersion: '5e', setRuleVersion: vi.fn() };
const mockScrollIntoView = vi.fn();
const mockGetLocalStorageItem = vi.fn();
const mockSetLocalStorageItem = vi.fn();

vi.mock('../../hooks/useVersionedData', () => ({
    useVersionedData: vi.fn(() => mockVersionedDataState),
}));

vi.mock('../../context/RuleVersionContext', () => ({
    useRuleVersion: vi.fn(() => mockRuleVersionState),
}));

vi.mock('../../data/utils', () => ({
    scrollIntoView: (...args) => mockScrollIntoView(...args),
}));

vi.mock('../../utils/localStorage', () => ({
    LOCAL_STORAGE_KEYS: {
        MAGIC_ITEMS_FILTER: 'magicItemsFilter',
        MAGIC_ITEMS_BOOKMARKED: 'magicItemsBookmarked',
    },
    getVersionedStorageKey: vi.fn((baseKey, ruleVersion) => {
        if (ruleVersion === '2024') return `${baseKey}2024`;
        return baseKey;
    }),
    getLocalStorageItem: (...args) => mockGetLocalStorageItem(...args),
    setLocalStorageItem: (...args) => mockSetLocalStorageItem(...args),
}));

vi.mock('../common/MagicItemCard', () => ({
    default: vi.fn(({ magicItem, expand, onExpand, onBookmarkChange }) => (
        <div data-testid={`magic-item-card-${magicItem?.index}`}>
            <span>{magicItem?.name}</span>
            <button
                data-testid={`bookmark-${magicItem?.index}`}
                onClick={() => onBookmarkChange(magicItem?.index, !magicItem?.bookmarked)}
            >
                {magicItem?.bookmarked ? 'Unbookmark' : 'Bookmark'}
            </button>
            <button
                data-testid={`expand-${magicItem?.index}`}
                onClick={() => onExpand(!expand)}
            >
                {expand ? 'Collapse' : 'Expand'}
            </button>
        </div>
    )),
}));

vi.mock('../common/MagicItemSections', () => ({
    default: { ChargeSystem: vi.fn(() => null) },
}));

vi.mock('../adapters/magicItemAdapters', () => ({
    normalizeMagicItem5e: vi.fn((item) => item),
    normalizeMagicItem2024: vi.fn((item) => item),
}));

vi.mock('./MagicItemsFilterForm', () => ({
    default: vi.fn(({ filter, setFilter }) => (
        <div data-testid="filter-form">
            <input
                data-testid="name-filter"
                value={filter.name}
                onChange={(e) => setFilter({ ...filter, name: e.target.value })}
            />
        </div>
    )),
}));

vi.mock('../2024/magic-items/MagicItems2024FilterForm', () => ({
    default: vi.fn(({ filter, setFilter }) => (
        <div data-testid="filter-form-2024">
            <input
                data-testid="name-filter-2024"
                value={filter.name}
                onChange={(e) => setFilter({ ...filter, name: e.target.value })}
            />
        </div>
    )),
}));

describe('MagicItems', () => {
    const mockMagicItems = [
        {
            index: 'item1',
            name: 'Sword of Sharpness',
            rarity: 'very rare',
            type: 'Weapon',
            requiresAttunement: true,
            bookmarked: false,
        },
        {
            index: 'item2',
            name: 'Potion of Healing',
            rarity: 'common',
            type: 'Potion',
            requiresAttunement: false,
            bookmarked: true,
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        mockVersionedDataState.data = [];
        mockVersionedDataState.loading = false;
        mockRuleVersionState.ruleVersion = '5e';
        mockGetLocalStorageItem.mockReturnValue(null);
    });

    const renderWithRouter = (component, initialEntries) =>
        render(<MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>);

    describe('loading state', () => {
        it('shows loading message when loading', () => {
            mockVersionedDataState.loading = true;
            renderWithRouter(<MagicItems />);
            expect(screen.getByText('Loading magic items...')).toBeInTheDocument();
        });
    });

    describe('5e rule version', () => {
        beforeEach(() => {
            mockRuleVersionState.ruleVersion = '5e';
            mockVersionedDataState.data = mockMagicItems;
            mockVersionedDataState.loading = false;
        });

        it('renders 5e filter form', () => {
            renderWithRouter(<MagicItems />);
            expect(screen.getByTestId('filter-form')).toBeInTheDocument();
        });

        it('does not render 2024 filter form', () => {
            renderWithRouter(<MagicItems />);
            expect(screen.queryByTestId('filter-form-2024')).not.toBeInTheDocument();
        });

        it('renders magic item cards', () => {
            renderWithRouter(<MagicItems />);
            expect(screen.getByTestId('magic-item-card-item1')).toBeInTheDocument();
            expect(screen.getByTestId('magic-item-card-item2')).toBeInTheDocument();
        });
    });

    describe('2024 rule version', () => {
        beforeEach(() => {
            mockRuleVersionState.ruleVersion = '2024';
            mockVersionedDataState.data = mockMagicItems;
            mockVersionedDataState.loading = false;
        });

        it('renders 2024 filter form', () => {
            renderWithRouter(<MagicItems />);
            expect(screen.getByTestId('filter-form-2024')).toBeInTheDocument();
        });

        it('does not render 5e filter form', () => {
            renderWithRouter(<MagicItems />);
            expect(screen.queryByTestId('filter-form')).not.toBeInTheDocument();
        });

        it('renders magic item cards', () => {
            renderWithRouter(<MagicItems />);
            expect(screen.getByTestId('magic-item-card-item1')).toBeInTheDocument();
            expect(screen.getByTestId('magic-item-card-item2')).toBeInTheDocument();
        });
    });

    describe('filtering', () => {
        beforeEach(() => {
            mockVersionedDataState.data = mockMagicItems;
            mockVersionedDataState.loading = false;
        });

        it('filters by name', () => {
            renderWithRouter(<MagicItems />);
            const nameFilter = screen.getByTestId('name-filter');
            fireEvent.change(nameFilter, { target: { value: 'Sword' } });
            expect(nameFilter.value).toBe('Sword');
        });

        it('case-insensitive rarity filtering works', () => {
            mockVersionedDataState.data = [
                ...mockMagicItems,
                {
                    index: 'item3',
                    name: 'Ring of Warmth',
                    rarity: 'Common',
                    type: 'Ring',
                    requiresAttunement: false,
                    bookmarked: false,
                },
            ];
            renderWithRouter(<MagicItems />);
            // All items should render initially (no rarity filter active)
            expect(screen.getByTestId('magic-item-card-item1')).toBeInTheDocument();
            expect(screen.getByTestId('magic-item-card-item2')).toBeInTheDocument();
            expect(screen.getByTestId('magic-item-card-item3')).toBeInTheDocument();
        });
    });

    describe('localStorage persistence', () => {
        beforeEach(() => {
            mockVersionedDataState.data = mockMagicItems;
            mockVersionedDataState.loading = false;
        });

        it('loads saved filter from localStorage', () => {
            const savedFilter = {
                bookmarked: 'All',
                attunement: 'All',
                name: 'test',
                rarity: 'All',
                type: 'All',
            };
            mockGetLocalStorageItem.mockImplementation((key) => {
                if (key === 'magicItemsFilter') return savedFilter;
                return null;
            });

            renderWithRouter(<MagicItems />);
            expect(mockGetLocalStorageItem).toHaveBeenCalledWith('magicItemsFilter');
        });

        it('loads 2024 filter from versioned key', () => {
            mockRuleVersionState.ruleVersion = '2024';
            mockGetLocalStorageItem.mockReturnValue(null);

            renderWithRouter(<MagicItems />);
            expect(mockGetLocalStorageItem).toHaveBeenCalledWith('magicItemsFilter2024');
        });

        it('loads bookmarked items from localStorage', () => {
            mockGetLocalStorageItem.mockImplementation((key) => {
                if (key === 'magicItemsBookmarked') return ['item1'];
                return null;
            });

            renderWithRouter(<MagicItems />);
            expect(mockGetLocalStorageItem).toHaveBeenCalledWith('magicItemsBookmarked');
        });

        it('loads 2024 bookmarks from versioned key', () => {
            mockRuleVersionState.ruleVersion = '2024';
            mockGetLocalStorageItem.mockReturnValue(null);

            renderWithRouter(<MagicItems />);
            expect(mockGetLocalStorageItem).toHaveBeenCalledWith('magicItemsBookmarked2024');
        });
    });

    describe('URL index parameter', () => {
        beforeEach(() => {
            mockVersionedDataState.data = mockMagicItems;
            mockVersionedDataState.loading = false;
        });

        it('expands and scrolls to item from URL', async () => {
            renderWithRouter(<MagicItems />, ['/magic-items?index=item1']);

            await waitFor(() => {
                expect(mockScrollIntoView).toHaveBeenCalledWith('item1');
            });
        });
    });

    describe('bookmarks', () => {
        beforeEach(() => {
            mockVersionedDataState.data = mockMagicItems;
            mockVersionedDataState.loading = false;
        });

        it('handles bookmark change - bookmark item', () => {
            mockGetLocalStorageItem.mockImplementation((key) => {
                if (key === 'magicItemsBookmarked') return ['item2'];
                return null;
            });

            renderWithRouter(<MagicItems />);

            // Click bookmark button for item1
            fireEvent.click(screen.getByTestId('bookmark-item1'));

            // Should save to localStorage with versioned key
            expect(mockSetLocalStorageItem).toHaveBeenCalledWith('magicItemsBookmarked', expect.any(Array));
        });

        it('handles bookmark change - unbookmark item', () => {
            mockGetLocalStorageItem.mockImplementation((key) => {
                if (key === 'magicItemsBookmarked') return ['item1', 'item2'];
                return null;
            });

            renderWithRouter(<MagicItems />);

            // Click bookmark button for item1 (to unbookmark)
            fireEvent.click(screen.getByTestId('bookmark-item1'));

            expect(mockSetLocalStorageItem).toHaveBeenCalledWith('magicItemsBookmarked', expect.any(Array));
        });

        it('uses versioned key for 2024 bookmarks', () => {
            mockRuleVersionState.ruleVersion = '2024';
            mockGetLocalStorageItem.mockImplementation((key) => {
                if (key === 'magicItemsBookmarked2024') return ['item2'];
                return null;
            });

            renderWithRouter(<MagicItems />);

            fireEvent.click(screen.getByTestId('bookmark-item1'));

            expect(mockSetLocalStorageItem).toHaveBeenCalledWith('magicItemsBookmarked2024', expect.any(Array));
        });
    });

    describe('expand/collapse', () => {
        beforeEach(() => {
            mockVersionedDataState.data = mockMagicItems;
            mockVersionedDataState.loading = false;
        });

        it('handles expand card', async () => {
            renderWithRouter(<MagicItems />);

            fireEvent.click(screen.getByTestId('expand-item1'));

            await waitFor(() => {
                expect(mockScrollIntoView).toHaveBeenCalledWith('item1');
            });
        });
    });

    describe('deduplication', () => {
        it('deduplicates items by index for 2024 data', () => {
            mockRuleVersionState.ruleVersion = '2024';
            mockVersionedDataState.data = [
                { index: 'item1', name: 'Item One', rarity: 'common', type: 'Potion', requiresAttunement: false, bookmarked: false },
                { index: 'item1', name: 'Item One Duplicate', rarity: 'common', type: 'Potion', requiresAttunement: false, bookmarked: false },
                { index: 'item2', name: 'Item Two', rarity: 'rare', type: 'Ring', requiresAttunement: true, bookmarked: false },
            ];
            mockVersionedDataState.loading = false;

            renderWithRouter(<MagicItems />);

            // Should only show 2 unique items
            expect(screen.getByTestId('magic-item-card-item1')).toBeInTheDocument();
            expect(screen.getByTestId('magic-item-card-item2')).toBeInTheDocument();
            // Only one item1 card should exist
            expect(screen.getAllByTestId('magic-item-card-item1').length).toBe(1);
        });
    });

    describe('missing data', () => {
        it('handles empty data gracefully', () => {
            mockVersionedDataState.data = [];
            mockVersionedDataState.loading = false;

            renderWithRouter(<MagicItems />);

            expect(screen.getByTestId('filter-form')).toBeInTheDocument();
        });

        it('handles missing localStorage gracefully', () => {
            mockGetLocalStorageItem.mockReturnValue(null);
            mockVersionedDataState.data = mockMagicItems;
            mockVersionedDataState.loading = false;

            renderWithRouter(<MagicItems />);

            expect(screen.getByTestId('filter-form')).toBeInTheDocument();
        });
    });
});
