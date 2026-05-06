import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RulesFilter from './RulesFilter';

describe('RulesFilter', () => {
  const mockFilter = { name: '' };
  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders name input field', () => {
    render(<RulesFilter filter={mockFilter} onFilterChange={mockOnFilterChange} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Filter rules...')).toBeInTheDocument();
  });

  it('displays current filter value', () => {
    const filterWithValue = { name: 'coins' };
    render(<RulesFilter filter={filterWithValue} onFilterChange={mockOnFilterChange} />);
    expect(screen.getByLabelText('Name').value).toBe('coins');
  });

  it('calls onFilterChange when name changes', () => {
    render(<RulesFilter filter={mockFilter} onFilterChange={mockOnFilterChange} />);
    const input = screen.getByLabelText('Name');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith('name', 'test');
  });

  it('calls onFilterChange for any value (validation delegated to parent)', () => {
    render(<RulesFilter filter={mockFilter} onFilterChange={mockOnFilterChange} />);
    const input = screen.getByLabelText('Name');
    const longValue = 'a'.repeat(100);
    fireEvent.change(input, { target: { value: longValue } });
    expect(mockOnFilterChange).toHaveBeenCalledWith('name', longValue);
  });

  it('relies on input maxLength attribute for length limiting', () => {
    render(<RulesFilter filter={mockFilter} onFilterChange={mockOnFilterChange} />);
    const input = screen.getByLabelText('Name');
    expect(input).toHaveAttribute('maxLength', '100');
  });


});
