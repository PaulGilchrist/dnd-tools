import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import FilterControls from './Monster2024FilterControls';

vi.mock('../../../components/monsters/SelectFilter', () => ({
    default: vi.fn(({ label }) => <div>{label}</div>),
}));

vi.mock('../../../components/monsters/NameInput', () => ({
    default: vi.fn(() => <div>NameInput</div>),
}));

vi.mock('../../../data/dataService', () => ({
    use2024MonsterTypes: vi.fn(() => ({ data: ['Aberration', 'Beast'], loading: false })),
    use2024MonsterSubtypes: vi.fn(() => ({ data: ['Any'], loading: false })),
}));

vi.mock('../../../hooks/useMonster2024Filter', () => ({
    useMonster2024Filter: vi.fn(() => ({
        filter: { 
            bookmarked: 'All', 
            challengeRatingMin: 0, 
            challengeRatingMax: 30, 
            name: '', 
            size: 'All', 
            type: 'All', 
            environment: 'All',
            xpMin: 0,
            xpMax: 10000,
        },
        updateFilter: vi.fn(),
    })),
}));

describe('Monster2024FilterControls', () => {
    const mockUpdateFilter = vi.fn();
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders name input', () => {
        render(<FilterControls filter={{}} updateFilter={mockUpdateFilter} />);
        expect(screen.getByText('NameInput')).toBeInTheDocument();
    });

    it('renders bookmarked filter', () => {
        render(<FilterControls filter={{}} updateFilter={mockUpdateFilter} />);
        expect(screen.getByText(/Bookmarked/)).toBeInTheDocument();
    });

    it('renders challenge rating section', () => {
        render(<FilterControls filter={{ challengeRatingMin: 0, challengeRatingMax: 30 }} updateFilter={mockUpdateFilter} />);
        expect(screen.getByText(/Challenge Rating/)).toBeInTheDocument();
    });

    it('renders size filter', () => {
        render(<FilterControls filter={{ size: 'All' }} updateFilter={mockUpdateFilter} />);
        expect(screen.getByText(/Size/)).toBeInTheDocument();
    });

    it('renders type filter', () => {
        render(<FilterControls filter={{ type: 'All' }} updateFilter={mockUpdateFilter} />);
        expect(screen.getByText(/Type/)).toBeInTheDocument();
    });

    it('renders environment filter', () => {
        render(<FilterControls filter={{ environment: 'All' }} updateFilter={mockUpdateFilter} />);
        expect(screen.getByText(/Environment/)).toBeInTheDocument();
    });

    it('renders XP filter', () => {
        render(<FilterControls filter={{ xpMin: 0, xpMax: 10000 }} updateFilter={mockUpdateFilter} />);
        expect(screen.getByText(/XP/)).toBeInTheDocument();
    });
});
