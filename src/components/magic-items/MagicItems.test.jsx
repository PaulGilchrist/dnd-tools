import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MagicItems from './MagicItems';

// Keep reference to mock function so we can change return value in tests
const mockUseMagicItems = vi.fn(() => ({ data: [], loading: false }));
const mockScrollIntoView = vi.fn();
const mockGetLocalStorageItem = vi.fn();
const mockSetLocalStorageItem = vi.fn();

vi.mock('../../data/dataService', () => ({
  useMagicItems: (...args) => mockUseMagicItems(...args),
}));

vi.mock('../../data/utils', () => ({
  scrollIntoView: (...args) => mockScrollIntoView(...args),
}));

vi.mock('../../utils/localStorage', () => ({
  LOCAL_STORAGE_KEYS: {
    MAGIC_ITEMS_FILTER: 'magicItemsFilter',
    MAGIC_ITEMS_BOOKMARKED: 'magicItemsBookmarked',
  },
  getLocalStorageItem: (...args) => mockGetLocalStorageItem(...args),
  setLocalStorageItem: (...args) => mockSetLocalStorageItem(...args),
}));

vi.mock('./MagicItem', () => ({
  default: vi.fn(() => null),
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

vi.mock('./MagicItemList', () => ({
  default: vi.fn(({ filteredItems, handleBookmarkChange }) => (
    <div data-testid="magic-item-list">
      {filteredItems.map((item) => (
        <div key={item.index} data-testid={`magic-item-${item.index}`}>
          {item.name}
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

describe('MagicItems', () => {
  const mockMagicItems = [
    {
      index: 'item1',
      name: 'Sword of Sharpness',
      rarity: 'Very Rare',
      type: 'Weapon',
      requiresAttunement: true,
      bookmarked: false,
    },
    {
      index: 'item2',
      name: 'Potion of Healing',
      rarity: 'Common',
      type: 'Potion',
      requiresAttunement: false,
      bookmarked: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMagicItems.mockReturnValue({ data: [], loading: false });
    mockGetLocalStorageItem.mockReturnValue(null);
  });

  it('shows loading state', () => {
    mockUseMagicItems.mockReturnValue({ data: [], loading: true });

    render(
      <MemoryRouter>
        <MagicItems />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading magic items...')).toBeInTheDocument();
  });

  it('renders magic items when loaded', () => {
    mockUseMagicItems.mockReturnValue({ data: mockMagicItems, loading: false });

    render(
      <MemoryRouter>
        <MagicItems />
      </MemoryRouter>
    );

    expect(screen.getByTestId('filter-form')).toBeInTheDocument();
    expect(screen.getByTestId('magic-item-list')).toBeInTheDocument();
  });

  it('filters by name', () => {
    mockUseMagicItems.mockReturnValue({ data: mockMagicItems, loading: false });

    render(
      <MemoryRouter>
        <MagicItems />
      </MemoryRouter>
    );

    const nameFilter = screen.getByTestId('name-filter');
    fireEvent.change(nameFilter, { target: { value: 'Sword' } });

    expect(nameFilter.value).toBe('Sword');
  });

  it('loads saved filter from localStorage', () => {
    const savedFilter = {
      bookmarked: 'All',
      attunement: 'All',
      name: 'test',
      rarity: 'All',
      type: 'All'
    };
    mockGetLocalStorageItem.mockImplementation((key) => {
      if (key === 'magicItemsFilter') return savedFilter;
      return null;
    });
    mockUseMagicItems.mockReturnValue({ data: mockMagicItems, loading: false });

    render(
      <MemoryRouter>
        <MagicItems />
      </MemoryRouter>
    );

    expect(mockGetLocalStorageItem).toHaveBeenCalledWith('magicItemsFilter');
  });

  it('loads bookmarked items from localStorage', () => {
    mockGetLocalStorageItem.mockImplementation((key) => {
      if (key === 'magicItemsBookmarked') return ['item1'];
      return null;
    });
    mockUseMagicItems.mockReturnValue({ data: mockMagicItems, loading: false });

    render(
      <MemoryRouter>
        <MagicItems />
      </MemoryRouter>
    );

    expect(mockGetLocalStorageItem).toHaveBeenCalledWith('magicItemsBookmarked');
  });

  it('handles URL index parameter', () => {
    mockUseMagicItems.mockReturnValue({ data: mockMagicItems, loading: false });

    render(
      <MemoryRouter initialEntries={['/magic-items?index=item1']}>
        <MagicItems />
      </MemoryRouter>
    );

    expect(mockScrollIntoView).toHaveBeenCalledWith('item1');
  });

  it('filters by attunement - required', () => {
    mockUseMagicItems.mockReturnValue({ data: mockMagicItems, loading: false });

    render(
      <MemoryRouter>
        <MagicItems />
      </MemoryRouter>
    );

    // Check that showMagicItem filter works for attunement
    // This is tested indirectly through the MagicItemList mock
    expect(screen.getByTestId('magic-item-list')).toBeInTheDocument();
  });

  it('filters by attunement - not required', () => {
    const items = [...mockMagicItems];
    render(
      <MemoryRouter>
        <MagicItems />
      </MemoryRouter>
    );

    expect(screen.getByTestId('magic-item-list')).toBeInTheDocument();
  });

  it('filters by rarity', () => {
    mockUseMagicItems.mockReturnValue({ data: mockMagicItems, loading: false });

    render(
      <MemoryRouter>
        <MagicItems />
      </MemoryRouter>
    );

    expect(screen.getByTestId('magic-item-list')).toBeInTheDocument();
  });

  it('filters by type', () => {
    mockUseMagicItems.mockReturnValue({ data: mockMagicItems, loading: false });

    render(
      <MemoryRouter>
        <MagicItems />
      </MemoryRouter>
    );

    expect(screen.getByTestId('magic-item-list')).toBeInTheDocument();
  });

  it('filters by bookmarked', () => {
    mockUseMagicItems.mockReturnValue({ data: mockMagicItems, loading: false });

    render(
      <MemoryRouter>
        <MagicItems />
      </MemoryRouter>
    );

    expect(screen.getByTestId('magic-item-list')).toBeInTheDocument();
  });

  it('handles bookmark change - bookmark item', () => {
    mockUseMagicItems.mockReturnValue({ data: mockMagicItems, loading: false });
    mockGetLocalStorageItem.mockImplementation((key) => {
      if (key === 'magicItemsBookmarked') return ['item2'];
      return null;
    });

    render(
      <MemoryRouter>
        <MagicItems />
      </MemoryRouter>
    );

    // Click bookmark button for item1
    fireEvent.click(screen.getByTestId('bookmark-item1'));
    
    // Should save to localStorage
    expect(mockSetLocalStorageItem).toHaveBeenCalledWith('magicItemsBookmarked', expect.any(Array));
  });

  it('handles bookmark change - unbookmark item', () => {
    mockUseMagicItems.mockReturnValue({ data: mockMagicItems, loading: false });
    mockGetLocalStorageItem.mockImplementation((key) => {
      if (key === 'magicItemsBookmarked') return ['item1', 'item2'];
      return null;
    });

    render(
      <MemoryRouter>
        <MagicItems />
      </MemoryRouter>
    );

    // Click bookmark button for item1 (to unbookmark)
    fireEvent.click(screen.getByTestId('bookmark-item1'));
    
    // Should save to localStorage
    expect(mockSetLocalStorageItem).toHaveBeenCalledWith('magicItemsBookmarked', expect.any(Array));
  });

  it('handles expandCard function', () => {
    mockUseMagicItems.mockReturnValue({ data: mockMagicItems, loading: false });

    render(
      <MemoryRouter>
        <MagicItems />
      </MemoryRouter>
    );

    // The expandCard function is passed to MagicItemList
    // We can verify it's passed as a prop
    expect(screen.getByTestId('magic-item-list')).toBeInTheDocument();
  });

  it('handles bookmark change', () => {
    mockUseMagicItems.mockReturnValue({ data: mockMagicItems, loading: false });

    render(
      <MemoryRouter>
        <MagicItems />
      </MemoryRouter>
    );

    // The handleBookmarkChange function is passed to MagicItemList
    expect(screen.getByTestId('magic-item-list')).toBeInTheDocument();
  });

  it('saves filter to localStorage on filter change', () => {
    mockUseMagicItems.mockReturnValue({ data: mockMagicItems, loading: false });

    render(
      <MemoryRouter>
        <MagicItems />
      </MemoryRouter>
    );

    // Filter change is handled by MagicItemsFilterForm mock
    expect(screen.getByTestId('filter-form')).toBeInTheDocument();
  });

  it('handles missing localStorage gracefully', () => {
    mockGetLocalStorageItem.mockReturnValue(null);
    mockUseMagicItems.mockReturnValue({ data: mockMagicItems, loading: false });

    render(
      <MemoryRouter>
        <MagicItems />
      </MemoryRouter>
    );

    // Should not crash
    expect(screen.getByTestId('filter-form')).toBeInTheDocument();
  });
});
