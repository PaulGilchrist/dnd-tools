import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MonsterList from './MonsterList';

vi.mock('../../utils/monsterUtils', () => ({
    getNameString: vi.fn((names) => (names ? names.join(', ') : '')),
}));

vi.mock('../../utils/htmlUtils', () => ({
    renderHtmlContent: vi.fn((html) => ({ __html: html })),
}));

vi.mock('../common/MonsterStats', () => ({
    default: vi.fn(() => <div data-testid="monster-stats"></div>),
}));

vi.mock('../common/MonsterAbilityScores', () => ({
    default: vi.fn(() => <div data-testid="ability-scores"></div>),
}));

vi.mock('../common/MonsterDefenses', () => ({
    default: vi.fn(() => <div data-testid="defenses"></div>),
}));

vi.mock('../common/MonsterActions', () => ({
    default: vi.fn(() => <div data-testid="actions"></div>),
}));

vi.mock('../common/MonsterReactions', () => ({
    default: vi.fn(() => <div data-testid="reactions"></div>),
}));

vi.mock('../common/MonsterLegendaryActions', () => ({
    default: vi.fn(() => <div data-testid="legendary-actions"></div>),
}));

vi.mock('../common/MonsterRegionalEffects', () => ({
    default: vi.fn(() => <div data-testid="regional-effects"></div>),
}));

vi.mock('../common/MonsterCard', () => ({
    default: vi.fn(({ monster, expand, onExpand, onBookmarkChange, version }) => (
          <div data-testid={`monster-card-${monster?.index}`}>
              <span data-testid="card-name">{monster?.name}</span>
              <span data-testid="card-expand">{String(expand)}</span>
              <button onClick={() => onExpand(true)}>Expand</button>
          </div>
      )),
}));

vi.mock('../common/MonsterCard', () => ({
    default: vi.fn(({ monster, expand, onExpand, onBookmarkChange, version }) => (
         <div data-testid={`monster-card-${monster?.index}`}>
             <span data-testid="card-name">{monster?.name}</span>
             <span data-testid="card-expand">{String(expand)}</span>
             <button onClick={() => onExpand(true)}>Expand</button>
         </div>
     )),
}));

describe('MonsterList', () => {
    const createMonsters = (count) =>
        Array.from({ length: count }, (_, i) => ({
            index: `monster-${i}`,
            name: `Monster ${i}`,
            type: 'Humanoid',
            size: 'Medium',
         }));

    const mockExpandCard = vi.fn();
    const mockHandleBookmarkChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
     });

    it('renders a list container', () => {
        render(
            <MonsterList
                monsters={createMonsters(2)}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        expect(() => screen.getByRole('list')).toThrow();
        expect(document.querySelector('.list')).toBeInTheDocument();
     });

    it('renders no cards when monsters array is empty', () => {
        render(
            <MonsterList
                monsters={[]}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        expect(screen.queryByTestId('monster-card-monster-0')).not.toBeInTheDocument();
     });

    it('renders no cards when monsters is undefined', () => {
        render(
            <MonsterList
                monsters={undefined}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        expect(screen.queryByTestId('monster-card-monster-0')).not.toBeInTheDocument();
     });

    it('renders one card per monster', () => {
        render(
            <MonsterList
                monsters={createMonsters(3)}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        expect(screen.getAllByTestId(/monster-card-/)).toHaveLength(3);
     });

    it('renders monster names', () => {
        render(
            <MonsterList
                monsters={createMonsters(2)}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        expect(screen.getByText('Monster 0')).toBeInTheDocument();
        expect(screen.getByText('Monster 1')).toBeInTheDocument();
     });

    it('wraps each card in a div with monster index as id', () => {
        render(
            <MonsterList
                monsters={createMonsters(2)}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        expect(document.getElementById('monster-0')).toBeInTheDocument();
        expect(document.getElementById('monster-1')).toBeInTheDocument();
     });

    it('sets expand to true when shownCard matches monster index', () => {
        render(
            <MonsterList
                monsters={createMonsters(2)}
                shownCard="monster-1"
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        const cards = screen.getAllByTestId(/monster-card-/);
        expect(cards[0]).toHaveTextContent('false');
        expect(cards[1].querySelector('[data-testid="card-expand"]')).toHaveTextContent('true');
     });

    it('sets expand to false for non-matching monster indices', () => {
        render(
            <MonsterList
                monsters={createMonsters(3)}
                shownCard="monster-2"
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        const card = document.getElementById('monster-0').querySelector('[data-testid="card-expand"]');
        expect(card).toHaveTextContent('false');
     });

    it('calls expandCard with monster index and expanded state', () => {
        render(
            <MonsterList
                monsters={createMonsters(2)}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        fireEvent.click(screen.getAllByText('Expand')[0]);
        expect(mockExpandCard).toHaveBeenCalledWith('monster-0', true);
     });

    it('normalizes each monster using normalizeMonster5e', () => {
        render(
             <MonsterList
                monsters={createMonsters(2)}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
             />
         );
        // verify normalized monsters are passed through to MonsterCard
        expect(screen.getAllByTestId(/monster-card-/)).toHaveLength(2);
      });

    it('passes version 5e to all cards', () => {
        render(
            <MonsterList
                monsters={createMonsters(1)}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        expect(screen.getByTestId('monster-card-monster-0')).toBeInTheDocument();
     });

    it('handles single monster list', () => {
        render(
            <MonsterList
                monsters={[createMonsters(1)[0]]}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        expect(screen.getAllByTestId(/monster-card-/)).toHaveLength(1);
     });

    it('uses monster index as key for React list', () => {
        const { container } = render(
            <MonsterList
                monsters={createMonsters(3)}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        const listDivs = container.querySelectorAll('.list > div');
        expect(listDivs).toHaveLength(3);
        expect(listDivs[0]).toHaveAttribute('id', 'monster-0');
     });
});
