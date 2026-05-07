import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react';
import Races from './Races';

const useVersionedDataState = { data: [], loading: false };
const mockRuleVersionState = { ruleVersion: '5e', setRuleVersion: vi.fn() };

vi.mock('../../hooks/useVersionedData', () => ({
  useVersionedData: vi.fn(() => useVersionedDataState),
}));

vi.mock('../../context/RuleVersionContext', () => ({
  useRuleVersion: vi.fn(() => mockRuleVersionState),
}));

vi.mock('../../data/utils', () => ({
  scrollIntoView: vi.fn(),
}));

vi.mock('../../utils/localStorage', () => ({
  LOCAL_STORAGE_KEYS: { RACES_FILTER: 'races-filter' },
  getVersionedStorageKey: vi.fn((key) => key),
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

vi.mock('../2024/rules/races/RaceItem2024', () => ({
  default: vi.fn(({ race, expand, onExpand }) => (
    <div data-testid={`race-2024-${race?.name}`}>
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
    useVersionedDataState.data = [];
    useVersionedDataState.loading = false;
    mockRuleVersionState.ruleVersion = '5e';
    vi.clearAllMocks();
  });

  const renderWithRouter = (component) =>
    render(<MemoryRouter>{component}</MemoryRouter>);

  it('shows loading message when loading', () => {
    useVersionedDataState.loading = true;
    renderWithRouter(<Races />);
    expect(screen.getByText('Loading races...')).toBeInTheDocument();
  });

  it('renders page header', async () => {
    await act(async () => {
      useVersionedDataState.data = mockRaces;
      renderWithRouter(<Races />);
    });
    expect(screen.getByText('Races')).toBeInTheDocument();
  });

  it('renders all races', async () => {
    await act(async () => {
      useVersionedDataState.data = mockRaces;
      renderWithRouter(<Races />);
    });
    expect(screen.getByTestId('race-hill-dwarf')).toBeInTheDocument();
    expect(screen.getByTestId('race-mountain-dwarf')).toBeInTheDocument();
  });

  it('uses race index as id', async () => {
    await act(async () => {
      useVersionedDataState.data = [{ index: 'hill-dwarf', name: 'Hill Dwarf' }];
      renderWithRouter(<Races />);
    });
    expect(document.getElementById('hill-dwarf')).toBeInTheDocument();
  });
});
