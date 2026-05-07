import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react';
import MagicItems2024 from './MagicItems2024';

const use2024MagicItemsState = { data: [], loading: false };

vi.mock('../../../data/dataService', () => ({
  use2024MagicItems: vi.fn(() => use2024MagicItemsState),
}));

vi.mock('../../../data/utils', () => ({
  scrollIntoView: vi.fn(),
}));

vi.mock('../../../utils/localStorage', () => ({
  LOCAL_STORAGE_KEYS: { MAGIC_ITEMS_FILTER_2024: 'magic-items-2024-filter', MAGIC_ITEMS_BOOKMARKED_2024: 'magic-items-2024-bookmarked' },
  getLocalStorageItem: vi.fn(() => null),
  setLocalStorageItem: vi.fn(),
}));

vi.mock('./MagicItem2024', () => ({
  default: vi.fn(({ item }) => (
    <div data-testid={`magic-item-2024-${item?.index}`}>
      <span>{item?.name}</span>
    </div>
  )),
}));

vi.mock('./MagicItems2024FilterForm', () => ({
  default: vi.fn(() => <div data-testid="magic-items-2024-filter"></div>),
}));

vi.mock('./MagicItems2024List', () => ({
  default: vi.fn(() => <div data-testid="magic-items-2024-list"></div>),
}));

describe('MagicItems2024', () => {
  const mockItems = [
    { index: 'bag-of-holding-2024', name: 'Bag of Holding (2024)', requiresAttunement: true },
    { index: 'potion-of-healing-2024', name: 'Potion of Healing (2024)', requiresAttunement: false },
  ];

  beforeEach(() => {
    use2024MagicItemsState.data = [];
    use2024MagicItemsState.loading = false;
    vi.clearAllMocks();
  });

  const renderWithRouter = (component) =>
    render(<MemoryRouter>{component}</MemoryRouter>);

  it('shows loading message when loading', () => {
    use2024MagicItemsState.loading = true;
    renderWithRouter(<MagicItems2024 />);
    expect(screen.getByText(/Loading magic items/)).toBeInTheDocument();
  });

  it('renders MagicItems2024Filter', async () => {
    await act(async () => {
      use2024MagicItemsState.data = mockItems;
      renderWithRouter(<MagicItems2024 />);
    });
    expect(screen.getByTestId('magic-items-2024-filter')).toBeInTheDocument();
  });

  it('renders MagicItems2024List', async () => {
    await act(async () => {
      use2024MagicItemsState.data = mockItems;
      renderWithRouter(<MagicItems2024 />);
    });
    expect(screen.getByTestId('magic-items-2024-list')).toBeInTheDocument();
  });
});
