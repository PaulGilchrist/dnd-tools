import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Monster2024FilterControls from './Monster2024FilterControls';

vi.mock('../../../components/monsters/SelectFilter', () => ({
    default: vi.fn(({ label, name, value, options, onChange }) => (
        <div data-testid={`select-filter-${name}`}>
            <label>{label}</label>
            <select
                data-testid={`select-${name}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    )),
}));

vi.mock('../../../components/monsters/NameInput', () => ({
    default: vi.fn(({ filter, updateFilter }) => (
        <div data-testid="name-input">
            <input
                data-testid="name-input-field"
                value={filter.name || ''}
                onChange={(e) => updateFilter('name', e.target.value)}
            />
        </div>
    )),
}));

describe('Monster2024FilterControls', () => {
    const createFilter = (overrides = {}) => ({
        bookmarked: 'All',
        challengeRatingMin: 0,
        challengeRatingMax: 30,
        environment: 'All',
        name: '',
        size: 'All',
        type: 'All',
        xpMin: 0,
        xpMax: 100000,
        ...overrides,
    });

    const mockUpdateFilter = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders NameInput component', () => {
        render(<Monster2024FilterControls filter={createFilter()} updateFilter={mockUpdateFilter} />);
        expect(screen.getByTestId('name-input')).toBeInTheDocument();
    });

    it('renders size SelectFilter', () => {
        render(<Monster2024FilterControls filter={createFilter()} updateFilter={mockUpdateFilter} />);
        expect(screen.getByTestId('select-filter-size')).toBeInTheDocument();
    });

    it('renders type SelectFilter', () => {
        render(<Monster2024FilterControls filter={createFilter()} updateFilter={mockUpdateFilter} />);
        expect(screen.getByTestId('select-filter-type')).toBeInTheDocument();
    });

    it('renders environment SelectFilter', () => {
        render(<Monster2024FilterControls filter={createFilter()} updateFilter={mockUpdateFilter} />);
        expect(screen.getByTestId('select-filter-environment')).toBeInTheDocument();
    });

    it('renders bookmarked SelectFilter', () => {
        render(<Monster2024FilterControls filter={createFilter()} updateFilter={mockUpdateFilter} />);
        expect(screen.getByTestId('select-filter-bookmarked')).toBeInTheDocument();
    });

    it('renders challenge rating inputs', () => {
        render(<Monster2024FilterControls filter={createFilter()} updateFilter={mockUpdateFilter} />);
        expect(screen.getByLabelText('Challenge Rating')).toBeInTheDocument();
    });

    it('renders XP range inputs', () => {
        render(<Monster2024FilterControls filter={createFilter()} updateFilter={mockUpdateFilter} />);
        expect(screen.getByLabelText('XP Range')).toBeInTheDocument();
    });

    it('passes correct filter values to SelectFilter components', () => {
        const filter = createFilter({ size: 'Medium', type: 'Humanoid', environment: 'underground' });
        render(<Monster2024FilterControls filter={filter} updateFilter={mockUpdateFilter} />);
        
        const sizeSelect = screen.getByTestId('select-size');
        const typeSelect = screen.getByTestId('select-type');
        const envSelect = screen.getByTestId('select-environment');
        
        expect(sizeSelect).toHaveValue('Medium');
        expect(typeSelect).toHaveValue('Humanoid');
        expect(envSelect).toHaveValue('underground');
    });

    it('calls updateFilter when bookmarked changes', () => {
        render(<Monster2024FilterControls filter={createFilter()} updateFilter={mockUpdateFilter} />);
        const bookmarkedSelect = screen.getByTestId('select-bookmarked');
        bookmarkedSelect.value = 'true';
        bookmarkedSelect.dispatchEvent(new Event('change', { bubbles: true }));
        
        expect(mockUpdateFilter).toHaveBeenCalledWith('bookmarked', 'true');
    });
});
