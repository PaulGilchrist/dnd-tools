import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import Monster2024Search from './Monster2024Search';

vi.mock('react-router-dom', () => {
    const mockSetSearchParams = vi.fn();
    return {
        useLocation: vi.fn(() => ({ pathname: '/monsters-2024', search: '' })),
        useSearchParams: vi.fn(() => [new URLSearchParams(), mockSetSearchParams]),
        _mockSetSearchParams: mockSetSearchParams,
    };
});

vi.mock('../../../data/dataService', () => ({
    use2024Monsters: vi.fn(),
}));

vi.mock('../../../hooks/useMonsterFilter', () => ({
    useMonsterFilter: vi.fn(() => ({
        filter: { bookmarked: 'All', challengeRatingMin: 0, challengeRatingMax: 30, name: '', size: 'All', type: 'All', environment: 'All', xpMin: 0, xpMax: 10000 },
        updateFilter: vi.fn(),
        showMonster: vi.fn(() => true),
    })),
}));

vi.mock('../../../data/utils', () => ({
    scrollIntoView: vi.fn(),
}));

vi.mock('./Monster2024', () => ({
    default: vi.fn(() => <div data-testid="monster-2024">Monster2024</div>),
}));

vi.mock('./Monster2024List', () => ({
    default: vi.fn(({ monsters }) => (
        <div data-testid="monster-2024-list">
            {monsters.map(m => <div key={m.index}>{m.name}</div>)}
        </div>
    )),
}));

vi.mock('./Monster2024FilterForm', () => ({
    default: vi.fn(({ children }) => <div data-testid="filter-form">{children}</div>),
}));

vi.mock('./Monster2024FilterControls', () => ({
    default: vi.fn(() => <div data-testid="filter-controls">FilterControls</div>),
}));

vi.mock('./Monster2024Loading', () => ({
    default: vi.fn(() => <div data-testid="loading">Loading...</div>),
}));

const { use2024Monsters } = vi.mocked(await import('../../../data/dataService'));

describe('Monster2024Search', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state when data is loading', () => {
        use2024Monsters.mockReturnValue({ data: undefined, loading: true });
        render(<Monster2024Search />);
        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('renders monster list when data loads', () => {
        const mockMonsters = [
            { index: 'goblin', name: 'Goblin', challenge_rating: 1, size: 'Small', type: 'Humanoid', environment: 'Forest', xp: 100, bookmarked: false },
        ];
        use2024Monsters.mockReturnValue({ data: mockMonsters, loading: false });
        
        render(<Monster2024Search />);
        expect(screen.getByTestId('monster-2024-list')).toBeInTheDocument();
    });

    it('renders filter form and controls', () => {
        use2024Monsters.mockReturnValue({ data: [], loading: false });
        
        render(<Monster2024Search />);
        expect(screen.getByTestId('filter-form')).toBeInTheDocument();
        expect(screen.getByTestId('filter-controls')).toBeInTheDocument();
    });
});
