import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Encounters from './Encounters';

vi.mock('../../data/dataService', () => ({
    useMonsters: vi.fn(),
}));

vi.mock('../../utils/localStorage', () => ({
    LOCAL_STORAGE_KEYS: {
        ENCOUNTER_FILTER: 'encounterFilter',
    },
    getLocalStorageItem: vi.fn(() => null),
    setLocalStorageItem: vi.fn(),
}));

vi.mock('./Loading', () => ({
    default: vi.fn(() => <div>Loading monsters...</div>),
}));

vi.mock('./EncounterFilterPanel', () => ({
    default: vi.fn(() => <div data-testid="filter-panel">FilterPanel</div>),
}));

vi.mock('./EncounterSummaryPanel', () => ({
    default: vi.fn(() => <div data-testid="summary-panel">SummaryPanel</div>),
}));

vi.mock('./EncounterMonsterTable', () => ({
    default: vi.fn(() => <div data-testid="monster-table">MonsterTable</div>),
}));

vi.mock('./EncounterSelectedMonsters', () => ({
    default: vi.fn(() => <div data-testid="selected-monsters">SelectedMonsters</div>),
}));

const { useMonsters } = vi.mocked(await import('../../data/dataService'));

describe('Encounters', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state when data is loading', () => {
        useMonsters.mockReturnValue({ data: undefined, loading: true });
        render(<Encounters />);
        expect(screen.getByText(/Loading monsters/)).toBeInTheDocument();
    });

    it('renders encounter components when data loads', () => {
        const mockMonsters = [
            { index: 'goblin', name: 'Goblin', challenge_rating: 1, xp: 100 },
        ];
        useMonsters.mockReturnValue({ data: mockMonsters, loading: false });
        
        render(<Encounters />);
        expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
        expect(screen.getByTestId('summary-panel')).toBeInTheDocument();
    });

    it('renders monster table', () => {
        useMonsters.mockReturnValue({ data: [], loading: false });
        
        render(<Encounters />);
        expect(screen.getByTestId('monster-table')).toBeInTheDocument();
    });
});
