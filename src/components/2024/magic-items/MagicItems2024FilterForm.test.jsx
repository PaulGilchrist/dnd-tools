import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MagicItems2024FilterForm from './MagicItems2024FilterForm';

describe('MagicItems2024FilterForm', () => {
    const createFilter = (overrides = {}) => ({
        bookmarked: 'All',
        attunement: 'All',
        name: '',
        rarity: 'All',
        type: 'All',
        ...overrides,
    });

    const mockSetFilter = vi.fn();
    const mockOnFilterChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the filter form with correct class', () => {
        render(
            <MagicItems2024FilterForm
                filter={createFilter()}
                setFilter={mockSetFilter}
                onFilterChange={mockOnFilterChange}
            />
        );
        const form = document.querySelector('.filter-form');
        expect(form).toBeInTheDocument();
    });

    it('renders name input with correct value', () => {
        render(
            <MagicItems2024FilterForm
                filter={createFilter({ name: 'Sword' })}
                setFilter={mockSetFilter}
                onFilterChange={mockOnFilterChange}
            />
        );
        expect(screen.getByLabelText('Name')).toHaveValue('Sword');
    });

    it('shows validation error when name reaches 50 characters', () => {
        const longName = 'a'.repeat(50);
        render(
            <MagicItems2024FilterForm
                filter={createFilter({ name: longName })}
                setFilter={mockSetFilter}
                onFilterChange={mockOnFilterChange}
            />
        );
        expect(screen.getByText('Name should be less than 50 characters')).toBeInTheDocument();
    });

    it('calls setFilter and onFilterChange when name changes', () => {
        render(
            <MagicItems2024FilterForm
                filter={createFilter()}
                setFilter={mockSetFilter}
                onFilterChange={mockOnFilterChange}
            />
        );
        const nameInput = screen.getByLabelText('Name');
        fireEvent.change(nameInput, { target: { value: 'Sword' } });
        expect(mockSetFilter).toHaveBeenCalled();
        expect(mockOnFilterChange).toHaveBeenCalled();
    });

    it('renders rarity select with correct options', () => {
        render(
            <MagicItems2024FilterForm
                filter={createFilter()}
                setFilter={mockSetFilter}
                onFilterChange={mockOnFilterChange}
            />
        );
        expect(screen.getByText('Rarity')).toBeInTheDocument();
        expect(screen.getByText('Common')).toBeInTheDocument();
        expect(screen.getByText('Legendary')).toBeInTheDocument();
    });

    it('calls setFilter and onFilterChange when rarity changes', () => {
        render(
            <MagicItems2024FilterForm
                filter={createFilter()}
                setFilter={mockSetFilter}
                onFilterChange={mockOnFilterChange}
            />
        );
        const raritySelect = screen.getByText('Rarity').closest('label').nextElementSibling;
        fireEvent.change(raritySelect, { target: { value: 'rare' } });
        expect(mockSetFilter).toHaveBeenCalled();
        expect(mockOnFilterChange).toHaveBeenCalled();
    });

    it('renders type select with correct options', () => {
        render(
            <MagicItems2024FilterForm
                filter={createFilter()}
                setFilter={mockSetFilter}
                onFilterChange={mockOnFilterChange}
            />
        );
        expect(screen.getByText('Type')).toBeInTheDocument();
        expect(screen.getByText('Wondrous Item')).toBeInTheDocument();
        expect(screen.getByText('Weapon')).toBeInTheDocument();
    });

    it('calls setFilter and onFilterChange when type changes', () => {
        render(
            <MagicItems2024FilterForm
                filter={createFilter()}
                setFilter={mockSetFilter}
                onFilterChange={mockOnFilterChange}
            />
        );
        const typeSelect = screen.getByText('Type').closest('label').nextElementSibling;
        fireEvent.change(typeSelect, { target: { value: 'Wand' } });
        expect(mockSetFilter).toHaveBeenCalled();
        expect(mockOnFilterChange).toHaveBeenCalled();
    });

    it('renders attunement select with correct options', () => {
        render(
            <MagicItems2024FilterForm
                filter={createFilter()}
                setFilter={mockSetFilter}
                onFilterChange={mockOnFilterChange}
            />
        );
        expect(screen.getByText('Attunement')).toBeInTheDocument();
        expect(screen.getByText('Required')).toBeInTheDocument();
        expect(screen.getByText('Not Required')).toBeInTheDocument();
    });

    it('calls setFilter and onFilterChange when attunement changes', () => {
        render(
            <MagicItems2024FilterForm
                filter={createFilter()}
                setFilter={mockSetFilter}
                onFilterChange={mockOnFilterChange}
            />
        );
        const attunementSelect = screen.getByText('Attunement').closest('label').nextElementSibling;
        fireEvent.change(attunementSelect, { target: { value: 'Required' } });
        expect(mockSetFilter).toHaveBeenCalled();
        expect(mockOnFilterChange).toHaveBeenCalled();
    });

    it('renders bookmarked select with correct options', () => {
        render(
            <MagicItems2024FilterForm
                filter={createFilter()}
                setFilter={mockSetFilter}
                onFilterChange={mockOnFilterChange}
            />
        );
        expect(screen.getByText('Bookmarked', { selector: 'label' })).toBeInTheDocument();
        expect(screen.getByText('Bookmarked', { selector: 'option' })).toBeInTheDocument();
    });

    it('calls setFilter and onFilterChange when bookmarked changes', () => {
        render(
            <MagicItems2024FilterForm
                filter={createFilter()}
                setFilter={mockSetFilter}
                onFilterChange={mockOnFilterChange}
            />
        );
        const bookmarkedSelect = screen.getByText('Bookmarked', { selector: 'label' }).closest('label').nextElementSibling;
        fireEvent.change(bookmarkedSelect, { target: { value: 'Bookmarked' } });
        expect(mockSetFilter).toHaveBeenCalled();
        expect(mockOnFilterChange).toHaveBeenCalled();
    });
});
