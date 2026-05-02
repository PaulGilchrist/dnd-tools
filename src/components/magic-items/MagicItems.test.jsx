import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

// Mutable state objects - safe because vi.mock factory closes over the same ref
const useMagicItemsState = { data: null, loading: false };
const localStorageCalls = [];
let localStorageCallIndex = 0;
const filterCallbacks = { setFilter: null, onFilterChange: null };

vi.mock('../../data/dataService', () => ({
  useMagicItems: vi.fn(() => useMagicItemsState),
}));

vi.mock('../../data/utils', () => ({
  scrollIntoView: vi.fn(),
}));

vi.mock('../../utils/localStorage', () => {
  const getLocalStorageItem = vi.fn(() => localStorageCalls[localStorageCallIndex++] || null);
  return {
    LOCAL_STORAGE_KEYS: {
      MAGIC_ITEMS_FILTER: 'magicItemsFilter',
      MAGIC_ITEMS_BOOKMARKED: 'magicItemsBookmarked',
    },
    getLocalStorageItem,
    setLocalStorageItem: vi.fn(),
  };
});

vi.mock('./MagicItemsFilterForm', () => ({
   default: vi.fn(function MockFilterForm({ filter, setFilter, onFilterChange }) {
     filterCallbacks.setFilter = setFilter;
     filterCallbacks.onFilterChange = onFilterChange;
     return (
       <div data-testid="filter-form">
         <span data-testid="filter-name">{filter?.name || ''}</span>
         <span data-testid="filter-rarity">{filter?.rarity || ''}</span>
         <span data-testid="filter-type">{filter?.type || ''}</span>
         <span data-testid="filter-attunement">{filter?.attunement || ''}</span>
         <span data-testid="filter-bookmarked">{filter?.bookmarked || ''}</span>
         <button data-testid="set-filter-name" onClick={() => { setFilter({ ...filter, name: 'ring' }); onFilterChange({ ...filter, name: 'ring' }); }}>set name</button>
         <button data-testid="set-filter-rarity" onClick={() => { setFilter({ ...filter, rarity: 'Rare' }); onFilterChange({ ...filter, rarity: 'Rare' }); }}>set rarity</button>
         <button data-testid="set-filter-type" onClick={() => { setFilter({ ...filter, type: 'Ring' }); onFilterChange({ ...filter, type: 'Ring' }); }}>set type</button>
         <button data-testid="set-filter-attunement" onClick={() => { setFilter({ ...filter, attunement: 'Required' }); onFilterChange({ ...filter, attunement: 'Required' }); }}>set attunement</button>
         <button data-testid="set-filter-bookmarked" onClick={() => { setFilter({ ...filter, bookmarked: 'Yes' }); onFilterChange({ ...filter, bookmarked: 'Yes' }); }}>set bookmarked</button>
       </div>
     );
   })
}));

vi.mock('./MagicItemList', () => ({
   default: vi.fn(function MockItemList({ filteredItems, shownCard, expandCard, handleBookmarkChange }) {
      return (
              <div data-testid="item-list">
                {shownCard && <span data-testid="shown-card">{shownCard}</span>}
                {filteredItems.map((item) => (
                  <div key={item.index} data-testid={`item-${item.index}`}>
                    {item.name}
                    <button data-testid={`expand-${item.index}`} onClick={() => expandCard(item.index, true)}>expand</button>
                    <button data-testid={`collapse-${item.index}`} onClick={() => expandCard(item.index, false)}>collapse</button>
                    <button data-testid={`bookmark-on-${item.index}`} onClick={() => handleBookmarkChange(item.index, true)}>bookmark</button>
                    <button data-testid={`bookmark-off-${item.index}`} onClick={() => handleBookmarkChange(item.index, false)}>unbookmark</button>
                  </div>
                ))}
              </div>
            );
          })
}));

vi.mock('./MagicItem', () => ({
   default: vi.fn(function MockMagicItem({ item }) {
     return <div data-testid={`magic-item-${item?.index}`}>{item?.name}</div>;
     })
}));

import MagicItems from './MagicItems';
import * as localStorageModule from '../../utils/localStorage';

describe('MagicItems', () => {
  const mockItems = [
         { index: 'ring-of-protection', name: 'Ring of Protection', type: 'Ring', rarity: 'Rare', requiresAttunement: true, description: 'You have a +1 bonus to AC.' },
         { index: 'potion-of-healing', name: 'Potion of Healing', type: 'Potion', rarity: 'Common', requiresAttunement: false, description: 'When you drink this potion, you regain 2d4 + 2 hit points.' },
         { index: 'wand-of-fireballs', name: 'Wand of Fireballs', type: 'Wand', rarity: 'Very rare', requiresAttunement: true, description: 'This wand has 7 charges.' }
       ];

  beforeEach(() => {
    localStorageCalls.length = 0;
    localStorageCallIndex = 0;
    filterCallbacks.setFilter = null;
    filterCallbacks.onFilterChange = null;
    });

  afterEach(() => {
    vi.restoreAllMocks();
    });

  it('shows loading state when magicItemsLoading is true', () => {
    useMagicItemsState.data = null;
    useMagicItemsState.loading = true;

    render(
           <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
         );

    expect(screen.getByText('Loading magic items...')).toBeInTheDocument();
       });

  it('renders filter form and item list when data loads', async () => {
    useMagicItemsState.data = mockItems;
    useMagicItemsState.loading = false;
    localStorageCalls[0] = null;

    render(
           <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
         );

    await waitFor(() => {
      expect(screen.getByTestId('filter-form')).toBeInTheDocument();
         });
       });

  it('loads saved filter from localStorage on mount', async () => {
    useMagicItemsState.data = mockItems;
    useMagicItemsState.loading = false;
    localStorageCalls[0] = { name: 'ring', rarity: 'Rare', type: 'All', attunement: 'All', bookmarked: 'All' };
     localStorageCalls[1] = null;

    render(
            <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
           );

    await waitFor(() => {
      expect(screen.getByTestId('filter-name')).toHaveTextContent('ring');
           });
         });

  it('loads bookmarked items from localStorage', async () => {
    useMagicItemsState.data = mockItems;
    useMagicItemsState.loading = false;
    localStorageCalls[0] = null;
    localStorageCalls[1] = ['ring-of-protection'];

    render(
           <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
         );

    await waitFor(() => {
      expect(screen.getByTestId('item-list')).toBeInTheDocument();
         });
       });

  it('handles error parsing saved filter gracefully', async () => {
    useMagicItemsState.data = mockItems;
    useMagicItemsState.loading = false;
    localStorageCalls[0] = 'invalid json';
    localStorageCalls[1] = null;
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
           <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
         );

    await waitFor(() => {
      expect(screen.getByTestId('item-list')).toBeInTheDocument();
         });
       });

  it('renders without loading message when data is null', async () => {
    useMagicItemsState.data = null;
    useMagicItemsState.loading = false;

    render(
           <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
         );

    expect(screen.queryByText('Loading magic items...')).not.toBeInTheDocument();
       });

  it('renders without loading message when data is empty array', async () => {
    useMagicItemsState.data = [];
    useMagicItemsState.loading = false;

    render(
           <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
         );

    expect(screen.queryByText('Loading magic items...')).not.toBeInTheDocument();
       });

  it('renders without loading message when data is undefined', async () => {
    useMagicItemsState.data = undefined;
    useMagicItemsState.loading = false;

    render(
           <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
         );

    expect(screen.queryByText('Loading magic items...')).not.toBeInTheDocument();
       });

  it('expands card when URL contains matching index parameter', async () => {
    useMagicItemsState.data = mockItems;
    useMagicItemsState.loading = false;
    localStorageCalls[0] = null;
    localStorageCalls[1] = [];

    render(
           <RouterProvider
          router={createMemoryRouter(
               [{ path: '/', element: <MagicItems /> }],
               { initialEntries: ['/?index=ring-of-protection'] }
             )}
           />
         );

    await waitFor(() => {
      expect(screen.getByTestId('shown-card')).toHaveTextContent('ring-of-protection');
         });
       });

  it('does not expand card when URL index does not match any item', async () => {
    useMagicItemsState.data = mockItems;
    useMagicItemsState.loading = false;
    localStorageCalls[0] = null;
    localStorageCalls[1] = [];

    render(
            <RouterProvider
          router={createMemoryRouter(
                [{ path: '/', element: <MagicItems /> }],
                { initialEntries: ['/?index=non-existent'] }
              )}
            />
           );

    expect(screen.queryByTestId('shown-card')).not.toBeInTheDocument();
         });

  // ----- Filtering tests -----

  it('filters by name (case insensitive)', async () => {
    useMagicItemsState.data = mockItems;
    useMagicItemsState.loading = false;
    localStorageCalls[0] = null;
    localStorageCalls[1] = null;

    render(
            <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
           );

    await waitFor(() => {
      expect(screen.getByTestId('filter-form')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('set-filter-name'));

    await waitFor(() => {
      expect(screen.getByTestId('filter-name')).toHaveTextContent('ring');
    });

    await waitFor(() => {
      expect(screen.queryByTestId('item-potion-of-healing')).not.toBeInTheDocument();
      expect(screen.queryByTestId('item-wand-of-fireballs')).not.toBeInTheDocument();
    });
  });

  it('filters by rarity', async () => {
    useMagicItemsState.data = mockItems;
    useMagicItemsState.loading = false;
    localStorageCalls[0] = null;
    localStorageCalls[1] = null;

    render(
            <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
           );

    await waitFor(() => {
      expect(screen.getByTestId('filter-form')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('set-filter-rarity'));

    await waitFor(() => {
      expect(screen.getByTestId('filter-rarity')).toHaveTextContent('Rare');
    });

    await waitFor(() => {
      expect(screen.queryByTestId('item-potion-of-healing')).not.toBeInTheDocument();
      expect(screen.queryByTestId('item-wand-of-fireballs')).not.toBeInTheDocument();
      expect(screen.getByTestId('item-ring-of-protection')).toBeInTheDocument();
    });
  });

  it('filters by type', async () => {
    useMagicItemsState.data = mockItems;
    useMagicItemsState.loading = false;
    localStorageCalls[0] = null;
    localStorageCalls[1] = null;

    render(
            <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
           );

    await waitFor(() => {
      expect(screen.getByTestId('filter-form')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('set-filter-type'));

    await waitFor(() => {
      expect(screen.getByTestId('filter-type')).toHaveTextContent('Ring');
    });

    await waitFor(() => {
      expect(screen.queryByTestId('item-potion-of-healing')).not.toBeInTheDocument();
      expect(screen.queryByTestId('item-wand-of-fireballs')).not.toBeInTheDocument();
      expect(screen.getByTestId('item-ring-of-protection')).toBeInTheDocument();
    });
  });

  it('filters by attunement Required', async () => {
    useMagicItemsState.data = mockItems;
    useMagicItemsState.loading = false;
    localStorageCalls[0] = null;
    localStorageCalls[1] = null;

    render(
            <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
           );

    await waitFor(() => {
      expect(screen.getByTestId('filter-form')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('set-filter-attunement'));

    await waitFor(() => {
      expect(screen.getByTestId('filter-attunement')).toHaveTextContent('Required');
    });

    await waitFor(() => {
      expect(screen.queryByTestId('item-potion-of-healing')).not.toBeInTheDocument();
      expect(screen.getByTestId('item-ring-of-protection')).toBeInTheDocument();
      expect(screen.getByTestId('item-wand-of-fireballs')).toBeInTheDocument();
    });
  });

   it('filters by attunement Not Required', async () => {
     useMagicItemsState.data = mockItems;
     useMagicItemsState.loading = false;
     localStorageCalls[0] = { name: '', rarity: 'All', type: 'All', attunement: 'Not Required', bookmarked: 'All' };
     localStorageCalls[1] = null;

     render(
              <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
             );

     await waitFor(() => {
       expect(screen.queryByTestId('item-ring-of-protection')).not.toBeInTheDocument();
       expect(screen.queryByTestId('item-wand-of-fireballs')).not.toBeInTheDocument();
       expect(screen.getByTestId('item-potion-of-healing')).toBeInTheDocument();
      });
    });

  it('filters by bookmarked', async () => {
    useMagicItemsState.data = mockItems.map(item => ({ ...item, bookmarked: item.index === 'ring-of-protection' }));
    useMagicItemsState.loading = false;
    localStorageCalls[0] = null;
    localStorageCalls[1] = ['ring-of-protection'];

    render(
            <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
           );

    await waitFor(() => {
      expect(screen.getByTestId('item-ring-of-protection')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('set-filter-bookmarked'));

    await waitFor(() => {
      expect(screen.getByTestId('filter-bookmarked')).toHaveTextContent('Yes');
    });

    await waitFor(() => {
      expect(screen.queryByTestId('item-potion-of-healing')).not.toBeInTheDocument();
      expect(screen.queryByTestId('item-wand-of-fireballs')).not.toBeInTheDocument();
      expect(screen.getByTestId('item-ring-of-protection')).toBeInTheDocument();
    });
  });

  // ----- Expand / collapse card tests -----

  it('expands a card and updates URL params', async () => {
    useMagicItemsState.data = mockItems;
    useMagicItemsState.loading = false;
    localStorageCalls[0] = null;
    localStorageCalls[1] = [];

    render(
            <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
           );

    await waitFor(() => {
      expect(screen.getByTestId('item-ring-of-protection')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('expand-ring-of-protection'));

    await waitFor(() => {
      expect(screen.getByTestId('shown-card')).toHaveTextContent('ring-of-protection');
    });
  });

  it('collapses a card and clears URL params', async () => {
    useMagicItemsState.data = mockItems;
    useMagicItemsState.loading = false;
    localStorageCalls[0] = null;
    localStorageCalls[1] = [];

    render(
            <RouterProvider
          router={createMemoryRouter(
                [{ path: '/', element: <MagicItems /> }],
                { initialEntries: ['/?index=ring-of-protection'] }
              )}
            />
           );

    await waitFor(() => {
      expect(screen.getByTestId('shown-card')).toHaveTextContent('ring-of-protection');
    });

     fireEvent.click(screen.getByTestId('collapse-ring-of-protection'));

    await waitFor(() => {
      expect(screen.queryByTestId('shown-card')).not.toBeInTheDocument();
    });
  });

  // ----- Bookmark tests -----

  it('toggles bookmark on an item', async () => {
    const setLocalStorageItemMock = vi.spyOn(localStorageModule, 'setLocalStorageItem').mockImplementation(() => {});

    useMagicItemsState.data = mockItems.map(item => ({ ...item, bookmarked: false }));
    useMagicItemsState.loading = false;
    localStorageCalls[0] = null;
    localStorageCalls[1] = [];

    render(
            <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
           );

    await waitFor(() => {
      expect(screen.getByTestId('item-ring-of-protection')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('bookmark-on-ring-of-protection'));

    await waitFor(() => {
      expect(setLocalStorageItemMock).toHaveBeenCalledWith(
        localStorageModule.LOCAL_STORAGE_KEYS.MAGIC_ITEMS_BOOKMARKED,
        expect.arrayContaining(['ring-of-protection'])
      );
    });

    setLocalStorageItemMock.mockRestore();
  });

  it('removes bookmark from an item', async () => {
    const setLocalStorageItemMock = vi.spyOn(localStorageModule, 'setLocalStorageItem').mockImplementation(() => {});

    useMagicItemsState.data = mockItems.map(item => ({ ...item, bookmarked: true }));
    useMagicItemsState.loading = false;
    localStorageCalls[0] = null;
    localStorageCalls[1] = ['ring-of-protection', 'potion-of-healing'];

    render(
            <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
           );

    await waitFor(() => {
      expect(screen.getByTestId('item-ring-of-protection')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('bookmark-off-ring-of-protection'));

    await waitFor(() => {
      const callArgs = setLocalStorageItemMock.mock.calls.find(
        call => call[0] === localStorageModule.LOCAL_STORAGE_KEYS.MAGIC_ITEMS_BOOKMARKED
      );
      expect(callArgs).toBeDefined();
      expect(callArgs[1]).not.toContain('ring-of-protection');
      expect(callArgs[1]).toContain('potion-of-healing');
    });

    setLocalStorageItemMock.mockRestore();
  });
});
