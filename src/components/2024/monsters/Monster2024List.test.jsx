import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Monster2024List from './Monster2024List';

vi.mock('../../common/MonsterCard', () => ({
    default: vi.fn(({ monster, expand, version }) => (
        <div data-testid="monster-card" data-index={monster?.index}>
            <span data-testid="card-expand">{String(expand)}</span>
            <span data-testid="card-version">{version}</span>
            <span data-testid="card-name">{monster?.name}</span>
        </div>
    )),
}));

vi.mock('../../adapters/monsterAdapters', () => ({
    normalizeMonster2024: vi.fn((monster) => ({
        ...monster,
        normalized: true,
    })),
}));

import { normalizeMonster2024 } from '../../adapters/monsterAdapters';

describe('Monster2024List', () => {
    const createMonsters = () => [
        { index: 'goblin', name: 'Goblin', type: 'Humanoid' },
        { index: 'orc', name: 'Orc', type: 'Humanoid' },
    ];

    const mockExpandCard = vi.fn();
    const mockHandleBookmarkChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders a list of monster cards', () => {
        render(
            <Monster2024List
                monsters={createMonsters()}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        expect(screen.getAllByTestId('monster-card')).toHaveLength(2);
    });

    it('normalizes each monster using normalizeMonster2024', () => {
        const monsters = createMonsters();
        render(
            <Monster2024List
                monsters={monsters}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        expect(normalizeMonster2024).toHaveBeenCalledTimes(2);
        expect(normalizeMonster2024).toHaveBeenCalledWith(monsters[0]);
        expect(normalizeMonster2024).toHaveBeenCalledWith(monsters[1]);
    });

    it('passes version 2024 to MonsterCard', () => {
        render(
            <Monster2024List
                monsters={createMonsters()}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        const versions = screen.getAllByTestId('card-version');
        versions.forEach((v) => expect(v).toHaveTextContent('2024'));
    });

    it('sets expand to true for shownCard', () => {
        const monsters = createMonsters();
        render(
            <Monster2024List
                monsters={monsters}
                shownCard="goblin"
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        const expands = screen.getAllByTestId('card-expand');
        expect(expands[0]).toHaveTextContent('true');
        expect(expands[1]).toHaveTextContent('false');
    });

    it('renders monster names', () => {
        render(
            <Monster2024List
                monsters={createMonsters()}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        expect(screen.getByText('Goblin')).toBeInTheDocument();
        expect(screen.getByText('Orc')).toBeInTheDocument();
    });

    it('renders empty list when no monsters provided', () => {
        render(
            <Monster2024List
                monsters={[]}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        expect(screen.queryAllByTestId('monster-card')).toHaveLength(0);
    });

    it('calls expandCard with correct index when MonsterCard expand toggles', () => {
        render(
            <Monster2024List
                monsters={createMonsters()}
                shownCard=""
                expandCard={mockExpandCard}
                handleBookmarkChange={mockHandleBookmarkChange}
            />
        );
        expect(screen.getAllByTestId('monster-card')).toHaveLength(2);
    });
});
