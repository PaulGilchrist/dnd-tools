import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react';
import Races2024 from './Races2024';

const use2024RacesState = { data: [], loading: false };

vi.mock('../../../../data/dataService', () => ({
  use2024Races: vi.fn(() => use2024RacesState),
}));

vi.mock('../../../../data/utils', () => ({
  scrollIntoView: vi.fn(),
}));

vi.mock('../../../../utils/localStorage', () => ({
  LOCAL_STORAGE_KEYS: { RACES_FILTER_2024: 'races-2024-filter' },
  getLocalStorageItem: vi.fn(() => null),
  setLocalStorageItem: vi.fn(),
}));

vi.mock('./RaceItem2024', () => ({
  default: vi.fn(({ race, expand, onExpand }) => (
    <div data-testid={`race-2024-${race?.index}`}>
      <span>{race?.name}</span>
    </div>
  )),
}));

describe('Races2024', () => {
  const mockRaces = [
    { name: 'Human', index: 'human' },
    { name: 'Elf', index: 'elf' },
  ];

  beforeEach(() => {
    use2024RacesState.data = [];
    use2024RacesState.loading = false;
    vi.clearAllMocks();
  });

  const renderWithRouter = (component) =>
    render(<MemoryRouter>{component}</MemoryRouter>);

  it('shows loading message when loading', () => {
    use2024RacesState.loading = true;
    renderWithRouter(<Races2024 />);
    expect(screen.getByText(/Loading 2024 races/)).toBeInTheDocument();
  });

  it('renders page header', async () => {
    await act(async () => {
      use2024RacesState.data = mockRaces;
      renderWithRouter(<Races2024 />);
    });
    expect(screen.getByText('Races')).toBeInTheDocument();
  });

  it('renders race items', async () => {
    await act(async () => {
      use2024RacesState.data = mockRaces;
      renderWithRouter(<Races2024 />);
    });
    expect(screen.getByTestId('race-2024-human')).toBeInTheDocument();
    expect(screen.getByTestId('race-2024-elf')).toBeInTheDocument();
  });
});
