import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react';
import Races from './Races';

const useRacesState = { data: [], loading: false };

vi.mock('../../data/dataService', () => ({
  useRaces: vi.fn(() => useRacesState),
}));

vi.mock('../../data/utils', () => ({
  scrollIntoView: vi.fn(),
}));

vi.mock('../../utils/localStorage', () => ({
  LOCAL_STORAGE_KEYS: { RACES_FILTER: 'races-filter' },
  getLocalStorageItem: vi.fn(() => null),
  setLocalStorageItem: vi.fn(),
}));

vi.mock('./RaceItem', () => ({
  default: vi.fn(({ race, expand, onExpand }) => (
    <div data-testid={`race-${race?.index}`}>
      <span>{race?.name}</span>
      <button onClick={() => onExpand(!expand)}>Toggle</button>
    </div>
  )),
}));

describe('Races', () => {
  const mockRaces = [
    { index: 'hill-dwarf', name: 'Hill Dwarf' },
    { index: 'mountain-dwarf', name: 'Mountain Dwarf' },
  ];

  beforeEach(() => {
    useRacesState.data = [];
    useRacesState.loading = false;
    vi.clearAllMocks();
  });

  const renderWithRouter = (component) =>
    render(<MemoryRouter>{component}</MemoryRouter>);

  it('shows loading message when loading', () => {
    useRacesState.loading = true;
    renderWithRouter(<Races />);
    expect(screen.getByText('Loading races...')).toBeInTheDocument();
  });

  it('renders page header', async () => {
    await act(async () => {
      useRacesState.data = mockRaces;
      renderWithRouter(<Races />);
    });
    expect(screen.getByText('Races')).toBeInTheDocument();
  });

  it('renders all races', async () => {
    await act(async () => {
      useRacesState.data = mockRaces;
      renderWithRouter(<Races />);
    });
    expect(screen.getByTestId('race-hill-dwarf')).toBeInTheDocument();
    expect(screen.getByTestId('race-mountain-dwarf')).toBeInTheDocument();
  });

  it('uses race index as id', async () => {
    await act(async () => {
      useRacesState.data = [{ index: 'hill-dwarf', name: 'Hill Dwarf' }];
      renderWithRouter(<Races />);
    });
    expect(document.getElementById('hill-dwarf')).toBeInTheDocument();
  });
});
