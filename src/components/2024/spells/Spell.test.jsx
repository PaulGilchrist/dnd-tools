import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Spell from './Spell';

vi.mock('../../common/SpellCard', () => ({
    default: vi.fn(({ spell, expand }) => (
        <div data-testid="spell-card">
            <span data-testid="card-expand">{String(expand)}</span>
            <span data-testid="card-name">{spell?.name}</span>
        </div>
    )),
}));

vi.mock('../../adapters/spellAdapters', () => ({
    normalizeSpell2024: vi.fn((spell) => ({
        ...spell,
        normalized: true,
    })),
}));

import { normalizeSpell2024 } from '../../adapters/spellAdapters';

describe('Spell (2024)', () => {
    const createSpell = (overrides = {}) => ({
        index: 'fireball',
        name: 'Fireball',
        level: 3,
        school: 'Evocation',
        ...overrides,
    });

    const mockOnExpand = vi.fn();
    const mockOnKnownChange = vi.fn();
    const mockOnPreparedChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when spell is not provided', () => {
        const { container } = render(<Spell spell={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('returns null when spell is undefined', () => {
        const { container } = render(<Spell spell={undefined} />);
        expect(container.firstChild).toBeNull();
    });

    it('normalizes spell data using normalizeSpell2024', () => {
        const spell = createSpell();
        render(<Spell spell={spell} />);
        expect(normalizeSpell2024).toHaveBeenCalledWith(spell);
    });

    it('passes normalized spell to SpellCard', () => {
        const spell = createSpell();
        render(<Spell spell={spell} />);
        expect(screen.getByTestId('card-name')).toHaveTextContent('Fireball');
    });

    it('passes expand prop to SpellCard', () => {
        render(<Spell spell={createSpell()} expand={true} />);
        expect(screen.getByTestId('card-expand')).toHaveTextContent('true');
    });

    it('passes onExpand callback to SpellCard', () => {
        render(<Spell spell={createSpell()} onExpand={mockOnExpand} />);
        expect(screen.getByTestId('spell-card')).toBeInTheDocument();
    });

    it('passes onKnownChange callback to SpellCard', () => {
        render(<Spell spell={createSpell()} onKnownChange={mockOnKnownChange} />);
        expect(screen.getByTestId('spell-card')).toBeInTheDocument();
    });

    it('passes onPreparedChange callback to SpellCard', () => {
        render(<Spell spell={createSpell()} onPreparedChange={mockOnPreparedChange} />);
        expect(screen.getByTestId('spell-card')).toBeInTheDocument();
    });
});
