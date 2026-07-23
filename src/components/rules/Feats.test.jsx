import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const useVersionedDataState = { data: [], loading: false };
const useRuleVersionState = { ruleVersion: '5e', setRuleVersion: vi.fn() };

vi.mock('../../hooks/useVersionedData', () => ({
  useVersionedData: vi.fn(() => useVersionedDataState),
}));

vi.mock('../../context/RuleVersionContext', () => ({
  useRuleVersion: vi.fn(() => useRuleVersionState),
}));

vi.mock('../../data/utils', () => ({
  scrollIntoView: vi.fn(),
}));

vi.mock('../../utils/localStorage', () => ({
  LOCAL_STORAGE_KEYS: { FEAT_FILTER: 'featFilter' },
  getLocalStorageItem: vi.fn(() => null),
  setLocalStorageItem: vi.fn(),
  sanitizeFilter: vi.fn((defaults) => defaults),
}));

vi.mock('../2024/feats/Feat2024', () => ({
  default: vi.fn(({ feat, expand, onExpand }) => (
    <div data-testid={`feat2024-${feat?.name}`}>
      <span>{feat?.name}</span>
      <button onClick={() => onExpand(!expand)}>Toggle</button>
    </div>
  )),
}));

vi.mock('../2024/feats/Feat2024Filter', () => ({
  default: vi.fn(() => <div data-testid="feat2024-filter" />),
}));

vi.mock('./Feat', () => ({
  default: vi.fn(({ feat, expand, onExpand }) => (
    <div data-testid={`feat-${feat?.index}`}>
      <span>{feat?.name}</span>
      <button onClick={() => onExpand(!expand)}>Toggle</button>
    </div>
  )),
}));

import Feats from './Feats';

describe('Feats', () => {
  const mockFeats5e = [
    { index: 'alert', name: 'Alert' },
    { index: 'great-weapon-master', name: 'Great Weapon Master' },
  ];

  const mockFeats2024 = [
    { name: 'Actor', type: 'General Feat' },
    { name: 'Alert', type: 'General Feat' },
  ];

  beforeEach(() => {
    useVersionedDataState.data = [];
    useVersionedDataState.loading = false;
    useRuleVersionState.ruleVersion = '5e';
    vi.clearAllMocks();
  });

  const renderWithRouter = (component) =>
    render(<MemoryRouter>{component}</MemoryRouter>);

  it('shows loading message when loading', () => {
    useVersionedDataState.loading = true;
    renderWithRouter(<Feats />);
    expect(screen.getByText('Loading feats...')).toBeInTheDocument();
  });

  it('renders page header in 5e mode', () => {
    useVersionedDataState.data = mockFeats5e;
    renderWithRouter(<Feats />);
    expect(screen.getByText('Feats')).toBeInTheDocument();
  });

  it('renders all feats in 5e mode', () => {
    useVersionedDataState.data = mockFeats5e;
    renderWithRouter(<Feats />);
    expect(screen.getByText('Alert')).toBeInTheDocument();
    expect(screen.getByText('Great Weapon Master')).toBeInTheDocument();
  });

  it('uses feat index as id in 5e mode', () => {
    useVersionedDataState.data = [{ index: 'alert', name: 'Alert' }];
    renderWithRouter(<Feats />);
    expect(document.getElementById('alert')).toBeInTheDocument();
  });

  it('passes correct props to 5e Feat component', () => {
    useVersionedDataState.data = mockFeats5e;
    renderWithRouter(<Feats />);
    expect(screen.getByTestId('feat-alert')).toBeInTheDocument();
    expect(screen.getByTestId('feat-great-weapon-master')).toBeInTheDocument();
  });

  it('handles feat expansion in 5e mode', () => {
    useVersionedDataState.data = mockFeats5e;
    renderWithRouter(<Feats />);
    const toggleButtons = screen.getAllByText('Toggle');
    fireEvent.click(toggleButtons[0]);
    expect(screen.getByTestId('feat-alert')).toBeInTheDocument();
  });

  it('renders 2024 feats when ruleVersion is 2024', () => {
    useRuleVersionState.ruleVersion = '2024';
    useVersionedDataState.data = mockFeats2024;
    renderWithRouter(<Feats />);
    expect(screen.getByText('Actor')).toBeInTheDocument();
    expect(screen.getByText('Alert')).toBeInTheDocument();
  });

  it('renders Feat2024Filter when ruleVersion is 2024', () => {
    useRuleVersionState.ruleVersion = '2024';
    useVersionedDataState.data = mockFeats2024;
    renderWithRouter(<Feats />);
    expect(screen.getByTestId('feat2024-filter')).toBeInTheDocument();
  });

  it('uses feat name as id in 2024 mode', () => {
    useRuleVersionState.ruleVersion = '2024';
    useVersionedDataState.data = [{ name: 'Actor', type: 'General Feat' }];
    renderWithRouter(<Feats />);
    expect(document.getElementById('Actor')).toBeInTheDocument();
  });

  it('passes correct props to Feat2024 component', () => {
    useRuleVersionState.ruleVersion = '2024';
    useVersionedDataState.data = mockFeats2024;
    renderWithRouter(<Feats />);
    expect(screen.getByTestId('feat2024-Actor')).toBeInTheDocument();
    expect(screen.getByTestId('feat2024-Alert')).toBeInTheDocument();
  });
});
