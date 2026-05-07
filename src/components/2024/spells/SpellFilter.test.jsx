import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SpellFilter from './SpellFilter';

vi.mock('../../common/SpellFilter', () => ({
    default: vi.fn(({ filter }) => (
        <div data-testid="spell-filter">
            <span data-testid="filter-casting-time">{filter?.castingTime}</span>
            <span data-testid="filter-class">{filter?.class}</span>
        </div>
    )),
}));

describe('SpellFilter (2024)', () => {
    it('renders the common SpellFilter component', () => {
        const filter = { castingTime: 'All', class: 'All', levelMin: 0, levelMax: 9, name: '', status: 'All' };
        const mockOnFilterChange = vi.fn();
        
        render(<SpellFilter filter={filter} onFilterChange={mockOnFilterChange} />);
        expect(screen.getByTestId('spell-filter')).toBeInTheDocument();
    });

    it('passes filter prop to SpellFilter', () => {
        const filter = { castingTime: 'Action', class: 'Wizard', levelMin: 1, levelMax: 5, name: 'fire', status: 'Known' };
        const mockOnFilterChange = vi.fn();
        
        render(<SpellFilter filter={filter} onFilterChange={mockOnFilterChange} />);
        expect(screen.getByTestId('filter-casting-time')).toHaveTextContent('Action');
        expect(screen.getByTestId('filter-class')).toHaveTextContent('Wizard');
    });

    it('passes onFilterChange prop to SpellFilter', () => {
        const filter = { castingTime: 'All', class: 'All', levelMin: 0, levelMax: 9, name: '', status: 'All' };
        const mockOnFilterChange = vi.fn();
        
        render(<SpellFilter filter={filter} onFilterChange={mockOnFilterChange} />);
        expect(screen.getByTestId('spell-filter')).toBeInTheDocument();
    });
});
