import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const useRulesState = { data: [], loading: false };

vi.mock('../../data/dataService', () => ({
  useRules: vi.fn(() => useRulesState),
}));

vi.mock('../../context/RuleVersionContext', () => ({
  useRuleVersion: vi.fn(() => ({ ruleVersion: '5e' })),
}));

vi.mock('./RulesSearch', () => ({
  default: vi.fn(({ rules, ruleVersion }) => (
    <div data-testid="rules-search">
      <span>{rules?.length || 0} rules</span>
      <span data-testid="rule-version">{ruleVersion}</span>
    </div>
  )),
}));

import Rules from './Rules';

describe('Rules', () => {
  const mockRules = [
    { index: 'coins', name: 'Coins' },
    { index: 'falling', name: 'Falling' },
  ];

  beforeEach(() => {
    useRulesState.data = [];
    useRulesState.loading = false;
    vi.clearAllMocks();
  });

  const renderWithRouter = (component) =>
    render(<MemoryRouter>{component}</MemoryRouter>);

  it('shows loading message when loading', () => {
    useRulesState.loading = true;
    renderWithRouter(<Rules />);
    expect(screen.getByText('Loading rules...')).toBeInTheDocument();
  });

  it('renders RulesSearch with rules data', () => {
    useRulesState.data = mockRules;
    renderWithRouter(<Rules />);
    expect(screen.getByTestId('rules-search')).toBeInTheDocument();
    expect(screen.getByText('2 rules')).toBeInTheDocument();
  });

  it('passes ruleVersion to RulesSearch', () => {
    useRulesState.data = mockRules;
    renderWithRouter(<Rules />);
    expect(screen.getByTestId('rule-version').textContent).toBe('5e');
  });
});
