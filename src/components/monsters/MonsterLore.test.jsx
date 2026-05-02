import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mutable state for mocking hooks
const useMonstersState = { data: [], loading: false };
const useMonsterTypesState = { data: [], loading: false };

vi.mock('../../data/dataService', () => ({
  useMonsters: vi.fn(() => useMonstersState),
  useMonsterTypes: vi.fn(() => useMonsterTypesState),
}));

vi.mock('../../data/utils', () => ({
  scrollIntoView: vi.fn(),
}));

vi.mock('../../utils/localStorage', () => ({
  LOCAL_STORAGE_KEYS: {
    MONSTER_LORE_FILTER: 'monster-lore-filter',
  },
  getLocalStorageItem: vi.fn(() => null),
  setLocalStorageItem: vi.fn(),
}));

vi.mock('../../utils/htmlUtils', () => ({
  renderHtmlContent: vi.fn((html) => ({ __html: html })),
}));

vi.mock('./Monster', () => ({
  default: vi.fn(({ monster, expand, onExpand, cardType }) => (
          <div data-testid={`monster-${monster?.index}`}>
              <span>{monster?.name}</span>
              <button data-testid={`expand-monster-${monster?.index}`}
                      onClick={() => onExpand(!expand)}
                      aria-expanded={expand}>
                  {expand ? 'Collapse' : 'Expand'}
              </button>
          </div>
      )),
}));

import MonsterLore from './MonsterLore';
import Monster from './Monster';

describe('MonsterLore', () => {
    const mockMonsterTypes = [
         {
            index: 'aberration-entry',
            name: 'Aberration',
            desc: '<p>Aberrations are strange creatures.</p>',
            monsters: [],
            book: 'Monster Manual',
            page: 1,
          },
          {
            index: 'beast-entry',
            name: 'Beast',
            desc: '<p>Beasts are animals.</p>',
            monsters: [],
            book: 'Monster Manual',
            page: 2,
          },
       ];

    const mockMonsters = [
         { index: 'goblin', name: 'Goblin' },
         { index: 'orc', name: 'Orc' },
       ];

    beforeEach(() => {
        useMonstersState.data = [];
        useMonstersState.loading = false;
        useMonsterTypesState.data = [];
        useMonsterTypesState.loading = false;
        vi.clearAllMocks();
      });

    const renderWithRouter = (component) =>
        render(<MemoryRouter>{component}</MemoryRouter>);

    describe('loading state', () => {
        it('shows loading message when monstersLoading is true', () => {
            useMonstersState.loading = true;
            useMonstersState.data = null;
            renderWithRouter(<MonsterLore />);
            expect(screen.getByText('Loading monster lore...')).toBeInTheDocument();
          });

        it('shows loading message when subtypeLoading is true', () => {
            useMonstersState.loading = false;
            useMonstersState.data = [];
            useMonsterTypesState.loading = true;
            renderWithRouter(<MonsterLore />);
            expect(screen.getByText('Loading monster lore...')).toBeInTheDocument();
          });
       });

    describe('monster types rendering', () => {
        it('renders a card for each monster type', () => {
            useMonstersState.data = mockMonsters;
            useMonsterTypesState.data = mockMonsterTypes;
            renderWithRouter(<MonsterLore />);
            expect(screen.getByText('Aberration')).toBeInTheDocument();
            expect(screen.getByText('Beast')).toBeInTheDocument();
          });

        it('shows subtype name in card header', () => {
            useMonstersState.data = mockMonsters;
            useMonsterTypesState.data = [{ index: 'test-entry', name: 'Test Type', desc: '', monsters: [], book: 'MM', page: 1 }];
            renderWithRouter(<MonsterLore />);
            expect(screen.getByText('Test Type')).toBeInTheDocument();
          });

        it('uses subtype index as card id', () => {
            useMonstersState.data = mockMonsters;
            useMonsterTypesState.data = [{ index: 'test-entry', name: 'Test', desc: '', monsters: [], book: 'MM', page: 1 }];
            renderWithRouter(<MonsterLore />);
            expect(document.getElementById('test-entry')).toBeInTheDocument();
          });

        it('does not render body when subtype is collapsed', () => {
            useMonstersState.data = mockMonsters;
            useMonsterTypesState.data = [{ index: 'test-entry', name: 'Test', desc: '<p>Test</p>', monsters: [], book: 'MM', page: 1 }];
            renderWithRouter(<MonsterLore />);
            expect(screen.queryByText('Monsters')).not.toBeInTheDocument();
          });
       });

    describe('subtype expansion', () => {
        it('expands subtype on header click', () => {
            useMonstersState.data = [];
            useMonsterTypesState.data = [{ index: 'test-entry', name: 'Test', desc: '<p>Test</p>', monsters: [], book: 'MM', page: 1 }];
            renderWithRouter(<MonsterLore />);
            fireEvent.click(screen.getByText('Test').closest('.clickable'));
            expect(screen.getByText('Monsters')).toBeInTheDocument();
          });

        it('closes subtype on second header click', () => {
            useMonstersState.data = [];
            useMonsterTypesState.data = [{ index: 'test-entry', name: 'Test Type', desc: '<p>Description text.</p>', monsters: [], book: 'MM', page: 1 }];
            renderWithRouter(<MonsterLore />);
            fireEvent.click(screen.getByText('Test Type').closest('.clickable'));
            expect(screen.getByText('Monsters')).toBeInTheDocument();
            fireEvent.click(screen.getByText('Test Type').closest('.clickable'));
            expect(screen.queryByText('Monsters')).not.toBeInTheDocument();
           });

        it('adds active class when expanded', () => {
            useMonstersState.data = [];
            useMonsterTypesState.data = [{ index: 'test-entry', name: 'Test', desc: '', monsters: [], book: 'MM', page: 1 }];
            const { container } = renderWithRouter(<MonsterLore />);
            fireEvent.click(screen.getByText('Test').closest('.clickable'));
            expect(container.querySelector('.outer.card.active')).toBeInTheDocument();
          });

        it('does not add active class when collapsed', () => {
            useMonstersState.data = [];
            useMonsterTypesState.data = [{ index: 'test-entry', name: 'Test', desc: '', monsters: [], book: 'MM', page: 1 }];
            const { container } = renderWithRouter(<MonsterLore />);
            expect(container.querySelector('.outer.card')).not.toHaveClass('active');
          });
       });

    describe('monster display within subtypes', () => {
        it('renders monsters that match the subtype', () => {
            useMonstersState.data = [{ index: 'goblin', name: 'Goblin' }];
            useMonsterTypesState.data = [{ index: 'test-entry', name: 'Test', desc: '', monsters: ['goblin'], book: 'MM', page: 1 }];
            renderWithRouter(<MonsterLore />);
            fireEvent.click(screen.getByText('Test').closest('.clickable'));
            expect(screen.getByTestId('monster-goblin')).toBeInTheDocument();
          });

        it('does not render monsters not in the subtype', () => {
            useMonstersState.data = [{ index: 'goblin', name: 'Goblin' }];
            useMonsterTypesState.data = [{ index: 'test-entry', name: 'Test', desc: '', monsters: ['orc'], book: 'MM', page: 1 }];
            renderWithRouter(<MonsterLore />);
            fireEvent.click(screen.getByText('Test').closest('.clickable'));
            expect(screen.queryByTestId('monster-goblin')).not.toBeInTheDocument();
          });
       });

    describe('subtype footer', () => {
        it('renders book and page reference', () => {
            useMonstersState.data = [];
            useMonsterTypesState.data = [{ index: 'test-entry', name: 'Test', desc: '', monsters: [], book: 'Monster Manual', page: 42 }];
            renderWithRouter(<MonsterLore />);
            fireEvent.click(screen.getByText('Test').closest('.clickable'));
            expect(screen.getByText('Monster Manual (page 42)')).toBeInTheDocument();
          });

        it('renders description via dangerouslySetInnerHTML', () => {
            useMonstersState.data = [];
            useMonsterTypesState.data = [{ index: 'test-entry', name: '<p>Description</p>', desc: '<p>Description</p>', monsters: [], book: 'MM', page: 1 }];
            renderWithRouter(<MonsterLore />);
            fireEvent.click(screen.getByText('<p>Description</p>').closest('.clickable'));
            expect(screen.getByText('Monsters')).toBeInTheDocument();
          });
       });

    describe('edge cases', () => {
        it('handles empty monster types array', () => {
            useMonstersState.data = [];
            useMonsterTypesState.data = [];
            renderWithRouter(<MonsterLore />);
            expect(screen.queryByText('Loading monster lore...')).not.toBeInTheDocument();
           });

        it('handles null monsters data when not loading', () => {
            useMonstersState.data = null;
            useMonsterTypesState.data = [];
            renderWithRouter(<MonsterLore />);
            expect(screen.queryByText('Test')).not.toBeInTheDocument();
           });
       });

    describe('URL index initialization', () => {
        it('auto-expands subtype matching URL index parameter on mount', () => {
            useMonstersState.data = mockMonsters;
            useMonsterTypesState.data = mockMonsterTypes;
            render(
                 <MemoryRouter initialEntries={['/?index=aberration-entry']}>
                     <MonsterLore />
                 </MemoryRouter>
             );
            expect(screen.getByText('Monsters')).toBeInTheDocument();
            });
        });

    describe('expandCard', () => {
        it('expands an individual monster card when expanded', () => {
            useMonstersState.data = mockMonsters;
            useMonsterTypesState.data = [{
                ...mockMonsterTypes[0],
                monsters: ['goblin', 'orc'],
            }];
            renderWithRouter(<MonsterLore />);
            fireEvent.click(screen.getByText('Aberration').closest('.clickable'));
            const expandBtn = screen.getByTestId('expand-monster-goblin');
            expect(expandBtn.textContent).toBe('Expand');
            fireEvent.click(expandBtn);
            expect(expandBtn.textContent).toBe('Collapse');
            expect(expandBtn).toHaveAttribute('aria-expanded', 'true');
           });

        it('collapses a monster card when expanded', () => {
            useMonstersState.data = mockMonsters;
            useMonsterTypesState.data = [{
                ...mockMonsterTypes[0],
                monsters: ['goblin', 'orc'],
            }];
            renderWithRouter(<MonsterLore />);
            fireEvent.click(screen.getByText('Aberration').closest('.clickable'));
            const expandBtn = screen.getByTestId('expand-monster-goblin');
            fireEvent.click(expandBtn);
            expect(expandBtn.textContent).toBe('Collapse');
            fireEvent.click(expandBtn);
            expect(expandBtn.textContent).toBe('Expand');
            expect(expandBtn).toHaveAttribute('aria-expanded', 'false');
           });
    });

    describe('monster expand prop', () => {
        it('receives expand prop when parent subtype is expanded', () => {
            useMonstersState.data = mockMonsters;
            useMonsterTypesState.data = [{
                  ...mockMonsterTypes[0],
                monsters: ['goblin'],
              }];
            renderWithRouter(<MonsterLore />);
            fireEvent.click(screen.getByText('Aberration').closest('.clickable'));
            expect(Monster).toHaveBeenCalled();
            const lastCall = Monster.mock.calls[Monster.mock.calls.length - 1];
            expect(lastCall[0].expand).toBe(false);
            });
   });
});
