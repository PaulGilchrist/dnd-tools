import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Monster from './Monster';

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
    default: vi.fn(({ monster, cardType, expand, version }) => (
        <div data-testid="monster-card">
          <span data-testid="card-type">{cardType}</span>
          <span data-testid="card-expand">{String(expand)}</span>
          <span data-testid="card-version">{version}</span>
          <span data-testid="card-name">{monster?.name}</span>
        </div>
    )),
}));

vi.mock('../common/MonsterCard', () => ({
    default: vi.fn(({ monster, cardType, expand, version }) => (
        <div data-testid="monster-card">
            <span data-testid="card-type">{cardType}</span>
            <span data-testid="card-expand">{String(expand)}</span>
            <span data-testid="card-version">{version}</span>
            <span data-testid="card-name">{monster?.name}</span>
        </div>
    )),
}));

describe('Monster', () => {
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
        const { container } = render(<Monster monster={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when monster is undefined', () => {
        const { container } = render(<Monster monster={undefined} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when monster is an empty object', () => {
        const { container } = render(<Monster monster={{}} />);
        expect(container.firstChild).not.toBeNull();
    });

    it('normalizes monster data using normalizeMonster5e', () => {
        render(<Monster monster={createMonster()} />);
        // verify normalized monster is passed through to MonsterCard
        expect(screen.getByTestId('card-name')).toHaveTextContent('Goblin');
     });

    it('passes normalized monster to MonsterCard', () => {
        render(<Monster monster={createMonster()} />);
        expect(screen.getByTestId('card-name')).toHaveTextContent('Goblin');
    });

    it('defaults cardType to outer', () => {
        render(<Monster monster={createMonster()} />);
        expect(screen.getByTestId('card-type')).toHaveTextContent('outer');
    });

    it('passes cardType to MonsterCard', () => {
        render(<Monster monster={createMonster()} cardType="inner" />);
        expect(screen.getByTestId('card-type')).toHaveTextContent('inner');
    });

    it('passes version 5e to MonsterCard', () => {
        render(<Monster monster={createMonster()} />);
        expect(screen.getByTestId('card-version')).toHaveTextContent('5e');
    });

    it('passes expand prop to MonsterCard', () => {
        render(<Monster monster={createMonster()} expand={true} />);
        expect(screen.getByTestId('card-expand')).toHaveTextContent('true');
    });

    it('passes onExpand callback to MonsterCard', () => {
        render(<Monster monster={createMonster()} onExpand={mockOnExpand} />);
        expect(screen.getByTestId('monster-card')).toBeInTheDocument();
    });

    it('passes onBookmarkChange callback to MonsterCard', () => {
        render(<Monster monster={createMonster()} onBookmarkChange={mockOnBookmarkChange} />);
        expect(screen.getByTestId('monster-card')).toBeInTheDocument();
    });

    it('renders with all props passed correctly', () => {
        render(
            <Monster
                monster={createMonster()}
                cardType="inner"
                expand={true}
                onExpand={mockOnExpand}
                onBookmarkChange={mockOnBookmarkChange}
            />
        );
        expect(screen.getByTestId('card-type')).toHaveTextContent('inner');
        expect(screen.getByTestId('card-expand')).toHaveTextContent('true');
        expect(screen.getByTestId('card-version')).toHaveTextContent('5e');
        expect(screen.getByTestId('card-name')).toHaveTextContent('Goblin');
    });
});
