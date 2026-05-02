import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useSearchParams } from 'react-router-dom';

const useFeatsState = { data: [], loading: false };

vi.mock('../../data/dataService', () => ({
  useFeats: vi.fn(() => useFeatsState),
}));

vi.mock('../../data/utils', () => ({
  scrollIntoView: vi.fn(),
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
  const mockFeats = [
    { index: 'alert', name: 'Alert' },
    { index: 'great-weapon-master', name: 'Great Weapon Master' },
  ];

  beforeEach(() => {
    useFeatsState.data = [];
    useFeatsState.loading = false;
    vi.clearAllMocks();
  });

  const renderWithRouter = (component) =>
    render(<MemoryRouter>{component}</MemoryRouter>);

  it('shows loading message when loading', () => {
    useFeatsState.loading = true;
    renderWithRouter(<Feats />);
    expect(screen.getByText('Loading feats...')).toBeInTheDocument();
  });

  it('renders page header', () => {
    useFeatsState.data = mockFeats;
    renderWithRouter(<Feats />);
    expect(screen.getByText('Feats')).toBeInTheDocument();
  });

  it('renders all feats', () => {
    useFeatsState.data = mockFeats;
    renderWithRouter(<Feats />);
    expect(screen.getByText('Alert')).toBeInTheDocument();
    expect(screen.getByText('Great Weapon Master')).toBeInTheDocument();
  });

  it('uses feat index as id', () => {
    useFeatsState.data = [{ index: 'alert', name: 'Alert' }];
    renderWithRouter(<Feats />);
    expect(document.getElementById('alert')).toBeInTheDocument();
  });

  it('passes correct props to Feat component', () => {
    useFeatsState.data = mockFeats;
    renderWithRouter(<Feats />);
    expect(screen.getByTestId('feat-alert')).toBeInTheDocument();
    expect(screen.getByTestId('feat-great-weapon-master')).toBeInTheDocument();
  });

  it('handles feat expansion', () => {
    useFeatsState.data = mockFeats;
    renderWithRouter(<Feats />);
    const toggleButtons = screen.getAllByText('Toggle');
    fireEvent.click(toggleButtons[0]);
    expect(screen.getByTestId('feat-alert')).toBeInTheDocument();
  });
});
