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

  it('does not call onFilterChange when name length >= 100', () => {
    render(<RulesFilter filter={mockFilter} onFilterChange={mockOnFilterChange} />);
    const input = screen.getByLabelText('Name');
    const longValue = 'a'.repeat(100);
    fireEvent.change(input, { target: { value: longValue } });
    expect(mockOnFilterChange).not.toHaveBeenCalled();
  });

  it('shows error when name length >= 100', () => {
    render(<RulesFilter filter={mockFilter} onFilterChange={mockOnFilterChange} />);
    const input = screen.getByLabelText('Name');
    const longValue = 'a'.repeat(100);
    fireEvent.change(input, { target: { value: longValue } });
    expect(screen.getByText('Search text should be less than 100 characters')).toBeInTheDocument();
  });

  it('has maxLength of 100 on input', () => {
    render(<RulesFilter filter={mockFilter} onFilterChange={mockOnFilterChange} />);
    const input = screen.getByLabelText('Name');
    expect(input).toHaveAttribute('maxLength', '100');
  });
});
