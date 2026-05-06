import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NameFilterForm from './NameFilterForm';

describe('NameFilterForm', () => {
  const mockFilter = { type: 'Select', index: 'Select', sex: 'Select', used: 'All' };
  const mockSetFilter = vi.fn();
  const mockFilterChanged = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders type select', () => {
    render(<NameFilterForm filter={mockFilter} setFilter={mockSetFilter} filterChanged={mockFilterChanged} />);
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0);
  });

  it('renders used select', () => {
    render(<NameFilterForm filter={mockFilter} setFilter={mockSetFilter} filterChanged={mockFilterChanged} />);
    expect(screen.getAllByText('Used').length).toBeGreaterThan(0);
  });

  it('calls setFilter on type change', () => {
    render(<NameFilterForm filter={mockFilter} setFilter={mockSetFilter} filterChanged={mockFilterChanged} />);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'race' } });
    expect(mockSetFilter).toHaveBeenCalled();
  });

  it('calls filterChanged on index change when type is race', () => {
    const filterWithType = { type: 'race', index: 'Select', sex: 'Select', used: 'All' };
    render(<NameFilterForm filter={filterWithType} setFilter={mockSetFilter} filterChanged={mockFilterChanged} />);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[1], { target: { value: 'elf' } });
    expect(mockFilterChanged).toHaveBeenCalled();
  });

  it('shows sex select only for race type', () => {
    const { unmount } = render(<NameFilterForm filter={mockFilter} setFilter={mockSetFilter} filterChanged={mockFilterChanged} />);
    expect(screen.queryByText('Sex')).not.toBeInTheDocument();
    unmount();

    const filterWithRace = { type: 'race', index: 'Select', sex: 'Select', used: 'All' };
    render(<NameFilterForm filter={filterWithRace} setFilter={mockSetFilter} filterChanged={mockFilterChanged} />);
    expect(screen.getByText('Sex')).toBeInTheDocument();
  });

  it('renders all type options', () => {
    render(<NameFilterForm filter={mockFilter} setFilter={mockSetFilter} filterChanged={mockFilterChanged} />);
    expect(screen.getByText('Building')).toBeInTheDocument();
    expect(screen.getByText('Race')).toBeInTheDocument();
  });

  it('renders all used options', () => {
    render(<NameFilterForm filter={mockFilter} setFilter={mockSetFilter} filterChanged={mockFilterChanged} />);
    expect(screen.getByRole('option', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Available' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Used' })).toBeInTheDocument();
  });
});
