import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import MagicItems from './MagicItems';

vi.mock('../../utils/htmlUtils', () => ({
  renderHtmlContent: vi.fn((html) => ({ __html: html }))
}));

vi.mock('../../data/dataService', () => ({
  useMagicItems: vi.fn()
}));

vi.mock('../../data/utils', () => ({
  scrollIntoView: vi.fn()
}));

vi.mock('../../utils/localStorage', () => ({
  LOCAL_STORAGE_KEYS: {
    MAGIC_ITEMS_FILTER: 'magicItemsFilter',
    MAGIC_ITEMS_BOOKMARKED: 'magicItemsBookmarked'
   },
  getLocalStorageItem: vi.fn(),
  setLocalStorageItem: vi.fn()
}));

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

describe('MagicItems', () => {
  const mockItems = [
       { index: 'ring-of-protection', name: 'Ring of Protection', type: 'Ring', rarity: 'Rare', requiresAttunement: true, description: 'You have a +1 bonus to AC.' },
       { index: 'potion-of-healing', name: 'Potion of Healing', type: 'Potion', rarity: 'Common', requiresAttunement: false, description: 'When you drink this potion, you regain 2d4 + 2 hit points.' },
       { index: 'wand-of-fireballs', name: 'Wand of Fireballs', type: 'Wand', rarity: 'Very rare', requiresAttunement: true, description: 'This wand has 7 charges.' }
     ];

  beforeEach(() => {
    vi.clearAllMocks();
    });

  it('shows loading state when magicItemsLoading is true', () => {
    require('../../data/dataService').useMagicItems.mockReturnValue({ data: null, loading: true });
    require('../../utils/localStorage').getLocalStorageItem.mockReturnValue(null);

    render(
         <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
       );

    expect(screen.getByText('Loading magic items...')).toBeInTheDocument();
     });

  it('renders filter form and item list when data loads', async () => {
    require('../../data/dataService').useMagicItems.mockReturnValue({ data: mockItems, loading: false });
    require('../../utils/localStorage').getLocalStorageItem.mockReturnValue(null);

    render(
         <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
       );

    await waitFor(() => {
      expect(screen.getByTestId('filter-form')).toBeInTheDocument();
       });
     });

  it('loads saved filter from localStorage on mount', async () => {
    require('../../data/dataService').useMagicItems.mockReturnValue({ data: mockItems, loading: false });
    const ls = require('../../utils/localStorage');
    const savedFilter = { name: 'ring', rarity: 'Rare', type: 'All', attunement: 'All', bookmarked: 'All' };
    ls.getLocalStorageItem.mockReturnValueOnce(savedFilter).mockReturnValueOnce(null);

    render(
         <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
       );

    await waitFor(() => {
      expect(screen.getByTestId('filter-name')).toHaveTextContent('ring');
       });
     });

  it('loads bookmarked items from localStorage', async () => {
    require('../../data/dataService').useMagicItems.mockReturnValue({ data: mockItems, loading: false });
    const ls = require('../../utils/localStorage');
    ls.getLocalStorageItem.mockReturnValueOnce(null).mockReturnValueOnce(['ring-of-protection']);

    render(
         <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
       );

    await waitFor(() => {
      expect(screen.getByTestId('item-list')).toBeInTheDocument();
       });
     });

  it('handles error parsing saved filter gracefully', async () => {
    require('../../data/dataService').useMagicItems.mockReturnValue({ data: mockItems, loading: false });
    require('../../utils/localStorage').getLocalStorageItem.mockReturnValue(null);
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
         <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
       );

    await waitFor(() => {
      expect(screen.getByTestId('item-list')).toBeInTheDocument();
       });
     });

  it('renders without loading message when data is null', async () => {
    require('../../data/dataService').useMagicItems.mockReturnValue({ data: null, loading: false });
    require('../../utils/localStorage').getLocalStorageItem.mockReturnValue(null);

    render(
         <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
       );

    expect(screen.queryByText('Loading magic items...')).not.toBeInTheDocument();
     });

  it('renders without loading message when data is empty array', async () => {
    require('../../data/dataService').useMagicItems.mockReturnValue({ data: [], loading: false });
    require('../../utils/localStorage').getLocalStorageItem.mockReturnValue(null);

    render(
         <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
       );

    expect(screen.queryByText('Loading magic items...')).not.toBeInTheDocument();
     });

  it('renders without loading message when data is undefined', async () => {
    require('../../data/dataService').useMagicItems.mockReturnValue({ data: undefined, loading: false });
    require('../../utils/localStorage').getLocalStorageItem.mockReturnValue(null);

    render(
         <RouterProvider router={createMemoryRouter([{ path: '/', element: <MagicItems /> }])} />
       );

    expect(screen.queryByText('Loading magic items...')).not.toBeInTheDocument();
     });

  it('expands card when URL contains matching index parameter', async () => {
    require('../../data/dataService').useMagicItems.mockReturnValue({ data: mockItems, loading: false });
    require('../../utils/localStorage').getLocalStorageItem.mockReturnValue(null);

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
    require('../../data/dataService').useMagicItems.mockReturnValue({ data: mockItems, loading: false });
    require('../../utils/localStorage').getLocalStorageItem.mockReturnValue(null);

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
