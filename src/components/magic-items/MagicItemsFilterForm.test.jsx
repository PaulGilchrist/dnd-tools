import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MagicItemsFilterForm from './MagicItemsFilterForm';

vi.mock('../../utils/htmlUtils', () => ({
  renderHtmlContent: vi.fn((html) => ({ __html: html }))
}));

describe('MagicItemsFilterForm', () => {
  const defaultFilter = { bookmarked: 'All', attunement: 'All', name: '', rarity: 'All', type: 'All' };
  const mocks = { setFilter: vi.fn(), onFilterChange: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    });

  const renderForm = (filter) =>
    render(
         <MagicItemsFilterForm filter={filter} setFilter={mocks.setFilter} onFilterChange={mocks.onFilterChange} />
       );

  it('renders all form labels', () => {
    renderForm(defaultFilter);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Rarity')).toBeInTheDocument();
    expect(screen.getAllByText('Type')[0]).toBeInTheDocument();
    expect(screen.getByText('Attunement')).toBeInTheDocument();
     });

  it('renders the name input', () => {
    renderForm(defaultFilter);
    const nameInput = screen.getByRole('textbox');
    expect(nameInput).toHaveAttribute('id', 'name');
    expect(nameInput).toHaveAttribute('type', 'text');
    expect(nameInput).toHaveAttribute('maxlength', '50');
    expect(nameInput).toHaveAttribute('pattern', '[A-Za-z ]+');
     });

  it('calls setFilter and onFilterChange when name input changes', () => {
    renderForm(defaultFilter);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'ring' } });
    const expected = { ...defaultFilter, name: 'ring' };
    expect(mocks.setFilter).toHaveBeenCalledWith(expected);
    expect(mocks.onFilterChange).toHaveBeenCalledWith(expected);
    });

  it('preserves other filter values when name changes', () => {
    const filter = { ...defaultFilter, rarity: 'Rare', type: 'Ring' };
    renderForm(filter);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'protection' } });
    expect(mocks.setFilter).toHaveBeenCalledWith({ ...filter, name: 'protection' });
     });

  it('calls setFilter and onFilterChange when rarity select changes', () => {
    renderForm(defaultFilter);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'rare' } });
    const expected = { ...defaultFilter, rarity: 'rare' };
    expect(mocks.setFilter).toHaveBeenCalledWith(expected);
    expect(mocks.onFilterChange).toHaveBeenCalledWith(expected);
   });

  it('calls setFilter and onFilterChange when type select changes', () => {
    renderForm(defaultFilter);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[1], { target: { value: 'Ring' } });
    const expected = { ...defaultFilter, type: 'Ring' };
    expect(mocks.setFilter).toHaveBeenCalledWith(expected);
    expect(mocks.onFilterChange).toHaveBeenCalledWith(expected);
   });

  it('calls setFilter and onFilterChange when attunement select changes', () => {
    renderForm(defaultFilter);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[2], { target: { value: 'Required' } });
    const expected = { ...defaultFilter, attunement: 'Required' };
    expect(mocks.setFilter).toHaveBeenCalledWith(expected);
    expect(mocks.onFilterChange).toHaveBeenCalledWith(expected);
   });

  it('calls setFilter and onFilterChange when bookmarked select changes', () => {
    renderForm(defaultFilter);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[3], { target: { value: 'Bookmarked' } });
    const expected = { ...defaultFilter, bookmarked: 'Bookmarked' };
    expect(mocks.setFilter).toHaveBeenCalledWith(expected);
    expect(mocks.onFilterChange).toHaveBeenCalledWith(expected);
   });

  it('displays the name value in the input', () => {
    renderForm({ ...defaultFilter, name: 'ring of' });
    expect(screen.getByRole('textbox')).toHaveValue('ring of');
   });

  it('displays the rarity value in the select', () => {
    renderForm({ ...defaultFilter, rarity: 'legendary' });
    const selects = screen.getAllByRole('combobox');
    expect(selects[0]).toHaveValue('legendary');
   });

  it('displays the type value in the select', () => {
    renderForm({ ...defaultFilter, type: 'Wondrous item' });
    const selects = screen.getAllByRole('combobox');
    expect(selects[1]).toHaveValue('Wondrous item');
   });

  it('displays the attunement value in the select', () => {
    renderForm({ ...defaultFilter, attunement: 'Not Required' });
    const selects = screen.getAllByRole('combobox');
    expect(selects[2]).toHaveValue('Not Required');
   });

  it('displays the bookmarked value in the select', () => {
    renderForm({ ...defaultFilter, bookmarked: 'Bookmarked' });
    const selects = screen.getAllByRole('combobox');
    expect(selects[3]).toHaveValue('Bookmarked');
   });

  it('renders all rarity options', () => {
    renderForm(defaultFilter);
    const selects = screen.getAllByRole('combobox');
    const values = Array.from(selects[0].options).map((o) => o.value);
    expect(values).toContain('All');
    expect(values).toContain('common');
    expect(values).toContain('uncommon');
    expect(values).toContain('rare');
    expect(values).toContain('very rare');
    expect(values).toContain('legendary');
    });

  it('renders all type options', () => {
    renderForm(defaultFilter);
    const selects = screen.getAllByRole('combobox');
    const values = Array.from(selects[1].options).map((o) => o.value);
    expect(values).toContain('All');
    expect(values).toContain('Armor');
    expect(values).toContain('Potion');
    expect(values).toContain('Ring');
    expect(values).toContain('Scroll');
    expect(values).toContain('Wand');
    expect(values).toContain('Weapon');
    expect(values).toContain('Wondrous item');
    });

  it('renders all attunement options', () => {
    renderForm(defaultFilter);
    const selects = screen.getAllByRole('combobox');
    const values = Array.from(selects[2].options).map((o) => o.value);
    expect(values).toContain('All');
    expect(values).toContain('Required');
    expect(values).toContain('Not Required');
    });

  it('renders all bookmarked options', () => {
    renderForm(defaultFilter);
    const selects = screen.getAllByRole('combobox');
    const values = Array.from(selects[3].options).map((o) => o.value);
    expect(values).toContain('All');
    expect(values).toContain('Bookmarked');
    });

  it('shows error when name is 50 characters', () => {
    renderForm({ ...defaultFilter, name: 'a'.repeat(50) });
    expect(screen.getByText('Name should be less than 50 characters')).toBeInTheDocument();
    });

  it('does not show error when name is less than 50 characters', () => {
    renderForm(defaultFilter);
    expect(screen.queryByText('Name should be less than 50 characters')).not.toBeInTheDocument();
    });

  it('does not show error when name is empty', () => {
    renderForm({ ...defaultFilter, name: '' });
    expect(screen.queryByText('Name should be less than 50 characters')).not.toBeInTheDocument();
    });

  it('adds invalid class when name length is 50 or more', () => {
    renderForm({ ...defaultFilter, name: 'a'.repeat(50) });
    const hasErrorDiv = document.querySelector('.has-error');
    expect(hasErrorDiv).toHaveClass('invalid');
    });

  it('does not add invalid class when name is 49 characters', () => {
    renderForm({ ...defaultFilter, name: 'a'.repeat(49) });
    const div = document.querySelector('.has-error');
    expect(div && !div.classList.contains('invalid')).toBe(true);
    });

  it('does not add invalid class when name is empty', () => {
    renderForm({ ...defaultFilter, name: '' });
    const div = document.querySelector('.has-error');
    expect(div && !div.classList.contains('invalid')).toBe(true);
    });

  it('renders form with filter-form class', () => {
    const { container } = renderForm(defaultFilter);
    expect(container.querySelector('form.filter-form')).toBeInTheDocument();
     });

  it('clears name when empty string is entered', () => {
    renderForm({ ...defaultFilter, name: 'ring' });
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });
    expect(mocks.setFilter).toHaveBeenCalledWith(expect.objectContaining({ name: '' }));
    });

  it('handles filter with missing fields gracefully', () => {
    expect(() => { renderForm({}); }).not.toThrow();
     });

  it('throws when filter is null', () => {
    expect(() => { renderForm(null); }).toThrow();
    });

  it('throws when filter is undefined', () => {
    expect(() => { renderForm(undefined); }).toThrow();
    });
});
