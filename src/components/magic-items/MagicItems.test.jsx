import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react';
import MagicItems from './MagicItems';

const useMagicItemsState = { data: [], loading: false };

vi.mock('../../data/dataService', () => ({
  useMagicItems: vi.fn(() => useMagicItemsState),
}));

vi.mock('../../data/utils', () => ({
  scrollIntoView: vi.fn(),
}));

vi.mock('../../utils/localStorage', () => ({
  LOCAL_STORAGE_KEYS: { MAGIC_ITEMS_FILTER: 'magic-items-filter', MAGIC_ITEMS_BOOKMARKED: 'magic-items-bookmarked' },
  getLocalStorageItem: vi.fn(() => null),
  setLocalStorageItem: vi.fn(),
}));

vi.mock('./MagicItem', () => ({
  default: vi.fn(({ item, expand, onExpand, onBookmarkChange }) => (
    <div data-testid={`magic-item-${item?.index}`}>
      <span>{item?.name}</span>
    </div>
  )),
}));

vi.mock('./MagicItemsFilterForm', () => ({
  default: vi.fn(() => <div data-testid="magic-items-filter"></div>),
}));

vi.mock('./MagicItemList', () => ({
  default: vi.fn(() => <div data-testid="magic-item-list"></div>),
}));

describe('MagicItems', () => {
  const mockMagicItems = [
    { index: 'bag-of-holding', name: 'Bag of Holding', requiresAttunement: true },
    { index: 'potions-of-healing', name: 'Potion of Healing', requiresAttunement: false },
  ];

  beforeEach(() => {
    useMagicItemsState.data = [];
    useMagicItemsState.loading = false;
    vi.clearAllMocks();
  });

  const renderWithRouter = (component) =>
    render(<MemoryRouter>{component}</MemoryRouter>);

  it('shows loading message when loading', () => {
    useMagicItemsState.loading = true;
    renderWithRouter(<MagicItems />);
    expect(screen.getByText('Loading magic items...')).toBeInTheDocument();
  });

  it('renders MagicItemsFilter', async () => {
    await act(async () => {
      useMagicItemsState.data = mockMagicItems;
      renderWithRouter(<MagicItems />);
    });
    expect(screen.getByTestId('magic-items-filter')).toBeInTheDocument();
  });

  it('renders MagicItemList', async () => {
    await act(async () => {
      useMagicItemsState.data = mockMagicItems;
      renderWithRouter(<MagicItems />);
    });
    expect(screen.getByTestId('magic-item-list')).toBeInTheDocument();
  });
});
