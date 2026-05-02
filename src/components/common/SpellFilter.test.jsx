import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SpellFilter from './SpellFilter';

describe('SpellFilter', () => {
    const createFilter = (overrides = {}) => ({
        name: '',
        class: 'All',
        levelMin: '',
        levelMax: '',
        castingTime: 'All',
        status: 'All',
        ...overrides,
     });

    const mockOnFilterChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockOnFilterChange.mockClear();
     });

    it('renders all form elements', () => {
        render(<SpellFilter filter={createFilter()} />);
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(document.querySelector('select[name="class"]')).toBeInTheDocument();
        expect(screen.getByLabelText('Level Range')).toBeInTheDocument();
        expect(document.querySelector('select[name="castingTime"]')).toBeInTheDocument();
        expect(document.querySelector('select[name="status"]')).toBeInTheDocument();
     });

    it('renders with default filter values', () => {
        const filter = createFilter();
        render(<SpellFilter filter={filter} />);
        expect(screen.getByLabelText('Name')).toHaveValue('');
        expect(document.querySelector('select[name="class"]')).toHaveValue('All');
        expect(document.querySelector('select[name="castingTime"]')).toHaveValue('All');
        expect(document.querySelector('select[name="status"]')).toHaveValue('All');
     });

    it('renders class options', () => {
        render(<SpellFilter filter={createFilter()} />);
        expect(screen.getByText('All')).toBeInTheDocument();
        expect(screen.getByText('Bard')).toBeInTheDocument();
        expect(screen.getByText('Cleric')).toBeInTheDocument();
        expect(screen.getByText('Druid')).toBeInTheDocument();
        expect(screen.getByText('Paladin')).toBeInTheDocument();
        expect(screen.getByText('Ranger')).toBeInTheDocument();
        expect(screen.getByText('Sorcerer')).toBeInTheDocument();
        expect(screen.getByText('Warlock')).toBeInTheDocument();
        expect(screen.getByText('Wizard')).toBeInTheDocument();
     });

    it('renders casting time options', () => {
        render(<SpellFilter filter={createFilter()} />);
        expect(screen.getByText('Action')).toBeInTheDocument();
        expect(screen.getByText('Bonus Action')).toBeInTheDocument();
        expect(screen.getByText('Non-Ritual, Long Cast Time')).toBeInTheDocument();
        expect(screen.getByText('Reaction')).toBeInTheDocument();
        expect(screen.getByText('Ritual')).toBeInTheDocument();
     });

    it('renders status options', () => {
        render(<SpellFilter filter={createFilter()} />);
        expect(screen.getByText('Known')).toBeInTheDocument();
        expect(screen.getByText('Prepared or Known Ritual')).toBeInTheDocument();
     });

    it('calls onFilterChange when name input changes', () => {
        const filter = createFilter();
        render(<SpellFilter filter={filter} onFilterChange={mockOnFilterChange} />);
        const nameInput = screen.getByLabelText('Name');
        fireEvent.change(nameInput, { target: { value: 'Fireball' } });
        expect(mockOnFilterChange).toHaveBeenCalledWith({
             ...filter,
            name: 'Fireball',
         });
     });

    it('calls onFilterChange when class selection changes', () => {
        const filter = createFilter();
        render(<SpellFilter filter={filter} onFilterChange={mockOnFilterChange} />);
        const classSelect = document.querySelector('select[name="class"]');
        fireEvent.change(classSelect, { target: { value: 'Wizard' } });
        expect(mockOnFilterChange).toHaveBeenCalledWith({
             ...filter,
            class: 'Wizard',
         });
     });

    it('calls onFilterChange when levelMin changes', () => {
        const filter = createFilter();
        render(<SpellFilter filter={filter} onFilterChange={mockOnFilterChange} />);
        const levelMinInput = screen.getByLabelText('Level Range');
        fireEvent.change(levelMinInput, { target: { value: '3' } });
        expect(mockOnFilterChange).toHaveBeenCalledWith({
             ...filter,
            levelMin: 3,
         });
     });

    it('calls onFilterChange when levelMax changes', () => {
        const filter = createFilter();
        const { container } = render(<SpellFilter filter={filter} onFilterChange={mockOnFilterChange} />);
        const levelMaxInput = container.querySelector('#levelMax');
        fireEvent.change(levelMaxInput, { target: { value: '5' } });
        expect(mockOnFilterChange).toHaveBeenCalledWith({
             ...filter,
            levelMax: 5,
         });
     });

    it('parses levelMin as integer', () => {
        const filter = createFilter();
        render(<SpellFilter filter={filter} onFilterChange={mockOnFilterChange} />);
        const levelMinInput = screen.getByLabelText('Level Range');
        fireEvent.change(levelMinInput, { target: { value: '4' } });
        expect(mockOnFilterChange).toHaveBeenCalledOnce();
        expect(mockOnFilterChange).toHaveBeenLastCalledWith({
             ...filter,
            levelMin: 4,
         });
     });

    it('defaults levelMin to 0 when empty string is entered', () => {
        const filter = createFilter();
        render(<SpellFilter filter={filter} onFilterChange={mockOnFilterChange} />);
        const levelMinInput = screen.getByLabelText('Level Range');
        fireEvent.change(levelMinInput, { target: { value: '' } });
        expect(mockOnFilterChange).toHaveBeenCalledWith({
             ...filter,
            levelMin: 0,
         });
     });

    it('defaults levelMax to 9 when empty string is entered', () => {
        const filter = createFilter();
        const { container } = render(<SpellFilter filter={filter} onFilterChange={mockOnFilterChange} />);
        const levelMaxInput = container.querySelector('#levelMax');
        fireEvent.change(levelMaxInput, { target: { value: '' } });
        expect(mockOnFilterChange).toHaveBeenCalledWith({
             ...filter,
            levelMax: 9,
         });
     });

    it('calls onFilterChange when castingTime selection changes', () => {
        const filter = createFilter();
        render(<SpellFilter filter={filter} onFilterChange={mockOnFilterChange} />);
        const castingTimeSelect = document.querySelector('select[name="castingTime"]');
        fireEvent.change(castingTimeSelect, { target: { value: 'Ritual' } });
        expect(mockOnFilterChange).toHaveBeenCalledWith({
             ...filter,
            castingTime: 'Ritual',
         });
     });

    it('calls onFilterChange when status selection changes', () => {
        const filter = createFilter();
        render(<SpellFilter filter={filter} onFilterChange={mockOnFilterChange} />);
        const statusSelect = document.querySelector('select[name="status"]');
        fireEvent.change(statusSelect, { target: { value: 'Known' } });
        expect(mockOnFilterChange).toHaveBeenCalledWith({
             ...filter,
            status: 'Known',
         });
     });

    it('does not call onFilterChange when not provided', () => {
        render(<SpellFilter filter={createFilter()} onFilterChange={undefined} />);
        const nameInput = screen.getByLabelText('Name');
        fireEvent.change(nameInput, { target: { value: 'Fireball' } });
        expect(mockOnFilterChange).not.toHaveBeenCalled();
     });

    it('does not show validation error for short name', () => {
        const filter = createFilter({ name: 'Fireball' });
        render(<SpellFilter filter={filter} />);
        expect(screen.queryByText('Name should be less than 50 characters')).not.toBeInTheDocument();
     });

    it('does not show validation error for exactly 49 characters', () => {
        const filter = createFilter({ name: 'a'.repeat(49) });
        render(<SpellFilter filter={filter} />);
        expect(screen.queryByText('Name should be less than 50 characters')).not.toBeInTheDocument();
     });

    it('shows validation error when name is 50 or more characters', () => {
        const filter = createFilter({ name: 'a'.repeat(50) });
        render(<SpellFilter filter={filter} />);
        expect(screen.getByText('Name should be less than 50 characters')).toBeInTheDocument();
     });

    it('adds invalid class when name is 50 or more characters', () => {
        const filter = createFilter({ name: 'a'.repeat(50) });
        const { container } = render(<SpellFilter filter={filter} />);
        const nameWrapper = container.querySelector('.has-error.invalid');
        expect(nameWrapper).toBeInTheDocument();
     });

    it('does not add invalid class when name is less than 50 characters', () => {
        const filter = createFilter({ name: 'Fireball' });
        const { container } = render(<SpellFilter filter={filter} />);
        expect(container.querySelector('.invalid')).not.toBeInTheDocument();
     });

    it('does not show validation error for empty name', () => {
        const filter = createFilter({ name: '' });
        render(<SpellFilter filter={filter} />);
        expect(screen.queryByText('Name should be less than 50 characters')).not.toBeInTheDocument();
     });

    it('reflects name value in input', () => {
        const filter = createFilter({ name: 'Fireball' });
        render(<SpellFilter filter={filter} />);
        expect(screen.getByLabelText('Name')).toHaveValue('Fireball');
     });

    it('reflects class selection in select', () => {
        const filter = createFilter({ class: 'Wizard' });
        render(<SpellFilter filter={filter} />);
        expect(document.querySelector('select[name="class"]')).toHaveValue('Wizard');
     });

    it('reflects levelMin value in input', () => {
        const filter = createFilter({ levelMin: 3 });
        render(<SpellFilter filter={filter} />);
        expect(screen.getByLabelText('Level Range')).toHaveValue(3);
     });

    it('reflects levelMax value in input', () => {
        const filter = createFilter({ levelMax: 5 });
        const { container } = render(<SpellFilter filter={filter} />);
        expect(container.querySelector('#levelMax')).toHaveValue(5);
     });

    it('reflects castingTime selection in select', () => {
        const filter = createFilter({ castingTime: 'Ritual' });
        render(<SpellFilter filter={filter} />);
        expect(document.querySelector('select[name="castingTime"]')).toHaveValue('Ritual');
     });

    it('reflects status selection in select', () => {
        const filter = createFilter({ status: 'Prepared or Known Ritual' });
        render(<SpellFilter filter={filter} />);
        expect(document.querySelector('select[name="status"]')).toHaveValue('Prepared or Known Ritual');
     });

    it('handles undefined filter', () => {
        const { container } = render(<SpellFilter filter={undefined} />);
        expect(container.querySelector('.filter-form')).toBeInTheDocument();
        expect(screen.getByLabelText('Name')).toHaveValue('');
     });

    it('handles null filter', () => {
        const { container } = render(<SpellFilter filter={null} />);
        expect(container.querySelector('.filter-form')).toBeInTheDocument();
     });

    it('handles empty filter object', () => {
        render(<SpellFilter filter={{}} />);
        expect(screen.getByLabelText('Name')).toHaveValue('');
     });

    it('handles filter with only name set', () => {
        const filter = { name: 'Heal' };
        render(<SpellFilter filter={filter} />);
        expect(screen.getByLabelText('Name')).toHaveValue('Heal');
     });

    it('name input has text type and maxlength 50', () => {
        render(<SpellFilter filter={createFilter()} />);
        const nameInput = screen.getByLabelText('Name');
        expect(nameInput).toHaveAttribute('type', 'text');
        expect(nameInput).toHaveAttribute('maxlength', '50');
     });

    it('name input has pattern for letters and spaces only', () => {
        render(<SpellFilter filter={createFilter()} />);
        const nameInput = screen.getByLabelText('Name');
        expect(nameInput).toHaveAttribute('pattern', '[A-Za-z ]+');
     });

    it('levelMin input has number type with min 0 and max 9', () => {
        render(<SpellFilter filter={createFilter()} />);
        const levelMinInput = screen.getByLabelText('Level Range');
        expect(levelMinInput).toHaveAttribute('type', 'number');
        expect(levelMinInput).toHaveAttribute('min', '0');
        expect(levelMinInput).toHaveAttribute('max', '9');
     });

    it('levelMax input has number type with min 0 and max 9', () => {
        const { container } = render(<SpellFilter filter={createFilter()} />);
        const levelMaxInput = container.querySelector('#levelMax');
        expect(levelMaxInput).toHaveAttribute('type', 'number');
        expect(levelMaxInput).toHaveAttribute('min', '0');
        expect(levelMaxInput).toHaveAttribute('max', '9');
     });

    it('does not crash when filter.name is undefined', () => {
        const { container } = render(<SpellFilter filter={{ name: undefined }} onFilterChange={mockOnFilterChange} />);
        expect(container.querySelector('.filter-form')).toBeInTheDocument();
     });

    it('does not crash when filter.class is undefined', () => {
        const { container } = render(<SpellFilter filter={{ class: undefined }} onFilterChange={mockOnFilterChange} />);
        expect(container.querySelector('.filter-form')).toBeInTheDocument();
     });

    it('does not crash when filter.castingTime is undefined', () => {
        const { container } = render(<SpellFilter filter={{ castingTime: undefined }} onFilterChange={mockOnFilterChange} />);
        expect(container.querySelector('.filter-form')).toBeInTheDocument();
     });

    it('does not crash when filter.status is undefined', () => {
        const { container } = render(<SpellFilter filter={{ status: undefined }} onFilterChange={mockOnFilterChange} />);
        expect(container.querySelector('.filter-form')).toBeInTheDocument();
     });
});
