import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Monster2024 from './Monster2024';

vi.mock('../../common/MonsterCard', () => ({
    default: vi.fn(({ monster, cardType, expand, version }) => (
        <div data-testid="monster-card">
            <span data-testid="card-type">{cardType}</span>
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

describe('Monster2024', () => {
    const createMonster = (overrides = {}) => ({
        index: 'goblin',
        name: 'Goblin',
        type: 'Humanoid',
        size: 'Small',
        ...overrides,
    });

    const mockOnExpand = vi.fn();
    const mockOnBookmarkChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when monster is not provided', () => {
        const { container } = render(<Monster2024 monster={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when monster is undefined', () => {
        const { container } = render(<Monster2024 monster={undefined} />);
        expect(container.firstChild).toBeNull();
    });

    it('normalizes monster data using normalizeMonster2024', () => {
        const monster = createMonster();
        render(<Monster2024 monster={monster} />);
        expect(normalizeMonster2024).toHaveBeenCalledWith(monster);
    });

    it('passes normalized monster to MonsterCard', () => {
        const monster = createMonster();
        render(<Monster2024 monster={monster} />);
        expect(screen.getByTestId('card-name')).toHaveTextContent('Goblin');
    });

    it('defaults cardType to outer', () => {
        render(<Monster2024 monster={createMonster()} />);
        expect(screen.getByTestId('card-type')).toHaveTextContent('outer');
    });

    it('passes cardType to MonsterCard', () => {
        render(<Monster2024 monster={createMonster()} cardType="inner" />);
        expect(screen.getByTestId('card-type')).toHaveTextContent('inner');
    });

    it('passes version 2024 to MonsterCard', () => {
        render(<Monster2024 monster={createMonster()} />);
        expect(screen.getByTestId('card-version')).toHaveTextContent('2024');
    });

    it('passes expand prop to MonsterCard', () => {
        render(<Monster2024 monster={createMonster()} expand={true} />);
        expect(screen.getByTestId('card-expand')).toHaveTextContent('true');
    });

    it('passes onExpand callback to MonsterCard', () => {
        render(<Monster2024 monster={createMonster()} onExpand={mockOnExpand} />);
        expect(screen.getByTestId('monster-card')).toBeInTheDocument();
    });

    it('passes onBookmarkChange callback to MonsterCard', () => {
        render(<Monster2024 monster={createMonster()} onBookmarkChange={mockOnBookmarkChange} />);
        expect(screen.getByTestId('monster-card')).toBeInTheDocument();
    });
});
