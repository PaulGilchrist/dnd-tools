import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RuleVersionProvider } from '../../context/RuleVersionContext';

const useMonstersState = { data: [], loading: false };

const searchParamsState = {
    params: new URLSearchParams(),
    setParamsFn: vi.fn(),
};

vi.mock('react-router-dom', async () => {
    const real = await vi.importActual('react-router-dom');
    return {
        ...real,
        useLocation: vi.fn(() => ({ pathname: '/monsters' })),
        useSearchParams: vi.fn(() => [
            searchParamsState.params,
            searchParamsState.setParamsFn,
         ]),
        };
});

vi.mock('../../data/dataService', () => ({
    getBaseUrl: vi.fn(() => ''),
    useDataCache: vi.fn((key) => {
        if (key === 'monsters') return useMonstersState;
        return { data: [], loading: false };
    }),
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
    getLocalStorageString: vi.fn(() => null),
    setLocalStorageString: vi.fn(),
}));

vi.mock('./FilterForm', () => ({
    default: vi.fn(({ children }) => <div data-testid="filter-form">{children}</div>),
}));

vi.mock('./FilterControls', () => ({
    default: vi.fn(() => (
           <div data-testid="filter-controls">Filter Controls</div>
       )),
}));

vi.mock('./MonsterList', () => ({
    default: vi.fn(({ monsters, shownCard }) => (
           <div data-testid="monster-list">
             MonsterList with {monsters.length} monsters, shownCard: {shownCard || 'none'}
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
import MonsterList from './MonsterList';

describe('MonsterSearch', () => {
    const mockMonsters = [
          { index: 'goblin', name: 'Goblin' },
          { index: 'orc', name: 'Orc' },
        ];

    let mockElement = null;

    beforeEach(() => {
        useMonstersState.data = [];
        useMonstersState.loading = false;
        searchParamsState.params = new URLSearchParams();
        searchParamsState.setParamsFn.mockReset();
        mockElement = { scrollIntoView: vi.fn() };
        vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);
       });

    afterEach(() => {
        vi.restoreAllMocks();
       });

    const renderWithRouter = (component, initialEntries = ['/monsters']) =>
        render(
            <RuleVersionProvider>
                <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>
            </RuleVersionProvider>
        );

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
            expect(screen.getByTestId('monster-list')).toHaveTextContent('MonsterList with 0 monsters, shownCard: none');
           });
        });

    describe('initialization', () => {
        it('initializes with empty data when no monsters loaded yet', () => {
            useMonstersState.data = null;
            useMonstersState.loading = false;
            renderWithRouter(<MonsterSearch />);
            expect(screen.getByTestId('monster-list')).toHaveTextContent('MonsterList with 0 monsters, shownCard: none');
              });

        it('sets shownCard and scrolls into view when URL index matches a monster', () => {
            searchParamsState.params = new URLSearchParams({ index: 'goblin' });
            useMonstersState.data = mockMonsters;
            useMonstersState.loading = false;
            renderWithRouter(<MonsterSearch />);
            expect(screen.getByTestId('monster-list')).toHaveTextContent('shownCard: goblin');
            expect(document.getElementById).toHaveBeenCalledWith('goblin');
            expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
           });

        it('does not set shownCard when URL index does not match any monster', () => {
            searchParamsState.params = new URLSearchParams({ index: 'nonexistent' });
            useMonstersState.data = mockMonsters;
            useMonstersState.loading = false;
            renderWithRouter(<MonsterSearch />);
            expect(screen.getByTestId('monster-list')).toHaveTextContent('shownCard: none');
            });
        });

    describe('expandCard', () => {
        it('updates URL with index when expanding a card', () => {
            useMonstersState.data = mockMonsters;
            useMonstersState.loading = false;
            renderWithRouter(<MonsterSearch />);
            const expandCard = MonsterList.mock.calls[0][0].expandCard;
            expandCard('goblin', true);
            expect(searchParamsState.setParamsFn).toHaveBeenCalledWith({ index: 'goblin' });
           });

        it('clears URL params when collapsing a card', () => {
            useMonstersState.data = mockMonsters;
            useMonstersState.loading = false;
            renderWithRouter(<MonsterSearch />);
            const expandCard = MonsterList.mock.calls[0][0].expandCard;
            expandCard('goblin', false);
            expect(searchParamsState.setParamsFn).toHaveBeenCalledWith({});
           });

        it('scrolls into view when expanding a card', () => {
            useMonstersState.data = mockMonsters;
            useMonstersState.loading = false;
            renderWithRouter(<MonsterSearch />);
            const expandCard = MonsterList.mock.calls[0][0].expandCard;
            expandCard('orc', true);
            expect(document.getElementById).toHaveBeenCalledWith('orc');
            expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
           });
        });
    });
