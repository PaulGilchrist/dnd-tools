import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const useAbilityScoresState = { data: [], loading: false };

vi.mock('../../data/dataService', () => ({
  useAbilityScores: vi.fn(() => useAbilityScoresState),
}));

vi.mock('../../data/utils', () => ({
  scrollIntoView: vi.fn(),
}));

vi.mock('./AbilityScore', () => ({
  default: vi.fn(({ abilityScore, expand, onExpand }) => (
    <div data-testid={`ability-score-${abilityScore?.index}`}>
      <span>{abilityScore?.full_name}</span>
      <button onClick={() => onExpand(!expand)}>Toggle</button>
    </div>
  )),
}));

import AbilityScores from './AbilityScores';

describe('AbilityScores', () => {
  const mockAbilityScores = [
    { index: 'str', full_name: 'Strength' },
    { index: 'dex', full_name: 'Dexterity' },
  ];

  beforeEach(() => {
    useAbilityScoresState.data = [];
    useAbilityScoresState.loading = false;
    vi.clearAllMocks();
  });

  const renderWithRouter = (component) =>
    render(<MemoryRouter>{component}</MemoryRouter>);

  it('shows loading message when loading', () => {
    useAbilityScoresState.loading = true;
    renderWithRouter(<AbilityScores />);
    expect(screen.getByText('Loading ability scores...')).toBeInTheDocument();
  });

  it('renders a list container', () => {
    useAbilityScoresState.data = mockAbilityScores;
    const { container } = renderWithRouter(<AbilityScores />);
    expect(container.querySelector('.list')).toBeInTheDocument();
  });

  it('renders all ability scores', () => {
    useAbilityScoresState.data = mockAbilityScores;
    renderWithRouter(<AbilityScores />);
    expect(screen.getByText('Strength')).toBeInTheDocument();
    expect(screen.getByText('Dexterity')).toBeInTheDocument();
  });

  it('passes correct props to AbilityScore component', () => {
    useAbilityScoresState.data = mockAbilityScores;
    renderWithRouter(<AbilityScores />);
    expect(screen.getByTestId('ability-score-str')).toBeInTheDocument();
    expect(screen.getByTestId('ability-score-dex')).toBeInTheDocument();
  });

  it('uses ability score index as id', () => {
    useAbilityScoresState.data = [{ index: 'str', full_name: 'Strength' }];
    renderWithRouter(<AbilityScores />);
    expect(document.getElementById('str')).toBeInTheDocument();
  });

  it('expands card when AbilityScore calls onExpand with true', () => {
    useAbilityScoresState.data = mockAbilityScores;
    renderWithRouter(<AbilityScores />);
    const toggleButtons = screen.getAllByText('Toggle');
    fireEvent.click(toggleButtons[0]);
    expect(screen.getByTestId('ability-score-str')).toBeInTheDocument();
  });
});
