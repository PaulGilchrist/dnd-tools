import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react';
import Conditions from './Conditions';

const useConditionsState = { data: [], loading: false };

vi.mock('../../data/dataService', () => ({
  useConditions: vi.fn(() => useConditionsState),
}));

vi.mock('../../data/utils', () => ({
  scrollIntoView: vi.fn(),
}));

vi.mock('../../context/RuleVersionContext', () => ({
  useRuleVersion: vi.fn(() => ({ ruleVersion: '5e' })),
}));

vi.mock('./ConditionItem', () => ({
  default: vi.fn(({ condition, expand, onExpand, ruleVersion }) => (
    <div data-testid={`condition-${condition?.index}`}>
      <span>{condition?.name}</span>
      <span data-testid="rule-version">{ruleVersion}</span>
      <button onClick={() => onExpand(!expand)}>Toggle</button>
    </div>
  )),
}));

describe('Conditions', () => {
  const mockConditions = [
    { index: 'blinded', name: 'Blinded', rules: '5e' },
    { index: 'charmed', name: 'Charmed', rules: '5e' },
    { index: 'exhaustion', name: 'Exhaustion', rules: '2024' },
  ];

  beforeEach(() => {
    useConditionsState.data = [];
    useConditionsState.loading = false;
    vi.clearAllMocks();
  });

  const renderWithRouter = (component) =>
    render(<MemoryRouter>{component}</MemoryRouter>);

  it('shows loading message when loading', () => {
    useConditionsState.loading = true;
    renderWithRouter(<Conditions />);
    expect(screen.getByText('Loading conditions...')).toBeInTheDocument();
  });

  it('renders page header', async () => {
    await act(async () => {
      useConditionsState.data = mockConditions;
      renderWithRouter(<Conditions />);
    });
    expect(screen.getByText('Conditions')).toBeInTheDocument();
  });

  it('renders all conditions that match ruleVersion', async () => {
    await act(async () => {
      useConditionsState.data = mockConditions;
      renderWithRouter(<Conditions />);
    });
    expect(screen.getByText('Blinded')).toBeInTheDocument();
    expect(screen.getByText('Charmed')).toBeInTheDocument();
  });

  it('filters out conditions that do not match ruleVersion', async () => {
    await act(async () => {
      useConditionsState.data = mockConditions;
      renderWithRouter(<Conditions />);
    });
    expect(screen.queryByText('Exhaustion')).not.toBeInTheDocument();
  });

  it('uses condition index as id', async () => {
    await act(async () => {
      useConditionsState.data = [{ index: 'blinded', name: 'Blinded' }];
      renderWithRouter(<Conditions />);
    });
    expect(document.getElementById('blinded')).toBeInTheDocument();
  });

  it('passes ruleVersion to ConditionItem', async () => {
    await act(async () => {
      useConditionsState.data = mockConditions;
      renderWithRouter(<Conditions />);
    });
    const ruleVersions = screen.getAllByTestId('rule-version');
    ruleVersions.forEach((el) => expect(el.textContent).toBe('5e'));
  });

  it('handles expand when ConditionItem toggles', async () => {
    await act(async () => {
      useConditionsState.data = mockConditions;
      renderWithRouter(<Conditions />);
    });
    const toggleButtons = screen.getAllByText('Toggle');
    fireEvent.click(toggleButtons[0]);
    expect(screen.getAllByTestId('condition-blinded').length).toBeGreaterThan(0);
  });
});
