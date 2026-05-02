import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

// Mutable state objects - safe because vi.mock factory closes over the same ref
const useMagicItemsState = { data: null, loading: false };
const localStorageCalls = [];
let localStorageCallIndex = 0;

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
   default: vi.fn(function MockFilterForm({ filter }) {
     return <div data-testid="filter-form"><span data-testid="filter-name">{filter?.name || ''}</span></div>;
     })
}));

vi.mock('./MagicItemList', () => ({
   default: vi.fn(function MockItemList({ filteredItems, shownCard }) {
     return (
           <div data-testid="item-list">
             {shownCard && <span data-testid="shown-card">{shownCard}</span>}
             {filteredItems.map((item) => (
               <div key={item.index} data-testid={`item-${item.index}`}>{item.name}</div>
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

describe('MagicItems', () => {
  const mockItems = [
         { index: 'ring-of-protection', name: 'Ring of Protection', type: 'Ring', rarity: 'Rare', requiresAttunement: true, description: 'You have a +1 bonus to AC.' },
         { index: 'potion-of-healing', name: 'Potion of Healing', type: 'Potion', rarity: 'Common', requiresAttunement: false, description: 'When you drink this potion, you regain 2d4 + 2 hit points.' },
         { index: 'wand-of-fireballs', name: 'Wand of Fireballs', type: 'Wand', rarity: 'Very rare', requiresAttunement: true, description: 'This wand has 7 charges.' }
       ];

  beforeEach(() => {
    localStorageCalls.length = 0;
    localStorageCallIndex = 0;
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
    localStorageCalls[3] = null;

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
    localStorageCalls[3] = ['ring-of-protection'];

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
    localStorageCalls[3] = null;
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
    localStorageCalls[3] = [];

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
    localStorageCalls[3] = [];

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
});
