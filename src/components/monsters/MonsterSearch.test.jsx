import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const useMonstersState = { data: [], loading: false };

vi.mock('../../data/dataService', () => ({
    useMonsters: vi.fn(() => useMonstersState),
}));

vi.mock('../../hooks/useMonsterFilter', () => ({
    useMonsterFilter: vi.fn(() => ({
        filter: { name: '', type: 'All', size: 'All' },
        updateFilter: vi.fn(),
        showMonster: vi.fn(() => true),
      })),
}));

vi.mock('../../hooks/useMonsterBookmarks', () => ({
    useMonsterBookmarks: vi.fn(() => ({
        updateMonstersWithBookmarks: vi.fn((monsters) => monsters || []),
        handleBookmarkChange: vi.fn(),
       })),
   }));

vi.mock('../../utils/localStorage', () => ({
    LOCAL_STORAGE_KEYS: {
        MONSTER_FILTER_5E: 'monster-filter-5e',
      },
    getLocalStorageItem: vi.fn(() => null),
    setLocalStorageItem: vi.fn(),
}));

vi.mock('./FilterForm', () => ({
    default: vi.fn(({ children }) => <div data-testid="filter-form">{children}</div>),
}));

vi.mock('./FilterControls', () => ({
    default: vi.fn(({ filter, updateFilter }) => (
          <div data-testid="filter-controls">Filter Controls</div>
      )),
}));

vi.mock('./MonsterList', () => ({
    default: vi.fn(({ monsters, shownCard, expandCard, handleBookmarkChange }) => (
          <div data-testid="monster-list">
             MonsterList with {monsters.length} monsters
          </div>
      )),
}));

vi.mock('./Loading', () => ({
    default: vi.fn(() => <div data-testid="loading">Loading...</div>),
}));

vi.mock('./Monster', () => ({
    default: vi.fn(() => <div data-testid="monster">Monster</div>),
}));

import MonsterSearch from './MonsterSearch';

describe('MonsterSearch', () => {
    const mockMonsters = [
         { index: 'goblin', name: 'Goblin' },
         { index: 'orc', name: 'Orc' },
       ];

    beforeEach(() => {
        useMonstersState.data = [];
        useMonstersState.loading = false;
        vi.clearAllMocks();
      });

    const renderWithRouter = (component) =>
        render(<MemoryRouter>{component}</MemoryRouter>);

    describe('loading state', () => {
        it('shows Loading component when monstersLoading is true', () => {
            useMonstersState.loading = true;
            useMonstersState.data = null;
            renderWithRouter(<MonsterSearch />);
            expect(screen.getByTestId('loading')).toBeInTheDocument();
          });

        it('hides FilterForm during loading', () => {
            useMonstersState.loading = true;
            useMonstersState.data = null;
            renderWithRouter(<MonsterSearch />);
            expect(screen.queryByTestId('filter-form')).not.toBeInTheDocument();
          });

        it('hides MonsterList during loading', () => {
            useMonstersState.loading = true;
            useMonstersState.data = null;
            renderWithRouter(<MonsterSearch />);
            expect(screen.queryByTestId('monster-list')).not.toBeInTheDocument();
          });
       });

    describe('rendered content', () => {
        it('renders FilterForm with FilterControls', () => {
            useMonstersState.data = mockMonsters;
            useMonstersState.loading = false;
            renderWithRouter(<MonsterSearch />);
            expect(screen.getByTestId('filter-form')).toBeInTheDocument();
            expect(screen.getByTestId('filter-controls')).toBeInTheDocument();
          });

        it('renders MonsterList with filtered monsters', () => {
            useMonstersState.data = mockMonsters;
            useMonstersState.loading = false;
            renderWithRouter(<MonsterSearch />);
            expect(screen.getByTestId('monster-list')).toBeInTheDocument();
          });

        it('renders empty MonsterList when no monsters', () => {
            useMonstersState.data = [];
            useMonstersState.loading = false;
            renderWithRouter(<MonsterSearch />);
            expect(screen.getByTestId('monster-list')).toHaveTextContent('MonsterList with 0 monsters');
          });
       });

    describe('initialization', () => {
        it('initializes with empty data when no monsters loaded yet', () => {
            useMonstersState.data = null;
            useMonstersState.loading = false;
            renderWithRouter(<MonsterSearch />);
            expect(screen.getByTestId('monster-list')).toHaveTextContent('MonsterList with 0 monsters');
             });
       });
});
