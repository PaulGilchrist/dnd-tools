import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EquipmentFilterForm from './EquipmentFilterForm';

vi.mock('../../utils/htmlUtils', () => ({
    renderHtmlContent: vi.fn((html) => ({ __html: html })),
}));

const defaultFilter = {
    category: 'All',
    bookmarked: 'All',
    name: '',
    property: 'All',
    range: 'All',
};

const createProps = (filterOverrides = {}) => ({
    filter: { ...defaultFilter, ...filterOverrides },
    setFilter: vi.fn(),
    onFilterChange: vi.fn(),
});

describe('EquipmentFilterForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
      });

    describe('default rendering', () => {
        it('renders the filter form container', () => {
            render(<EquipmentFilterForm {...createProps()} />);
            expect(document.querySelector('.filter-form')).toBeInTheDocument();
         });

        it('renders name input field', () => {
            render(<EquipmentFilterForm {...createProps()} />);
            expect(screen.getByLabelText('Name')).toBeInTheDocument();
         });

        it('renders category select', () => {
            render(<EquipmentFilterForm {...createProps()} />);
            expect(document.querySelector('select[name="category"]')).toBeInTheDocument();
         });

        it('renders bookmarked select', () => {
            render(<EquipmentFilterForm {...createProps()} />);
            expect(document.querySelector('select[name="bookmarked"]')).toBeInTheDocument();
         });

        it('name input starts with filter.name value', () => {
            render(<EquipmentFilterForm {...createProps({ name: 'sword' })} />);
            expect(screen.getByLabelText('Name')).toHaveValue('sword');
         });

        it('category select defaults to All', () => {
            render(<EquipmentFilterForm {...createProps()} />);
            const categorySelect = document.querySelector('select[name="category"]');
            expect(categorySelect).toHaveValue('All');
         });

        it('bookmarked select defaults to All', () => {
            render(<EquipmentFilterForm {...createProps()} />);
            const bookmarkedSelect = document.querySelector('select[name="bookmarked"]');
            expect(bookmarkedSelect).toHaveValue('All');
         });

        it('property select defaults to All when category is Weapon', () => {
            render(<EquipmentFilterForm {...createProps({ category: 'Weapon' })} />);
            const propertySelect = document.querySelector('select[name="property"]');
            expect(propertySelect).toHaveValue('All');
         });

        it('range select defaults to All when category is Weapon', () => {
            render(<EquipmentFilterForm {...createProps({ category: 'Weapon' })} />);
            const rangeSelect = document.querySelector('select[name="range"]');
            expect(rangeSelect).toHaveValue('All');
         });
      });

    describe('name filter', () => {
        it('calls setFilter and onFilterChange when name changes', () => {
            const props = createProps();
            render(<EquipmentFilterForm {...props} />);
            fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'sword' } });
            expect(props.setFilter).toHaveBeenCalledWith(expect.objectContaining({ name: 'sword' }));
            expect(props.onFilterChange).toHaveBeenCalledWith(expect.objectContaining({ name: 'sword' }));
         });

        it('clears name filter when input is emptied', () => {
            const props = createProps({ name: 'sword' });
            render(<EquipmentFilterForm {...props} />);
            fireEvent.change(screen.getByLabelText('Name'), { target: { value: '' } });
            expect(props.setFilter).toHaveBeenCalledWith(expect.objectContaining({ name: '' }));
         });

        it('shows validation error when name is 50+ characters', () => {
            const longName = 'a'.repeat(50);
            render(<EquipmentFilterForm {...createProps({ name: longName })} />);
            expect(screen.getByText(/Name should be less than 50 characters/)).toBeInTheDocument();
         });

        it('does not show validation error when name is under 50 characters', () => {
            render(<EquipmentFilterForm {...createProps({ name: 'short name' })} />);
            expect(screen.queryByText(/Name should be less than 50 characters/)).not.toBeInTheDocument();
         });

        it('adds invalid class to has-error div when name is 50+ characters', () => {
            const longName = 'a'.repeat(50);
            render(<EquipmentFilterForm {...createProps({ name: longName })} />);
            expect(document.querySelector('.has-error.invalid')).toBeInTheDocument();
         });

        it('does not add invalid class when name is under 50 characters', () => {
            render(<EquipmentFilterForm {...createProps({ name: 'short' })} />);
            expect(document.querySelector('.has-error.invalid')).not.toBeInTheDocument();
         });

        it('calls callbacks with the complete new filter object', () => {
            const props = createProps();
            render(<EquipmentFilterForm {...props} />);
            fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'bow' } });
            const expectedFilter = { ...defaultFilter, name: 'bow' };
            expect(props.setFilter).toHaveBeenCalledWith(expectedFilter);
            expect(props.onFilterChange).toHaveBeenCalledWith(expectedFilter);
         });
      });

    describe('category filter', () => {
        it('calls setFilter and onFilterChange when category changes', () => {
            const props = createProps();
            render(<EquipmentFilterForm {...props} />);
            const categorySelect = document.querySelector('select[name="category"]');
            fireEvent.change(categorySelect, { target: { value: 'Weapon' } });
            expect(props.setFilter).toHaveBeenCalledWith(expect.objectContaining({ category: 'Weapon' }));
            expect(props.onFilterChange).toHaveBeenCalledWith(expect.objectContaining({ category: 'Weapon' }));
         });

        it('contains all category options', () => {
            render(<EquipmentFilterForm {...createProps()} />);
            const select = document.querySelector('select[name="category"]');
            expect(select.options.length).toBe(7);
         });

        it('reflects selected category in the select element', () => {
            render(<EquipmentFilterForm {...createProps({ category: 'Armor' })} />);
            const select = document.querySelector('select[name="category"]');
            expect(select).toHaveValue('Armor');
         });

        it('changes to Mounts and Vehicles category', () => {
            const props = createProps();
            render(<EquipmentFilterForm {...props} />);
            const categorySelect = document.querySelector('select[name="category"]');
            fireEvent.change(categorySelect, { target: { value: 'Mounts and Vehicles' } });
            expect(props.setFilter).toHaveBeenCalledWith(expect.objectContaining({ category: 'Mounts and Vehicles' }));
         });
      });

    describe('weapon-only fields (Range and Property)', () => {
        it('shows range and property selects only when Weapon category is selected', () => {
            render(<EquipmentFilterForm {...createProps({ category: 'Weapon' })} />);
            expect(document.querySelector('select[name="range"]')).toBeInTheDocument();
            expect(document.querySelector('select[name="property"]')).toBeInTheDocument();
         });

        it('does not show range and property selects when category is not Weapon', () => {
            render(<EquipmentFilterForm {...createProps({ category: 'Armor' })} />);
            expect(document.querySelector('select[name="range"]')).not.toBeInTheDocument();
            expect(document.querySelector('select[name="property"]')).not.toBeInTheDocument();
         });

        it('does not show range and property selects when category is All', () => {
            render(<EquipmentFilterForm {...createProps({ category: 'All' })} />);
            expect(document.querySelector('select[name="range"]')).not.toBeInTheDocument();
            expect(document.querySelector('select[name="property"]')).not.toBeInTheDocument();
         });

        it('calls setFilter and onFilterChange when range changes', () => {
            const props = createProps({ category: 'Weapon' });
            render(<EquipmentFilterForm {...props} />);
            fireEvent.change(document.querySelector('select[name="range"]'), { target: { value: 'Melee' } });
            expect(props.setFilter).toHaveBeenCalledWith(expect.objectContaining({ range: 'Melee' }));
            expect(props.onFilterChange).toHaveBeenCalledWith(expect.objectContaining({ range: 'Melee' }));
         });

        it('calls setFilter and onFilterChange when property changes', () => {
            const props = createProps({ category: 'Weapon' });
            render(<EquipmentFilterForm {...props} />);
            fireEvent.change(document.querySelector('select[name="property"]'), { target: { value: 'Finesse' } });
            expect(props.setFilter).toHaveBeenCalledWith(expect.objectContaining({ property: 'Finesse' }));
            expect(props.onFilterChange).toHaveBeenCalledWith(expect.objectContaining({ property: 'Finesse' }));
         });

        it('range select contains All, Melee, and Ranged options', () => {
            render(<EquipmentFilterForm {...createProps({ category: 'Weapon' })} />);
            const select = document.querySelector('select[name="range"]');
            expect(select.options.length).toBe(3);
         });

        it('property select contains all weapon property options', () => {
            render(<EquipmentFilterForm {...createProps({ category: 'Weapon' })} />);
            const select = document.querySelector('select[name="property"]');
            const expectedProperties = [
                 'All', 'Ammunition', 'Finesse', 'Heavy', 'Light',
                 'Loading', 'Monk', 'Reach', 'Thrown', 'Two-Handed', 'Versatile',
             ];
            expect(select.options.length).toBe(expectedProperties.length);
         });

        it('weapon property description is shown when category is Weapon and property is not All', () => {
            render(<EquipmentFilterForm {...createProps({ category: 'Weapon', property: 'Finesse' })} />);
            expect(screen.getByText(/Weapon Property - Finesse/)).toBeInTheDocument();
            expect(document.querySelector('.weapon-property-description')).toBeInTheDocument();
         });

        it('weapon property description is hidden when category is Weapon and property is All', () => {
            render(<EquipmentFilterForm {...createProps({ category: 'Weapon', property: 'All' })} />);
            expect(screen.queryByText(/Weapon Property/)).not.toBeInTheDocument();
         });

        it('weapon property description is hidden when category is not Weapon', () => {
            render(<EquipmentFilterForm {...createProps({ category: 'Armor', property: 'Finesse' })} />);
            expect(screen.queryByText(/Weapon Property/)).not.toBeInTheDocument();
         });
      });

    describe('bookmarked filter', () => {
        it('calls setFilter and onFilterChange when bookmarked changes', () => {
            const props = createProps();
            render(<EquipmentFilterForm {...props} />);
            const bookmarkedSelect = document.querySelector('select[name="bookmarked"]');
            fireEvent.change(bookmarkedSelect, { target: { value: 'Bookmarked' } });
            expect(props.setFilter).toHaveBeenCalledWith(expect.objectContaining({ bookmarked: 'Bookmarked' }));
            expect(props.onFilterChange).toHaveBeenCalledWith(expect.objectContaining({ bookmarked: 'Bookmarked' }));
         });

        it('bookmarked select contains All and Bookmarked options', () => {
            render(<EquipmentFilterForm {...createProps()} />);
            const select = document.querySelector('select[name="bookmarked"]');
            expect(select.options.length).toBe(2);
         });

        it('reflects selected bookmarked filter in the select', () => {
            render(<EquipmentFilterForm {...createProps({ bookmarked: 'Bookmarked' })} />);
            const select = document.querySelector('select[name="bookmarked"]');
            expect(select).toHaveValue('Bookmarked');
         });
      });

    describe('multiple filter changes', () => {
        it('preserves existing filter values when one field changes', () => {
            const props = createProps({ name: 'bow', category: 'Weapon', bookmarked: 'Bookmarked' });
            render(<EquipmentFilterForm {...props} />);
            fireEvent.change(document.querySelector('select[name="range"]'), { target: { value: 'Ranged' } });
            expect(props.setFilter).toHaveBeenCalledWith({
                name: 'bow',
                category: 'Weapon',
                bookmarked: 'Bookmarked',
                property: 'All',
                range: 'Ranged',
             });
         });

        it('multiple sequential changes each trigger separate callbacks', () => {
            const props = createProps();
            render(<EquipmentFilterForm {...props} />);
            fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'sword' } });
            fireEvent.change(document.querySelector('select[name="category"]'), { target: { value: 'Weapon' } });
            expect(props.onFilterChange).toHaveBeenCalledTimes(2);
         });
      });

    describe('edge cases', () => {
        it('handles empty name filter', () => {
            render(<EquipmentFilterForm {...createProps({ name: '' })} />);
            expect(screen.getByLabelText('Name')).toHaveValue('');
         });

        it('handles undefined filter values', () => {
            const props = createProps();
            props.filter = { category: undefined, bookmarked: undefined, name: undefined, property: undefined, range: undefined };
            expect(() => render(<EquipmentFilterForm {...props} />)).not.toThrow();
         });

        it('does not show validation error for empty name', () => {
            render(<EquipmentFilterForm {...createProps({ name: '' })} />);
            expect(screen.queryByText(/Name should be less than 50 characters/)).not.toBeInTheDocument();
         });
      });
});
