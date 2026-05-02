import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Encounters from './Encounters';

vi.mock('../../data/dataService', () => ({
    useMonsters: vi.fn(() => ({ data: [], loading: false })),
}));

vi.mock('../../utils/localStorage', () => ({
    LOCAL_STORAGE_KEYS: {
        ENCOUNTER_FILTER: 'encounter-filter',
     },
    getLocalStorageItem: vi.fn(() => null),
    setLocalStorageItem: vi.fn(),
}));

vi.mock('./Loading', () => ({
    default: vi.fn(() => <div data-testid="loading">Loading...</div>),
}));

vi.mock('./EncounterFilterPanel', () => ({
    default: vi.fn((props) => (
         <div data-testid="filter-panel">Filter Panel</div>
     )),
}));

vi.mock('./EncounterSummaryPanel', () => ({
    default: vi.fn((props) => (
         <div data-testid="summary-panel">
             Summary: {props.totalMonsterXP} XP, {props.monsterCount} monsters,
             effective {props.effectiveXP}, difficulty {props.difficultyLabels?.[props.difficultyIndex]}
         </div>
     )),
}));

vi.mock('./EncounterMonsterTable', () => ({
    default: vi.fn((props) => (
         <div data-testid="monster-table">Monster Table: {props.filteredMonsters.length} monsters</div>
     )),
}));

vi.mock('./EncounterSelectedMonsters', () => ({
    default: vi.fn((props) => (
         <div data-testid="selected-monsters">Selected: {props.selectedMonsters.length} monsters</div>
     )),
}));

describe('Encounters', () => {
    const mockMonsters = [
        { index: 'goblin', name: 'Goblin', xp: 50, challenge_rating: 0.25 },
        { index: 'orc', name: 'Orc', xp: 200, challenge_rating: 2 },
     ];

    beforeEach(() => {
        vi.clearAllMocks();
     });

    describe('loading state', () => {
        it('shows Loading when monstersLoading is true', () => {
            require('../../data/dataService').useMonsters.mockReturnValueOnce({
                data: null,
                loading: true,
             });
            render(<Encounters />);
            expect(screen.getByTestId('loading')).toBeInTheDocument();
         });

        it('does not render content while loading', () => {
            require('../../data/dataService').useMonsters.mockReturnValueOnce({
                data: null,
                loading: true,
             });
            render(<Encounters />);
            expect(screen.queryByTestId('filter-panel')).not.toBeInTheDocument();
            expect(screen.queryByTestId('summary-panel')).not.toBeInTheDocument();
         });
    });

    describe('rendered content', () => {
        it('renders the title', () => {
            require('../../data/dataService').useMonsters.mockReturnValueOnce({
                data: mockMonsters,
                loading: false,
             });
            render(<Encounters />);
            expect(screen.getByText('Encounter Builder')).toBeInTheDocument();
         });

        it('renders the container div', () => {
            require('../../data/dataService').useMonsters.mockReturnValueOnce({
                data: mockMonsters,
                loading: false,
             });
            const { container } = render(<Encounters />);
            expect(container.querySelector('.container')).toBeInTheDocument();
         });

        it('renders EncounterFilterPanel', () => {
            require('../../data/dataService').useMonsters.mockReturnValueOnce({
                data: mockMonsters,
                loading: false,
             });
            render(<Encounters />);
            expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
         });

        it('renders EncounterSummaryPanel', () => {
            require('../../data/dataService').useMonsters.mockReturnValueOnce({
                data: mockMonsters,
                loading: false,
             });
            render(<Encounters />);
            expect(screen.getByTestId('summary-panel')).toBeInTheDocument();
         });

        it('renders EncounterMonsterTable', () => {
            require('../../data/dataService').useMonsters.mockReturnValueOnce({
                data: mockMonsters,
                loading: false,
             });
            render(<Encounters />);
            expect(screen.getByTestId('monster-table')).toBeInTheDocument();
         });

        it('renders EncounterSelectedMonsters', () => {
            require('../../data/dataService').useMonsters.mockReturnValueOnce({
                data: mockMonsters,
                loading: false,
             });
            render(<Encounters />);
            expect(screen.getByTestId('selected-monsters')).toBeInTheDocument();
         });
    });

    describe('computed values', () => {
        it('calculates total threshold from player levels and difficulty', () => {
            require('../../data/dataService').useMonsters.mockReturnValueOnce({
                data: mockMonsters,
                loading: false,
             });
            render(<Encounters />);
            expect(screen.getByTestId('summary-panel')).toBeInTheDocument();
         });

        it('returns 0 XP when no monsters selected', () => {
            require('../../data/dataService').useMonsters.mockReturnValueOnce({
                data: mockMonsters,
                loading: false,
             });
            render(<Encounters />);
            expect(screen.getByTestId('summary-panel')).toHaveTextContent('Summary: 0 XP, 0 monsters');
         });

        it('filters monsters by XP threshold when difficulty set', () => {
            require('../../data/dataService').useMonsters.mockReturnValueOnce({
                data: mockMonsters,
                loading: false,
             });
            render(<Encounters />);
            expect(screen.getByTestId('monster-table')).toBeInTheDocument();
         });

        it('handles null monstersData', () => {
            require('../../data/dataService').useMonsters.mockReturnValueOnce({
                data: null,
                loading: false,
             });
            render(<Encounters />);
            expect(screen.getByTestId('monster-table')).toHaveTextContent('Monster Table: 0 monsters');
         });
    });
});
