import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Feat2024Filter from './Feat2024Filter';

describe('Feat2024Filter', () => {
    const createFilter = (overrides = {}) => ({
        name: '',
        type: 'All',
        repeatable: 'All',
        minLevel: 0,
        abilityScore: 'All',
        ...overrides,
    });

    const mockOnFilterChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the filter form with correct class', () => {
        render(<Feat2024Filter filter={createFilter()} onFilterChange={mockOnFilterChange} />);
        const form = document.querySelector('.filter-form');
        expect(form).toBeInTheDocument();
    });

    it('renders name input with correct value', () => {
        render(<Feat2024Filter filter={createFilter({ name: 'Alert' })} onFilterChange={mockOnFilterChange} />);
        expect(screen.getByLabelText('Name')).toHaveValue('Alert');
    });

    it('calls onFilterChange when name changes', () => {
        render(<Feat2024Filter filter={createFilter()} onFilterChange={mockOnFilterChange} />);
        const nameInput = screen.getByLabelText('Name');
        fireEvent.change(nameInput, { target: { value: 'Alert' } });
        expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ name: 'Alert' }));
    });

    it('renders type select with correct options', () => {
        render(<Feat2024Filter filter={createFilter()} onFilterChange={mockOnFilterChange} />);
        expect(screen.getByLabelText('Type')).toBeInTheDocument();
        expect(screen.getByText('General Feat')).toBeInTheDocument();
        expect(screen.getByText('Fighting Style Feat')).toBeInTheDocument();
    });

    it('calls onFilterChange when type changes', () => {
        render(<Feat2024Filter filter={createFilter()} onFilterChange={mockOnFilterChange} />);
        const typeSelect = screen.getByLabelText('Type');
        fireEvent.change(typeSelect, { target: { value: 'General Feat' } });
        expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ type: 'General Feat' }));
    });

    it('renders repeatable select with correct options', () => {
        render(<Feat2024Filter filter={createFilter()} onFilterChange={mockOnFilterChange} />);
        expect(screen.getByLabelText('Repeatable')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('calls onFilterChange when repeatable changes', () => {
        render(<Feat2024Filter filter={createFilter()} onFilterChange={mockOnFilterChange} />);
        const repeatableSelect = screen.getByLabelText('Repeatable');
        fireEvent.change(repeatableSelect, { target: { value: 'Yes' } });
        expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ repeatable: 'Yes' }));
    });

    it('renders min level input with correct value', () => {
        render(<Feat2024Filter filter={createFilter({ minLevel: 4 })} onFilterChange={mockOnFilterChange} />);
        expect(screen.getByLabelText('Min Level')).toHaveValue(4);
    });

    it('calls onFilterChange when min level changes', () => {
        render(<Feat2024Filter filter={createFilter()} onFilterChange={mockOnFilterChange} />);
        const minLevelInput = screen.getByLabelText('Min Level');
        fireEvent.change(minLevelInput, { target: { value: '4' } });
        expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ minLevel: 4 }));
    });

    it('renders ability score select with correct options', () => {
        render(<Feat2024Filter filter={createFilter()} onFilterChange={mockOnFilterChange} />);
        expect(screen.getByLabelText('Ability Score')).toBeInTheDocument();
        expect(screen.getByText('Strength')).toBeInTheDocument();
        expect(screen.getByText('Dexterity')).toBeInTheDocument();
    });

    it('calls onFilterChange when ability score changes', () => {
        render(<Feat2024Filter filter={createFilter()} onFilterChange={mockOnFilterChange} />);
        const abilitySelect = screen.getByLabelText('Ability Score');
        fireEvent.change(abilitySelect, { target: { value: 'Dexterity' } });
        expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ abilityScore: 'Dexterity' }));
    });
});
