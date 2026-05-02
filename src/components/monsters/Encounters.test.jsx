import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

const useMonstersState = { data: [], loading: false };

vi.mock('../../data/dataService', () => ({
    useMonsters: vi.fn(() => useMonstersState),
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
        <div data-testid="filter-panel">
            <button data-testid="add-player" onClick={props.onAddPlayer}>Add Player</button>
            {props.filter?.playerLevels?.map((_, i) => (
                <div key={i} data-testid={`player-slot-${i}`}>
                    <input
                        data-testid={`player-level-${i}`}
                        value={props.filter.playerLevels[i]}
                        onChange={(e) => props.onPlayerLevelChange(i, parseInt(e.target.value))}
                    />
                    <button data-testid={`remove-player-${i}`} onClick={() => props.onRemovePlayer(i)}>Remove Player</button>
                </div>
            ))}
            <select
                data-testid="difficulty-select"
                value={props.filter?.difficulty}
                onChange={props.onDifficultyChange}
            >
                {props.difficultyLabels?.map((label, i) => (
                    <option key={i} value={i}>{label}</option>
                ))}
            </select>
        </div>
    )),
}));

vi.mock('./EncounterSummaryPanel', () => ({
    default: vi.fn((props) => (
         <div data-testid="summary-panel">
             Summary: {props.totalMonsterXP} XP, {props.monsterCount} monsters,
             effective {props.effectiveXP}, difficulty {props.difficultyLabels?.[props.difficultyIndex]}
             <button data-testid="clear-monsters" onClick={props.onClearMonsters}>Clear Monsters</button>
         </div>
     )),
}));

vi.mock('./EncounterMonsterTable', () => ({
    default: vi.fn((props) => (
          <div data-testid="monster-table">
             Monster Table: {props.filteredMonsters.length} monsters
             {props.filteredMonsters.map((monster, i) => (
                 <div key={monster.index} data-testid={`table-monster-${i}`}>
                     <button
                        data-testid={`toggle-monster-${monster.index}`}
                        onClick={() => props.onToggleMonster(monster)}
                     >{monster.name}</button>
                     {props.selectedMonsters.some(m => m.index === monster.index) && (
                         <>
                             <button
                                data-testid={`increase-qty-${monster.index}`}
                                onClick={() => props.onIncreaseQty(monster.index)}
                             >+</button>
                             <button
                                data-testid={`decrease-qty-${monster.index}`}
                                onClick={() => props.onDecreaseQty(monster.index)}
                             >-</button>
                             <button
                                data-testid={`remove-table-monster-${monster.index}`}
                                onClick={() => props.onRemoveMonster(monster.index)}
                             >x</button>
                         </>
                     )}
                 </div>
             ))}
          </div>
      )),
}));

vi.mock('./EncounterSelectedMonsters', () => ({
    default: vi.fn((props) => (
          <div data-testid="selected-monsters">Selected: {props.selectedMonsters.length} monsters</div>
      )),
}));

import Encounters from './Encounters';

describe('Encounters', () => {
    const mockMonsters = [
         { index: 'goblin', name: 'Goblin', xp: 50, challenge_rating: 0.25 },
         { index: 'orc', name: 'Orc', xp: 200, challenge_rating: 2 },
       ];

    beforeEach(() => {
        useMonstersState.data = [];
        useMonstersState.loading = false;
        vi.clearAllMocks();
      });

    describe('loading state', () => {
        it('shows Loading when monstersLoading is true', () => {
            useMonstersState.loading = true;
            useMonstersState.data = null;
            render(<Encounters />);
            expect(screen.getByTestId('loading')).toBeInTheDocument();
          });

        it('does not render content while loading', () => {
            useMonstersState.loading = true;
            useMonstersState.data = null;
            render(<Encounters />);
            expect(screen.queryByTestId('filter-panel')).not.toBeInTheDocument();
            expect(screen.queryByTestId('summary-panel')).not.toBeInTheDocument();
          });
       });

    describe('rendered content', () => {
        it('renders the title', () => {
            useMonstersState.data = mockMonsters;
            useMonstersState.loading = false;
            render(<Encounters />);
            expect(screen.getByText('Encounter Builder')).toBeInTheDocument();
          });

        it('renders the container div', () => {
            useMonstersState.data = mockMonsters;
            render(<Encounters />);
            const { container } = render(<Encounters />);
            expect(container.querySelector('.container')).toBeInTheDocument();
          });

        it('renders EncounterFilterPanel', () => {
            useMonstersState.data = mockMonsters;
            render(<Encounters />);
            expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
          });

        it('renders EncounterSummaryPanel', () => {
            useMonstersState.data = mockMonsters;
            render(<Encounters />);
            expect(screen.getByTestId('summary-panel')).toBeInTheDocument();
          });

        it('renders EncounterMonsterTable', () => {
            useMonstersState.data = mockMonsters;
            render(<Encounters />);
            expect(screen.getByTestId('monster-table')).toBeInTheDocument();
          });

        it('renders EncounterSelectedMonsters', () => {
            useMonstersState.data = mockMonsters;
            render(<Encounters />);
            expect(screen.getByTestId('selected-monsters')).toBeInTheDocument();
          });
       });

    describe('computed values', () => {
        it('calculates total threshold from player levels and difficulty', () => {
            useMonstersState.data = mockMonsters;
            render(<Encounters />);
            expect(screen.getByTestId('summary-panel')).toBeInTheDocument();
          });

        it('returns 0 XP when no monsters selected', () => {
            useMonstersState.data = mockMonsters;
            render(<Encounters />);
            expect(screen.getByTestId('summary-panel')).toHaveTextContent('Summary: 0 XP, 0 monsters');
          });

        it('filters monsters by XP threshold when difficulty set', () => {
            useMonstersState.data = mockMonsters;
            render(<Encounters />);
            expect(screen.getByTestId('monster-table')).toBeInTheDocument();
          });

        it('handles null monstersData', () => {
            useMonstersState.data = null;
            render(<Encounters />);
            expect(screen.getByTestId('monster-table')).toHaveTextContent('Monster Table: 0 monsters');
         });
     });

    describe('monster selection', () => {
         it('adds a monster to the encounter', () => {
             useMonstersState.data = mockMonsters;
             render(<Encounters />);
             fireEvent.click(screen.getByTestId('toggle-monster-goblin'));
             expect(screen.getByTestId('summary-panel')).toHaveTextContent('50 XP');
             expect(screen.getByTestId('summary-panel')).toHaveTextContent('1 monsters');
             expect(screen.getByTestId('selected-monsters')).toHaveTextContent('Selected: 1 monsters');
         });

         it('decreases qty when monster already selected with qty > 1', () => {
             useMonstersState.data = mockMonsters;
             render(<Encounters />);
             fireEvent.click(screen.getByTestId('toggle-monster-goblin'));
             fireEvent.click(screen.getByTestId('increase-qty-goblin'));
             expect(screen.getByTestId('summary-panel')).toHaveTextContent('100 XP');
             fireEvent.click(screen.getByTestId('toggle-monster-goblin'));
             expect(screen.getByTestId('summary-panel')).toHaveTextContent('50 XP');
             expect(screen.getByTestId('summary-panel')).toHaveTextContent('1 monsters');
          });

         it('increases qty of a selected monster', () => {
             useMonstersState.data = mockMonsters;
             render(<Encounters />);
             fireEvent.click(screen.getByTestId('toggle-monster-goblin'));
             fireEvent.click(screen.getByTestId('increase-qty-goblin'));
             expect(screen.getByTestId('summary-panel')).toHaveTextContent('100 XP');
             expect(screen.getByTestId('summary-panel')).toHaveTextContent('2 monsters');
         });

         it('decreases qty of a selected monster', () => {
             useMonstersState.data = mockMonsters;
             render(<Encounters />);
             fireEvent.click(screen.getByTestId('toggle-monster-goblin'));
             fireEvent.click(screen.getByTestId('increase-qty-goblin'));
             fireEvent.click(screen.getByTestId('increase-qty-goblin'));
             expect(screen.getByTestId('summary-panel')).toHaveTextContent('150 XP');
             fireEvent.click(screen.getByTestId('decrease-qty-goblin'));
             expect(screen.getByTestId('summary-panel')).toHaveTextContent('100 XP');
             expect(screen.getByTestId('summary-panel')).toHaveTextContent('2 monsters');
         });

         it('removes a selected monster by index', () => {
             useMonstersState.data = mockMonsters;
             render(<Encounters />);
             fireEvent.click(screen.getByTestId('toggle-monster-goblin'));
             fireEvent.click(screen.getByTestId('toggle-monster-goblin'));
             fireEvent.click(screen.getByTestId('toggle-monster-goblin'));
             expect(screen.getByTestId('summary-panel')).toHaveTextContent('50 XP');
             fireEvent.click(screen.getByTestId('remove-table-monster-goblin'));
             expect(screen.getByTestId('summary-panel')).toHaveTextContent('0 XP');
         });

          it('clears all selected monsters', () => {
              useMonstersState.data = mockMonsters;
              render(<Encounters />);
              fireEvent.click(screen.getByTestId('toggle-monster-goblin'));
              fireEvent.click(screen.getByTestId('increase-qty-goblin'));
              expect(screen.getByTestId('summary-panel')).toHaveTextContent('100 XP');
              fireEvent.click(screen.getByTestId('clear-monsters'));
              expect(screen.getByTestId('summary-panel')).toHaveTextContent('0 XP');
              expect(screen.getByTestId('summary-panel')).toHaveTextContent('0 monsters');
           });
     });

    describe('player management', () => {
         it('adds a player', () => {
             useMonstersState.data = mockMonsters;
             render(<Encounters />);
             expect(screen.getAllByTestId(/^player-slot-/).length).toBe(1);
             fireEvent.click(screen.getByTestId('add-player'));
             expect(screen.getAllByTestId(/^player-slot-/).length).toBe(2);
           });

         it('removes a player', () => {
             useMonstersState.data = mockMonsters;
             render(<Encounters />);
             expect(screen.getAllByTestId(/^player-slot-/).length).toBe(1);
             fireEvent.click(screen.getByTestId('add-player'));
             expect(screen.getAllByTestId(/^player-slot-/).length).toBe(2);
             fireEvent.click(screen.getByTestId('remove-player-1'));
             expect(screen.getAllByTestId(/^player-slot-/).length).toBe(1);
           });

         it('changes player level', () => {
             useMonstersState.data = mockMonsters;
             render(<Encounters />);
             const input = screen.getByTestId('player-level-0');
             fireEvent.change(input, { target: { value: '5' } });
             expect(input).toHaveValue('5');
           });

         it('changes difficulty', () => {
             useMonstersState.data = mockMonsters;
             const { getByTestId } = render(<Encounters />);
             fireEvent.change(getByTestId('difficulty-select'), { target: { value: '3' } });
             expect(getByTestId('summary-panel')).toHaveTextContent('difficulty Deadly');
              });
        });
    });
